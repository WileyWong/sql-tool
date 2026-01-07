# Groovy/Spock API 测试代码生成策略

根据测试用例文档生成 Groovy Spock API 自动化测试代码，使用 given-when-then 结构和 REST-assured，支持请求构建、响应校验和数据清理。

---

## 适用场景

- 已通过标准化检查的 API 测试用例文档
- Java/Groovy 项目的集成测试/接口测试
- 需要真实调用 API 端点
- 需要数据驱动的 API 测试

---

## 技术栈

| 组件 | 版本 | 用途 |
|------|------|------|
| Groovy | 4.0+ | 运行环境 |
| Spock | 2.4+ | 测试框架 |
| REST-assured | 5.4+ | HTTP 客户端 |
| Jackson | 2.15+ | JSON 处理 |
| Java | 17+ | JVM 环境 |

---

## 代码结构

### 测试类模板

```groovy
package com.example.api.test

import io.restassured.RestAssured
import io.restassured.http.ContentType
import io.restassured.response.Response
import spock.lang.Shared
import spock.lang.Specification
import spock.lang.Stepwise
import spock.lang.Unroll

/**
 * 用户 API 接口测试
 * 覆盖: 正常/异常/边界场景
 */
@Stepwise
class UserApiSpec extends Specification {

    // 配置常量
    static final String BASE_URL = "http://localhost:8080"
    static final String TEST_STAFF_ID = "test123"
    static final String TEST_STAFF_NAME = "TestUser"

    // 测试数据常量
    static final String TEST_USERNAME = "testuser"
    static final String TEST_EMAIL = "test@example.com"

    // 清理注册表
    @Shared
    def cleanupRegistry = new CleanupRegistry()

    // 创建的用户ID（用于后续测试）
    @Shared
    String createdUserId

    def setupSpec() {
        RestAssured.baseURI = BASE_URL
        RestAssured.enableLoggingOfRequestAndResponseIfValidationFails()
    }

    def cleanupSpec() {
        // 打印清理报告
        def report = cleanupRegistry.getReport()
        println "\n${'=' * 60}"
        println "测试数据清理报告"
        println "${'=' * 60}"
        println "待清理: ${report.pending}"
        println "已清理: ${report.cleaned}"
        println "失败: ${report.failed}"
        println "${'=' * 60}\n"
    }
}
```

### 正常场景测试

```groovy
def "TC001 - 创建用户成功"() {
    given: "准备用户数据"
    def requestBody = [
        username: TEST_USERNAME,
        email: TEST_EMAIL
    ]

    when: "发送创建请求"
    Response response = RestAssured.given()
        .contentType(ContentType.JSON)
        .header("X-Staff-Id", TEST_STAFF_ID)
        .header("X-Staff-Name", TEST_STAFF_NAME)
        .body(requestBody)
    .when()
        .post("/api/users")
    .then()
        .extract().response()

    then: "验证响应"
    response.statusCode() == 200
    response.jsonPath().getInt("code") == 0

    and: "验证返回数据"
    def data = response.jsonPath().getMap("data")
    data.id != null
    data.username == TEST_USERNAME

    and: "保存用户ID并注册清理"
    createdUserId = data.id.toString()
    cleanupRegistry.register("user", createdUserId, "DELETE", "/api/users/${createdUserId}")

    and: "输出结果"
    println "  ✓ 用户ID: ${createdUserId}"
}

def "TC002 - 查询用户成功"() {
    given: "用户已创建"
    assert createdUserId != null, "需要先执行 TC001 创建用户"

    when: "查询用户"
    Response response = RestAssured.given()
        .contentType(ContentType.JSON)
        .header("X-Staff-Id", TEST_STAFF_ID)
        .header("X-Staff-Name", TEST_STAFF_NAME)
    .when()
        .get("/api/users/${createdUserId}")
    .then()
        .extract().response()

    then: "验证响应"
    response.statusCode() == 200
    response.jsonPath().getInt("code") == 0

    and: "验证返回数据"
    def data = response.jsonPath().getMap("data")
    data.id.toString() == createdUserId
    data.username == TEST_USERNAME
}
```

### 异常场景测试

