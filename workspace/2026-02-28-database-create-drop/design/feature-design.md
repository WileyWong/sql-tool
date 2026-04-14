---
change_id: 2026-02-28-database-create-drop
requirement_id: RC-020
stage: design
document_type: feature-design
created_at: 2026-02-28
updated_at: 2026-02-28
version: 1.0
---

# RC-020 新增/删除数据库 — 功能设计

## 1. 功能分解

| 编号 | 功能模块 | 子功能 | 优先级 | 说明 |
|------|---------|--------|--------|------|
| F1 | 创建数据库 | F1.1 创建数据库对话框 | P0 | 新增 `CreateDatabaseDialog.vue` 组件 |
| | | F1.2 字符集/排序规则动态加载 | P0 | 复用已有 IPC（`DATABASE_CHARSETS`/`DATABASE_COLLATIONS`），SQL Server 需扩展 `getCollations` |
| | | F1.3 SQL 生成与执行 | P0 | 根据数据库类型生成 CREATE DATABASE SQL，复用 `executeDDL` |
| | | F1.4 创建后刷新连接树 | P0 | 调用 `loadDatabases` + 刷新树节点 |
| F2 | 删除数据库 | F2.1 删除确认对话框（手动输入库名） | P0 | 在 `ConnectionTree.vue` 内实现，参照 `handleDropTable` 模式 |
| | | F2.2 Session 清理 | P0 | 遍历所有 Tab，销毁使用该库的 session |
| | | F2.3 SQL 生成与执行 | P0 | MySQL: `DROP DATABASE`；SQL Server: `SET SINGLE_USER` + `DROP DATABASE` |
| | | F2.4 删除后刷新连接树 | P0 | 刷新数据库列表 + 清空相关 Tab 的数据库选择 |
| F3 | 右键菜单扩展 | F3.1 连接节点菜单增加"创建数据库" | P0 | `connection` 类型已连接时追加菜单项 |
| | | F3.2 数据库节点菜单增加"创建数据库"和"删除数据库" | P0 | `database` 类型追加菜单项 |
| F4 | i18n 国际化 | F4.1 新增菜单/对话框文案 | P0 | zh-CN、en-US、zh-TW 三语言 |

---

## 2. 详细设计

### 2.1 F1 — 创建数据库

#### 2.1.1 交互流程

```
用户右键 connection/database 节点
    → 点击"创建数据库"
    → ConnectionTree 调用 connectionStore.openCreateDatabaseDialog(connectionId, dbType)
    → CreateDatabaseDialog 弹出
    → 对话框 onMounted 并行加载字符集/排序规则元数据
    → 用户填写表单并提交
    → 前端校验 → 生成 SQL → executeDDL 执行
    → 成功: 关闭对话框 + 提示 + 刷新树
    → 失败: 提示错误信息
```

#### 2.1.2 CreateDatabaseDialog.vue 组件设计

**对话框状态管理**：采用与 `TableDesignDialog` 相同的 Store 驱动模式。

在 `connection.ts` Store 中新增：

```ts
// -------- 创建数据库对话框状态 --------
const createDatabaseDialogVisible = ref(false)
const createDatabaseInfo = ref<{
  connectionId: string
  dbType: 'mysql' | 'sqlserver'
} | null>(null)

function openCreateDatabaseDialog(connectionId: string, dbType: 'mysql' | 'sqlserver') {
  createDatabaseInfo.value = { connectionId, dbType }
  createDatabaseDialogVisible.value = true
}

function closeCreateDatabaseDialog() {
  createDatabaseDialogVisible.value = false
  createDatabaseInfo.value = null
}
```

**组件结构**：

```vue
<template>
  <el-dialog v-model="visible" :title="t('database.createDatabase')" width="500px"
    :close-on-click-modal="false" @close="handleClose">
    <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
      <!-- 数据库名称 -->
      <el-form-item :label="t('database.databaseName')" prop="name">
        <el-input v-model="form.name" :maxlength="maxNameLength" />
      </el-form-item>
      <!-- MySQL: 字符集 -->
      <el-form-item v-if="isMysql" :label="t('table.charset')" prop="charset">
        <el-select v-model="form.charset" @change="handleCharsetChange" filterable>
          <el-option v-for="c in charsets" :key="c.charset" :label="c.charset" :value="c.charset" />
        </el-select>
      </el-form-item>
      <!-- 排序规则 -->
      <el-form-item :label="t('table.collation')" prop="collation">
        <el-select v-model="form.collation" filterable clearable>
          <el-option v-for="c in filteredCollations" :key="c.collation" :label="c.collation" :value="c.collation" />
        </el-select>
      </el-form-item>
      <!-- SQL 预览 -->
      <el-form-item :label="t('database.sqlPreview')">
        <div class="sql-preview">{{ generatedSql }}</div>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">{{ t('common.cancel') }}</el-button>
      <el-button type="primary" @click="handleCreate" :loading="executing">{{ t('common.confirm') }}</el-button>
    </template>
  </el-dialog>
</template>
```

