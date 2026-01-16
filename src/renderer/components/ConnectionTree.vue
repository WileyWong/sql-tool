<template>
  <div class="connection-tree">
    <!-- 工具栏 -->
    <div class="tree-toolbar">
      <el-button size="small" @click="handleNewConnection">
        <el-icon><Plus /></el-icon>
        新建连接
      </el-button>
      <el-button size="small" @click="handleRefresh" :loading="refreshing">
        <el-icon><Refresh /></el-icon>
      </el-button>
    </div>
    
    <!-- 树形结构 -->
    <div class="tree-content">
      <el-tree
        v-if="treeData.length > 0"
        ref="treeRef"
        :data="treeData"
        :props="treeProps"
        node-key="id"
        :expand-on-click-node="false"
        :default-expand-all="false"
        lazy
        :load="loadNode"
        @node-click="handleNodeClick"
        @node-contextmenu="handleContextMenu"
      >
        <template #default="{ node, data }">
          <span 
            class="tree-node" 
            :class="getNodeClass(data)" 
            @dblclick.stop="handleNodeDblClick(data)"
            @mouseenter="treeFilter.handleNodeMouseEnter(data)"
            @mouseleave="treeFilter.handleNodeMouseLeave(data)"
          >
            <el-icon :class="getNodeIconClass(data)">
              <component :is="getNodeIcon(data)" />
            </el-icon>
            <span class="node-label">{{ node.label }}</span>
            <!-- 服务器/数据库节点的过滤功能 -->
            <template v-if="data.type === 'connection' || data.type === 'database'">
              <!-- 过滤输入框模式 -->
              <div v-if="treeFilter.isFilterMode(data)" class="filter-input-wrapper" @click.stop>
                <input
                  :ref="el => treeFilter.setFilterInputRef(data, el)"
                  v-model="treeFilter.getFilterState(data).keyword"
                  class="filter-input"
                  :placeholder="data.type === 'connection' ? '过滤数据库' : '过滤表/视图/函数'"
                  @keydown.enter.stop="handleApplyFilter(data)"
                  @keydown.esc.stop="treeFilter.exitFilterMode(data)"
                  @blur="handleFilterInputBlur(data)"
                />
              </div>
              <!-- 过滤按钮模式 -->
              <span 
                v-else-if="treeFilter.hoveredNodeId.value === data.id || treeFilter.hasActiveFilter(data)"
                class="filter-btn"
                :class="{ active: treeFilter.hasActiveFilter(data) }"
                @click.stop="treeFilter.enterFilterMode(data)"
              >
                {{ treeFilter.hasActiveFilter(data) ? '已过滤' : '过滤' }}
              </span>
            </template>
          </span>
        </template>
      </el-tree>
      
      <!-- 空状态 -->
      <div v-else class="empty-state" @click="handleNewConnection">
        <el-icon :size="48" color="#c0c4cc"><FolderOpened /></el-icon>
        <p>暂无连接</p>
        <p class="hint">点击新建连接</p>
      </div>
    </div>
    
    <!-- 右键菜单 -->
    <div
      v-if="contextMenu.visible"
      class="context-menu"
      :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
    >
      <div 
        v-for="item in contextMenuItems" 
        :key="item.key"
        class="menu-item"
        @click="handleMenuClick(item.key)"
      >
        {{ item.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Refresh, FolderOpened, Connection, Coin, Grid, View, Operation, Folder } from '@element-plus/icons-vue'
import { useConnectionStore } from '../stores/connection'
import { useEditorStore } from '../stores/editor'
import { eventBus } from '../utils/eventBus'
import { useTreeFilter } from '../composables/useTreeFilter'
import type { TreeNode, TreeNodeType } from '@shared/types'
import type Node from 'element-plus/es/components/tree/src/model/node'

const connectionStore = useConnectionStore()
const editorStore = useEditorStore()

// 使用 Composable
const treeFilter = useTreeFilter()

const treeRef = ref()
const refreshing = ref(false)

const treeProps = {
  children: 'children',
  label: 'label',
  isLeaf: 'isLeaf'
}

// 右键菜单状态
const contextMenu = ref({
  visible: false,
  x: 0,
  y: 0,
  node: null as TreeNode | null
})

// 构建树数据 - 只包含连接节点
const treeData = computed<TreeNode[]>(() => {
  return connectionStore.connections.map(conn => ({
    id: conn.id,
    label: conn.name,
    type: 'connection' as TreeNodeType,
    connectionId: conn.id,
    isLeaf: false
  }))
})

// 懒加载节点数据
async function loadNode(node: Node, resolve: (data: TreeNode[]) => void) {
  const data = node.data as TreeNode
  
  // 根节点
  if (node.level === 0) {
    resolve(treeData.value)
    return
  }
  
  // 连接节点 - 加载数据库列表
  if (data.type === 'connection') {
    const conn = connectionStore.connections.find(c => c.id === data.connectionId)
    if (!conn || conn.status !== 'connected') {
      // 需要先连接
      const result = await connectionStore.connect(data.connectionId!)
      if (!result) {
        resolve([])
        return
      }
    }
    
    await connectionStore.loadDatabases(data.connectionId!)
    let databases = connectionStore.getDatabaseNames(data.connectionId!)
    
    // 获取过滤关键字并应用过滤
    const filterKeyword = treeFilter.getConnectionFilterKeyword(data.connectionId!).toLowerCase()
    if (filterKeyword) {
      databases = databases.filter(db => db.toLowerCase().includes(filterKeyword))
    }
    
    resolve(databases.map(dbName => ({
      id: `${data.connectionId}-${dbName}`,
      label: dbName,
      type: 'database' as TreeNodeType,
      connectionId: data.connectionId,
      databaseName: dbName,
      isLeaf: false
    })))
    return
  }
  
  // 数据库节点 - 加载表、视图、函数文件夹
  if (data.type === 'database') {
    resolve([
      {
        id: `${data.connectionId}-${data.databaseName}-tables`,
        label: '表',
        type: 'tables' as TreeNodeType,
        connectionId: data.connectionId,
        databaseName: data.databaseName,
        isLeaf: false
      },
      {
        id: `${data.connectionId}-${data.databaseName}-views`,
        label: '视图',
        type: 'views' as TreeNodeType,
        connectionId: data.connectionId,
        databaseName: data.databaseName,
        isLeaf: false
      },
      {
        id: `${data.connectionId}-${data.databaseName}-functions`,
        label: '函数',
        type: 'functions' as TreeNodeType,
        connectionId: data.connectionId,
        databaseName: data.databaseName,
        isLeaf: false
      }
    ])
    return
  }
  
  // 表文件夹 - 加载表列表
  if (data.type === 'tables') {
    await connectionStore.loadTables(data.connectionId!, data.databaseName!)
    const dbMeta = connectionStore.getDatabaseMeta(data.connectionId!, data.databaseName!)
    
    if (dbMeta) {
      // 获取过滤关键字
      const filterKeyword = treeFilter.getDatabaseFilterKeyword(data.connectionId!, data.databaseName!).toLowerCase()
      let tables = dbMeta.tables
      
      // 应用过滤
      if (filterKeyword) {
        tables = tables.filter(t => t.name.toLowerCase().includes(filterKeyword))
      }
      
      resolve(tables.map(t => ({
        id: `${data.connectionId}-${data.databaseName}-table-${t.name}`,
        label: t.name,
        type: 'table' as TreeNodeType,
        connectionId: data.connectionId,
        databaseName: data.databaseName,
        isLeaf: true,
        data: t
      })))
    } else {
      resolve([])
    }
    return
  }
  
  // 视图文件夹 - 加载视图列表
  if (data.type === 'views') {
    await connectionStore.loadViews(data.connectionId!, data.databaseName!)
    const dbMeta = connectionStore.getDatabaseMeta(data.connectionId!, data.databaseName!)
    
    if (dbMeta) {
      // 获取过滤关键字
      const filterKeyword = treeFilter.getDatabaseFilterKeyword(data.connectionId!, data.databaseName!).toLowerCase()
      let views = dbMeta.views
      
      // 应用过滤
      if (filterKeyword) {
        views = views.filter(v => v.name.toLowerCase().includes(filterKeyword))
      }
      
      resolve(views.map(v => ({
        id: `${data.connectionId}-${data.databaseName}-view-${v.name}`,
        label: v.name,
        type: 'view' as TreeNodeType,
        connectionId: data.connectionId,
        databaseName: data.databaseName,
        isLeaf: true,
        data: v
      })))
    } else {
      resolve([])
    }
    return
  }
  
  // 函数文件夹 - 加载函数列表
  if (data.type === 'functions') {
    await connectionStore.loadFunctions(data.connectionId!, data.databaseName!)
    const dbMeta = connectionStore.getDatabaseMeta(data.connectionId!, data.databaseName!)
    
    if (dbMeta) {
      // 获取过滤关键字
      const filterKeyword = treeFilter.getDatabaseFilterKeyword(data.connectionId!, data.databaseName!).toLowerCase()
      let functions = dbMeta.functions
      
      // 应用过滤
      if (filterKeyword) {
        functions = functions.filter(f => f.name.toLowerCase().includes(filterKeyword))
      }
      
      resolve(functions.map(f => ({
        id: `${data.connectionId}-${data.databaseName}-func-${f.name}`,
        label: f.name,
        type: 'function' as TreeNodeType,
        connectionId: data.connectionId,
        databaseName: data.databaseName,
        isLeaf: true,
        data: f
      })))
    } else {
      resolve([])
    }
    return
  }
  
  // 默认返回空
  resolve([])
}

// 右键菜单项
const contextMenuItems = computed(() => {
  const node = contextMenu.value.node
  if (!node) return []
  
  const conn = connectionStore.connections.find(c => c.id === node.connectionId)
  const isConnected = conn?.status === 'connected'
  
  switch (node.type) {
    case 'connection':
      return isConnected
        ? [
            { key: 'disconnect', label: '断开连接' },
            { key: 'edit', label: '编辑连接' },
            { key: 'delete', label: '删除连接' },
            { key: 'refresh', label: '刷新' }
          ]
        : [
            { key: 'connect', label: '连接' },
            { key: 'edit', label: '编辑连接' },
            { key: 'delete', label: '删除连接' }
          ]
    case 'database':
    case 'views':
    case 'functions':
      return [{ key: 'refresh', label: '刷新' }]
    case 'tables':
      return [
        { key: 'createTable', label: '创建表' },
        { key: 'refresh', label: '刷新' }
      ]
    case 'table':
      return [
        { key: 'query100', label: '查询前100行' },
        { key: 'manage', label: '管理' },
        { key: 'editTable', label: '修改表' },
        { key: 'dropTable', label: '删除表' }
      ]
    default:
      return []
  }
})

// 获取节点图标
function getNodeIcon(data: TreeNode) {
  switch (data.type) {
    case 'connection': return Connection
    case 'database': return Coin
    case 'tables': return Folder
    case 'table': return Grid
    case 'views': return Folder
    case 'view': return View
    case 'functions': return Folder
    case 'function': return Operation
    default: return FolderOpened
  }
}

// 获取节点图标样式
function getNodeIconClass(data: TreeNode) {
  if (data.type === 'connection') {
    const conn = connectionStore.connections.find(c => c.id === data.connectionId)
    if (conn?.status === 'connected') return 'connected'
    if (conn?.status === 'connecting') return 'connecting'
    if (conn?.status === 'error') return 'error'
  }
  return ''
}

// 获取节点样式类（用于高亮当前选中的服务器和数据库）
function getNodeClass(data: TreeNode) {
  const classes: string[] = []
  
  // 当前选中的服务器
  if (data.type === 'connection' && data.connectionId === connectionStore.currentConnectionId) {
    classes.push('current-connection')
  }
  
  // 当前选中的数据库
  if (data.type === 'database' && 
      data.connectionId === connectionStore.currentConnectionId && 
      data.databaseName === connectionStore.currentDatabase) {
    classes.push('current-database')
  }
  
  return classes
}

// 新建连接
function handleNewConnection() {
  connectionStore.openNewConnectionDialog()
}

// 刷新
async function handleRefresh() {
  refreshing.value = true
  await connectionStore.loadConnections()
  refreshing.value = false
}

// 节点点击
async function handleNodeClick(data: TreeNode) {
  if (data.type === 'connection') {
    const conn = connectionStore.connections.find(c => c.id === data.connectionId)
    if (conn?.status !== 'connected') {
      // 点击连接
      await connectionStore.connect(data.connectionId!)
    }
    connectionStore.setCurrentConnection(data.connectionId!)
  }
}

// 节点双击 - 用于切换数据库
async function handleNodeDblClick(data: TreeNode) {
  if (data.type === 'database' && data.connectionId && data.databaseName) {
    // 双击数据库名，切换当前查询的数据库
    connectionStore.setCurrentConnection(data.connectionId)
    connectionStore.setCurrentDatabase(data.databaseName)
    editorStore.updateTabConnection(data.connectionId, data.databaseName)
    ElMessage.success(`已切换到数据库: ${data.databaseName}`)
  }
}

// === 过滤功能相关方法 ===

// 应用过滤（包装器）
function handleApplyFilter(data: TreeNode) {
  const hasChanged = treeFilter.applyFilter(data)
  if (hasChanged) {
    // 根据节点类型刷新子节点
    if (data.type === 'connection') {
      refreshConnectionChildren(data)
    } else if (data.type === 'database') {
      refreshDatabaseChildren(data)
    }
  }
}

// 处理输入框失焦（包装器）
function handleFilterInputBlur(data: TreeNode) {
  const needRefresh = treeFilter.handleFilterInputBlur(data)
  if (needRefresh) {
    // 根据节点类型刷新子节点
    if (data.type === 'connection') {
      refreshConnectionChildren(data)
    } else if (data.type === 'database') {
      refreshDatabaseChildren(data)
    }
  }
}

// 刷新连接下的数据库列表
function refreshConnectionChildren(data: TreeNode) {
  const connNode = treeRef.value?.getNode(data.id)
  if (connNode && connNode.loaded) {
    connNode.loaded = false
    connNode.expand()
  }
}

// 刷新数据库下的子节点
function refreshDatabaseChildren(data: TreeNode) {
  const dbNodeId = data.id
  const dbNode = treeRef.value?.getNode(dbNodeId)
  if (dbNode && dbNode.loaded) {
    // 刷新表、视图、函数文件夹
    const childTypes = ['tables', 'views', 'functions']
    for (const type of childTypes) {
      const childNodeId = `${data.connectionId}-${data.databaseName}-${type}`
      const childNode = treeRef.value?.getNode(childNodeId)
      if (childNode && childNode.loaded) {
        childNode.loaded = false
        childNode.expand()
      }
    }
  }
}

// 右键菜单
function handleContextMenu(event: MouseEvent, data: TreeNode) {
  event.preventDefault()
  contextMenu.value = {
    visible: true,
    x: event.clientX,
    y: event.clientY,
    node: data
  }
}

// 菜单点击
async function handleMenuClick(key: string) {
  const node = contextMenu.value.node
  if (!node) return
  
  contextMenu.value.visible = false
  
  switch (key) {
    case 'connect':
      await connectionStore.connect(node.connectionId!)
      break
    case 'disconnect':
      await connectionStore.disconnect(node.connectionId!)
      break
    case 'edit':
      const conn = connectionStore.connections.find(c => c.id === node.connectionId)
      if (conn) {
        connectionStore.openEditConnectionDialog(conn)
      }
      break
    case 'delete':
      ElMessageBox.confirm('确定要删除此连接吗？', '删除连接', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await connectionStore.deleteConnection(node.connectionId!)
        ElMessage.success('删除成功')
      }).catch(() => {})
      break
    case 'refresh':
      // 刷新节点
      const treeNode = treeRef.value?.getNode(node.id)
      if (treeNode) {
        treeNode.loaded = false
        treeNode.expand()
      }
      // 发送刷新事件通知
      eventBus.emit('connectionTree:refresh', {
        connectionId: node.connectionId!,
        databaseName: node.databaseName
      })
      break
    case 'query100':
      const sql = `SELECT * FROM \`${node.databaseName}\`.\`${node.label}\` LIMIT 100`
      editorStore.createTab(sql)
      break
    case 'manage':
      // 打开表管理对话框
      connectionStore.openTableManageDialog(node.connectionId!, node.databaseName!, node.label)
      break
    case 'createTable':
      // 打开创建表对话框
      connectionStore.openCreateTableDialog(node.connectionId!, node.databaseName!)
      break
    case 'editTable':
      // 打开修改表对话框
      connectionStore.openEditTableDialog(node.connectionId!, node.databaseName!, node.label)
      break
    case 'dropTable':
      // 删除表
      handleDropTable(node)
      break
  }
}

