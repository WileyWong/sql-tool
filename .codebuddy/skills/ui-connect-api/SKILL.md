---
name: ui-connect-api
description: 实现前端与后端API数据交互代码生成，支持Vue3/Vue2/小程序多技术栈。从多种输入（OpenAPI/curl/接口设计文档/后端代码/自然语言）生成类型安全的API调用代码、Mock数据、curl命令。适用于前后端分离项目、RESTful API对接、接口封装等场景。**必须严格按流程执行，绝对不能跳过或省略**
---

# Skill: 前端API连接代码生成

基于多种输入形式，为不同前端技术栈生成高质量的API调用代码。

## 核心流程

```
步骤0: 输入分析 → ✅检查点0 → 步骤1: 形成接口文档 → 步骤2: 判断技术栈 → 步骤3: 输出方案(确认) → ✅检查点1 → 步骤4: 生成代码 → ✅检查点2 → 完成
```

### 各平台支持的输入类型

| 输入类型 | Vue3 | Vue2 | 小程序 | 兼容来源 |
|---------|:----:|:----:|:------:|----------|
| **openapi** | ✅ | ✅ | ✅ | Swagger、**YAPI 导出 Swagger** |
| **curl** | ✅ | ✅ | ✅ | curl 命令 |
| **api-doc** | ✅ | ✅ | ✅ | 接口文档、**YAPI 导出 Markdown** |
| **backend-code** | ✅ | ✅ | ✅ | Spring Boot、Go、Express |
| **postman** | ✅ | ✅ | ✅ | Postman、**YAPI 导出 JSON** |
| **har** | ✅ | ✅ | ✅ | 浏览器 HAR 导出 |
| **natural-language** | ✅ | ✅ | ✅ | 自然语言描述 |

### 各平台支持的输出类型

| 输出类型 | Vue3 | Vue2 | 小程序 |
|---------|:----:|:----:|:------:|
| **api-service** | ✅ TypeScript | ✅ JavaScript/TypeScript | ✅ JavaScript/TypeScript |
| **types** | ✅ | ✅ (可选) | ✅ (可选) |
| **composable** | ✅ | ❌ (使用Mixin替代) | ❌ (使用Behavior替代) |
| **mock** | ✅ | ✅ | ✅ |
| **curl** | ✅ | ✅ | ✅ |

---

## ⚠️ 强制检查点（必须遵守）

> **重要**: 每个检查点必须通过才能进入下一步，不可跳过！

| 检查点 | 位置 | 检查内容 | 不通过处理 |
|--------|------|----------|-----------|
| **检查点0** | 步骤0完成后 | 输入类型正确识别、接口信息提取完整 | 重新分析输入 |
| **检查点1** | 步骤3完成后 | 方案已获得用户确认 | 等待用户确认 |
| **检查点2** | 步骤4完成后 | 代码完整、类型正确、可编译 | 修正后重新验证 |

---

## ✅ 检查点0: 输入分析验证（必须通过）

> **⚠️ 强制要求**: 此检查点必须通过才能进入步骤1！

### 检查清单

```yaml
checkpoint_0_validation:
  输入类型识别:
    - [ ] 输入类型已正确识别（openapi/curl/api-doc/backend-code/postman/har/natural-language）
    - [ ] 若为混合输入，主类型已确定
    - [ ] 输入内容完整可解析
  
  接口信息提取:
    - [ ] HTTP方法已识别（GET/POST/PUT/DELETE等）
    - [ ] 请求路径已提取
    - [ ] 请求参数/请求体结构已解析
    - [ ] 响应结构已解析（或可推断）
  
  技术栈判断:
    - [ ] 目标技术栈已确定（vue3/vue2/miniprogram）
    - [ ] 技术栈来源已标注（用户指定/项目检测/默认）
  
  请求工具配置:
    - [ ] 请求工具已确定（项目自有/默认模板）
    - [ ] 若使用项目自有工具，导入路径和调用方式已明确
```

### 检查点0通过标准

```
✅ 通过条件:
  - 输入类型识别检查项全部通过
  - 接口信息提取至少完成 HTTP方法 + 请求路径
  - 技术栈判断检查项全部通过
  - 请求工具配置检查项全部通过

❌ 不通过处理:
  1. 列出未通过的检查项
  2. 向用户确认模糊信息
  3. 重新执行输入分析
  4. 直到全部通过才能继续
```

