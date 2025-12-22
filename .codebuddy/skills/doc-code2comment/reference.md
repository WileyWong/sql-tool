# 代码注释技术参考

代码注释的规范、工具和最佳实践技术参考手册。

## 1. JavaDoc 注释规范

### 1.1 基本格式

```java
/**
 * 类或方法的简短描述（第一句话）
 * 
 * 详细描述（可选）。可以包含多个段落。
 * 
 * @param paramName 参数说明
 * @return 返回值说明
 * @throws ExceptionType 异常说明
 * @see RelatedClass 相关类
 * @since 1.0.0
 * @author Author Name
 */
```

### 1.2 常用标签

| 标签 | 用途 | 示例 |
|------|------|------|
| `@param` | 参数说明 | `@param name 用户名` |
| `@return` | 返回值说明 | `@return 用户信息` |
| `@throws` | 异常说明 | `@throws NotFoundException 如果用户不存在` |
| `@see` | 相关类或方法 | `@see UserService#login` |
| `@since` | 起始版本 | `@since 1.0.0` |
| `@author` | 作者 | `@author AI Assistant` |
| `@deprecated` | 废弃说明 | `@deprecated 使用 newMethod() 替代` |

### 1.3 类级注释模板

```java
/**
 * 类的简短描述
 * 
 * 类的详细描述，包括：
 * - 职责和核心功能
 * - 主要使用场景
 * - 关键技术栈
 * 
 * @author Author Name
 * @since 1.0.0
 */
public class ClassName {
    // ...
}
```

### 1.4 方法级注释模板（简洁版）

```java
/**
 * 方法的简短描述，包含关键业务规则
 * 
 * @param param1 参数1说明
 * @param param2 参数2说明
 * @return 返回值说明
 * @throws ExceptionType 异常说明
 */
public ReturnType methodName(Type1 param1, Type2 param2) {
    // ...
}
```

### 1.5 方法级注释模板（详细版）

```java
/**
 * 方法的简短描述
 * 
 * 方法的详细描述，包括：
 * - 功能和业务目的
 * - 关键业务规则
 * - 副作用和注意事项
 * 
 * @param param1 参数1说明
 * @param param2 参数2说明
 * @return 返回值说明
 * @throws ExceptionType1 异常1说明
 * @throws ExceptionType2 异常2说明
 */
public ReturnType methodName(Type1 param1, Type2 param2) {
    // ...
}
```

---

## 2. Python Docstring 规范

### 2.1 基本格式（Google 风格）

```python
"""模块或类的简短描述

详细描述（可选）。可以包含多个段落。

Attributes:
    attr1: 属性1说明
    attr2: 属性2说明

作者: Author Name
版本: 1.0.0
"""

def function_name(param1: Type1, param2: Type2) -> ReturnType:
    """函数的简短描述
    
    详细描述（可选）。
    
    Args:
        param1: 参数1说明
        param2: 参数2说明
    
    Returns:
        返回值说明
    
    Raises:
        ExceptionType: 异常说明
    """
    pass
```

### 2.2 类级 Docstring 模板

```python
"""类的简短描述

类的详细描述，包括：
- 职责和核心功能
- 主要使用场景
- 关键技术栈

Attributes:
    attribute1: 属性1说明
    attribute2: 属性2说明

作者: Author Name
版本: 1.0.0
"""

class ClassName:
    def __init__(self, param1: Type1):
        """初始化方法
        
        Args:
            param1: 参数1说明
        """
        self.attribute1 = param1
```

### 2.3 函数级 Docstring 模板（简洁版）

```python
def function_name(param1: Type1, param2: Type2) -> ReturnType:
    """函数的简短描述，包含关键业务规则
    
    Args:
        param1: 参数1说明
        param2: 参数2说明
    
    Returns:
        返回值说明
    
    Raises:
        ExceptionType: 异常说明
    """
    pass
```

---

## 3. JSDoc 注释规范

### 3.1 基本格式

```javascript
/**
 * 函数的简短描述
 * 
 * 详细描述（可选）。
 * 
 * @param {Type} paramName - 参数说明
 * @returns {ReturnType} 返回值说明
 * @throws {ErrorType} 异常说明
 */
function functionName(paramName) {
  // ...
}
```

### 3.2 TypeScript 类型注释

```typescript
/**
 * 接口的简短描述
 */
export interface InterfaceName {
  /** 属性1说明 */
  property1: Type1;
  /** 属性2说明 */
  property2: Type2;
}

/**
 * 类的简短描述
 * 
 * @template T 泛型参数说明
 */
export class ClassName<T> {
  /**
   * 方法的简短描述
   * 
   * @param param1 参数1说明
   * @param param2 参数2说明
   * @returns 返回值说明
   */
  methodName(param1: Type1, param2: Type2): ReturnType {
    // ...
  }
}
```

### 3.3 常用标签

