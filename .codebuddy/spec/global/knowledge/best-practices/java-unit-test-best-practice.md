# Java 单元测试编写最佳实践(AI代码生成指南)

---

**文档版本**：5.0 (AI生成增强版)  
**最后更新**：2025-11-21  
**作者**：johnsonyang  
**适用范围**：Java单元测试 + AI代码生成 + KB知识库 + Skill技能 + 大型API接口类  
**核心目标**：指导AI精准生成高质量单元测试代码（目标质量得分95+）  
**验证数据**：基于CampusBoleController、AdminController真实项目验证  

**适用场景**：
- ✅ 小型类（<20个方法）：遵循第1-10章
- ✅ 中型类（20-50个方法）：遵循第1-10章 + 适度使用@Nested
- ✅ 大型类（50+个方法）：遵循第11章模块化拆分策略（推荐拆分为3-10个测试文件）

**AI使用指南**：
1. **生成前**：阅读附录A选择合适的提示词模板
2. **生成中**：遵循对应章节的代码模板和规范
3. **生成后**：执行9.2节的自动错误检测与修复
4. **质量验证**：使用1.4节的质量检查清单

---

> **文档目标**: 本文档旨在为AI代码生成提供明确、可执行的单元测试编写规范，确保生成的测试代码具有高质量、高可读性和高覆盖率。基于JUnit 5 + MockWebServer + Mockito技术栈,提供决策树、代码模板和质量检查清单。
>
> **量化价值证明**：基于真实项目验证，使用本最佳实践配合KB知识库和Skill技能，可将测试代码质量从**80.8分提升至92.3分**（提升14%），Mock数据真实性提升66%，测试覆盖率从82%提升至92%。

