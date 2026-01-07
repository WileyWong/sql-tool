# Python 安全性审查示例

Python 代码安全漏洞的识别与修复示例，覆盖 OWASP Top 10 常见风险。

---

## SQL 注入 (CWE-89)

### 问题代码

```python
# ❌ 危险：f-string 拼接 SQL
def get_user_by_name(name: str):
    query = f"SELECT * FROM users WHERE name = '{name}'"
    return db.execute(query).fetchone()

# 攻击示例：name = "'; DROP TABLE users; --"
# 执行的 SQL: SELECT * FROM users WHERE name = ''; DROP TABLE users; --'

# ❌ 危险：format 格式化
def search_users(keyword: str):
    query = "SELECT * FROM users WHERE name LIKE '%{}%'".format(keyword)
    return db.execute(query).fetchall()

# ❌ 危险：% 格式化
def get_user(user_id: str):
    query = "SELECT * FROM users WHERE id = %s" % user_id
    return db.execute(query).fetchone()
```

### 修复方案

```python
# ✅ 安全：参数化查询（sqlite3）
import sqlite3

def get_user_by_name(name: str):
    query = "SELECT * FROM users WHERE name = ?"
    return db.execute(query, (name,)).fetchone()

# ✅ 安全：参数化查询（psycopg2）
import psycopg2

def search_users(keyword: str):
    query = "SELECT * FROM users WHERE name LIKE %s"
    return cursor.execute(query, (f"%{keyword}%",))

# ✅ 安全：SQLAlchemy ORM
from sqlalchemy.orm import Session

def get_user_by_name(db: Session, name: str) -> User | None:
    return db.query(User).filter(User.name == name).first()

# ✅ 安全：SQLAlchemy text() 参数化
from sqlalchemy import text

def search_users(db: Session, keyword: str):
    query = text("SELECT * FROM users WHERE name LIKE :keyword")
    return db.execute(query, {"keyword": f"%{keyword}%"}).fetchall()

# ✅ 安全：Django ORM
def get_user_by_name(name: str):
    return User.objects.filter(name=name).first()

# ✅ 安全：Django raw() 参数化
def search_users(keyword: str):
    return User.objects.raw(
        "SELECT * FROM users WHERE name LIKE %s",
        [f"%{keyword}%"]
    )
```

---

## 命令注入 (CWE-78)

### 问题代码

```python
import os
import subprocess

# ❌ 危险：os.system + 字符串拼接
def compress_file(filename: str):
    os.system(f"gzip {filename}")

# 攻击示例：filename = "file.txt; rm -rf /"

# ❌ 危险：shell=True + 用户输入
def run_command(user_input: str):
    subprocess.run(f"echo {user_input}", shell=True)

# ❌ 危险：os.popen
def get_file_info(filename: str):
    return os.popen(f"file {filename}").read()
```

### 修复方案

```python
import subprocess
import shlex
from pathlib import Path

# ✅ 安全：参数列表（禁止 shell=True）
def compress_file(filename: str):
    # 验证文件存在
    if not Path(filename).exists():
        raise FileNotFoundError(f"File not found: {filename}")
    
    subprocess.run(["gzip", filename], check=True)

# ✅ 安全：使用 Python 原生方法替代外部命令
import gzip
import shutil

def compress_file(filename: str):
    with open(filename, 'rb') as f_in:
        with gzip.open(f"{filename}.gz", 'wb') as f_out:
            shutil.copyfileobj(f_in, f_out)

# ✅ 安全：如果必须用 shell，使用 shlex.quote
def run_command(user_input: str):
    safe_input = shlex.quote(user_input)
    subprocess.run(f"echo {safe_input}", shell=True, check=True)

# ✅ 安全：白名单验证
ALLOWED_COMMANDS = {"ls", "pwd", "whoami"}

def run_safe_command(command: str):
    if command not in ALLOWED_COMMANDS:
        raise ValueError(f"Command not allowed: {command}")
    subprocess.run([command], check=True)

# ✅ 安全：使用 subprocess.run 的参数列表
def get_file_info(filename: str) -> str:
    result = subprocess.run(
        ["file", filename],
        capture_output=True,
        text=True,
        check=True
    )
    return result.stdout
```

---

## 反序列化漏洞 (CWE-502)

### 问题代码

