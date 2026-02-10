import { contextBridge, ipcRenderer } from 'electron'
import { IpcChannels } from '../shared/constants'
import type { ConnectionConfig, ConnectionForm, QueryResult, ExplainResult, DatabaseType } from '../shared/types'

// 暴露给渲染进程的 API
const api = {
  // 连接管理
  connection: {
    list: (): Promise<ConnectionConfig[]> => 
      ipcRenderer.invoke(IpcChannels.CONNECTION_LIST),
    
    save: (connection: ConnectionForm, id?: string): Promise<{ success: boolean; connections?: ConnectionConfig[]; connectionId?: string; error?: string; message?: string }> =>
      ipcRenderer.invoke(IpcChannels.CONNECTION_SAVE, { connection, id }),
    
    delete: (connectionId: string): Promise<{ success: boolean; connections?: ConnectionConfig[] }> =>
      ipcRenderer.invoke(IpcChannels.CONNECTION_DELETE, connectionId),
    
    test: (config: ConnectionConfig): Promise<{ success: boolean; message: string; serverVersion?: string }> =>
      ipcRenderer.invoke(IpcChannels.CONNECTION_TEST, config),
    
    connect: (connectionId: string): Promise<{ success: boolean; message?: string; serverVersion?: string }> =>
      ipcRenderer.invoke(IpcChannels.CONNECTION_CONNECT, connectionId),
    
    disconnect: (connectionId: string): Promise<{ success: boolean }> =>
      ipcRenderer.invoke(IpcChannels.CONNECTION_DISCONNECT, connectionId)
  },
  
  // 数据库操作
  database: {
    list: (connectionId: string): Promise<{ success: boolean; databases?: string[]; message?: string }> =>
      ipcRenderer.invoke(IpcChannels.DATABASE_LIST, connectionId),
    
    tables: (connectionId: string, database: string) =>
      ipcRenderer.invoke(IpcChannels.DATABASE_TABLES, { connectionId, database }),
    
    tablesWithColumns: (connectionId: string, database: string) =>
      ipcRenderer.invoke(IpcChannels.DATABASE_TABLES_WITH_COLUMNS, { connectionId, database }),
    
    columns: (connectionId: string, database: string, table: string, schema?: string) =>
      ipcRenderer.invoke(IpcChannels.DATABASE_COLUMNS, { connectionId, database, table, schema }),
    
    views: (connectionId: string, database: string) =>
      ipcRenderer.invoke(IpcChannels.DATABASE_VIEWS, { connectionId, database }),
    
    functions: (connectionId: string, database: string) =>
      ipcRenderer.invoke(IpcChannels.DATABASE_FUNCTIONS, { connectionId, database }),
    
    tableCreateSql: (connectionId: string, database: string, table: string): Promise<{ success: boolean; sql?: string; message?: string }> =>
      ipcRenderer.invoke(IpcChannels.DATABASE_TABLE_CREATE_SQL, { connectionId, database, table }),
    
    indexes: (connectionId: string, database: string, table: string, schema?: string) =>
      ipcRenderer.invoke(IpcChannels.DATABASE_INDEXES, { connectionId, database, table, schema }),
    
    charsets: (connectionId: string): Promise<{ success: boolean; charsets?: { charset: string; defaultCollation: string; description: string }[]; message?: string }> =>
      ipcRenderer.invoke(IpcChannels.DATABASE_CHARSETS, connectionId),
    
    collations: (connectionId: string, charset?: string): Promise<{ success: boolean; collations?: { collation: string; charset: string; isDefault: boolean }[]; message?: string }> =>
      ipcRenderer.invoke(IpcChannels.DATABASE_COLLATIONS, { connectionId, charset }),
    
    engines: (connectionId: string): Promise<{ success: boolean; engines?: { engine: string; support: string; comment: string; isDefault: boolean }[]; message?: string }> =>
      ipcRenderer.invoke(IpcChannels.DATABASE_ENGINES, connectionId),
    
    defaultCharset: (connectionId: string, database: string): Promise<{ success: boolean; charset?: string; collation?: string; message?: string }> =>
      ipcRenderer.invoke(IpcChannels.DATABASE_DEFAULT_CHARSET, { connectionId, database }),
    
    executeDDL: (connectionId: string, sql: string): Promise<{ success: boolean; message?: string }> =>
      ipcRenderer.invoke(IpcChannels.DDL_EXECUTE, { connectionId, sql }),
    
    schemas: (connectionId: string, database: string): Promise<{ success: boolean; schemas?: string[]; message?: string }> =>
      ipcRenderer.invoke(IpcChannels.DATABASE_SCHEMAS, { connectionId, database })
  },
  
  // 查询执行
  query: {
    execute: (connectionId: string, tabId: string, sql: string, maxRows?: number, database?: string): Promise<{ success: boolean; results?: QueryResult[] }> =>
      ipcRenderer.invoke(IpcChannels.QUERY_EXECUTE, { connectionId, tabId, sql, maxRows, database }),
    
    cancel: (connectionId: string, tabId: string): Promise<{ success: boolean }> =>
      ipcRenderer.invoke(IpcChannels.QUERY_CANCEL, { connectionId, tabId }),
    
    explain: (connectionId: string, tabId: string, sql: string, database?: string): Promise<{ success: boolean; explain?: ExplainResult; error?: unknown }> =>
      ipcRenderer.invoke(IpcChannels.QUERY_EXPLAIN, { connectionId, tabId, sql, database }),
    
    executeBatch: (connectionId: string, tabId: string, sqls: string[], database?: string): Promise<{ success: boolean; message?: string; results?: Array<{ sql: string; affectedRows: number }> }> =>
      ipcRenderer.invoke(IpcChannels.QUERY_EXECUTE_BATCH, { connectionId, tabId, sqls, database })
  },

  // 会话管理
  session: {
    create: (tabId: string, connectionId: string, database?: string): Promise<{ success: boolean; message?: string }> =>
      ipcRenderer.invoke(IpcChannels.SESSION_CREATE, { tabId, connectionId, database }),
    
    destroy: (tabId: string, connectionId: string): Promise<{ success: boolean; message?: string }> =>
      ipcRenderer.invoke(IpcChannels.SESSION_DESTROY, { tabId, connectionId }),
    
    status: (tabId: string, connectionId: string): Promise<{ success: boolean; session?: unknown }> =>
      ipcRenderer.invoke(IpcChannels.SESSION_STATUS, { tabId, connectionId }),
    
    count: (connectionId: string): Promise<{ success: boolean; count?: number }> =>
      ipcRenderer.invoke(IpcChannels.SESSION_COUNT, { connectionId }),

    // 渲染进程响应：检查 Tab 是否存在（用于主进程僵尸检测回调）
    onCheckTabExists: (callback: (_event: unknown, tabId: string) => boolean): void => {
      ipcRenderer.on(IpcChannels.SESSION_CHECK_TAB_EXISTS, callback)
    }
  },
  
  // 文件操作
  file: {
    open: (): Promise<{ success: boolean; filePath?: string; content?: string; canceled?: boolean; message?: string }> =>
      ipcRenderer.invoke(IpcChannels.FILE_OPEN),
    
    save: (filePath: string, content: string): Promise<{ success: boolean; message?: string }> =>
      ipcRenderer.invoke(IpcChannels.FILE_SAVE, { filePath, content }),
    
    saveAs: (content: string): Promise<{ success: boolean; filePath?: string; canceled?: boolean; message?: string }> =>
      ipcRenderer.invoke(IpcChannels.FILE_SAVE_AS, content),
    
    export: (
      columns: { name: string; type: string }[],
      rows: Record<string, unknown>[],
      format: 'csv' | 'json' | 'xlsx'
    ): Promise<{ success: boolean; filePath?: string; canceled?: boolean; message?: string }> =>
      ipcRenderer.invoke(IpcChannels.FILE_EXPORT, { columns, rows, format }),
    
    // 读取指定路径文件
    readFile: (filePath: string): Promise<{ success: boolean; content?: string; message?: string }> =>
      ipcRenderer.invoke(IpcChannels.FILE_READ, filePath),
    
    // 最近文件操作
    getRecentFiles: (): Promise<string[]> =>
      ipcRenderer.invoke(IpcChannels.RECENT_FILES_GET),
    
    addRecentFile: (filePath: string): Promise<void> =>
      ipcRenderer.invoke(IpcChannels.RECENT_FILES_ADD, filePath),
    
    removeRecentFile: (filePath: string): Promise<void> =>
      ipcRenderer.invoke(IpcChannels.RECENT_FILES_REMOVE, filePath)
  },

  // 窗口控制
  window: {
    confirmClose: (): void => {
      ipcRenderer.send(IpcChannels.WINDOW_CLOSE_CONFIRMED)
    },
    onBeforeClose: (callback: () => void): void => {
      ipcRenderer.on(IpcChannels.WINDOW_BEFORE_CLOSE, callback)
    },
    removeBeforeCloseListener: (): void => {
      ipcRenderer.removeAllListeners(IpcChannels.WINDOW_BEFORE_CLOSE)
    }
  },

  // SQL Language Server
  sqlLanguageServer: {
    // 自动补全
    completion: (documentText: string, line: number, character: number) =>
      ipcRenderer.invoke('sql-ls:completion', documentText, line, character),
    
    // 语法诊断
    validate: (documentText: string) =>
      ipcRenderer.invoke('sql-ls:validate', documentText),
    
    // 悬浮提示
    hover: (documentText: string, line: number, character: number) =>
      ipcRenderer.invoke('sql-ls:hover', documentText, line, character),
    
    // 代码格式化
    format: (documentText: string) =>
      ipcRenderer.invoke('sql-ls:format', documentText),
    
    // 更新表元数据
    updateTables: (tables: { name: string; comment?: string; columns: { name: string; type: string; nullable: boolean; defaultValue?: string; comment?: string; isPrimaryKey?: boolean }[] }[]) =>
      ipcRenderer.invoke('sql-ls:updateTables', tables),
    
    // 更新视图元数据
    updateViews: (views: { name: string; comment?: string }[]) =>
      ipcRenderer.invoke('sql-ls:updateViews', views),
    
    // 设置上下文
    setContext: (connectionId: string | null, database: string | null) =>
      ipcRenderer.invoke('sql-ls:setContext', connectionId, database),
    
    // 设置数据库版本（用于过滤函数列表）
    setDatabaseVersion: (version: string | null): Promise<{ success: boolean; functionsCount?: number; error?: string }> =>
      ipcRenderer.invoke('sql-ls:setDatabaseVersion', version),
    
    // 设置数据库类型（用于加载对应的函数列表）
    setDatabaseType: (dbType: DatabaseType): Promise<{ success: boolean; functionsCount?: number; error?: string }> =>
      ipcRenderer.invoke('sql-ls:setDatabaseType', dbType),
    
    // 清空元数据
    clear: () =>
      ipcRenderer.invoke('sql-ls:clear')
  },

  // 菜单相关
  menu: {
    // 监听菜单事件
    onNewConnection: (callback: () => void): void => {
      ipcRenderer.on(IpcChannels.MENU_NEW_CONNECTION, callback)
    },
    onNewQuery: (callback: () => void): void => {
      ipcRenderer.on(IpcChannels.MENU_NEW_QUERY, callback)
    },
    onOpenFile: (callback: () => void): void => {
      ipcRenderer.on(IpcChannels.MENU_OPEN_FILE, callback)
    },
    onOpenRecent: (callback: (_event: unknown, filePath: string) => void): void => {
      ipcRenderer.on(IpcChannels.MENU_OPEN_RECENT, callback)
    },
    onSave: (callback: () => void): void => {
      ipcRenderer.on(IpcChannels.MENU_SAVE, callback)
    },
    onSaveAs: (callback: () => void): void => {
      ipcRenderer.on(IpcChannels.MENU_SAVE_AS, callback)
    },
    onOpenSettings: (callback: () => void): void => {
      ipcRenderer.on(IpcChannels.MENU_OPEN_SETTINGS, callback)
    },
    // 更新最近文件菜单
    updateRecentFiles: (files: string[]): Promise<void> =>
      ipcRenderer.invoke(IpcChannels.MENU_UPDATE_RECENT_FILES, files),
    // 移除所有菜单监听器
    removeAllListeners: (): void => {
      ipcRenderer.removeAllListeners(IpcChannels.MENU_NEW_CONNECTION)
      ipcRenderer.removeAllListeners(IpcChannels.MENU_NEW_QUERY)
      ipcRenderer.removeAllListeners(IpcChannels.MENU_OPEN_FILE)
      ipcRenderer.removeAllListeners(IpcChannels.MENU_OPEN_RECENT)
      ipcRenderer.removeAllListeners(IpcChannels.MENU_SAVE)
      ipcRenderer.removeAllListeners(IpcChannels.MENU_SAVE_AS)
      ipcRenderer.removeAllListeners(IpcChannels.MENU_OPEN_SETTINGS)
    }
  },

  // 国际化相关
  locale: {
    setLocale: (locale: string): Promise<void> =>
      ipcRenderer.invoke(IpcChannels.LOCALE_CHANGED, locale),
    getLocale: (): Promise<string> =>
      ipcRenderer.invoke(IpcChannels.LOCALE_GET)
  }
}

// 暴露 API 到渲染进程
contextBridge.exposeInMainWorld('api', api)

// TypeScript 类型声明
export type Api = typeof api
