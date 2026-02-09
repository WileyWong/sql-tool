/**
 * 语法诊断提供者
 */

import { Diagnostic, DiagnosticSeverity, Range } from 'vscode-languageserver'
import { Parser } from 'node-sql-parser'
import { splitStatements, mapToParserDialect } from '../services/sqlParserService'
import { MetadataService } from '../services/metadataService'

export class DiagnosticProvider {
  private metadataService: MetadataService
  private parser: Parser

  constructor(metadataService: MetadataService) {
    this.metadataService = metadataService
    this.parser = new Parser()
  }

  /**
   * 验证 SQL 文档
   */
  validate(documentText: string): Diagnostic[] {
    const diagnostics: Diagnostic[] = []
    const dbType = this.metadataService.getDatabaseType()
    const dialect = mapToParserDialect(dbType)

    // 按语句分割
    const statements = splitStatements(documentText)

    for (const stmt of statements) {
      if (!stmt.text.trim()) continue

      try {
        // 尝试解析
        this.parser.astify(stmt.text, { database: dialect })
      } catch (error: any) {
        // 解析失败，生成诊断信息
        const diagnostic = this.createDiagnostic(error, stmt, documentText)
        if (diagnostic) {
          diagnostics.push(diagnostic)
        }
      }
    }

    return diagnostics
  }

  /**
   * 创建诊断信息
   */
  private createDiagnostic(
    error: any,
    stmt: { text: string; start: number; end: number },
    fullText: string
  ): Diagnostic | null {
    let errorOffset = stmt.start
    let errorLength = 1

    // node-sql-parser 错误位置提取
    if (error.location) {
      const loc = error.location
      if (loc.start) {
        errorOffset = stmt.start + (loc.start.offset || 0)
      }
      if (loc.end && loc.start) {
        errorLength = (loc.end.offset || 0) - (loc.start.offset || 0)
      }
    } else if (error.message) {
      // 从错误消息中提取位置: "... at line X column Y"
      const posMatch = error.message.match(/line\s+(\d+)\s+column\s+(\d+)/i)
      if (posMatch) {
        const errorLine = parseInt(posMatch[1], 10) - 1
        const errorCol = parseInt(posMatch[2], 10) - 1
        errorOffset = stmt.start + this.lineColToOffset(stmt.text, errorLine, errorCol)
      }
    }

    // 确保 errorLength 至少为 1
    errorLength = Math.max(1, errorLength)

    // 转换为行列位置
    const range = this.offsetToRange(fullText, errorOffset, errorLength)

    // 提取错误消息
    let message = error.message || '语法错误'
    message = this.cleanErrorMessage(message)

    return {
      severity: DiagnosticSeverity.Error,
      range,
      message,
      source: 'sql'
    }
  }

  /**
   * 行列号转偏移量
   */
  private lineColToOffset(text: string, line: number, col: number): number {
    const lines = text.split('\n')
    let offset = 0
    for (let i = 0; i < line && i < lines.length; i++) {
      offset += lines[i].length + 1
    }
    offset += col
    return Math.min(offset, text.length)
  }

  /**
   * 偏移量转换为范围
   */
  private offsetToRange(text: string, offset: number, length: number): Range {
    let line = 0
    let character = 0
    let currentOffset = 0

    // 找到起始位置
    for (let i = 0; i < text.length && currentOffset < offset; i++) {
      if (text[i] === '\n') {
        line++
        character = 0
      } else {
        character++
      }
      currentOffset++
    }

    const startLine = line
    const startCharacter = character

    // 找到结束位置
    for (let i = 0; i < length && currentOffset + i < text.length; i++) {
      if (text[currentOffset + i] === '\n') {
        line++
        character = 0
      } else {
        character++
      }
    }

    return {
      start: { line: startLine, character: startCharacter },
      end: { line, character }
    }
  }

  /**
   * 清理错误消息
   */
  private cleanErrorMessage(message: string): string {
    let cleaned = message

    // 移除位置信息前缀
    cleaned = cleaned.replace(/^Syntax error at line \d+ column \d+\s*/i, '')

    // 替换常见的技术术语
    cleaned = cleaned.replace(/Unexpected token/gi, '意外的符号')
    cleaned = cleaned.replace(/Expected/gi, '期望')
    cleaned = cleaned.replace(/but found/gi, '但发现')
    cleaned = cleaned.replace(/end of input/gi, '输入结束')
    cleaned = cleaned.replace(/identifier/gi, '标识符')
    cleaned = cleaned.replace(/keyword/gi, '关键字')
    cleaned = cleaned.replace(/string/gi, '字符串')
    cleaned = cleaned.replace(/number/gi, '数字')

    // 限制消息长度
    if (cleaned.length > 200) {
      cleaned = cleaned.substring(0, 200) + '...'
    }

    return cleaned
  }
}
