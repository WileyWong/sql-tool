/**
 * 悬浮提示提供者
 */

import { Hover, Position, MarkupKind } from 'vscode-languageserver'
import { MetadataService } from '../services/metadataService'
import { SqlParserService, splitStatements } from '../services/sqlParserService'
import { t } from '../../i18n'
import { HoverActionBuilder } from './hoverActionBuilder'
import type { HoverAction } from '../types'

/**
 * 扩展的 Hover 结果，包含表信息用于前端交互
 */
export interface HoverResult {
  hover: Hover
  tableInfo?: {
    name: string
  }
  /** 快捷操作列表 */
  actions?: HoverAction[]
}

export class HoverProvider {
  private metadataService: MetadataService
  private sqlParser: SqlParserService
  private actionBuilder: HoverActionBuilder

  constructor(metadataService: MetadataService) {
    this.metadataService = metadataService
    this.sqlParser = new SqlParserService()
    this.actionBuilder = new HoverActionBuilder(
      this.metadataService, this.sqlParser
    )
  }

  /**
   * 提供悬浮提示
   */
  provideHover(documentText: string, position: Position): HoverResult | null {
    // * 特殊检测，委托 actionBuilder
    const starResult = this.actionBuilder.tryProvideStarHover(documentText, position)
    if (starResult) return starResult

    // 获取光标位置的单词
    const wordInfo = this.getWordAtPosition(documentText, position)
    if (!wordInfo) return null

    const { word, prefix } = wordInfo

    // 提取光标所在的当前语句（用于表引用解析）
    const currentStatement = this.extractCurrentStatementText(documentText, position)

    // 如果有前缀（表名.字段名），查找字段
    if (prefix) {
      const tableName = this.resolveTableAlias(currentStatement, prefix)
      const column = this.metadataService.getColumns(tableName).find(
        c => c.name.toLowerCase() === word.toLowerCase()
      )
      if (column) {
        const actions = this.actionBuilder.buildColumnActions(
          column, tableName, prefix, documentText, position
        )
        return {
          hover: this.createColumnHover(column, tableName),
          actions: actions.length > 0 ? actions : undefined
        }
      }
    }

    // 查找表
    const table = this.metadataService.getTable(word)
    if (table) {
      return {
        hover: this.createTableHover(table),
        tableInfo: { name: table.name }
      }
    }

    // 查找视图
    const view = this.metadataService.getView(word)
    if (view) {
      return { hover: this.createViewHover(view) }
    }

    // 查找函数
    const func = this.metadataService.getFunction(word)
    if (func) {
      return { hover: this.createFunctionHover(func) }
    }

    // 查找字段（无前缀，从当前语句上下文推断表）
    const dbType = this.metadataService.getDatabaseType()
    const tables = this.sqlParser.extractTablesFromSql(currentStatement, dbType)
    for (const tableRef of tables) {
      const columns = this.metadataService.getColumns(tableRef.name)
      const column = columns.find(c => c.name.toLowerCase() === word.toLowerCase())
      if (column) {
        const actions = this.actionBuilder.buildColumnActions(
          column, tableRef.name, undefined, documentText, position
        )
        return {
          hover: this.createColumnHover(column, tableRef.name),
          actions: actions.length > 0 ? actions : undefined
        }
      }
    }

    return null
  }

  /**
   * 从文档文本中提取光标所在的当前语句
   * 用于多语句场景下的精确表引用解析
   */
  private extractCurrentStatementText(documentText: string, position: Position): string {
    // 计算光标在文档中的偏移量
    const lines = documentText.split('\n')
    let offset = 0
    for (let i = 0; i < position.line && i < lines.length; i++) {
      offset += lines[i].length + 1 // +1 for newline
    }
    offset += position.character

    // 使用 splitStatements 分割语句
    const statements = splitStatements(documentText)
    
    // 找到包含光标的语句
    for (const stmt of statements) {
      if (offset >= stmt.start && offset <= stmt.end) {
        return stmt.text
      }
    }

    // 未找到匹配的语句，返回整个文档（降级处理）
    return documentText
  }

  /**
   * 获取位置处的单词
   */
  private getWordAtPosition(text: string, position: Position): { word: string; prefix?: string } | null {
    const lines = text.split('\n')
    if (position.line >= lines.length) return null

    const line = lines[position.line]
    if (position.character > line.length) return null

    // 向前查找单词边界
    let start = position.character
    while (start > 0 && /[\w]/.test(line[start - 1])) {
      start--
    }

    // 向后查找单词边界
    let end = position.character
    while (end < line.length && /[\w]/.test(line[end])) {
      end++
    }

    if (start === end) return null

    const word = line.substring(start, end)

    // 检查是否有前缀（表名.）
    let prefix: string | undefined
    if (start > 0 && line[start - 1] === '.') {
      let prefixStart = start - 2
      while (prefixStart >= 0 && /[\w]/.test(line[prefixStart])) {
        prefixStart--
      }
      prefix = line.substring(prefixStart + 1, start - 1)
    }

    return { word, prefix }
  }

