# Python 异步编程审查示例

Python 异步编程的最佳实践与常见问题，覆盖 asyncio、aiohttp、异步 ORM 等场景。

---

## 异步基础

### async/await 基础

```python
import asyncio

# ✅ 正确：异步函数定义
async def fetch_data(url: str) -> dict:
    """异步获取数据"""
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.json()

# ✅ 正确：调用异步函数
async def main():
    data = await fetch_data("https://api.example.com/data")
    print(data)

# 运行异步函数
asyncio.run(main())

# ❌ 错误：在同步函数中调用异步函数
def sync_function():
    data = fetch_data("https://api.example.com/data")  # 返回协程对象，不是结果！
    print(data)  # <coroutine object fetch_data at 0x...>
```

### 并发执行

```python
import asyncio

# ✅ 正确：并发执行多个任务
async def fetch_all(urls: list[str]) -> list[dict]:
    """并发获取多个 URL"""
    tasks = [fetch_data(url) for url in urls]
    return await asyncio.gather(*tasks)

# ✅ 正确：带异常处理的并发
async def fetch_all_safe(urls: list[str]) -> list[dict | Exception]:
    """并发获取，返回结果或异常"""
    tasks = [fetch_data(url) for url in urls]
    return await asyncio.gather(*tasks, return_exceptions=True)

# ✅ 正确：限制并发数量
async def fetch_with_limit(urls: list[str], limit: int = 10) -> list[dict]:
    """限制并发数量"""
    semaphore = asyncio.Semaphore(limit)
    
    async def fetch_with_sem(url: str) -> dict:
        async with semaphore:
            return await fetch_data(url)
    
    tasks = [fetch_with_sem(url) for url in urls]
    return await asyncio.gather(*tasks)

# ❌ 错误：顺序执行（失去异步优势）
async def fetch_sequential(urls: list[str]) -> list[dict]:
    results = []
    for url in urls:
        data = await fetch_data(url)  # 一个一个等待
        results.append(data)
    return results
```

---

## 常见错误

### 错误 1：在异步函数中使用同步阻塞

```python
import time
import requests

# ❌ 错误：同步阻塞调用
async def bad_fetch(url: str) -> str:
    response = requests.get(url)  # 阻塞整个事件循环！
    return response.text

# ❌ 错误：time.sleep 阻塞
async def bad_delay():
    time.sleep(1)  # 阻塞！
    print("Done")

# ✅ 正确：使用异步库
import aiohttp

async def good_fetch(url: str) -> str:
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.text()

# ✅ 正确：asyncio.sleep
async def good_delay():
    await asyncio.sleep(1)  # 非阻塞
    print("Done")

# ✅ 正确：如果必须调用同步代码，使用线程池
async def call_sync_safely():
    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(None, sync_blocking_function)
    return result
```

### 错误 2：忘记 await

```python
# ❌ 错误：忘记 await
async def process():
    data = fetch_data(url)  # 返回协程，不是数据！
    print(data["key"])  # TypeError!

# ✅ 正确：使用 await
async def process():
    data = await fetch_data(url)
    print(data["key"])

# ⚠️ 警告：协程未被等待会产生警告
# RuntimeWarning: coroutine 'fetch_data' was never awaited
```

### 错误 3：在错误的地方创建事件循环

```python
# ❌ 错误：嵌套事件循环
async def outer():
    asyncio.run(inner())  # RuntimeError: cannot be called from a running event loop

# ❌ 错误：在异步上下文中使用 asyncio.run
def handler():
    asyncio.run(async_function())  # 如果已在事件循环中会报错

# ✅ 正确：使用 await
async def outer():
    await inner()

# ✅ 正确：检查是否在事件循环中
def handler():
    try:
        loop = asyncio.get_running_loop()
        # 已在事件循环中，创建任务
        loop.create_task(async_function())
    except RuntimeError:
        # 不在事件循环中，使用 run
        asyncio.run(async_function())
```

### 错误 4：资源泄漏

```python
import aiohttp

# ❌ 错误：未关闭 session
async def bad_fetch(url: str) -> str:
    session = aiohttp.ClientSession()
    response = await session.get(url)
    return await response.text()
    # session 未关闭！

# ✅ 正确：使用 async with
async def good_fetch(url: str) -> str:
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.text()

# ✅ 正确：复用 session
class HttpClient:
    def __init__(self):
        self._session: aiohttp.ClientSession | None = None
    
    async def get_session(self) -> aiohttp.ClientSession:
        if self._session is None or self._session.closed:
            self._session = aiohttp.ClientSession()
        return self._session
    
    async def close(self):
        if self._session:
            await self._session.close()
    
    async def fetch(self, url: str) -> str:
        session = await self.get_session()
        async with session.get(url) as response:
            return await response.text()
```

