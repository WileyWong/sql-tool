# 代码注释完整示例

完整的代码注释示例，涵盖 Java、Python、TypeScript、Vue 等多种语言。

## 示例 1: Java 后端服务（用户管理）

### 1.1 实体类注释

```java
/**
 * 用户实体类
 * 
 * 对应数据库表 `user`，存储用户的基本信息和认证信息。
 * 使用 MyBatis-Plus 注解实现数据持久化。
 * 
 * @author AI Assistant
 * @since 1.0.0
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
     * 手机号（唯一索引）
     */
    private String phone;
    
    /**
     * 密码（BCrypt 加密）
     */
    private String password;
    
    /**
     * 用户名
     */
    private String username;
    
    /**
     * 创建时间
     */
    private Date createdAt;
}
```

### 1.2 DTO 注释

```java
/**
 * 用户注册请求 DTO
 * 
 * @author AI Assistant
 */
@Data
public class RegisterRequest {
    /**
     * 手机号，必须是 11 位数字
     */
    @NotBlank(message = "手机号不能为空")
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    private String phone;
    
    /**
     * 密码，至少 8 位，必须包含字母和数字
     */
    @NotBlank(message = "密码不能为空")
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$", 
             message = "密码至少 8 位，必须包含字母和数字")
    private String password;
}
```

### 1.3 Service 层注释（简洁版）

```java
/**
 * 用户服务类
 * 
 * 负责用户相关的业务逻辑，包括注册、登录、信息管理等。
 * 使用 Spring Data JPA 实现数据持久化，使用 BCrypt 加密用户密码。
 * 
 * @author AI Assistant
 * @since 1.0.0
 */
@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private SmsService smsService;
    
    /**
     * 用户注册
     * 
     * 创建新用户账号，手机号必须是11位数字且未被注册，密码至少8位且包含字母和数字。
     * 注册成功后会异步发送欢迎短信（不阻塞注册流程）。
     * 
     * @param request 注册请求
     * @return 注册成功的用户信息
     * @throws UserExistsException 如果手机号已注册
     */
    public User register(RegisterRequest request) {
        // 检查手机号是否已注册
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new UserExistsException("手机号已注册");
        }
        
        // 创建用户
        User user = new User();
        user.setPhone(request.getPhone());
        // 使用 BCrypt 强度 10（推荐值），加密时间约 100ms
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setCreatedAt(new Date());
        
        userRepository.save(user);
        
        // 异步发送欢迎短信，避免阻塞注册流程
        smsService.sendWelcomeSmsAsync(request.getPhone());
        
        return user;
    }
    
    /**
     * 用户登录
     * 
     * 验证手机号和密码，验证成功后生成 JWT Token。
     * 
     * @param phone 手机号
     * @param password 密码（明文）
     * @return JWT Token
     * @throws BadCredentialsException 如果手机号或密码错误
     */
    public String login(String phone, String password) {
        User user = userRepository.findByPhone(phone)
            .orElseThrow(() -> new BadCredentialsException("手机号或密码错误"));
        
        // 使用 BCrypt 验证密码
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BadCredentialsException("手机号或密码错误");
        }
        
        // 生成 JWT Token（有效期 7 天）
        return jwtService.generateToken(user.getId(), 7 * 24 * 60 * 60);
    }
}
```

### 1.4 Controller 层注释

```java
/**
 * 用户管理 Controller
 * 
 * 提供用户注册、登录、信息查询等 REST API 接口。
 * 
 * @author AI Assistant
 */
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    /**
     * 用户注册
     * 
     * @param request 注册请求
     * @return 注册成功的用户信息
     */
    @PostMapping("/register")
    public ResponseEntity<User> register(@Valid @RequestBody RegisterRequest request) {
        User user = userService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }
    
    /**
     * 用户登录
     * 
     * @param request 登录请求
     * @return JWT Token
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        String token = userService.login(request.getPhone(), request.getPassword());
        return ResponseEntity.ok(new LoginResponse(token));
    }
}
```

---

## 示例 2: Python 后端服务（知识点管理）

### 2.1 模型类注释

