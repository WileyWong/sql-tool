# Django 专项审查指南

基于 Django 最佳实践的专项代码审查。

> 📚 **前置**: 请先阅读 [Python 基础审查指南](python-review.md)
> ⚠️ **版本说明**: 本指南涵盖 Django 3.2 - 5.0 特性

## 审查维度

| 维度 | 权重 | 检查要点 |
|------|------|---------|
| ORM 优化 | 25% | N+1 问题、查询优化、索引使用 |
| 安全配置 | 25% | CSRF、XSS、SQL 注入、settings 安全 |
| 视图规范 | 20% | CBV/FBV 选择、权限控制、响应处理 |
| 模型设计 | 15% | 字段选择、关系设计、迁移管理 |
| 中间件与信号 | 15% | 中间件顺序、信号使用、性能影响 |

---

## 一、ORM 优化

### 1.1 N+1 问题解决

```python
# ❌ N+1 查询问题
def get_orders_bad():
    orders = Order.objects.all()
    for order in orders:
        print(order.user.name)  # 每次循环查询 user 表
        print(order.items.count())  # 每次循环查询 items 表

# ✅ select_related（外键/一对一关系）
def get_orders_good():
    # 一次 JOIN 查询获取 user
    orders = Order.objects.select_related("user", "shipping_address")
    for order in orders:
        print(order.user.name)  # 无额外查询

# ✅ prefetch_related（多对多/反向外键）
def get_orders_with_items():
    # 两次查询：orders + items
    orders = Order.objects.prefetch_related("items", "items__product")
    for order in orders:
        for item in order.items.all():  # 无额外查询
            print(item.product.name)

# ✅ Prefetch 对象自定义查询
from django.db.models import Prefetch

def get_active_orders():
    active_items = Prefetch(
        "items",
        queryset=OrderItem.objects.filter(status="active").select_related("product")
    )
    return Order.objects.prefetch_related(active_items)
```

### 1.2 查询优化

```python
from django.db.models import F, Q, Count, Sum, Avg
from django.db.models.functions import Coalesce

# ✅ 使用 F() 表达式避免竞态条件
def increment_view_count(article_id: int):
    # ❌ 竞态条件
    article = Article.objects.get(id=article_id)
    article.view_count += 1
    article.save()
    
    # ✅ 原子操作
    Article.objects.filter(id=article_id).update(view_count=F("view_count") + 1)

# ✅ 使用 Q() 复杂查询
def search_users(keyword: str, is_active: bool = None):
    query = Q(username__icontains=keyword) | Q(email__icontains=keyword)
    if is_active is not None:
        query &= Q(is_active=is_active)
    return User.objects.filter(query)

# ✅ 聚合查询
def get_order_stats(user_id: int):
    return Order.objects.filter(user_id=user_id).aggregate(
        total_orders=Count("id"),
        total_amount=Sum("amount"),
        avg_amount=Avg("amount"),
    )

# ✅ only() 和 defer() 优化字段加载
def get_user_names():
    # 只加载需要的字段
    return User.objects.only("id", "username", "email")

def get_users_without_bio():
    # 延迟加载大字段
    return User.objects.defer("bio", "avatar")

# ✅ values() 和 values_list() 返回字典/元组
def get_user_ids():
    return User.objects.values_list("id", flat=True)

# ✅ exists() 判断存在性
def user_exists(email: str) -> bool:
    # ❌ 低效
    return len(User.objects.filter(email=email)) > 0
    
    # ✅ 高效
    return User.objects.filter(email=email).exists()

# ✅ count() 计数
def get_user_count() -> int:
    # ❌ 低效
    return len(User.objects.all())
    
    # ✅ 高效
    return User.objects.count()
```

### 1.3 批量操作

