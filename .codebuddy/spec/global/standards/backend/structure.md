# 后端目录结构规范

**版本**: 1.0  
**最后更新**: 2025-11-01  
**适用范围**: 所有后端项目

---

## 📋 概述

本文档定义了后端项目的标准目录结构,包括 Java、Node.js、Python 三种主流技术栈的项目组织方式。

**核心原则**:
- 清晰的分层架构
- 职责分离
- 易于理解和维护
- 支持模块化扩展

---

## ☕ Java/Spring Boot 项目结构

### 1. 标准目录结构

```
project-name/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── company/
│   │   │           └── project/
│   │   │               ├── ProjectApplication.java
│   │   │               ├── config/              # 配置类
│   │   │               │   ├── RedisConfig.java
│   │   │               │   ├── MybatisConfig.java
│   │   │               │   └── SecurityConfig.java
│   │   │               ├── controller/          # 控制器层
│   │   │               │   ├── UserController.java
│   │   │               │   └── OrderController.java
│   │   │               ├── service/             # 服务层
│   │   │               │   ├── UserService.java
│   │   │               │   ├── impl/
│   │   │               │   │   └── UserServiceImpl.java
│   │   │               │   └── OrderService.java
│   │   │               ├── repository/          # 数据访问层
│   │   │               │   ├── UserRepository.java
│   │   │               │   └── OrderRepository.java
│   │   │               ├── mapper/              # MyBatis Mapper
│   │   │               │   ├── UserMapper.java
│   │   │               │   └── OrderMapper.java
│   │   │               ├── entity/              # 实体类
│   │   │               │   ├── po/              # 持久化对象
│   │   │               │   │   ├── UserPO.java
│   │   │               │   │   └── OrderPO.java
│   │   │               │   ├── dto/             # 数据传输对象
│   │   │               │   │   ├── UserDTO.java
│   │   │               │   │   └── OrderDTO.java
│   │   │               │   └── vo/              # 视图对象
│   │   │               │       ├── UserVO.java
│   │   │               │       └── OrderVO.java
│   │   │               ├── request/             # 请求对象
│   │   │               │   ├── UserCreateRequest.java
│   │   │               │   └── UserUpdateRequest.java
│   │   │               ├── response/            # 响应对象
│   │   │               │   ├── UserResponse.java
│   │   │               │   └── OrderResponse.java
│   │   │               ├── exception/           # 异常类
│   │   │               │   ├── BusinessException.java
│   │   │               │   ├── UserNotFoundException.java
│   │   │               │   └── GlobalExceptionHandler.java
│   │   │               ├── enums/               # 枚举类
│   │   │               │   ├── UserStatus.java
│   │   │               │   └── OrderStatus.java
│   │   │               ├── constant/            # 常量类
│   │   │               │   ├── RedisKey.java
│   │   │               │   └── ErrorCode.java
│   │   │               ├── util/                # 工具类
│   │   │               │   ├── DateUtil.java
│   │   │               │   └── JsonUtil.java
│   │   │               ├── converter/           # 转换器
│   │   │               │   └── UserConverter.java
│   │   │               └── aspect/              # 切面
│   │   │                   └── LogAspect.java
│   │   └── resources/
│   │       ├── application.yml                  # 主配置文件
│   │       ├── application-dev.yml              # 开发环境配置
│   │       ├── application-test.yml             # 测试环境配置
│   │       ├── application-prod.yml             # 生产环境配置
│   │       ├── mapper/                          # MyBatis XML
│   │       │   ├── UserMapper.xml
│   │       │   └── OrderMapper.xml
│   │       ├── db/                              # 数据库脚本
│   │       │   └── migration/
│   │       │       ├── V1__init.sql
│   │       │       └── V2__add_user_table.sql
│   │       └── static/                          # 静态资源
│   └── test/
│       └── java/
│           └── com/
│               └── company/
│                   └── project/
│                       ├── controller/          # 控制器测试
│                       │   └── UserControllerTest.java
│                       ├── service/             # 服务测试
│                       │   └── UserServiceTest.java
│                       └── repository/          # 仓储测试
│                           └── UserRepositoryTest.java
├── pom.xml                                      # Maven 配置
├── .gitignore
└── README.md
```

### 2. 分层说明