```python
"""
知识点模型

对应数据库表 `knowledge`，存储知识点的基本信息。

作者: AI Assistant
版本: 1.0.0
"""

class Knowledge:
    """知识点实体类
    
    Attributes:
        id: 知识点ID（主键，自增）
        name: 知识点名称（唯一索引）
        description: 知识点描述
        created_at: 创建时间
        updated_at: 更新时间
    """
    
    def __init__(self, name: str, description: str = None):
        """初始化知识点
        
        Args:
            name: 知识点名称
            description: 知识点描述（可选）
        """
        self.id = None
        self.name = name
        self.description = description
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
```

### 2.2 Service 层注释（简洁版）

```python
"""
知识点服务模块

负责知识点相关的业务逻辑，包括增删改查、唯一性校验等。

作者: AI Assistant
版本: 1.0.0
"""

class KnowledgeService:
    """知识点服务类"""
    
    def __init__(self, knowledge_repository):
        """初始化知识点服务
        
        Args:
            knowledge_repository: 知识点数据仓库
        """
        self.knowledge_repository = knowledge_repository
    
    def add(self, form: AddKnowledgeForm) -> int:
        """新增知识点
        
        创建新的知识点记录，名称必须唯一（忽略大小写）。
        
        Args:
            form: 知识点表单，包含知识点名称和描述
        
        Returns:
            新增成功的知识点ID
        
        Raises:
            IllegalStateException: 如果知识点名称已存在
        """
        # 检查名称唯一性（忽略大小写）
        if self.knowledge_repository.exists_by_name_ignore_case(form.name):
            raise IllegalStateException(f"知识点名称 '{form.name}' 已存在")
        
        knowledge = Knowledge(form.name, form.description)
        self.knowledge_repository.insert(knowledge)
        return knowledge.id
    
    def update(self, knowledge_id: int, form: UpdateKnowledgeForm) -> None:
        """更新知识点
        
        更新知识点信息，如果修改名称需要检查唯一性（忽略大小写）。
        
        Args:
            knowledge_id: 知识点ID
            form: 更新表单
        
        Raises:
            NotFoundException: 如果知识点不存在
            IllegalStateException: 如果新名称已被其他知识点使用
        """
        knowledge = self.knowledge_repository.find_by_id(knowledge_id)
        if not knowledge:
            raise NotFoundException(f"知识点ID {knowledge_id} 不存在")
        
        # 如果修改了名称，需要检查唯一性（忽略大小写，排除自己）
        if form.name and form.name.lower() != knowledge.name.lower():
            if self.knowledge_repository.exists_by_name_ignore_case_excluding_id(
                form.name, knowledge_id
            ):
                raise IllegalStateException(f"知识点名称 '{form.name}' 已存在")
            knowledge.name = form.name
        
        if form.description:
            knowledge.description = form.description
        
        knowledge.updated_at = datetime.now()
        self.knowledge_repository.update(knowledge)
    
    def delete(self, knowledge_id: int) -> bool:
        """删除知识点
        
        删除指定的知识点。如果有题目正在使用该知识点则不允许删除，确保数据完整性。
        
        Args:
            knowledge_id: 知识点ID
        
        Returns:
            删除成功返回True，失败返回False
        
        Raises:
            IllegalStateException: 如果有题目正在使用该知识点
        """
        # 检查是否有题目使用该知识点
        # 使用关联查询避免 N+1 查询问题，提高性能
        question_count = self.question_repository.count_by_knowledge_id(knowledge_id)
        if question_count > 0:
            raise IllegalStateException(
                f"知识点正在被 {question_count} 道题目使用，无法删除"
            )
        
        return self.knowledge_repository.delete_by_id(knowledge_id)
```

---

## 示例 3: TypeScript 前端组件（商品列表）

### 3.1 类型定义注释

```typescript
/**
 * 商品信息
 */
export interface Product {
  /** 商品ID */
  id: number;
  /** 商品名称 */
  name: string;
  /** 商品价格（单位：元） */
  price: number;
  /** 商品库存 */
  stock: number;
  /** 商品图片URL */
  imageUrl: string;
  /** 商品描述 */
  description?: string;
}

/**
 * 分页参数
 */
export interface PageParams {
  /** 页码（从 1 开始） */
  page: number;
  /** 每页条数 */
  pageSize: number;
}

/**
 * 分页响应
 */
export interface PageResponse<T> {
  /** 数据列表 */
  items: T[];
  /** 总条数 */
  total: number;
  /** 当前页码 */
  page: number;
  /** 每页条数 */
  pageSize: number;
}
```

