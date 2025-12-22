# 核心模板 (Core Templates)

19 个标准分类文档的模板 + 1 个兜底模板 + 1 个索引模板，与 SKILL.md 定义的输出文件一一对应。

## 模板列表

| 序号 | 模板文件 | 输出文件 | 优先级 |
|------|----------|----------|--------|
| - | `directory-index.md` | `README.md` | - |
| - | `default.md` | `other.md` | 兜底 |
| 1 | `interface.md` | `interface.md` | P0 |
| 2 | `abstract.md` | `abstract.md` | P0 |
| 3 | `service-api-http.md` | `service-api-http.md` | P0 |
| 4 | `business-logic.md` | `business-logic.md` | P0 |
| 5 | `orm-mapper.md` | `orm-mapper.md` | P0 |
| 6 | `entity.md` | `entity.md` | P1 |
| 7 | `dto.md` | `dto.md` | P1 |
| 8 | `service-response-object.md` | `service-response-object.md` | P1 |
| 9 | `front-end-request.md` | `front-end-request.md` | P1 |
| 10 | `exception.md` | `exception.md` | P1 |
| 11 | `enum.md` | `enum.md` | P1 |
| 12 | `feign.md` | `feign.md` | P2 |
| 13 | `handler.md` | `handler.md` | P2 |
| 14 | `job-task.md` | `job-task.md` | P2 |
| 15 | `mq-listener.md` | `mq-listener.md` | P2 |
| 16 | `utils.md` | `utils.md` | P2 |
| 17 | `common.md` | `common.md` | P2 |
| 18 | `annotation.md` | `annotation.md` | P2 |
| 19 | `constants.md` | `constants.md` | P2 |

## 使用方式

每个模板包含：
- 文档结构（目录、章节）
- 示例内容（占位符）
- 标准尾部（相关文档、维护记录）

## 类记录必含字段

每个类记录必须包含：
- 类路径（`**类路径**:`）
- 代码行数（`**代码行数**: {{LOC}} 行（SLOC）`）
- 方法表格（方法签名、参数、返回值、功能）

## 新增模板说明

### interface.md
用于接口定义，记录：
- 方法签名
- 实现类列表

### abstract.md
用于抽象类，记录：
- 抽象方法（子类必须实现）
- 具体方法（子类继承）
- 子类列表

### exception.md
用于自定义异常类，记录：
- 继承关系
- 自定义字段（如错误码）
- 构造方法

### enum.md
用于枚举类，记录：
- 所有枚举值及其属性
- 自定义字段和方法

### annotation.md
用于自定义注解，记录：
- 元注解信息
- 属性列表

### constants.md
用于常量类，记录：
- 常量分组
- 常量值和说明

### default.md（兜底模板）
当类无法匹配任何已知类型时使用的通用模板：
- 适用于无法识别类型的 Java 类
- 包含完整的标准章节结构
- 输出文件为 `other.md`
- 确保所有类都能被记录，不会遗漏
