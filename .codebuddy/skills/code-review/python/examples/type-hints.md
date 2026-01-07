# Python 类型注解审查示例

Python 类型注解的最佳实践与常见问题，覆盖 Python 3.8 - 3.12 特性。

---

## 基础类型注解

### 函数类型注解

```python
# ✅ 正确：完整的类型注解
def greet(name: str) -> str:
    return f"Hello, {name}"

def add(a: int, b: int) -> int:
    return a + b

def process_items(items: list[str]) -> dict[str, int]:  # Python 3.9+
    return {item: len(item) for item in items}

# ❌ 错误：缺少类型注解
def greet(name):  # 参数和返回值都缺少类型
    return f"Hello, {name}"

# ❌ 错误：只有部分注解
def add(a: int, b):  # b 缺少类型
    return a + b
```

### 变量类型注解

```python
# ✅ 正确：变量类型注解
user_id: int = 123
name: str = "Alice"
scores: list[float] = [95.5, 87.0, 92.3]
config: dict[str, Any] = {"debug": True}

# ✅ 正确：类属性注解
class User:
    id: int
    name: str
    email: str | None = None  # Python 3.10+
    
    def __init__(self, id: int, name: str):
        self.id = id
        self.name = name

# ⚠️ 不必要：类型可推断时
count: int = 0  # 可以省略，类型可推断
items: list[str] = []  # 空列表需要注解
```

---

## Optional 与 None 处理

### Optional 正确使用

```python
from typing import Optional

# ✅ 正确：可能返回 None 的函数
def find_user(user_id: int) -> Optional[User]:
    """返回用户或 None"""
    return db.query(User).get(user_id)

# ✅ 正确：Python 3.10+ 使用 | None
def find_user(user_id: int) -> User | None:
    return db.query(User).get(user_id)

# ❌ 错误：返回 None 但未标注
def find_user(user_id: int) -> User:  # 实际可能返回 None！
    return db.query(User).get(user_id)

# ❌ 错误：Optional 作为参数默认值
def process(data: Optional[list[int]] = []):  # 可变默认值！
    pass

# ✅ 正确：使用 None 作为默认值
def process(data: Optional[list[int]] = None) -> list[int]:
    if data is None:
        data = []
    return data
```

### None 检查模式

```python
from typing import Optional

# ✅ 正确：类型收窄
def get_user_name(user: Optional[User]) -> str:
    if user is None:
        return "Anonymous"
    return user.name  # 此处 user 类型收窄为 User

# ✅ 正确：assert 收窄
def process_user(user: Optional[User]) -> None:
    assert user is not None, "User cannot be None"
    print(user.name)  # 类型收窄为 User

# ✅ 正确：早期返回
def get_email(user: Optional[User]) -> str:
    if user is None:
        raise ValueError("User is required")
    return user.email
```

---

## Union 类型

### Union 使用

```python
from typing import Union

# ✅ 正确：Python 3.9 以下
def parse_id(value: Union[int, str]) -> int:
    return int(value)

# ✅ 正确：Python 3.10+ 使用 |
def parse_id(value: int | str) -> int:
    return int(value)

# ✅ 正确：多类型返回
def fetch_data(key: str) -> str | int | None:
    data = cache.get(key)
    return data

# ❌ 错误：过多 Union 类型（设计问题）
def process(value: int | str | float | list | dict | None) -> Any:
    pass  # 考虑重构
```

### 类型收窄

```python
def process_value(value: int | str) -> str:
    # ✅ 使用 isinstance 收窄类型
    if isinstance(value, int):
        return str(value * 2)  # value 是 int
    return value.upper()  # value 是 str

# ✅ 使用 match 语句（Python 3.10+）
def describe(value: int | str | list) -> str:
    match value:
        case int():
            return f"Integer: {value}"
        case str():
            return f"String: {value}"
        case list():
            return f"List with {len(value)} items"
```

---

## 泛型类型

### 泛型函数