```python
import pickle
import yaml

# ❌ 危险：pickle 反序列化不可信数据
def load_user_data(data: bytes):
    return pickle.loads(data)  # 任意代码执行！

# 攻击示例：
# import pickle
# import os
# class Exploit:
#     def __reduce__(self):
#         return (os.system, ("rm -rf /",))
# payload = pickle.dumps(Exploit())

# ❌ 危险：yaml.load 不安全
def load_config(content: str):
    return yaml.load(content)  # 任意代码执行！

# 攻击示例：
# !!python/object/apply:os.system ["rm -rf /"]
```

### 修复方案

```python
import json
import yaml
import hmac
import hashlib
from typing import Any

# ✅ 安全：使用 JSON（无代码执行风险）
def load_user_data(content: str) -> dict:
    return json.loads(content)

# ✅ 安全：yaml.safe_load
def load_config(content: str) -> dict:
    return yaml.safe_load(content)

# ✅ 安全：如果必须用 pickle，验证签名
SECRET_KEY = b"your-secret-key"

def save_signed_data(data: Any) -> tuple[bytes, bytes]:
    """保存数据并生成签名"""
    pickled = pickle.dumps(data)
    signature = hmac.new(SECRET_KEY, pickled, hashlib.sha256).digest()
    return pickled, signature

def load_signed_data(pickled: bytes, signature: bytes) -> Any:
    """验证签名后加载数据"""
    expected_sig = hmac.new(SECRET_KEY, pickled, hashlib.sha256).digest()
    if not hmac.compare_digest(signature, expected_sig):
        raise SecurityError("Invalid signature - data may be tampered")
    return pickle.loads(pickled)

# ✅ 安全：使用 jsonpickle（更安全的序列化）
import jsonpickle

def safe_serialize(obj: Any) -> str:
    return jsonpickle.encode(obj)

def safe_deserialize(data: str) -> Any:
    # 配置白名单类
    jsonpickle.set_decoder_options('json', cls_whitelist=['myapp.models'])
    return jsonpickle.decode(data)
```

---

## 路径遍历 (CWE-22)

### 问题代码

```python
import os

UPLOAD_DIR = "/var/uploads"

# ❌ 危险：直接拼接用户输入
def read_file(filename: str) -> str:
    filepath = os.path.join(UPLOAD_DIR, filename)
    with open(filepath) as f:
        return f.read()

# 攻击示例：filename = "../../../etc/passwd"
# 实际路径：/var/uploads/../../../etc/passwd = /etc/passwd

# ❌ 危险：未验证文件扩展名
def upload_file(filename: str, content: bytes):
    filepath = os.path.join(UPLOAD_DIR, filename)
    with open(filepath, 'wb') as f:
        f.write(content)

# 攻击示例：filename = "shell.php"
```

### 修复方案

```python
import os
import re
from pathlib import Path
from typing import Optional

UPLOAD_DIR = Path("/var/uploads")
ALLOWED_EXTENSIONS = {".txt", ".pdf", ".png", ".jpg"}

def validate_filename(filename: str) -> bool:
    """验证文件名安全性"""
    # 只允许字母、数字、下划线、连字符、点
    if not re.match(r'^[\w\-. ]+$', filename):
        return False
    # 不允许以点开头（隐藏文件）
    if filename.startswith('.'):
        return False
    return True

def get_safe_path(filename: str) -> Path:
    """获取安全的文件路径"""
    if not validate_filename(filename):
        raise ValueError(f"Invalid filename: {filename}")
    
    # 规范化路径
    base = UPLOAD_DIR.resolve()
    filepath = (base / filename).resolve()
    
    # 确保在允许目录内
    if not str(filepath).startswith(str(base)):
        raise SecurityError("Path traversal detected")
    
    return filepath

# ✅ 安全：读取文件
def read_file(filename: str) -> str:
    filepath = get_safe_path(filename)
    if not filepath.exists():
        raise FileNotFoundError(f"File not found: {filename}")
    return filepath.read_text()

# ✅ 安全：上传文件（验证扩展名）
def upload_file(filename: str, content: bytes) -> Path:
    filepath = get_safe_path(filename)
    
    # 验证扩展名
    if filepath.suffix.lower() not in ALLOWED_EXTENSIONS:
        raise ValueError(f"File type not allowed: {filepath.suffix}")
    
    # 限制文件大小
    MAX_SIZE = 10 * 1024 * 1024  # 10MB
    if len(content) > MAX_SIZE:
        raise ValueError("File too large")
    
    filepath.write_bytes(content)
    return filepath

# ✅ 安全：使用 UUID 重命名文件
import uuid

def upload_file_safe(original_filename: str, content: bytes) -> Path:
    """使用 UUID 重命名，避免文件名攻击"""
    ext = Path(original_filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise ValueError(f"File type not allowed: {ext}")
    
    # 生成安全的文件名
    safe_filename = f"{uuid.uuid4()}{ext}"
    filepath = UPLOAD_DIR / safe_filename
    filepath.write_bytes(content)
    return filepath
```

