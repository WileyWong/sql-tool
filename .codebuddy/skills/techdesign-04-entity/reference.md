# 实体设计参考

## DDD 核心概念速查

### 实体 vs 值对象
- **实体**：有唯一 ID，可变，独立生命周期
- **值对象**：无 ID，不可变，通过值判断相等

### 聚合设计
- **聚合根**：对外唯一接口，保证事务一致性
- **聚合边界**：一个事务只修改一个聚合
- **跨聚合**：通过 ID 引用，事件驱动最终一致性

### 充血模型 vs 贫血模型
- **充血**：业务逻辑在实体内（推荐）
- **贫血**：业务逻辑在 Service 层（避免）

---

## 技术栈参考

### Spring Boot 3 注解
```java
@Entity                          // 实体类
@Table(name = "user")            // 表名
@Id                              // 主键
@GeneratedValue                  // 自增
@Column(nullable = false)        // 字段约束
@Enumerated(EnumType.STRING)     // 枚举存储
@Embeddable                      // 值对象
@Embedded                        // 嵌入值对象
@OneToMany(cascade = ALL)        // 一对多
@CreatedDate                     // 创建时间
```

### 约束注解
```java
@Pattern(regexp = "...")         // 正则验证
@Email                           // 邮箱验证
@Min(0)                          // 最小值
@NotNull                         // 非空
```

---

## 常用模式

### 工厂方法
```java
public static Order create(Long userId, List<OrderItem> items) {
    // 验证 + 初始化 + 不变量检查
}
```

### 不变量保护
```java
private void validateInvariant() {
    if (totalAmount.compareTo(ZERO) <= 0) {
        throw new IllegalStateException("金额必须>0");
    }
}
```

### 值对象不可变
```java
public class Address {
    private final String city;  // final
    public Address(String city) { this.city = city; }
    // 无 setter
}
```

---

## 相关文档
- [Spring Boot 3](mdc:.codebuddy/spec/global/knowledge/stack/springboot3.md)
- [MyBatis-Plus](mdc:.codebuddy/spec/global/knowledge/stack/mybatis_plus.md)
- [MySQL](mdc:.codebuddy/spec/global/knowledge/stack/mysql.md)
