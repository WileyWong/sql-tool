# Go 单元测试代码生成策略

根据测试用例文档生成 Go 单元测试代码，使用 testing + testify + mockery，确保类型安全和零编译错误。

---

## 适用场景

- 已通过标准化检查的单元测试用例文档
- Service/Repository/Handler 层测试
- 需要 Mock 隔离依赖

---

## 技术栈

| 组件 | 版本 | 用途 |
|------|------|------|
| Go | 1.21+ | 运行环境 |
| testing | 标准库 | 测试框架 |
| testify | v1.9+ | 断言和 Mock |
| mockery | v2.40+ | Mock 生成工具 |

---

## 核心原则

### 强制执行规则

> ⛔ **必须严格执行，违反立即停止生成**

1. **强制源码验证**
   - ✅ 必须 `read_file` 读取被测结构体完整源码
   - ✅ 必须 `read_file` 读取所有依赖接口源码
   - ❌ 禁止跳过源码读取直接生成代码

2. **禁止方法假设**
   - ❌ 禁止基于接口名推测方法存在性
   - ❌ 禁止基于字段名推测方法名
   - ✅ 强制从源码精确提取实际方法

3. **字段类型精确匹配**
   - ✅ int64 用 `int64(1)`，int 用 `1`
   - ✅ Mock 参数使用 `mock.Anything` 或精确类型

---

## 代码结构

### 测试文件模板

```go
package service

import (
    "context"
    "errors"
    "testing"

    "github.com/stretchr/testify/assert"
    "github.com/stretchr/testify/mock"
    "github.com/stretchr/testify/require"
    
    "example.com/project/internal/repository/mocks"
)

// TestUserService 用户服务单元测试
func TestUserService(t *testing.T) {
    // 正常场景
    t.Run("正常场景", func(t *testing.T) {
        t.Run("TC001_创建用户成功", testCreateUserSuccess)
        t.Run("TC002_查询用户成功", testGetUserSuccess)
    })

    // 边界场景
    t.Run("边界场景", func(t *testing.T) {
        t.Run("TC010_空值处理", testCreateUserNilInput)
        t.Run("TC011_空列表处理", testGetAllUsersEmpty)
    })

    // 异常场景
    t.Run("异常场景", func(t *testing.T) {
        t.Run("TC020_用户名已存在", testCreateUserDuplicate)
        t.Run("TC021_依赖服务异常", testCreateUserRepoError)
    })

    // Mock验证
    t.Run("Mock验证", func(t *testing.T) {
        t.Run("TC030_验证Repository调用", testVerifyRepoCalls)
    })
}

// 测试数据常量
const (
    testUserID   = int64(1)
    testUsername = "testuser"
    testEmail    = "test@example.com"
)
```

### 正常场景测试

```go
// testCreateUserSuccess TC001 - 正常创建用户
func testCreateUserSuccess(t *testing.T) {
    // Arrange
    mockRepo := mocks.NewMockUserRepository(t)
    service := NewUserService(mockRepo)

    req := &CreateUserRequest{
        Username: testUsername,
        Email:    testEmail,
    }

    expectedUser := &User{
        ID:       testUserID,
        Username: testUsername,
        Email:    testEmail,
    }

    mockRepo.On("ExistsByUsername", mock.Anything, testUsername).Return(false, nil)
    mockRepo.On("Create", mock.Anything, mock.AnythingOfType("*User")).Return(nil).
        Run(func(args mock.Arguments) {
            user := args.Get(1).(*User)
            user.ID = testUserID
        })

    // Act
    result, err := service.CreateUser(context.Background(), req)

    // Assert
    require.NoError(t, err)
    assert.NotNil(t, result)
    assert.Equal(t, testUserID, result.ID)
    assert.Equal(t, testUsername, result.Username)

    // Verify
    mockRepo.AssertExpectations(t)
}

// testGetUserSuccess TC002 - 正常查询用户
func testGetUserSuccess(t *testing.T) {
    // Arrange
    mockRepo := mocks.NewMockUserRepository(t)
    service := NewUserService(mockRepo)

    expectedUser := &User{
        ID:       testUserID,
        Username: testUsername,
        Email:    testEmail,
    }

    mockRepo.On("FindByID", mock.Anything, testUserID).Return(expectedUser, nil)

    // Act
    result, err := service.GetUser(context.Background(), testUserID)

    // Assert
    require.NoError(t, err)
    assert.NotNil(t, result)
    assert.Equal(t, testUserID, result.ID)
    assert.Equal(t, testUsername, result.Username)

    mockRepo.AssertExpectations(t)
}
```

### 边界条件测试

