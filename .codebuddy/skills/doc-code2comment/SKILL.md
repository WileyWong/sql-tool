---
name: doc-code2comment
description: 为已有代码编写规范的注释 - 分析代码逻辑并生成清晰、准确、符合语言规范的注释
category: documentation
keywords: [代码注释, 文档生成, JavaDoc, JSDoc, 自动注释]
---

# Skill: 为已有代码编写规范注释

为已有代码添加或优化注释，说明代码逻辑和业务规则，提高代码可读性和可维护性。

## 核心原则（15 秒速查）

1. **只加注释不改代码** - 严禁修改代码逻辑、变量名、方法名
2. **说明为什么不是什么** - 注释解释"为什么这样做"而不是"做了什么"
3. **简洁文本格式** - 避免 HTML 标签（如 `<p>`、`<ul>`），使用简单文本
4. **智能跳过** - 已有完整规范注释时直接跳过，避免重复添加
5. **只为复杂逻辑注释** - 简单代码不需要注释，避免过度注释

## 🎯 目标

解决软件研发中 **如何为已有代码编写清晰、规范、有价值的注释** 的问题。

**适用场景**:
- 已有代码缺少注释（新项目、遗留代码）
- 注释不完整或不规范（缺参数说明、格式错误）
- 注释过时或错误（与代码不一致）
- 代码可读性差，需要添加说明（复杂逻辑、业务规则）

**输出成果**:
- 规范的类/模块级注释（JavaDoc、Docstring、JSDoc）
- 完整的方法/函数级注释（功能、参数、返回值、异常）
- 有价值的行内注释（复杂逻辑、业务规则）

## 📚 技术栈参考

本技能基于以下编码规范：
- [Java 编码规范](mdc:.codebuddy/spec/global/standards/backend/java.md) - JavaDoc 注释规范
- [Python 编码规范](mdc:.codebuddy/spec/global/standards/languages/python.md) - Docstring 注释规范
- [JavaScript 编码规范](mdc:.codebuddy/spec/global/standards/languages/javascript.md) - JSDoc 注释规范
- [Vue 编码规范](mdc:.codebuddy/spec/global/standards/languages/vue.md) - Vue 注释规范

参考 [技术栈索引](mdc:.codebuddy/spec/global/knowledge/stack/index.md) 了解更多。

## 📋 前置条件

- [ ] 代码已存在且可运行（或可编译通过）
- [ ] 代码逻辑已理解（或可通过分析推断）
- [ ] 已了解项目的注释规范
- [ ] 已配置 Linter 工具（ESLint、Pylint、Checkstyle）

**重要约束**:
- 🚫 **严禁修改代码逻辑** - 不得改变代码功能、变量名、方法名
- ✅ **允许优化注释** - 修正格式、补充内容、改进表达
- ✅ **允许删除无价值注释** - 如重复代码的注释（`// 设置用户名`）
- ⚠️ **谨慎处理现有注释** - 可以优化但不可删除有价值的内容

## 🔄 执行步骤

### 步骤 1: 分析代码结构

**目标**: 识别代码结构并检查现有注释

**操作**:
- 识别编程语言和代码结构（类、方法、函数、组件）
- 检查现有注释质量（完整性、规范性、准确性）
- 识别输入输出（参数、返回值、异常）
- 识别复杂逻辑（业务规则、算法、边界条件）

**验收标准**:
- [ ] 代码结构已识别
- [ ] 现有注释质量已评估（完整/不完整/缺失）
- [ ] 复杂逻辑已识别

### 步骤 2: 编写或优化类/模块级注释

**目标**: 添加或优化类/模块级注释

**前置检查**: 
- 已有完整规范注释 → 跳过
- 已有注释但不完整/不规范 → 优化

**包含内容**:
- 职责和核心功能
- 主要使用场景
- 关键技术栈（如使用的框架、库）

**验收标准**:
- [ ] 符合语言规范格式（JavaDoc、Docstring、JSDoc）
- [ ] 使用简洁文本格式，无 HTML 标签
- [ ] 说明了类/模块的职责和主要功能

### 步骤 3: 编写或优化方法/函数级注释

**目标**: 添加或优化方法/函数级注释

**前置检查**: 
- 已有完整规范注释 → 跳过
- 已有注释但不完整/不规范 → 优化

**包含内容**:
- 功能说明（做什么，为什么）
- 参数说明（`@param`）
- 返回值说明（`@return`）
- 异常说明（`@throws`）
- 关键业务规则（必要时）

**简洁原则**:
- 简单方法：将关键规则整合到功能描述中（如"名称必须唯一"）
- 复杂方法：可以适当详细说明多个关键规则

**验收标准**:
- [ ] 包含完整的 `@param`、`@return`、`@throws` 标签
- [ ] 参数名称与实际代码一致
- [ ] 使用简洁文本格式，无 HTML 标签
- [ ] 避免功能描述与业务规则重复

### 步骤 4: 编写或优化行内注释

**目标**: 为复杂逻辑添加行内注释

**前置检查**: 
- 代码段已有清晰注释 → 跳过
- 简单代码（如赋值语句） → 跳过

