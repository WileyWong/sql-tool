import { describe, expect, it } from 'vitest'
import { DiagnosticProvider } from '../../src/main/sql-language-server/providers/diagnosticProvider'
import type { MetadataService } from '../../src/main/sql-language-server/services/metadataService'

const sql = `
ALTER TABLE \`recruitresume\`.\`bresume_ai_call_task\` DROP COLUMN \`scheduled_time\`;
ALTER TABLE bresume_ai_call_task
  ADD COLUMN start_time DATETIME NULL
  COMMENT '预约外呼时间（NULL=立即呼出）'
  AFTER force_submit;
`

describe('DiagnosticProvider', () => {
  it('使用请求携带的 MySQL 方言解析当前标签页 SQL', () => {
    const staleMetadata = {
      getDatabaseType: () => 'sqlserver'
    } as MetadataService
    const provider = new DiagnosticProvider(staleMetadata)

    expect(provider.validate(sql, 'mysql')).toEqual([])
  })

  it('同一语句使用 SQL Server 方言时会报告 AFTER 语法错误', () => {
    const metadata = {
      getDatabaseType: () => 'mysql'
    } as MetadataService
    const provider = new DiagnosticProvider(metadata)

    expect(provider.validate(sql, 'sqlserver')).toHaveLength(1)
  })
})
