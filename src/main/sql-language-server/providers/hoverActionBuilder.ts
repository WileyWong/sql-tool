/**
 * Hover 快捷操作构建器
 * 负责所有快捷操作的判断与构建逻辑
 * HoverProvider 通过组合持有它的实例，仅在入口处做简单委托
 */

import { MarkupKind } from 'vscode-languageserver'
import type { Position } from 'vscode-languageserver'
import { MetadataService } from '../services/metadataService'
import { SqlParserService, splitStatements } from '../services/sqlParserService'
import type { HoverAction, ColumnMetadata, TableRef } from '../types'
import { t } from '../../i18n'
import type { HoverResult } from './hoverProvider'

export class HoverActionBuilder {
  private metadataService: MetadataService
  private sqlParser: SqlParserService

  constructor(metadataService: MetadataService, sqlParser: SqlParserService) {
    this.metadataService = metadataService
    this.sqlParser = sqlParser
  }

  // ── * 展开相关 ──

  /**
   * 尝试为 * 字符提供 hover（含快捷操作）
   * 在 getWordAtPosition 之前调用，解决 * 不属于 \w 字符集的问题
   */
  tryProvideStarHover(
    documentText: string,
    position: Position
  ): HoverResult | null {
    const lines = documentText.split('\n')
    if (position.line >= lines.length) return null

    const line = lines[position.line]
    if (position.character >= line.length) return null

    // 1. 检查光标位置的字符是否为 *
    if (line[position.character] !== '*') return null

    // 2. 检查 * 是否在 SELECT 列区域（复用 SqlParserService 的通用方法）
    if (!this.sqlParser.isPositionInSelectClause(documentText, position)) return null

    // 3. 从当前语句提取表引用
    const currentStatement = this.extractCurrentStatementText(documentText, position)
    const dbType = this.metadataService.getDatabaseType()
    const tables = this.sqlParser.extractTablesFromSql(currentStatement, dbType)
    if (tables.length === 0) return null

    // 4. 检查所有表是否在元数据中
    const validTables = tables.filter(tRef => this.metadataService.hasTable(tRef.name))
    if (validTables.length === 0) return null

    // 5. 构建替换文本
    const replaceText = this.buildExpandedColumns(validTables)

    // 6. 构建 HoverAction（range 使用 1-based）
    const action: HoverAction = {
      type: 'expand_star',
      title: t('hover.actionExpandStar'),
      description: t('hover.actionExpandStarDesc'),
      replaceText,
      range: {
        startLineNumber: position.line + 1,       // 0-based → 1-based
        startColumn: position.character + 1,       // 0-based → 1-based
        endLineNumber: position.line + 1,
        endColumn: position.character + 2          // * 是单字符，结束列 = 起始列 + 1
      }
    }

    // 7. 构建 hover Markdown 内容
    const hoverMarkdown = this.buildStarHoverMarkdown()

    return {
      hover: {
        contents: {
          kind: MarkupKind.Markdown,
          value: hoverMarkdown
        }
      },
      actions: [action]
    }
  }

  /**
   * 从文档文本中提取光标所在的当前语句文本
   * 复用 splitStatements，与 HoverProvider.extractCurrentStatementText 逻辑一致
   */
  private extractCurrentStatementText(documentText: string, position: Position): string {
    const lines = documentText.split('\n')
    let offset = 0
    for (let i = 0; i < position.line && i < lines.length; i++) {
      offset += lines[i].length + 1
    }
    offset += position.character

    const statements = splitStatements(documentText)
    for (const stmt of statements) {
      if (offset >= stmt.start && offset <= stmt.end) {
        return stmt.text
      }
    }
    return documentText
  }

  /**
   * 构建展开后的列文本
   */
  private buildExpandedColumns(tables: TableRef[]): string {
    const isMultiTable = tables.length > 1
    const columnLines: string[] = []

    for (const tableRef of tables) {
      const columns = this.metadataService.getColumns(tableRef.name)
      for (const col of columns) {
        if (isMultiTable) {
          // 多表时加表前缀（优先用别名）
          const prefix = tableRef.alias || tableRef.name
          columnLines.push(`  ${prefix}.${col.name}`)
        } else {
          // 单表不加前缀
          columnLines.push(`  ${col.name}`)
        }
      }
    }

    // 格式化：每行一个字段，逗号跟在字段后，最后一个无逗号
    const formatted = columnLines
      .map((line, index) => {
        return index < columnLines.length - 1 ? `${line},` : line
      })
      .join('\n')

    return `\n${formatted}\n`
  }

  /**
   * 构建 * hover 的 Markdown 内容（不含快捷操作部分，操作由前端追加）
   */
  private buildStarHoverMarkdown(): string {
    return `**${t('hover.selectAll')}**: \`*\``
  }

  // ── FROM_UNIXTIME 相关 ──

  /**
   * 为列构建可用的快捷操作列表
   * 由 HoverProvider 在列查找成功后调用
   */
  buildColumnActions(
    column: ColumnMetadata,
    tableName: string,
    prefix: string | undefined,
    documentText: string,
    position: Position
  ): HoverAction[] {
    const actions: HoverAction[] = []
    const dbType = this.metadataService.getDatabaseType()

    // FROM_UNIXTIME 操作（仅 MySQL）
    if (dbType === 'mysql' && this.isIntegerType(column.type)) {
      const fromUnixAction = this.tryBuildFromUnixtimeAction(
        column, tableName, prefix, documentText, position
      )
      if (fromUnixAction) {
        actions.push(fromUnixAction)
      }
    }

    return actions
  }

  /**
   * 检查列类型是否为整数类型（可能存储时间戳）
   * 仅限整数类型，排除 decimal/float/double 避免金额字段误触发
   */
  private isIntegerType(columnType: string): boolean {
    const normalizedType = columnType.toLowerCase().trim()
    return /^(int|bigint|tinyint|smallint|mediumint|integer)(\s|$|\()/.test(normalizedType)
  }

  /**
   * 尝试构建 FROM_UNIXTIME 快捷操作
   * 需要满足：列在 SELECT 区域 + 未被函数包裹
   */
  private tryBuildFromUnixtimeAction(
    column: ColumnMetadata,
    _tableName: string,
    prefix: string | undefined,
    documentText: string,
    position: Position
  ): HoverAction | null {
    // 1. 检查列是否在 SELECT 列区域（调用 SqlParserService）
    if (!this.sqlParser.isPositionInSelectClause(documentText, position)) {
      return null
    }

    // 2. 检查列是否被函数包裹（调用 SqlParserService）
    if (this.sqlParser.isColumnWrappedByFunction(documentText, position)) {
      return null
    }

    // 3. 解析列表达式的完整范围（含别名、表前缀）（调用 SqlParserService）
    const exprInfo = this.sqlParser.parseColumnExpression(documentText, position)
    if (!exprInfo) return null

    // 4. 构建替换文本
    const columnRef = prefix ? `${prefix}.${column.name}` : column.name
    const alias = exprInfo.alias || column.name
    const replaceText = `FROM_UNIXTIME(${columnRef}) AS ${alias}`

    // 5. 构建 range（0-based → 1-based）
    return {
      type: 'from_unixtime',
      title: t('hover.actionFromUnixtime'),
      description: `${t('hover.actionFromUnixtimeDesc')}(${columnRef}) AS ${alias}`,
      replaceText,
      range: {
        startLineNumber: exprInfo.startLine + 1,
        startColumn: exprInfo.startColumn + 1,
        endLineNumber: exprInfo.endLine + 1,
        endColumn: exprInfo.endColumn + 1
      }
    }
  }
}