| 标签 | 用途 | 示例 |
|------|------|------|
| `@param` | 参数说明 | `@param {string} name - 用户名` |
| `@returns` | 返回值说明 | `@returns {User} 用户信息` |
| `@throws` | 异常说明 | `@throws {NotFoundException} 如果用户不存在` |
| `@template` | 泛型参数 | `@template T` |
| `@see` | 相关内容 | `@see UserService#login` |
| `@deprecated` | 废弃说明 | `@deprecated Use newFunction() instead` |
| `@example` | 示例代码 | `@example const user = getUser(1);` |

---

## 4. Vue 注释规范

### 4.1 Vue 3 Composition API 注释

```vue
<template>
  <!-- 模板注释 -->
  <div class="component-name">
    <!-- 子组件说明 -->
    <ChildComponent :prop="value" />
  </div>
</template>

<script setup lang="ts">
/**
 * 响应式变量说明
 */
const variable = ref<Type>(initialValue);

/**
 * 计算属性说明
 */
const computed = computed(() => {
  // ...
});

/**
 * 方法说明
 * 
 * @param param 参数说明
 */
const method = (param: Type) => {
  // ...
};
</script>
```

### 4.2 Vue 2 Options API 注释

```javascript
/**
 * 组件名称
 * 
 * 组件的详细描述。
 */
export default {
  name: 'ComponentName',
  
  props: {
    /**
     * Prop 说明
     * @type {Type}
     */
    propName: {
      type: Type,
      required: true,
    },
  },
  
  data() {
    return {
      /**
       * 数据属性说明
       */
      dataProperty: initialValue,
    };
  },
  
  methods: {
    /**
     * 方法说明
     * 
     * @param {Type} param 参数说明
     */
    methodName(param) {
      // ...
    },
  },
};
```

---

## 5. 注释质量标准

### 5.1 清晰性标准

- **简洁明了**: 一句话说清楚核心功能
- **避免歧义**: 使用明确的术语和描述
- **易于理解**: 新人可以快速理解代码

### 5.2 准确性标准

- **与代码一致**: 注释与代码逻辑完全一致
- **参数匹配**: 参数名称、类型与实际代码一致
- **异常完整**: 所有可能抛出的异常都有说明

### 5.3 价值性标准

- **说明为什么**: 解释代码为什么这样写
- **业务规则**: 说明关键业务规则和约束
- **技术选型**: 说明为什么选择某个技术或算法

### 5.4 简洁性标准

- **避免冗余**: 不重复代码已表达的内容
- **避免过度**: 简单代码不需要注释
- **避免 HTML**: 使用简洁的文本格式

---

## 6. 注释工具

### 6.1 IDE 插件

| IDE | 插件名称 | 功能 |
|-----|---------|------|
| IntelliJ IDEA | 内置 | 自动生成 JavaDoc、检查注释格式 |
| VS Code | Better Comments | 高亮和分类注释 |
| VS Code | Document This | 自动生成 JSDoc |
| PyCharm | 内置 | 自动生成 Docstring、检查注释格式 |

### 6.2 Linter 工具

| 语言 | 工具 | 配置 |
|------|------|------|
| Java | Checkstyle | 检查 JavaDoc 格式 |
| Python | Pylint | 检查 Docstring 格式 |
| JavaScript/TypeScript | ESLint | 使用 `eslint-plugin-jsdoc` |
| Vue | Vue ESLint | 检查 Vue 注释格式 |

### 6.3 文档生成工具

| 语言 | 工具 | 用途 |
|------|------|------|
| Java | JavaDoc | 生成 HTML 格式的 API 文档 |
| Python | Sphinx | 生成 HTML 格式的文档 |
| JavaScript/TypeScript | JSDoc | 生成 HTML 格式的 API 文档 |
| TypeScript | TypeDoc | 生成 TypeScript API 文档 |

---

## 7. 注释最佳实践

### 7.1 类/模块级注释

**包含内容**:
- 职责和核心功能
- 主要使用场景
- 关键技术栈

**示例**:
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
    // ...
}
```

### 7.2 方法/函数级注释

**包含内容**:
- 功能说明（做什么，为什么）
- 参数说明
- 返回值说明
- 异常说明
- 关键业务规则（必要时）

**简洁版示例**（推荐用于简单方法）:
```java
/**
 * 新增知识点
 * 
 * 创建新的知识点记录，名称必须唯一（忽略大小写）。
 * 
 * @param form 知识点表单
 * @return 新增成功的知识点ID
 * @throws IllegalStateException 如果知识点名称已存在
 */
public Long add(AddKnowledgeForm form) {
    // ...
}
```

**详细版示例**（用于复杂方法）:
```java
/**
 * 用户注册
 * 
 * 创建新用户账号，手机号必须是11位数字且未被注册，密码至少8位且包含字母和数字。
 * 注册成功后会异步发送欢迎短信（不阻塞注册流程）。
 * 
 * @param request 注册请求
 * @return 注册成功的用户信息
 * @throws UserExistsException 如果手机号已注册
 * @throws WeakPasswordException 如果密码强度不够
 */
