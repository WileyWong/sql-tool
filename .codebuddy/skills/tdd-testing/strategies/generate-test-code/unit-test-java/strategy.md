# 单元测试代码生成策略

根据测试用例文档生成 JUnit 5 + Mockito 单元测试代码，确保类型安全和零编译错误。

---

## 适用场景

- 已通过标准化检查的单元测试用例文档
- Service/Repository/Utils 层测试
- 需要 Mock 隔离依赖

---

## 技术栈

| 组件 | 版本 | 用途 |
|------|------|------|
| JUnit 5 | 5.9+ | 测试框架 |
| Mockito | 4.0+ | Mock 框架 |
| AssertJ | 3.24+ | 流畅断言 |
| Java | 11+ | 运行环境 |

---

## 核心原则

### 强制执行规则

> ⛔ **必须严格执行，违反立即停止生成**

1. **强制源码验证**
   - ✅ 必须 `read_file` 读取被测类完整源码
   - ✅ 必须 `read_file` 读取所有依赖类源码
   - ✅ 必须 `read_file` 读取所有枚举类源码
   - ❌ 禁止跳过源码读取直接生成代码

2. **禁止方法假设**
   - ❌ 禁止基于类名推测方法存在性
   - ❌ 禁止基于字段名推测方法名
   - ✅ 强制从源码精确提取实际方法

3. **禁止枚举值假设**
   - ❌ 禁止基于字段名推测枚举值
   - ❌ 禁止使用通用枚举名（ACTIVE, ADMIN 等）
   - ✅ 强制从枚举类源码提取实际枚举值

4. **字段类型精确匹配**
   - ✅ Integer 用 `1`，Long 用 `1L`
   - ✅ Mock 参数强类型：`any(Integer.class)`

---

## 代码结构

### 测试类模板

```java
package com.example.{module}.service;

import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * {ClassName} 单元测试
 * 覆盖: 正常/边界/异常/Mock验证
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("{ClassName} 单元测试")
class {ClassName}Test {

    @Mock
    private UserRepository userRepository;
    
    @Mock
    private CacheService cacheService;
    
    @InjectMocks
    private UserService userService;
    
    // 测试数据
    private static final Long TEST_USER_ID = 1L;
    private static final String TEST_USERNAME = "testuser";
}
```

### 正常场景测试

```java
@Test
@DisplayName("TC001 - 正常创建用户")
void shouldCreateUserWhenValidInput() {
    // Arrange
    CreateUserRequest request = new CreateUserRequest();
    request.setUsername(TEST_USERNAME);
    request.setEmail("test@example.com");
    
    User expectedUser = new User();
    expectedUser.setId(TEST_USER_ID);
    expectedUser.setUsername(TEST_USERNAME);
    
    when(userRepository.existsByUsername(TEST_USERNAME)).thenReturn(false);
    when(userRepository.save(any(User.class))).thenReturn(expectedUser);
    
    // Act
    UserDTO result = userService.createUser(request);
    
    // Assert
    assertNotNull(result);
    assertEquals(TEST_USER_ID, result.getId());
    assertEquals(TEST_USERNAME, result.getUsername());
    
    // Verify
    verify(userRepository).existsByUsername(TEST_USERNAME);
    verify(userRepository).save(any(User.class));
}
```

### 边界条件测试

```java
@Test
@DisplayName("TC010 - 空值处理")
void shouldHandleNullInput() {
    // Act & Assert
    assertThrows(IllegalArgumentException.class, () -> {
        userService.createUser(null);
    });
    
    // Verify - 不应调用 Repository
    verifyNoInteractions(userRepository);
}

@Test
@DisplayName("TC011 - 空列表处理")
void shouldReturnEmptyListWhenNoData() {
    // Arrange
    when(userRepository.findAll()).thenReturn(Collections.emptyList());
    
    // Act
    List<UserDTO> result = userService.getAllUsers();
    
    // Assert
    assertNotNull(result);
    assertTrue(result.isEmpty());
}
```

### 异常场景测试

```java
@Test
@DisplayName("TC020 - 用户名已存在")
void shouldThrowExceptionWhenUsernameExists() {
    // Arrange
    CreateUserRequest request = new CreateUserRequest();
    request.setUsername(TEST_USERNAME);
    
    when(userRepository.existsByUsername(TEST_USERNAME)).thenReturn(true);
    
    // Act & Assert
    BusinessException exception = assertThrows(BusinessException.class, () -> {
        userService.createUser(request);
    });
    
    assertEquals("用户名已存在", exception.getMessage());
    
    // Verify - 不应调用 save
    verify(userRepository, never()).save(any());
}

@Test
@DisplayName("TC021 - 依赖服务异常")
void shouldHandleRepositoryException() {
    // Arrange
    when(userRepository.findById(TEST_USER_ID))
        .thenThrow(new RuntimeException("Database connection failed"));
    
    // Act & Assert
    assertThrows(ServiceException.class, () -> {
        userService.getUser(TEST_USER_ID);
    });
}
```

