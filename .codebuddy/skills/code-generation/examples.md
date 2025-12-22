# 代码生成示例

## 示例 1: 用户管理模块（Spring Boot + MyBatis-Plus）

### 设计文档

**API 设计**:
```markdown
POST /api/users - 创建用户
GET /api/users - 获取用户列表（分页）
GET /api/users/{id} - 获取用户详情
PUT /api/users/{id} - 更新用户
DELETE /api/users/{id} - 删除用户
```

**数据库设计**:
```sql
CREATE TABLE `user` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
  `username` VARCHAR(50) UNIQUE NOT NULL COMMENT '用户名',
  `password` VARCHAR(100) NOT NULL COMMENT '密码',
  `email` VARCHAR(100) COMMENT '邮箱',
  `status` TINYINT DEFAULT 1 COMMENT '状态 0-禁用 1-启用',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
```

### 生成的代码

#### 1. Entity 实体类

```java
package com.example.demo.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 用户实体
 */
@Data
@TableName("user")
public class User {
    
    /**
     * 用户ID（主键，自增）
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;
    
    /**
     * 用户名（唯一）
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
     * 状态（0-禁用 1-启用）
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

#### 2. DTO 数据传输对象

```java
package com.example.demo.dto;

import lombok.Data;
import javax.validation.constraints.*;

/**
 * 用户创建请求 DTO
 */
@Data
public class UserCreateDTO {
    
    @NotBlank(message = "用户名不能为空")
    @Size(min = 3, max = 20, message = "用户名长度必须在3-20之间")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "用户名只能包含字母、数字和下划线")
    private String username;
    
    @NotBlank(message = "密码不能为空")
    @Size(min = 8, max = 32, message = "密码长度必须在8-32之间")
    private String password;
    
    @Email(message = "邮箱格式不正确")
    private String email;
}
```

```java
package com.example.demo.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 用户响应 DTO
 */
@Data
public class UserResponseDTO {
    private Long id;
    private String username;
    private String email;
    private Integer status;
    private LocalDateTime createTime;
}
```

#### 3. Mapper 数据访问层

```java
package com.example.demo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.entity.User;
import org.apache.ibatis.annotations.Mapper;

/**
 * 用户 Mapper
 */
@Mapper
public interface UserMapper extends BaseMapper<User> {
    // BaseMapper 已提供 CRUD 方法
    // 如需自定义查询，在此添加方法
}
```

#### 4. Service 业务逻辑层

```java
package com.example.demo.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.demo.dto.UserCreateDTO;
import com.example.demo.dto.UserResponseDTO;
import com.example.demo.dto.UserUpdateDTO;

/**
 * 用户服务接口
 */
public interface UserService {
    
    /**
     * 创建用户
     */
    UserResponseDTO createUser(UserCreateDTO dto);
    
    /**
     * 获取用户列表（分页）
     */
    Page<UserResponseDTO> getUserList(int page, int size);
    
    /**
     * 获取用户详情
     */
    UserResponseDTO getUserById(Long id);
    
    /**
     * 更新用户
     */
    UserResponseDTO updateUser(Long id, UserUpdateDTO dto);
    
