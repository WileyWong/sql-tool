/**
 * 元数据服务
 * 管理数据库元数据（表、字段、视图、函数）
 */

import type { TableMetadata, ViewMetadata, FunctionMetadata, ColumnMetadata } from '../types'

/**
 * MySQL 内置函数列表
 */
const MYSQL_FUNCTIONS: FunctionMetadata[] = [
  // 聚合函数
  { name: 'COUNT', signature: 'COUNT(expr)', description: '计数', returnType: 'BIGINT' },
  { name: 'SUM', signature: 'SUM(expr)', description: '求和', returnType: 'DECIMAL' },
  { name: 'AVG', signature: 'AVG(expr)', description: '平均值', returnType: 'DECIMAL' },
  { name: 'MAX', signature: 'MAX(expr)', description: '最大值', returnType: 'varies' },
  { name: 'MIN', signature: 'MIN(expr)', description: '最小值', returnType: 'varies' },
  { name: 'GROUP_CONCAT', signature: 'GROUP_CONCAT(expr)', description: '分组连接', returnType: 'VARCHAR' },
  
  // 字符串函数
  { name: 'CONCAT', signature: 'CONCAT(str1, str2, ...)', description: '字符串连接', returnType: 'VARCHAR' },
  { name: 'CONCAT_WS', signature: 'CONCAT_WS(separator, str1, str2, ...)', description: '带分隔符连接', returnType: 'VARCHAR' },
  { name: 'SUBSTRING', signature: 'SUBSTRING(str, pos, len)', description: '截取字符串', returnType: 'VARCHAR' },
  { name: 'LEFT', signature: 'LEFT(str, len)', description: '左截取', returnType: 'VARCHAR' },
  { name: 'RIGHT', signature: 'RIGHT(str, len)', description: '右截取', returnType: 'VARCHAR' },
  { name: 'LENGTH', signature: 'LENGTH(str)', description: '字符串长度', returnType: 'INT' },
  { name: 'CHAR_LENGTH', signature: 'CHAR_LENGTH(str)', description: '字符数', returnType: 'INT' },
  { name: 'UPPER', signature: 'UPPER(str)', description: '转大写', returnType: 'VARCHAR' },
  { name: 'LOWER', signature: 'LOWER(str)', description: '转小写', returnType: 'VARCHAR' },
  { name: 'TRIM', signature: 'TRIM(str)', description: '去除空格', returnType: 'VARCHAR' },
  { name: 'LTRIM', signature: 'LTRIM(str)', description: '去除左空格', returnType: 'VARCHAR' },
  { name: 'RTRIM', signature: 'RTRIM(str)', description: '去除右空格', returnType: 'VARCHAR' },
  { name: 'REPLACE', signature: 'REPLACE(str, from_str, to_str)', description: '替换', returnType: 'VARCHAR' },
  { name: 'REVERSE', signature: 'REVERSE(str)', description: '反转', returnType: 'VARCHAR' },
  { name: 'LOCATE', signature: 'LOCATE(substr, str)', description: '查找位置', returnType: 'INT' },
  { name: 'INSTR', signature: 'INSTR(str, substr)', description: '查找位置', returnType: 'INT' },
  
  // 日期时间函数
  { name: 'NOW', signature: 'NOW()', description: '当前日期时间', returnType: 'DATETIME' },
  { name: 'CURDATE', signature: 'CURDATE()', description: '当前日期', returnType: 'DATE' },
  { name: 'CURTIME', signature: 'CURTIME()', description: '当前时间', returnType: 'TIME' },
  { name: 'DATE', signature: 'DATE(expr)', description: '提取日期', returnType: 'DATE' },
  { name: 'TIME', signature: 'TIME(expr)', description: '提取时间', returnType: 'TIME' },
  { name: 'YEAR', signature: 'YEAR(date)', description: '提取年', returnType: 'INT' },
  { name: 'MONTH', signature: 'MONTH(date)', description: '提取月', returnType: 'INT' },
  { name: 'DAY', signature: 'DAY(date)', description: '提取日', returnType: 'INT' },
  { name: 'HOUR', signature: 'HOUR(time)', description: '提取小时', returnType: 'INT' },
  { name: 'MINUTE', signature: 'MINUTE(time)', description: '提取分钟', returnType: 'INT' },
  { name: 'SECOND', signature: 'SECOND(time)', description: '提取秒', returnType: 'INT' },
  { name: 'DATE_FORMAT', signature: 'DATE_FORMAT(date, format)', description: '日期格式化', returnType: 'VARCHAR' },
  { name: 'DATE_ADD', signature: 'DATE_ADD(date, INTERVAL expr unit)', description: '日期加法', returnType: 'DATE' },
  { name: 'DATE_SUB', signature: 'DATE_SUB(date, INTERVAL expr unit)', description: '日期减法', returnType: 'DATE' },
  { name: 'DATEDIFF', signature: 'DATEDIFF(date1, date2)', description: '日期差', returnType: 'INT' },
  { name: 'TIMESTAMPDIFF', signature: 'TIMESTAMPDIFF(unit, datetime1, datetime2)', description: '时间差', returnType: 'BIGINT' },
  { name: 'UNIX_TIMESTAMP', signature: 'UNIX_TIMESTAMP([date])', description: 'Unix时间戳', returnType: 'BIGINT' },
  { name: 'FROM_UNIXTIME', signature: 'FROM_UNIXTIME(unix_timestamp)', description: '从时间戳转换', returnType: 'DATETIME' },
  
  // 数学函数
  { name: 'ABS', signature: 'ABS(x)', description: '绝对值', returnType: 'DECIMAL' },
  { name: 'CEIL', signature: 'CEIL(x)', description: '向上取整', returnType: 'BIGINT' },
  { name: 'CEILING', signature: 'CEILING(x)', description: '向上取整', returnType: 'BIGINT' },
  { name: 'FLOOR', signature: 'FLOOR(x)', description: '向下取整', returnType: 'BIGINT' },
  { name: 'ROUND', signature: 'ROUND(x, d)', description: '四舍五入', returnType: 'DECIMAL' },
  { name: 'TRUNCATE', signature: 'TRUNCATE(x, d)', description: '截断', returnType: 'DECIMAL' },
  { name: 'MOD', signature: 'MOD(n, m)', description: '取模', returnType: 'DECIMAL' },
  { name: 'RAND', signature: 'RAND([seed])', description: '随机数', returnType: 'DOUBLE' },
  { name: 'POWER', signature: 'POWER(x, y)', description: '幂运算', returnType: 'DOUBLE' },
  { name: 'SQRT', signature: 'SQRT(x)', description: '平方根', returnType: 'DOUBLE' },
  
  // 条件函数
  { name: 'IF', signature: 'IF(expr, val1, val2)', description: '条件判断', returnType: 'varies' },
  { name: 'IFNULL', signature: 'IFNULL(expr1, expr2)', description: '空值替换', returnType: 'varies' },
  { name: 'NULLIF', signature: 'NULLIF(expr1, expr2)', description: '相等返回NULL', returnType: 'varies' },
  { name: 'COALESCE', signature: 'COALESCE(expr1, expr2, ...)', description: '返回第一个非空值', returnType: 'varies' },
  { name: 'CASE', signature: 'CASE WHEN ... THEN ... ELSE ... END', description: '多条件判断', returnType: 'varies' },
  
  // 类型转换
  { name: 'CAST', signature: 'CAST(expr AS type)', description: '类型转换', returnType: 'varies' },
  { name: 'CONVERT', signature: 'CONVERT(expr, type)', description: '类型转换', returnType: 'varies' },
  
  // JSON 函数
  { name: 'JSON_EXTRACT', signature: 'JSON_EXTRACT(json_doc, path)', description: '提取JSON值', returnType: 'JSON' },
  { name: 'JSON_OBJECT', signature: 'JSON_OBJECT(key, val, ...)', description: '创建JSON对象', returnType: 'JSON' },
  { name: 'JSON_ARRAY', signature: 'JSON_ARRAY(val, ...)', description: '创建JSON数组', returnType: 'JSON' },
  { name: 'JSON_UNQUOTE', signature: 'JSON_UNQUOTE(json_val)', description: '去除JSON引号', returnType: 'VARCHAR' },
]

