<!--
================== AI 处理指引 ==================

【文档提取规则】
1. 方法分类：区分查询(SELECT)、写入(INSERT/UPDATE/DELETE)、分页、批量操作
2. SQL方式：识别注解方式(@Select等)或XML映射方式
3. 参数注解：提取@Param注解定义的参数名
4. 继承关系：识别父接口（BaseMapper/Mapper等）及泛型参数
5. 可选章节：内容为空时整章省略（含标题），不保留空表格

【代码生成规则】
1. 接口定义：@Mapper + extends BaseMapper<Entity>
2. 方法命名：selectXxx/insertXxx/updateXxx/deleteXxx
3. 参数注解：@Param("name") 用于多参数方法
4. 分页查询：IPage<T> 作为参数和返回值
5. 批量操作：List<T> 作为参数

**注意**: 以上为通用规则，若实际项目代码风格与规则不一致，以实际项目为准。

================================================
-->

# {{CLASS_NAME}}

> **路径**: `{{PACKAGE_NAME}}.{{CLASS_NAME}}` <!-- [必填] -->  
> **类型**: Mapper <!-- [必填] -->  
> **职责**: {{RESPONSIBILITY}} <!-- [必填] -->  
> **映射表**: `{{TABLE_NAME}}` <!-- [必填] -->  
> **XML映射**: `{{XML_MAPPER_PATH}}` <!-- [可选] 仅当使用XML定义SQL时填写 -->  
> **代码行数**: {{LOC}} 行（SLOC） <!-- [必填] -->

---

## 📊 统计信息

| 方法总数 | 查询方法 | 写入方法 | 分页方法 | 批量操作 | 关联类型数 |
|:--------:|:--------:|:--------:|:--------:|:--------:|:----------:|
| {{TOTAL_METHOD}} | {{QUERY_COUNT}} | {{WRITE_COUNT}} | {{PAGE_COUNT}} | {{BATCH_COUNT}} | {{TYPE_COUNT}} |

---

## 📋 继承与泛型

| 父接口 | 泛型参数 | 说明 |
|--------|----------|------|
| `{{PARENT_INTERFACE}}` | `{{ENTITY_TYPE}}` | {{GENERIC_DESC}} |

*常见父接口: `BaseMapper<T>`(MyBatis-Plus)、`Mapper<T>`(tk.mybatis)、无继承(原生MyBatis)*

---

## 📋 数据访问方法

> **重要**: 必须列出接口中定义的**全部方法**，不可遗漏任何方法签名。

### 方法清单

| # | 方法名 | 返回类型 | 操作类型 | SQL方式 | 说明 |
|:-:|--------|----------|----------|---------|------|
| 1 | `{{METHOD_NAME_1}}` | `{{RETURN_TYPE_1}}` | {{OP_TYPE_1}} | {{SQL_WAY_1}} | {{DESC_1}} |
| 2 | `{{METHOD_NAME_2}}` | `{{RETURN_TYPE_2}}` | {{OP_TYPE_2}} | {{SQL_WAY_2}} | {{DESC_2}} |
| ... | ... | ... | ... | ... | ... |

*SQL方式: 注解(@Select等) / XML映射*

### {{METHOD_NAME}}

- **方法签名**:
  ```java
  {{RETURN_TYPE}} {{METHOD_NAME}}({{PARAMS_WITH_ANNOTATIONS}})
  ```
- **参数说明**:
  | 参数 | 类型 | 注解 | 说明 |
  |------|------|------|------|
  | {{PARAM_NAME}} | {{PARAM_TYPE}} | {{PARAM_ANNOTATION}} | {{PARAM_DESC}} |
- **返回**: `{{RETURN_TYPE}}` - {{RETURN_DESC}}
- **操作类型**: {{OPERATION_TYPE}}
- **说明**: {{DESCRIPTION}}

<!-- [可选] SQL注解方式 - 仅当使用@Select/@Insert等注解时填写
- **SQL注解**:
  ```java
  {{SQL_ANNOTATION}}
  ```
- **SQL语句**:
  ```sql
  {{SQL_CONTENT}}
  ```
-->

<!-- [可选] XML映射方式 - 仅当使用XML定义SQL时填写
- **XML映射**: `{{XML_FILE_PATH}}` → `<{{SQL_TAG}} id="{{METHOD_NAME}}">`
-->

*重复上述格式，为每个方法生成独立的详细说明*

---

<!-- [可选] 分页查询 - 仅当存在分页方法时保留此章节 -->
## 📄 分页查询