public User register(RegisterRequest request) {
    // ...
}
```

### 7.3 行内注释

**何时添加**:
- 复杂逻辑（算法、状态机）
- 业务规则（边界条件、特殊处理）
- 技术选型（为什么用这个技术）
- 性能考虑（为什么这样优化）

**何时不添加**:
- 简单赋值（如 `user.setName(name)`）
- 显而易见的逻辑（如 `i++`）
- 自解释的代码（如方法名已很清楚）

**示例**:
```java
// 使用 BCrypt 强度 10（推荐值），加密时间约 100ms
user.setPassword(passwordEncoder.encode(password));

// 异步发送短信，避免阻塞注册流程
smsService.sendWelcomeSmsAsync(phone);

// 使用 Redis 分布式锁确保库存操作的原子性
redisLock.lock("product:" + productId);
try {
    productService.decreaseStock(productId, quantity);
} finally {
    redisLock.unlock("product:" + productId);
}
```

---

## 8. 常见问题

### Q1: 什么时候需要添加注释？

**需要注释**:
- 类/模块职责
- 公共方法的功能、参数、返回值、异常
- 复杂逻辑（业务规则、算法、状态机）
- 技术选型原因
- 性能考虑

**不需要注释**:
- 简单赋值
- 显而易见的逻辑
- 自解释的代码
- 私有辅助方法（除非很复杂）

### Q2: 注释应该多详细？

**简单代码**: 一句话说清楚即可
```java
/**
 * 新增知识点
 * 
 * 创建新的知识点记录，名称必须唯一（忽略大小写）。
 */
```

**复杂代码**: 详细说明功能、规则、注意事项
```java
/**
 * 用户注册
 * 
 * 创建新用户账号，手机号必须是11位数字且未被注册，密码至少8位且包含字母和数字。
 * 注册成功后会异步发送欢迎短信（不阻塞注册流程）。
 * 
 * @param request 注册请求
 * @return 注册成功的用户信息
 * @throws UserExistsException 如果手机号已注册
 * @throws WeakPasswordException 如果密码强度不够
 */
```

### Q3: 如何避免注释过时？

1. **代码变更时同步更新注释**
2. **使用工具检查注释与代码一致性**
3. **定期审查和清理过时注释**
4. **Code Review 时检查注释质量**

### Q4: 是否应该使用 HTML 标签？

**不推荐**: HTML 标签增加复杂度，降低可读性

❌ **不推荐**:
```java
/**
 * <p><b>业务规则:</b>
 * <ul>
 *   <li>手机号必须是 11 位数字</li>
 *   <li>密码至少 8 位</li>
 * </ul>
 */
```

✅ **推荐**:
```java
/**
 * 创建新用户账号，手机号必须是11位数字且未被注册，密码至少8位且包含字母和数字。
 */
```

### Q5: 如何判断注释质量？

**好的注释**:
- 清晰、准确、简洁
- 说明"为什么"而不是"做什么"
- 帮助理解代码，而不是重复代码
- 与代码保持同步

**差的注释**:
- 重复代码
- 过时或错误
- 模糊不清
- 过度详细（简单代码加复杂注释）

---

## 9. 注释检查清单

### 9.1 格式检查
- [ ] 符合语言规范（JavaDoc、Docstring、JSDoc）
- [ ] 包含必要标签（`@param`、`@return`、`@throws`）
- [ ] 参数名称与代码一致
- [ ] 避免 HTML 标签

### 9.2 内容检查
- [ ] 类/模块注释包含职责和功能
- [ ] 方法注释包含功能、参数、返回值、异常
- [ ] 行内注释说明"为什么"
- [ ] 注释与代码逻辑一致

### 9.3 质量检查
- [ ] 注释清晰、准确、简洁
- [ ] 注释有价值，不重复代码
- [ ] Linter 验证通过
- [ ] 可以生成完整的 API 文档

---

## 10. 相关资源

### 官方文档
- [JavaDoc 规范](https://www.oracle.com/technical-resources/articles/java/javadoc-tool.html)
- [Python Docstring 规范 (PEP 257)](https://peps.python.org/pep-0257/)
- [JSDoc 规范](https://jsdoc.app/)
- [Google Java Style Guide - Javadoc](https://google.github.io/styleguide/javaguide.html#s7-javadoc)

### 推荐阅读
- [Clean Code - Robert C. Martin](https://www.oreilly.com/library/view/clean-code-a/9780136083238/)
- [Effective Java - Joshua Bloch](https://www.oreilly.com/library/view/effective-java/9780134686097/)
- [The Art of Readable Code - Dustin Boswell](https://www.oreilly.com/library/view/the-art-of/9781449318482/)

### 工具资源
- [Checkstyle](https://checkstyle.org/) - Java 代码检查工具
- [Pylint](https://pylint.org/) - Python 代码检查工具
- [ESLint](https://eslint.org/) - JavaScript/TypeScript 代码检查工具
- [TypeDoc](https://typedoc.org/) - TypeScript 文档生成工具
