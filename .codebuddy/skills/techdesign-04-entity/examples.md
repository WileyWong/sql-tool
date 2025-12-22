# 实体设计示例

## 示例 1: 电商订单聚合

### 场景
设计订单系统，包含订单、订单项、用户、商品。

### 实体识别
```
- Order（订单）- 聚合根
- OrderItem（订单项）- 聚合内部
- User（用户）- 独立聚合
- Product（商品）- 独立聚合
```

### 实现

```java
// 聚合根
@Entity
public class Order {
    @Id private Long id;
    @Column(name = "user_id") private Long userId;  // ID 引用
    @OneToMany(cascade = ALL) private List<OrderItem> items;
    private OrderStatus status;
    private BigDecimal totalAmount;
    
    public static Order create(Long userId, List<OrderItem> items) {
        Order order = new Order();
        order.userId = userId;
        order.items = items;
        order.status = PENDING;
        order.calculateTotalAmount();
        order.validateInvariant();
        return order;
    }
    
    public void pay() {
        if (status != PENDING) throw new OrderException("状态不允许支付");
        this.status = PAID;
        validateInvariant();
    }
    
    private void validateInvariant() {
        if (totalAmount.compareTo(ZERO) <= 0) {
            throw new IllegalStateException("金额必须大于0");
        }
    }
}

// 聚合内部实体
@Entity
public class OrderItem {
    @Id private Long id;
    @Column(name = "product_id") private Long productId;  // ID 引用
    private BigDecimal price;
    private Integer quantity;
}
```

### 关键点
- 跨聚合用 ID 引用（userId、productId）
- 聚合内用对象引用（items）
- 充血模型（pay() 在 Order 内）
- 不变量保护（validateInvariant）

---

## 示例 2: 值对象设计

### 场景
地址信息在多个实体中使用，且不可变。

### 实现

```java
@Embeddable
public class Address {
    private final String province;
    private final String city;
    private final String district;
    
    public Address(String province, String city, String district) {
        this.province = province;
        this.city = city;
        this.district = district;
    }
    
    // 只有 getter，无 setter
    public String getProvince() { return province; }
    
    // 返回新对象，不修改自身
    public Address changeCity(String newCity) {
        return new Address(this.province, newCity, this.district);
    }
    
    @Override
    public boolean equals(Object o) {
        // 通过所有属性判断相等
    }
}

// 使用
@Entity
public class User {
    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "province", column = @Column(name = "addr_province"))
    })
    private Address address;
}
```

### 关键点
- 无 ID，不可变（final 字段）
- 无 setter，只有构造函数
- 通过值判断相等
- 使用 `@Embeddable` 嵌入