---

## 敏感信息泄露 (CWE-200)

### 问题代码

```python
import logging

logger = logging.getLogger(__name__)

# ❌ 危险：硬编码密钥
SECRET_KEY = "my-super-secret-key-12345"
DATABASE_URL = "mysql://root:password123@localhost/mydb"
API_KEY = "sk-1234567890abcdef"

# ❌ 危险：日志打印敏感信息
def login(username: str, password: str):
    logger.info(f"Login attempt: {username}, password: {password}")
    # ...

# ❌ 危险：异常信息暴露内部细节
def get_user(user_id: int):
    try:
        return db.query(User).get(user_id)
    except Exception as e:
        raise Exception(f"Database error: {e}")  # 暴露数据库信息

# ❌ 危险：响应包含敏感字段
def get_user_info(user_id: int) -> dict:
    user = db.query(User).get(user_id)
    return {
        "id": user.id,
        "name": user.name,
        "password_hash": user.password_hash,  # 不应返回！
        "api_key": user.api_key,  # 不应返回！
    }
```

### 修复方案

```python
import os
import logging
from dataclasses import dataclass
from pydantic import BaseModel, SecretStr

logger = logging.getLogger(__name__)

# ✅ 安全：从环境变量读取敏感配置
SECRET_KEY = os.environ["SECRET_KEY"]
DATABASE_URL = os.environ["DATABASE_URL"]
API_KEY = os.environ["API_KEY"]

# ✅ 安全：使用 .env 文件 + python-dotenv
from dotenv import load_dotenv
load_dotenv()

# ✅ 安全：日志脱敏
def login(username: str, password: str):
    logger.info(f"Login attempt: {username}")
    # 密码不记录日志

# ✅ 安全：自定义日志过滤器
class SensitiveDataFilter(logging.Filter):
    SENSITIVE_FIELDS = {'password', 'token', 'api_key', 'secret'}
    
    def filter(self, record: logging.LogRecord) -> bool:
        if hasattr(record, 'msg'):
            for field in self.SENSITIVE_FIELDS:
                if field in str(record.msg).lower():
                    record.msg = "[REDACTED - contains sensitive data]"
        return True

# ✅ 安全：异常不暴露内部细节
class UserNotFoundError(Exception):
    pass

def get_user(user_id: int):
    try:
        user = db.query(User).get(user_id)
        if not user:
            raise UserNotFoundError("User not found")
        return user
    except SQLAlchemyError:
        logger.exception("Database error")  # 详细日志记录
        raise UserNotFoundError("User not found")  # 对外隐藏细节

# ✅ 安全：使用 Pydantic 排除敏感字段
class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    
    class Config:
        # 排除敏感字段
        fields = {
            "password_hash": {"exclude": True},
            "api_key": {"exclude": True},
        }

# ✅ 安全：使用 SecretStr 保护敏感字符串
class DatabaseConfig(BaseModel):
    host: str
    port: int
    password: SecretStr  # 打印时自动隐藏
    
    def get_connection_string(self) -> str:
        return f"mysql://{self.host}:{self.port}"

config = DatabaseConfig(host="localhost", port=3306, password="secret")
print(config)  # password='**********'
```

---

## 不安全的随机数 (CWE-330)

### 问题代码

```python
import random
import string

# ❌ 危险：使用 random 生成安全令牌
def generate_token() -> str:
    chars = string.ascii_letters + string.digits
    return ''.join(random.choice(chars) for _ in range(32))

# ❌ 危险：使用 random 生成密码重置令牌
def generate_reset_token() -> str:
    return str(random.randint(100000, 999999))

# random 模块使用 Mersenne Twister 算法，可预测！
```

### 修复方案

