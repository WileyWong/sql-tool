# Python 性能优化审查示例

Python 性能优化的最佳实践与常见问题，覆盖内存管理、算法优化、缓存策略等场景。

---

## 数据结构选择

### 列表 vs 集合 vs 字典

```python
# ❌ 错误：使用列表进行频繁查找
def check_permission_bad(user_id: int, allowed_ids: list[int]) -> bool:
    return user_id in allowed_ids  # O(n) 时间复杂度

# ✅ 正确：使用集合进行查找
def check_permission_good(user_id: int, allowed_ids: set[int]) -> bool:
    return user_id in allowed_ids  # O(1) 时间复杂度

# 性能对比
import timeit

allowed_list = list(range(10000))
allowed_set = set(range(10000))

# 列表查找：约 100 微秒
timeit.timeit(lambda: 9999 in allowed_list, number=1000)

# 集合查找：约 0.1 微秒
timeit.timeit(lambda: 9999 in allowed_set, number=1000)
```

### 选择合适的数据结构

```python
from collections import deque, defaultdict, Counter
from typing import Any

# ✅ deque：双端队列，两端操作 O(1)
queue: deque[int] = deque(maxlen=1000)
queue.append(1)      # 右端添加 O(1)
queue.appendleft(0)  # 左端添加 O(1)
queue.pop()          # 右端弹出 O(1)
queue.popleft()      # 左端弹出 O(1)

# ❌ 列表：左端操作 O(n)
bad_queue: list[int] = []
bad_queue.insert(0, item)  # O(n)！
bad_queue.pop(0)           # O(n)！

# ✅ defaultdict：避免 KeyError 检查
word_count: dict[str, int] = defaultdict(int)
for word in words:
    word_count[word] += 1  # 自动初始化为 0

# ❌ 普通字典需要检查
word_count: dict[str, int] = {}
for word in words:
    if word not in word_count:
        word_count[word] = 0
    word_count[word] += 1

# ✅ Counter：计数专用
from collections import Counter
word_count = Counter(words)
most_common = word_count.most_common(10)  # 前 10 个高频词

# ✅ 命名元组：轻量级不可变对象
from typing import NamedTuple

class Point(NamedTuple):
    x: float
    y: float

# 比普通类更节省内存
point = Point(1.0, 2.0)
```

---

## 字符串操作

### 字符串拼接

```python
# ❌ 错误：循环中使用 + 拼接
def build_string_bad(items: list[str]) -> str:
    result = ""
    for item in items:
        result += item  # 每次创建新字符串，O(n²)
    return result

# ✅ 正确：使用 join
def build_string_good(items: list[str]) -> str:
    return "".join(items)  # O(n)

# ✅ 正确：使用列表收集后 join
def build_string_with_processing(items: list[str]) -> str:
    parts = []
    for item in items:
        parts.append(process(item))
    return "".join(parts)

# ✅ 正确：使用 io.StringIO
from io import StringIO

def build_string_io(items: list[str]) -> str:
    buffer = StringIO()
    for item in items:
        buffer.write(item)
    return buffer.getvalue()

# 性能对比（10000 个字符串）
# + 拼接：约 500ms
# join：约 1ms
```

### f-string vs format vs %

```python
name = "Alice"
age = 30

# ✅ 推荐：f-string（最快）
message = f"Name: {name}, Age: {age}"

# ✅ 可用：format
message = "Name: {}, Age: {}".format(name, age)

# ⚠️ 旧式：% 格式化
message = "Name: %s, Age: %d" % (name, age)

# 性能排序：f-string > % > format
```

---

## 循环优化

### 列表推导 vs 循环

```python
# ✅ 推荐：列表推导（更快）
squares = [x ** 2 for x in range(1000)]

# ❌ 较慢：显式循环
squares = []
for x in range(1000):
    squares.append(x ** 2)

# ✅ 带条件的列表推导
evens = [x for x in range(1000) if x % 2 == 0]

# ✅ 字典推导
word_lengths = {word: len(word) for word in words}

# ✅ 集合推导
unique_lengths = {len(word) for word in words}
```

### 生成器表达式

```python
# ❌ 错误：大数据集使用列表推导
total = sum([x ** 2 for x in range(1000000)])  # 创建完整列表

# ✅ 正确：使用生成器表达式
total = sum(x ** 2 for x in range(1000000))  # 惰性计算，节省内存

# ✅ 正确：any/all 配合生成器
has_negative = any(x < 0 for x in numbers)  # 短路求值
all_positive = all(x > 0 for x in numbers)

# ✅ 正确：max/min 配合生成器
max_length = max(len(word) for word in words)
```

