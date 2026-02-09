/**
 * 自动补全提供者
 */

import {
  CompletionItem,
  CompletionItemKind,
  InsertTextFormat,
  Position,
} from 'vscode-languageserver'
import { SqlParserService, isInStringOrComment, findLastSemicolonPosition } from '../services/sqlParserService'
import { MetadataService } from '../services/metadataService'
import type { TableRef } from '../types'

/**
 * SQL 关键字列表
 */
const SQL_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'LIKE', 'BETWEEN', 'IS', 'NULL',
  'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE',
  'CREATE', 'TABLE', 'VIEW', 'INDEX', 'FUNCTION', 'PROCEDURE', 'TRIGGER', 'DATABASE',
  'ALTER', 'DROP', 'TRUNCATE', 'RENAME',
  'JOIN', 'INNER', 'LEFT', 'RIGHT', 'OUTER', 'CROSS', 'ON', 'USING',
  'GROUP', 'BY', 'HAVING', 'ORDER', 'ASC', 'DESC', 'LIMIT', 'OFFSET',
  'UNION', 'ALL', 'DISTINCT', 'AS', 'EXISTS',
  'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'UNIQUE', 'DEFAULT', 'AUTO_INCREMENT',
  'CONSTRAINT', 'CHECK', 'ENGINE', 'CHARSET', 'COLLATE', 'COMMENT',
  'INT', 'BIGINT', 'SMALLINT', 'TINYINT', 'FLOAT', 'DOUBLE', 'DECIMAL',
  'VARCHAR', 'CHAR', 'TEXT', 'LONGTEXT', 'MEDIUMTEXT', 'TINYTEXT',
  'DATE', 'DATETIME', 'TIMESTAMP', 'TIME', 'YEAR',
  'BOOLEAN', 'BOOL', 'BLOB', 'JSON', 'ENUM',
  'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
  'BEGIN', 'COMMIT', 'ROLLBACK', 'TRANSACTION',
  'EXPLAIN', 'SHOW', 'DESCRIBE', 'USE'
]

export class CompletionProvider {
  private sqlParser: SqlParserService
  private metadataService: MetadataService

  constructor(metadataService: MetadataService) {
    this.sqlParser = new SqlParserService()
    this.metadataService = metadataService
  }

  /**
   * 提供补全建议
   */
  provideCompletionItems(
    documentText: string,
    position: Position
  ): CompletionItem[] {
    const offset = this.getOffset(documentText, position)

    // 检查是否应该提供补全
    if (!this.shouldProvideCompletion(documentText, offset)) {
      return []
    }

    const context = this.sqlParser.analyzeCursorContext(documentText, offset)

    // console.log('[CompletionProvider] context:', context.type, 'position:', position, 'offset:', offset)

    const suggestions: CompletionItem[] = []

    switch (context.type) {
      case 'IN_COMMENT':
        // 注释内不提示
        break

      case 'STATEMENT_START':
        this.addKeywordSuggestions(suggestions)
        break

      case 'FROM_CLAUSE':
      case 'JOIN_CLAUSE':
        // console.log('[CompletionProvider] Adding table/view suggestions')
        this.addTableSuggestions(suggestions)
        this.addViewSuggestions(suggestions)
        break

      case 'SELECT_COLUMNS':
        if (context.tables && context.tables.length > 0) {
          this.addColumnSuggestionsForTables(suggestions, context.tables)
        }
        this.addFunctionSuggestions(suggestions)
        this.addKeywordSuggestions(suggestions, ['FROM', 'AS', 'DISTINCT'])
        break

      case 'WHERE_CLAUSE':
        if (context.tables && context.tables.length > 0) {
          this.addColumnSuggestionsForTables(suggestions, context.tables)
        }
        this.addFunctionSuggestions(suggestions)
        this.addKeywordSuggestions(suggestions, ['AND', 'OR', 'NOT', 'IN', 'LIKE', 'BETWEEN', 'IS', 'NULL', 'EXISTS'])
        break

      case 'ON_CLAUSE':
        if (context.tables && context.tables.length > 0) {
          this.addColumnSuggestionsForTables(suggestions, context.tables, true)
        }
        this.addKeywordSuggestions(suggestions, ['AND', 'OR'])
        break

      case 'ORDER_BY_CLAUSE':
        if (context.tables && context.tables.length > 0) {
          this.addColumnSuggestionsForTables(suggestions, context.tables, context.tables.length > 1)
        }
        this.addKeywordSuggestions(suggestions, ['ASC', 'DESC', 'NULLS', 'FIRST', 'LAST', 'LIMIT'])
        break

      case 'GROUP_BY_CLAUSE':
        if (context.tables && context.tables.length > 0) {
          this.addColumnSuggestionsForTables(suggestions, context.tables, context.tables.length > 1)
        }
        this.addKeywordSuggestions(suggestions, ['HAVING', 'ORDER', 'BY', 'WITH', 'ROLLUP'])
        break

      case 'TABLE_DOT':
        if (context.targetTable) {
          // 先检查是否是子查询别名
          this.addColumnSuggestionsForTableDot(suggestions, context.targetTable, documentText)
        }
        break

      case 'SUBQUERY_COLUMNS':
        if (context.subqueryColumns) {
          this.addSubqueryColumnSuggestions(suggestions, context.subqueryColumns)
        }
        break

      case 'DDL_CREATE':
        this.addDdlCreateSuggestions(suggestions)
        break

      case 'DDL_ALTER':
        this.addDdlAlterSuggestions(suggestions)
        break

      default:
        this.addKeywordSuggestions(suggestions)
        this.addTableSuggestions(suggestions)
    }

    // 去重 + 排序 + 限制 20 条
    return this.finalizeSuggestions(suggestions)
  }

