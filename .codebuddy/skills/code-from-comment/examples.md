# 从注释生成代码完整示例

完整的从注释生成代码示例，展示从详细注释到高质量代码实现的完整过程。

---

## 示例 1: Java 后端服务（用户注册功能 - 完整流程）

### 场景描述

**业务背景**: 电商系统用户注册功能，包含完整的参数验证、密码加密、唯一性检查、事务处理。

**技术栈**:
- Spring Boot 3.2.5
- MyBatis-Plus 3.5.4
- MySQL 8.0.32
- Bean Validation

**输入**: 用户注册请求（用户名、邮箱、密码）

**输出**: 注册成功的用户信息

---

### 步骤 1: 解析注释和设计说明

#### 1.1 Controller 层注释（输入）

```java
/**
 * 用户注册接口
 * 
 * 功能说明:
 * 1. 接收用户注册请求（用户名、邮箱、密码）
 * 2. 验证请求参数合法性（使用 @Valid）
 * 3. 调用 Service 层创建用户
 * 4. 返回注册成功的用户信息（不包含密码）
 * 
 * 参数验证规则:
 * - username: 必填，3-20 个字符，仅允许字母、数字、下划线
 * - email: 必填，符合邮箱格式
 * - password: 必填，8-32 个字符，必须包含大小写字母、数字
 * 
 * 业务规则:
 * - BR-001: 用户名必须唯一（不区分大小写）
 * - BR-002: 邮箱必须唯一
 * - BR-003: 密码必须使用 BCrypt 加密存储
 * 
 * 异常处理:
 * - 参数验证失败 → 400 Bad Request
 * - 用户名已存在 → 409 Conflict (错误消息: "用户名已存在")
 * - 邮箱已存在 → 409 Conflict (错误消息: "邮箱已存在")
 * - 其他异常 → 500 Internal Server Error
 * 
 * 安全要求:
 * - 密码不能明文传输（HTTPS）
 * - 密码不能明文存储（BCrypt 加密，强度 10）
 * - 响应中不能包含密码字段
 * 
 * 性能要求:
 * - 响应时间 < 200ms (P95)
 * - 支持 1000 TPS 并发注册
 * 
 * @param request 用户注册请求
 * @return 注册成功的用户信息（不包含密码）
 * @throws MethodArgumentNotValidException 参数验证失败
 * @throws DuplicateKeyException 用户名或邮箱重复
 */
@PostMapping("/register")
public ApiResponse<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
    // TODO: 实现注册逻辑
}
```

#### 1.2 Service 层注释（输入）

```java
/**
 * 用户注册业务逻辑
 * 
 * 执行步骤:
 * 1. 验证用户名唯一性（查询 user 表，忽略大小写）
 * 2. 验证邮箱唯一性（查询 user 表）
 * 3. 密码加密（使用 BCryptPasswordEncoder，强度 10）
 * 4. 插入用户记录（事务管理）
 * 5. 返回用户信息（不包含密码）
 * 
 * 业务规则:
 * - BR-001: 用户名唯一性检查（转小写后比较）
 * - BR-002: 邮箱唯一性检查
 * - BR-003: 密码必须 BCrypt 加密（强度 10，加密时间约 100ms）
 * - BR-004: 使用数据库事务保证数据一致性
 * - BR-005: 注册成功后自动分配 "USER" 角色
 * 
 * 异常处理:
 * - 用户名已存在 → 抛出 DuplicateKeyException("用户名已存在")
 * - 邮箱已存在 → 抛出 DuplicateKeyException("邮箱已存在")
 * - 数据库异常 → 事务回滚
 * 
 * @param request 用户注册请求
 * @return 注册成功的用户信息
 * @throws DuplicateKeyException 用户名或邮箱重复
 */
@Transactional(rollbackFor = Exception.class)
public UserResponse register(RegisterRequest request) {
    // TODO: 实现注册逻辑
}
```

#### 1.3 关键信息提取

**输入参数**:
- `username`: String, 3-20 字符，`^[a-zA-Z0-9_]+$`
- `email`: String, 邮箱格式
- `password`: String, 8-32 字符，`^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$`

