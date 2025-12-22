**项目地址**: [https://git.woa.com/hr-team/sdc-std-devkit-team/sdc-std-scaffold-java](https://git.woa.com/hr-team/sdc-std-devkit-team/sdc-std-scaffold-java)

---
### **项目结构说明**

| 项目名称                              | 说明                           | 运行环境                                     |
|-----------------------------------|------------------------------|------------------------------------------|
| hrit-project-core                 | 项目框架逻辑工具包                    | Kona jdk(17+) + Maven包管理                 |
| hrit-project-spring-boot2-starter | 基于spring-boot2框架，自动装配配置类的工具包 | Springboot2.x + Kona jdk(17+) + Maven包管理 |
| hrit-project-spring-boot3-starter | 基于spring-boot3框架，自动装配配置类的工具包 | Springboot3.x + Kona jdk(17+) + Maven包管理 |
| hrit-project-spring-boot2-demo    | 基于spring-boot2框架的demo项目      | Springboot2.x + Kona jdk(17+) + Maven包管理 |
| hrit-project-spring-boot3-demo    | 基于spring-boot3框架的demo项目      | Springboot3.x + Kona jdk(17+) + Maven包管理 |


**demo项目** //代码组织结构\
-- **java**\
----- controller //API接口层\
----- annotation //自定义注解，如权限控制\
----- aspect //切面控制定义\
----- entity //数据库物理模型映射层\
----- enums //全局枚举定义\
----- exception //全局异常处理\
----- interceptor //拦截器定义，访问日志采集，统一鉴权处理\
----- mapper //Mybatis数据库访问DTO目录\
----- model //实体定义\
----- service //业务逻辑处理、demo代码\
----- webconfig //web服务全局配置，如拦截器全局配置，自定义配置注入\
----- util //常用工具类\
----- DemoApplication //应用入口\
-- **resources**\
----- mapper //Mybatis数据库操作脚本生成目录\
----- application-*.yml //全局配置文件，包含各类环境\
----- logback-spring.xml //全局日志配置文件\

**核心逻辑：**

![img.png](img.png)

### hrit-project-spring-boot3-demo
**特性说明：**
* 支持多环境配置文件独立管理
* logback日志组件，采用异步写日志数据，并提供按时间滚动存储日志文件
* GlobalExceptionHandler 提供全局异常处理入口
* SmartProxyAuth 提供企业IT太湖用户身份验证
* AccessLogInterceptor 提供全局用户日志访问采集器
* 通过自定义注解 RightPermission + RightPermissionAspect 实现对用户访问权限进行校验（注意TODO注释，需要自行实现），测试用例可参考StaffController对应方法注解
* 数据库操作采用 Mybatis（推荐自动化代码生成工具 MyBatisCodeHelperPro 好用但不免费 https://brucege.com/doc
  ）,model用于存储数据表定义映射，mapper用于数据访问操作接口，测试用例入口可参考
  StaffController、OrgController（结合上述步骤的权限控制）,提供员工查询、更新、新增、批量插入组织（推荐构造sql脚本进行批量插入，性能有保障）、多表关联查询等操作（可通过客户端调试工具进行测试，如ApiFox有个人版）
* Redis缓存操作，webconfig.LettuceConfig明确通信协议为RESP2，避免出现连接授权异常（当前腾讯云Redis
  6.X似乎对Resp3通信有一些问题），webconfig.RedisConfig 配置对象序列化，测试用户可参考
  RedisController，提供对key-value，hash基础示例
* 通过http Form表单上传文件，结合spring.servlet.multipart配置，测试用例可参考FileController
* 通过Redisson实现分布锁，webconfig.RedissonConfig自定义扩展配置，DistributedTryLock + DistributedTryLockAspect 通用注解方式实现方法级TryLock分布式锁控制，可参考RedissonController测试用例

### 编译/发布项目
* windows系统
在sdc-std-scaffold-java目录下执行命令 build/build.bat或者build/build.bat deploy

* linux系统
在sdc-std-scaffold-java目录下执行命令 sh build/build.sh或者sh build/build.sh deploy

* deploy参数是可选的，有deploy参数则会发布到远程maven仓库，无deploy参数会发布到本地maven仓库