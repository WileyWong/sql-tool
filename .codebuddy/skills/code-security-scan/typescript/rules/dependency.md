# TypeScript/JavaScript 依赖安全检测规则

本文档定义 TypeScript/JavaScript 项目依赖安全检测规则。

## 规则列表

| 规则ID | 规则名称 | 风险等级 | 说明 |
|--------|---------|---------|------|
| TS-DEP-001 | 已知漏洞依赖 | 🔴 严重/🟠 高危 | 依赖存在已知 CVE 漏洞 |
| TS-DEP-002 | 过时依赖版本 | 🟡 中危 | 依赖版本过旧 |
| TS-DEP-003 | 不安全依赖源 | 🟠 高危 | 使用非官方 npm 源 |
| TS-DEP-004 | 未锁定版本 | 🟡 中危 | 缺少 lock 文件 |

---

## TS-DEP-001: 已知漏洞依赖

### 描述
项目依赖的 npm 包存在已知安全漏洞（CVE）。

### 检测范围

#### package.json
```json
{
  "dependencies": {
    "package": "version"
  },
  "devDependencies": {
    "package": "version"
  }
}
```

#### package-lock.json / yarn.lock / pnpm-lock.yaml
完整依赖树分析，包括传递依赖。

### 高危依赖清单

#### 严重漏洞 (必须立即修复)

| 依赖 | 漏洞版本 | CVE | 安全版本 |
|------|---------|-----|---------|
| `minimist` | <1.2.6 | CVE-2021-44906 | ≥1.2.6 |
| `json5` | <2.2.2 | CVE-2022-46175 | ≥2.2.2 |
| `loader-utils` | <2.0.4 | CVE-2022-37601 | ≥2.0.4 |

#### 高危漏洞 (本周内修复)

| 依赖 | 漏洞版本 | CVE | 安全版本 |
|------|---------|-----|---------|
| `@babel/traverse` | <7.23.2 | CVE-2023-45133 | ≥7.23.2 |
| `tough-cookie` | <4.1.3 | CVE-2023-26136 | ≥4.1.3 |
| `word-wrap` | <1.2.4 | CVE-2023-26115 | ≥1.2.4 |
| `semver` | <7.5.2 | CVE-2022-25883 | ≥7.5.2 |
| `ip` | <2.0.1 | CVE-2023-42282 | ≥2.0.1 |
| `qs` | <6.10.3 | CVE-2022-24999 | ≥6.10.3 |
| `lodash` | <4.17.21 | CVE-2021-23337 | ≥4.17.21 |
| `ansi-regex` | <6.0.1 | CVE-2021-3807 | ≥6.0.1 |
| `postcss` | <8.4.31 | CVE-2023-44270 | ≥8.4.31 |
| `follow-redirects` | <1.15.4 | CVE-2023-26159 | ≥1.15.4 |

#### 中危漏洞

| 依赖 | 漏洞版本 | CVE | 安全版本 |
|------|---------|-----|---------|
| `axios` | <1.6.0 | CVE-2023-45857 | ≥1.6.0 |

### 检测示例

#### 问题代码 (package.json)
```json
{
  "dependencies": {
    "minimist": "^1.2.0",
    "lodash": "^4.17.15",
    "axios": "^0.21.0",
    "follow-redirects": "^1.14.0"
  }
}
```

#### 修复代码
```json
{
  "dependencies": {
    "minimist": "^1.2.8",
    "lodash": "^4.17.21",
    "axios": "^1.6.2",
    "follow-redirects": "^1.15.4"
  }
}
```

### 报告格式

```markdown
## 🔴 TS-DEP-001: 已知漏洞依赖

**文件**: package.json
**依赖**: minimist@1.2.0
**漏洞**: CVE-2021-44906 (Prototype Pollution)
**CVSS**: 9.8 (严重)
**风险**: 原型污染可导致任意代码执行

**修复建议**:
```bash
npm install minimist@>=1.2.6
# 或
npm audit fix
```

**参考**:
- https://nvd.nist.gov/vuln/detail/CVE-2021-44906
```

---

## TS-DEP-002: 过时依赖版本

### 描述
依赖版本过旧，可能存在未公开的安全风险。

### 检测规则

```yaml
outdated_threshold:
  critical: 3 years
  warning: 2 years
  
check_items:
  - 主版本落后 2 个以上
  - 最后更新超过 2 年
  - 官方已声明废弃
```

### 常见过时依赖

| 依赖 | 过时版本 | 状态 | 建议 |
|------|---------|------|------|
| `node` | <16 | EOL | 迁移到 Node.js 18/20 |
| `react` | <16 | 维护模式 | 迁移到 React 18 |
| `vue` | <2.7 | 维护模式 | 迁移到 Vue 3 |
| `angular` | <14 | EOL | 迁移到最新 LTS |
| `webpack` | <4 | 维护模式 | 迁移到 Webpack 5 |
| `babel` | <7 | EOL | 迁移到 Babel 7 |
| `request` | 全部 | 废弃 | 迁移到 axios/node-fetch |
| `moment` | 全部 | 维护模式 | 迁移到 dayjs/date-fns |

### 检测示例

```json
// ❌ 过时依赖
{
  "dependencies": {
    "request": "^2.88.2",
    "moment": "^2.29.4"
  }
}
```

```json
// ✅ 现代替代
{
  "dependencies": {
    "axios": "^1.6.2",
    "dayjs": "^1.11.10"
  }
}
```

---