---

## 步骤0: 输入分析与四维度判断

### 维度1: 输入内容形式 (INPUT_TYPE)

> **统一识别规则**: 参考 [shared/input-recognition.md](shared/input-recognition.md)

| 输入类型 | 识别特征 | 说明 |
|---------|---------|------|
| **openapi** | OpenAPI/Swagger/paths/components/schemas | 标准API规范文档 |
| **curl** | curl命令/curl -X/--request/--header | curl命令或类似格式 |
| **api-doc** | 接口设计文档/接口文档/API文档/请求方法/请求路径/请求参数/响应参数 | 结构化接口设计文档 |
| **backend-code** | @GetMapping/@PostMapping/@RequestMapping/Controller/handler/路由定义 | 后端接口代码 |
| **postman** | Postman Collection/postman_collection_id | Postman导出文件 |
| **har** | HAR/entries/request/response | HTTP Archive格式 |
| **natural-language** | 口语化描述/简短指令 | 用户自然语言输入 |

### 混合输入处理

当输入包含多种类型时（如"帮我生成这个接口的调用代码" + curl命令）：

**处理流程**:
1. **识别所有类型**: 列出输入中包含的所有类型
2. **确定主类型**: 按优先级判定主类型
3. **提取辅助上下文**: 其他类型作为生成时的参考信息
4. **路由到主类型策略**: 使用主类型对应的策略模块

**主类型判定优先级**（从高到低）:

| 优先级 | 类型 | 判定条件 |
|--------|------|---------|
| **1** | openapi | 包含完整的 OpenAPI/Swagger 结构 |
| **2** | api-doc | 包含结构化的接口设计文档 |
| **3** | backend-code | 包含后端Controller/Handler代码 |
| **4** | curl | 包含 curl 命令 |
| **5** | postman | 包含 Postman Collection |
| **6** | har | 包含 HAR 格式数据 |
| **7** | natural-language | 仅有口语化描述 |

### 维度2: 技术栈 (TECH_STACK)

**获取优先级（从高到低）**:

| 优先级 | 来源 | 获取方式 |
|--------|------|---------|
| **1** | 用户明确指定 | 解析用户输入中的技术栈描述 |
| **2** | 项目配置检测 | 解析 `package.json`/`app.json`/`vite.config.ts` |
| **3** | 知识库 | 读取 `.spec-code/memory/context.md` |
| **4** | 默认值 | Vue 3 + TypeScript |

**技术栈选项**:

| 技术栈 | 默认语言 | HTTP客户端 | 规范参考 |
|--------|----------|-----------|---------|
| **vue3** | TypeScript | Axios | [Vue3 规范](standards/vue3/) |
| **vue2** | JavaScript | Axios | [Vue2 规范](standards/vue2/) |
| **miniprogram** | JavaScript | wx.request | [小程序规范](standards/miniprogram/) |

> **⚠️ 语言选择规则**:
> - **Vue3**: 默认使用 TypeScript（现代项目标配）
> - **Vue2**: 默认使用 JavaScript（兼容老项目）
> - **小程序**: 默认使用 JavaScript（原生开发标配）
> - 用户可明确指定语言覆盖默认值

### 维度3: 输出目标 (OUTPUT_TARGET)

| 输出目标 | 说明 | 典型产物 |
|---------|------|---------|
| **api-service** | API服务类/函数 | `xxxService.ts`, `xxxApi.ts` |
| **types** | TypeScript类型定义 | `types/xxx.ts` |
| **composable** | Vue Composable函数 | `useXxx.ts` (Vue3) |
| **mock** | Mock数据 | `mock/xxx.ts` |
| **curl** | curl命令 | 终端可执行命令 |

### 维度4: 请求工具配置 (REQUEST_UTIL)

> **适配项目自有的 HTTP 请求封装**，参考 [shared/request-util-detection.md](shared/request-util-detection.md)

**获取优先级（从高到低）**:

