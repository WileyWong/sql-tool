---
change_id: RC-018
change_title: 多语言支持（国际化 / i18n）
document_type: requirements-breakdown
stage: requirements
created_at: 2026-01-29T11:00:00Z
author: AI Assistant
source_documents:
  - type: requirements_change
    path: requirements/requirements_change/requirements_change_18.md
  - type: clarifications
    path: workspace/RC-018/requirements/clarifications.md
version: 1.0
---

# RC-018 需求拆解文档

## 1. 功能模块拆解

### 1.1 模块总览

```
RC-018 多语言支持
├── M1: 国际化框架搭建
│   ├── F1.1: vue-i18n 配置
│   ├── F1.2: Element Plus 国际化配置
│   └── F1.3: 语言偏好存储
├── M2: 语言包管理
│   ├── F2.1: 简体中文语言包 (zh-CN)
│   ├── F2.2: 繁体中文语言包 (zh-TW)
│   └── F2.3: 英文语言包 (en-US)
├── M3: 设置对话框
│   ├── F3.1: 对话框 UI 组件
│   ├── F3.2: 语言切换逻辑
│   └── F3.3: 菜单入口
├── M4: 主进程国际化
│   ├── F4.1: 菜单国际化
│   └── F4.2: 对话框国际化
└── M5: 组件改造
    ├── F5.1: 现有组件文本替换
    └── F5.2: 验证测试
```

---

## 2. 功能点详细拆解

### M1: 国际化框架搭建

#### F1.1 vue-i18n 配置
| 属性 | 值 |
|------|-----|
| 优先级 | P0 (基础设施) |
| 依赖 | 无 |
| 工作量 | 0.5d |

**功能描述**:
- 安装 vue-i18n 依赖
- 创建 i18n 实例配置
- 集成到 Vue 应用

**验收标准**:
- [ ] vue-i18n 正确安装
- [ ] i18n 实例正确初始化
- [ ] 可通过 `$t()` 函数获取翻译文本

---

#### F1.2 Element Plus 国际化配置
| 属性 | 值 |
|------|-----|
| 优先级 | P0 (基础设施) |
| 依赖 | F1.1 |
| 工作量 | 0.25d |

**功能描述**:
- 配置 Element Plus ConfigProvider
- 语言切换时同步更新 Element Plus 语言

**验收标准**:
- [ ] Element Plus 组件文本随应用语言切换
- [ ] 日期选择器、分页器等组件显示正确语言

---

#### F1.3 语言偏好存储
| 属性 | 值 |
|------|-----|
| 优先级 | P0 (基础设施) |
| 依赖 | F1.1 |
| 工作量 | 0.25d |

**功能描述**:
- localStorage 存储语言偏好 (键名: `sql-tool-locale`)
- 初始化时读取存储的语言偏好
- 语言切换时保存到存储

**验收标准**:
- [ ] 首次启动跟随系统语言
- [ ] 用户切换语言后持久化保存
- [ ] 重启应用保持上次选择的语言

---

### M2: 语言包管理

#### F2.1 简体中文语言包 (zh-CN)
| 属性 | 值 |
|------|-----|
| 优先级 | P0 |
| 依赖 | F1.1 |
| 工作量 | 1d |

**功能描述**:
- 创建简体中文语言包文件
- 覆盖所有界面文本

**语言包结构**:
```
zh-CN
├── common (通用文本)
├── menu (菜单)
├── toolbar (工具栏)
├── connection (连接管理)
├── editor (SQL 编辑器)
├── result (结果面板)
├── settings (设置)
└── dialog (对话框)
```

---

#### F2.2 繁体中文语言包 (zh-TW)
| 属性 | 值 |
|------|-----|
| 优先级 | P1 |
| 依赖 | F2.1 |
| 工作量 | 0.5d |

**功能描述**:
- 基于简体中文自动转换生成
- 可后续人工优化

---

#### F2.3 英文语言包 (en-US)
| 属性 | 值 |
|------|-----|
| 优先级 | P0 |
| 依赖 | F1.1 |
| 工作量 | 1d |

**功能描述**:
- 创建英文语言包文件
- 作为默认回退语言

---

### M3: 设置对话框

#### F3.1 对话框 UI 组件
| 属性 | 值 |
|------|-----|
| 优先级 | P0 |
| 依赖 | F1.1 |
| 工作量 | 0.5d |

**功能描述**:
- 创建 SettingsDialog.vue 组件
- 左侧导航 + 右侧内容布局
- 语言设置单选按钮组
- 重置、应用按钮

**UI 规格**:
- 对话框宽度: 600px
- 对话框高度: 400px
- 左侧导航宽度: 150px

---

