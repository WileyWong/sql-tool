<!--
================== AI 处理指引 ==================

【文档提取规则】
1. Feign 配置：提取 @FeignClient 注解的 name、url、fallback
2. 接口方法：提取所有远程调用方法及其 HTTP 映射
3. 降级处理：识别 fallback/fallbackFactory 实现
4. 超时配置：提取连接超时、读取超时配置
5. 可选章节：内容为空时整章省略（含标题），不保留空表格

【代码生成规则】
1. Feign 接口：@FeignClient + interface
2. HTTP 映射：@GetMapping/@PostMapping + @RequestParam/@RequestBody
3. 降级实现：implements FeignClient + 返回默认值
4. 配置：feign.client.config.xxx

**注意**: 以上为通用规则，若实际项目代码风格与规则不一致，以实际项目为准。

================================================
-->

# {{CLASS_NAME}}

> **路径**: `{{PACKAGE_NAME}}.{{CLASS_NAME}}` <!-- [必填] -->  
> **类型**: Feign Client <!-- [必填] -->  
> **职责**: {{RESPONSIBILITY}} <!-- [必填] -->  
> **代码行数**: {{LOC}} 行（SLOC） <!-- [必填] -->

---

## 📊 统计信息

| 远程接口总数 | GET | POST | PUT | DELETE | 配置降级接口数 |
|:------------:|:---:|:----:|:---:|:------:|:--------------:|
| {{TOTAL_API}} | {{GET_COUNT}} | {{POST_COUNT}} | {{PUT_COUNT}} | {{DELETE_COUNT}} | {{FALLBACK_COUNT}} |

---

## 🏷️ Feign 配置

| 配置项 | 值 | 说明 |
|:------|:---|:-----|
| **服务名** | `{{SERVICE_NAME}}` | 注册中心服务名 |
| **URL** | `{{SERVICE_URL}}` | 服务地址（可选） |
| **降级类** | `{{FALLBACK_CLASS}}` | 熔断降级处理 |

```java
{{FEIGN_ANNOTATION}}
```

---

## 📋 远程接口完整清单

> **重要**: 必须列出 Feign Client 中定义的**全部远程接口**，不可遗漏。

### 接口清单

| # | 方法名 | HTTP方法 | 远程路径 | 返回类型 | 说明 |
|:-:|--------|:--------:|----------|----------|------|
| 1 | `{{METHOD_NAME_1}}` | {{HTTP_1}} | `{{PATH_1}}` | `{{RETURN_1}}` | {{DESC_1}} |
| 2 | `{{METHOD_NAME_2}}` | {{HTTP_2}} | `{{PATH_2}}` | `{{RETURN_2}}` | {{DESC_2}} |
| ... | ... | ... | ... | ... | ... |

---

### {{METHOD_NAME}}

| 属性 | 值 |
|------|-----|
| 签名 | `{{HTTP_MAPPING_ANNOTATION}} {{RETURN_TYPE}} {{METHOD_NAME}}({{PARAMS_BRIEF}})` |
| HTTP方法 | `{{HTTP_METHOD}}` |
| 远程路径 | `{{API_PATH}}` |
| 降级策略 | {{FALLBACK_STRATEGY}} |
| 说明 | {{DESCRIPTION}} |

**参数**:

| 参数 | 类型 | 注解 | 说明 |
|------|------|------|------|
| {{PARAM_NAME}} | `{{PARAM_TYPE}}` | `{{PARAM_ANNOTATION}}` | {{PARAM_DESC}} |

**返回**: `{{RETURN_TYPE}}` - {{RETURN_DESC}}

<!-- 重复以上结构，直到列出全部远程接口 -->

---

## 🛡️ 降级处理

<!-- [可选] 如无降级配置，可省略此章节 -->

**降级类**: `{{FALLBACK_CLASS_NAME}}`

| 方法名 | 降级策略 | 降级逻辑 |
|--------|----------|----------|
| `{{METHOD_NAME}}` | {{FALLBACK_STRATEGY}} | {{FALLBACK_LOGIC}} |

*如无章节内容，此章节可省略*

---

## ⚙️ 配置信息

| 配置项 | 值 | 说明 |
|:------|:---|:-----|
| 连接超时 | `{{CONNECT_TIMEOUT}}` | 建立连接超时时间 |
| 读取超时 | `{{READ_TIMEOUT}}` | 读取数据超时时间 |
| 重试策略 | `{{RETRY_STRATEGY}}` | 重试配置 |

---

## 🔗 依赖组件（我依赖谁）

<!-- [可选] Feign Client 通常无依赖 -->

| 组件 | 类型 | 用途 |
|------|------|------|
| {{DEP_NAME}} | {{DEP_TYPE}} | {{DEP_PURPOSE}} |

*如无章节内容，此章节可省略*

---

## 🔙 被依赖方（谁依赖我）

| 组件 | 类型 | 调用方法 |
|------|------|----------|
| {{CALLER_NAME}} | {{CALLER_TYPE}} | {{CALLED_METHODS}} |

**影响分析**: 修改本类可能影响 {{IMPACT_COUNT}} 个组件

---

## 🏷️ 自定义注解

<!-- [可选] 仅列出项目自定义注解 -->

| 注解 | 作用范围 | 说明 |
|------|----------|------|
| `{{ANNOTATION}}` | {{SCOPE}} | {{ANNOTATION_DESC}} |

*如无章节内容，此章节可省略*

---

## 💡 使用示例

```java
// 在Service中注入使用
@Service
@RequiredArgsConstructor
public class {{SERVICE_NAME}} {
    
    private final {{CLASS_NAME}} {{FEIGN_FIELD}};
    
    public {{RETURN_TYPE}} callRemoteService({{PARAM_TYPE}} param) {
        return {{FEIGN_FIELD}}.{{METHOD_NAME}}(param);
    }
}
```

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| {{SCAN_DATE}} | AI自动生成 | 初始创建文档 | v1.0 |
