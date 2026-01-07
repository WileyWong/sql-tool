# Python 命令注入检测规则

## 规则概述

| 规则ID | PY-002 |
|--------|--------|
| 名称 | 命令注入 |
| 风险等级 | 🔴 严重 |
| CWE | CWE-78 |

---

## 检测模式

### 1. os.system 危险调用

**危险模式**:
```python
# ❌ 危险：用户输入直接传入
import os
os.system(f"ls {user_input}")
os.system("cat " + filename)
os.system("echo %s" % message)
```

**检测正则**:
```regex
os\.system\s*\(\s*f["']
os\.system\s*\(\s*["'].*?\s*\+
os\.system\s*\(\s*["'].*?%
```

---

### 2. subprocess 不安全使用

**危险模式**:
```python
# ❌ 危险：shell=True + 用户输入
import subprocess
subprocess.call(f"ls {user_input}", shell=True)
subprocess.run("cat " + filename, shell=True)
subprocess.Popen(f"echo {message}", shell=True)

# ❌ 危险：字符串命令
subprocess.call("ls " + path, shell=True)
```

**检测正则**:
```regex
subprocess\.(call|run|Popen)\s*\(\s*f["'].*?,\s*shell\s*=\s*True
subprocess\.(call|run|Popen)\s*\(\s*["'].*?\+.*?,\s*shell\s*=\s*True
shell\s*=\s*True
```

**安全写法**:
```python
# ✅ 安全：使用列表参数，不使用 shell
subprocess.run(["ls", "-la", path])
subprocess.call(["cat", filename])

# ✅ 安全：如果必须使用 shell，使用 shlex.quote
import shlex
subprocess.run(f"ls {shlex.quote(user_input)}", shell=True)
```

---

### 3. os.popen 危险调用

**危险模式**:
```python
# ❌ 危险：用户输入传入 popen
os.popen(f"cat {filename}")
os.popen("ls " + directory)
```

**检测正则**:
```regex
os\.popen\s*\(\s*f["']
os\.popen\s*\(\s*["'].*?\s*\+
```

---

### 4. eval/exec 危险调用

**危险模式**:
```python
# ❌ 危险：执行用户输入
eval(user_input)
exec(user_code)
compile(user_code, '<string>', 'exec')

# ❌ 危险：动态导入
__import__(module_name)
importlib.import_module(user_input)
```

**检测正则**:
```regex
eval\s*\(\s*[^"']
exec\s*\(\s*[^"']
compile\s*\(\s*[^"'].*?,.*?["']exec["']
__import__\s*\(\s*[^"']
importlib\.import_module\s*\(\s*[^"']
```

**安全写法**:
```python
# ✅ 安全：使用 ast.literal_eval 解析数据
import ast
data = ast.literal_eval(user_input)  # 只能解析字面量

# ✅ 安全：白名单验证
allowed_modules = {'math', 'json', 'datetime'}
if module_name in allowed_modules:
    module = importlib.import_module(module_name)
```

---

### 5. pickle 反序列化

**危险模式**:
```python
# ❌ 危险：反序列化不可信数据
import pickle
data = pickle.loads(user_data)
data = pickle.load(open(user_file, 'rb'))

# ❌ 危险：其他不安全的反序列化
import yaml
yaml.load(user_input)  # 默认 Loader 不安全

import marshal
marshal.loads(user_data)
```

**检测正则**:
```regex
pickle\.(loads?|Unpickler)\s*\(
yaml\.load\s*\([^,)]+\)(?!\s*,\s*Loader)
marshal\.loads?\s*\(
```

**安全写法**:
```python
# ✅ 安全：使用 JSON
import json
data = json.loads(user_input)

# ✅ 安全：YAML 使用 safe_load
import yaml
data = yaml.safe_load(user_input)
```

---

## 修复建议

### 1. 避免使用 shell

```python
# 修复前
os.system(f"convert {input_file} {output_file}")

# 修复后
subprocess.run(["convert", input_file, output_file], check=True)
```

### 2. 输入验证

```python
import re
import os.path

def validate_filename(filename: str) -> bool:
    """验证文件名安全性"""
    # 只允许字母数字和特定字符
    if not re.match(r'^[a-zA-Z0-9_\-\.]+$', filename):
        return False
    
    # 防止路径遍历
    if '..' in filename or filename.startswith('/'):
        return False
    
    return True

def safe_read_file(base_dir: str, filename: str) -> str:
    if not validate_filename(filename):
        raise ValueError("Invalid filename")
    
    full_path = os.path.join(base_dir, filename)
    # 确保路径在基础目录内
    if not os.path.abspath(full_path).startswith(os.path.abspath(base_dir)):
        raise ValueError("Path traversal detected")
    
    with open(full_path, 'r') as f:
        return f.read()
```

### 3. 使用 Python 原生函数替代 shell 命令

```python
# 代替 os.system("ls dir")
import os
files = os.listdir(directory)

# 代替 os.system("cat file")
with open(filename, 'r') as f:
    content = f.read()

# 代替 os.system("rm file")
os.remove(filename)

# 代替 os.system("cp src dst")
import shutil
shutil.copy(src, dst)
```

---

## 参考资源

- [OWASP Command Injection](https://owasp.org/www-community/attacks/Command_Injection)
- [Python subprocess 文档](https://docs.python.org/3/library/subprocess.html)
- [Bandit Security Linter](https://bandit.readthedocs.io/)