**输出结果**:
- `UserResponse`: {id, username, email, createdAt}（不包含密码）

**边界条件**:
- 用户名转小写后检查唯一性
- 邮箱严格唯一
- 密码 BCrypt 加密（强度 10）

**异常情况**:
- `MethodArgumentNotValidException` - 参数验证失败（400）
- `DuplicateKeyException` - 唯一键冲突（409）
- 其他异常 - 数据库或系统异常（500）

**依赖和约束**:
- 数据库: `user` 表
- 索引: `UNIQUE INDEX idx_username (username)`, `UNIQUE INDEX idx_email (email)`
- 性能: 响应时间 < 200ms, 并发 1000 TPS
- 安全: BCrypt 加密、HTTPS 传输、响应不含密码

---

### 步骤 2: 设计代码结构

#### 2.1 分层架构

```
Controller 层 (UserController.register)
    ↓ 调用
Service 层 (UserServiceImpl.register)
    ↓ 验证唯一性
Mapper 层 (UserMapper.selectByUsername / selectByEmail)
    ↓ 插入用户
Mapper 层 (UserMapper.insert)
    ↓ 存储
数据库 (user 表)
```

#### 2.2 技术方案

**参数验证**: `@Valid` + Bean Validation (`@NotBlank`, `@Size`, `@Pattern`, `@Email`)

**唯一性检查**: MyBatis-Plus `LambdaQueryWrapper` + `selectCount`

**密码加密**: `BCryptPasswordEncoder` (强度 10)

**事务管理**: `@Transactional(rollbackFor = Exception.class)`

**错误处理**: `@RestControllerAdvice` 统一异常处理器

**性能优化**: 
- 索引优化（username、email 唯一索引）
- 数据库连接池（HikariCP）

**安全措施**:
- 输入验证（Bean Validation）
- SQL 注入防护（MyBatis 参数化查询）
- 密码加密（BCrypt）
- 响应数据脱敏（不返回密码）

---

### 步骤 3: 编写代码实现

#### 3.1 DTO 类（参数验证）

```java
package com.example.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * 用户注册请求 DTO
 * 
 * 使用 Bean Validation 验证参数合法性。
 * 
 * @author AI Assistant
 */
@Data
public class RegisterRequest {
    /**
     * 用户名，3-20 个字符，仅允许字母、数字、下划线
     */
    @NotBlank(message = "用户名不能为空")
    @Size(min = 3, max = 20, message = "用户名长度必须在3-20之间")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", 
             message = "用户名只能包含字母、数字和下划线")
    private String username;
    
    /**
     * 邮箱，符合邮箱格式
     */
    @NotBlank(message = "邮箱不能为空")
    @Email(message = "邮箱格式不正确")
    private String email;
    
    /**
     * 密码，8-32 个字符，必须包含大小写字母、数字
     */
    @NotBlank(message = "密码不能为空")
    @Size(min = 8, max = 32, message = "密码长度必须在8-32之间")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$", 
             message = "密码必须包含大小写字母和数字")
    private String password;
}
```

#### 3.2 Entity 类（数据库映射）

```java
package com.example.user.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 用户实体类
 * 
 * 对应数据库表 `user`，存储用户基本信息和认证信息。
 * 
 * @author AI Assistant
 */
@Data
@TableName("user")
public class User {
    /**
     * 用户ID（主键，自增）
     */
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /**
     * 用户名（唯一索引）
     */
    private String username;
    
    /**
     * 邮箱（唯一索引）
     */
    private String email;
    
    /**
     * 密码（BCrypt 加密）
     */
    private String password;
    
    /**
     * 创建时间
     */
    private LocalDateTime createdAt;
    
    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;
}
```

#### 3.3 Response 类（返回数据）

```java
package com.example.user.dto;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * 用户信息响应 DTO
 * 
 * 不包含密码等敏感信息。
 * 
 * @author AI Assistant
 */
@Data
public class UserResponse {
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
     * 创建时间
     */
    private LocalDateTime createdAt;
}
```

#### 3.4 Mapper 接口（数据访问层）

