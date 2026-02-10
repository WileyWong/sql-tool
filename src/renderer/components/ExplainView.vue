<template>
  <div class="explain-view">
    <ExplainViewMysql v-if="data.databaseType === 'mysql'" :data="data" />
    <ExplainViewSqlServer v-else-if="data.databaseType === 'sqlserver'" :data="data" />
    <div v-else class="unsupported">
      不支持的数据库类型
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ExplainResult } from '@shared/types'
import ExplainViewMysql from './explain/ExplainViewMysql.vue'
import ExplainViewSqlServer from './explain/ExplainViewSqlServer.vue'

defineProps<{
  data: ExplainResult
}>()
</script>

<style scoped>
.explain-view {
  height: 100%;
}

.unsupported {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #858585;
  font-size: 14px;
}
</style>
