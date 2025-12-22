# 分布式配置中心 API 文档

## 1. 基础信息层

### 1.1 服务标识
- **服务名称**: HR 分布式配置中心 (HR Config Center)
- **英文名称**: HR Distributed Configuration Center
- **所属模块**: HR基础平台
- **版本信息**: 基于 Apollo 1.6.0
- **SDK版本**: 
  - Java Spring Boot: v1.3.6-SNAPSHOT
  - Java Client: v1.1.0
  - Python Client: latest
  - Go Client: v1.0.0
- **状态标识**: ✅ 生产环境稳定运行，推荐使用

### 1.2 环境地址

#### 管理端地址

| 环境 | 管理端地址 |
|-----|----------|
| OA-测试、OA-UAT | https://dev-ntsgw.woa.com/hr-config-portal/ |
| OA-生产 | http://ntsgw.oa.com/hr-config-portal/ |
| SaaS-测试 | https://hrgw-ntp.test-caagw.yunassess.com/api/sso/hr-config-portal/ |
| SaaS-UAT | https://hrgw-ntp.uathr.tencent-cloud.com/api/sso/hr-config-portal/ |
| SaaS-生产 | https://hrgw-ntp.ihr.tencent-cloud.com/hr-config-portal/ |

#### 配置服务地址

| 网络环境 | 环境名 | 配置地址 |
|---------|-------|---------|
| DevNet | TSF集群内-测试环境 | config.meta-url=http://hr-config-service:8080 |
| OA-VPC | TSF集群内-生产环境 | config.meta-url=http://hr-config-service:8080 |
| DevNet | 非TSF集群-测试环境 | config.service-url=http://demo.ntsgw.oa.com/api/pub/hr-config-service |
| OA-VPC | 非TSF集群-生产环境 | config.service-url=http://ntsgw.oa.com/api/pub/hr-config-service |
| SaaS-Test-VPC | SaaS测试环境 | config.service-url=http://gateway.testihrtas.com/api/pub/hr-config-service |
| SaaS-UAT-VPC | SaaS UAT环境 | config.service-url=http://gateway.uatihrtas.com/api/pub/hr-config-service |
| SaaS-Prod-VPC | SaaS生产环境 | config.service-url=http://gateway.prodihrtas.com/api/pub/hr-config-service |

### 1.3 负责人信息
- **维护团队**: 基础组件组
- **技术支持**: 请查看接入文档联系方式
- **接入文档**: https://iwiki.woa.com/p/4007101680
- **详细功能说明**: https://iwiki.woa.com/p/4007094108

---

## 2. 功能概述层

### 2.1 核心职责
提供企业级分布式配置管理能力，支持配置的集中管理、动态发布、灰度发布、版本回滚等功能，实现配置与代码的分离。

### 2.2 使用场景
- **动态配置管理**: 需要在不重启应用的情况下动态修改配置
- **多环境配置**: 需要为不同环境(DEV/UAT/PRO)维护不同配置
- **灰度发布**: 需要先在部分实例验证配置后再全量发布
- **配置权限管理**: 需要对敏感配置进行权限控制
- **配置版本管理**: 需要追溯配置变更历史和快速回滚
- **分布式应用配置同步**: 多实例应用需要统一配置管理

### 2.3 设计目的
- **配置与代码分离**: 配置变更不需要修改代码和重新部署
- **集中管理**: 统一管理所有应用的配置，提升运维效率
- **实时生效**: 配置变更实时推送到客户端，无需重启应用
- **安全可控**: 提供灰度发布、版本回滚、权限管理等安全机制
- **多语言支持**: 支持Java、Python、Go、.Net等多种开发语言

### 2.4 业务价值
- 降低配置管理成本，提升运维效率
- 支持配置实时生效，提升系统灵活性
- 提供灰度发布能力，降低配置变更风险
- 实现配置权限管理，保障配置安全性
- 支持配置版本管理，便于问题追溯和快速回滚

---

## 3. 快速开始

### 3.1 接入准备