```java
package com.example.user.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.user.entity.User;
import org.apache.ibatis.annotations.Mapper;

/**
 * 用户 Mapper 接口
 * 
 * 继承 MyBatis-Plus BaseMapper，自动获得 CRUD 方法。
 * 
 * @author AI Assistant
 */
@Mapper
public interface UserMapper extends BaseMapper<User> {
    // MyBatis-Plus 自动提供:
    // - insert(User user)
    // - selectById(Long id)
    // - selectCount(Wrapper<User> wrapper)
    // 无需手动编写 XML
}
```

#### 3.5 Service 层（业务逻辑）

```java
package com.example.user.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.common.exception.DuplicateKeyException;
import com.example.user.dto.RegisterRequest;
import com.example.user.dto.UserResponse;
import com.example.user.entity.User;
import com.example.user.mapper.UserMapper;
import com.example.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * 用户服务实现类
 * 
 * 负责用户注册、登录等业务逻辑。
 * 
 * @author AI Assistant
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    
    /**
     * 用户注册业务逻辑
     * 
     * 执行步骤:
     * 1. 验证用户名唯一性（查询 user 表，忽略大小写）
     * 2. 验证邮箱唯一性（查询 user 表）
     * 3. 密码加密（使用 BCryptPasswordEncoder，强度 10）
     * 4. 插入用户记录（事务管理）
     * 5. 返回用户信息（不包含密码）
     * 
     * @param request 用户注册请求
     * @return 注册成功的用户信息
     * @throws DuplicateKeyException 用户名或邮箱重复
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public UserResponse register(RegisterRequest request) {
        log.info("用户注册开始，用户名: {}, 邮箱: {}", 
                 request.getUsername(), request.getEmail());
        
        // 步骤 1: 验证用户名唯一性（转小写后比较）
        validateUsernameUnique(request.getUsername());
        
        // 步骤 2: 验证邮箱唯一性
        validateEmailUnique(request.getEmail());
        
        // 步骤 3: 创建用户对象
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        
        // 步骤 4: 密码加密（BCrypt 强度 10，加密时间约 100ms）
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        user.setPassword(encodedPassword);
        
        // 设置时间戳
        LocalDateTime now = LocalDateTime.now();
        user.setCreatedAt(now);
        user.setUpdatedAt(now);
        
        // 步骤 5: 插入数据库（事务管理）
        userMapper.insert(user);
        
        log.info("用户注册成功，用户ID: {}, 用户名: {}", 
                 user.getId(), user.getUsername());
        
        // 步骤 6: 返回用户信息（不包含密码）
        return convertToResponse(user);
    }
    
    /**
     * 验证用户名唯一性（忽略大小写）
     * 
     * 业务规则: BR-001
     * 
     * @param username 用户名
     * @throws DuplicateKeyException 用户名已存在
     */
    private void validateUsernameUnique(String username) {
        // MyBatis-Plus Lambda 查询（类型安全）
        LambdaQueryWrapper<User> query = new LambdaQueryWrapper<>();
        query.eq(User::getUsername, username.toLowerCase());
        
        Long count = userMapper.selectCount(query);
        if (count > 0) {
            log.warn("用户名已存在: {}", username);
            throw new DuplicateKeyException("用户名已存在");
        }
    }
    
    /**
     * 验证邮箱唯一性
     * 
     * 业务规则: BR-002
     * 
     * @param email 邮箱
     * @throws DuplicateKeyException 邮箱已存在
     */
    private void validateEmailUnique(String email) {
        LambdaQueryWrapper<User> query = new LambdaQueryWrapper<>();
        query.eq(User::getEmail, email);
        
        Long count = userMapper.selectCount(query);
        if (count > 0) {
            log.warn("邮箱已存在: {}", email);
            throw new DuplicateKeyException("邮箱已存在");
        }
    }
    
    /**
     * 将 User 实体转换为 UserResponse DTO（不包含密码）
     * 
     * @param user 用户实体
     * @return 用户响应 DTO
     */
    private UserResponse convertToResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }
}
```

#### 3.6 Controller 层（API 接口）