```python
# ✅ bulk_create 批量创建
def create_users_bulk(user_data_list: list[dict]):
    users = [User(**data) for data in user_data_list]
    User.objects.bulk_create(users, batch_size=1000)

# ✅ bulk_update 批量更新
def deactivate_users(user_ids: list[int]):
    users = User.objects.filter(id__in=user_ids)
    for user in users:
        user.is_active = False
    User.objects.bulk_update(users, ["is_active"], batch_size=1000)

# ✅ update() 批量更新（无需加载对象）
def deactivate_users_efficient(user_ids: list[int]):
    User.objects.filter(id__in=user_ids).update(is_active=False)

# ✅ delete() 批量删除
def delete_old_logs():
    cutoff = timezone.now() - timedelta(days=30)
    deleted, _ = Log.objects.filter(created_at__lt=cutoff).delete()
    return deleted
```

### 1.4 索引优化

```python
from django.db import models

class Article(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)  # 自动创建唯一索引
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, db_index=True)  # 单字段索引
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        # ✅ 复合索引
        indexes = [
            models.Index(fields=["author", "status"]),
            models.Index(fields=["created_at", "status"]),
            models.Index(fields=["-created_at"]),  # 降序索引
        ]
        # ✅ 唯一约束
        constraints = [
            models.UniqueConstraint(
                fields=["author", "slug"],
                name="unique_author_slug"
            ),
        ]
```

---

## 二、安全配置

### 2.1 settings.py 安全设置

```python
# ✅ 生产环境必须配置
DEBUG = False
SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]
ALLOWED_HOSTS = ["example.com", "www.example.com"]

# ✅ HTTPS 相关
SECURE_SSL_REDIRECT = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# ✅ HSTS 配置
SECURE_HSTS_SECONDS = 31536000  # 1 年
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# ✅ 其他安全设置
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = "DENY"

# ✅ CSRF 配置
CSRF_TRUSTED_ORIGINS = ["https://example.com"]

# ❌ 危险配置
DEBUG = True  # 生产环境
SECRET_KEY = "hardcoded-secret"  # 硬编码
ALLOWED_HOSTS = ["*"]  # 允许所有主机
```

### 2.2 CSRF 保护

```python
# ✅ 中间件配置（默认启用）
MIDDLEWARE = [
    "django.middleware.csrf.CsrfViewMiddleware",
    # ...
]

# ✅ 模板中使用 csrf_token
# templates/form.html
"""
<form method="post">
    {% csrf_token %}
    {{ form }}
    <button type="submit">Submit</button>
</form>
"""

# ✅ AJAX 请求携带 CSRF Token
"""
// JavaScript
const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
fetch('/api/endpoint/', {
    method: 'POST',
    headers: {
        'X-CSRFToken': csrftoken,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
});
"""

# ✅ API 视图豁免 CSRF（使用 Token 认证时）
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.authentication import TokenAuthentication

@api_view(["POST"])
@authentication_classes([TokenAuthentication])
def api_endpoint(request):
    # Token 认证的 API 可以豁免 CSRF
    pass

# ❌ 危险：无条件豁免 CSRF
@csrf_exempt
def dangerous_view(request):
    pass
```

### 2.3 XSS 防护

```python
# ✅ Django 模板自动转义（默认开启）
# templates/user.html
"""
<!-- 自动转义，安全 -->
<p>{{ user.name }}</p>

<!-- ❌ 危险：禁用转义 -->
<p>{{ user.bio|safe }}</p>

<!-- ✅ 如果必须输出 HTML，使用 bleach 清理 -->
<p>{{ user.bio|bleach_clean|safe }}</p>
"""

# ✅ 自定义 bleach 过滤器
import bleach
from django import template

register = template.Library()

@register.filter
def bleach_clean(value):
    allowed_tags = ["p", "br", "strong", "em", "a"]
    allowed_attrs = {"a": ["href", "title"]}
    return bleach.clean(value, tags=allowed_tags, attributes=allowed_attrs)

# ✅ 富文本输入清理
def clean_html_input(html: str) -> str:
    return bleach.clean(
        html,
        tags=["p", "br", "strong", "em", "ul", "ol", "li", "a"],
        attributes={"a": ["href"]},
        strip=True,
    )
```

