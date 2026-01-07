# Java 从注释生成代码 - 示例

## 示例1: 用户服务

### 输入: 带注释的接口

```java
/**
 * 用户服务接口
 */
public interface UserService {
    
    /**
     * 根据ID获取用户
     * 
     * 业务规则：
     * 1. 用户不存在时抛出 ResourceNotFoundException
     * 2. 返回的手机号需要脱敏处理（保留前3后4）
     * 
     * @param id 用户ID，不能为空
     * @return 用户实体
     * @throws ResourceNotFoundException 用户不存在时抛出
     */
    User getById(Long id);
    
    /**
     * 创建用户
     * 
     * 业务规则：
     * 1. 用户名不能重复，重复时抛出 BusinessException
     * 2. 密码需要使用 BCrypt 加密存储
     * 3. 创建成功后发送欢迎邮件（异步）
     * 4. 默认状态为启用
     * 
     * @param request 创建用户请求，包含用户名、密码、邮箱
     * @return 用户ID
     * @throws BusinessException 用户名已存在时抛出，错误码 USER_EXISTS
     */
    Long createUser(CreateUserRequest request);
    
    /**
     * 更新用户信息
     * 
     * 业务规则：
     * 1. 用户不存在时抛出 ResourceNotFoundException
     * 2. 不能修改用户名
     * 3. 如果修改了邮箱，需要重新验证
     * 
     * @param id 用户ID
     * @param request 更新请求
     * @throws ResourceNotFoundException 用户不存在时抛出
     */
    void updateUser(Long id, UpdateUserRequest request);
}
```

### 输出: 生成的实现

```java
package com.example.service.impl;

import com.example.dto.CreateUserRequest;
import com.example.dto.UpdateUserRequest;
import com.example.entity.User;
import com.example.exception.BusinessException;
import com.example.exception.ResourceNotFoundException;
import com.example.mapper.UserMapper;
import com.example.service.EmailService;
import com.example.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

/**
 * 用户服务实现
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    
    /**
     * 根据ID获取用户
     * 
     * @param id 用户ID，不能为空
     * @return 用户实体（手机号已脱敏）
     * @throws ResourceNotFoundException 用户不存在时抛出
     */
    @Override
    public User getById(Long id) {
        // 1. 参数校验
        Assert.notNull(id, "用户ID不能为空");
        
        // 2. 查询用户
        User user = userMapper.selectById(id);
        
        // 3. 检查存在性（业务规则1）
        if (user == null) {
            throw new ResourceNotFoundException("用户", id);
        }
        
        // 4. 手机号脱敏处理（业务规则2）
        user.setPhone(maskPhone(user.getPhone()));
        
        return user;
    }
    
    /**
     * 创建用户
     * 
     * @param request 创建用户请求
     * @return 用户ID
     * @throws BusinessException 用户名已存在时抛出
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createUser(CreateUserRequest request) {
        log.info("创建用户, username={}", request.getUsername());
        
        // 1. 检查用户名唯一性（业务规则1）
        if (userMapper.existsByUsername(request.getUsername())) {
            throw new BusinessException("USER_EXISTS", "用户名已存在");
        }
        
        // 2. 构建用户实体
        User user = new User();
        user.setUsername(request.getUsername());
        // 密码 BCrypt 加密（业务规则2）
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        // 默认状态为启用（业务规则4）
        user.setStatus(1);
        
        // 3. 保存用户
        userMapper.insert(user);
        
        // 4. 发送欢迎邮件-异步（业务规则3）
        sendWelcomeEmailAsync(user.getEmail(), user.getUsername());
        
        log.info("用户创建成功, userId={}", user.getId());
        return user.getId();
    }
    
    /**
     * 更新用户信息
     * 
     * @param id 用户ID
     * @param request 更新请求
     * @throws ResourceNotFoundException 用户不存在时抛出
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateUser(Long id, UpdateUserRequest request) {
        log.info("更新用户, userId={}", id);
        
        // 1. 查询用户（业务规则1）
        User user = userMapper.selectById(id);
        if (user == null) {
            throw new ResourceNotFoundException("用户", id);
        }
        
        // 2. 记录原邮箱，用于判断是否修改
        String originalEmail = user.getEmail();
        
        // 3. 更新字段（业务规则2：不能修改用户名，所以不设置 username）
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
        if (request.getNickname() != null) {
            user.setNickname(request.getNickname());
        }
        
        // 4. 保存更新
        userMapper.updateById(user);
        
        // 5. 如果邮箱变更，需要重新验证（业务规则3）
        if (request.getEmail() != null && !request.getEmail().equals(originalEmail)) {
            log.info("邮箱已变更, 发送验证邮件, newEmail={}", request.getEmail());
            emailService.sendVerificationEmail(request.getEmail());
        }
        
        log.info("用户更新成功, userId={}", id);
    }
    
    /**
     * 异步发送欢迎邮件
     */
    @Async
    protected void sendWelcomeEmailAsync(String email, String username) {
        try {
            emailService.sendWelcomeEmail(email, username);
        } catch (Exception e) {
            log.error("发送欢迎邮件失败, email={}", email, e);
        }
    }
    
    /**
     * 手机号脱敏：保留前3后4
     */
    private String maskPhone(String phone) {
        if (phone == null || phone.length() != 11) {
            return phone;
        }
        return phone.substring(0, 3) + "****" + phone.substring(7);
    }
}
```

