# Go API 测试代码生成策略

根据测试用例文档生成 Go API 自动化测试代码，使用 testing + testify + net/http，支持请求构建、响应校验和数据清理。

---

## 适用场景

- 已通过标准化检查的 API 测试用例文档
- Go Web 框架（Gin/Echo/Chi）的集成测试
- 需要真实调用 API 端点

---

## 技术栈

| 组件 | 版本 | 用途 |
|------|------|------|
| Go | 1.21+ | 运行环境 |
| testing | 标准库 | 测试框架 |
| testify | v1.9+ | 断言库 |
| net/http | 标准库 | HTTP 客户端 |
| encoding/json | 标准库 | JSON 处理 |

---

## 代码结构

### 测试文件模板

```go
package test

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "os"
    "sync"
    "testing"
    "time"

    "github.com/stretchr/testify/assert"
    "github.com/stretchr/testify/require"
)

// 配置常量
const (
    BaseURL       = "http://localhost:8080"
    TestStaffID   = "test123"
    TestStaffName = "TestUser"
)

// 测试数据常量
const (
    TestUsername = "testuser"
    TestEmail    = "test@example.com"
)

// 清理注册表
var cleanupRegistry = NewCleanupRegistry()

// TestUserAPI 用户 API 测试套件
func TestUserAPI(t *testing.T) {
    // 正常场景
    t.Run("正常场景", func(t *testing.T) {
        t.Run("TC001_创建用户成功", testCreateUser)
        t.Run("TC002_查询用户成功", testGetUser)
    })

    // 异常场景
    t.Run("异常场景", func(t *testing.T) {
        t.Run("TC010_用户名为空_参数错误", testCreateUserEmptyUsername)
        t.Run("TC011_用户不存在_404", testGetUserNotFound)
    })

    // 边界场景
    t.Run("边界场景", func(t *testing.T) {
        t.Run("TC020_用户名最大长度", testCreateUserMaxLength)
    })

    // 打印测试统计
    printTestStats(t)
}
```

### 正常场景测试

```go
// testCreateUser TC001 - 创建用户成功
// 预期: code=200, data.id 不为空
func testCreateUser(t *testing.T) {
    // Arrange
    reqBody := map[string]interface{}{
        "username": TestUsername,
        "email":    TestEmail,
    }

    // Act
    resp, err := doPost("/api/users", reqBody)
    require.NoError(t, err)
    defer resp.Body.Close()

    // Assert
    body := parseResponse(t, resp)
    assert.Equal(t, http.StatusOK, resp.StatusCode, "HTTP状态码错误")
    assert.Equal(t, 0, int(body["code"].(float64)), "业务码错误")

    data := body["data"].(map[string]interface{})
    assert.NotEmpty(t, data["id"], "用户ID不能为空")
    assert.Equal(t, TestUsername, data["username"], "用户名不匹配")

    // 注册清理
    userID := fmt.Sprintf("%v", data["id"])
    cleanupRegistry.Register("user", userID, "DELETE", "/api/users/"+userID)

    t.Logf("✓ 用户ID: %s", userID)
}

// testGetUser TC002 - 查询用户成功
func testGetUser(t *testing.T) {
    // Arrange - 先创建用户
    userID := createTestUser(t)
    defer cleanupRegistry.Register("user", userID, "DELETE", "/api/users/"+userID)

    // Act
    resp, err := doGet("/api/users/" + userID)
    require.NoError(t, err)
    defer resp.Body.Close()

    // Assert
    body := parseResponse(t, resp)
    assert.Equal(t, http.StatusOK, resp.StatusCode)
    assert.Equal(t, 0, int(body["code"].(float64)))

    data := body["data"].(map[string]interface{})
    assert.Equal(t, userID, fmt.Sprintf("%v", data["id"]))
}
```

### 异常场景测试

```go
// testCreateUserEmptyUsername TC010 - 创建用户失败（用户名为空）
// 预期: code=400, message 包含 "用户名不能为空"
func testCreateUserEmptyUsername(t *testing.T) {
    // Arrange
    reqBody := map[string]interface{}{
        "username": "",
        "email":    TestEmail,
    }

    // Act
    resp, err := doPost("/api/users", reqBody)
    require.NoError(t, err)
    defer resp.Body.Close()

    // Assert
    body := parseResponse(t, resp)
    assert.Equal(t, http.StatusBadRequest, resp.StatusCode, "期望400错误")

    code := int(body["code"].(float64))
    message := body["message"].(string)

    assert.Equal(t, 400, code, "错误码不匹配")
    assert.Contains(t, message, "用户名", "错误消息应包含'用户名'")

    t.Logf("✓ 预期错误: %s", message)
}

// testGetUserNotFound TC011 - 查询不存在的用户
// 预期: code=404
func testGetUserNotFound(t *testing.T) {
    // Act
    resp, err := doGet("/api/users/999999999")
    require.NoError(t, err)
    defer resp.Body.Close()

    // Assert
    body := parseResponse(t, resp)
    assert.Equal(t, http.StatusNotFound, resp.StatusCode, "期望404错误")
    assert.Equal(t, 404, int(body["code"].(float64)), "错误码不匹配")

    t.Log("✓ 预期404错误")
}
```

