---
name: code-review
description: 多语言代码审查，支持 Java/Go/Python/MySQL/Vue/小程序。检查编码规范、架构设计、安全防护、性能优化。用于 PR Review、代码提交审查、上线前检查。
---

# 综合代码审查

对代码进行全面质量审查，覆盖编码规范、架构设计、安全防护、性能优化和可维护性。

> ⚠️ **项目规范**: 遵循 [通用规范](mdc:.codebuddy/spec/global/standards/common/index.md)
> 📁 **输出路径**: `workspace/{变更ID}/cr/`

## 技能概览

| 模块 | 适用场景 | 详细指南 |
|------|---------|----------|
| **Java 审查** | Spring Boot 微服务、Java 后端 | [java/java-review.md](java/java-review.md) |
| **Go 审查** | Go 微服务、API 服务 | [go/go-review.md](go/go-review.md) |
| **Python 审查** | Django/Flask/FastAPI、Python 后端 | [python/python-review.md](python/python-review.md) |
| **MySQL 审查** | SQL 脚本、存储过程、DDL | [mysql/mysql-review.md](mysql/mysql-review.md) |
| **Vue 3 审查** | Vue 3 + TypeScript + Composition API | [vue3/vue3-review.md](vue3/vue3-review.md) |
| **Vue 2 审查** | Vue 2 + Options API | [vue2/vue2-review.md](vue2/vue2-review.md) |
| **小程序审查** | 微信小程序原生开发 | [miniprogram/miniprogram-review.md](miniprogram/miniprogram-review.md) |

> 💡 **安全扫描**: 如需专项安全漏洞扫描，请使用独立的 `code-security-scan` 技能。

## 场景判断

根据审查需求选择执行路径：

| 需求 | 执行模块 |
|------|----------|
| Java/Spring Boot 代码审查 | Java 审查模块 |
| Go/Golang 代码审查 | Go 审查模块 |
| Python/Django/Flask/FastAPI 代码审查 | Python 审查模块 |
| MySQL/SQL 脚本审查 | MySQL 审查模块 |
| Vue 3/TypeScript 代码审查 | Vue 3 审查模块 |
| Vue 2/Options API 代码审查 | Vue 2 审查模块 |
| 微信小程序代码审查 | 小程序审查模块 |
| 全栈项目审查 | 后端 + 前端 + 数据库 |
| PR Review | 根据文件类型选择对应模块 |
| 安全漏洞扫描 | 使用 `code-security-scan` 技能 |

### Vue 版本识别

| 特征 | Vue 2 | Vue 3 |
|------|-------|-------|
| API 风格 | Options API (`data`, `methods`, `computed`) | Composition API (`setup`, `ref`, `reactive`) |
| 组件定义 | `export default { }` | `<script setup>` 或 `defineComponent` |
| 响应式 | `Vue.set`, `this.$set` | `ref`, `reactive`, `toRefs` |
| 生命周期 | `beforeDestroy`, `destroyed` | `onBeforeUnmount`, `onUnmounted` |
| 依赖 | `vue@^2.x` | `vue@^3.x` |

### 小程序基础库版本识别

| 基础库版本 | 主要特性 | 识别方式 |
|-----------|----------|---------|
| **2.9.0+** | 初始渲染缓存、分包预下载 | `app.json` 中 `"preloadRule"` |
| **2.11.0+** | 自定义 tabBar、页面间通信 | `app.json` 中 `"tabBar": { "custom": true }` |
| **2.14.0+** | Skyline 渲染引擎 | `app.json` 中 `"renderer": "skyline"` |
| **2.19.0+** | 组件样式隔离增强 | `Component` 中 `styleIsolation` 选项 |
| **3.0.0+** | 新版组件模型、性能优化 | `project.config.json` 中 `"libVersion"` |

> 💡 **版本检查**: 查看 `project.config.json` 中的 `"libVersion"` 字段确定基础库版本要求。

## 审查级别

| 级别 | 时间 | 内容 | 适用场景 |
|------|------|------|----------|
| 🟢 **基础** | 15-30min | Lint + 快速清单 | 日常小改动 |
| 🟡 **标准** | 45-60min | 基础 + 架构 + 安全 | 功能开发 |
| 🔴 **专业** | 2-3h | 标准 + 测试 + 性能 | 重大版本/上线前 |

## 审查维度

> 💡 **说明**: 各技术栈有专属评分维度，详见对应审查指南。以下为各模块维度概览。

### Java/Spring Boot

