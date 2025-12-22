# 代码生成参考手册

## 1. Spring Boot 3 项目结构

### 1.1 推荐的项目结构

```
src/main/java/com/example/demo/
├── controller/          # REST API 控制器
│   ├── UserController.java
│   └── OrderController.java
├── service/             # 业务逻辑层
│   ├── UserService.java
│   ├── OrderService.java
│   └── impl/
│       ├── UserServiceImpl.java
│       └── OrderServiceImpl.java
├── mapper/              # 数据访问层（MyBatis-Plus）
│   ├── UserMapper.java
│   └── OrderMapper.java
├── entity/              # 实体类
│   ├── User.java
│   └── Order.java
├── dto/                 # 数据传输对象
│   ├── request/
│   │   ├── UserCreateDTO.java
│   │   └── UserUpdateDTO.java
│   └── response/
│       └── UserResponseDTO.java
├── exception/           # 自定义异常
│   ├── ResourceNotFoundException.java
│   ├── InvalidOrderStatusException.java
│   └── GlobalExceptionHandler.java
├── config/              # 配置类
│   ├── MyBatisPlusConfig.java
│   ├── SecurityConfig.java
│   └── OpenApiConfig.java
├── enums/               # 枚举类
│   ├── OrderStatus.java
│   └── UserRole.java
└── Application.java     # 应用启动类
```

### 1.2 分层职责

| 层级 | 职责 | 注解 | 示例 |
|------|------|------|------|
| Controller | HTTP 请求处理、参数验证、响应格式化 | @RestController, @RequestMapping | UserController.java |
| Service | 业务逻辑、事务管理、数据转换 | @Service, @Transactional | UserServiceImpl.java |
| Mapper | 数据访问、SQL 操作 | @Mapper | UserMapper.java |
| Entity | 数据库表映射、字段定义 | @TableName, @TableId | User.java |
| DTO | API 输入输出、数据传输 | @Data, @Valid | UserCreateDTO.java |

---

## 2. MyBatis-Plus 最佳实践

### 2.1 Entity 注解

```java
@Data
@TableName("user")  // 对应数据库表名
public class User {
    
    @TableId(value = "id", type = IdType.AUTO)  // 主键，自增
    private Long id;
    
    @TableField("username")  // 对应数据库字段名
    private String username;
    
    @TableField(value = "create_time", fill = FieldFill.INSERT)  // 插入时自动填充
    private LocalDateTime createTime;
    
    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)  // 插入和更新时自动填充
    private LocalDateTime updateTime;
    
    @TableField(exist = false)  // 不是数据库字段
    private String tempField;
    
    @TableLogic  // 逻辑删除字段
    private Integer deleted;
}
```

### 2.2 Mapper 接口

```java
@Mapper
public interface UserMapper extends BaseMapper<User> {
    // BaseMapper 提供的方法：
    // - insert(T entity)
    // - deleteById(Serializable id)
    // - updateById(T entity)
    // - selectById(Serializable id)
    // - selectList(Wrapper<T> queryWrapper)
    // - selectPage(Page<T> page, Wrapper<T> queryWrapper)
    
    // 自定义查询方法
    @Select("SELECT * FROM user WHERE username = #{username}")
    User findByUsername(@Param("username") String username);
}
```

### 2.3 常用查询示例

```java
// 1. 条件查询
LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
wrapper.eq(User::getUsername, "john")
       .ge(User::getAge, 18)
       .orderByDesc(User::getCreateTime);
List<User> users = userMapper.selectList(wrapper);

// 2. 分页查询
Page<User> page = new Page<>(1, 20);
LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
wrapper.like(User::getUsername, "john");
Page<User> result = userMapper.selectPage(page, wrapper);

// 3. 批量操作
List<User> users = Arrays.asList(user1, user2, user3);
userService.saveBatch(users);  // 批量插入

// 4. 更新操作
LambdaUpdateWrapper<User> wrapper = new LambdaUpdateWrapper<>();
wrapper.eq(User::getId, 1L)
       .set(User::getStatus, 1);
userMapper.update(null, wrapper);
```

---

## 3. Spring Boot 注解详解

### 3.1 Controller 注解

