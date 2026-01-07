# Go 从注释生成代码指南

## 适用场景

- 输入：带详细注释的 Go 接口签名
- 输出：完整的 Go 实现代码

## 输入格式

```go
// UserService 用户服务接口
type UserService interface {
    // GetByID 根据ID获取用户
    // 
    // 业务规则：
    // 1. 用户不存在时返回 ErrNotFound
    // 2. 返回的用户信息需要脱敏处理
    //
    // 参数：
    //   - ctx: 上下文
    //   - id: 用户ID
    // 返回：
    //   - *User: 用户实体
    //   - error: 错误信息
    GetByID(ctx context.Context, id int64) (*User, error)
    
    // Create 创建用户
    //
    // 业务规则：
    // 1. 用户名不能重复
    // 2. 密码需要加密存储
    Create(ctx context.Context, req *CreateUserRequest) (*User, error)
}
```

## 生成代码

```go
type userService struct {
    repo   UserRepository
    logger *zap.Logger
}

func NewUserService(repo UserRepository, logger *zap.Logger) UserService {
    return &userService{
        repo:   repo,
        logger: logger,
    }
}

func (s *userService) GetByID(ctx context.Context, id int64) (*User, error) {
    s.logger.Info("getting user by id", zap.Int64("userId", id))
    
    user, err := s.repo.FindByID(ctx, id)
    if err != nil {
        if errors.Is(err, ErrNotFound) {
            return nil, ErrNotFound
        }
        return nil, fmt.Errorf("get user by id: %w", err)
    }
    
    // 脱敏处理
    user.Phone = maskPhone(user.Phone)
    
    return user, nil
}

func (s *userService) Create(ctx context.Context, req *CreateUserRequest) (*User, error) {
    s.logger.Info("creating user", zap.String("username", req.Username))
    
    // 检查用户名唯一性
    exists, err := s.repo.ExistsByUsername(ctx, req.Username)
    if err != nil {
        return nil, fmt.Errorf("check username exists: %w", err)
    }
    if exists {
        return nil, NewBusinessError("USER_EXISTS", "用户名已存在")
    }
    
    // 密码加密
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
    if err != nil {
        return nil, fmt.Errorf("hash password: %w", err)
    }
    
    user := &User{
        Username: req.Username,
        Password: string(hashedPassword),
        Email:    req.Email,
        Status:   StatusActive,
    }
    
    if err := s.repo.Create(ctx, user); err != nil {
        return nil, fmt.Errorf("create user: %w", err)
    }
    
    s.logger.Info("user created", zap.Int64("userId", user.ID))
    return user, nil
}

func maskPhone(phone string) string {
    if len(phone) != 11 {
        return phone
    }
    return phone[:3] + "****" + phone[7:]
}
```

## 检查清单

- [ ] 解析接口注释
- [ ] 提取业务规则
- [ ] 构造器注入依赖
- [ ] 实现所有方法
- [ ] 错误处理完整
- [ ] 日志记录关键点

## 参考

- [Go 命名规范](../../standards/go/naming.md)
- [Go 错误处理](../../standards/go/error-handling.md)
