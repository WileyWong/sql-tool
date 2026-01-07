# 示例代码分析指南

## 概述

通过分析项目中已有的示例代码，提取代码风格和实现模式，确保新生成的代码与项目保持一致。

## 示例来源

### 1. 用户指定示例

```yaml
识别模式:
  - "参考 UserController.java"
  - "按照 OrderService 的风格"
  - "类似于 user 模块的实现"
  - "仿照现有的 xxx"
```

### 2. 自动发现示例

```yaml
发现策略:
  同类型文件:
    - 生成 XxxController → 查找 *Controller.java
    - 生成 XxxService → 查找 *Service.java
    - 生成 xxx.vue → 查找 *.vue
  
  同模块文件:
    - 目标路径: src/main/java/com/example/user/
    - 查找范围: 同目录及子目录
  
  最近修改:
    - 优先分析最近修改的相关文件
```

## 分析维度

### 1. 命名风格

```yaml
类名:
  - 前缀: Base, Abstract, I (接口)
  - 后缀: Controller, Service, ServiceImpl, Mapper, DTO, VO
  - 示例: UserController, IUserService, UserServiceImpl

方法名:
  - CRUD: create/add, get/find/query, update/modify, delete/remove
  - 布尔: is, has, can, should
  - 示例: createUser, findById, isValid

变量名:
  - 集合: users, orderList, userMap
  - 布尔: isActive, hasPermission
  - 示例: currentUser, totalCount
```

### 2. 注释风格

```yaml
类注释:
  格式: JavaDoc / 单行 / 无
  语言: 中文 / 英文
  内容: 功能描述 / 作者 / 日期

方法注释:
  格式: JavaDoc / 单行 / 无
  包含: @param, @return, @throws

行内注释:
  风格: // 注释 / /* 注释 */
  语言: 中文 / 英文
```

### 3. 代码结构

```yaml
分层:
  - Controller → Service → Mapper (MVC)
  - Handler → UseCase → Repository (Clean)
  - Controller → Domain → Infrastructure (DDD)

依赖注入:
  - 构造器注入 (推荐)
  - @Autowired 字段注入
  - Setter 注入

方法顺序:
  - 公开方法在前，私有方法在后
  - CRUD 顺序: Create, Read, Update, Delete
```

### 4. 异常处理

```yaml
异常类型:
  - 自定义业务异常: BusinessException
  - 资源不存在: ResourceNotFoundException
  - 参数校验: ValidationException

处理方式:
  - 全局异常处理器: @RestControllerAdvice
  - 方法内 try-catch
  - 向上抛出

错误码:
  - 枚举定义: ErrorCode.USER_NOT_FOUND
  - 字符串常量: "USER_NOT_FOUND"
```

### 5. 日志记录

```yaml
框架:
  - SLF4J + Logback (Java)
  - zap / logrus (Go)
  - console / winston (Node)

声明方式:
  - @Slf4j (Lombok)
  - private static final Logger log = ...

记录内容:
  - 方法入口: 参数
  - 方法出口: 结果
  - 异常: 错误信息 + 堆栈
```

### 6. 参数校验

```yaml
方式:
  - JSR-380 注解: @NotNull, @Size, @Pattern
  - 手动校验: if (xxx == null)
  - 工具类: Preconditions.checkNotNull

位置:
  - Controller 层: @Valid
  - Service 层: 业务规则校验
```

## 分析流程

```
1. 确定示例文件
   - 用户指定 → 直接使用
   - 自动发现 → 按策略查找

2. 读取示例代码
   - 读取完整文件内容
   - 提取关键代码片段

3. 提取特征
   - 命名模式
   - 注释格式
   - 代码结构
   - 异常处理
   - 日志风格

4. 生成风格配置
   - 整理提取的特征
   - 形成风格指南

5. 应用到代码生成
   - 按风格生成代码
   - 保持一致性
```

## 输出格式

```yaml
示例分析结果:
  来源: UserController.java, UserService.java
  
  命名风格:
    类名后缀: Controller, Service, ServiceImpl
    方法前缀: create, find, update, delete
    
  注释风格:
    格式: JavaDoc
    语言: 中文
    包含: @param, @return
    
  代码结构:
    分层: Controller → Service → Mapper
    注入: 构造器注入
    
  异常处理:
    异常类: BusinessException
    处理: 全局异常处理器
    
  日志:
    框架: @Slf4j
    级别: INFO 关键节点, ERROR 异常
```

## 检查清单

- [ ] 识别示例文件来源
- [ ] 分析命名风格
- [ ] 分析注释风格
- [ ] 分析代码结构
- [ ] 分析异常处理
- [ ] 分析日志风格
- [ ] 应用到代码生成