```java
@RestController  // 组合了 @Controller 和 @ResponseBody
@RequestMapping("/api/users")
@Validated  // 启用方法参数验证
@Tag(name = "用户管理", description = "用户 CRUD 操作")  // OpenAPI 文档
public class UserController {
    
    @PostMapping  // 等同于 @RequestMapping(method = RequestMethod.POST)
    @Operation(summary = "创建用户")  // OpenAPI 文档
    public ResponseEntity<UserResponseDTO> createUser(
            @Valid @RequestBody UserCreateDTO dto  // 请求体，启用验证
    ) {
        // 实现代码
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(
            @PathVariable Long id,  // 路径变量
            @RequestHeader("X-Auth-Token") String token  // 请求头
    ) {
        // 实现代码
    }
    
    @GetMapping
    public ResponseEntity<Page<UserResponseDTO>> getUserList(
            @RequestParam(defaultValue = "1") int page,  // 查询参数，默认值 1
            @RequestParam(defaultValue = "20") int size  // 查询参数，默认值 20
    ) {
        // 实现代码
    }
}
```

### 3.2 Service 注解

```java
@Service  // 标记为 Service Bean
@Slf4j  // Lombok 日志注解
@RequiredArgsConstructor  // Lombok 构造函数注入
public class UserServiceImpl implements UserService {
    
    private final UserMapper userMapper;  // final 字段，通过构造函数注入
    
    @Override
    @Transactional  // 事务管理
    public UserResponseDTO createUser(UserCreateDTO dto) {
        // 实现代码
    }
    
    @Override
    @Transactional(readOnly = true)  // 只读事务
    public UserResponseDTO getUserById(Long id) {
        // 实现代码
    }
}
```

### 3.3 验证注解

```java
public class UserCreateDTO {
    
    @NotNull(message = "ID 不能为空")
    private Long id;
    
    @NotBlank(message = "用户名不能为空")  // 不能为 null、空字符串或只包含空格
    @Size(min = 3, max = 20, message = "用户名长度必须在 3-20 之间")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "用户名只能包含字母、数字和下划线")
    private String username;
    
    @Email(message = "邮箱格式不正确")
    private String email;
    
    @Min(value = 18, message = "年龄必须大于等于 18")
    @Max(value = 150, message = "年龄必须小于等于 150")
    private Integer age;
    
    @DecimalMin(value = "0.0", message = "价格不能为负数")
    @DecimalMax(value = "9999.99", message = "价格不能超过 9999.99")
    private BigDecimal price;
    
    @Past(message = "出生日期必须是过去的日期")
    private LocalDate birthDate;
    
    @Future(message = "过期日期必须是未来的日期")
    private LocalDate expiryDate;
}
```

---

## 4. Vue 3 + TypeScript 最佳实践

### 4.1 项目结构

```
src/
├── components/          # 可复用组件
│   ├── common/
│   │   ├── Button.vue
│   │   ├── Input.vue
│   │   └── Modal.vue
│   └── product/
│       ├── ProductCard.vue
│       └── ProductList.vue
├── views/               # 页面组件
│   ├── HomePage.vue
│   ├── ProductListPage.vue
│   └── ProductDetailPage.vue
├── composables/         # 组合式函数
│   ├── useProductList.ts
│   └── useAuth.ts
├── services/            # API 调用服务
│   ├── api.ts
│   ├── productService.ts
│   └── userService.ts
├── types/               # TypeScript 类型定义
│   ├── product.ts
│   └── user.ts
├── utils/               # 工具函数
│   ├── request.ts
│   └── format.ts
├── stores/              # 状态管理（Pinia）
│   ├── product.ts
│   └── user.ts
├── App.vue
└── main.ts
```

### 4.2 TypeScript 类型定义

```typescript
// 基础类型
export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}

// 联合类型
export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';

// 泛型接口
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 分页响应
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// 请求参数
export interface ProductListParams {
  page: number;
  size: number;
  keyword?: string;
  categoryId?: number;
  sort?: 'price_asc' | 'price_desc' | 'created_desc';
}

// 组件 Props
export interface ProductCardProps {
  product: Product;
  onClick?: (id: number) => void;
  className?: string;
}
```

### 4.3 Composables 组合式函数

```typescript
// 数据获取 Composable
export const useProductList = (params: Ref<ProductListParams>) => {
  const data = ref<Product[]>([]);
  const loading = ref(true);
  const error = ref<Error | null>(null);
  
  const fetchData = async () => {
    try {
      loading.value = true;
      error.value = null;
      const response = await productService.getList(params.value);
      data.value = response.content;
    } catch (err) {
      error.value = err as Error;
    } finally {
      loading.value = false;
    }
  };
  
  watch(params, () => {
    fetchData();
  }, { deep: true, immediate: true });
  
  return { data, loading, error, refresh: fetchData };
};

// 表单处理 Composable
export const useForm = <T extends Record<string, any>>(initialValues: T) => {
  const values = reactive<T>({ ...initialValues });
  const errors = ref<Partial<Record<keyof T, string>>>({});
  
  const handleChange = (name: keyof T, value: any) => {
    values[name] = value;
  };
  
  const validate = (validationRules: Record<keyof T, (value: any) => string | null>) => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;
    
    Object.keys(validationRules).forEach((key) => {
      const error = validationRules[key as keyof T](values[key as keyof T]);
      if (error) {
        newErrors[key as keyof T] = error;
        isValid = false;
      }
    });
    
    errors.value = newErrors;
    return isValid;
  };
  
  return { values, errors, handleChange, validate };
};
```

