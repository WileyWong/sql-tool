import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ConnectionConfig, ConnectionInfo, ConnectionStatus, DatabaseMeta, TableMeta, ColumnMeta, ViewMeta, FunctionMeta } from '@shared/types'

export const useConnectionStore = defineStore('connection', () => {
  // 连接列表
  const connections = ref<ConnectionInfo[]>([])
  
  // 当前选中的连接 ID
  const currentConnectionId = ref<string | null>(null)
  
  // 当前选中的数据库名
  const currentDatabase = ref<string | null>(null)
  
  // 数据库结构缓存 Map<connectionId, Map<database, DatabaseMeta>>
  const databaseCache = ref<Map<string, Map<string, DatabaseMeta>>>(new Map())
  
  // 对话框状态
  const dialogVisible = ref(false)
  const editingConnection = ref<ConnectionConfig | null>(null)
  
  // 当前连接
  const currentConnection = computed(() => {
    if (!currentConnectionId.value) return null
    return connections.value.find(c => c.id === currentConnectionId.value) || null
  })
  
  // 加载连接列表
  async function loadConnections() {
    const list = await window.api.connection.list()
    connections.value = list.map(c => ({
      ...c,
      status: 'disconnected' as ConnectionStatus
    }))
  }
  
  // 保存连接
  async function saveConnection(form: { name: string; host: string; port: number; username: string; password: string; database?: string }, id?: string) {
    const result = await window.api.connection.save(form, id)
    if (result.success && result.connections) {
      connections.value = result.connections.map(c => {
        const existing = connections.value.find(e => e.id === c.id)
        return {
          ...c,
          status: existing?.status || 'disconnected' as ConnectionStatus
        }
      })
    }
    return result
  }
  
  // 删除连接
  async function deleteConnection(connectionId: string) {
    const result = await window.api.connection.delete(connectionId)
    if (result.success && result.connections) {
      connections.value = result.connections.map(c => ({
        ...c,
        status: 'disconnected' as ConnectionStatus
      }))
      // 清除缓存
      databaseCache.value.delete(connectionId)
      // 如果删除的是当前连接，清除选中
      if (currentConnectionId.value === connectionId) {
        currentConnectionId.value = null
      }
    }
    return result
  }
  
  // 测试连接
  async function testConnection(config: ConnectionConfig) {
    return window.api.connection.test(config)
  }
  
  // 连接数据库
  async function connect(connectionId: string) {
    const conn = connections.value.find(c => c.id === connectionId)
    if (!conn) return { success: false, message: '连接不存在' }
    
    // 更新状态为连接中
    conn.status = 'connecting'
    
    const result = await window.api.connection.connect(connectionId)
    
    if (result.success) {
      conn.status = 'connected'
      conn.error = undefined
      currentConnectionId.value = connectionId
      
      // 加载数据库列表
      await loadDatabases(connectionId)
    } else {
      conn.status = 'error'
      conn.error = result.message
    }
    
    return result
  }
  
  // 断开连接
  async function disconnect(connectionId: string) {
    const conn = connections.value.find(c => c.id === connectionId)
    if (!conn) return { success: false }
    
    const result = await window.api.connection.disconnect(connectionId)
    
    if (result.success) {
      conn.status = 'disconnected'
      conn.error = undefined
      // 清除缓存
      databaseCache.value.delete(connectionId)
    }
    
    return result
  }
  
  // 加载数据库列表
  async function loadDatabases(connectionId: string) {
    const result = await window.api.database.list(connectionId)
    if (result.success && result.databases) {
      const dbMap = new Map<string, DatabaseMeta>()
      for (const dbName of result.databases) {
        dbMap.set(dbName, {
          name: dbName,
          tables: [],
          views: [],
          functions: []
        })
      }
      databaseCache.value.set(connectionId, dbMap)
    }
    return result
  }
  
  // 加载表列表
  async function loadTables(connectionId: string, database: string) {
    const result = await window.api.database.tables(connectionId, database)
    if (result.success && result.tables) {
      const dbMap = databaseCache.value.get(connectionId)
      if (dbMap) {
        const dbMeta = dbMap.get(database)
        if (dbMeta) {
          dbMeta.tables = result.tables as TableMeta[]
        }
      }
    }
    return result
  }
  
  // 加载列信息
  async function loadColumns(connectionId: string, database: string, table: string) {
    const result = await window.api.database.columns(connectionId, database, table)
    if (result.success && result.columns) {
      const dbMap = databaseCache.value.get(connectionId)
      if (dbMap) {
        const dbMeta = dbMap.get(database)
        if (dbMeta) {
          const tableMeta = dbMeta.tables.find(t => t.name === table)
          if (tableMeta) {
            tableMeta.columns = result.columns as ColumnMeta[]
          }
        }
      }
    }
    return result
  }
  
  // 加载视图列表
  async function loadViews(connectionId: string, database: string) {
    const result = await window.api.database.views(connectionId, database)
    if (result.success && result.views) {
      const dbMap = databaseCache.value.get(connectionId)
      if (dbMap) {
        const dbMeta = dbMap.get(database)
        if (dbMeta) {
          dbMeta.views = result.views as ViewMeta[]
        }
      }
    }
    return result
  }
  
  // 加载函数列表
  async function loadFunctions(connectionId: string, database: string) {
    const result = await window.api.database.functions(connectionId, database)
    if (result.success && result.functions) {
      const dbMap = databaseCache.value.get(connectionId)
      if (dbMap) {
        const dbMeta = dbMap.get(database)
        if (dbMeta) {
          dbMeta.functions = result.functions as FunctionMeta[]
        }
      }
    }
    return result
  }
  
  // 获取数据库元数据
  function getDatabaseMeta(connectionId: string, database: string): DatabaseMeta | undefined {
    return databaseCache.value.get(connectionId)?.get(database)
  }
  
  // 获取所有数据库名
  function getDatabaseNames(connectionId: string): string[] {
    const dbMap = databaseCache.value.get(connectionId)
    return dbMap ? Array.from(dbMap.keys()) : []
  }
  
  // 打开新建连接对话框
  function openNewConnectionDialog() {
    editingConnection.value = null
    dialogVisible.value = true
  }
  
  // 打开编辑连接对话框
  function openEditConnectionDialog(connection: ConnectionConfig) {
    editingConnection.value = connection
    dialogVisible.value = true
  }
  
  // 关闭对话框
  function closeDialog() {
    dialogVisible.value = false
    editingConnection.value = null
  }
  
  // 设置当前连接
  function setCurrentConnection(connectionId: string) {
    currentConnectionId.value = connectionId
  }
  
  // 设置当前数据库
  function setCurrentDatabase(database: string) {
    currentDatabase.value = database
  }
  
  return {
    // 状态
    connections,
    currentConnectionId,
    currentConnection,
    currentDatabase,
    databaseCache,
    dialogVisible,
    editingConnection,
    
    // 方法
    loadConnections,
    saveConnection,
    deleteConnection,
    testConnection,
    connect,
    disconnect,
    loadDatabases,
    loadTables,
    loadColumns,
    loadViews,
    loadFunctions,
    getDatabaseMeta,
    getDatabaseNames,
    openNewConnectionDialog,
    openEditConnectionDialog,
    closeDialog,
    setCurrentConnection,
    setCurrentDatabase
  }
})
