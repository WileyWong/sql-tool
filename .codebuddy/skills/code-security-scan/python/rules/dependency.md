# Python 依赖安全检测规则

本文档定义 Python 项目依赖安全检测规则。

## 规则列表

| 规则ID | 规则名称 | 风险等级 | 说明 |
|--------|---------|---------|------|
| PY-DEP-001 | 已知漏洞依赖 | 🔴 严重/🟠 高危 | 依赖存在已知 CVE 漏洞 |
| PY-DEP-002 | 过时依赖版本 | 🟡 中危 | 依赖版本过旧 |
| PY-DEP-003 | 不安全依赖源 | 🟠 高危 | 使用非官方 PyPI 源 |
| PY-DEP-004 | 未固定版本 | 🟡 中危 | 依赖版本未固定 |

---

## PY-DEP-001: 已知漏洞依赖

### 描述
项目依赖的第三方库存在已知安全漏洞（CVE）。

### 检测范围

#### requirements.txt
```
package==version
package>=version
package~=version
```

#### Pipfile
```toml
[packages]
package = "==version"
package = ">=version"
```

#### pyproject.toml
```toml
[project]
dependencies = [
    "package==version",
]

[tool.poetry.dependencies]
package = "^version"
```

### 高危依赖清单

#### 严重漏洞 (必须立即修复)

| 依赖 | 漏洞版本 | CVE | 安全版本 |
|------|---------|-----|---------|
| `py` | <1.11.0 | CVE-2022-42969 | ≥1.11.0 |

#### 高危漏洞 (本周内修复)

| 依赖 | 漏洞版本 | CVE | 安全版本 |
|------|---------|-----|---------|
| `setuptools` | <65.5.1 | CVE-2022-40897 | ≥65.5.1 |
| `requests` | <2.31.0 | CVE-2023-32681 | ≥2.31.0 |
| `certifi` | <2023.7.22 | CVE-2023-37920 | ≥2023.7.22 |
| `urllib3` | <1.26.17 | CVE-2023-43804 | ≥1.26.17 |
| `werkzeug` | <2.2.3 | CVE-2023-25577 | ≥2.2.3 |
| `flask` | <2.3.2 | CVE-2023-30861 | ≥2.3.2 |
| `django` | <3.2.20 | CVE-2023-36053 | ≥3.2.20 |
| `django` | <3.2.14 | CVE-2022-34265 | ≥3.2.14 |
| `dnspython` | <2.6.0 | CVE-2023-29483 | ≥2.6.0 |

#### 中危漏洞

| 依赖 | 漏洞版本 | CVE | 安全版本 |
|------|---------|-----|---------|
| `pip` | <23.3 | CVE-2023-5752 | ≥23.3 |

### 检测示例

#### 问题代码 (requirements.txt)
```
# ❌ 存在漏洞的依赖
requests==2.28.0
certifi==2022.12.7
django==3.2.10
urllib3==1.26.5
```

#### 修复代码
```
# ✅ 升级到安全版本
requests>=2.31.0
certifi>=2023.7.22
django>=3.2.20
urllib3>=1.26.17
```

### 报告格式

```markdown
## 🟠 PY-DEP-001: 已知漏洞依赖

**文件**: requirements.txt:5
**依赖**: requests==2.28.0
**漏洞**: CVE-2023-32681
**CVSS**: 7.5 (高危)
**风险**: 在重定向时可能泄露 Proxy-Authorization 头

**修复建议**:
升级到 2.31.0 或更高版本：
```
pip install requests>=2.31.0
```

**参考**:
- https://nvd.nist.gov/vuln/detail/CVE-2023-32681
```

---

## PY-DEP-002: 过时依赖版本

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
  - 官方已声明 EOL
```

### 常见过时依赖

| 依赖 | 过时版本 | 状态 | 建议 |
|------|---------|------|------|
| `python` | 2.x | EOL | 迁移到 Python 3.9+ |
| `python` | 3.7 | EOL | 迁移到 Python 3.9+ |
| `django` | 2.x | EOL | 迁移到 Django 4.x |
| `flask` | 1.x | 维护模式 | 迁移到 Flask 2.x |
| `celery` | 4.x | 维护模式 | 迁移到 Celery 5.x |

### 检测示例

```
# ❌ 过时依赖
Django==2.2.28
Flask==1.1.4
```

```
# ✅ 升级到最新稳定版
Django>=4.2
Flask>=2.3.0
```

---

## PY-DEP-003: 不安全依赖源

### 描述
项目配置了非官方或不可信的 PyPI 源。

### 检测规则

```yaml
trusted_sources:
  - https://pypi.org/simple/
  - https://pypi.python.org/simple/
  - https://mirrors.aliyun.com/pypi/simple/
  - https://pypi.tuna.tsinghua.edu.cn/simple/
  - https://mirrors.cloud.tencent.com/pypi/simple/

