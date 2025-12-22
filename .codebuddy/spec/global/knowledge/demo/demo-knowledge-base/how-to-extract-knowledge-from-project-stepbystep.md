# How to：抽取代码知识库 Step by Step

> **作者**: johnsonyang  
> **日期**: 2025-11-17  
> **原文链接**: [企业微信文档](https://doc.weixin.qq.com/doc/w3_APcAbAbdAFwCNxUnLiICXScuwdo6o?scode=AJEAIQdfAAo0hXz2b9APcAbAbdAFw)

## 📋 概述

本文档详细说明了如何从现有项目代码中抽取研发知识库的完整流程，以 **RecruitBoleClient** 项目为实际案例。

**示例项目地址**: https://git.woa.com/Zhaopin/TencentCareers/RecruitBole/RecruitBoleClient_proj.git


项目目录结构如下：

```
RecruitBoleClient_proj/
│
├── bean/
├── common/
│   ├── configuration/
│   ├── entity/
│   ├── enums/
│   ├── exception/
│   ├── filter/
│   ├── service/
│   └── utils/
├── controller/
│   ├── pc/
│   ├── remote/
│   └── wechat/
├── domain/
├── entity/
├── external/
├── handler/
├── job/
├── mapper/
├── request/
├── response/
└── service/
```

## 🔧 前置条件

在开始之前，请确保已安装以下工具：

- ✅ **CodeBuddy**: AI辅助编程工具
- ✅ **spec-code工程化框架**: 项目规范和知识库管理框架

---

## 📐 分层抽取策略

根据项目代码结构，决定分为 **7个批次** 进行知识抽取，每个批次生成对应的索引文件：

| 批次 | 代码层 | 输出文件 | 说明 |
|------|--------|----------|------|
| 1 | `common` | `common.md` | 公共工具类、常量、枚举等 |
| 2 | `controller` | `controller.md` | API接口层 |
| 3 | `service` | `service-business-logic.md` | 核心业务逻辑层 |
| 4 | `domain` | `domain.md` | 业务域层 |
| 5 | `request/response/bean` | `service-bean-request-and-response.md` | 请求响应对象 |
| 6 | `mapper/entity` | `data-access-and-objects.md` | 数据访问和实体对象 |
| 7 | `job/handler/external` | `job-feign-handler.md` | 任务、处理器、外部调用 |

---

## 🚀 详细操作步骤

### Step 1: 全文件夹扫描，获取分层架构知识

**目的**: 了解项目整体结构，为后续分层抽取提供指导

**操作**:
1. 将要被抽取的代码文件夹添加到上下文
2. 将 `extract-knowledge-from-code-best-practice.md` 最佳实践文档也添加到上下文

**提示词**:
```
请读取client下的文件，并生成索引文件，保存为RecruitBoleClient_proj/kb/README.md
```

**输出文件**: [README.md](https://drive.weixin.qq.com/s?k=AJEAIQdfAAo5ayCYBnAPcAbAbdAFw)

---

### Step 2: 抽取公共层

**提示词**:
```
请读取common下所有文件，生成索引，写入到kb/common.md
```

**输出文件**: [common.md](https://drive.weixin.qq.com/s?k=AJEAIQdfAAoXrBm8gDAPcAbAbdAFw)

---

### Step 3: 抽取API接口层

**说明**: controller对外提供HTTP RESTful API服务

**提示词**:
```
controller对外提供HTTP RESTful API服务，请读取controller下所有文件，生成索引，写入到kb/controller.md
```

**输出文件**: [controller.md](https://drive.weixin.qq.com/s?k=AJEAIQdfAAoxQl3bqZAPcAbAbdAFw)

---

### Step 4: 抽取核心业务逻辑层

**说明**: service为核心业务逻辑层

**提示词**:
```
service为核心业务逻辑层，请读取service下所有文件，生成索引，写入到kb/service-business-logic.md
```

**输出文件**: [service-business-logic.md](https://drive.weixin.qq.com/s?k=AJEAIQdfAAowswgs1vAPcAbAbdAFw)

---

### Step 5: 抽取业务域层

**说明**: domain为业务域层

**提示词**:
```
domain为业务域层，请读取domain下所有文件，生成索引，写入到kb/domain.md
```

**输出文件**: [domain.md](https://drive.weixin.qq.com/s?k=AJEAIQdfAAonbWlj9GAPcAbAbdAFw)

---

### Step 6: 抽取请求响应实体封装及Bean

**说明**: request、response为前端请求封装对象和后端响应封装对象

**提示词**:
```
request、response为前端请求封装对象和后端响应封装对象，请读取各文件夹下所有文件，生成索引，写入到kb/service-bean-request-and-response.md
```

**输出文件**: [service-bean-request-and-response.md](https://drive.weixin.qq.com/s?k=AJEAIQdfAAo9KF3yHBAPcAbAbdAFw)

---

### Step 7: 抽取数据实体映射文件及实体层

**说明**: mapper为数据访问映射文件，entity为实体对象

**提示词**:
```
请读取mapper数据访问映射文件，entity实体对象下所有文件，生成索引，写入到kb/data-access-and-objects.md
```

**输出文件**: [data-access-and-objects.md](https://drive.weixin.qq.com/s?k=AJEAIQdfAAoizU3kPrAPcAbAbdAFw)

---

### Step 8: 抽取其它组件

**说明**: 
- `job`: job-task任务编排层
- `handler`: 处理器层
- `external`: feign调用外部服务层

**提示词**:
```
job为job-task任务编排层，handler为处理器层，external为feign调用外部服务层，请读取各文件夹内容，生成kb/job-feign-handler.md
```

**输出文件**: [job-feign-handler.md](https://drive.weixin.qq.com/s?k=AJEAIQdfAAo71yLVuIAPcAbAbdAFw)

---

### Step 9: 更新README.md

**目的**: 整合所有知识文件，生成统一的索引导航

**提示词**:
```
读取kb文件夹下所有内容，基于README.md现有内容，更新README.md
```

---

### Step 10: 更新交叉引用链接

**目的**: 建立文档之间的链接关系，方便导航

**提示词**:
```
更新common.md文件的交叉引用链接
```

💡 **提示**: 依次对其它文件执行相同操作

---

### Step 11: 添加维护日志

**目的**: 记录文档的版本变更历史

**提示词**:
```
按照下列格式，为kb文件夹内各md文件添加维护日志：

## 附录：维护日志

| 日期 | 版本 | 修改人 | 修改内容 |
|-----|------|--------|---------|
| 2025-11-17 | v1.0 | johnsonyang | 初始创建，扫描15个接口类，生成完整索引 |
| 2025-11-17 | v1.1 | johnsonyang | 添加文档交叉引用，建立导航体系 |
```

---

### Step 12: 检查重复内容

**目的**: 确保文档无冗余，提高知识库质量

**提示词**:
```
检查kb文件夹下所有文件是否存在重复内容，如有请移除重复内容
```

---

### Step 13: 验证文档完整性

**目的**: 最终质量检查，确保所有文档完整可用

**提示词**:
```
请验证kb文件夹下所有文件的完整性
```

---

## 📊 总结

本流程采用 **自下而上、分层抽取** 的方式，确保：

✅ **系统性**: 按照架构分层逐步抽取  
✅ **完整性**: 覆盖所有代码层次  
✅ **可维护性**: 建立交叉引用和版本管理  
✅ **质量保证**: 通过去重和验证确保文档质量

通过以上13个步骤，即可从现有项目代码中抽取出完整、结构化的研发知识库。

---

## 🔗 相关资源

- [extract-knowledge-from-code-best-practice.md](../best-practices/extract-knowledge-from-code-best-practice.md) - 知识抽取最佳实践
- [kb-recruit-bole-service.7z](./kb-recruit-bole-service.7z) - 完整示例（第一版，人工生成）
- [kb1-recruit-bole-service.7z](./kb1-recruit-bole-service.7z) - 完整示例（第二版，自动生成）
- [kb2-recruit-bole-service.7z](./kb2-recruit-bole-service.7z) - 完整示例（第三版，技能生成）