### 3.2 API 服务注释

```typescript
/**
 * 商品 API 服务
 * 
 * 提供商品相关的 API 调用方法。
 */
export class ProductService {
  /**
   * 获取商品列表
   * 
   * 分页查询商品列表，支持按名称搜索和价格排序。
   * 
   * @param params 分页参数
   * @param keyword 搜索关键词（可选）
   * @param sortBy 排序字段（可选，如 'price' 或 'name'）
   * @returns 商品分页数据
   */
  async getProducts(
    params: PageParams,
    keyword?: string,
    sortBy?: 'price' | 'name'
  ): Promise<PageResponse<Product>> {
    const queryParams = {
      page: params.page,
      pageSize: params.pageSize,
      keyword,
      sortBy,
    };
    
    const response = await axios.get<PageResponse<Product>>('/api/products', {
      params: queryParams,
    });
    
    return response.data;
  }
  
  /**
   * 获取商品详情
   * 
   * @param id 商品ID
   * @returns 商品详情
   * @throws NotFoundException 如果商品不存在
   */
  async getProductById(id: number): Promise<Product> {
    const response = await axios.get<Product>(`/api/products/${id}`);
    return response.data;
  }
}
```

### 3.3 Vue 3 组件注释

```vue
<template>
  <div class="product-list">
    <!-- 搜索框 -->
    <el-input
      v-model="keyword"
      placeholder="搜索商品"
      clearable
      @input="handleSearch"
    />
    
    <!-- 商品列表 -->
    <el-table :data="products" :loading="loading" v-loading="loading">
      <el-table-column prop="name" label="商品名称" />
      <el-table-column prop="price" label="价格" />
      <el-table-column prop="stock" label="库存" />
    </el-table>
    
    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="pageSize"
      :total="total"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { debounce } from 'lodash-es';
import type { Product } from '@/types';
import { productService } from '@/services';
import { ElMessage } from 'element-plus';

/**
 * 商品列表
 */
const products = ref<Product[]>([]);

/**
 * 加载状态
 */
const loading = ref(false);

/**
 * 当前页码（从 1 开始）
 */
const page = ref(1);

/**
 * 每页条数
 */
const pageSize = 20;

/**
 * 总条数
 */
const total = ref(0);

/**
 * 搜索关键词
 */
const keyword = ref('');

/**
 * 加载商品列表
 * 
 * 从服务器获取商品数据并更新状态。
 */
const loadProducts = async () => {
  loading.value = true;
  try {
    const response = await productService.getProducts(
      { page: page.value, pageSize },
      keyword.value
    );
    products.value = response.items;
    total.value = response.total;
  } catch (error) {
    console.error('Failed to load products:', error);
    ElMessage.error('加载商品失败');
  } finally {
    loading.value = false;
  }
};

/**
 * 处理搜索
 * 
 * 使用防抖避免频繁请求（延迟 300ms）。
 * 搜索时重置到第一页。
 */
const handleSearch = debounce(() => {
  page.value = 1;
  loadProducts();
}, 300);

/**
 * 处理分页变化
 * 
 * @param newPage 新页码
 */
const handlePageChange = (newPage: number) => {
  page.value = newPage;
  loadProducts();
};

// 组件挂载时加载商品列表
onMounted(() => {
  loadProducts();
});
</script>

<style scoped>
.product-list {
  padding: 20px;
}
</style>
```

---

## 示例 4: Vue 组件注释

### 4.1 Vue 3 Composition API 组件