```groovy
def "TC010 - 创建用户失败（用户名为空）"() {
    given: "用户名为空"
    def requestBody = [
        username: "",
        email: TEST_EMAIL
    ]

    when: "发送创建请求"
    Response response = RestAssured.given()
        .contentType(ContentType.JSON)
        .header("X-Staff-Id", TEST_STAFF_ID)
        .header("X-Staff-Name", TEST_STAFF_NAME)
        .body(requestBody)
    .when()
        .post("/api/users")
    .then()
        .extract().response()

    then: "验证错误响应"
    response.statusCode() == 400
    response.jsonPath().getInt("code") == 400

    and: "验证错误消息"
    def message = response.jsonPath().getString("message")
    message.contains("用户名")

    and: "输出结果"
    println "  ✓ 预期错误: ${message}"
}

def "TC011 - 查询不存在的用户"() {
    when: "查询不存在的用户"
    Response response = RestAssured.given()
        .contentType(ContentType.JSON)
        .header("X-Staff-Id", TEST_STAFF_ID)
        .header("X-Staff-Name", TEST_STAFF_NAME)
    .when()
        .get("/api/users/999999999")
    .then()
        .extract().response()

    then: "验证404错误"
    response.statusCode() == 404
    response.jsonPath().getInt("code") == 404

    and: "输出结果"
    println "  ✓ 预期404错误"
}

def "TC012 - 未授权访问"() {
    when: "不带认证头访问"
    Response response = RestAssured.given()
        .contentType(ContentType.JSON)
        // 不设置认证头
    .when()
        .get("/api/users/1")
    .then()
        .extract().response()

    then: "验证401错误"
    response.statusCode() == 401

    and: "输出结果"
    println "  ✓ 预期401错误"
}
```

### 边界值测试

```groovy
def "TC020 - 用户名最大长度"() {
    given: "用户名达到最大长度"
    def maxUsername = "a" * 20  // 假设最大长度 20
    def requestBody = [
        username: maxUsername,
        email: TEST_EMAIL
    ]

    when: "发送创建请求"
    Response response = RestAssured.given()
        .contentType(ContentType.JSON)
        .header("X-Staff-Id", TEST_STAFF_ID)
        .header("X-Staff-Name", TEST_STAFF_NAME)
        .body(requestBody)
    .when()
        .post("/api/users")
    .then()
        .extract().response()

    then: "验证成功响应"
    response.statusCode() == 200

    and: "验证数据正确保存"
    def data = response.jsonPath().getMap("data")
    data.username == maxUsername
    data.username.length() <= 20

    and: "注册清理"
    def userId = data.id.toString()
    cleanupRegistry.register("user", userId, "DELETE", "/api/users/${userId}")

    and: "输出结果"
    println "  ✓ 用户名长度: ${data.username.length()}"
}
```

---

## 数据驱动 API 测试

### 参数校验测试

```groovy
@Unroll
def "TC030 - 参数校验: #scenario"() {
    given: "准备请求数据"
    def requestBody = [
        username: username,
        email: email
    ]

    when: "发送创建请求"
    Response response = RestAssured.given()
        .contentType(ContentType.JSON)
        .header("X-Staff-Id", TEST_STAFF_ID)
        .header("X-Staff-Name", TEST_STAFF_NAME)
        .body(requestBody)
    .when()
        .post("/api/users")
    .then()
        .extract().response()

    then: "验证错误响应"
    response.statusCode() == expectedStatus
    response.jsonPath().getString("message").contains(expectedError)

    where:
    scenario       | username    | email              | expectedStatus | expectedError
    "用户名为空"    | ""          | "test@example.com" | 400            | "用户名"
    "用户名太短"    | "ab"        | "test@example.com" | 400            | "用户名"
    "邮箱格式错误"  | "testuser"  | "invalid-email"    | 400            | "邮箱"
    "邮箱为空"      | "testuser"  | ""                 | 400            | "邮箱"
}

@Unroll
def "TC031 - HTTP 方法测试: #method #path -> #expectedStatus"() {
    when: "发送请求"
    Response response = RestAssured.given()
        .contentType(ContentType.JSON)
        .header("X-Staff-Id", TEST_STAFF_ID)
        .header("X-Staff-Name", TEST_STAFF_NAME)
    .when()
        .request(method, path)
    .then()
        .extract().response()

    then: "验证状态码"
    response.statusCode() == expectedStatus

    where:
    method   | path                    | expectedStatus
    "GET"    | "/api/users"            | 200
    "GET"    | "/api/users/1"          | 200
    "POST"   | "/api/users"            | 400  // 无请求体
    "PUT"    | "/api/users/1"          | 400  // 无请求体
    "DELETE" | "/api/users/999999999"  | 404
    "PATCH"  | "/api/users/1"          | 405  // 不支持的方法
}
```

### 批量测试

