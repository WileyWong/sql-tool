import { Menu, BrowserWindow, app, dialog, MenuItemConstructorOptions, ipcMain } from 'electron'
import { IpcChannels } from '@shared/constants'
import { t, setLocale, getLocale, type SupportedLocale } from './i18n'

let mainWindow: BrowserWindow | null = null
let recentFiles: string[] = []

const isMac = process.platform === 'darwin'

/**
 * 获取最近文件子菜单
 */
function getRecentFilesSubmenu(): MenuItemConstructorOptions[] {
  if (recentFiles.length === 0) {
    return [{ label: t('menu.noRecentFiles'), enabled: false }]
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
        { label: t('menu.aboutApp'), click: showAboutDialog },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit', label: t('menu.exit') }
      ]
    })
  }
  
  // 文件菜单
  template.push({
    label: t('menu.file'),
    submenu: [
      {
        label: t('menu.newConnection'),
        accelerator: 'CmdOrCtrl+N',
        click: () => mainWindow?.webContents.send(IpcChannels.MENU_NEW_CONNECTION)
      },
      {
        label: t('menu.newQuery'),
        accelerator: 'CmdOrCtrl+T',
        click: () => mainWindow?.webContents.send(IpcChannels.MENU_NEW_QUERY)
      },
      { type: 'separator' },
      {
        label: t('menu.recentFiles'),
        submenu: getRecentFilesSubmenu()
      },
      { type: 'separator' },
      {
        label: t('menu.openFile'),
        accelerator: 'CmdOrCtrl+O',
        click: () => mainWindow?.webContents.send(IpcChannels.MENU_OPEN_FILE)
      },
      {
        label: t('menu.save'),
        accelerator: 'CmdOrCtrl+S',
        click: () => mainWindow?.webContents.send(IpcChannels.MENU_SAVE)
      },
      {
        label: t('menu.saveAs'),
        accelerator: 'CmdOrCtrl+Shift+S',
        click: () => mainWindow?.webContents.send(IpcChannels.MENU_SAVE_AS)
      },
      { type: 'separator' },
      {
        label: t('menu.settings'),
        click: () => mainWindow?.webContents.send(IpcChannels.MENU_OPEN_SETTINGS)
      },
      { type: 'separator' },
      isMac
        ? { role: 'close', label: t('menu.closeWindow') }
        : { label: t('menu.exit'), accelerator: 'Alt+F4', role: 'quit' }
    ]
  })
  
  // 编辑菜单
  template.push({
    label: t('menu.edit'),
    submenu: [
      { label: t('menu.undo'), accelerator: 'CmdOrCtrl+Z', role: 'undo' },
      { label: t('menu.redo'), accelerator: isMac ? 'Cmd+Shift+Z' : 'Ctrl+Y', role: 'redo' },
      { type: 'separator' },
      { label: t('menu.cut'), accelerator: 'CmdOrCtrl+X', role: 'cut' },
      { label: t('menu.copy'), accelerator: 'CmdOrCtrl+C', role: 'copy' },
      { label: t('menu.paste'), accelerator: 'CmdOrCtrl+V', role: 'paste' }
    ]
  })
  
  // 帮助菜单
  template.push({
    label: t('menu.help'),
    submenu: [
      // macOS 的关于在应用程序菜单中，Windows/Linux 在帮助菜单
      ...(isMac ? [] : [{ label: t('menu.about'), click: showAboutDialog }])
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
    title: t('dialog.about.title'),
    message: t('dialog.about.message'),
    detail: `${t('dialog.about.version')}: ${app.getVersion()}`
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

/**
 * 更新菜单语言并重建菜单
 */
export function updateMenuLocale(locale: SupportedLocale): void {
  setLocale(locale)
  const menu = Menu.buildFromTemplate(buildMenuTemplate())
  Menu.setApplicationMenu(menu)
}

/**
 * 设置国际化相关的 IPC 处理
 */
export function setupI18nIpc(): void {
  // 语言切换
  ipcMain.handle(IpcChannels.LOCALE_CHANGED, (_event, locale: string) => {
    updateMenuLocale(locale as SupportedLocale)
  })
  
  // 获取当前保存的语言
  ipcMain.handle(IpcChannels.LOCALE_GET, () => {
    return getLocale()
  })
}