  /**
   * 解析表别名
   */
  private resolveTableAlias(sql: string, alias: string): string {
    const dbType = this.metadataService.getDatabaseType()
    const tables = this.sqlParser.extractTablesFromSql(sql, dbType)
    for (const table of tables) {
      if (table.alias?.toLowerCase() === alias.toLowerCase()) {
        return table.name
      }
      if (table.name.toLowerCase() === alias.toLowerCase()) {
        return table.name
      }
    }
    return alias
  }

  /**
   * 创建表的悬浮提示
   */
  private createTableHover(table: { name: string; comment?: string; columns: any[] }): Hover {
    const lines: string[] = []
    
    // 表名行：使用反引号包裹，渲染为 code 标签，前端通过点击 code 来触发打开表管理
    lines.push(`**${t('hover.table')}**: \`${table.name}\``)
    lines.push('')
    
    if (table.comment) {
      lines.push(`**${t('hover.description')}**: ${table.comment}`)
      lines.push('')
    }
    
    lines.push(`**${t('hover.columnCount')}**: ${table.columns.length}`)
    lines.push('')
    
    // 显示所有字段（不再限制为前 5 个）
    if (table.columns.length > 0) {
      lines.push(`**${t('hover.columnList')}**:`)
      lines.push('')
      
      for (const col of table.columns) {
        const nullable = col.nullable ? '' : ' NOT NULL'
        // 主键标识
        const pkIcon = col.isPrimaryKey ? ' 🔑' : ''
        // 字段注释
        const comment = col.comment ? ` // ${col.comment}` : ''
        lines.push(`- \`${col.name}\`${pkIcon}: ${col.type}${nullable}${comment}`)
      }
    }
    return {
      contents: {
        kind: MarkupKind.Markdown,
        value: lines.join('\n')
      }
    }
  }

  /**
   * 创建视图的悬浮提示
   */
  private createViewHover(view: { name: string; comment?: string }): Hover {
    const lines: string[] = []
    
    lines.push(`**${t('hover.view')}**: \`${view.name}\``)
    
    if (view.comment) {
      lines.push('')
      lines.push(`**${t('hover.description')}**: ${view.comment}`)
    }

    return {
      contents: {
        kind: MarkupKind.Markdown,
        value: lines.join('\n')
      }
    }
  }

  /**
   * 创建字段的悬浮提示
   */
  private createColumnHover(
    column: { name: string; type: string; nullable: boolean; defaultValue?: string; comment?: string; isPrimaryKey?: boolean },
    tableName: string
  ): Hover {
    const lines: string[] = []
    
    lines.push(`**${t('hover.column')}**: \`${column.name}\``)
    lines.push('')
    lines.push(`**${t('hover.type')}**: \`${column.type}\``)
    lines.push(`**${t('hover.nullable')}**: ${column.nullable ? t('hover.nullableYes') : t('hover.nullableNo')}`)
    
    if (column.isPrimaryKey) {
      lines.push(`**${t('hover.primaryKey')}**: ${t('hover.primaryKeyYes')}`)
    }
    
    if (column.defaultValue !== undefined) {
      lines.push(`**${t('hover.defaultValue')}**: \`${column.defaultValue}\``)
    }
    
    if (column.comment) {
      lines.push('')
      lines.push(`**${t('hover.description')}**: ${column.comment}`)
    }
    
    lines.push('')
    lines.push(`*${t('hover.fromTable')} \`${tableName}\`*`)

    return {
      contents: {
        kind: MarkupKind.Markdown,
        value: lines.join('\n')
      }
    }
  }

  /**
   * 创建函数的悬浮提示
   */
  private createFunctionHover(func: { name: string; signature: string; description?: string; returnType?: string }): Hover {
    const lines: string[] = []
    
    lines.push(`**${t('hover.function')}**: \`${func.name}\``)
    lines.push('')
    lines.push(`**${t('hover.syntax')}**: \`${func.signature}\``)
    
    if (func.returnType) {
      lines.push(`**${t('hover.returnType')}**: \`${func.returnType}\``)
    }
    
    if (func.description) {
      lines.push('')
      lines.push(`**${t('hover.description')}**: ${func.description}`)
    }

    return {
      contents: {
        kind: MarkupKind.Markdown,
        value: lines.join('\n')
      }
    }
  }
}
