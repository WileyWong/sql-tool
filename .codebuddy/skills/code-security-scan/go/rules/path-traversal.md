# Go 路径遍历检测规则

## 规则概述

| 规则ID | GO-003 |
|--------|--------|
| 名称 | 路径遍历 |
| 风险等级 | 🔴 严重 |
| CWE | CWE-22 |

---

## 检测模式

### 1. 文件读取路径遍历

**危险模式**:
```go
// ❌ 危险：直接使用用户输入作为文件路径
os.ReadFile(userInput)
os.Open(userInput)
ioutil.ReadFile(userInput)
os.OpenFile(filepath.Join(baseDir, userInput), os.O_RDONLY, 0644)
```

**检测正则**:
```regex
os\.(ReadFile|Open|OpenFile|Create)\s*\([^"'][a-zA-Z]
ioutil\.(ReadFile|WriteFile)\s*\([^"'][a-zA-Z]
filepath\.Join\s*\(.*?,\s*[^"'][a-zA-Z].*?\)
```

---

### 2. 文件写入路径遍历

**危险模式**:
```go
// ❌ 危险：用户控制写入路径
os.WriteFile(userInput, data, 0644)
os.Create(userInput)
f, _ := os.OpenFile(userInput, os.O_WRONLY|os.O_CREATE, 0644)
```

---

### 3. http.ServeFile 不安全使用

**危险模式**:
```go
// ❌ 危险：直接使用请求参数
func handler(w http.ResponseWriter, r *http.Request) {
    filename := r.URL.Query().Get("file")
    http.ServeFile(w, r, filename)
}
```

**检测正则**:
```regex
http\.ServeFile\s*\(.*?,.*?,\s*[^"'][a-zA-Z]
```

---

## 修复建议

### 1. 路径规范化和验证

```go
// 安全的文件访问函数
func safeReadFile(baseDir, userInput string) ([]byte, error) {
    // 清理路径
    cleaned := filepath.Clean(userInput)
    
    // 拒绝绝对路径
    if filepath.IsAbs(cleaned) {
        return nil, errors.New("absolute path not allowed")
    }
    
    // 拒绝 .. 路径
    if strings.Contains(cleaned, "..") {
        return nil, errors.New("path traversal detected")
    }
    
    // 构建完整路径
    fullPath := filepath.Join(baseDir, cleaned)
    
    // 验证路径在基础目录内
    absBase, _ := filepath.Abs(baseDir)
    absPath, _ := filepath.Abs(fullPath)
    if !strings.HasPrefix(absPath, absBase) {
        return nil, errors.New("path outside base directory")
    }
    
    return os.ReadFile(fullPath)
}
```

### 2. 白名单验证

```go
// 文件名白名单
func validateFilename(name string) bool {
    // 只允许字母数字和特定字符
    matched, _ := regexp.MatchString(`^[a-zA-Z0-9_\-\.]+$`, name)
    if !matched {
        return false
    }
    
    // 检查扩展名白名单
    allowedExt := map[string]bool{".txt": true, ".pdf": true, ".jpg": true}
    ext := filepath.Ext(name)
    return allowedExt[ext]
}
```

### 3. 使用 http.FileServer 的安全配置

```go
// 安全的静态文件服务
func safeFileServer(dir string) http.Handler {
    fs := http.FileServer(http.Dir(dir))
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        // 清理路径
        r.URL.Path = filepath.Clean(r.URL.Path)
        
        // 拒绝隐藏文件
        if strings.Contains(r.URL.Path, "/.") {
            http.NotFound(w, r)
            return
        }
        
        fs.ServeHTTP(w, r)
    })
}
```

---

## 参考资源

- [OWASP Path Traversal](https://owasp.org/www-community/attacks/Path_Traversal)
- [Go filepath 文档](https://pkg.go.dev/path/filepath)
