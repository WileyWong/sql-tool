# FastAPI 专项审查指南

基于 FastAPI 最佳实践的专项代码审查。

> 📚 **前置**: 请先阅读 [Python 基础审查指南](python-review.md)
> ⚠️ **版本说明**: 本指南涵盖 FastAPI 0.100+ 特性

## 审查维度

| 维度 | 权重 | 检查要点 |
|------|------|---------|
| Pydantic 模型 | 25% | 数据验证、序列化、模型设计 |
| 依赖注入 | 20% | 依赖设计、生命周期、复用 |
| 异步编程 | 20% | async/await、异步数据库、并发 |
| 安全认证 | 20% | OAuth2、JWT、权限控制 |
| API 设计 | 15% | 路由组织、响应模型、OpenAPI |

---

## 一、Pydantic 模型

### 1.1 请求模型验证

```python
from pydantic import BaseModel, Field, validator, field_validator
from typing import Optional
from datetime import datetime
import re

# ✅ 请求模型定义
class CreateUserRequest(BaseModel):
    username: str = Field(
        ...,  # 必填
        min_length=3,
        max_length=50,
        pattern=r"^[a-zA-Z0-9_]+$",
        description="用户名，只允许字母、数字和下划线"
    )
    email: str = Field(..., description="邮箱地址")
    password: str = Field(..., min_length=8, description="密码，至少8位")
    age: Optional[int] = Field(None, ge=0, le=150, description="年龄")
    
    # ✅ Pydantic v2 字段验证器
    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        if not re.match(r"^[\w\.-]+@[\w\.-]+\.\w+$", v):
            raise ValueError("邮箱格式不正确")
        return v.lower()
    
    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if not re.search(r"[A-Z]", v):
            raise ValueError("密码必须包含大写字母")
        if not re.search(r"[0-9]", v):
            raise ValueError("密码必须包含数字")
        return v
    
    # ✅ 模型级验证
    @model_validator(mode="after")
    def validate_model(self) -> "CreateUserRequest":
        if self.username.lower() == "admin" and self.age and self.age < 18:
            raise ValueError("admin 用户必须年满 18 岁")
        return self

# ✅ 更新模型（部分更新）
class UpdateUserRequest(BaseModel):
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    email: Optional[str] = None
    age: Optional[int] = Field(None, ge=0, le=150)
    
    model_config = {
        "extra": "forbid",  # 禁止额外字段
    }
```

### 1.2 响应模型

```python
from pydantic import BaseModel, ConfigDict
from datetime import datetime

# ✅ 响应模型
class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    created_at: datetime
    
    model_config = ConfigDict(
        from_attributes=True,  # 支持 ORM 对象转换
    )

# ✅ 分页响应
class PaginatedResponse(BaseModel, Generic[T]):
    items: list[T]
    total: int
    page: int
    page_size: int
    pages: int

# ✅ 统一响应格式
class APIResponse(BaseModel, Generic[T]):
    code: int = 0
    message: str = "success"
    data: Optional[T] = None

# ✅ 使用响应模型
@app.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: int):
    user = await User.get(user_id)
    return user  # 自动转换为 UserResponse

# ✅ 排除敏感字段
class UserDetailResponse(BaseModel):
    id: int
    username: str
    email: str
    # password_hash 不包含
    
    model_config = ConfigDict(
        from_attributes=True,
    )
```

### 1.3 嵌套模型

```python
from pydantic import BaseModel
from typing import Optional

# ✅ 嵌套模型定义
class Address(BaseModel):
    street: str
    city: str
    country: str
    zip_code: Optional[str] = None

class Company(BaseModel):
    name: str
    address: Address

class UserWithCompany(BaseModel):
    id: int
    username: str
    company: Optional[Company] = None

# ✅ 列表嵌套
class OrderItem(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0)
    price: float = Field(..., gt=0)

class CreateOrderRequest(BaseModel):
    items: list[OrderItem] = Field(..., min_length=1)
    shipping_address: Address
    notes: Optional[str] = None
    
    @computed_field
    @property
    def total_amount(self) -> float:
        return sum(item.price * item.quantity for item in self.items)
```

### 1.4 模型继承与复用

```python
from pydantic import BaseModel

# ✅ 基础模型
class UserBase(BaseModel):
    username: str
    email: str

# ✅ 创建请求继承
class UserCreate(UserBase):
    password: str

# ✅ 更新请求（所有字段可选）
class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None

# ✅ 响应模型继承
class UserInDB(UserBase):
    id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

# ✅ 带关联数据的响应
class UserWithPosts(UserInDB):
    posts: list["PostResponse"] = []
```

