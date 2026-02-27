<template>
  <el-dialog
    v-model="visible"
    :title="dialogTitle"
    width="1100px"
    :close-on-click-modal="false"
    @close="handleClose"
    class="table-design-dialog"
  >
    <component
      v-if="visible && designInfo"
      :is="designComponent"
      ref="designRef"
      :connectionId="designInfo.connectionId"
      :database="designInfo.database"
      :table="designInfo.table"
      :schema="designInfo.schema"
      :mode="connectionStore.tableDesignMode"
      @success="handleSuccess"
      @close="handleClose"
    />
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleExecute" :loading="executing">
          {{ isEditMode ? $t('table.alterTable') : $t('table.createTable') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useConnectionStore } from '../stores/connection'
import MysqlTableDesign from './MysqlTableDesign.vue'
import SqlServerTableDesign from './SqlServerTableDesign.vue'

const { t } = useI18n()
const connectionStore = useConnectionStore()

const designRef = ref<{ handleExecute: () => Promise<void>; executing: boolean } | null>(null)

const visible = computed({
  get: () => connectionStore.tableDesignDialogVisible,
  set: (val) => {
    if (!val) connectionStore.closeTableDesignDialog()
  }
})

const isEditMode = computed(() => connectionStore.tableDesignMode === 'edit')
const designInfo = computed(() => connectionStore.tableDesignInfo)

const executing = computed(() => designRef.value?.executing ?? false)

const dialogTitle = computed(() => {
  const info = connectionStore.tableDesignInfo
  if (!info) return t('table.designTitle')
  if (isEditMode.value) {
    return t('table.editTitle', { database: info.database, table: info.table })
  }
  return t('table.createTitle', { database: info.database })
})

const designComponent = computed(() => {
  const info = connectionStore.tableDesignInfo
  if (!info) return MysqlTableDesign
  
  const conn = connectionStore.connections.find(c => c.id === info.connectionId)
  if (conn?.type === 'sqlserver') {
    return SqlServerTableDesign
  }
  return MysqlTableDesign
})

function handleClose() {
  connectionStore.closeTableDesignDialog()
}

async function handleExecute() {
  if (designRef.value) {
    await designRef.value.handleExecute()
  }
}

async function handleSuccess() {
  const info = connectionStore.tableDesignInfo
  connectionStore.closeTableDesignDialog()
  if (info) {
    await connectionStore.loadTables(info.connectionId, info.database)
  }
}
</script>

<style scoped>
.table-design-dialog :deep(.el-dialog__body) {
  padding: 10px 20px;
  max-height: 70vh;
  overflow-y: auto;
}

.dialog-footer {
  text-align: right;
}

/* 深色主题样式覆盖 */
:deep(.el-table) {
  --el-table-bg-color: var(--bg-base);
  --el-table-tr-bg-color: var(--bg-base);
  --el-table-header-bg-color: var(--bg-surface);
  --el-table-row-hover-bg-color: #2a2d2e;
  --el-table-border-color: #4c4d4f;
  --el-table-text-color: #e0e0e0;
  --el-table-header-text-color: #e0e0e0;
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell) {
  background-color: var(--bg-sidebar);
}

:deep(.el-tabs__item) {
  color: #909399;
}

:deep(.el-tabs__item.is-active) {
  color: #409eff;
}

:deep(.el-tabs__nav-wrap::after) {
  background-color: #4c4d4f;
}

:deep(.el-input__wrapper),
:deep(.el-select__wrapper),
:deep(.el-input-number) {
  background-color: var(--bg-elevated);
  box-shadow: 0 0 0 1px #4c4d4f inset;
}

:deep(.el-input__inner) {
  color: #e0e0e0;
}

:deep(.el-checkbox__inner) {
  background-color: var(--bg-elevated);
  border-color: #4c4d4f;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #409eff;
  border-color: #409eff;
}

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 60px;
  color: #909399;
}

.design-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.table-info-section {
  background: var(--bg-surface);
  padding: 12px;
  border-radius: 4px;
}

.table-info-section :deep(.el-form-item) {
  margin-bottom: 0;
  margin-right: 16px;
}

.table-info-section :deep(.el-form-item__label) {
  color: #e0e0e0;
}

:deep(.design-tabs) {
  min-height: 350px;
}

:deep(.columns-toolbar),
:deep(.indexes-toolbar) {
  margin-bottom: 8px;
  display: flex;
  gap: 8px;
}

:deep(.columns-table),
:deep(.indexes-table) {
  width: 100%;
}

:deep(.disabled-cell) {
  color: #666;
  text-align: center;
  display: block;
}

:deep(.sql-preview-section) {
  background: var(--bg-base);
  border-radius: 4px;
  overflow: hidden;
}

:deep(.preview-header) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: var(--bg-surface);
  color: #e0e0e0;
  font-size: 13px;
}

:deep(.sql-preview) {
  margin: 0;
  padding: 12px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 12px;
  line-height: 1.5;
  color: #d4d4d4;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 150px;
  overflow: auto;
}
</style>