### 4.4 Vue 组件模式

```vue
<!-- 1. 基础组件 -->
<!-- ProductCard.vue -->
<script setup lang="ts">
import type { Product } from '../types/product';

interface Props {
  product: Product;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  click: [id: number]
}>();

const handleClick = () => {
  emit('click', props.product.id);
};
</script>

<template>
  <div class="product-card" @click="handleClick">
    <img :src="product.imageUrl" :alt="product.name" />
    <h3>{{ product.name }}</h3>
    <p>¥{{ product.price.toFixed(2) }}</p>
  </div>
</template>

<!-- 2. 带状态的组件 -->
<!-- ProductList.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { useProductList } from '../composables/useProductList';
import type { ProductListParams } from '../types/product';

const params = ref<ProductListParams>({
  page: 1,
  size: 20
});

const { data, loading, error } = useProductList(params);
</script>

<template>
  <div>
    <LoadingSpinner v-if="loading" />
    <ErrorMessage v-else-if="error" :error="error" />
    <div v-else>
      <ProductCard
        v-for="product in data"
        :key="product.id"
        :product="product"
      />
    </div>
  </div>
</template>

<!-- 3. 高阶组件（HOC）模式 - 使用组合式函数 -->
<script setup lang="ts">
import { useAuth } from '../composables/useAuth';
import { useRouter } from 'vue-router';

const { user, loading } = useAuth();
const router = useRouter();

if (!loading.value && !user.value) {
  router.push('/login');
}
</script>

<template>
  <LoadingSpinner v-if="loading" />
  <slot v-else-if="user" />
</template>

<!-- 4. Scoped Slots (类似 Render Props) -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Props {
  fetch: () => Promise<any>;
}

const props = defineProps<Props>();
const data = ref(null);
const loading = ref(true);
const error = ref<Error | null>(null);

onMounted(() => {
  props.fetch()
    .then(result => { data.value = result; })
    .catch(err => { error.value = err; })
    .finally(() => { loading.value = false; });
});
</script>

<template>
  <slot :data="data" :loading="loading" :error="error" />
</template>
```

---

## 5. 异常处理最佳实践

### 5.1 自定义异常

```java
// 资源未找到异常
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}

// 业务异常
public class BusinessException extends RuntimeException {
    private final String code;
    
    public BusinessException(String code, String message) {
        super(message);
        this.code = code;
    }
    
    public String getCode() {
        return code;
    }
}

// 验证异常
public class ValidationException extends RuntimeException {
    private final Map<String, String> errors;
    
    public ValidationException(Map<String, String> errors) {
        super("参数验证失败");
        this.errors = errors;
    }
    
    public Map<String, String> getErrors() {
        return errors;
    }
}
```

### 5.2 全局异常处理

```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    
    /**
     * 处理参数验证异常
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        ErrorResponse response = ErrorResponse.builder()
                .code("VALIDATION_ERROR")
                .message("参数验证失败")
                .details(errors)
                .timestamp(LocalDateTime.now())
                .build();
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
    
    /**
     * 处理资源未找到异常
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(
            ResourceNotFoundException ex) {
        ErrorResponse response = ErrorResponse.builder()
                .code("RESOURCE_NOT_FOUND")
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }
    
    /**
     * 处理业务异常
     */
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(
            BusinessException ex) {
        ErrorResponse response = ErrorResponse.builder()
                .code(ex.getCode())
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
    
    /**
     * 处理其他未知异常
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception ex) {
        log.error("未知异常", ex);
        
        ErrorResponse response = ErrorResponse.builder()
                .code("INTERNAL_ERROR")
                .message("服务器内部错误")
                .timestamp(LocalDateTime.now())
                .build();
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
```

### 5.3 错误响应格式

```java
@Data
@Builder
public class ErrorResponse {
    private String code;              // 错误码
    private String message;           // 错误信息
    private Object details;           // 详细信息（验证错误、堆栈信息等）
    private LocalDateTime timestamp;  // 时间戳
}
```

---

## 6. 单元测试最佳实践

### 6.1 JUnit 5 + Mockito

