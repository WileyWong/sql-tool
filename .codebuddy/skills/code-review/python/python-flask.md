# Flask 专项审查指南

基于 Flask 最佳实践的专项代码审查。

> 📚 **前置**: 请先阅读 [Python 基础审查指南](python-review.md)
> ⚠️ **版本说明**: 本指南涵盖 Flask 2.0 - 3.0 特性

## 审查维度

| 维度 | 权重 | 检查要点 |
|------|------|---------|
| 应用结构 | 20% | 蓝图组织、工厂模式、配置管理 |
| 安全配置 | 25% | Secret Key、CORS、CSRF、XSS |
| 请求处理 | 20% | 请求上下文、输入验证、错误处理 |
| 扩展使用 | 20% | SQLAlchemy、登录管理、缓存 |
| 性能优化 | 15% | 响应优化、异步支持、连接池 |

---

## 一、应用结构

### 1.1 蓝图组织

```python
# ✅ 推荐的项目结构
"""
myapp/
├── __init__.py          # 应用工厂
├── config.py            # 配置类
├── extensions.py        # 扩展初始化
├── models/              # 数据模型
│   ├── __init__.py
│   └── user.py
├── api/                 # API 蓝图
│   ├── __init__.py
│   ├── auth.py
│   └── users.py
├── views/               # 视图蓝图
│   ├── __init__.py
│   └── main.py
├── services/            # 业务逻辑
│   └── user_service.py
└── utils/               # 工具函数
    └── helpers.py
"""

# ✅ 蓝图定义 (api/users.py)
from flask import Blueprint, jsonify, request

users_bp = Blueprint("users", __name__, url_prefix="/api/users")

@users_bp.route("/", methods=["GET"])
def list_users():
    users = User.query.all()
    return jsonify([u.to_dict() for u in users])

@users_bp.route("/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict())

# ✅ 蓝图注册 (__init__.py)
def create_app(config_name="default"):
    app = Flask(__name__)
    
    # 注册蓝图
    from .api.users import users_bp
    from .api.auth import auth_bp
    from .views.main import main_bp
    
    app.register_blueprint(users_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(main_bp)
    
    return app
```

### 1.2 应用工厂模式

```python
# ✅ 应用工厂 (__init__.py)
from flask import Flask
from .config import config
from .extensions import db, migrate, login_manager, cache

def create_app(config_name="default"):
    app = Flask(__name__)
    
    # 加载配置
    app.config.from_object(config[config_name])
    
    # 初始化扩展
    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)
    cache.init_app(app)
    
    # 注册蓝图
    register_blueprints(app)
    
    # 注册错误处理
    register_error_handlers(app)
    
    # 注册 Shell 上下文
    register_shell_context(app)
    
    return app

def register_blueprints(app):
    from .api import api_bp
    from .views import main_bp
    
    app.register_blueprint(api_bp, url_prefix="/api")
    app.register_blueprint(main_bp)

def register_error_handlers(app):
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Not found"}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500

def register_shell_context(app):
    @app.shell_context_processor
    def make_shell_context():
        return {"db": db, "User": User}
```

### 1.3 配置管理

```python
# ✅ 配置类 (config.py)
import os

class Config:
    """基础配置"""
    SECRET_KEY = os.environ.get("SECRET_KEY") or "hard-to-guess-string"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # 邮件配置
    MAIL_SERVER = os.environ.get("MAIL_SERVER", "smtp.gmail.com")
    MAIL_PORT = int(os.environ.get("MAIL_PORT", 587))
    MAIL_USE_TLS = True
    
    @staticmethod
    def init_app(app):
        pass

class DevelopmentConfig(Config):
    """开发环境配置"""
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get("DEV_DATABASE_URL") or \
        "sqlite:///dev.db"

class TestingConfig(Config):
    """测试环境配置"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    WTF_CSRF_ENABLED = False

class ProductionConfig(Config):
    """生产环境配置"""
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
    
    @classmethod
    def init_app(cls, app):
        Config.init_app(app)
        
        # 日志配置
        import logging
        from logging.handlers import RotatingFileHandler
        
        file_handler = RotatingFileHandler(
            "logs/app.log",
            maxBytes=10 * 1024 * 1024,
            backupCount=10
        )
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)

config = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}

# ❌ 危险配置
class BadConfig:
    SECRET_KEY = "hardcoded-secret"  # 硬编码密钥
    DEBUG = True  # 生产环境开启调试
    SQLALCHEMY_DATABASE_URI = "mysql://root:password@localhost/db"  # 硬编码密码
```

### 1.4 扩展初始化