```java
package com.example.user.controller;

import com.example.common.response.ApiResponse;
import com.example.user.dto.RegisterRequest;
import com.example.user.dto.UserResponse;
import com.example.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 用户 Controller
 * 
 * 提供用户相关的 RESTful API 接口。
 * 
 * @author AI Assistant
 */
@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    /**
     * 用户注册接口
     * 
     * 功能说明:
     * 1. 接收用户注册请求（用户名、邮箱、密码）
     * 2. 验证请求参数合法性（使用 @Valid）
     * 3. 调用 Service 层创建用户
     * 4. 返回注册成功的用户信息（不包含密码）
     * 
     * @param request 用户注册请求
     * @return 注册成功的用户信息（不包含密码）
     */
    @PostMapping("/register")
    public ApiResponse<UserResponse> register(
            @Valid @RequestBody RegisterRequest request) {
        log.info("收到用户注册请求，用户名: {}", request.getUsername());
        
        UserResponse user = userService.register(request);
        
        return ApiResponse.success(user);
    }
}
```

#### 3.7 统一异常处理器

```java
package com.example.common.exception;

import com.example.common.response.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

/**
 * 全局异常处理器
 * 
 * 统一处理控制器抛出的异常，返回标准的错误响应。
 * 
 * @author AI Assistant
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    /**
     * 处理参数验证异常（400 Bad Request）
     * 
     * 当 @Valid 验证失败时触发。
     * 
     * @param ex 参数验证异常
     * @return 错误响应
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<Map<String, String>> handleValidationException(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        log.warn("参数验证失败: {}", errors);
        return ApiResponse.error(400, "参数验证失败", errors);
    }
    
    /**
     * 处理唯一键冲突异常（409 Conflict）
     * 
     * 当用户名或邮箱重复时触发。
     * 
     * @param ex 唯一键冲突异常
     * @return 错误响应
     */
    @ExceptionHandler(DuplicateKeyException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ApiResponse<Void> handleDuplicateKeyException(
            DuplicateKeyException ex) {
        log.warn("唯一键冲突: {}", ex.getMessage());
        return ApiResponse.error(409, ex.getMessage());
    }
    
    /**
     * 处理其他未捕获的异常（500 Internal Server Error）
     * 
     * @param ex 异常
     * @return 错误响应
     */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiResponse<Void> handleException(Exception ex) {
        log.error("系统异常", ex);
        return ApiResponse.error(500, "系统异常，请稍后重试");
    }
}
```

#### 3.8 配置类（密码加密器）

```java
package com.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * 安全配置类
 * 
 * 配置密码加密器等安全组件。
 * 
 * @author AI Assistant
 */
@Configuration
public class SecurityConfig {
    
    /**
     * 密码加密器（BCrypt，强度 10）
     * 
     * @return BCryptPasswordEncoder 实例
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        // BCrypt 强度 10（加密时间约 100ms）
        return new BCryptPasswordEncoder(10);
    }
}
```

---

### 步骤 4: 验证代码质量

#### 4.1 单元测试（UserServiceImplTest）