```python
import secrets
import string

# ✅ 安全：使用 secrets 模块
def generate_token(length: int = 32) -> str:
    """生成安全的随机令牌"""
    return secrets.token_urlsafe(length)

def generate_hex_token(length: int = 32) -> str:
    """生成十六进制令牌"""
    return secrets.token_hex(length)

# ✅ 安全：生成安全的随机密码
def generate_password(length: int = 16) -> str:
    """生成安全的随机密码"""
    alphabet = string.ascii_letters + string.digits + string.punctuation
    # 确保至少包含各类字符
    password = [
        secrets.choice(string.ascii_lowercase),
        secrets.choice(string.ascii_uppercase),
        secrets.choice(string.digits),
        secrets.choice(string.punctuation),
    ]
    password += [secrets.choice(alphabet) for _ in range(length - 4)]
    secrets.SystemRandom().shuffle(password)
    return ''.join(password)

# ✅ 安全：生成数字验证码
def generate_verification_code(length: int = 6) -> str:
    """生成数字验证码"""
    return ''.join(secrets.choice(string.digits) for _ in range(length))

# ✅ 安全：安全的随机选择
def secure_choice(items: list):
    """安全的随机选择"""
    return secrets.choice(items)
```

---

## 不安全的密码存储 (CWE-916)

### 问题代码

```python
import hashlib

# ❌ 危险：明文存储密码
def save_user(username: str, password: str):
    db.execute(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        (username, password)
    )

# ❌ 危险：使用 MD5/SHA1 哈希
def hash_password(password: str) -> str:
    return hashlib.md5(password.encode()).hexdigest()

# ❌ 危险：无盐哈希
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()
```

### 修复方案

```python
import bcrypt
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

# ✅ 安全：使用 bcrypt
def hash_password_bcrypt(password: str) -> str:
    """使用 bcrypt 哈希密码"""
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password.encode(), salt).decode()

def verify_password_bcrypt(password: str, hashed: str) -> bool:
    """验证 bcrypt 密码"""
    return bcrypt.checkpw(password.encode(), hashed.encode())

# ✅ 安全：使用 argon2（推荐）
ph = PasswordHasher()

def hash_password_argon2(password: str) -> str:
    """使用 argon2 哈希密码（更安全）"""
    return ph.hash(password)

def verify_password_argon2(password: str, hashed: str) -> bool:
    """验证 argon2 密码"""
    try:
        ph.verify(hashed, password)
        return True
    except VerifyMismatchError:
        return False

# ✅ 安全：密码强度验证
import re

def validate_password_strength(password: str) -> tuple[bool, list[str]]:
    """验证密码强度"""
    errors = []
    
    if len(password) < 8:
        errors.append("密码长度至少 8 位")
    if not re.search(r'[A-Z]', password):
        errors.append("需要包含大写字母")
    if not re.search(r'[a-z]', password):
        errors.append("需要包含小写字母")
    if not re.search(r'\d', password):
        errors.append("需要包含数字")
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        errors.append("需要包含特殊字符")
    
    return len(errors) == 0, errors
```

---

## 时间攻击 (CWE-208)

### 问题代码

```python
# ❌ 危险：直接比较敏感字符串
def verify_token(provided: str, expected: str) -> bool:
    return provided == expected  # 时间攻击！

# 攻击者可以通过测量响应时间推断出正确的令牌
```

### 修复方案

```python
import hmac
import secrets

# ✅ 安全：使用常量时间比较
def verify_token(provided: str, expected: str) -> bool:
    """常量时间字符串比较"""
    return hmac.compare_digest(provided.encode(), expected.encode())

# ✅ 安全：使用 secrets.compare_digest
def verify_api_key(provided: str, expected: str) -> bool:
    """安全的 API Key 验证"""
    return secrets.compare_digest(provided, expected)

# ✅ 安全：HMAC 签名验证
def verify_signature(message: bytes, signature: bytes, secret: bytes) -> bool:
    """验证 HMAC 签名"""
    expected = hmac.new(secret, message, 'sha256').digest()
    return hmac.compare_digest(signature, expected)
```

---

## eval/exec 注入 (CWE-95)

### 问题代码

```python
# ❌ 危险：eval 执行用户输入
def calculate(expression: str):
    return eval(expression)

# 攻击示例：expression = "__import__('os').system('rm -rf /')"

# ❌ 危险：exec 执行用户代码
def run_user_code(code: str):
    exec(code)
```

### 修复方案