```go
// testCreateUserNilInput TC010 - 空值处理
func testCreateUserNilInput(t *testing.T) {
    // Arrange
    mockRepo := mocks.NewMockUserRepository(t)
    service := NewUserService(mockRepo)

    // Act
    result, err := service.CreateUser(context.Background(), nil)

    // Assert
    assert.Error(t, err)
    assert.Nil(t, result)
    assert.Contains(t, err.Error(), "invalid input")

    // Verify - 不应调用 Repository
    mockRepo.AssertNotCalled(t, "Create", mock.Anything, mock.Anything)
}

// testGetAllUsersEmpty TC011 - 空列表处理
func testGetAllUsersEmpty(t *testing.T) {
    // Arrange
    mockRepo := mocks.NewMockUserRepository(t)
    service := NewUserService(mockRepo)

    mockRepo.On("FindAll", mock.Anything).Return([]*User{}, nil)

    // Act
    result, err := service.GetAllUsers(context.Background())

    // Assert
    require.NoError(t, err)
    assert.NotNil(t, result)
    assert.Empty(t, result)

    mockRepo.AssertExpectations(t)
}
```

### 异常场景测试

```go
// testCreateUserDuplicate TC020 - 用户名已存在
func testCreateUserDuplicate(t *testing.T) {
    // Arrange
    mockRepo := mocks.NewMockUserRepository(t)
    service := NewUserService(mockRepo)

    req := &CreateUserRequest{
        Username: testUsername,
        Email:    testEmail,
    }

    mockRepo.On("ExistsByUsername", mock.Anything, testUsername).Return(true, nil)

    // Act
    result, err := service.CreateUser(context.Background(), req)

    // Assert
    assert.Error(t, err)
    assert.Nil(t, result)

    var bizErr *BusinessError
    require.True(t, errors.As(err, &bizErr))
    assert.Equal(t, "USER_EXISTS", bizErr.Code)
    assert.Contains(t, bizErr.Message, "用户名已存在")

    // Verify - 不应调用 Create
    mockRepo.AssertNotCalled(t, "Create", mock.Anything, mock.Anything)
}

// testCreateUserRepoError TC021 - 依赖服务异常
func testCreateUserRepoError(t *testing.T) {
    // Arrange
    mockRepo := mocks.NewMockUserRepository(t)
    service := NewUserService(mockRepo)

    req := &CreateUserRequest{
        Username: testUsername,
        Email:    testEmail,
    }

    mockRepo.On("ExistsByUsername", mock.Anything, testUsername).Return(false, nil)
    mockRepo.On("Create", mock.Anything, mock.AnythingOfType("*User")).
        Return(errors.New("database connection failed"))

    // Act
    result, err := service.CreateUser(context.Background(), req)

    // Assert
    assert.Error(t, err)
    assert.Nil(t, result)
    assert.Contains(t, err.Error(), "database connection failed")

    mockRepo.AssertExpectations(t)
}
```

### Mock 验证测试

```go
// testVerifyRepoCalls TC030 - 验证 Repository 调用
func testVerifyRepoCalls(t *testing.T) {
    // Arrange
    mockRepo := mocks.NewMockUserRepository(t)
    service := NewUserService(mockRepo)

    req := &CreateUserRequest{
        Username: testUsername,
        Email:    testEmail,
    }

    mockRepo.On("ExistsByUsername", mock.Anything, testUsername).Return(false, nil)
    mockRepo.On("Create", mock.Anything, mock.AnythingOfType("*User")).Return(nil)

    // Act
    _, _ = service.CreateUser(context.Background(), req)

    // Verify - 验证调用次数
    mockRepo.AssertNumberOfCalls(t, "ExistsByUsername", 1)
    mockRepo.AssertNumberOfCalls(t, "Create", 1)

    // Verify - 验证调用参数
    mockRepo.AssertCalled(t, "ExistsByUsername", mock.Anything, testUsername)
}
```

---

## Mock 生成

### 使用 mockery 生成 Mock

```bash
# 安装 mockery
go install github.com/vektra/mockery/v2@latest

# 生成 Mock（在接口所在目录执行）
mockery --name=UserRepository --output=./mocks --outpkg=mocks

# 生成所有接口的 Mock
mockery --all --output=./mocks --outpkg=mocks
```

### Mock 接口示例

```go
// internal/repository/user_repository.go
type UserRepository interface {
    FindByID(ctx context.Context, id int64) (*User, error)
    FindAll(ctx context.Context) ([]*User, error)
    ExistsByUsername(ctx context.Context, username string) (bool, error)
    Create(ctx context.Context, user *User) error
    Update(ctx context.Context, user *User) error
    Delete(ctx context.Context, id int64) error
}
```

### 生成的 Mock 使用