| 优先级 | 来源 | 获取方式 |
|--------|------|---------|
| **1** | 用户当前输入指定 | 解析用户输入中的请求工具描述 |
| **2** | 用户提供示例代码 | 从示例代码学习调用风格 |
| **3** | 项目记忆配置 | 读取 `.spec-code/memory/context.md` 中的 API 请求配置 |
| **4** | 项目文件检测 | 检测 `src/utils/request.ts` 等常见路径 |
| **5** | 默认模板 | Axios (Vue) / wx.request (小程序) |

**检测内容**:

| 配置项 | 说明 | 示例 |
|--------|------|------|
| **导入路径** | import 语句路径 | `@/utils/request` |
| **导出名称** | 导出的函数/对象名 | `request`, `http`, `axios` |
| **调用风格** | 函数式/类方法/实例方法 | `request.get()`, `http.get()` |
| **响应解构** | 是否需要 `.data` 解构 | `response.data` vs `response` |
| **泛型支持** | 是否支持泛型 | `request<T>()` |

**用户指定示例**:

```
# 方式1: 直接指定
使用 @/utils/request 的 request.get/post 方法

# 方式2: 提供示例代码
参考这个风格生成：
import { request } from '@/utils/request';
export const getUser = (id: number) => request.get(`/api/users/${id}`);
```

---

## 步骤1: 形成接口文档

> 将各种输入统一转换为标准接口文档格式

### 标准接口文档格式

```yaml
interface_document:
  name: "接口名称"
  description: "接口描述"
  
  request:
    method: "GET|POST|PUT|DELETE|PATCH"
    path: "/api/xxx"
    headers:
      Content-Type: "application/json"
      Authorization: "Bearer {token}"
    query_params:
      - name: "参数名"
        type: "string|number|boolean"
        required: true|false
        description: "参数描述"
    path_params:
      - name: "id"
        type: "number"
        description: "资源ID"
    body:
      type: "object"
      properties:
        - name: "字段名"
          type: "string"
          required: true
          description: "字段描述"
  
  response:
    success:
      code: 200
      body:
        type: "object"
        properties:
          - name: "code"
            type: "number"
          - name: "message"
            type: "string"
          - name: "data"
            type: "object|array"
    error:
      - code: 400
        description: "参数错误"
      - code: 401
        description: "未授权"
```

### 输入类型转换指南

- **openapi**: 参考 [shared/openapi-parser.md](shared/openapi-parser.md)
- **curl**: 参考 [shared/curl-parser.md](shared/curl-parser.md)
- **api-doc**: 参考 [shared/api-doc-parser.md](shared/api-doc-parser.md)
- **backend-code**: 参考 [shared/backend-code-parser.md](shared/backend-code-parser.md)
- **postman**: 参考 [shared/postman-parser.md](shared/postman-parser.md)
- **har**: 参考 [shared/har-parser.md](shared/har-parser.md)

---

## 步骤2: 判断技术栈

### 技术栈检测规则

参考 [shared/context-detection.md](shared/context-detection.md)

### 检测流程

```
1. 检查用户是否明确指定技术栈
2. 检测 package.json 中的 vue 版本
3. 检测 app.json（小程序项目）
4. 检测 vite.config.ts / vue.config.js
5. 读取项目记忆文件
6. 使用默认值（Vue 3）
```

---

## 步骤3: 输出方案（等待确认）

> ⚠️ **必须等待用户确认后才能进入步骤4**

### 方案输出模板

```markdown
## API代码生成方案

### 接口信息
- **接口名称**: [名称]
- **请求方法**: [GET/POST/PUT/DELETE]
- **请求路径**: [/api/xxx]

### 技术栈
- **目标框架**: [Vue3/Vue2/小程序]
- **HTTP客户端**: [Axios/wx.request/项目自有]
- **类型系统**: [TypeScript/JavaScript]

### 技术栈来源
- [ ] 用户指定
- [ ] 项目检测
- [ ] 默认值

### 语言选择
- **使用语言**: [TypeScript/JavaScript]
- **来源**: [用户指定/技术栈默认]

### 请求工具配置
| 配置项 | 值 | 来源 |
|--------|-----|------|
| 导入路径 | `@/utils/request` | [项目记忆/用户指定/默认] |
| 调用方式 | `request.get(url, params)` | [示例学习/默认] |
| 响应类型 | `Promise<Response<T>>` | [项目记忆/默认] |

> ⚠️ 如需修改请求工具配置，请：
> 1. 在输入中指定：`使用 @/api/http 的 http.get`
> 2. 或提供示例代码
> 3. 或更新项目记忆配置

### 将生成的文件
| 文件 | 职责 | 路径 |
|------|------|------|
| types.ts | 类型定义 | src/types/xxx.ts |
| xxxService.ts | API服务 | src/services/xxxService.ts |
| useXxx.ts | Composable | src/composables/useXxx.ts |

### 关键设计决策
- **命名规范**: ...
- **错误处理**: ...
- **请求配置**: ...

---
**确认以上方案后，我将开始生成代码。是否继续？**
```

