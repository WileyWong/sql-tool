# Go 从注释生成代码 - 示例

## 示例1: 用户服务

### 输入: 带注释的接口

```go
// UserService 用户服务接口
type UserService interface {
    // GetByID 根据ID获取用户
    // 
    // 业务规则：
    // 1. 用户不存在时返回 ErrNotFound
    // 2. 返回的手机号需要脱敏处理（保留前3后4）
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
    // 1. 用户名不能重复，重复时返回 ErrUserExists
    // 2. 密码需要使用 bcrypt 加密存储
    // 3. 默认状态为 StatusActive
    //
    // 参数：
    //   - ctx: 上下文
    //   - req: 创建用户请求
    // 返回：
    //   - *User: 创建的用户
    //   - error: 错误信息
    Create(ctx context.Context, req *CreateUserRequest) (*User, error)
    
    // Update 更新用户信息
    //
    // 业务规则：
    // 1. 用户不存在时返回 ErrNotFound
    // 2. 不能修改用户名
    //
    // 参数：
    //   - ctx: 上下文
    //   - id: 用户ID
    //   - req: 更新请求
    // 返回：
    //   - error: 错误信息
    Update(ctx context.Context, id int64, req *UpdateUserRequest) error
}
```

### 输出: 生成的实现

```go
package service

import (
    "context"
    "errors"
    "fmt"

    "go.uber.org/zap"
    "golang.org/x/crypto/bcrypt"
)

// 错误定义
var (
    ErrNotFound   = errors.New("not found")
    ErrUserExists = errors.New("user already exists")
)

// userService 用户服务实现
type userService struct {
    repo   UserRepository
    logger *zap.Logger
}

// NewUserService 创建用户服务实例
func NewUserService(repo UserRepository, logger *zap.Logger) UserService {
    return &userService{
        repo:   repo,
        logger: logger,
    }
}

// GetByID 根据ID获取用户
func (s *userService) GetByID(ctx context.Context, id int64) (*User, error) {
    s.logger.Info("getting user by id", zap.Int64("userId", id))
    
    // 1. 查询用户
    user, err := s.repo.FindByID(ctx, id)
    if err != nil {
        // 业务规则1：用户不存在时返回 ErrNotFound
        if errors.Is(err, ErrNotFound) {
            return nil, ErrNotFound
        }
        return nil, fmt.Errorf("get user by id: %w", err)
    }
    
    // 2. 手机号脱敏处理（业务规则2）
    user.Phone = maskPhone(user.Phone)
    
    return user, nil
}

// Create 创建用户
func (s *userService) Create(ctx context.Context, req *CreateUserRequest) (*User, error) {
    s.logger.Info("creating user", zap.String("username", req.Username))
    
    // 1. 检查用户名唯一性（业务规则1）
    exists, err := s.repo.ExistsByUsername(ctx, req.Username)
    if err != nil {
        return nil, fmt.Errorf("check username exists: %w", err)
    }
    if exists {
        return nil, ErrUserExists
    }
    
    // 2. 密码 bcrypt 加密（业务规则2）
    hashedPassword, err := bcrypt.GenerateFromPassword(
        []byte(req.Password), 
        bcrypt.DefaultCost,
    )
    if err != nil {
        return nil, fmt.Errorf("hash password: %w", err)
    }
    
    // 3. 构建用户实体（业务规则3：默认状态 StatusActive）
    user := &User{
        Username: req.Username,
        Password: string(hashedPassword),
        Email:    req.Email,
        Status:   StatusActive,
    }
    
    // 4. 保存用户
    if err := s.repo.Create(ctx, user); err != nil {
        return nil, fmt.Errorf("create user: %w", err)
    }
    
    s.logger.Info("user created", zap.Int64("userId", user.ID))
    return user, nil
}

// Update 更新用户信息
func (s *userService) Update(ctx context.Context, id int64, req *UpdateUserRequest) error {
    s.logger.Info("updating user", zap.Int64("userId", id))
    
    // 1. 查询用户（业务规则1）
    user, err := s.repo.FindByID(ctx, id)
    if err != nil {
        if errors.Is(err, ErrNotFound) {
            return ErrNotFound
        }
        return fmt.Errorf("find user: %w", err)
    }
    
    // 2. 更新字段（业务规则2：不能修改用户名）
    if req.Email != "" {
        user.Email = req.Email
    }
    if req.Nickname != "" {
        user.Nickname = req.Nickname
    }
    
    // 3. 保存更新
    if err := s.repo.Update(ctx, user); err != nil {
        return fmt.Errorf("update user: %w", err)
    }
    
    s.logger.Info("user updated", zap.Int64("userId", id))
    return nil
}

// maskPhone 手机号脱敏：保留前3后4
func maskPhone(phone string) string {
    if len(phone) != 11 {
        return phone
    }
    return phone[:3] + "****" + phone[7:]
}
```

---

## 示例2: 订单服务

### 输入

```go
// OrderService 订单服务接口
type OrderService interface {
    // Create 创建订单
    //
    // 业务规则：
    // 1. 检查商品是否存在，不存在返回 ErrProductNotFound
    // 2. 检查库存是否充足，不足返回 ErrStockNotEnough
    // 3. 计算订单总金额 = 商品单价 × 数量
    // 4. 扣减库存
    // 5. 订单初始状态为 StatusPending
    Create(ctx context.Context, req *CreateOrderRequest) (*Order, error)
}
```

### 输出

```go
func (s *orderService) Create(ctx context.Context, req *CreateOrderRequest) (*Order, error) {
    s.logger.Info("creating order",
        zap.Int64("productId", req.ProductID),
        zap.Int("quantity", req.Quantity),
    )
    
    // 1. 检查商品是否存在（业务规则1）
    product, err := s.productRepo.FindByID(ctx, req.ProductID)
    if err != nil {
        if errors.Is(err, ErrNotFound) {
            return nil, ErrProductNotFound
        }
        return nil, fmt.Errorf("find product: %w", err)
    }
    
    // 2. 检查库存是否充足（业务规则2）
    if product.Stock < req.Quantity {
        return nil, ErrStockNotEnough
    }
    
    // 3. 计算订单总金额（业务规则3）
    totalAmount := product.Price.Mul(decimal.NewFromInt(int64(req.Quantity)))
    
    // 4. 创建订单（业务规则5：初始状态 StatusPending）
    order := &Order{
        ProductID:   req.ProductID,
        Quantity:    req.Quantity,
        TotalAmount: totalAmount,
        Status:      StatusPending,
    }
    
    if err := s.orderRepo.Create(ctx, order); err != nil {
        return nil, fmt.Errorf("create order: %w", err)
    }
    
    // 5. 扣减库存（业务规则4）
    if err := s.productRepo.DecreaseStock(ctx, req.ProductID, req.Quantity); err != nil {
        return nil, fmt.Errorf("decrease stock: %w", err)
    }
    
    s.logger.Info("order created",
        zap.Int64("orderId", order.ID),
        zap.String("totalAmount", totalAmount.String()),
    )
    return order, nil
}
```

---

## 注释解析规则

| 注释关键词 | 生成内容 |
|-----------|---------|
| `返回 ErrXxx` | `return nil, ErrXxx` |
| `需要脱敏处理` | 脱敏函数调用 |
| `需要加密存储` | `bcrypt.GenerateFromPassword(...)` |
| `检查xxx是否存在` | 查询 + 存在性判断 |
| `默认状态为 Xxx` | `Status: StatusXxx` |
