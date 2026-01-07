# Python 代码审查指南

基于 Python 最佳实践的专业代码审查，支持 Django/Flask/FastAPI 等主流框架。

> 📚 **参考**: [PEP 8](https://peps.python.org/pep-0008/)、[Google Python Style Guide](https://google.github.io/styleguide/pyguide.html)
> 📁 **输出路径**: `workspace/{变更ID}/cr/cr-python-{时间戳}.md`
> ⚠️ **版本说明**: 本指南涵盖 Python 3.8 - 3.12 特性，请根据项目目标版本选择适用内容

## 审查重点

| 维度 | 权重 | 检查要点 |
|------|------|---------|
| 代码规范 | 20% | PEP 8、命名、格式、docstring、导入组织 |
| 类型安全 | 15% | 类型注解、mypy 检查、泛型使用、Optional |
| 异常处理 | 15% | 异常捕获、上下文管理器、自定义异常、异常链 |
| 安全防护 | 20% | SQL 注入、命令注入、反序列化、敏感信息、路径遍历 |
| 性能优化 | 15% | 生成器、缓存、异步编程、数据结构选择 |
| 可维护性 | 15% | 测试覆盖、依赖管理、文档、复杂度控制 |

## 代码规范审查

### 命名规范

```python
# ✅ 变量和函数：snake_case
user_name = "John"
def get_user_by_id(user_id: int) -> User:
    pass

# ✅ 类名：PascalCase
class UserService:
    pass

# ✅ 常量：UPPER_CASE
MAX_RETRY_COUNT = 3
DEFAULT_TIMEOUT = 30

# ✅ 私有成员：单下划线前缀
class User:
    def __init__(self):
        self._internal_state = {}  # 内部使用
    
    def _validate(self):  # 内部方法
        pass

# ✅ 名称修饰（避免子类覆盖）：双下划线前缀
class Base:
    def __init__(self):
        self.__private = "name mangled"

# ❌ 命名问题
userName = "John"      # 应该用 snake_case
def GetUser(): pass    # 应该用 snake_case
class user_service:    # 应该用 PascalCase
    pass
```

### 导入组织

```python
# ✅ 正确的导入顺序（isort 标准）
# 1. 标准库
import os
import sys
from datetime import datetime
from typing import Dict, List, Optional

# 2. 第三方库
import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

# 3. 本地模块
from myproject.models import User
from myproject.services import UserService

# ❌ 导入问题
from myproject.models import *  # 禁止通配符导入
import os, sys  # 每个导入单独一行
```

### Docstring 规范

```python
# ✅ Google 风格 Docstring
def get_user_by_id(user_id: int, include_deleted: bool = False) -> Optional[User]:
    """根据 ID 获取用户信息。
    
    从数据库中查询指定 ID 的用户，支持查询已删除用户。
    
    Args:
        user_id: 用户唯一标识符。
        include_deleted: 是否包含已删除的用户，默认为 False。
    
    Returns:
        找到的用户对象，如果不存在返回 None。
    
    Raises:
        ValueError: 如果 user_id 小于等于 0。
        DatabaseError: 如果数据库连接失败。
    
    Example:
        >>> user = get_user_by_id(123)
        >>> print(user.name)
        'John'
    """
    if user_id <= 0:
        raise ValueError("user_id must be positive")
    return user_repository.find_by_id(user_id, include_deleted)


# ✅ 类的 Docstring
class UserService:
    """用户服务类，处理用户相关的业务逻辑。
    
    提供用户的增删改查、认证、权限管理等功能。
    
    Attributes:
        repository: 用户数据访问层。
        cache: 缓存服务实例。
    """
    
    def __init__(self, repository: UserRepository, cache: Cache):
        self.repository = repository
        self.cache = cache
```

### 格式化规范

```python
# ✅ 行长度：不超过 88 字符（Black 默认）或 79 字符（PEP 8）

# ✅ 缩进：4 个空格
def example():
    if condition:
        do_something()

# ✅ 空行规范
# - 顶级定义之间：2 个空行
# - 类内方法之间：1 个空行

class MyClass:
    
    def method_one(self):
        pass
    
    def method_two(self):
        pass


def top_level_function():
    pass

# ✅ 运算符周围空格
x = 1 + 2
y = x * 3
result = func(a=1, b=2)

# ✅ 长行换行
result = some_function(
    argument_one,
    argument_two,
    argument_three,
)

# ✅ 字典和列表
config = {
    "host": "localhost",
    "port": 8080,
    "debug": True,
}
```

## 类型安全审查

### 类型注解基础

```python
# ✅ 函数类型注解
def greet(name: str) -> str:
    return f"Hello, {name}"

def process_items(items: list[int]) -> dict[str, int]:  # Python 3.9+
    return {"count": len(items), "sum": sum(items)}

# ✅ 变量类型注解
user_id: int = 123
names: list[str] = ["Alice", "Bob"]
config: dict[str, Any] = {}

# ✅ Optional 类型（可能为 None）
from typing import Optional

def find_user(user_id: int) -> Optional[User]:
    """返回用户或 None"""
    return db.query(User).filter_by(id=user_id).first()

# ✅ Union 类型
from typing import Union

def parse_id(value: Union[int, str]) -> int:  # Python 3.9 以下
    return int(value)

def parse_id(value: int | str) -> int:  # Python 3.10+
    return int(value)
```

### 泛型类型

```python
from typing import TypeVar, Generic, Callable

T = TypeVar("T")
K = TypeVar("K")
V = TypeVar("V")

# ✅ 泛型函数
def first(items: list[T]) -> Optional[T]:
    return items[0] if items else None

# ✅ 泛型类
class Repository(Generic[T]):
    def __init__(self, model_class: type[T]):
        self.model_class = model_class
    
    def get_by_id(self, id: int) -> Optional[T]:
        pass
    
    def save(self, entity: T) -> T:
        pass

# ✅ Callable 类型
def retry(func: Callable[..., T], times: int = 3) -> T:
    for i in range(times):
        try:
            return func()
        except Exception:
            if i == times - 1:
                raise

# ✅ TypedDict（结构化字典）
from typing import TypedDict

class UserDict(TypedDict):
    id: int
    name: str
    email: str
    age: int  # 可选字段用 NotRequired[int]（Python 3.11+）
```

### 类型注解常见问题

```python
# ❌ 错误 1: 使用 list 而非 List（Python 3.8 以下）
def process(items: list[int]) -> None:  # Python 3.8 报错
    pass

# ✅ 正确: Python 3.8 使用 typing.List
from typing import List
def process(items: List[int]) -> None:
    pass

# ❌ 错误 2: Optional 误用
def get_user(id: int) -> User:  # 实际可能返回 None
    return db.query(User).get(id)

# ✅ 正确: 明确 Optional
def get_user(id: int) -> Optional[User]:
    return db.query(User).get(id)

# ❌ 错误 3: Any 滥用
def process(data: Any) -> Any:  # 失去类型检查意义
    pass

# ✅ 正确: 使用具体类型或泛型
def process(data: dict[str, Any]) -> ProcessResult:
    pass

# ❌ 错误 4: 可变默认参数类型
def add_item(item: str, items: list[str] = []) -> list[str]:  # 危险！
    items.append(item)
    return items

# ✅ 正确: 使用 None 作为默认值
def add_item(item: str, items: Optional[list[str]] = None) -> list[str]:
    if items is None:
        items = []
    items.append(item)
    return items
```

## 异常处理审查

### 异常捕获规范

```python
# ✅ 捕获具体异常
try:
    result = int(user_input)
except ValueError as e:
    logger.warning(f"Invalid input: {user_input}")
    raise ValidationError("请输入有效的数字") from e

# ✅ 多异常捕获
try:
    data = fetch_data(url)
except (ConnectionError, TimeoutError) as e:
    logger.error(f"Network error: {e}")
    raise ServiceUnavailableError("服务暂时不可用") from e

# ❌ 裸 except（捕获所有异常包括 KeyboardInterrupt）
try:
    do_something()
except:  # 危险！
    pass

# ❌ 捕获 Exception 但不处理
try:
    do_something()
except Exception:
    pass  # 吞掉异常，难以调试

# ✅ 如果必须捕获 Exception，至少记录日志
try:
    do_something()
except Exception as e:
    logger.exception("Unexpected error occurred")
    raise
```

### 异常链

```python
# ✅ 使用 raise from 保留异常链
class UserNotFoundError(Exception):
    pass

def get_user(user_id: int) -> User:
    try:
        return db.query(User).filter_by(id=user_id).one()
    except NoResultFound as e:
        raise UserNotFoundError(f"User {user_id} not found") from e

# ✅ 显式断开异常链（隐藏内部实现）
def authenticate(token: str) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY)
        return get_user(payload["user_id"])
    except jwt.InvalidTokenError:
        raise AuthenticationError("Invalid token") from None  # 隐藏原始异常
```

### 上下文管理器

```python
# ✅ 使用 with 语句管理资源
with open("file.txt", "r") as f:
    content = f.read()

# ✅ 多个上下文管理器
with open("input.txt") as fin, open("output.txt", "w") as fout:
    fout.write(fin.read())

# ✅ 自定义上下文管理器
from contextlib import contextmanager

@contextmanager
def timer(name: str):
    start = time.time()
    try:
        yield
    finally:
        elapsed = time.time() - start
        logger.info(f"{name} took {elapsed:.2f}s")

with timer("database_query"):
    results = db.query(User).all()

# ✅ 类实现上下文管理器
class DatabaseConnection:
    def __enter__(self):
        self.conn = create_connection()
        return self.conn
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.conn.close()
        return False  # 不抑制异常

# ❌ 资源未正确关闭
f = open("file.txt")
content = f.read()
# 忘记 f.close()，文件句柄泄漏
```

### 自定义异常

```python
# ✅ 业务异常层次结构
class AppError(Exception):
    """应用程序基础异常"""
    def __init__(self, message: str, code: str = "UNKNOWN"):
        self.message = message
        self.code = code
        super().__init__(message)


class ValidationError(AppError):
    """输入验证错误"""
    def __init__(self, message: str, field: Optional[str] = None):
        super().__init__(message, code="VALIDATION_ERROR")
        self.field = field


class NotFoundError(AppError):
    """资源未找到"""
    def __init__(self, resource: str, identifier: Any):
        message = f"{resource} with id '{identifier}' not found"
        super().__init__(message, code="NOT_FOUND")
        self.resource = resource
        self.identifier = identifier


class PermissionDeniedError(AppError):
    """权限不足"""
    def __init__(self, action: str):
        super().__init__(f"Permission denied for action: {action}", code="FORBIDDEN")
        self.action = action
```

## 安全防护审查

### SQL 注入防护

```python
# ❌ 危险：字符串拼接 SQL
def get_user(username: str):
    query = f"SELECT * FROM users WHERE username = '{username}'"  # SQL 注入！
    return db.execute(query)

# ❌ 危险：format 格式化
def get_user(username: str):
    query = "SELECT * FROM users WHERE username = '{}'".format(username)
    return db.execute(query)

# ✅ 安全：参数化查询
def get_user(username: str):
    query = "SELECT * FROM users WHERE username = %s"
    return db.execute(query, (username,))

# ✅ 安全：使用 ORM
def get_user(username: str) -> Optional[User]:
    return User.query.filter_by(username=username).first()

# ✅ SQLAlchemy 参数化
from sqlalchemy import text

def search_users(keyword: str):
    query = text("SELECT * FROM users WHERE name LIKE :keyword")
    return db.execute(query, {"keyword": f"%{keyword}%"})
```

### 命令注入防护

```python
import subprocess
import shlex

# ❌ 危险：shell=True + 字符串拼接
def run_command(filename: str):
    subprocess.run(f"cat {filename}", shell=True)  # 命令注入！

# ❌ 危险：用户输入直接拼接
def compress(filename: str):
    os.system(f"gzip {filename}")  # 命令注入！

# ✅ 安全：参数列表（禁止 shell=True）
def run_command(filename: str):
    subprocess.run(["cat", filename], check=True)

# ✅ 安全：shlex.quote 转义（如果必须用 shell）
def run_command(filename: str):
    safe_filename = shlex.quote(filename)
    subprocess.run(f"cat {safe_filename}", shell=True, check=True)

# ✅ 最佳：避免调用外部命令，使用 Python 原生方法
def read_file(filename: str) -> str:
    with open(filename, "r") as f:
        return f.read()
```

### 反序列化安全

```python
import pickle
import yaml
import json

# ❌ 危险：pickle 反序列化不可信数据
def load_data(data: bytes):
    return pickle.loads(data)  # 任意代码执行！

# ❌ 危险：yaml.load 不安全
def load_config(content: str):
    return yaml.load(content)  # 任意代码执行！

# ✅ 安全：使用 yaml.safe_load
def load_config(content: str):
    return yaml.safe_load(content)

# ✅ 安全：使用 JSON（无代码执行风险）
def load_data(content: str):
    return json.loads(content)

# ✅ 如果必须用 pickle，验证来源
import hmac

def load_signed_data(data: bytes, signature: bytes, secret: bytes):
    expected_sig = hmac.new(secret, data, "sha256").digest()
    if not hmac.compare_digest(signature, expected_sig):
        raise SecurityError("Invalid signature")
    return pickle.loads(data)
```

### 敏感信息保护

```python
import os
import logging

# ❌ 危险：硬编码密钥
SECRET_KEY = "my-secret-key-12345"  # 泄露风险！
DATABASE_URL = "mysql://root:password@localhost/db"

# ✅ 安全：使用环境变量
SECRET_KEY = os.environ["SECRET_KEY"]
DATABASE_URL = os.environ["DATABASE_URL"]

# ✅ 安全：使用配置文件 + .gitignore
from dotenv import load_dotenv
load_dotenv()

# ❌ 危险：日志打印敏感信息
def login(username: str, password: str):
    logger.info(f"Login attempt: {username}, {password}")  # 密码泄露！

# ✅ 安全：日志脱敏
def login(username: str, password: str):
    logger.info(f"Login attempt: {username}")

# ✅ 响应中排除敏感字段
class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    # password 不包含在响应中

    class Config:
        # 排除敏感字段
        fields = {"password": {"exclude": True}}
```

### 路径遍历防护

```python
import os
from pathlib import Path

UPLOAD_DIR = "/var/uploads"

# ❌ 危险：直接拼接用户输入
def get_file(filename: str):
    filepath = os.path.join(UPLOAD_DIR, filename)
    return open(filepath).read()  # ../../../etc/passwd 攻击！

# ✅ 安全：验证路径在允许目录内
def get_file(filename: str) -> str:
    # 规范化路径
    base = Path(UPLOAD_DIR).resolve()
    filepath = (base / filename).resolve()
    
    # 确保在允许目录内
    if not str(filepath).startswith(str(base)):
        raise SecurityError("Invalid file path")
    
    if not filepath.exists():
        raise FileNotFoundError(f"File not found: {filename}")
    
    return filepath.read_text()

# ✅ 安全：白名单验证文件名
import re

def validate_filename(filename: str) -> bool:
    # 只允许字母、数字、下划线、点
    return bool(re.match(r'^[\w\-. ]+$', filename))
```

## 性能优化审查

### 生成器使用

```python
# ❌ 内存问题：一次性加载大数据集
def get_all_users() -> list[User]:
    return list(db.query(User).all())  # 内存爆炸！

# ✅ 使用生成器逐条处理
def get_all_users():
    for user in db.query(User).yield_per(1000):
        yield user

# ✅ 使用生成器表达式
squares = (x ** 2 for x in range(1000000))  # 惰性计算

# ❌ 列表推导处理大数据
squares = [x ** 2 for x in range(1000000)]  # 立即分配内存

# ✅ 文件逐行处理
def process_large_file(filepath: str):
    with open(filepath) as f:
        for line in f:  # 逐行读取，内存友好
            yield process_line(line)
```

### 缓存优化

```python
from functools import lru_cache, cached_property

# ✅ 函数结果缓存
@lru_cache(maxsize=128)
def get_user_permissions(user_id: int) -> set[str]:
    """缓存用户权限，避免重复查询"""
    return set(db.query(Permission).filter_by(user_id=user_id))

# ✅ 属性缓存（Python 3.8+）
class User:
    @cached_property
    def full_name(self) -> str:
        """只计算一次"""
        return f"{self.first_name} {self.last_name}"

# ✅ 带过期时间的缓存
from cachetools import TTLCache

cache = TTLCache(maxsize=100, ttl=300)  # 5 分钟过期

def get_config(key: str) -> Any:
    if key not in cache:
        cache[key] = load_config_from_db(key)
    return cache[key]

# ⚠️ 注意：lru_cache 不适用于可变参数
@lru_cache
def bad_cache(items: list):  # list 不可哈希，报错！
    pass

# ✅ 转换为不可变类型
@lru_cache
def good_cache(items: tuple):
    pass
```

### 异步编程

```python
import asyncio
import aiohttp

# ✅ 异步 HTTP 请求
async def fetch_url(url: str) -> str:
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.text()

# ✅ 并发执行多个请求
async def fetch_all(urls: list[str]) -> list[str]:
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_url(session, url) for url in urls]
        return await asyncio.gather(*tasks)

# ✅ 异步上下文管理器
class AsyncDatabase:
    async def __aenter__(self):
        self.conn = await create_async_connection()
        return self.conn
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.conn.close()

# ❌ 在异步函数中使用同步阻塞调用
async def bad_async():
    time.sleep(1)  # 阻塞整个事件循环！
    requests.get(url)  # 同步 HTTP，阻塞！

# ✅ 使用异步版本
async def good_async():
    await asyncio.sleep(1)
    async with aiohttp.ClientSession() as session:
        await session.get(url)

# ✅ 如果必须调用同步代码，使用线程池
async def call_sync_in_async():
    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(None, sync_function)
    return result
```

### 数据结构选择

```python
from collections import defaultdict, Counter, deque
from dataclasses import dataclass

# ✅ defaultdict 避免 KeyError
word_count: dict[str, int] = defaultdict(int)
for word in words:
    word_count[word] += 1

# ✅ Counter 计数
from collections import Counter
word_count = Counter(words)
most_common = word_count.most_common(10)

# ✅ deque 双端队列（O(1) 两端操作）
from collections import deque
queue: deque[Task] = deque(maxlen=100)
queue.append(task)      # 右端添加
queue.appendleft(task)  # 左端添加
task = queue.popleft()  # 左端弹出

# ✅ set 快速查找（O(1)）
valid_ids: set[int] = {1, 2, 3, 4, 5}
if user_id in valid_ids:  # O(1)
    pass

# ❌ list 查找（O(n)）
valid_ids: list[int] = [1, 2, 3, 4, 5]
if user_id in valid_ids:  # O(n)
    pass

# ✅ dataclass 替代普通类
@dataclass
class User:
    id: int
    name: str
    email: str
    
    def __post_init__(self):
        self.email = self.email.lower()

# ✅ dataclass frozen（不可变）
@dataclass(frozen=True)
class Point:
    x: float
    y: float
```

## 可维护性审查

### 代码复杂度

| 指标 | 阈值 |
|------|------|
| 函数行数 | ≤ 50 行 |
| 圈复杂度 | ≤ 10 |
| 嵌套层级 | ≤ 4 层 |
| 参数数量 | ≤ 5 个 |
| 类行数 | ≤ 300 行 |

```python
# ❌ 过深嵌套
def process(data):
    if data:
        for item in data:
            if item.is_valid:
                for sub in item.children:
                    if sub.active:
                        # 5 层嵌套，难以阅读

# ✅ 提前返回，减少嵌套
def process(data):
    if not data:
        return
    
    for item in data:
        if not item.is_valid:
            continue
        process_item(item)

def process_item(item):
    for sub in item.children:
        if sub.active:
            handle_sub(sub)

# ❌ 参数过多
def create_user(name, email, age, address, phone, company, role, department):
    pass

# ✅ 使用数据类封装
@dataclass
class CreateUserRequest:
    name: str
    email: str
    age: int
    address: str
    phone: str
    company: str
    role: str
    department: str

def create_user(request: CreateUserRequest):
    pass
```

### 测试覆盖

```python
import pytest
from unittest.mock import Mock, patch

# ✅ 单元测试
def test_get_user_by_id():
    user = get_user_by_id(1)
    assert user is not None
    assert user.id == 1

# ✅ 参数化测试
@pytest.mark.parametrize("input,expected", [
    (1, 1),
    (2, 4),
    (3, 9),
])
def test_square(input, expected):
    assert square(input) == expected

# ✅ Mock 外部依赖
def test_send_email():
    with patch("myapp.services.smtp_client") as mock_smtp:
        mock_smtp.send.return_value = True
        result = send_welcome_email("test@example.com")
        assert result is True
        mock_smtp.send.assert_called_once()

# ✅ 异常测试
def test_invalid_user_id():
    with pytest.raises(ValueError, match="must be positive"):
        get_user_by_id(-1)

# ✅ Fixture
@pytest.fixture
def sample_user():
    return User(id=1, name="Test", email="test@example.com")

def test_user_full_name(sample_user):
    assert sample_user.full_name == "Test"
```

### 依赖管理

```toml
# ✅ pyproject.toml（推荐）
[project]
name = "myproject"
version = "1.0.0"
requires-python = ">=3.9"
dependencies = [
    "fastapi>=0.100.0,<1.0.0",
    "sqlalchemy>=2.0.0,<3.0.0",
    "pydantic>=2.0.0,<3.0.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=7.0.0",
    "black>=23.0.0",
    "mypy>=1.0.0",
]
```

```txt
# ✅ requirements.txt（锁定版本）
fastapi==0.104.1
sqlalchemy==2.0.23
pydantic==2.5.2

# ❌ 不锁定版本
fastapi
sqlalchemy
```

## 框架专项检查

针对主流 Python Web 框架的专项审查指南：

| 框架 | 专项指南 | 重点内容 |
|------|----------|----------|
| **Django** | [python-django.md](python-django.md) | ORM 优化、安全配置、视图规范、模型设计、中间件与信号 |
| **Flask** | [python-flask.md](python-flask.md) | 应用结构、蓝图组织、安全配置、扩展使用、请求处理 |
| **FastAPI** | [python-fastapi.md](python-fastapi.md) | Pydantic 模型、依赖注入、异步编程、安全认证、API 设计 |

> 💡 **提示**: 请根据项目使用的框架，阅读对应的专项审查指南获取详细检查要点。

## 检查工具

```bash
# 格式化
black .
isort .

# Lint 检查
flake8 .
pylint .

# 类型检查
mypy --strict .

# 安全扫描
bandit -r .
safety check

# 复杂度检查
radon cc . -a -s

# 测试覆盖
pytest --cov=. --cov-report=html --cov-fail-under=80

# 依赖漏洞
pip-audit
```

## 评分细则

### 代码规范 (20%)

| 子项 | 占比 |
|------|------|
| PEP 8 合规 | 30% |
| 命名规范 | 25% |
| Docstring | 25% |
| 导入组织 | 20% |

### 类型安全 (15%)

| 子项 | 占比 |
|------|------|
| 类型注解覆盖 | 40% |
| mypy 检查通过 | 35% |
| 泛型使用 | 25% |

### 异常处理 (15%)

| 子项 | 占比 |
|------|------|
| 异常捕获规范 | 40% |
| 上下文管理器 | 30% |
| 自定义异常 | 30% |

### 安全防护 (20%)

| 子项 | 占比 |
|------|------|
| SQL 注入防护 | 25% |
| 命令注入防护 | 20% |
| 敏感信息保护 | 25% |
| 反序列化安全 | 15% |
| 路径遍历防护 | 15% |

### 性能优化 (15%)

| 子项 | 占比 |
|------|------|
| 生成器使用 | 30% |
| 缓存策略 | 25% |
| 异步编程 | 25% |
| 数据结构 | 20% |

### 可维护性 (15%)

| 子项 | 占比 |
|------|------|
| 测试覆盖 | 40% |
| 复杂度控制 | 30% |
| 依赖管理 | 30% |

## Python 版本特性速查

| 版本 | 关键特性 | 审查要点 |
|------|----------|----------|
| **Python 3.8** | walrus `:=`、`TypedDict`、`Literal` | 赋值表达式合理使用 |
| **Python 3.9** | 内置泛型 `list[int]`、字典合并 `\|` | 类型注解简化 |
| **Python 3.10** | `match` 语句、`ParamSpec`、`\|` Union | 模式匹配、类型提示增强 |
| **Python 3.11** | 异常组、`Self` 类型、`tomllib` | 异常处理改进 |
| **Python 3.12** | 类型参数语法 `class C[T]`、f-string 增强 | 泛型语法简化 |

## 相关资源

### 框架专项指南
- [Django 专项审查](python-django.md) - ORM 优化、安全配置、视图规范
- [Flask 专项审查](python-flask.md) - 应用结构、蓝图组织、扩展使用
- [FastAPI 专项审查](python-fastapi.md) - Pydantic、依赖注入、异步编程

### 检查清单与示例
- [检查清单](python-checklist.md)
- [类型注解示例](examples/type-hints.md) - 包含泛型、Protocol、TypeGuard
- [异步编程示例](examples/async-await.md) - 包含 asyncio、aiohttp、异步 ORM
- [安全性示例](examples/security.md) - 包含 OWASP Top 10 防护
- [性能优化示例](examples/performance.md) - 包含 profiling、内存优化

---

**版本**: 1.1.0  
**更新时间**: 2025-12-30  
**作者**: spec-code Team
