<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? $t('connection.editConnection') : $t('connection.newConnection')"
    width="500px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      label-position="right"
    >
      <el-form-item :label="$t('connection.connectionName')" prop="name">
        <el-input v-model="form.name" :placeholder="$t('connection.connectionNamePlaceholder')" />
      </el-form-item>
      
      <el-form-item :label="$t('connection.host')" prop="host">
        <el-input v-model="form.host" :placeholder="$t('connection.hostPlaceholder')">
          <template #append>
            <el-input-number
              v-model="form.port"
              :min="1"
              :max="65535"
              :controls="false"
              style="width: 80px"
              placeholder="3306"
            />
          </template>
        </el-input>
      </el-form-item>
      
      <el-form-item :label="$t('connection.username')" prop="username">
        <el-input v-model="form.username" :placeholder="$t('connection.usernamePlaceholder')" />
      </el-form-item>
      
      <el-form-item :label="$t('connection.password')" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          show-password
          :placeholder="$t('connection.passwordPlaceholder')"
        />
      </el-form-item>
      
      <el-form-item :label="$t('connection.database')">
        <el-input v-model="form.database" :placeholder="$t('connection.databasePlaceholder')" />
      </el-form-item>
    </el-form>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleTest" :loading="testing">
          {{ $t('connection.testConnection') }}
        </el-button>
        <div class="footer-right">
          <el-button @click="handleClose">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" @click="handleSave" :loading="saving">
            {{ $t('common.save') }}
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useConnectionStore } from '../stores/connection'
import { Defaults } from '@shared/constants'

const { t } = useI18n()
const connectionStore = useConnectionStore()

const formRef = ref<FormInstance>()
const testing = ref(false)
const saving = ref(false)

const visible = computed({
  get: () => connectionStore.dialogVisible,
  set: (val) => {
    if (!val) connectionStore.closeDialog()
  }
})

const isEdit = computed(() => !!connectionStore.editingConnection)

const form = ref({
  name: '',
  host: '',
  port: Defaults.PORT as number,
  username: '',
  password: '',
  database: ''
})

const rules = computed<FormRules>(() => ({
  name: [
    { required: true, message: t('connection.connectionRequired'), trigger: 'blur' },
    { max: 50, message: t('connection.connectionRequired'), trigger: 'blur' }
  ],
  host: [
    { required: true, message: t('connection.hostRequired'), trigger: 'blur' }
  ],
  username: [
    { required: true, message: t('connection.usernameRequired'), trigger: 'blur' }
  ],
  password: [
    { required: true, message: t('connection.passwordPlaceholder'), trigger: 'blur' }
  ]
}))

// 监听编辑连接变化
watch(() => connectionStore.editingConnection, (conn) => {
  if (conn) {
    form.value = {
      name: conn.name,
      host: conn.host,
      port: conn.port,
      username: conn.username,
      password: conn.password,
      database: conn.database || ''
    }
  } else {
    form.value = {
      name: '',
      host: '',
      port: Defaults.PORT,
      username: '',
      password: '',
      database: ''
    }
  }
}, { immediate: true })

// 测试连接
async function handleTest() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  
  testing.value = true
  
  try {
    const result = await connectionStore.testConnection({
      id: connectionStore.editingConnection?.id || '',
      name: form.value.name,
      host: form.value.host,
      port: form.value.port || Defaults.PORT,
      username: form.value.username,
      password: form.value.password,
      database: form.value.database || undefined,
      createdAt: Date.now(),
      updatedAt: Date.now()
    })
    
    if (result.success) {
      ElMessage.success(`${t('connection.testSuccess')}! ${t('connection.serverVersion')}: ${result.serverVersion}`)
    } else {
      ElMessage.error(result.message)
    }
  } finally {
    testing.value = false
  }
}

// 保存
async function handleSave() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  
  saving.value = true
  
  try {
    const result = await connectionStore.saveConnection(
      {
        name: form.value.name,
        host: form.value.host,
        port: form.value.port || Defaults.PORT,
        username: form.value.username,
        password: form.value.password,
        database: form.value.database || undefined
      },
      connectionStore.editingConnection?.id
    )
    
    if (result.success) {
      ElMessage.success(t('message.saveSuccess'))
      connectionStore.closeDialog()
    } else {
      ElMessage.error(result.message || t('error.saveFailed', { message: '' }))
    }
  } finally {
    saving.value = false
  }
}

// 关闭
function handleClose() {
  connectionStore.closeDialog()
}
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: space-between;
}

.footer-right {
  display: flex;
  gap: 8px;
}

/* 深色主题对话框样式 */
:deep(.el-dialog) {
  background: #2d2d2d;
  border: 1px solid #555;
}

:deep(.el-dialog__header) {
  border-bottom: 1px solid #555;
}

:deep(.el-dialog__title) {
  color: #fff;
}

:deep(.el-dialog__headerbtn .el-dialog__close) {
  color: #888;
}

:deep(.el-dialog__headerbtn:hover .el-dialog__close) {
  color: #fff;
}

:deep(.el-form-item__label) {
  color: #ccc;
}

:deep(.el-input__wrapper) {
  background: #3c3c3c;
  border-color: #555;
  box-shadow: none;
}

:deep(.el-input__wrapper:hover) {
  border-color: #0e639c;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #0e639c;
  box-shadow: 0 0 0 1px #0e639c;
}

:deep(.el-input__inner) {
  color: #d4d4d4;
}

:deep(.el-input__inner::placeholder) {
  color: #888;
}

:deep(.el-input-group__append) {
  background: #3c3c3c;
  border-color: #555;
}

:deep(.el-dialog__footer) {
  border-top: 1px solid #555;
}

:deep(.el-button) {
  background: #3c3c3c;
  border-color: #555;
  color: #d4d4d4;
}

:deep(.el-button:hover) {
  background: #505050;
  border-color: #0e639c;
  color: #fff;
}

:deep(.el-button--primary) {
  background: #0e639c;
  border-color: #0e639c;
  color: #fff;
}

:deep(.el-button--primary:hover) {
  background: #1177bb;
  border-color: #1177bb;
}
</style>
