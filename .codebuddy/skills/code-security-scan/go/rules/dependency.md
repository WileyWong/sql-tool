# Go 依赖安全检测规则

本文档定义 Go 项目依赖安全检测规则。

## 规则列表

| 规则ID | 规则名称 | 风险等级 | 说明 |
|--------|---------|---------|------|
| GO-DEP-001 | 已知漏洞依赖 | 🔴 严重/🟠 高危 | 依赖存在已知 CVE 漏洞 |
| GO-DEP-002 | 过时 Go 版本 | 🟠 高危 | Go 运行时版本过旧 |
| GO-DEP-003 | 不安全模块源 | 🟠 高危 | 使用非官方代理 |
| GO-DEP-004 | 未验证依赖 | 🟡 中危 | go.sum 不完整 |

---

## GO-DEP-001: 已知漏洞依赖

### 描述
项目依赖的 Go 模块存在已知安全漏洞（CVE）。

### 检测范围

#### go.mod
```go
module example.com/myproject

go 1.21

require (
    golang.org/x/net v0.10.0
    github.com/gin-gonic/gin v1.9.0
)
```

#### go.sum
校验和验证，确保依赖完整性。

### 高危依赖清单

#### 严重漏洞 (必须立即修复)

| 依赖 | 漏洞版本 | CVE | 安全版本 |
|------|---------|-----|---------|
| Go 运行时 | <1.19.8 | CVE-2023-24538 | ≥1.19.8 |
| Go 运行时 | <1.19.10 | CVE-2023-29404 | ≥1.19.10 |

#### 高危漏洞 (本周内修复)

| 依赖 | 漏洞版本 | CVE | 安全版本 |
|------|---------|-----|---------|
| `golang.org/x/net` | <0.17.0 | CVE-2023-39325 | ≥0.17.0 |
| `golang.org/x/net` | <0.7.0 | CVE-2022-41723 | ≥0.7.0 |
| `golang.org/x/net` | <0.4.0 | CVE-2022-41721 | ≥0.4.0 |
| Go 运行时 | <1.19.9 | CVE-2023-29400 | ≥1.19.9 |
| Go 运行时 | <1.20.11 | CVE-2023-45283 | ≥1.20.11 |

#### 中危漏洞

| 依赖 | 漏洞版本 | CVE | 安全版本 |
|------|---------|-----|---------|
| Go 运行时 | <1.20.8 | CVE-2023-39318 | ≥1.20.8 |

### 检测示例

#### 问题代码 (go.mod)
```go
module example.com/myproject

go 1.18

require (
    // ❌ 存在 HTTP/2 DoS 漏洞
    golang.org/x/net v0.5.0
)
```

#### 修复代码
```go
module example.com/myproject

go 1.21

require (
    // ✅ 升级到安全版本
    golang.org/x/net v0.19.0
)
```

### 报告格式

```markdown
## 🟠 GO-DEP-001: 已知漏洞依赖

**文件**: go.mod:8
**依赖**: golang.org/x/net v0.5.0
**漏洞**: CVE-2023-39325 (HTTP/2 Rapid Reset)
**CVSS**: 7.5 (高危)
**风险**: HTTP/2 协议实现存在 DoS 漏洞

**修复建议**:
```bash
go get golang.org/x/net@v0.19.0
go mod tidy
```

**参考**:
- https://nvd.nist.gov/vuln/detail/CVE-2023-39325
- https://pkg.go.dev/vuln/GO-2023-2102
```

---

## GO-DEP-002: 过时 Go 版本

### 描述
项目使用的 Go 版本过旧，可能存在运行时漏洞。

### 检测规则

```yaml
go_versions:
  critical:
    - "< 1.19"  # EOL
  high:
    - "< 1.20"  # 安全更新中
  recommended:
    - ">= 1.21" # 当前稳定版
```

### Go 版本生命周期

| 版本 | 发布日期 | 状态 | 建议 |
|------|---------|------|------|
| 1.18 | 2022-03 | EOL | 立即升级 |
| 1.19 | 2022-08 | EOL | 立即升级 |
| 1.20 | 2023-02 | 安全维护 | 计划升级 |
| 1.21 | 2023-08 | 活跃支持 | 推荐 |
| 1.22 | 2024-02 | 活跃支持 | 推荐 |

### 检测示例

```go
// ❌ 过时版本
module example.com/myproject

go 1.18
```

```go
// ✅ 最新稳定版
module example.com/myproject

go 1.21
```

### 报告格式

```markdown
## 🟠 GO-DEP-002: 过时 Go 版本

**文件**: go.mod:3
**当前版本**: go 1.18
**状态**: EOL (已停止支持)
**风险**: 不再接收安全更新，存在已知漏洞

**修复建议**:
1. 更新 go.mod 中的 Go 版本：
```go
go 1.21
```

2. 升级本地 Go 环境：
```bash
# macOS
brew upgrade go