---

## 异步上下文管理器

### 实现异步上下文管理器

```python
# ✅ 正确：类实现
class AsyncDatabase:
    async def __aenter__(self) -> "AsyncDatabase":
        self.conn = await create_async_connection()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb) -> bool:
        await self.conn.close()
        return False  # 不抑制异常

# 使用
async def main():
    async with AsyncDatabase() as db:
        await db.execute("SELECT 1")

# ✅ 正确：使用 contextlib
from contextlib import asynccontextmanager

@asynccontextmanager
async def async_timer(name: str):
    start = time.time()
    try:
        yield
    finally:
        elapsed = time.time() - start
        print(f"{name} took {elapsed:.2f}s")

async def main():
    async with async_timer("operation"):
        await some_async_operation()
```

### 异步迭代器

```python
from typing import AsyncIterator

# ✅ 正确：异步迭代器
class AsyncRange:
    def __init__(self, start: int, end: int):
        self.start = start
        self.end = end
        self.current = start
    
    def __aiter__(self) -> "AsyncRange":
        return self
    
    async def __anext__(self) -> int:
        if self.current >= self.end:
            raise StopAsyncIteration
        await asyncio.sleep(0.1)  # 模拟异步操作
        value = self.current
        self.current += 1
        return value

# 使用
async def main():
    async for i in AsyncRange(0, 5):
        print(i)

# ✅ 正确：异步生成器
async def async_range(start: int, end: int) -> AsyncIterator[int]:
    for i in range(start, end):
        await asyncio.sleep(0.1)
        yield i

async def main():
    async for i in async_range(0, 5):
        print(i)
```

---

## aiohttp 最佳实践

### HTTP 客户端

```python
import aiohttp
from typing import Any

# ✅ 正确：复用 ClientSession
class ApiClient:
    def __init__(self, base_url: str):
        self.base_url = base_url
        self._session: aiohttp.ClientSession | None = None
    
    async def _get_session(self) -> aiohttp.ClientSession:
        if self._session is None or self._session.closed:
            timeout = aiohttp.ClientTimeout(total=30)
            self._session = aiohttp.ClientSession(
                base_url=self.base_url,
                timeout=timeout,
                headers={"User-Agent": "MyApp/1.0"},
            )
        return self._session
    
    async def get(self, path: str, **kwargs) -> dict[str, Any]:
        session = await self._get_session()
        async with session.get(path, **kwargs) as response:
            response.raise_for_status()
            return await response.json()
    
    async def post(self, path: str, data: dict, **kwargs) -> dict[str, Any]:
        session = await self._get_session()
        async with session.post(path, json=data, **kwargs) as response:
            response.raise_for_status()
            return await response.json()
    
    async def close(self):
        if self._session:
            await self._session.close()
            self._session = None
    
    async def __aenter__(self) -> "ApiClient":
        return self
    
    async def __aexit__(self, *args):
        await self.close()

# 使用
async def main():
    async with ApiClient("https://api.example.com") as client:
        users = await client.get("/users")
        new_user = await client.post("/users", {"name": "Alice"})
```

### 错误处理与重试

```python
import aiohttp
from tenacity import retry, stop_after_attempt, wait_exponential

# ✅ 正确：重试机制
@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=1, max=10),
)
async def fetch_with_retry(url: str) -> dict:
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            response.raise_for_status()
            return await response.json()

# ✅ 正确：超时处理
async def fetch_with_timeout(url: str, timeout: float = 10.0) -> dict:
    timeout_config = aiohttp.ClientTimeout(total=timeout)
    async with aiohttp.ClientSession(timeout=timeout_config) as session:
        try:
            async with session.get(url) as response:
                return await response.json()
        except asyncio.TimeoutError:
            raise TimeoutError(f"Request to {url} timed out")

# ✅ 正确：完整的错误处理
async def safe_fetch(url: str) -> dict | None:
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if response.status == 404:
                    return None
                response.raise_for_status()
                return await response.json()
    except aiohttp.ClientError as e:
        logger.error(f"HTTP error fetching {url}: {e}")
        raise
    except asyncio.TimeoutError:
        logger.error(f"Timeout fetching {url}")
        raise
```