### 2.4 SQL 注入防护

```python
# ✅ ORM 自动参数化
User.objects.filter(username=user_input)
User.objects.filter(email__icontains=search_term)

# ✅ 原生 SQL 使用参数化
from django.db import connection

def search_users_raw(keyword: str):
    with connection.cursor() as cursor:
        # ✅ 参数化查询
        cursor.execute(
            "SELECT * FROM users WHERE username LIKE %s",
            [f"%{keyword}%"]
        )
        return cursor.fetchall()

# ❌ 危险：字符串拼接
def search_users_bad(keyword: str):
    with connection.cursor() as cursor:
        cursor.execute(f"SELECT * FROM users WHERE username LIKE '%{keyword}%'")

# ✅ extra() 和 RawSQL 使用参数
from django.db.models import RawSQL

User.objects.annotate(
    full_name=RawSQL("CONCAT(first_name, ' ', last_name)", [])
)
```

---

## 三、视图规范

### 3.1 CBV vs FBV 选择

```python
from django.views import View
from django.views.generic import ListView, DetailView, CreateView
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin

# ✅ 简单逻辑用 FBV
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({"status": "ok"})

# ✅ CRUD 操作用 Generic CBV
class ArticleListView(LoginRequiredMixin, ListView):
    model = Article
    template_name = "articles/list.html"
    context_object_name = "articles"
    paginate_by = 20
    
    def get_queryset(self):
        return Article.objects.filter(
            status="published"
        ).select_related("author")

class ArticleDetailView(DetailView):
    model = Article
    template_name = "articles/detail.html"
    
    def get_queryset(self):
        return Article.objects.select_related("author").prefetch_related("comments")

class ArticleCreateView(LoginRequiredMixin, PermissionRequiredMixin, CreateView):
    model = Article
    fields = ["title", "content", "status"]
    permission_required = "articles.add_article"
    
    def form_valid(self, form):
        form.instance.author = self.request.user
        return super().form_valid(form)

# ✅ 复杂逻辑用自定义 CBV
class OrderProcessView(LoginRequiredMixin, View):
    def post(self, request, order_id):
        order = get_object_or_404(Order, id=order_id, user=request.user)
        
        try:
            order.process()
            messages.success(request, "订单处理成功")
        except OrderError as e:
            messages.error(request, str(e))
        
        return redirect("order_detail", order_id=order_id)
```

### 3.2 权限控制

```python
from django.contrib.auth.decorators import login_required, permission_required
from django.contrib.auth.mixins import UserPassesTestMixin

# ✅ FBV 权限装饰器
@login_required
def profile(request):
    return render(request, "profile.html")

@permission_required("articles.change_article", raise_exception=True)
def edit_article(request, article_id):
    pass

# ✅ CBV 权限 Mixin
class AdminOnlyView(UserPassesTestMixin, View):
    def test_func(self):
        return self.request.user.is_staff

# ✅ 对象级权限
class ArticleUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = Article
    
    def test_func(self):
        article = self.get_object()
        return article.author == self.request.user or self.request.user.is_staff

# ✅ DRF 权限
from rest_framework.permissions import BasePermission

class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return True
        return obj.owner == request.user
```

### 3.3 响应处理

```python
from django.http import JsonResponse, HttpResponseRedirect
from django.shortcuts import render, redirect, get_object_or_404

# ✅ 统一 JSON 响应格式
def api_response(data=None, message="success", code=200):
    return JsonResponse({
        "code": code,
        "message": message,
        "data": data,
    }, status=code)

# ✅ 错误处理
from django.http import Http404

def get_article(request, article_id):
    article = get_object_or_404(Article, id=article_id, status="published")
    return render(request, "article.html", {"article": article})

# ✅ 自定义错误页面
# urls.py
handler404 = "myapp.views.custom_404"
handler500 = "myapp.views.custom_500"

# views.py
def custom_404(request, exception):
    return render(request, "errors/404.html", status=404)

def custom_500(request):
    return render(request, "errors/500.html", status=500)
```