  /**
   * 计算文本偏移量
   */
  private getOffset(text: string, position: Position): number {
    const lines = text.split('\n')
    let offset = 0
    for (let i = 0; i < position.line && i < lines.length; i++) {
      offset += lines[i].length + 1 // +1 for newline
    }
    offset += position.character
    return Math.min(offset, text.length)
  }

  /**
   * 添加关键字建议
   */
  private addKeywordSuggestions(suggestions: CompletionItem[], keywords?: string[]): void {
    const keywordList = keywords || SQL_KEYWORDS
    for (const keyword of keywordList) {
      suggestions.push({
        label: keyword,
        kind: CompletionItemKind.Keyword,
        insertText: keyword,
        detail: 'SQL 关键字',
        sortText: '2_' + keyword // 关键字排序靠后
      })
    }
  }

  /**
   * 添加表建议
   */
  private addTableSuggestions(suggestions: CompletionItem[]): void {    
    const tables = this.metadataService.getTables()
    for (const table of tables) {
      suggestions.push({
        label: table.name,
        kind: CompletionItemKind.Class,
        insertText: table.name,
        detail: table.comment ? `表 - ${table.comment}` : '表',
        documentation: `字段数: ${table.columns.length}`,
        sortText: '0_' + table.name // 表名优先
      })
    }
  }

  /**
   * 添加视图建议
   */
  private addViewSuggestions(suggestions: CompletionItem[]): void {
    const views = this.metadataService.getViews()
    for (const view of views) {
      suggestions.push({
        label: view.name,
        kind: CompletionItemKind.Interface,
        insertText: view.name,
        detail: view.comment ? `视图 - ${view.comment}` : '视图',
        sortText: '0_' + view.name
      })
    }
  }

  /**
   * 添加函数建议
   */
  private addFunctionSuggestions(suggestions: CompletionItem[]): void {
    const functions = this.metadataService.getFunctions()
    for (const fn of functions) {
      suggestions.push({
        label: fn.name,
        kind: CompletionItemKind.Function,
        insertText: fn.name + '($1)',
        insertTextFormat: InsertTextFormat.Snippet,
        detail: fn.signature,
        documentation: fn.description,
        sortText: '1_' + fn.name // 函数排序中间
      })
    }
  }

  /**
   * 为多个表添加字段建议（支持子查询）
   */
  private addColumnSuggestionsForTables(
    suggestions: CompletionItem[],
    tables: TableRef[],
    prefixRequired: boolean = false
  ): void {
    const needPrefix = prefixRequired || tables.length > 1

    for (const tableRef of tables) {
      if (tableRef.isSubquery) {
        // 处理子查询
        this.addSubqueryColumnSuggestionsFromTableRef(suggestions, tableRef, needPrefix)
      } else {
        // 普通表
        const columns = this.metadataService.getColumns(tableRef.name)
        const prefix = needPrefix ? `${tableRef.alias || tableRef.name}.` : ''
        
        for (const column of columns) {
          suggestions.push({
            label: prefix + column.name,
            kind: CompletionItemKind.Field,
            insertText: prefix + column.name,
            detail: `${column.type}${column.nullable ? '' : ' NOT NULL'}`,
            documentation: column.comment || `来自表 ${tableRef.name}`,
            sortText: '0_' + column.name // 字段优先
          })
        }
      }
    }
  }