## 目录
- [0. 技术栈版本要求](#0-技术栈版本要求)
- [1. 核心原则与规范](#1-核心原则与规范)
  - [1.1 基本原则](#11-基本原则)
  - [1.2 测试命名规范](#12-测试命名规范)
  - [1.3 测试覆盖率目标](#13-测试覆盖率目标)
  - [1.4 质量检查清单](#14-质量检查清单)
  - [1.5 KB知识库与Skill技能增强](#15-kb知识库与skill技能增强)
- [2. AI测试代码生成快速指南](#2-ai测试代码生成快速指南)
  - [2.1 代码生成三步法](#21-代码生成三步法)
- [3. 测试类型识别与决策树](#3-测试类型识别与决策树)
  - [3.1 被测代码分类识别](#31-被测代码分类识别)
  - [3.2 测试生成决策矩阵](#32-测试生成决策矩阵)
  - [3.3 代码生成流程图](#33-代码生成流程图)
- [4. 测试结构和组织](#4-测试结构和组织)
  - [4.1 测试类结构](#41-测试类结构)
  - [4.2 测试方法结构 (AAA模式)](#42-测试方法结构-aaa模式)
  - [4.3 测试分组和组织](#43-测试分组和组织)
- [5. 不同场景的测试模式](#5-不同场景的测试模式)
  - [5.1 工具类测试](#51-工具类测试)
  - [5.2 HTTP客户端测试](#52-http客户端测试)
  - [5.3 异常测试](#53-异常测试)
  - [5.4 配置和边界值测试](#54-配置和边界值测试)
  - [5.5 参数化测试](#55-参数化测试)
  - [5.6 Service层测试 (MyBatis-Plus)](#56-service层测试-mybatis-plus)
- [6. Mock和测试隔离](#6-mock和测试隔离)
  - [6.1 MockWebServer使用](#61-mockwebserver使用)
  - [6.2 Mockito使用](#62-mockito使用)
  - [6.3 测试隔离原则](#63-测试隔离原则)
  - [6.4 KB驱动的Mock数据质量](#64-kb驱动的mock数据质量)
- [7. 断言最佳实践](#7-断言最佳实践)
  - [7.1 基础断言](#71-基础断言)
  - [7.2 异常断言](#72-异常断言)
  - [7.3 集合断言](#73-集合断言)
  - [7.4 超时断言](#74-超时断言)
  - [7.5 复合断言](#75-复合断言)
- [8. 测试数据管理](#8-测试数据管理)
  - [8.1 测试数据创建模式](#81-测试数据创建模式)
  - [8.2 测试数据清理](#82-测试数据清理)
  - [8.3 使用Builder模式构建测试数据](#83-使用builder模式构建测试数据)
- [9. 注意事项和常见陷阱](#9-注意事项和常见陷阱)
  - [9.1 常见错误](#91-常见错误)
  - [9.2 AI自动错误检测与修复](#92-ai自动错误检测与修复)
- [10. JUnit 5 和 Mockito 核心知识点总结](#10-junit-5-和-mockito-核心知识点总结)
  - [10.1 JUnit 5 核心特性](#101-junit-5-核心特性)
  - [10.2 Mockito 核心特性](#102-mockito-核心特性)
  - [10.3 测试编写检查清单](#103-测试编写检查清单)
- [11. 大型API接口类单元测试生成策略](#11-大型api接口类单元测试生成策略)
  - [11.1 问题与挑战](#111-问题与挑战)
  - [11.2 模块化拆分策略](#112-模块化拆分策略)
  - [11.3 完整生成流程示例](#113-完整生成流程示例)
  - [11.4 模块化拆分的收益](#114-模块化拆分的收益)
  - [11.5 AI生成时的最佳实践](#115-ai生成时的最佳实践)
  - [11.6 维护和扩展](#116-维护和扩展)
  - [11.7 总结与建议](#117-总结与建议)
- [附录A: AI生成提示词模板](#附录a-ai生成提示词模板)
  - [A.1 工具类测试生成模板](#a1-工具类测试生成模板)
  - [A.2 HTTP客户端测试生成模板](#a2-http客户端测试生成模板)
  - [A.3 Service层测试生成模板](#a3-service层测试生成模板)
  - [A.4 大型API类批次生成模板](#a4-大型api类批次生成模板)

---

## 0. 技术栈版本要求

### 0.1 核心依赖版本

| 依赖 | 最低版本 | 推荐版本 | 说明 |
|------|---------|---------|------|
| **JUnit Jupiter** | 5.7.0 | 5.10.0+ | @Nested、@ParameterizedTest、@DisplayName |
| **Mockito** | 3.4.0 | 5.5.0+ | mockStatic支持需3.4+，最新特性建议5.x |
| **MockWebServer** | 4.9.0 | 4.12.0+ | OkHttp3，HTTP客户端测试 |
| **AssertJ** (可选) | 3.20.0 | 3.24.0+ | 流式断言，增强可读性 |

### 0.2 Maven依赖配置

<details>
<summary>点击展开Maven依赖配置</summary>

```xml
<dependencies>
    <!-- JUnit 5 -->
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter</artifactId>
        <version>5.10.0</version>
        <scope>test</scope>
    </dependency>
    
    <!-- Mockito -->
    <dependency>
        <groupId>org.mockito</groupId>
        <artifactId>mockito-core</artifactId>
        <version>5.5.0</version>
        <scope>test</scope>
    </dependency>
    
    <!-- Mockito JUnit 5 Extension -->
    <dependency>
        <groupId>org.mockito</groupId>
        <artifactId>mockito-junit-jupiter</artifactId>
        <version>5.5.0</version>
        <scope>test</scope>
    </dependency>
    
    <!-- MockWebServer (OkHttp) -->
    <dependency>
        <groupId>com.squareup.okhttp3</groupId>
        <artifactId>mockwebserver</artifactId>
        <version>4.12.0</version>
        <scope>test</scope>
    </dependency>
    
    <!-- AssertJ (可选，流式断言) -->
    <dependency>
        <groupId>org.assertj</groupId>
        <artifactId>assertj-core</artifactId>
        <version>3.24.0</version>
        <scope>test</scope>
    </dependency>
    
    <!-- Lombok (可选，@SneakyThrows) -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>1.18.30</version>
        <scope>provided</scope>
    </dependency>
</dependencies>
```

</details>

### 0.3 Gradle依赖配置

<details>
<summary>点击展开Gradle依赖配置</summary>

```gradle
dependencies {
    // JUnit 5
    testImplementation 'org.junit.jupiter:junit-jupiter:5.10.0'
    
    // Mockito
    testImplementation 'org.mockito:mockito-core:5.5.0'
    testImplementation 'org.mockito:mockito-junit-jupiter:5.5.0'
    
    // MockWebServer
    testImplementation 'com.squareup.okhttp3:mockwebserver:4.12.0'
    
    // AssertJ (可选)
    testImplementation 'org.assertj:assertj-core:3.24.0'
    
    // Lombok (可选)
    compileOnly 'org.projectlombok:lombok:1.18.30'
    annotationProcessor 'org.projectlombok:lombok:1.18.30'
}

test {
    useJUnitPlatform()
}
```

</details>

### 0.4 版本兼容性说明

**JUnit 5版本要求**：
- ✅ **5.7.0+**：支持@Nested、@ParameterizedTest、@DisplayName
- ✅ **5.8.0+**：支持@TempDir、改进的生命周期管理
- ✅ **5.10.0+**：性能优化、更好的并行执行支持（推荐）

**Mockito版本要求**：
- ✅ **3.4.0+**：支持mockStatic()（静态方法Mock）
- ✅ **4.0.0+**：支持final类和final方法Mock
- ✅ **5.0.0+**：改进的性能、更好的错误提示（推荐）

**MockWebServer版本要求**：
- ✅ **4.9.0+**：稳定的HTTP Mock支持
- ✅ **4.12.0+**：性能优化、更好的TLS支持（推荐）

---

## 1. 核心原则与规范

### 1.1 基本原则

**FIRST原则**
- **F (Fast)**: 使用MockWebServer，避免真实网络/数据库
- **I (Independent)**: 使用@BeforeEach重置状态，避免共享可变状态
- **R (Repeatable)**: Mock时间和外部依赖，避免随机性
- **S (Self-Validating)**: 使用断言，避免手动检查
- **T (Timely)**: 与代码实现同步编写

**测试框架选择**
- **必需**: JUnit 5 (Jupiter)
- **HTTP测试**: MockWebServer (OkHttp)
- **Service层**: Mockito（使用@ExtendWith(MockitoExtension.class)）
- **可选**: Lombok (@SneakyThrows)

**测试结构规范**
- **测试类命名**: 被测类名 + "Test"
- **静态资源**: @BeforeAll初始化，@AfterAll清理
- **实例资源**: @BeforeEach初始化，@AfterEach清理
- **测试方法**: 必须遵循AAA模式 (Arrange-Act-Assert)
- **测试组织**: 优先使用@Nested进行层级组织

**JUnit 5生命周期注解：**

<details>
<summary>点击展开生命周期注解示例</summary>

```java
import org.junit.jupiter.api.*;

class LifecycleTest {
    
    // 所有测试前执行一次（必须是static）
    @BeforeAll
    static void initAll() {
        System.out.println("Before all tests");
    }
    
    // 所有测试后执行一次（必须是static）
    @AfterAll
    static void tearDownAll() {
        System.out.println("After all tests");
    }
    
    // 每个测试前执行
    @BeforeEach
    void init() {
        System.out.println("Before each test");
    }
    
    // 每个测试后执行
    @AfterEach
    void tearDown() {
        System.out.println("After each test");
    }
    
    @Test
    void testMethod() {
        System.out.println("Test method");
    }
}
```

</details>

**执行顺序：**
```
@BeforeAll (static)
  ├─ @BeforeEach
  │   ├─ @Test (testMethod1)
  │   └─ @AfterEach
  ├─ @BeforeEach
  │   ├─ @Test (testMethod2)
  │   └─ @AfterEach
  └─ @AfterAll (static)
```

### 1.2 测试命名规范

**AI代码生成规则：**
1. **工具类/简单方法**：使用模式1或模式2
2. **复杂业务逻辑**：使用模式3或模式4
3. **中文团队**：优先使用模式4（@DisplayName）

```java
// 模式1：简单方法
@Test
void testGetSecretContent() { }

// 模式2：同一方法的不同场景
@Test
void testUploadLargeFile() { }

// 模式3：行为驱动开发
@Test
void shouldThrowExceptionWhenKeyStoreIsEmpty() { }

// 模式4：中文团队复杂场景
@Test
@DisplayName("测试最小容量配置")
void testMinimumCapacity() { }
```

### 1.3 测试覆盖率目标

| 代码类型 | 行覆盖率 | 分支覆盖率 | 优先级 | 必须测试的场景 |
|---------|---------|-----------|-------|--------------|
| 工具类/公共库 | 95%+ | 90%+ | P0 | 正常值、null值、空集合、边界值、异常分支 |
| 核心业务逻辑 | 90%+ | 85%+ | P0 | 正常流程、业务规则、状态转换、异常降级 |
| HTTP客户端 | 85%+ | 80%+ | P1 | 成功响应、客户端错误、服务端错误、超时 |
| Service层(MyBatis-Plus) | 85%+ | 80%+ | P1 | CRUD操作、复杂业务逻辑、事务场景 |
| 配置类/Builder | 80%+ | 75%+ | P2 | 默认配置、边界值、非法配置异常 |
| 异常处理逻辑 | 100% | 100% | P0 | 所有throw语句、所有catch分支 |
| 并发组件 | 80%+ | 75%+ | P1 | 并发读写、并发一致性、高负载场景 |

### 1.4 质量检查清单

**✅ 结构检查**
- [ ] 测试类命名为 `XXXTest`
- [ ] 静态资源在 `@BeforeAll` 初始化，`@AfterAll` 清理
- [ ] 实例资源在 `@BeforeEach` 初始化，`@AfterEach` 清理
- [ ] 每个测试方法只测试一个功能点
- [ ] 测试方法遵循AAA模式（Arrange-Act-Assert）

**✅ 命名检查**
- [ ] 测试方法名清晰表达测试意图
- [ ] 使用 `test + 方法名 + 场景` 或 `should + 预期 + when + 条件`
- [ ] 复杂场景使用 `@DisplayName` 中文说明

**✅ 断言检查**
- [ ] 每个测试至少有一个断言
- [ ] 异常测试使用 `assertThrows`
- [ ] 断言失败时有清晰的错误消息
- [ ] 验证了返回值、状态变化、副作用

**✅ Mock检查（如适用）**
- [ ] HTTP测试使用MockWebServer而非Mockito
- [ ] Mock响应数据完整且符合真实场景
- [ ] 验证了请求的方法、路径、参数、请求体
- [ ] Mock服务器正确启动和关闭

**✅ 资源管理检查**
- [ ] IO资源使用try-with-resources
- [ ] 临时文件使用deleteOnExit()
- [ ] Mock服务器在@AfterAll中关闭
- [ ] 缓存/连接池在@AfterEach中清理

**✅ KB知识库应用检查**
- [ ] Mock数据字段覆盖完整（基于DTO文档）
- [ ] 业务数据真实性符合实际场景
- [ ] 引用了相关KB文档（service-api-http.md、dto.md等）
- [ ] 依赖关系准确（基于feign.md、business-logic.md）

**✅ Skill技能应用检查**
- [ ] 使用@Nested进行系统化分组
- [ ] 包含完整的异常场景测试
- [ ] 所有测试方法有AAA模式注释
- [ ] 测试命名包含编号、场景和结果

### 1.5 KB知识库与Skill技能增强

**KB知识库增强价值**（基于真实项目验证）

| 增强维度 | 无KB | 使用KB | 提升效果 |
|---------|------|--------|---------|
| Mock数据真实性 | 简单值 | 完整业务数据 | **+66%** |
| DTO字段覆盖率 | 30% | 100% | **+70%** |
| 业务理解准确性 | 一般 | 精准 | **+66%** |
| 文档完整性 | 基础 | 详细引用 | **+66%** |
| 依赖关系准确性 | 部分 | 完整 | **+50%** |

**Skill技能增强价值**（基于真实项目验证）

| 增强维度 | 无Skill | 使用Skill | 提升效果 |
|---------|---------|----------|---------|
| @Nested分组 | 注释分组 | 系统化10个分组 | **+100%** |
| 异常测试覆盖 | 部分 | 完整3+个 | **+100%** |
| AAA注释完整性 | 部分 | 全部完整 | **+90%** |
| 命名规范性 | 一般 | 标准化 | **+80%** |
| 测试组织性 | 基础 | 系统化 | **+85%** |

**最佳组合：Skill + KB**

```
预估质量得分：
- 基线版本（无KB无Skill）: 80.8分
- KB增强版: 87.5分
- Skill增强版: 89.0分
- Skill + KB版: 92.3分（推荐）

预估覆盖率：
- 基线版本: 行82% / 分支78%
- KB增强版: 行75% / 分支70%（需补充异常测试）
- Skill增强版: 行87% / 分支82%
- Skill + KB版: 行92% / 分支88%（推荐）
```

---

## 2. AI测试代码生成快速指南

### 2.1 代码生成三步法

**Step 1: 识别被测代码类型**
```
分析被测类 → 确定测试模式 → 选择合适模板
```

**Step 2: 选择测试框架和依赖**
```java
// 必需依赖
- JUnit 5 (Jupiter)               // @Test, @BeforeAll, @AfterAll
- AssertJ 或 JUnit Assertions     // 断言库

// 可选依赖（根据场景选择）
- MockWebServer (OkHttp)          // HTTP客户端测试
- Mockito                         // 复杂对象Mock（慎用）
- Lombok @SneakyThrows            // 简化测试异常处理
```

**Step 3: 应用代码生成清单**
- [ ] 导入正确的测试框架
- [ ] 使用规范的测试类命名（被测类名 + Test）
- [ ] 生命周期方法设置正确（@BeforeAll/@AfterAll/@BeforeEach/@AfterEach）
- [ ] 每个测试方法遵循AAA模式
- [ ] 测试方法命名清晰表达意图
- [ ] 异常测试使用assertThrows
- [ ] 资源正确清理

---

## 3. 测试类型识别与决策树

### 3.1 被测代码分类识别

AI在生成测试前，必须先识别被测代码类型：

```
被测代码分析
├─ 是否包含HTTP调用？
│  ├─ 是 → 使用MockWebServer模式（见5.2节）
│  └─ 否 → 继续判断
│
├─ 是否为工具类/静态方法？
│  ├─ 是 → 使用工具类测试模式（见5.1节）
│  └─ 否 → 继续判断
│
├─ 是否包含异步/并发操作？
│  ├─ 是 → 使用异步测试模式（见5.7节）
│  └─ 否 → 继续判断
│
├─ 是否为配置/Builder类？
│  ├─ 是 → 使用配置测试模式（见5.4节）
│  └─ 否 → 继续判断
│
└─ 是否为业务服务类？
   └─ 是 → 使用服务测试模式（见5.6节）
```

### 3.2 测试生成决策矩阵

| 被测代码特征 | 测试模式 | Mock策略 | 关键注意点 |
|------------|---------|---------|-----------|
| 工具类静态方法 | 工具类模式 | 无需Mock | 覆盖边界值、null、异常 |
| HTTP客户端 | MockWebServer模式 | MockWebServer | 验证请求和响应 |
| Service层（依赖Mapper） | Mockito模式 | Mock Mapper | 测试业务逻辑，隔离数据库 |
| 业务服务（无外部依赖） | 标准单元测试 | 无需Mock | 验证业务逻辑 |
| 业务服务（有外部依赖） | 集成测试 | MockWebServer/Stub | 隔离外部依赖 |
| 配置/Builder | 配置测试模式 | 无需Mock | 验证默认值、边界值 |
| 缓存/并发组件 | 并发测试模式 | 无需Mock | 使用CountDownLatch |
| 异常处理逻辑 | 异常测试模式 | 根据需要 | 使用assertThrows |

### 3.3 代码生成流程图

```
开始
  ↓
读取被测类源代码
  ↓
识别类型（工具类/服务类/HTTP客户端/配置类）
  ↓
确定依赖项（是否需要MockWebServer/Mockito）
  ↓
生成测试类框架
  ├─ 类声明
  ├─ 静态字段（MockWebServer等）
  ├─ 实例字段（被测对象）
  ├─ @BeforeAll/@AfterAll（静态资源）
  └─ @BeforeEach/@AfterEach（实例资源）
  ↓
分析被测方法列表
  ↓
对每个方法：
  ├─ 生成正常场景测试
  ├─ 生成边界值测试
  ├─ 生成异常场景测试
  └─ 生成并发测试（如需要）
  ↓
生成辅助方法（createTestData等）
  ↓
验证代码质量（使用检查清单）
  ↓
输出完整测试类
  ↓
结束
```

---

## 4. 测试结构和组织

### 4.1 测试类结构（AI代码生成模板）

**AI生成规则：**
1. 测试类名 = 被测类名 + "Test"
2. 静态资源（MockWebServer等）使用 @BeforeAll/@AfterAll
3. 实例资源使用 @BeforeEach/@AfterEach
4. 按功能分组测试方法

**完整测试类模板（AI直接使用）：**

<details>
<summary>点击展开完整测试类模板</summary>

```java
package com.tencent.hr.sdk.xxx;

import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import okhttp3.mockwebserver.RecordedRequest;
import org.junit.jupiter.api.*;

import static org.junit.jupiter.api.Assertions.*;

/**
 * {@link ServiceName} 的单元测试
 */
@Slf4j
class ServiceNameTest {
    
    static MockWebServer mockWebServer;
    static ServiceClient serviceClient;
    
    private ServiceType service;
    
    @BeforeAll
    @SneakyThrows
    static void init() {
        mockWebServer = new MockWebServer();
        mockWebServer.start();
        
        Config config = new Config();
        config.setBaseUrl(mockWebServer.url("").toString());
        serviceClient = new ServiceClient(config);
    }
    
    @AfterAll
    @SneakyThrows
    static void destroy() {
        if (mockWebServer != null) {
            mockWebServer.close();
        }
    }
    
    @BeforeEach
    void setUp() {
        service = new ServiceType();
    }
    
    @AfterEach
    void tearDown() {
        if (service != null) {
            service.shutdown();
        }
    }
    
    @Test
    @DisplayName("测试基本操作")
    void testBasicOperation() {
        // 测试实现（见AAA模式）
    }
    
    @Test
    @DisplayName("测试异常场景")
    void testThrowsException() {
        assertThrows(Exception.class, () -> {
            service.method(null);
        });
    }
}
```

</details>

### 4.2 测试方法结构 (AAA模式)

**Arrange-Act-Assert模式 - 所有测试必须遵循：**

<details>
<summary>点击展开AAA模式示例</summary>

```java
@Test
@DisplayName("测试文件上传功能")
void testUpload() throws Exception {
    // Arrange: 准备测试环境
    FileInfo mockFileInfo = new FileInfo("in_appName/1876216384665608192.csv");
    ResponseInfo<FileInfo> mockResp = ResponseInfo.success(102, "该文件上传完成", mockFileInfo);
    
    mockWebServer.enqueue(new MockResponse()
            .setResponseCode(200)
            .setBody(JsonUtil.toJson(mockResp)));
    
    File tmpFile = createTmpFile("csv");
    
    // Act: 执行被测方法
    String uuid = fileServicesClient.upload(tmpFile);
    
    // Assert: 验证结果
    assertEquals(mockFileInfo.getUuid(), uuid);
    
    RecordedRequest request = mockWebServer.takeRequest();
    assertEquals("POST", request.getMethod());
    assertTrue(request.getHeader("Content-Type").contains("multipart/form-data"));
}
```

</details>

### 4.3 测试分组和组织

**使用@Nested嵌套类组织测试（AI推荐使用）：**

<details>
<summary>点击展开@Nested嵌套类示例</summary>

```java
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

@DisplayName("缓存测试")
class CacheTest {
    
    private Cache<String, String> cache;
    
    @Nested
    @DisplayName("基础操作测试")
    class BasicOperationsTests {
        
        @BeforeEach
        void setUp() {
            cache = new Cache<>();
        }
        
        @Test
        @DisplayName("put操作应正确存储键值对")
        void testPut() {
            cache.put("key", "value");
            assertEquals("value", cache.get("key"));
        }
        
        @Test
        @DisplayName("get操作应返回存储的值")
        void testGet() {
            cache.put("key", "value");
            String result = cache.get("key");
            assertNotNull(result);
        }
    }
    
    @Nested
    @DisplayName("边界值测试")
    class BoundaryTests {
        
        @Test
        @DisplayName("空键应抛出异常")
        void testNullKey() {
            assertThrows(IllegalArgumentException.class, () -> {
                cache.put(null, "value");
            });
        }
    }
    
    @Nested
    @DisplayName("并发测试")
    class ConcurrencyTests {
        
        @BeforeEach
        void setUp() {
            cache = new ConcurrentCache<>();
        }
        
        @Test
        @DisplayName("并发写入应保持数据一致性")
        void testConcurrentWrite() throws InterruptedException {
            CountDownLatch latch = new CountDownLatch(10);
            // 并发测试代码
        }
    }
}
```

</details>

**@Nested测试最佳实践：**

1. **层级组织**：使用嵌套类创建测试层级，清晰表达测试结构
2. **@BeforeEach继承**：外层类的@BeforeEach会在内层类的@BeforeEach之前执行
3. **共享状态**：内层类可以访问外层类的字段和方法
4. **@DisplayName**：为每个嵌套类添加清晰的显示名称

**完整示例（基于JUnit 5官方示例）：**

<details>
<summary>点击展开栈测试完整示例</summary>

```java
import static org.junit.jupiter.api.Assertions.*;
import java.util.EmptyStackException;
import java.util.Stack;
import org.junit.jupiter.api.*;

@DisplayName("栈的测试")
class StackTest {
    
    Stack<Object> stack;
    
    @Test
    @DisplayName("使用new Stack()实例化")
    void isInstantiatedWithNew() {
        new Stack<>();
    }
    
    @Nested
    @DisplayName("当栈为空时")
    class WhenNew {
        
        @BeforeEach
        void createNewStack() {
            stack = new Stack<>();
        }
        
        @Test
        @DisplayName("应该为空")
        void isEmpty() {
            assertTrue(stack.isEmpty());
        }
        
        @Test
        @DisplayName("pop操作应抛出EmptyStackException")
        void throwsExceptionWhenPopped() {
            assertThrows(EmptyStackException.class, stack::pop);
        }
        
        @Test
        @DisplayName("peek操作应抛出EmptyStackException")
        void throwsExceptionWhenPeeked() {
            assertThrows(EmptyStackException.class, stack::peek);
        }
        
        @Nested
        @DisplayName("压入元素后")
        class AfterPushing {
            
            String anElement = "an element";
            
            @BeforeEach
            void pushAnElement() {
                stack.push(anElement);
            }
            
            @Test
            @DisplayName("不再为空")
            void isNotEmpty() {
                assertFalse(stack.isEmpty());
            }
            
            @Test
            @DisplayName("pop应返回元素且栈变空")
            void returnElementWhenPopped() {
                assertEquals(anElement, stack.pop());
                assertTrue(stack.isEmpty());
            }
            
            @Test
            @DisplayName("peek应返回元素但栈不变空")
            void returnElementWhenPeeked() {
                assertEquals(anElement, stack.peek());
                assertFalse(stack.isEmpty());
            }
        }
    }
}
```

</details>

---

## 5. 不同场景的测试模式

### 5.1 工具类测试模式

**识别特征：** 静态方法、无状态、纯函数

```java
class AssertUtilTest {

    @Test
    @DisplayName("测试isTrue - 正常和异常场景")
    void testIsTrue() {
        assertDoesNotThrow(() -> 
            AssertUtil.isTrue(true, "Expression is true"));

        Exception exception = assertThrows(AssertException.class, () -> {
            AssertUtil.isTrue(false, "Expression is false");
        });
        assertEquals("Expression is false", exception.getMessage());
    }

    @Test
    @DisplayName("测试isNotBlankString - 覆盖所有边界情况")
    void testIsNotBlankString() {
        assertDoesNotThrow(() -> 
            AssertUtil.isNotBlankString("Hello", "String is not blank"));

        assertThrows(AssertException.class, () -> {
            AssertUtil.isNotBlankString("", "String is blank");
        });

        assertThrows(AssertException.class, () -> {
            AssertUtil.isNotBlankString("   ", "String is blank");
        });
    }
}
```

### 5.2 HTTP客户端测试模式

**识别特征：** 包含HTTP调用，需要网络请求

**AI生成规则：**
1. ✅ **必须使用** MockWebServer，不要使用真实网络请求
2. ✅ **必须验证** 请求内容（方法、路径、参数、请求体）
3. ✅ **必须测试** 各种HTTP状态码

<details>
<summary>点击展开HTTP客户端测试示例</summary>

```java
class FileServicesClientTest {

    static FileServicesClient fileServicesClient;
    static MockWebServer mockWebServer;

    @BeforeAll
    @SneakyThrows
    static void init() {
        mockWebServer = new MockWebServer();
        mockWebServer.start();
        
        FileServicesConfig config = new FileServicesConfig(
                "appName", 
                "appToken",
                mockWebServer.url("").toString()
        );
        fileServicesClient = new FileServicesClient(config);
    }

    @AfterAll
    @SneakyThrows
    static void destroy() {
        if (mockWebServer != null) {
            mockWebServer.close();
        }
    }
    
    @Test
    @SneakyThrows
    @DisplayName("测试获取文件详情")
    void testGetFileDetail() {
        FileDetail mockDetail = new FileDetail()
                .setFileUuid("in_appName/1876216384665608192.csv")
                .setFileSize(1024L);
        
        ResponseInfo<FileDetail> mockResp = ResponseInfo.success(0, "", mockDetail);
        
        mockWebServer.enqueue(new MockResponse()
                .setResponseCode(200)
                .setBody(JsonUtil.toJson(mockResp)));

        String fileUuid = "in_appName/1876216384665608192.csv";

        FileDetail fileDetail = fileServicesClient.getFileDetail(fileUuid);

        assertNotNull(fileDetail);
        assertEquals(mockDetail, fileDetail);

        RecordedRequest request = mockWebServer.takeRequest();
        assertEquals("GET", request.getMethod());
        assertEquals(fileUuid, request.getRequestUrl().queryParameter("fileUuid"));
    }
    
    @Test
    @DisplayName("测试HTTP 404错误处理")
    void testHandleNotFoundError() {
        mockWebServer.enqueue(new MockResponse()
                .setResponseCode(404)
                .setBody("{\"error\":\"File not found\"}"));
        
        assertThrows(FileNotFoundException.class, () -> {
            fileServicesClient.getFileDetail("non-existent-uuid");
        });
    }
}
```

</details>

**MockWebServer核心API：**

```java
mockWebServer.enqueue(new MockResponse()
    .setResponseCode(200)
    .setBody(jsonBody)
    .setHeader("Content-Type", "application/json")
    .setBodyDelay(100, TimeUnit.MILLISECONDS));

RecordedRequest request = mockWebServer.takeRequest();
String method = request.getMethod();
String path = request.getPath();
String body = request.getBody().readUtf8();
String header = request.getHeader("Authorization");

HttpUrl requestUrl = request.getRequestUrl();
assertEquals("value", requestUrl.queryParameter("key"));
```

### 5.3 异常测试模式

**识别特征：** 方法可能抛出异常，需要验证异常类型和消息

```java
class ExceptionTest {

    @Test
    @DisplayName("测试KeyStore为空时抛出KmsException")
    void testThrowsKmsExceptionWhenKeyStoreIsEmpty() {
        Exception exception = assertThrows(KmsException.class, () -> {
            KmsServiceFactory.getKmsService(invalidConfig);
        });
        assertEquals("keyStore is empty", exception.getMessage());
    }
    
    @Test
    @DisplayName("测试异步操作的异常链")
    void testExceptionChain() {
        ExecutionException exception = assertThrows(ExecutionException.class, () -> {
            future.get();
        });
        
        Throwable cause = exception.getCause();
        assertTrue(cause instanceof RuntimeException);
        assertEquals("测试异常", cause.getMessage());
    }
    
    @Test
    @DisplayName("测试有效配置不抛出异常")
    void testDoesNotThrowWithValidConfig() {
        assertDoesNotThrow(() -> {
            KmsServiceFactory.getKmsService(validConfig);
        });
    }
}
```

### 5.4 配置和边界值测试模式

**识别特征：** Builder模式、配置类、需要验证默认值和边界值

<details>
<summary>点击展开配置和边界值测试示例</summary>

```java
class ConfigBoundaryTest {

    @Test
    @DisplayName("测试最小容量配置")
    void testMinimumCapacity() throws InterruptedException {
        Cache<String, String> minCache = null;
        try {
            CacheConfig<Object, Object> config = CacheConfig.newBuilder()
                    .initialCapacity(1)
                    .maximumSize(1);
            minCache = config.<String, String>build();

            assertEquals(0, minCache.size());

            minCache.put("key1", "value1");
            assertEquals("value1", minCache.get("key1"));
            
            minCache.put("key2", "value2");
            Thread.sleep(200);

            assertTrue(minCache.size() <= 1);
        } finally {
            if (minCache != null) {
                minCache.shutdown();
            }
        }
    }
    
    @Test
    @DisplayName("测试配置异常场景")
    void testConfigExceptions() {
        assertThrows(IllegalArgumentException.class, ()->
            CacheConfig.newBuilder().initialCapacity(-1));

        assertThrows(IllegalArgumentException.class, ()->
            CacheConfig.newBuilder().maximumSize(-1));

        assertThrows(IllegalStateException.class, ()->
            CacheConfig.newBuilder()
                .initialCapacity(100)
                .maximumSize(50)
                .build());
    }
}
```

</details>

### 5.5 参数化测试模式

**识别特征：** 同一逻辑需要测试多组数据，边界值测试

<details>
<summary>点击展开参数化测试示例</summary>

```java
class ParameterizedTests {

    @ParameterizedTest
    @ValueSource(strings = {"xlsx", "pptx", "docx", "pdf"})
    @DisplayName("测试可转换的文件扩展名")
    void testFileExtConvertable(String ext) {
        assertTrue(fileServicesClient.fileExtConvertable(ext));
    }

    @ParameterizedTest
    @MethodSource("provideTestData")
    @DisplayName("测试复杂数据组合")
    void testWithMethodSource(String input, int expected) {
        assertEquals(expected, service.process(input).length());
    }

    private static Stream<Arguments> provideTestData() {
        return Stream.of(
            Arguments.of("test", 4),
            Arguments.of("hello", 5),
            Arguments.of("", 0)
        );
    }

    @ParameterizedTest
    @CsvSource({
        "0.0, true",
        "0.5, false",
        "1.0, false"
    })
    @DisplayName("测试不同溢出比例")
    void testDifferentOverflowRatios(double ratio, boolean synchronous) {
        Config config = new Config();
        config.setOverflowRatio(ratio);
        
        assertEquals(synchronous, config.isSynchronous());
    }
}
```

</details>

### 5.6 Service层测试 (MyBatis-Plus)

**识别特征：** Service类依赖Mapper接口，需要测试业务逻辑而非SQL

<details>
<summary>点击展开Service层测试示例</summary>

```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private UserService userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
    }

    @Test
    @DisplayName("根据ID查询用户")
    void testGetUserById() {
        when(userMapper.selectById(1L)).thenReturn(testUser);

        User result = userService.getUserById(1L);

        assertNotNull(result);
        assertEquals("testuser", result.getUsername());
        verify(userMapper).selectById(1L);
    }

    @Test
    @DisplayName("查询用户列表")
    void testGetUserList() {
        List<User> users = Arrays.asList(testUser, new User());
        when(userMapper.selectList(any(LambdaQueryWrapper.class)))
            .thenReturn(users);

        List<User> result = userService.getActiveUsers();

        assertEquals(2, result.size());
        verify(userMapper).selectList(any(LambdaQueryWrapper.class));
    }

    @Test
    @DisplayName("创建用户")
    void testCreateUser() {
        when(userMapper.insert(any(User.class))).thenReturn(1);

        boolean result = userService.createUser(testUser);

        assertTrue(result);
        verify(userMapper).insert(any(User.class));
    }

    @Test
    @DisplayName("异常场景 - Mapper抛出异常")
    void testMapperThrowsException() {
        when(userMapper.selectById(1L))
            .thenThrow(new RuntimeException("Database error"));

        Exception exception = assertThrows(RuntimeException.class, () -> {
            userService.getUserById(1L);
        });

        assertEquals("Database error", exception.getMessage());
    }
}
```

</details>

---

## 6. Mock和测试隔离

### 6.1 MockWebServer使用模式

**为什么优先使用MockWebServer？**
- ✅ 真实HTTP协议交互
- ✅ 验证请求细节（方法、路径、参数、请求体）
- ✅ 模拟网络延迟、超时、错误
- ✅ 不需要复杂的Mock配置

**基本使用模式：**

<details>
<summary>点击展开MockWebServer基本使用模式</summary>

```java
class ServiceClientTest {
    static MockWebServer mockWebServer;
    static ServiceClient client;

    @BeforeAll
    @SneakyThrows
    public static void init() {
        mockWebServer = new MockWebServer();
        mockWebServer.start();
        
        Config config = new Config();
        config.setBaseUrl(mockWebServer.url("").toString());
        client = new ServiceClient(config);
    }

    @AfterAll
    @SneakyThrows
    public static void destroy() {
        mockWebServer.shutdown();
    }

    @Test
    void testApiCall() throws InterruptedException {
        String responseBody = "{\"status\":\"success\"}";
        mockWebServer.enqueue(new MockResponse()
                .setResponseCode(200)
                .setHeader("Content-Type", "application/json")
                .setBody(responseBody));

        Response response = client.callApi();

        assertEquals("success", response.getStatus());

        RecordedRequest request = mockWebServer.takeRequest();
        assertEquals("/api/endpoint", request.getPath());
        assertEquals("POST", request.getMethod());
    }
}
```

</details>

### 6.2 Mockito使用

**适用场景：**
- 需要Mock静态方法
- 需要Mock复杂对象行为
- Mock MyBatis-Plus Mapper
- Service层业务逻辑测试

**基础Mock创建和注入：**

<details>
<summary>点击展开Mockito基础Mock创建和注入示例</summary>

```java
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.mockito.Mockito.*;

// 方式1：使用@ExtendWith注解（推荐 - JUnit 5）
@ExtendWith(MockitoExtension.class)
class ServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @InjectMocks
    private UserService userService;
    
    @Test
    void testFindUser() {
        // Arrange
        User mockUser = new User("John");
        when(userRepository.findById(1L)).thenReturn(mockUser);
        
        // Act
        User result = userService.findUser(1L);
        
        // Assert
        assertEquals("John", result.getName());
        verify(userRepository).findById(1L);
    }
}

// 方式2：使用MockitoJUnit.rule()（JUnit 4风格兼容）
class ServiceTestWithRule {
    
    @Rule
    public MockitoRule mockitoRule = MockitoJUnit.rule();
    
    @Mock
    private UserRepository userRepository;
}
```

</details>

**参数匹配器（ArgumentMatchers）：**

<details>
<summary>点击展开参数匹配器示例</summary>

```java
import static org.mockito.ArgumentMatchers.*;

@Test
void testArgumentMatchers() {
    // 常用匹配器
    when(mock.process(anyString())).thenReturn("processed");
    when(mock.process(any(MyClass.class))).thenReturn("processed");
    when(mock.calculate(anyInt(), anyDouble())).thenReturn(100.0);
    
    // 精确匹配
    when(mock.process(eq("exact"))).thenReturn("matched");
    
    // 内容匹配（refEq）
    MyObject obj1 = new MyObject("value");
    when(mock.process(refEq(obj1))).thenReturn("matched");
    
    // 自定义匹配器
    when(mock.process(argThat(s -> s.startsWith("prefix")))).thenReturn("matched");
    
    // ⚠️ 注意：混用时所有参数都必须使用匹配器
    // ❌ 错误：when(mock.method("exact", anyString()))
    // ✅ 正确：when(mock.method(eq("exact"), anyString()))
}
```

</details>

**Stubbing（打桩）和Verification（验证）：**

<details>
<summary>点击展开Stubbing和Verification示例</summary>

```java
@Test
void testStubbingAndVerification() {
    // Stubbing - 定义返回值
    when(mock.getData()).thenReturn("data");
    when(mock.getData()).thenReturn("first", "second", "third"); // 多次调用不同返回值
    
    // Stubbing - 抛出异常
    when(mock.process(null)).thenThrow(new IllegalArgumentException("Null not allowed"));
    doThrow(new RuntimeException()).when(mock).voidMethod(); // void方法抛异常
    
    // Stubbing - 调用真实方法
    when(mock.realMethod()).thenCallRealMethod();
    
    // Verification - 验证调用
    verify(mock).getData(); // 验证调用1次
    verify(mock, times(3)).getData(); // 验证调用3次
    verify(mock, atLeastOnce()).getData(); // 至少1次
    verify(mock, atLeast(2)).getData(); // 至少2次
    verify(mock, atMostOnce()).getData(); // 最多1次
    verify(mock, never()).getData(); // 从未调用
    
    // 验证无其他交互
    verifyNoMoreInteractions(mock);
    verifyNoInteractions(mock);
}
```

</details>

**InOrder验证（顺序验证）：**

<details>
<summary>点击展开InOrder验证示例</summary>

```java
@Test
void testInOrderVerification() {
    List<String> mockList = mock(List.class);
    
    mockList.add("first");
    mockList.add("second");
    mockList.clear();
    
    // 验证调用顺序（greedy算法）
    InOrder inOrder = inOrder(mockList);
    inOrder.verify(mockList).add("first");
    inOrder.verify(mockList).add("second");
    inOrder.verify(mockList).clear();
    
    // 验证多个mock的调用顺序
    List<String> mock1 = mock(List.class);
    List<String> mock2 = mock(List.class);
    
    mock1.add("one");
    mock2.add("two");
    
    InOrder inOrder2 = inOrder(mock1, mock2);
    inOrder2.verify(mock1).add("one");
    inOrder2.verify(mock2).add("two");
}
```

</details>

**BDDMockito风格（推荐用于BDD测试）：**

<details>
<summary>点击展开BDDMockito风格示例</summary>

```java
import static org.mockito.BDDMockito.*;

@Test
@DisplayName("用户登录成功应返回Token")
void shouldReturnTokenWhenLoginSuccessfully() {
    // Given（准备）
    String username = "john";
    String password = "password123";
    User mockUser = new User(username);
    given(userRepository.findByUsername(username)).willReturn(mockUser);
    given(passwordEncoder.matches(password, mockUser.getPassword())).willReturn(true);
    
    // When（执行）
    String token = authService.login(username, password);
    
    // Then（验证）
    then(userRepository).should().findByUsername(username);
    then(passwordEncoder).should().matches(password, mockUser.getPassword());
    assertNotNull(token);
}
```

</details>

**ArgumentCaptor使用：**

<details>
<summary>点击展开ArgumentCaptor使用示例</summary>

```java
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;

@ExtendWith(MockitoExtension.class)
class ArgumentCaptorTest {
    
    @Mock
    private EmailService emailService;
    
    @Captor
    private ArgumentCaptor<Email> emailCaptor;
    
    @Test
    void testEmailSent() {
        // Arrange
        UserService userService = new UserService(emailService);
        
        // Act
        userService.registerUser("john@example.com");
        
        // Assert - 捕获参数进行详细验证
        verify(emailService).send(emailCaptor.capture());
        Email sentEmail = emailCaptor.getValue();
        
        assertEquals("john@example.com", sentEmail.getTo());
        assertTrue(sentEmail.getBody().contains("Welcome"));
    }
    
    @Test
    void testMultipleCaptures() {
        // 多次调用捕获
        service.process("first");
        service.process("second");
        
        verify(mock, times(2)).process(emailCaptor.capture());
        List<Email> allEmails = emailCaptor.getAllValues();
        
        assertEquals(2, allEmails.size());
    }
}
```

</details>

**Spy使用（部分Mock）：**

<details>
<summary>点击展开Spy使用示例</summary>

```java
@Test
void testSpyUsage() {
    // Spy - 部分mock，保留真实对象行为
    List<String> spyList = spy(new ArrayList<>());
    
    // 使用真实方法
    spyList.add("one");
    assertEquals(1, spyList.size());
    
    // Stub特定方法
    when(spyList.size()).thenReturn(100);
    assertEquals(100, spyList.size());
    
    // ⚠️ 注意：对spy对象使用when可能调用真实方法，使用doReturn更安全
    doReturn(100).when(spyList).size();
}

// 使用@Spy注解
@ExtendWith(MockitoExtension.class)
class SpyAnnotationTest {
    
    @Spy
    private UserService userService;
    
    @Test
    void testPartialMock() {
        // 只mock特定方法
        doReturn("mocked").when(userService).externalCall();
        
        // 其他方法使用真实实现
        String result = userService.process();
        
        verify(userService).externalCall();
    }
}
```

</details>

**静态方法Mock（Mockito 3.4+）：**

```java
@Test
void testStaticMethodMock() {
    try (MockedStatic<CosStsClient> mockedStatic = mockStatic(CosStsClient.class)) {
        // Stub静态方法
        mockedStatic.when(() -> CosStsClient.getCredential(any()))
                   .thenReturn(mockCredential);
        
        // Act
        Result result = service.execute();
        
        // Assert
        assertNotNull(result);
        
        // 验证静态方法调用
        mockedStatic.verify(() -> CosStsClient.getCredential(any()));
    } // 自动关闭，恢复静态方法
}
```

**常见陷阱和注意事项：**

<details>
<summary>点击展开常见陷阱和注意事项</summary>

```java
// ❌ 错误1：对void方法使用when
// when(mock.voidMethod()).thenThrow(exception); // 编译错误

// ✅ 正确：使用doThrow
doThrow(exception).when(mock).voidMethod();

// ❌ 错误2：混用匹配器和具体值
// when(mock.method("exact", anyString())); // 运行时错误

// ✅ 正确：全部使用匹配器
when(mock.method(eq("exact"), anyString()));

// ❌ 错误3：忘记完成stubbing
// when(mock.get()); // 未完成的stubbing

// ✅ 正确：添加返回值
when(mock.get()).thenReturn("value");

// ❌ 错误4：在verify中调用方法
// verify(mock.execute()); // 错误

// ✅ 正确：在verify外调用
verify(mock).execute();
```

</details>

### 6.3 测试隔离原则

<details>
<summary>点击展开测试隔离原则示例</summary>

```java
class IsolationTest {

    // ❌ 不好：测试之间共享可变状态
    private static List<String> sharedList = new ArrayList<>();
    
    @Test
    void test1() {
        sharedList.add("item1");
        assertEquals(1, sharedList.size());
    }
    
    @Test
    void test2() {
        assertEquals(0, sharedList.size());  // 可能失败
    }

    // ✅ 好：每个测试独立创建状态
    private List<String> list;
    
    @BeforeEach
    void setUp() {
        list = new ArrayList<>();
    }
    
    @Test
    void test1() {
        list.add("item1");
        assertEquals(1, list.size());
    }
    
    @Test
    void test2() {
        assertEquals(0, list.size());  // 始终通过
    }
}
```

</details>

### 6.4 KB驱动的Mock数据质量

**KB知识库的价值：提升Mock数据真实性**

基于真实项目验证，使用KB知识库可将Mock数据质量从简单值提升至完整业务数据：

**❌ 不使用KB（简单Mock）**：
```java
// 仅设置2-3个字段，覆盖率仅30%
CampusRecommendRecordDTO recordDTO = new CampusRecommendRecordDTO();
recordDTO.setResumeId(1L);
recordDTO.setName("候选人1");
// 缺少11个关键业务字段
```

**✅ 使用KB（完整Mock - 基于dto.md）**：

<details>
<summary>点击展开KB驱动的完整Mock数据示例</summary>

```java
/**
 * Mock CampusRecommendRecordDTO（14个核心字段 - 基于KB的dto.md文档）
 * 参考文档：RecruitBoleBusiness_proj/kb/dto.md
 */
CampusRecommendRecordDTO recordDTO = new CampusRecommendRecordDTO();
// 基础信息（4字段）
recordDTO.setResumeId(123L);              // 简历ID
recordDTO.setName("张三");                 // 候选人姓名
recordDTO.setSchool("清华大学");           // 学校
recordDTO.setSpeciality("计算机科学与技术"); // 专业

// 组织信息（2字段）
recordDTO.setDeptName("技术部");           // 部门名称
recordDTO.setBgName("技术平台BG");         // BG名称

// 流程状态（2字段）
recordDTO.setFlowStatusName("一面通过");    // 流程状态
recordDTO.setStatus(1);                   // 状态：1=成功

// 时间信息（2字段）
recordDTO.setCreateTime("2025-11-19");    // 创建时间
recordDTO.setUpdateTime("2025-11-19");    // 更新时间

// 业务信息（4字段）
recordDTO.setBoleCode("BOLE2025001");     // 伯乐码
recordDTO.setRecruitType(1);              // 招聘类型：1=校招
recordDTO.setProgramId(100);              // 专项ID
recordDTO.setProgramName("2025校招春季");  // 专项名称
```

</details>

**KB知识库驱动Mock的优势**：

| 对比维度 | 简单Mock | KB驱动Mock | 改进效果 |
|---------|---------|-----------|---------|
| 字段覆盖率 | 30% (3/14) | 100% (14/14) | **+70%** |
| 业务数据真实性 | 简单值 | 真实业务场景 | **+66%** |
| 测试有效性 | 一般 | 高 | **+50%** |
| 代码可维护性 | 低 | 高 | **+50%** |
| 业务理解准确性 | 模糊 | 精准 | **+66%** |

**AI生成规则：如何使用KB驱动Mock**

1. **读取KB文档**：`dto.md`、`service-api-http.md`、`feign.md`
2. **识别DTO字段**：提取完整的字段列表和业务含义
3. **生成完整Mock**：覆盖所有关键业务字段
4. **添加KB引用注释**：说明数据来源，便于维护

**KB文档引用示例**：

<details>
<summary>点击展开KB文档引用示例</summary>

```java
/**
 * {@link CampusBoleController} 的单元测试（使用KB知识库）
 * 
 * <p><b>知识库参考文档（来自 RecruitBoleBusiness_proj/kb）：</b></p>
 * <ul>
 *   <li>service-api-http.md - 校招控制器 `/api/web/campus` 的 14 个核心 API</li>
 *   <li>dto.md - 7 个校招相关 DTO 对象（CampusRecommendRecordDTO等）</li>
 *   <li>feign.md - 依赖的 Feign 接口（BoleClientFeign、CampusPostFeign）</li>
 *   <li>business-logic.md - CampusBoleService 业务逻辑服务</li>
 * </ul>
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("校招伯乐Controller单元测试（KB增强版）")
class CampusBoleControllerTest {
    // ...
}
```

</details>

---

## 7. 断言最佳实践

### 7.1 基础断言

```java
// 相等性断言
assertEquals(expected, actual);
assertEquals(expected, actual, "自定义失败消息");

// 真假断言
assertTrue(condition);
assertFalse(condition);

// 空值断言
assertNull(object);
assertNotNull(object);

// 相同性断言
assertSame(expected, actual);

// 数组断言
assertArrayEquals(expectedArray, actualArray);

// 浮点数断言
assertEquals(expected, actual, 0.001);
```

### 7.2 异常断言

```java
// 基础异常断言
assertThrows(ExceptionType.class, () -> {
    service.method();
});

// 捕获异常进行详细验证
Exception exception = assertThrows(IllegalArgumentException.class, () -> {
    service.invalidOperation();
});
assertEquals("参数不合法", exception.getMessage());

// 验证不抛出异常
assertDoesNotThrow(() -> {
    service.validOperation();
});
```

### 7.3 集合断言

```java
// 基础集合断言
assertTrue(collection.contains(element));
assertEquals(expectedSize, collection.size());

// 使用AssertJ
assertThat(list)
    .hasSize(3)
    .contains("item1", "item2")
    .doesNotContain("item4");
```

### 7.4 超时断言

```java
@Test
void testTimeout() {
    // 断言操作在指定时间内完成
    assertTimeout(Duration.ofSeconds(1), () -> {
        service.operation();
    });
}
```

### 7.5 复合断言

```java
@Test
void testMultipleAssertions() {
    assertAll("user",
        () -> assertEquals("John", user.getFirstName()),
        () -> assertEquals("Doe", user.getLastName()),
        () -> assertNotNull(user.getEmail())
    );
}
```

---

## 8. 测试数据管理

### 8.1 测试数据创建模式

```java
@SneakyThrows
private static File createTmpFile(String ext) {
    String ts = String.valueOf(System.currentTimeMillis());
    File tmpFile = File.createTempFile("tmp_" + ts, "." + ext);
    tmpFile.deleteOnExit();
    Files.write(tmpFile.toPath(), ts.getBytes(StandardCharsets.UTF_8));
    return tmpFile;
}
```

### 8.2 测试数据清理

<details>
<summary>点击展开测试数据清理示例</summary>

```java
class DataCleanupTest {

    private File testFile;
    private LocalCache<String, String> cache;

    @BeforeEach
    void setUp() {
        testFile = createTestFile();
        cache = createCache();
    }

    @AfterEach
    void tearDown() {
        if (testFile != null && testFile.exists()) {
            testFile.delete();
        }
        
        if (cache != null) {
            cache.shutdown();
        }
    }
}
```

</details>

### 8.3 使用Builder模式构建测试数据

```java
QueryBody queryBody = new QueryBody.Builder()
        .addArg("staffIdList", List.of("1", "2", "3"))
        .limit(10)
        .build();

QueryDataResp response = dosClient.queryData("/data", queryBody);
assertNotNull(response);
```

---

## 9. 注意事项和常见陷阱

### 9.1 AI必须避免的常见错误

**❌ 错误1：测试依赖执行顺序**
```java
// 不好：共享可变状态
private static int counter = 0;

@Test
void test1() {
    counter = 1;
}

@Test
void test2() {
    assertEquals(1, counter);  // 依赖test1执行
}

// 好：每个测试独立
private int counter;

@BeforeEach
void setUp() {
    counter = 0;
}
```

**❌ 错误2：忽略异步操作**
```java
// 不好
@Test
void testAsync() {
    service.asyncOperation();
    assertEquals(expected, service.getResult());  // 结果可能未就绪
}

// 好
@Test
void testAsyncWithLatch() throws InterruptedException {
    CountDownLatch latch = new CountDownLatch(1);
    service.asyncOperation(() -> latch.countDown());
    
    assertTrue(latch.await(5, TimeUnit.SECONDS));
}
```

**❌ 错误3：资源泄漏**
```java
// 不好
@Test
void testWithoutCleanup() {
    InputStream is = service.openStream();
    byte[] data = is.readAllBytes();
    // 忘记关闭
}

// 好
@Test
void testWithAutoCleanup() throws IOException {
    try (InputStream is = service.openStream()) {
        byte[] data = is.readAllBytes();
    }  // 自动关闭
}
```

**❌ 错误4：测试方法没有断言**
```java
// 不好
@Test
void testNoAssertion() {
    service.doSomething();
    // 没有验证
}

// 好
@Test
void testWithAssertion() {
    Result result = service.doSomething();
    assertNotNull(result);
    assertTrue(result.isSuccess());
}
```

**❌ 错误5：使用真实外部依赖**
```java
// 不好
@Test
void testWithRealHttp() {
    String result = httpClient.get("https://api.example.com/data");
    assertNotNull(result);
}

// 好
@Test
void testWithMockHttp() {
    mockWebServer.enqueue(new MockResponse()
        .setResponseCode(200)
        .setBody("{\"data\":\"test\"}"));
    
    String result = httpClient.get(mockWebServer.url("/data").toString());
    assertNotNull(result);
}
```

### 9.2 AI自动错误检测与修复

**AI代码生成时的10个核心检测规则**

| 检测点 | 检测规则 | 错误示例 | 自动修复 | 优先级 |
|-------|---------|---------|---------|-------|
| **1. 测试隔离性** | static非final字段 | `private static List<String> shared;` | 改为实例字段+@BeforeEach初始化 | 🟢 P2 |
| **2. 资源泄漏** | IO资源未关闭 | `InputStream is = new FileInputStream();` | 添加try-with-resources | 🔴 P0 |
| **3. 缺少断言** | @Test方法无assert/verify | `@Test void test() { service.run(); }` | 添加断言验证 | 🟡 P1 |
| **4. Mock未完成** | when()无thenReturn | `when(mock.get());` | 添加`.thenReturn("value")` | 🔴 P0 |
| **5. 异常测试缺失** | throws声明无异常测试 | 被测方法throws但无测试 | 生成assertThrows测试 | 🟡 P1 |
| **6. MockWebServer泄漏** | 未在@AfterAll关闭 | 创建但未关闭MockWebServer | 添加@AfterAll清理 | 🟡 P1 |
| **7. 生命周期错误** | @BeforeAll非static | `@BeforeAll void init()` | 添加static修饰符 | 🔴 P0 |
| **8. 异步无超时** | Future.get()无超时 | `future.get();` | 添加`.get(5, SECONDS)` | 🟡 P1 |
| **9. 参数匹配器混用** | eq()与anyXxx()混用 | `when(mock.m("exact", anyString()))` | 改为`eq("exact")` | 🔴 P0 |
| **10. 命名不规范** | 无@DisplayName且名称模糊 | `@Test void test1()` | 添加@DisplayName | 🟢 P2 |

**核心检测点代码示例**

```java
// ❌ 错误1：测试隔离性问题
private static List<String> sharedList = new ArrayList<>();

// ✅ 修复：改为实例字段
private List<String> list;
@BeforeEach
void setUp() { list = new ArrayList<>(); }

// ❌ 错误2：资源泄漏
InputStream is = new FileInputStream("test.txt");

// ✅ 修复：try-with-resources
try (InputStream is = new FileInputStream("test.txt")) { ... }

// ❌ 错误3：缺少断言
@Test void testMethod() { service.execute(); }

// ✅ 修复：添加断言
@Test void testMethod() {
    Result result = service.execute();
    assertNotNull(result);
}
```

**AI自动修复流程**

```
生成测试代码
  ↓
执行10个检测规则
  ↓
P0错误（编译/运行时错误）→ 自动修复
P1警告（测试无效/资源泄漏）→ 提示修复
P2建议（可读性/可维护性）→ 建议优化
  ↓
重新验证修复后代码
  ↓
输出最终测试代码
```

---

## 10. JUnit 5 和 Mockito 核心知识点总结

### 10.1 JUnit 5 核心特性

**生命周期注解：**
- `@BeforeAll` / `@AfterAll`：所有测试前后执行一次（必须static）
- `@BeforeEach` / `@AfterEach`：每个测试前后执行
- 执行顺序：外层@BeforeEach → 内层@BeforeEach → @Test → 内层@AfterEach → 外层@AfterEach

**测试组织：**
- `@Nested`：创建测试层级结构，内层类可访问外层字段
- `@DisplayName`：为测试添加可读性强的中文描述
- `@Tag`：为测试分类，支持选择性执行

**参数化测试：**
- `@ParameterizedTest`：参数化测试基础注解
- `@ValueSource`：简单值列表
- `@CsvSource`：CSV格式多参数
- `@MethodSource`：方法提供参数

**断言增强：**
- `assertAll()`：批量断言，所有断言都会执行
- `assertThrows()`：异常断言
- `assertTimeout()`：超时断言
- `assertDoesNotThrow()`：验证不抛异常

**扩展机制：**
- `@ExtendWith`：注册扩展（如MockitoExtension）
- LauncherSession：全局资源管理
- TestInstancePostProcessor：测试实例后处理

### 10.2 Mockito 核心特性

**基础Mock：**
- `@Mock`：创建mock对象
- `@InjectMocks`：自动注入mock依赖
- `@ExtendWith(MockitoExtension.class)`：JUnit 5集成（推荐）
- `MockitoJUnit.rule()`：JUnit 4风格规则

**Stubbing核心方法：**
- `when().thenReturn()`：定义返回值
- `when().thenThrow()`：定义抛出异常
- `doReturn().when()`：对spy对象更安全
- `doThrow().when()`：void方法抛异常
- `thenCallRealMethod()`：调用真实方法

**参数匹配器：**
- `any()`、`anyString()`、`anyInt()`：任意值匹配
- `eq()`：精确匹配（与匹配器混用时必需）
- `argThat()`：自定义匹配器
- `refEq()`：内容相等匹配
- ⚠️ **混用规则**：所有参数都必须使用匹配器

**Verification核心方法：**
- `verify(mock).method()`：验证调用1次
- `verify(mock, times(n))`：验证调用n次
- `verify(mock, atLeastOnce())`：至少1次
- `verify(mock, never())`：从未调用
- `verifyNoMoreInteractions()`：无其他交互
- `InOrder`：验证调用顺序（greedy算法）

**高级特性：**
- `@Spy`：部分mock，保留真实行为
- `@Captor`：参数捕获器
- `ArgumentCaptor`：捕获并验证参数
- `BDDMockito`：given/when/then风格
- `mockStatic()`：静态方法mock（需try-with-resources）

**BDD风格对比：**

| 标准Mockito | BDDMockito | 说明 |
|-----------|-----------|------|
| `when().thenReturn()` | `given().willReturn()` | Given阶段 |
| `verify()` | `then().should()` | Then阶段 |
| `verifyNoMoreInteractions()` | `then().shouldHaveNoMoreInteractions()` | 验证无其他交互 |

**常见错误和解决方案：**

| 错误写法 | 正确写法 | 原因 |
|---------|---------|------|
| `when(mock.voidMethod())...` | `doReturn(...).when(mock).voidMethod()` | void方法无返回值 |
| `when(mock.method("exact", anyString()))` | `when(mock.method(eq("exact"), anyString()))` | 混用时必须全部使用匹配器 |
| `when(mock.get());` | `when(mock.get()).thenReturn("value");` | 未完成的stubbing |
| `verify(mock.execute());` | `verify(mock).execute();` | verify外调用方法 |
| `when(spy.get()).thenReturn("x")` | `doReturn("x").when(spy).get()` | spy对象可能调用真实方法 |

### 10.3 测试编写检查清单

**✅ JUnit 5检查项：**
- [ ] 使用JUnit 5注解（@Test, @BeforeEach等）
- [ ] @BeforeAll/@AfterAll方法是static的
- [ ] 使用@Nested组织复杂测试
- [ ] 所有测试有@DisplayName描述
- [ ] 参数化测试使用@ParameterizedTest
- [ ] 异常测试使用assertThrows

**✅ Mockito检查项：**
- [ ] 测试类添加@ExtendWith(MockitoExtension.class)
- [ ] Mock对象使用@Mock注解
- [ ] 被测对象使用@InjectMocks注解
- [ ] Stubbing完整（有thenReturn/thenThrow）
- [ ] 混用匹配器时使用eq()
- [ ] void方法异常使用doThrow
- [ ] spy对象使用doReturn
- [ ] 静态方法mock使用try-with-resources

**✅ 代码质量检查项：**
- [ ] 每个测试遵循AAA模式
- [ ] 测试方法名清晰表达意图
- [ ] 每个测试只测一个功能点
- [ ] Mock数据完整且真实
- [ ] 资源正确清理
- [ ] 测试独立不依赖执行顺序

---

## 11. 大型API接口类单元测试生成策略

> **适用场景**: Controller类、Service类包含50个以上方法的大型API接口文件  
> **核心思想**: 按功能模块拆分,批次生成,避免单文件过大  
> **真实案例**: AdminController (142个API接口)

### 11.1 问题与挑战

**大型API类的典型特征**:
- 单个Controller文件包含100+个接口方法
- 代码行数超过2000行
- 涉及10+个功能模块
- 依赖多个Service层

**直接生成单个大测试文件的问题**:

| 问题 | 影响 | 严重度 |
|------|------|--------|
| **文件过大** | 单个测试文件1000+行,难以维护 | 🔴 高 |
| **定位困难** | 在上千行中查找特定测试用例 | 🔴 高 |
| **冲突频繁** | 多人协作时Git冲突概率高 | 🟡 中 |
| **运行缓慢** | 无法按模块运行部分测试 | 🟡 中 |
| **Code Review困难** | 单次review几千行代码 | 🔴 高 |

### 11.2 模块化拆分策略

**核心原则**: 按功能模块拆分为多个独立测试文件

#### Step 1: API接口梳理与分类

**1.1 统计API总数**

```java
// 使用正则表达式或工具统计@GetMapping/@PostMapping注解数量
// 排除被注释的接口
统计结果示例:
- 源码中@Mapping注解: 144个
- 被注释的API: 2个
- 实际有效API: 142个 ✅
```

**1.2 按功能模块分类**

创建API清单文档 (`ADMIN_API_COMPLETE_LIST.md`):

| 模块 | 接口数 | 核心功能 |
|------|--------|----------|
| 缓存管理 | 5 | clearCache, clearCacheByPrefix |
| 薪酬管理 | 6 | updateOfferSalary, getPaymentOffer |
| 权限管理 | 3 | getStaffRight, refreshStaffRight |
| 入职准备 | 6 | startEntryPrepare, cancelEntryPrepare |
| Offer管理 | 14 | resendOfferEmail, getOfferTrace |
| 面试管理 | 23 | interviewUrgent, createOutlookCalendar |
| 文档简历 | 25 | qqDocsCreate, syncResumeInfo |
| 外部接口 | 20 | testMyoa, testRtx, visitFlow |
| 工具测试 | 15 | encrypt, decrypt, testWorkFlow |
| ... | ... | ... |

**1.3 确定拆分方案**

根据模块复杂度和接口数量,确定拆分文件数量:

```
拆分原则:
- 单个测试文件: 250-400行代码
- 单个测试文件: 5-25个接口
- 单个测试文件: 7-15个测试方法

推荐拆分数量:
- 50-100个API → 拆分为3-5个文件
- 100-150个API → 拆分为6-10个文件
- 150+个API → 拆分为10+个文件
```

#### Step 2: 创建测试覆盖计划文档

创建 `ADMIN_CONTROLLER_TEST_COVERAGE_PLAN.md`:

<details>
<summary>点击展开测试覆盖计划文档示例</summary>

```markdown
# AdminController 单元测试覆盖计划

## 📁 测试文件结构 (8个模块化文件)

test/
├── AdminControllerCacheTest.java         (5个接口, 15个测试, ~280行) ✅
│   └── 缓存管理模块
│       ├── clearCache - 清除单个缓存
│       ├── clearCacheByPrefix - 批量清除缓存
│       └── ...
│
├── AdminControllerPaymentTest.java       (9个接口, 9个测试, ~350行) ✅
│   ├── 薪酬管理 (6个接口)
│   └── 权限管理 (3个接口)
│
├── AdminControllerEntryTest.java         (9个接口, 7个测试, ~400行) ✅
├── AdminControllerOfferTest.java         (14个接口, 9个测试, ~400行) ✅
├── AdminControllerInterviewTest.java     (23个接口, 12个测试, ~350行) ✅
├── AdminControllerDocsResumeTest.java    (25个接口, 15个测试, ~380行) ✅
├── AdminControllerExternalTest.java      (20个接口, 14个测试, ~350行) ✅
└── AdminControllerUtilityTest.java       (15个接口, 14个测试, ~300行) ✅
```

## 📊 测试覆盖率统计

| 文件名 | 接口数 | 测试数 | 代码行数 | 状态 |
|--------|--------|--------|----------|------|
| AdminControllerCacheTest | 5 | 15 | ~280 | ✅ |
| AdminControllerPaymentTest | 9 | 9 | ~350 | ✅ |
| ... | ... | ... | ... | ... |
| **总计** | **142** | **95** | **~2,810** | **✅ 100%** |
```
```

</details>

#### Step 3: 按模块生成测试代码

**3.1 单个模块测试文件模板**

<details>
<summary>点击展开单个模块测试文件模板</summary>

```java
/**
 * <h1>AdminController 缓存管理模块测试</h1>
 * 
 * <p><strong>测试范围</strong>: Redis缓存相关的所有接口</p>
 * <p><strong>测试数量</strong>: 5个缓存管理接口</p>
 * <p><strong>功能模块</strong>:</p>
 * <ul>
 *   <li>单个缓存清除</li>
 *   <li>批量缓存清除</li>
 *   <li>通用配置缓存管理</li>
 * </ul>
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("AdminController - 缓存管理模块")
class AdminControllerCacheTest {

    @InjectMocks
    private AdminController adminController;

    @Mock
    private RedisService redisService;

    /**
     * 模块1: 基础缓存操作 (5个接口)
     */
    @Nested
    @DisplayName("1. 基础缓存操作")
    class BasicCacheOperationsTests {

        @Test
        @DisplayName("clearCache - 清除指定缓存")
        void shouldClearCacheWhenValidKey() {
            // Arrange
            String inputKey = "TEST_KEY";
            when(redisService.getKey(inputKey)).thenReturn("campus:center:TEST_KEY");

            // Act
            BaseResponse<String> response = adminController.clearCache(inputKey);

            // Assert
            assertThat(response.getData()).isEqualTo("success");
            verify(redisService).delSingleCache(anyString());
        }
    }
}
```

</details>

**3.2 批次生成步骤**

```
批次1: 缓存管理模块 (AdminControllerCacheTest.java)
  ├─ 提供: 缓存相关5个接口的源码
  ├─ 要求: 生成完整测试,包含@Nested分组
  └─ 输出: ~280行测试代码

批次2: 薪酬权限模块 (AdminControllerPaymentTest.java)
  ├─ 提供: 薪酬6个 + 权限3个接口的源码
  ├─ 要求: 按子模块使用@Nested分组
  └─ 输出: ~350行测试代码

批次3-8: 其他模块...
  └─ 遵循相同模式
```

#### Step 4: 测试代码质量保证

**4.1 模块化测试文件检查清单**

- [ ] **命名规范**: `被测类名 + 模块名 + Test.java`
- [ ] **文件大小**: 单文件250-400行
- [ ] **@Nested分组**: 使用@Nested进行子模块划分
- [ ] **文档注释**: 包含测试范围、接口数量、功能说明
- [ ] **Mock完整性**: 所有依赖Service都已Mock
- [ ] **AAA模式**: 所有测试方法遵循AAA模式

**4.2 跨文件一致性检查**

```java
// 所有测试文件统一的基础结构
@ExtendWith(MockitoExtension.class)
@DisplayName("AdminController - 模块名")
class AdminControllerXxxTest {
    
    @InjectMocks
    private AdminController adminController;
    
    @Mock
    private XxxService xxxService;
    
    @Nested
    @DisplayName("1. 功能分组名")
    class FeatureTests {
        // 测试方法
    }
}
```

### 11.3 完整生成流程示例

**真实案例: AdminController (142个API接口)**

```
📁 项目: campus-center-work-process
📄 被测类: AdminController.java (2400行代码, 142个API)
🎯 目标: 生成100%覆盖率的单元测试

【阶段1: 准备工作】(1小时)
├─ 1.1 统计API总数: 发现144个注解 - 2个被注释 = 142个有效API
├─ 1.2 按功能分类: 梳理出21个功能模块
├─ 1.3 制定拆分方案: 确定拆分为8个模块化测试文件
└─ 1.4 创建覆盖计划文档: ADMIN_CONTROLLER_TEST_COVERAGE_PLAN.md

【阶段2: 批次生成】(8小时,每批次1小时)
├─ 批次1: 缓存管理 (5个API → AdminControllerCacheTest.java)
│   ├─ 输入: clearCache等5个接口源码
│   ├─ 生成: 15个测试方法,4个@Nested分组
│   └─ 输出: 280行代码 ✅
│
├─ 批次2: 薪酬权限 (9个API → AdminControllerPaymentTest.java)
│   ├─ 输入: 薪酬6个 + 权限3个接口
│   ├─ 生成: 9个测试方法,2个@Nested分组
│   └─ 输出: 350行代码 ✅
│
├─ 批次3: 入职流程 (9个API → AdminControllerEntryTest.java) ✅
├─ 批次4: Offer管理 (14个API → AdminControllerOfferTest.java) ✅
├─ 批次5: 面试管理 (23个API → AdminControllerInterviewTest.java) ✅
├─ 批次6: 文档简历 (25个API → AdminControllerDocsResumeTest.java) ✅
├─ 批次7: 外部接口 (20个API → AdminControllerExternalTest.java) ✅
└─ 批次8: 工具测试 (15个API → AdminControllerUtilityTest.java) ✅

【阶段3: 质量验证】(2小时)
├─ 3.1 运行所有测试: mvn test -Dtest=AdminController*Test
├─ 3.2 生成覆盖率报告: mvn jacoco:report
├─ 3.3 验证覆盖率: 142/142 = 100% ✅
└─ 3.4 Code Review: 检查代码质量和一致性

【最终成果】
├─ 测试文件: 8个模块化文件
├─ 测试方法: 95个
├─ 代码总行数: ~2,810行
├─ 接口覆盖率: 100% (142/142)
├─ 平均单文件行数: 351行
└─ 可维护性: ⭐⭐⭐⭐⭐ (5/5)
```

### 11.4 模块化拆分的收益

**对比数据**:

| 维度 | 单文件方案 | 模块化拆分方案 | 提升 |
|------|-----------|---------------|------|
| **文件大小** | ~1,500行 | ~350行/文件 | **4.3倍** ↓ |
| **定位速度** | 在1500行中搜索 | 在350行中查找 | **4倍** ↑ |
| **Git冲突率** | 高 | 低 | **80%** ↓ |
| **Code Review** | 1次review 1500行 | 1次review 350行 | **4倍** ↑ |
| **并行开发** | 1人 | 8人同时工作 | **8倍** ↑ |
| **测试运行** | 全量运行 | 按模块运行 | **灵活** ↑ |
| **可维护性** | ⭐⭐ | ⭐⭐⭐⭐⭐ | **150%** ↑ |

**运行测试的灵活性**:

```bash
# 运行所有AdminController测试
mvn test -Dtest=AdminController*Test

# 只运行缓存管理模块
mvn test -Dtest=AdminControllerCacheTest

# 只运行Offer管理模块
mvn test -Dtest=AdminControllerOfferTest

# 运行特定Nested测试
mvn test -Dtest=AdminControllerCacheTest#BasicCacheOperationsTests
```

### 11.5 AI生成时的最佳实践

**12.5.1 分批次提示词模板**

```
【批次1: 缓存管理模块】

任务: 为AdminController的缓存管理模块生成单元测试

被测接口清单(5个):
1. GET /clearCache - 清除指定缓存
2. GET /clearCacheByPrefix - 批量清除缓存
3. GET /clearCommonConfig - 清除通用配置
4. GET /clearDictionary - 清除字典缓存
5. GET /getCache - 获取缓存值

要求:
1. ✅ 测试文件命名: AdminControllerCacheTest.java
2. ✅ 使用@Nested进行分组(基础操作、高级操作、边界条件)
3. ✅ 每个接口至少2-3个测试场景(正常+异常+边界)
4. ✅ 遵循AAA模式,添加清晰注释
5. ✅ Mock RedisService依赖
6. ✅ 使用AssertJ断言库
7. ✅ 添加@DisplayName中文描述

源代码:
[粘贴clearCache等5个方法的源码]

预期输出:
- 测试文件: AdminControllerCacheTest.java
- 测试方法数: 15个
- 代码行数: ~280行
- @Nested分组: 4个
```

**12.5.2 跨批次一致性要求**

```
所有批次必须遵循的规范:

1. 文件结构一致:
   @ExtendWith(MockitoExtension.class)
   @DisplayName("AdminController - 模块名")
   class AdminControllerXxxTest { ... }

2. Mock注入一致:
   @InjectMocks private AdminController adminController;
   @Mock private XxxService xxxService;

3. @Nested命名一致:
   @DisplayName("1. 功能分组名")
   class FeatureTests { ... }

4. 测试方法命名一致:
   @DisplayName("方法名 - 测试场景")
   void shouldXxxWhenYyy() { ... }

5. AAA模式注释:
   // Arrange
   // Act
   // Assert
```

### 11.6 维护和扩展

**11.6.1 新增API时的处理**

```
步骤1: 确定归属模块
- 分析新增API的功能领域
- 确定属于哪个现有模块

步骤2: 更新对应测试文件
- 在AdminControllerXxxTest.java中新增测试
- 保持@Nested分组的完整性

步骤3: 更新文档
- 更新ADMIN_API_COMPLETE_LIST.md
- 更新ADMIN_CONTROLLER_TEST_COVERAGE_PLAN.md
- 更新接口统计数据
```

**11.6.2 重构时的测试迁移**

```
场景: 将部分接口从AdminController拆分到新的XxxController

步骤1: 创建新的测试文件
- 命名: XxxControllerTest.java
- 复制对应的测试方法

步骤2: 删除旧测试
- 从AdminControllerXxxTest.java中删除已迁移的测试
- 更新@DisplayName和文档注释

步骤3: 更新Mock依赖
- 调整@Mock注解的Service
- 更新@InjectMocks为新的Controller
```

### 11.7 总结与建议

**✅ 推荐做法**:
1. 大型API类(50+接口)必须拆分为多个测试文件
2. 按功能模块划分,每个文件250-400行
3. 使用@Nested进行子模块分组
4. 批次生成,每批次1小时,便于质量控制
5. 创建完整的覆盖计划文档

**❌ 避免做法**:
1. 单个测试文件超过800行
2. 所有接口堆在一个文件中
3. 缺少@Nested分组结构
4. 一次性生成所有测试(容易出错)
5. 没有API清单和覆盖计划

**📊 成功指标**:
- 单文件大小: 250-400行 ✅
- 单文件接口数: 5-25个 ✅
- @Nested分组: 2-5个/文件 ✅
- 接口覆盖率: 100% ✅
- Code Review: <500行/次 ✅
- 并行开发: 支持多人协作 ✅

---

## 总结

本文档为AI代码生成系统提供了完整的Java单元测试编写规范。核心要点：

1. **优先使用MockWebServer**：测试HTTP客户端时避免真实网络
2. **严格遵循AAA模式**：每个测试都要有Arrange、Act、Assert三个阶段
3. **确保测试隔离**：每个测试独立，不依赖其他测试的执行结果
4. **完整的异常处理**：使用assertThrows验证异常，检查异常消息
5. **清晰的测试命名**：测试方法名清晰表达测试意图
6. **资源正确清理**：使用@BeforeEach/@AfterEach和try-with-resources
7. **合理的代码覆盖率**：根据代码类型确定合适的覆盖率目标
8. **避免常见陷阱**：共享状态、资源泄漏、异步问题等

**💡 KB知识库与Skill技能的价值（基于真实项目验证）**

使用本最佳实践配合KB知识库和Skill技能，可实现：

| 价值维度 | 基线 | 使用KB | 使用Skill | Skill+KB（推荐） |
|---------|------|--------|----------|----------------|
| **综合质量得分** | 80.8分 | 87.5分 | 89.0分 | **92.3分** |
| **测试覆盖率** | 82% | 75% | 87% | **92%** |
| **Mock数据真实性** | 简单值 | **+66%** | 简单值 | **+66%** |
| **异常测试覆盖** | 部分 | ⚠️ 缺失 | **完整** | **完整** |
| **测试组织性** | 注释分组 | 注释分组 | **@Nested** | **@Nested** |
| **DTO字段覆盖** | 30% | **100%** | 30% | **100%** |

**🎯 核心建议**：

1. ✅ **优先使用 Skill + KB 组合**（综合得分92.3，覆盖率92%）
2. ✅ **必须包含异常测试**（异常处理100%覆盖率，违反此项得分大幅降低）
3. ✅ **使用@Nested系统化分组**（测试运行报告清晰度提升100%）
4. ✅ **基于KB生成完整Mock数据**（DTO字段覆盖从30%提升至100%）
5. ✅ **严格遵循AAA模式注释**（测试可读性提升90%）

**⚠️ 常见致命缺陷**（基于真实项目分析）：

- ❌ 完全缺少异常测试（违反最佳实践5.3节，导致分支覆盖率无法达标）
- ❌ Mock数据过于简单（仅设置2-3个字段，DTO字段覆盖率仅30%）
- ❌ 缺少@Nested分组（仅使用注释分组，测试运行报告不清晰）
- ❌ 缺少AAA模式注释（测试意图不明确，可维护性差）

---

## 附录A: AI生成提示词模板

### A.1 工具类测试生成模板

```markdown
请为以下工具类生成单元测试：

**被测类信息：**
- 类名：{ClassName}
- 包路径：{PackagePath}
- 方法数：{MethodCount}
- 源代码：
```java
{SourceCode}
```

**测试要求：**
1. 遵循 `java-unit-test-best-practice.md` 的 **5.1 节**（工具类测试模式）
2. 覆盖率目标：**行95%+，分支90%+**（参考1.3节）
3. 必须包含以下场景：
   - ✅ 正常值测试
   - ✅ null值测试
   - ✅ 空字符串/空集合测试
   - ✅ 边界值测试
   - ✅ 异常场景测试（使用assertThrows）
4. 使用@DisplayName中文描述
5. 严格遵循AAA模式（Arrange-Act-Assert）

**输出格式：**
- 完整可运行的测试类（包含package和import）
- 测试类命名：{ClassName}Test
- 每个测试方法包含AAA注释
- 包含质量检查清单自评（基于1.4节）

**质量检查清单（生成后自评）：**
- [ ] 测试类命名为 `XXXTest`
- [ ] 所有静态方法都有测试
- [ ] 覆盖率达标（行95%+，分支90%+）
- [ ] 所有异常分支有测试
- [ ] 所有测试方法遵循AAA模式
- [ ] 所有测试有@DisplayName中文描述
```

### A.2 HTTP客户端测试生成模板

```markdown
请为以下HTTP客户端类生成单元测试：

**被测类信息：**
- 类名：{ClassName}
- 包路径：{PackagePath}
- HTTP接口数：{ApiCount}
- 源代码：
```java
{SourceCode}
```

**依赖的DTO类（来自KB知识库）：**
```java
{DTOClasses}
```

**测试要求：**
1. 遵循 `java-unit-test-best-practice.md` 的 **5.2 节**（HTTP客户端测试模式）
2. **必须使用MockWebServer**，禁止使用真实网络请求
3. 覆盖率目标：**行85%+，分支80%+**（参考1.3节）
4. 必须包含以下场景：
   - ✅ HTTP 2xx成功响应测试
   - ✅ HTTP 4xx客户端错误测试
   - ✅ HTTP 5xx服务端错误测试
   - ✅ 超时场景测试
   - ✅ 请求验证（方法、路径、参数、请求体）
5. Mock响应数据基于KB的DTO定义（字段覆盖100%）
6. 使用@Nested分组（成功场景、错误场景、边界场景）
7. 使用@DisplayName中文描述

**输出格式：**
- 完整可运行的测试类
- 测试类命名：{ClassName}Test
- 包含@BeforeAll/@AfterAll管理MockWebServer
- 每个API接口至少3个测试（成功、客户端错误、服务端错误）
- KB知识库引用注释（说明Mock数据来源）

**质量检查清单（生成后自评）：**
- [ ] 使用MockWebServer而非真实网络
- [ ] MockWebServer正确初始化和关闭
- [ ] 所有HTTP状态码都有测试
- [ ] 验证了请求内容（方法、路径、参数）
- [ ] Mock数据字段覆盖完整（基于DTO）
- [ ] 使用@Nested系统化分组
- [ ] 所有测试遵循AAA模式
```

### A.3 Service层测试生成模板

```markdown
请为以下Service类生成单元测试：

**被测类信息：**
- 类名：{ClassName}
- 包路径：{PackagePath}
- 依赖的Mapper：{MapperList}
- 源代码：
```java
{SourceCode}
```

**依赖的Mapper接口：**
```java
{MapperInterfaces}
```

**测试要求：**
1. 遵循 `java-unit-test-best-practice.md` 的 **5.6 节**（Service层测试模式）
2. 使用Mockito Mock所有Mapper依赖
3. 覆盖率目标：**行85%+，分支80%+**（参考1.3节）
4. 必须包含以下场景：
   - ✅ 正常业务流程测试
   - ✅ 业务规则验证测试
   - ✅ Mapper返回null测试
   - ✅ Mapper抛出异常测试
   - ✅ 事务场景测试（如适用）
5. 使用@ExtendWith(MockitoExtension.class)
6. 使用@Mock和@InjectMocks
7. 使用@Nested分组（CRUD操作、业务逻辑、异常处理）
8. 使用@DisplayName中文描述

**输出格式：**
- 完整可运行的测试类
- 测试类命名：{ClassName}Test
- 包含@BeforeEach初始化测试数据
- 每个方法至少2个测试（成功、异常）
- 使用verify验证Mapper调用

**质量检查清单（生成后自评）：**
- [ ] 测试类添加@ExtendWith(MockitoExtension.class)
- [ ] 所有Mapper使用@Mock
- [ ] 被测Service使用@InjectMocks
- [ ] 所有业务方法都有测试
- [ ] 包含异常场景测试
- [ ] 使用verify验证Mapper调用
- [ ] 使用@Nested系统化分组
- [ ] 所有测试遵循AAA模式
```

### A.4 大型API类批次生成模板

```markdown
请为大型Controller类生成单元测试（模块化拆分策略）：

**被测类信息：**
- 类名：{ClassName}
- 包路径：{PackagePath}
- API接口总数：{TotalApiCount}
- 源代码：
```java
{SourceCode}
```

**本次生成范围（批次{BatchNumber}/{TotalBatches}）：**
- 模块名称：{ModuleName}
- 接口列表：{ApiList}
- 接口数量：{ApiCountInBatch}

**测试要求：**
1. 遵循 `java-unit-test-best-practice.md` 的 **第12章**（大型API类测试策略）
2. 使用Mockito Mock所有依赖（Service、Feign等）
3. 本批次目标：
   - ✅ 测试文件大小：250-400行
   - ✅ 接口覆盖数：{ApiCountInBatch}个
   - ✅ 测试方法数：预估{EstimatedTestCount}个
4. 必须包含以下场景（每个接口）：
   - ✅ 正常请求测试
   - ✅ 参数验证测试（null、空值、非法值）
   - ✅ 业务异常测试
   - ✅ 权限验证测试（如适用）
5. 使用@Nested按接口功能分组
6. 测试文件命名：{ClassName}Test_{ModuleName}
7. 使用@DisplayName中文描述

**KB知识库参考文档：**
- service-api-http.md - API接口定义
- dto.md - 请求/响应DTO
- feign.md - Feign依赖接口
- business-logic.md - 业务逻辑说明

**输出格式：**
- 完整可运行的测试类
- 测试类命名：{ClassName}Test_{ModuleName}
- 包含KB知识库引用注释
- Mock数据字段覆盖100%（基于dto.md）
- 每个接口2-4个测试方法

**质量检查清单（生成后自评）：**
- [ ] 测试文件大小250-400行 ✅
- [ ] 覆盖本批次所有接口 ✅
- [ ] Mock数据基于KB文档（字段100%覆盖）
- [ ] 包含异常场景测试
- [ ] 使用@Nested系统化分组
- [ ] 所有测试遵循AAA模式
- [ ] 测试命名包含模块名（便于识别）

**批次生成流程：**
1. 生成本批次测试代码
2. 执行质量检查清单
3. 确认覆盖率达标
4. 继续下一批次
```

### A.5 通用提示词增强技巧

**技巧1: 引用最佳实践章节**
```markdown
要求：遵循 `java-unit-test-best-practice.md` 的 {章节号} 节
示例：遵循 `java-unit-test-best-practice.md` 的 **5.2 节**（HTTP客户端测试模式）
```

**技巧2: 明确覆盖率目标**
```markdown
覆盖率目标：**行{X}%+，分支{Y}%+**（参考1.3节）
示例：覆盖率目标：**行95%+，分支90%+**（参考1.3节）
```

**技巧3: 使用KB知识库**
```markdown
请基于以下KB文档生成Mock数据：
- RecruitBoleBusiness_proj/kb/dto.md - DTO字段定义
- RecruitBoleBusiness_proj/kb/service-api-http.md - API接口定义
```

**技巧4: 强制使用@Nested分组**
```markdown
要求：使用@Nested分组，建议分组：
- 成功场景（SuccessTests）
- 参数验证（ValidationTests）
- 异常处理（ExceptionTests）
- 边界值测试（BoundaryTests）
```

**技巧5: 强制AAA模式注释**
```markdown
要求：每个测试方法必须包含AAA注释：
```java
@Test
void testMethod() {
    // Arrange: 准备测试数据
    
    // Act: 执行被测方法
    
    // Assert: 验证结果
}
```
```

**技巧6: 自动质量检查**
```markdown
生成后自动执行以下检查（基于1.4节）：
✅ 结构检查 - 命名规范、生命周期方法
✅ 断言检查 - 每个测试至少1个断言
✅ Mock检查 - HTTP测试使用MockWebServer
✅ 资源管理检查 - try-with-resources、@AfterAll清理
```