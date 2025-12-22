# tdd-testing 示例索引

本目录包含完整的测试工作流示例，展示各策略的使用方法。

## 示例列表

| 示例 | 策略 | 测试类型 | 语言 | 说明 |
|------|------|----------|------|------|
| [示例1](example-01-api-test.md) | api-test | 集成测试 | Java | 基于 API 代码生成测试用例和代码 |
| [示例2](example-02-whitebox.md) | whitebox | 单元测试 | Java | 基于业务代码生成单元测试 |
| [示例3](example-03-normalize.md) | normalize | - | - | 规范化已有测试用例文档 |
| [示例4](example-04-python.md) | api-test | 集成测试 | Python | Python API 测试代码生成 |

## 快速导航

### 按测试类型

- **集成测试**: [示例1](example-01-api-test.md), [示例4](example-04-python.md)
- **单元测试**: [示例2](example-02-whitebox.md)
- **文档规范化**: [示例3](example-03-normalize.md)

### 按语言

- **Java**: [示例1](example-01-api-test.md), [示例2](example-02-whitebox.md)
- **Python**: [示例4](example-04-python.md)

## 示例结构

每个示例都包含完整流程：

1. **输入** - 源代码或文档
2. **步骤0** - 输入判断与策略选择
3. **步骤1** - 生成测试用例设计文档
4. **检查点1** - 测试用例完整性验证
5. **步骤2** - 生成测试代码
6. **检查点2** - 代码完整性验证
7. **步骤3** - 执行测试
8. **检查点3** - 测试报告输出
9. **步骤4** - 清理询问