---

## 异步数据库

### SQLAlchemy 异步

```python
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select

# ✅ 正确：创建异步引擎
engine = create_async_engine(
    "postgresql+asyncpg://user:pass@localhost/db",
    echo=True,
)

async_session = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

# ✅ 正确：异步查询
async def get_user(user_id: int) -> User | None:
    async with async_session() as session:
        result = await session.execute(
            select(User).where(User.id == user_id)
        )
        return result.scalar_one_or_none()

# ✅ 正确：异步事务
async def create_user(name: str, email: str) -> User:
    async with async_session() as session:
        async with session.begin():
            user = User(name=name, email=email)
            session.add(user)
            # 事务自动提交
        return user

# ✅ 正确：批量查询
async def get_users_by_ids(user_ids: list[int]) -> list[User]:
    async with async_session() as session:
        result = await session.execute(
            select(User).where(User.id.in_(user_ids))
        )
        return list(result.scalars().all())
```

### 异步 Redis

```python
import redis.asyncio as redis

# ✅ 正确：异步 Redis 客户端
class AsyncRedisCache:
    def __init__(self, url: str = "redis://localhost"):
        self._redis: redis.Redis | None = None
        self._url = url
    
    async def _get_client(self) -> redis.Redis:
        if self._redis is None:
            self._redis = redis.from_url(self._url)
        return self._redis
    
    async def get(self, key: str) -> str | None:
        client = await self._get_client()
        return await client.get(key)
    
    async def set(
        self, key: str, value: str, expire: int | None = None
    ) -> None:
        client = await self._get_client()
        await client.set(key, value, ex=expire)
    
    async def delete(self, key: str) -> None:
        client = await self._get_client()
        await client.delete(key)
    
    async def close(self):
        if self._redis:
            await self._redis.close()

# 使用
async def main():
    cache = AsyncRedisCache()
    try:
        await cache.set("key", "value", expire=3600)
        value = await cache.get("key")
    finally:
        await cache.close()
```

---

## FastAPI 异步

### 异步端点

```python
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

app = FastAPI()

# ✅ 正确：异步依赖注入
async def get_db() -> AsyncSession:
    async with async_session() as session:
        yield session

# ✅ 正确：异步端点
@app.get("/users/{user_id}")
async def get_user(
    user_id: int,
    db: AsyncSession = Depends(get_db)
) -> User:
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# ✅ 正确：并发请求外部服务
@app.get("/dashboard")
async def get_dashboard():
    # 并发获取多个数据源
    users, orders, stats = await asyncio.gather(
        fetch_users(),
        fetch_orders(),
        fetch_stats(),
    )
    return {"users": users, "orders": orders, "stats": stats}

# ⚠️ 注意：CPU 密集型任务使用线程池
@app.get("/compute")
async def compute_heavy():
    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(None, cpu_intensive_function)
    return {"result": result}
```

### 后台任务

```python
from fastapi import BackgroundTasks

# ✅ 正确：后台任务
async def send_email(email: str, message: str):
    # 异步发送邮件
    await email_client.send(email, message)

@app.post("/users")
async def create_user(
    user: UserCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    # 创建用户
    new_user = User(**user.dict())
    db.add(new_user)
    await db.commit()
    
    # 添加后台任务
    background_tasks.add_task(
        send_email,
        user.email,
        "Welcome to our platform!"
    )
    
    return new_user
```

---

## 任务管理

### 任务取消

```python
import asyncio

# ✅ 正确：支持取消的任务
async def cancellable_task():
    try:
        while True:
            await asyncio.sleep(1)
            print("Working...")
    except asyncio.CancelledError:
        print("Task was cancelled, cleaning up...")
        raise  # 重新抛出以完成取消

# ✅ 正确：取消任务
async def main():
    task = asyncio.create_task(cancellable_task())
    
    await asyncio.sleep(3)
    task.cancel()
    
    try:
        await task
    except asyncio.CancelledError:
        print("Task cancelled successfully")

# ✅ 正确：超时取消
async def with_timeout():
    try:
        async with asyncio.timeout(5.0):  # Python 3.11+
            await long_running_task()
    except asyncio.TimeoutError:
        print("Task timed out")

# Python 3.10 及以下
async def with_timeout_legacy():
    try:
        await asyncio.wait_for(long_running_task(), timeout=5.0)
    except asyncio.TimeoutError:
        print("Task timed out")
```

