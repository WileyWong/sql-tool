<template>
  <div class="menu-bar">
    <div class="menu-item" v-for="menu in menus" :key="menu.label">
      {{ menu.label }}
      <div class="dropdown">
        <template v-for="item in menu.items" :key="item.label">
          <div v-if="item.divider" class="dropdown-divider"></div>
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
import { useConnectionStore } from '../stores/connection'
import { useEditorStore } from '../stores/editor'

const connectionStore = useConnectionStore()
const editorStore = useEditorStore()

interface MenuItem {
  label?: string
  shortcut?: string
  action?: string
  divider?: boolean
}

interface Menu {
  label: string
  items: MenuItem[]
}

const menus: Menu[] = [
  {
    label: '文件(F)',
    items: [
      { label: '新建连接', shortcut: 'Ctrl+N', action: 'newConnection' },
      { label: '新建查询', shortcut: 'Ctrl+T', action: 'newQuery' },
      { divider: true },
      { label: '打开文件', shortcut: 'Ctrl+O', action: 'openFile' },
      { label: '保存', shortcut: 'Ctrl+S', action: 'save' },
      { label: '另存为', shortcut: 'Ctrl+Shift+S', action: 'saveAs' },
      { divider: true },
      { label: '退出', shortcut: 'Alt+F4', action: 'exit' }
    ]
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
]

function handleMenuClick(item: MenuItem) {
  switch (item.action) {
    case 'newConnection':
      connectionStore.openNewConnectionDialog()
      break
    case 'newQuery':
      editorStore.createTab()
      break
    case 'openFile':
      editorStore.openFile()
      break
    case 'save':
      editorStore.saveFile()
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
}

.dropdown-item:hover {
  background: #094771;
}

.dropdown-item .shortcut {
  color: #888;
  font-size: 12px;
  margin-left: 20px;
}

.dropdown-divider {
  height: 1px;
  background: #555;
  margin: 4px 0;
}
</style>