| 维度 | 权重 | 检查要点 |
|------|------|---------|
| 编码规范 | 15% | 命名、格式、注释、常量 |
| 架构设计 | 20% | 服务拆分、依赖管理、接口设计 |
| 安全防护 | 30% | 输入验证、权限控制、OWASP |
| 性能优化 | 15% | 缓存、查询、异步 |
| 可维护性 | 10% | 复杂度、测试、异常 |
| Java 8+ 特性 | 10% | Optional、Stream、时间 API |

### Go

| 维度 | 权重 | 检查要点 |
|------|------|---------|
| 代码规范 | 20% | 命名、格式、注释、包组织 |
| 错误处理 | 20% | 错误检查、包装、panic |
| 并发安全 | 20% | goroutine、channel、锁 |
| 性能优化 | 15% | 内存分配、切片预分配 |
| 安全性 | 15% | 输入验证、SQL 注入 |
| 可维护性 | 10% | 接口设计、测试覆盖 |

### MySQL

| 维度 | 权重 | 检查要点 |
|------|------|---------|
| 语法规范 | 20% | 命名、格式、注释、关键字 |
| 性能优化 | 30% | 索引使用、查询优化、执行计划 |
| 安全防护 | 25% | SQL 注入、权限控制 |
| 可维护性 | 15% | 可读性、模块化、文档 |
| 数据完整性 | 10% | 约束、事务、备份 |

### Vue 3

| 维度 | 权重 | 检查要点 |
|------|------|---------|
| 组件设计 | 20% | 职责单一、大小合理 |
| 响应式系统 | 20% | ref/reactive、避免响应性丢失 |
| Composables | 15% | 封装合理、副作用清理 |
| 性能优化 | 15% | 虚拟滚动、懒加载 |
| 安全性 | 10% | XSS 防护、输入验证 |
| 可访问性 | 10% | ARIA、data-testid、键盘导航 |
| 可维护性 | 10% | 类型完整、测试覆盖 |

### Vue 2

| 维度 | 权重 | 检查要点 |
|------|------|---------|
| 组件设计 | 20% | 职责单一、大小合理 |
| Options API | 15% | 选项顺序、computed/watch |
| Mixins | 10% | 命名冲突、依赖清晰 |
| 性能优化 | 20% | key 使用、懒加载 |
| 安全性 | 10% | XSS 防护、输入验证 |
| 可访问性 | 10% | ARIA、data-testid、键盘导航 |
| 可维护性 | 15% | 代码清晰、注释完整 |

### Python

| 维度 | 权重 | 检查要点 |
|------|------|---------|
| 代码规范 | 20% | PEP 8、命名、格式、docstring |
| 类型安全 | 15% | 类型注解、mypy 检查、泛型使用 |
| 异常处理 | 15% | 异常捕获、上下文管理器、自定义异常 |
| 安全防护 | 20% | SQL 注入、命令注入、反序列化、敏感信息 |
| 性能优化 | 15% | 生成器、缓存、异步编程、数据结构 |
| 可维护性 | 15% | 测试覆盖、依赖管理、文档、复杂度 |

### 微信小程序

| 维度 | 权重 | 检查要点 |
|------|------|---------|
| 组件设计 | 20% | 职责单一、大小合理、命名规范 |
| WXML 规范 | 15% | 数据绑定、条件渲染、列表渲染 |
| 样式规范 | 10% | rpx 使用、样式隔离、选择器 |
| 性能优化 | 25% | setData 优化、分包策略、首屏 |
| 安全性 | 20% | 敏感数据、网络请求、用户隐私 |
| 可维护性 | 10% | 代码结构、注释、配置管理 |

## 评分标准

| 等级 | 分数范围 | 说明 |
|------|---------|------|
| **A级** | ≥85 | 优秀，可直接发布 |
| **B级** | 70-84 | 良好，少量改进后发布 |
| **C级** | 60-69 | 及格，需要改进 |
| **D级** | <60 | 不及格，需重大改进 |

## 问题优先级

| 优先级 | 符号 | 说明 | 处理时间 |
|--------|------|------|---------|
| **P0** | 🔴 | 严重问题，阻塞发布 | 立即修复 |
| **P1** | 🟠 | 高危问题，影响质量 | 本周内修复 |
| **P2** | 🟡 | 中危问题，建议修复 | 本迭代修复 |
| **P3** | 🟢 | 低危/建议，可选修复 | 下个迭代 |

## 审查流程

```
代码提交
    ↓
步骤1：确定审查范围 → 识别文件类型和模块
    ↓
步骤2：选择审查级别 → 基础/标准/专业
    ↓
步骤3：执行审查 → 按模块应用检查规则
    ↓
步骤4：生成报告 → 评分 + 问题清单 + 修复建议
    ↓
步骤5：跟踪修复 → 验证问题已解决
```

