# 测试用例设计文档标准规范

本文档定义测试用例设计文档的标准格式和规范，所有测试用例文档必须通过此标准化检查后才能进入代码生成阶段。

---

## 文档结构规范

### 必需的元信息

```yaml
---
change_id: "2025-12-18-user-api"      # 变更标识
domain: "user"                         # 业务领域
test_type: "api-test | unit-test"      # 测试类型
source: "api_doc | code_analysis | manual"  # 用例来源
created_at: "2025-12-18"               # 创建时间
author: "tester"                       # 作者
---
```

### 必需的章节

1. **测试范围说明** - 明确测试目标和边界
2. **测试用例列表** - 按分类组织的用例
3. **测试数据** - 前置数据和测试数据
4. **清理策略** - 数据清理方案（集成测试必需）

---

## 测试用例分类

### API 测试（集成测试）6 维度

| 维度 | 关键测试点 | 优先级 |
|------|-----------|--------|
| **功能** | 正常流程、必填/全字段 | P0 |
| **参数** | 必填缺失、边界值(min-1/min/max/max+1)、格式验证 | P0/P1 |
| **业务** | 唯一性、状态流转、数据库验证 | P0 |
| **异常** | 401/403/404/409、依赖服务异常 | P0 |
| **安全** | SQL注入、XSS、超长输入 | P1 |
| **性能** | 响应时间<500ms、并发测试 | P1 |

### 单元测试 4 维度

| 维度 | 关键测试点 | 优先级 |
|------|-----------|--------|
| **正常场景** | 有效输入的预期行为 | P0 |
| **边界条件** | null/空集合/最值/边界值 | P0 |
| **异常场景** | 非法输入、业务规则违反、依赖异常 | P0 |
| **Mock验证** | 依赖调用验证、参数匹配、调用次数 | P1 |

---

## 用例命名规范

### API 测试命名

采用 **Method-Scenario-Expected** 模式：

```
test_[HTTP方法]_[资源]_[场景描述]_returns_[预期状态码]
```

**示例**:
```python
# 正向测试
test_post_users_with_valid_data_returns_201
test_get_users_with_pagination_returns_200

# 参数验证
test_post_users_with_empty_username_returns_400
test_post_users_with_username_exceeds_max_length_returns_400

# 认证授权
test_post_users_without_token_returns_401
test_delete_user_without_permission_returns_403

# 业务逻辑
test_post_users_with_duplicate_username_returns_409
test_get_user_when_not_exists_returns_404

# 性能测试
test_get_users_response_time_under_500ms
```

### 单元测试命名

采用 **should-when** 模式：

```java
should[预期行为]When[条件]
```

**示例**:
```java
shouldCreateUserWhenValidInput()
shouldThrowExceptionWhenUsernameIsNull()
shouldReturnEmptyListWhenNoDataFound()
shouldCallRepositorySaveOnce()
```

---

## 用例结构规范

### 每个用例必须包含

```markdown
### TC001 - [用例名称]

**优先级**: P0 | P1 | P2

**前置条件**:
- 条件1
- 条件2

**测试步骤**:
1. 步骤1
2. 步骤2
3. 步骤3

**测试数据**:
```json
{
  "field1": "value1",
  "field2": "value2"
}
```

**预期结果**:
- HTTP 状态码: 200/201/400/401/403/404/409
- 响应体结构: { "code": 0, "data": {...} }
- 数据库状态: [描述数据库预期状态]
- 业务规则: [描述业务规则验证点]

**清理操作**: (集成测试必需)
- 删除创建的测试数据
```

---

## 测试数据规范

### 数据分类

```python
class TestData:
    """测试数据分类管理"""
    
    class Valid:
        """有效数据"""
        USERNAME = "testuser"
        EMAIL = "test@example.com"
        PASSWORD = "Test@123456"
    
    class Boundary:
        """边界值数据"""
        USERNAME_AT_MIN = "abc"        # 3字符(=min)
        USERNAME_AT_MAX = "a" * 20     # 20字符(=max)
        USERNAME_BELOW_MIN = "ab"      # 2字符(<min)
        USERNAME_ABOVE_MAX = "a" * 21  # 21字符(>max)
    
    class Invalid:
        """无效数据"""
        EMAILS = ["invalid", "test@", "@example.com"]
    
    class Security:
        """安全测试数据"""
        SQL_INJECTION = ["' OR '1'='1", "'; DROP TABLE users; --"]
        XSS_PAYLOADS = ["<script>alert('xss')</script>"]
```

### 边界值测试要求

对于有长度/范围限制的字段，必须测试：

| 边界类型 | 测试值 | 预期结果 |
|---------|--------|---------|
| min-1 | 最小值-1 | 400 参数错误 |
| min | 最小值 | 200 成功 |
| max | 最大值 | 200 成功 |
| max+1 | 最大值+1 | 400 参数错误 |

---

## 预期结果规范

### 6 层断言结构（API 测试）

