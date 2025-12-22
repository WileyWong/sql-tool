# 示例 2: 基于业务代码生成单元测试（whitebox 策略）

本示例展示如何基于业务代码进行白盒分析并生成单元测试。

## 输入：Service 代码

```java
@Service
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Transactional
    public OrderDTO createOrder(CreateOrderRequest request) {
        // 验证商品存在
        Product product = productRepository.findById(request.getProductId())
            .orElseThrow(() -> new ResourceNotFoundException("商品不存在"));
        
        // 验证库存
        if (product.getStock() < request.getQuantity()) {
            throw new BusinessException("库存不足");
        }
        
        // 计算金额
        BigDecimal totalAmount = product.getPrice()
            .multiply(BigDecimal.valueOf(request.getQuantity()));
        
        // 创建订单
        Order order = new Order();
        order.setProductId(request.getProductId());
        order.setQuantity(request.getQuantity());
        order.setTotalAmount(totalAmount);
        order.setStatus(OrderStatus.PENDING);
        
        // 扣减库存
        product.setStock(product.getStock() - request.getQuantity());
        productRepository.save(product);
        
        Order savedOrder = orderRepository.save(order);
        return OrderMapper.toDTO(savedOrder);
    }
}
```

## 步骤 0: 输入判断

```yaml
输入类型: 代码文件
代码类型: 业务代码
判断依据:
  - 包含 @Service 注解
  - 文件名为 OrderService.java
选择策略: design-test-case/whitebox
测试类型: 单元测试（Mock 隔离）
```

## 步骤 1: 生成测试用例设计文档（白盒分析）

```markdown
# OrderService.createOrder 测试用例设计

## 代码分析

### 业务分支
1. 商品存在 → 继续
2. 商品不存在 → 抛出 ResourceNotFoundException
3. 库存充足 → 继续
4. 库存不足 → 抛出 BusinessException
5. 正常创建订单 → 返回 OrderDTO

### 关键验证点
- 商品存在性验证
- 库存数量验证
- 金额计算正确性
- 库存扣减正确性
- 订单状态设置

## 测试用例

### TC-ORDER-001: 创建订单-正常流程

**Mock 设置**:
- productRepository.findById(1L) → 返回 Product(id=1, price=100, stock=10)
- orderRepository.save(any) → 返回带 ID 的 Order

**输入**:
- productId: 1
- quantity: 2

**预期结果**:
- 返回 OrderDTO
- totalAmount = 200
- status = PENDING
- 调用 productRepository.save() 保存扣减后的库存
- 调用 orderRepository.save() 保存订单

---

### TC-ORDER-002: 创建订单-商品不存在

**Mock 设置**:
- productRepository.findById(999L) → 返回 Optional.empty()

**输入**:
- productId: 999
- quantity: 1

**预期结果**:
- 抛出 ResourceNotFoundException
- 消息包含"商品不存在"
- 不调用 orderRepository.save()

---

### TC-ORDER-003: 创建订单-库存不足

**Mock 设置**:
- productRepository.findById(1L) → 返回 Product(id=1, stock=5)

**输入**:
- productId: 1
- quantity: 10

**预期结果**:
- 抛出 BusinessException
- 消息包含"库存不足"
- 不调用 orderRepository.save()
```

---

## ✅ 检查点1: 测试用例完整性验证

```yaml
检查点1验证结果:

结构完整性: ✅ 通过
  - [x] 包含代码分析（业务分支、关键验证点）
  - [x] 包含测试用例列表
  - [x] 包含 Mock 设置说明

用例规范性: ✅ 通过
  - [x] 用例 ID 唯一 (TC-ORDER-001 ~ TC-ORDER-003)
  - [x] 包含 Mock 设置
  - [x] 包含输入数据
  - [x] 包含预期结果

覆盖完整性: ✅ 通过
  - [x] 正常流程覆盖 (TC-ORDER-001)
  - [x] 异常场景覆盖 (TC-ORDER-002, TC-ORDER-003)
  - [x] 业务规则覆盖（库存验证、金额计算）

可执行性: ✅ 通过
  - [x] Mock 设置明确
  - [x] 无需清理（单元测试）

检查点1结论: ✅ 通过，可以进入步骤2
```

---

## 步骤 2: 生成单元测试代码

