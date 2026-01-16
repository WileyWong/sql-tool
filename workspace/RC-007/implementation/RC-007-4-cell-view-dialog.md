# RC-007-4 结果表格查看弹出层

## 需求
- 右键点击结果表中的单元格，显示"查看"菜单
- 点击后弹出层显示内容
- 上方有选项：原始值、JSON、XML
- 按 ESC 可退出，或点击"关闭"按钮退出

## 修改文件

### src/renderer/components/ResultTable.vue

1. **模板修改**：
   - 添加 `@contextmenu.prevent` 阻止默认右键菜单
   - 添加 `@cell-contextmenu` 事件处理右键点击
   - 新增右键菜单 DOM
   - 新增查看弹出层 `el-dialog`

2. **新增状态**：
   - `contextMenu`: 右键菜单状态（visible, x, y, cellValue）
   - `viewDialog`: 查看弹出层状态（visible, value, format）

3. **新增计算属性**：
   - `formattedViewContent`: 根据格式选项格式化内容

4. **新增函数**：
   - `formatAsJson`: JSON 格式化
   - `formatAsXml`: XML 格式化
   - `handleCellContextMenu`: 处理右键菜单
   - `handleViewCell`: 打开查看弹出层
   - `closeViewDialog`: 关闭弹出层
   - `closeContextMenu`: 关闭右键菜单
   - `handleClickOutside`: 点击外部关闭右键菜单

5. **样式**：
   - 右键菜单样式（固定定位、暗色主题）
   - 查看弹出层样式（代码字体、暗色主题）
   - el-dialog 和 el-radio-button 样式覆盖

## 功能说明

### 右键菜单
- 右键点击单元格显示菜单
- 菜单包含"查看"选项
- 点击其他区域自动关闭

### 查看弹出层
- 三种格式选项：原始值、JSON、XML
- JSON 格式化：解析并缩进显示
- XML 格式化：解析并缩进显示
- 解析失败时显示错误提示
- 支持 ESC 键关闭