---

## 二、依赖注入

### 2.1 依赖设计

```python
from fastapi import Depends, HTTPException, status
from typing import Annotated

# ✅ 数据库会话依赖
async def get_db():
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()

# ✅ 类型别名简化
DB = Annotated[AsyncSession, Depends(get_db)]

# ✅ 使用依赖
@app.get("/users")
async def list_users(db: DB):
    result = await db.execute(select(User))
    return result.scalars().all()

# ✅ 当前用户依赖
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = await db.get(User, user_id)
    if user is None:
        raise credentials_exception
    
    return user

CurrentUser = Annotated[User, Depends(get_current_user)]

# ✅ 使用当前用户
@app.get("/users/me")
async def read_users_me(current_user: CurrentUser):
    return current_user
```

### 2.2 依赖类

```python
from fastapi import Depends, Query

# ✅ 分页依赖类
class Pagination:
    def __init__(
        self,
        page: int = Query(1, ge=1, description="页码"),
        page_size: int = Query(20, ge=1, le=100, description="每页数量"),
    ):
        self.page = page
        self.page_size = page_size
        self.offset = (page - 1) * page_size

# ✅ 使用分页
@app.get("/users")
async def list_users(
    db: DB,
    pagination: Pagination = Depends(),
):
    query = select(User).offset(pagination.offset).limit(pagination.page_size)
    result = await db.execute(query)
    return result.scalars().all()

# ✅ 过滤依赖类
class UserFilter:
    def __init__(
        self,
        username: Optional[str] = Query(None, description="用户名过滤"),
        email: Optional[str] = Query(None, description="邮箱过滤"),
        is_active: Optional[bool] = Query(None, description="是否激活"),
    ):
        self.username = username
        self.email = email
        self.is_active = is_active
    
    def apply(self, query):
        if self.username:
            query = query.where(User.username.ilike(f"%{self.username}%"))
        if self.email:
            query = query.where(User.email.ilike(f"%{self.email}%"))
        if self.is_active is not None:
            query = query.where(User.is_active == self.is_active)
        return query
```

### 2.3 依赖复用与组合

```python
from fastapi import Depends

# ✅ 依赖组合
async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

async def get_current_admin_user(
    current_user: User = Depends(get_current_active_user),
) -> User:
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return current_user

# ✅ 类型别名
ActiveUser = Annotated[User, Depends(get_current_active_user)]
AdminUser = Annotated[User, Depends(get_current_admin_user)]

# ✅ 使用
@app.get("/admin/users")
async def admin_list_users(admin: AdminUser, db: DB):
    result = await db.execute(select(User))
    return result.scalars().all()

# ✅ 路由级依赖
admin_router = APIRouter(
    prefix="/admin",
    dependencies=[Depends(get_current_admin_user)],
)

@admin_router.get("/stats")
async def get_stats(db: DB):
    # 所有路由都需要管理员权限
    pass
```

---

## 三、异步编程

### 3.1 异步数据库

```python
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase

# ✅ 异步引擎配置
engine = create_async_engine(
    "postgresql+asyncpg://user:pass@localhost/db",
    echo=True,
    pool_size=10,
    max_overflow=20,
)

async_session = async_sessionmaker(engine, expire_on_commit=False)

# ✅ 异步 CRUD
async def get_user(db: AsyncSession, user_id: int) -> Optional[User]:
    return await db.get(User, user_id)

async def get_users(
    db: AsyncSession,
    skip: int = 0,
    limit: int = 100,
) -> list[User]:
    result = await db.execute(
        select(User).offset(skip).limit(limit)
    )
    return result.scalars().all()

async def create_user(db: AsyncSession, user: UserCreate) -> User:
    db_user = User(**user.model_dump())
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

# ✅ 关联查询
async def get_user_with_posts(db: AsyncSession, user_id: int) -> Optional[User]:
    result = await db.execute(
        select(User)
        .options(selectinload(User.posts))
        .where(User.id == user_id)
    )
    return result.scalar_one_or_none()
```

### 3.2 异步 HTTP 请求

