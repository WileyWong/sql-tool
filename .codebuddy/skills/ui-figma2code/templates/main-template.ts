import { createApp } from 'vue'
import TDesign from 'tdesign-vue-next'
import 'tdesign-vue-next/es/style/index.css'

import App from './App.vue'
import router from './router'

// 导入全局样式
import '@/assets/styles/global.less'

const app = createApp(App)

// 使用 TDesign
app.use(TDesign)

// 使用路由
app.use(router)

// 挂载应用
app.mount('#app')