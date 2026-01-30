---
change_id: RC-018
change_title: 多语言支持（国际化 / i18n）
document_type: technical-design
stage: design
created_at: 2026-01-29T11:30:00Z
author: AI Assistant
source_documents:
  - type: requirements_change
    path: requirements/requirements_change/requirements_change_18.md
  - type: clarifications
    path: workspace/RC-018/requirements/clarifications.md
  - type: breakdown
    path: workspace/RC-018/requirements/breakdown.md
version: 1.0
---

# RC-018 功能设计文档

## 1. 技术方案概述

### 1.1 技术选型

| 组件 | 技术方案 | 版本 | 说明 |
|------|----------|------|------|
| 国际化框架 | vue-i18n | ^9.x | Vue 3 官方推荐 |
| UI 组件国际化 | Element Plus 内置 | - | 配合 ConfigProvider |
| 存储 | localStorage | - | 浏览器原生 API |
| 主进程国际化 | 自定义实现 | - | IPC 通信同步 |

### 1.2 架构设计

```
┌─────────────────────────────────────────────────────────────┐
│                        Electron App                          │
├─────────────────────────────────────────────────────────────┤
│  Main Process                                                │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  i18n-main.ts                                           ││
│  │  ├── 语言包 (menu, dialog)                              ││
│  │  ├── getCurrentLocale()                                 ││
│  │  ├── setLocale()                                        ││
│  │  └── t() 翻译函数                                       ││
│  └─────────────────────────────────────────────────────────┘│
│                           ↑ IPC                              │
│                           │ LOCALE_CHANGED                   │
│                           ↓                                  │
│  Renderer Process                                            │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  i18n/index.ts                                          ││
│  │  ├── vue-i18n 实例                                      ││
│  │  ├── 语言包 (zh-CN, zh-TW, en-US)                       ││
│  │  └── useLocale() composable                             ││
│  └─────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────┐│
│  │  Element Plus ConfigProvider                            ││
│  │  └── 语言包自动切换                                     ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## 2. 详细设计

### 2.1 文件结构

```
src/
├── renderer/
│   ├── i18n/
│   │   ├── index.ts              # i18n 实例和初始化
│   │   ├── locales/
│   │   │   ├── zh-CN.ts          # 简体中文
│   │   │   ├── zh-TW.ts          # 繁体中文
│   │   │   └── en-US.ts          # 英文
│   │   └── types.ts              # 类型定义
│   ├── components/
│   │   └── SettingsDialog.vue    # 设置对话框 (新增)
│   └── composables/
│       └── useLocale.ts          # 语言切换 composable (新增)
├── main/
│   ├── i18n/
│   │   ├── index.ts              # 主进程 i18n
│   │   └── locales/
│   │       ├── zh-CN.ts          # 简体中文 (菜单/对话框)
│   │       ├── zh-TW.ts          # 繁体中文 (菜单/对话框)
│   │       └── en-US.ts          # 英文 (菜单/对话框)
│   └── menu.ts                   # 菜单 (修改)
└── shared/
    └── constants/
        └── index.ts              # IPC 通道常量 (修改)
```

### 2.2 渲染进程国际化

#### 2.2.1 i18n 实例配置

**文件**: `src/renderer/i18n/index.ts`

```typescript
import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN'
import zhTW from './locales/zh-TW'
import enUS from './locales/en-US'

const STORAGE_KEY = 'sql-tool-locale'
const SUPPORTED_LOCALES = ['zh-CN', 'zh-TW', 'en-US'] as const
type SupportedLocale = typeof SUPPORTED_LOCALES[number]

// 检测系统语言
function detectSystemLocale(): SupportedLocale {
  const systemLocale = navigator.language
  
  // 智能匹配
  if (systemLocale.startsWith('zh-TW') || systemLocale.startsWith('zh-HK')) {
    return 'zh-TW'
  }
  if (systemLocale.startsWith('zh')) {
    return 'zh-CN'
  }
  if (systemLocale.startsWith('en')) {
    return 'en-US'
  }
  
  return 'en-US' // 默认回退
}

// 获取初始语言
function getInitialLocale(): SupportedLocale {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && SUPPORTED_LOCALES.includes(stored as SupportedLocale)) {
    return stored as SupportedLocale
  }
  return detectSystemLocale()
}