```java
@ExtendWith(MockitoExtension.class)  // 使用 Mockito 扩展
class UserServiceImplTest {
    
    @Mock  // 创建 Mock 对象
    private UserMapper userMapper;
    
    @Mock
    private PasswordEncoder passwordEncoder;
    
    @InjectMocks  // 注入 Mock 对象
    private UserServiceImpl userService;
    
    @Test
    @DisplayName("创建用户 - 成功")
    void createUser_Success() {
        // Given（准备测试数据）
        UserCreateDTO dto = new UserCreateDTO();
        dto.setUsername("testuser");
        dto.setPassword("password123");
        
        when(userMapper.selectOne(any())).thenReturn(null);
        when(passwordEncoder.encode(anyString())).thenReturn("encoded_password");
        when(userMapper.insert(any(User.class))).thenReturn(1);
        
        // When（执行测试）
        UserResponseDTO response = userService.createUser(dto);
        
        // Then（验证结果）
        assertNotNull(response);
        assertEquals("testuser", response.getUsername());
        verify(userMapper, times(1)).insert(any(User.class));
    }
    
    @Test
    @DisplayName("创建用户 - 用户名已存在")
    void createUser_DuplicateUsername_ThrowsException() {
        // Given
        UserCreateDTO dto = new UserCreateDTO();
        dto.setUsername("existinguser");
        
        User existingUser = new User();
        existingUser.setUsername("existinguser");
        when(userMapper.selectOne(any())).thenReturn(existingUser);
        
        // When & Then
        assertThrows(IllegalArgumentException.class, () -> {
            userService.createUser(dto);
        });
        
        verify(userMapper, never()).insert(any(User.class));
    }
}
```

### 6.2 Vue Test Utils

```typescript
import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import ProductList from './ProductList.vue';
import { productService } from '../services/productService';

vi.mock('../services/productService');

describe('ProductList', () => {
  const mockProducts = {
    content: [
      { id: 1, name: 'Product 1', price: 99.99 }
    ],
    page: 1,
    size: 20,
    totalElements: 1,
    totalPages: 1
  };
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders loading state initially', () => {
    vi.mocked(productService.getProductList).mockReturnValue(
      new Promise(() => {})
    );
    
    const wrapper = mount(ProductList, {
      global: {
        stubs: ['router-link', 'router-view']
      }
    });
    
    expect(wrapper.find('.animate-spin').exists()).toBe(true);
  });
  
  it('renders products after loading', async () => {
    vi.mocked(productService.getProductList).mockResolvedValue(mockProducts);
    
    const wrapper = mount(ProductList, {
      global: {
        stubs: ['router-link', 'router-view']
      }
    });
    
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(wrapper.text()).toContain('Product 1');
  });
  
  it('handles user interaction', async () => {
    vi.mocked(productService.getProductList).mockResolvedValue(mockProducts);
    
    const wrapper = mount(ProductList, {
      global: {
        stubs: ['router-link', 'router-view']
      }
    });
    
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const searchInput = wrapper.find('input[placeholder="搜索商品..."]');
    await searchInput.setValue('test');
    
    expect(productService.getProductList).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 1,
        size: 20,
        keyword: 'test'
      })
    );
  });
});
```

---

## 7. 代码质量标准

### 7.1 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 类名 | 大驼峰（PascalCase） | `UserService`, `OrderController` |
| 方法名 | 小驼峰（camelCase） | `createUser()`, `getUserById()` |
| 变量名 | 小驼峰（camelCase） | `userName`, `orderList` |
| 常量名 | 大写 + 下划线 | `MAX_SIZE`, `DEFAULT_PAGE` |
| 包名 | 全小写 | `com.example.demo.service` |

### 7.2 注释规范

```java
/**
 * 用户服务实现
 * 
 * @author John Doe
 * @since 1.0.0
 */
@Service
public class UserServiceImpl implements UserService {
    
    /**
     * 创建用户
     * 
     * @param dto 用户创建 DTO
     * @return 用户响应 DTO
     * @throws IllegalArgumentException 如果用户名已存在
     */
    @Override
    public UserResponseDTO createUser(UserCreateDTO dto) {
        // 实现代码
    }
}
```

### 7.3 日志规范

```java
@Slf4j
public class UserServiceImpl implements UserService {
    
    public UserResponseDTO createUser(UserCreateDTO dto) {
        log.info("创建用户: username={}", dto.getUsername());
        
        try {
            // 业务逻辑
            User user = saveUser(dto);
            log.info("用户创建成功: id={}, username={}", user.getId(), user.getUsername());
            return convert(user);
        } catch (Exception e) {
            log.error("用户创建失败: username={}", dto.getUsername(), e);
            throw e;
        }
    }
}
```

