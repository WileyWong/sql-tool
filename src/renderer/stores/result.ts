import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { QueryResult, QueryResultSet, QueryMessage, QueryError, ExplainResult, ExecutionStatus } from '@shared/types'

export interface ResultTab {
  id: string
  title: string
  type: 'resultset' | 'message' | 'explain'
  data: QueryResultSet | QueryMessage | ExplainResult
}

export const useResultStore = defineStore('result', () => {
  // 结果标签页列表
  const tabs = ref<ResultTab[]>([])
  
  // 消息列表
  const messages = ref<{ type: 'info' | 'success' | 'warning' | 'error'; text: string; time: Date }[]>([])
  
  // 当前激活的标签页
  const activeTabId = ref<string>('message')
  
  // 执行状态
  const executionStatus = ref<ExecutionStatus>('idle')
  
  // 当前标签页
  const activeTab = computed(() => {
    return tabs.value.find(t => t.id === activeTabId.value)
  })
  
  // 清空结果
  function clearResults() {
    tabs.value = []
    messages.value = []
    activeTabId.value = 'message'
  }
  
  // 添加消息
  function addMessage(type: 'info' | 'success' | 'warning' | 'error', text: string) {
    messages.value.push({
      type,
      text,
      time: new Date()
    })
  }
  
  // 设置执行状态
  function setExecutionStatus(status: ExecutionStatus) {
    executionStatus.value = status
  }
  
  // 处理查询结果
  function handleQueryResults(results: QueryResult[]) {
    // 清空之前的结果
    tabs.value = []
    
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
        tabs.value.push(tab)
        
        // 添加消息
        addMessage('success', `查询返回 ${result.rowCount} 行，耗时 ${result.executionTime}ms`)
      } else if (result.type === 'message') {
        // 非查询结果添加到消息
        addMessage('success', `${result.message}，耗时 ${result.executionTime}ms`)
      } else if (result.type === 'error') {
        // 错误消息
        addMessage('error', `[${result.code}] ${result.message}`)
      }
    }
    
    // 如果有结果集，切换到第一个结果标签页
    if (tabs.value.length > 0) {
      activeTabId.value = tabs.value[0].id
    } else {
      activeTabId.value = 'message'
    }
  }
  
  // 处理执行计划结果
  function handleExplainResult(explain: ExplainResult) {
    // 添加执行计划标签页
    const existingIndex = tabs.value.findIndex(t => t.id === 'explain')
    const tab: ResultTab = {
      id: 'explain',
      title: '执行计划',
      type: 'explain',
      data: explain
    }
    
    if (existingIndex >= 0) {
      tabs.value[existingIndex] = tab
    } else {
      tabs.value.push(tab)
    }
    
    activeTabId.value = 'explain'
    addMessage('info', `执行计划已生成`)
  }
  
  // 切换标签页
  function switchTab(tabId: string) {
    activeTabId.value = tabId
  }
  
  return {
    // 状态
    tabs,
    messages,
    activeTabId,
    activeTab,
    executionStatus,
    
    // 方法
    clearResults,
    addMessage,
    setExecutionStatus,
    handleQueryResults,
    handleExplainResult,
    switchTab
  }
})
