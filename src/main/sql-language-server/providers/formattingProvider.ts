/**
 * 代码格式化提供者
 */

import { TextEdit, Range } from 'vscode-languageserver'
import { format, type SqlLanguage } from 'sql-formatter'
import { MetadataService } from '../services/metadataService'

export class FormattingProvider {
  private metadataService: MetadataService

  constructor(metadataService: MetadataService) {
    this.metadataService = metadataService
  }

  /**
   * 获取 sql-formatter 的 language
   */
  private getFormatterLanguage(): SqlLanguage {
    const dbType = this.metadataService.getDatabaseType()
    switch (dbType) {
      case 'sqlserver':
        return 'tsql'
      case 'mysql':
      default:
        return 'mysql'
    }
  }

  /**
   * 格式化整个文档
   */
  formatDocument(documentText: string): TextEdit[] {
    try {
      const language = this.getFormatterLanguage()
      const formatted = format(documentText, {
        language,
        tabWidth: 2,
        useTabs: false,
        keywordCase: 'upper',
        identifierCase: 'preserve',
        dataTypeCase: 'upper',
        functionCase: 'upper',
        linesBetweenQueries: 2,
        denseOperators: false,
        newlineBeforeSemicolon: false
      })

      // 计算文档范围
      const lines = documentText.split('\n')
      const lastLine = lines.length - 1
      const lastChar = lines[lastLine].length

      return [{
        range: {
          start: { line: 0, character: 0 },
          end: { line: lastLine, character: lastChar }
        },
        newText: formatted
      }]
    } catch (error) {
      // 格式化失败，返回空数组
      console.error('SQL 格式化失败:', error)
      return []
    }
  }

  /**
   * 格式化选中区域
   */
  formatRange(documentText: string, range: Range): TextEdit[] {
    try {
      // 提取选中的文本
      const lines = documentText.split('\n')
      const selectedLines = lines.slice(range.start.line, range.end.line + 1)
      
      // 调整首尾行
      if (selectedLines.length > 0) {
        selectedLines[0] = selectedLines[0].substring(range.start.character)
        const lastIdx = selectedLines.length - 1
        if (range.start.line === range.end.line) {
          selectedLines[lastIdx] = selectedLines[lastIdx].substring(0, range.end.character - range.start.character)
        } else {
          selectedLines[lastIdx] = selectedLines[lastIdx].substring(0, range.end.character)
        }
      }

      const selectedText = selectedLines.join('\n')
      const language = this.getFormatterLanguage()

      const formatted = format(selectedText, {
        language,
        tabWidth: 2,
        useTabs: false,
        keywordCase: 'upper',
        identifierCase: 'preserve',
        dataTypeCase: 'upper',
        functionCase: 'upper',
        denseOperators: false,
        newlineBeforeSemicolon: false
      })

      return [{
        range,
        newText: formatted
      }]
    } catch (error) {
      console.error('SQL 格式化失败:', error)
      return []
    }
  }
}