```python
import ast
import operator

# ✅ 安全：使用 ast.literal_eval（仅解析字面量）
def parse_config(value: str):
    """安全解析 Python 字面量"""
    return ast.literal_eval(value)  # 只能解析 str, bytes, numbers, tuples, lists, dicts, sets, booleans, None

# ✅ 安全：自定义安全计算器
OPERATORS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.Pow: operator.pow,
}

def safe_eval(expression: str) -> float:
    """安全的数学表达式计算"""
    tree = ast.parse(expression, mode='eval')
    
    def _eval(node):
        if isinstance(node, ast.Expression):
            return _eval(node.body)
        elif isinstance(node, ast.Constant):
            if isinstance(node.value, (int, float)):
                return node.value
            raise ValueError("Only numbers allowed")
        elif isinstance(node, ast.BinOp):
            op = OPERATORS.get(type(node.op))
            if op is None:
                raise ValueError(f"Operator not allowed: {node.op}")
            return op(_eval(node.left), _eval(node.right))
        else:
            raise ValueError(f"Node type not allowed: {type(node)}")
    
    return _eval(tree)

# 使用示例
result = safe_eval("2 + 3 * 4")  # 14
# safe_eval("__import__('os')")  # ValueError

# ✅ 安全：使用专门的表达式库
# pip install simpleeval
from simpleeval import simple_eval

def calculate(expression: str) -> float:
    return simple_eval(expression)
```

---

## SSRF 服务端请求伪造 (CWE-918)

### 问题代码

```python
import requests

# ❌ 危险：直接请求用户提供的 URL
@app.get("/fetch")
def fetch_url(url: str):
    response = requests.get(url)
    return response.text

# 攻击示例：url = "http://169.254.169.254/latest/meta-data/"  # AWS 元数据
# 攻击示例：url = "http://localhost:6379/"  # 内网 Redis
```

### 修复方案

```python
import ipaddress
import requests
from urllib.parse import urlparse
from typing import Optional

# 允许的域名白名单
ALLOWED_HOSTS = {"api.example.com", "cdn.example.com"}

# 内网 IP 段
PRIVATE_IP_RANGES = [
    ipaddress.ip_network("10.0.0.0/8"),
    ipaddress.ip_network("172.16.0.0/12"),
    ipaddress.ip_network("192.168.0.0/16"),
    ipaddress.ip_network("127.0.0.0/8"),
    ipaddress.ip_network("169.254.0.0/16"),  # AWS 元数据
]

def is_private_ip(ip: str) -> bool:
    """检查是否为内网 IP"""
    try:
        ip_obj = ipaddress.ip_address(ip)
        return any(ip_obj in network for network in PRIVATE_IP_RANGES)
    except ValueError:
        return True  # 无效 IP 视为不安全

def validate_url(url: str) -> bool:
    """验证 URL 安全性"""
    try:
        parsed = urlparse(url)
        
        # 只允许 HTTP/HTTPS
        if parsed.scheme not in ("http", "https"):
            return False
        
        # 检查域名白名单
        if parsed.hostname not in ALLOWED_HOSTS:
            return False
        
        # 解析 IP 并检查是否为内网
        import socket
        ip = socket.gethostbyname(parsed.hostname)
        if is_private_ip(ip):
            return False
        
        return True
    except Exception:
        return False

# ✅ 安全：验证 URL 后请求
@app.get("/fetch")
def fetch_url(url: str):
    if not validate_url(url):
        raise HTTPException(status_code=400, detail="URL not allowed")
    
    response = requests.get(url, timeout=10)
    return response.text

# ✅ 安全：使用代理服务
def fetch_external_url(url: str) -> str:
    """通过代理服务获取外部 URL"""
    # 代理服务会进行安全检查
    proxy_url = f"https://proxy.internal/fetch?url={url}"
    return requests.get(proxy_url).text
```

---

## 审查检查清单

### SQL 注入
- [ ] 无字符串拼接/格式化构建 SQL
- [ ] 使用参数化查询或 ORM
- [ ] 动态表名/列名有白名单验证

### 命令注入
- [ ] 无 `os.system()` / `os.popen()`
- [ ] `subprocess` 无 `shell=True` + 用户输入
- [ ] 优先使用 Python 原生方法

### 反序列化
- [ ] 无 `pickle.loads()` 处理不可信数据
- [ ] YAML 使用 `safe_load`
- [ ] 优先使用 JSON

### 路径遍历
- [ ] 文件路径有规范化和验证
- [ ] 文件名有白名单验证
- [ ] 上传文件有类型和大小限制

### 敏感信息
- [ ] 密钥从环境变量读取
- [ ] 日志无敏感信息
- [ ] 响应排除敏感字段

### 密码安全
- [ ] 使用 bcrypt/argon2 哈希
- [ ] 密码比较使用常量时间
- [ ] 有密码强度验证

### 随机数
- [ ] 安全场景使用 `secrets` 模块
- [ ] 无 `random` 生成令牌/密码

---

**版本**: 1.0.0  
**更新时间**: 2025-12-30
