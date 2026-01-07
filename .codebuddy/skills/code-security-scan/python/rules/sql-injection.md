# Python SQL 注入检测规则

## 规则概述

| 规则ID | PY-001 |
|--------|--------|
| 名称 | SQL 注入 |
| 风险等级 | 🔴 严重 |
| CWE | CWE-89 |

---

## 检测模式

### 1. 字符串拼接/格式化 SQL

**危险模式**:
```python
# ❌ 危险：字符串拼接
query = "SELECT * FROM users WHERE name = '" + name + "'"
query = "SELECT * FROM users WHERE id = " + str(user_id)

# ❌ 危险：% 格式化
query = "SELECT * FROM users WHERE name = '%s'" % name
query = "SELECT * FROM users WHERE id = %d" % user_id

# ❌ 危险：f-string
query = f"SELECT * FROM users WHERE name = '{name}'"
query = f"DELETE FROM users WHERE id = {user_id}"

# ❌ 危险：format()
query = "SELECT * FROM users WHERE name = '{}'".format(name)
```

**检测正则**:
```regex
(SELECT|INSERT|UPDATE|DELETE|WHERE).*?["']\s*\+\s*
(SELECT|INSERT|UPDATE|DELETE|WHERE).*?%\s*\(
f["'].*?(SELECT|INSERT|UPDATE|DELETE|WHERE).*?\{
\.format\s*\(.*?(SELECT|INSERT|UPDATE|DELETE)
```

**安全写法**:
```python
# ✅ 安全：参数化查询
cursor.execute("SELECT * FROM users WHERE name = %s", (name,))
cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
```

---

### 2. ORM 不安全使用

**危险模式**:
```python
# ❌ 危险：Django raw SQL
User.objects.raw(f"SELECT * FROM users WHERE name = '{name}'")
User.objects.raw("SELECT * FROM users WHERE name = '%s'" % name)

# ❌ 危险：Django extra()
User.objects.extra(where=["name = '%s'" % name])

# ❌ 危险：SQLAlchemy text()
from sqlalchemy import text
session.execute(text(f"SELECT * FROM users WHERE name = '{name}'"))
```

**检测正则**:
```regex
\.raw\s*\(\s*f["']
\.raw\s*\(\s*["'].*?%
\.extra\s*\(\s*where\s*=\s*\[.*?%
text\s*\(\s*f["']
```

**安全写法**:
```python
# ✅ 安全：Django ORM
User.objects.filter(name=name)
User.objects.raw("SELECT * FROM users WHERE name = %s", [name])

# ✅ 安全：SQLAlchemy
from sqlalchemy import text
session.execute(text("SELECT * FROM users WHERE name = :name"), {"name": name})
```

---

### 3. 数据库连接器不安全使用

**危险模式**:
```python
# ❌ 危险：psycopg2
import psycopg2
cursor.execute(f"SELECT * FROM users WHERE name = '{name}'")

# ❌ 危险：mysql-connector
import mysql.connector
cursor.execute("SELECT * FROM users WHERE name = '%s'" % name)

# ❌ 危险：sqlite3
import sqlite3
cursor.execute("SELECT * FROM users WHERE name = '" + name + "'")
```

**安全写法**:
```python
# ✅ 安全：psycopg2
cursor.execute("SELECT * FROM users WHERE name = %s", (name,))

# ✅ 安全：mysql-connector
cursor.execute("SELECT * FROM users WHERE name = %s", (name,))

# ✅ 安全：sqlite3
cursor.execute("SELECT * FROM users WHERE name = ?", (name,))
```

---

## 修复建议

### 1. 使用参数化查询

```python
# 通用模式
def safe_query(cursor, name):
    # 使用占位符，不同数据库占位符可能不同
    # MySQL/PostgreSQL: %s
    # SQLite: ?
    cursor.execute("SELECT * FROM users WHERE name = %s", (name,))
    return cursor.fetchall()
```

### 2. 使用 ORM

```python
# Django
from django.db.models import Q
users = User.objects.filter(Q(name=name) | Q(email=email))

# SQLAlchemy
from sqlalchemy.orm import Session
users = session.query(User).filter(User.name == name).all()
```

### 3. 输入验证

```python
import re

def validate_username(username: str) -> bool:
    """只允许字母数字下划线"""
    return bool(re.match(r'^[a-zA-Z0-9_]+$', username))

def safe_get_user(username: str):
    if not validate_username(username):
        raise ValueError("Invalid username")
    return User.objects.get(username=username)
```

---

## 参考资源

- [OWASP SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection)
- [Django SQL Injection Protection](https://docs.djangoproject.com/en/4.0/topics/security/#sql-injection-protection)
