# Go 命令注入检测规则

## 规则概述

| 规则ID | GO-002 |
|--------|--------|
| 名称 | 命令注入 |
| 风险等级 | 🔴 严重 |
| CWE | CWE-78 |

---

## 检测模式

### 1. os/exec 不安全使用

**危险模式**:
```go
// ❌ 危险：用户输入直接传入命令
cmd := exec.Command("sh", "-c", userInput)
cmd := exec.Command(userInput)
cmd := exec.Command("bash", "-c", "echo " + userInput)
```

**检测正则**:
```regex
exec\.Command\s*\(\s*["'](sh|bash|cmd|powershell)["']\s*,\s*["']-c["']\s*,.*?\+
exec\.Command\s*\(\s*[^"'][a-zA-Z]
exec\.Command\s*\(\s*fmt\.Sprintf
```

**安全写法**:
```go
// ✅ 安全：使用参数列表，不使用 shell
cmd := exec.Command("ls", "-la", sanitizedPath)

// ✅ 安全：白名单验证
allowedCommands := map[string]bool{"ls": true, "cat": true}
if !allowedCommands[command] {
    return errors.New("command not allowed")
}
cmd := exec.Command(command, args...)
```

---

### 2. syscall 危险调用

**危险模式**:
```go
// ❌ 危险：直接执行系统调用
syscall.Exec(userInput, args, env)
syscall.ForkExec(userInput, args, attr)
```

**检测正则**:
```regex
syscall\.(Exec|ForkExec)\s*\([^"']
```

---

### 3. os.StartProcess 不安全使用

**危险模式**:
```go
// ❌ 危险：用户输入作为程序路径
os.StartProcess(userInput, args, attr)
```

**检测正则**:
```regex
os\.StartProcess\s*\([^"']
```

---

## 修复建议

### 1. 避免使用 shell

```go
// 修复前：使用 shell 执行
cmd := exec.Command("sh", "-c", "cat " + filename)

// 修复后：直接调用程序
cmd := exec.Command("cat", filename)
```

### 2. 输入验证

```go
// 白名单验证
func validateFilename(name string) bool {
    matched, _ := regexp.MatchString(`^[a-zA-Z0-9_\-\.]+$`, name)
    return matched
}

// 路径规范化
func safePath(base, userInput string) (string, error) {
    cleaned := filepath.Clean(userInput)
    fullPath := filepath.Join(base, cleaned)
    if !strings.HasPrefix(fullPath, base) {
        return "", errors.New("path traversal detected")
    }
    return fullPath, nil
}
```

### 3. 使用安全的替代方案

```go
// 替代 shell 命令的 Go 原生实现
// 代替 "cat file"
content, err := os.ReadFile(filename)

// 代替 "ls dir"
entries, err := os.ReadDir(dirname)

// 代替 "rm file"
err := os.Remove(filename)
```

---

## 参考资源

- [OWASP Command Injection](https://owasp.org/www-community/attacks/Command_Injection)
- [Go os/exec 文档](https://pkg.go.dev/os/exec)
