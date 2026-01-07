# Python 敏感信息泄露检测规则

## 规则概述

| 规则ID | PY-003 |
|--------|--------|
| 名称 | 敏感信息泄露 |
| 风险等级 | 🟠 高危 |
| CWE | CWE-200, CWE-532 |

---

## 检测模式

### 1. 硬编码敏感信息

**危险模式**:
```python
# ❌ 危险：硬编码密码/密钥
password = "admin123"
api_key = "sk-xxxxxxxxxxxx"
secret_key = "my-secret-key"
db_password = "root123"

# ❌ 危险：配置字典中硬编码
config = {
    "database": {
        "password": "root123",
    },
    "jwt_secret": "jwt-secret-key",
}

# ❌ 危险：Django settings
SECRET_KEY = 'django-insecure-xxxxxxxxx'
```

**检测正则**:
```regex
(password|passwd|pwd|secret|api_key|apikey|token|credential)\s*=\s*["'][^"']+["']
["'](password|secret|key|token)["']\s*:\s*["'][^"']+["']
SECRET_KEY\s*=\s*["'][^"']+["']
```

**安全写法**:
```python
# ✅ 安全：使用环境变量
import os
password = os.environ.get("DB_PASSWORD")
api_key = os.getenv("API_KEY")

# ✅ 安全：使用 python-decouple
from decouple import config
SECRET_KEY = config('SECRET_KEY')
```

---

### 2. 日志打印敏感信息

**危险模式**:
```python
# ❌ 危险：日志打印敏感数据
import logging
logging.info(f"User password: {password}")
logging.debug(f"API Key: {api_key}")
print(f"Token: {token}")

# ❌ 危险：打印完整用户对象
logger.info(f"User: {user}")  # user 可能包含密码
```

**检测正则**:
```regex
(logging|logger)\.(info|debug|warning|error)\s*\(.*?(password|token|secret|key|credential)
print\s*\(.*?(password|token|secret|key|credential)
```

**安全写法**:
```python
# ✅ 安全：脱敏处理
def mask_sensitive(value: str) -> str:
    if len(value) <= 4:
        return "****"
    return value[:2] + "****" + value[-2:]

logging.info(f"API Key: {mask_sensitive(api_key)}")

# ✅ 安全：只记录必要信息
logger.info(f"User login: user_id={user.id}")
```

---

### 3. 异常信息泄露

**危险模式**:
```python
# ❌ 危险：返回详细错误信息
@app.route('/api/data')
def get_data():
    try:
        return fetch_data()
    except Exception as e:
        return {"error": str(e), "traceback": traceback.format_exc()}

# ❌ 危险：Flask debug 模式
app.run(debug=True)
```

**检测正则**:
```regex
traceback\.(format_exc|print_exc)\s*\(
["']traceback["']\s*:\s*traceback
debug\s*=\s*True
DEBUG\s*=\s*True
```

**安全写法**:
```python
# ✅ 安全：返回通用错误
@app.route('/api/data')
def get_data():
    try:
        return fetch_data()
    except Exception as e:
        logger.exception("Error fetching data")  # 仅记录到日志
        return {"error": "Internal Server Error"}, 500

# ✅ 安全：生产环境关闭 debug
app.run(debug=os.getenv('FLASK_ENV') == 'development')
```

---

### 4. 源码注释泄露

**危险模式**:
```python
# ❌ 危险：注释中包含敏感信息
# TODO: 临时密码 admin123，上线前删除
# 测试账号: test@example.com / password123
# API Key: sk-xxxxxxxx

"""
数据库连接信息:
host: 192.168.1.100
password: root123
"""
```

**检测正则**:
```regex
#.*?(password|密码|账号|key|secret)\s*[:=]?\s*\S+
""".*?(password|密码|账号|key|secret).*?"""
```

---

### 5. 响应中暴露敏感字段

**危险模式**:
```python
# ❌ 危险：返回完整模型
@app.route('/api/user/<id>')
def get_user(id):
    user = User.query.get(id)
    return jsonify(user.__dict__)  # 可能包含 password_hash

# ❌ 危险：Django 序列化所有字段
from django.core import serializers
data = serializers.serialize('json', User.objects.all())
```

**安全写法**:
```python
# ✅ 安全：使用 Schema 过滤
from marshmallow import Schema, fields

class UserSchema(Schema):
    id = fields.Int()
    name = fields.Str()
    email = fields.Str()
    # 不包含 password_hash

@app.route('/api/user/<id>')
def get_user(id):
    user = User.query.get(id)
    return UserSchema().dump(user)

# ✅ 安全：Pydantic 模型
from pydantic import BaseModel

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    
    class Config:
        # 排除敏感字段
        fields = {'password': {'exclude': True}}
```

---

## 修复建议

### 1. 环境变量管理

```python
# .env 文件（不提交到 Git）
DB_PASSWORD=xxx
JWT_SECRET=xxx

# 使用 python-dotenv
from dotenv import load_dotenv
load_dotenv()

password = os.getenv("DB_PASSWORD")
```

### 2. 配置管理

```python
# 使用 pydantic-settings
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    db_password: str
    jwt_secret: str
    
    class Config:
        env_file = ".env"

settings = Settings()
```

### 3. 日志过滤器

```python
import logging
import re

class SensitiveDataFilter(logging.Filter):
    PATTERNS = [
        (re.compile(r'password["\']?\s*[:=]\s*["\']?(\S+)'), r'password=****'),
        (re.compile(r'token["\']?\s*[:=]\s*["\']?(\S+)'), r'token=****'),
    ]
    
    def filter(self, record):
        msg = record.getMessage()
        for pattern, replacement in self.PATTERNS:
            msg = pattern.sub(replacement, msg)
        record.msg = msg
        record.args = ()
        return True

logger = logging.getLogger()
logger.addFilter(SensitiveDataFilter())
```

---

## 参考资源

- [OWASP Sensitive Data Exposure](https://owasp.org/www-project-web-security-testing-guide/)
- [Django Security](https://docs.djangoproject.com/en/4.0/topics/security/)
- [Flask Security](https://flask.palletsprojects.com/en/2.0.x/security/)