## TS-DEP-003: 不安全依赖源

### 描述
项目配置了非官方或不可信的 npm 源。

### 检测规则

```yaml
trusted_registries:
  - https://registry.npmjs.org/
  - https://registry.npmmirror.com/
  - https://registry.npm.taobao.org/

suspicious_patterns:
  - http://  # 非 HTTPS
  - 私有 IP 地址
  - 未知域名
```

### 检测文件

- `.npmrc`
- `.yarnrc`
- `.yarnrc.yml`
- `package.json` (publishConfig)

### 检测示例

#### 问题配置 (.npmrc)
```ini
# ❌ 使用 HTTP 协议
registry=http://npm.example.com/
```

#### 安全配置
```ini
# ✅ 使用 HTTPS 和可信源
registry=https://registry.npmjs.org/
```

---

## TS-DEP-004: 未锁定版本

### 描述
项目缺少 lock 文件，可能导致构建不可重现。

### 检测规则

```yaml
lock_files:
  npm: package-lock.json
  yarn: yarn.lock
  pnpm: pnpm-lock.yaml
  
check_items:
  - lock 文件存在
  - lock 文件与 package.json 同步
  - lock 文件已提交到版本控制
```

### 报告格式

```markdown
## 🟡 TS-DEP-004: 未锁定版本

**问题**: 项目缺少 package-lock.json

**风险**:
- 构建不可重现
- 不同环境可能安装不同版本
- 可能引入有漏洞的新版本

**修复建议**:
```bash
# npm
npm install
git add package-lock.json

# yarn
yarn install
git add yarn.lock

# pnpm
pnpm install
git add pnpm-lock.yaml
```
```

---

## 检测流程

### 1. 依赖文件识别

```yaml
scan_files:
  - package.json
  - **/package.json
  - package-lock.json
  - yarn.lock
  - pnpm-lock.yaml
  - .npmrc
  - .yarnrc
  - .yarnrc.yml
```

### 2. 依赖解析

#### package.json 解析
```javascript
// 伪代码
function parsePackageJson(content) {
  const pkg = JSON.parse(content);
  const dependencies = [];
  
  // 合并所有依赖类型
  const allDeps = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
    ...pkg.peerDependencies,
    ...pkg.optionalDependencies
  };
  
  for (const [name, version] of Object.entries(allDeps)) {
    dependencies.push({
      name,
      version: parseVersion(version),
      type: getDependencyType(name, pkg)
    });
  }
  
  return dependencies;
}
```

#### 版本解析
```javascript
// npm semver 版本格式
const versionPatterns = {
  exact: /^\d+\.\d+\.\d+$/,           // 1.2.3
  caret: /^\^(\d+\.\d+\.\d+)$/,       // ^1.2.3
  tilde: /^~(\d+\.\d+\.\d+)$/,        // ~1.2.3
  range: /^>=?\d+.*<=?\d+/,           // >=1.0.0 <2.0.0
  latest: /^latest$/,                  // latest
  tag: /^[a-z]+$/                      // next, beta
};
```

### 3. 漏洞匹配

```yaml
matching_rules:
  - 包名精确匹配
  - semver 版本范围匹配
  - 传递依赖检测
  
severity_mapping:
  cvss >= 9.0: critical
  cvss >= 7.0: high
  cvss >= 4.0: medium
  cvss < 4.0: low
```

---

## 最佳实践

### 1. 使用 npm audit

```bash
# 检查漏洞
npm audit

# 自动修复
npm audit fix

# 强制修复（可能破坏兼容性）
npm audit fix --force

# 生成报告
npm audit --json > audit-report.json
```

### 2. 使用 yarn audit

```bash
# 检查漏洞
yarn audit

# 交互式修复
yarn upgrade-interactive
```

### 3. 使用 pnpm audit

```bash
# 检查漏洞
pnpm audit

# 修复
pnpm audit --fix
```

### 4. 配置 Dependabot

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    groups:
      production-dependencies:
        dependency-type: "production"
      development-dependencies:
        dependency-type: "development"
```

### 5. 使用 Snyk

```bash
# 安装
npm install -g snyk

# 认证
snyk auth

# 测试
snyk test

# 监控
snyk monitor
```

### 6. 版本管理策略

```json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  },
  "overrides": {
    "minimist": ">=1.2.6",
    "json5": ">=2.2.2"
  },
  "resolutions": {
    "minimist": ">=1.2.6",
    "json5": ">=2.2.2"
  }
}
```

---

## 框架特定检测

### React

```yaml
react_specific:
  - react-scripts 版本
  - react-dom 版本匹配
  - babel 配置安全
```

### Vue

```yaml
vue_specific:
  - vue-cli 版本
  - @vue/cli-service 安全
  - vue-template-compiler 匹配
```

### Next.js

```yaml
nextjs_specific:
  - next 版本
  - next-auth 安全配置
  - middleware 安全
```

### Express

```yaml
express_specific:
  - express 版本
  - helmet 配置
  - cors 配置
  - body-parser 限制
```

---

## 参考资源

- [npm audit](https://docs.npmjs.com/cli/v10/commands/npm-audit)
- [Snyk Vulnerability Database](https://snyk.io/vuln/npm)
- [Node.js Security WG](https://github.com/nodejs/security-wg)
- [Socket.dev](https://socket.dev/)
- [漏洞知识库](../../shared/vulnerability-db.md)

---

**版本**: 1.0.0  
**更新时间**: 2025-12-22
