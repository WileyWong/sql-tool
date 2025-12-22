# API 测试代码生成策略

根据测试用例文档生成 Java API 自动化测试代码，使用 OkHttp3 + JUnit 5，支持请求构建、响应校验和数据清理。

---

## 适用场景

- 已通过标准化检查的 API 测试用例文档
- 集成测试/接口测试
- 需要真实调用 API 端点

---

## 技术栈

| 组件 | 版本 | 用途 |
|------|------|------|
| JUnit 5 | 5.9+ | 测试框架 |
| OkHttp3 | 4.10+ | HTTP 客户端 |
| Jackson | 2.14+ | JSON 处理 |
| Java | 11+ | 运行环境 |

---

## 代码结构

### 测试类模板

```java
package com.example.{module}.test;

import com.fasterxml.jackson.databind.JsonNode;
import okhttp3.Request;
import org.junit.jupiter.api.*;
import static com.example.{module}.util.ApiTestUtil.*;

/**
 * {模块名} API 接口测试
 * 覆盖: 正常/异常/边界场景
 */
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@DisplayName("{模块名} API 测试")
public class {ModuleName}ApiTest {

    // 配置
    private static final String BASE_URL = "http://localhost:8080";
    private static final String TEST_STAFF_ID = "test123";
    private static final String TEST_STAFF_NAME = "TestUser";
    
    // 测试数据
    private static final String TEST_USERNAME = "testuser";
    private static final String TEST_EMAIL = "test@example.com";
    
    // 清理注册表
    private static final CleanupRegistry cleanupRegistry = new CleanupRegistry();
    
    @Test
    @DisplayName("执行所有测试")
    public void testAll() {
        resetTestStats();
        try {
            System.out.println("\n" + "=".repeat(60));
            System.out.println("开始执行 {模块名} API 测试");
            System.out.println("=".repeat(60) + "\n");
            
            // 正常场景
            System.out.println("【正常场景】");
            testCreateUser();
            testQueryUser();
            
            // 异常场景
            System.out.println("\n【异常场景】");
            testCreateUser_EmptyUsername_Error();
            
            // 边界场景
            System.out.println("\n【边界场景】");
            testCreateUser_MaxLength_Boundary();
            
        } finally {
            System.out.println("\n" + "=".repeat(60));
            printTestStats();
            System.out.println("=".repeat(60) + "\n");
        }
    }
}
```

### 正常场景测试方法

```java
/**
 * TC001 - 创建用户成功
 * 预期: code=200, data.id 不为空
 */
@Test
@Order(1)
@DisplayName("TC001 - 创建用户成功")
private void testCreateUser() {
    // Arrange
    String requestBody = String.format(
        "{\"username\":\"%s\",\"email\":\"%s\"}", 
        TEST_USERNAME, TEST_EMAIL
    );
    
    Request request = buildPostRequest(
        BASE_URL, "/api/users", 
        requestBody, TEST_STAFF_ID, TEST_STAFF_NAME
    );
    
    // Act & Assert
    executeRequestWithValidation(request, "TC001-创建用户", response -> {
        JsonNode data = response.get("data");
        
        // 必填字段断言
        assertNotNull(data, "id", "用户ID不能为空");
        assertEquals(data, "username", TEST_USERNAME, "用户名不匹配");
        
        // 注册清理
        String userId = data.get("id").asText();
        cleanupRegistry.register("user", userId, "DELETE /api/users/" + userId);
        
        System.out.println("  ✓ 用户ID: " + userId);
    });
}
```

### 异常场景测试方法

```java
/**
 * TC010 - 创建用户失败（用户名为空）
 * 预期: code=400, message 包含 "用户名不能为空"
 */
@Test
@Order(10)
@DisplayName("TC010 - 参数校验失败")
private void testCreateUser_EmptyUsername_Error() {
    // Arrange
    String requestBody = "{\"username\":\"\",\"email\":\"test@example.com\"}";
    
    Request request = buildPostRequest(
        BASE_URL, "/api/users", 
        requestBody, TEST_STAFF_ID, TEST_STAFF_NAME
    );
    
    // Act & Assert
    executeRequestExpectingError(request, "TC010-参数校验", "400", "用户名不能为空");
}
```

### 边界值测试方法