---

## 示例2: 订单服务

### 输入

```java
/**
 * 订单服务接口
 */
public interface OrderService {
    
    /**
     * 创建订单
     * 
     * 业务规则：
     * 1. 检查商品是否存在
     * 2. 检查库存是否充足，不足时抛出 BusinessException (STOCK_NOT_ENOUGH)
     * 3. 计算订单总金额 = 商品单价 × 数量
     * 4. 扣减库存（需要加锁防止超卖）
     * 5. 订单初始状态为 PENDING
     * 
     * @param request 创建订单请求
     * @return 订单ID
     */
    Long createOrder(CreateOrderRequest request);
}
```

### 输出

```java
@Override
@Transactional(rollbackFor = Exception.class)
public Long createOrder(CreateOrderRequest request) {
    log.info("创建订单, productId={}, quantity={}", 
        request.getProductId(), request.getQuantity());
    
    // 1. 检查商品是否存在（业务规则1）
    Product product = productMapper.selectById(request.getProductId());
    if (product == null) {
        throw new ResourceNotFoundException("商品", request.getProductId());
    }
    
    // 2. 检查库存是否充足（业务规则2）
    if (product.getStock() < request.getQuantity()) {
        throw new BusinessException("STOCK_NOT_ENOUGH", "库存不足");
    }
    
    // 3. 计算订单总金额（业务规则3）
    BigDecimal totalAmount = product.getPrice()
        .multiply(BigDecimal.valueOf(request.getQuantity()));
    
    // 4. 创建订单（业务规则5：初始状态 PENDING）
    Order order = new Order();
    order.setProductId(request.getProductId());
    order.setQuantity(request.getQuantity());
    order.setTotalAmount(totalAmount);
    order.setStatus(OrderStatus.PENDING);
    orderMapper.insert(order);
    
    // 5. 扣减库存-加锁防止超卖（业务规则4）
    int affected = productMapper.decreaseStockWithLock(
        request.getProductId(), 
        request.getQuantity()
    );
    if (affected == 0) {
        throw new BusinessException("STOCK_NOT_ENOUGH", "库存不足");
    }
    
    log.info("订单创建成功, orderId={}, totalAmount={}", 
        order.getId(), totalAmount);
    return order.getId();
}
```

---

## 注释解析规则总结

| 注释关键词 | 生成内容 |
|-----------|---------|
| `@param xxx 不能为空` | `Assert.notNull(xxx, "xxx不能为空")` |
| `@throws XxxException 条件` | `if (条件) throw new XxxException(...)` |
| `业务规则: 1. xxx` | 对应的业务逻辑代码 |
| `需要脱敏处理` | 脱敏方法调用 |
| `需要加密存储` | `passwordEncoder.encode(...)` |
| `异步` | `@Async` 注解或异步方法 |
| `加锁` | 乐观锁或悲观锁实现 |