    /**
     * 删除用户
     */
    void deleteUser(Long id);
}
```

```java
package com.example.demo.service.impl;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.demo.dto.UserCreateDTO;
import com.example.demo.dto.UserResponseDTO;
import com.example.demo.dto.UserUpdateDTO;
import com.example.demo.entity.User;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.mapper.UserMapper;
import com.example.demo.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 用户服务实现
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    @Transactional
    public UserResponseDTO createUser(UserCreateDTO dto) {
        log.info("创建用户: {}", dto.getUsername());
        
        // 检查用户名是否已存在
        User existingUser = userMapper.selectOne(
            new LambdaQueryWrapper<User>()
                .eq(User::getUsername, dto.getUsername())
        );
        if (existingUser != null) {
            throw new IllegalArgumentException("用户名已存在");
        }
        
        // 创建用户实体
        User user = new User();
        BeanUtils.copyProperties(dto, user);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setStatus(1); // 默认启用
        
        // 保存到数据库
        userMapper.insert(user);
        
        // 转换为响应 DTO
        UserResponseDTO response = new UserResponseDTO();
        BeanUtils.copyProperties(user, response);
        
        log.info("用户创建成功: id={}", user.getId());
        return response;
    }
    
    @Override
    public Page<UserResponseDTO> getUserList(int page, int size) {
        log.info("获取用户列表: page={}, size={}", page, size);
        
        Page<User> userPage = new Page<>(page, size);
        userMapper.selectPage(userPage, null);
        
        // 转换为响应 DTO
        Page<UserResponseDTO> responsePage = new Page<>(page, size);
        responsePage.setTotal(userPage.getTotal());
        responsePage.setRecords(
            userPage.getRecords().stream()
                .map(user -> {
                    UserResponseDTO dto = new UserResponseDTO();
                    BeanUtils.copyProperties(user, dto);
                    return dto;
                })
                .collect(Collectors.toList())
        );
        
        return responsePage;
    }
    
    @Override
    public UserResponseDTO getUserById(Long id) {
        log.info("获取用户详情: id={}", id);
        
        User user = userMapper.selectById(id);
        if (user == null) {
            throw new ResourceNotFoundException("用户不存在");
        }
        
        UserResponseDTO response = new UserResponseDTO();
        BeanUtils.copyProperties(user, response);
        return response;
    }
    
    @Override
    @Transactional
    public UserResponseDTO updateUser(Long id, UserUpdateDTO dto) {
        log.info("更新用户: id={}", id);
        
        User user = userMapper.selectById(id);
        if (user == null) {
            throw new ResourceNotFoundException("用户不存在");
        }
        
        // 更新字段
        if (dto.getEmail() != null) {
            user.setEmail(dto.getEmail());
        }
        if (dto.getStatus() != null) {
            user.setStatus(dto.getStatus());
        }
        
        userMapper.updateById(user);
        
        UserResponseDTO response = new UserResponseDTO();
        BeanUtils.copyProperties(user, response);
        
        log.info("用户更新成功: id={}", id);
        return response;
    }
    
    @Override
    @Transactional
    public void deleteUser(Long id) {
        log.info("删除用户: id={}", id);
        
        User user = userMapper.selectById(id);
        if (user == null) {
            throw new ResourceNotFoundException("用户不存在");
        }
        
        userMapper.deleteById(id);
        log.info("用户删除成功: id={}", id);
    }
}
```

#### 5. Controller 控制器

```java
package com.example.demo.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.demo.dto.UserCreateDTO;
import com.example.demo.dto.UserResponseDTO;
import com.example.demo.dto.UserUpdateDTO;
import com.example.demo.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.Min;