## 资源文件

| 类别 | 文件 | 说明 |
|------|------|------|
| **Java 审查** | | |
| 审查指南 | [java/java-review.md](java/java-review.md) | Java/Spring Boot 审查详细指南 |
| Spring Boot 专项 | [java/springboot-review.md](java/springboot-review.md) | Spring Boot 框架专项审查 |
| 检查清单 | [java/java-checklist.md](java/java-checklist.md) | Java 审查检查清单 |
| 审查示例 | [java/examples/](java/examples/) | Java 审查示例集 |
| **Go 审查** | | |
| 审查指南 | [go/go-review.md](go/go-review.md) | Go 语言审查详细指南 |
| 进阶专项 | [go/go-advanced-review.md](go/go-advanced-review.md) | Go 框架专项（tRPC/Gin/GORM） |
| 检查清单 | [go/go-checklist.md](go/go-checklist.md) | Go 审查检查清单 |
| 审查示例 | [go/examples/](go/examples/) | Go 审查示例集 |
| **Python 审查** | | |
| 审查指南 | [python/python-review.md](python/python-review.md) | Python 审查详细指南 |
| Django 专项 | [python/python-django.md](python/python-django.md) | Django 框架专项审查 |
| Flask 专项 | [python/python-flask.md](python/python-flask.md) | Flask 框架专项审查 |
| FastAPI 专项 | [python/python-fastapi.md](python/python-fastapi.md) | FastAPI 框架专项审查 |
| 检查清单 | [python/python-checklist.md](python/python-checklist.md) | Python 审查检查清单 |
| 审查示例 | [python/examples/](python/examples/) | Python 审查示例集 |
| **MySQL 审查** | | |
| 审查指南 | [mysql/mysql-review.md](mysql/mysql-review.md) | MySQL 脚本审查详细指南 |
| 进阶专项 | [mysql/mysql-advanced-review.md](mysql/mysql-advanced-review.md) | MySQL 高级优化专项 |
| 检查清单 | [mysql/mysql-checklist.md](mysql/mysql-checklist.md) | MySQL 审查检查清单 |
| 审查示例 | [mysql/examples/](mysql/examples/) | MySQL 审查示例集 |
| **Vue 3 审查** | | |
| 审查指南 | [vue3/vue3-review.md](vue3/vue3-review.md) | Vue 3/TypeScript 审查详细指南 |
| 进阶专项 | [vue3/vue3-advanced-review.md](vue3/vue3-advanced-review.md) | Vue 3 高级模式专项 |
| 检查清单 | [vue3/vue3-checklist.md](vue3/vue3-checklist.md) | Vue 3 审查检查清单 |
| 审查示例 | [vue3/examples/](vue3/examples/) | Vue 3 审查示例集 |
| **Vue 2 审查** | | |
| 审查指南 | [vue2/vue2-review.md](vue2/vue2-review.md) | Vue 2/Options API 审查详细指南 |
| 进阶专项 | [vue2/vue2-advanced-review.md](vue2/vue2-advanced-review.md) | Vue 2 高级模式专项 |
| 检查清单 | [vue2/vue2-checklist.md](vue2/vue2-checklist.md) | Vue 2 审查检查清单 |
| 审查示例 | [vue2/examples/](vue2/examples/) | Vue 2 审查示例集 |
| **小程序审查** | | |
| 审查指南 | [miniprogram/miniprogram-review.md](miniprogram/miniprogram-review.md) | 微信小程序审查详细指南 |
| 进阶专项 | [miniprogram/miniprogram-advanced-review.md](miniprogram/miniprogram-advanced-review.md) | 小程序高级优化专项 |
| 检查清单 | [miniprogram/miniprogram-checklist.md](miniprogram/miniprogram-checklist.md) | 小程序审查检查清单 |
| 审查示例 | [miniprogram/examples/](miniprogram/examples/) | 小程序审查示例集 |
| **通用资源** | | |
| 常见问题 | [common-issues.md](common-issues.md) | 各技术栈常见问题模式 |
| 报告模板 | [templates/report-template.md](templates/report-template.md) | 统一审查报告模板 |
| 组件检查 | [tools/check-component-size.js](tools/check-component-size.js) | Vue 组件大小检查工具 |

> 💡 **安全扫描**: 如需专项安全漏洞扫描，请使用独立的 `code-security-scan` 技能。

---

**版本**: 1.3.0  
**更新时间**: 2026-01-04  
**作者**: spec-code Team