### 边界值测试

```go
// testCreateUserMaxLength TC020 - 用户名最大长度
// 预期: code=200, 数据正确保存
func testCreateUserMaxLength(t *testing.T) {
    // Arrange
    maxUsername := repeatString("a", 20) // 假设最大长度 20
    reqBody := map[string]interface{}{
        "username": maxUsername,
        "email":    TestEmail,
    }

    // Act
    resp, err := doPost("/api/users", reqBody)
    require.NoError(t, err)
    defer resp.Body.Close()

    // Assert
    body := parseResponse(t, resp)
    assert.Equal(t, http.StatusOK, resp.StatusCode)

    data := body["data"].(map[string]interface{})
    savedUsername := data["username"].(string)
    assert.LessOrEqual(t, len(savedUsername), 20, "用户名长度超限")
    assert.Equal(t, maxUsername, savedUsername, "用户名不匹配")

    // 注册清理
    userID := fmt.Sprintf("%v", data["id"])
    cleanupRegistry.Register("user", userID, "DELETE", "/api/users/"+userID)

    t.Logf("✓ 用户名长度: %d", len(savedUsername))
}
```

---

## HTTP 工具函数

```go
// HTTP 客户端
var httpClient = &http.Client{
    Timeout: 30 * time.Second,
}

// doGet 发送 GET 请求
func doGet(path string) (*http.Response, error) {
    req, err := http.NewRequest(http.MethodGet, BaseURL+path, nil)
    if err != nil {
        return nil, err
    }
    setCommonHeaders(req)
    return httpClient.Do(req)
}

// doPost 发送 POST 请求
func doPost(path string, body interface{}) (*http.Response, error) {
    jsonBody, err := json.Marshal(body)
    if err != nil {
        return nil, err
    }

    req, err := http.NewRequest(http.MethodPost, BaseURL+path, bytes.NewBuffer(jsonBody))
    if err != nil {
        return nil, err
    }
    setCommonHeaders(req)
    return httpClient.Do(req)
}

// doPut 发送 PUT 请求
func doPut(path string, body interface{}) (*http.Response, error) {
    jsonBody, err := json.Marshal(body)
    if err != nil {
        return nil, err
    }

    req, err := http.NewRequest(http.MethodPut, BaseURL+path, bytes.NewBuffer(jsonBody))
    if err != nil {
        return nil, err
    }
    setCommonHeaders(req)
    return httpClient.Do(req)
}

// doDelete 发送 DELETE 请求
func doDelete(path string) (*http.Response, error) {
    req, err := http.NewRequest(http.MethodDelete, BaseURL+path, nil)
    if err != nil {
        return nil, err
    }
    setCommonHeaders(req)
    return httpClient.Do(req)
}

// setCommonHeaders 设置公共请求头
func setCommonHeaders(req *http.Request) {
    req.Header.Set("Content-Type", "application/json")
    req.Header.Set("X-Staff-Id", TestStaffID)
    req.Header.Set("X-Staff-Name", TestStaffName)
}

// parseResponse 解析响应 JSON
func parseResponse(t *testing.T, resp *http.Response) map[string]interface{} {
    body, err := io.ReadAll(resp.Body)
    require.NoError(t, err, "读取响应失败")

    var result map[string]interface{}
    err = json.Unmarshal(body, &result)
    require.NoError(t, err, "解析JSON失败")

    return result
}

// repeatString 重复字符串
func repeatString(s string, count int) string {
    result := ""
    for i := 0; i < count; i++ {
        result += s
    }
    return result
}

// createTestUser 创建测试用户（辅助函数）
func createTestUser(t *testing.T) string {
    reqBody := map[string]interface{}{
        "username": TestUsername + fmt.Sprintf("%d", time.Now().UnixNano()),
        "email":    TestEmail,
    }

    resp, err := doPost("/api/users", reqBody)
    require.NoError(t, err)
    defer resp.Body.Close()

    body := parseResponse(t, resp)
    require.Equal(t, http.StatusOK, resp.StatusCode)

    data := body["data"].(map[string]interface{})
    return fmt.Sprintf("%v", data["id"])
}
```

