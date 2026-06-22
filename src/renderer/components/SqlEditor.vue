<template>
  <div class="sql-editor">
    <!-- 标签页 -->
    <el-tabs
      v-model="activeTabId"
      type="card"
      closable
      @tab-remove="handleTabRemove"
      @tab-change="handleTabChange"
    >
      <el-tab-pane
        v-for="tab in tabs"
        :key="tab.id"
        :label="(tab.isDirty ? '* ' : '') + tab.title"
        :name="tab.id"
      >
        <template #label>
          <el-tooltip
            :content="getTabTooltip(tab)"
            placement="bottom"
            :show-after="300"
          >
            <span>{{ (tab.isDirty ? '* ' : '') + tab.title }}</span>
          </el-tooltip>
        </template>
      </el-tab-pane>
    </el-tabs>
    
    <!-- SQL 标签页内容 -->
    <SqlEditorPanel v-if="isSqlTab" ref="sqlEditorPanelRef" />
    
    <!-- ER 图标签页内容 -->
    <ErDiagramPanel v-else-if="isErdTab" ref="erdDiagramPanelRef" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import Sortable from 'sortablejs'
import { useEditorStore } from '../stores/editor'
import { useResultStore } from '../stores/result'
import SqlEditorPanel from './SqlEditorPanel.vue'
import ErDiagramPanel from './ErDiagram/ErDiagramPanel.vue'

const { t } = useI18n()
const editorStore = useEditorStore()
const resultStore = useResultStore()

const sqlEditorPanelRef = ref<InstanceType<typeof SqlEditorPanel>>()

const saveConfirmDialog = inject<{ show: (tabId: string, title: string, filePath?: string) => Promise<'save' | 'dontSave' | 'cancel'> }>('saveConfirmDialog')
const dataOperations = inject<{ hasUnsavedChanges: () => boolean; clearChanges: () => void; cleanupTab: (tabId: string) => void }>('dataOperations')

let sortableInstance: Sortable | null = null

const tabs = computed(() => editorStore.tabs)
const activeTabId = computed({
  get: () => editorStore.activeTabId || '',
  set: (val) => editorStore.switchTab(val)
})

const isSqlTab = computed(() => editorStore.activeTab?.tabType !== 'erd')
const isErdTab = computed(() => editorStore.activeTab?.tabType === 'erd')

// 获取选中的 SQL 文本（桥接给 Toolbar）
function getSelectedText(): string {
  return sqlEditorPanelRef.value?.getSelectedText() || ''
}

defineExpose({ getSelectedText })

function getTabTooltip(tab: typeof editorStore.tabs[0]): string {
  if (!tab.filePath) return t('editor.unsaved')
  if (tab.isDirty) return `${tab.filePath} (${t('editor.modified')})`
  return tab.filePath
}

async function handleTabRemove(tabId: string | number) {
  const id = String(tabId)
  const tab = editorStore.tabs.find(t => t.id === id)
  if (tab && tab.isDirty) {
    if (!saveConfirmDialog) {
      const fileName = tab.filePath ? tab.filePath.split(/[/\\]/).pop() : tab.title
      const confirmed = window.confirm(`文件 "${fileName}" 已修改，是否保存更改？\n\n点击"确定"保存，点击"取消"不保存并关闭。`)
      if (confirmed) {
        const saveResult = await editorStore.saveTabById(id)
        if (!saveResult.success && (saveResult as any).canceled) return
      }
    } else {
      const result = await saveConfirmDialog.show(tab.id, tab.title, tab.filePath)
      if (result === 'save') {
        const saveResult = await editorStore.saveTabById(id)
        if (!saveResult.success && (saveResult as any).canceled) return
      } else if (result === 'cancel') return
    }
  }
  resultStore.cleanupEditorTab(id)
  dataOperations?.cleanupTab(id)
  editorStore.closeTab(id)
}

function handleTabChange(tabId: string | number) {
  editorStore.switchTab(String(tabId))
}

async function handleSaveShortcut(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault()
    const result = await editorStore.saveFile()
    if (result.success) {
      const recentFiles = await window.api.file.getRecentFiles()
      await window.api.menu.updateRecentFiles(recentFiles.slice(0, 10))
    }
  }
}

function initTabSortable() {
  setTimeout(() => {
    const tabNav = document.querySelector('.sql-editor .el-tabs__nav') as HTMLElement
    if (!tabNav) return
    sortableInstance = new Sortable(tabNav, {
      animation: 150,
      draggable: '.el-tabs__item',
      ghostClass: 'sortable-ghost',
      dragClass: 'sortable-drag',
      delay: 0,
      onEnd: (evt) => {
        if (evt.oldIndex === evt.newIndex) return
        const newOrder: string[] = []
        const tabItems = tabNav.querySelectorAll('.el-tabs__item')
        tabItems.forEach((item) => newOrder.push(item.getAttribute('data-name') || ''))
        if (newOrder.length > 0) editorStore.reorderTabs(newOrder)
      }
    })
  }, 100)
}

onMounted(async () => {
  await editorStore.init()
  window.addEventListener('keydown', handleSaveShortcut)
  initTabSortable()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleSaveShortcut)
  if (sortableInstance) { sortableInstance.destroy(); sortableInstance = null }
})
</script>

<style scoped>
.sql-editor { display: flex; flex-direction: column; height: 100%; background: var(--bg-base); }

.sql-editor :deep(.el-tabs__header) { margin: 0; padding: 0 8px; background: var(--bg-surface); border-bottom: 1px solid var(--border-color); }
.sql-editor :deep(.el-tabs__nav-wrap) { background: var(--bg-surface); }
.sql-editor :deep(.el-tabs__item) { height: 32px; line-height: 32px; color: var(--text-primary); border-color: var(--border-color) !important; background: var(--bg-surface); }
.sql-editor :deep(.el-tabs__item:hover) { color: var(--text-bright); }
.sql-editor :deep(.el-tabs__item.is-active) { color: var(--text-bright); background: var(--bg-base); border-bottom-color: var(--color-primary) !important; }
.sql-editor :deep(.el-tabs__nav) { border-color: var(--border-color); }
.sql-editor :deep(.el-tabs__item) { user-select: none; }
.sql-editor :deep(.sortable-ghost) { opacity: 0.4; background: #094771 !important; border: 1px dashed var(--color-primary) !important; }
.sql-editor :deep(.sortable-drag) { opacity: 0.8; background: var(--bg-base) !important; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5); }
</style>
