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
        executionStatus: 'idle'
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
  
  // 清空当前标签页的结果
  function clearResults() {
    if (!currentEditorTabId.value) return
    const state = getOrCreateTabState(currentEditorTabId.value)
    state.tabs = []
    state.messages = []
    state.activeTabId = 'message'
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
  
  // 处理查询结果
  function handleQueryResults(results: QueryResult[]) {
    if (!currentEditorTabId.value) return
    const state = getOrCreateTabState(currentEditorTabId.value)
    
    // 清空之前的结果
    state.tabs = []
    
    let resultCount = 0
    
    for (const result of results) {
      if (result.type === 'resultset') {
        resultCount++
        const tab: ResultTab = {
          id: `result-${resultCount}`,
          title: `结果${resultCount}`,
          type: 'resultset',
          data: result
        }
        state.tabs.push(tab)
        
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
    
    // 如果有结果集，切换到第一个结果标签页
    if (state.tabs.length > 0) {
      state.activeTabId = state.tabs[0].id
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
    cleanupEditorTab
  }
})
