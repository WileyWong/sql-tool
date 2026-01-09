/**
 * SQL 解析服务
 * 负责解析 SQL 语句并分析光标位置的上下文
 * 使用 sql-parser-cst 进行精确的 SQL 解析，支持子查询识别
 */

import { parse, cstVisitor } from 'sql-parser-cst'
import type { CursorContext, TableRef } from '../types'

// CST 节点类型定义
interface CstNode {
  type: string
  range?: [number, number]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export class SqlParserService {
  /**
   * 解析 SQL 并返回光标位置的上下文
   */
  analyzeCursorContext(sql: string, offset: number): CursorContext {
    // 1. 检查是否在注释中
    if (this.isInComment(sql, offset)) {
      return { type: 'IN_COMMENT' }
    }

    // 2. 提取当前语句
    const { statement, offsetInStatement } = this.extractCurrentStatement(sql, offset)

    // 3. 分析上下文（使用正则降级方案，后续可集成 sql-parser-cst）
    return this.analyzeContext(statement, offsetInStatement)
  }

  /**
   * 检查光标是否在注释内
   */
  private isInComment(sql: string, offset: number): boolean {
    // 检查 -- 单行注释
    const lineStart = sql.lastIndexOf('\n', offset - 1) + 1
    const lineBeforeCursor = sql.substring(lineStart, offset)
    const dashIndex = lineBeforeCursor.indexOf('--')
    if (dashIndex !== -1) {
      // 确保 -- 不在字符串内
      const beforeDash = lineBeforeCursor.substring(0, dashIndex)
      if (!this.isInString(beforeDash)) {
        return true
      }
    }

    // 检查 /* */ 块注释
    let inBlock = false
    let inString = false
    let stringChar = ''
    let i = 0
    
    while (i < offset) {
      const char = sql[i]
      const nextChar = sql[i + 1]
      
      if (!inBlock && !inString) {
        if (char === "'" || char === '"' || char === '`') {
          inString = true
          stringChar = char
        } else if (char === '/' && nextChar === '*') {
          inBlock = true
          i += 2
          continue
        }
      } else if (inString) {
        if (char === stringChar && sql[i - 1] !== '\\') {
          inString = false
        }
      } else if (inBlock) {
        if (char === '*' && nextChar === '/') {
          inBlock = false
          i += 2
          continue
        }
      }
      i++
    }
    
    return inBlock
  }

  /**
   * 检查文本是否以未闭合的字符串结尾
   */
  private isInString(text: string): boolean {
    let inString = false
    let stringChar = ''
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i]
      if (!inString && (char === "'" || char === '"' || char === '`')) {
        inString = true
        stringChar = char
      } else if (inString && char === stringChar && text[i - 1] !== '\\') {
        inString = false
      }
    }
    
