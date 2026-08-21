/**
 * 将 mysql2 结果集 FieldPacket 映射为可读的 MySQL 类型名。
 *
 * 协议里 TINYTEXT/TEXT/MEDIUMTEXT/LONGTEXT 与对应 BLOB 共用同一组 type code
 *（249–252），区别在 characterSet：63 表示 binary（BLOB 家族），否则为 TEXT 家族。
 * 另外 TEXT/BLOB 经常都被报成 MYSQL_TYPE_BLOB(252)，需要再用 octet 长度细分。
 */

export interface MysqlResultField {
  name?: string
  type?: number
  columnType?: number
  characterSet?: number
  charsetNr?: number
  columnLength?: number
  length?: number
}

/** MySQL binary charset（latin1 的 binary collation 也走 63） */
const MYSQL_CHARSET_BINARY = 63

export function getMysqlFieldTypeName(field: MysqlResultField): string {
  const typeCode = field.type ?? field.columnType
  if (typeCode == null) return 'UNKNOWN'

  const charset = field.characterSet ?? field.charsetNr
  const isBinary = charset === MYSQL_CHARSET_BINARY
  const columnLength = field.columnLength ?? field.length ?? 0

  switch (typeCode) {
    case 0:
    case 246:
      return 'DECIMAL'
    case 1:
      return 'TINYINT'
    case 2:
      return 'SMALLINT'
    case 3:
      return 'INT'
    case 4:
      return 'FLOAT'
    case 5:
      return 'DOUBLE'
    case 6:
      return 'NULL'
    case 7:
    case 17:
      return 'TIMESTAMP'
    case 8:
      return 'BIGINT'
    case 9:
      return 'MEDIUMINT'
    case 10:
      return 'DATE'
    case 11:
    case 19:
      return 'TIME'
    case 12:
    case 18:
      return 'DATETIME'
    case 13:
      return 'YEAR'
    case 15:
    case 253:
      return 'VARCHAR'
    case 16:
      return 'BIT'
    case 245:
      return 'JSON'
    case 247:
      return 'ENUM'
    case 248:
      return 'SET'
    case 249:
    case 250:
    case 251:
    case 252:
      return resolveBlobOrText(typeCode, columnLength, isBinary)
    case 254:
      return 'CHAR'
    case 255:
      return 'GEOMETRY'
    default:
      return 'UNKNOWN'
  }
}

function resolveBlobOrText(typeCode: number, columnLength: number, isBinary: boolean): string {
  if (typeCode === 249) return isBinary ? 'TINYBLOB' : 'TINYTEXT'
  if (typeCode === 250) return isBinary ? 'MEDIUMBLOB' : 'MEDIUMTEXT'
  if (typeCode === 251) return isBinary ? 'LONGBLOB' : 'LONGTEXT'

  // MYSQL_TYPE_BLOB (252)：用 charset 区分 BLOB/TEXT，再用长度区分 TINY/MEDIUM/LONG
  if (columnLength > 0) {
    if (isBinary) {
      if (columnLength <= 255) return 'TINYBLOB'
      if (columnLength <= 65535) return 'BLOB'
      if (columnLength <= 16777215) return 'MEDIUMBLOB'
      return 'LONGBLOB'
    }
    // 非 binary：columnLength = 字符最大长度 × charset 最大字节数（utf8mb4 为 4）
    if (columnLength <= 1020) return 'TINYTEXT'
    if (columnLength <= 262140) return 'TEXT'
    if (columnLength <= 67108860) return 'MEDIUMTEXT'
    return 'LONGTEXT'
  }

  return isBinary ? 'BLOB' : 'TEXT'
}