export const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: getInitialLocale(),
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': zhCN,
    'zh-TW': zhTW,
    'en-US': enUS
  }
})
```

#### 2.2.2 语言包结构

**文件**: `src/renderer/i18n/locales/zh-CN.ts`

```typescript
export default {
  common: {
    confirm: '确定',
    cancel: '取消',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    close: '关闭',
    reset: '重置',
    apply: '应用',
    loading: '加载中...',
    success: '成功',
    error: '错误',
    warning: '警告',
    info: '提示'
  },
  menu: {
    file: '文件',
    edit: '编辑',
    help: '帮助',
    newConnection: '新建连接',
    newQuery: '新建查询',
    openFile: '打开文件',
    save: '保存',
    saveAs: '另存为',
    recentFiles: '最近打开的文件',
    noRecentFiles: '(无)',
    settings: '设置',
    exit: '退出',
    about: '关于'
  },
  settings: {
    title: '设置',
    language: '语言',
    interfaceLanguage: '界面语言',
    languageOptions: {
      'zh-CN': '简体中文',
      'zh-TW': '繁體中文',
      'en-US': 'English'
    }
  },
  connection: {
    title: '连接管理',
    newConnection: '新建连接',
    editConnection: '编辑连接',
    connectionName: '连接名称',
    host: '主机',
    port: '端口',
    username: '用户名',
    password: '密码',
    database: '数据库',
    testConnection: '测试连接',
    testSuccess: '连接成功',
    testFailed: '连接失败',
    connecting: '连接中...',
    connected: '已连接',
    disconnected: '已断开',
    disconnect: '断开连接',
    refresh: '刷新',
    tables: '表',
    views: '视图',
    functions: '函数',
    procedures: '存储过程'
  },
  toolbar: {
    execute: '执行',
    executeSelected: '执行选中',
    stop: '停止',
    format: '格式化',
    newQuery: '新建查询',
    saveQuery: '保存查询'
  },
  editor: {
    untitled: '无标题',
    modified: '已修改',
    placeholder: '在此输入 SQL 语句...'
  },
  result: {
    rows: '行',
    affected: '受影响的行数',
    executionTime: '执行时间',
    noData: '无数据',
    exportExcel: '导出 Excel',
    copyRow: '复制行',
    copyCell: '复制单元格',
    copyAsInsert: '复制为 INSERT',
    copyAsUpdate: '复制为 UPDATE',
    editMode: '编辑模式',
    addRow: '添加行',
    deleteRow: '删除行',
    commitChanges: '提交更改',
    rollbackChanges: '回滚更改',
    rowsSelected: '已选择 {count} 行',
    confirmDelete: '确定要删除选中的 {count} 行吗？',
    explain: '执行计划'
  },
  dialog: {
    confirmSql: {
      title: '确认执行 SQL',
      message: '即将执行以下 SQL 语句：',
      affectedRows: '将影响 {count} 行数据'
    },
    saveConfirm: {
      title: '保存更改',
      message: '文件已修改，是否保存？',
      save: '保存',
      dontSave: '不保存'
    },
    about: {
      title: '关于 SQL Tool',
      version: '版本'
    }
  },
  table: {
    design: '设计表',
    manage: '管理表',
    columns: '列',
    indexes: '索引',
    foreignKeys: '外键',
    columnName: '列名',
    dataType: '数据类型',
    length: '长度',
    nullable: '允许空值',
    defaultValue: '默认值',
    comment: '注释',
    primaryKey: '主键',
    autoIncrement: '自增',
    addColumn: '添加列',
    deleteColumn: '删除列',
    createTable: '创建表',
    alterTable: '修改表',
    dropTable: '删除表',
    truncateTable: '清空表',
    confirmDrop: '确定要删除表 {table} 吗？此操作不可恢复！',
    confirmTruncate: '确定要清空表 {table} 的所有数据吗？'
  },
  status: {
    ready: '就绪',
    executing: '执行中...',
    connected: '已连接到 {server}',
    disconnected: '未连接',
    rowCount: '{count} 行'
  },
  error: {
    connectionFailed: '连接失败：{message}',
    queryFailed: '查询失败：{message}',
    saveFailed: '保存失败：{message}',
    loadFailed: '加载失败：{message}',
    unknown: '未知错误'
  }
}
```

#### 2.2.3 useLocale Composable

**文件**: `src/renderer/composables/useLocale.ts`

```typescript
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const STORAGE_KEY = 'sql-tool-locale'
type SupportedLocale = 'zh-CN' | 'zh-TW' | 'en-US'

