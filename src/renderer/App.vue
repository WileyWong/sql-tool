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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MenuBar from './components/MenuBar.vue'
import Toolbar from './components/Toolbar.vue'
import ConnectionTree from './components/ConnectionTree.vue'
import SqlEditor from './components/SqlEditor.vue'
import ResultPanel from './components/ResultPanel.vue'
import ConnectionDialog from './components/ConnectionDialog.vue'
import StatusBar from './components/StatusBar.vue'

const resultHeight = ref(200)
const sidebarWidth = ref(260)

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
function startResizeH(e: MouseEvent) {
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
