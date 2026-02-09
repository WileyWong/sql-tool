/**
 * 悬浮提示提供者
 */

import { Hover, Position, MarkupKind } from 'vscode-languageserver'
import { MetadataService } from '../services/metadataService'
import { SqlParserService } from '../services/sqlParserService'

/**
 * 扩展的 Hover 结果，包含表信息用于前端交互
 */
export interface HoverResult {
  hover: Hover
  tableInfo?: {
    name: string
  }
}

export class HoverProvider {
  private metadataService: MetadataService
  private sqlParser: SqlParserService

  constructor(metadataService: MetadataService) {
    this.metadataService = metadataService
    this.sqlParser = new SqlParserService()
  }

  /**
   * 提供悬浮提示
   */
  provideHover(documentText: string, position: Position): HoverResult | null {
    // 获取光标位置的单词
    const wordInfo = this.getWordAtPosition(documentText, position)
    if (!wordInfo) return null

    const { word, prefix } = wordInfo

    // 如果有前缀（表名.字段名），查找字段
    if (prefix) {
      const tableName = this.resolveTableAlias(documentText, prefix)
      const column = this.metadataService.getColumns(tableName).find(
        c => c.name.toLowerCase() === word.toLowerCase()
      )
      if (column) {
        return { hover: this.createColumnHover(column, tableName) }
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

    // 查找字段（无前缀，从上下文推断表）
    const dbType = this.metadataService.getDatabaseType()
    const tables = this.sqlParser.extractTablesFromSql(documentText, dbType)
    for (const tableRef of tables) {
      const columns = this.metadataService.getColumns(tableRef.name)
      const column = columns.find(c => c.name.toLowerCase() === word.toLowerCase())
      if (column) {
        return { hover: this.createColumnHover(column, tableRef.name) }
      }
    }

    return null
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
    lines.push(`**表**: \`${table.name}\``)
    lines.push('')
    
    if (table.comment) {
      lines.push(`**说明**: ${table.comment}`)
      lines.push('')
    }
    
    lines.push(`**字段数**: ${table.columns.length}`)
    lines.push('')
    
    // 显示所有字段（不再限制为前 5 个）
    if (table.columns.length > 0) {
      lines.push('**字段列表**:')
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
    
    lines.push(`**视图**: \`${view.name}\``)
    
    if (view.comment) {
      lines.push('')
      lines.push(`**说明**: ${view.comment}`)
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
    
    lines.push(`**字段**: \`${column.name}\``)
    lines.push('')
    lines.push(`**类型**: \`${column.type}\``)
    lines.push(`**可空**: ${column.nullable ? '是' : '否'}`)
    
    if (column.isPrimaryKey) {
      lines.push(`**主键**: 是`)
    }
    
    if (column.defaultValue !== undefined) {
      lines.push(`**默认值**: \`${column.defaultValue}\``)
    }
    
    if (column.comment) {
      lines.push('')
      lines.push(`**说明**: ${column.comment}`)
    }
    
    lines.push('')
    lines.push(`*来自表 \`${tableName}\`*`)

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
    
    lines.push(`**函数**: \`${func.name}\``)
    lines.push('')
    lines.push(`**语法**: \`${func.signature}\``)
    
    if (func.returnType) {
      lines.push(`**返回类型**: \`${func.returnType}\``)
    }
    
    if (func.description) {
      lines.push('')
      lines.push(`**说明**: ${func.description}`)
    }

    return {
      contents: {
        kind: MarkupKind.Markdown,
        value: lines.join('\n')
      }
    }
  }
}
