# Java 从 API 设计生成代码 - 示例

## 示例1: 用户管理 API

### 输入: OpenAPI 定义

```yaml
openapi: 3.0.0
info:
  title: 用户管理 API
  version: 1.0.0
paths:
  /api/v1/users:
    post:
      summary: 创建用户
      operationId: createUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUserRequest'
      responses:
        '200':
          description: 创建成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Result'
    get:
      summary: 查询用户列表
      operationId: listUsers
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: size
          in: query
          schema:
            type: integer
            default: 10
      responses:
        '200':
          description: 查询成功
          
  /api/v1/users/{id}:
    get:
      summary: 获取用户详情
      operationId: getUser
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
            format: int64
      responses:
        '200':
          description: 查询成功
          
components:
  schemas:
    CreateUserRequest:
      type: object
      required:
        - username
        - password
      properties:
        username:
          type: string
          minLength: 3
          maxLength: 50
        password:
          type: string
          minLength: 6
        email:
          type: string
          format: email
```

### 输出: 生成的代码

#### Entity

> **注意**: 所有字段必须使用 `@TableField` 注解标注实际的数据库字段名。

```java
package com.example.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 用户实体
 */
@Data
@TableName("t_user")
public class User {
    
    /**
     * 用户ID
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;
    
    /**
     * 用户名
     */
    @TableField("username")
    private String username;
    
    /**
     * 密码（加密存储）
     */
    @TableField("password")
    private String password;
    
    /**
     * 邮箱
     */
    @TableField("email")
    private String email;
    
    /**
     * 状态：0-禁用，1-启用
     */
    @TableField("status")
    private Integer status;
    
    /**
     * 创建时间
     */
    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    /**
     * 更新时间
     */
    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}
```

#### DTO

```java
package com.example.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

/**
 * 创建用户请求
 */
@Data
public class CreateUserRequest {
    
    /**
     * 用户名
     */
    @NotBlank(message = "用户名不能为空")
    @Size(min = 3, max = 50, message = "用户名长度必须在3-50之间")
    private String username;
    
    /**
     * 密码
     */
    @NotBlank(message = "密码不能为空")
    @Size(min = 6, message = "密码长度不能少于6位")
    private String password;
    
    /**
     * 邮箱
     */
    @Email(message = "邮箱格式不正确")
    private String email;
}
```

```java
package com.example.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 用户视图对象
 */
@Data
public class UserVO {
    
    /**
     * 用户ID
     */
    private Long id;
    
    /**
     * 用户名
     */
    private String username;
    
    /**
     * 邮箱
     */
    private String email;
    
    /**
     * 状态
     */
    private Integer status;
    
    /**
     * 创建时间
     */
    private LocalDateTime createTime;
}
```

#### Mapper

```java
package com.example.mapper;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.entity.User;
import org.apache.ibatis.annotations.Mapper;

/**
 * 用户 Mapper
 */
@Mapper
public interface UserMapper extends BaseMapper<User> {
    
    /**
     * 检查用户名是否存在
     */
    default boolean existsByUsername(String username) {
        return exists(new LambdaQueryWrapper<User>()
                .eq(User::getUsername, username));
    }
}
```

#### Service

```java
package com.example.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.example.dto.CreateUserRequest;
import com.example.entity.User;

/**
 * 用户服务接口
 */
public interface UserService extends IService<User> {
    
    /**
     * 创建用户
     */
    Long createUser(CreateUserRequest request);
}
```

```java
package com.example.service.impl;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.dto.CreateUserRequest;
import com.example.entity.User;
import com.example.exception.BusinessException;
import com.example.exception.ResourceNotFoundException;
import com.example.mapper.UserMapper;
import com.example.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 用户服务实现
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {
    
    private final PasswordEncoder passwordEncoder;
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createUser(CreateUserRequest request) {
        log.info("创建用户, username={}", request.getUsername());
        
        // 检查用户名唯一性
        if (baseMapper.existsByUsername(request.getUsername())) {
            throw new BusinessException("USER_EXISTS", "用户名已存在");
        }
        
        // 构建用户实体
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setStatus(1);
        
        // 保存用户
        save(user);
        
        log.info("用户创建成功, userId={}", user.getId());
        return user.getId();
    }
}
```

#### Controller

```java
package com.example.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.common.Result;
import com.example.dto.CreateUserRequest;
import com.example.dto.UserVO;
import com.example.entity.User;
import com.example.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

/**
 * 用户管理控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "用户管理")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    /**
     * 创建用户
     */
    @Operation(summary = "创建用户")
    @PostMapping
    public Result<Long> createUser(@Valid @RequestBody CreateUserRequest request) {
        Long userId = userService.createUser(request);
        return Result.success(userId);
    }
    
    /**
     * 获取用户详情
     */
    @Operation(summary = "获取用户详情")
    @GetMapping("/{id}")
    public Result<UserVO> getUser(
            @Parameter(description = "用户ID") @PathVariable Long id) {
        User user = userService.getById(id);
        if (user == null) {
            throw new ResourceNotFoundException("用户", id);
        }
        UserVO vo = new UserVO();
        BeanUtils.copyProperties(user, vo);
        return Result.success(vo);
    }
    
    /**
     * 查询用户列表
     */
    @Operation(summary = "查询用户列表")
    @GetMapping
    public Result<Page<UserVO>> listUsers(
            @Parameter(description = "页码") @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "每页数量") @RequestParam(defaultValue = "10") int size) {
        Page<User> userPage = userService.page(Page.of(page, size));
        // 转换为 VO
        Page<UserVO> voPage = new Page<>(userPage.getCurrent(), userPage.getSize(), userPage.getTotal());
        voPage.setRecords(userPage.getRecords().stream().map(user -> {
            UserVO vo = new UserVO();
            BeanUtils.copyProperties(user, vo);
            return vo;
        }).toList());
        return Result.success(voPage);
    }
}
```

---

## 示例2: 订单管理 API（简化版）

### 输入

```yaml
paths:
  /api/v1/orders:
    post:
      summary: 创建订单
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                productId:
                  type: integer
                quantity:
                  type: integer
```

### 输出

```java
// Controller
@PostMapping
public Result<Long> createOrder(@Valid @RequestBody CreateOrderRequest request) {
    Long orderId = orderService.createOrder(request);
    return Result.success(orderId);
}

// Service
@Override
@Transactional(rollbackFor = Exception.class)
public Long createOrder(CreateOrderRequest request) {
    log.info("创建订单, productId={}, quantity={}", 
        request.getProductId(), request.getQuantity());
    
    // 1. 检查商品是否存在
    Product product = productMapper.selectById(request.getProductId());
    if (product == null) {
        throw new ResourceNotFoundException("商品", request.getProductId());
    }
    
    // 2. 检查库存
    if (product.getStock() < request.getQuantity()) {
        throw new BusinessException("STOCK_NOT_ENOUGH", "库存不足");
    }
    
    // 3. 创建订单
    Order order = new Order();
    order.setProductId(request.getProductId());
    order.setQuantity(request.getQuantity());
    order.setTotalAmount(product.getPrice().multiply(BigDecimal.valueOf(request.getQuantity())));
    order.setStatus(OrderStatus.PENDING);
    orderMapper.insert(order);
    
    // 4. 扣减库存
    productMapper.decreaseStock(request.getProductId(), request.getQuantity());
    
    log.info("订单创建成功, orderId={}", order.getId());
    return order.getId();
}
```
