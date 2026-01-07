# 通用注释规范

适用于所有语言的注释编写最佳实践。

---

## 必须添加注释的场景

| 场景 | 说明 | 优先级 |
|------|------|--------|
| 公共 API | 类、方法、接口的文档注释 | P0 |
| 复杂算法 | 算法思路、时间复杂度、空间复杂度 | P0 |
| 业务规则 | 非显而易见的业务逻辑 | P0 |
| TODO/FIXME | 待办事项、已知问题 | P1 |
| 魔法值 | 常量的含义说明 | P1 |
| 边界条件 | 特殊处理的原因 | P1 |

---

## 注释质量要求

### ✅ 好的注释

```java
/**
 * 计算订单折扣金额
 * 
 * 业务规则:
 * - 会员等级折扣: 普通(0%)、银卡(5%)、金卡(10%)、钻石(15%)
 * - 满减优惠: 满100减10，满200减30，满500减80
 * - 折扣叠加: 先计算会员折扣，再计算满减
 * 
 * @param order 订单对象
 * @param member 会员信息
 * @return 折扣金额（单位：分）
 * @throws IllegalArgumentException 订单金额为负数时抛出
 */
public long calculateDiscount(Order order, Member member) {
    // 步骤1: 计算会员等级折扣
    // 使用策略模式，根据会员等级获取折扣率
    double memberDiscount = getMemberDiscountRate(member.getLevel());
    
    // 步骤2: 计算满减优惠
    // 注意: 满减基于折扣后金额计算
    long afterMemberDiscount = (long) (order.getAmount() * (1 - memberDiscount));
    long fullReduction = calculateFullReduction(afterMemberDiscount);
    
    return (long) (order.getAmount() * memberDiscount) + fullReduction;
}
```

### ❌ 坏的注释

```java
// 重复代码内容
i++; // i 加 1

// 过时不更新
// 返回用户名（实际返回的是用户ID）
return user.getId();

// 被注释掉的代码
// String oldCode = doSomething();

// 无意义的占位
// TODO: 待实现
public void process() {
    throw new UnsupportedOperationException();
}
```

---

## 文档注释格式

### 类注释

```
/**
 * 类的职责描述（一句话概括）
 * 
 * 详细说明（可选）:
 * - 设计说明
 * - 使用场景
 * - 注意事项
 * 
 * @author 作者
 * @since 版本号
 * @see 相关类
 */
```

### 方法注释

```
/**
 * 方法功能描述（一句话概括）
 * 
 * 详细说明（可选）:
 * - 业务规则
 * - 算法说明
 * - 性能考虑
 * 
 * @param 参数名 参数说明
 * @return 返回值说明
 * @throws 异常类型 异常说明
 */
```

### 字段注释

```
/**
 * 字段说明
 * 
 * 取值范围/格式/约束（如有）
 */
private String fieldName;
```

---

## 行内注释规范

### 使用场景

```java
// 1. 解释"为什么"而非"是什么"
// 使用双重检查锁定，避免多线程下重复创建实例
if (instance == null) {
    synchronized (lock) {
        if (instance == null) {
            instance = new Singleton();
        }
    }
}

// 2. 标注边界条件
// 空列表返回空结果，避免后续 NPE
if (list == null || list.isEmpty()) {
    return Collections.emptyList();
}

// 3. 解释魔法值
// 30天 = 订单自动确认收货时间（业务规则 BR-001）
private static final int AUTO_CONFIRM_DAYS = 30;
```

### 格式规范

```yaml
行内注释:
  - 使用 // 而非 /* */
  - 与代码同行或上一行
  - 首字母大写（英文）
  - 不使用句号结尾（除非多句）

块注释:
  - 用于临时禁用代码（应尽快删除）
  - 用于多行说明
```

---

## TODO/FIXME 规范

### 格式

```java
// TODO(作者): 描述 [截止日期]
// TODO(zhangsan): 优化查询性能，使用缓存 [2025-01-15]

// FIXME(作者): 描述 [优先级]
// FIXME(lisi): 并发场景下可能出现数据不一致 [P1]
```

### 分类

| 标记 | 含义 | 处理优先级 |
|------|------|-----------|
| TODO | 待实现的功能 | 低 |
| FIXME | 已知的问题需要修复 | 高 |
| HACK | 临时解决方案 | 中 |
| XXX | 需要讨论的问题 | 中 |

---

## 各语言实现参考

| 语言 | 文档注释格式 | 详细文档 |
|------|-------------|---------|
| Java | JavaDoc | [java/comments.md](../java/comments.md) |
| Go | GoDoc | [go/comments.md](../go/comments.md) |
| TypeScript | TSDoc/JSDoc | [typescript/comments.md](../typescript/comments.md) |
| Python | Docstring | [python/comments.md](../python/comments.md) |

---

## 检查清单

- [ ] 所有公共 API 有文档注释
- [ ] 注释解释"为什么"而非"是什么"
- [ ] 复杂逻辑有说明
- [ ] 没有过时的注释
- [ ] 没有被注释掉的代码
- [ ] TODO/FIXME 有作者和日期
- [ ] 魔法值有说明