---

## 8. 性能优化建议

### 8.1 数据库优化

```java
// 1. 使用分页查询
Page<User> page = new Page<>(1, 20);
userMapper.selectPage(page, wrapper);

// 2. 只查询需要的字段
LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
wrapper.select(User::getId, User::getUsername, User::getEmail);

// 3. 批量操作
userService.saveBatch(users);  // 批量插入
userService.updateBatchById(users);  // 批量更新

// 4. 使用索引
@TableName(value = "user", indexes = {
    @Index(name = "idx_username", columns = "username", unique = true)
})
```

### 8.2 缓存策略

```java
@Service
public class UserServiceImpl implements UserService {
    
    @Cacheable(value = "users", key = "#id")
    public UserResponseDTO getUserById(Long id) {
        // 缓存未命中时执行
        return convertToDTO(userMapper.selectById(id));
    }
    
    @CachePut(value = "users", key = "#result.id")
    public UserResponseDTO updateUser(Long id, UserUpdateDTO dto) {
        // 更新缓存
        return convertToDTO(updateAndReturn(id, dto));
    }
    
    @CacheEvict(value = "users", key = "#id")
    public void deleteUser(Long id) {
        // 删除缓存
        userMapper.deleteById(id);
    }
}
```

### 8.3 异步处理

```java
@Service
public class EmailService {
    
    @Async  // 异步执行
    public CompletableFuture<Void> sendEmail(String to, String subject, String content) {
        try {
            // 发送邮件的耗时操作
            mailSender.send(to, subject, content);
            return CompletableFuture.completedFuture(null);
        } catch (Exception e) {
            return CompletableFuture.failedFuture(e);
        }
    }
}
```

---

## 9. 安全最佳实践

### 9.1 密码加密

```java
@Configuration
public class SecurityConfig {
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

@Service
public class UserServiceImpl implements UserService {
    
    private final PasswordEncoder passwordEncoder;
    
    public void createUser(UserCreateDTO dto) {
        User user = new User();
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        userMapper.insert(user);
    }
}
```

### 9.2 SQL 注入防护

```java
// ✅ 推荐：使用参数化查询
LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
wrapper.eq(User::getUsername, username);
userMapper.selectOne(wrapper);

// ❌ 不推荐：字符串拼接
String sql = "SELECT * FROM user WHERE username = '" + username + "'";
```

### 9.3 CSRF 防护

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .csrf()
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
            .and()
            .authorizeRequests()
                .antMatchers("/api/public/**").permitAll()
                .anyRequest().authenticated();
    }
}
```

---

## 10. 常见问题解决

### Q1: 如何处理循环依赖？

**A**: 使用 `@Lazy` 注解延迟加载

```java
@Service
public class UserServiceImpl {
    
    private final OrderService orderService;
    
    public UserServiceImpl(@Lazy OrderService orderService) {
        this.orderService = orderService;
    }
}
```

### Q2: 如何处理大数据量导出？

**A**: 使用流式查询 + 异步处理

```java
@Service
public class ExportService {
    
    public void exportUsers(HttpServletResponse response) throws IOException {
        response.setContentType("application/vnd.ms-excel");
        response.setHeader("Content-Disposition", "attachment; filename=users.xlsx");
        
        try (OutputStream out = response.getOutputStream();
             Workbook workbook = new SXSSFWorkbook(100)) {  // 内存中保留 100 行
            
            Sheet sheet = workbook.createSheet("Users");
            
            // 流式查询
            userMapper.selectByCursor(new ResultHandler<User>() {
                int rowNum = 0;
                
                @Override
                public void handleResult(ResultContext<? extends User> context) {
                    User user = context.getResultObject();
                    Row row = sheet.createRow(rowNum++);
                    row.createCell(0).setCellValue(user.getId());
                    row.createCell(1).setCellValue(user.getUsername());
                }
            });
            
            workbook.write(out);
        }
    }
}
```

### Q3: 如何处理事务回滚？

**A**: 使用 `@Transactional` 注解

```java
@Service
public class OrderServiceImpl {
    
    @Transactional(rollbackFor = Exception.class)  // 任何异常都回滚
    public void createOrder(OrderCreateDTO dto) {
        // 1. 创建订单
        Order order = saveOrder(dto);
        
        // 2. 扣减库存（如果失败，事务会回滚）
        productService.reduceStock(dto.getProductId(), dto.getQuantity());
        
        // 3. 发送通知
        notificationService.sendOrderNotification(order.getId());
    }
}
```
