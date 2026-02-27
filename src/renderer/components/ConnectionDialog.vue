<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? $t('connection.editConnection') : $t('connection.newConnection')"
    width="520px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
      label-position="right"
    >
      <!-- 数据库类型选择 -->
      <el-form-item :label="$t('connection.databaseType')" prop="type">
        <el-radio-group v-model="form.type" @change="handleTypeChange">
          <el-radio-button
            v-for="dbType in DatabaseTypes"
            :key="dbType.type"
            :value="dbType.type"
          >
            {{ dbType.name }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      
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
              :placeholder="String(getDefaultPort(form.type))"
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
      
      <!-- SQL Server 特有选项 -->
      <template v-if="form.type === 'sqlserver'">
        <el-divider content-position="left">{{ $t('connection.sqlServerOptions') }}</el-divider>
        
        <el-form-item :label="$t('connection.encrypt')">
          <el-switch v-model="form.options.encrypt" />
        </el-form-item>
        
        <el-form-item :label="$t('connection.trustServerCertificate')">
          <el-switch v-model="form.options.trustServerCertificate" />
        </el-form-item>
        
        <el-form-item :label="$t('connection.domain')">
          <el-input 
            v-model="form.options.domain" 
            placeholder="Optional, for Windows Authentication"
            clearable
          />
        </el-form-item>
      </template>
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
import { DatabaseTypes, getDefaultPort, type DatabaseType, type SqlServerOptions } from '@shared/types/connection'

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

// 表单数据
const form = ref<{
  type: DatabaseType
  name: string
  host: string
  port: number
  username: string
  password: string
  database: string
  options: SqlServerOptions
}>({
  type: 'mysql',
  name: '',
  host: '',
  port: 3306,
  username: '',
  password: '',
  database: '',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    domain: ''
  }
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

// 切换数据库类型时更新默认端口
function handleTypeChange(type: DatabaseType) {
  form.value.port = getDefaultPort(type)
}

// 监听编辑连接变化
watch(() => connectionStore.editingConnection, (conn) => {
  if (conn) {
    form.value = {
      type: conn.type || 'mysql',
      name: conn.name,
      host: conn.host,
      port: conn.port,
      username: conn.username,
      password: conn.password,
      database: conn.database || '',
      options: {
        encrypt: conn.options?.encrypt ?? false,
        trustServerCertificate: conn.options?.trustServerCertificate ?? true,
        domain: conn.options?.domain || ''
      }
    }
  } else {
    form.value = {
      type: 'mysql',
      name: '',
      host: '',
      port: 3306,
      username: '',
      password: '',
      database: '',
      options: {
        encrypt: false,
        trustServerCertificate: true,
        domain: ''
      }
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
      type: form.value.type,
      name: form.value.name,
      host: form.value.host,
      port: form.value.port || getDefaultPort(form.value.type),
      username: form.value.username,
      password: form.value.password,
      database: form.value.database || undefined,
      options: form.value.type === 'sqlserver' ? {
        encrypt: form.value.options.encrypt,
        trustServerCertificate: form.value.options.trustServerCertificate,
        domain: form.value.options.domain || undefined
      } : undefined,
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
        type: form.value.type,
        name: form.value.name,
        host: form.value.host,
        port: form.value.port || getDefaultPort(form.value.type),
        username: form.value.username,
        password: form.value.password,
        database: form.value.database || undefined,
        options: form.value.type === 'sqlserver' ? {
          encrypt: form.value.options.encrypt,
          trustServerCertificate: form.value.options.trustServerCertificate,
          domain: form.value.options.domain || undefined
        } : undefined
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

:deep(.el-input-group__append) {
  background: var(--bg-elevated);
  border-color: var(--border-color);
}

:deep(.el-radio-group) {
  display: flex;
  gap: 0;
}

:deep(.el-divider__text) {
  font-size: 12px;
}
</style>
