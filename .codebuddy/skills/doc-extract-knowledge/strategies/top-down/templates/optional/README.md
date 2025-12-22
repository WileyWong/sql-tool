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

## 使用方式

这些模板是可选的，根据项目需要选择使用：

```
用户: 为项目生成数据库结构文档
AI: [使用 optional/database-structure.md 模板生成]
```

## 与核心模板的关系

- **核心模板**: 19个标准分类文档 + 1个索引模板，必须生成
- **扩展模板**: 可选文档，按需生成到 `extra/` 目录

## 推荐组合

| 场景 | 推荐扩展文档 |
|------|--------------|
| 新人入职 | business-flows, directory-structure |
| API 对接 | api-contracts, security-auth |
| 运维部署 | environment-config, database-structure |
| 架构评审 | business-flows, third-party-components |
