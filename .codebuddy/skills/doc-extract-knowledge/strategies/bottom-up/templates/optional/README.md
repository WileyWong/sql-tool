# 扩展模板 (Optional Templates)

可选的扩展文档模板，用于生成更详细的项目文档。

## 模板列表

| 模板文件 | 输出文件 | 用途 |
|----------|----------|------|
| `directory-structure.md` | `directory-structure.md` | 项目目录结构 |
| `spring-configuration.md` | `spring-configuration.md` | Spring配置详解 |
| `business-flows.md` | `business-flows.md` | 核心业务流程 |
| `api-contracts.md` | `api-contracts.md` | API契约文档 |
| `interceptors-aspects.md` | `interceptors-aspects.md` | 拦截器和切面 |
| `security-auth.md` | `security-auth.md` | 安全认证 |
| `database-structure.md` | `database-structure.md` | 数据库结构 |
| `environment-config.md` | `environment-config.md` | 环境配置 |
| `third-party-interfaces.md` | `third-party-interfaces.md` | 第三方接口 |
| `third-party-components.md` | `third-party-components.md` | 第三方组件 |
| `custom-annotations.md` | `custom-annotations.md` | 自定义注解 |

## 使用方式

这些模板是可选的，根据项目需要选择使用：

```
用户: 为项目生成数据库结构文档
AI: [使用 optional/database-structure.md 模板生成]
```

## 与核心模板的关系

- **核心模板**: 19个类型的独立文件模板 + 2个索引/架构模板，自动生成
- **扩展模板**: 可选文档，按需生成到 `extra/` 目录

## 方法签名规范

扩展模板同样遵循完整方法签名规范：

**必须包含的元素**:
| 元素 | 示例 | 必须 |
|------|------|:----:|
| 方法注解 | `@GetMapping`, `@Transactional` | ✅ |
| 访问修饰符 | `public`, `protected` | ✅ |
| 返回类型（含泛型） | `List<UserVO>` | ✅ |
| 方法名 | `getUserById` | ✅ |
| 参数列表（含注解） | `@PathVariable("id") Long id` | ✅ |
| 异常声明 | `throws BusinessException` | ✅ |

**参数说明表格格式**:
| 参数 | 类型 | 注解 | 必填 | 默认值 | 说明 |
|------|------|------|:----:|--------|------|

## 模板说明

### business-flows.md
用于记录核心业务流程，包含：
- 流程调用链图
- 详细步骤说明（含方法签名）
- 涉及组件列表
- 事务边界
- 异常处理
- 状态流转图

### api-contracts.md
用于生成 API 契约文档，包含：
- API 概览表
- 完整方法签名（含注解）
- 请求/响应格式
- 参数说明表格
- 错误码定义
- 认证说明

### interceptors-aspects.md
用于记录拦截器和切面，包含：
- 拦截器方法签名
- 切面通知方法签名
- 切点表达式
- 执行顺序

### security-auth.md
用于记录安全认证，包含：
- 安全配置类方法
- JWT 工具方法签名
- 权限注解使用示例

### third-party-interfaces.md
用于记录第三方接口，包含：
- 封装方法签名
- 参数说明
- 异常处理

### third-party-components.md
用于记录第三方组件，包含：
- 配置类 Bean 方法
- 核心操作方法签名
- 使用示例

## 推荐组合

| 场景 | 推荐扩展文档 |
|------|--------------|
| 新人入职 | business-flows, directory-structure |
| API 对接 | api-contracts, security-auth |
| 运维部署 | environment-config, database-structure |
| 架构评审 | business-flows, third-party-components |
| 安全审计 | security-auth, interceptors-aspects |