### Mock 验证测试

```java
@Test
@DisplayName("TC030 - 验证 Repository 调用")
void shouldCallRepositorySaveOnce() {
    // Arrange
    CreateUserRequest request = new CreateUserRequest();
    request.setUsername(TEST_USERNAME);
    
    when(userRepository.existsByUsername(anyString())).thenReturn(false);
    when(userRepository.save(any(User.class))).thenReturn(new User());
    
    // Act
    userService.createUser(request);
    
    // Verify
    verify(userRepository, times(1)).save(any(User.class));
    verify(userRepository, times(1)).existsByUsername(TEST_USERNAME);
}

@Test
@DisplayName("TC031 - 验证参数匹配")
void shouldPassCorrectParametersToRepository() {
    // Arrange
    CreateUserRequest request = new CreateUserRequest();
    request.setUsername(TEST_USERNAME);
    request.setEmail("test@example.com");
    
    ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
    
    when(userRepository.existsByUsername(anyString())).thenReturn(false);
    when(userRepository.save(any(User.class))).thenReturn(new User());
    
    // Act
    userService.createUser(request);
    
    // Verify
    verify(userRepository).save(userCaptor.capture());
    
    User capturedUser = userCaptor.getValue();
    assertEquals(TEST_USERNAME, capturedUser.getUsername());
    assertEquals("test@example.com", capturedUser.getEmail());
}
```

---

## 类型安全检查

### 常见类型错误

```java
// ❌ 错误：类型推测
task.setTaskId(1L);        // 假设 id 是 Long，实际可能是 Integer
task.setStatus(1);         // 方法名可能是 setTaskStatus

// ✅ 正确：基于源码
// 从源码解析: private Integer taskId; → setTaskId(Integer)
task.setTaskId(1);         // Integer 类型
task.setTaskStatus(1);     // 正确方法名
```

### 枚举值验证

```java
// ❌ 错误：假设枚举值
user.setStatus(StatusEnum.ACTIVE);  // 枚举中可能不存在

// ✅ 正确：从源码提取
// 从 StatusEnum.java 解析得到: PENDING, COMPLETED, CANCELLED
user.setStatus(StatusEnum.PENDING);  // 确实存在的枚举值
```

### Mock 参数类型

```java
// ❌ 错误：类型不匹配
when(repository.findById(1L)).thenReturn(user);  // Long 传给 Integer

// ✅ 正确：精确类型
// 从源码解析方法签名: findById(Integer id)
when(repository.findById(1)).thenReturn(user);   // Integer 参数
when(repository.findById(any(Integer.class))).thenReturn(user);
```

---

## 版本兼容性

### Mockito API 选择

| API | 兼容版本 | 推荐 |
|-----|---------|------|
| `verifyZeroInteractions()` | 1.0+ | ✅ 推荐（全版本兼容） |
| `verifyNoInteractions()` | 3.1.0+ | ⚠️ 需确认版本 |
| `ArgumentCaptor.forClass()` | 1.0+ | ✅ 推荐 |
| `initMocks()` | 1.0+ | ✅ 推荐 |

### JUnit API 选择

| API | 兼容版本 | 说明 |
|-----|---------|------|
| `@ExtendWith` | JUnit 5.0+ | JUnit 5 扩展 |
| `@RunWith` | JUnit 4 | JUnit 4 兼容 |
| `assertEquals(expected, actual, message)` | JUnit 5 | 参数顺序 |

---

## 输出产物

| 文件 | 路径 | 说明 |
|------|------|------|
| 测试类 | `src/test/java/com/example/{module}/{ClassName}Test.java` | 测试代码 |

---

## 验证清单

### 源码验证

- [ ] 已读取被测类完整源码
- [ ] 已读取所有依赖类源码
- [ ] 已读取所有枚举类源码
- [ ] 所有方法调用已验证存在性
- [ ] 所有枚举值已验证存在性

### 代码质量

- [ ] 使用 `@ExtendWith(MockitoExtension.class)`
- [ ] 使用 `@Mock` 和 `@InjectMocks`
- [ ] 遵循 AAA 模式（Arrange-Act-Assert）
- [ ] 包含 Mock 验证（verify）
- [ ] 类型精确匹配（Integer/Long）
- [ ] 使用 `@DisplayName` 注解

### 覆盖率

- [ ] 正常场景覆盖
- [ ] 边界条件覆盖（null/空集合）
- [ ] 异常场景覆盖
- [ ] Mock 验证覆盖
- [ ] 目标覆盖率 ≥ 85%

---

## 相关资源

- [测试用例规范](../../../test-case-spec-standard.md)
- [完整示例](../../../examples/example-02-whitebox.md)
- [类型安全规范](../../../type-safety.md)