```go
// 创建 Mock
mockRepo := mocks.NewMockUserRepository(t)

// 设置期望
mockRepo.On("FindByID", mock.Anything, int64(1)).Return(&User{ID: 1}, nil)

// 验证调用
mockRepo.AssertExpectations(t)
mockRepo.AssertCalled(t, "FindByID", mock.Anything, int64(1))
mockRepo.AssertNotCalled(t, "Delete", mock.Anything, mock.Anything)
mockRepo.AssertNumberOfCalls(t, "FindByID", 1)
```

---

## 类型安全检查

### 常见类型错误

```go
// ❌ 错误：类型推测
user.ID = 1        // 假设 ID 是 int，实际可能是 int64
mockRepo.On("FindByID", mock.Anything, 1)  // int vs int64

// ✅ 正确：基于源码
// 从源码解析: ID int64
user.ID = int64(1)
mockRepo.On("FindByID", mock.Anything, int64(1))
```

### Mock 参数类型

```go
// ❌ 错误：类型不匹配
mockRepo.On("FindByID", mock.Anything, 1).Return(user, nil)  // int 传给 int64

// ✅ 正确：精确类型
mockRepo.On("FindByID", mock.Anything, int64(1)).Return(user, nil)

// ✅ 使用 mock.Anything 匹配任意值
mockRepo.On("FindByID", mock.Anything, mock.Anything).Return(user, nil)

// ✅ 使用 mock.AnythingOfType 匹配特定类型
mockRepo.On("Create", mock.Anything, mock.AnythingOfType("*User")).Return(nil)
```

---

## 表格驱动测试

```go
func TestUserService_GetUser(t *testing.T) {
    tests := []struct {
        name        string
        userID      int64
        mockSetup   func(*mocks.MockUserRepository)
        wantErr     bool
        errContains string
    }{
        {
            name:   "成功获取用户",
            userID: testUserID,
            mockSetup: func(m *mocks.MockUserRepository) {
                m.On("FindByID", mock.Anything, testUserID).
                    Return(&User{ID: testUserID, Username: testUsername}, nil)
            },
            wantErr: false,
        },
        {
            name:   "用户不存在",
            userID: int64(999),
            mockSetup: func(m *mocks.MockUserRepository) {
                m.On("FindByID", mock.Anything, int64(999)).
                    Return(nil, ErrNotFound)
            },
            wantErr:     true,
            errContains: "not found",
        },
        {
            name:   "数据库错误",
            userID: testUserID,
            mockSetup: func(m *mocks.MockUserRepository) {
                m.On("FindByID", mock.Anything, testUserID).
                    Return(nil, errors.New("database error"))
            },
            wantErr:     true,
            errContains: "database error",
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            mockRepo := mocks.NewMockUserRepository(t)
            tt.mockSetup(mockRepo)

            service := NewUserService(mockRepo)
            result, err := service.GetUser(context.Background(), tt.userID)

            if tt.wantErr {
                assert.Error(t, err)
                if tt.errContains != "" {
                    assert.Contains(t, err.Error(), tt.errContains)
                }
                assert.Nil(t, result)
            } else {
                assert.NoError(t, err)
                assert.NotNil(t, result)
            }

            mockRepo.AssertExpectations(t)
        })
    }
}
```

---

## 输出产物

| 文件 | 路径 | 说明 |
|------|------|------|
| 测试文件 | `{package}/{name}_test.go` | 单元测试代码 |
| Mock 文件 | `{package}/mocks/mock_{interface}.go` | Mock 代码 |

---

## 验证清单

### 源码验证

- [ ] 已读取被测结构体完整源码
- [ ] 已读取所有依赖接口源码
- [ ] 所有方法调用已验证存在性
- [ ] 所有字段类型已验证

### 代码质量

- [ ] 使用 testify 断言库
- [ ] 使用 mockery 生成 Mock
- [ ] 遵循 AAA 模式（Arrange-Act-Assert）
- [ ] 包含 Mock 验证（AssertExpectations）
- [ ] 类型精确匹配（int/int64）
- [ ] 使用子测试 `t.Run`

### 覆盖率

- [ ] 正常场景覆盖
- [ ] 边界条件覆盖（nil/空集合）
- [ ] 异常场景覆盖
- [ ] Mock 验证覆盖
- [ ] 目标覆盖率 ≥ 80%

### 编译验证

```bash
# 编译测试代码
go test -c ./...

# 运行测试
go test -v ./...

# 运行测试并显示覆盖率
go test -v -cover ./...

# 生成覆盖率报告
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out -o coverage.html
```

---

## 相关资源

- [Go 命名规范](../../../../code-generation/standards/go/naming.md)
- [Go 错误处理规范](../../../../code-generation/standards/go/error-handling.md)
- [测试用例规范](../../../test-case-spec-standard.md)
- [testify 文档](https://github.com/stretchr/testify)
- [mockery 文档](https://github.com/vektra/mockery)
