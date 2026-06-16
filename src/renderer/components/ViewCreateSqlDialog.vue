<template>
  <el-dialog
    v-model="visible"
    :title="dialogTitle"
    width="800px"
    :close-on-click-modal="false"
    destroy-on-close
    @opened="onDialogOpened"
  >
    <div class="view-create-sql-container">
      <div ref="editorContainer" class="editor-wrapper"></div>
      <div class="loading-overlay" v-if="loading">
        <el-icon class="is-loading" :size="24"><Loading /></el-icon>
        <span>{{ $t('common.loading') }}</span>
      </div>
      <div class="error-overlay" v-if="error">
        <el-icon :size="24"><WarningFilled /></el-icon>
        <span>{{ error }}</span>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="copySql" :disabled="!sqlText">
          {{ $t('common.copy') }}
        </el-button>
        <el-button @click="visible = false">{{ $t('common.close') }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Loading, WarningFilled } from '@element-plus/icons-vue'
import { useConnectionStore } from '../stores/connection'
import { registerSqlDarkTheme, getDefaultTheme } from '../config/monaco-theme'
import * as monaco from 'monaco-editor'

const { t } = useI18n()
const connectionStore = useConnectionStore()

const props = defineProps<{
  modelValue: boolean
  connectionId: string
  database: string
  viewName: string
  schema?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const visible = ref(props.modelValue)
const sqlText = ref('')
const loading = ref(false)
const error = ref('')
const editorContainer = ref<HTMLElement | null>(null)
let editor: monaco.editor.IStandaloneCodeEditor | null = null

const dialogTitle = computed(() => `${t('contextMenu.viewCreateSql')}: ${props.viewName}`)

watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val) {
    loadViewCreateSql()
  }
})

watch(visible, (val) => {
  emit('update:modelValue', val)
  if (!val) {
    disposeEditor()
  }
})

async function loadViewCreateSql() {
  loading.value = true
  error.value = ''
  sqlText.value = ''

  try {
    const result = await connectionStore.getViewCreateSql(
      props.connectionId,
      props.database,
      props.viewName,
      props.schema
    )

    if (result.success && result.sql) {
      sqlText.value = result.sql
    } else {
      error.value = result.message || t('error.viewCreateSqlFailed')
    }
  } catch (err: any) {
    error.value = err.message || t('error.viewCreateSqlFailed')
  } finally {
    loading.value = false
  }
}

function onDialogOpened() {
  nextTick(() => {
    initEditor()
  })
}

function initEditor() {
  if (!editorContainer.value || !sqlText.value) return

  disposeEditor()
  
  registerSqlDarkTheme()

  editor = monaco.editor.create(editorContainer.value, {
    value: sqlText.value,
    language: 'sql',
    theme: getDefaultTheme(),
    readOnly: true,
    minimap: { enabled: false },
    lineNumbers: 'on',
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    tabSize: 2,
    automaticLayout: true,
    contextmenu: true,
    fontSize: 13,
    lineHeight: 20
  })

  // 添加全选快捷键支持
  editor.addAction({
    id: 'view-create-sql-select-all',
    label: 'Select All',
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyA],
    run: (ed) => {
      const model = ed.getModel()
      if (model) {
        ed.setSelection(model.getFullModelRange())
      }
    }
  })
}

function disposeEditor() {
  if (editor) {
    editor.dispose()
    editor = null
  }
}

async function copySql() {
  if (!sqlText.value) return
  try {
    await navigator.clipboard.writeText(sqlText.value)
    ElMessage.success(t('common.copied'))
  } catch {
    // 降级方案
    const textarea = document.createElement('textarea')
    textarea.value = sqlText.value
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    ElMessage.success(t('common.copied'))
  }
}
</script>

<style scoped>
.view-create-sql-container {
  position: relative;
  min-height: 300px;
}

.editor-wrapper {
  width: 100%;
  height: 400px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.loading-overlay,
.error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.9);
  z-index: 10;
}

.loading-overlay {
  color: #409eff;
}

.error-overlay {
  color: #f56c6c;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
