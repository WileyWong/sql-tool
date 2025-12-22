# 其他类索引

> **覆盖范围**: 无法归类到标准19个分类的Java类  
> **文件总数**: {{OTHER_COUNT}}个  
> **代码总行数**: {{OTHER_LOC}} 行  
> **生成时间**: {{SCAN_DATE}}

---

## 一、概述

本文档收录无法匹配以下标准分类的Java类：
- Interface、Abstract、Controller、Service、Mapper
- Entity、DTO、Response、Request、Exception、Enum
- Feign、Handler、Job/Task、MQ Listener
- Utils、Common、Annotation、Constants

**常见类型**：
- 自定义基类（非抽象）
- 工厂类、建造者类
- 适配器、装饰器
- 状态机、规则引擎
- 其他项目特有组件

---

## 二、按类型分组

### 工厂类

| 类名 | 类路径 | 代码行数 | 职责 |
|------|--------|----------|------|
| {{CLASS_NAME}} | `{{PACKAGE_NAME}}.{{CLASS_NAME}}` | {{LOC}} | {{RESPONSIBILITY}} |

### 建造者类

| 类名 | 类路径 | 代码行数 | 职责 |
|------|--------|----------|------|
| {{CLASS_NAME}} | `{{PACKAGE_NAME}}.{{CLASS_NAME}}` | {{LOC}} | {{RESPONSIBILITY}} |

### 其他

| 类名 | 类路径 | 代码行数 | 职责 |
|------|--------|----------|------|
| {{CLASS_NAME}} | `{{PACKAGE_NAME}}.{{CLASS_NAME}}` | {{LOC}} | {{RESPONSIBILITY}} |

---

## 三、详细清单

### {{CLASS_NAME}} - {{DESCRIPTION}}

**类路径**: `{{PACKAGE_NAME}}.{{CLASS_NAME}}`  
**代码行数**: {{LOC}} 行（SLOC）  
**继承**: {{PARENT_CLASS}}（无则填"无"）  
**实现**: {{INTERFACES}}（无则填"无"）  
**类注解**: {{ANNOTATIONS}}

#### 依赖注入
| 依赖 | 类型 | 用途 |
|------|------|------|
| {{FIELD_NAME}} | {{FIELD_TYPE}} | {{PURPOSE}} |

#### 方法列表
| 方法签名 | 参数 | 返回值 | 功能 | 调用链 |
|---------|------|--------|------|--------|
| {{METHOD}} | {{PARAMS}} | {{RETURN}} | {{DESC}} | → {{CALL_CHAIN}} |

#### 被引用
| 引用者 | 引用方式 | 用途 |
|--------|----------|------|
| {{CALLER}} | {{REF_TYPE}} | {{PURPOSE}} |

---

*（按上述格式为每个类创建独立章节）*

---

## 四、跨模块依赖

### 本模块 → 其他模块
| 目标模块 | 依赖类 | 依赖方式 |
|----------|--------|----------|
| {{TARGET_MODULE}} | {{DEP_CLASS}} | {{DEP_TYPE}} |

### 其他模块 → 本模块
| 来源模块 | 调用类 | 调用方法 |
|----------|--------|----------|
| {{SOURCE_MODULE}} | {{CALLER_CLASS}} | {{METHODS}} |

---

## 📚 相关文档

- [接口定义索引](./interface.md)
- [抽象类索引](./abstract.md)
- [HTTP API索引](./service-api-http.md)
- [业务逻辑层索引](./business-logic.md)
- [ORM映射器索引](./orm-mapper.md)
- [DTO对象索引](./dto.md)
- [Entity对象索引](./entity.md)
- [Response对象索引](./service-response-object.md)
- [Request对象索引](./front-end-request.md)
- [异常类索引](./exception.md)
- [枚举类索引](./enum.md)
- [Feign接口索引](./feign.md)
- [Handler处理器索引](./handler.md)
- [Job-Task索引](./job-task.md)
- [MQ监听器索引](./mq-listener.md)
- [工具类索引](./utils.md)
- [Common公共类索引](./common.md)
- [自定义注解索引](./annotation.md)
- [常量类索引](./constants.md)

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| {{SCAN_DATE}} | AI自动生成 | 初始创建文档 | v1.0 |