```python
# ✅ 扩展初始化 (extensions.py)
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_caching import Cache
from flask_cors import CORS
from flask_wtf.csrf import CSRFProtect

db = SQLAlchemy()
migrate = Migrate()
login_manager = LoginManager()
cache = Cache()
cors = CORS()
csrf = CSRFProtect()

# 配置 login_manager
login_manager.login_view = "auth.login"
login_manager.login_message = "请先登录"

@login_manager.user_loader
def load_user(user_id):
    from .models import User
    return User.query.get(int(user_id))
```

---

## 二、安全配置

### 2.1 Secret Key 管理

```python
import os
import secrets

# ✅ 从环境变量获取
SECRET_KEY = os.environ.get("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY environment variable is not set")

# ✅ 开发环境可以生成随机密钥
if os.environ.get("FLASK_ENV") == "development":
    SECRET_KEY = secrets.token_hex(32)

# ❌ 危险：硬编码密钥
SECRET_KEY = "my-secret-key"
```

### 2.2 CORS 配置

```python
from flask_cors import CORS

# ✅ 精确配置 CORS
def configure_cors(app):
    CORS(app, resources={
        r"/api/*": {
            "origins": ["https://example.com", "https://www.example.com"],
            "methods": ["GET", "POST", "PUT", "DELETE"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True,
            "max_age": 3600,
        }
    })

# ❌ 危险：允许所有来源
CORS(app, resources={r"/*": {"origins": "*"}})

# ✅ 根据环境配置
if app.config["ENV"] == "development":
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
else:
    CORS(app, resources={r"/api/*": {"origins": "https://example.com"}})
```

### 2.3 CSRF 保护

```python
from flask_wtf.csrf import CSRFProtect, generate_csrf

csrf = CSRFProtect()

def create_app():
    app = Flask(__name__)
    csrf.init_app(app)
    return app

# ✅ API 蓝图豁免 CSRF（使用 Token 认证）
from flask_wtf.csrf import CSRFProtect

csrf = CSRFProtect()

@csrf.exempt
@api_bp.route("/webhook", methods=["POST"])
def webhook():
    # Webhook 不需要 CSRF
    pass

# ✅ 为 AJAX 请求提供 CSRF Token
@app.route("/csrf-token", methods=["GET"])
def get_csrf_token():
    return jsonify({"csrf_token": generate_csrf()})

# ✅ 模板中使用 CSRF Token
"""
<form method="post">
    <input type="hidden" name="csrf_token" value="{{ csrf_token() }}">
    <!-- 表单字段 -->
</form>
"""

# ✅ JavaScript AJAX 请求
"""
fetch('/api/endpoint', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': document.querySelector('meta[name="csrf-token"]').content
    },
    body: JSON.stringify(data)
});
"""
```

### 2.4 XSS 防护

```python
from markupsafe import escape
import bleach

# ✅ Jinja2 自动转义（默认开启）
# templates/user.html
"""
<!-- 自动转义 -->
<p>{{ user.name }}</p>

<!-- ❌ 危险：禁用转义 -->
<p>{{ user.bio|safe }}</p>
"""

# ✅ 手动转义
@app.route("/search")
def search():
    query = request.args.get("q", "")
    safe_query = escape(query)
    return render_template("search.html", query=safe_query)

# ✅ 富文本清理
def clean_html(html: str) -> str:
    allowed_tags = ["p", "br", "strong", "em", "a", "ul", "ol", "li"]
    allowed_attrs = {"a": ["href", "title"]}
    return bleach.clean(html, tags=allowed_tags, attributes=allowed_attrs)

# ✅ 设置安全响应头
@app.after_request
def set_security_headers(response):
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "SAMEORIGIN"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Content-Security-Policy"] = "default-src 'self'"
    return response
```

### 2.5 SQL 注入防护

```python
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# ✅ 使用 ORM（自动参数化）
def get_user_by_email(email: str):
    return User.query.filter_by(email=email).first()

def search_users(keyword: str):
    return User.query.filter(User.name.ilike(f"%{keyword}%")).all()

# ✅ 原生 SQL 使用参数化
def search_users_raw(keyword: str):
    sql = "SELECT * FROM users WHERE name LIKE :keyword"
    result = db.session.execute(sql, {"keyword": f"%{keyword}%"})
    return result.fetchall()

# ❌ 危险：字符串拼接
def search_users_bad(keyword: str):
    sql = f"SELECT * FROM users WHERE name LIKE '%{keyword}%'"
    result = db.session.execute(sql)  # SQL 注入！
```

---

## 三、请求处理

### 3.1 请求上下文