```groovy
@Unroll
def "TC032 - 批量创建用户: #username"() {
    given: "准备用户数据"
    def requestBody = [
        username: username,
        email: "${username}@example.com"
    ]

    when: "创建用户"
    Response response = RestAssured.given()
        .contentType(ContentType.JSON)
        .header("X-Staff-Id", TEST_STAFF_ID)
        .header("X-Staff-Name", TEST_STAFF_NAME)
        .body(requestBody)
    .when()
        .post("/api/users")
    .then()
        .extract().response()

    then: "验证创建成功"
    response.statusCode() == 200

    and: "注册清理"
    def userId = response.jsonPath().getString("data.id")
    cleanupRegistry.register("user", userId, "DELETE", "/api/users/${userId}")

    where:
    username << ["user1", "user2", "user3", "user4", "user5"]
}
```

---

## 清理代码

### CleanupRegistry 类

```groovy
class CleanupRegistry {
    
    private List<CleanupRecord> records = []
    private String filePath = "cleanup-registry.json"
    
    void register(String resourceType, String resourceId, String method, String path) {
        records << new CleanupRecord(
            resourceType: resourceType,
            resourceId: resourceId,
            method: method,
            path: path,
            createdAt: new Date().format("yyyy-MM-dd'T'HH:mm:ss"),
            status: "pending"
        )
        persist()
    }
    
    Map<String, Integer> executeCleanup() {
        int success = 0
        int failed = 0
        
        records.findAll { it.status == "pending" }.each { record ->
            try {
                def response = RestAssured.given()
                    .contentType(ContentType.JSON)
                    .header("X-Staff-Id", "cleanup")
                    .header("X-Staff-Name", "CleanupService")
                .when()
                    .request(record.method, record.path)
                .then()
                    .extract().response()
                
                if (response.statusCode() in [200, 204, 404]) {
                    record.status = "cleaned"
                    success++
                } else {
                    record.status = "failed"
                    record.error = "HTTP ${response.statusCode()}"
                    failed++
                }
            } catch (Exception e) {
                record.status = "failed"
                record.error = e.message
                failed++
            }
        }
        
        persist()
        return [success: success, failed: failed]
    }
    
    Map<String, Integer> getReport() {
        [
            total: records.size(),
            pending: records.count { it.status == "pending" },
            cleaned: records.count { it.status == "cleaned" },
            failed: records.count { it.status == "failed" }
        ]
    }
    
    private void persist() {
        def json = new groovy.json.JsonBuilder(records).toPrettyString()
        new File(filePath).text = json
    }
}

class CleanupRecord {
    String resourceType
    String resourceId
    String method
    String path
    String createdAt
    String status
    String error
}
```

---

## 输出产物

| 文件 | 路径 | 说明 |
|------|------|------|
| 测试类 | `src/test/groovy/com/example/api/{ModuleName}ApiSpec.groovy` | API 测试代码 |
| 清理类 | `src/test/groovy/com/example/api/CleanupRegistry.groovy` | 数据清理 |
| 清理记录 | `cleanup-registry.json` | 测试数据记录 |

---

## 验证清单

### 代码完整性

- [ ] 测试类命名正确 (`*ApiSpec`)
- [ ] 继承 `Specification`
- [ ] 使用 `@Stepwise` 保证顺序
- [ ] 定义配置常量 (BASE_URL, TEST_STAFF_ID)
- [ ] 使用 REST-assured 发送请求
- [ ] 添加认证 Header
- [ ] 校验必填字段
- [ ] 注册清理数据

### 测试覆盖

- [ ] 正常场景覆盖
- [ ] 参数验证覆盖（必填/边界值/格式）
- [ ] 异常场景覆盖（400/401/403/404/409）
- [ ] 业务规则覆盖

### 编译验证

```bash
# Maven
mvn test -Dtest=*ApiSpec

# Gradle
./gradlew test --tests "*ApiSpec"

# 运行单个测试类
./gradlew test --tests "UserApiSpec"
```

---

## Maven 依赖配置

```xml
<dependencies>
    <!-- Spock Framework -->
    <dependency>
        <groupId>org.spockframework</groupId>
        <artifactId>spock-core</artifactId>
        <version>2.4-M1-groovy-4.0</version>
        <scope>test</scope>
    </dependency>
    
    <!-- REST-assured -->
    <dependency>
        <groupId>io.rest-assured</groupId>
        <artifactId>rest-assured</artifactId>
        <version>5.4.0</version>
        <scope>test</scope>
    </dependency>
    
    <!-- Groovy JSON -->
    <dependency>
        <groupId>org.apache.groovy</groupId>
        <artifactId>groovy-json</artifactId>
        <version>4.0.15</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

---

## 相关资源

- [Groovy 命名规范](../../../../code-generation/standards/groovy/naming.md)
- [测试用例规范](../../../test-case-spec-standard.md)
- [Spock 官方文档](https://spockframework.org/spock/docs/2.3/index.html)
- [REST-assured 文档](https://rest-assured.io/)