### 任务组（Python 3.11+）

```python
import asyncio

# ✅ 正确：使用 TaskGroup
async def main():
    async with asyncio.TaskGroup() as tg:
        task1 = tg.create_task(fetch_data(url1))
        task2 = tg.create_task(fetch_data(url2))
        task3 = tg.create_task(fetch_data(url3))
    
    # 所有任务完成后继续
    results = [task1.result(), task2.result(), task3.result()]

# ✅ 正确：TaskGroup 异常处理
async def main():
    try:
        async with asyncio.TaskGroup() as tg:
            tg.create_task(may_fail_task())
            tg.create_task(another_task())
    except* ValueError as eg:
        # 处理 ValueError 异常组
        for exc in eg.exceptions:
            print(f"ValueError: {exc}")
    except* TypeError as eg:
        # 处理 TypeError 异常组
        for exc in eg.exceptions:
            print(f"TypeError: {exc}")
```

---

## 性能优化

### 连接池

```python
import aiohttp

# ✅ 正确：配置连接池
connector = aiohttp.TCPConnector(
    limit=100,  # 总连接数限制
    limit_per_host=10,  # 每个主机连接数限制
    ttl_dns_cache=300,  # DNS 缓存时间
    keepalive_timeout=30,  # 保持连接时间
)

async def create_session() -> aiohttp.ClientSession:
    return aiohttp.ClientSession(connector=connector)
```

### 批量处理

```python
import asyncio
from itertools import islice

# ✅ 正确：分批处理
async def process_in_batches(
    items: list[str],
    batch_size: int = 100
) -> list[dict]:
    results = []
    
    for i in range(0, len(items), batch_size):
        batch = items[i:i + batch_size]
        batch_results = await asyncio.gather(
            *[process_item(item) for item in batch]
        )
        results.extend(batch_results)
        
        # 可选：批次间休息，避免过载
        await asyncio.sleep(0.1)
    
    return results

# ✅ 正确：使用信号量限制并发
async def process_with_semaphore(
    items: list[str],
    max_concurrent: int = 50
) -> list[dict]:
    semaphore = asyncio.Semaphore(max_concurrent)
    
    async def process_with_limit(item: str) -> dict:
        async with semaphore:
            return await process_item(item)
    
    return await asyncio.gather(
        *[process_with_limit(item) for item in items]
    )
```

---

## 调试技巧

### 调试模式

```python
import asyncio

# ✅ 正确：启用调试模式
asyncio.run(main(), debug=True)

# 或者通过环境变量
# PYTHONASYNCIODEBUG=1 python script.py

# ✅ 正确：自定义异常处理器
def exception_handler(loop, context):
    exception = context.get("exception")
    message = context.get("message")
    logger.error(f"Async exception: {message}", exc_info=exception)

loop = asyncio.get_event_loop()
loop.set_exception_handler(exception_handler)
```

### 性能分析

```python
import asyncio
import cProfile
import pstats

# ✅ 正确：异步代码性能分析
async def main():
    # 你的异步代码
    pass

def profile_async():
    profiler = cProfile.Profile()
    profiler.enable()
    
    asyncio.run(main())
    
    profiler.disable()
    stats = pstats.Stats(profiler)
    stats.sort_stats("cumulative")
    stats.print_stats(20)

# ✅ 正确：使用 aiomonitor 监控
# pip install aiomonitor
import aiomonitor

async def main():
    with aiomonitor.start_monitor(loop=asyncio.get_event_loop()):
        await your_async_code()
```

---

## 审查检查清单

### 基础检查
- [ ] 异步函数使用 `async def`
- [ ] 调用异步函数使用 `await`
- [ ] 无同步阻塞调用（`requests`、`time.sleep`）
- [ ] 资源使用 `async with` 管理

### 并发检查
- [ ] 使用 `asyncio.gather` 并发执行
- [ ] 大量并发使用信号量限制
- [ ] 任务支持取消
- [ ] 无任务泄漏

### 性能检查
- [ ] 复用 `ClientSession`
- [ ] 配置合理的超时
- [ ] 使用连接池
- [ ] 批量处理大量请求

### 错误处理
- [ ] 捕获 `asyncio.TimeoutError`
- [ ] 捕获 `asyncio.CancelledError`
- [ ] 清理资源在 `finally` 或 `__aexit__`

---

**版本**: 1.0.0  
**更新时间**: 2025-12-30
