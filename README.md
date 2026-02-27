# SQL Tool

English | [中文](./README_CN.md)

A MySQL & SQL Server database client tool built with Electron + Vue 3.

The Mac and Windows versions of the application can be downloaded and used directly from the release directory.

Fully developed with AI assistance. I created this because existing database management tools always had some aspects I wasn't satisfied with. It will continue to be optimized as issues are discovered during use.

The AI-assisted requirement documents are also included in the repository. They may not be perfect, but hopefully they're helpful.

## Screenshot

![SQL Tool Screenshot](./screenshots/17696720892673.png)

## Features

### Database Connection Management
- Create, edit, and delete MySQL / SQL Server database connections
- Connection credentials stored locally with AES encryption
- Tree view displaying databases, tables, views, columns, etc.
- Double-click to switch current database
- Right-click context menu for refreshing nodes

### SQL Editor
- Professional SQL editor powered by Monaco Editor
- **Auto-completion**: Real-time suggestions for keywords, table names, column names, functions, etc.
- **Syntax Checking**: SQL syntax error detection with red squiggly underlines + hover tooltips
- **Code Formatting**: `Shift+Alt+F` shortcut, uppercase keywords, auto-indentation
- **Hover Information**: Mouse hover displays detailed information for tables, columns, and functions
- Multi-tab management for editing multiple SQL files simultaneously
- `Ctrl+S` shortcut to save current query

### SQL Execution
- Execute selected SQL or entire editor content
- Batch execution of multiple statements, stops on first error
- Stop running queries (sends KILL QUERY for MySQL)
- Default timeout: 10 minutes
- Configurable maximum result set rows (default: 5000)

### Query Results
- Multiple result sets displayed in tabs
- Cell editing support (for single-table queries with primary key)
- Export functionality: CSV, JSON, Excel formats
- Message panel shows affected rows for non-SELECT statements

### Execution Plan
- MySQL: EXPLAIN format with flowchart visualization and table view
- SQL Server: SHOWPLAN_XML with interactive tree view, cost analysis, and virtual scrolling

## Tech Stack

- **Frontend Framework**: Vue 3 + TypeScript
- **Desktop Framework**: Electron 28
- **UI Components**: Element Plus
- **Code Editor**: Monaco Editor + monaco-languageclient
- **SQL Parsing**: node-sql-parser
- **SQL Formatting**: sql-formatter
- **Database Drivers**: mysql2, mssql
- **XML Parsing**: fast-xml-parser
- **Virtual Scrolling**: @tanstack/vue-virtual
- **Build Tools**: Vite + electron-builder

## Development

### Requirements
- Node.js >= 18
- npm >= 9

### Install Dependencies
```bash
npm install
```

### Development Mode
```bash
npm run dev
```

### Build
```bash
npm run build
```

## Packaging & Release

### Windows
```bash
# Package for Windows (x64 + arm64)
npm run pack:win

# Package x64 only
npm run pack:win:x64

# Package arm64 only
npm run pack:win:arm64
```

Output:
- `release/SQL Tool Setup x.x.x.exe` - NSIS installer
- `release/SQL Tool x.x.x.exe` - Portable version

### macOS
```bash
# Package for macOS (x64 + arm64)
npm run pack:mac

# Package x64 only (Intel Mac)
npm run pack:mac:x64

# Package arm64 only (Apple Silicon)
npm run pack:mac:arm64
```

Output:
- `release/SQL Tool-x.x.x.dmg` - DMG installer

### Linux
```bash
# Package for Linux (x64 + arm64)
npm run pack:linux

# Package x64 only
npm run pack:linux:x64

# Package arm64 only
npm run pack:linux:arm64
```

Output:
- `release/SQL Tool-x.x.x.AppImage` - AppImage format
- `release/sql-tool_x.x.x_amd64.deb` - Debian package

## Project Structure

```
sql-tool/
├── src/
│   ├── main/                  # Electron main process
│   │   ├── index.ts           # Main process entry
│   │   ├── database/          # Database management
│   │   │   ├── core/          # Shared database abstractions
│   │   │   ├── mysql/         # MySQL session & metadata
│   │   │   └── sqlserver/     # SQL Server session & metadata
│   │   ├── ipc/               # IPC handlers
│   │   ├── services/          # Business services
│   │   ├── sql-language-server/ # SQL Language Server
│   │   └── storage/           # Local storage
│   ├── preload/               # Preload scripts
│   ├── renderer/              # Renderer process (Vue app)
│   │   ├── components/        # Vue components
│   │   │   └── explain/       # Execution plan components
│   │   ├── composables/       # Composable functions
│   │   ├── stores/            # Pinia state management
│   │   └── i18n/              # Internationalization
│   └── shared/                # Shared types & utilities
├── resources/                 # Application resources
├── requirements/              # Requirement documents
└── release/                   # Build output directory
```

## Changelog

2025-02-27
- Added MSSQL database support (not fully tested)
- Optimized editor connection pool
- Fixed various interaction issues

## License

MIT