---

## ✅ 检查点1: 方案确认验证（必须通过）

> **⚠️ 强制要求**: 此检查点必须通过才能进入步骤4！

### 检查清单

```yaml
checkpoint_1_validation:
  方案完整性:
    - [ ] 接口信息完整（方法/路径/参数）
    - [ ] 技术栈信息完整
    - [ ] 文件清单完整（文件名/职责/路径）
    - [ ] 关键设计决策已说明
  
  用户确认:
    - [ ] 方案已展示给用户
    - [ ] 用户已明确确认（回复"是"/"继续"/"确认"等）
```

---

## 步骤4: 生成代码

### 4.1 按技术栈路由

根据 TECH_STACK 加载对应策略模块：

| 技术栈 | 策略模块 |
|--------|---------|
| vue3 | [vue3/](vue3/) |
| vue2 | [vue2/](vue2/) |
| miniprogram | [miniprogram/](miniprogram/) |

### 4.2 输入解析与代码生成

**输入解析（与技术栈无关）**：

| INPUT_TYPE | 解析规则 |
|------------|---------|
| openapi | [shared/openapi-parser.md](shared/openapi-parser.md) |
| curl | [shared/curl-parser.md](shared/curl-parser.md) |
| api-doc | [shared/api-doc-parser.md](shared/api-doc-parser.md) |
| backend-code | [shared/backend-code-parser.md](shared/backend-code-parser.md) |
| postman | [shared/postman-parser.md](shared/postman-parser.md) |
| har | [shared/har-parser.md](shared/har-parser.md) |
| natural-language | 先转换为 api-doc，再解析 |

**代码生成（按技术栈）**：

| TECH_STACK | 输出模板参考 |
|------------|------------|
| vue3 | [vue3/reference.md](vue3/reference.md) |
| vue2 | [vue2/reference.md](vue2/reference.md) |
| miniprogram | [miniprogram/reference.md](miniprogram/reference.md) |

**Mock数据生成（统一）**：

| OUTPUT_TARGET | 生成规则 |
|---------------|---------|
| mock (TypeScript) | [shared/mock-generator.md](shared/mock-generator.md) - TypeScript 版本 |
| mock (JavaScript) | [shared/mock-generator.md](shared/mock-generator.md) - JavaScript 版本 |

### 4.3 应用编码规范

**通用规范（必须遵循）**:

| 规范 | 文档 |
|------|------|
| 命名规范 | [standards/common/naming.md](standards/common/naming.md) |
| 类型规范 | [standards/common/typing.md](standards/common/typing.md) |
| 错误处理 | [standards/common/error-handling.md](standards/common/error-handling.md) |
| 请求配置 | [standards/common/request-config.md](standards/common/request-config.md) |

**技术栈特有规范**: 根据 TECH_STACK 加载对应规范

---

## ✅ 检查点2: 代码质量验证（必须通过）

> **⚠️ 强制要求**: 此检查点必须通过才能标记任务完成！

### 检查清单

```yaml
checkpoint_2_validation:
  代码完整性:
    - [ ] 所有计划文件已生成
    - [ ] 所有 import 语句完整
    - [ ] 类型定义完整
    - [ ] 代码结构完整（无截断）
  
  类型检查:
    - [ ] 请求参数类型正确
    - [ ] 响应数据类型正确
    - [ ] 泛型使用正确
  
  编译验证:
    Vue3/Vue2:
      - [ ] tsc --noEmit 成功
    小程序:
      - [ ] 类型检查通过
  
  规范检查:
    - [ ] 命名符合规范
    - [ ] 错误处理完善
    - [ ] 请求配置正确
```