| 方法名 | 分页参数类型 | 结果类型 | 说明 |
|--------|--------------|----------|------|
| {{PAGE_METHOD_NAME}} | `{{PAGE_PARAM_TYPE}}` | `{{PAGE_RESULT_TYPE}}` | {{PAGE_DESC}} |

*常见分页类型: `IPage<T>`(MyBatis-Plus)、`PageHelper`、`Pageable`(Spring Data)*

---

<!-- [可选] 多租户支持 - 仅当存在租户参数时保留此章节 -->
## 🏢 多租户支持

| 租户参数名 | 参数类型 | 使用方法 |
|------------|----------|----------|
| `{{TENANT_PARAM}}` | `{{TENANT_TYPE}}` | {{TENANT_METHODS}} |

---

<!-- [可选] 批量操作 - 仅当存在批量方法时保留此章节 -->
## 📦 批量操作

| 方法名 | 数据参数 | 操作类型 | 说明 |
|--------|----------|----------|------|
| {{BATCH_METHOD_NAME}} | `@Param("{{BATCH_PARAM}}") List<{{BATCH_TYPE}}>` | {{BATCH_OP_TYPE}} | {{BATCH_DESC}} |

---

## 🔗 依赖组件（我依赖谁）

| 组件 | 类型 | 用途 |
|------|------|------|
| {{DEP_NAME}} | {{DEP_TYPE}} | {{DEP_PURPOSE}} |

*类型说明: Entity(实体)、DO(数据对象)、Bean(业务对象)、DTO(传输对象)、VO(视图对象)*

---

## 🔙 被依赖方（谁依赖我）

| 组件 | 类型 | 调用方法 |
|------|------|----------|
| {{CALLER_NAME}} | {{CALLER_TYPE}} | {{CALLED_METHODS}} |

**影响分析**: 修改本类可能影响 {{IMPACT_COUNT}} 个组件

---

## 🔗 关联数据类型

| 类型 | 类名 | 用途 |
|------|------|------|
| {{DATA_TYPE_CATEGORY}} | `{{DATA_TYPE_NAME}}` | {{DATA_TYPE_PURPOSE}} |

*按实际使用的类型填写，可能包括: Entity、DO、Bean、DTO、VO、Query、Param 等*

---

<!-- [可选] 仅列出项目自定义注解 -->
## 🏷️ 自定义注解

| 注解 | 作用范围 | 说明 |
|------|----------|------|
| `{{ANNOTATION}}` | {{ANNOTATION_TARGET}} | {{ANNOTATION_DESC}} |

*如无章节内容，此章节可省略*

---

## 💻 关键代码片段

```java
// 接口定义
public interface {{CLASS_NAME}} extends {{PARENT_INTERFACE}}<{{ENTITY_TYPE}}> {
    
    {{RETURN_TYPE}} {{METHOD_NAME}}({{PARAMS}});
}
```

<!-- [可选] SQL片段 - 仅当使用注解方式或需要展示SQL时填写
```sql
-- {{SQL_DESC}}
{{SQL_STATEMENT}}
```
-->

---

## 📖 使用示例

```java
@Service
@RequiredArgsConstructor
public class {{SERVICE_NAME}} {
    
    private final {{CLASS_NAME}} {{MAPPER_FIELD}};
    
    // 单条查询
    public {{ENTITY_TYPE}} getById(Long id) {
        return {{MAPPER_FIELD}}.selectById(id);
    }
    
    // 条件查询
    public List<{{RESULT_TYPE}}> listByCondition({{QUERY_TYPE}} query) {
        return {{MAPPER_FIELD}}.{{METHOD_NAME}}(query);
    }
    
    // [可选] 分页查询
    public IPage<{{RESULT_TYPE}}> page(IPage<{{RESULT_TYPE}}> page, {{QUERY_TYPE}} query) {
        return {{MAPPER_FIELD}}.{{PAGE_METHOD_NAME}}(page, query);
    }
    
    // [可选] 批量操作
    public int batchSave(List<{{ENTITY_TYPE}}> list) {
        return {{MAPPER_FIELD}}.{{BATCH_METHOD_NAME}}(list);
    }
}
```

---

## 📎 关联文档

<!-- [可选] 引用相关文档 -->

| 文档类型 | 文档名称 | 说明 |
|----------|----------|------|
| Entity | [{{ENTITY_NAME}}](./entity/{{ENTITY_FILE}}.md) | 映射实体 |
| Service | [{{SERVICE_NAME}}](./service/{{SERVICE_FILE}}.md) | 调用方服务 |

*如无章节内容，此章节可省略*

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| {{SCAN_DATE}} | AI自动生成 | 初始创建文档 | v1.0 |