```java
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {
    
    @Mock
    private OrderRepository orderRepository;
    
    @Mock
    private ProductRepository productRepository;
    
    @InjectMocks
    private OrderService orderService;
    
    // TC-ORDER-001: 创建订单-正常流程
    @Test
    void createOrder_ValidRequest_ReturnsOrderDTO() {
        // Arrange
        Product product = new Product();
        product.setId(1L);
        product.setPrice(new BigDecimal("100"));
        product.setStock(10);
        
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order order = invocation.getArgument(0);
            order.setId(1L);
            return order;
        });
        
        CreateOrderRequest request = new CreateOrderRequest();
        request.setProductId(1L);
        request.setQuantity(2);
        
        // Act
        OrderDTO result = orderService.createOrder(request);
        
        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getTotalAmount()).isEqualByComparingTo(new BigDecimal("200"));
        assertThat(result.getStatus()).isEqualTo(OrderStatus.PENDING);
        
        // 验证库存扣减
        verify(productRepository).save(argThat(p -> p.getStock() == 8));
        verify(orderRepository).save(any(Order.class));
    }
    
    // TC-ORDER-002: 创建订单-商品不存在
    @Test
    void createOrder_ProductNotFound_ThrowsException() {
        // Arrange
        when(productRepository.findById(999L)).thenReturn(Optional.empty());
        
        CreateOrderRequest request = new CreateOrderRequest();
        request.setProductId(999L);
        request.setQuantity(1);
        
        // Act & Assert
        assertThatThrownBy(() -> orderService.createOrder(request))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessageContaining("商品不存在");
        
        verify(orderRepository, never()).save(any());
    }
    
    // TC-ORDER-003: 创建订单-库存不足
    @Test
    void createOrder_InsufficientStock_ThrowsException() {
        // Arrange
        Product product = new Product();
        product.setId(1L);
        product.setStock(5);
        
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        
        CreateOrderRequest request = new CreateOrderRequest();
        request.setProductId(1L);
        request.setQuantity(10);
        
        // Act & Assert
        assertThatThrownBy(() -> orderService.createOrder(request))
            .isInstanceOf(BusinessException.class)
            .hasMessageContaining("库存不足");
        
        verify(orderRepository, never()).save(any());
    }
}
```

---

## ✅ 检查点2: 代码完整性验证

```yaml
检查点2验证结果:

代码完整性: ✅ 通过
  - [x] 所有测试方法已生成（3个测试方法）
  - [x] 所有 import 语句完整
  - [x] Mock 注解正确配置
  - [x] 无需清理代码（单元测试）

语法检查: ✅ 通过
  - [x] 无 Java 语法错误
  - [x] 括号匹配正确
  - [x] 注解使用正确

编译检查: ✅ 通过
  执行命令: mvn test-compile
  结果: BUILD SUCCESS
  - [x] 无编译错误

规范检查: ✅ 通过
  - [x] 测试方法命名规范
  - [x] 遵循 AAA 模式
  - [x] Mock 配置正确
  - [x] 验证交互正确

检查点2结论: ✅ 通过，可以进入步骤3
```

---

## 步骤 3: 执行测试

```bash
mvn test -Dtest=OrderServiceTest
```

---

## ✅ 检查点3: 测试报告输出

```markdown
# 测试执行报告

## 基本信息

| 属性 | 值 |
|------|-----|
| **执行时间** | 2024-01-15 15:00:12 |
| **测试环境** | 开发环境 |
| **测试范围** | 订单服务 (OrderServiceTest) |
| **测试类型** | 单元测试 |

## 测试统计

| 指标 | 数值 | 百分比 |
|------|------|--------|
| 总用例数 | 3 | 100% |
| ✅ 通过 | 3 | 100% |
| ❌ 失败 | 0 | 0% |
| ⏭️ 跳过 | 0 | 0% |
| 执行耗时 | 0.8s | - |

## 详细结果

### 通过的测试

- ✅ `createOrder_ValidRequest_ReturnsOrderDTO` (0.3s)
- ✅ `createOrder_ProductNotFound_ThrowsException` (0.2s)
- ✅ `createOrder_InsufficientStock_ThrowsException` (0.2s)

### 失败的测试

无

## 总结

### 测试结论

**✅ 通过** - 3 个测试用例全部通过，通过率 100%

### 主要问题

无

### 风险评估

**低** - 所有核心业务逻辑测试通过

### 后续建议

1. 考虑添加边界值测试（库存刚好等于购买数量）
2. 添加金额计算精度测试
3. 添加并发场景测试（可选）
```

---

## 步骤 4: 清理

**单元测试使用 Mock，无需清理，流程结束。**