/**
 * 用户控制器
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Validated
@Tag(name = "用户管理", description = "用户 CRUD 操作")
public class UserController {
    
    private final UserService userService;
    
    /**
     * 创建用户
     */
    @PostMapping
    @Operation(summary = "创建用户", description = "创建新用户账号")
    public ResponseEntity<UserResponseDTO> createUser(@Valid @RequestBody UserCreateDTO dto) {
        UserResponseDTO response = userService.createUser(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    /**
     * 获取用户列表（分页）
     */
    @GetMapping
    @Operation(summary = "获取用户列表", description = "分页获取用户列表")
    public ResponseEntity<Page<UserResponseDTO>> getUserList(
            @RequestParam(defaultValue = "1") @Min(1) int page,
            @RequestParam(defaultValue = "20") @Min(1) int size
    ) {
        Page<UserResponseDTO> response = userService.getUserList(page, size);
        return ResponseEntity.ok(response);
    }
    
    /**
     * 获取用户详情
     */
    @GetMapping("/{id}")
    @Operation(summary = "获取用户详情", description = "根据 ID 获取用户详情")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {
        UserResponseDTO response = userService.getUserById(id);
        return ResponseEntity.ok(response);
    }
    
    /**
     * 更新用户
     */
    @PutMapping("/{id}")
    @Operation(summary = "更新用户", description = "更新用户信息")
    public ResponseEntity<UserResponseDTO> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserUpdateDTO dto
    ) {
        UserResponseDTO response = userService.updateUser(id, dto);
        return ResponseEntity.ok(response);
    }
    
    /**
     * 删除用户
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "删除用户", description = "删除指定用户")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
```

#### 6. 全局异常处理

```java
package com.example.demo.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * 全局异常处理器
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    
    /**
     * 处理参数验证异常
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
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
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException ex) {
        ErrorResponse response = ErrorResponse.builder()
                .code("RESOURCE_NOT_FOUND")
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }
    
    /**
     * 处理非法参数异常
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException ex) {
        ErrorResponse response = ErrorResponse.builder()
                .code("INVALID_ARGUMENT")
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

#### 7. 单元测试

```java
package com.example.demo.service;

import com.example.demo.dto.UserCreateDTO;
import com.example.demo.dto.UserResponseDTO;
import com.example.demo.entity.User;
import com.example.demo.mapper.UserMapper;
import com.example.demo.service.impl.UserServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * 用户服务测试
 */
@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {
    
    @Mock
    private UserMapper userMapper;
    
    @Mock
    private PasswordEncoder passwordEncoder;
    
    @InjectMocks
    private UserServiceImpl userService;
    
    @Test
    void createUser_Success() {
        // Given
        UserCreateDTO dto = new UserCreateDTO();
        dto.setUsername("testuser");
        dto.setPassword("password123");
        dto.setEmail("test@example.com");
        
        when(userMapper.selectOne(any())).thenReturn(null); // 用户名不存在
        when(passwordEncoder.encode(anyString())).thenReturn("encoded_password");
        when(userMapper.insert(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(1L);
            return 1;
        });
        
        // When
        UserResponseDTO response = userService.createUser(dto);
        
        // Then
        assertNotNull(response);
        assertEquals("testuser", response.getUsername());
        assertEquals("test@example.com", response.getEmail());
        verify(userMapper, times(1)).insert(any(User.class));
    }
    
    @Test
    void createUser_DuplicateUsername_ThrowsException() {
        // Given
        UserCreateDTO dto = new UserCreateDTO();
        dto.setUsername("existinguser");
        dto.setPassword("password123");
        
        User existingUser = new User();
        existingUser.setId(1L);
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

---

## 示例 2: 商品列表页面（Vue 3 + TypeScript）

### 设计文档

**页面需求**:
- 显示商品列表（支持分页）
- 支持搜索和过滤
- 显示加载状态和错误信息
- 点击商品跳转详情页

### 生成的代码

#### 1. TypeScript 类型定义

```typescript
// src/types/product.ts

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  imageUrl: string;
  createdAt: string;
}

export interface ProductListParams {
  page: number;
  size: number;
  keyword?: string;
  categoryId?: number;
}

export interface ProductListResponse {
  content: Product[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
```

#### 2. API 服务

```typescript
// src/services/productService.ts

import axios from 'axios';
import { Product, ProductListParams, ProductListResponse } from '../types/product';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const productService = {
  /**
   * 获取商品列表
   */
  async getProductList(params: ProductListParams): Promise<ProductListResponse> {
    try {
      const response = await axios.get<ProductListResponse>(`${API_BASE_URL}/products`, {
        params
      });
      return response.data;
    } catch (error) {
      console.error('获取商品列表失败:', error);
      throw error;
    }
  },
  
  /**
   * 获取商品详情
   */
  async getProductById(id: number): Promise<Product> {
    try {
      const response = await axios.get<Product>(`${API_BASE_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('获取商品详情失败:', error);
      throw error;
    }
  }
};
```

#### 3. Composable 组合式函数

```typescript
// src/composables/useProductList.ts

import { ref, watch, type Ref } from 'vue';
import { Product, ProductListParams } from '../types/product';
import { productService } from '../services/productService';

interface UseProductListResult {
  products: Ref<Product[]>;
  loading: Ref<boolean>;
  error: Ref<Error | null>;
  totalPages: Ref<number>;
  refresh: () => Promise<void>;
}

export const useProductList = (params: Ref<ProductListParams>): UseProductListResult => {
  const products = ref<Product[]>([]);
  const loading = ref(true);
  const error = ref<Error | null>(null);
  const totalPages = ref(0);
  
  const fetchProducts = async () => {
    try {
      loading.value = true;
      error.value = null;
      const response = await productService.getProductList(params.value);
      products.value = response.content;
      totalPages.value = response.totalPages;
    } catch (err) {
      error.value = err as Error;
    } finally {
      loading.value = false;
    }
  };
  
  watch(
    () => [params.value.page, params.value.size, params.value.keyword, params.value.categoryId],
    () => {
      fetchProducts();
    },
    { immediate: true }
  );
  
  return {
    products,
    loading,
    error,
    totalPages,
    refresh: fetchProducts
  };
};
```

#### 4. Vue 组件

```vue
<!-- src/components/ProductList.vue -->

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useProductList } from '../composables/useProductList';
import type { ProductListParams } from '../types/product';

const router = useRouter();
const params = ref<ProductListParams>({
  page: 1,
  size: 20
});

const { products, loading, error, totalPages, refresh } = useProductList(params);

const handleSearch = (keyword: string) => {
  params.value = { ...params.value, page: 1, keyword };
};

const handlePageChange = (page: number) => {
  params.value = { ...params.value, page };
};

const handleProductClick = (productId: number) => {
  router.push(`/products/${productId}`);
};
</script>

