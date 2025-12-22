# 白盒测试用例设计策略

基于代码实现（Controller/Service/Repository）分析设计测试用例，覆盖验证规则、业务分支、异常处理和事务逻辑。

---

## 适用场景

- 业务代码（Service/Repository/Utils）
- 无接口文档但有代码实现
- 需要高代码覆盖率
- 用户明确指定单元测试

---

## 核心原则

### 代码分析驱动

| 分析层级 | 提取内容 |
|---------|---------|
| **Controller** | 参数验证、路由映射、异常处理 |
| **Service** | 业务逻辑、分支条件、事务边界 |
| **Repository** | 数据访问、查询条件、约束验证 |

### 5 维度设计

| 维度 | 关键测试点 | 优先级 |
|------|-----------|--------|
| **功能测试** | 正常流程（最小必需/所有字段） | P0 |
| **参数验证** | 必填缺失、类型错误、边界值(min±1/max±1)、格式验证 | P0 |
| **业务逻辑** | 唯一性约束、数据库操作、事务完整性 | P0 |
| **异常场景** | 认证授权(401/403)、资源冲突(409)、依赖服务异常 | P0 |
| **数据验证** | 主表/关联表、事务回滚、并发冲突 | P1 |

---

## 执行步骤

### 步骤 1: 代码调用链路分析

绘制完整调用链路:

```
HTTP Request → Controller → Service → Repository → Database
            ↓ 验证        ↓ 业务     ↓ 数据
            ↓ 异常        ↓ 事务     ↓ 约束
```

**标记关键点**:
- 异常抛出点及 HTTP 状态码映射
- 事务边界 `@Transactional`
- 外部依赖（缓存/消息队列/第三方服务）

### 步骤 2: 提取验证规则

#### Bean Validation 注解

```java
@NotBlank → 测试 null、""、"  "
@Size(min=3, max=20) → 测试 2、3、20、21
@Email → 测试无效格式
@Pattern(regexp="...") → 测试不匹配格式
```

#### 代码验证逻辑

```java
if (userRepository.existsByUsername(username)) {
    throw new BusinessException("用户名已存在");
}
```
→ 测试数据库已存在同名用户，期望 400/409

### 步骤 3: 识别业务分支

识别所有条件分支:

```java
if (user.getRole() == ADMIN) {
    // 管理员逻辑
} else if (user.getRole() == VIP) {
    // VIP 逻辑
} else {
    // 普通用户逻辑
}
```
→ 为每个分支设计测试用例

### 步骤 4: 识别异常处理

```java
throw new NotFoundException("资源不存在");      // → 404
throw new BusinessException("业务规则违反");    // → 400
throw new UnauthorizedException("权限不足");   // → 403
```

### 步骤 5: 识别事务边界

```java
@Transactional
public void createOrder() {
    orderRepository.save(order);
    itemRepository.saveAll(items);
    stockService.deduct(items);  // 失败时验证全部回滚
}
```

---

## 测试用例设计

### 功能测试

```markdown
### TC001 - 正常创建用户

**代码依据**: UserService.createUser()

**测试数据**:
```java
CreateUserRequest request = new CreateUserRequest();
request.setUsername("testuser");
request.setEmail("test@example.com");
```

**预期结果**:
- 返回 UserDTO，id 不为空
- 数据库 users 表新增记录
```

### 参数验证测试

```markdown
### TC010 - 用户名为空（Bean Validation）

**代码依据**: @NotBlank on username field

**测试数据**:
- null
- ""
- "   "

**预期结果**:
- 抛出 ConstraintViolationException
- 或返回 400 错误
```

### 业务分支测试

```markdown
### TC020 - 管理员角色处理

**代码依据**: 
```java
if (user.getRole() == ADMIN) {
    // 特殊处理
}
```

**测试数据**:
```java
user.setRole(Role.ADMIN);
```

**预期结果**:
- 执行管理员特殊逻辑
- 验证特定方法被调用
```

### 异常场景测试

```markdown
### TC030 - 用户名已存在

**代码依据**:
```java
if (userRepository.existsByUsername(username)) {
    throw new BusinessException("用户名已存在");
}
```

**测试数据**:
- Mock: when(userRepository.existsByUsername("existing")).thenReturn(true)

**预期结果**:
- 抛出 BusinessException
- 消息包含 "用户名已存在"
```

### 事务验证测试

```markdown
### TC040 - 事务回滚验证

**代码依据**:
```java
@Transactional
public void createOrder() {
    orderRepository.save(order);
    itemRepository.saveAll(items);
    stockService.deduct(items);  // 模拟失败
}
```

**测试步骤**:
1. 记录操作前数据库状态
2. Mock stockService.deduct() 抛出异常
3. 执行 createOrder()
4. 验证数据库状态与操作前一致

**预期结果**:
- order 未保存
- items 未保存
- 数据库回滚到操作前状态
```

---

## 输出产物

### 测试用例文档

文件路径: `workspace/{变更ID}/test/cases/{类名}-test-spec.md`

文档结构:
```markdown
---
change_id: "{变更ID}"
domain: "{业务领域}"
test_type: "unit-test"
source: "code_analysis"
---

# {类名} 单元测试用例

## 1. 代码覆盖统计
| 分类 | 用例数 | 覆盖率 |
|------|--------|--------|
| 正常流程 | 2 | 100% |
| 参数验证 | 8 | 95% |
| 业务分支 | 6 | 90% |
| 异常场景 | 5 | 100% |
| 事务验证 | 3 | 100% |

## 2. 详细测试用例
### 2.1 功能测试
### 2.2 参数验证测试
### 2.3 业务分支测试
### 2.4 异常场景测试
### 2.5 事务验证测试

## 3. 测试数据
```

---

## 最佳实践

### 边界值识别

- `@Size(min=3, max=20)` → 测试 2, 3, 20, 21
- `if (balance < amount)` → 测试 `balance = amount ± 0.01`

### 事务验证

1. 记录操作前数据库状态
2. 执行触发异常的操作
3. 验证数据库状态与操作前完全一致

### 数据验证完整性

- 主表/关联表记录
- 字段值正确性
- 时间戳/软删除字段
- 外键/索引维护

---

## 常见错误

| 错误 | 正确做法 |
|------|----------|
| ❌ 只关注 Bean Validation，忽略代码验证逻辑 | ✅ 分析 Service 层的业务验证 |
| ❌ 假设异常会正确映射 | ✅ 验证 ExceptionHandler 映射 |
| ❌ 只测试主流程 | ✅ 覆盖所有 if-else/switch-case 分支 |
| ❌ 只验证数据库插入 | ✅ 验证异常时的事务回滚 |

---

## 验证清单

- [ ] 所有代码层级已分析（Controller/Service/Repository）
- [ ] 所有验证规则已提取（注解 + 代码）
- [ ] 所有业务分支已识别
- [ ] 所有异常抛出点已标记
- [ ] 所有事务边界已识别
- [ ] 测试用例有明确代码依据
- [ ] 代码分支覆盖率 ≥ 90%

---

## 相关资源

- [测试用例规范](../../test-case-spec-standard.md)
- [完整示例](../../examples/example-02-whitebox.md)
- [验证清单](../../checklist.md)