---

## 四、模型设计

### 4.1 字段选择

```python
from django.db import models
from django.utils import timezone

class Article(models.Model):
    # ✅ 主键选择
    id = models.BigAutoField(primary_key=True)  # Django 3.2+ 默认
    # 或使用 UUID
    # id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # ✅ 字符串字段
    title = models.CharField(max_length=200)  # 有长度限制
    slug = models.SlugField(max_length=200, unique=True)
    content = models.TextField()  # 无长度限制
    
    # ✅ 时间字段
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)
    
    # ✅ 状态字段使用 choices
    class Status(models.TextChoices):
        DRAFT = "draft", "草稿"
        PUBLISHED = "published", "已发布"
        ARCHIVED = "archived", "已归档"
    
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT,
        db_index=True,
    )
    
    # ✅ 金额使用 DecimalField
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    # ✅ JSON 字段（Django 3.1+）
    metadata = models.JSONField(default=dict, blank=True)
    
    class Meta:
        ordering = ["-created_at"]
        verbose_name = "文章"
        verbose_name_plural = "文章"
```

### 4.2 关系设计

```python
from django.db import models

class User(models.Model):
    username = models.CharField(max_length=150, unique=True)

class Profile(models.Model):
    # ✅ 一对一关系
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    bio = models.TextField(blank=True)

class Article(models.Model):
    # ✅ 外键关系
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="articles",
    )
    
    # ✅ 多对多关系
    tags = models.ManyToManyField(
        "Tag",
        related_name="articles",
        blank=True,
    )
    
    # ✅ 自关联
    parent = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="children",
    )

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

# ✅ 中间表自定义
class ArticleTag(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ["article", "tag"]
```

### 4.3 on_delete 选择

```python
# ✅ CASCADE：级联删除（父删子也删）
author = models.ForeignKey(User, on_delete=models.CASCADE)

# ✅ PROTECT：保护（有子记录时禁止删除父）
category = models.ForeignKey(Category, on_delete=models.PROTECT)

# ✅ SET_NULL：置空（需要 null=True）
reviewer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

# ✅ SET_DEFAULT：设为默认值
status = models.ForeignKey(Status, on_delete=models.SET_DEFAULT, default=1)

# ✅ SET()：设为指定值
def get_sentinel_user():
    return User.objects.get_or_create(username="deleted")[0]

author = models.ForeignKey(User, on_delete=models.SET(get_sentinel_user))

# ✅ DO_NOTHING：不做任何操作（需要数据库层面处理）
# 谨慎使用，可能导致引用完整性问题
```

### 4.4 迁移管理

```bash
# ✅ 创建迁移
python manage.py makemigrations

# ✅ 检查迁移 SQL
python manage.py sqlmigrate app_name 0001

# ✅ 执行迁移
python manage.py migrate

# ✅ 回滚迁移
python manage.py migrate app_name 0001

# ✅ 查看迁移状态
python manage.py showmigrations
```

```python
# ✅ 数据迁移
from django.db import migrations

def forwards_func(apps, schema_editor):
    User = apps.get_model("myapp", "User")
    for user in User.objects.all():
        user.full_name = f"{user.first_name} {user.last_name}"
        user.save()

def backwards_func(apps, schema_editor):
    pass  # 反向迁移逻辑

class Migration(migrations.Migration):
    dependencies = [
        ("myapp", "0001_initial"),
    ]
    
    operations = [
        migrations.RunPython(forwards_func, backwards_func),
    ]
```

---

## 五、中间件与信号

### 5.1 中间件顺序