```python
import httpx
from fastapi import BackgroundTasks

# ✅ 异步 HTTP 客户端
async def fetch_external_data(url: str) -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.get(url, timeout=10.0)
        response.raise_for_status()
        return response.json()

# ✅ 并发请求
async def fetch_all_data(urls: list[str]) -> list[dict]:
    async with httpx.AsyncClient() as client:
        tasks = [client.get(url) for url in urls]
        responses = await asyncio.gather(*tasks, return_exceptions=True)
        
        results = []
        for response in responses:
            if isinstance(response, Exception):
                results.append({"error": str(response)})
            else:
                results.append(response.json())
        return results

# ✅ 后台任务
def send_email_background(email: str, message: str):
    # 同步任务在后台执行
    send_email(email, message)

@app.post("/users")
async def create_user(
    user: UserCreate,
    background_tasks: BackgroundTasks,
    db: DB,
):
    db_user = await create_user_in_db(db, user)
    background_tasks.add_task(send_email_background, user.email, "Welcome!")
    return db_user
```

### 3.3 异步注意事项

```python
import asyncio

# ❌ 在异步函数中使用同步阻塞调用
@app.get("/bad")
async def bad_endpoint():
    time.sleep(1)  # 阻塞整个事件循环！
    requests.get("http://example.com")  # 同步 HTTP！
    return {"status": "bad"}

# ✅ 使用异步版本
@app.get("/good")
async def good_endpoint():
    await asyncio.sleep(1)
    async with httpx.AsyncClient() as client:
        await client.get("http://example.com")
    return {"status": "good"}

# ✅ 如果必须调用同步代码，使用线程池
@app.get("/sync-in-async")
async def sync_in_async():
    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(None, sync_heavy_computation)
    return {"result": result}

# ✅ 或者定义为同步函数（FastAPI 自动在线程池中运行）
@app.get("/sync")
def sync_endpoint():
    # 同步函数会在线程池中运行，不会阻塞事件循环
    time.sleep(1)
    return {"status": "ok"}

# ✅ 超时控制
@app.get("/with-timeout")
async def with_timeout():
    try:
        async with asyncio.timeout(5.0):
            result = await slow_operation()
            return {"result": result}
    except asyncio.TimeoutError:
        raise HTTPException(status_code=504, detail="Operation timed out")
```

---

## 四、安全认证

### 4.1 OAuth2 + JWT

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta

# 配置
SECRET_KEY = os.environ["SECRET_KEY"]
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# ✅ 密码处理
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

# ✅ Token 生成
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# ✅ 登录端点
@app.post("/token")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: DB,
):
    user = await authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

# ✅ Token 验证
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = await db.get(User, int(user_id))
    if user is None:
        raise credentials_exception
    
    return user
```

### 4.2 权限控制

```python
from enum import Enum
from fastapi import Depends, HTTPException, status

class Permission(str, Enum):
    READ = "read"
    WRITE = "write"
    DELETE = "delete"
    ADMIN = "admin"

# ✅ 权限检查依赖
class PermissionChecker:
    def __init__(self, required_permissions: list[Permission]):
        self.required_permissions = required_permissions
    
    async def __call__(self, current_user: User = Depends(get_current_user)) -> User:
        for permission in self.required_permissions:
            if permission not in current_user.permissions:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Permission denied: {permission}",
                )
        return current_user

# ✅ 使用权限检查
@app.delete(
    "/users/{user_id}",
    dependencies=[Depends(PermissionChecker([Permission.DELETE, Permission.ADMIN]))],
)
async def delete_user(user_id: int, db: DB):
    await db.execute(delete(User).where(User.id == user_id))
    await db.commit()
    return {"status": "deleted"}

# ✅ 资源所有者检查
async def get_own_resource(
    resource_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Resource:
    resource = await db.get(Resource, resource_id)
    if resource is None:
        raise HTTPException(status_code=404, detail="Resource not found")
    if resource.owner_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    return resource
```

### 4.3 API Key 认证

```python
from fastapi import Security
from fastapi.security import APIKeyHeader, APIKeyQuery

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)
api_key_query = APIKeyQuery(name="api_key", auto_error=False)

async def get_api_key(
    api_key_header: str = Security(api_key_header),
    api_key_query: str = Security(api_key_query),
) -> str:
    api_key = api_key_header or api_key_query
    if api_key is None:
        raise HTTPException(status_code=401, detail="API Key required")
    
    # 验证 API Key
    if not await verify_api_key(api_key):
        raise HTTPException(status_code=401, detail="Invalid API Key")
    
    return api_key

@app.get("/api/data")
async def get_data(api_key: str = Depends(get_api_key)):
    return {"data": "protected"}
```

---

## 五、API 设计

### 5.1 路由组织

```python
from fastapi import APIRouter

# ✅ 模块化路由
users_router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)

@users_router.get("/")
async def list_users():
    pass

