/**
 * 主进程繁体中文语言包（菜单和对话框）
 */
export default {
  menu: {
    file: '檔案(&F)',
    edit: '編輯(&E)',
    help: '說明(&H)',
    newConnection: '新建連線',
    newQuery: '新建查詢',
    openFile: '開啟檔案',
    save: '儲存',
    saveAs: '另存新檔',
    recentFiles: '最近開啟的檔案',
    noRecentFiles: '(無)',
    settings: '設定',
    exit: '結束',
    closeWindow: '關閉視窗',
    about: '關於',
    aboutApp: '關於 SQL Tool',
    undo: '復原',
    redo: '重做',
    cut: '剪下',
    copy: '複製',
    paste: '貼上'
  },
  dialog: {
    about: {
      title: '關於 SQL Tool',
      message: 'SQL Tool',
      version: '版本'
    }
  },
  result: {
    rowAffected: '影響 {count} 列',
    rowsAffected: '影響 {count} 列',
    querySuccess: '查詢成功，影響 {count} 列'
  },
  hover: {
    table: '表',
    view: '檢視',
    column: '欄位',
    function: '函數',
    description: '說明',
    columnCount: '欄位數',
    columnList: '欄位列表',
    type: '類型',
    nullable: '可空',
    nullableYes: '是',
    nullableNo: '否',
    primaryKey: '主鍵',
    primaryKeyYes: '是',
    defaultValue: '預設值',
    fromTable: '來自表',
    syntax: '語法',
    returnType: '回傳類型',
    selectAll: '通配符',
    quickActions: '快捷操作',
    actionExpandStar: '列出所有欄位',
    actionExpandStarDesc: '將 * 替換為所有欄位',
    actionFromUnixtime: 'FROM_UNIXTIME 轉成時間',
    actionFromUnixtimeDesc: '轉換為 FROM_UNIXTIME'
  }
}