export function useLocale() {
  const { locale, t } = useI18n()
  
  const currentLocale = computed({
    get: () => locale.value as SupportedLocale,
    set: (val: SupportedLocale) => {
      locale.value = val
      localStorage.setItem(STORAGE_KEY, val)
      // 通知主进程更新菜单语言
      window.api.setLocale(val)
    }
  })
  
  const localeOptions = [
    { value: 'zh-CN', label: '简体中文' },
    { value: 'zh-TW', label: '繁體中文' },
    { value: 'en-US', label: 'English' }
  ]
  
  return {
    currentLocale,
    localeOptions,
    t
  }
}
```

### 2.3 设置对话框

**文件**: `src/renderer/components/SettingsDialog.vue`

**布局设计**:
```
┌─────────────────────────────────────────────────────┐
│  设置                                          [×] │
├─────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────────────────────────────┐ │
│  │          │  │                                  │ │
│  │  语言    │  │  界面语言                        │ │
│  │  (选中)  │  │                                  │ │
│  │          │  │  ○ 简体中文                      │ │
│  │          │  │  ○ 繁體中文                      │ │
│  │          │  │  ● English                       │ │
│  │          │  │                                  │ │
│  └──────────┘  └──────────────────────────────────┘ │
│                              [ 重置 ]  [ 应用 ]    │
└─────────────────────────────────────────────────────┘
```

**交互逻辑**:
1. 打开对话框时，读取当前语言设置
2. 用户选择语言（单选按钮）
3. 点击"应用"：保存设置，即时切换语言，关闭对话框
4. 点击"重置"：恢复到当前生效的语言
5. 点击"×"或对话框外部：不保存，关闭对话框

### 2.4 主进程国际化

#### 2.4.1 IPC 通道

**新增常量**:
```typescript
// src/shared/constants/index.ts
export const IpcChannels = {
  // ... 现有通道
  LOCALE_CHANGED: 'locale:changed',
  LOCALE_GET: 'locale:get',
  MENU_OPEN_SETTINGS: 'menu:open-settings'
}
```

#### 2.4.2 主进程 i18n

**文件**: `src/main/i18n/index.ts`

```typescript
import zhCN from './locales/zh-CN'
import zhTW from './locales/zh-TW'
import enUS from './locales/en-US'

type SupportedLocale = 'zh-CN' | 'zh-TW' | 'en-US'

const messages = {
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  'en-US': enUS
}

let currentLocale: SupportedLocale = 'zh-CN'

export function setLocale(locale: SupportedLocale) {
  currentLocale = locale
}

export function getLocale(): SupportedLocale {
  return currentLocale
}

export function t(key: string): string {
  const keys = key.split('.')
  let result: any = messages[currentLocale]
  
  for (const k of keys) {
    result = result?.[k]
  }
  
  return result ?? key
}
```

#### 2.4.3 菜单更新

**修改**: `src/main/menu.ts`

- 使用 `t()` 函数替换硬编码文本
- 监听 `LOCALE_CHANGED` 事件重建菜单
- 添加"设置"菜单项

---

## 3. Element Plus 国际化配置

**修改**: `src/renderer/App.vue`

```vue
<template>
  <el-config-provider :locale="elementLocale">
    <!-- 现有内容 -->
  </el-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import zhTw from 'element-plus/es/locale/lang/zh-tw'
import en from 'element-plus/es/locale/lang/en'

const { locale } = useI18n()

const elementLocaleMap = {
  'zh-CN': zhCn,
  'zh-TW': zhTw,
  'en-US': en
}

const elementLocale = computed(() => {
  return elementLocaleMap[locale.value as keyof typeof elementLocaleMap] || en
})
</script>
```

---

## 4. Preload 脚本更新

**修改**: `src/preload/index.ts`

新增 API:
```typescript
contextBridge.exposeInMainWorld('api', {
  // ... 现有 API
  setLocale: (locale: string) => ipcRenderer.invoke(IpcChannels.LOCALE_CHANGED, locale),
  getLocale: () => ipcRenderer.invoke(IpcChannels.LOCALE_GET)
})
```

---

## 5. 类型定义更新

**修改**: `src/renderer/env.d.ts`

```typescript
interface Window {
  api: {
    // ... 现有类型
    setLocale: (locale: string) => Promise<void>
    getLocale: () => Promise<string>
  }
}
```

---

## 6. 组件改造示例

以 `ConfirmSqlDialog.vue` 为例:

**改造前**:
```vue
<template>
  <el-dialog title="确认执行" ...>
    <span>确定要执行以下 SQL 吗？</span>
    <el-button>取消</el-button>
    <el-button type="primary">确定</el-button>
  </el-dialog>
</template>
```

**改造后**:
```vue
<template>
  <el-dialog :title="$t('dialog.confirmSql.title')" ...>
    <span>{{ $t('dialog.confirmSql.message') }}</span>
    <el-button>{{ $t('common.cancel') }}</el-button>
    <el-button type="primary">{{ $t('common.confirm') }}</el-button>
  </el-dialog>
</template>
```

---

## 7. 变更历史

| 日期 | 变更内容 | 作者 |
|------|----------|------|
| 2026-01-29 | 初始创建 | AI Assistant |