#### 2.1 Controller 层
- 负责接收 HTTP 请求
- 参数校验
- 调用 Service 层
- 返回响应

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/{id}")
    public Result<UserResponse> getUserById(@PathVariable Long id) {
        UserResponse user = userService.getUserById(id);
        return Result.success(user);
    }
}
```

#### 2.2 Service 层
- 业务逻辑处理
- 事务管理
- 调用 Repository 层

```java
@Service
public class UserServiceImpl implements UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    @Transactional
    public UserResponse getUserById(Long id) {
        UserPO user = userRepository.findById(id);
        return UserConverter.toResponse(user);
    }
}
```

#### 2.3 Repository 层
- 数据访问
- 数据库操作

```java
@Repository
public interface UserRepository extends JpaRepository<UserPO, Long> {
    
    UserPO findByUsername(String username);
    
    List<UserPO> findByStatus(UserStatus status);
}
```

### 3. 对象类型说明

| 类型 | 说明 | 使用场景 |
|------|------|---------|
| **PO** (Persistent Object) | 持久化对象 | 与数据库表对应 |
| **DTO** (Data Transfer Object) | 数据传输对象 | 服务间传输 |
| **VO** (View Object) | 视图对象 | 前端展示 |
| **Request** | 请求对象 | 接收前端请求 |
| **Response** | 响应对象 | 返回给前端 |

---

## 🟢 Node.js/Nest.js 项目结构

### 1. 标准目录结构

```
project-name/
├── src/
│   ├── main.ts                                  # 入口文件
│   ├── app.module.ts                            # 根模块
│   ├── config/                                  # 配置
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   └── app.config.ts
│   ├── modules/                                 # 功能模块
│   │   ├── user/
│   │   │   ├── user.module.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.repository.ts
│   │   │   ├── entities/
│   │   │   │   └── user.entity.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-user.dto.ts
│   │   │   │   ├── update-user.dto.ts
│   │   │   │   └── user-response.dto.ts
│   │   │   └── interfaces/
│   │   │       └── user.interface.ts
│   │   └── order/
│   │       ├── order.module.ts
│   │       ├── order.controller.ts
│   │       └── order.service.ts
│   ├── common/                                  # 公共模块
│   │   ├── decorators/                          # 装饰器
│   │   │   └── roles.decorator.ts
│   │   ├── filters/                             # 过滤器
│   │   │   └── http-exception.filter.ts
│   │   ├── guards/                              # 守卫
│   │   │   └── auth.guard.ts
│   │   ├── interceptors/                        # 拦截器
│   │   │   └── logging.interceptor.ts
│   │   ├── pipes/                               # 管道
│   │   │   └── validation.pipe.ts
│   │   ├── middleware/                          # 中间件
│   │   │   └── logger.middleware.ts
│   │   └── constants/                           # 常量
│   │       └── error-codes.ts
│   ├── shared/                                  # 共享模块
│   │   ├── services/                            # 共享服务
│   │   │   ├── cache.service.ts
│   │   │   └── logger.service.ts
│   │   └── utils/                               # 工具函数
│   │       ├── date.util.ts
│   │       └── crypto.util.ts
│   └── database/                                # 数据库
│       ├── migrations/                          # 迁移脚本
│       │   └── 1699000000000-CreateUserTable.ts
│       └── seeds/                               # 种子数据
│           └── user.seed.ts
├── test/                                        # 测试
│   ├── unit/
│   │   └── user.service.spec.ts
│   └── e2e/
│       └── user.e2e-spec.ts
├── package.json
├── tsconfig.json
├── .env                                         # 环境变量
├── .env.example
├── .gitignore
└── README.md
```

### 2. 模块组织

```typescript
// user.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
```

### 3. 分层说明

#### 3.1 Controller 层
```typescript
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<UserResponseDto> {
    return this.userService.getUserById(id);
  }
}
```

#### 3.2 Service 层
```typescript
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  
  async getUserById(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    return this.toResponseDto(user);
  }
}
```

#### 3.3 Repository 层
```typescript
@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}
  
  async findById(id: number): Promise<User> {
    return this.repository.findOne({ where: { id } });
  }
}
```

---

## 🐍 Python/FastAPI 项目结构

### 1. 标准目录结构

```
project-name/
├── app/
│   ├── main.py                                  # 入口文件
│   ├── config/                                  # 配置
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   └── database.py
│   ├── api/                                     # API 路由
│   │   ├── __init__.py
│   │   ├── deps.py                              # 依赖注入
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── endpoints/
│   │       │   ├── __init__.py
│   │       │   ├── users.py
│   │       │   └── orders.py
│   │       └── router.py
│   ├── models/                                  # 数据模型
│   │   ├── __init__.py
│   │   ├── user.py
│   │   └── order.py
│   ├── schemas/                                 # Pydantic 模型
│   │   ├── __init__.py
│   │   ├── user.py
│   │   └── order.py
│   ├── services/                                # 业务逻辑
│   │   ├── __init__.py
│   │   ├── user_service.py
│   │   └── order_service.py
│   ├── repositories/                            # 数据访问
│   │   ├── __init__.py
│   │   ├── user_repository.py
│   │   └── order_repository.py
│   ├── core/                                    # 核心功能
│   │   ├── __init__.py
│   │   ├── security.py
│   │   ├── exceptions.py
│   │   └── middleware.py
│   ├── utils/                                   # 工具函数
│   │   ├── __init__.py
│   │   ├── date_util.py
│   │   └── crypto_util.py
│   └── db/                                      # 数据库
│       ├── __init__.py
│       ├── base.py
│       └── migrations/                          # Alembic 迁移
│           └── versions/
│               └── 001_create_user_table.py
├── tests/                                       # 测试
│   ├── __init__.py
│   ├── conftest.py
│   ├── unit/
│   │   └── test_user_service.py
│   └── integration/
│       └── test_user_api.py
├── requirements.txt                             # 依赖
├── requirements-dev.txt                         # 开发依赖
├── .env                                         # 环境变量
├── .env.example
├── .gitignore
└── README.md
```

### 2. 分层说明

#### 2.1 API 层
```python
# app/api/v1/endpoints/users.py
from fastapi import APIRouter, Depends

