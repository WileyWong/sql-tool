# 通用可读性规范

适用于所有语言的代码可读性最佳实践。

---

## 可读性原则

| 原则 | 说明 |
|------|------|
| 清晰优于简洁 | 代码是写给人看的 |
| 一致性 | 风格统一 |
| 自解释 | 代码本身说明意图 |
| 简单直接 | 避免过度设计 |

---

## 代码格式

### 缩进和空格

```yaml
缩进:
  - 使用空格而非 Tab
  - 统一缩进宽度（2 或 4 空格）
  - 嵌套层级不超过 3-4 层

空格:
  - 运算符两侧加空格
  - 逗号后加空格
  - 冒号后加空格（对象）
  - 括号内不加空格
```

### 行长度

```yaml
限制:
  - 单行不超过 80-120 字符
  - 长语句合理换行
  - 换行后对齐

换行规则:
  - 在运算符前换行
  - 在逗号后换行
  - 保持逻辑完整
```

### 空行

```yaml
使用空行分隔:
  - 类的成员之间
  - 方法之间
  - 逻辑块之间
  - import 分组之间

避免:
  - 连续多个空行
  - 方法开头/结尾空行
  - 括号内的空行
```

---

## 代码结构

### 方法长度

```yaml
建议:
  - 单个方法不超过 20-30 行
  - 超过则考虑拆分

拆分原则:
  - 单一职责
  - 可复用性
  - 可测试性
```

### 嵌套深度

```yaml
限制:
  - 嵌套不超过 3-4 层

减少嵌套:
  - 提前返回（Guard Clause）
  - 提取方法
  - 使用多态替代条件
```

### 提前返回

```yaml
✅ 推荐:
  if (invalid) {
    return error;
  }
  // 正常逻辑

❌ 不推荐:
  if (valid) {
    // 很长的正常逻辑
  } else {
    return error;
  }
```

---

## 函数/方法设计

### 参数数量

```yaml
建议:
  - 参数不超过 3-4 个
  - 超过则使用对象封装

示例:
  ❌ createUser(name, email, phone, address, city, country)
  ✅ createUser(UserCreateRequest request)
```

### 返回值

```yaml
原则:
  - 返回类型明确
  - 避免返回 null（使用 Optional/Maybe）
  - 错误通过异常或 Result 类型返回

示例:
  ❌ User findUser(id) // 可能返回 null
  ✅ Optional<User> findUser(id)
  ✅ Result<User, Error> findUser(id)
```

### 副作用

```yaml
原则:
  - 函数尽量无副作用
  - 有副作用的函数命名要体现

示例:
  ✅ calculateTotal() // 无副作用，只计算
  ✅ saveUser() // 有副作用，命名体现
  ❌ getUser() // 名称暗示无副作用，但实际有
```

---

## 条件表达式

### 条件简化

```yaml
✅ 推荐:
  // 直接返回布尔表达式
  return age >= 18;
  
  // 使用三元运算符（简单情况）
  String status = isActive ? "启用" : "禁用";

❌ 不推荐:
  if (age >= 18) {
    return true;
  } else {
    return false;
  }
```

### 复杂条件

```yaml
✅ 推荐:
  // 提取为有意义的变量
  boolean isEligible = age >= 18 && hasPermission && isActive;
  if (isEligible) {
    // ...
  }
  
  // 或提取为方法
  if (isUserEligible(user)) {
    // ...
  }

❌ 不推荐:
  if (age >= 18 && hasPermission && isActive && !isBlocked && ...) {
    // ...
  }
```

### 避免否定条件

```yaml
✅ 推荐:
  if (isValid) {
    // 正常处理
  }

❌ 不推荐:
  if (!isInvalid) {
    // 双重否定，难以理解
  }
```

---

## 循环和迭代

### 使用高阶函数

```yaml
✅ 推荐:
  // 使用 map/filter/reduce
  users.filter(u => u.isActive)
       .map(u => u.name);

❌ 不推荐:
  // 手动循环
  List<String> names = new ArrayList<>();
  for (User u : users) {
    if (u.isActive()) {
      names.add(u.getName());
    }
  }
```

### 循环变量命名

```yaml
✅ 推荐:
  for (User user : users) { ... }
  for (Order order : orders) { ... }
  
  // 索引循环
  for (int i = 0; i < items.length; i++) { ... }

❌ 不推荐:
  for (User u : users) { ... }  // 单字母
  for (Object o : list) { ... } // 太通用
```

---

## 错误处理可读性

### 异常处理

```yaml
✅ 推荐:
  try {
    // 可能抛出异常的代码
  } catch (SpecificException e) {
    // 处理特定异常
    log.error("操作失败: {}", e.getMessage(), e);
    throw new BusinessException("操作失败", e);
  }

❌ 不推荐:
  try {
    // ...
  } catch (Exception e) {
    // 捕获所有异常
    e.printStackTrace(); // 不要用 printStackTrace
  }
```

### 错误处理分离

```yaml
✅ 推荐:
  // 错误处理与正常逻辑分离
  Result<User> result = findUser(id);
  if (result.isError()) {
    return handleError(result.getError());
  }
  User user = result.getValue();
  // 正常逻辑
```

---

## 代码组织

### 文件结构

```yaml
推荐顺序:
  1. 版权声明/许可证
  2. 包声明
  3. 导入语句（分组）
  4. 类/模块定义
     - 常量
     - 静态变量
     - 实例变量
     - 构造函数
     - 公共方法
     - 私有方法
```

### 导入分组

```yaml
分组顺序:
  1. 标准库
  2. 第三方库
  3. 本项目模块

示例:
  import java.util.*;
  import java.io.*;
  
  import org.springframework.*;
  import com.google.common.*;
  
  import com.myproject.service.*;
```

---

## 检查清单

- [ ] 代码格式统一
- [ ] 方法长度合理（< 30 行）
- [ ] 嵌套深度合理（< 4 层）
- [ ] 参数数量合理（< 4 个）
- [ ] 条件表达式简洁
- [ ] 使用提前返回
- [ ] 命名清晰有意义
- [ ] 适当使用空行分隔
- [ ] 导入语句有序分组