### 避免重复计算

```python
# ❌ 错误：循环中重复计算
def process_bad(items: list[str], pattern: str) -> list[str]:
    results = []
    for item in items:
        if re.match(pattern, item):  # 每次编译正则
            results.append(item)
    return results

# ✅ 正确：预编译正则
import re

def process_good(items: list[str], pattern: str) -> list[str]:
    compiled = re.compile(pattern)  # 只编译一次
    return [item for item in items if compiled.match(item)]

# ❌ 错误：循环中重复计算长度
def process_bad(items: list[str]) -> None:
    for i in range(len(items)):  # len() 每次调用
        print(items[i])

# ✅ 正确：直接迭代
def process_good(items: list[str]) -> None:
    for item in items:
        print(item)

# ✅ 正确：需要索引时使用 enumerate
def process_with_index(items: list[str]) -> None:
    for i, item in enumerate(items):
        print(f"{i}: {item}")
```

---

## 内存优化

### 生成器

```python
# ❌ 错误：一次性加载大文件
def read_file_bad(filepath: str) -> list[str]:
    with open(filepath) as f:
        return f.readlines()  # 全部加载到内存

# ✅ 正确：使用生成器逐行处理
def read_file_good(filepath: str):
    with open(filepath) as f:
        for line in f:
            yield line.strip()

# 使用
for line in read_file_good("large_file.txt"):
    process(line)

# ✅ 正确：生成器函数
def fibonacci(n: int):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

# 只在需要时计算
for num in fibonacci(1000000):
    if num > 1000:
        break
```

### __slots__ 优化

```python
# ❌ 普通类：每个实例有 __dict__
class PointBad:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

# ✅ 使用 __slots__：节省内存
class PointGood:
    __slots__ = ("x", "y")
    
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

# 内存对比（100万个实例）
# 普通类：约 160MB
# __slots__：约 56MB

# ⚠️ 注意：__slots__ 的限制
# - 不能动态添加属性
# - 不能使用 __dict__
# - 继承时需要注意
```

### 对象复用

```python
# ❌ 错误：频繁创建临时对象
def process_bad(data: list[dict]) -> list[str]:
    results = []
    for item in data:
        temp = SomeClass(item)  # 每次创建新对象
        results.append(temp.process())
    return results

# ✅ 正确：复用对象
def process_good(data: list[dict]) -> list[str]:
    processor = SomeClass()  # 创建一次
    results = []
    for item in data:
        processor.reset(item)  # 重置状态
        results.append(processor.process())
    return results

# ✅ 正确：使用对象池
from queue import Queue

class ObjectPool:
    def __init__(self, factory, size: int = 10):
        self._pool: Queue = Queue(maxsize=size)
        self._factory = factory
        for _ in range(size):
            self._pool.put(factory())
    
    def acquire(self):
        return self._pool.get()
    
    def release(self, obj):
        self._pool.put(obj)
```

---

## 缓存策略

### functools.lru_cache

```python
from functools import lru_cache

# ✅ 正确：缓存纯函数结果
@lru_cache(maxsize=128)
def fibonacci(n: int) -> int:
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# ✅ 正确：缓存 API 调用结果
@lru_cache(maxsize=1000)
def get_user_permissions(user_id: int) -> frozenset[str]:
    # 数据库查询
    return frozenset(db.query_permissions(user_id))

# ⚠️ 注意：参数必须可哈希
# ❌ 错误：列表参数不可哈希
@lru_cache
def process(items: list[int]) -> int:  # TypeError!
    return sum(items)

# ✅ 正确：转换为元组
@lru_cache
def process(items: tuple[int, ...]) -> int:
    return sum(items)

# 使用时转换
result = process(tuple([1, 2, 3]))
```

### cached_property

```python
from functools import cached_property

class DataProcessor:
    def __init__(self, data: list[int]):
        self._data = data
    
    # ✅ 正确：属性缓存
    @cached_property
    def statistics(self) -> dict:
        """只计算一次"""
        return {
            "sum": sum(self._data),
            "mean": sum(self._data) / len(self._data),
            "max": max(self._data),
            "min": min(self._data),
        }

# 第一次访问计算，后续直接返回缓存
processor = DataProcessor([1, 2, 3, 4, 5])
print(processor.statistics)  # 计算
print(processor.statistics)  # 缓存
```

### 自定义缓存