**包含内容**:
- 说明"为什么"这样做（而不是"做了什么"）
- 业务规则、边界条件、性能考虑
- 技术选型原因（如为什么用 BCrypt）

**清理无价值注释**:
- 删除重复代码的注释（如 `// 设置用户名`）
- 删除显而易见的注释（如 `// i 加 1`）

**验收标准**:
- [ ] 仅在复杂逻辑处添加注释
- [ ] 注释说明了"为什么"而不是"做什么"
- [ ] 删除了重复代码的无价值注释

### 步骤 5: 审查注释质量

**目标**: 验证注释质量和完整性

**检查项**:
- 注释清晰、准确、有价值
- 符合语言规范（JavaDoc、Docstring、JSDoc）
- 注释与代码同步，无过时或错误
- 没有修改代码逻辑
- 运行 Linter 工具验证通过

**验收标准**:
- [ ] 所有检查项通过
- [ ] Linter 验证通过

---

## 💡 最佳实践

### 1. 注释说明"为什么"

✅ **推荐**: 说明技术选型原因
```java
// 使用 BCrypt 而不是 MD5，因为 BCrypt 可以抵御暴力破解
user.setPassword(passwordEncoder.encode(password));
```

❌ **不推荐**: 重复代码
```java
// 设置密码
user.setPassword(passwordEncoder.encode(password));
```

### 2. 使用简洁格式

✅ **推荐**: 将规则整合到功能描述
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
```

❌ **不推荐**: 使用 HTML 标签和重复描述
```java
/**
 * 新增知识点
 * 
 * <p>创建新的知识点记录。
 * 
 * <p><b>业务规则:</b>
 * <ul>
 *   <li>知识点名称必须唯一（忽略大小写）</li>
 * </ul>
 */
```

### 3. 避免过度注释

✅ **推荐**: 简单代码不加注释
```java
user.setCreatedAt(new Date());
userRepository.save(user);
```

❌ **不推荐**: 每行都加注释
```java
// 设置创建时间
user.setCreatedAt(new Date());
// 保存用户
userRepository.save(user);
```

---

## ⚠️ 常见错误

### 1. 注释重复代码

❌ **错误**: 注释与代码完全一致
```java
// 设置用户名
user.setUsername(username);
```

✅ **正确**: 只为复杂逻辑添加注释
```java
user.setUsername(username);
user.setPassword(passwordEncoder.encode(password));  // 使用 BCrypt 加密
```

### 2. 注释过时

❌ **错误**: 注释与代码不一致
```java
/**
 * @param email 邮箱地址  // 实际是手机号
 */
public String login(String phone, String password) { }
```

✅ **正确**: 保持注释与代码同步
```java
/**
 * @param phone 手机号
 */
public String login(String phone, String password) { }
```

### 3. 缺少异常说明

❌ **错误**: 方法抛出异常但未在注释中说明
```java
/**
 * 用户注册
 * @param phone 手机号
 * @return 用户信息
 */
public User register(String phone, String password) {
    if (userRepository.existsByPhone(phone)) {
        throw new UserExistsException("手机号已注册");
    }
}
```

✅ **正确**: 完整说明异常
```java
/**
 * 用户注册
 * @param phone 手机号
 * @return 用户信息
 * @throws UserExistsException 如果手机号已注册
 */
public User register(String phone, String password) {
    if (userRepository.existsByPhone(phone)) {
        throw new UserExistsException("手机号已注册");
    }
}
```

---

## ✅ 验证清单

**约束验证**:
- [ ] 未修改代码逻辑（代码功能、变量名、方法名完全保持原样）
- [ ] 注释优化合理（更清晰、更规范，没有删除有价值的内容）

**格式验证**:
- [ ] 符合语言规范格式（JavaDoc、Docstring、JSDoc）
- [ ] 包含必要标签（`@param`、`@return`、`@throws`）
- [ ] 避免使用 HTML 标签
- [ ] 参数名称与实际代码一致

**内容验证**:
- [ ] 类/模块注释包含职责和主要功能
- [ ] 方法/函数注释包含功能、参数、返回值、异常
- [ ] 行内注释说明"为什么"，而不是"做什么"
- [ ] 删除了重复代码的无价值注释

**质量验证**:
- [ ] 注释清晰、准确、有价值
- [ ] 运行 Linter 工具验证通过

---

## 📚 可重用资源

详细的代码示例和技术参考请查看：
- `checklist.md` - 完整的质量检查清单
- `examples.md` - 完整的代码注释示例（Java、Python、TypeScript、Vue）
- `reference.md` - 注释规范和技术参考

## 🔗 相关技能

- `doc-code-generation` - 生成代码（包含注释）
- `doc-analyze-code` - 分析代码（理解后再注释）
- `cr-java-code` - Java 代码审查（检查注释质量）

## 📖 参考资料

- [JavaDoc 规范](https://www.oracle.com/technical-resources/articles/java/javadoc-tool.html)
- [Python Docstring 规范](https://peps.python.org/pep-0257/)
- [JSDoc 规范](https://jsdoc.app/)
- [Google Java Style Guide - Javadoc](https://google.github.io/styleguide/javaguide.html#s7-javadoc)
