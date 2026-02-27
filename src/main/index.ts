import { app, BrowserWindow, ipcMain, nativeTheme } from 'electron'
import { join } from 'path'
import { setupConnectionHandlers } from './ipc/connection'
import { setupDatabaseHandlers } from './ipc/database'
import { setupQueryHandlers } from './ipc/query'
import { setupSessionHandlers } from './ipc/session'
import { setupFileHandlers } from './ipc/file'
import { initSqlLanguageServer } from './sql-language-server'
import { createApplicationMenu, updateRecentFilesMenu, setupI18nIpc } from './menu'
import { initI18n } from './i18n'
import { IpcChannels } from '@shared/constants'
import { initializeDrivers, cleanupDrivers, cleanupSessionsSync } from './database/init'
import { DriverFactory } from './database/core/factory'

// 禁用硬件加速（解决某些系统上的渲染问题）
app.disableHardwareAcceleration()

let mainWindow: BrowserWindow | null = null
let forceClose = false

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    backgroundColor: '#2d2d2d', // Node.js 上下文，无法使用 CSS 变量，需与 --bg-surface 保持一致
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    },
    show: false
  })

  // 开发环境加载 Vite 开发服务器
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools()
  } else {
    // 生产环境加载打包后的文件
    mainWindow.loadFile(join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
    // 创建应用程序菜单
    if (mainWindow) {
      createApplicationMenu(mainWindow)
    }
  })

  // 拦截窗口关闭，通知渲染进程检查未保存内容
  mainWindow.on('close', (e) => {
    if (!forceClose && mainWindow) {
      e.preventDefault()
      mainWindow.webContents.send(IpcChannels.WINDOW_BEFORE_CLOSE)
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // 渲染进程崩溃时清理所有会话
  mainWindow.webContents.on('render-process-gone', async (_event, details) => {
    console.error('[Main] Renderer process gone:', details.reason)
    const sessionTypes = DriverFactory.getRegisteredSessionTypes()
    for (const type of sessionTypes) {
      try {
        const sessionManager = DriverFactory.getSessionManager(type)
        await sessionManager.destroyAllSessions()
      } catch {
        // 忽略
      }
    }
  })
}

// 设置 IPC 处理器
function setupIpcHandlers() {
  setupConnectionHandlers(ipcMain)
  setupDatabaseHandlers(ipcMain)
  setupQueryHandlers(ipcMain)
  setupSessionHandlers(ipcMain)
  setupFileHandlers(ipcMain)
  
  // 设置国际化相关 IPC
  setupI18nIpc()
  
  // 窗口关闭确认
  ipcMain.on(IpcChannels.WINDOW_CLOSE_CONFIRMED, () => {
    forceClose = true
    mainWindow?.close()
  })
  
  // 更新最近文件菜单
  ipcMain.handle(IpcChannels.MENU_UPDATE_RECENT_FILES, (_, files: string[]) => {
    updateRecentFilesMenu(files)
  })
  
  // 初始化 SQL Language Server
  initSqlLanguageServer()
}

app.whenReady().then(() => {
  // 强制使用深色主题（原生菜单、标题栏等）
  nativeTheme.themeSource = 'dark'
  
  // 初始化国际化
  initI18n()
  
  // 初始化数据库驱动
  initializeDrivers()
  
  setupIpcHandlers()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 应用程序退出前清理
app.on('before-quit', async () => {
  await cleanupDrivers()
})

// 未捕获异常：同步清理连接后退出
process.on('uncaughtException', (err) => {
  console.error('[Main] Uncaught exception, cleaning up connections...', err)
  cleanupSessionsSync()
  process.exit(1)
})