#### 步骤1: 应用注册
在[服务市场](http://ntsgw.oa.com/#/main/fly/home-page-app)注册应用，获取AppId

#### 步骤2: 环境检查
- Java项目: JDK 1.7+, Guava 15.0+
- Python项目: Python 2.7+ 或 Python 3.x
- Go项目: Go 1.11+
- 网络环境: 确保可访问配置中心服务地址

#### 步骤3: 创建项目
1. 访问配置中心管理控制台
2. 点击"创建项目"
3. 搜索并选择应用名称
4. 填写部门、AppId、应用名称、负责人等信息

### 3.2 基础接入流程

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌─────────────┐
│  应用注册    │ --> │  创建项目     │ --> │  添加配置   │ --> │  客户端接入  │
│  服务市场    │     │  配置中心     │     │  发布配置   │     │  集成SDK    │
└─────────────┘     └──────────────┘     └─────────────┘     └─────────────┘
```

### 3.3 完整接入示例

#### 示例1: Java Spring Boot 接入

**1. 添加Maven依赖**
```xml
<dependency>
   <groupId>com.tencent.hr</groupId>
   <artifactId>config-spring-boot-starter</artifactId>
   <version>1.3.6-SNAPSHOT</version>
</dependency>
```

**2. 配置application.properties**
```properties
# 应用名称（作为AppId获取配置）
spring.application.name=your_app_name
# 配置中心地址
config.service-url=http://demo.ntsgw.oa.com/api/pub/hr-config-service
# 是否本地模式
config.local-mode=false
# 本地缓存目录
config.local-cache-path=/opt/data
```

**3. 启用Apollo配置**
```java
@SpringBootApplication
@EnableApolloConfig(order = 10)  // 加载默认Namespace(application)
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

**4. 使用配置**
```java
// 方式1: @Value注入
@Value("${db.username}")
private String username;

@Value("${db.password}")
private String password;

// 方式2: @ConfigurationProperties + @RefreshScope
@RefreshScope
@ConfigurationProperties(prefix = "db")
@Component
public class DbConfig {
    private String url;
    private String username;
    private String password;
    // getters and setters
}

// 方式3: 监听配置变化
@ApolloConfigChangeListener
private void onChange(ConfigChangeEvent changeEvent) {
    if (changeEvent.isChanged("db.username")) {
        ConfigChange change = changeEvent.getChange("db.username");
        System.out.println("配置变更: " + change.getOldValue() 
                          + " -> " + change.getNewValue());
    }
}
```

---

#### 示例2: Python 接入

**1. 安装客户端**
```shell
pip install apollo-client
```

**2. 启动客户端并获取配置**
```python
from apollo_client import ApolloClient

# 启动客户端长连接监听
client = ApolloClient(
    app_id='your_app_id', 
    cluster='default', 
    config_server_url='http://demo.ntsgw.oa.com/api/pub/hr-config-service'
)
client.start()

# 获取配置值
username = client.get_value('db.username', 'default_user')
password = client.get_value('db.password', 'default_pass')

print(f'Username: {username}')
print(f'Password: {password}')

# 配置会自动实时同步，无需额外操作
```

---

#### 示例3: Go 接入

**1. 获取安装**
```bash
go get git.code.oa.com/hrplat-middletier/agollo/viper-remote
```

**2. 使用配置**
```go
package main

import (
   "fmt"
   config "git.code.oa.com/hrplat-middletier/agollo/viper-remote"
   "time"
)

func main() {
   c := config.NewConfig(
      "demo",  // appName: 配置中心中的应用英文名
      "appTokenValue",  // appToken: 应用市场中的appToken
      "http://demo.ntsgw.oa.com/api/pub/hr-config-service",  // configServerURL
      "application"  // namespace: 配置中心namespace名称
   )

   // 配置会自动实时同步
   for {
      fmt.Println("username: ", c.GetString("config.username"))
      fmt.Println("password: ", c.GetString("config.password"))
      fmt.Println("size: ", c.GetInt("config.size"))

      time.Sleep(5 * time.Second)
   }
}
```

---

## 4. 依赖关系层

### 4.1 上游依赖

**Maven依赖（Java项目）**:

针对Spring Boot 2.x项目：
```xml
<dependency>
    <groupId>com.tencent.hr</groupId>
    <artifactId>config-spring-boot-starter</artifactId>
    <version>1.3.6-SNAPSHOT</version>
</dependency>
```

针对普通Java项目：
```xml
<dependency>
    <groupId>com.ctrip.framework.apollo</groupId>
    <artifactId>apollo-client</artifactId>
    <version>1.1.0</version>
</dependency>
```

针对TSF项目：
```xml
<!-- 只需升级hr-tsf-starter版本到1.0.3-SNAPSHOT或以上 -->
<dependency>
    <groupId>com.tencent.hr</groupId>
    <artifactId>hr-tsf-starter</artifactId>
    <version>1.0.3-SNAPSHOT</version>
</dependency>
```

针对继承Java开发框架的项目：
```xml
<!-- 只需升级hr-parent-starter版本到1.0.4-SNAPSHOT或以上 -->
<dependency>
    <groupId>com.tencent.hr</groupId>
    <artifactId>hr-parent-starter</artifactId>
    <version>1.0.4-SNAPSHOT</version>
</dependency>
```

**Python依赖**:
```shell
pip install apollo-client
```

**Go依赖**:
```bash
go get git.code.oa.com/hrplat-middletier/agollo/viper-remote
```

### 4.2 外部服务依赖

- **服务市场**: 应用注册和AppId获取
- **配置中心服务**: 配置的存储和推送
- **SSO认证**: 管理端登录认证
- **TSF框架**: 集群内服务发现（可选）

### 4.3 环境依赖

- **网络**: HTTP/HTTPS访问能力
- **本地存储**: 本地缓存目录读写权限
  - Mac/Linux: `/opt/data/{appId}/config-cache`
  - Windows: `C:\opt\data\{appId}\config-cache`
- **Java环境**: JDK 1.7+（Java项目）
- **Guava库**: 15.0+（Java项目）

---

## 5. 接口定义层

### 5.1 核心API列表

#### Java API

| 接口类型 | 接口名称 | 功能说明 |
|---------|---------|----------|
| 配置获取 | ConfigService.getAppConfig() | 获取默认namespace的配置 |
| 配置获取 | ConfigService.getConfig(namespace) | 获取指定namespace的配置 |
| 配置读取 | Config.getProperty(key, defaultValue) | 读取配置项 |
| 配置监听 | Config.addChangeListener(listener) | 监听配置变化 |
| 配置类型 | Config.getIntProperty(key, defaultValue) | 读取整型配置 |
| 配置类型 | Config.getBooleanProperty(key, defaultValue) | 读取布尔型配置 |
| 配置类型 | Config.getDoubleProperty(key, defaultValue) | 读取浮点型配置 |
| 配置类型 | Config.getDateProperty(key, defaultValue) | 读取日期型配置 |
| 配置文件 | ConfigService.getConfigFile(namespace, type) | 获取配置文件内容 |

#### Python API

| 接口名称 | 功能说明 |
|---------|----------|
| ApolloClient.__init__() | 初始化客户端 |
| ApolloClient.start() | 启动长连接监听 |
| ApolloClient.get_value(key, default) | 获取配置值 |

#### Go API

| 接口名称 | 功能说明 |
|---------|----------|
| NewConfig() | 创建配置客户端 |
| GetString(key) | 获取字符串配置 |
| GetInt(key) | 获取整型配置 |
| GetBool(key) | 获取布尔型配置 |

---

### 5.2 Java API 详细说明

#### 5.2.1 获取默认Namespace配置

**接口名称**: `ConfigService.getAppConfig()`

**功能说明**: 获取应用默认namespace（application）的配置对象

**参数**: 无

**返回值**:
```java
Config config  // 配置对象
```

**使用示例**:
```java
Config config = ConfigService.getAppConfig();
String value = config.getProperty("key", "defaultValue");
```

---

#### 5.2.2 获取指定Namespace配置

**接口名称**: `ConfigService.getConfig(String namespace)`

**功能说明**: 获取指定namespace的配置对象

**参数说明**:
```java
String namespace  // namespace名称，如"FX.apollo"、"application.yml"
```

**返回值**:
```java
Config config  // 配置对象
```

**使用示例**:
```java
// 获取公共namespace的配置
Config config = ConfigService.getConfig("FX.apollo");
String value = config.getProperty("key", "defaultValue");

// 获取yaml格式的namespace
Config yamlConfig = ConfigService.getConfig("application.yml");
String yamlValue = yamlConfig.getProperty("server.port", "8080");
```

---

#### 5.2.3 读取配置项

**接口名称**: `Config.getProperty(String key, String defaultValue)`

**功能说明**: 读取配置项，如果配置不存在则返回默认值

**参数说明**:
```java
String key           // 配置项的key
String defaultValue  // 默认值
```

**返回值**:
```java
String value  // 配置值
```

**使用示例**:
```java
Config config = ConfigService.getAppConfig();
String timeout = config.getProperty("request.timeout", "2000");
```

---

#### 5.2.4 读取类型化配置

**接口名称**: 

| 方法 | 说明 | 返回类型 |
|------|------|----------|
| getIntProperty(key, defaultValue) | 读取整型配置 | Integer |
| getBooleanProperty(key, defaultValue) | 读取布尔型配置 | Boolean |
| getDoubleProperty(key, defaultValue) | 读取浮点型配置 | Double |
| getDateProperty(key, defaultValue) | 读取日期型配置 | Date |

**使用示例**:
```java
Config config = ConfigService.getAppConfig();

// 读取整型
int timeout = config.getIntProperty("timeout", 5000);

// 读取布尔型
boolean enabled = config.getBooleanProperty("feature.enabled", false);

// 读取浮点型
double rate = config.getDoubleProperty("discount.rate", 0.85);

// 读取日期型（格式: yyyy-MM-dd HH:mm:ss）
Date date = config.getDateProperty("start.date", 
    new Date(), "yyyy-MM-dd HH:mm:ss");
```

---

#### 5.2.5 监听配置变化

**接口名称**: `Config.addChangeListener(ConfigChangeListener listener)`

**功能说明**: 添加配置变化监听器，当配置发生变化时触发回调

**参数说明**:
```java
ConfigChangeListener listener  // 配置变化监听器
```

**监听器接口**:
```java
public interface ConfigChangeListener {
    void onChange(ConfigChangeEvent changeEvent);
}
```

**ConfigChangeEvent对象**:
```java
public class ConfigChangeEvent {
    String getNamespace()                    // 获取namespace名称
    Set<String> changedKeys()                // 获取变化的key集合
    ConfigChange getChange(String key)       // 获取指定key的变化详情
}

public class ConfigChange {
    String getPropertyName()   // 配置项名称
    String getOldValue()       // 旧值
    String getNewValue()       // 新值
    PropertyChangeType getChangeType()  // 变化类型（ADDED/MODIFIED/DELETED）
}
```

**使用示例**:
```java
Config config = ConfigService.getAppConfig();
config.addChangeListener(new ConfigChangeListener() {
    @Override
    public void onChange(ConfigChangeEvent changeEvent) {
        System.out.println("配置变化的namespace: " + changeEvent.getNamespace());
        
        for (String key : changeEvent.changedKeys()) {
            ConfigChange change = changeEvent.getChange(key);
            System.out.println(String.format(
                "配置变更 - key: %s, oldValue: %s, newValue: %s, changeType: %s", 
                change.getPropertyName(), 
                change.getOldValue(), 
                change.getNewValue(), 
                change.getChangeType()
            ));
        }
    }
});
```

---

#### 5.2.6 获取配置文件内容

**接口名称**: `ConfigService.getConfigFile(String namespace, ConfigFileFormat configFileFormat)`

**功能说明**: 获取配置文件的原始内容（用于xml、json等非properties格式）

**参数说明**:
```java
String namespace                      // namespace名称
ConfigFileFormat configFileFormat     // 配置文件格式
```

**ConfigFileFormat枚举**:
```java
public enum ConfigFileFormat {
    Properties,  // .properties格式
    XML,         // .xml格式
    JSON,        // .json格式
    YML,         // .yml格式
    YAML,        // .yaml格式
    TXT          // .txt格式
}
```

**返回值**:
```java
ConfigFile configFile  // 配置文件对象
```

**ConfigFile接口**:
```java
public interface ConfigFile {
    String getContent()                         // 获取文件内容
    boolean hasContent()                        // 是否有内容
    String getNamespace()                       // 获取namespace
    ConfigFileFormat getConfigFileFormat()      // 获取文件格式
    void addChangeListener(ConfigFileChangeListener listener)  // 添加监听器
}
```

**使用示例**:
```java
// 获取XML配置文件
ConfigFile configFile = ConfigService.getConfigFile(
    "datasource", 
    ConfigFileFormat.XML
);

String xmlContent = configFile.getContent();
System.out.println("XML配置内容: " + xmlContent);

// 监听配置文件变化
configFile.addChangeListener(new ConfigFileChangeListener() {
    @Override
    public void onChange(ConfigFileChangeEvent changeEvent) {
        System.out.println("配置文件发生变化: " + changeEvent.getNewValue());
    }
});
```

---

### 5.3 Spring注解支持

#### 5.3.1 @EnableApolloConfig

**功能说明**: 启用Apollo配置，加载指定的namespace

**使用位置**: `@Configuration`类或`@SpringBootApplication`类

**参数说明**:
```java
String[] value()  // namespace名称数组，默认为{"application"}
int order()       // 加载顺序，数字越小优先级越高
```

**使用示例**:
```java
// 加载默认namespace
@Configuration
@EnableApolloConfig
public class AppConfig {}

// 加载多个namespace
@Configuration
@EnableApolloConfig({"application", "FX.apollo", "application.yml"})
public class AppConfig {}

// 指定加载顺序
@Configuration
@EnableApolloConfig(order = 10)
public class AppConfig {}

// 组合使用
@Configuration
@EnableApolloConfig(value = {"application", "FX.apollo"}, order = 1)
public class AppConfig {}
```

---

#### 5.3.2 @ApolloConfig

**功能说明**: 注入Config对象

**使用位置**: 字段

**参数说明**:
```java
String value()  // namespace名称，默认为"application"
```

**使用示例**:
```java
public class ConfigBean {
    @ApolloConfig
    private Config config;  // 注入application namespace的config
    
    @ApolloConfig("FX.apollo")
    private Config fxConfig;  // 注入FX.apollo namespace的config
    
    public void useConfig() {
        String value = config.getProperty("key", "defaultValue");
    }
}
```

---

#### 5.3.3 @ApolloConfigChangeListener

**功能说明**: 监听配置变化

**使用位置**: 方法

**参数说明**:
```java
String[] value()  // 要监听的namespace数组，默认为{"application"}
String[] interestedKeys()  // 感兴趣的key数组，为空表示监听所有key
String[] interestedKeyPrefixes()  // 感兴趣的key前缀数组
```

**使用示例**:
```java
public class ConfigListener {
    private int batch = 100;
    
    @ApolloConfig
    private Config config;
    
    // 监听默认namespace的所有配置变化
    @ApolloConfigChangeListener
    private void onChange(ConfigChangeEvent changeEvent) {
        if (changeEvent.isChanged("batch")) {
            batch = config.getIntProperty("batch", 100);
        }
    }
    
    // 监听多个namespace的配置变化
    @ApolloConfigChangeListener({"application", "FX.apollo"})
    private void onMultiNamespaceChange(ConfigChangeEvent changeEvent) {
        // 处理配置变化
    }
    
    // 只监听特定key的变化
    @ApolloConfigChangeListener(interestedKeys = {"db.url", "db.username"})
    private void onDbConfigChange(ConfigChangeEvent changeEvent) {
        // 只有db.url或db.username变化时才会触发
    }
    
    // 监听特定前缀的key
    @ApolloConfigChangeListener(interestedKeyPrefixes = {"redis.", "cache."})
    private void onCacheConfigChange(ConfigChangeEvent changeEvent) {
        // 只有redis.或cache.开头的key变化时才会触发
    }
}
```

---

#### 5.3.4 @ApolloJsonValue

**功能说明**: 注入JSON格式的配置值并自动解析为对象

**使用位置**: 字段

**参数说明**:
```java
String value()  // 配置key，支持SpEL表达式
```

**使用示例**:
```java
public class JsonConfigBean {
    // JSON配置格式: {"name":"zhangsan","age":18}
    @ApolloJsonValue("${user.info:{}}")
    private UserInfo userInfo;
    
    // JSON数组配置格式: ["apple","banana","orange"]
    @ApolloJsonValue("${fruit.list:[]}")
    private List<String> fruitList;
    
    static class UserInfo {
        private String name;
        private int age;
        // getters and setters
    }
}
```

---

### 5.4 Python API 详细说明

#### 5.4.1 初始化客户端

**接口名称**: `ApolloClient.__init__()`

**功能说明**: 创建Apollo客户端实例

**参数说明**:
```python
app_id: str              # 应用ID（必填）
cluster: str             # 集群名称，默认'default'（可选）
config_server_url: str   # 配置中心地址（必填）
timeout: int             # 超时时间（秒），默认90（可选）
ip: str                  # 客户端IP，默认自动获取（可选）
```

**使用示例**:
```python
from apollo_client import ApolloClient

client = ApolloClient(
    app_id='your_app_id', 
    cluster='default', 
    config_server_url='http://demo.ntsgw.oa.com/api/pub/hr-config-service',
    timeout=90
)
```

---

#### 5.4.2 启动客户端

**接口名称**: `ApolloClient.start()`

**功能说明**: 启动长连接监听，实时同步配置

**参数**: 无

**返回值**: 无

**使用示例**:
```python
client.start()  # 启动后会在后台自动同步配置
```

---

#### 5.4.3 获取配置值

**接口名称**: `ApolloClient.get_value(key, default_val=None, namespace='application')`

**功能说明**: 获取配置值

**参数说明**:
```python
key: str          # 配置key（必填）
default_val: Any  # 默认值（可选）
namespace: str    # namespace名称，默认'application'（可选）
```

**返回值**:
```python
Any  # 配置值，如果不存在则返回default_val
```

**使用示例**:
```python
# 获取默认namespace的配置
username = client.get_value('db.username', 'default_user')
password = client.get_value('db.password', 'default_pass')

# 获取指定namespace的配置
redis_host = client.get_value('host', '127.0.0.1', namespace='redis')
```

---

### 5.5 Go API 详细说明

#### 5.5.1 创建配置客户端

**接口名称**: `NewConfig(appName, appToken, configServerURL, namespace string) *Config`

**功能说明**: 创建配置客户端实例并自动开始同步配置

**参数说明**:
```go
appName: string          // 应用英文名（必填）
appToken: string         // 应用Token（必填）
configServerURL: string  // 配置中心地址（必填）
namespace: string        // namespace名称（必填）
```

**返回值**:
```go
*Config  // 配置对象
```

**使用示例**:
```go
import config "git.code.oa.com/hrplat-middletier/agollo/viper-remote"

c := config.NewConfig(
    "demo",
    "appTokenValue",
    "http://demo.ntsgw.oa.com/api/pub/hr-config-service",
    "application"
)
```

---

#### 5.5.2 获取字符串配置

**接口名称**: `GetString(key string) string`

**功能说明**: 获取字符串类型的配置值

**参数说明**:
```go
key: string  // 配置key
```

**返回值**:
```go
string  // 配置值
```

**使用示例**:
```go
username := c.GetString("config.username")
password := c.GetString("config.password")
```

---

#### 5.5.3 获取整型配置

**接口名称**: `GetInt(key string) int`

**功能说明**: 获取整型配置值

**参数说明**:
```go
key: string  // 配置key
```

**返回值**:
```go
int  // 配置值
```

**使用示例**:
```go
port := c.GetInt("server.port")
timeout := c.GetInt("request.timeout")
```

---

#### 5.5.4 获取布尔型配置

**接口名称**: `GetBool(key string) bool`

**功能说明**: 获取布尔型配置值

**参数说明**:
```go
key: string  // 配置key
```

**返回值**:
```go
bool  // 配置值
```

**使用示例**:
```go
enabled := c.GetBool("feature.enabled")
debug := c.GetBool("app.debug")
```

---

## 6. 数据契约层

### 6.1 核心数据模型

#### 6.1.1 Config接口（Java）

```java
public interface Config {
    // 基础方法
    String getProperty(String key, String defaultValue);
    Integer getIntProperty(String key, Integer defaultValue);
    Long getLongProperty(String key, Long defaultValue);
    Short getShortProperty(String key, Short defaultValue);
    Float getFloatProperty(String key, Float defaultValue);
    Double getDoubleProperty(String key, Double defaultValue);
    Byte getByteProperty(String key, Byte defaultValue);
    Boolean getBooleanProperty(String key, Boolean defaultValue);
    String[] getArrayProperty(String key, String delimiter, String[] defaultValue);
    Date getDateProperty(String key, Date defaultValue);
    Date getDateProperty(String key, String format, Date defaultValue);
    
    // 高级方法
    Set<String> getPropertyNames();  // 获取所有配置项名称
    void addChangeListener(ConfigChangeListener listener);  // 添加监听器
}
```

---

#### 6.1.2 ConfigChangeEvent对象（Java）

```java
public class ConfigChangeEvent {
    private final String namespace;                    // namespace名称
    private final Map<String, ConfigChange> changes;   // 配置变化映射表
    
    // 方法
    public String getNamespace();
    public Set<String> changedKeys();
    public ConfigChange getChange(String key);
    public boolean isChanged(String key);
}
```

---

#### 6.1.3 ConfigChange对象（Java）

```java
public class ConfigChange {
    private final String namespace;           // namespace名称
    private final String propertyName;        // 配置项名称
    private final String oldValue;            // 旧值
    private final String newValue;            // 新值
    private final PropertyChangeType changeType;  // 变化类型
    
    // 方法
    public String getPropertyName();
    public String getOldValue();
    public String getNewValue();
    public PropertyChangeType getChangeType();
}
```

---

#### 6.1.4 PropertyChangeType枚举（Java）

```java
public enum PropertyChangeType {
    ADDED,     // 新增配置
    MODIFIED,  // 修改配置
    DELETED    // 删除配置
}
```

---

### 6.2 配置文件数据模型

#### 6.2.1 ConfigFile接口（Java）

```java
public interface ConfigFile {
    // 获取文件内容
    String getContent();
    
    // 是否有内容
    boolean hasContent();
    
    // 获取namespace
    String getNamespace();
    
    // 获取文件格式
    ConfigFileFormat getConfigFileFormat();
    
    // 添加变化监听器
    void addChangeListener(ConfigFileChangeListener listener);
}
```

---

#### 6.2.2 ConfigFileFormat枚举（Java）

```java
public enum ConfigFileFormat {
    Properties(".properties"),
    XML(".xml"),
    JSON(".json"),
    YML(".yml"),
    YAML(".yaml"),
    TXT(".txt");
    
    private String value;
    
    ConfigFileFormat(String value) {
        this.value = value;
    }
    
    public String getValue() {
        return value;
    }
}
```

---

### 6.3 数据字典

#### 6.3.1 Namespace类型

| 类型 | 说明 | 使用场景 |
|------|------|----------|
| application | 默认namespace | 应用基础配置 |
| 自定义private | 私有namespace | 应用特定配置，如dbconfig、cacheconfig |
| 公共namespace | 公共namespace | 跨应用共享配置，如公共组件配置 |
| yaml/yml | YAML格式配置 | application.yml, config.yaml |
| properties | Properties格式 | 默认格式 |
| xml | XML格式配置 | datasource.xml |
| json | JSON格式配置 | config.json |

---

#### 6.3.2 Cluster类型

| Cluster | 说明 | 使用场景 |
|---------|------|----------|
| default | 默认集群 | 大部分应用使用默认集群 |
| 自定义cluster | 自定义集群 | 不同集群不同配置，如SHAJQ、BJDC |

---

#### 6.3.3 环境类型（Env）

| 环境 | 说明 | 配置文件设置 |
|------|------|-------------|
| DEV | 开发环境 | env=DEV |
| FAT | 测试环境 | env=FAT |
| UAT | 预发布环境 | env=UAT |
| PRO | 生产环境 | env=PRO |
| Local | 本地开发模式 | env=Local |

---

### 6.4 配置格式规范

#### 6.4.1 Properties格式

```properties
# 数据库配置
db.url=jdbc:mysql://localhost:3306/test
db.username=root
db.password=123456
db.pool.maxActive=20

# Redis配置
redis.host=127.0.0.1
redis.port=6379
redis.timeout=3000

# 应用配置
app.name=demo-app
app.version=1.0.0
feature.enabled=true
```

---

#### 6.4.2 YAML格式

```yaml
# application.yml
db:
  url: jdbc:mysql://localhost:3306/test
  username: root
  password: 123456
  pool:
    maxActive: 20

redis:
  host: 127.0.0.1
  port: 6379
  timeout: 3000

app:
  name: demo-app
  version: 1.0.0
  
feature:
  enabled: true
```

---

#### 6.4.3 JSON格式

```json
{
  "db": {
    "url": "jdbc:mysql://localhost:3306/test",
    "username": "root",
    "password": "123456",
    "pool": {
      "maxActive": 20
    }
  },
  "redis": {
    "host": "127.0.0.1",
    "port": 6379,
    "timeout": 3000
  }
}
```

---

## 7. 运行时行为层

### 7.1 配置加载机制

#### 7.1.1 配置加载流程

```
应用启动
    ↓
读取AppId和Meta Server地址
    ↓
连接Config Service
    ↓         ↘ (失败)
    ↓          ↓
    ↓       从本地缓存加载
    ↓          ↓
    ↓       后台定时重试
    ↓          ↓
    ↓ ←――――――――┘
    ↓
获取配置内容
    ↓
保存到内存
    ↓
保存到本地缓存
    ↓
建立长连接监听
    ↓
应用正常运行
```

---

#### 7.1.2 配置更新机制

1. **长轮询推送（主要机制）**
   - 客户端和服务端保持Http Long Polling连接
   - 配置变更时服务端立即返回，客户端收到推送
   - 实时性：秒级推送

2. **定时拉取（Fallback机制）**
   - 客户端每5分钟定时拉取一次配置
   - 防止推送机制失效导致配置不更新
   - 可通过`apollo.refreshInterval`配置（单位：分钟）

3. **配置生效流程**
   ```
   配置中心发布配置
        ↓
   服务端推送通知 (Http Long Polling)
        ↓
   客户端接收通知
        ↓
   客户端拉取最新配置
        ↓
   更新内存缓存
        ↓
   更新本地文件缓存
        ↓
   触发ConfigChangeListener
        ↓
   配置生效
   ```

---

### 7.2 本地缓存机制

#### 7.2.1 缓存目录

**默认缓存路径**:
- **Mac/Linux**: `/opt/data/{appId}/config-cache`
- **Windows**: `C:\opt\data\{appId}\config-cache`

**自定义缓存路径（按优先级从高到低）**:
1. Java System Property: `-Dapollo.cacheDir=/opt/data/some-cache-dir`
2. Spring Boot配置: `apollo.cacheDir=/opt/data/some-cache-dir`
3. 环境变量: `APOLLO_CACHEDIR`
4. server.properties: `apollo.cacheDir=/opt/data/some-cache-dir`

---

#### 7.2.2 缓存文件命名

格式: `{appId}+{cluster}+{namespace}.properties`

示例:
- AppId: 100004458
- Cluster: default
- Namespace: application
- 文件名: `100004458+default+application.properties`

---

#### 7.2.3 缓存容灾机制

```
应用启动
    ↓
尝试连接配置中心
    ↓
连接失败?
    ↓ (是)
从本地缓存加载配置
    ↓
应用使用缓存配置启动
    ↓
后台定时任务重试连接
    ↓
连接成功?
    ↓ (是)
拉取最新配置
    ↓
更新内存和本地缓存
    ↓
触发配置变更通知
```

---

### 7.3 灰度发布机制

#### 7.3.1 灰度发布流程

```
1. 创建灰度版本
    ↓
2. 配置灰度规则（选择灰度实例）
    ↓
3. 添加灰度配置
    ↓
4. 灰度发布
    ↓
5. 灰度实例获取灰度配置
    其他实例保持主版本配置
    ↓
6. 观察灰度实例运行状态
    ↓
7. 决策
   ├→ 全量发布: 将灰度配置同步到主版本，推送给所有实例
   └→ 放弃灰度: 废弃灰度版本，灰度实例回滚到主版本配置
```

---

#### 7.3.2 灰度规则匹配

**匹配优先级**:
1. 灰度规则匹配: 符合灰度规则的客户端实例使用灰度配置
2. 主版本: 不符合灰度规则的客户端实例使用主版本配置

**灰度规则类型**:
- IP规则: 指定具体的客户端IP地址
- AppId规则: 指定具体的客户端AppId（一般不使用）

---

### 7.4 配置优先级

#### 7.4.1 配置源优先级（从高到低）

1. System Property（-D参数）
2. OS环境变量
3. application.properties配置文件
4. Apollo配置中心
5. 默认值

示例:
```java
// 最终值为 System Property > Apollo > 默认值
String value = config.getProperty("timeout", "5000");

// 如果设置了 -Dtimeout=3000，则 value = "3000"
// 否则从Apollo获取，如果Apollo也没有，则 value = "5000"
```

---

#### 7.4.2 Namespace加载优先级

通过`@EnableApolloConfig`的`order`属性控制:
- order值越小，优先级越高
- 同名配置项，优先级高的namespace会覆盖优先级低的

示例:
```java
@EnableApolloConfig(order = 1)  // 优先级高
@EnableApolloConfig(value = "dbconfig", order = 2)  // 优先级低

// 如果application和dbconfig都有db.url配置
// 最终取application的配置（order=1优先级更高）
```

---

### 7.5 本地开发模式

#### 7.5.1 开启本地模式

**配置env为Local**:

文件路径:
- Mac/Linux: `/opt/settings/server.properties`
- Windows: `C:\opt\settings\server.properties`

文件内容:
```properties
env=Local
```

或通过System Property:
```bash
-Denv=Local
```

---

#### 7.5.2 本地模式特点

- ✅ 只从本地缓存文件读取配置
- ❌ 不连接Apollo服务器
- ❌ 不实时监测文件变化
- ⚠️ 修改配置需要重启应用生效

**使用场景**:
- 飞机、高铁等无网络环境开发
- 本地环境无法访问配置中心
- 测试本地配置变更

---

### 7.6 幂等性与并发安全

#### 7.6.1 配置读取
- **幂等性**: ✅ 支持，多次读取同一配置返回相同值
- **线程安全**: ✅ Config对象是线程安全的，可多线程并发读取

#### 7.6.2 配置监听
- **重复订阅**: 同一监听器多次注册会收到多次通知
- **线程安全**: 监听器回调在单独线程中执行，需注意线程安全

#### 7.6.3 配置缓存
- **缓存一致性**: 通过版本号和长轮询机制保证最终一致性
- **并发更新**: 配置中心服务端通过乐观锁保证并发安全

---

## 8. 错误处理层

### 8.1 常见错误及解决方案

#### 错误1: 连接配置中心失败

**错误现象**: 应用启动日志显示无法连接配置中心

**错误原因**:
- 配置中心地址配置错误
- 网络不通
- AppId未注册

**解决方案**:
```bash
# 1. 检查配置地址是否正确
config.service-url=http://demo.ntsgw.oa.com/api/pub/hr-config-service

# 2. 测试网络连通性
curl http://demo.ntsgw.oa.com/api/pub/hr-config-service

# 3. 确认AppId已在配置中心创建项目
# 访问配置中心管理控制台查看

# 4. 检查本地缓存是否存在（容灾机制）
ls /opt/data/{appId}/config-cache/
```

---

#### 错误2: 配置未生效

**错误现象**: 配置中心已发布配置，但应用未获取到最新值

**错误原因**:
- 配置项使用了`@Value`但未配置自动刷新
- namespace配置错误
- cluster配置错误
- 客户端缓存未更新

**解决方案**:
```java
// 方案1: 使用@RefreshScope
@RefreshScope
@ConfigurationProperties(prefix = "db")
@Component
public class DbConfig {
    // 配置会自动刷新
}

// 方案2: 使用ConfigChangeListener
@ApolloConfigChangeListener
private void onChange(ConfigChangeEvent changeEvent) {
    if (changeEvent.isChanged("db.url")) {
        // 手动更新配置
    }
}

// 方案3: 使用API方式
Config config = ConfigService.getAppConfig();
String value = config.getProperty("key", "default");  // 总是获取最新值
```

---

#### 错误3: 本地缓存读写权限问题

**错误现象**: 应用日志显示无法写入或读取本地缓存

**错误原因**:
- 缓存目录不存在
- 缓存目录无读写权限

**解决方案**:
```bash
# 1. 创建缓存目录
mkdir -p /opt/data

# 2. 赋予读写权限
chmod 755 /opt/data

# 3. 检查目录权限
ls -la /opt/data

# 4. 或通过配置指定其他目录
config.local-cache-path=/home/user/apollo-cache
```

---

#### 错误4: 多环境配置混乱

**错误现象**: 本地开发环境拉取了生产环境配置

**错误原因**: Spring配置文件加载顺序问题

**解决方案**:
```properties
# 在bootstrap.properties中配置（优先级最高）
config.service-url=http://demo.ntsgw.oa.com/api/pub/hr-config-service

# 或通过环境变量
export CONFIG_SERVICE_URL=http://demo.ntsgw.oa.com/api/pub/hr-config-service

# 或通过System Property
-Dconfig.service-url=http://demo.ntsgw.oa.com/api/pub/hr-config-service
```

---

#### 错误5: 灰度发布未生效

**错误现象**: 灰度发布后，灰度实例仍使用主版本配置

**错误原因**:
- 灰度规则未正确配置
- 客户端IP不匹配
- 未进行灰度发布操作

**解决方案**:
```
1. 检查灰度规则
   - 登录配置中心管理控制台
   - 进入项目 -> 查看灰度规则
   - 确认客户端IP在灰度规则中

2. 确认灰度发布
   - 点击"灰度发布"按钮
   - 而不是"发布"按钮

3. 查看客户端日志
   - 确认客户端收到配置更新通知
   - 确认拉取的namespace和cluster正确
```

---

## 9. 配置说明层

### 9.1 配置项清单

#### 9.1.1 必填配置项

| 配置项 | 类型 | 说明 | 默认值 | 配置方式 |
|--------|------|------|--------|----------|
| spring.application.name | String | 应用名称（作为AppId） | - | application.properties |
| config.service-url | String | 配置中心地址（非TSF集群） | - | application.properties |
| config.meta-url | String | 配置中心地址（TSF集群内） | - | application.properties |

---

#### 9.1.2 可选配置项

| 配置项 | 类型 | 说明 | 默认值 | 配置方式 |
|--------|------|------|--------|----------|
| config.app-name | String | AppId（与spring.application.name不一致时使用） | spring.application.name | application.properties |
| config.local-mode | Boolean | 是否开启本地模式 | false | application.properties |
| config.local-cache-path | String | 本地缓存目录 | /opt/data | application.properties |
| apollo.bootstrap.enabled | Boolean | 是否在bootstrap阶段加载配置 | false | bootstrap.properties |
| apollo.bootstrap.namespaces | String | bootstrap阶段加载的namespace列表（逗号分隔） | application | bootstrap.properties |
| apollo.bootstrap.eagerLoad.enabled | Boolean | 是否在日志系统初始化前加载配置 | false | bootstrap.properties |
| apollo.refreshInterval | Integer | 定时拉取配置的时间间隔（分钟） | 5 | System Property |
| apollo.cacheDir | String | 自定义缓存目录 | /opt/data/{appId}/config-cache | 多种方式 |
| apollo.cluster | String | 集群名称 | default | System Property |
| env | String | 环境类型 | - | /opt/settings/server.properties |

---

### 9.2 各环境配置示例

#### 9.2.1 开发环境配置

**application.properties**:
```properties
# 应用名称
spring.application.name=demo-app

# 配置中心地址（测试环境）
config.service-url=http://demo.ntsgw.oa.com/api/pub/hr-config-service

# 开启本地缓存
config.local-mode=false
config.local-cache-path=/opt/data

# 开发环境可以开启更详细的日志
logging.level.com.ctrip.framework.apollo=DEBUG
```

---

#### 9.2.2 测试环境配置

**application.properties**:
```properties
spring.application.name=demo-app
config.service-url=http://demo.ntsgw.oa.com/api/pub/hr-config-service
config.local-mode=false
config.local-cache-path=/opt/data
```

**bootstrap.properties**:
```properties
# 在bootstrap阶段加载配置
apollo.bootstrap.enabled=true
apollo.bootstrap.namespaces=application,dbconfig
apollo.bootstrap.eagerLoad.enabled=true
```

---

#### 9.2.3 生产环境配置（TSF集群内）

**application.properties**:
```properties
spring.application.name=demo-app

# TSF集群内直连配置中心
config.meta-url=http://hr-config-service:8080

config.local-mode=false
config.local-cache-path=/opt/data
```

---

#### 9.2.4 生产环境配置（非TSF集群）

**application.properties**:
```properties
spring.application.name=demo-app

# 通过网关访问配置中心
config.service-url=http://ntsgw.oa.com/api/pub/hr-config-service

config.local-mode=false
config.local-cache-path=/opt/data
```

---

### 9.3 TSF集群配置说明

**TSF集群内连接配置中心**:
```properties
# 直连配置中心，不经过网关，网络耗时更低
config.meta-url=http://hr-config-service:8080
```

**非TSF集群连接配置中心**:
```properties
# 通过网关访问
config.service-url=http://demo.ntsgw.oa.com/api/pub/hr-config-service
```

**区别**:
- `config.meta-url`: TSF集群内服务发现，直连配置中心
- `config.service-url`: 通过网关代理访问配置中心

---

## 10. 最佳实践

### 10.1 Namespace规划最佳实践

#### ✅ 推荐做法

**1. 按功能模块划分namespace**
```
application          # 应用基础配置
  ├─ server.port
  ├─ logging.level
  └─ file.upload.max-size

dbconfig            # 数据库配置（敏感）
  ├─ db.url
  ├─ db.username
  └─ db.password

cacheconfig         # 缓存配置
  ├─ redis.host
  ├─ redis.port
  └─ redis.timeout

messageconfig       # 消息队列配置
  ├─ kafka.bootstrap.servers
  └─ rabbitmq.host
```

**2. 敏感配置隔离**
```java
// 普通配置放在application，授权给普通管理员
@EnableApolloConfig(order = 10)

// 敏感配置放在dbconfig，授权给DBA
@EnableApolloConfig(value = "dbconfig", order = 20)
```

**3. 公共配置抽取**
```
公共组件配置创建为公共namespace，供多个项目使用
如: COMMON.Redis、COMMON.Kafka
```

---

#### ❌ 不推荐做法

**1. 所有配置都放在一个namespace**
```
❌ 不利于权限管理
❌ 配置混乱难以维护
❌ 敏感配置暴露风险
```

**2. 过度拆分namespace**
```
❌ db.username放一个namespace
❌ db.password放另一个namespace
❌ 管理复杂度增加
```

---

### 10.2 配置命名最佳实践

#### ✅ 推荐做法

**1. 使用层级结构**
```properties
# 推荐: 层级清晰
db.mysql.master.url=jdbc:mysql://master:3306/test
db.mysql.master.username=root
db.mysql.slave.url=jdbc:mysql://slave:3306/test
db.mysql.slave.username=readonly

redis.cache.host=127.0.0.1
redis.cache.port=6379
redis.session.host=127.0.0.1
redis.session.port=6380
```

**2. 见名知意**
```properties
# 推荐
file.upload.max-size=10MB
thread.pool.core-size=10
request.timeout.milliseconds=5000

# 不推荐
max=10MB
size=10
timeout=5000
```

**3. 使用标准命名规范**
```properties
# 推荐: kebab-case或camelCase
app.feature-enabled=true
app.featureEnabled=true

# 不推荐: 混合风格
app.Feature_Enabled=true
```

---

### 10.3 灰度发布最佳实践

#### ✅ 推荐流程

**1. 灰度前准备**
```
□ 确认配置变更内容
□ 评估影响范围
□ 准备回滚方案
□ 选择1-2台非核心机器作为灰度实例
```

**2. 灰度发布步骤**
```
1. 创建灰度版本
2. 添加灰度配置
3. 配置灰度规则（选择灰度实例）
4. 灰度发布
5. 观察系统状态30分钟-1小时
   - 监控系统日志
   - 检查业务指标
   - 关注异常告警
6. 确认无问题后全量发布
   或发现问题立即放弃灰度
```

**3. 灰度实例选择**
```
✅ 选择1-2台机器即可
✅ 选择非核心业务机器
✅ 选择流量较小的机器
❌ 不要选择过多灰度实例
❌ 不要选择核心业务机器
```

---

#### ❌ 不推荐做法

**1. 不经过灰度直接全量发布**
```
❌ 高风险操作
❌ 问题影响范围大
❌ 回滚成本高
```

**2. 灰度观察时间过短**
```
❌ 发布后立即全量
❌ 问题可能未暴露
```

---

### 10.4 配置热更新最佳实践

#### ✅ 推荐做法

**1. 使用@RefreshScope**
```java
@RefreshScope
@ConfigurationProperties(prefix = "db")
@Component
public class DbConfig {
    private String url;
    private String username;
    private String password;
    // 配置变更时自动刷新
}
```

**2. 使用ConfigChangeListener**
```java
@Component
public class ConfigService {
    private int poolSize = 10;
    
    @ApolloConfig
    private Config config;
    
    @ApolloConfigChangeListener(interestedKeys = {"thread.pool.size"})
    private void onChange(ConfigChangeEvent changeEvent) {
        ConfigChange change = changeEvent.getChange("thread.pool.size");
        poolSize = Integer.parseInt(change.getNewValue());
        
        // 重新初始化线程池
        reinitThreadPool(poolSize);
        
        log.info("线程池大小已更新: {} -> {}", 
                 change.getOldValue(), change.getNewValue());
    }
}
```

**3. 注意线程安全**
```java
@Component
public class CacheService {
    private volatile int cacheSize;  // 使用volatile保证可见性
    
    @ApolloConfigChangeListener(interestedKeys = {"cache.size"})
    private void onChange(ConfigChangeEvent changeEvent) {
        synchronized (this) {  // 同步更新
            cacheSize = Integer.parseInt(
                changeEvent.getChange("cache.size").getNewValue()
            );
            reinitCache();
        }
    }
}
```

---

### 10.5 本地缓存配置最佳实践

#### ✅ 推荐做法

**1. 配置本地缓存路径**
```properties
# 确保目录存在且有读写权限
config.local-cache-path=/opt/data

# 或使用应用自己的目录
config.local-cache-path=/app/apollo-cache
```

**2. 定期清理旧缓存**
```bash
# 定期清理30天前的缓存文件
find /opt/data/*/config-cache -name "*.properties" -mtime +30 -delete
```

**3. 监控缓存使用情况**
```bash
# 检查缓存文件大小
du -sh /opt/data/*/config-cache

# 检查缓存文件数量
find /opt/data/*/config-cache -name "*.properties" | wc -l
```

---

### 10.6 配置版本管理最佳实践

#### ✅ 推荐做法

**1. 配置变更留下清晰的备注**
```
在配置中心发布配置时，填写详细的备注信息：
- 变更原因
- 变更内容
- 影响范围
- 预期效果
```

**2. 重要配置变更前先备份**
```
在配置中心UI中：
1. 查看历史版本
2. 记录当前配置值
3. 必要时先创建灰度版本测试
```

**3. 利用版本回滚功能**
```
发现问题后立即回滚：
配置中心 -> 发布历史 -> 选择历史版本 -> 回滚
```

---

## 11. 反模式

### ❌ 反模式1: 敏感配置硬编码

**错误示例**:
```java
// ❌ 硬编码数据库密码
public class DbConfig {
    private String password = "mydb@123456";
}

// ❌ 硬编码在配置文件中
# application.properties
db.password=mydb@123456
```

**正确做法**:
```java
// ✅ 从配置中心获取
@Value("${db.password}")
private String password;

// 或
@ConfigurationProperties(prefix = "db")
public class DbConfig {
    private String password;  // 从配置中心动态获取
}
```

**为什么**: 硬编码敏感配置存在安全风险，且修改需要重新编译部署

---

### ❌ 反模式2: 不使用本地缓存

**错误示例**:
```properties
# ❌ 关闭本地缓存
config.local-mode=true
```

**正确做法**:
```properties
# ✅ 开启本地缓存，配置缓存路径
config.local-mode=false
config.local-cache-path=/opt/data
```

**为什么**: 配置中心不可用时应用无法启动，影响系统可用性

---

### ❌ 反模式3: 配置频繁修改

**错误示例**:
```
每天修改配置多次，甚至每小时修改一次
```

**正确做法**:
```
1. 充分测试后再修改生产配置
2. 非紧急配置变更合并批量发布
3. 使用灰度发布降低风险
4. 建立配置变更审批流程
```

**为什么**: 频繁修改配置影响系统稳定性，增加故障风险

---

### ❌ 反模式4: 所有环境使用同一配置

**错误示例**:
```properties
# ❌ 开发、测试、生产都使用同一个配置
config.service-url=http://ntsgw.oa.com/api/pub/hr-config-service

# ❌ 测试数据库配置影响生产环境
db.url=jdbc:mysql://test-db:3306/test
```

**正确做法**:
```properties
# ✅ 不同环境使用不同配置中心地址
# 开发环境
config.service-url=http://demo.ntsgw.oa.com/api/pub/hr-config-service

# 生产环境
config.service-url=http://ntsgw.oa.com/api/pub/hr-config-service

# ✅ 在配置中心为不同环境配置不同的值
# DEV环境: db.url=jdbc:mysql://dev-db:3306/test
# PRO环境: db.url=jdbc:mysql://prod-db:3306/prod
```

**为什么**: 测试配置影响生产环境，存在严重的数据安全风险

---

### ❌ 反模式5: 忽略配置变更通知

**错误示例**:
```java
// ❌ 读取配置后保存到静态变量，不监听变化
public class ConfigHolder {
    public static final int TIMEOUT = 
        ConfigService.getAppConfig().getIntProperty("timeout", 5000);
}
```

**正确做法**:
```java
// ✅ 使用Config对象实时获取
@Component
public class ConfigHolder {
    @ApolloConfig
    private Config config;
    
    public int getTimeout() {
        return config.getIntProperty("timeout", 5000);
    }
}

// 或使用@Value + @RefreshScope
@RefreshScope
@Component
public class ConfigHolder {
    @Value("${timeout:5000}")
    private int timeout;
    
    public int getTimeout() {
        return timeout;
    }
}
```

**为什么**: 配置变更无法实时生效，失去了配置中心的核心价值

---

### ❌ 反模式6: Namespace过度拆分

**错误示例**:
```
db.url.namespace
db.username.namespace
db.password.namespace
redis.host.namespace
redis.port.namespace
```

**正确做法**:
```
dbconfig.namespace      (包含所有数据库配置)
cacheconfig.namespace   (包含所有缓存配置)
```

**为什么**: 过度拆分增加管理复杂度，配置变更需要操作多个namespace

---

## 12. 常见问题 (FAQ)

### Q1: 本地想拉取UAT配置，一直拉不到？

**A**: 这是Spring配置文件加载顺序问题。

**配置文件加载顺序**:
1. `bootstrap.properties`
2. `application.properties`
3. `application-{profile}.properties`

**解决方案**: 在`bootstrap.properties`里配置UAT环境的配置中心地址:

```properties
config.service-url=http://uat-ntsgw.woa.com/api/pub/hr-config-service
```

---

### Q2: 如何在TSF集群内和集群外连接配置中心？

**A**: 

**TSF集群内**:
```properties
# 直连配置中心，不经过网关，网络耗时有优化
config.meta-url=http://hr-config-service:8080
```

**TSF集群外**:
```properties
# 通过网关访问
config.service-url=http://demo.ntsgw.oa.com/api/pub/hr-config-service
```

---

### Q3: 配置更新需要重启应用吗？

**A**: 不需要。配置中心支持配置实时生效。

- 使用`@Value`注入的配置在v0.10.0+版本支持自动更新
- 使用`@ConfigurationProperties`的需要配合`@RefreshScope`或监听`ConfigChangeEvent`
- API方式通过`config.getProperty()`总是能获取到最新值

---

### Q4: 如何判断配置是否生效？

**A**: 

**方法1: 管理端查看**
- 配置中心管理页面显示"已发布"状态

**方法2: 客户端日志**
- 查看应用日志是否有配置更新记录
- 日志关键字: `Apollo.Client`、`Config changed`

**方法3: 监听器验证**
```java
@ApolloConfigChangeListener
private void onChange(ConfigChangeEvent changeEvent) {
    System.out.println("配置已变更: " + changeEvent.changedKeys());
}
```

**方法4: 接口验证**
```java
@GetMapping("/config/check")
public Map<String, String> checkConfig() {
    Map<String, String> result = new HashMap<>();
    result.put("timeout", config.getProperty("timeout", "default"));
    return result;
}
```

---

### Q5: 灰度发布如何选择灰度实例？

**A**: 

1. 点击"灰度规则" → "增加灰度规则"
2. 可以看到已连接到配置中心的所有客户端实例
3. 选择1-2台机器作为灰度实例
4. 建议选择非核心业务的机器进行灰度

**提示**: 灰度实例IP可以从应用日志中获取

---

### Q6: 本地缓存文件在哪里？

**A**: 

**默认路径**:
- Mac/Linux: `/opt/data/{appId}/config-cache/`
- Windows: `C:\opt\data\{appId}\config-cache\`

**文件名格式**: `{appId}+{cluster}+{namespace}.properties`

**示例**: `100004458+default+application.properties`

---

### Q7: 如何迁移已有配置到配置中心？

**A**: 

**步骤**:
1. 在Apollo为应用新建项目
2. 在应用中配置好AppId和配置中心地址
3. 建议把原先配置转为properties格式
4. 通过Apollo提供的文本编辑模式全部粘贴到application namespace
5. 发布配置
6. 验证应用可以正常获取配置
7. 把原先的配置文件从项目中删除

---

### Q8: 支持哪些配置格式？

**A**: 

| 格式 | 支持程度 | 说明 |
|------|---------|------|
| properties | ✅ 完全支持 | 默认格式，推荐使用 |
| yaml/yml | ✅ 完全支持 | 1.3.0+版本支持 |
| xml | ✅ 支持 | 通过ConfigService.getConfigFile获取 |
| json | ✅ 支持 | 通过ConfigService.getConfigFile获取 |
| txt | ✅ 支持 | 通过ConfigService.getConfigFile获取 |

---

### Q9: 如何处理配置加载失败？

**A**: 

配置中心有完善的容灾机制:

**容灾流程**:
```
1. 启动时尝试连接配置中心
   ↓ (失败)
2. 从本地缓存加载配置
   ↓
3. 使用缓存配置启动应用
   ↓
4. 后台定时任务重试连接
   ↓ (成功)
5. 拉取最新配置并更新
```

**建议**:
- 配置本地缓存路径: `config.local-cache-path=/opt/data`
- 确保缓存目录有读写权限
- 定期检查缓存文件是否存在

---

### Q10: 配置中心和其他配置工具的区别？

**A**: 

| 特性 | Apollo配置中心 | Spring Cloud Config | Nacos |
|-----|---------------|---------------------|-------|
| 动态推送 | ✅ 支持（长轮询） | ❌ 不支持 | ✅ 支持 |
| 灰度发布 | ✅ 支持 | ❌ 不支持 | ✅ 支持 |
| 权限管理 | ✅ 支持 | ❌ 不支持 | ✅ 支持 |
| 版本回滚 | ✅ 支持 | ❌ 不支持 | ✅ 支持 |
| UI界面 | ✅ 功能完善 | ❌ 无 | ✅ 有 |
| 多语言支持 | ✅ Java/.Net/Python/Go | ✅ Java | ✅ Java |
| 本地缓存容灾 | ✅ 支持 | ❌ 不支持 | ✅ 支持 |
| 配置格式 | ✅ properties/yaml/xml/json | ✅ 多种格式 | ✅ properties/yaml |

---

### Q11: 如何监控配置中心的使用情况？

**A**: 

**方法1: 管理端查看**
- 登录配置中心管理控制台
- 查看"实例列表"了解连接情况
- 查看"发布历史"了解配置变更记录

**方法2: 日志监控**
```java
// 设置Apollo日志级别
logging.level.com.ctrip.framework.apollo=INFO

// 查看日志中的配置更新记录
grep "Apollo" /var/log/application.log
```

**方法3: 健康检查**
```bash
# 检查配置中心服务是否可用
curl http://demo.ntsgw.oa.com/api/pub/hr-config-service
```

---

### Q12: 配置中心有并发限制吗？

**A**: 

由于配置中心基于Apollo，在功能强大的同时略微牺牲了并发量，略低于其他配置中心。

**建议**:
- 避免频繁修改配置
- 合理使用本地缓存
- 大批量配置变更使用批量操作
- 单个应用实例数建议不超过1000个

**性能指标**:
- 配置读取: 基于本地缓存，性能极高
- 配置更新推送: 秒级推送，支持数千个客户端
- 配置中心QPS: 数千级别

---

## 13. 附录

### 13.1 代码仓库

- **Java Spring Boot示例**: http://git.code.oa.com/hrplat-middletier/hr-config-sample-spring-boot.git
- **Python客户端**: http://git.code.oa.com/hrplat-middletier/hr-config-client-python.git
- **Go客户端**: git.code.oa.com/hrplat-middletier/agollo/viper-remote

### 13.2 参考文档

- **详细功能说明**: https://iwiki.woa.com/p/4007094108
- **产品获取**: https://iwiki.woa.com/p/4007101680
- **Apollo官方文档**: https://github.com/apolloconfig/apollo
- **服务市场**: http://ntsgw.oa.com/#/main/fly/home-page-app

### 13.3 应用实践案例

**附件服务接入配置中心**:

由于配置中心的便利性，附件服务接入了配置中心:
- 配置管理和回滚为附件服务的配置变更提供了便利性
- 灰度发布优先使得部分客户端等配置生效，进一步增强了配置的容错性
- 权限管理给不同人员授予不同权限，增加了配置的安全性
- 命名空间管理可以方便导入其他命名空间的配置，增强了配置的便捷性

### 13.4 版本变更历史

| 版本 | 发布时间 | 主要变更 |
|------|---------|----------|
| 1.3.6-SNAPSHOT | 2024-Q4 | 当前最新版本，优化性能 |
| 1.3.0 | 2024-Q2 | 支持YAML格式配置 |
| 1.2.0 | 2024-Q1 | 支持配置加密 |
| 1.1.0 | 2023-Q4 | 优化长轮询机制 |
| 1.0.0 | 2023-Q2 | 首个稳定版本 |

### 13.5 技术支持

- **维护团队**: 基础组件组
- **技术支持**: 请查看接入文档联系方式
- **问题反馈**: 通过iwiki或服务市场反馈

---

**文档版本**: v2.0  
**最后更新**: 2025-01-13  
**维护团队**: 基础组件组
