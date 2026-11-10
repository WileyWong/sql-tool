import mysql, { Connection } from 'mysql2/promise'
import type { ConnectionConfig } from '@shared/types'
import { Defaults } from '@shared/constants'
import { raceWithTimeout } from '../core/connection-health'

type CoreConnection = { state?: string; destroy?: () => void }

function coreOf(connection: Connection): CoreConnection | undefined {
  return (connection as Connection & { connection?: CoreConnection }).connection
}

/** 超时或对端已拆掉连接后，这条连接不能再发语句。读不到状态时保持原连接，交给探活判断。 */
export function isMysqlConnectionUsable(connection: Connection): boolean {
  const state = coreOf(connection)?.state
  if (!state) return true
  return state === 'authenticated' || state === 'connected'
}

export function destroyMysqlConnection(connection: Connection): void {
  try {
    const wrapper = connection as Connection & { destroy?: () => void }
    if (typeof wrapper.destroy === 'function') {
      wrapper.destroy()
      return
    }
    coreOf(connection)?.destroy?.()
  } catch {
    // 已经销毁
  }
}

export async function openMysqlConnection(config: ConnectionConfig, database?: string): Promise<Connection> {
  const connection = await mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.username,
    password: config.password,
    database: database || config.database || undefined,
    connectTimeout: Defaults.CONNECTION_TIMEOUT,
    multipleStatements: true,
    supportBigNumbers: true,
    bigNumberStrings: true,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10_000
  })
  await queryMysql(connection, 'SET NAMES utf8mb4', undefined, Defaults.CONNECTION_TIMEOUT)
  return connection
}

export function queryMysql(connection: Connection, sql: string, values?: unknown, timeout = Defaults.QUERY_TIMEOUT) {
  if (values === undefined) {
    return connection.query({ sql, timeout })
  }
  return connection.query({ sql, values: values as never, timeout })
}

/** 探活。超时或失败时销毁套接字，避免命令队列一直等下去。 */
export async function pingMysql(connection: Connection, timeoutMs = Defaults.PROBE_TIMEOUT): Promise<void> {
  await raceWithTimeout(
    connection.ping().then(() => undefined),
    timeoutMs,
    () => destroyMysqlConnection(connection),
    'MySQL ping timeout'
  )
}

/** 关闭连接。对端无响应时 end() 会一直等，超时后改为 destroy。 */
export async function closeMysqlConnection(connection: Connection, timeoutMs = 2000): Promise<void> {
  try {
    await raceWithTimeout(
      connection.end().then(() => undefined),
      timeoutMs,
      () => destroyMysqlConnection(connection),
      'MySQL close timeout'
    )
  } catch {
    destroyMysqlConnection(connection)
  }
}
