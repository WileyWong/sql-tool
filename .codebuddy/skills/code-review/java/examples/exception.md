# 示例 2: 异常处理审查

## 场景描述

审查支付服务的异常处理逻辑。

## 代码示例

```java
// ❌ 错误：捕获异常但不处理
@Service
public class PaymentService {
    
    public void processPayment(PaymentRequest request) {
        try {
            // 调用支付网关
            paymentGateway.pay(request);
        } catch (Exception e) {
            // 吞掉异常，不抛出也不记录
        }
    }
}
```

## 改进建议

```java
// ✅ 正确：正确处理异常
@Service
@Slf4j
public class PaymentService {
    
    /**
     * 处理支付
     * 
     * @param request 支付请求
     * @throws PaymentException 如果支付失败
     */
    @Transactional(rollbackFor = Exception.class)
    public void processPayment(PaymentRequest request) {
        log.info("开始处理支付，订单号: {}", request.getOrderId());
        
        try {
            // 调用支付网关
            PaymentResult result = paymentGateway.pay(request);
            
            if (!result.isSuccess()) {
                log.error("支付失败，订单号: {}, 错误: {}", 
                    request.getOrderId(), result.getErrorMessage());
                throw new PaymentException(result.getErrorCode(), result.getErrorMessage());
            }
            
            log.info("支付成功，订单号: {}, 交易号: {}", 
                request.getOrderId(), result.getTransactionId());
                
        } catch (PaymentGatewayException e) {
            // 支付网关异常
            log.error("支付网关异常，订单号: {}", request.getOrderId(), e);
            throw new PaymentException("支付网关异常，请稍后重试", e);
        } catch (Exception e) {
            // 其他未预期异常
            log.error("支付处理失败，订单号: {}", request.getOrderId(), e);
            throw new PaymentException("支付失败，请联系客服", e);
        }
    }
}
```

## 审查要点

| 检查项 | 说明 |
|--------|------|
| 不吞掉异常 | 捕获的异常必须处理（记录日志或重新抛出） |
| 异常分类处理 | 区分业务异常和系统异常 |
| 日志记录 | 关键操作记录日志，包含上下文信息 |
| 事务控制 | 使用 `rollbackFor = Exception.class` 确保回滚 |
