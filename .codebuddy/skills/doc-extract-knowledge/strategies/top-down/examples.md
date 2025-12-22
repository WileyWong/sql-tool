# 使用示例

## 完整流程示例

**输入**: 为这个 Spring Boot 项目生成知识库

**输出流程**:
```
1. [扫描代码] 统计: Interface 3个, Abstract 2个, Controller 5个, Service 12个, Mapper 8个...
2. [生成 README.md] 包含占位链接
3. [询问] "README.md 已生成。选择: 1) 继续 2) 优化"
4. [用户选1] 生成 interface.md
5. [询问] "第1章已生成。选择: 1) 继续 2) 优化"
6. [用户选1] 生成 abstract.md
7. [询问] "第2章已生成。选择: 1) 继续 2) 优化"
8. ... 重复直到完成
```

---

## Interface 记录示例

**输入**: IUserService.java 文件

**输出**:
```markdown
## IUserService

**类路径**: `com.example.service.IUserService`  
**代码行数**: 28 行（SLOC）

| 方法签名 | 参数 | 返回值 | 功能 |
|---------|------|--------|------|
| getUserById(Long id) | id-用户ID | UserVO | 查询用户 |
| createUser(UserDTO dto) | dto-用户信息 | Long | 创建用户 |

**实现类**: `UserServiceImpl`
```

---

## Abstract 记录示例

**输入**: AbstractBaseService.java 文件

**输出**:
```markdown
## AbstractBaseService

**类路径**: `com.example.service.AbstractBaseService`  
**代码行数**: 85 行（SLOC）  
**泛型参数**: `<T extends BaseEntity, ID extends Serializable>`

### 抽象方法（子类必须实现）
| 方法签名 | 返回值 | 说明 |
|---------|--------|------|
| getMapper() | BaseMapper<T> | 返回对应的 Mapper 实例 |

### 具体方法（子类继承）
| 方法签名 | 参数 | 返回值 | 功能 |
|---------|------|--------|------|
| getById(ID id) | id | T | 根据ID查询 |
| save(T entity) | entity | void | 保存实体 |

**子类**: `UserServiceImpl`, `OrderServiceImpl`, `ProductServiceImpl`
```

---

## Service 记录示例（完整格式）

**输入**: UserServiceImpl.java 文件

**输出**:
```markdown
## UserServiceImpl - 用户服务

**类路径**: `com.example.service.impl.UserServiceImpl`  
**代码行数**: 156 行（SLOC）  
**继承**: `extends AbstractBaseService<User, Long>`  
**实现**: `implements UserService`  
**类注解**: `@Service`, `@Slf4j`, `@RequiredArgsConstructor`

#### 依赖注入
| 依赖 | 类型 | 用途 |
|------|------|------|
| userMapper | UserMapper | 用户数据访问 |
| passwordEncoder | PasswordEncoder | 密码加密 |
| redisTemplate | RedisTemplate | 缓存操作 |

#### 方法列表
| 方法签名 | 参数 | 返回值 | 功能 | 调用链 |
|---------|------|--------|------|--------|
| getUserById(Long id) | id-用户ID | UserVO | 查询用户 | → userMapper.selectById() → UserConverter.toVO() |
| createUser(UserDTO dto) | dto-用户信息 | Long | 创建用户 | → passwordEncoder.encode() → userMapper.insert() |

**事务注解**: `@Transactional(rollbackFor = Exception.class)`

#### 被引用
| 引用者 | 引用方式 | 用途 |
|--------|----------|------|
| UserController | 依赖注入 | 业务调用 |
| OrderService | 依赖注入 | 跨服务调用 |
```

---

## 旧格式 vs 新格式对比

### ❌ 旧格式（缺少关键信息）
```markdown
## UserService

**类路径**: `com.example.service.UserService`  
**代码行数**: 156 行（SLOC）

| 方法签名 | 参数 | 返回值 | 功能 |
|---------|------|--------|------|
| getUserById(Long id) | id-用户ID | UserVO | 查询用户 |

**依赖注入**: `UserMapper`, `PasswordEncoder`
```

### ✅ 新格式（完整信息）
```markdown
## UserServiceImpl - 用户服务

**类路径**: `com.example.service.impl.UserServiceImpl`  
**代码行数**: 156 行（SLOC）  
**继承**: `extends AbstractBaseService<User, Long>`  
**实现**: `implements UserService`  
**类注解**: `@Service`, `@Slf4j`, `@RequiredArgsConstructor`

#### 依赖注入
| 依赖 | 类型 | 用途 |
|------|------|------|
| userMapper | UserMapper | 用户数据访问 |

#### 方法列表
| 方法签名 | 参数 | 返回值 | 功能 | 调用链 |
|---------|------|--------|------|--------|
| getUserById(Long id) | id-用户ID | UserVO | 查询用户 | → userMapper.selectById() |

#### 被引用
| 引用者 | 引用方式 | 用途 |
|--------|----------|------|
| UserController | 依赖注入 | 业务调用 |
```