  /**
   * 从子查询 TableRef 添加字段建议
   */
  private addSubqueryColumnSuggestionsFromTableRef(
    suggestions: CompletionItem[],
    tableRef: TableRef,
    needPrefix: boolean
  ): void {
    const prefix = needPrefix ? `${tableRef.alias || tableRef.name}.` : ''

    // 如果子查询有显式列名
    if (tableRef.subqueryColumns && tableRef.subqueryColumns.length > 0) {
      for (const colName of tableRef.subqueryColumns) {
        suggestions.push({
          label: prefix + colName,
          kind: CompletionItemKind.Field,
          insertText: prefix + colName,
          detail: '子查询字段',
          documentation: `来自子查询 ${tableRef.alias || ''}`,
          sortText: '0_' + colName
        })
      }
    }

    // 如果子查询使用 SELECT *，从内部表获取字段
    if (tableRef.subquerySelectsStar && tableRef.subqueryInnerTables) {
      for (const innerTable of tableRef.subqueryInnerTables) {
        const columns = this.metadataService.getColumns(innerTable)
        for (const column of columns) {
          suggestions.push({
            label: prefix + column.name,
            kind: CompletionItemKind.Field,
            insertText: prefix + column.name,
            detail: `${column.type}${column.nullable ? '' : ' NOT NULL'}`,
            documentation: `来自子查询内部表 ${innerTable}`,
            sortText: '0_' + column.name
          })
        }
      }
    }
  }

  /**
   * 为单个表添加字段建议
   */
  private addColumnSuggestionsForTable(
    suggestions: CompletionItem[],
    tableName: string
  ): void {
    const columns = this.metadataService.getColumns(tableName)
    for (const column of columns) {
      suggestions.push({
        label: column.name,
        kind: CompletionItemKind.Field,
        insertText: column.name,
        detail: `${column.type}${column.nullable ? '' : ' NOT NULL'}`,
        documentation: column.comment,
        sortText: '0_' + column.name
      })
    }
  }

  /**
   * 为 TABLE_DOT 场景添加字段建议（支持子查询别名）
   */
  private addColumnSuggestionsForTableDot(
    suggestions: CompletionItem[],
    targetTable: string,
    documentText: string
  ): void {
    // 先从 SQL 中提取所有表引用
    const dbType = this.metadataService.getDatabaseType()
    const tables = this.sqlParser.extractTablesFromSql(documentText, dbType)
    
    // 查找匹配的表引用
    const matchedTable = tables.find(
      t => t.alias?.toLowerCase() === targetTable.toLowerCase() ||
           t.name.toLowerCase() === targetTable.toLowerCase()
    )

    if (matchedTable) {
      if (matchedTable.isSubquery) {
        // 子查询别名
        this.addSubqueryColumnSuggestionsFromTableRef(suggestions, matchedTable, false)
      } else {
        // 普通表
        this.addColumnSuggestionsForTable(suggestions, matchedTable.name)
      }
    } else {
      // 降级：直接使用 targetTable 作为表名查询
      this.addColumnSuggestionsForTable(suggestions, targetTable)
    }
  }

  /**
   * 添加子查询字段建议
   */
  private addSubqueryColumnSuggestions(
    suggestions: CompletionItem[],
    columns: string[]
  ): void {
    for (const column of columns) {
      suggestions.push({
        label: column,
        kind: CompletionItemKind.Field,
        insertText: column,
        detail: '子查询字段',
        sortText: '0_' + column
      })
    }
  }