```java
/**
 * TC020 - 用户名最大长度
 * 预期: code=200, 数据正确保存
 */
@Test
@Order(20)
@DisplayName("TC020 - 边界值测试")
private void testCreateUser_MaxLength_Boundary() {
    // Arrange
    String maxUsername = "a".repeat(20);  // 假设最大长度 20
    String requestBody = String.format(
        "{\"username\":\"%s\",\"email\":\"test@example.com\"}", 
        maxUsername
    );
    
    Request request = buildPostRequest(
        BASE_URL, "/api/users", 
        requestBody, TEST_STAFF_ID, TEST_STAFF_NAME
    );
    
    // Act & Assert
    executeRequestWithValidation(request, "TC020-边界值", response -> {
        JsonNode data = response.get("data");
        String saved = data.get("username").asText();
        
        assertTrue(saved.length() <= 20, "用户名长度超限");
        assertEquals(data, "username", maxUsername, "用户名不匹配");
        
        // 注册清理
        String userId = data.get("id").asText();
        cleanupRegistry.register("user", userId, "DELETE /api/users/" + userId);
        
        System.out.println("  ✓ 用户名长度: " + saved.length());
    });
}
```

---

## 清理代码

### CleanupRegistry 类

```java
/**
 * 测试数据清理注册表
 * 记录测试过程中创建的数据，支持手动清理
 */
public class CleanupRegistry {
    
    private static final String REGISTRY_FILE = "cleanup-registry.json";
    private final List<CleanupRecord> records = new ArrayList<>();
    
    /**
     * 注册待清理资源
     */
    public void register(String resourceType, String resourceId, String cleanupApi) {
        CleanupRecord record = new CleanupRecord(
            resourceType, 
            resourceId, 
            cleanupApi,
            Instant.now().toString(),
            "pending"
        );
        records.add(record);
        persist();
    }
    
    /**
     * 执行清理
     */
    public CleanupResult executeCleanup() {
        int success = 0;
        int failed = 0;
        
        for (CleanupRecord record : records) {
            if ("pending".equals(record.status)) {
                try {
                    // 执行清理 API
                    executeCleanupApi(record.cleanupApi);
                    record.status = "cleaned";
                    success++;
                } catch (Exception e) {
                    record.status = "failed";
                    record.error = e.getMessage();
                    failed++;
                }
            }
        }
        
        persist();
        return new CleanupResult(success, failed);
    }
    
    /**
     * 获取清理报告
     */
    public Map<String, Object> getCleanupReport() {
        long pending = records.stream()
            .filter(r -> "pending".equals(r.status))
            .count();
        
        return Map.of(
            "total", records.size(),
            "pending_count", pending,
            "cleaned_count", records.stream()
                .filter(r -> "cleaned".equals(r.status)).count(),
            "failed_count", records.stream()
                .filter(r -> "failed".equals(r.status)).count()
        );
    }
    
    private void persist() {
        // 保存到文件，支持进程重启后恢复
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.writeValue(new File(REGISTRY_FILE), records);
        } catch (IOException e) {
            System.err.println("Failed to persist cleanup registry: " + e.getMessage());
        }
    }
    
    private void executeCleanupApi(String cleanupApi) {
        // 解析并执行清理 API
        String[] parts = cleanupApi.split(" ");
        String method = parts[0];
        String path = parts[1];
        
        Request request;
        if ("DELETE".equals(method)) {
            request = buildDeleteRequest(BASE_URL, path, TEST_STAFF_ID, TEST_STAFF_NAME);
        } else {
            throw new UnsupportedOperationException("Unsupported cleanup method: " + method);
        }
        
        executeRequest(request);
    }
}

@Data
@AllArgsConstructor
class CleanupRecord {
    String resourceType;
    String resourceId;
    String cleanupApi;
    String createdAt;
    String status;
    String error;
}

@Data
@AllArgsConstructor
class CleanupResult {
    int success;
    int failed;
}
```

---

## 工具方法

### ApiTestUtil

