# 示例 4: Java 8+ 典型错误审查

## 场景描述

审查使用 Java 8+ 特性的代码，识别常见陷阱。

---

## 4.1 Optional 误用

```java
// ❌ 错误 1: 不检查直接 get()
public String getUserName(Long userId) {
    Optional<User> user = userRepository.findById(userId);
    return user.get().getName();  // NoSuchElementException!
}

// ✅ 正确: 使用 orElseThrow
public String getUserName(Long userId) {
    return userRepository.findById(userId)
        .map(User::getName)
        .orElseThrow(() -> new NotFoundException("用户不存在: " + userId));
}

// ❌ 错误 2: Optional 作为字段
@Entity
public class User {
    private Optional<String> nickname;  // 不推荐!
}

// ✅ 正确: 普通字段 + getter 返回 Optional
@Entity
public class User {
    private String nickname;
    
    public Optional<String> getNickname() {
        return Optional.ofNullable(nickname);
    }
}

// ❌ 错误 3: isPresent() + get() 组合
public User findUser(Long id) {
    Optional<User> optional = userRepository.findById(id);
    if (optional.isPresent()) {
        return optional.get();
    }
    return null;
}

// ✅ 正确: 使用 orElse
public User findUser(Long id) {
    return userRepository.findById(id).orElse(null);
}
```

---

## 4.2 Stream 误用

```java
// ❌ 错误 1: 并行流滥用
public List<UserDTO> getUsers(List<Long> ids) {
    // 只有 10 条数据，并行流开销大于收益
    return ids.parallelStream()
        .map(id -> userRepository.findById(id))  // 数据库 IO，不适合并行
        .filter(Optional::isPresent)
        .map(Optional::get)
        .map(this::convertToDTO)
        .collect(Collectors.toList());
}

// ✅ 正确: 批量查询 + 顺序流
public List<UserDTO> getUsers(List<Long> ids) {
    List<User> users = userRepository.findByIdIn(ids);  // 批量查询
    return users.stream()
        .map(this::convertToDTO)
        .collect(Collectors.toList());
}

// ❌ 错误 2: Stream 中有副作用
public void processOrders(List<Order> orders) {
    List<String> processedIds = new ArrayList<>();
    orders.stream()
        .filter(Order::isPending)
        .forEach(order -> {
            processOrder(order);
            processedIds.add(order.getId());  // 副作用!
        });
}

// ✅ 正确: 使用 collect
public List<String> processOrders(List<Order> orders) {
    return orders.stream()
        .filter(Order::isPending)
        .peek(this::processOrder)  // 如果需要副作用
        .map(Order::getId)
        .collect(Collectors.toList());
}

// ❌ 错误 3: 多次消费 Stream
public void analyzeUsers(Stream<User> userStream) {
    long count = userStream.count();
    List<User> list = userStream.collect(Collectors.toList());  // IllegalStateException!
}

// ✅ 正确: 收集后再操作
public void analyzeUsers(List<User> users) {
    long count = users.size();
    // 或者使用 Supplier
}
```

---

## 4.3 BigDecimal 陷阱

```java
// ❌ 错误 1: double 构造器精度丢失
public BigDecimal calculatePrice(double price, int quantity) {
    BigDecimal unitPrice = new BigDecimal(price);  // 精度丢失!
    // price = 0.1 → 0.1000000000000000055511151231...
    return unitPrice.multiply(new BigDecimal(quantity));
}

// ✅ 正确: 字符串构造器
public BigDecimal calculatePrice(String price, int quantity) {
    BigDecimal unitPrice = new BigDecimal(price);  // 精确
    return unitPrice.multiply(BigDecimal.valueOf(quantity));
}

// ❌ 错误 2: 除法不指定精度
public BigDecimal calculateAverage(BigDecimal total, int count) {
    return total.divide(BigDecimal.valueOf(count));  // ArithmeticException!
}

// ✅ 正确: 指定精度和舍入模式
public BigDecimal calculateAverage(BigDecimal total, int count) {
    return total.divide(BigDecimal.valueOf(count), 2, RoundingMode.HALF_UP);
}

// ❌ 错误 3: equals 比较精度
public boolean isSamePrice(BigDecimal price1, BigDecimal price2) {
    return price1.equals(price2);  // "1.0".equals("1.00") = false!
}

// ✅ 正确: compareTo 比较
public boolean isSamePrice(BigDecimal price1, BigDecimal price2) {
    return price1.compareTo(price2) == 0;  // true
}
```

---

## 4.4 时间 API 陷阱

```java
// ❌ 错误 1: LocalDateTime 存储时间戳
@Entity
public class Order {
    private LocalDateTime createdAt;  // 无时区信息，跨时区有问题!
}

// ✅ 正确: 使用 Instant
@Entity
public class Order {
    private Instant createdAt;  // UTC 时间戳
    
    @PrePersist
    public void prePersist() {
        this.createdAt = Instant.now();
    }
}

// ❌ 错误 2: 时区转换错误
public String formatTime(Instant instant) {
    // 依赖系统默认时区，不同服务器结果不同!
    LocalDateTime local = LocalDateTime.ofInstant(instant, ZoneId.systemDefault());
    return local.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
}

// ✅ 正确: 明确指定时区
public String formatTime(Instant instant) {
    ZonedDateTime zoned = instant.atZone(ZoneId.of("Asia/Shanghai"));
    return zoned.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
}
```

---

## 审查要点

| 类别 | 检查项 |
|------|--------|
| Optional | 避免直接 `get()`，不作为字段，使用 `orElse`/`orElseThrow` |
| Stream | 避免并行流滥用，避免副作用，不重复消费 |
| BigDecimal | 使用字符串构造器，除法指定精度，使用 `compareTo` 比较 |
| 时间 API | 使用 `Instant` 存储时间戳，明确指定时区 |
