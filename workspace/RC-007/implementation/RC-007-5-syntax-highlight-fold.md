# RC-007-5: JSON/XML 语法高亮与展开折叠功能

## 变更描述
为查看弹出层的 JSON 和 XML 格式添加语法高亮和展开/折叠节点功能。

## 修改文件
- `src/renderer/components/ResultTable.vue`

## 实现细节

### 1. 新增类型定义
- `JsonNode`: JSON 树节点类型，包含 key、path、type、value、children、length
- `XmlNode`: XML 树节点类型，包含 key、path、type、tagName、attributes、value、children

### 2. 新增组件
- `JsonTreeNode`: 使用 Vue 渲染函数实现的 JSON 树节点组件
- `XmlTreeNode`: 使用 Vue 渲染函数实现的 XML 树节点组件

### 3. 核心功能
- `parseJsonToTree()`: 将 JSON 值解析为树结构
- `parseXmlToTree()`: 使用 DOMParser 将 XML 字符串解析为树结构
- `collectNodePaths()`: 收集所有可折叠节点的路径
- `toggleNode()`: 切换单个节点折叠状态
- `expandAllNodes()`: 全部展开
- `collapseAllNodes()`: 全部折叠

### 4. 语法高亮颜色
**JSON:**
- 键名 (key): `#9cdcfe` (浅蓝色)
- 字符串 (string): `#ce9178` (橙色)
- 数字 (number): `#b5cea8` (浅绿色)
- 布尔值/null: `#569cd6` (蓝色)
- 括号: `#d4d4d4` (白色)

**XML:**
- 标签名: `#569cd6` (蓝色)
- 属性名: `#9cdcfe` (浅蓝色)
- 属性值: `#ce9178` (橙色)
- 标点符号: `#808080` (灰色)
- 文本内容: `#d4d4d4` (白色)
- 注释: `#6a9955` (绿色)

### 5. 交互功能
- 点击三角图标展开/折叠节点
- "全部展开"按钮一键展开所有节点
- "全部折叠"按钮一键折叠所有节点
- 切换格式时自动重置折叠状态

## 效果
JSON 视图示例：
```
▼ {
    "name": "test",
    ▶ "items": [... 3 items]
  }
```

XML 视图示例：
```
▼ <root>
    <item id="1">
      text content
    </item>
  </root>
```