```python
# ✅ 推荐的中间件顺序
MIDDLEWARE = [
    # 安全中间件（最外层）
    "django.middleware.security.SecurityMiddleware",
    
    # Session（在认证之前）
    "django.contrib.sessions.middleware.SessionMiddleware",
    
    # 通用中间件
    "django.middleware.common.CommonMiddleware",
    
    # CSRF（在视图之前）
    "django.middleware.csrf.CsrfViewMiddleware",
    
    # 认证
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    
    # 消息
    "django.contrib.messages.middleware.MessageMiddleware",
    
    # 点击劫持保护
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    
    # 自定义中间件
    "myapp.middleware.RequestLoggingMiddleware",
]
```

### 5.2 自定义中间件

```python
import time
import logging

logger = logging.getLogger(__name__)

# ✅ 函数式中间件
def request_logging_middleware(get_response):
    def middleware(request):
        start_time = time.time()
        
        response = get_response(request)
        
        duration = time.time() - start_time
        logger.info(
            f"{request.method} {request.path} - {response.status_code} - {duration:.3f}s"
        )
        
        return response
    
    return middleware

# ✅ 类式中间件
class RequestLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        # 请求前处理
        request.start_time = time.time()
        
        response = self.get_response(request)
        
        # 响应后处理
        duration = time.time() - request.start_time
        response["X-Request-Duration"] = str(duration)
        
        return response
    
    def process_exception(self, request, exception):
        # 异常处理
        logger.exception(f"Exception in {request.path}")
        return None  # 继续传播异常
```

### 5.3 信号使用

```python
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from django.core.cache import cache

# ✅ 使用装饰器注册信号
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

# ✅ 缓存失效
@receiver(post_save, sender=Article)
@receiver(pre_delete, sender=Article)
def invalidate_article_cache(sender, instance, **kwargs):
    cache.delete(f"article:{instance.id}")
    cache.delete("article_list")

# ✅ 在 apps.py 中注册信号
class MyAppConfig(AppConfig):
    name = "myapp"
    
    def ready(self):
        import myapp.signals  # 导入信号模块

# ⚠️ 信号注意事项
# 1. 避免在信号中执行耗时操作
# 2. 信号是同步的，会阻塞请求
# 3. 考虑使用 Celery 异步任务替代耗时信号
```

---

## 六、Django REST Framework

### 6.1 序列化器

```python
from rest_framework import serializers

# ✅ ModelSerializer
class ArticleSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="author.username", read_only=True)
    
    class Meta:
        model = Article
        fields = ["id", "title", "content", "author", "author_name", "created_at"]
        read_only_fields = ["author", "created_at"]
    
    def validate_title(self, value):
        if len(value) < 5:
            raise serializers.ValidationError("标题至少 5 个字符")
        return value
    
    def create(self, validated_data):
        validated_data["author"] = self.context["request"].user
        return super().create(validated_data)

# ✅ 嵌套序列化器
class ArticleDetailSerializer(ArticleSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    
    class Meta(ArticleSerializer.Meta):
        fields = ArticleSerializer.Meta.fields + ["comments"]
```

### 6.2 ViewSet

```python
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Article.objects.select_related("author").prefetch_related("tags")
    
    def get_serializer_class(self):
        if self.action == "retrieve":
            return ArticleDetailSerializer
        return ArticleSerializer
    
    @action(detail=True, methods=["post"])
    def publish(self, request, pk=None):
        article = self.get_object()
        article.status = "published"
        article.save()
        return Response({"status": "published"})
    
    @action(detail=False, methods=["get"])
    def my_articles(self, request):
        articles = self.get_queryset().filter(author=request.user)
        serializer = self.get_serializer(articles, many=True)
        return Response(serializer.data)
```

---

## 检查工具

```bash
# Django 安全检查
python manage.py check --deploy

# 数据库检查
python manage.py dbshell

# 查看 SQL 查询
# settings.py
LOGGING = {
    "version": 1,
    "handlers": {
        "console": {"class": "logging.StreamHandler"},
    },
    "loggers": {
        "django.db.backends": {
            "level": "DEBUG",
            "handlers": ["console"],
        },
    },
}

# Django Debug Toolbar（开发环境）
pip install django-debug-toolbar
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
