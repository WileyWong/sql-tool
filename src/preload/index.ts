import { contextBridge, ipcRenderer } from 'electron'
import { IpcChannels } from '../shared/constants'
import type { ConnectionConfig, ConnectionForm, QueryResult, ExplainResult } from '../shared/types'

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
    
    connect: (connectionId: string): Promise<{ success: boolean; message?: string }> =>
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
    
    columns: (connectionId: string, database: string, table: string) =>
      ipcRenderer.invoke(IpcChannels.DATABASE_COLUMNS, { connectionId, database, table }),
    
    views: (connectionId: string, database: string) =>
      ipcRenderer.invoke(IpcChannels.DATABASE_VIEWS, { connectionId, database }),
    
    functions: (connectionId: string, database: string) =>
      ipcRenderer.invoke(IpcChannels.DATABASE_FUNCTIONS, { connectionId, database }),
    
    tableCreateSql: (connectionId: string, database: string, table: string): Promise<{ success: boolean; sql?: string; message?: string }> =>
      ipcRenderer.invoke(IpcChannels.DATABASE_TABLE_CREATE_SQL, { connectionId, database, table }),
    
    indexes: (connectionId: string, database: string, table: string) =>
      ipcRenderer.invoke(IpcChannels.DATABASE_INDEXES, { connectionId, database, table }),
    
    charsets: (connectionId: string): Promise<{ success: boolean; charsets?: { charset: string; defaultCollation: string; description: string }[]; message?: string }> =>
      ipcRenderer.invoke(IpcChannels.DATABASE_CHARSETS, connectionId),
    
    collations: (connectionId: string, charset?: string): Promise<{ success: boolean; collations?: { collation: string; charset: string; isDefault: boolean }[]; message?: string }> =>
      ipcRenderer.invoke(IpcChannels.DATABASE_COLLATIONS, { connectionId, charset }),
    
    engines: (connectionId: string): Promise<{ success: boolean; engines?: { engine: string; support: string; comment: string; isDefault: boolean }[]; message?: string }> =>
      ipcRenderer.invoke(IpcChannels.DATABASE_ENGINES, connectionId),
    
    defaultCharset: (connectionId: string, database: string): Promise<{ success: boolean; charset?: string; collation?: string; message?: string }> =>
      ipcRenderer.invoke(IpcChannels.DATABASE_DEFAULT_CHARSET, { connectionId, database }),
    
    executeDDL: (connectionId: string, sql: string): Promise<{ success: boolean; message?: string }> =>
      ipcRenderer.invoke(IpcChannels.DDL_EXECUTE, { connectionId, sql })
  },
  
  // 查询执行
  query: {
    execute: (connectionId: string, sql: string, maxRows?: number, database?: string): Promise<{ success: boolean; results?: QueryResult[] }> =>
      ipcRenderer.invoke(IpcChannels.QUERY_EXECUTE, { connectionId, sql, maxRows, database }),
    
    cancel: (connectionId: string): Promise<{ success: boolean }> =>
      ipcRenderer.invoke(IpcChannels.QUERY_CANCEL, connectionId),
    
    explain: (connectionId: string, sql: string): Promise<{ success: boolean; explain?: ExplainResult; error?: unknown }> =>
      ipcRenderer.invoke(IpcChannels.QUERY_EXPLAIN, { connectionId, sql }),
    
    updateCell: (
      connectionId: string,
      database: string,
      table: string,
      primaryKeys: { column: string; value: unknown }[],
      column: string,
      newValue: unknown
    ): Promise<{ success: boolean; message?: string }> =>
      ipcRenderer.invoke(IpcChannels.QUERY_UPDATE_CELL, { connectionId, database, table, primaryKeys, column, newValue })
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
      format: 'csv' | 'json'
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
    
    // 清空元数据
    clear: () =>
      ipcRenderer.invoke('sql-ls:clear')
  }
}

// 暴露 API 到渲染进程
contextBridge.exposeInMainWorld('api', api)

// TypeScript 类型声明
export type Api = typeof api
