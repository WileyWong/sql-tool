# 通用命名规范

适用于所有语言的命名最佳实践。

---

## 命名原则

| 原则 | 说明 |
|------|------|
| 清晰明确 | 名称能准确表达含义 |
| 一致性 | 同类事物使用相同命名风格 |
| 可读性 | 易于阅读和理解 |
| 可搜索 | 便于代码搜索 |
| 避免缩写 | 除非是广泛认知的缩写 |

---

## 命名风格

| 风格 | 格式 | 示例 | 适用场景 |
|------|------|------|---------|
| PascalCase | 首字母大写 | `UserService` | 类名、类型名 |
| camelCase | 首字母小写 | `getUserById` | 方法名、变量名 |
| snake_case | 下划线分隔 | `user_name` | Python 变量、数据库字段 |
| UPPER_SNAKE_CASE | 大写下划线 | `MAX_SIZE` | 常量 |
| kebab-case | 短横线分隔 | `user-profile` | URL、文件名 |

---

## 通用命名规则

### 类/类型命名

```yaml
规则:
  - 使用名词或名词短语
  - 使用 PascalCase
  - 避免缩写（除非广泛认知）

示例:
  ✅ UserService, OrderController, PaymentGateway
  ❌ UsrSvc, OrdCtrl, PayGw
```

### 方法/函数命名

```yaml
规则:
  - 使用动词或动词短语
  - 使用 camelCase（Java/JS）或 snake_case（Python/Go）
  - 表达行为和意图

常用动词:
  获取: get, fetch, find, query, retrieve
  创建: create, add, insert, save, register
  更新: update, modify, change, set
  删除: delete, remove, clear, destroy
  检查: is, has, can, should, check, validate
  转换: to, convert, transform, parse, format

示例:
  ✅ getUserById, createOrder, isValidEmail
  ❌ user, order, email
```

### 变量命名

```yaml
规则:
  - 使用名词
  - 表达变量的含义
  - 布尔变量使用 is/has/can/should 前缀

示例:
  ✅ userName, orderList, isActive, hasPermission
  ❌ u, list, flag, temp
```

### 常量命名

```yaml
规则:
  - 使用 UPPER_SNAKE_CASE
  - 表达常量的含义
  - 避免魔法值

示例:
  ✅ MAX_RETRY_COUNT = 3
  ✅ DEFAULT_PAGE_SIZE = 20
  ❌ 3, 20（魔法值）
```

---

## 特定场景命名

### 集合/数组

```yaml
规则:
  - 使用复数形式
  - 或使用 List/Set/Map 后缀

示例:
  ✅ users, orderList, userMap
  ❌ user, orderData, userData
```

### 布尔值

```yaml
规则:
  - 使用 is/has/can/should/will 前缀
  - 表达肯定含义

示例:
  ✅ isActive, hasPermission, canEdit, shouldRetry
  ❌ active, permission, edit, retry
```

### 回调/处理器

```yaml
规则:
  - 使用 on/handle 前缀
  - 或使用 Callback/Handler/Listener 后缀

示例:
  ✅ onClick, handleSubmit, onUserCreated
  ✅ ClickHandler, SubmitCallback, UserListener
```

### 异步操作

```yaml
规则:
  - 使用 async 前缀（可选）
  - 返回 Promise/Future 的方法名表达异步性

示例:
  ✅ fetchUsers, loadData, submitAsync
  ✅ getUsersAsync（明确异步）
```

---

## 避免的命名

### 避免的词汇

| 避免 | 原因 | 替代 |
|------|------|------|
| data | 太通用 | 具体类型，如 userData |
| info | 太通用 | 具体内容，如 userProfile |
| temp | 临时变量 | 具体含义，如 cachedValue |
| flag | 不明确 | 具体状态，如 isEnabled |
| result | 太通用 | 具体结果，如 queryResult |

### 避免的模式

```yaml
❌ 单字母变量（除循环变量）:
   a, b, x, y

❌ 无意义的数字后缀:
   user1, user2, data1, data2

❌ 类型前缀（匈牙利命名法）:
   strName, intCount, boolFlag

❌ 过长的名称:
   getUserByIdAndFilterByStatusAndSortByCreateTime
```

---

## 缩写规则

### 允许的缩写

```yaml
广泛认知的缩写:
  - id (identifier)
  - url (uniform resource locator)
  - http/https
  - api (application programming interface)
  - db (database)
  - io (input/output)
  - os (operating system)
  - ui (user interface)
```

### 缩写使用规则

```yaml
规则:
  - 缩写词全大写或全小写，保持一致
  - 在变量名中，缩写词遵循命名风格

示例:
  PascalCase: HttpClient, XmlParser, UserId
  camelCase: httpClient, xmlParser, userId
  
  ❌ HTTPClient, XMLParser（不一致）
```

---

## 各语言特定规范

| 语言 | 类名 | 方法名 | 变量名 | 常量 | 详细文档 |
|------|------|--------|--------|------|---------|
| Java | PascalCase | camelCase | camelCase | UPPER_SNAKE | [java/naming.md](../java/naming.md) |
| Go | PascalCase | camelCase | camelCase | PascalCase | [go/naming.md](../go/naming.md) |
| TypeScript | PascalCase | camelCase | camelCase | UPPER_SNAKE | [typescript/naming.md](../typescript/naming.md) |
| Groovy | PascalCase | camelCase | camelCase | UPPER_SNAKE | [groovy/naming.md](../groovy/naming.md) |

---

## 检查清单

- [ ] 名称清晰表达含义
- [ ] 遵循语言命名风格
- [ ] 没有魔法值
- [ ] 没有无意义的名称
- [ ] 缩写使用一致
- [ ] 布尔变量有正确前缀
- [ ] 集合使用复数形式
