/**
 * 语法诊断提供者
 */

import { Diagnostic, DiagnosticSeverity, Range } from 'vscode-languageserver'
import { parse } from 'sql-parser-cst'

export class DiagnosticProvider {
  /**
   * 验证 SQL 文档
   */
  validate(documentText: string): Diagnostic[] {
    const diagnostics: Diagnostic[] = []

    // 按语句分割
    const statements = this.splitStatements(documentText)

    for (const stmt of statements) {
      if (!stmt.text.trim()) continue

      try {
        // 尝试解析
        parse(stmt.text, { dialect: 'mysql' })
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
   * 分割 SQL 语句
   */
  private splitStatements(sql: string): { text: string; start: number; end: number }[] {
    const statements: { text: string; start: number; end: number }[] = []
    let start = 0
    let inString = false
    let stringChar = ''
    let inComment = false
    let blockComment = false

    for (let i = 0; i < sql.length; i++) {
      const char = sql[i]
      const nextChar = sql[i + 1]
      const prevChar = sql[i - 1]

      // 处理注释
      if (!inString && !inComment) {
        if (char === '-' && nextChar === '-') {
          inComment = true
          blockComment = false
          continue
        }
        if (char === '/' && nextChar === '*') {
          inComment = true
          blockComment = true
          i++
          continue
        }
      }

      if (inComment) {
        if (blockComment && char === '*' && nextChar === '/') {
          inComment = false
          i++
          continue
        }
        if (!blockComment && char === '\n') {
          inComment = false
        }
        continue
      }

      // 处理字符串
      if (!inString && (char === "'" || char === '"' || char === '`')) {
        inString = true
        stringChar = char
      } else if (inString && char === stringChar && prevChar !== '\\') {
        inString = false
      }

      // 分号分割
      if (!inString && !inComment && char === ';') {
        statements.push({
          text: sql.substring(start, i + 1),
          start,
          end: i + 1
        })
        start = i + 1
      }
    }

    // 最后一条语句
    if (start < sql.length) {
      const remaining = sql.substring(start).trim()
      if (remaining) {
        statements.push({
          text: sql.substring(start),
          start,
          end: sql.length
        })
      }
    }

    return statements
  }

  /**
   * 创建诊断信息
   */
  private createDiagnostic(
    error: any,
    stmt: { text: string; start: number; end: number },
    fullText: string
  ): Diagnostic | null {
    // 尝试从错误中提取位置信息
    let errorOffset = stmt.start
    let errorLength = 1

    if (error.location) {
      // sql-parser-cst 提供位置信息
      const loc = error.location
      if (loc.start) {
        errorOffset = stmt.start + (loc.start.offset || 0)
      }
      if (loc.end && loc.start) {
        errorLength = (loc.end.offset || 0) - (loc.start.offset || 0)
      }
    } else if (error.offset !== undefined) {
      errorOffset = stmt.start + error.offset
    }

    // 确保 errorLength 至少为 1
    errorLength = Math.max(1, errorLength)

    // 转换为行列位置
    const range = this.offsetToRange(fullText, errorOffset, errorLength)

    // 提取错误消息
    let message = error.message || '语法错误'
    
    // 清理错误消息
    message = this.cleanErrorMessage(message)

    return {
      severity: DiagnosticSeverity.Error,
      range,
      message,
      source: 'sql'
    }
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
    // 移除技术细节，保留用户友好的消息
    let cleaned = message

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