**核心逻辑**：

```ts
// 可见性绑定 store
const visible = computed({
  get: () => connectionStore.createDatabaseDialogVisible,
  set: (val) => { if (!val) connectionStore.closeCreateDatabaseDialog() }
})

const info = computed(() => connectionStore.createDatabaseInfo)
const isMysql = computed(() => info.value?.dbType === 'mysql')
const maxNameLength = computed(() => isMysql.value ? 64 : 128)

// 表单数据
const form = reactive({ name: '', charset: '', collation: '' })

// 元数据加载（对话框打开时触发）
watch(visible, async (val) => {
  if (val && info.value) {
    await loadMetadata(info.value.connectionId, info.value.dbType)
  }
})

async function loadMetadata(connectionId: string, dbType: string) {
  if (dbType === 'mysql') {
    const [charsetsRes, collationsRes] = await Promise.all([
      connectionStore.getCharsets(connectionId),
      connectionStore.getCollations(connectionId)
    ])
    // 赋值 charsets、collations，设置默认 charset=utf8mb4
  } else {
    // SQL Server: 加载 collations
    const collationsRes = await connectionStore.getCollations(connectionId)
    // 赋值 collations
  }
}
```

#### 2.1.3 字符集/排序规则加载

**已有基础设施**：

| 层级 | 现有实现 | 需要修改 |
|------|---------|---------|
| IPC 通道 | `DATABASE_CHARSETS`、`DATABASE_COLLATIONS` 已定义 | 无需修改 |
| Preload API | `window.api.database.charsets()`、`window.api.database.collations()` 已暴露 | 无需修改 |
| 主进程 Handler | `database.ts` 中已有 handler，已做 `driver.getCharsets/getCollations` 空检查 | 无需修改 |
| MySQL Driver | `getCharsets()`、`getCollations()` 已实现 | 无需修改 |
| SQL Server Driver | **未实现** `getCollations()` | **需新增** |
| Connection Store | `getCharsets()`、`getCollations()` 已暴露 | 无需修改 |

**SQL Server Driver 扩展**：在 `sqlserver/driver.ts` 中新增 `getCollations` 方法：

```ts
async getCollations(connectionId: string): Promise<{ collation: string; charset: string; isDefault: boolean }[]> {
  const pool = await this.getPoolWithReconnect(connectionId)
  if (!pool) throw new Error('连接不存在')

  const result = await pool.request().query(`SELECT name FROM sys.fn_helpcollations() ORDER BY name`)
  return result.recordset.map((row: { name: string }) => ({
    collation: row.name,
    charset: '',       // SQL Server 无字符集概念
    isDefault: false
  }))
}
```

**缓存策略**：在 `CreateDatabaseDialog.vue` 组件内部使用局部变量缓存。对话框关闭时清空，再次打开时重新加载。无需全局缓存——元数据体积小、请求快，且不同连接的元数据可能不同。

#### 2.1.4 SQL 生成规则

