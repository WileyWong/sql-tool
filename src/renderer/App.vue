<template>
  <div class="app-container">
    <!-- 菜单栏 -->
    <MenuBar />
    
    <!-- 工具栏 -->
    <div class="app-toolbar">
      <Toolbar />
    </div>
    
    <!-- 主内容区 -->
    <main class="app-main">
      <!-- 左侧边栏：连接树 -->
      <aside class="sidebar" :style="{ width: sidebarWidth + 'px' }">
        <div class="sidebar-header">数据库连接</div>
        <ConnectionTree />
      </aside>
      
      <!-- 左右分隔条 -->
      <div class="resizer-horizontal" @mousedown="startResizeH"></div>
      
      <!-- 右侧内容区 -->
      <section class="content">
        <!-- SQL 编辑器 -->
        <div class="editor-area">
          <SqlEditor />
        </div>
        
        <!-- 上下分隔条 -->
        <div class="resize-handle" @mousedown="startResizeV"></div>
        
        <!-- 结果面板 -->
        <div class="result-area" :style="{ height: resultHeight + 'px' }">
          <ResultPanel />
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
    
    <!-- 保存确认对话框 -->
    <SaveConfirmDialog ref="saveConfirmDialogRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, provide } from 'vue'
import MenuBar from './components/MenuBar.vue'
import Toolbar from './components/Toolbar.vue'
import ConnectionTree from './components/ConnectionTree.vue'
import SqlEditor from './components/SqlEditor.vue'
import ResultPanel from './components/ResultPanel.vue'
import ConnectionDialog from './components/ConnectionDialog.vue'
import TableManageDialog from './components/TableManageDialog.vue'
import TableDesignDialog from './components/TableDesignDialog.vue'
import StatusBar from './components/StatusBar.vue'
import SaveConfirmDialog from './components/SaveConfirmDialog.vue'
import { useEditorStore } from './stores/editor'

const editorStore = useEditorStore()
const resultHeight = ref(200)
const sidebarWidth = ref(260)
const saveConfirmDialogRef = ref<InstanceType<typeof SaveConfirmDialog> | null>(null)

// 提供保存确认对话框给子组件使用
provide('saveConfirmDialog', {
  show: (tabId: string, title: string, filePath?: string) => {
    return saveConfirmDialogRef.value?.show(tabId, title, filePath)
  }
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

onMounted(() => {
  // 监听窗口关闭前事件
  window.api.window.onBeforeClose(handleBeforeClose)
})

onUnmounted(() => {
  // 移除监听器
  window.api.window.removeBeforeCloseListener()
})

// 拖拽调整结果面板高度（上下）
function startResizeV(e: MouseEvent) {
  const startY = e.clientY
  const startHeight = resultHeight.value
  
  document.body.style.cursor = 'ns-resize'
  document.body.style.userSelect = 'none'
  
  function onMouseMove(e: MouseEvent) {
    const delta = startY - e.clientY
    resultHeight.value = Math.max(80, Math.min(600, startHeight + delta))
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
