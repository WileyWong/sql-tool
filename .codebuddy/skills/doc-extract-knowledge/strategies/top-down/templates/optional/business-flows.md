# 核心业务流程

> **项目**: {{PROJECT_NAME}}  
> **生成时间**: {{SCAN_DATE}}

---

## 一、流程概览

| 流程名称 | 涉及模块 | 复杂度 | 关键接口 |
|---------|---------|--------|---------|
| 用户注册 | 用户、邮件 | 中 | POST /api/users/register |
| 订单创建 | 订单、库存、支付 | 高 | POST /api/orders |
| 支付回调 | 支付、订单、通知 | 高 | POST /api/payment/callback |

---

## 二、详细流程

### 用户注册流程

#### 调用链
```
UserController.register()
  → UserService.createUser()
    → UserMapper.selectByUsername()  // 检查用户名
    → UserMapper.insert()            // 插入用户
    → EmailService.sendWelcome()     // 发送邮件
```

#### 流程步骤
| 步骤 | 组件 | 方法 | 说明 |
|------|------|------|------|
| 1 | UserController | register() | 接收注册请求 |
| 2 | UserService | createUser() | 业务逻辑处理 |
| 3 | UserMapper | selectByUsername() | 检查用户名是否存在 |
| 4 | UserMapper | insert() | 插入用户记录 |
| 5 | EmailService | sendWelcome() | 发送欢迎邮件 |

#### 事务边界
- **事务范围**: UserService.createUser()
- **隔离级别**: READ_COMMITTED
- **回滚条件**: Exception.class

#### 异常处理
| 异常 | 处理方式 | 返回码 |
|------|---------|--------|
| 用户名已存在 | 抛出 BusinessException | 20001 |
| 邮件发送失败 | 记录日志，不影响注册 | - |

---

### 订单创建流程

#### 调用链
```
OrderController.create()
  → OrderService.createOrder()
    → UserService.getUser()         // 获取用户
    → ProductService.checkStock()   // 检查库存
    → OrderMapper.insert()          // 创建订单
    → ProductService.reduceStock()  // 扣减库存
    → PaymentService.initPayment()  // 初始化支付
```

#### 流程步骤
| 步骤 | 组件 | 方法 | 说明 |
|------|------|------|------|
| 1 | OrderController | create() | 接收创建请求 |
| 2 | OrderService | createOrder() | 业务逻辑处理 |
| 3 | UserService | getUser() | 获取用户信息 |
| 4 | ProductService | checkStock() | 检查库存是否充足 |
| 5 | OrderMapper | insert() | 创建订单记录 |
| 6 | ProductService | reduceStock() | 扣减商品库存 |
| 7 | PaymentService | initPayment() | 初始化支付信息 |

#### 事务边界
- **事务范围**: OrderService.createOrder()
- **传播行为**: REQUIRED
- **回滚条件**: Exception.class

---

## 📚 相关文档

- [HTTP API索引](../service-api-http.md)
- [业务逻辑层索引](../business-logic.md)

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| {{SCAN_DATE}} | AI自动生成 | 初始创建文档 | v1.0 |