```java
package com.example.user.service.impl;

import com.example.common.exception.DuplicateKeyException;
import com.example.user.dto.RegisterRequest;
import com.example.user.dto.UserResponse;
import com.example.user.entity.User;
import com.example.user.mapper.UserMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * UserServiceImpl 单元测试
 * 
 * @author AI Assistant
 */
@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {
    
    @Mock
    private UserMapper userMapper;
    
    @Mock
    private PasswordEncoder passwordEncoder;
    
    @InjectMocks
    private UserServiceImpl userService;
    
    private RegisterRequest validRequest;
    
    @BeforeEach
    void setUp() {
        validRequest = new RegisterRequest();
        validRequest.setUsername("testuser");
        validRequest.setEmail("test@example.com");
        validRequest.setPassword("Password123");
    }
    
    @Test
    void testRegisterSuccess() {
        // Given: 用户名和邮箱都不存在
        when(userMapper.selectCount(any())).thenReturn(0L);
        when(passwordEncoder.encode(anyString())).thenReturn("$2a$10$...");
        when(userMapper.insert(any(User.class))).thenReturn(1);
        
        // When: 调用注册方法
        UserResponse response = userService.register(validRequest);
        
        // Then: 验证结果
        assertNotNull(response);
        assertEquals("testuser", response.getUsername());
        assertEquals("test@example.com", response.getEmail());
        
        // 验证方法调用
        verify(userMapper, times(2)).selectCount(any()); // 检查用户名和邮箱
        verify(passwordEncoder, times(1)).encode("Password123");
        verify(userMapper, times(1)).insert(any(User.class));
    }
    
    @Test
    void testRegisterUsernameExists() {
        // Given: 用户名已存在
        when(userMapper.selectCount(any())).thenReturn(1L);
        
        // When & Then: 抛出 DuplicateKeyException
        DuplicateKeyException ex = assertThrows(
            DuplicateKeyException.class,
            () -> userService.register(validRequest)
        );
        
        assertEquals("用户名已存在", ex.getMessage());
        
        // 验证未调用插入方法
        verify(userMapper, never()).insert(any(User.class));
    }
    
    @Test
    void testRegisterEmailExists() {
        // Given: 用户名不存在，邮箱已存在
        when(userMapper.selectCount(any()))
            .thenReturn(0L)  // 用户名检查通过
            .thenReturn(1L); // 邮箱检查失败
        
        // When & Then: 抛出 DuplicateKeyException
        DuplicateKeyException ex = assertThrows(
            DuplicateKeyException.class,
            () -> userService.register(validRequest)
        );
        
        assertEquals("邮箱已存在", ex.getMessage());
        
        // 验证未调用插入方法
        verify(userMapper, never()).insert(any(User.class));
    }
}
```

#### 4.2 集成测试（UserControllerIntegrationTest）

```java
package com.example.user.controller;

import com.example.user.dto.RegisterRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * UserController 集成测试
 * 
 * @author AI Assistant
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class UserControllerIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Test
    void testRegisterSuccess() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("newuser");
        request.setEmail("new@example.com");
        request.setPassword("Password123");
        
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.code").value(200))
            .andExpect(jsonPath("$.data.username").value("newuser"))
            .andExpect(jsonPath("$.data.email").value("new@example.com"))
            .andExpect(jsonPath("$.data.password").doesNotExist()); // 不返回密码
    }
    
    @Test
    void testRegisterInvalidUsername() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("ab"); // 少于 3 个字符
        request.setEmail("test@example.com");
        request.setPassword("Password123");
        
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.code").value(400))
            .andExpect(jsonPath("$.data.username").exists());
    }
}
```

---

## 示例 2: TypeScript 前端组件（用户注册表单 - Vue 3 + Composition API + zod）

### 场景描述

**业务背景**: 用户注册表单，包含完整的前端验证、错误提示、加载状态。

**技术栈**:
- Vue 3.4.x
- Composition API
- zod 3.x
- axios
- TypeScript 5.x

---

### 步骤 1: 解析注释和设计说明

#### 1.1 组件注释（输入）

```typescript
/**
 * 用户注册表单组件
 * 
 * 功能说明:
 * 1. 提供用户名、邮箱、密码输入框
 * 2. 实时验证输入合法性（使用 Composition API + zod）
 * 3. 显示验证错误消息
 * 4. 调用注册 API（POST /api/users/register）
 * 5. 显示加载状态和成功/失败提示
 * 
 * 验证规则:
 * - username: 必填，3-20 个字符，仅允许字母、数字、下划线
 * - email: 必填，符合邮箱格式
 * - password: 必填，8-32 个字符，必须包含大小写字母、数字
 * 
 * 业务规则:
 * - BR-001: 实时验证（blur 时验证）
 * - BR-002: 提交前统一验证
 * - BR-003: 注册成功后跳转到登录页
 * - BR-004: 显示后端返回的错误消息（如"用户名已存在"）
 * 
 * 性能优化:
 * - 使用 computed 避免不必要的重新计算
 * - 使用 watch 监听数据变化
 * - 防抖处理（避免频繁验证）
 * 
 * 用户体验:
 * - 加载状态显示（按钮 disabled + 加载图标）
 * - 成功提示（3 秒后自动跳转）
 * - 错误提示（高亮错误字段）
 * 
 * @param onSuccess - 注册成功回调
 */
```