# Linux
wget https://go.dev/dl/go1.21.5.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.21.5.linux-amd64.tar.gz
```

3. 验证并更新依赖：
```bash
go mod tidy
go build ./...
```
```

---

## GO-DEP-003: 不安全模块源

### 描述
项目配置了非官方或不可信的 Go 模块代理。

### 检测规则

```yaml
trusted_proxies:
  - https://proxy.golang.org
  - https://goproxy.io
  - https://goproxy.cn
  - https://mirrors.aliyun.com/goproxy/

suspicious_patterns:
  - http://  # 非 HTTPS
  - direct   # 直接访问（绕过校验）
  - off      # 禁用代理
```

### 检测文件

- `go.mod` (GOPROXY 环境变量)
- `.envrc`
- `Makefile`
- `Dockerfile`
- CI/CD 配置

### 检测示例

#### 问题配置
```bash
# ❌ 使用 HTTP 协议
export GOPROXY=http://goproxy.example.com

# ❌ 禁用校验
export GOSUMDB=off
export GONOSUMDB=*
```

#### 安全配置
```bash
# ✅ 使用官方代理
export GOPROXY=https://proxy.golang.org,direct
export GOSUMDB=sum.golang.org
```

---

## GO-DEP-004: 未验证依赖

### 描述
go.sum 文件不完整或缺失，无法验证依赖完整性。

### 检测规则

```yaml
check_items:
  - go.sum 文件存在
  - go.sum 包含所有依赖的校验和
  - go.sum 已提交到版本控制
```

### 报告格式

```markdown
## 🟡 GO-DEP-004: 未验证依赖

**问题**: go.sum 文件不完整

**风险**:
- 无法验证依赖完整性
- 可能引入被篡改的依赖
- 构建不可重现

**修复建议**:
```bash
# 重新生成 go.sum
go mod tidy

# 验证依赖
go mod verify

# 提交到版本控制
git add go.sum
git commit -m "chore: update go.sum"
```
```

---

## 检测流程

### 1. 依赖文件识别

```yaml
scan_files:
  - go.mod
  - go.sum
  - **/go.mod
  - **/go.sum
  - vendor/modules.txt
```

### 2. 依赖解析

#### go.mod 解析
```go
// 伪代码
func parseGoMod(content string) []Dependency {
    var deps []Dependency
    
    // 解析 go 版本
    goVersion := parseGoVersion(content)
    
    // 解析 require 块
    requireBlock := extractRequireBlock(content)
    for _, line := range requireBlock {
        // 格式: module/path vX.Y.Z
        parts := strings.Fields(line)
        deps = append(deps, Dependency{
            Path:    parts[0],
            Version: parts[1],
        })
    }
    
    // 解析 replace 指令
    replaces := extractReplaces(content)
    
    return deps
}
```

### 3. 漏洞匹配

```yaml
matching_rules:
  - 模块路径精确匹配
  - semver 版本比较
  - 间接依赖检测
  
data_sources:
  - https://pkg.go.dev/vuln/
  - https://nvd.nist.gov/
  - https://osv.dev/
```

---

## 最佳实践

### 1. 使用 govulncheck

```bash
# 安装
go install golang.org/x/vuln/cmd/govulncheck@latest

# 检查当前项目
govulncheck ./...

# 检查二进制文件
govulncheck -mode=binary ./myapp

# JSON 输出
govulncheck -json ./...
```

### 2. 使用 go mod 命令

```bash
# 检查依赖更新
go list -m -u all

# 更新所有依赖
go get -u ./...

# 更新特定依赖
go get -u golang.org/x/net

# 清理未使用依赖
go mod tidy

# 验证依赖
go mod verify
```

### 3. 使用 Dependabot

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "gomod"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
```

### 4. 使用 Nancy

```bash
# 安装
go install github.com/sonatype-nexus-community/nancy@latest

# 检查
go list -json -deps ./... | nancy sleuth
```

### 5. CI/CD 集成

```yaml
# GitHub Actions
name: Security Scan

on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-go@v5
        with:
          go-version: '1.21'
      
      - name: Run govulncheck
        run: |
          go install golang.org/x/vuln/cmd/govulncheck@latest
          govulncheck ./...
```

### 6. 版本固定策略

```go
// go.mod
module example.com/myproject

go 1.21

require (
    // 使用精确版本
    golang.org/x/net v0.19.0
    github.com/gin-gonic/gin v1.9.1
)

// 必要时使用 replace 固定版本
replace (
    golang.org/x/net => golang.org/x/net v0.19.0
)
```

---

## 参考资源

- [Go Vulnerability Database](https://pkg.go.dev/vuln/)
- [govulncheck](https://pkg.go.dev/golang.org/x/vuln/cmd/govulncheck)
- [Go Security Policy](https://go.dev/security/policy)
- [OSV - Open Source Vulnerabilities](https://osv.dev/)
- [漏洞知识库](../../shared/vulnerability-db.md)

---

**版本**: 1.0.0  
**更新时间**: 2025-12-22
