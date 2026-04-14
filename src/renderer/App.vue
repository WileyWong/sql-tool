<template>
  <el-config-provider :locale="elementLocale">
    <div class="app-container">
      <!-- 工具栏 -->
      <div class="app-toolbar">
        <Toolbar />
      </div>
      
      <!-- 主内容区 -->
      <main class="app-main">
        <!-- 左侧边栏：连接树 -->
        <aside class="sidebar" :style="{ width: sidebarWidth + 'px' }">
          <div class="sidebar-header">{{ $t('connection.title') }}</div>
          <ConnectionTree />
        </aside>
        
        <!-- 左右分隔条 -->
        <div class="resizer-horizontal" @mousedown="startResizeH"></div>
        
        <!-- 右侧内容区 -->
        <section class="content">
          <!-- SQL 编辑器 -->
          <div class="editor-area">
            <SqlEditor ref="sqlEditorRef" />
          </div>
          
          <!-- 上下分隔条 -->
          <div class="resize-handle" @mousedown="startResizeV"></div>
          
          <!-- 结果面板 -->
          <div class="result-area" :style="{ height: resultHeight + 'px' }">
            <ResultPanel ref="resultPanelRef" />
          </div>
        </section>
      </main>
      
      <!-- 状态栏 -->
      <StatusBar />
      
      <!-- 连接对话框 -->
      <ConnectionDialog />
      
      <!-- 表管理对话框 -->
      <TableManageDialog />
      
      <!-- 表设计对话框（创建/修改表） -->
      <TableDesignDialog />
      
      <!-- 创建数据库对话框 -->
      <CreateDatabaseDialog />
      
      <!-- 保存确认对话框 -->
      <SaveConfirmDialog ref="saveConfirmDialogRef" />
      
      <!-- 结果覆盖确认对话框 -->
      <ResultOverwriteDialog ref="resultOverwriteDialogRef" />
      
      <!-- 设置对话框 -->
      <SettingsDialog ref="settingsDialogRef" />
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, provide } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import zhTw from 'element-plus/es/locale/lang/zh-tw'
import en from 'element-plus/es/locale/lang/en'
import Toolbar from './components/Toolbar.vue'
import ConnectionTree from './components/ConnectionTree.vue'
import SqlEditor from './components/SqlEditor.vue'
import ResultPanel from './components/ResultPanel.vue'
import ConnectionDialog from './components/ConnectionDialog.vue'
import TableManageDialog from './components/TableManageDialog.vue'
import TableDesignDialog from './components/TableDesignDialog.vue'
import CreateDatabaseDialog from './components/CreateDatabaseDialog.vue'
import StatusBar from './components/StatusBar.vue'
import SaveConfirmDialog from './components/SaveConfirmDialog.vue'
import ResultOverwriteDialog from './components/ResultOverwriteDialog.vue'
import SettingsDialog from './components/SettingsDialog.vue'
import { useEditorStore } from './stores/editor'
import { useConnectionStore } from './stores/connection'

const { locale, t } = useI18n()
const editorStore = useEditorStore()
const connectionStore = useConnectionStore()
const resultHeight = ref(200)
const sidebarWidth = ref(260)
const saveConfirmDialogRef = ref<InstanceType<typeof SaveConfirmDialog> | null>(null)
const resultOverwriteDialogRef = ref<InstanceType<typeof ResultOverwriteDialog> | null>(null)
const sqlEditorRef = ref<InstanceType<typeof SqlEditor> | null>(null)
const resultPanelRef = ref<InstanceType<typeof ResultPanel> | null>(null)
const settingsDialogRef = ref<InstanceType<typeof SettingsDialog> | null>(null)

// Element Plus 语言映射
const elementLocaleMap = {
  'zh-CN': zhCn,
  'zh-TW': zhTw,
  'en-US': en
}

// Element Plus 当前语言
const elementLocale = computed(() => {
  return elementLocaleMap[locale.value as keyof typeof elementLocaleMap] || en
})

// 提供保存确认对话框给子组件使用
provide('saveConfirmDialog', {
  show: (tabId: string, title: string, filePath?: string) => {
    return saveConfirmDialogRef.value?.show(tabId, title, filePath)
  }
})

// 提供结果覆盖确认对话框给子组件使用
provide('resultOverwriteDialog', {
  show: () => {
    return resultOverwriteDialogRef.value?.show()
  }
})

// 提供获取选中 SQL 的方法给子组件使用
provide('sqlEditor', {
  getSelectedText: () => {
    return sqlEditorRef.value?.getSelectedText() || ''
  }
})