---

## 策略路由表

| INPUT_TYPE | 解析规则 | TECH_STACK | 输出模板 |
|------------|---------|------------|---------|
| openapi | [shared/openapi-parser.md](shared/openapi-parser.md) | vue3 | [vue3/reference.md](vue3/reference.md) |
| openapi | [shared/openapi-parser.md](shared/openapi-parser.md) | vue2 | [vue2/reference.md](vue2/reference.md) |
| openapi | [shared/openapi-parser.md](shared/openapi-parser.md) | miniprogram | [miniprogram/reference.md](miniprogram/reference.md) |
| curl | [shared/curl-parser.md](shared/curl-parser.md) | vue3 | [vue3/reference.md](vue3/reference.md) |
| curl | [shared/curl-parser.md](shared/curl-parser.md) | vue2 | [vue2/reference.md](vue2/reference.md) |
| curl | [shared/curl-parser.md](shared/curl-parser.md) | miniprogram | [miniprogram/reference.md](miniprogram/reference.md) |
| api-doc | [shared/api-doc-parser.md](shared/api-doc-parser.md) | vue3 | [vue3/reference.md](vue3/reference.md) |
| api-doc | [shared/api-doc-parser.md](shared/api-doc-parser.md) | vue2 | [vue2/reference.md](vue2/reference.md) |
| api-doc | [shared/api-doc-parser.md](shared/api-doc-parser.md) | miniprogram | [miniprogram/reference.md](miniprogram/reference.md) |
| backend-code | [shared/backend-code-parser.md](shared/backend-code-parser.md) | vue3 | [vue3/reference.md](vue3/reference.md) |
| backend-code | [shared/backend-code-parser.md](shared/backend-code-parser.md) | vue2 | [vue2/reference.md](vue2/reference.md) |
| backend-code | [shared/backend-code-parser.md](shared/backend-code-parser.md) | miniprogram | [miniprogram/reference.md](miniprogram/reference.md) |
| * | - | * (mock) | [shared/mock-generator.md](shared/mock-generator.md) |
| * | - | * (curl) | [shared/to-curl/](shared/to-curl/) |

---

## 目录结构

```
ui-connect-api/
├── SKILL.md                      # 本文件（主入口）
├── reference.md                  # 参考文档索引
├── checklist.md                  # 检查清单汇总
├── examples.md                   # 使用示例
│
├── standards/                    # 编码规范体系
│   ├── common/                   # 通用规范
│   │   ├── naming.md
│   │   ├── typing.md
│   │   ├── error-handling.md
│   │   └── request-config.md
│   ├── vue3/                     # Vue3 规范
│   │   ├── axios-config.md
│   │   ├── composables.md
│   │   └── best-practices.md
│   ├── vue2/                     # Vue2 规范
│   │   ├── axios-config.md
│   │   └── best-practices.md
│   └── miniprogram/              # 小程序规范
│       ├── request-config.md
│       └── best-practices.md
│
├── vue3/                         # Vue3 输出模板
│   └── reference.md              # 类型定义 + API服务 + Composable 模板
│
├── vue2/                         # Vue2 输出模板
│   └── reference.md              # 类型定义 + API服务 模板
│
├── miniprogram/                  # 小程序输出模板
│   └── reference.md              # 类型定义 + API服务 模板
│
├── shared/                       # 共享资源（与技术栈无关）
│   ├── input-recognition.md      # 输入类型识别规则（统一）
│   ├── context-detection.md      # 技术栈检测
│   ├── request-util-detection.md # 请求工具类检测与适配 ⭐新增
│   ├── openapi-parser.md         # OpenAPI解析
│   ├── curl-parser.md            # curl解析
│   ├── api-doc-parser.md         # 接口文档解析
│   ├── backend-code-parser.md    # 后端代码解析
│   ├── postman-parser.md         # Postman解析
│   ├── har-parser.md             # HAR解析
│   ├── mock-generator.md         # Mock生成（JS/TS 两版本）
│   └── to-curl/                  # curl输出
│
└── templates/                    # 代码模板（参考示例）
    ├── vue3-request.template.ts  # Vue3 请求封装 (TS) ⭐默认
    ├── vue2-request.js           # Vue2 请求封装 (JS) ⭐默认
    ├── vue2-request.template.ts  # Vue2 请求封装 (TS)
    ├── miniprogram-request.js    # 小程序请求封装 (JS) ⭐默认
    ├── miniprogram-request.template.ts  # 小程序请求封装 (TS)
    ├── api-service.template.ts
    ├── axios-config.template.ts
    └── vue-composable.template.ts
```

