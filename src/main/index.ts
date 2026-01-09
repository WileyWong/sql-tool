import { app, BrowserWindow, ipcMain, Menu } from 'electron'
import { join } from 'path'
import { setupConnectionHandlers } from './ipc/connection'
import { setupDatabaseHandlers } from './ipc/database'
import { setupQueryHandlers } from './ipc/query'
import { setupFileHandlers } from './ipc/file'
import { initSqlLanguageServer } from './sql-language-server'
import { IpcChannels } from '@shared/constants'

// 禁用硬件加速（解决某些系统上的渲染问题）
app.disableHardwareAcceleration()

let mainWindow: BrowserWindow | null = null
let forceClose = false

function createWindow() {
  // 隐藏 Electron 默认菜单
  Menu.setApplicationMenu(null)
  
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
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
}

// 设置 IPC 处理器
function setupIpcHandlers() {
  setupConnectionHandlers(ipcMain)
  setupDatabaseHandlers(ipcMain)
  setupQueryHandlers(ipcMain)
  setupFileHandlers(ipcMain)
  
  // 窗口关闭确认
  ipcMain.on(IpcChannels.WINDOW_CLOSE_CONFIRMED, () => {
    forceClose = true
    mainWindow?.close()
  })
  
  // 初始化 SQL Language Server
  initSqlLanguageServer()
}

app.whenReady().then(() => {
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
