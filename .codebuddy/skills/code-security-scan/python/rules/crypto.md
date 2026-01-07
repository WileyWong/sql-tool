# Python 不安全加密检测规则

## 规则概述

| 规则ID | PY-004 |
|--------|--------|
| 名称 | 不安全加密 |
| 风险等级 | 🟠 高危 |
| CWE | CWE-327, CWE-328 |

---

## 检测模式

### 1. 弱哈希算法

**危险模式**:
```python
# ❌ 危险：MD5 用于密码或安全场景
import hashlib
hash = hashlib.md5(password.encode()).hexdigest()
hash = hashlib.sha1(data.encode()).hexdigest()

# ❌ 危险：使用 crypt 模块
import crypt
hash = crypt.crypt(password)
```

**检测正则**:
```regex
hashlib\.(md5|sha1)\s*\(
import\s+crypt
crypt\.crypt\s*\(
```

**安全写法**:
```python
# ✅ 安全：使用 SHA-256 或更强（非密码场景）
import hashlib
hash = hashlib.sha256(data.encode()).hexdigest()

# ✅ 安全：密码使用 bcrypt
import bcrypt
hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())

# ✅ 安全：或使用 argon2
from argon2 import PasswordHasher
ph = PasswordHasher()
hash = ph.hash(password)
```

---

### 2. 不安全的随机数

**危险模式**:
```python
# ❌ 危险：使用 random 模块生成安全相关的随机数
import random
token = random.randint(0, 999999)
code = ''.join(random.choices('0123456789', k=6))
random.seed(time.time())  # 可预测的种子
```

**检测正则**:
```regex
import\s+random
random\.(randint|choice|choices|random|seed)\s*\(
```

**安全写法**:
```python
# ✅ 安全：使用 secrets 模块
import secrets
token = secrets.token_hex(32)
code = secrets.token_urlsafe(16)
random_int = secrets.randbelow(1000000)

# ✅ 安全：使用 os.urandom
import os
random_bytes = os.urandom(32)
```

---

### 3. 硬编码加密密钥

**危险模式**:
```python
# ❌ 危险：硬编码密钥
key = b'my-secret-key-16'
cipher = AES.new(key, AES.MODE_CBC)

SECRET_KEY = "hardcoded-secret-key"
ENCRYPTION_KEY = b'0123456789abcdef'
```

**检测正则**:
```regex
(key|KEY)\s*=\s*b?["'][^"']+["']
AES\.new\s*\(\s*b?["']
SECRET_KEY\s*=\s*["'][^"']+["']
```

**安全写法**:
```python
# ✅ 安全：从环境变量获取
import os
key = os.environ.get('ENCRYPTION_KEY').encode()

# ✅ 安全：使用密钥派生
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
import os

salt = os.urandom(16)
kdf = PBKDF2HMAC(
    algorithm=hashes.SHA256(),
    length=32,
    salt=salt,
    iterations=100000,
)
key = kdf.derive(password.encode())
```

---

### 4. 不安全的加密模式

**危险模式**:
```python
# ❌ 危险：ECB 模式
from Crypto.Cipher import AES
cipher = AES.new(key, AES.MODE_ECB)

# ❌ 危险：CBC 无 HMAC 验证
cipher = AES.new(key, AES.MODE_CBC, iv)
ciphertext = cipher.encrypt(plaintext)  # 无完整性验证
```

**检测正则**:
```regex
AES\.MODE_ECB
MODE_ECB
```

**安全写法**:
```python
# ✅ 安全：使用 GCM 模式（带认证）
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import os

key = os.urandom(32)
nonce = os.urandom(12)
aesgcm = AESGCM(key)
ciphertext = aesgcm.encrypt(nonce, plaintext, associated_data)
```

---

### 5. 不安全的 SSL/TLS 配置

**危险模式**:
```python
# ❌ 危险：禁用证书验证
import requests
requests.get(url, verify=False)

import urllib3
urllib3.disable_warnings()

# ❌ 危险：使用不安全的 SSL 上下文
import ssl
context = ssl._create_unverified_context()
context = ssl.SSLContext(ssl.PROTOCOL_SSLv3)
```

**检测正则**:
```regex
verify\s*=\s*False
disable_warnings\s*\(
_create_unverified_context\s*\(
PROTOCOL_SSLv[23]
PROTOCOL_TLSv1\b
```

**安全写法**:
```python
# ✅ 安全：启用证书验证
import requests
requests.get(url, verify=True)  # 默认值
requests.get(url, verify='/path/to/ca-bundle.crt')

# ✅ 安全：使用安全的 SSL 上下文
import ssl
context = ssl.create_default_context()
context.minimum_version = ssl.TLSVersion.TLSv1_2
```

---

## 修复建议

### 1. 密码哈希最佳实践

```python
# 使用 passlib
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(password: str, hashed: str) -> bool:
    return pwd_context.verify(password, hashed)
```

### 2. 安全的对称加密

```python
from cryptography.fernet import Fernet

# 生成密钥
key = Fernet.generate_key()

# 加密
f = Fernet(key)
encrypted = f.encrypt(b"secret message")

# 解密
decrypted = f.decrypt(encrypted)
```

### 3. 安全的随机数生成

```python
import secrets

# 生成安全的随机 token
token = secrets.token_hex(32)  # 64 字符的十六进制字符串
token = secrets.token_urlsafe(32)  # URL 安全的 base64 字符串

# 生成安全的随机整数
code = secrets.randbelow(1000000)  # 0 到 999999

# 安全的随机选择
secrets.choice(['a', 'b', 'c'])
```

---

## 参考资源

- [OWASP Cryptographic Failures](https://owasp.org/Top10/A02_2021-Cryptographic_Failures/)
- [Python cryptography 库](https://cryptography.io/)
- [Python secrets 模块](https://docs.python.org/3/library/secrets.html)
