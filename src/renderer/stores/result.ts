import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'
import type { QueryResult, QueryResultSet, QueryMessage, ExplainResult, ExecutionStatus } from '@shared/types'
import { i18n } from '../i18n'

// 获取翻译函数
const t = i18n.global.t

export interface ResultTab {
  id: string
  title: string
  type: 'resultset' | 'message' | 'explain'
  data: QueryResultSet | QueryMessage | ExplainResult
}

// 执行历史记录
export interface ExecutionHistoryItem {
  id: string
  timestamp: number
  sql: string
  sqlDisplay: string  // 截断后的 SQL 用于显示
  status: 'success' | 'error'
  message: string
  executionTime?: number
  rowsAffected?: number
}

// 每个编辑器标签页的结果状态
interface TabResultState {
  tabs: ResultTab[]
  messages: { type: 'info' | 'success' | 'warning' | 'error'; text: string; time: Date }[]
  activeTabId: string
  executionStatus: ExecutionStatus
  columnWidths: Record<string, number>  // 列宽状态（按列名存储）
  executionHistory: ExecutionHistoryItem[]  // 执行历史记录
}

export const useResultStore = defineStore('result', () => {
  // 所有编辑器标签页的结果数据（按 editorTabId 存储）
  const tabResults = reactive<Map<string, TabResultState>>(new Map())
  
  // 当前编辑器标签页 ID
  const currentEditorTabId = ref<string | null>(null)
  
  // 获取或创建标签页的结果状态
  function getOrCreateTabState(editorTabId: string): TabResultState {
    if (!tabResults.has(editorTabId)) {
      tabResults.set(editorTabId, {
        tabs: [],
        messages: [],
        activeTabId: 'message',
        executionStatus: 'idle',
        columnWidths: {},
        executionHistory: []
      })
    }
    return tabResults.get(editorTabId)!
  }
  
  // 当前标签页的结果状态
  const currentState = computed((): TabResultState | null => {
    if (!currentEditorTabId.value) return null
    return tabResults.get(currentEditorTabId.value) || null
  })
  
  // 结果标签页列表（当前编辑器标签页的）
  const tabs = computed(() => currentState.value?.tabs || [])
  
  // 消息列表（当前编辑器标签页的）
  const messages = computed(() => currentState.value?.messages || [])

  // 执行历史列表（当前编辑器标签页的）
  const executionHistory = computed(() => currentState.value?.executionHistory || [])

  // 当前激活的结果标签页
  const activeTabId = computed(() => currentState.value?.activeTabId || 'message')
  
  // 执行状态
  const executionStatus = computed(() => currentState.value?.executionStatus || 'idle')
  
  // 当前结果标签页
  const activeTab = computed(() => {
    return tabs.value.find(t => t.id === activeTabId.value)
  })
  
  // 切换到指定编辑器标签页的结果
  function switchToEditorTab(editorTabId: string | null) {
    currentEditorTabId.value = editorTabId
  }
  
  // SQL 显示最大长度
  const MAX_SQL_DISPLAY_LENGTH = 100

  // 截断 SQL 用于显示
  function truncateSqlForDisplay(sql: string): string {
    const trimmed = sql.trim().replace(/\s+/g, ' ')
    if (trimmed.length <= MAX_SQL_DISPLAY_LENGTH) {
      return trimmed
    }
    return trimmed.substring(0, MAX_SQL_DISPLAY_LENGTH) + '...'
  }

  // 清空当前标签页的结果（重新执行 SQL 时调用）- 保留执行历史
  function clearResults() {
    if (!currentEditorTabId.value) return
    const state = getOrCreateTabState(currentEditorTabId.value)
    state.tabs = []
    // 注意：不清空 messages，执行历史会单独管理
    state.activeTabId = 'message'
    state.columnWidths = {}  // 清除列宽状态，重新执行 SQL 时重新计算
  }

  // 添加执行历史记录
  function addExecutionHistory(
    sql: string,
    status: 'success' | 'error',
    message: string,
    executionTime?: number,
    rowsAffected?: number
  ) {
    if (!currentEditorTabId.value) return
    const state = getOrCreateTabState(currentEditorTabId.value)

    const historyItem: ExecutionHistoryItem = {
      id: `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      sql: sql.trim(),
      sqlDisplay: truncateSqlForDisplay(sql),
      status,
      message,
      executionTime,
      rowsAffected
    }

    // 添加到头部（最新的在上面）
    state.executionHistory.unshift(historyItem)

    // 限制最多 100 条
    if (state.executionHistory.length > 100) {
      state.executionHistory.pop()
    }
  }
  
  // 添加消息
  function addMessage(type: 'info' | 'success' | 'warning' | 'error', text: string) {
    if (!currentEditorTabId.value) return
    const state = getOrCreateTabState(currentEditorTabId.value)
    state.messages.push({
      type,
      text,
      time: new Date()
    })
  }
  
  // 设置执行状态
  function setExecutionStatus(status: ExecutionStatus) {
    if (!currentEditorTabId.value) return
    const state = getOrCreateTabState(currentEditorTabId.value)
    state.executionStatus = status
  }
  
  // 当前执行的 SQL（用于关联结果和历史）
  let currentExecutingSql = ''

  // 设置当前执行的 SQL
  function setCurrentExecutingSql(sql: string) {
    currentExecutingSql = sql.trim()
  }

  // 处理查询结果 - 单一结果页签模式
  function handleQueryResults(results: QueryResult[]) {
    if (!currentEditorTabId.value) return
    const state = getOrCreateTabState(currentEditorTabId.value)

    // 查找或创建唯一的结果页签
    let resultTab = state.tabs.find(t => t.id === 'result' && t.type === 'resultset')

    // 处理结果集
    for (const result of results) {
      if (result.type === 'resultset') {
        if (resultTab) {
          // 覆盖现有结果
          resultTab.data = result
        } else {
          // 创建新的结果页签
          resultTab = {
            id: 'result',
            title: t('result.title'),
            type: 'resultset',
            data: result
          }
          state.tabs.push(resultTab)
        }

        // 添加到执行历史
        const message = t('result.queryResult', { rows: result.rowCount, time: result.executionTime })
        addExecutionHistory(
          currentExecutingSql,
          'success',
          message,
          result.executionTime,
          result.rowCount
        )
      } else if (result.type === 'message') {
        // 非查询结果添加到执行历史
        addExecutionHistory(
          currentExecutingSql,
          'success',
          result.message,
          result.executionTime,
          result.affectedRows
        )
      } else if (result.type === 'error') {
        // 错误添加到执行历史
        const errorMessage = `[${result.code}] ${result.message}`
        addExecutionHistory(
          currentExecutingSql,
          'error',
          errorMessage
        )

        // 错误消息也添加到消息列表
        state.messages.push({
          type: 'error',
          text: errorMessage,
          time: new Date()
        })
      }
    }

    // 如果有结果集，切换到结果标签页
    if (resultTab) {
      state.activeTabId = 'result'
    } else {
      state.activeTabId = 'message'
    }
  }
  
  // 处理执行计划结果
  function handleExplainResult(explain: ExplainResult) {
    if (!currentEditorTabId.value) return
    const state = getOrCreateTabState(currentEditorTabId.value)
    
    // 添加执行计划标签页
    const existingIndex = state.tabs.findIndex(t => t.id === 'explain')
    const tab: ResultTab = {
      id: 'explain',
      title: t('result.explain'),
      type: 'explain',
      data: explain
    }
    
    if (existingIndex >= 0) {
      state.tabs[existingIndex] = tab
    } else {
      state.tabs.push(tab)
    }
    
    state.activeTabId = 'explain'
    state.messages.push({
      type: 'info',
      text: t('result.explainGenerated'),
      time: new Date()
    })
  }
  
  // 切换结果标签页
  function switchTab(tabId: string) {
    if (!currentEditorTabId.value) return
    const state = tabResults.get(currentEditorTabId.value)
    if (state) {
      state.activeTabId = tabId
    }
  }
  
  // 清理指定编辑器标签页的结果（标签页关闭时调用）
  function cleanupEditorTab(editorTabId: string) {
    tabResults.delete(editorTabId)
  }
  
  // 保存列宽状态
  function saveColumnWidths(editorTabId: string, widths: Record<string, number>) {
    const state = tabResults.get(editorTabId)
    if (state) {
      state.columnWidths = { ...widths }
    }
  }
  
  // 获取列宽状态
  function getColumnWidths(editorTabId: string): Record<string, number> | null {
    const state = tabResults.get(editorTabId)
    if (state && Object.keys(state.columnWidths).length > 0) {
      return state.columnWidths
    }
    return null
  }
  
  // 清除列宽状态（重新执行 SQL 时调用）
  function clearColumnWidths(editorTabId: string) {
    const state = tabResults.get(editorTabId)
    if (state) {
      state.columnWidths = {}
    }
  }
  
  // 复制 SQL 到剪贴板
  async function copySqlToClipboard(sql: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(sql)
      return true
    } catch (err) {
      console.error('Failed to copy SQL:', err)
      return false
    }
  }

  return {
    // 状态
    tabs,
    messages,
    executionHistory,
    activeTabId,
    activeTab,
    executionStatus,
    currentEditorTabId,

    // 方法
    clearResults,
    addMessage,
    setExecutionStatus,
    setCurrentExecutingSql,
    handleQueryResults,
    handleExplainResult,
    switchTab,
    switchToEditorTab,
    cleanupEditorTab,
    saveColumnWidths,
    getColumnWidths,
    clearColumnWidths,
    copySqlToClipboard,
    addExecutionHistory
  }
})
