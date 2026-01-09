<template>
  <div class="menu-bar">
    <div class="menu-item" v-for="menu in menus" :key="menu.label">
      {{ menu.label }}
      <div class="dropdown">
        <template v-for="item in menu.items" :key="item.label || 'divider'">
          <div v-if="item.divider" class="dropdown-divider"></div>
          <div v-else-if="item.submenu" class="dropdown-item has-submenu">
            <span>{{ item.label }}</span>
            <span class="arrow">▶</span>
            <div class="submenu">
              <template v-for="subItem in item.submenu" :key="subItem.label">
                <div 
                  class="dropdown-item" 
                  :class="{ disabled: subItem.disabled }"
                  @click="!subItem.disabled && handleMenuClick(subItem)"
                >
                  <span class="submenu-label" :title="subItem.label">{{ subItem.label }}</span>
                </div>
              </template>
            </div>
          </div>
          <div v-else class="dropdown-item" @click="handleMenuClick(item)">
            <span>{{ item.label }}</span>
            <span v-if="item.shortcut" class="shortcut">{{ item.shortcut }}</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useConnectionStore } from '../stores/connection'
import { useEditorStore } from '../stores/editor'

const connectionStore = useConnectionStore()
const editorStore = useEditorStore()

interface MenuItem {
  label?: string
  shortcut?: string
  action?: string
  divider?: boolean
  submenu?: MenuItem[]
  filePath?: string
  disabled?: boolean
}

interface Menu {
  label: string
  items: MenuItem[]
}

// 最近文件列表
const recentFiles = ref<string[]>([])

// 加载最近文件
async function loadRecentFiles() {
  const files = await window.api.file.getRecentFiles()
  recentFiles.value = [...files] // 确保创建新数组以触发响应式更新
  await nextTick() // 等待 Vue 更新 DOM
}

onMounted(() => {
  loadRecentFiles()
})

// 监听文件保存事件，刷新最近文件列表
watch(() => editorStore.recentFilesVersion, () => {
  loadRecentFiles()
})

// 动态生成文件菜单项
const fileMenuItems = computed<MenuItem[]>(() => [
  { label: '新建连接', shortcut: 'Ctrl+N', action: 'newConnection' },
  { label: '新建查询', shortcut: 'Ctrl+T', action: 'newQuery' },
  { divider: true },
  { 
    label: '最近打开的文件', 
    submenu: recentFiles.value.length > 0 
      ? recentFiles.value.map(path => ({ 
          label: path, 
          action: 'openRecent', 
          filePath: path 
        }))
      : [{ label: '(无)', disabled: true }]
  },
  { divider: true },
  { label: '打开文件', shortcut: 'Ctrl+O', action: 'openFile' },
  { label: '保存', shortcut: 'Ctrl+S', action: 'save' },
  { label: '另存为', shortcut: 'Ctrl+Shift+S', action: 'saveAs' },
  { divider: true },
  { label: '退出', shortcut: 'Alt+F4', action: 'exit' }
])

const menus = computed<Menu[]>(() => [
  {
    label: '文件(F)',
    items: fileMenuItems.value
  },
  {
    label: '编辑(E)',
    items: [
      { label: '撤销', shortcut: 'Ctrl+Z', action: 'undo' },
      { label: '重做', shortcut: 'Ctrl+Y', action: 'redo' },
      { divider: true },
      { label: '剪切', shortcut: 'Ctrl+X', action: 'cut' },
      { label: '复制', shortcut: 'Ctrl+C', action: 'copy' },
      { label: '粘贴', shortcut: 'Ctrl+V', action: 'paste' },
      { divider: true },
      { label: '查找', shortcut: 'Ctrl+F', action: 'find' },
      { label: '替换', shortcut: 'Ctrl+H', action: 'replace' }
    ]
  },
  {
    label: '查看(V)',
    items: [
      { label: '展开全部', shortcut: 'Ctrl+Shift+E', action: 'expandAll' },
      { label: '折叠全部', shortcut: 'Ctrl+Shift+C', action: 'collapseAll' },
      { divider: true },
      { label: '刷新', shortcut: 'F5', action: 'refresh' }
    ]
  },
  {
    label: '查询(Q)',
    items: [
      { label: '执行', shortcut: 'F5', action: 'execute' },
      { label: '执行选中', shortcut: 'Ctrl+E', action: 'executeSelected' },
      { divider: true },
      { label: '显示执行计划', shortcut: 'Ctrl+L', action: 'explain' },
      { label: '停止执行', shortcut: 'Ctrl+Break', action: 'stop' }
    ]
  },
  {
    label: '工具(T)',
    items: [
      { label: '选项', action: 'options' },
      { label: '导入数据', action: 'import' },
      { label: '导出数据', action: 'export' }
    ]
  },
  {
    label: '帮助(H)',
    items: [
      { label: '文档', action: 'docs' },
      { label: '关于', action: 'about' }
    ]
  }
])

async function handleMenuClick(item: MenuItem) {
  switch (item.action) {
    case 'newConnection':
      connectionStore.openNewConnectionDialog()
      break
    case 'newQuery':
      editorStore.createTab()
      break
    case 'openFile':
      await editorStore.openFile()
      await loadRecentFiles() // 刷新最近文件列表
      break
    case 'openRecent':
      if (item.filePath) {
        const result = await editorStore.openRecentFile(item.filePath)
        if (!result.success) {
          alert(result.message || '无法打开文件')
        }
        await loadRecentFiles() // 刷新列表（可能已移除无效文件）
      }
      break
    case 'save':
      await editorStore.saveFile()
      await loadRecentFiles() // 刷新最近文件列表
      break
    case 'saveAs':
      await editorStore.saveFileAs()
      await loadRecentFiles() // 刷新最近文件列表
      break
    case 'exit':
      window.close()
      break
    // 其他操作可以后续添加
  }
}
</script>

<style scoped>
.menu-bar {
  background: #3c3c3c;
  padding: 4px 8px;
  display: flex;
  gap: 4px;
  border-bottom: 1px solid #555;
}

.menu-item {
  padding: 4px 12px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 13px;
  position: relative;
  color: #d4d4d4;
}

.menu-item:hover {
  background: #505050;
}

.dropdown {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background: #3c3c3c;
  border: 1px solid #555;
  border-radius: 4px;
  min-width: 180px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.menu-item:hover .dropdown {
  display: block;
}

.dropdown-item {
  padding: 8px 16px;
  cursor: pointer;
  font-size: 13px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #d4d4d4;
  position: relative;
}

.dropdown-item:hover {
  background: #094771;
}

.dropdown-item.disabled {
  color: #888;
  cursor: default;
}

.dropdown-item.disabled:hover {
  background: transparent;
}

.dropdown-item .shortcut {
  color: #888;
  font-size: 12px;
  margin-left: 20px;
}

.dropdown-item .arrow {
  color: #888;
  font-size: 10px;
  margin-left: 10px;
}

.dropdown-divider {
  height: 1px;
  background: #555;
  margin: 4px 0;
}

/* 子菜单样式 */
.has-submenu {
  position: relative;
}

.submenu {
  display: none;
  position: absolute;
  top: 0;
  left: 100%;
  background: #3c3c3c;
  border: 1px solid #555;
  border-radius: 4px;
  min-width: 300px;
  max-width: 500px;
  z-index: 1001;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.has-submenu:hover .submenu {
  display: block;
}

.submenu .dropdown-item {
  padding: 8px 12px;
}

.submenu-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}
</style>