```python
from cachetools import TTLCache, LRUCache
from typing import TypeVar, Callable
import time

T = TypeVar("T")

# ✅ 带过期时间的缓存
cache = TTLCache(maxsize=100, ttl=300)  # 5 分钟过期

def get_config(key: str) -> dict:
    if key not in cache:
        cache[key] = load_from_db(key)
    return cache[key]

# ✅ 自定义缓存装饰器
def timed_cache(seconds: int):
    def decorator(func: Callable[..., T]) -> Callable[..., T]:
        cache: dict = {}
        
        def wrapper(*args, **kwargs):
            key = (args, tuple(sorted(kwargs.items())))
            now = time.time()
            
            if key in cache:
                result, timestamp = cache[key]
                if now - timestamp < seconds:
                    return result
            
            result = func(*args, **kwargs)
            cache[key] = (result, now)
            return result
        
        return wrapper
    return decorator

@timed_cache(seconds=60)
def expensive_operation(x: int) -> int:
    time.sleep(1)  # 模拟耗时操作
    return x * 2
```

---

## 数据库优化

### N+1 查询问题

```python
from sqlalchemy.orm import joinedload, selectinload

# ❌ 错误：N+1 查询
def get_orders_bad():
    orders = db.query(Order).all()
    for order in orders:
        print(order.user.name)  # 每次循环查询 user

# ✅ 正确：预加载关联数据
def get_orders_good():
    orders = db.query(Order).options(
        joinedload(Order.user)  # JOIN 加载
    ).all()
    for order in orders:
        print(order.user.name)  # 无额外查询

# ✅ 正确：多对多关系使用 selectinload
def get_users_with_roles():
    return db.query(User).options(
        selectinload(User.roles)  # IN 查询加载
    ).all()
```

### 批量操作

```python
# ❌ 错误：逐条插入
def insert_bad(items: list[dict]):
    for item in items:
        db.execute(
            "INSERT INTO items (name, value) VALUES (:name, :value)",
            item
        )
    db.commit()

# ✅ 正确：批量插入
def insert_good(items: list[dict]):
    db.execute(
        "INSERT INTO items (name, value) VALUES (:name, :value)",
        items  # 批量参数
    )
    db.commit()

# ✅ 正确：SQLAlchemy 批量插入
def bulk_insert(items: list[Item]):
    db.bulk_save_objects(items)
    db.commit()

# ✅ 正确：分批处理大量数据
def batch_insert(items: list[dict], batch_size: int = 1000):
    for i in range(0, len(items), batch_size):
        batch = items[i:i + batch_size]
        db.execute(
            "INSERT INTO items (name, value) VALUES (:name, :value)",
            batch
        )
        db.commit()
```

### 索引优化

```python
# ✅ 正确：为查询字段创建索引
from sqlalchemy import Index

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True, index=True)  # 单列索引
    name = Column(String(100))
    created_at = Column(DateTime)
    
    # 复合索引
    __table_args__ = (
        Index("idx_name_created", "name", "created_at"),
    )

# ⚠️ 注意：避免在索引列上使用函数
# ❌ 索引失效
db.query(User).filter(func.lower(User.email) == email.lower())

# ✅ 应用层处理
db.query(User).filter(User.email == email.lower())
```

---

## 并行与并发

### 多进程（CPU 密集型）

```python
from multiprocessing import Pool, cpu_count
from concurrent.futures import ProcessPoolExecutor

# ✅ 正确：使用进程池
def cpu_intensive(x: int) -> int:
    return sum(i * i for i in range(x))

def process_parallel(items: list[int]) -> list[int]:
    with Pool(processes=cpu_count()) as pool:
        return pool.map(cpu_intensive, items)

# ✅ 正确：使用 ProcessPoolExecutor
def process_with_executor(items: list[int]) -> list[int]:
    with ProcessPoolExecutor(max_workers=cpu_count()) as executor:
        return list(executor.map(cpu_intensive, items))

# ⚠️ 注意：进程间通信开销
# 不适合小任务，适合计算密集型大任务
```

### 多线程（IO 密集型）

```python
from concurrent.futures import ThreadPoolExecutor
import threading

# ✅ 正确：IO 密集型任务使用线程池
def fetch_url(url: str) -> str:
    return requests.get(url).text

def fetch_all(urls: list[str]) -> list[str]:
    with ThreadPoolExecutor(max_workers=10) as executor:
        return list(executor.map(fetch_url, urls))

# ⚠️ 注意：GIL 限制
# Python 线程不能并行执行 CPU 密集型代码
# 但 IO 操作会释放 GIL
```