<template>
  <div class="container mx-auto px-4">
    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <h3 class="text-red-800 font-semibold">加载失败</h3>
      <p class="text-red-600">{{ error.message }}</p>
      <button
        @click="refresh"
        class="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        重试
      </button>
    </div>

    <!-- 正常内容 -->
    <template v-else>
      <div class="mb-6">
        <input
          type="text"
          placeholder="搜索商品..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          @input="(e) => handleSearch((e.target as HTMLInputElement).value)"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="product in products"
          :key="product.id"
          class="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
          @click="handleProductClick(product.id)"
        >
          <img
            :src="product.imageUrl"
            :alt="product.name"
            class="w-full h-48 object-cover"
          />
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-800 mb-2">
              {{ product.name }}
            </h3>
            <p class="text-gray-600 text-sm mb-2 line-clamp-2">
              {{ product.description }}
            </p>
            <div class="flex justify-between items-center">
              <span class="text-xl font-bold text-blue-600">
                ¥{{ product.price.toFixed(2) }}
              </span>
              <span class="text-sm text-gray-500">
                库存: {{ product.stock }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页组件 -->
      <div class="mt-8 flex justify-center">
        <nav class="flex gap-2">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="handlePageChange(page)"
            :class="[
              'px-4 py-2 rounded',
              page === params.page
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            ]"
          >
            {{ page }}
          </button>
        </nav>
      </div>
    </template>
  </div>
</template>
```

#### 5. 组件测试

```typescript
// src/components/ProductList.test.ts

import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import ProductList from './ProductList.vue';
import { productService } from '../services/productService';

vi.mock('../services/productService');

const mockProducts = {
  content: [
    {
      id: 1,
      name: 'Product 1',
      description: 'Description 1',
      price: 99.99,
      stock: 10,
      categoryId: 1,
      imageUrl: 'http://example.com/image1.jpg',
      createdAt: '2025-01-01T00:00:00Z'
    }
  ],
  page: 1,
  size: 20,
  totalElements: 1,
  totalPages: 1
};

describe('ProductList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders loading state initially', () => {
    vi.mocked(productService.getProductList).mockReturnValue(
      new Promise(() => {}) // 永不 resolve
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
    expect(wrapper.text()).toContain('¥99.99');
  });
  
  it('renders error state on failure', async () => {
    vi.mocked(productService.getProductList).mockRejectedValue(
      new Error('网络错误')
    );
    
    const wrapper = mount(ProductList, {
      global: {
        stubs: ['router-link', 'router-view']
      }
    });
    
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(wrapper.text()).toContain('加载失败');
    expect(wrapper.text()).toContain('网络错误');
  });
  
  it('calls service again when retry button clicked', async () => {
    vi.mocked(productService.getProductList)
      .mockRejectedValueOnce(new Error('网络错误'))
      .mockResolvedValueOnce(mockProducts);
    
    const wrapper = mount(ProductList, {
      global: {
        stubs: ['router-link', 'router-view']
      }
    });
    
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const retryButton = wrapper.find('button');
    await retryButton.trigger('click');
    
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(wrapper.text()).toContain('Product 1');
  });
});
```

---

## 示例 3: 订单状态流转（业务逻辑）

### 设计文档

**状态机设计**:
```
PENDING(待支付) → PAID(已支付) → SHIPPED(已发货) → COMPLETED(已完成)
                      ↓
                  CANCELLED(已取消)
```

### 生成的代码

```java
package com.example.demo.service.impl;

