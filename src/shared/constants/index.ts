export * from './errors'

/**
 * 默认配置
 */
export const Defaults = {
  /** 默认端口 */
  PORT: 3306,
  /** 默认最大行数 */
  MAX_ROWS: 5000,
  /** 执行超时时间（毫秒） */
  QUERY_TIMEOUT: 10 * 60 * 1000,
  /** 连接超时时间（毫秒） */
  CONNECTION_TIMEOUT: 10 * 1000,
  /** 联想列表最大条数 */
  MAX_SUGGESTIONS: 20
} as const

/**
 * IPC 通道名称
 */
export const IpcChannels = {
  // 连接管理
  CONNECTION_LIST: 'connection:list',
  CONNECTION_SAVE: 'connection:save',
  CONNECTION_DELETE: 'connection:delete',
  CONNECTION_TEST: 'connection:test',
  CONNECTION_CONNECT: 'connection:connect',
  CONNECTION_DISCONNECT: 'connection:disconnect',
  
  // 数据库操作
  DATABASE_LIST: 'database:list',
  DATABASE_TABLES: 'database:tables',
  DATABASE_COLUMNS: 'database:columns',
  DATABASE_VIEWS: 'database:views',
  DATABASE_FUNCTIONS: 'database:functions',
  DATABASE_TABLE_CREATE_SQL: 'database:tableCreateSql',
  DATABASE_INDEXES: 'database:indexes',
  DATABASE_CHARSETS: 'database:charsets',
  DATABASE_COLLATIONS: 'database:collations',
  DATABASE_ENGINES: 'database:engines',
  DATABASE_DEFAULT_CHARSET: 'database:defaultCharset',
  DDL_EXECUTE: 'ddl:execute',
  
  // 查询执行
  QUERY_EXECUTE: 'query:execute',
  QUERY_CANCEL: 'query:cancel',
  QUERY_EXPLAIN: 'query:explain',
  QUERY_UPDATE_CELL: 'query:updateCell',
  
  // 文件操作
  FILE_OPEN: 'file:open',
  FILE_SAVE: 'file:save',
  FILE_SAVE_AS: 'file:saveAs',
  FILE_EXPORT: 'file:export',
  FILE_READ: 'file:read',
  
  // 最近文件
  RECENT_FILES_GET: 'recentFiles:get',
  RECENT_FILES_ADD: 'recentFiles:add',
  RECENT_FILES_REMOVE: 'recentFiles:remove',
  
  // 窗口控制
  WINDOW_CLOSE_CONFIRMED: 'window:closeConfirmed',
  WINDOW_BEFORE_CLOSE: 'window:beforeClose',
  
  // 菜单相关
  MENU_NEW_CONNECTION: 'menu:new-connection',
  MENU_NEW_QUERY: 'menu:new-query',
  MENU_OPEN_FILE: 'menu:open-file',
  MENU_OPEN_RECENT: 'menu:open-recent',
  MENU_SAVE: 'menu:save',
  MENU_SAVE_AS: 'menu:save-as',
  MENU_ABOUT: 'menu:about',
  MENU_UPDATE_RECENT_FILES: 'menu:update-recent-files'
} as const
