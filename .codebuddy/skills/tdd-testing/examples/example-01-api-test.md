# 示例 1: 基于 API 代码生成测试（api-test 策略）

本示例展示完整的测试工作流，包括所有强制检查点。

## 输入：Controller 代码

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @PostMapping
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody CreateUserRequest request) {
        UserDTO user = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        UserDTO user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request) {
        UserDTO user = userService.updateUser(id, request);
        return ResponseEntity.ok(user);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
```

## 步骤 0: 输入判断

```yaml
输入类型: 代码文件
代码类型: HTTP RESTful API 代码
判断依据:
  - 包含 @RestController 注解
  - 包含 @RequestMapping("/api/users")
  - 文件名为 UserController.java
选择策略: design-test-case/api-test
测试类型: 集成测试
```

## 步骤 1: 生成测试用例设计文档

```markdown
# 用户管理 API 测试用例设计文档

## 元信息

| 属性 | 值 |
|------|-----|
| change_id | USER-API-001 |
| domain | 用户管理 |
| test_type | 集成测试 |
| api_base_path | /api/users |

## 测试范围

- 用户创建 API (POST /api/users)
- 用户查询 API (GET /api/users/{id})
- 用户更新 API (PUT /api/users/{id})
- 用户删除 API (DELETE /api/users/{id})

## 测试用例

### 1. 创建用户 (POST /api/users)

#### TC-USER-001: 创建用户-正常流程-返回201

**前置条件**: 无

**测试数据**:
```json
{
  "name": "张三",
  "email": "zhangsan@example.com",
  "phone": "13800138000"
}
```

**预期结果**:
- 状态码: 201 Created
- 响应体包含 id、name、email、phone
- 数据库中存在该用户记录

**清理**: 删除创建的用户记录

---

#### TC-USER-002: 创建用户-邮箱重复-返回409

**前置条件**: 数据库中已存在 email=zhangsan@example.com 的用户

**测试数据**:
```json
{
  "name": "李四",
  "email": "zhangsan@example.com",
  "phone": "13900139000"
}
```

**预期结果**:
- 状态码: 409 Conflict
- 响应体包含错误信息

**清理**: 无需清理

---

#### TC-USER-003: 创建用户-必填字段缺失-返回400

**前置条件**: 无

**测试数据**:
```json
{
  "name": "",
  "email": "test@example.com"
}
```

**预期结果**:
- 状态码: 400 Bad Request
- 响应体包含字段验证错误信息

**清理**: 无需清理

### 2. 查询用户 (GET /api/users/{id})

#### TC-USER-004: 查询用户-存在-返回200

**前置条件**: 数据库中存在 id=1 的用户

**请求**: GET /api/users/1

**预期结果**:
- 状态码: 200 OK
- 响应体包含用户完整信息

**清理**: 无需清理

---

#### TC-USER-005: 查询用户-不存在-返回404

**前置条件**: 数据库中不存在 id=99999 的用户

**请求**: GET /api/users/99999

**预期结果**:
- 状态码: 404 Not Found
- 响应体包含错误信息

**清理**: 无需清理
```

---

## ✅ 检查点1: 测试用例完整性验证

```yaml
检查点1验证结果:

结构完整性: ✅ 通过
  - [x] 包含元信息（change_id=USER-API-001, domain=用户管理, test_type=集成测试）
  - [x] 包含测试范围（4个API端点）
  - [x] 包含用例分类（功能/参数/异常）

用例规范性: ✅ 通过
  - [x] 用例 ID 唯一 (TC-USER-001 ~ TC-USER-005)
  - [x] 命名遵循 Method-Scenario-Expected 模式
  - [x] 包含前置条件
  - [x] 包含测试数据
  - [x] 包含预期结果

覆盖完整性: ✅ 通过 (80%+)
  - [x] 正常流程覆盖 (TC-USER-001, TC-USER-004)
  - [x] 参数验证覆盖 (TC-USER-003)
  - [x] 异常场景覆盖 (TC-USER-002, TC-USER-005)
  - [ ] 安全测试覆盖（可选）

可执行性: ✅ 通过
  - [x] 测试数据明确（JSON格式）
  - [x] 清理策略明确（删除创建的用户）

检查点1结论: ✅ 通过，可以进入步骤2
```

---

## 步骤 2: 生成测试代码

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class UserApiTest extends BaseApiTest {
    
    @LocalServerPort
    private int port;
    
    private OkHttpClient client;
    private String baseUrl;
    private List<Long> createdUserIds = new ArrayList<>();
    
    @BeforeEach
    void setUp() {
        client = new OkHttpClient();
        baseUrl = "http://localhost:" + port + "/api/users";
    }
    
    // TC-USER-001: 创建用户-正常流程-返回201
    @Test
    void testCreateUser_ValidRequest_Returns201() throws Exception {
        // Arrange
        String requestBody = """
            {
              "name": "张三",
              "email": "zhangsan@example.com",
              "phone": "13800138000"
            }
            """;
        
        Request request = new Request.Builder()
            .url(baseUrl)
            .post(RequestBody.create(requestBody, MediaType.parse("application/json")))
            .build();
        
        // Act
        try (Response response = client.newCall(request).execute()) {
            // Assert
            assertThat(response.code()).isEqualTo(201);
            
            String responseBody = response.body().string();
            JsonNode json = objectMapper.readTree(responseBody);
            
            assertThat(json.has("id")).isTrue();
            assertThat(json.get("name").asText()).isEqualTo("张三");
            assertThat(json.get("email").asText()).isEqualTo("zhangsan@example.com");
            
            // 记录创建的用户ID用于清理
            createdUserIds.add(json.get("id").asLong());
        }
    }
    
    // TC-USER-002: 创建用户-邮箱重复-返回409
    @Test
    void testCreateUser_DuplicateEmail_Returns409() throws Exception {
        // Arrange - 先创建一个用户
        Long existingUserId = createTestUser("existing@example.com");
        createdUserIds.add(existingUserId);
        
        String requestBody = """
            {
              "name": "李四",
              "email": "existing@example.com",
              "phone": "13900139000"
            }
            """;
        
        Request request = new Request.Builder()
            .url(baseUrl)
            .post(RequestBody.create(requestBody, MediaType.parse("application/json")))
            .build();
        
        // Act
        try (Response response = client.newCall(request).execute()) {
            // Assert
            assertThat(response.code()).isEqualTo(409);
        }
    }
    
    // TC-USER-003: 创建用户-必填字段缺失-返回400
    @Test
    void testCreateUser_MissingRequiredField_Returns400() throws Exception {
        // Arrange
        String requestBody = """
            {
              "name": "",
              "email": "test@example.com"
            }
            """;
        
        Request request = new Request.Builder()
            .url(baseUrl)
            .post(RequestBody.create(requestBody, MediaType.parse("application/json")))
            .build();
        
        // Act
        try (Response response = client.newCall(request).execute()) {
            // Assert
            assertThat(response.code()).isEqualTo(400);
        }
    }
    
    // TC-USER-005: 查询用户-不存在-返回404
    @Test
    void testGetUser_NotFound_Returns404() throws Exception {
        // Arrange
        Request request = new Request.Builder()
            .url(baseUrl + "/99999")
            .get()
            .build();
        
        // Act
        try (Response response = client.newCall(request).execute()) {
            // Assert
            assertThat(response.code()).isEqualTo(404);
        }
    }
    
    // ========== 清理代码 ==========
    
    public Map<String, Object> getCleanupReport() {
        Map<String, Object> report = new HashMap<>();
        report.put("pendingCount", createdUserIds.size());
        report.put("userIds", new ArrayList<>(createdUserIds));
        return report;
    }
    
    public Map<String, Object> executeCleanup() {
        int success = 0;
        int failed = 0;
        
        for (Long userId : createdUserIds) {
            try {
                Request request = new Request.Builder()
                    .url(baseUrl + "/" + userId)
                    .delete()
                    .build();
                try (Response response = client.newCall(request).execute()) {
                    if (response.isSuccessful()) {
                        success++;
                    } else {
                        failed++;
                    }
                }
            } catch (Exception e) {
                failed++;
            }
        }
        
        createdUserIds.clear();
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", success);
        result.put("failed", failed);
        return result;
    }
}
```

---

## ✅ 检查点2: 代码完整性验证

```yaml
检查点2验证结果:

代码完整性: ✅ 通过
  - [x] 所有测试方法已生成（5个测试方法）
  - [x] 所有 import 语句完整
  - [x] 所有依赖类已引用
  - [x] 清理代码已生成（getCleanupReport, executeCleanup）

语法检查: ✅ 通过
  - [x] 无 Java 语法错误
  - [x] 括号匹配正确
  - [x] 字符串闭合正确
  - [x] 注解使用正确

编译检查: ✅ 通过
  执行命令: mvn test-compile
  结果: BUILD SUCCESS
  - [x] 无编译错误
  - [x] 无编译警告

规范检查: ✅ 通过
  - [x] 测试方法命名规范（testMethod_Scenario_Expected）
  - [x] 遵循 AAA 模式（Arrange-Act-Assert）
  - [x] HTTP 请求配置正确

检查点2结论: ✅ 通过，可以进入步骤3
```

---

## 步骤 3: 执行测试

```bash
mvn test -Dtest=UserApiTest
```

---

## ✅ 检查点3: 测试报告输出

```markdown
# 测试执行报告

## 基本信息

| 属性 | 值 |
|------|-----|
| **执行时间** | 2024-01-15 14:30:25 |
| **测试环境** | 开发环境 |
| **测试范围** | 用户管理 API (UserApiTest) |
| **测试类型** | 集成测试 |

## 测试统计

| 指标 | 数值 | 百分比 |
|------|------|--------|
| 总用例数 | 5 | 100% |
| ✅ 通过 | 4 | 80% |
| ❌ 失败 | 1 | 20% |
| ⏭️ 跳过 | 0 | 0% |
| 执行耗时 | 3.2s | - |

## 详细结果

### 通过的测试

- ✅ `testCreateUser_ValidRequest_Returns201` (0.8s)
- ✅ `testCreateUser_MissingRequiredField_Returns400` (0.3s)
- ✅ `testGetUser_NotFound_Returns404` (0.2s)
- ✅ `testCreateUser_DuplicateEmail_Returns409` (0.5s)

### 失败的测试

#### ❌ testGetUser_Exists_Returns200

| 属性 | 内容 |
|------|------|
| **失败原因** | 预置数据不存在 |
| **期望值** | 状态码 200 |
| **实际值** | 状态码 404 |
| **堆栈跟踪** | `AssertionError: expected: <200> but was: <404>` |
| **修复建议** | 在测试前确保预置用户数据存在，或使用 @BeforeEach 创建测试数据 |

## 性能数据

| 指标 | 数值 |
|------|------|
| 平均响应时间 | 156ms |
| P95 响应时间 | 320ms |
| P99 响应时间 | 450ms |
| 最慢测试 | testCreateUser_ValidRequest_Returns201 (0.8s) |

## 总结

### 测试结论

**❌ 失败** - 5 个测试用例中 1 个失败，通过率 80%

### 主要问题

1. **TC-USER-004 测试失败**: 查询存在用户的测试用例失败，原因是测试环境中缺少预置数据

### 风险评估

**中** - 核心创建功能正常，但查询功能存在测试数据依赖问题

### 后续建议

1. 修复 testGetUser_Exists_Returns200 测试，添加 @BeforeEach 预置数据
2. 考虑使用 @Sql 注解在测试前初始化数据
3. 补充用户更新和删除的测试用例
4. 添加认证相关的测试用例（401/403）
```

---

## 步骤 4: 清理询问

```
测试执行完成。

📊 待清理数据摘要:
- 创建的用户数: 2
- 用户 ID 列表: [101, 102]

❓ 是否需要执行清理代码清理测试数据？[是/否]
```

**用户选择**: 是

```
执行清理中...

✅ 清理完成:
- 成功删除: 2
- 删除失败: 0

测试数据已全部清理。
```
