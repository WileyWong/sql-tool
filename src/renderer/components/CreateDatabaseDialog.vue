<template>
  <el-dialog
    v-model="visible"
    :title="t('database.createDatabase')"
    width="520px"
    :close-on-click-modal="false"
    @close="handleClose"
    destroy-on-close
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
      <!-- 数据库名称 -->
      <el-form-item :label="t('database.databaseName')" prop="name">
        <el-input
          v-model="form.name"
          :placeholder="t('database.databaseNamePlaceholder')"
          :maxlength="maxNameLength"
          show-word-limit
        />
      </el-form-item>
      <!-- MySQL: 字符集 -->
      <el-form-item v-if="isMysql" :label="t('table.charset')" prop="charset">
        <el-select
          v-model="form.charset"
          :placeholder="t('table.charsetPlaceholder')"
          filterable
          clearable
          @change="handleCharsetChange"
          :loading="loadingMetadata"
        >
          <el-option
            v-for="c in charsets"
            :key="c.charset"
            :label="c.charset"
            :value="c.charset"
          />
        </el-select>
      </el-form-item>
      <!-- 排序规则 -->
      <el-form-item :label="t('table.collation')" prop="collation">
        <!-- SQL Server: 使用虚拟滚动选择器应对 5000+ 条数据 -->
        <el-select-v2
          v-if="!isMysql"
          v-model="form.collation"
          :placeholder="loadingMetadata ? t('database.loadingMetadata') : t('table.collationPlaceholder')"
          filterable
          clearable
          :loading="loadingMetadata"
          :options="collationOptions"
          style="width: 100%"
        />
        <!-- MySQL: 普通选择器 -->
        <el-select
          v-else
          v-model="form.collation"
          :placeholder="t('table.collationPlaceholder')"
          filterable
          clearable
          :loading="loadingMetadata"
        >
          <el-option
            v-for="c in filteredCollations"
            :key="c.collation"
            :label="c.collation"
            :value="c.collation"
          />
        </el-select>
      </el-form-item>
      <!-- SQL 预览 -->
      <el-form-item :label="t('database.sqlPreview')">
        <pre class="sql-preview">{{ generatedSql }}</pre>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">{{ t('common.cancel') }}</el-button>
      <el-button type="primary" @click="handleCreate" :loading="executing">{{ t('common.confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useConnectionStore } from '../stores/connection'

const emit = defineEmits<{
  'success': [connectionId: string]
}>()

const { t } = useI18n()
const connectionStore = useConnectionStore()
const formRef = ref<FormInstance>()
const executing = ref(false)
const loadingMetadata = ref(false)

// 元数据缓存
const charsets = ref<{ charset: string; defaultCollation: string; description: string }[]>([])
const allCollations = ref<{ collation: string; charset: string; isDefault: boolean }[]>([])

// 可见性绑定 store
const visible = computed({
  get: () => connectionStore.createDatabaseDialogVisible,
  set: (val) => { if (!val) connectionStore.closeCreateDatabaseDialog() }
})

const info = computed(() => connectionStore.createDatabaseInfo)
const isMysql = computed(() => info.value?.dbType === 'mysql')
const maxNameLength = computed(() => isMysql.value ? 64 : 128)

// 表单数据
const form = reactive({ name: '', charset: '', collation: '' })

// 校验规则
const rules = computed<FormRules>(() => ({
  name: [
    {
      required: true,
      validator: (_rule: unknown, value: string, callback: (error?: Error) => void) => {
        if (!value?.trim()) return callback(new Error(t('database.nameRequired')))
        if (/[\s./\\:*?"<>|]/.test(value)) return callback(new Error(t('database.nameInvalidChars')))
        const max = isMysql.value ? 64 : 128
        if (value.length > max) return callback(new Error(t('database.nameTooLong', { max })))
        callback()
      },
      trigger: 'blur'
    }
  ]
}))

// 字符集变更 → 联动过滤排序规则
function handleCharsetChange(charset: string) {
  form.collation = ''
  if (charset && isMysql.value) {
    // MySQL: 加载该字符集对应的排序规则
    loadCollationsForCharset(charset)
  }
}

async function loadCollationsForCharset(charset: string) {
  if (!info.value) return
  loadingMetadata.value = true
  try {
    const res = await connectionStore.getCollations(info.value.connectionId, charset)
    if (res.success && res.collations) {
      allCollations.value = res.collations
    }
  } catch {
    // 加载失败不阻塞
  } finally {
    loadingMetadata.value = false
  }
}

// 过滤后的排序规则（MySQL 用）
const filteredCollations = computed(() => {
  if (isMysql.value && form.charset) {
    return allCollations.value.filter(c => c.charset === form.charset)
  }
  return allCollations.value
})

// el-select-v2 选项格式（SQL Server 用，支持虚拟滚动）
const collationOptions = computed(() => {
  return allCollations.value.map(c => ({
    value: c.collation,
    label: c.collation
  }))
})

// SQL 预览
const generatedSql = computed(() => {
  const { name, charset, collation } = form
  if (!name.trim()) return '-- ' + t('database.databaseNamePlaceholder')

  if (isMysql.value) {
    let sql = `CREATE DATABASE \`${name}\``
    if (charset) sql += `\n  CHARACTER SET ${charset}`
    if (collation) sql += `\n  COLLATE ${collation}`
    return sql + ';'
  } else {
    let sql = `CREATE DATABASE [${name}]`
    if (collation) sql += `\n  COLLATE ${collation}`
    return sql + ';'
  }
})

// 对话框打开时加载元数据
watch(visible, (val) => {
  if (val && info.value) {
    // 重置表单
    form.name = ''
    form.charset = ''
    form.collation = ''
    nextTick(() => formRef.value?.resetFields())

    // 异步加载元数据，不阻塞 UI
    loadMetadata()
  } else {
    // 关闭时清理
    charsets.value = []
    allCollations.value = []
  }
})

async function loadMetadata() {
  if (!info.value) return
  loadingMetadata.value = true
  try {
    if (isMysql.value) {
      const [charsetsRes, collationsRes] = await Promise.all([
        connectionStore.getCharsets(info.value.connectionId),
        connectionStore.getCollations(info.value.connectionId)
      ])
      if (charsetsRes.success && charsetsRes.charsets) {
        charsets.value = charsetsRes.charsets
      }
      if (collationsRes.success && collationsRes.collations) {
        allCollations.value = collationsRes.collations
      }
    } else {
      // SQL Server: 加载 collations
      const collationsRes = await connectionStore.getCollations(info.value.connectionId)
      if (collationsRes.success && collationsRes.collations) {
        allCollations.value = collationsRes.collations
      }
    }
  } catch {
    // 元数据加载失败不阻塞创建
  } finally {
    loadingMetadata.value = false
  }
}

function handleClose() {
  connectionStore.closeCreateDatabaseDialog()
}

async function handleCreate() {
  if (!formRef.value) return
  await formRef.value.validate()

  if (!info.value) return
  executing.value = true
  try {
    const sql = generatedSql.value
    const result = await connectionStore.executeDDL(info.value.connectionId, sql)
    if (result.success) {
      ElMessage.success(t('database.createSuccess'))
      const connId = info.value.connectionId
      connectionStore.closeCreateDatabaseDialog()
      // 刷新数据库列表
      await connectionStore.loadDatabases(connId)
      emit('success', connId)
    } else {
      ElMessage.error(result.message || t('message.operationFailed'))
    }
  } finally {
    executing.value = false
  }
}
</script>

<style scoped>
.sql-preview {
  width: 100%;
  padding: 8px 12px;
  background: var(--bg-elevated, #1e1e1e);
  border: 1px solid var(--border-color, #3c3c3c);
  border-radius: 4px;
  color: var(--text-primary, #d4d4d4);
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.5;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 120px;
  overflow-y: auto;
}
</style>