  /**
   * 添加 CREATE 语句建议
   */
  private addDdlCreateSuggestions(suggestions: CompletionItem[]): void {
    const templates = [
      {
        label: 'TABLE',
        snippet: 'TABLE ${1:table_name} (\n  ${2:id} INT PRIMARY KEY AUTO_INCREMENT,\n  ${3:column_name} VARCHAR(255),\n  created_at DATETIME DEFAULT CURRENT_TIMESTAMP\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4',
        detail: 'CREATE TABLE 模板'
      },
      {
        label: 'VIEW',
        snippet: 'VIEW ${1:view_name} AS\nSELECT ${2:*}\nFROM ${3:table_name}',
        detail: 'CREATE VIEW 模板'
      },
      {
        label: 'INDEX',
        snippet: 'INDEX ${1:index_name} ON ${2:table_name}(${3:column_name})',
        detail: 'CREATE INDEX 模板'
      },
      {
        label: 'UNIQUE INDEX',
        snippet: 'UNIQUE INDEX ${1:index_name} ON ${2:table_name}(${3:column_name})',
        detail: 'CREATE UNIQUE INDEX 模板'
      },
      {
        label: 'DATABASE',
        snippet: 'DATABASE ${1:database_name} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci',
        detail: 'CREATE DATABASE 模板'
      }
    ]

    for (const tpl of templates) {
      suggestions.push({
        label: tpl.label,
        kind: CompletionItemKind.Snippet,
        insertText: tpl.snippet,
        insertTextFormat: InsertTextFormat.Snippet,
        detail: tpl.detail,
        sortText: '0_' + tpl.label
      })
    }
  }

  /**
   * 添加 ALTER 语句建议
   */
  private addDdlAlterSuggestions(suggestions: CompletionItem[]): void {
    const templates = [
      {
        label: 'TABLE ADD COLUMN',
        snippet: 'TABLE ${1:table_name} ADD COLUMN ${2:column_name} ${3:VARCHAR(255)}',
        detail: 'ALTER TABLE ADD COLUMN'
      },
      {
        label: 'TABLE DROP COLUMN',
        snippet: 'TABLE ${1:table_name} DROP COLUMN ${2:column_name}',
        detail: 'ALTER TABLE DROP COLUMN'
      },
      {
        label: 'TABLE MODIFY COLUMN',
        snippet: 'TABLE ${1:table_name} MODIFY COLUMN ${2:column_name} ${3:VARCHAR(255)}',
        detail: 'ALTER TABLE MODIFY COLUMN'
      },
      {
        label: 'TABLE ADD INDEX',
        snippet: 'TABLE ${1:table_name} ADD INDEX ${2:index_name}(${3:column_name})',
        detail: 'ALTER TABLE ADD INDEX'
      },
      {
        label: 'TABLE RENAME',
        snippet: 'TABLE ${1:old_name} RENAME TO ${2:new_name}',
        detail: 'ALTER TABLE RENAME'
      }
    ]

    for (const tpl of templates) {
      suggestions.push({
        label: tpl.label,
        kind: CompletionItemKind.Snippet,
        insertText: tpl.snippet,
        insertTextFormat: InsertTextFormat.Snippet,
        detail: tpl.detail,
        sortText: '0_' + tpl.label
      })
    }
  }

  /**
   * 最终处理建议列表
   */
  private finalizeSuggestions(suggestions: CompletionItem[]): CompletionItem[] {
    // 去重
    const seen = new Set<string>()
    const unique = suggestions.filter(s => {
      const key = `${s.kind}:${s.label}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })

    // 按 sortText 排序
    unique.sort((a, b) => {
      const sortA = a.sortText || String(a.label)
      const sortB = b.sortText || String(b.label)
      return sortA.localeCompare(sortB)
    })

    // 限制 20 条
    return unique
  }

  /**
   * 判断是否应该提供补全
   * 过滤掉以下情况：
   * 1. 光标前没有有效内容（空白或空文档）
   * 2. 光标在注释内
   * 3. 光标在字符串内
   * 4. 语句已结束（分号后只有空白）
   */
  private shouldProvideCompletion(documentText: string, offset: number): boolean {
    const textBefore = documentText.substring(0, offset)

    // 如果光标前完全没有内容或只有空白，不补全
    const trimmedBefore = textBefore.trim()
    if (!trimmedBefore) {
      return false
    }

    // 检查是否在语句结束后（分号后只有空白）
    const lastSemicolonPos = findLastSemicolonPosition(textBefore)
    if (lastSemicolonPos !== -1) {
      const afterSemicolon = textBefore.substring(lastSemicolonPos + 1)
      if (!afterSemicolon.trim()) {
        return false
      }
    }

    // 如果最后一个有效字符是分号，不补全
    if (trimmedBefore.endsWith(';')) {
      return false
    }

    // 检查是否在字符串或注释内
    if (isInStringOrComment(textBefore)) {
      return false
    }

    // 其他情况允许补全
    return true
  }
}