    return inString
  }

  /**
   * 从完整 SQL 中提取光标所在的单条语句
   */
  private extractCurrentStatement(sql: string, offset: number): {
    statement: string
    offsetInStatement: number
  } {
    const statements: { start: number; end: number; text: string }[] = []
    let start = 0
    let inString = false
    let stringChar = ''

    for (let i = 0; i < sql.length; i++) {
      const char = sql[i]
      if (!inString && (char === "'" || char === '"' || char === '`')) {
        inString = true
        stringChar = char
      } else if (inString && char === stringChar && sql[i - 1] !== '\\') {
        inString = false
      } else if (!inString && char === ';') {
        statements.push({ start, end: i + 1, text: sql.substring(start, i + 1) })
        start = i + 1
      }
    }
    
    // 最后一条语句（可能没有分号）
    if (start < sql.length) {
      statements.push({ start, end: sql.length, text: sql.substring(start) })
    }

    // 找到包含光标的语句
    for (const stmt of statements) {
      if (offset >= stmt.start && offset <= stmt.end) {
        return {
          statement: stmt.text,
          offsetInStatement: offset - stmt.start
        }
      }
    }

    return { statement: sql, offsetInStatement: offset }
  }

  /**
   * 分析上下文（基于正则的降级方案）
   */
  private analyzeContext(sql: string, offset: number): CursorContext {
    const textBefore = sql.substring(0, offset)
    const textBeforeUpper = textBefore.toUpperCase()
    const fullTextUpper = sql.toUpperCase()

    // console.log('[SQL Parser] analyzeContext:', { sql, offset, textBefore })

    // 检查光标前最近的关键字
    const lastKeyword = this.findLastKeyword(textBeforeUpper)
    // console.log('[SQL Parser] lastKeyword:', lastKeyword)

    // 表名. 后（优先级最高）
    const dotMatch = textBefore.match(/(\w+)\.\s*$/i)
    if (dotMatch) {
      const tableName = dotMatch[1]
      // 查找该表名是否是别名
      const resolvedTable = this.resolveTableAlias(sql, tableName)
      // console.log('[SQL Parser] TABLE_DOT:', tableName, '->', resolvedTable)
      return { type: 'TABLE_DOT', targetTable: resolvedTable || tableName }
    }

    // FROM/JOIN 后 - 检查是否在 FROM/JOIN 子句中输入表名
    // 匹配: FROM xxx 或 JOIN xxx（xxx 是正在输入的表名）
    if (this.isInFromJoinClause(textBefore, fullTextUpper)) {
      // console.log('[SQL Parser] FROM_CLAUSE detected')
      return { type: 'FROM_CLAUSE' }
    }

    // ON 后
    if (this.isInOnClause(textBefore, lastKeyword)) {
      const tables = this.extractTablesFromSql(sql)
      // console.log('[SQL Parser] ON_CLAUSE:', tables)
      return { type: 'ON_CLAUSE', tables }
    }

    // WHERE 后
    if (this.isInWhereClause(textBefore, textBeforeUpper, lastKeyword)) {
      const tables = this.extractTablesFromSql(sql)
      // console.log('[SQL Parser] WHERE_CLAUSE:', tables)
      return { type: 'WHERE_CLAUSE', tables }
    }

    // SELECT 列位置（在 SELECT 和 FROM 之间）
    if (this.isInSelectColumns(textBeforeUpper, fullTextUpper, offset)) {
      const tables = this.extractTablesFromSql(sql)
      if (tables.length > 0) {
        // console.log('[SQL Parser] SELECT_COLUMNS:', tables)
        return { type: 'SELECT_COLUMNS', tables }
      }
    }

    // SELECT 后但没有 FROM（还不知道表）
    if (/\bSELECT\s+$/i.test(textBefore) && !fullTextUpper.includes('FROM')) {
      // console.log('[SQL Parser] UNKNOWN (SELECT without FROM)')
      return { type: 'UNKNOWN' }
    }

    // CREATE 语句
    if (/\bCREATE\s+$/i.test(textBefore) || lastKeyword === 'CREATE') {
      // console.log('[SQL Parser] DDL_CREATE')
      return { type: 'DDL_CREATE' }
    }

    // ALTER 语句
    if (/\bALTER\s+$/i.test(textBefore) || lastKeyword === 'ALTER') {
      // console.log('[SQL Parser] DDL_ALTER')
      return { type: 'DDL_ALTER' }
    }

    // 默认：语句开始
    // console.log('[SQL Parser] STATEMENT_START (default)')
    return { type: 'STATEMENT_START' }
  }

  /**
   * 检查是否在 FROM/JOIN 子句中（正在输入表名）
   */
  private isInFromJoinClause(textBefore: string, _fullTextUpper: string): boolean {
    const textBeforeUpper = textBefore.toUpperCase()
    
    // 直接在 FROM/JOIN 后面（紧跟空格）
    if (/\b(FROM|JOIN)\s+$/i.test(textBefore)) {
      // console.log('[SQL Parser] FROM/JOIN 后直接空格')
      return true
    }

    // 正在输入表名：FROM xxx 或 JOIN xxx（xxx 是不完整的标识符）
    // 检查最后一个 FROM/JOIN 后面是否只有一个简单标识符（没有其他关键字）
    const fromJoinMatch = textBefore.match(/\b(FROM|(?:INNER\s+|LEFT\s+|RIGHT\s+|OUTER\s+|CROSS\s+)?JOIN)\s+(\w*)$/i)
    if (fromJoinMatch) {
      // console.log('[SQL Parser] FROM/JOIN 匹配:', fromJoinMatch)
      return true
    }

    // FROM 后逗号分隔的多表：FROM t1, xxx
    if (/\bFROM\s+\w+\s*,\s*$/i.test(textBefore) || /\bFROM\s+\w+\s*,\s*\w*$/i.test(textBefore)) {
      // 确保光标不在 WHERE 等子句后
      const lastFromPos = textBeforeUpper.lastIndexOf('FROM')
      const afterFrom = textBefore.substring(lastFromPos)
      if (!/\b(WHERE|ON|ORDER|GROUP|HAVING|LIMIT)\b/i.test(afterFrom)) {
        // console.log('[SQL Parser] FROM 后逗号分隔')
        return true
      }
    }

    return false
  }

  /**
   * 检查是否在 ON 子句中
   */
  private isInOnClause(textBefore: string, lastKeyword: string | null): boolean {
    // 直接在 ON 后
    if (/\bON\s+$/i.test(textBefore)) {
      return true
    }

    // ON 后正在输入条件
    if (lastKeyword === 'ON') {
      const afterOn = textBefore.split(/\bON\b/i).pop() || ''
      // 确保没有其他主要关键字
      if (!/\b(WHERE|ORDER|GROUP|HAVING|LIMIT)\b/i.test(afterOn)) {
        return true
      }
    }

    return false
  }

  /**
   * 检查是否在 WHERE 子句中
   */
  private isInWhereClause(textBefore: string, textBeforeUpper: string, lastKeyword: string | null): boolean {
    if (!textBeforeUpper.includes('WHERE')) {
      return false
    }

    // 直接在 WHERE 后
    if (/\bWHERE\s+$/i.test(textBefore)) {
      return true
    }

    // WHERE 后正在输入条件
    if (lastKeyword === 'WHERE' || lastKeyword === 'AND' || lastKeyword === 'OR') {
      const afterWhere = textBefore.split(/\bWHERE\b/i).pop() || ''
      // 确保没有 ORDER BY, GROUP BY 等
      if (!/\b(ORDER|GROUP|HAVING|LIMIT)\b/i.test(afterWhere)) {
        return true
      }
    }

    return false
  }

  /**
   * 检查是否在 SELECT 列位置
   */
  private isInSelectColumns(textBeforeUpper: string, fullTextUpper: string, offset: number): boolean {
    if (!textBeforeUpper.includes('SELECT')) {
      return false
    }

    if (!fullTextUpper.includes('FROM')) {
      return false
    }

    const selectPos = textBeforeUpper.lastIndexOf('SELECT')
    const fromPosInFull = fullTextUpper.indexOf('FROM', selectPos)
    
    // 光标在 SELECT 和 FROM 之间
    if (fromPosInFull > offset) {
      return true
    }

    // 光标前没有 FROM（但完整 SQL 有 FROM）
    if (!textBeforeUpper.substring(selectPos).includes('FROM')) {
      return true
    }

    return false
  }

  /**
   * 查找最近的关键字
   */
  private findLastKeyword(text: string): string | null {
    const keywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'ON', 'AND', 'OR', 'ORDER', 'GROUP', 'HAVING', 'CREATE', 'ALTER', 'INSERT', 'UPDATE', 'DELETE']
    let lastPos = -1
    let lastKeyword: string | null = null

    for (const kw of keywords) {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi')
      let match
      while ((match = regex.exec(text)) !== null) {
        if (match.index > lastPos) {
          lastPos = match.index
          lastKeyword = kw
        }
      }
    }

    return lastKeyword
  }

  /**
   * 解析表别名
   */
  private resolveTableAlias(sql: string, alias: string): string | null {
    const tables = this.extractTablesFromSql(sql)
    for (const table of tables) {
      if (table.alias?.toLowerCase() === alias.toLowerCase()) {
        return table.name
      }
      if (table.name.toLowerCase() === alias.toLowerCase()) {
        return table.name
      }
    }
    return null
  }

  /**
   * 从 SQL 文本中提取表引用（使用 CST 解析，支持子查询）
   */
  extractTablesFromSql(sql: string): TableRef[] {
    try {
      const cst = parse(sql, {
        dialect: 'mysql',
        includeRange: true
      })
      return this.extractTablesFromCST(cst)
    } catch {
      // CST 解析失败，降级到正则方案
      return this.extractTablesFromSqlRegex(sql)
    }
  }

  /**
   * 从 CST 中提取表引用（支持子查询）
   */
  private extractTablesFromCST(cst: CstNode): TableRef[] {
    const tables: TableRef[] = []
    const seen = new Set<string>()

    const visitor = cstVisitor({
      // 处理 FROM 子句
      from_clause: (node) => {
        this.extractTablesFromFromClause(node as unknown as CstNode, tables, seen)
      },
      // 处理 JOIN 表达式
      join_expr: (node) => {
        this.extractTableFromJoinExpr(node as unknown as CstNode, tables, seen)
      }
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    visitor(cst as any)
    return tables
  }

  /**
   * 从 FROM 子句中提取表引用
   */
  private extractTablesFromFromClause(node: CstNode, tables: TableRef[], seen: Set<string>): void {
    // FROM 子句的 expr 可能是：
    // 1. identifier (表名)
    // 2. alias (表名 AS 别名 或 表名 别名)
    // 3. paren_expr (子查询)
    // 4. join_expr (JOIN 表达式)
    // 5. comma_expr (逗号分隔的多表)

    const expr = node.expr
    if (!expr) return

    this.extractTableFromExpr(expr, tables, seen)
  }

  /**
   * 从表达式中提取表引用
   */
  private extractTableFromExpr(expr: CstNode, tables: TableRef[], seen: Set<string>): void {
    if (!expr) return

    switch (expr.type) {
      case 'identifier':
      case 'member_expr':
        // 普通表引用
        this.addTableRef(expr, null, tables, seen)
        break

      case 'alias':
        // 带别名的表引用或子查询
        this.extractTableFromAlias(expr, tables, seen)
        break

      case 'paren_expr':
        // 括号表达式（可能是子查询）
        this.extractTableFromParenExpr(expr, null, tables, seen)
        break

      case 'join_expr':
        // JOIN 表达式
        this.extractTableFromJoinExpr(expr, tables, seen)
        break

      case 'list_expr':
        // 逗号分隔的多表 (FROM t1, t2)
        if (expr.items && Array.isArray(expr.items)) {
          for (const item of expr.items) {
            this.extractTableFromExpr(item, tables, seen)
          }
        }
        break
    }
  }

  /**
   * 从别名表达式中提取表引用
   */
  private extractTableFromAlias(aliasNode: CstNode, tables: TableRef[], seen: Set<string>): void {
    const innerExpr = aliasNode.expr
    const aliasExpr = aliasNode.alias

    // 获取别名
    const alias = this.getIdentifierName(aliasExpr)

    if (innerExpr?.type === 'paren_expr') {
      // 子查询带别名: (SELECT ...) AS alias
      this.extractTableFromParenExpr(innerExpr, alias, tables, seen)
    } else {
      // 普通表带别名: table_name AS alias
      this.addTableRef(innerExpr, alias, tables, seen)
    }
  }

  /**
   * 从括号表达式中提取子查询信息
   */
  private extractTableFromParenExpr(
    parenExpr: CstNode,
    alias: string | null,
    tables: TableRef[],
    seen: Set<string>
  ): void {
    const innerExpr = parenExpr.expr

    // 检查是否是 SELECT 语句（子查询）
    if (innerExpr?.type === 'select_stmt') {
      const subqueryInfo = this.extractSubqueryInfo(innerExpr)
      
      const key = (alias || '__subquery__').toLowerCase()
      if (!seen.has(key)) {
        seen.add(key)
        tables.push({
          name: alias || '__subquery__',
          alias: alias || undefined,
          isSubquery: true,
          subqueryColumns: subqueryInfo.columns,
          subquerySelectsStar: subqueryInfo.selectsStar,
          subqueryInnerTables: subqueryInfo.innerTables
        })
      }
    }
  }

  /**
   * 从 JOIN 表达式中提取表引用
   */
  private extractTableFromJoinExpr(joinExpr: CstNode, tables: TableRef[], seen: Set<string>): void {
    // JOIN 表达式有 left 和 right 两边
    if (joinExpr.left) {
      this.extractTableFromExpr(joinExpr.left, tables, seen)
    }
    if (joinExpr.right) {
      this.extractTableFromExpr(joinExpr.right, tables, seen)
    }
  }

  /**
   * 添加表引用到列表
   */
  private addTableRef(
    expr: CstNode | null,
    alias: string | null,
    tables: TableRef[],
    seen: Set<string>
  ): void {
    if (!expr) return

    const name = this.getIdentifierName(expr)
    if (!name) return

    // 排除关键字
    const keywords = ['WHERE', 'GROUP', 'ORDER', 'LIMIT', 'HAVING', 'UNION', 'ON', 'AND', 'OR']
    if (keywords.includes(name.toUpperCase())) return

    const key = (alias || name).toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      tables.push({
        name,
        alias: alias || undefined
      })
    }
  }

  /**
   * 从标识符节点获取名称
   */
  private getIdentifierName(node: CstNode | null): string | null {
    if (!node) return null

    if (node.type === 'identifier') {
      // 处理带反引号的标识符
      if (node.text) {
        return node.text.replace(/^`|`$/g, '')
      }
      if (node.name) {
        return node.name.replace(/^`|`$/g, '')
      }
    }

    if (node.type === 'member_expr') {
      // 处理 database.table 形式
      const object = this.getIdentifierName(node.object)
      const property = this.getIdentifierName(node.property)
      return property || object
    }

    return null
  }

  /**
   * 提取子查询信息
   */
  private extractSubqueryInfo(selectStmt: CstNode): {
    columns: string[]
    selectsStar: boolean
    innerTables: string[]
  } {
    const columns: string[] = []
    let selectsStar = false
    const innerTables: string[] = []

    // 提取 SELECT 子句中的列
    const selectClause = selectStmt.clauses?.find((c: CstNode) => c.type === 'select_clause')
    if (selectClause?.columns) {
      const columnItems = selectClause.columns.items || [selectClause.columns]
      
      for (const col of columnItems) {
        if (col.type === 'all_columns') {
          // SELECT *
          selectsStar = true
        } else if (col.type === 'alias') {
          // SELECT expr AS alias
          const aliasName = this.getIdentifierName(col.alias)
          if (aliasName) {
            columns.push(aliasName)
          }
        } else if (col.type === 'identifier') {
          // SELECT column_name
          const colName = this.getIdentifierName(col)
          if (colName) {
            columns.push(colName)
          }
        } else if (col.type === 'member_expr') {
          // SELECT table.column
          const colName = this.getIdentifierName(col.property)
          if (colName) {
            columns.push(colName)
          }
        }
      }
    }

    // 提取 FROM 子句中的表名（用于 SELECT * 时获取字段）
    const fromClause = selectStmt.clauses?.find((c: CstNode) => c.type === 'from_clause')
    if (fromClause) {
      const innerTableRefs = this.extractTablesFromCST({ type: 'root', clauses: [fromClause] } as CstNode)
      for (const ref of innerTableRefs) {
        if (!ref.isSubquery) {
          innerTables.push(ref.name)
        }
      }
    }

    return { columns, selectsStar, innerTables }
  }

  /**
   * 从 SQL 文本中提取表引用（正则降级方案）
   */
  private extractTablesFromSqlRegex(sql: string): TableRef[] {
    const tables: TableRef[] = []
    const seen = new Set<string>()

    // 匹配 FROM 子句
    const fromRegex = /\bFROM\s+([^;]+?)(?:\bWHERE\b|\bGROUP\b|\bORDER\b|\bLIMIT\b|\bUNION\b|;|$)/gi
    let fromMatch
    while ((fromMatch = fromRegex.exec(sql)) !== null) {
      this.parseTableClause(fromMatch[1], tables, seen)
    }

    // 匹配 JOIN 子句
    const joinRegex = /\b(?:INNER|LEFT|RIGHT|OUTER|CROSS)?\s*JOIN\s+(\w+)(?:\s+(?:AS\s+)?(\w+))?/gi
    let joinMatch
    while ((joinMatch = joinRegex.exec(sql)) !== null) {
      const name = joinMatch[1]
      const alias = joinMatch[2]
      const key = (alias || name).toLowerCase()
      if (!seen.has(key)) {
        seen.add(key)
        tables.push({ name, alias })
      }
    }

    return tables
  }

  /**
   * 解析表子句
   */
  private parseTableClause(clause: string, tables: TableRef[], seen: Set<string>): void {
    // 移除 JOIN 部分，只处理逗号分隔的表
    const withoutJoin = clause.split(/\b(?:INNER|LEFT|RIGHT|OUTER|CROSS)?\s*JOIN\b/i)[0]
    
    // 按逗号分割
    const parts = withoutJoin.split(',')
    
    for (const part of parts) {
      const trimmed = part.trim()
      if (!trimmed) continue
      
      // 匹配: table_name [AS] alias 或 table_name alias 或 table_name
      const match = trimmed.match(/^(\w+)(?:\s+(?:AS\s+)?(\w+))?/i)
      if (match) {
        const name = match[1]
        const alias = match[2]
        
        // 排除关键字
        if (['WHERE', 'GROUP', 'ORDER', 'LIMIT', 'HAVING', 'UNION'].includes(name.toUpperCase())) {
          continue
        }
        
        const key = (alias || name).toLowerCase()
        if (!seen.has(key)) {
          seen.add(key)
          tables.push({ name, alias })
        }
      }
    }
  }

}