---

## Exception 记录示例

**输入**: BusinessException.java 文件

**输出**:
```markdown
## BusinessException

**类路径**: `com.example.exception.BusinessException`  
**代码行数**: 45 行（SLOC）  
**继承**: `RuntimeException`

### 自定义字段
| 字段 | 类型 | 说明 |
|------|------|------|
| code | Integer | 业务错误码 |
| data | Object | 附加数据 |

### 构造方法
| 构造方法 | 说明 |
|----------|------|
| BusinessException(String message) | 仅消息 |
| BusinessException(Integer code, String message) | 错误码+消息 |
```

---

## Enum 记录示例

**输入**: OrderStatus.java 文件

**输出**:
```markdown
## OrderStatus

**类路径**: `com.example.enums.OrderStatus`  
**代码行数**: 32 行（SLOC）

### 枚举值列表
| 枚举值 | code | description | 说明 |
|--------|------|-------------|------|
| PENDING | 0 | 待支付 | 订单创建后的初始状态 |
| PAID | 1 | 已支付 | 支付成功 |
| SHIPPED | 2 | 已发货 | 商家已发货 |
| COMPLETED | 3 | 已完成 | 用户确认收货 |
| CANCELLED | 4 | 已取消 | 订单取消 |

### 自定义方法
| 方法签名 | 参数 | 返回值 | 功能 |
|---------|------|--------|------|
| getByCode(Integer code) | code | OrderStatus | 根据状态码获取枚举值 |
```

---

## Other（兜底）记录示例

**输入**: CustomValidator.java 文件（无法匹配任何标准分类）

**输出**（在 `other.md` 中）:
```markdown
## CustomValidator - 自定义验证器

**类路径**: `com.example.validator.CustomValidator`  
**代码行数**: 68 行（SLOC）  
**继承**: 无  
**实现**: 无  
**类注解**: `@Component`

#### 依赖注入
| 依赖 | 类型 | 用途 |
|------|------|------|
| userMapper | UserMapper | 验证用户是否存在 |

#### 方法列表
| 方法签名 | 参数 | 返回值 | 功能 | 调用链 |
|---------|------|--------|------|--------|
| validateUsername(String username) | username-用户名 | boolean | 验证用户名格式 | - |
| checkUserExists(Long userId) | userId-用户ID | boolean | 检查用户是否存在 | → userMapper.selectById() |

#### 被引用
| 引用者 | 引用方式 | 用途 |
|--------|----------|------|
| UserService | 依赖注入 | 创建用户前验证 |
```

---

## 询问交互示例

**示例 1: 继续**
```
AI: 第3章(ORM映射器索引)已生成。选择: 1) 继续 2) 优化
用户: 1
AI: [生成第4章]
```

**示例 2: 优化**
```
AI: 第3章(ORM映射器索引)已生成。选择: 1) 继续 2) 优化
用户: 2，增加方法注释说明
AI: [优化第3章] 已完成。选择: 1) 继续 2) 继续优化
```

---

## 错误 vs 正确

### ❌ 综合归档
```markdown
## 其他 Service
- OrderService - 订单服务
- ProductService - 产品服务
```

### ✅ 独立记录
```markdown
## OrderService

**类路径**: `com.example.service.OrderService`  
**代码行数**: 120 行（SLOC）

[方法表格]

## ProductService

**类路径**: `com.example.service.ProductService`  
**代码行数**: 98 行（SLOC）

[方法表格]
```

### ❌ 按目录名识别
```
com.xxx.controller.UserService.java → service-api-http.md
```

### ✅ 按注解识别
```
com.xxx.controller.UserService.java (含 @Service) → business-logic.md
```

### ❌ 缺少代码行数
```markdown
## UserService
**类路径**: `com.example.service.UserService`
```

### ✅ 包含代码行数
```markdown
## UserService
**类路径**: `com.example.service.UserService`  
**代码行数**: 156 行（SLOC）
```

---

## 扩展文档询问示例

**核心文档完成后**:
```
AI: ✅ 19 个核心文档已全部生成完成。

是否需要生成扩展文档？扩展文档包括：
- directory-structure.md (目录结构)
- spring-configuration.md (Spring配置)
- business-flows.md (业务流程)
- api-contracts.md (API契约)
- interceptors-aspects.md (拦截器切面)
- security-auth.md (安全认证)
- database-structure.md (数据库结构)
- environment-config.md (环境配置)
- third-party-interfaces.md (第三方接口)
- third-party-components.md (第三方组件)

请选择:
1) 生成全部扩展文档
2) 选择性生成（请指定文档名）
3) 跳过，完成知识库生成

用户: 1
AI: [依次生成10个扩展文档到 extra/ 目录]
```

**选择性生成**:
```
用户: 2，只要 database-structure 和 security-auth
AI: [生成 extra/database-structure.md 和 extra/security-auth.md]
```