```python
from typing import TypeVar, Sequence, Iterable

T = TypeVar("T")
K = TypeVar("K")
V = TypeVar("V")

# ✅ 正确：泛型函数
def first(items: Sequence[T]) -> T | None:
    """返回序列的第一个元素"""
    return items[0] if items else None

def get_or_default(mapping: dict[K, V], key: K, default: V) -> V:
    """获取字典值或默认值"""
    return mapping.get(key, default)

# ✅ 正确：受约束的 TypeVar
from typing import TypeVar

Number = TypeVar("Number", int, float)

def add_numbers(a: Number, b: Number) -> Number:
    return a + b

# ✅ 正确：有边界的 TypeVar
from typing import TypeVar

T_co = TypeVar("T_co", bound="Comparable", covariant=True)
```

### 泛型类

```python
from typing import TypeVar, Generic, Iterator

T = TypeVar("T")

# ✅ 正确：泛型类
class Stack(Generic[T]):
    def __init__(self) -> None:
        self._items: list[T] = []
    
    def push(self, item: T) -> None:
        self._items.append(item)
    
    def pop(self) -> T:
        return self._items.pop()
    
    def __iter__(self) -> Iterator[T]:
        return iter(self._items)

# 使用
stack: Stack[int] = Stack()
stack.push(1)
stack.push(2)
value: int = stack.pop()

# ✅ Python 3.12+ 简化语法
class Stack[T]:
    def __init__(self) -> None:
        self._items: list[T] = []
    
    def push(self, item: T) -> None:
        self._items.append(item)
```

### 泛型协议

```python
from typing import Protocol, TypeVar

T = TypeVar("T")

# ✅ 正确：泛型协议
class Comparable(Protocol):
    def __lt__(self, other: "Comparable") -> bool: ...
    def __gt__(self, other: "Comparable") -> bool: ...

def max_value(a: T, b: T) -> T:
    return a if a > b else b

# ✅ 正确：带泛型的协议
class Repository(Protocol[T]):
    def get(self, id: int) -> T | None: ...
    def save(self, entity: T) -> T: ...
    def delete(self, id: int) -> bool: ...
```

---

## Callable 类型

### 函数类型

```python
from typing import Callable

# ✅ 正确：函数作为参数
def apply(func: Callable[[int], int], value: int) -> int:
    return func(value)

def double(x: int) -> int:
    return x * 2

result = apply(double, 5)  # 10

# ✅ 正确：多参数函数
def map_items(
    func: Callable[[str, int], bool],
    items: list[tuple[str, int]]
) -> list[bool]:
    return [func(name, value) for name, value in items]

# ✅ 正确：返回函数的函数
def create_multiplier(factor: int) -> Callable[[int], int]:
    def multiplier(x: int) -> int:
        return x * factor
    return multiplier

# ✅ 正确：任意参数的 Callable
def retry(func: Callable[..., T], times: int = 3) -> T:
    for i in range(times):
        try:
            return func()
        except Exception:
            if i == times - 1:
                raise
```

### ParamSpec（Python 3.10+）

```python
from typing import ParamSpec, TypeVar, Callable

P = ParamSpec("P")
R = TypeVar("R")

# ✅ 正确：保留原函数签名的装饰器
def log_calls(func: Callable[P, R]) -> Callable[P, R]:
    def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
        print(f"Calling {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

@log_calls
def greet(name: str, greeting: str = "Hello") -> str:
    return f"{greeting}, {name}"

# 类型检查器知道 greet 的签名
greet("Alice")  # OK
greet("Alice", greeting="Hi")  # OK
greet(123)  # 类型错误
```

---

## TypedDict

### 结构化字典

```python
from typing import TypedDict, NotRequired  # NotRequired: Python 3.11+

# ✅ 正确：TypedDict 定义
class UserDict(TypedDict):
    id: int
    name: str
    email: str

def create_user(data: UserDict) -> User:
    return User(**data)

# 使用
user_data: UserDict = {"id": 1, "name": "Alice", "email": "alice@example.com"}
user = create_user(user_data)

# ✅ 正确：可选字段（Python 3.11+）
class UserDict(TypedDict):
    id: int
    name: str
    email: NotRequired[str]  # 可选字段

# ✅ 正确：total=False（所有字段可选）
class PartialUserDict(TypedDict, total=False):
    id: int
    name: str
    email: str

# ✅ 正确：继承
class AdminUserDict(UserDict):
    role: str
    permissions: list[str]
```

