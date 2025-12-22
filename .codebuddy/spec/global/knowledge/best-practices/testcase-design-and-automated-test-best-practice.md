# 后端API接口测试用例最佳实践(AI代码生成指南)

---

**文档版本**：4.1 (AI生成增强版)  
**最后更新**：2025-12-05  
**作者**：johnsonyang  
**适用范围**：API接口测试 + AI辅助自动化测试代码生成 + 测试用例设计  
**核心目标**：指导AI精准生成高质量API测试代码（目标覆盖率90%+）  

**适用场景**：
- ✅ RESTful API接口测试：遵循第1-5章
- ✅ 认证授权测试：遵循第2.3节认证与授权测试场景
- ✅ 参数化测试：遵循第4章AI辅助测试代码生成

**AI使用指南**：
1. **生成前**：阅读第4.1节选择合适的提示词模板
2. **生成中**：遵循第3章测试用例设计规范和AAA模式
3. **生成后**：执行第4.5节测试代码质量检查清单
4. **质量验证**：使用第6章响应验证规范

---

## 目录

- [一、核心原则](#一核心原则)
- [二、测试场景分类矩阵](#二测试场景分类矩阵)
- [三、测试用例设计规范](#三测试用例设计规范)
- [四、AI辅助测试代码生成](#四ai辅助测试代码生成)
- [五、完整测试用例示例](#五完整测试用例示例)
- [六、响应验证规范](#六响应验证规范)
- [七、测试报告规范](#七测试报告规范)
- [八、注意事项与最佳实践](#八注意事项与最佳实践)
- [九、附录](#九附录)

---

## 一、核心原则

### 1.1 FIRST原则

| 原则 | 说明 | AI生成指导 |
|------|------|------------|
| **Fast（快速）** | 测试用例执行要快 | 避免sleep/延时，合理设置超时时间 |
| **Independent（独立）** | 用例之间相互独立 | 每个测试方法必须有独立的setup/teardown |
| **Repeatable（可重复）** | 任何环境下结果一致 | 使用固定测试数据、清理测试环境 |
| **Self-validating（自验证）** | 结果明确：通过或失败 | 必须包含明确的断言语句 |
| **Timely（及时）** | 与代码开发同步编写 | 测试代码与业务代码同时生成 |

### 1.2 测试金字塔原则

```
        /\
       /  \      E2E测试（少量）
      /----\
     /      \    集成测试（适量）
    /--------\
   /          \  API接口测试（大量）
  /------------\
```

### 1.3 AAA模式（Arrange-Act-Assert）

```python
def test_example():
    # Arrange（准备）- 准备测试数据和环境
    headers = {"Authorization": f"Bearer {token}"}
    payload = {"username": "testuser", "email": "test@example.com"}
    
    # Act（执行）- 发送API请求
    response = requests.post(f"{BASE_URL}/api/users", headers=headers, json=payload)
    
    # Assert（断言）- 验证响应
    assert response.status_code == 201
    assert response.json()["data"]["username"] == "testuser"
```

### 1.4 测试覆盖策略

| 策略 | 描述 | 最低覆盖要求 |
|------|------|--------------|
| **接口覆盖** | 每个API接口至少测试一次 | 100% |
| **场景覆盖** | 正向、负向、边界场景 | 80% |
| **状态码覆盖** | 覆盖主要HTTP状态码 | 90% |

---

## 二、测试场景分类矩阵

### 2.1 输入参数测试矩阵

| 场景类型 | 测试点 | 示例 | 优先级 |
|----------|--------|------|--------|
| **空值测试** | null/空字符串/空数组 | `null`, `""`, `[]` | P0 |
| **类型测试** | 错误类型、类型边界 | 字符串传数字 | P1 |
| **边界值测试** | 最小值、最大值、临界值 | `0`, `-1`, `MAX_INT` | P0 |
| **长度测试** | 空、最小、最大、超长 | 长度0/1/255/256 | P1 |
| **格式测试** | 正确格式、错误格式 | 邮箱、手机号 | P1 |
| **特殊字符** | SQL注入、XSS | `'`, `<script>` | P0 |

### 2.2 HTTP接口测试场景

| HTTP方法 | 必测场景 | 验证重点 |
|----------|----------|----------|
| **GET** | 存在/不存在、分页、过滤、排序 | 幂等性、缓存头、响应时间 |
| **POST** | 创建成功/失败、重复创建、并发创建 | 幂等性、返回ID、数据持久化 |
| **PUT** | 完整更新、资源不存在、并发更新 | 幂等性、版本控制 |
| **PATCH** | 部分更新、无效字段 | 只更新指定字段 |
| **DELETE** | 删除存在/不存在、级联删除、软删除 | 幂等性、权限验证 |

### 2.3 认证与授权测试场景

| 场景 | 测试点 | 预期状态码 |
|------|--------|------------|
| **无Token** | 不携带Authorization头 | 401 |
| **无效Token** | Token格式错误或已失效 | 401 |
| **Token过期** | 使用过期的Token | 401 |
| **权限不足** | 访问无权限的资源 | 403 |
| **跨租户访问** | 访问其他租户的数据 | 403/404 |

### 2.4 业务场景测试矩阵

| 业务场景 | 必测点 |
|----------|--------|
| **分页查询** | 首页、末页、超出范围、每页数量边界 |
| **搜索过滤** | 精确匹配、模糊匹配、多条件组合、空结果 |
| **排序** | 升序、降序、多字段排序、无效字段 |
| **批量操作** | 空列表、单条、最大数量、超出限制 |
| **状态流转** | 合法流转、非法流转、并发流转 |

---

## 三、测试用例设计规范

### 3.1 用例设计原则

#### 3.1.1 SMART原则

| 原则 | 说明 | 示例 |
|------|------|------|
| **S - Specific（具体）** | 用例目标明确，只验证一个点 | 一个用例只验证一种参数错误 |
| **M - Measurable（可度量）** | 预期结果可量化验证 | 状态码=200，响应时间<500ms |
| **A - Achievable（可实现）** | 用例可独立执行，不依赖特定环境 | 自动创建测试数据，不依赖手工数据 |
| **R - Relevant（相关）** | 与被测功能直接相关 | 登录测试不验证无关的用户信息 |
| **T - Time-bound（有时限）** | 执行时间可控 | 单个用例执行时间<5秒 |

#### 3.1.2 单一职责原则

<details>
<summary>点击展开代码示例</summary>

```python
# ❌ 错误示例：一个用例验证多个场景
def test_create_user():
    # 验证正常创建
    response = create_user(valid_data)
    assert response.status_code == 201
    
    # 验证重复创建
    response = create_user(valid_data)
    assert response.status_code == 409
    
    # 验证参数错误
    response = create_user(invalid_data)
    assert response.status_code == 400

# ✅ 正确示例：每个用例只验证一个场景
def test_create_user_with_valid_data_returns_201():
    response = create_user(valid_data)
    assert response.status_code == 201

def test_create_user_with_duplicate_username_returns_409():
    create_user(valid_data)  # 先创建
    response = create_user(valid_data)  # 重复创建
    assert response.status_code == 409

def test_create_user_with_invalid_email_returns_400():
    response = create_user(invalid_email_data)
    assert response.status_code == 400
```

</details>

#### 3.1.3 独立性原则

<details>
<summary>点击展开代码示例</summary>

```python
# ❌ 错误示例：用例间存在依赖
class TestUserAPI:
    user_id = None  # 共享状态
    
    def test_01_create_user(self):
        response = create_user(data)
        TestUserAPI.user_id = response.json()["data"]["id"]
    
    def test_02_get_user(self):
        # 依赖test_01的执行结果
        response = get_user(TestUserAPI.user_id)
        assert response.status_code == 200

# ✅ 正确示例：每个用例独立
class TestUserAPI:
    
    @pytest.fixture
    def created_user(self, auth_headers):
        """每个测试独立创建数据"""
        response = create_user(data, headers=auth_headers)
        user = response.json()["data"]
        yield user
        delete_user(user["id"], headers=auth_headers)  # 清理
    
    def test_get_user_returns_200(self, auth_headers, created_user):
        response = get_user(created_user["id"], headers=auth_headers)
        assert response.status_code == 200
```

</details>

### 3.2 用例命名规范

#### 3.2.1 命名模式

采用 **Given-When-Then** 或 **Method-Scenario-Expected** 模式：

| 模式 | 格式 | 示例 |
|------|------|------|
| **Method-Scenario-Expected** | `test_[方法]_[场景]_[预期]` | `test_create_user_with_valid_data_returns_201` |
| **Given-When-Then** | `test_given[前置]_when[操作]_then[结果]` | `test_given_authenticated_when_create_user_then_success` |
| **Should格式** | `test_[方法]_should_[预期]_when_[条件]` | `test_create_user_should_return_201_when_data_valid` |

#### 3.2.2 命名规范示例

<details>
<summary>点击展开 Python 命名示例</summary>

```python
# Python命名示例
# 格式: test_[HTTP方法]_[资源]_[场景描述]_[预期结果]

# 正向测试
def test_post_users_with_valid_data_returns_201():
def test_get_users_with_pagination_returns_200():
def test_put_user_with_valid_data_returns_200():
def test_delete_user_when_exists_returns_204():

# 负向测试 - 参数验证
def test_post_users_with_empty_username_returns_400():
def test_post_users_with_invalid_email_format_returns_400():
def test_post_users_with_password_too_short_returns_400():

# 负向测试 - 认证授权
def test_post_users_without_token_returns_401():
def test_post_users_with_expired_token_returns_401():
def test_delete_user_without_permission_returns_403():

# 负向测试 - 业务逻辑
def test_post_users_with_duplicate_username_returns_409():
def test_get_user_when_not_exists_returns_404():
def test_delete_user_when_already_deleted_returns_404():

# 边界测试
def test_post_users_with_username_at_min_length_returns_201():
def test_post_users_with_username_at_max_length_returns_201():
def test_post_users_with_username_exceeds_max_length_returns_400():

# 性能测试
def test_get_users_response_time_under_500ms():
def test_post_users_concurrent_10_requests_all_succeed():
```

</details>

<details>
<summary>点击展开 Java 命名示例</summary>

```java
// Java命名示例（JUnit 5）
@DisplayName("POST /users 创建用户")
class CreateUserTests {
    
    @Test
    @DisplayName("有效数据创建成功")
    void createUser_withValidData_returns201() {}
    
    @Test
    @DisplayName("用户名为空返回400")
    void createUser_withEmptyUsername_returns400() {}
    
    @ParameterizedTest
    @DisplayName("无效邮箱格式返回400")
    @ValueSource(strings = {"invalid", "test@", "@example.com"})
    void createUser_withInvalidEmail_returns400(String email) {}
}
```

</details>

### 3.3 用例结构规范

#### 3.3.1 AAA模式详解

<details>
<summary>点击展开完整代码示例</summary>

```python
def test_create_user_with_valid_data_returns_201(self, auth_headers):
    """
    测试场景：使用有效数据创建用户
    预期结果：返回201，响应体包含用户信息
    """
    # ============================================================
    # Arrange（准备阶段）
    # - 准备测试数据
    # - 设置Mock（如需要）
    # - 确保前置条件满足
    # ============================================================
    payload = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "Test@123456"
    }
    
    # ============================================================
    # Act（执行阶段）
    # - 执行被测操作
    # - 只执行一个操作
    # ============================================================
    response = requests.post(
        f"{BASE_URL}/api/v1/users",
        headers=auth_headers,
        json=payload
    )
    
    # ============================================================
    # Assert（断言阶段）
    # - 验证状态码
    # - 验证响应体结构
    # - 验证响应体数据
    # - 验证副作用（如数据库状态）
    # ============================================================
    # 1. 状态码断言
    assert response.status_code == 201, f"预期201，实际{response.status_code}"
    
    # 2. 响应体结构断言
    data = response.json()
    assert "data" in data, "响应缺少data字段"
    assert "id" in data["data"], "响应缺少id字段"
    
    # 3. 响应体数据断言
    assert data["data"]["username"] == payload["username"]
    assert data["data"]["email"] == payload["email"]
    assert "password" not in data["data"], "响应不应包含密码"
    
    # 4. 响应头断言（可选）
    assert response.headers["Content-Type"] == "application/json"
    
    # ============================================================
    # Cleanup（清理阶段）- 可选，建议使用fixture
    # ============================================================
    requests.delete(
        f"{BASE_URL}/api/v1/users/{data['data']['id']}",
        headers=auth_headers
    )
```

</details>

#### 3.3.2 Given-When-Then模式

```python
def test_given_authenticated_user_when_create_with_valid_data_then_returns_201():
    """
    Given: 用户已认证，提供有效的用户数据
    When: 调用创建用户接口
    Then: 返回201，用户创建成功
    """
    # Given
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}
    payload = {"username": "testuser", "email": "test@example.com", "password": "Test@123"}
    
    # When
    response = requests.post(f"{BASE_URL}/api/v1/users", headers=headers, json=payload)
    
    # Then
    assert response.status_code == 201
    assert response.json()["data"]["username"] == "testuser"
```

### 3.4 标准YAML用例描述格式

#### 3.4.1 完整用例模板

<details>
<summary>点击展开 YAML 用例模板</summary>

```yaml
test_case:
  # ==================== 基本信息 ====================
  id: TC_USER_API_001                    # 用例唯一标识
  name: 创建用户-有效数据                  # 用例名称
  description: |                          # 详细描述
    验证使用有效的用户数据可以成功创建用户
    - 用户名符合长度要求
    - 邮箱格式正确
    - 密码符合复杂度要求
  
  # ==================== 接口信息 ====================
  api:
    method: POST
    endpoint: /api/v1/users
    content_type: application/json
    timeout: 5000                         # 超时时间(ms)
  
  # ==================== 前置条件 ====================
  preconditions:
    - description: 用户已登录并获取有效Token
      type: auth
      setup: get_auth_token()
    - description: 用户名未被注册
      type: data
      setup: ensure_username_not_exists("testuser")
  
  # ==================== 请求数据 ====================
  request:
    headers:
      Authorization: "Bearer ${token}"
      Content-Type: "application/json"
      X-Request-ID: "${uuid}"             # 请求追踪ID
    body:
      username: "testuser"
      email: "test@example.com"
      password: "Test@123456"
    # 请求体JSON Schema（用于验证请求格式）
    body_schema:
      type: object
      required: [username, email, password]
      properties:
        username:
          type: string
          minLength: 3
          maxLength: 32
        email:
          type: string
          format: email
        password:
          type: string
          minLength: 8
  
  # ==================== 预期响应 ====================
  expected:
    status_code: 201
    response_time_ms: 500                 # 最大响应时间
    headers:
      Content-Type: "application/json"
    body:
      # 响应体JSON Schema
      schema:
        type: object
        required: [code, message, data]
        properties:
          code:
            type: integer
            enum: [0]
          data:
            type: object
            required: [id, username, email, createdAt]
      # 具体断言
      assertions:
        - field: code
          operator: equals
          value: 0
        - field: data.id
          operator: is_not_empty
        - field: data.username
          operator: equals
          value: "testuser"
        - field: data.email
          operator: equals
          value: "test@example.com"
        - field: data.password
          operator: not_exists           # 确保不返回密码
        - field: data.createdAt
          operator: matches
          value: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}"
  
  # ==================== 后置操作 ====================
  cleanup:
    - action: delete_user
      params:
        user_id: "${response.data.id}"
    - action: clear_cache
      params:
        key: "user:${response.data.id}"
  
  # ==================== 元数据 ====================
  metadata:
    priority: P0                          # 优先级: P0/P1/P2/P3
    category: [positive, smoke, regression]
    tags: [user, create, auth]
    author: test_team
    created_at: "2024-12-01"
    updated_at: "2024-12-04"
    execution_time: 2s                    # 预估执行时间
    
  # ==================== 关联信息 ====================
  traceability:
    requirement_id: REQ-USER-001          # 关联需求
    design_doc: "https://wiki/user-api"   # 设计文档
    related_cases: [TC_USER_API_002]      # 关联用例
```

</details>

#### 3.4.2 断言操作符说明

| 操作符 | 说明 | 示例 |
|--------|------|------|
| `equals` | 精确相等 | `value: 200` |
| `not_equals` | 不相等 | `value: 0` |
| `contains` | 包含字符串 | `value: "success"` |
| `not_contains` | 不包含 | `value: "error"` |
| `matches` | 正则匹配 | `value: "^\\d+$"` |
| `is_empty` | 为空 | - |
| `is_not_empty` | 不为空 | - |
| `not_exists` | 字段不存在 | - |
| `exists` | 字段存在 | - |
| `greater_than` | 大于 | `value: 0` |
| `less_than` | 小于 | `value: 100` |
| `in_list` | 在列表中 | `value: [1, 2, 3]` |
| `type_is` | 类型检查 | `value: "string"` |
| `length_equals` | 长度相等 | `value: 10` |
| `length_greater_than` | 长度大于 | `value: 0` |

### 3.5 测试数据规范

#### 3.5.1 数据分类管理

<details>
<summary>点击展开测试数据常量类</summary>

```python
class TestData:
    """API测试数据常量 - 按类型分类管理"""
    
    # ==================== 环境配置 ====================
    class Config:
        BASE_URL = "http://localhost:8080"
        API_PREFIX = "/api/v1"
        TIMEOUT = 30  # 秒
        
    # ==================== 认证数据 ====================
    class Auth:
        ADMIN_USERNAME = "admin"
        ADMIN_PASSWORD = "Admin@123"
        NORMAL_USER = "testuser"
        NORMAL_PASSWORD = "Test@123"
        EXPIRED_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.expired"
        INVALID_TOKEN = "invalid_token_format"
    
    # ==================== 有效数据 ====================
    class Valid:
        USERNAME = "testuser"
        EMAIL = "test@example.com"
        PASSWORD = "Test@123456"
        PHONE = "13800138000"
        
        @classmethod
        def user_payload(cls, **overrides):
            """生成有效用户数据，支持覆盖"""
            data = {
                "username": cls.USERNAME,
                "email": cls.EMAIL,
                "password": cls.PASSWORD
            }
            data.update(overrides)
            return data
    
    # ==================== 边界值数据 ====================
    class Boundary:
        # 用户名边界
        USERNAME_MIN_LENGTH = 3
        USERNAME_MAX_LENGTH = 32
        USERNAME_AT_MIN = "abc"
        USERNAME_AT_MAX = "a" * 32
        USERNAME_BELOW_MIN = "ab"
        USERNAME_ABOVE_MAX = "a" * 33
        
        # 密码边界
        PASSWORD_MIN_LENGTH = 8
        PASSWORD_MAX_LENGTH = 64
        PASSWORD_AT_MIN = "Test@123"
        PASSWORD_AT_MAX = "Test@123" + "a" * 56
        
        # 分页边界
        PAGE_MIN = 1
        PAGE_SIZE_MIN = 1
        PAGE_SIZE_MAX = 100
        PAGE_SIZE_DEFAULT = 20
    
    # ==================== 无效数据 ====================
    class Invalid:
        # 空值
        EMPTY_STRING = ""
        WHITESPACE_ONLY = "   "
        NULL = None
        
        # 无效邮箱
        EMAILS = [
            "invalid",           # 无@符号
            "test@",             # 无域名
            "@example.com",      # 无用户名
            "test@.com",         # 域名格式错误
            "test@exam ple.com", # 包含空格
            "test@@example.com", # 双@符号
        ]
        
        # 无效密码
        PASSWORDS = [
            "short",             # 太短
            "nouppercase1",      # 无大写
            "NOLOWERCASE1",      # 无小写
            "NoNumber",          # 无数字
            "12345678",          # 纯数字
        ]
        
        # 无效类型
        STRING_AS_NUMBER = "not_a_number"
        NUMBER_AS_STRING = 12345
        ARRAY_AS_STRING = ["not", "a", "string"]
    
    # ==================== 安全测试数据 ====================
    class Security:
        # SQL注入
        SQL_INJECTION = [
            "' OR '1'='1",
            "'; DROP TABLE users; --",
            "1' OR '1'='1' /*",
            "admin'--",
            "1; SELECT * FROM users",
        ]
        
        # XSS攻击
        XSS_PAYLOADS = [
            "<script>alert('xss')</script>",
            "<img src=x onerror=alert('xss')>",
            "javascript:alert('xss')",
            "<svg onload=alert('xss')>",
            "'\"><script>alert('xss')</script>",
        ]
        
        # 路径遍历
        PATH_TRAVERSAL = [
            "../../../etc/passwd",
            "..\\..\\..\\windows\\system32\\config\\sam",
            "....//....//....//etc/passwd",
        ]
        
        # 命令注入
        COMMAND_INJECTION = [
            "; ls -la",
            "| cat /etc/passwd",
            "`whoami`",
            "$(whoami)",
        ]
    
    # ==================== 分页测试数据 ====================
    class Pagination:
        VALID_CASES = [
            {"page": 1, "pageSize": 10, "expected_status": 200},
            {"page": 1, "pageSize": 1, "expected_status": 200},
            {"page": 1, "pageSize": 100, "expected_status": 200},
            {"page": 100, "pageSize": 10, "expected_status": 200},  # 超出范围返回空
        ]
        
        INVALID_CASES = [
            {"page": 0, "pageSize": 10, "expected_status": 400},
            {"page": -1, "pageSize": 10, "expected_status": 400},
            {"page": 1, "pageSize": 0, "expected_status": 400},
            {"page": 1, "pageSize": -1, "expected_status": 400},
            {"page": 1, "pageSize": 101, "expected_status": 400},
            {"page": "abc", "pageSize": 10, "expected_status": 400},
        ]
```

</details>

#### 3.5.2 数据工厂模式

<details>
<summary>点击展开数据工厂示例</summary>

```python
import uuid
from datetime import datetime, timedelta
from dataclasses import dataclass, field
from typing import Optional

@dataclass
class UserFactory:
    """用户测试数据工厂"""
    username: str = field(default_factory=lambda: f"test_{uuid.uuid4().hex[:8]}")
    email: str = field(default_factory=lambda: f"test_{uuid.uuid4().hex[:8]}@example.com")
    password: str = "Test@123456"
    phone: Optional[str] = None
    status: str = "active"
    
    def to_dict(self) -> dict:
        """转换为字典"""
        data = {
            "username": self.username,
            "email": self.email,
            "password": self.password,
        }
        if self.phone:
            data["phone"] = self.phone
        return data
    
    @classmethod
    def create_valid(cls, **overrides) -> "UserFactory":
        """创建有效用户数据"""
        return cls(**overrides)
    
    @classmethod
    def create_with_invalid_email(cls) -> "UserFactory":
        """创建无效邮箱的用户数据"""
        return cls(email="invalid_email")
    
    @classmethod
    def create_with_short_password(cls) -> "UserFactory":
        """创建密码过短的用户数据"""
        return cls(password="short")
    
    @classmethod
    def create_batch(cls, count: int) -> list:
        """批量创建用户数据"""
        return [cls.create_valid() for _ in range(count)]


# 使用示例
def test_create_user_with_factory():
    # 使用工厂创建唯一测试数据
    user_data = UserFactory.create_valid()
    response = requests.post(f"{BASE_URL}/users", json=user_data.to_dict())
    assert response.status_code == 201
    
def test_create_user_with_custom_data():
    # 自定义部分字段
    user_data = UserFactory.create_valid(username="custom_user")
    response = requests.post(f"{BASE_URL}/users", json=user_data.to_dict())
    assert response.status_code == 201
```

</details>

### 3.6 断言规范

#### 3.6.1 断言层次结构

<details>
<summary>点击展开完整断言示例</summary>

```python
def test_create_user_comprehensive_assertions(self, auth_headers):
    """完整的断言示例"""
    response = requests.post(
        f"{BASE_URL}/api/v1/users",
        headers=auth_headers,
        json={"username": "testuser", "email": "test@test.com", "password": "Test@123"}
    )
    
    # ==================== 第一层：状态码断言 ====================
    assert response.status_code == 201, \
        f"状态码错误: 预期201, 实际{response.status_code}, 响应: {response.text}"
    
    # ==================== 第二层：响应头断言 ====================
    assert response.headers.get("Content-Type") == "application/json", \
        "Content-Type应为application/json"
    
    # ==================== 第三层：响应体结构断言 ====================
    data = response.json()
    assert "code" in data, "响应缺少code字段"
    assert "message" in data, "响应缺少message字段"
    assert "data" in data, "响应缺少data字段"
    
    # ==================== 第四层：响应体数据断言 ====================
    assert data["code"] == 0, f"业务码错误: {data['code']}"
    
    user = data["data"]
    # 必填字段存在性
    assert "id" in user, "用户数据缺少id"
    assert "username" in user, "用户数据缺少username"
    assert "email" in user, "用户数据缺少email"
    assert "createdAt" in user, "用户数据缺少createdAt"
    
    # 字段值验证
    assert user["username"] == "testuser", f"用户名不匹配: {user['username']}"
    assert user["email"] == "test@test.com", f"邮箱不匹配: {user['email']}"
    
    # 字段类型验证
    assert isinstance(user["id"], int), f"id应为整数: {type(user['id'])}"
    assert isinstance(user["username"], str), f"username应为字符串"
    
    # 敏感字段不应返回
    assert "password" not in user, "响应不应包含password"
    assert "passwordHash" not in user, "响应不应包含passwordHash"
    
    # ==================== 第五层：业务规则断言 ====================
    # ID应为正整数
    assert user["id"] > 0, f"用户ID应为正整数: {user['id']}"
    
    # 创建时间应在合理范围内
    created_at = datetime.fromisoformat(user["createdAt"].replace("Z", "+00:00"))
    now = datetime.now(created_at.tzinfo)
    assert (now - created_at).total_seconds() < 60, "创建时间应在1分钟内"
    
    # ==================== 第六层：性能断言 ====================
    assert response.elapsed.total_seconds() < 0.5, \
        f"响应时间超过500ms: {response.elapsed.total_seconds()}s"
```

</details>

#### 3.6.2 自定义断言函数

<details>
<summary>点击展开断言工具类</summary>

```python
class APIAssertions:
    """API测试断言工具类"""
    
    @staticmethod
    def assert_status_code(response, expected: int, message: str = ""):
        """断言状态码"""
        actual = response.status_code
        assert actual == expected, \
            f"{message}状态码错误: 预期{expected}, 实际{actual}, 响应: {response.text[:500]}"
    
    @staticmethod
    def assert_json_structure(response, required_fields: list):
        """断言JSON结构包含必需字段"""
        data = response.json()
        for field in required_fields:
            assert field in data, f"响应缺少必需字段: {field}"
    
    @staticmethod
    def assert_json_schema(response, schema: dict):
        """断言JSON符合Schema"""
        from jsonschema import validate, ValidationError
        try:
            validate(instance=response.json(), schema=schema)
        except ValidationError as e:
            assert False, f"JSON Schema验证失败: {e.message}"
    
    @staticmethod
    def assert_response_time(response, max_seconds: float):
        """断言响应时间"""
        actual = response.elapsed.total_seconds()
        assert actual < max_seconds, \
            f"响应时间超过{max_seconds}s: 实际{actual}s"
    
    @staticmethod
    def assert_error_response(response, expected_code: int, error_keyword: str):
        """断言错误响应"""
        APIAssertions.assert_status_code(response, expected_code)
        data = response.json()
        assert "message" in data, "错误响应缺少message字段"
        assert error_keyword.lower() in data["message"].lower(), \
            f"错误消息应包含'{error_keyword}': {data['message']}"
    
    @staticmethod
    def assert_pagination_response(response, page: int, page_size: int):
        """断言分页响应"""
        data = response.json()["data"]
        assert "items" in data, "分页响应缺少items"
        assert "total" in data, "分页响应缺少total"
        assert isinstance(data["items"], list), "items应为数组"
        assert len(data["items"]) <= page_size, f"返回数量超过pageSize: {len(data['items'])}"
    
    @staticmethod
    def assert_list_sorted(items: list, field: str, descending: bool = False):
        """断言列表按指定字段排序"""
        values = [item[field] for item in items]
        if descending:
            assert values == sorted(values, reverse=True), f"列表未按{field}降序排列"
        else:
            assert values == sorted(values), f"列表未按{field}升序排列"


# 使用示例
def test_create_user_with_custom_assertions(auth_headers):
    response = requests.post(f"{BASE_URL}/users", headers=auth_headers, json=payload)
    
    APIAssertions.assert_status_code(response, 201, "创建用户")
    APIAssertions.assert_json_structure(response, ["code", "message", "data"])
    APIAssertions.assert_response_time(response, 0.5)
```

</details>

### 3.7 测试用例优先级定义

| 优先级 | 定义 | 场景示例 | 执行频率 |
|--------|------|----------|----------|
| **P0** | 冒烟测试/阻塞测试 | 登录、核心CRUD正向场景 | 每次提交 |
| **P1** | 核心功能测试 | 主要业务流程、认证授权 | 每次提交 |
| **P2** | 重要功能测试 | 参数验证、边界值、异常处理 | 每日构建 |
| **P3** | 一般功能测试 | 性能测试、安全测试、兼容性 | 发版前 |

```python
# 使用pytest标记优先级
import pytest

@pytest.mark.p0
@pytest.mark.smoke
def test_login_with_valid_credentials():
    """P0: 冒烟测试 - 登录"""
    pass

@pytest.mark.p1
def test_create_user_with_valid_data():
    """P1: 核心功能 - 创建用户"""
    pass

@pytest.mark.p2
def test_create_user_with_invalid_email():
    """P2: 参数验证 - 无效邮箱"""
    pass

@pytest.mark.p3
@pytest.mark.performance
def test_create_user_response_time():
    """P3: 性能测试 - 响应时间"""
    pass

# pytest.ini 配置
# [pytest]
# markers =
#     p0: Priority 0 - Smoke tests
#     p1: Priority 1 - Core functionality
#     p2: Priority 2 - Important functionality  
#     p3: Priority 3 - General functionality
#     smoke: Smoke tests
#     performance: Performance tests

# 执行命令
# pytest -m "p0 or p1"           # 只执行P0和P1
# pytest -m "not p3"             # 排除P3
# pytest -m "smoke"              # 只执行冒烟测试
```

---

## 四、AI辅助测试代码生成

本章整合了AI生成测试代码的所有相关规范，包括Prompt模板、生成规范、质量标准和自检清单。

### 4.1 API测试生成提示词模板

#### 4.1.1 完整API测试套件生成模板

```markdown
# 任务：生成完整的API自动化测试代码

## 接口信息
- 基础URL：{base_url}
- 模块名称：{module_name}
- 认证方式：{auth_type}

## 接口列表
| 方法 | 路径 | 描述 |
|------|------|------|
{api_list}

## 技术栈要求
- 编程语言：{language}
- 测试框架：{test_framework}
- HTTP客户端：{http_client}

## 生成规范
1. 严格遵循AAA模式
2. 命名格式：test_{接口}_{场景}_{预期状态码}
3. 每个接口包含以下测试：
   - 正向测试（200/201）
   - 认证测试（401）
   - 参数验证测试（400）
   - 资源不存在测试（404）
4. 使用参数化测试减少重复
5. 包含测试数据清理逻辑
```

#### 4.1.2 单个接口测试生成模板

```markdown
## 任务：为以下API接口生成自动化测试代码

### 接口信息
- 请求方法：{method}
- 请求路径：{endpoint}
- 认证方式：{auth_type}

### 请求体结构
```json
{request_schema}
```

### 响应体结构
```json
{response_schema}
```

### 生成要求
1. 测试框架：{framework}（如pytest + requests）
2. 遵循AAA模式
3. 命名：test_[接口名]_[场景]_[预期状态码]

### 必须覆盖的测试场景
- [ ] 正常请求返回200/201
- [ ] 缺少必填参数返回400
- [ ] 参数格式错误返回400
- [ ] 未认证返回401
- [ ] 无权限返回403
- [ ] 资源不存在返回404
- [ ] 重复创建返回409（如适用）
- [ ] 响应时间验证
```

#### 4.1.3 参数化测试生成模板

```markdown
## 任务：生成参数化API测试用例

### 接口信息
{api_info}

### 参数化数据表
| 请求参数 | 预期状态码 | 预期错误消息 | 场景描述 |
|----------|------------|--------------|----------|
{test_data_table}

### 框架
- Python: @pytest.mark.parametrize
- Java: @ParameterizedTest + @CsvSource
```

#### 4.1.4 批量接口测试生成模板

```markdown
## 任务：为以下API模块生成完整测试套件

### 模块信息
- 模块名称：{module_name}
- 基础路径：{base_path}

### 接口列表
| 方法 | 路径 | 描述 |
|------|------|------|
{api_list}

### 生成要求
1. 每个接口生成独立的测试类
2. 包含认证测试（401/403）
3. 包含参数验证测试（400）
4. 包含业务逻辑测试（200/201/404）
5. 包含性能基准测试（响应时间）
```

### 4.2 生成指令结构化模板

```yaml
# AI API测试代码生成指令

language: python | java
test_framework: pytest + requests | junit5 + restassured
base_url: http://localhost:8080

target:
  module: user
  base_path: /api/v1/users
  auth_type: bearer_token

apis:
  - method: POST
    path: /
    description: 创建用户
  - method: GET
    path: /{id}
    description: 获取用户
  - method: GET
    path: /
    description: 用户列表
  - method: PUT
    path: /{id}
    description: 更新用户
  - method: DELETE
    path: /{id}
    description: 删除用户

scenarios:
  auth: [无Token, 无效Token, Token过期]
  validation: [缺少必填参数, 参数格式错误, 参数越界]
  business: [资源不存在, 重复创建, 权限不足]
  performance: [响应时间]

output:
  include_fixtures: true
  include_cleanup: true
  use_parametrize: true
```

### 4.3 AI生成代码的质量标准

<details>
<summary>点击展开代码结构规范</summary>

```python
"""
AI生成的API测试代码必须符合以下结构
"""

# ============================================================
# 1. 文件头部
# ============================================================
"""
{模块名}API接口测试
测试目标: {base_path}
测试框架: {framework}
"""

# 2. 导入语句
import pytest
import requests

# ============================================================
# 3. 配置和常量
# ============================================================
BASE_URL = "http://localhost:8080"
API_PREFIX = "/api/v1"

class TestData:
    """测试数据"""
    VALID_DATA = {...}
    INVALID_DATA = {...}

# ============================================================
# 4. Fixtures
# ============================================================
@pytest.fixture(scope="module")
def auth_token():
    """获取认证Token"""
    pass

@pytest.fixture
def auth_headers(auth_token):
    """认证请求头"""
    pass

@pytest.fixture
def created_resource(auth_headers):
    """创建测试资源，测试后清理"""
    # 创建
    yield resource
    # 清理

# ============================================================
# 5. 测试类 - 按接口分组
# ============================================================
class TestCreateResourceAPI:
    """POST /resources 测试"""
    
    def test_create_with_valid_data_returns_201(self, auth_headers):
        # Arrange
        # Act
        # Assert
        pass
    
    def test_create_without_auth_returns_401(self):
        pass
    
    @pytest.mark.parametrize("invalid_field,error_message", [...])
    def test_create_with_invalid_data_returns_400(self, ...):
        pass
```

</details>

### 4.4 测试场景自动推导规则

```yaml
# HTTP方法 -> 测试场景推导规则

POST:
  positive:
    - 有效数据创建成功(201)
  negative:
    - 无Token(401)
    - 无效Token(401)
    - 缺少必填参数(400)
    - 参数格式错误(400)
    - 重复创建(409)
  performance:
    - 响应时间<500ms

GET_BY_ID:
  positive:
    - 资源存在返回(200)
  negative:
    - 无Token(401)
    - 资源不存在(404)
    - ID格式无效(400)

GET_LIST:
  positive:
    - 获取列表成功(200)
    - 分页查询(200)
    - 条件过滤(200)
    - 排序(200)
  negative:
    - 无Token(401)
    - 无效分页参数(400)

PUT:
  positive:
    - 更新成功(200)
  negative:
    - 无Token(401)
    - 资源不存在(404)
    - 参数格式错误(400)

DELETE:
  positive:
    - 删除成功(204)
  negative:
    - 无Token(401)
    - 资源不存在(404)
  idempotent:
    - 重复删除(404)
```

### 4.5 测试代码质量检查清单

```markdown
## API测试代码检查清单

### 结构检查
- [ ] 包含所有必要的import语句
- [ ] 测试类按接口分组
- [ ] 使用fixture管理认证和测试数据
- [ ] 包含测试数据清理逻辑

### 场景覆盖检查
- [ ] 正向场景（200/201/204）
- [ ] 认证场景（401/403）
- [ ] 参数验证场景（400）
- [ ] 资源不存在场景（404）
- [ ] 重复/冲突场景（409）
- [ ] 性能场景（响应时间）

### 断言检查
- [ ] 验证状态码
- [ ] 验证响应体结构
- [ ] 验证响应体数据
- [ ] 验证响应头（如需要）

### 数据管理检查
- [ ] 测试数据独立
- [ ] 测试后清理数据
- [ ] 不依赖执行顺序
```

### 4.6 Python API测试完整模板

<details>
<summary>点击展开完整模板</summary>

```python
"""
{module_name} API接口测试
测试目标: {base_path}
测试框架: pytest + requests
"""
import pytest
import requests
from typing import Generator

# ============================================================
# 配置
# ============================================================
BASE_URL = "{base_url}"
API_PREFIX = "{api_prefix}"


class TestData:
    """测试数据"""
    VALID_DATA = {
        # 有效测试数据
    }
    
    ADMIN_CREDENTIALS = {
        "username": "admin",
        "password": "Admin@123"
    }


# ============================================================
# Fixtures
# ============================================================
@pytest.fixture(scope="module")
def auth_token() -> str:
    """获取认证Token"""
    response = requests.post(
        f"{BASE_URL}{API_PREFIX}/auth/login",
        json=TestData.ADMIN_CREDENTIALS
    )
    return response.json()["data"]["token"]


@pytest.fixture
def auth_headers(auth_token) -> dict:
    """认证请求头"""
    return {
        "Authorization": f"Bearer {auth_token}",
        "Content-Type": "application/json"
    }


@pytest.fixture
def created_resource(auth_headers) -> Generator[dict, None, None]:
    """创建测试资源"""
    response = requests.post(
        f"{BASE_URL}{API_PREFIX}/{resource_path}",
        headers=auth_headers,
        json=TestData.VALID_DATA
    )
    resource = response.json()["data"]
    
    yield resource
    
    # Cleanup
    requests.delete(
        f"{BASE_URL}{API_PREFIX}/{resource_path}/{resource['id']}",
        headers=auth_headers
    )


# ============================================================
# POST /{resource} 测试
# ============================================================
class TestCreate{Resource}API:
    """POST {api_path} 测试套件"""
    
    def test_create_with_valid_data_returns_201(self, auth_headers):
        """正向测试：有效数据创建成功"""
        response = requests.post(
            f"{BASE_URL}{API_PREFIX}/{resource_path}",
            headers=auth_headers,
            json=TestData.VALID_DATA
        )
        
        assert response.status_code == 201
        assert response.json()["data"]["id"] is not None
        
        # Cleanup
        requests.delete(
            f"{BASE_URL}{API_PREFIX}/{resource_path}/{response.json()['data']['id']}",
            headers=auth_headers
        )
    
    def test_create_without_auth_returns_401(self):
        """认证测试：无Token返回401"""
        response = requests.post(
            f"{BASE_URL}{API_PREFIX}/{resource_path}",
            json=TestData.VALID_DATA
        )
        assert response.status_code == 401
    
    @pytest.mark.parametrize("missing_field", ["{field1}", "{field2}"])
    def test_create_missing_field_returns_400(self, auth_headers, missing_field):
        """参数验证：缺少必填字段返回400"""
        payload = TestData.VALID_DATA.copy()
        del payload[missing_field]
        
        response = requests.post(
            f"{BASE_URL}{API_PREFIX}/{resource_path}",
            headers=auth_headers,
            json=payload
        )
        
        assert response.status_code == 400


# ============================================================
# GET /{resource}/{id} 测试
# ============================================================
class TestGet{Resource}API:
    """GET {api_path}/{id} 测试套件"""
    
    def test_get_when_exists_returns_200(self, auth_headers, created_resource):
        """正向测试：资源存在返回200"""
        response = requests.get(
            f"{BASE_URL}{API_PREFIX}/{resource_path}/{created_resource['id']}",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        assert response.json()["data"]["id"] == created_resource["id"]
    
    def test_get_when_not_exists_returns_404(self, auth_headers):
        """负向测试：资源不存在返回404"""
        response = requests.get(
            f"{BASE_URL}{API_PREFIX}/{resource_path}/999999",
            headers=auth_headers
        )
        
        assert response.status_code == 404


# ============================================================
# DELETE /{resource}/{id} 测试
# ============================================================
class TestDelete{Resource}API:
    """DELETE {api_path}/{id} 测试套件"""
    
    def test_delete_when_exists_returns_204(self, auth_headers):
        """正向测试：删除成功返回204"""
        # 先创建
        create_response = requests.post(
            f"{BASE_URL}{API_PREFIX}/{resource_path}",
            headers=auth_headers,
            json=TestData.VALID_DATA
        )
        resource_id = create_response.json()["data"]["id"]
        
        # 删除
        response = requests.delete(
            f"{BASE_URL}{API_PREFIX}/{resource_path}/{resource_id}",
            headers=auth_headers
        )
        
        assert response.status_code == 204
    
    def test_delete_when_not_exists_returns_404(self, auth_headers):
        """负向测试：资源不存在返回404"""
        response = requests.delete(
            f"{BASE_URL}{API_PREFIX}/{resource_path}/999999",
            headers=auth_headers
        )
        
        assert response.status_code == 404
```

</details>

---

## 五、完整测试用例示例

### 5.1 CURL命令参考

以下是用户API各接口的CURL命令示例，可用于手动测试或调试。

#### 5.1.1 获取认证Token

```bash
# 登录获取Token
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "Admin@123"}'

# 响应示例
# {"code":0,"message":"success","data":{"token":"eyJhbGciOiJIUzI1NiIs..."}}

# 将Token保存到环境变量（后续命令使用）
export TOKEN="eyJhbGciOiJIUzI1NiIs..."
```

#### 5.1.2 POST /users - 创建用户

<details>
<summary>点击展开 CURL 命令示例</summary>

```bash
# 正向测试：有效数据创建用户
curl -X POST http://localhost:8080/api/v1/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser_test",
    "email": "newuser@test.com",
    "password": "NewUser@123"
  }'

# 认证测试：无Token（预期401）
curl -X POST http://localhost:8080/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"username": "test", "email": "test@test.com", "password": "Test@123"}'

# 认证测试：无效Token（预期401）
curl -X POST http://localhost:8080/api/v1/users \
  -H "Authorization: Bearer invalid_token" \
  -H "Content-Type: application/json" \
  -d '{"username": "test", "email": "test@test.com", "password": "Test@123"}'

# 参数验证：缺少username字段（预期400）
curl -X POST http://localhost:8080/api/v1/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@test.com", "password": "Test@123"}'

# 参数验证：缺少email字段（预期400）
curl -X POST http://localhost:8080/api/v1/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username": "test", "password": "Test@123"}'

# 参数验证：缺少password字段（预期400）
curl -X POST http://localhost:8080/api/v1/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username": "test", "email": "test@test.com"}'

# 参数验证：无效邮箱格式（预期400）
curl -X POST http://localhost:8080/api/v1/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username": "test", "email": "invalid_email", "password": "Test@123"}'

# 参数验证：无效密码格式-太短（预期400）
curl -X POST http://localhost:8080/api/v1/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username": "test", "email": "test@test.com", "password": "short"}'

# 业务验证：重复用户名（预期409）
curl -X POST http://localhost:8080/api/v1/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username": "existing_user", "email": "another@test.com", "password": "Test@123"}'

# 安全测试：SQL注入（预期400或正常处理）
curl -X POST http://localhost:8080/api/v1/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username": "'\'' OR '\''1'\''='\''1", "email": "test@test.com", "password": "Test@123456"}'

# 安全测试：XSS攻击（预期400或正常处理）
curl -X POST http://localhost:8080/api/v1/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username": "<script>alert(1)</script>", "email": "test@test.com", "password": "Test@123456"}'

# 性能测试：带响应时间统计
curl -X POST http://localhost:8080/api/v1/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username": "perftest", "email": "perf@test.com", "password": "PerfTest@123"}' \
  -w "\n响应时间: %{time_total}s\n"
```

</details>

#### 5.1.3 GET /users/{id} - 获取用户

```bash
# 正向测试：获取存在的用户（预期200）
curl -X GET http://localhost:8080/api/v1/users/1 \
  -H "Authorization: Bearer $TOKEN"

# 负向测试：用户不存在（预期404）
curl -X GET http://localhost:8080/api/v1/users/999999 \
  -H "Authorization: Bearer $TOKEN"

# 参数验证：无效ID格式（预期400）
curl -X GET http://localhost:8080/api/v1/users/invalid_id \
  -H "Authorization: Bearer $TOKEN"

# 认证测试：无Token（预期401）
curl -X GET http://localhost:8080/api/v1/users/1
```

#### 5.1.4 GET /users - 用户列表

<details>
<summary>点击展开 CURL 命令示例</summary>

```bash
# 正向测试：获取用户列表（预期200）
curl -X GET http://localhost:8080/api/v1/users \
  -H "Authorization: Bearer $TOKEN"

# 分页测试：正常分页（预期200）
curl -X GET "http://localhost:8080/api/v1/users?page=1&pageSize=10" \
  -H "Authorization: Bearer $TOKEN"

# 分页测试：最小每页数量（预期200）
curl -X GET "http://localhost:8080/api/v1/users?page=1&pageSize=1" \
  -H "Authorization: Bearer $TOKEN"

# 分页测试：最大每页数量（预期200）
curl -X GET "http://localhost:8080/api/v1/users?page=1&pageSize=100" \
  -H "Authorization: Bearer $TOKEN"

# 分页测试：无效页码（预期400）
curl -X GET "http://localhost:8080/api/v1/users?page=0&pageSize=10" \
  -H "Authorization: Bearer $TOKEN"

# 分页测试：负数页码（预期400）
curl -X GET "http://localhost:8080/api/v1/users?page=-1&pageSize=10" \
  -H "Authorization: Bearer $TOKEN"

# 分页测试：无效每页数量（预期400）
curl -X GET "http://localhost:8080/api/v1/users?page=1&pageSize=0" \
  -H "Authorization: Bearer $TOKEN"

# 分页测试：超出最大每页数量（预期400）
curl -X GET "http://localhost:8080/api/v1/users?page=1&pageSize=101" \
  -H "Authorization: Bearer $TOKEN"

# 过滤测试：按用户名搜索（预期200）
curl -X GET "http://localhost:8080/api/v1/users?username=testuser" \
  -H "Authorization: Bearer $TOKEN"

# 排序测试：按创建时间降序（预期200）
curl -X GET "http://localhost:8080/api/v1/users?sort=createdAt&order=desc" \
  -H "Authorization: Bearer $TOKEN"

# 组合查询：分页+过滤+排序
curl -X GET "http://localhost:8080/api/v1/users?page=1&pageSize=10&username=test&sort=createdAt&order=desc" \
  -H "Authorization: Bearer $TOKEN"
```

</details>

#### 5.1.5 PUT /users/{id} - 更新用户

```bash
# 正向测试：有效数据更新用户（预期200）
curl -X PUT http://localhost:8080/api/v1/users/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "updated_username",
    "email": "updated@test.com"
  }'

# 负向测试：用户不存在（预期404）
curl -X PUT http://localhost:8080/api/v1/users/999999 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username": "test", "email": "test@test.com"}'

# 部分更新：只更新用户名（预期200）
curl -X PUT http://localhost:8080/api/v1/users/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username": "only_username_updated"}'

# 认证测试：无Token（预期401）
curl -X PUT http://localhost:8080/api/v1/users/1 \
  -H "Content-Type: application/json" \
  -d '{"username": "test", "email": "test@test.com"}'
```

#### 5.1.6 DELETE /users/{id} - 删除用户

```bash
# 正向测试：删除存在的用户（预期204）
curl -X DELETE http://localhost:8080/api/v1/users/1 \
  -H "Authorization: Bearer $TOKEN" \
  -v  # 使用-v查看状态码，204无响应体

# 负向测试：用户不存在（预期404）
curl -X DELETE http://localhost:8080/api/v1/users/999999 \
  -H "Authorization: Bearer $TOKEN"

# 幂等性测试：重复删除同一用户（预期404）
curl -X DELETE http://localhost:8080/api/v1/users/1 \
  -H "Authorization: Bearer $TOKEN"

# 认证测试：无Token（预期401）
curl -X DELETE http://localhost:8080/api/v1/users/1
```

#### 5.1.7 CURL常用选项说明

<details>
<summary>点击展开 CURL 常用选项</summary>

```bash
# 常用选项
-X, --request <method>    # 指定请求方法（GET/POST/PUT/DELETE等）
-H, --header <header>     # 添加请求头
-d, --data <data>         # 发送请求体数据
-v, --verbose             # 显示详细信息（包括请求头、响应头）
-s, --silent              # 静默模式，不显示进度
-o, --output <file>       # 将响应保存到文件
-w, --write-out <format>  # 自定义输出格式

# 响应时间统计
curl -w "
DNS解析时间: %{time_namelookup}s
TCP连接时间: %{time_connect}s
SSL握手时间: %{time_appconnect}s
首字节时间: %{time_starttransfer}s
总响应时间: %{time_total}s
" -o /dev/null -s http://localhost:8080/api/v1/users

# 保存响应到文件并格式化JSON
curl -X GET http://localhost:8080/api/v1/users \
  -H "Authorization: Bearer $TOKEN" \
  -s | jq '.'

# 批量测试脚本示例
for i in {1..10}; do
  curl -X GET "http://localhost:8080/api/v1/users/$i" \
    -H "Authorization: Bearer $TOKEN" \
    -s -o /dev/null -w "用户$i: %{http_code} - %{time_total}s\n"
done
```

</details>

---

### 5.2 用户API测试（Python + Pytest + Requests）

<details>
<summary>点击展开Python API测试完整示例</summary>

```python
"""
用户API接口测试
测试目标: /api/v1/users
测试框架: pytest + requests
"""
import pytest
import requests
from typing import Generator

# ============================================================
# 配置和常量
# ============================================================
BASE_URL = "http://localhost:8080"
API_PREFIX = "/api/v1"


class TestData:
    """测试数据"""
    VALID_USER = {
        "username": "apitest_user",
        "email": "apitest@example.com",
        "password": "ApiTest@123"
    }
    
    ADMIN_CREDENTIALS = {
        "username": "admin",
        "password": "Admin@123"
    }


# ============================================================
# Fixtures
# ============================================================
@pytest.fixture(scope="module")
def auth_token() -> str:
    """获取认证Token"""
    response = requests.post(
        f"{BASE_URL}{API_PREFIX}/auth/login",
        json=TestData.ADMIN_CREDENTIALS
    )
    assert response.status_code == 200, "登录失败，无法获取Token"
    return response.json()["data"]["token"]


@pytest.fixture
def auth_headers(auth_token) -> dict:
    """认证请求头"""
    return {
        "Authorization": f"Bearer {auth_token}",
        "Content-Type": "application/json"
    }


@pytest.fixture
def created_user(auth_headers) -> Generator[dict, None, None]:
    """创建测试用户，测试后清理"""
    # Arrange - 创建用户
    response = requests.post(
        f"{BASE_URL}{API_PREFIX}/users",
        headers=auth_headers,
        json=TestData.VALID_USER
    )
    assert response.status_code == 201
    user = response.json()["data"]
    
    yield user
    
    # Cleanup - 删除用户
    requests.delete(
        f"{BASE_URL}{API_PREFIX}/users/{user['id']}",
        headers=auth_headers
    )


# ============================================================
# POST /users 创建用户测试
# ============================================================
class TestCreateUserAPI:
    """POST /api/v1/users 测试套件"""
    
    def test_create_user_with_valid_data_returns_201(self, auth_headers):
        """正向测试：有效数据创建用户成功"""
        # Arrange
        payload = {
            "username": "newuser_test",
            "email": "newuser@test.com",
            "password": "NewUser@123"
        }
        
        # Act
        response = requests.post(
            f"{BASE_URL}{API_PREFIX}/users",
            headers=auth_headers,
            json=payload
        )
        
        # Assert
        assert response.status_code == 201, f"预期201，实际{response.status_code}"
        data = response.json()["data"]
        assert data["id"] is not None, "返回数据应包含ID"
        assert data["username"] == payload["username"]
        assert data["email"] == payload["email"]
        assert "password" not in data, "响应不应包含密码"
        
        # Cleanup
        requests.delete(
            f"{BASE_URL}{API_PREFIX}/users/{data['id']}",
            headers=auth_headers
        )
    
    def test_create_user_without_auth_returns_401(self):
        """认证测试：无Token返回401"""
        response = requests.post(
            f"{BASE_URL}{API_PREFIX}/users",
            json=TestData.VALID_USER
        )
        assert response.status_code == 401
    
    def test_create_user_with_invalid_token_returns_401(self):
        """认证测试：无效Token返回401"""
        headers = {"Authorization": "Bearer invalid_token"}
        response = requests.post(
            f"{BASE_URL}{API_PREFIX}/users",
            headers=headers,
            json=TestData.VALID_USER
        )
        assert response.status_code == 401
    
    @pytest.mark.parametrize("missing_field", ["username", "email", "password"])
    def test_create_user_missing_required_field_returns_400(
        self, auth_headers, missing_field
    ):
        """参数验证：缺少必填字段返回400"""
        payload = TestData.VALID_USER.copy()
        del payload[missing_field]
        
        response = requests.post(
            f"{BASE_URL}{API_PREFIX}/users",
            headers=auth_headers,
            json=payload
        )
        
        assert response.status_code == 400
        assert missing_field in response.json()["message"].lower()
    
    @pytest.mark.parametrize("invalid_email,error_keyword", [
        ("invalid", "邮箱"),
        ("test@", "邮箱"),
        ("@example.com", "邮箱"),
        ("test@.com", "邮箱"),
    ])
    def test_create_user_with_invalid_email_returns_400(
        self, auth_headers, invalid_email, error_keyword
    ):
        """参数验证：无效邮箱格式返回400"""
        payload = TestData.VALID_USER.copy()
        payload["email"] = invalid_email
        
        response = requests.post(
            f"{BASE_URL}{API_PREFIX}/users",
            headers=auth_headers,
            json=payload
        )
        
        assert response.status_code == 400
        assert error_keyword in response.json()["message"]
    
    @pytest.mark.parametrize("invalid_password,error_keyword", [
        ("short", "密码"),
        ("nouppercase1", "大写"),
        ("NOLOWERCASE1", "小写"),
        ("NoNumber", "数字"),
    ])
    def test_create_user_with_invalid_password_returns_400(
        self, auth_headers, invalid_password, error_keyword
    ):
        """参数验证：无效密码格式返回400"""
        payload = TestData.VALID_USER.copy()
        payload["password"] = invalid_password
        
        response = requests.post(
            f"{BASE_URL}{API_PREFIX}/users",
            headers=auth_headers,
            json=payload
        )
        
        assert response.status_code == 400
        assert error_keyword in response.json()["message"]
    
    def test_create_user_with_duplicate_username_returns_409(
        self, auth_headers, created_user
    ):
        """业务验证：重复用户名返回409"""
        payload = TestData.VALID_USER.copy()
        payload["email"] = "another@test.com"  # 不同邮箱，相同用户名
        
        response = requests.post(
            f"{BASE_URL}{API_PREFIX}/users",
            headers=auth_headers,
            json=payload
        )
        
        assert response.status_code == 409
        assert "已存在" in response.json()["message"]
    
    def test_create_user_with_sql_injection_is_safe(self, auth_headers):
        """安全测试：SQL注入防护"""
        payload = {
            "username": "' OR '1'='1",
            "email": "test@test.com",
            "password": "Test@123456"
        }
        
        response = requests.post(
            f"{BASE_URL}{API_PREFIX}/users",
            headers=auth_headers,
            json=payload
        )
        
        # 应该返回400（参数验证失败）或正常处理，不应导致SQL错误
        assert response.status_code in [400, 201, 409]
    
    def test_create_user_response_time_under_500ms(self, auth_headers):
        """性能测试：响应时间小于500ms"""
        payload = {
            "username": "perftest_user",
            "email": "perf@test.com",
            "password": "PerfTest@123"
        }
        
        response = requests.post(
            f"{BASE_URL}{API_PREFIX}/users",
            headers=auth_headers,
            json=payload
        )
        
        assert response.elapsed.total_seconds() < 0.5, \
            f"响应时间{response.elapsed.total_seconds()}s超过500ms"
        
        # Cleanup
        if response.status_code == 201:
            requests.delete(
                f"{BASE_URL}{API_PREFIX}/users/{response.json()['data']['id']}",
                headers=auth_headers
            )


# ============================================================
# GET /users/{id} 获取用户测试
# ============================================================
class TestGetUserAPI:
    """GET /api/v1/users/{id} 测试套件"""
    
    def test_get_user_when_exists_returns_200(self, auth_headers, created_user):
        """正向测试：用户存在返回200"""
        response = requests.get(
            f"{BASE_URL}{API_PREFIX}/users/{created_user['id']}",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()["data"]
        assert data["id"] == created_user["id"]
        assert data["username"] == created_user["username"]
    
    def test_get_user_when_not_exists_returns_404(self, auth_headers):
        """负向测试：用户不存在返回404"""
        response = requests.get(
            f"{BASE_URL}{API_PREFIX}/users/999999",
            headers=auth_headers
        )
        
        assert response.status_code == 404
        assert "不存在" in response.json()["message"]
    
    def test_get_user_with_invalid_id_returns_400(self, auth_headers):
        """参数验证：无效ID格式返回400"""
        response = requests.get(
            f"{BASE_URL}{API_PREFIX}/users/invalid_id",
            headers=auth_headers
        )
        
        assert response.status_code == 400
    
    def test_get_user_without_auth_returns_401(self, created_user):
        """认证测试：无Token返回401"""
        response = requests.get(
            f"{BASE_URL}{API_PREFIX}/users/{created_user['id']}"
        )
        
        assert response.status_code == 401


# ============================================================
# GET /users 用户列表测试
# ============================================================
class TestListUsersAPI:
    """GET /api/v1/users 测试套件"""
    
    def test_list_users_returns_200(self, auth_headers):
        """正向测试：获取用户列表成功"""
        response = requests.get(
            f"{BASE_URL}{API_PREFIX}/users",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()["data"]
        assert "items" in data
        assert "total" in data
        assert isinstance(data["items"], list)
    
    @pytest.mark.parametrize("page,page_size,expected_status", [
        (1, 10, 200),      # 正常分页
        (1, 1, 200),       # 最小每页数量
        (1, 100, 200),     # 最大每页数量
        (0, 10, 400),      # 无效页码
        (-1, 10, 400),     # 负数页码
        (1, 0, 400),       # 无效每页数量
        (1, 101, 400),     # 超出最大每页数量
    ])
    def test_list_users_pagination(
        self, auth_headers, page, page_size, expected_status
    ):
        """分页测试：各种分页参数"""
        response = requests.get(
            f"{BASE_URL}{API_PREFIX}/users",
            headers=auth_headers,
            params={"page": page, "pageSize": page_size}
        )
        
        assert response.status_code == expected_status
    
    def test_list_users_with_search_filter(self, auth_headers, created_user):
        """过滤测试：按用户名搜索"""
        response = requests.get(
            f"{BASE_URL}{API_PREFIX}/users",
            headers=auth_headers,
            params={"username": created_user["username"]}
        )
        
        assert response.status_code == 200
        items = response.json()["data"]["items"]
        assert len(items) >= 1
        assert any(u["username"] == created_user["username"] for u in items)
    
    def test_list_users_with_sort(self, auth_headers):
        """排序测试：按创建时间降序"""
        response = requests.get(
            f"{BASE_URL}{API_PREFIX}/users",
            headers=auth_headers,
            params={"sort": "createdAt", "order": "desc"}
        )
        
        assert response.status_code == 200
        items = response.json()["data"]["items"]
        if len(items) > 1:
            # 验证排序正确
            for i in range(len(items) - 1):
                assert items[i]["createdAt"] >= items[i + 1]["createdAt"]


# ============================================================
# PUT /users/{id} 更新用户测试
# ============================================================
class TestUpdateUserAPI:
    """PUT /api/v1/users/{id} 测试套件"""
    
    def test_update_user_with_valid_data_returns_200(
        self, auth_headers, created_user
    ):
        """正向测试：有效数据更新用户成功"""
        payload = {
            "username": "updated_username",
            "email": "updated@test.com"
        }
        
        response = requests.put(
            f"{BASE_URL}{API_PREFIX}/users/{created_user['id']}",
            headers=auth_headers,
            json=payload
        )
        
        assert response.status_code == 200
        data = response.json()["data"]
        assert data["username"] == payload["username"]
        assert data["email"] == payload["email"]
    
    def test_update_user_when_not_exists_returns_404(self, auth_headers):
        """负向测试：用户不存在返回404"""
        payload = {"username": "test", "email": "test@test.com"}
        
        response = requests.put(
            f"{BASE_URL}{API_PREFIX}/users/999999",
            headers=auth_headers,
            json=payload
        )
        
        assert response.status_code == 404
    
    def test_update_user_partial_fields_returns_200(
        self, auth_headers, created_user
    ):
        """部分更新：只更新指定字段"""
        original_email = created_user["email"]
        payload = {"username": "only_username_updated"}
        
        response = requests.put(
            f"{BASE_URL}{API_PREFIX}/users/{created_user['id']}",
            headers=auth_headers,
            json=payload
        )
        
        assert response.status_code == 200
        data = response.json()["data"]
        assert data["username"] == payload["username"]
        # 未更新的字段保持不变
        assert data["email"] == original_email


# ============================================================
# DELETE /users/{id} 删除用户测试
# ============================================================
class TestDeleteUserAPI:
    """DELETE /api/v1/users/{id} 测试套件"""
    
    def test_delete_user_when_exists_returns_204(self, auth_headers):
        """正向测试：删除存在的用户成功"""
        # 先创建一个用户
        create_response = requests.post(
            f"{BASE_URL}{API_PREFIX}/users",
            headers=auth_headers,
            json={
                "username": "to_be_deleted",
                "email": "delete@test.com",
                "password": "Delete@123"
            }
        )
        user_id = create_response.json()["data"]["id"]
        
        # 删除用户
        response = requests.delete(
            f"{BASE_URL}{API_PREFIX}/users/{user_id}",
            headers=auth_headers
        )
        
        assert response.status_code == 204
        
        # 验证用户已删除
        get_response = requests.get(
            f"{BASE_URL}{API_PREFIX}/users/{user_id}",
            headers=auth_headers
        )
        assert get_response.status_code == 404
    
    def test_delete_user_when_not_exists_returns_404(self, auth_headers):
        """负向测试：删除不存在的用户返回404"""
        response = requests.delete(
            f"{BASE_URL}{API_PREFIX}/users/999999",
            headers=auth_headers
        )
        
        assert response.status_code == 404
    
    def test_delete_user_idempotent(self, auth_headers):
        """幂等性测试：重复删除返回404"""
        # 先创建并删除一个用户
        create_response = requests.post(
            f"{BASE_URL}{API_PREFIX}/users",
            headers=auth_headers,
            json={
                "username": "idempotent_test",
                "email": "idempotent@test.com",
                "password": "Test@123456"
            }
        )
        user_id = create_response.json()["data"]["id"]
        
        # 第一次删除
        requests.delete(
            f"{BASE_URL}{API_PREFIX}/users/{user_id}",
            headers=auth_headers
        )
        
        # 第二次删除（幂等性验证）
        response = requests.delete(
            f"{BASE_URL}{API_PREFIX}/users/{user_id}",
            headers=auth_headers
        )
        
        assert response.status_code == 404
```

</details>

### 5.3 Java API测试示例（JUnit 5 + RestAssured）

<details>
<summary>点击展开Java API测试完整示例</summary>

```java
package com.example.api.tests;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;

import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

/**
 * 用户API接口测试
 * 测试目标: /api/v1/users
 */
@DisplayName("用户API测试")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class UserApiTest {

    private static String authToken;
    private static Long createdUserId;

    @BeforeAll
    static void setup() {
        RestAssured.baseURI = "http://localhost:8080";
        RestAssured.basePath = "/api/v1";
        
        // 获取认证Token
        authToken = given()
            .contentType(ContentType.JSON)
            .body("{\"username\":\"admin\",\"password\":\"Admin@123\"}")
        .when()
            .post("/auth/login")
        .then()
            .statusCode(200)
            .extract()
            .path("data.token");
    }

    // ==================== POST /users 测试 ====================
    
    @Nested
    @DisplayName("POST /users 创建用户")
    class CreateUserTests {
        
        @Test
        @Order(1)
        @DisplayName("正向测试：有效数据创建用户返回201")
        void createUser_withValidData_returns201() {
            createdUserId = given()
                .header("Authorization", "Bearer " + authToken)
                .contentType(ContentType.JSON)
                .body("{\"username\":\"apitest\",\"email\":\"api@test.com\",\"password\":\"ApiTest@123\"}")
            .when()
                .post("/users")
            .then()
                .statusCode(201)
                .body("data.id", notNullValue())
                .body("data.username", equalTo("apitest"))
                .body("data.email", equalTo("api@test.com"))
                .body("data.password", nullValue())
                .extract()
                .path("data.id");
        }
        
        @Test
        @DisplayName("认证测试：无Token返回401")
        void createUser_withoutAuth_returns401() {
            given()
                .contentType(ContentType.JSON)
                .body("{\"username\":\"test\",\"email\":\"t@t.com\",\"password\":\"Test@123\"}")
            .when()
                .post("/users")
            .then()
                .statusCode(401);
        }
        
        @ParameterizedTest
        @DisplayName("参数验证：缺少必填字段返回400")
        @CsvSource({
            "'{\"email\":\"t@t.com\",\"password\":\"Test@123\"}', username",
            "'{\"username\":\"test\",\"password\":\"Test@123\"}', email",
            "'{\"username\":\"test\",\"email\":\"t@t.com\"}', password"
        })
        void createUser_missingRequiredField_returns400(String body, String missingField) {
            given()
                .header("Authorization", "Bearer " + authToken)
                .contentType(ContentType.JSON)
                .body(body)
            .when()
                .post("/users")
            .then()
                .statusCode(400)
                .body("message", containsStringIgnoringCase(missingField));
        }
        
        @ParameterizedTest
        @DisplayName("参数验证：无效邮箱格式返回400")
        @ValueSource(strings = {"invalid", "test@", "@example.com", "test@.com"})
        void createUser_withInvalidEmail_returns400(String invalidEmail) {
            given()
                .header("Authorization", "Bearer " + authToken)
                .contentType(ContentType.JSON)
                .body(String.format(
                    "{\"username\":\"test\",\"email\":\"%s\",\"password\":\"Test@123\"}", 
                    invalidEmail
                ))
            .when()
                .post("/users")
            .then()
                .statusCode(400);
        }
        
        @Test
        @DisplayName("性能测试：响应时间小于500ms")
        void createUser_responseTime_under500ms() {
            given()
                .header("Authorization", "Bearer " + authToken)
                .contentType(ContentType.JSON)
                .body("{\"username\":\"perftest\",\"email\":\"perf@test.com\",\"password\":\"Perf@123\"}")
            .when()
                .post("/users")
            .then()
                .time(lessThan(500L));
        }
    }

    // ==================== GET /users/{id} 测试 ====================
    
    @Nested
    @DisplayName("GET /users/{id} 获取用户")
    class GetUserTests {
        
        @Test
        @Order(2)
        @DisplayName("正向测试：用户存在返回200")
        void getUser_whenExists_returns200() {
            given()
                .header("Authorization", "Bearer " + authToken)
            .when()
                .get("/users/{id}", createdUserId)
            .then()
                .statusCode(200)
                .body("data.id", equalTo(createdUserId.intValue()))
                .body("data.username", equalTo("apitest"));
        }
        
        @Test
        @DisplayName("负向测试：用户不存在返回404")
        void getUser_whenNotExists_returns404() {
            given()
                .header("Authorization", "Bearer " + authToken)
            .when()
                .get("/users/{id}", 999999)
            .then()
                .statusCode(404);
        }
    }

    // ==================== GET /users 列表测试 ====================
    
    @Nested
    @DisplayName("GET /users 用户列表")
    class ListUsersTests {
        
        @Test
        @DisplayName("正向测试：获取用户列表成功")
        void listUsers_returns200() {
            given()
                .header("Authorization", "Bearer " + authToken)
            .when()
                .get("/users")
            .then()
                .statusCode(200)
                .body("data.items", notNullValue())
                .body("data.total", greaterThanOrEqualTo(0));
        }
        
        @ParameterizedTest
        @DisplayName("分页测试")
        @CsvSource({
            "1, 10, 200",
            "1, 1, 200",
            "0, 10, 400",
            "-1, 10, 400",
            "1, 0, 400"
        })
        void listUsers_pagination(int page, int pageSize, int expectedStatus) {
            given()
                .header("Authorization", "Bearer " + authToken)
                .queryParam("page", page)
                .queryParam("pageSize", pageSize)
            .when()
                .get("/users")
            .then()
                .statusCode(expectedStatus);
        }
    }

    // ==================== DELETE /users/{id} 测试 ====================
    
    @Nested
    @DisplayName("DELETE /users/{id} 删除用户")
    class DeleteUserTests {
        
        @Test
        @Order(99)
        @DisplayName("正向测试：删除用户成功")
        void deleteUser_whenExists_returns204() {
            given()
                .header("Authorization", "Bearer " + authToken)
            .when()
                .delete("/users/{id}", createdUserId)
            .then()
                .statusCode(204);
            
            // 验证已删除
            given()
                .header("Authorization", "Bearer " + authToken)
            .when()
                .get("/users/{id}", createdUserId)
            .then()
                .statusCode(404);
        }
    }
}
```

</details>

---

## 六、响应验证规范

### 6.1 HTTP响应验证矩阵

| 状态码 | 含义 | 必须验证项 | 断言示例 |
|--------|------|------------|----------|
| 200 | 成功 | 响应体结构、数据正确性 | `assert response.json()["data"] is not None` |
| 201 | 创建成功 | 返回ID、数据正确性 | `assert "id" in response.json()["data"]` |
| 204 | 删除成功 | 响应体为空 | `assert response.content == b""` |
| 400 | 参数错误 | 错误码、错误消息 | `assert "message" in response.json()` |
| 401 | 未认证 | 错误消息 | `assert response.status_code == 401` |
| 403 | 无权限 | 错误消息 | `assert "forbidden" in response.json()["message"].lower()` |
| 404 | 不存在 | 错误消息 | `assert response.status_code == 404` |
| 409 | 冲突 | 冲突原因 | `assert "已存在" in response.json()["message"]` |
| 500 | 服务器错误 | 不暴露堆栈 | `assert "stack" not in response.json()` |

### 6.2 响应体结构验证

```python
def assert_response_structure(response: dict, expected_schema: dict):
    """验证响应体结构"""
    for field, field_type in expected_schema.items():
        assert field in response, f"缺少字段: {field}"
        
        if field_type == "string":
            assert isinstance(response[field], str)
        elif field_type == "integer":
            assert isinstance(response[field], int)
        elif field_type == "number":
            assert isinstance(response[field], (int, float))
        elif field_type == "boolean":
            assert isinstance(response[field], bool)
        elif field_type == "array":
            assert isinstance(response[field], list)
        elif field_type == "object":
            assert isinstance(response[field], dict)

# 使用示例
user_schema = {
    "id": "integer",
    "username": "string",
    "email": "string",
    "createdAt": "string"
}
assert_response_structure(response.json()["data"], user_schema)
```

### 6.3 分页响应验证

```python
def assert_pagination_response(response: dict, page: int, page_size: int):
    """验证分页响应"""
    data = response["data"]
    
    # 验证结构
    assert "items" in data, "缺少items字段"
    assert "total" in data, "缺少total字段"
    assert "page" in data, "缺少page字段"
    assert "pageSize" in data, "缺少pageSize字段"
    
    # 验证数据
    assert isinstance(data["items"], list)
    assert len(data["items"]) <= page_size
    assert data["page"] == page
    assert data["pageSize"] == page_size
    assert data["total"] >= 0
```

---

## 七、测试报告规范

### 7.1 测试报告结构

```
测试报告
├── 1. 报告摘要
│   ├── 项目信息
│   ├── 执行概况
│   └── 结论建议
├── 2. 测试结果统计
│   ├── 用例执行统计
│   ├── 通过率分析
│   └── 接口覆盖率
├── 3. 缺陷分析
│   ├── 缺陷分布
│   ├── 缺陷详情
│   └── 风险评估
├── 4. 详细测试结果
│   ├── 按模块分类
│   └── 失败用例详情
└── 5. 附录
    ├── 测试环境
    └── 测试数据
```

### 7.2 测试报告模板

#### 报告摘要

```markdown
# API测试报告

## 1. 报告摘要

| 项目 | 内容 |
|------|------|
| **项目名称** | XXX系统API测试 |
| **测试版本** | v1.2.0 |
| **测试环境** | TEST |
| **执行时间** | 2024-12-04 10:00 - 11:30 |
| **执行人员** | 测试团队 |
| **报告生成时间** | 2024-12-04 11:35 |

### 执行结论

| 指标 | 结果 | 达标 |
|------|------|------|
| 用例通过率 | 94.67% | ✅ (目标≥90%) |
| 接口覆盖率 | 100% | ✅ (目标=100%) |
| P0用例通过率 | 100% | ✅ (目标=100%) |
| 阻塞缺陷 | 0 | ✅ |

**总体结论**：✅ 测试通过，可以发布
```

#### 测试结果统计

```markdown
## 2. 测试结果统计

### 2.1 用例执行统计

| 状态 | 数量 | 占比 |
|------|------|------|
| ✅ 通过 | 142 | 94.67% |
| ❌ 失败 | 5 | 3.33% |
| ⏸️ 阻塞 | 2 | 1.33% |
| ⏭️ 跳过 | 1 | 0.67% |
| **总计** | **150** | **100%** |

### 2.2 按优先级统计

| 优先级 | 总数 | 通过 | 失败 | 通过率 |
|--------|------|------|------|--------|
| P0 | 30 | 30 | 0 | 100% |
| P1 | 50 | 48 | 2 | 96% |
| P2 | 45 | 42 | 3 | 93.3% |
| P3 | 25 | 22 | 0 | 88% |

### 2.3 按接口统计

| 接口 | 总数 | 通过 | 失败 | 通过率 |
|------|------|------|------|--------|
| POST /users | 15 | 14 | 1 | 93.3% |
| GET /users/{id} | 10 | 10 | 0 | 100% |
| GET /users | 12 | 11 | 1 | 91.7% |
| PUT /users/{id} | 10 | 9 | 1 | 90% |
| DELETE /users/{id} | 8 | 8 | 0 | 100% |

### 2.4 接口覆盖率

| 模块 | 总接口数 | 已覆盖 | 覆盖率 |
|------|----------|--------|--------|
| 用户管理 | 5 | 5 | 100% |
| 订单管理 | 8 | 8 | 100% |
| 商品管理 | 6 | 6 | 100% |
| **总计** | **19** | **19** | **100%** |
```

#### 缺陷分析

```markdown
## 3. 缺陷分析

### 3.1 缺陷分布

| 严重程度 | 数量 | 占比 |
|----------|------|------|
| 🔴 致命 | 0 | 0% |
| 🟠 严重 | 2 | 28.6% |
| 🟡 一般 | 3 | 42.8% |
| 🟢 轻微 | 2 | 28.6% |
| **总计** | **7** | **100%** |

### 3.2 缺陷详情

| 缺陷ID | 严重程度 | 接口 | 描述 | 状态 |
|--------|----------|------|------|------|
| BUG-001 | 🟠严重 | POST /orders | 并发创建订单时库存扣减异常 | 已修复 |
| BUG-002 | 🟠严重 | PUT /users | 用户名包含特殊字符时更新失败 | 待修复 |
| BUG-003 | 🟡一般 | GET /orders | 订单列表分页参数超出范围时返回500 | 已修复 |
```

#### 失败用例详情

```markdown
## 4. 失败用例详情

### TC_ORDER_API_005: POST /orders 并发创建

| 项目 | 内容 |
|------|------|
| **用例ID** | TC_ORDER_API_005 |
| **用例名称** | 并发创建订单库存校验 |
| **接口** | POST /api/v1/orders |
| **优先级** | P1 |
| **执行状态** | ❌ 失败 |
| **关联缺陷** | BUG-001 |

**请求数据**：
```json
{
  "productId": 1001,
  "quantity": 1
}
```

**预期结果**：
- 并发20个请求，库存10个
- 成功订单数 ≤ 10
- 超出库存的请求返回400

**实际结果**：
- 成功订单数 = 15
- 库存出现负数

**错误日志**：
```
[ERROR] 2024-12-04 10:25:33 - Stock became negative: product_id=1001, stock=-5
```
```

### 7.3 自动化测试报告生成

#### pytest-html 报告配置

```python
# conftest.py
import pytest
from datetime import datetime

def pytest_html_report_title(report):
    report.title = "API自动化测试报告"

def pytest_configure(config):
    config._metadata["项目名称"] = "XXX系统"
    config._metadata["测试环境"] = "TEST"
    config._metadata["执行时间"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
```

#### 执行命令

```bash
# 生成HTML报告
pytest tests/ --html=reports/report.html --self-contained-html

# 生成JUnit XML报告（用于CI集成）
pytest tests/ --junitxml=reports/junit.xml
```

#### Allure 报告配置

```python
import allure

@allure.epic("用户管理")
@allure.feature("用户创建")
@allure.story("正常创建用户")
@allure.severity(allure.severity_level.CRITICAL)
class TestCreateUserAPI:
    
    @allure.title("使用有效数据创建用户")
    @allure.description("验证使用有效的用户数据可以成功创建用户")
    def test_create_user_with_valid_data(self, auth_headers):
        with allure.step("准备测试数据"):
            payload = {"username": "testuser", "email": "test@test.com"}
        
        with allure.step("发送创建请求"):
            response = requests.post(f"{BASE_URL}/users", headers=auth_headers, json=payload)
        
        with allure.step("验证响应"):
            assert response.status_code == 201
            allure.attach(str(response.json()), "响应内容", allure.attachment_type.JSON)
```

```bash
# 生成Allure报告
pytest tests/ --alluredir=reports/allure-results
allure serve reports/allure-results
```

#### 报告数据结构（JSON格式）

```json
{
  "report_info": {
    "project": "XXX系统",
    "version": "v1.2.0",
    "environment": "TEST",
    "start_time": "2024-12-04T10:00:00",
    "end_time": "2024-12-04T11:30:00"
  },
  "summary": {
    "total": 150,
    "passed": 142,
    "failed": 5,
    "blocked": 2,
    "skipped": 1,
    "pass_rate": 94.67
  },
  "by_priority": {
    "P0": {"total": 30, "passed": 30, "failed": 0},
    "P1": {"total": 50, "passed": 48, "failed": 2}
  },
  "by_api": [
    {"api": "POST /users", "total": 15, "passed": 14, "failed": 1},
    {"api": "GET /users/{id}", "total": 10, "passed": 10, "failed": 0}
  ],
  "coverage": {
    "total_apis": 19,
    "covered_apis": 19,
    "coverage_rate": 100
  },
  "defects": [
    {
      "id": "BUG-001",
      "severity": "serious",
      "api": "POST /orders",
      "description": "并发创建订单时库存扣减异常",
      "status": "fixed"
    }
  ]
}
```

---

## 八、注意事项与最佳实践

### 8.1 测试数据管理

| 原则 | 说明 | 实践方法 |
|------|------|----------|
| **数据隔离** | 测试数据与生产数据完全隔离 | 使用独立测试环境/数据库 |
| **数据独立** | 每个用例使用独立数据 | 用例内创建和清理数据 |
| **数据清理** | 测试后清理产生的数据 | 使用fixture的yield清理 |
| **数据可追溯** | 测试数据有明确标识 | 使用统一前缀如`test_` |

### 8.2 常见错误与解决方案

| 错误类型 | 问题描述 | 解决方案 |
|----------|----------|----------|
| 测试污染 | 用例间数据相互影响 | 每个用例独立setup/teardown |
| 顺序依赖 | 用例依赖执行顺序 | 每个用例自包含，不依赖其他用例 |
| 硬编码 | URL、端口写死在代码中 | 使用配置文件和环境变量 |
| 脆弱测试 | 依赖外部服务状态 | 使用Mock或测试替身 |
| 断言不足 | 只验证状态码 | 完整验证响应结构和内容 |

### 8.3 测试优先级定义

| 级别 | 定义 | 场景示例 | CI策略 |
|------|------|----------|--------|
| **P0** | 冒烟测试/阻塞测试 | 登录、核心业务流程 | 每次提交必跑 |
| **P1** | 核心功能测试 | CRUD正向场景 | 每次提交必跑 |
| **P2** | 重要功能测试 | 参数验证、边界值 | 每日定时执行 |
| **P3** | 一般功能测试 | 异常场景、性能测试 | 发版前执行 |

### 8.4 测试环境建议

```yaml
# 测试环境配置示例
environments:
  local:
    base_url: http://localhost:8080
    db: localhost:3306/test_db
    
  dev:
    base_url: http://dev-api.example.com
    db: dev-db.example.com:3306/test_db
    
  staging:
    base_url: http://staging-api.example.com
    db: staging-db.example.com:3306/test_db
```

### 8.5 CI/CD集成建议

```yaml
# GitHub Actions 示例
name: API Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: pip install -r requirements.txt
      
      - name: Run P0/P1 tests
        run: pytest tests/ -m "p0 or p1" --html=report.html
      
      - name: Upload test report
        uses: actions/upload-artifact@v3
        with:
          name: test-report
          path: report.html
```

---

## 九、附录

### 9.1 常用断言方法速查

#### Python (pytest + requests)

```python
# 状态码断言
assert response.status_code == 200
assert response.status_code in [200, 201]

# 响应体断言
assert response.json()["data"] is not None
assert "id" in response.json()["data"]
assert response.json()["data"]["name"] == "expected"

# 响应头断言
assert response.headers["Content-Type"] == "application/json"

# 响应时间断言
assert response.elapsed.total_seconds() < 0.5

# 异常断言
with pytest.raises(requests.exceptions.Timeout):
    requests.get(url, timeout=0.001)
```

#### Java (JUnit 5 + RestAssured)

```java
// 状态码断言
.then().statusCode(200)
.then().statusCode(anyOf(is(200), is(201)))

// 响应体断言
.then().body("data", notNullValue())
.then().body("data.id", equalTo(1))
.then().body("data.items", hasSize(10))
.then().body("data.items[0].name", equalTo("test"))

// 响应头断言
.then().header("Content-Type", "application/json")

// 响应时间断言
.then().time(lessThan(500L))
```

### 9.2 HTTP状态码速查

| 状态码 | 含义 | 典型场景 |
|--------|------|----------|
| 200 | OK | GET/PUT/PATCH成功 |
| 201 | Created | POST创建成功 |
| 204 | No Content | DELETE成功 |
| 400 | Bad Request | 参数验证失败 |
| 401 | Unauthorized | 未登录/Token过期 |
| 403 | Forbidden | 无权限访问 |
| 404 | Not Found | 资源不存在 |
| 409 | Conflict | 资源冲突（重复） |
| 422 | Unprocessable Entity | 业务验证失败 |
| 429 | Too Many Requests | 限流 |
| 500 | Internal Server Error | 服务器异常 |
| 502 | Bad Gateway | 网关错误 |
| 503 | Service Unavailable | 服务不可用 |
| 504 | Gateway Timeout | 网关超时 |

### 9.3 正则表达式速查

```python
PATTERNS = {
    "email": r'^[\w.-]+@[\w.-]+\.\w{2,}$',
    "phone_cn": r'^1[3-9]\d{9}$',
    "uuid": r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
    "jwt": r'^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$',
    "iso_date": r'^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}',
    "url": r'^https?://[\w.-]+(:\d+)?(/\S*)?$',
    "ipv4": r'^(\d{1,3}\.){3}\d{1,3}$',
}
```


