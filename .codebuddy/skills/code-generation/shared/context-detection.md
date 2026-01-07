# 技术上下文检测规则

## 检测优先级

```
优先级1: 用户明确指定 > 优先级2: 知识库 > 优先级3: 示例代码 > 优先级4: 项目配置 > 优先级5: 默认值
```

## 优先级1: 用户明确指定

从用户输入中识别技术栈描述：

```yaml
识别模式:
  - "使用 Spring Boot 3.2"
  - "采用 DDD 架构"
  - "参考 xxx 模块的实现"
  - "Vue 3 + TypeScript"
  - "Go + Gin + GORM"
```

## 优先级2: 知识库检测

### 项目记忆文件

```yaml
检测路径:
  - .spec-code/memory/context.md      # 技术栈、版本、架构
  - .spec-code/memory/guidelines.md   # 编码规范、命名约定
  - .spec-code/memory/constitution.md # 核心原则、约束

提取内容:
  - 技术栈配置
  - 框架版本
  - 架构模式
  - 编码规范
```

### 项目技术文档

```yaml
检测路径:
  - docs/tech-spec.md
  - docs/architecture.md
  - ARCHITECTURE.md
  - .editorconfig
  - .eslintrc / .prettierrc
```

## 优先级3: 示例代码分析

### 用户指定示例

```yaml
识别模式:
  - "参考 UserController.java 的风格"
  - "按照 xxx 模块的实现方式"
  - "类似于 existing-service 的写法"
```

### 自动发现示例

```yaml
发现规则:
  - 同目录下已有的同类型文件
  - 同模块的 Controller/Service/Mapper
  - 最近修改的相关文件
```

### 特征提取

```yaml
提取内容:
  命名风格:
    - 类名前缀/后缀
    - 方法命名模式
    - 变量命名风格
  
  注释风格:
    - JavaDoc / GoDoc / TSDoc
    - 单行注释 / 块注释
    - 注释语言（中文/英文）
  
  分层结构:
    - MVC / DDD / Clean Architecture
    - 目录组织方式
  
  异常处理:
    - 全局异常处理器
    - 自定义异常类
    - 错误码体系
  
  日志风格:
    - 日志框架
    - 日志级别使用
    - 日志格式
  
  依赖注入:
    - 构造器注入 / 字段注入
    - @Autowired / @Inject
```

## 优先级4: 项目配置检测

### Java 项目

```yaml
pom.xml:
  - java.version → Java 版本
  - spring-boot.version → Spring Boot 版本
  - mybatis-plus.version → MyBatis-Plus 版本

build.gradle:
  - sourceCompatibility → Java 版本
  - springBootVersion → Spring Boot 版本

目录结构:
  - src/main/java/com/xxx/controller → MVC 架构
  - src/main/java/com/xxx/domain → DDD 架构
```

### Go 项目

```yaml
go.mod:
  - go 1.21 → Go 版本
  - github.com/gin-gonic/gin → Gin 框架
  - gorm.io/gorm → GORM ORM

目录结构:
  - cmd/ → 标准布局
  - internal/handler → HTTP 处理器
  - internal/service → 业务逻辑
```

### 前端项目

```yaml
package.json:
  - vue → Vue 版本
  - react → React 版本
  - typescript → TypeScript 版本

vite.config.ts / vue.config.js:
  - 构建工具配置

tsconfig.json:
  - TypeScript 配置
```

## 优先级5: 默认值

```yaml
Java:
  version: 17
  framework: Spring Boot 3.2
  orm: MyBatis-Plus 3.5
  architecture: MVC

Go:
  version: 1.21
  framework: Gin
  orm: GORM
  architecture: Clean Architecture

TypeScript:
  version: 5.0
  framework: Vue 3
  ui: TDesign
  architecture: Composition API

MySQL:
  version: 8.0
  charset: utf8mb4
  engine: InnoDB
```

## 检测流程

```
1. 解析用户输入，提取明确指定的技术栈
2. 检查项目记忆文件（.spec-code/memory/）
3. 分析用户指定或自动发现的示例代码
4. 解析项目配置文件
5. 合并所有来源，高优先级覆盖低优先级
6. 缺失项使用默认值填充
```

## 输出格式

```yaml
技术上下文:
  语言: Java 17
  框架: Spring Boot 3.2.5
  ORM: MyBatis-Plus 3.5.5
  架构: MVC
  
  来源:
    - [用户指定] 框架版本
    - [知识库] 架构模式
    - [项目配置] Java 版本
    - [默认值] ORM 版本
  
  编码规范:
    命名: 大驼峰类名，小驼峰方法名
    注释: JavaDoc 中文
    日志: SLF4J + Logback
    异常: 全局异常处理器
```
