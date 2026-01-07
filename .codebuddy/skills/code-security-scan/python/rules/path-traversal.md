# Python 路径遍历检测规则

## 规则概述

| 规则ID | PY-005 |
|--------|--------|
| 名称 | 路径遍历 |
| 风险等级 | 🔴 严重 |
| CWE | CWE-22 |

---

## 检测模式

### 1. 文件读取路径遍历

**危险模式**:
```python
# ❌ 危险：直接使用用户输入作为文件路径
filename = request.args.get('file')
with open(filename, 'r') as f:
    content = f.read()

# ❌ 危险：拼接路径
path = os.path.join(base_dir, user_input)
data = open(path).read()

# ❌ 危险：Flask send_file
from flask import send_file
@app.route('/download')
def download():
    filename = request.args.get('file')
    return send_file(filename)
```

**检测正则**:
```regex
open\s*\(\s*[^"'][a-zA-Z_]
open\s*\(\s*request\.
send_file\s*\(\s*[^"'][a-zA-Z_]
send_file\s*\(\s*request\.
```

---

### 2. 文件写入路径遍历

**危险模式**:
```python
# ❌ 危险：用户控制写入路径
filename = request.form.get('filename')
with open(filename, 'w') as f:
    f.write(content)

# ❌ 危险：文件上传
uploaded_file = request.files['file']
uploaded_file.save(os.path.join(upload_dir, uploaded_file.filename))
```

---

### 3. Django 文件操作

**危险模式**:
```python
# ❌ 危险：直接使用用户输入
from django.http import FileResponse

def download(request):
    filename = request.GET.get('file')
    return FileResponse(open(filename, 'rb'))

# ❌ 危险：模板路径注入
def render_template(request):
    template = request.GET.get('template')
    return render(request, template)
```

---

## 修复建议

### 1. 路径规范化和验证

```python
import os
from pathlib import Path

def safe_join(base_dir: str, user_input: str) -> str:
    """安全地拼接路径"""
    # 规范化基础目录
    base = Path(base_dir).resolve()
    
    # 清理用户输入
    # 移除开头的斜杠和 ..
    clean_input = user_input.lstrip('/\\')
    
    # 拼接并规范化
    full_path = (base / clean_input).resolve()
    
    # 验证路径在基础目录内
    if not str(full_path).startswith(str(base)):
        raise ValueError("Path traversal detected")
    
    return str(full_path)

def safe_read_file(base_dir: str, filename: str) -> str:
    """安全地读取文件"""
    safe_path = safe_join(base_dir, filename)
    
    # 额外检查：确保是文件而非目录
    if not os.path.isfile(safe_path):
        raise ValueError("Not a file")
    
    with open(safe_path, 'r') as f:
        return f.read()
```

### 2. 白名单验证

```python
import re

def validate_filename(filename: str) -> bool:
    """验证文件名安全性"""
    # 只允许字母数字和特定字符
    if not re.match(r'^[a-zA-Z0-9_\-\.]+$', filename):
        return False
    
    # 检查扩展名白名单
    allowed_ext = {'.txt', '.pdf', '.jpg', '.png'}
    ext = os.path.splitext(filename)[1].lower()
    if ext not in allowed_ext:
        return False
    
    # 防止隐藏文件
    if filename.startswith('.'):
        return False
    
    return True
```

### 3. Flask 安全文件下载

```python
from flask import Flask, send_from_directory, abort
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
UPLOAD_FOLDER = '/var/www/uploads'

@app.route('/download/<filename>')
def download_file(filename):
    # 使用 secure_filename 清理文件名
    safe_filename = secure_filename(filename)
    
    # 验证文件存在
    file_path = os.path.join(UPLOAD_FOLDER, safe_filename)
    if not os.path.isfile(file_path):
        abort(404)
    
    # 使用 send_from_directory（自动处理路径遍历）
    return send_from_directory(UPLOAD_FOLDER, safe_filename)
```

### 4. Django 安全文件下载

```python
from django.http import FileResponse, Http404
from django.conf import settings
import os

def download_file(request, filename):
    # 清理文件名
    safe_filename = os.path.basename(filename)
    
    # 构建安全路径
    base_dir = settings.MEDIA_ROOT
    file_path = os.path.join(base_dir, safe_filename)
    
    # 验证路径
    if not os.path.abspath(file_path).startswith(os.path.abspath(base_dir)):
        raise Http404("File not found")
    
    if not os.path.isfile(file_path):
        raise Http404("File not found")
    
    return FileResponse(open(file_path, 'rb'))
```

### 5. 文件上传安全

```python
from werkzeug.utils import secure_filename
import uuid
import os

ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return 'No file', 400
    
    file = request.files['file']
    
    if file.filename == '':
        return 'No selected file', 400
    
    if not allowed_file(file.filename):
        return 'File type not allowed', 400
    
    # 使用 secure_filename + UUID 避免覆盖
    original_name = secure_filename(file.filename)
    ext = os.path.splitext(original_name)[1]
    new_filename = f"{uuid.uuid4()}{ext}"
    
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], new_filename)
    file.save(file_path)
    
    return 'File uploaded', 200
```

---

## 参考资源

- [OWASP Path Traversal](https://owasp.org/www-community/attacks/Path_Traversal)
- [Flask 文件上传](https://flask.palletsprojects.com/en/2.0.x/patterns/fileuploads/)
- [Django 文件处理](https://docs.djangoproject.com/en/4.0/topics/files/)
