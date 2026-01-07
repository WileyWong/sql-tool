# Python 安全规则索引

本文档定义 Python 项目的安全检测规则。

## 规则列表

| 规则ID | 规则名称 | 风险等级 | 分类 |
|--------|---------|---------|------|
| PY-SQL-001 | SQL 字符串拼接 | 🔴 严重 | SQL注入 |
| PY-SQL-002 | 格式化字符串 SQL | 🔴 严重 | SQL注入 |
| PY-CMD-001 | os.system 命令注入 | 🔴 严重 | 命令注入 |
| PY-CMD-002 | subprocess shell=True | 🔴 严重 | 命令注入 |
| PY-EVAL-001 | eval 使用 | 🔴 严重 | 代码注入 |
| PY-EVAL-002 | exec 使用 | 🔴 严重 | 代码注入 |
| PY-PICKLE-001 | pickle 反序列化 | 🔴 严重 | 反序列化 |
| PY-YAML-001 | yaml.load 不安全 | 🔴 严重 | 反序列化 |
| PY-PATH-001 | 路径遍历 | 🔴 严重 | 文件操作 |
| PY-CRYPTO-001 | 弱加密算法 | 🟠 高危 | 加密安全 |
| PY-CRYPTO-002 | 硬编码密钥 | 🟠 高危 | 加密安全 |
| PY-LEAK-001 | 敏感信息泄露 | 🟠 高危 | 敏感信息 |
| PY-SSRF-001 | SSRF 风险 | 🟠 高危 | 网络安全 |
| PY-XXE-001 | XML 外部实体 | 🟠 高危 | XXE |
| PY-DEP-001 | 已知漏洞依赖 | 🟠 高危 | 依赖安全 |
| PY-LOG-001 | 安全日志缺失 | 🟡 中危 | 日志安全 |

---

## 详细规则

### PY-SQL-001: SQL 字符串拼接

**检测模式**:
```regex
execute\(.*%
execute\(.*\.format
execute\(.*f"
execute\(.*\+
```

**危险代码**:
```python
# ❌ 危险: 字符串拼接
cursor.execute("SELECT * FROM users WHERE id = " + user_id)

# ❌ 危险: % 格式化
cursor.execute("SELECT * FROM users WHERE id = %s" % user_id)

# ❌ 危险: format
cursor.execute("SELECT * FROM users WHERE id = {}".format(user_id))

# ❌ 危险: f-string
cursor.execute(f"SELECT * FROM users WHERE id = {user_id}")
```

**安全代码**:
```python
# ✅ 安全: 参数化查询
cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))

# ✅ 安全: 命名参数
cursor.execute("SELECT * FROM users WHERE id = :id", {"id": user_id})

# ✅ 安全: SQLAlchemy ORM
user = session.query(User).filter(User.id == user_id).first()
```

---

### PY-CMD-001: os.system 命令注入

**检测模式**:
```regex
os\.system\(
os\.popen\(
commands\.getoutput\(
```

**危险代码**:
```python
# ❌ 危险
import os
os.system("cat " + filename)
os.popen("ping " + host)
```

**安全代码**:
```python
# ✅ 安全: 使用 subprocess 数组参数
import subprocess
subprocess.run(["cat", filename])
subprocess.run(["ping", "-c", "4", host])
```

---

### PY-CMD-002: subprocess shell=True

**检测模式**:
```regex
subprocess\..*shell\s*=\s*True
subprocess\.call\(.*shell
subprocess\.run\(.*shell
subprocess\.Popen\(.*shell
```

**危险代码**:
```python
# ❌ 危险
import subprocess
subprocess.run(f"cat {filename}", shell=True)
subprocess.call("ping " + host, shell=True)
```

**安全代码**:
```python
# ✅ 安全: 不使用 shell=True
import subprocess
subprocess.run(["cat", filename])

# ✅ 安全: 使用 shlex.quote
import shlex
subprocess.run(f"cat {shlex.quote(filename)}", shell=True)
```

---

### PY-EVAL-001: eval 使用

**检测模式**:
```regex
eval\(
exec\(
compile\(
```

**危险代码**:
```python
# ❌ 危险
result = eval(user_input)
exec(user_code)
```

**安全代码**:
```python
# ✅ 安全: 使用 ast.literal_eval
import ast
result = ast.literal_eval(user_input)  # 只解析字面量

# ✅ 安全: 使用 JSON
import json
result = json.loads(user_input)
```

---

### PY-PICKLE-001: pickle 反序列化

**检测模式**:
```regex
pickle\.load
pickle\.loads
cPickle\.load
cPickle\.loads
```