// 点击其他地方关闭菜单
function closeContextMenu() {
  contextMenu.value.visible = false
}

// 删除表
async function handleDropTable(node: TreeNode) {
  const sql = `DROP TABLE \`${node.databaseName}\`.\`${node.label}\`;`
  
  try {
    await ElMessageBox.confirm(
      `<div>
        <p style="margin-bottom: 12px;">确定要删除表 <strong>${node.databaseName}.${node.label}</strong> 吗？</p>
        <p style="color: #f56c6c; margin-bottom: 12px;">此操作不可恢复！</p>
        <pre style="background: #1e1e1e; padding: 12px; border-radius: 4px; color: #d4d4d4; font-size: 12px;">${sql}</pre>
      </div>`,
      '删除表',
      {
        confirmButtonText: '执行删除',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }
    )
    
    const result = await connectionStore.executeDDL(node.connectionId!, sql)
    
    if (result.success) {
      ElMessage.success('表已删除')
      // 刷新表列表
      await connectionStore.loadTables(node.connectionId!, node.databaseName!)
      // 刷新树节点
      const tablesNodeId = `${node.connectionId}-${node.databaseName}-tables`
      const treeNode = treeRef.value?.getNode(tablesNodeId)
      if (treeNode) {
        treeNode.loaded = false
        treeNode.expand()
      }
    } else {
      ElMessage.error(result.message || '删除失败')
    }
  } catch {
    // 用户取消
  }
}