suspicious_patterns:
  - http://  # 非 HTTPS
  - 私有 IP 地址
  - 未知域名
```

### 检测示例

#### 问题配置 (pip.conf)
```ini
# ❌ 使用 HTTP 协议
[global]
index-url = http://pypi.example.com/simple/
```

#### 安全配置
```ini
# ✅ 使用 HTTPS 和可信源
[global]
index-url = https://pypi.org/simple/
trusted-host = pypi.org
```

---

## PY-DEP-004: 未固定版本

### 描述
依赖版本未固定，可能导致构建不可重现和安全风险。

### 检测规则

```yaml
unsafe_patterns:
  - package          # 无版本约束
  - package>=1.0     # 仅下限约束
  - package>1.0      # 仅下限约束
  
safe_patterns:
  - package==1.2.3   # 精确版本
  - package~=1.2.3   # 兼容版本
  - package>=1.2,<2  # 范围约束
```

### 检测示例

#### 问题代码
```
# ❌ 未固定版本
requests
django>=3.0
flask
```

#### 修复代码
```
# ✅ 固定版本
requests==2.31.0
django>=3.2,<4.0
flask~=2.3.0
```

### 报告格式

```markdown
## 🟡 PY-DEP-004: 未固定版本

**文件**: requirements.txt:3
**依赖**: requests
**问题**: 未指定版本约束

**风险**:
- 构建不可重现
- 可能引入不兼容更新
- 可能引入有漏洞的新版本

**修复建议**:
固定版本或指定版本范围：
```
requests==2.31.0
# 或
requests>=2.31.0,<3.0
```
```

---

## 检测流程

### 1. 依赖文件识别

```yaml
scan_files:
  - requirements.txt
  - requirements/*.txt
  - requirements-*.txt
  - Pipfile
  - Pipfile.lock
  - pyproject.toml
  - setup.py
  - setup.cfg
```

### 2. 依赖解析

#### requirements.txt 解析
```python
# 伪代码
import re

def parse_requirements(content):
    dependencies = []
    for line in content.splitlines():
        line = line.strip()
        if not line or line.startswith('#'):
            continue
        # 解析 package==version, package>=version 等
        match = re.match(r'^([a-zA-Z0-9_-]+)([<>=!~]+)?(.+)?$', line)
        if match:
            dependencies.append({
                'name': match.group(1),
                'operator': match.group(2),
                'version': match.group(3)
            })
    return dependencies
```

#### pyproject.toml 解析
```python
# 伪代码
import tomllib

def parse_pyproject(content):
    data = tomllib.loads(content)
    dependencies = []
    
    # PEP 621 格式
    if 'project' in data:
        deps = data['project'].get('dependencies', [])
        dependencies.extend(parse_pep508(deps))
    
    # Poetry 格式
    if 'tool' in data and 'poetry' in data['tool']:
        deps = data['tool']['poetry'].get('dependencies', {})
        dependencies.extend(parse_poetry(deps))
    
    return dependencies
```

### 3. 漏洞匹配

```yaml
matching_rules:
  - 包名匹配（大小写不敏感）
  - 版本范围匹配
  - PEP 440 版本规范
  
severity_mapping:
  cvss >= 9.0: critical
  cvss >= 7.0: high
  cvss >= 4.0: medium
  cvss < 4.0: low
```

---

## 最佳实践

### 1. 使用 pip-tools

```bash
# 安装 pip-tools
pip install pip-tools

# 从 requirements.in 生成锁定的 requirements.txt
pip-compile requirements.in

# 更新依赖
pip-compile --upgrade requirements.in
```

### 2. 使用 Poetry

```bash
# 初始化项目
poetry init

# 添加依赖
poetry add requests

# 锁定依赖
poetry lock

# 检查安全漏洞
poetry audit
```

### 3. 安全扫描工具

```bash
# pip-audit
pip install pip-audit
pip-audit

# safety
pip install safety
safety check

# bandit (代码安全)
pip install bandit
bandit -r .
```

### 4. 依赖更新策略

```yaml
# dependabot.yml
version: 2
updates:
  - package-ecosystem: "pip"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
```

---

## 参考资源

- [pip-audit](https://github.com/pypa/pip-audit)
- [Safety](https://github.com/pyupio/safety)
- [Snyk Python](https://snyk.io/vuln/pip)
- [Python Security](https://python-security.readthedocs.io/)
- [漏洞知识库](../../shared/vulnerability-db.md)

---

**版本**: 1.0.0  
**更新时间**: 2025-12-22
