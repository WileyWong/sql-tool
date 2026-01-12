import { defineStore } from 'pinia'
import { ref, computed, nextTick } from 'vue'

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
  
  // 最近文件列表版本号（用于触发 MenuBar 刷新）
  const recentFilesVersion = ref(0)
  
  // 当前标签页
  const activeTab = computed(() => {
    if (!activeTabId.value) return null
    return tabs.value.find(t => t.id === activeTabId.value) || null
  })
  
  // 当前 SQL 内容
  const currentSql = computed(() => activeTab.value?.content || '')
  
  // 判断标签页是否为空（可复用）
  function isTabEmpty(tab: EditorTab): boolean {
    return tab.content === '' && !tab.filePath
  }
  
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
    // 如果是新建标签页且有内容，使用 nextTick 确保响应式更新完成
    if (content) {
      nextTick(() => {
        contentUpdateTrigger.value++
      })
    }
    
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
  
  // 打开文件（智能复用空标签页）
  async function openFile() {
    const result = await window.api.file.open()
    if (result.success && result.content !== undefined) {
      openFileInTab(result.content, result.filePath)
    }
    return result
  }
  
  // 智能打开文件（复用空标签页或新建）
  function openFileInTab(content: string, filePath?: string) {
    const currentTab = activeTab.value
    
    if (currentTab && isTabEmpty(currentTab)) {
      // 复用当前空标签页
      currentTab.content = content
      currentTab.filePath = filePath
      currentTab.title = filePath ? filePath.split(/[/\\]/).pop()! : `查询${tabCounter}`
      currentTab.isDirty = false
      
      // 使用 nextTick 确保响应式更新完成后再触发编辑器刷新
      nextTick(() => {
        contentUpdateTrigger.value++
      })
    } else {
      // 新建标签页
      createTab(content, filePath)
    }
  }
  
  // 内容更新触发器（用于通知编辑器刷新）
  const contentUpdateTrigger = ref(0)
  
  // 打开最近文件
  async function openRecentFile(filePath: string): Promise<{ success: boolean; message?: string }> {
    const result = await window.api.file.readFile(filePath)
    if (result.success && result.content !== undefined) {
      openFileInTab(result.content, filePath)
      return { success: true }
    } else {
      // 文件不存在，从列表移除
      await window.api.file.removeRecentFile(filePath)
      return { success: false, message: result.message || '文件不存在' }
    }
  }
  
  // 检查是否有未保存内容
  function hasUnsavedChanges(): boolean {
    return tabs.value.some(tab => tab.isDirty)
  }
  
  // 获取所有未保存的标签页
  function getUnsavedTabs(): EditorTab[] {
    return tabs.value.filter(tab => tab.isDirty)
  }
  
  // 保存指定标签页
  async function saveTabById(tabId: string): Promise<{ success: boolean; canceled?: boolean }> {
    const tab = tabs.value.find(t => t.id === tabId)
    if (!tab) return { success: false }
    
    if (tab.filePath) {
      const result = await window.api.file.save(tab.filePath, tab.content)
      if (result.success) {
        tab.isDirty = false
      }
      return result
    } else {
      // 无路径，弹出另存为对话框
      const result = await window.api.file.saveAs(tab.content)
      if (result.success && result.filePath) {
        tab.isDirty = false
        tab.filePath = result.filePath
        tab.title = result.filePath.split(/[/\\]/).pop()!
      }
      return result
    }
  }
  
  // 保存文件
  async function saveFile() {
    if (!activeTab.value) return { success: false }
    
    if (activeTab.value.filePath) {
      const result = await window.api.file.save(activeTab.value.filePath, activeTab.value.content)
      if (result.success) {
        markSaved()
        recentFilesVersion.value++ // 触发最近文件列表刷新
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
      recentFilesVersion.value++ // 触发最近文件列表刷新
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
    contentUpdateTrigger,
    recentFilesVersion,
    
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
    openRecentFile,
    saveFile,
    saveFileAs,
    saveTabById,
    getSelectedSql,
    isTabEmpty,
    hasUnsavedChanges,
    getUnsavedTabs
  }
})