#### F3.2 语言切换逻辑
| 属性 | 值 |
|------|-----|
| 优先级 | P0 |
| 依赖 | F3.1, F1.2, F1.3 |
| 工作量 | 0.5d |

**功能描述**:
- 点击"应用"时更新语言设置
- 同步更新 vue-i18n 和 Element Plus 语言
- 保存到 localStorage
- 通知主进程更新菜单语言

---

#### F3.3 菜单入口
| 属性 | 值 |
|------|-----|
| 优先级 | P0 |
| 依赖 | F3.1, F4.1 |
| 工作量 | 0.25d |

**功能描述**:
- 在"文件"菜单中添加"设置"菜单项
- 点击后打开设置对话框

---

### M4: 主进程国际化

#### F4.1 菜单国际化
| 属性 | 值 |
|------|-----|
| 优先级 | P0 |
| 依赖 | F1.3 |
| 工作量 | 0.5d |

**功能描述**:
- 主进程维护语言包副本
- 菜单文本从语言包读取
- 接收渲染进程语言切换通知并重建菜单

---

#### F4.2 对话框国际化
| 属性 | 值 |
|------|-----|
| 优先级 | P1 |
| 依赖 | F4.1 |
| 工作量 | 0.25d |

**功能描述**:
- 关于对话框文本国际化
- 其他系统对话框文本国际化

---

### M5: 组件改造

#### F5.1 现有组件文本替换
| 属性 | 值 |
|------|-----|
| 优先级 | P0 |
| 依赖 | F2.1, F2.3 |
| 工作量 | 2d |

**功能描述**:
- 遍历所有 Vue 组件
- 将硬编码文本替换为 `$t('key')` 调用

**需改造组件列表**:
| 组件 | 文件路径 |
|------|----------|
| App | renderer/App.vue |
| ConfirmSqlDialog | renderer/components/ConfirmSqlDialog.vue |
| ConnectionDialog | renderer/components/ConnectionDialog.vue |
| ConnectionTree | renderer/components/ConnectionTree.vue |
| DataOperationsToolbar | renderer/components/DataOperationsToolbar.vue |
| ExplainView | renderer/components/ExplainView.vue |
| JsonTreeViewer | renderer/components/JsonTreeViewer.vue |
| ResultOverwriteDialog | renderer/components/ResultOverwriteDialog.vue |
| ResultPanel | renderer/components/ResultPanel.vue |
| ResultTable | renderer/components/ResultTable.vue |
| SaveConfirmDialog | renderer/components/SaveConfirmDialog.vue |
| SqlEditor | renderer/components/SqlEditor.vue |
| StatusBar | renderer/components/StatusBar.vue |
| TableDesignDialog | renderer/components/TableDesignDialog.vue |
| TableManageDialog | renderer/components/TableManageDialog.vue |
| Toolbar | renderer/components/Toolbar.vue |
| XmlTreeViewer | renderer/components/XmlTreeViewer.vue |

---

#### F5.2 验证测试
| 属性 | 值 |
|------|-----|
| 优先级 | P0 |
| 依赖 | F5.1 |
| 工作量 | 0.5d |

**功能描述**:
- 验证所有组件文本正确显示
- 验证语言切换即时生效
- 验证语言偏好持久化

---

## 3. 依赖关系图

```
F1.1 vue-i18n 配置
  ├── F1.2 Element Plus 国际化
  ├── F1.3 语言偏好存储
  │     └── F4.1 菜单国际化
  │           └── F4.2 对话框国际化
  ├── F2.1 简体中文语言包
  │     └── F2.2 繁体中文语言包
  ├── F2.3 英文语言包
  └── F3.1 设置对话框 UI
        └── F3.2 语言切换逻辑
              └── F3.3 菜单入口

F2.1 + F2.3 → F5.1 组件改造 → F5.2 验证测试
```

---

## 4. 实施计划

### 阶段 1: 基础设施 (0.5d)
- F1.1 vue-i18n 配置
- F1.2 Element Plus 国际化配置
- F1.3 语言偏好存储

### 阶段 2: 语言包 (2d)
- F2.1 简体中文语言包
- F2.3 英文语言包
- F2.2 繁体中文语言包

### 阶段 3: 设置对话框 (1d)
- F3.1 对话框 UI 组件
- F3.2 语言切换逻辑
- F3.3 菜单入口

### 阶段 4: 主进程国际化 (0.5d)
- F4.1 菜单国际化
- F4.2 对话框国际化

### 阶段 5: 组件改造 (2.5d)
- F5.1 现有组件文本替换
- F5.2 验证测试

**总工作量**: 约 6.5 人天

---

## 变更历史

| 日期 | 变更内容 | 作者 |
|------|----------|------|
| 2026-01-29 | 初始创建 | AI Assistant |
