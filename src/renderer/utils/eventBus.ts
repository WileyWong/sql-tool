/**
 * 事件总线 - 基于 mitt 实现
 */
import mitt from 'mitt'

// 事件类型定义
export type EventBusEvents = {
  // 连接树刷新事件
  'connectionTree:refresh': {
    connectionId: string
    databaseName?: string
  }
  // SQL 执行事件（右键菜单触发）
  'execute-sql': void
}

export const eventBus = mitt<EventBusEvents>()