```ts
function generateCreateDatabaseSql(): string {
  const { name, charset, collation } = form
  if (isMysql.value) {
    let sql = `CREATE DATABASE \`${name}\``
    if (charset) sql += `\n  CHARACTER SET ${charset}`
    if (collation) sql += `\n  COLLATE ${collation}`
    return sql + ';'
  } else {
    let sql = `CREATE DATABASE [${name}]`
    if (collation) sql += `\n  COLLATE ${collation}`
    return sql + ';'
  }
}
```

#### 2.1.5 名称校验规则

```ts
const nameValidateRules = {
  required: true,
  validator: (rule, value, callback) => {
    if (!value?.trim()) return callback(new Error(t('database.nameRequired')))
    if (/[\s./\\:*?"<>|]/.test(value)) return callback(new Error(t('database.nameInvalidChars')))
    const max = isMysql.value ? 64 : 128
    if (value.length > max) return callback(new Error(t('database.nameTooLong', { max })))
    callback()
  }
}
```

#### 2.1.6 创建成功后的树刷新

```ts
async function handleCreate() {
  await formRef.value?.validate()
  executing.value = true
  try {
    const sql = generateCreateDatabaseSql()
    const result = await connectionStore.executeDDL(info.value!.connectionId, sql)
    if (result.success) {
      ElMessage.success(t('database.createSuccess'))
      connectionStore.closeCreateDatabaseDialog()
      // 刷新数据库列表
      await connectionStore.loadDatabases(info.value!.connectionId)
      // 通知 ConnectionTree 刷新连接节点（通过 emit 或 EventBus）
    } else {
      ElMessage.error(result.message || t('message.operationFailed'))
    }
  } finally {
    executing.value = false
  }
}
```

**连接树刷新方式**：`CreateDatabaseDialog` 通过 `emit('success', connectionId)` 通知父组件刷新。`ConnectionTree.vue` 监听该事件，重置连接节点的 loaded 状态并展开：

```ts
// ConnectionTree.vue
function handleCreateDatabaseSuccess(connectionId: string) {
  const treeNode = treeRef.value?.getNode(connectionId)
  if (treeNode) {
    treeNode.loaded = false
    treeNode.expand()
  }
}
```

---

### 2.2 F2 — 删除数据库

#### 2.2.1 交互流程

```
用户右键 database 节点
    → 点击"删除数据库"
    → 系统检查是否为系统数据库 → 是则禁止并提示
    → 弹出确认对话框（含 SQL 预览 + 手动输入库名确认）
    → 用户输入库名并确认（大小写不敏感匹配）
    → 遍历所有 Tab，销毁使用该库的 session
    → 清空这些 Tab 的数据库选择
    → 生成 DROP DATABASE SQL → executeDDL 执行
    → 成功: 提示 + 刷新树
    → 失败: 提示错误信息
```

#### 2.2.2 实现位置

直接在 `ConnectionTree.vue` 中实现 `handleDropDatabase` 函数，与 `handleDropTable` 同级。**不需要新建独立对话框组件**——使用 `ElMessageBox.prompt` 即可实现手动输入确认。

#### 2.2.3 系统数据库保护

```ts
const SYSTEM_DATABASES: Record<string, string[]> = {
  mysql: ['mysql', 'information_schema', 'performance_schema', 'sys'],
  sqlserver: ['master', 'tempdb', 'model', 'msdb']
}

function isSystemDatabase(dbType: string, dbName: string): boolean {
  const list = SYSTEM_DATABASES[dbType] || []
  return list.includes(dbName.toLowerCase())
}
```

菜单层面：对系统数据库**不显示**"删除数据库"菜单项。在 `contextMenuItems` computed 中判断：

```ts
case 'database': {
  const items = [
    { key: 'createDatabase', label: t('contextMenu.createDatabase') },
    { key: 'refresh', label: t('contextMenu.refresh') }
  ]
  // 非系统数据库才显示删除选项
  const connInfo = connectionStore.connections.find(c => c.id === node.connectionId)
  const dbType = connInfo?.type || 'mysql'
  if (!isSystemDatabase(dbType, node.label)) {
    items.splice(1, 0, { key: 'dropDatabase', label: t('contextMenu.dropDatabase') })
  }
  return items
}
```

#### 2.2.4 删除确认对话框

使用 `ElMessageBox.prompt` 实现手动输入库名确认：

```ts
async function handleDropDatabase(node: TreeNode) {
  const connInfo = connectionStore.connections.find(c => c.id === node.connectionId)
  const dbType = connInfo?.type || 'mysql'
  const dbName = node.label

  // 1. 生成 SQL 预览
  let dropSql: string
  if (dbType === 'sqlserver') {
    dropSql = `ALTER DATABASE [${dbName}] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;\nDROP DATABASE [${dbName}];`
  } else {
    dropSql = `DROP DATABASE \`${dbName}\`;`
  }

  // 2. 弹出确认框（手动输入数据库名）
  try {
    const { value: inputName } = await ElMessageBox.prompt(
      `<div>
        <p style="color:#F56C6C;font-weight:bold;">⚠️ ${t('database.dropWarning')}</p>
        <p>${t('database.dropConfirmHint', { name: dbName })}</p>
        <div class="sql-preview" style="...">
          <code>${dropSql.replace(/\n/g, '<br>')}</code>
        </div>
      </div>`,
      t('database.dropDatabase'),
      {
        confirmButtonText: t('tree.executeDelete'),
        cancelButtonText: t('common.cancel'),
        type: 'warning',
        dangerouslyUseHTMLString: true,
        inputPattern: new RegExp(`^${escapeRegExp(dbName)}$`, 'i'),  // 大小写不敏感
        inputErrorMessage: t('database.dropNameMismatch')
      }
    )

    // 3. Session 清理（在 DROP 之前）
    await cleanupSessionsForDatabase(node.connectionId!, dbName)

    // 4. 执行 DROP
    const result = await connectionStore.executeDDL(node.connectionId!, dropSql)

    if (result.success) {
      ElMessage.success(t('database.dropSuccess'))
      // 5. 刷新连接树
      await connectionStore.loadDatabases(node.connectionId!)
      const treeNode = treeRef.value?.getNode(node.connectionId!)
      if (treeNode) { treeNode.loaded = false; treeNode.expand() }
    } else {
      ElMessage.error(result.message || t('message.operationFailed'))
    }
  } catch { /* 用户取消 */ }
}
```

#### 2.2.5 Session 清理逻辑

```ts
async function cleanupSessionsForDatabase(connectionId: string, databaseName: string) {
  const tabs = editorStore.tabs
  const promises: Promise<void>[] = []

  for (const tab of tabs) {
    if (tab.connectionId === connectionId &&
        tab.databaseName?.toLowerCase() === databaseName.toLowerCase()) {
      // 销毁 session
      promises.push(
        window.api.session.destroy(tab.id, connectionId).catch(() => {})
      )
      // 清空该 Tab 的数据库选择
      editorStore.clearTabDatabase(tab.id)
    }
  }

  await Promise.all(promises)
}
```

**Editor Store 新增方法**：`clearTabDatabase(tabId: string)`

```ts
function clearTabDatabase(tabId: string) {
  const tab = tabs.value.find(t => t.id === tabId)
  if (tab) {
    tab.databaseName = undefined
  }
}
```

---

### 2.3 F3 — 右键菜单扩展

修改 `ConnectionTree.vue` 中的 `contextMenuItems` computed：

| 节点类型 | 修改前 | 修改后 |
|---------|--------|--------|
| `connection`（已连接） | disconnect, edit, delete, refresh | disconnect, edit, delete, **createDatabase**, refresh |
| `database` | refresh | **createDatabase**, **dropDatabase**（非系统库）, refresh |

---

### 2.4 F4 — i18n 新增 Key

```ts
// 新增 Key（以 en-US 为例）
{
  contextMenu: {
    createDatabase: 'Create Database',
    dropDatabase: 'Drop Database'
  },
  database: {
    createDatabase: 'Create Database',
    databaseName: 'Database Name',
    sqlPreview: 'SQL Preview',
    createSuccess: 'Database created successfully',
    nameRequired: 'Database name is required',
    nameInvalidChars: 'Database name contains invalid characters',
    nameTooLong: 'Database name cannot exceed {max} characters',
    dropDatabase: 'Drop Database',
    dropWarning: 'This will permanently delete the database and all its data. This action cannot be undone!',
    dropConfirmHint: 'Please type "{name}" to confirm:',
    dropNameMismatch: 'Database name does not match',
    dropSuccess: 'Database dropped successfully'
  }
}
```

---

## 3. 涉及文件变更清单

| 文件 | 操作 | 变更内容 |
|------|------|---------|
| `src/renderer/components/CreateDatabaseDialog.vue` | **新增** | 创建数据库对话框组件 |
| `src/renderer/components/ConnectionTree.vue` | 修改 | 右键菜单增加选项 + `handleDropDatabase` + `handleCreateDatabaseSuccess` + `cleanupSessionsForDatabase` |
| `src/renderer/stores/connection.ts` | 修改 | 新增 `createDatabaseDialogVisible`、`createDatabaseInfo`、`openCreateDatabaseDialog`、`closeCreateDatabaseDialog` |
| `src/renderer/stores/editor.ts` | 修改 | 新增 `clearTabDatabase(tabId)` 方法 |
| `src/main/database/sqlserver/driver.ts` | 修改 | 新增 `getCollations()` 方法 |
| `src/renderer/i18n/locales/en-US.ts` | 修改 | 新增 database 相关文案 |
| `src/renderer/i18n/locales/zh-CN.ts` | 修改 | 新增 database 相关文案 |
| `src/renderer/i18n/locales/zh-TW.ts` | 修改 | 新增 database 相关文案 |

**无需修改的文件**（复用已有）：
- `src/shared/constants/index.ts` — IPC 通道已存在
- `src/preload/index.ts` — API 已暴露
- `src/main/ipc/database.ts` — handler 已做空检查，SQL Server 扩展后自动生效

---

## 4. 用例设计

### 4.1 创建数据库

#### UC-1.1 正常用例：MySQL 创建数据库（指定字符集和排序规则）

| 项 | 内容 |
|---|---|
| 前置条件 | 用户已连接 MySQL 服务器 |
| 操作步骤 | 右键连接节点 → 创建数据库 → 输入名称 `test_db`，选择 `utf8mb4`，选择 `utf8mb4_unicode_ci` → 确定 |
| 预期结果 | 执行 `CREATE DATABASE \`test_db\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`，成功提示，树刷新，`test_db` 出现在列表中 |

#### UC-1.2 正常用例：SQL Server 创建数据库（指定排序规则）

| 项 | 内容 |
|---|---|
| 前置条件 | 用户已连接 SQL Server |
| 操作步骤 | 右键连接节点 → 创建数据库 → 输入名称 `test_db`，选择 `Chinese_PRC_CI_AS` → 确定 |
| 预期结果 | 执行 `CREATE DATABASE [test_db] COLLATE Chinese_PRC_CI_AS;`，成功提示，树刷新 |

#### UC-1.3 正常用例：创建数据库（仅填名称，不选字符集/排序规则）

| 项 | 内容 |
|---|---|
| 前置条件 | 用户已连接 MySQL 或 SQL Server |
| 操作步骤 | 右键连接节点 → 创建数据库 → 只输入名称 `simple_db` → 确定 |
| 预期结果 | MySQL: `CREATE DATABASE \`simple_db\`;`（使用服务器默认字符集）；SQL Server: `CREATE DATABASE [simple_db];` |

#### UC-1.4 异常用例：数据库名称为空

| 项 | 内容 |
|---|---|
| 操作 | 不输入名称直接点击确定 |
| 预期结果 | 表单校验失败，提示"数据库名称不能为空" |

#### UC-1.5 异常用例：数据库名称包含非法字符

| 项 | 内容 |
|---|---|
| 操作 | 输入 `test db` （含空格） |
| 预期结果 | 表单校验失败，提示"数据库名称包含非法字符" |

#### UC-1.6 异常用例：数据库已存在

| 项 | 内容 |
|---|---|
| 操作 | 输入已存在的数据库名称 |
| 预期结果 | `executeDDL` 返回失败，提示服务器返回的错误信息（如 `database exists`） |

#### UC-1.7 异常用例：权限不足

| 项 | 内容 |
|---|---|
| 操作 | 用只读用户尝试创建数据库 |
| 预期结果 | `executeDDL` 返回失败，提示权限错误信息 |

#### UC-1.8 边界用例：数据库名称达到最大长度

| 项 | 内容 |
|---|---|
| 操作 | MySQL 输入 64 字符名称 / SQL Server 输入 128 字符名称 |
| 预期结果 | 校验通过，正常创建 |

#### UC-1.9 边界用例：数据库名称超过最大长度

| 项 | 内容 |
|---|---|
| 操作 | MySQL 输入 65 字符名称 |
| 预期结果 | 表单校验失败，提示"数据库名称不能超过 64 个字符" |

#### UC-1.10 边界用例：字符集/排序规则加载失败

| 项 | 内容 |
|---|---|
| 场景 | 服务器查询超时或连接断开 |
| 预期结果 | 下拉列表为空，用户仍可只填名称创建（使用服务器默认值） |

### 4.2 删除数据库

#### UC-2.1 正常用例：MySQL 删除数据库

| 项 | 内容 |
|---|---|
| 前置条件 | 用户已连接 MySQL，`test_db` 存在 |
| 操作步骤 | 右键 `test_db` 节点 → 删除数据库 → 输入 `test_db` → 确认 |
| 预期结果 | 执行 `DROP DATABASE \`test_db\`;`，成功提示，树刷新，`test_db` 从列表消失 |

#### UC-2.2 正常用例：SQL Server 删除数据库

| 项 | 内容 |
|---|---|
| 前置条件 | 用户已连接 SQL Server，`test_db` 存在 |
| 操作步骤 | 右键 `test_db` 节点 → 删除数据库 → 输入 `test_db` → 确认 |
| 预期结果 | 执行 `ALTER DATABASE [test_db] SET SINGLE_USER WITH ROLLBACK IMMEDIATE; DROP DATABASE [test_db];`，成功提示，树刷新 |

#### UC-2.3 正常用例：删除当前编辑器正在使用的数据库

| 项 | 内容 |
|---|---|
| 前置条件 | Tab1 和 Tab3 正在使用 `test_db`，Tab2 使用其他数据库 |
| 操作步骤 | 删除 `test_db` |
| 预期结果 | Tab1 和 Tab3 的 session 被销毁，数据库选择被清空；Tab2 不受影响；DROP 执行成功 |

#### UC-2.4 异常用例：尝试删除系统数据库

| 项 | 内容 |
|---|---|
| 操作 | 右键 `mysql` / `master` 节点 |
| 预期结果 | 右键菜单中**不显示**"删除数据库"选项 |

#### UC-2.5 异常用例：确认输入的库名不匹配

| 项 | 内容 |
|---|---|
| 操作 | 目标库名 `test_db`，用户输入 `wrong_name` |
| 预期结果 | 确认按钮不可用，提示"数据库名称不匹配" |

#### UC-2.6 异常用例：权限不足

| 项 | 内容 |
|---|---|
| 操作 | 用只读用户尝试删除数据库 |
| 预期结果 | `executeDDL` 返回失败，提示权限错误信息 |

#### UC-2.7 边界用例：确认输入大小写不同

| 项 | 内容 |
|---|---|
| 操作 | 目标库名 `Test_DB`，用户输入 `test_db` |
| 预期结果 | 大小写不敏感匹配，确认通过，正常执行删除 |

#### UC-2.8 边界用例：数据库上无活跃 session

| 项 | 内容 |
|---|---|
| 操作 | 删除一个没有 Tab 在使用的数据库 |
| 预期结果 | session 清理步骤跳过（无匹配 Tab），直接执行 DROP |

#### UC-2.9 边界用例：用户取消删除

| 项 | 内容 |
|---|---|
| 操作 | 在确认对话框中点击"取消" |
| 预期结果 | 无任何操作，数据库保持不变 |

---

## 5. 错误处理

| 错误场景 | 错误信息（面向用户） | 处理方式 |
|---------|---------------------|---------|
| 数据库名为空 | "数据库名称不能为空" | 前端表单校验拦截 |
| 名称含非法字符 | "数据库名称包含非法字符" | 前端表单校验拦截 |
| 名称超长 | "数据库名称不能超过 {max} 个字符" | 前端表单校验拦截 |
| 数据库已存在 | 转发服务器错误信息 | `executeDDL` 返回 `result.message` |
| 权限不足 | 转发服务器错误信息 | `executeDDL` 返回 `result.message` |
| 连接断开 | 转发服务器错误信息 | `executeDDL` 返回 `result.message` |
| 字符集/排序规则加载失败 | 下拉为空，不阻塞创建操作 | 降级：用户可不选择，使用服务器默认值 |
| Session 销毁失败 | 静默忽略（`.catch(() => {})`） | 不阻塞 DROP 操作 |
| SQL Server SET SINGLE_USER 失败 | 转发服务器错误信息 | 通常是权限不足，提示用户联系 DBA |

---

## 6. 功能间交互

```
ConnectionTree.vue
    ├──→ connectionStore.openCreateDatabaseDialog()    // 打开对话框
    │       └──→ CreateDatabaseDialog.vue
    │               ├──→ connectionStore.getCharsets()     // 加载字符集
    │               ├──→ connectionStore.getCollations()   // 加载排序规则
    │               ├──→ connectionStore.executeDDL()      // 执行 CREATE
    │               └──→ emit('success', connectionId)     // 通知刷新
    │
    ├──→ handleDropDatabase()                           // 删除数据库
    │       ├──→ editorStore.tabs                       // 遍历 Tab
    │       ├──→ window.api.session.destroy()           // 销毁 session
    │       ├──→ editorStore.clearTabDatabase()         // 清空 Tab 数据库
    │       ├──→ connectionStore.executeDDL()            // 执行 DROP
    │       └──→ connectionStore.loadDatabases()         // 刷新列表
    │
    └──→ connectionStore.loadDatabases()               // 刷新树节点
```

**数据流向**：全部为同步调用（IPC invoke），无异步消息队列。事件通知通过 Vue 的 `emit` 机制传递。
