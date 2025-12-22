# 文件索引

> **模块路径**: {{SOURCE_DIR}}  
> **文档目录**: {{DOC_DIR}}  
> **创建时间**: {{CREATE_TIME}}  
> **最后更新**: {{LAST_UPDATE}}

---

## 📊 统计信息

| 指标 | 数值 |
|------|------|
| 总文件数 | {{TOTAL_FILES}} |
| 已生成文档 | {{COMPLETED}} |
| 待处理文件 | {{PENDING}} |
| 完成进度 | {{PROGRESS}}% |

---

## 📋 文件清单

| 序号 | 代码文件路径 | 文件大小 | 文档文件路径 | 文档大小 | 状态 |
|------|--------------|----------|--------------|----------|------|
| 1 | controller/UserController.java | 3.2KB | controller/UserController.md | 5.8KB | 已生成 |
| 2 | controller/RoleController.java | 2.8KB | controller/RoleController.md | - | 待创建 |
| 3 | service/UserService.java | 4.5KB | service/UserService.md | - | 待创建 |
| 4 | service/impl/UserServiceImpl.java | 8.9KB | service/impl/UserServiceImpl.md | - | 待创建 |
| ... | ... | ... | ... | ... | ... |

**状态说明**：
- **待创建** - 尚未生成文档
- **已生成** - 文档已生成并保存

**路径说明**：
- 代码文件路径：相对于 `{{SOURCE_DIR}}`
- 文档文件路径：相对于 `{{DOC_DIR}}`

---

## ⚠️ 更新规则

**严格遵守以下规则**：

1. **绝对不可变**：
   - ❌ 不得增加记录
   - ❌ 不得删除记录
   - ❌ 不得修改序号
   - ❌ 不得修改"代码文件路径"和"文件大小"

2. **允许更新**：
   - ✅ 更新"文档文件路径"（从空到实际路径）
   - ✅ 更新"文档大小"（从空到实际大小）
   - ✅ 更新"状态"（从"待创建"到"已生成"）

3. **更新时机**：
   - 每生成一个文档后立即更新对应记录
   - 更新完成后保存文件

4. **格式要求**：
   - 保持 Markdown 表格格式
   - 保持列对齐
   - 按序号升序排列