---

## 性能分析

### cProfile

```python
import cProfile
import pstats

# ✅ 正确：性能分析
def profile_function():
    profiler = cProfile.Profile()
    profiler.enable()
    
    # 要分析的代码
    result = expensive_function()
    
    profiler.disable()
    stats = pstats.Stats(profiler)
    stats.sort_stats("cumulative")
    stats.print_stats(20)  # 打印前 20 行
    
    return result

# ✅ 命令行分析
# python -m cProfile -s cumulative script.py
```

### 内存分析

```python
# pip install memory_profiler

from memory_profiler import profile

@profile
def memory_intensive():
    """分析内存使用"""
    data = [i ** 2 for i in range(1000000)]
    return sum(data)

# 命令行运行
# python -m memory_profiler script.py

# ✅ 使用 tracemalloc
import tracemalloc

tracemalloc.start()

# 你的代码
data = [i for i in range(1000000)]

current, peak = tracemalloc.get_traced_memory()
print(f"Current: {current / 1024 / 1024:.2f} MB")
print(f"Peak: {peak / 1024 / 1024:.2f} MB")

tracemalloc.stop()
```

### 时间测量

```python
import time
from contextlib import contextmanager

# ✅ 正确：上下文管理器计时
@contextmanager
def timer(name: str):
    start = time.perf_counter()
    try:
        yield
    finally:
        elapsed = time.perf_counter() - start
        print(f"{name}: {elapsed:.4f}s")

with timer("operation"):
    expensive_operation()

# ✅ 正确：装饰器计时
from functools import wraps

def timeit(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__}: {elapsed:.4f}s")
        return result
    return wrapper

@timeit
def slow_function():
    time.sleep(1)
```

---

## 常见反模式

### 反模式 1：过早优化

```python
# ❌ 过早优化：代码难以理解
def process_bad(data):
    return [
        (lambda x: x ** 2 if x > 0 else -x ** 2)(
            (lambda y: y + 1)(item)
        )
        for item in data
        if (lambda z: z % 2 == 0)(item)
    ]

# ✅ 可读性优先：先写清晰代码
def process_good(data):
    results = []
    for item in data:
        if item % 2 == 0:
            adjusted = item + 1
            if adjusted > 0:
                results.append(adjusted ** 2)
            else:
                results.append(-(adjusted ** 2))
    return results

# 然后根据性能分析结果优化
```

### 反模式 2：不必要的复制

```python
# ❌ 不必要的列表复制
def process_bad(items: list[int]) -> int:
    copied = list(items)  # 不必要的复制
    return sum(copied)

# ✅ 直接使用
def process_good(items: list[int]) -> int:
    return sum(items)

# ❌ 不必要的切片复制
def process_bad(items: list[int]) -> int:
    return sum(items[:])  # 复制整个列表

# ✅ 直接使用
def process_good(items: list[int]) -> int:
    return sum(items)
```

### 反模式 3：全局变量

```python
# ❌ 全局变量：难以测试和优化
_cache = {}

def get_data(key: str):
    if key not in _cache:
        _cache[key] = expensive_load(key)
    return _cache[key]

# ✅ 依赖注入：可测试、可优化
class DataService:
    def __init__(self, cache: dict | None = None):
        self._cache = cache or {}
    
    def get_data(self, key: str):
        if key not in self._cache:
            self._cache[key] = expensive_load(key)
        return self._cache[key]
```

---

## 审查检查清单

### 数据结构
- [ ] 查找操作使用 `set` / `dict`
- [ ] 双端操作使用 `deque`
- [ ] 计数使用 `Counter`
- [ ] 默认值使用 `defaultdict`

### 字符串
- [ ] 循环拼接使用 `join`
- [ ] 格式化使用 f-string
- [ ] 正则表达式预编译

### 循环
- [ ] 使用列表推导 / 生成器表达式
- [ ] 避免循环内重复计算
- [ ] 大数据使用生成器

### 内存
- [ ] 大数据使用生成器
- [ ] 频繁创建的小对象使用 `__slots__`
- [ ] 复用对象而非频繁创建

### 缓存
- [ ] 纯函数使用 `lru_cache`
- [ ] 属性使用 `cached_property`
- [ ] 缓存有过期策略

### 数据库
- [ ] 无 N+1 查询
- [ ] 批量操作
- [ ] 查询字段有索引

---

**版本**: 1.0.0  
**更新时间**: 2025-12-30