import com.example.demo.entity.Order;
import com.example.demo.enums.OrderStatus;
import com.example.demo.exception.InvalidOrderStatusException;
import com.example.demo.mapper.OrderMapper;
import com.example.demo.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 订单服务实现
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    
    private final OrderMapper orderMapper;
    
    /**
     * 支付订单
     */
    @Override
    @Transactional
    public void payOrder(Long orderId) {
        Order order = getOrderById(orderId);
        
        // 验证状态转换
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new InvalidOrderStatusException(
                "只有待支付订单可以进行支付，当前状态: " + order.getStatus()
            );
        }
        
        // 更新订单状态
        order.setStatus(OrderStatus.PAID);
        orderMapper.updateById(order);
        
        log.info("订单支付成功: orderId={}", orderId);
    }
    
    /**
     * 发货
     */
    @Override
    @Transactional
    public void shipOrder(Long orderId, String trackingNumber) {
        Order order = getOrderById(orderId);
        
        // 验证状态转换
        if (order.getStatus() != OrderStatus.PAID) {
            throw new InvalidOrderStatusException(
                "只有已支付订单可以发货，当前状态: " + order.getStatus()
            );
        }
        
        // 更新订单状态和物流单号
        order.setStatus(OrderStatus.SHIPPED);
        order.setTrackingNumber(trackingNumber);
        orderMapper.updateById(order);
        
        log.info("订单已发货: orderId={}, trackingNumber={}", orderId, trackingNumber);
    }
    
    /**
     * 确认收货
     */
    @Override
    @Transactional
    public void completeOrder(Long orderId) {
        Order order = getOrderById(orderId);
        
        // 验证状态转换
        if (order.getStatus() != OrderStatus.SHIPPED) {
            throw new InvalidOrderStatusException(
                "只有已发货订单可以确认收货，当前状态: " + order.getStatus()
            );
        }
        
        // 更新订单状态
        order.setStatus(OrderStatus.COMPLETED);
        orderMapper.updateById(order);
        
        log.info("订单已完成: orderId={}", orderId);
    }
    
    /**
     * 取消订单
     */
    @Override
    @Transactional
    public void cancelOrder(Long orderId) {
        Order order = getOrderById(orderId);
        
        // 验证状态转换（只有待支付和已支付状态可以取消）
        if (order.getStatus() != OrderStatus.PENDING && 
            order.getStatus() != OrderStatus.PAID) {
            throw new InvalidOrderStatusException(
                "当前状态的订单无法取消，当前状态: " + order.getStatus()
            );
        }
        
        // 更新订单状态
        order.setStatus(OrderStatus.CANCELLED);
        orderMapper.updateById(order);
        
        log.info("订单已取消: orderId={}", orderId);
    }
    
    private Order getOrderById(Long orderId) {
        Order order = orderMapper.selectById(orderId);
        if (order == null) {
            throw new ResourceNotFoundException("订单不存在: " + orderId);
        }
        return order;
    }
}
```

### 单元测试

```java
package com.example.demo.service;

import com.example.demo.entity.Order;
import com.example.demo.enums.OrderStatus;
import com.example.demo.exception.InvalidOrderStatusException;
import com.example.demo.mapper.OrderMapper;
import com.example.demo.service.impl.OrderServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceImplTest {
    
    @Mock
    private OrderMapper orderMapper;
    
    @InjectMocks
    private OrderServiceImpl orderService;
    
    @Test
    void payOrder_Success() {
        // Given
        Long orderId = 1L;
        Order order = new Order();
        order.setId(orderId);
        order.setStatus(OrderStatus.PENDING);
        
        when(orderMapper.selectById(orderId)).thenReturn(order);
        when(orderMapper.updateById(any(Order.class))).thenReturn(1);
        
        // When
        orderService.payOrder(orderId);
        
        // Then
        assertEquals(OrderStatus.PAID, order.getStatus());
        verify(orderMapper, times(1)).updateById(order);
    }
    
    @Test
    void payOrder_InvalidStatus_ThrowsException() {
        // Given
        Long orderId = 1L;
        Order order = new Order();
        order.setId(orderId);
        order.setStatus(OrderStatus.PAID); // 已支付状态，不能再次支付
        
        when(orderMapper.selectById(orderId)).thenReturn(order);
        
        // When & Then
        assertThrows(InvalidOrderStatusException.class, () -> {
            orderService.payOrder(orderId);
        });
        
        verify(orderMapper, never()).updateById(any(Order.class));
    }
    
    @Test
    void cancelOrder_FromPending_Success() {
        // Given
        Long orderId = 1L;
        Order order = new Order();
        order.setId(orderId);
        order.setStatus(OrderStatus.PENDING);
        
        when(orderMapper.selectById(orderId)).thenReturn(order);
        when(orderMapper.updateById(any(Order.class))).thenReturn(1);
        
        // When
        orderService.cancelOrder(orderId);
        
        // Then
        assertEquals(OrderStatus.CANCELLED, order.getStatus());
        verify(orderMapper, times(1)).updateById(order);
    }
    
    @Test
    void cancelOrder_FromShipped_ThrowsException() {
        // Given
        Long orderId = 1L;
        Order order = new Order();
        order.setId(orderId);
        order.setStatus(OrderStatus.SHIPPED); // 已发货状态，不能取消
        
        when(orderMapper.selectById(orderId)).thenReturn(order);
        
        // When & Then
        assertThrows(InvalidOrderStatusException.class, () -> {
            orderService.cancelOrder(orderId);
        });
        
        verify(orderMapper, never()).updateById(any(Order.class));
    }
}
```
