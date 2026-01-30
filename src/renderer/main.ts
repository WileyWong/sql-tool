import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import './styles/index.css'
import i18n, { syncLocaleFromMain } from './i18n'

// 先同步语言设置，再挂载应用，避免第一个标签页标题使用错误的语言
syncLocaleFromMain().then(() => {
  const app = createApp(App)

  app.use(createPinia())
  app.use(i18n)
  app.use(ElementPlus)

  app.mount('#app')
})