```python
from flask import request, g, current_app
import time

# ✅ 使用 g 对象存储请求级数据
@app.before_request
def before_request():
    g.start_time = time.time()
    g.request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))

@app.after_request
def after_request(response):
    duration = time.time() - g.start_time
    response.headers["X-Request-Duration"] = f"{duration:.3f}"
    response.headers["X-Request-ID"] = g.request_id
    return response

# ✅ 获取当前用户
from flask_login import current_user

@app.route("/profile")
@login_required
def profile():
    return jsonify(current_user.to_dict())

# ✅ 应用上下文
def get_config_value(key):
    return current_app.config.get(key)
```

### 3.2 输入验证

```python
from flask import request, jsonify
from marshmallow import Schema, fields, validate, ValidationError

# ✅ 使用 Marshmallow 验证
class UserSchema(Schema):
    username = fields.Str(
        required=True,
        validate=[
            validate.Length(min=3, max=50),
            validate.Regexp(r"^[a-zA-Z0-9_]+$", error="只允许字母、数字和下划线")
        ]
    )
    email = fields.Email(required=True)
    age = fields.Int(validate=validate.Range(min=0, max=150))
    role = fields.Str(validate=validate.OneOf(["user", "admin"]))

user_schema = UserSchema()

@app.route("/users", methods=["POST"])
def create_user():
    try:
        data = user_schema.load(request.json)
    except ValidationError as e:
        return jsonify({"errors": e.messages}), 400
    
    user = User(**data)
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201

# ✅ 使用 WTForms 验证
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField
from wtforms.validators import DataRequired, Email, Length

class LoginForm(FlaskForm):
    email = StringField("Email", validators=[DataRequired(), Email()])
    password = PasswordField("Password", validators=[DataRequired(), Length(min=8)])

@app.route("/login", methods=["POST"])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        # 处理登录
        pass
    return jsonify({"errors": form.errors}), 400

# ✅ 手动验证
def validate_user_input(data: dict) -> tuple[bool, dict]:
    errors = {}
    
    if not data.get("username"):
        errors["username"] = "用户名不能为空"
    elif len(data["username"]) < 3:
        errors["username"] = "用户名至少 3 个字符"
    
    if not data.get("email"):
        errors["email"] = "邮箱不能为空"
    elif "@" not in data["email"]:
        errors["email"] = "邮箱格式不正确"
    
    return len(errors) == 0, errors
```

### 3.3 错误处理

```python
from flask import jsonify
from werkzeug.exceptions import HTTPException

# ✅ 自定义异常
class APIError(Exception):
    def __init__(self, message: str, code: str, status_code: int = 400):
        self.message = message
        self.code = code
        self.status_code = status_code

class NotFoundError(APIError):
    def __init__(self, resource: str):
        super().__init__(f"{resource} not found", "NOT_FOUND", 404)

class ValidationError(APIError):
    def __init__(self, message: str):
        super().__init__(message, "VALIDATION_ERROR", 400)

# ✅ 注册错误处理器
@app.errorhandler(APIError)
def handle_api_error(error):
    return jsonify({
        "error": {
            "code": error.code,
            "message": error.message,
        }
    }), error.status_code

@app.errorhandler(HTTPException)
def handle_http_exception(error):
    return jsonify({
        "error": {
            "code": error.name.upper().replace(" ", "_"),
            "message": error.description,
        }
    }), error.code

@app.errorhandler(Exception)
def handle_exception(error):
    app.logger.exception("Unhandled exception")
    return jsonify({
        "error": {
            "code": "INTERNAL_ERROR",
            "message": "An unexpected error occurred",
        }
    }), 500

# ✅ 使用自定义异常
@app.route("/users/<int:user_id>")
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        raise NotFoundError("User")
    return jsonify(user.to_dict())
```

---

## 四、扩展使用

### 4.1 Flask-SQLAlchemy

```python
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

# ✅ 模型定义
class User(db.Model):
    __tablename__ = "users"
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # 关系
    posts = db.relationship("Post", backref="author", lazy="dynamic")
    
    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "created_at": self.created_at.isoformat(),
        }

# ✅ 查询优化
def get_users_with_posts():
    # 预加载关联数据
    return User.query.options(
        db.joinedload(User.posts)
    ).all()

# ✅ 分页
@app.route("/users")
def list_users():
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 20, type=int)
    
    pagination = User.query.paginate(page=page, per_page=per_page)
    
    return jsonify({
        "items": [u.to_dict() for u in pagination.items],
        "total": pagination.total,
        "pages": pagination.pages,
        "page": page,
    })

# ✅ 事务管理
def transfer_money(from_id: int, to_id: int, amount: float):
    try:
        from_account = Account.query.get(from_id)
        to_account = Account.query.get(to_id)
        
        from_account.balance -= amount
        to_account.balance += amount
        
        db.session.commit()
    except Exception:
        db.session.rollback()
        raise
```

