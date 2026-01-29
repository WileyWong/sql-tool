import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'
import type { QueryResult, QueryResultSet, QueryMessage, ExplainResult, ExecutionStatus } from '@shared/types'

export interface ResultTab {
  id: string
  title: string
  type: 'resultset' | 'message' | 'explain'
  data: QueryResultSet | QueryMessage | ExplainResult
}

// 每个编辑器标签页的结果状态
interface TabResultState {
  tabs: ResultTab[]
  messages: { type: 'info' | 'success' | 'warning' | 'error'; text: string; time: Date }[]
  activeTabId: string
  executionStatus: ExecutionStatus
  columnWidths: Record<string, number>  // 列宽状态（按列名存储）
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
        columnWidths: {}
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
  
  // 清空当前标签页的结果（重新执行 SQL 时调用）
  function clearResults() {
    if (!currentEditorTabId.value) return
    const state = getOrCreateTabState(currentEditorTabId.value)
    state.tabs = []
    state.messages = []
    state.activeTabId = 'message'
    state.columnWidths = {}  // 清除列宽状态，重新执行 SQL 时重新计算
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
            title: '结果',
            type: 'resultset',
            data: result
          }
          state.tabs.push(resultTab)
        }
        
        // 添加消息
        state.messages.push({
          type: 'success',
          text: `查询返回 ${result.rowCount} 行，耗时 ${result.executionTime}ms`,
          time: new Date()
        })
      } else if (result.type === 'message') {
        // 非查询结果添加到消息
        state.messages.push({
          type: 'success',
          text: `${result.message}，耗时 ${result.executionTime}ms`,
          time: new Date()
        })
      } else if (result.type === 'error') {
        // 错误消息
        state.messages.push({
          type: 'error',
          text: `[${result.code}] ${result.message}`,
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
      title: '执行计划',
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
      text: '执行计划已生成',
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
  
  return {
    // 状态
    tabs,
    messages,
    activeTabId,
    activeTab,
    executionStatus,
    currentEditorTabId,
    
    // 方法
    clearResults,
    addMessage,
    setExecutionStatus,
    handleQueryResults,
    handleExplainResult,
    switchTab,
    switchToEditorTab,
    cleanupEditorTab,
    saveColumnWidths,
    getColumnWidths,
    clearColumnWidths
  }
})
