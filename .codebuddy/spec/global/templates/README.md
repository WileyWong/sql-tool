# Templates 输出模板目录

本目录包含所有初始输出模板（Templates），用于辅助AI生成结构化的文档和代码。

## 📚 目录结构

```
templates/
├── command/          # Command 通用模板和片段
├── requirements/     # 需求文档模板
├── design/          # 设计文档模板
├── code/            # 代码模板
│   ├── java/       # Java 代码模板
│   └── vue/        # Vue 代码模板
├── project/         # 项目管理模板
├── backend/         # 后端项目模板
├── frontend/        # 前端项目模板
├── skills/          # Skill 模板（已有）
└── spec-dev/        # Spec-Code 开发模板⭐ 新增
    ├── command-template.md    # Command 模板
    ├── skill-template.md      # Skill 模板
    └── README.md              # 说明文档
```

## 🎯 什么是 Template？

**Template** 是一个结构化的文档或代码骨架，包含：
- 固定的章节结构
- 占位符
- 填写说明
- 示例内容

## 📝 Template 格式

### Markdown 模板

```markdown
# [TITLE]

**Created**: [DATE]
**Author**: [AUTHOR]

## Section 1

[PLACEHOLDER: Description of what to fill here]

### Subsection 1.1

[EXAMPLE: This is an example of good content]

## Section 2

<!-- 
  ACTION REQUIRED: Replace this placeholder with actual content.
  Guidelines:
  - Point 1
  - Point 2
-->

[Content here]
```

### YAML 模板

```yaml
# API Specification Template
openapi: 3.0.0
info:
  title: [API_NAME]
  version: [VERSION]
  description: [DESCRIPTION]

paths:
  /[RESOURCE]:
    get:
      summary: [SUMMARY]
      parameters:
        - name: [PARAM_NAME]
          in: query
          schema:
            type: [TYPE]
```

### 代码模板

```java
/**
 * [CLASS_DESCRIPTION]
 * 
 * @author [AUTHOR]
 * @date [DATE]
 */
@RestController
@RequestMapping("/api/[RESOURCE]")
public class [CLASSNAME]Controller {
    
    @Autowired
    private [CLASSNAME]Service service;
    
    /**
     * [METHOD_DESCRIPTION]
     */
    @GetMapping
    public ResponseEntity<List<[CLASSNAME]>> list() {
        // TODO: Implement
        return ResponseEntity.ok(service.findAll());
    }
}
```

## ✍️ 如何编写 Template

### 基本原则

1. **结构清晰**：章节层次分明
2. **占位符明确**：使用 `[PLACEHOLDER]` 格式
3. **说明详细**：每个占位符都有填写说明
4. **示例丰富**：提供正反示例

### 占位符规范

- `[UPPERCASE]` - 必填项
- `[lowercase]` - 可选项
- `<!-- 注释 -->` - 填写说明
- `[EXAMPLE: ...]` - 示例内容

## 📋 当前 Templates 列表

### Command（命令片段）

- [x] `memory-reference-template.md` - 项目记忆引用模板（用于 Command 文件）

### Requirements（需求）

- [ ] `requirement-doc-template.md` - 需求文档模板
- [ ] `user-story-template.md` - 用户故事模板

### Design（设计）

- [ ] `delivery-plan-template.md` - 交付方案模板
- [ ] `architecture-doc-template.md` - 架构设计文档模板
- [ ] `database-design-template.md` - 数据库设计模板
- [ ] `api-spec-template.yaml` - API 规格模板
- [ ] `entity-design-template.md` - 实体设计模板
- [ ] `process-design-template.md` - 流程设计模板
- [ ] `deployment-design-template.md` - 部署设计模板

### Code（代码）

#### Java
- [ ] `controller-template.java` - Controller 模板
- [ ] `service-template.java` - Service 模板
- [ ] `entity-template.java` - Entity 模板
- [ ] `mapper-template.java` - MyBatis Mapper 模板

#### Vue
- [ ] `component-template.vue` - 组件模板
- [ ] `composable-template.ts` - Composable 模板
- [ ] `store-template.ts` - Pinia Store 模板

### Project（项目）

- [ ] `project-plan-template.md` - 项目计划模板
- [ ] `test-report-template.md` - 测试报告模板

## 🔧 如何使用 Template

### 在 Command 中引用

```markdown
**REQUIRED TEMPLATE**: Use `templates:design/database-design-template.md`

**Output Location**: `specs/[feature-id]/database-design.md`
```

### 手动使用

1. 复制模板文件
2. 替换所有占位符
3. 删除说明注释
4. 填充实际内容

## 🤝 贡献新 Template

欢迎贡献新的 Template！请参考 [贡献指南](../../CONTRIBUTING.md)。

### 贡献检查清单

- [ ] 结构清晰，章节完整
- [ ] 占位符使用规范
- [ ] 包含填写说明
- [ ] 提供示例内容
- [ ] 在实际项目中测试过

## 📞 需要帮助？

如果你在使用 Template 时遇到问题，请：
1. 查看 Template 中的说明注释
2. 参考示例内容
3. 搜索 GitHub Issues
4. 创建新 Issue 寻求帮助