export class MetadataService {
  private tables: Map<string, TableMetadata> = new Map()
  private views: Map<string, ViewMetadata> = new Map()
  private currentConnectionId: string | null = null
  private currentDatabase: string | null = null

  /**
   * 设置当前连接和数据库
   */
  setContext(connectionId: string | null, database: string | null): void {
    this.currentConnectionId = connectionId
    this.currentDatabase = database
  }

  /**
   * 更新表元数据
   */
  updateTables(tables: TableMetadata[]): void {
    this.tables.clear()
    for (const table of tables) {
      this.tables.set(table.name.toLowerCase(), table)
    }
  }

  /**
   * 更新视图元数据
   */
  updateViews(views: ViewMetadata[]): void {
    this.views.clear()
    for (const view of views) {
      this.views.set(view.name.toLowerCase(), view)
    }
  }

  /**
   * 获取所有表
   */
  getTables(): TableMetadata[] {
    return Array.from(this.tables.values())
  }

  /**
   * 获取所有视图
   */
  getViews(): ViewMetadata[] {
    return Array.from(this.views.values())
  }

  /**
   * 获取指定表的字段
   */
  getColumns(tableName: string): ColumnMetadata[] {
    const table = this.tables.get(tableName.toLowerCase())
    return table?.columns || []
  }

  /**
   * 获取表信息
   */
  getTable(tableName: string): TableMetadata | undefined {
    return this.tables.get(tableName.toLowerCase())
  }

  /**
   * 获取视图信息
   */
  getView(viewName: string): ViewMetadata | undefined {
    return this.views.get(viewName.toLowerCase())
  }

  /**
   * 获取所有函数
   */
  getFunctions(): FunctionMetadata[] {
    return MYSQL_FUNCTIONS
  }

  /**
   * 获取函数信息
   */
  getFunction(funcName: string): FunctionMetadata | undefined {
    return MYSQL_FUNCTIONS.find(f => f.name.toLowerCase() === funcName.toLowerCase())
  }

  /**
   * 检查表是否存在
   */
  hasTable(tableName: string): boolean {
    return this.tables.has(tableName.toLowerCase())
  }

  /**
   * 检查视图是否存在
   */
  hasView(viewName: string): boolean {
    return this.views.has(viewName.toLowerCase())
  }

  /**
   * 清空元数据
   */
  clear(): void {
    this.tables.clear()
    this.views.clear()
    this.currentConnectionId = null
    this.currentDatabase = null
  }

  /**
   * 获取当前上下文
   */
  getContext(): { connectionId: string | null; database: string | null } {
    return {
      connectionId: this.currentConnectionId,
      database: this.currentDatabase
    }
  }
}
