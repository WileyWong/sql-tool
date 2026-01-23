/**
 * 数据格式化工具函数
 * 用于格式化 MySQL 数据类型的显示和导出
 */

/**
 * 格式化日期时间值
 * @param value 原始值
 * @param type MySQL 列类型
 * @returns 格式化后的字符串，如果不是日期时间类型返回 null
 */
export function formatDateTime(value: unknown, type: string): string | null {
  if (value === null || value === undefined) return null
  
  const upperType = type.toUpperCase()
  
  // 处理 DATE 类型
  if (upperType === 'DATE') {
    const date = new Date(value as string | number | Date)
    if (isNaN(date.getTime())) return String(value)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  
  // 处理 DATETIME 类型 (包括 DATETIME(fsp))
  if (upperType.startsWith('DATETIME')) {
    const date = new Date(value as string | number | Date)
    if (isNaN(date.getTime())) return String(value)
    
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    const ms = date.getMilliseconds()
    
    if (ms > 0) {
      const msStr = String(ms).padStart(3, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${msStr}`
    }
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }
  
  // 处理 TIMESTAMP 类型 (包括 TIMESTAMP(fsp))
  if (upperType.startsWith('TIMESTAMP')) {
    const date = new Date(value as string | number | Date)
    if (isNaN(date.getTime())) return String(value)
    
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    const ms = date.getMilliseconds()
    
    if (ms > 0) {
      const msStr = String(ms).padStart(3, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${msStr}`
    }
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }
  
  // 处理 TIME 类型 (包括 TIME(fsp))
  if (upperType.startsWith('TIME')) {
    const strValue = String(value)
    const timeMatch = strValue.match(/^(\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?$/)
    if (timeMatch) {
      const [, hours, minutes, seconds, ms] = timeMatch
      if (ms && parseInt(ms, 10) > 0) {
        return `${hours}:${minutes}:${seconds}.${ms}`
      }
      return `${hours}:${minutes}:${seconds}`
    }
    return strValue
  }
  
  // 处理 YEAR 类型
  if (upperType === 'YEAR') {
    const yearValue = typeof value === 'number' ? value : parseInt(String(value), 10)
    if (!isNaN(yearValue)) {
      return String(yearValue)
    }
    return String(value)
  }
  
  return null
}

/**
 * 格式化 BIT 类型值
 * @param value 原始值
 * @param columnType MySQL 列类型
 * @returns 格式化后的字符串（BIT(1) 返回 'true'/'false'），如果不是 BIT(1) 返回 null
 */
export function formatBitValue(value: unknown, columnType: string): string | null {
  const upperType = columnType.toUpperCase()
  
  // 只处理 BIT 或 BIT(1) 类型
  if (!upperType.startsWith('BIT')) return null
  
  // 检查是否是 BIT(1)
  const bitMatch = upperType.match(/^BIT(?:\((\d+)\))?$/)
  if (!bitMatch) return null
  
  const bitLength = bitMatch[1] ? parseInt(bitMatch[1], 10) : 1
  
  // 只有 BIT(1) 才显示为 true/false
  if (bitLength !== 1) return null
  
  // 处理对象类型（Buffer 或类数组对象）
  if (typeof value === 'object' && value !== null) {
    const obj = value as Record<string, unknown>
    
    // 处理 Buffer 对象 { type: 'Buffer', data: [...] }
    if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
      return (obj.data as number[])[0] === 1 ? 'true' : 'false'
    }
    
    // 处理类数组对象 { "0": 0 } 或 { "0": 1 }（MySQL BIT 在 IPC 传输后的格式）
    if ('0' in obj) {
      const firstByte = obj['0']
      if (typeof firstByte === 'number') {
        return firstByte === 1 ? 'true' : 'false'
      }
    }
  }
  
  // 处理数字值
  if (typeof value === 'number') {
    return value === 1 ? 'true' : 'false'
  }
  
  // 处理字符串值
  if (typeof value === 'string') {
    return value === '1' || value.toLowerCase() === 'true' ? 'true' : 'false'
  }
  
  // 处理布尔值
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false'
  }
  
  return null
}

/**
 * 格式化单元格值用于显示
 * @param value 原始值
 * @param columnType MySQL 列类型
 * @returns 格式化后的字符串
 */
export function formatCellValue(value: unknown, columnType?: string): string {
  if (value === null) return 'NULL'
  if (value === undefined) return ''
  
  if (columnType) {
    // 尝试 BIT 类型格式化
    const formattedBit = formatBitValue(value, columnType)
    if (formattedBit !== null) return formattedBit
    
    // 尝试日期时间格式化
    const formattedDate = formatDateTime(value, columnType)
    if (formattedDate !== null) return formattedDate
  }
  
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }
  return String(value)
}

/**
 * 格式化单个值用于导出
 * @param value 原始值
 * @param columnType MySQL 列类型
 * @returns 格式化后的值（保持类型）
 */
export function formatValueForExport(value: unknown, columnType: string): unknown {
  if (value === null || value === undefined) return null
  
  // 尝试 BIT 类型格式化
  const formattedBit = formatBitValue(value, columnType)
  if (formattedBit !== null) return formattedBit
  
  // 尝试日期时间格式化
  const formattedDate = formatDateTime(value, columnType)
  if (formattedDate !== null) return formattedDate
  
  // 处理对象类型
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }
  
  return value
}