router = APIRouter()

@router.get("/{user_id}")
async def get_user(
    user_id: int,
    user_service: UserService = Depends(get_user_service)
) -> UserResponse:
    return await user_service.get_user_by_id(user_id)
```

#### 2.2 Service 层
```python
# app/services/user_service.py
class UserService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository
    
    async def get_user_by_id(self, user_id: int) -> UserResponse:
        user = await self.user_repository.find_by_id(user_id)
        return UserResponse.from_orm(user)
```

#### 2.3 Repository 层
```python
# app/repositories/user_repository.py
class UserRepository:
    def __init__(self, db: Session):
        self.db = db
    
    async def find_by_id(self, user_id: int) -> User:
        return self.db.query(User).filter(User.id == user_id).first()
```

---

## 📝 目录结构最佳实践

### 1. 命名规范

| 语言 | 文件命名 | 目录命名 |
|------|---------|---------|
| Java | PascalCase | lowercase |
| TypeScript | kebab-case | kebab-case |
| Python | snake_case | snake_case |

### 2. 模块化原则

- **高内聚**: 相关功能放在同一模块
- **低耦合**: 模块间依赖最小化
- **单一职责**: 每个模块只负责一个功能

### 3. 分层原则

```
Controller/API → Service → Repository → Database
     ↓              ↓           ↓
  请求处理      业务逻辑    数据访问
```

---

## ✅ 目录结构检查清单

- [ ] **分层清晰**
  - [ ] Controller/API 层只处理请求
  - [ ] Service 层包含业务逻辑
  - [ ] Repository 层负责数据访问

- [ ] **命名规范**
  - [ ] 文件命名符合语言规范
  - [ ] 目录命名清晰易懂

- [ ] **模块化**
  - [ ] 功能模块独立
  - [ ] 公共代码抽取到 common/shared

- [ ] **配置管理**
  - [ ] 配置文件分环境
  - [ ] 敏感信息使用环境变量

---

## 📚 参考资源

- [Spring Boot 项目结构最佳实践](https://spring.io/guides/gs/spring-boot/)
- [Nest.js 项目结构](https://docs.nestjs.com/first-steps)
- [FastAPI 项目结构](https://fastapi.tiangolo.com/tutorial/)

---

**维护者**: 架构团队  
**最后更新**: 2025-11-01