@users_router.get("/{user_id}")
async def get_user(user_id: int):
    pass

# ✅ 版本化 API
v1_router = APIRouter(prefix="/v1")
v1_router.include_router(users_router)
v1_router.include_router(posts_router)

v2_router = APIRouter(prefix="/v2")
v2_router.include_router(users_v2_router)

app.include_router(v1_router)
app.include_router(v2_router)

# ✅ 带认证的路由组
admin_router = APIRouter(
    prefix="/admin",
    tags=["admin"],
    dependencies=[Depends(get_current_admin_user)],
)
```

### 5.2 响应模型与状态码

```python
from fastapi import status
from fastapi.responses import JSONResponse

# ✅ 明确响应模型和状态码
@app.post(
    "/users",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        400: {"model": ErrorResponse, "description": "Validation error"},
        409: {"model": ErrorResponse, "description": "User already exists"},
    },
)
async def create_user(user: UserCreate, db: DB):
    existing = await db.execute(
        select(User).where(User.email == user.email)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this email already exists",
        )
    
    db_user = User(**user.model_dump())
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

# ✅ 自定义响应
@app.get("/download/{file_id}")
async def download_file(file_id: int):
    file = await get_file(file_id)
    return Response(
        content=file.content,
        media_type="application/octet-stream",
        headers={
            "Content-Disposition": f'attachment; filename="{file.name}"'
        },
    )
```

### 5.3 OpenAPI 文档

```python
from fastapi import FastAPI

# ✅ 应用配置
app = FastAPI(
    title="My API",
    description="API 描述",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    openapi_tags=[
        {"name": "users", "description": "用户管理"},
        {"name": "posts", "description": "文章管理"},
    ],
)

# ✅ 端点文档
@app.get(
    "/users/{user_id}",
    summary="获取用户详情",
    description="根据用户 ID 获取用户详细信息",
    response_description="用户信息",
    responses={
        200: {
            "description": "成功",
            "content": {
                "application/json": {
                    "example": {"id": 1, "username": "john", "email": "john@example.com"}
                }
            },
        },
        404: {"description": "用户不存在"},
    },
)
async def get_user(
    user_id: int = Path(..., description="用户 ID", ge=1),
):
    pass

# ✅ 生产环境禁用文档
app = FastAPI(
    docs_url=None if PRODUCTION else "/docs",
    redoc_url=None if PRODUCTION else "/redoc",
    openapi_url=None if PRODUCTION else "/openapi.json",
)
```

### 5.4 异常处理

```python
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

# ✅ 自定义异常
class AppException(Exception):
    def __init__(self, code: str, message: str, status_code: int = 400):
        self.code = code
        self.message = message
        self.status_code = status_code

# ✅ 异常处理器
@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.code,
                "message": exc.message,
            }
        },
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "请求参数验证失败",
                "details": exc.errors(),
            }
        },
    )

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": "HTTP_ERROR",
                "message": exc.detail,
            }
        },
    )
```

---

## 六、中间件与生命周期

### 6.1 中间件

```python
from fastapi import FastAPI, Request
from starlette.middleware.cors import CORSMiddleware
import time

app = FastAPI()

# ✅ CORS 中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://example.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ 自定义中间件
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

# ✅ 请求日志中间件
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Request: {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Response: {response.status_code}")
    return response
```

### 6.2 生命周期事件

```python
from contextlib import asynccontextmanager

# ✅ 使用 lifespan（推荐）
@asynccontextmanager
async def lifespan(app: FastAPI):
    # 启动时执行
    await init_db()
    await init_cache()
    logger.info("Application started")
    
    yield
    
    # 关闭时执行
    await close_db()
    await close_cache()
    logger.info("Application shutdown")

app = FastAPI(lifespan=lifespan)

# ✅ 旧版事件（已弃用但仍可用）
@app.on_event("startup")
async def startup_event():
    await init_db()

@app.on_event("shutdown")
async def shutdown_event():
    await close_db()
```

---

## 检查工具

```bash
# 类型检查
mypy --strict app/

# 测试
pytest --cov=app --cov-report=html

# API 测试
httpx http://localhost:8000/docs

# 性能测试
locust -f locustfile.py

# 安全扫描
bandit -r app/
```

---

## 相关资源

- [Python 基础审查指南](python-review.md)
- [异步编程示例](examples/async-await.md)
- [安全性示例](examples/security.md)

---

**版本**: 1.0.0  
**更新时间**: 2025-12-30  
**作者**: spec-code Team