**危险代码**:
```python
# ❌ 危险: 反序列化不可信数据
import pickle
data = pickle.loads(user_data)
```

**安全代码**:
```python
# ✅ 安全: 使用 JSON
import json
data = json.loads(user_data)

# ✅ 安全: 使用 HMAC 验证
import hmac
import pickle

def safe_loads(data, key):
    signature, payload = data.split(b'|', 1)
    expected = hmac.new(key, payload, 'sha256').digest()
    if not hmac.compare_digest(signature, expected):
        raise ValueError("Invalid signature")
    return pickle.loads(payload)
```

---

### PY-YAML-001: yaml.load 不安全

**检测模式**:
```regex
yaml\.load\((?!.*Loader)
yaml\.load\(.*Loader\s*=\s*yaml\.Loader
yaml\.load\(.*Loader\s*=\s*yaml\.UnsafeLoader
```

**危险代码**:
```python
# ❌ 危险: 默认 Loader
import yaml
data = yaml.load(user_input)

# ❌ 危险: UnsafeLoader
data = yaml.load(user_input, Loader=yaml.UnsafeLoader)
```

**安全代码**:
```python
# ✅ 安全: SafeLoader
import yaml
data = yaml.load(user_input, Loader=yaml.SafeLoader)

# ✅ 安全: safe_load
data = yaml.safe_load(user_input)
```

---

### PY-PATH-001: 路径遍历

**检测模式**:
```regex
open\(.*\+
os\.path\.join\(.*\+
pathlib\.Path\(.*\+
```

**危险代码**:
```python
# ❌ 危险
with open("/uploads/" + filename) as f:
    content = f.read()
```

**安全代码**:
```python
# ✅ 安全: 路径验证
import os
from pathlib import Path

base_path = Path("/uploads").resolve()
file_path = (base_path / filename).resolve()

if not str(file_path).startswith(str(base_path)):
    raise ValueError("Path traversal detected")

with open(file_path) as f:
    content = f.read()
```

---

### PY-XXE-001: XML 外部实体

**检测模式**:
```regex
xml\.etree\.ElementTree\.parse
xml\.dom\.minidom\.parse
lxml\.etree\.parse
```

**危险代码**:
```python
# ❌ 危险: 默认解析器
import xml.etree.ElementTree as ET
tree = ET.parse(user_xml)
```

**安全代码**:
```python
# ✅ 安全: defusedxml
import defusedxml.ElementTree as ET
tree = ET.parse(user_xml)

# ✅ 安全: 禁用外部实体
from lxml import etree
parser = etree.XMLParser(resolve_entities=False)
tree = etree.parse(user_xml, parser)
```

---

## 检测优先级

### 第一优先级（严重）
1. PY-SQL-001, PY-SQL-002
2. PY-CMD-001, PY-CMD-002
3. PY-EVAL-001, PY-EVAL-002
4. PY-PICKLE-001
5. PY-YAML-001
6. PY-PATH-001

### 第二优先级（高危）
1. PY-CRYPTO-001, PY-CRYPTO-002
2. PY-LEAK-001
3. PY-SSRF-001
4. PY-XXE-001
5. PY-DEP-001

### 第三优先级（中危）
1. PY-LOG-001

---

## 详细规则文件

| 规则类别 | 文件 | 说明 |
|---------|------|------|
| SQL 注入 | [rules/sql-injection.md](rules/sql-injection.md) | Django ORM, SQLAlchemy, 原生 SQL |
| 命令注入 | [rules/command-injection.md](rules/command-injection.md) | os.system, subprocess, eval/exec |
| 敏感信息 | [rules/sensitive-data.md](rules/sensitive-data.md) | 硬编码、日志、异常信息泄露 |
| 加密安全 | [rules/crypto.md](rules/crypto.md) | 弱哈希、不安全随机数、SSL/TLS |
| 路径遍历 | [rules/path-traversal.md](rules/path-traversal.md) | 文件读写、Flask/Django 文件下载 |
| 依赖安全 | [rules/dependency.md](rules/dependency.md) | pip-audit, safety 检测 |
| 日志安全 | [rules/logging.md](rules/logging.md) | 安全事件日志 |

---

## 安全工具推荐

| 工具 | 用途 |
|------|------|
| `bandit` | 静态安全分析 |
| `safety` | 依赖漏洞检测 |
| `pip-audit` | 依赖审计 |
| `defusedxml` | 安全 XML 解析 |

---

**版本**: 1.2.0  
**更新时间**: 2025-12-22
