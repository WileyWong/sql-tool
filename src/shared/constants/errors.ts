/**
 * 错误码定义
 */
export const ErrorCodes = {
  // 连接错误 E1xxx
  E1001: { code: 'E1001', message: '请填写必填字段' },
  E1002: { code: 'E1002', message: '服务地址格式错误，请使用 host:port 格式' },
  E1003: { code: 'E1003', message: '端口号必须在 1-65535 范围内' },
  E1004: { code: 'E1004', message: '连接名称已存在，请使用其他名称' },
  E1005: { code: 'E1005', message: '连接名称过长，最多50字符' },
  
  // 测试连接错误 E11xx
  E1101: { code: 'E1101', message: '连接超时，请检查服务地址和网络' },
  E1102: { code: 'E1102', message: '认证失败，请检查用户名和密码' },
  E1103: { code: 'E1103', message: '无法连接到服务器，请检查服务地址' },
  E1104: { code: 'E1104', message: '数据库不存在' },
  
  // 浏览错误 E2xxx
  E2001: { code: 'E2001', message: '加载数据库结构失败，请检查连接和权限' },
  
  // 编辑器错误 E3xxx
  E3001: { code: 'E3001', message: '无法获取表结构' },
  
  // 执行错误 E4xxx
  E4001: { code: 'E4001', message: '请先选择数据库连接' },
  E4002: { code: 'E4002', message: '请输入 SQL 语句' },
  E4003: { code: 'E4003', message: '查询超时' },
  E4004: { code: 'E4004', message: 'SQL 语法错误' },
  E4005: { code: 'E4005', message: '表不存在' },
  E4006: { code: 'E4006', message: '列不存在' },
  E4007: { code: 'E4007', message: '权限不足' },
  
  // 系统错误 E5xxx
  E5001: { code: 'E5001', message: '配置文件读取失败' },
  E5002: { code: 'E5002', message: '配置文件写入失败' },
  E5003: { code: 'E5003', message: '加密失败' },
  E5004: { code: 'E5004', message: '解密失败，配置文件可能已损坏' }
} as const

export type ErrorCode = keyof typeof ErrorCodes