---

### 步骤 2: 设计代码结构

**组件结构**:
```
RegisterForm (表单组件)
  ↓ 使用
Composition API (状态管理)
  ↓ 验证
zod (验证规则)
  ↓ 调用
registerUser API (HTTP 请求)
  ↓ 发送
POST /api/users/register
```

**技术方案**:
- 状态管理: Composition API (`ref`, `reactive`)
- 验证规则: `zod`
- HTTP 请求: `axios`
- 加载状态: `loading` 状态
- 错误提示: `errors` 对象

---

### 步骤 3: 编写代码实现

#### 3.1 Zod 验证规则

```typescript
// src/schemas/registerSchema.ts
import { z } from 'zod';

/**
 * 用户注册表单验证规则
 * 
 * 使用 zod 定义类型安全的验证规则。
 */
export const registerSchema = z.object({
  /**
   * 用户名：3-20 个字符，仅允许字母、数字、下划线
   */
  username: z
    .string()
    .min(3, '用户名至少 3 个字符')
    .max(20, '用户名最多 20 个字符')
    .regex(/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线'),
  
  /**
   * 邮箱：符合邮箱格式
   */
  email: z
    .string()
    .email('邮箱格式不正确'),
  
  /**
   * 密码：8-32 个字符，必须包含大小写字母、数字
   */
  password: z
    .string()
    .min(8, '密码至少 8 个字符')
    .max(32, '密码最多 32 个字符')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      '密码必须包含大小写字母和数字'
    ),
});

/**
 * 表单数据类型（从 zod schema 推导）
 */
export type RegisterFormData = z.infer<typeof registerSchema>;
```

#### 3.2 API 服务

```typescript
// src/services/authService.ts
import axios from 'axios';
import { RegisterFormData } from '../schemas/registerSchema';

/**
 * 用户响应类型
 */
export interface UserResponse {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}

/**
 * API 响应类型
 */
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/**
 * 注册用户 API
 * 
 * @param data 注册表单数据
 * @returns 注册成功的用户信息
 * @throws 注册失败时抛出异常
 */
export const registerUser = async (
  data: RegisterFormData
): Promise<UserResponse> => {
  const response = await axios.post<ApiResponse<UserResponse>>(
    '/api/users/register',
    data
  );
  
  if (response.data.code !== 200) {
    throw new Error(response.data.message || '注册失败');
  }
  
  return response.data.data;
};
```

#### 3.3 注册表单组件