---

## 快速开始

复制此清单跟踪进度：

```
API代码生成进度:
- [ ] 步骤0: 输入分析
  - [ ] 识别输入类型: ___________
  - [ ] 确定技术栈: ___________
  - [ ] 确定输出目标: ___________
- [ ] ✅ 检查点0: 输入分析验证
  - [ ] 输入类型正确识别
  - [ ] 接口信息提取完整
  - [ ] 技术栈判断完成
- [ ] 步骤1: 形成接口文档
  - [ ] HTTP方法
  - [ ] 请求路径
  - [ ] 请求参数
  - [ ] 响应结构
- [ ] 步骤2: 判断技术栈
  - [ ] 技术栈来源确定
- [ ] 步骤3: 输出方案
  - [ ] 接口信息确认
  - [ ] 文件清单确认
  - [ ] ⏳ 等待用户确认
- [ ] ✅ 检查点1: 方案确认验证
  - [ ] 方案完整
  - [ ] 用户已确认
- [ ] 步骤4: 生成代码
  - [ ] 类型定义
  - [ ] API服务
  - [ ] Composable/工具函数
- [ ] ✅ 检查点2: 代码质量验证
  - [ ] 代码完整性检查通过
  - [ ] 类型检查通过
  - [ ] 编译验证通过
```

---

## 常见场景

### 场景1: 从OpenAPI生成Vue3代码

```
输入: OpenAPI/Swagger文档
解析: shared/openapi-parser.md
输出: Types + API Service + Composable
模板: vue3/reference.md
```

### 场景2: 从curl命令生成Vue2代码

```
输入: curl命令
解析: shared/curl-parser.md
输出: Types + API Service
模板: vue2/reference.md
```

### 场景3: 从接口设计文档生成小程序代码

```
输入: 接口设计文档
解析: shared/api-doc-parser.md
输出: Types + API Service
模板: miniprogram/reference.md
```

### 场景4: 从后端Controller生成前端代码

```
输入: Spring Boot Controller代码
解析: shared/backend-code-parser.md
输出: Types + API Service + Composable
模板: vue3/reference.md
```

### 场景5: 从自然语言生成代码

```
输入: "帮我生成一个获取用户列表的接口调用"
处理: 先转换为接口文档 → 再按技术栈生成
模板: 根据 TECH_STACK 动态选择
```

### 场景6: 生成Mock数据

```
输入: 任意接口定义
输出: Mock数据文件
模板: shared/mock-generator.md (JS/TS 版本)
```

---

## 常见错误

| 错误 | 正确做法 |
|------|----------|
| ❌ 跳过检查点直接进入下一步 | 每个检查点必须通过才能继续 |
| ❌ 未确认方案就开始生成代码 | 必须等待用户确认后才能生成 |
| ❌ 代码未验证就标记完成 | 必须通过检查点2后才能完成 |
| ❌ 忽略项目技术栈检测 | 优先检测项目配置确定技术栈 |
| ❌ 类型定义不完整 | 请求和响应都需要完整类型 |
| ❌ 缺少错误处理 | 所有API调用必须有错误处理 |
| ❌ 命名不规范 | 严格遵循技术栈命名规范 |

---

## 版本历史

- **v2.2.0** (2025-12-23): 新增维度4请求工具配置，支持适配项目自有HTTP请求封装；新增 YAPI 格式兼容说明
- **v2.1.0** (2025-12-23): 架构简化，移除 from-* 和 to-mock 文件夹，统一输入解析到 shared/，统一 Mock 生成到 shared/mock-generator.md
- **v2.0.0** (2025-12-23): 架构升级，支持多技术栈（Vue3/Vue2/小程序），支持多输入类型（OpenAPI/curl/接口设计文档/后端代码），新增检查点机制
- **v1.0.0**: 初始版本，仅支持Vue3 + TypeScript + Axios