---

## 清理代码

### CleanupRegistry 结构

```go
// CleanupRecord 清理记录
type CleanupRecord struct {
    ResourceType string    `json:"resource_type"`
    ResourceID   string    `json:"resource_id"`
    Method       string    `json:"method"`
    Path         string    `json:"path"`
    CreatedAt    time.Time `json:"created_at"`
    Status       string    `json:"status"`
    Error        string    `json:"error,omitempty"`
}

// CleanupRegistry 清理注册表
type CleanupRegistry struct {
    mu       sync.Mutex
    records  []CleanupRecord
    filePath string
}

// NewCleanupRegistry 创建清理注册表
func NewCleanupRegistry() *CleanupRegistry {
    return &CleanupRegistry{
        records:  make([]CleanupRecord, 0),
        filePath: "cleanup-registry.json",
    }
}

// Register 注册待清理资源
func (r *CleanupRegistry) Register(resourceType, resourceID, method, path string) {
    r.mu.Lock()
    defer r.mu.Unlock()

    record := CleanupRecord{
        ResourceType: resourceType,
        ResourceID:   resourceID,
        Method:       method,
        Path:         path,
        CreatedAt:    time.Now(),
        Status:       "pending",
    }
    r.records = append(r.records, record)
    r.persist()
}

// ExecuteCleanup 执行清理
func (r *CleanupRegistry) ExecuteCleanup() (success, failed int) {
    r.mu.Lock()
    defer r.mu.Unlock()

    for i := range r.records {
        if r.records[i].Status != "pending" {
            continue
        }

        var resp *http.Response
        var err error

        switch r.records[i].Method {
        case "DELETE":
            resp, err = doDelete(r.records[i].Path)
        default:
            err = fmt.Errorf("unsupported method: %s", r.records[i].Method)
        }

        if err != nil {
            r.records[i].Status = "failed"
            r.records[i].Error = err.Error()
            failed++
            continue
        }
        resp.Body.Close()

        if resp.StatusCode >= 200 && resp.StatusCode < 300 {
            r.records[i].Status = "cleaned"
            success++
        } else {
            r.records[i].Status = "failed"
            r.records[i].Error = fmt.Sprintf("HTTP %d", resp.StatusCode)
            failed++
        }
    }

    r.persist()
    return
}

// GetReport 获取清理报告
func (r *CleanupRegistry) GetReport() map[string]int {
    r.mu.Lock()
    defer r.mu.Unlock()

    report := map[string]int{
        "total":   len(r.records),
        "pending": 0,
        "cleaned": 0,
        "failed":  0,
    }

    for _, rec := range r.records {
        report[rec.Status]++
    }

    return report
}

// persist 持久化到文件
func (r *CleanupRegistry) persist() {
    data, err := json.MarshalIndent(r.records, "", "  ")
    if err != nil {
        fmt.Fprintf(os.Stderr, "Failed to marshal cleanup registry: %v\n", err)
        return
    }
    if err := os.WriteFile(r.filePath, data, 0644); err != nil {
        fmt.Fprintf(os.Stderr, "Failed to persist cleanup registry: %v\n", err)
    }
}

// printTestStats 打印测试统计
func printTestStats(t *testing.T) {
    report := cleanupRegistry.GetReport()
    t.Logf("\n%s", repeatString("=", 60))
    t.Logf("测试数据清理报告")
    t.Logf("%s", repeatString("=", 60))
    t.Logf("待清理: %d", report["pending"])
    t.Logf("已清理: %d", report["cleaned"])
    t.Logf("失败: %d", report["failed"])
    t.Logf("%s\n", repeatString("=", 60))
}
```

---

## 输出产物

| 文件 | 路径 | 说明 |
|------|------|------|
| 测试文件 | `{module}_api_test.go` | API 测试代码 |
| 清理注册表 | `cleanup-registry.json` | 测试数据记录 |

---

## 验证清单

### 代码完整性

- [ ] 测试文件命名正确 (`*_api_test.go`)
- [ ] 包含测试套件函数 (`TestXxxAPI`)
- [ ] 定义配置常量 (BaseURL, TestStaffID)
- [ ] 使用 testify 断言库
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
# 编译测试代码
go test -c ./...

# 运行测试
go test -v ./...

# 运行指定测试
go test -v -run TestUserAPI

# 运行子测试
go test -v -run TestUserAPI/正常场景/TC001
```

---

## 相关资源

- [Go 命名规范](../../../../code-generation/standards/go/naming.md)
- [Go 错误处理规范](../../../../code-generation/standards/go/error-handling.md)
- [测试用例规范](../../../test-case-spec-standard.md)