// 提供数据操作状态给子组件使用（统一跟踪机制）
provide('dataOperations', {
  hasUnsavedChanges: () => resultPanelRef.value?.hasUnsavedChanges() || false,
  clearChanges: () => resultPanelRef.value?.clearChanges(),
  cleanupTab: (tabId: string) => resultPanelRef.value?.cleanupTab(tabId)
})

// 处理窗口关闭前事件
async function handleBeforeClose() {
  const unsavedTabs = editorStore.getUnsavedTabs()
  
  if (unsavedTabs.length === 0) {
    // 没有未保存的内容，直接关闭
    window.api.window.confirmClose()
    return
  }
  
  // 逐个提示保存
  for (const tab of unsavedTabs) {
    const result = await saveConfirmDialogRef.value?.show(
      tab.id,
      tab.title,
      tab.filePath
    )
    
    if (result === 'save') {
      // 保存文件
      const saveResult = await editorStore.saveTabById(tab.id)
      if (!saveResult.success) {
        if (saveResult.canceled) {
          // 用户取消了另存为对话框，中止关闭
          return
        }
        // 保存失败，继续询问下一个
      }
    } else if (result === 'cancel') {
      // 用户取消，中止关闭
      return
    }
    // result === 'dontSave' 时继续下一个
  }
  
  // 所有文件都处理完毕，确认关闭
  window.api.window.confirmClose()
}

// 设置菜单事件监听
function setupMenuListeners() {
  window.api.menu.onNewConnection(() => connectionStore.openNewConnectionDialog())
  window.api.menu.onNewQuery(() => editorStore.createTab())
  window.api.menu.onOpenFile(async () => {
    await editorStore.openFile()
    const recentFiles = await window.api.file.getRecentFiles()
    await window.api.menu.updateRecentFiles(recentFiles.slice(0, 10))
  })
  window.api.menu.onOpenRecent(async (_event: unknown, filePath: string) => {
    const result = await editorStore.openRecentFile(filePath)
    if (!result.success) {
      // 提示文件不存在，并更新菜单
      ElMessage.warning(t('error.fileNotFound', { path: filePath }))
      const recentFiles = await window.api.file.getRecentFiles()
      await window.api.menu.updateRecentFiles(recentFiles.slice(0, 10))
    }
  })
  window.api.menu.onSave(async () => {
    await editorStore.saveFile()
    const recentFiles = await window.api.file.getRecentFiles()
    await window.api.menu.updateRecentFiles(recentFiles.slice(0, 10))
  })
  window.api.menu.onSaveAs(async () => {
    await editorStore.saveFileAs()
    const recentFiles = await window.api.file.getRecentFiles()
    await window.api.menu.updateRecentFiles(recentFiles.slice(0, 10))
  })
  // 设置对话框
  window.api.menu.onOpenSettings(() => {
    settingsDialogRef.value?.show()
  })
}

onMounted(async () => {
  window.api.window.onBeforeClose(handleBeforeClose)
  setupMenuListeners()
  // 初始化最近文件菜单
  const recentFiles = await window.api.file.getRecentFiles()
  await window.api.menu.updateRecentFiles(recentFiles.slice(0, 10))
})

onUnmounted(() => {
  window.api.window.removeBeforeCloseListener()
  window.api.menu.removeAllListeners()
})

// 拖拽调整结果面板高度（上下）
function startResizeV(e: MouseEvent) {
  const startY = e.clientY
  const startHeight = resultHeight.value
  
  // 获取内容区域总高度，确保编辑区最小高度为 100px
  const contentSection = document.querySelector('.content') as HTMLElement
  const totalHeight = contentSection?.clientHeight || 600
  const minEditorHeight = 100
  const maxResultHeight = Math.max(80, totalHeight - minEditorHeight)
  
  document.body.style.cursor = 'ns-resize'
  document.body.style.userSelect = 'none'
  
  function onMouseMove(e: MouseEvent) {
    const delta = startY - e.clientY
    // 限制结果面板高度：最小 80px，最大为总高度减去编辑区最小高度
    resultHeight.value = Math.max(80, Math.min(maxResultHeight, startHeight + delta))
  }
  
  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }
  
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

// 拖拽调整侧边栏宽度（左右）
function startResizeH(_e: MouseEvent) {
  document.body.style.cursor = 'ew-resize'
  document.body.style.userSelect = 'none'
  
  function onMouseMove(e: MouseEvent) {
    const newWidth = e.clientX
    if (newWidth >= 150 && newWidth <= 500) {
      sidebarWidth.value = newWidth
    }
  }
  
  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }
  
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}
</script>