### TypedDict vs dataclass

```python
from typing import TypedDict
from dataclasses import dataclass

# TypedDict：用于外部数据（JSON、API 响应）
class APIResponse(TypedDict):
    status: str
    data: dict
    error: str | None

# dataclass：用于内部数据模型
@dataclass
class User:
    id: int
    name: str
    email: str

# ✅ 转换模式
def parse_user(data: APIResponse) -> User:
    return User(
        id=data["data"]["id"],
        name=data["data"]["name"],
        email=data["data"]["email"],
    )
```

---

## Literal 类型

### 字面量类型

```python
from typing import Literal

# ✅ 正确：限制字符串值
def set_status(status: Literal["pending", "active", "inactive"]) -> None:
    pass

set_status("active")  # OK
set_status("unknown")  # 类型错误

# ✅ 正确：限制数字值
def set_priority(priority: Literal[1, 2, 3]) -> None:
    pass

# ✅ 正确：结合 Union
Mode = Literal["read", "write", "append"]

def open_file(path: str, mode: Mode) -> File:
    pass

# ✅ 正确：函数重载
from typing import overload

@overload
def fetch(url: str, format: Literal["json"]) -> dict: ...
@overload
def fetch(url: str, format: Literal["text"]) -> str: ...

def fetch(url: str, format: Literal["json", "text"]) -> dict | str:
    if format == "json":
        return requests.get(url).json()
    return requests.get(url).text
```

---

## Protocol（结构化子类型）

### 协议定义

```python
from typing import Protocol, runtime_checkable

# ✅ 正确：定义协议
class Drawable(Protocol):
    def draw(self) -> None: ...

class Resizable(Protocol):
    def resize(self, width: int, height: int) -> None: ...

# 任何实现了 draw 方法的类都符合 Drawable
class Circle:
    def draw(self) -> None:
        print("Drawing circle")

class Rectangle:
    def draw(self) -> None:
        print("Drawing rectangle")
    
    def resize(self, width: int, height: int) -> None:
        self.width = width
        self.height = height

def render(shape: Drawable) -> None:
    shape.draw()

render(Circle())  # OK
render(Rectangle())  # OK

# ✅ 正确：运行时检查
@runtime_checkable
class Drawable(Protocol):
    def draw(self) -> None: ...

circle = Circle()
print(isinstance(circle, Drawable))  # True
```

### 协议组合

```python
from typing import Protocol

class Reader(Protocol):
    def read(self, n: int) -> bytes: ...

class Writer(Protocol):
    def write(self, data: bytes) -> int: ...

class Closer(Protocol):
    def close(self) -> None: ...

# ✅ 正确：协议组合
class ReadWriter(Reader, Writer, Protocol):
    pass

class Stream(Reader, Writer, Closer, Protocol):
    pass

def copy(src: Reader, dst: Writer) -> None:
    data = src.read(1024)
    dst.write(data)
```

---

## TypeGuard（类型守卫）

### 自定义类型守卫

```python
from typing import TypeGuard

# ✅ 正确：类型守卫函数
def is_string_list(val: list[object]) -> TypeGuard[list[str]]:
    """检查是否为字符串列表"""
    return all(isinstance(x, str) for x in val)

def process(items: list[object]) -> None:
    if is_string_list(items):
        # items 类型收窄为 list[str]
        for item in items:
            print(item.upper())

# ✅ 正确：检查 None
def is_not_none(val: T | None) -> TypeGuard[T]:
    return val is not None

def process_users(users: list[User | None]) -> list[User]:
    return [u for u in users if is_not_none(u)]

# ✅ 正确：检查字典结构
def is_user_dict(data: dict) -> TypeGuard[UserDict]:
    return (
        isinstance(data.get("id"), int) and
        isinstance(data.get("name"), str) and
        isinstance(data.get("email"), str)
    )
```

---

## 常见错误与修复

### 错误 1：可变默认参数

