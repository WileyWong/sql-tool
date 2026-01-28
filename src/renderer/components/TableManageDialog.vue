<template>
  <el-dialog
    v-model="visible"
    :title="dialogTitle"
    width="900px"
    :close-on-click-modal="false"
    @close="handleClose"
    class="table-manage-dialog"
  >
    <el-tabs v-model="activeTab" class="table-tabs">
      <!-- 建表语句页签 -->
      <el-tab-pane label="建表语句" name="createSql">
        <div class="sql-container">
          <div v-if="loading.createSql" class="loading-container">
            <el-icon class="is-loading"><Loading /></el-icon>
            <span>加载中...</span>
          </div>
          <pre v-else class="sql-content">{{ createSql }}</pre>
        </div>
      </el-tab-pane>
      
      <!-- 列信息页签 -->
      <el-tab-pane label="列" name="columns">
        <div v-if="loading.columns" class="loading-container">
          <el-icon class="is-loading"><Loading /></el-icon>
          <span>加载中...</span>
        </div>
        <el-table
          v-else
          :data="columns"
          stripe
          border
          size="small"
          class="columns-table"
          max-height="400"
        >
          <el-table-column prop="name" label="列名" min-width="120" fixed />
          <el-table-column prop="columnType" label="类型" min-width="120" />
          <el-table-column prop="defaultValue" label="默认值" min-width="100">
            <template #default="{ row }">
              {{ row.defaultValue ?? 'NULL' }}
            </template>
          </el-table-column>
          <el-table-column prop="nullable" label="允许空" width="80" align="center">
            <template #default="{ row }">
              <el-tag :type="row.nullable ? 'success' : 'danger'" size="small">
                {{ row.nullable ? '是' : '否' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="characterSet" label="字符编码" width="100">
            <template #default="{ row }">
              {{ row.characterSet || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="collation" label="Collation" min-width="140">
            <template #default="{ row }">
              {{ row.collation || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="primaryKey" label="主键" width="70" align="center">
            <template #default="{ row }">
              <el-tag v-if="row.primaryKey" type="warning" size="small">PK</el-tag>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="autoIncrement" label="自增" width="70" align="center">
            <template #default="{ row }">
              <el-tag v-if="row.autoIncrement" type="info" size="small">AI</el-tag>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="comment" label="注释" min-width="150">
            <template #default="{ row }">
              {{ row.comment || '-' }}
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      
      <!-- 索引信息页签 -->
      <el-tab-pane label="索引" name="indexes">
        <div v-if="loading.indexes" class="loading-container">
          <el-icon class="is-loading"><Loading /></el-icon>
          <span>加载中...</span>
        </div>
        <div v-else class="indexes-container">
          <!-- 左侧索引列表 -->
          <div class="index-list">
            <div class="index-list-header">索引列表</div>
            <div
              v-for="index in indexes"
              :key="index.name"
              :class="['index-item', { active: selectedIndex?.name === index.name }]"
              @click="selectIndex(index)"
            >
              <div class="index-name">{{ index.name }}</div>
              <el-tag :type="getIndexTypeTagType(index.type)" size="small">
                {{ index.type }}
              </el-tag>
            </div>
            <div v-if="indexes.length === 0" class="no-data">
              暂无索引
            </div>
          </div>
          
          <!-- 右侧索引详情 -->
          <div class="index-detail">
            <div class="index-detail-header">索引列信息</div>
            <el-table
              v-if="selectedIndex"
              :data="selectedIndex.columns"
              stripe
              border
              size="small"
              class="index-columns-table"
            >
              <el-table-column prop="seqInIndex" label="序号" width="60" align="center" />
              <el-table-column prop="columnName" label="列名" min-width="120" />
              <el-table-column prop="order" label="排序" width="80" align="center">
                <template #default="{ row }">
                  <el-tag :type="row.order === 'ASC' ? 'primary' : 'warning'" size="small">
                    {{ row.order }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="subPart" label="前缀长度" width="100" align="center">
                <template #default="{ row }">
                  {{ row.subPart ?? '-' }}
                </template>
              </el-table-column>
              <el-table-column prop="cardinality" label="基数" width="100" align="right">
                <template #default="{ row }">
                  {{ row.cardinality ?? '-' }}
                </template>
              </el-table-column>
            </el-table>
            <div v-else class="no-selection">
              请选择左侧索引查看详情
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Loading } from '@element-plus/icons-vue'
import { useConnectionStore } from '../stores/connection'
import type { ColumnMeta, IndexMeta } from '@shared/types'

const connectionStore = useConnectionStore()

// 对话框可见性
const visible = computed({
  get: () => connectionStore.tableManageDialogVisible,
  set: (val) => {
    if (!val) connectionStore.closeTableManageDialog()
  }
})

// 对话框标题
const dialogTitle = computed(() => {
  const info = connectionStore.tableManageInfo
  if (!info) return '表管理'
  return `表管理 - ${info.database}.${info.table}`
})

// 当前激活的页签
const activeTab = ref('createSql')

// 数据
const createSql = ref('')
const columns = ref<ColumnMeta[]>([])
const indexes = ref<IndexMeta[]>([])
const selectedIndex = ref<IndexMeta | null>(null)

// 加载状态
const loading = ref({
  createSql: false,
  columns: false,
  indexes: false
})

// 监听对话框打开
watch(() => connectionStore.tableManageDialogVisible, async (newVal) => {
  if (newVal && connectionStore.tableManageInfo) {
    // 重置状态
    activeTab.value = 'createSql'
    createSql.value = ''
    columns.value = []
    indexes.value = []
    selectedIndex.value = null
    
    // 加载数据
    await loadData()
  }
})

// 加载所有数据
async function loadData() {
  const info = connectionStore.tableManageInfo
  if (!info) return
  
  // 并行加载所有数据
  await Promise.all([
    loadCreateSql(),
    loadColumns(),
    loadIndexes()
  ])
}

// 加载建表语句
async function loadCreateSql() {
  const info = connectionStore.tableManageInfo
  if (!info) return
  
  loading.value.createSql = true
  try {
    const result = await connectionStore.getTableCreateSql(
      info.connectionId,
      info.database,
      info.table
    )
    if (result.success && result.sql) {
      createSql.value = result.sql
    }
  } finally {
    loading.value.createSql = false
  }
}

// 加载列信息
async function loadColumns() {
  const info = connectionStore.tableManageInfo
  if (!info) return
  
  loading.value.columns = true
  try {
    const result = await window.api.database.columns(
      info.connectionId,
      info.database,
      info.table
    )
    if (result.success && result.columns) {
      columns.value = result.columns as ColumnMeta[]
    }
  } finally {
    loading.value.columns = false
  }
}

// 加载索引信息
async function loadIndexes() {
  const info = connectionStore.tableManageInfo
  if (!info) return
  
  loading.value.indexes = true
  try {
    const result = await connectionStore.getTableIndexes(
      info.connectionId,
      info.database,
      info.table
    )
    if (result.success && result.indexes) {
      indexes.value = result.indexes
      // 默认选中第一个索引
      if (indexes.value.length > 0) {
        selectedIndex.value = indexes.value[0]
      }
    }
  } finally {
    loading.value.indexes = false
  }
}

// 选择索引
function selectIndex(index: IndexMeta) {
  selectedIndex.value = index
}

// 获取索引类型标签类型
function getIndexTypeTagType(type: IndexMeta['type']): 'primary' | 'success' | 'warning' | 'info' | 'danger' {
  switch (type) {
    case 'PRIMARY':
      return 'danger'
    case 'UNIQUE':
      return 'warning'
    case 'FULLTEXT':
      return 'info'
    case 'SPATIAL':
      return 'success'
    default:
      // NORMAL 或其他类型使用 primary
      return 'primary'
  }
}

// 关闭对话框
function handleClose() {
  connectionStore.closeTableManageDialog()
}
</script>

<style scoped>
.table-manage-dialog :deep(.el-dialog__body) {
  padding: 10px 20px;
}

.table-tabs {
  min-height: 400px;
}

.sql-container {
  background-color: #1e1e1e;
  border-radius: 4px;
  padding: 12px;
  min-height: 350px;
  max-height: 400px;
  overflow: auto;
}

.sql-content {
  margin: 0;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.5;
  color: #d4d4d4;
  white-space: pre-wrap;
  word-break: break-all;
}

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 40px;
  color: #909399;
}

.columns-table {
  width: 100%;
}

.indexes-container {
  display: flex;
  gap: 16px;
  min-height: 350px;
}

.index-list {
  width: 220px;
  flex-shrink: 0;
  border: 1px solid #4c4d4f;
  border-radius: 4px;
  background-color: #1e1e1e;
  overflow: hidden;
}

.index-list-header,
.index-detail-header {
  padding: 10px 12px;
  font-weight: 500;
  background-color: #2d2d30;
  border-bottom: 1px solid #4c4d4f;
  color: #e0e0e0;
}

.index-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  cursor: pointer;
  border-bottom: 1px solid #3c3c3c;
  transition: background-color 0.2s;
}

.index-item:hover {
  background-color: #2a2d2e;
}

.index-item.active {
  background-color: #094771;
}

.index-name {
  font-size: 13px;
  color: #e0e0e0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.index-detail {
  flex: 1;
  border: 1px solid #4c4d4f;
  border-radius: 4px;
  background-color: #1e1e1e;
  overflow: hidden;
}

.index-columns-table {
  border: none;
}

.no-data,
.no-selection {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #909399;
  font-size: 14px;
}

.dialog-footer {
  text-align: right;
}

/* 深色主题样式覆盖 */
:deep(.el-table) {
  --el-table-bg-color: #1e1e1e;
  --el-table-tr-bg-color: #1e1e1e;
  --el-table-header-bg-color: #2d2d30;
  --el-table-row-hover-bg-color: #2a2d2e;
  --el-table-border-color: #4c4d4f;
  --el-table-text-color: #e0e0e0;
  --el-table-header-text-color: #e0e0e0;
}

/* 斑马纹行背景色 - 使用更深的颜色以便与文字形成对比 */
:deep(.el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell) {
  background-color: #252526;
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
</style>
