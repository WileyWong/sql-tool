import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface EditorTab {
  id: string
  title: string
  content: string
  filePath?: string
  isDirty: boolean
  // 每个标签页独立的连接设置
  connectionId?: string
  databaseName?: string
  maxRows: number
}

export const useEditorStore = defineStore('editor', () => {
  // 标签页列表
  const tabs = ref<EditorTab[]>([])
  
  // 当前激活的标签页 ID
  const activeTabId = ref<string | null>(null)
  
  // 标签页计数器
  let tabCounter = 0
  
  // 当前标签页
  const activeTab = computed(() => {
    if (!activeTabId.value) return null
    return tabs.value.find(t => t.id === activeTabId.value) || null
  })
  
  // 当前 SQL 内容
  const currentSql = computed(() => activeTab.value?.content || '')
  
  // 初始化：创建第一个标签页
  function init() {
    if (tabs.value.length === 0) {
      createTab()
    }
  }
  
  // 创建新标签页
  function createTab(content = '', filePath?: string) {
    tabCounter++
    const id = `tab-${Date.now()}`
    const title = filePath ? filePath.split(/[/\\]/).pop()! : `查询${tabCounter}`
    
    const tab: EditorTab = {
      id,
      title,
      content,
      filePath,
      isDirty: false,
      connectionId: undefined,
      databaseName: undefined,
      maxRows: 5000
    }
    
    tabs.value.push(tab)
    activeTabId.value = id
    
    return tab
  }
  
  // 更新标签页连接设置
  function updateTabConnection(connectionId?: string, databaseName?: string) {
    if (activeTab.value) {
      activeTab.value.connectionId = connectionId
      activeTab.value.databaseName = databaseName
    }
  }
  
  // 更新标签页最大行数
  function updateTabMaxRows(maxRows: number) {
    if (activeTab.value) {
      activeTab.value.maxRows = maxRows
    }
  }
  
  // 关闭标签页
  function closeTab(tabId: string) {
    const index = tabs.value.findIndex(t => t.id === tabId)
    if (index === -1) return
    
    tabs.value.splice(index, 1)
    
    // 如果关闭的是当前标签页，切换到相邻标签页
    if (activeTabId.value === tabId) {
      if (tabs.value.length > 0) {
        const newIndex = Math.min(index, tabs.value.length - 1)
        activeTabId.value = tabs.value[newIndex].id
      } else {
        // 如果没有标签页了，创建一个新的
        createTab()
      }
    }
  }
  
  // 切换标签页
  function switchTab(tabId: string) {
    activeTabId.value = tabId
  }
  
  // 更新内容
  function updateContent(content: string) {
    if (activeTab.value) {
      activeTab.value.content = content
      activeTab.value.isDirty = true
    }
  }
  
  // 标记为已保存
  function markSaved(filePath?: string) {
    if (activeTab.value) {
      activeTab.value.isDirty = false
      if (filePath) {
        activeTab.value.filePath = filePath
        activeTab.value.title = filePath.split(/[/\\]/).pop()!
      }
    }
  }
  
  // 打开文件
  async function openFile() {
    const result = await window.api.file.open()
    if (result.success && result.content !== undefined) {
      createTab(result.content, result.filePath)
    }
    return result
  }
  
  // 保存文件
  async function saveFile() {
    if (!activeTab.value) return { success: false }
    
    if (activeTab.value.filePath) {
      const result = await window.api.file.save(activeTab.value.filePath, activeTab.value.content)
      if (result.success) {
        markSaved()
      }
      return result
    } else {
      return saveFileAs()
    }
  }
  
  // 另存为
  async function saveFileAs() {
    if (!activeTab.value) return { success: false }
    
    const result = await window.api.file.saveAs(activeTab.value.content)
    if (result.success && result.filePath) {
      markSaved(result.filePath)
    }
    return result
  }
  
  // 获取选中的 SQL（如果有选中则返回选中内容，否则返回全部）
  function getSelectedSql(selection?: string): string {
    if (selection && selection.trim()) {
      return selection.trim()
    }
    return currentSql.value
  }
  
  return {
    // 状态
    tabs,
    activeTabId,
    activeTab,
    currentSql,
    
    // 方法
    init,
    createTab,
    closeTab,
    switchTab,
    updateContent,
    updateTabConnection,
    updateTabMaxRows,
    markSaved,
    openFile,
    saveFile,
    saveFileAs,
    getSelectedSql
  }
})