```python
# ❌ 错误：可变默认参数
def add_item(item: str, items: list[str] = []) -> list[str]:
    items.append(item)
    return items

# 问题：所有调用共享同一个列表
add_item("a")  # ["a"]
add_item("b")  # ["a", "b"]  # 意外！

# ✅ 正确：使用 None 作为默认值
def add_item(item: str, items: list[str] | None = None) -> list[str]:
    if items is None:
        items = []
    items.append(item)
    return items
```

### 错误 2：忘记 Optional

```python
# ❌ 错误：返回 None 但未标注
def find_user(user_id: int) -> User:
    user = db.query(User).get(user_id)
    return user  # 可能是 None！

# ✅ 正确：标注 Optional
def find_user(user_id: int) -> User | None:
    return db.query(User).get(user_id)

# ✅ 正确：抛出异常而非返回 None
def get_user(user_id: int) -> User:
    user = db.query(User).get(user_id)
    if user is None:
        raise UserNotFoundError(f"User {user_id} not found")
    return user
```

### 错误 3：Any 滥用

```python
# ❌ 错误：Any 滥用
def process(data: Any) -> Any:
    return data["key"]  # 失去类型检查

# ✅ 正确：使用具体类型
def process(data: dict[str, int]) -> int:
    return data["key"]

# ✅ 正确：使用泛型
T = TypeVar("T")

def process(data: dict[str, T]) -> T:
    return data["key"]
```

### 错误 4：版本兼容性

```python
# ❌ 错误：Python 3.8 使用内置泛型
def process(items: list[int]) -> dict[str, int]:  # Python 3.8 报错
    pass

# ✅ 正确：Python 3.8 使用 typing 模块
from typing import List, Dict

def process(items: List[int]) -> Dict[str, int]:
    pass

# ✅ 正确：使用 __future__ 导入（Python 3.7+）
from __future__ import annotations

def process(items: list[int]) -> dict[str, int]:  # 延迟求值，3.7+ 可用
    pass
```

### 错误 5：类型注解位置

```python
# ❌ 错误：在类定义中引用自身
class Node:
    def __init__(self, value: int, next: Node):  # NameError!
        pass

# ✅ 正确：使用字符串引用（前向引用）
class Node:
    def __init__(self, value: int, next: "Node | None"):
        pass

# ✅ 正确：使用 __future__ annotations
from __future__ import annotations

class Node:
    def __init__(self, value: int, next: Node | None):
        pass

# ✅ Python 3.11+：使用 Self
from typing import Self

class Node:
    def __init__(self, value: int, next: Self | None):
        pass
```

---

## mypy 配置

### pyproject.toml 配置

```toml
[tool.mypy]
python_version = "3.10"
strict = true
warn_return_any = true
warn_unused_ignores = true
disallow_untyped_defs = true
disallow_incomplete_defs = true
check_untyped_defs = true
disallow_untyped_decorators = true
no_implicit_optional = true
warn_redundant_casts = true
warn_unused_configs = true

[[tool.mypy.overrides]]
module = "tests.*"
disallow_untyped_defs = false

[[tool.mypy.overrides]]
module = "third_party.*"
ignore_missing_imports = true
```

### 常用 mypy 命令

```bash
# 基础检查
mypy .

# 严格模式
mypy --strict .

# 生成报告
mypy --html-report mypy-report .

# 忽略缺失导入
mypy --ignore-missing-imports .

# 显示错误代码
mypy --show-error-codes .
```

---

## 审查检查清单

### 基础检查
- [ ] 函数有参数和返回值类型注解
- [ ] 可能返回 None 的函数使用 `Optional` / `| None`
- [ ] 无 `Any` 滥用
- [ ] 无可变默认参数

### 进阶检查
- [ ] 泛型类型正确使用
- [ ] `TypedDict` 用于外部数据结构
- [ ] `Protocol` 用于结构化子类型
- [ ] `Literal` 用于限制字面量值

### 版本兼容
- [ ] Python 3.8 使用 `typing.List` / `typing.Dict`
- [ ] 或使用 `from __future__ import annotations`
- [ ] 前向引用使用字符串或 `Self`

### 工具检查
- [ ] `mypy --strict` 无错误
- [ ] 类型覆盖率 > 90%

---

**版本**: 1.0.0  
**更新时间**: 2025-12-30
