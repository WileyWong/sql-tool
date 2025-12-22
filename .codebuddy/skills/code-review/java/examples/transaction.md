# 示例 5: Spring Boot 事务失效审查

## 场景描述

审查 Spring Boot 项目中的事务管理问题。

---

## 5.1 同类方法调用导致事务失效

```java
// ❌ 问题代码
@Service
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    public void createOrderWithItems(CreateOrderRequest request) {
        // 创建订单
        Order order = new Order();
        order.setUserId(request.getUserId());
        orderRepository.save(order);
        
        // 调用本类方法，事务不生效!
        this.createOrderItems(order.getId(), request.getItems());
    }
    
    @Transactional
    public void createOrderItems(Long orderId, List<OrderItemDTO> items) {
        for (OrderItemDTO item : items) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrderId(orderId);
            orderItem.setProductId(item.getProductId());
            orderItem.setQuantity(item.getQuantity());
            orderItemRepository.save(orderItem);
            
            // 如果这里抛异常，订单项不会回滚!
            inventoryService.deductStock(item.getProductId(), item.getQuantity());
        }
    }
}
```

**问题分析**：
- P0 🔴 `createOrderItems` 的 `@Transactional` 不生效
- 原因：`this.createOrderItems()` 是直接方法调用，绕过了 Spring AOP 代理

```java
// ✅ 修复后代码
@Service
@RequiredArgsConstructor
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final InventoryService inventoryService;
    
    @Lazy
    @Autowired
    private OrderService self;  // 注入自身代理
    
    public void createOrderWithItems(CreateOrderRequest request) {
        // 通过代理调用，事务生效
        self.createOrderTransaction(request);
    }
    
    @Transactional(rollbackFor = Exception.class)
    public void createOrderTransaction(CreateOrderRequest request) {
        // 创建订单
        Order order = new Order();
        order.setUserId(request.getUserId());
        orderRepository.save(order);
        
        // 创建订单项
        for (OrderItemDTO item : request.getItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrderId(order.getId());
            orderItem.setProductId(item.getProductId());
            orderItem.setQuantity(item.getQuantity());
            orderItemRepository.save(orderItem);
            
            // 扣减库存，如果失败整个事务回滚
            inventoryService.deductStock(item.getProductId(), item.getQuantity());
        }
    }
}
```

---

## 5.2 异常捕获导致事务不回滚

```java
// ❌ 问题代码
@Service
public class PaymentService {
    
    @Transactional
    public PaymentResult processPayment(PaymentRequest request) {
        try {
            // 保存支付记录
            Payment payment = new Payment();
            payment.setOrderId(request.getOrderId());
            payment.setAmount(request.getAmount());
            payment.setStatus(PaymentStatus.PENDING);
            paymentRepository.save(payment);
            
            // 调用第三方支付
            ThirdPartyResult result = thirdPartyPaymentGateway.pay(request);
            
            if (!result.isSuccess()) {
                payment.setStatus(PaymentStatus.FAILED);
                paymentRepository.save(payment);
                return PaymentResult.fail(result.getErrorMessage());
            }
            
            payment.setStatus(PaymentStatus.SUCCESS);
            payment.setTransactionId(result.getTransactionId());
            paymentRepository.save(payment);
            
            return PaymentResult.success(payment);
            
        } catch (Exception e) {
            log.error("支付处理失败", e);
            // 吞掉异常，事务不回滚!
            return PaymentResult.fail("支付失败，请稍后重试");
        }
    }
}
```

```java
// ✅ 修复后代码
@Service
@Slf4j
public class PaymentService {
    
    @Transactional(rollbackFor = Exception.class)
    public PaymentResult processPayment(PaymentRequest request) {
        // 保存支付记录
        Payment payment = new Payment();
        payment.setOrderId(request.getOrderId());
        payment.setAmount(request.getAmount());
        payment.setStatus(PaymentStatus.PENDING);
        paymentRepository.save(payment);
        
        try {
            // 调用第三方支付
            ThirdPartyResult result = thirdPartyPaymentGateway.pay(request);
            
            if (!result.isSuccess()) {
                // 业务失败，更新状态但不回滚
                payment.setStatus(PaymentStatus.FAILED);
                payment.setErrorMessage(result.getErrorMessage());
                paymentRepository.save(payment);
                return PaymentResult.fail(result.getErrorMessage());
            }
            
            payment.setStatus(PaymentStatus.SUCCESS);
            payment.setTransactionId(result.getTransactionId());
            paymentRepository.save(payment);
            
            return PaymentResult.success(payment);
            
        } catch (PaymentGatewayException e) {
            // 网关异常，记录日志并重新抛出，触发回滚
            log.error("支付网关异常，订单: {}", request.getOrderId(), e);
            throw new PaymentException("支付网关异常，请稍后重试", e);
        }
    }
}
```

---

## 审查要点

| 问题类型 | 原因 | 解决方案 |
|---------|------|---------|
| 同类方法调用 | 绕过 AOP 代理 | 注入自身代理 `@Lazy @Autowired private XxxService self` |
| 异常被捕获 | 异常未抛出，Spring 不知道需要回滚 | 捕获后重新抛出异常 |
| 默认只回滚 RuntimeException | `@Transactional` 默认配置 | 使用 `rollbackFor = Exception.class` |
| private 方法 | AOP 无法代理 private 方法 | 改为 public 方法 |
| final 方法 | CGLIB 无法代理 final 方法 | 移除 final 修饰符 |