onMounted(async () => {
  await connectionStore.loadConnections()
  document.addEventListener('click', closeContextMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', closeContextMenu)
})
</script>

<style scoped>
.connection-tree {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #252526;
}

.tree-toolbar {
  padding: 8px;
  border-bottom: 1px solid #555;
  display: flex;
  gap: 8px;
}

.tree-toolbar :deep(.el-button) {
  background: #3c3c3c;
  border-color: #555;
  color: #d4d4d4;
}

.tree-toolbar :deep(.el-button:hover) {
  background: #505050;
  border-color: #0e639c;
  color: #fff;
}

.tree-content {
  flex: 1;
  overflow: auto;
  padding: 8px;
}

.tree-content :deep(.el-tree) {
  background: transparent;
  color: #d4d4d4;
}

.tree-content :deep(.el-tree-node__content) {
  background: transparent;
}

.tree-content :deep(.el-tree-node__content:hover) {
  background: #2a2d2e;
}

.tree-content :deep(.el-tree-node.is-current > .el-tree-node__content) {
  background: #094771;
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 6px;
}

.tree-node .el-icon {
  color: #909399;
}

.tree-node .el-icon.connected {
  color: #4ec9b0;
}

.tree-node .el-icon.connecting {
  color: #e6a23c;
}

.tree-node .el-icon.error {
  color: #f48771;
}

.node-label {
  font-size: 13px;
}

/* 当前选中的服务器高亮 */
.tree-node.current-connection .node-label {
  color: #4ec9b0;
  font-weight: 600;
}

/* 当前选中的数据库高亮 */
.tree-node.current-database {
  background: rgba(78, 201, 176, 0.15);
  border-radius: 3px;
  padding: 2px 6px;
  margin: -2px -6px;
}

.tree-node.current-database .node-label {
  color: #4ec9b0;
  font-weight: 600;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  cursor: pointer;
  color: #909399;
}

.empty-state:hover {
  color: #4ec9b0;
}

.empty-state p {
  margin: 8px 0 0;
}

.empty-state .hint {
  font-size: 12px;
  color: #666;
}

.context-menu {
  position: fixed;
  background: #3c3c3c;
  border: 1px solid #555;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 9999;
  min-width: 150px;
  padding: 4px 0;
}

.menu-item {
  padding: 8px 16px;
  cursor: pointer;
  font-size: 13px;
  color: #d4d4d4;
}

.menu-item:hover {
  background: #094771;
}

/* 过滤按钮样式 */
.filter-btn {
  margin-left: auto;
  padding: 2px 8px;
  font-size: 11px;
  color: #888;
  cursor: pointer;
  border-radius: 3px;
  transition: all 0.2s;
}

.filter-btn:hover {
  color: #4ec9b0;
  background: rgba(78, 201, 176, 0.15);
}

.filter-btn.active {
  color: #4ec9b0;
  background: rgba(78, 201, 176, 0.2);
}

/* 过滤输入框样式 */
.filter-input-wrapper {
  margin-left: auto;
  flex-shrink: 0;
}

.filter-input {
  width: 100px;
  height: 20px;
  padding: 0 6px;
  font-size: 11px;
  color: #d4d4d4;
  background: #3c3c3c;
  border: 1px solid #0e639c;
  border-radius: 3px;
  outline: none;
}

.filter-input::placeholder {
  color: #666;
}

.filter-input:focus {
  border-color: #4ec9b0;
}
</style>
