# Go 命名规范

> 继承自 [通用命名规范](../common/naming.md)

## 包命名

```go
// ✅ 小写单词，简短有意义
package user
package order
package httputil

// ❌ 错误
package userService  // 不要驼峰
package user_service // 不要下划线
package util         // 过于通用
```

## 导出规则

```go
// ✅ 首字母大写 = 导出（公开）
type User struct {}
func CreateUser() {}

// ✅ 首字母小写 = 未导出（私有）
type userImpl struct {}
func validateUser() {}
```

## 变量命名

```go
// ✅ 驼峰命名
var userName string
var userID int64  // ID 全大写
var httpClient *http.Client

// ✅ 短变量名（小作用域）
for i := 0; i < 10; i++ {}
if err := doSomething(); err != nil {}

// ❌ 错误
var user_name string  // 不要下划线
var UserName string   // 局部变量不要大写开头
```

## 常量命名

```go
// ✅ 驼峰命名（不是全大写）
const maxRetryCount = 3
const defaultTimeout = 30 * time.Second

// ✅ 导出常量首字母大写
const MaxConnections = 100

// ❌ 错误（Go 不推荐全大写）
const MAX_RETRY_COUNT = 3
```

## 接口命名

```go
// ✅ 单方法接口：方法名 + er
type Reader interface {
    Read(p []byte) (n int, err error)
}

type Writer interface {
    Write(p []byte) (n int, err error)
}

// ✅ 多方法接口：描述性名称
type UserRepository interface {
    FindByID(id int64) (*User, error)
    Save(user *User) error
}
```

## 函数命名

```go
// ✅ 动词开头
func CreateUser(req *CreateUserRequest) (*User, error)
func GetUserByID(id int64) (*User, error)
func DeleteUser(id int64) error
func ListUsers(page, size int) ([]*User, error)

// ✅ 返回 bool 用 Is/Has/Can
func IsValid() bool
func HasPermission() bool
func CanAccess() bool
```

## 错误变量

```go
// ✅ Err 前缀
var ErrNotFound = errors.New("not found")
var ErrInvalidInput = errors.New("invalid input")
var ErrUnauthorized = errors.New("unauthorized")
```

## 检查清单

- [ ] 包名小写单词
- [ ] 导出用大写开头
- [ ] 变量用驼峰命名
- [ ] 常量用驼峰（非全大写）
- [ ] 单方法接口用 -er 后缀
- [ ] 错误变量用 Err 前缀

## 参考

- [Effective Go](https://golang.org/doc/effective_go)
- [Go Code Review Comments](https://github.com/golang/go/wiki/CodeReviewComments)