```vue
<template>
  <div class="user-list">
    <!-- 搜索框 -->
    <el-input
      v-model="keyword"
      placeholder="搜索用户"
      clearable
      @input="handleSearch"
    />
    
    <!-- 用户表格 -->
    <el-table :data="users" :loading="loading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="createdAt" label="创建时间" />
    </el-table>
    
    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="pageSize"
      :total="total"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { debounce } from 'lodash-es';
import type { User } from '@/types';
import { userService } from '@/services';

/**
 * 用户列表
 */
const users = ref<User[]>([]);

/**
 * 加载状态
 */
const loading = ref(false);

/**
 * 当前页码（从 1 开始）
 */
const page = ref(1);

/**
 * 每页条数
 */
const pageSize = 20;

/**
 * 总条数
 */
const total = ref(0);

/**
 * 搜索关键词
 */
const keyword = ref('');

/**
 * 加载用户列表
 * 
 * 从服务器获取用户数据并更新状态。
 */
const loadUsers = async () => {
  loading.value = true;
  try {
    const response = await userService.getUsers({
      page: page.value,
      pageSize,
      keyword: keyword.value,
    });
    users.value = response.items;
    total.value = response.total;
  } catch (error) {
    console.error('Failed to load users:', error);
    ElMessage.error('加载用户失败');
  } finally {
    loading.value = false;
  }
};

/**
 * 处理搜索
 * 
 * 使用防抖避免频繁请求（延迟 300ms）。
 * 搜索时重置到第一页。
 */
const handleSearch = debounce(() => {
  page.value = 1;
  loadUsers();
}, 300);

/**
 * 处理分页变化
 * 
 * @param newPage 新页码
 */
const handlePageChange = (newPage: number) => {
  page.value = newPage;
  loadUsers();
};

// 组件挂载时加载用户列表
onMounted(() => {
  loadUsers();
});
</script>

<style scoped>
.user-list {
  padding: 20px;
}
</style>
```

---

## 示例 5: 复杂业务逻辑注释

### 5.1 订单状态流转

```java
/**
 * 订单服务类
 * 
 * 负责订单相关的业务逻辑，包括创建、支付、发货、完成、取消等。
 * 订单状态流转遵循严格的状态机模型，确保数据一致性。
 * 
 * @author AI Assistant
 */
@Service
public class OrderService {
    
    /**
     * 取消订单
     * 
     * 取消订单并恢复库存。只有待支付和已支付状态的订单可以取消。
     * 已支付的订单取消后会自动退款（异步处理）。
     * 
     * 状态流转:
     * - 待支付 → 已取消
     * - 已支付 → 已取消（触发退款）
     * 
     * @param orderId 订单ID
     * @throws NotFoundException 如果订单不存在
     * @throws IllegalStateException 如果订单状态不允许取消
     */
    @Transactional
    public void cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new NotFoundException("订单不存在"));
        
        // 检查订单状态是否允许取消
        // 已发货、已完成的订单不能直接取消，需要走退货流程
        if (order.getStatus() == OrderStatus.SHIPPED || 
            order.getStatus() == OrderStatus.COMPLETED) {
            throw new IllegalStateException("订单已发货或已完成，无法取消");
        }
        
        // 更新订单状态为已取消
        order.setStatus(OrderStatus.CANCELLED);
        order.setCancelledAt(new Date());
        orderRepository.save(order);
        
        // 恢复库存
        // 使用 Redis 分布式锁确保库存操作的原子性
        for (OrderItem item : order.getItems()) {
            productService.increaseStock(item.getProductId(), item.getQuantity());
        }
        
        // 如果订单已支付，触发退款
        // 使用异步处理避免阻塞，退款失败会有重试机制
        if (order.getStatus() == OrderStatus.PAID) {
            refundService.refundAsync(order.getId());
        }
    }
}
```

---

## 使用建议

### 1. 根据代码复杂度选择注释详细程度

- **简单方法**: 一句话说清楚功能即可（如"新增知识点"）
- **复杂方法**: 详细说明功能、业务规则、状态流转、性能考虑等

### 2. 注释应该帮助理解而不是重复代码

- ✅ 说明"为什么"这样做
- ✅ 说明业务规则和边界条件
- ✅ 说明性能考虑和技术选型
- ❌ 不要重复代码已表达的内容

### 3. 使用简洁文本格式

- ✅ 使用简单段落和 `-` 列表
- ❌ 避免 HTML 标签（如 `<p>`、`<ul>`）

### 4. 保持注释与代码同步

- 修改代码时同步更新注释
- 定期审查和清理过时注释
- 使用 Linter 工具检查注释格式