```vue
<!-- src/components/RegisterForm.vue -->
<template>
  <form @submit.prevent="onSubmit" class="register-form">
    <h2>用户注册</h2>
    
    <!-- 用户名输入框 -->
    <div class="form-group">
      <label for="username">用户名</label>
      <input
        id="username"
        v-model="formData.username"
        type="text"
        :class="{ error: errors.username }"
        placeholder="3-20 个字符，仅字母、数字、下划线"
        @blur="validateField('username')"
      />
      <span v-if="errors.username" class="error-message">
        {{ errors.username }}
      </span>
    </div>
    
    <!-- 邮箱输入框 -->
    <div class="form-group">
      <label for="email">邮箱</label>
      <input
        id="email"
        v-model="formData.email"
        type="email"
        :class="{ error: errors.email }"
        placeholder="example@example.com"
        @blur="validateField('email')"
      />
      <span v-if="errors.email" class="error-message">
        {{ errors.email }}
      </span>
    </div>
    
    <!-- 密码输入框 -->
    <div class="form-group">
      <label for="password">密码</label>
      <input
        id="password"
        v-model="formData.password"
        type="password"
        :class="{ error: errors.password }"
        placeholder="8-32 个字符，包含大小写字母和数字"
        @blur="validateField('password')"
      />
      <span v-if="errors.password" class="error-message">
        {{ errors.password }}
      </span>
    </div>
    
    <!-- 提交按钮 -->
    <button
      type="submit"
      :disabled="loading"
      class="submit-button"
    >
      {{ loading ? '注册中...' : '注册' }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { registerSchema, type RegisterFormData } from '../schemas/registerSchema';
import { registerUser } from '../services/authService';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

/**
 * 组件 Props 类型
 */
interface RegisterFormProps {
  /**
   * 注册成功回调
   */
  onSuccess?: (username: string) => void;
}

const props = defineProps<RegisterFormProps>();
const router = useRouter();

/**
 * 表单数据
 */
const formData = reactive<RegisterFormData>({
  username: '',
  email: '',
  password: '',
});

/**
 * 错误消息
 */
const errors = reactive<Partial<Record<keyof RegisterFormData, string>>>({});

/**
 * 加载状态
 */
const loading = ref(false);

/**
 * 验证单个字段
 * 
 * 业务规则: BR-001
 * 
 * @param field 字段名
 */
const validateField = (field: keyof RegisterFormData) => {
  try {
    // 使用 zod 验证单个字段
    registerSchema.shape[field].parse(formData[field]);
    errors[field] = '';
  } catch (error: any) {
    errors[field] = error.errors?.[0]?.message || '验证失败';
  }
};

/**
 * 表单提交处理
 * 
 * 业务规则: BR-002, BR-003, BR-004
 */
const onSubmit = async () => {
  // 清空之前的错误
  Object.keys(errors).forEach(key => {
    errors[key as keyof RegisterFormData] = '';
  });
  
  // 验证所有字段（BR-002）
  try {
    registerSchema.parse(formData);
  } catch (error: any) {
    error.errors?.forEach((err: any) => {
      const field = err.path[0] as keyof RegisterFormData;
      errors[field] = err.message;
    });
    return;
  }
  
  loading.value = true;
  
  try {
    // 调用注册 API
    const user = await registerUser(formData);
    
    // 显示成功提示
    ElMessage.success(`注册成功！欢迎 ${user.username}`);
    
    // 触发成功回调
    props.onSuccess?.(user.username);
    
    // 3 秒后跳转到登录页（BR-003）
    setTimeout(() => {
      router.push('/login');
    }, 3000);
  } catch (error: any) {
    // 显示后端错误消息（BR-004）
    const message = error.response?.data?.message || error.message || '注册失败';
    
    // 根据错误类型设置字段错误
    if (message.includes('用户名')) {
      errors.username = message;
    } else if (message.includes('邮箱')) {
      errors.email = message;
    } else {
      ElMessage.error(message);
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* 样式内容与之前相同 */
</style>
```

#### 3.4 样式文件（已包含在组件 scoped 中）

```css
/* 样式已集成到 Vue 组件的 <style scoped> 中 */

.register-form {
  max-width: 400px;
  margin: 50px auto;
  padding: 30px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.register-form h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #4CAF50;
}

.form-group input.error {
  border-color: #f44336;
}

.error-message {
  display: block;
  margin-top: 5px;
  font-size: 12px;
  color: #f44336;
}

.submit-button {
  width: 100%;
  padding: 12px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.submit-button:hover:not(:disabled) {
  background: #45a049;
}

.submit-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
```

---

## 总结

本文档提供了 2 个完整的从注释生成代码示例：

1. **Java 后端服务**: 展示了完整的 Spring Boot + MyBatis-Plus 注册功能（4 个步骤：解析注释 → 设计结构 → 编写代码 → 验证质量）
2. **TypeScript 前端组件**: 展示了完整的 Vue 3 + Composition API + zod 注册表单

每个示例都包含：
- 详细的注释（输入）
- 关键信息提取（输入参数、输出结果、边界条件、异常情况、依赖约束）
- 分层架构设计（Controller-Service-Mapper、Component-Composable-Service）
- 完整的代码实现（DTO、Entity、Mapper、Service、Controller、组件、API、样式）
- 单元测试和集成测试
- 错误处理和安全措施

参考这些示例，可以快速掌握从注释生成高质量代码的要点和方法。