```markdown
**预期结果**:
1. **状态码断言**: HTTP 200
2. **响应头断言**: Content-Type: application/json
3. **响应体结构断言**: 包含 code, data, message 字段
4. **响应体数据断言**: data.id 不为空, data.username = "testuser"
5. **业务规则断言**: 敏感字段(password)不返回
6. **性能断言**: 响应时间 < 500ms
```

### 单元测试断言

```java
// Assert
assertEquals(expectedValue, actualValue);
assertNotNull(result);
assertThrows(BusinessException.class, () -> service.method());
verify(repository).save(any(User.class));
verify(repository, times(1)).findById(anyLong());
```

---

## 清理策略规范（集成测试）

### 清理时机

- ❌ **不会自动清理** - 测试执行过程中创建的数据会被记录，但不会自动删除
- ✅ **手动调用清理** - 需要显式调用清理方法
- ✅ **持久化存储** - 清理注册表保存到磁盘文件

### 清理记录格式

```yaml
cleanup_registry:
  - resource_type: "user"
    resource_id: "12345"
    created_at: "2025-12-18T10:30:00Z"
    cleanup_api: "DELETE /api/users/12345"
    status: "pending"
```

---

## 标准化检查清单

### 结构完整性检查

- [ ] 包含文档元信息（change_id/domain/test_type）
- [ ] 包含测试范围说明
- [ ] 包含用例分类（按维度组织）
- [ ] 包含测试数据定义
- [ ] 包含清理策略（集成测试）

### 用例规范性检查

- [ ] 每个用例有唯一ID（TC001, TC002...）
- [ ] 用例命名遵循规范模式
- [ ] 包含前置条件
- [ ] 包含测试步骤
- [ ] 包含预期结果（多层断言）
- [ ] 包含清理操作（集成测试）

### 覆盖完整性检查

- [ ] 正常流程覆盖（必填字段、全字段）
- [ ] 参数验证覆盖（必填/边界值/格式）
- [ ] 异常场景覆盖（401/403/404/409）
- [ ] 业务规则覆盖（唯一性、状态流转）
- [ ] 安全测试覆盖（SQL注入、XSS）- P1
- [ ] 性能测试覆盖（响应时间）- P1

### 可执行性检查

- [ ] 测试数据明确且可复用
- [ ] 前置条件可满足
- [ ] 清理策略可执行
- [ ] 无依赖冲突

---

## 文档模板

### API 测试用例文档模板

```markdown
---
change_id: "{变更ID}"
domain: "{业务领域}"
test_type: "api-test"
source: "api_doc"
created_at: "{日期}"
author: "{作者}"
---

# {接口名称} API 测试用例

## 1. 测试范围

### 1.1 测试目标
- 验证 {接口名称} 的功能正确性
- 验证参数校验逻辑
- 验证异常处理

### 1.2 测试接口
| 接口 | 方法 | 路径 |
|------|------|------|
| 创建用户 | POST | /api/users |
| 查询用户 | GET | /api/users/{id} |

## 2. 测试用例

### 2.1 功能测试

#### TC001 - 创建用户成功（必填字段）
...

### 2.2 参数验证测试

#### TC010 - 用户名为空
...

### 2.3 业务逻辑测试

#### TC020 - 用户名重复
...

### 2.4 异常场景测试

#### TC030 - 未认证访问
...

### 2.5 安全测试

#### TC040 - SQL注入防护
...

### 2.6 性能测试

#### TC050 - 响应时间验证
...

## 3. 测试数据

### 3.1 有效数据
...

### 3.2 边界值数据
...

### 3.3 无效数据
...

## 4. 清理策略

### 4.1 清理方式
- 手动调用 execute_cleanup()

### 4.2 清理顺序
1. 删除关联数据
2. 删除主数据
```

### 单元测试用例文档模板

```markdown
---
change_id: "{变更ID}"
domain: "{业务领域}"
test_type: "unit-test"
source: "code_analysis"
created_at: "{日期}"
author: "{作者}"
---

# {类名} 单元测试用例

## 1. 测试范围

### 1.1 被测类
- 类名: {ClassName}
- 路径: {package.path}

### 1.2 依赖
- {DependencyRepository}
- {DependencyService}

## 2. 测试用例

### 2.1 正常场景

#### TC001 - 正常创建
...

### 2.2 边界条件

#### TC010 - 空值处理
...

### 2.3 异常场景

#### TC020 - 业务异常
...

### 2.4 Mock 验证

#### TC030 - 依赖调用验证
...

## 3. 代码覆盖统计

| 分类 | 用例数 | 覆盖率 |
|------|--------|--------|
| 正常流程 | 2 | 100% |
| 参数验证 | 8 | 95% |
| 业务分支 | 6 | 90% |
| 异常场景 | 5 | 100% |
```

---

## 版本历史

- **v1.0.0** (2025-12-18): 初始版本
  - 定义测试用例文档标准格式
  - 定义用例命名规范
  - 定义标准化检查清单
  - 提供文档模板
