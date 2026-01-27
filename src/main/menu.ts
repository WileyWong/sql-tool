import { Menu, BrowserWindow, app, dialog, MenuItemConstructorOptions } from 'electron'
import { IpcChannels } from '@shared/constants'

let mainWindow: BrowserWindow | null = null
let recentFiles: string[] = []

const isMac = process.platform === 'darwin'

/**
 * 获取最近文件子菜单
 */
function getRecentFilesSubmenu(): MenuItemConstructorOptions[] {
  if (recentFiles.length === 0) {
    return [{ label: '(无)', enabled: false }]
  }
  
  // 最多显示10个
  const files = recentFiles.slice(0, 10)
  return files.map(filePath => ({
    label: filePath,
    click: () => {
      mainWindow?.webContents.send(IpcChannels.MENU_OPEN_RECENT, filePath)
    }
  }))
}

/**
 * 构建菜单模板
 */
function buildMenuTemplate(): MenuItemConstructorOptions[] {
  const template: MenuItemConstructorOptions[] = []
  
  // macOS 应用程序菜单
  if (isMac) {
    template.push({
      label: app.name,
      submenu: [
        { label: '关于 SQL Tool', click: showAboutDialog },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit', label: '退出' }
      ]
    })
  }
  
  // 文件菜单
  template.push({
    label: '文件(&F)',
    submenu: [
      {
        label: '新建连接',
        accelerator: 'CmdOrCtrl+N',
        click: () => mainWindow?.webContents.send(IpcChannels.MENU_NEW_CONNECTION)
      },
      {
        label: '新建查询',
        accelerator: 'CmdOrCtrl+T',
        click: () => mainWindow?.webContents.send(IpcChannels.MENU_NEW_QUERY)
      },
      { type: 'separator' },
      {
        label: '最近打开的文件',
        submenu: getRecentFilesSubmenu()
      },
      { type: 'separator' },
      {
        label: '打开文件',
        accelerator: 'CmdOrCtrl+O',
        click: () => mainWindow?.webContents.send(IpcChannels.MENU_OPEN_FILE)
      },
      {
        label: '保存',
        accelerator: 'CmdOrCtrl+S',
        click: () => mainWindow?.webContents.send(IpcChannels.MENU_SAVE)
      },
      {
        label: '另存为',
        accelerator: 'CmdOrCtrl+Shift+S',
        click: () => mainWindow?.webContents.send(IpcChannels.MENU_SAVE_AS)
      },
      { type: 'separator' },
      isMac
        ? { role: 'close', label: '关闭窗口' }
        : { label: '退出', accelerator: 'Alt+F4', role: 'quit' }
    ]
  })
  
  // 编辑菜单
  template.push({
    label: '编辑(&E)',
    submenu: [
      { label: '撤销', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
      { label: '重做', accelerator: isMac ? 'Cmd+Shift+Z' : 'Ctrl+Y', role: 'redo' },
      { type: 'separator' },
      { label: '剪切', accelerator: 'CmdOrCtrl+X', role: 'cut' },
      { label: '复制', accelerator: 'CmdOrCtrl+C', role: 'copy' },
      { label: '粘贴', accelerator: 'CmdOrCtrl+V', role: 'paste' }
    ]
  })
  
  // 帮助菜单
  template.push({
    label: '帮助(&H)',
    submenu: [
      // macOS 的关于在应用程序菜单中，Windows/Linux 在帮助菜单
      ...(isMac ? [] : [{ label: '关于', click: showAboutDialog }])
    ]
  })
  
  return template
}

/**
 * 显示关于对话框
 */
function showAboutDialog() {
  if (!mainWindow) return
  
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: '关于 SQL Tool',
    message: 'SQL Tool',
    detail: `版本: ${app.getVersion()}`
  })
}

/**
 * 创建应用程序菜单
 */
export function createApplicationMenu(window: BrowserWindow): void {
  mainWindow = window
  const menu = Menu.buildFromTemplate(buildMenuTemplate())
  Menu.setApplicationMenu(menu)
}

/**
 * 更新最近文件菜单
 */
export function updateRecentFilesMenu(files: string[]): void {
  recentFiles = files.slice(0, 10)
  const menu = Menu.buildFromTemplate(buildMenuTemplate())
  Menu.setApplicationMenu(menu)
}