### 4.2 Flask-Login

```python
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash

login_manager = LoginManager()
login_manager.login_view = "auth.login"

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True)
    password_hash = db.Column(db.String(128))
    
    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

@login_manager.user_loader
def load_user(user_id: str):
    return User.query.get(int(user_id))

# ✅ 登录视图
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(username=data["username"]).first()
    
    if user and user.check_password(data["password"]):
        login_user(user, remember=data.get("remember", False))
        return jsonify({"message": "登录成功"})
    
    return jsonify({"error": "用户名或密码错误"}), 401

# ✅ 登出视图
@auth_bp.route("/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "已登出"})

# ✅ 保护视图
@app.route("/profile")
@login_required
def profile():
    return jsonify(current_user.to_dict())
```

### 4.3 Flask-Caching

```python
from flask_caching import Cache

cache = Cache()

# ✅ 配置缓存
class Config:
    CACHE_TYPE = "redis"
    CACHE_REDIS_URL = os.environ.get("REDIS_URL", "redis://localhost:6379/0")
    CACHE_DEFAULT_TIMEOUT = 300

# ✅ 视图缓存
@app.route("/articles")
@cache.cached(timeout=60, query_string=True)
def list_articles():
    articles = Article.query.all()
    return jsonify([a.to_dict() for a in articles])

# ✅ 函数缓存
@cache.memoize(timeout=300)
def get_user_stats(user_id: int):
    # 耗时计算
    return calculate_stats(user_id)

# ✅ 手动缓存操作
def get_article(article_id: int):
    cache_key = f"article:{article_id}"
    
    article = cache.get(cache_key)
    if article is None:
        article = Article.query.get_or_404(article_id)
        cache.set(cache_key, article.to_dict(), timeout=300)
    
    return article

# ✅ 缓存失效
def update_article(article_id: int, data: dict):
    article = Article.query.get_or_404(article_id)
    for key, value in data.items():
        setattr(article, key, value)
    db.session.commit()
    
    # 清除缓存
    cache.delete(f"article:{article_id}")
    cache.delete_memoized(get_user_stats, article.author_id)
```

---

## 五、性能优化

### 5.1 响应优化

```python
from flask import jsonify, make_response
import gzip

# ✅ 启用 Gzip 压缩
from flask_compress import Compress

compress = Compress()

def create_app():
    app = Flask(__name__)
    compress.init_app(app)
    return app

# ✅ 设置缓存头
@app.route("/static-data")
def static_data():
    response = jsonify({"data": "static"})
    response.headers["Cache-Control"] = "public, max-age=3600"
    response.headers["ETag"] = "some-hash"
    return response

# ✅ 条件请求
@app.route("/resource/<int:id>")
def get_resource(id):
    resource = Resource.query.get_or_404(id)
    etag = f'"{resource.updated_at.timestamp()}"'
    
    if request.headers.get("If-None-Match") == etag:
        return "", 304
    
    response = jsonify(resource.to_dict())
    response.headers["ETag"] = etag
    return response
```

### 5.2 异步支持 (Flask 2.0+)

```python
import asyncio
from flask import Flask

app = Flask(__name__)

# ✅ 异步视图 (Flask 2.0+)
@app.route("/async")
async def async_view():
    await asyncio.sleep(1)
    return jsonify({"message": "async response"})

# ✅ 异步数据库查询
async def get_users_async():
    # 使用异步数据库驱动
    async with async_session() as session:
        result = await session.execute(select(User))
        return result.scalars().all()

# ✅ 并发请求
import aiohttp

async def fetch_all(urls: list[str]):
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_url(session, url) for url in urls]
        return await asyncio.gather(*tasks)

async def fetch_url(session, url):
    async with session.get(url) as response:
        return await response.json()
```

### 5.3 数据库连接池

```python
# ✅ SQLAlchemy 连接池配置
class Config:
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_size": 10,
        "pool_recycle": 3600,
        "pool_pre_ping": True,
        "max_overflow": 20,
    }

# ✅ 请求结束时清理 session
@app.teardown_appcontext
def shutdown_session(exception=None):
    db.session.remove()
```

---

## 检查工具

```bash
# Flask 调试
flask shell
flask routes

# 性能分析
pip install flask-debugtoolbar
pip install line-profiler

# 安全检查
pip install bandit
bandit -r myapp/

# 代码质量
flake8 myapp/
pylint myapp/
```

---

## 相关资源

- [Python 基础审查指南](python-review.md)
- [安全性示例](examples/security.md)
- [性能优化示例](examples/performance.md)

---

**版本**: 1.0.0  
**更新时间**: 2025-12-30  
**作者**: spec-code Team