```java
public class ApiTestUtil {
    
    private static final OkHttpClient client = new OkHttpClient();
    private static final ObjectMapper mapper = new ObjectMapper();
    
    private static int totalTests = 0;
    private static int passedTests = 0;
    private static int failedTests = 0;
    
    /**
     * 构建 GET 请求
     */
    public static Request buildGetRequest(String baseUrl, String path, 
                                          String staffId, String staffName) {
        return new Request.Builder()
            .url(baseUrl + path)
            .get()
            .addHeader("Content-Type", "application/json")
            .addHeader("X-Staff-Id", staffId)
            .addHeader("X-Staff-Name", staffName)
            .build();
    }
    
    /**
     * 构建 POST 请求
     */
    public static Request buildPostRequest(String baseUrl, String path, 
                                           String body, String staffId, String staffName) {
        return new Request.Builder()
            .url(baseUrl + path)
            .post(RequestBody.create(body, MediaType.parse("application/json")))
            .addHeader("Content-Type", "application/json")
            .addHeader("X-Staff-Id", staffId)
            .addHeader("X-Staff-Name", staffName)
            .build();
    }
    
    /**
     * 执行请求并验证
     */
    public static void executeRequestWithValidation(Request request, String testName,
                                                    Consumer<JsonNode> validator) {
        totalTests++;
        try {
            Response response = client.newCall(request).execute();
            String responseBody = response.body().string();
            JsonNode json = mapper.readTree(responseBody);
            
            // 基础断言
            assertEquals(200, response.code(), "HTTP状态码错误");
            assertEquals(0, json.get("code").asInt(), "业务码错误");
            
            // 自定义验证
            validator.accept(json);
            
            passedTests++;
            System.out.println("✅ " + testName + " - 通过");
            
        } catch (Exception e) {
            failedTests++;
            System.out.println("❌ " + testName + " - 失败: " + e.getMessage());
            throw new AssertionError(testName + " 失败", e);
        }
    }
    
    /**
     * 执行请求并期望错误
     */
    public static void executeRequestExpectingError(Request request, String testName,
                                                    String expectedCode, String expectedMessage) {
        totalTests++;
        try {
            Response response = client.newCall(request).execute();
            String responseBody = response.body().string();
            JsonNode json = mapper.readTree(responseBody);
            
            String actualCode = String.valueOf(json.get("code").asInt());
            String actualMessage = json.get("message").asText();
            
            assertEquals(expectedCode, actualCode, "错误码不匹配");
            assertTrue(actualMessage.contains(expectedMessage), 
                "错误消息不包含: " + expectedMessage);
            
            passedTests++;
            System.out.println("✅ " + testName + " - 通过 (预期错误)");
            
        } catch (Exception e) {
            failedTests++;
            System.out.println("❌ " + testName + " - 失败: " + e.getMessage());
            throw new AssertionError(testName + " 失败", e);
        }
    }
    
    /**
     * 打印测试统计
     */
    public static void printTestStats() {
        System.out.println("测试统计报告");
        System.out.println("============================================================");
        System.out.println("✅ 成功: " + passedTests);
        System.out.println("❌ 失败: " + failedTests);
        System.out.println("📊 总计: " + totalTests);
        System.out.printf("📈 成功率: %.2f%%\n", (double) passedTests / totalTests * 100);
    }
    
    public static void resetTestStats() {
        totalTests = 0;
        passedTests = 0;
        failedTests = 0;
    }
}
```

---

## 输出产物

| 文件 | 路径 | 说明 |
|------|------|------|
| 测试类 | `src/test/java/com/example/{module}/{ModuleName}ApiTest.java` | 测试代码 |
| 工具类 | `src/test/java/com/example/{module}/util/ApiTestUtil.java` | 请求构建和断言 |
| 清理类 | `src/test/java/com/example/{module}/util/CleanupRegistry.java` | 数据清理 |

---

## 验证清单

- [ ] 测试类命名正确 (`{ModuleName}ApiTest`)
- [ ] 包含 `testAll()` 方法
- [ ] 定义配置常量 (BASE_URL, TEST_STAFF_ID)
- [ ] 使用 ApiTestUtil 工具
- [ ] 添加认证 Header
- [ ] 校验必填字段
- [ ] 包含统计代码
- [ ] 注册清理数据
- [ ] 使用 `@Order` 控制顺序
- [ ] 使用 `@DisplayName` 注解

---

## 相关资源

- [ApiTestUtil 详细文档](../../../api-test-util.md)
- [测试用例规范](../../../test-case-spec-standard.md)
- [完整示例](../../../examples/example-01-api-test.md)
