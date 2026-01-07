# Gradle 脚本安全检测规则

## 规则概述

| 规则ID | 规则名称 | 风险等级 |
|--------|---------|---------|
| GRV-008 | Gradle 任务注入 | 🔴 严重 |
| GRV-010 | 不安全 HTTP | 🟠 高危 |
| GRV-011 | 插件安全风险 | 🟠 高危 |
| GRV-012 | 构建脚本注入 | 🔴 严重 |
| GRV-013 | 敏感信息泄露 | 🔴 严重 |
| GRV-014 | 不安全依赖配置 | 🟠 高危 |

---

## GRV-008: Gradle 任务注入

### 检测模式

```regex
exec\s*\{.*commandLine.*\$
exec\s*\{.*args.*\$
".*"\.execute\(\)
Runtime\.getRuntime\(\)\.exec
ProcessBuilder
```

### 危险代码示例

```groovy
// ❌ 危险: exec 任务使用外部输入
task deploy {
    doLast {
        def target = project.findProperty('target') ?: 'prod'
        exec {
            commandLine 'deploy.sh', target  // target 可能被注入
        }
    }
}

// ❌ 危险: 字符串 execute
task runScript {
    doLast {
        def script = project.findProperty('script')
        "${script}".execute()  // 可执行任意命令
    }
}

// ❌ 危险: 动态命令构建
task customBuild {
    doLast {
        def cmd = project.findProperty('cmd')
        exec {
            commandLine 'sh', '-c', cmd  // 命令注入
        }
    }
}

// ❌ 危险: 从文件读取命令
task executeFromFile {
    doLast {
        def commands = file('commands.txt').text
        commands.split('\n').each { cmd ->
            cmd.execute()
        }
    }
}

// ❌ 危险: 环境变量拼接命令
task deployWithEnv {
    doLast {
        def env = System.getenv('DEPLOY_TARGET')
        "deploy.sh ${env}".execute()
    }
}
```

### 安全代码示例

```groovy
// ✅ 安全: 使用白名单
task deploy {
    doLast {
        def allowedTargets = ['dev', 'staging', 'prod']
        def target = project.findProperty('target') ?: 'prod'
        
        if (!(target in allowedTargets)) {
            throw new GradleException("Invalid target: ${target}")
        }
        
        exec {
            commandLine 'deploy.sh', target
        }
    }
}

// ✅ 安全: 验证输入格式
task tagRelease {
    doLast {
        def version = project.findProperty('version')
        
        // 验证版本号格式
        if (!(version ==~ /^\d+\.\d+\.\d+$/)) {
            throw new GradleException("Invalid version format")
        }
        
        exec {
            commandLine 'git', 'tag', "v${version}"
        }
    }
}

// ✅ 安全: 使用 Gradle 内置功能
task copyFiles(type: Copy) {
    from 'src'
    into 'dest'
    // 不使用 exec 执行 cp 命令
}

// ✅ 安全: 使用数组参数
task runTests {
    doLast {
        def testClass = project.findProperty('testClass')
        
        // 验证类名格式
        if (!(testClass ==~ /^[a-zA-Z_][a-zA-Z0-9_.]*$/)) {
            throw new GradleException("Invalid class name")
        }
        
        exec {
            commandLine './gradlew', 'test', '--tests', testClass
        }
    }
}
```

---

## GRV-010: 不安全 HTTP

### 检测模式

```regex
http://(?!localhost|127\.0\.0\.1)
maven\s*\{\s*url\s*['"]http://
mavenCentral\(\).*http://
jcenter\(\)
```

### 危险代码示例

```groovy
// ❌ 危险: HTTP 仓库
repositories {
    maven {
        url 'http://repo.example.com/maven'  // 不安全
    }
}

// ❌ 危险: 使用已废弃的 jcenter
repositories {
    jcenter()  // 已废弃，可能存在安全风险
}

// ❌ 危险: 下载 HTTP 资源
task downloadDependency {
    doLast {
        def url = 'http://example.com/lib.jar'
        def file = new File('lib.jar')
        file.withOutputStream { out ->
            new URL(url).withInputStream { inp ->
                out << inp
            }
        }
    }
}

// ❌ 危险: 不验证 SSL 证书
task fetchData {
    doLast {
        def conn = new URL('https://api.example.com').openConnection()
        conn.setHostnameVerifier { hostname, session -> true }  // 禁用验证
    }
}

// ❌ 危险: 允许不安全协议
repositories {
    maven {
        url 'http://insecure-repo.com/maven'
        allowInsecureProtocol = true  // 明确允许不安全协议
    }
}
```

### 安全代码示例

```groovy
// ✅ 安全: 使用 HTTPS 仓库
repositories {
    maven {
        url 'https://repo.example.com/maven'
    }
    mavenCentral()  // 默认 HTTPS
    google()  // 默认 HTTPS
}

// ✅ 安全: 下载 HTTPS 资源
task downloadDependency {
    doLast {
        def url = 'https://example.com/lib.jar'
        def file = new File('lib.jar')
        file.withOutputStream { out ->
            new URL(url).withInputStream { inp ->
                out << inp
            }
        }
    }
}

// ✅ 安全: 验证依赖校验和
dependencies {
    implementation('com.example:lib:1.0.0') {
        artifact {
            name = 'lib'
            type = 'jar'
        }
    }
}

// ✅ 安全: 配置仓库内容过滤
repositories {
    mavenCentral {
        content {
            excludeGroupByRegex("com\\.untrusted\\..*")
        }
    }
}
```

---

## GRV-011: 插件安全风险

### 检测模式

```regex
apply\s+from:\s*['"]http://
apply\s+from:\s*\$
buildscript\s*\{.*classpath.*SNAPSHOT
plugins\s*\{.*version\s*['"][^'"]*SNAPSHOT
```

### 危险代码示例

```groovy
// ❌ 危险: 从 HTTP 加载脚本
apply from: 'http://example.com/script.gradle'

// ❌ 危险: 从动态 URL 加载脚本
def scriptUrl = project.findProperty('scriptUrl')
apply from: scriptUrl

// ❌ 危险: 使用 SNAPSHOT 版本插件
plugins {
    id 'com.example.plugin' version '1.0.0-SNAPSHOT'
}

// ❌ 危险: buildscript 中使用 SNAPSHOT
buildscript {
    dependencies {
        classpath 'com.example:plugin:1.0.0-SNAPSHOT'
    }
}

// ❌ 危险: 不可信来源的插件
pluginManagement {
    repositories {
        maven {
            url 'http://untrusted-repo.com/plugins'
        }
    }
}
```

### 安全代码示例

```groovy
// ✅ 安全: 从 HTTPS 加载脚本
apply from: 'https://example.com/script.gradle'

// ✅ 安全: 从本地加载脚本
apply from: "${rootDir}/gradle/common.gradle"

// ✅ 安全: 使用固定版本
plugins {
    id 'com.example.plugin' version '1.0.0'
}

// ✅ 安全: 使用官方插件仓库
pluginManagement {
    repositories {
        gradlePluginPortal()
        mavenCentral()
    }
}

// ✅ 安全: 锁定插件版本
// settings.gradle
pluginManagement {
    plugins {
        id 'org.springframework.boot' version '3.2.0'
        id 'io.spring.dependency-management' version '1.1.4'
    }
}
```

---

## GRV-012: 构建脚本注入

### 检测模式

```regex
Eval\.me\(
Eval\.x\(
GroovyShell.*evaluate
new\s+GroovyShell\(\)
project\.exec\s*\{.*\$\{
```

### 危险代码示例

```groovy
// ❌ 危险: 动态执行 Groovy 代码
task dynamicTask {
    doLast {
        def code = project.findProperty('code')
        Eval.me(code)  // 可执行任意代码
    }
}

// ❌ 危险: GroovyShell 执行外部代码
task executeScript {
    doLast {
        def script = file('user-script.groovy').text
        new GroovyShell().evaluate(script)
    }
}

// ❌ 危险: 动态任务创建
def taskName = project.findProperty('taskName')
task "${taskName}" {  // 任务名可能包含恶意代码
    doLast {
        println "Running ${taskName}"
    }
}

// ❌ 危险: 配置文件注入
task loadConfig {
    doLast {
        def config = new ConfigSlurper().parse(file('config.groovy').toURL())
        // config.groovy 可能包含恶意代码
    }
}
```

### 安全代码示例

```groovy
// ✅ 安全: 使用静态配置
task staticTask {
    doLast {
        def config = new Properties()
        file('config.properties').withInputStream { config.load(it) }
        println config.getProperty('key')
    }
}

// ✅ 安全: 验证任务名
def taskName = project.findProperty('taskName')
if (taskName ==~ /^[a-zA-Z][a-zA-Z0-9]*$/) {
    task "${taskName}" {
        doLast {
            println "Running ${taskName}"
        }
    }
}

// ✅ 安全: 使用 JSON/YAML 配置
task loadConfig {
    doLast {
        def config = new groovy.json.JsonSlurper().parse(file('config.json'))
        println config.key
    }
}

// ✅ 安全: 预定义任务集
['build', 'test', 'deploy'].each { name ->
    task "${name}Custom" {
        doLast {
            println "Running ${name}"
        }
    }
}
```

---

## GRV-013: 敏感信息泄露

### 检测模式

```regex
password\s*=\s*['"][^'"]+['"]
apiKey\s*=\s*['"][^'"]+['"]
secret\s*=\s*['"][^'"]+['"]
credentials\s*\(\s*['"][^'"]+['"]
println.*password
println.*secret
println.*token
```

### 危险代码示例

```groovy
// ❌ 危险: 硬编码密码
def dbPassword = 'mySecretPassword123'

// ❌ 危险: 在构建脚本中硬编码凭据
publishing {
    repositories {
        maven {
            credentials {
                username = 'admin'
                password = 'password123'  // 硬编码密码
            }
        }
    }
}

// ❌ 危险: 打印敏感信息
task showConfig {
    doLast {
        println "Password: ${project.findProperty('password')}"
        println "API Key: ${System.getenv('API_KEY')}"
    }
}

// ❌ 危险: 将凭据写入文件
task generateConfig {
    doLast {
        def config = """
            db.password=${project.findProperty('dbPassword')}
            api.key=${System.getenv('API_KEY')}
        """
        file('config.txt').text = config
    }
}

// ❌ 危险: 凭据提交到版本控制
// gradle.properties (不应提交)
nexusPassword=secretPassword
```

### 安全代码示例

```groovy
// ✅ 安全: 使用环境变量
publishing {
    repositories {
        maven {
            credentials {
                username = System.getenv('NEXUS_USER') ?: ''
                password = System.getenv('NEXUS_PASSWORD') ?: ''
            }
        }
    }
}

// ✅ 安全: 使用 gradle.properties (不提交)
// gradle.properties (添加到 .gitignore)
// nexusPassword=xxx

publishing {
    repositories {
        maven {
            credentials {
                username = project.findProperty('nexusUser') ?: ''
                password = project.findProperty('nexusPassword') ?: ''
            }
        }
    }
}

// ✅ 安全: 使用 Gradle Credentials 插件
plugins {
    id 'nu.studer.credentials' version '3.0'
}

// ✅ 安全: 不打印敏感信息
task showConfig {
    doLast {
        println "Database configured: ${project.hasProperty('dbPassword')}"
        // 只显示是否配置，不显示值
    }
}

// ✅ 安全: 使用密钥管理服务
task fetchSecret {
    doLast {
        // 从 Vault/AWS Secrets Manager 获取
        def secret = fetchFromVault('db/password')
    }
}
```

---

## GRV-014: 不安全依赖配置

### 检测模式

```regex
implementation\s+['"].*:LATEST['"]
implementation\s+['"].*:RELEASE['"]
implementation\s+['"].*:\+['"]
implementation\s+['"].*:\[.*,.*\)['"]
exclude\s+module:\s*['"].*-security['"]
```

### 危险代码示例

```groovy
// ❌ 危险: 使用动态版本
dependencies {
    implementation 'com.example:lib:+'  // 最新版本
    implementation 'com.example:lib:LATEST'
    implementation 'com.example:lib:RELEASE'
    implementation 'com.example:lib:[1.0,2.0)'  // 版本范围
}

// ❌ 危险: 排除安全相关模块
dependencies {
    implementation('org.springframework.boot:spring-boot-starter-web') {
        exclude module: 'spring-security-core'
    }
}

// ❌ 危险: 使用已知漏洞版本
dependencies {
    implementation 'com.alibaba:fastjson:1.2.24'  // CVE-2017-18349
    implementation 'org.apache.struts:struts2-core:2.3.20'  // CVE-2017-5638
    implementation 'log4j:log4j:1.2.17'  // CVE-2019-17571
    implementation 'org.apache.logging.log4j:log4j-core:2.14.1'  // CVE-2021-44228
}

// ❌ 危险: 传递依赖未管理
dependencies {
    implementation 'com.example:lib:1.0.0'
    // 可能引入有漏洞的传递依赖
}
```

### 安全代码示例

```groovy
// ✅ 安全: 使用固定版本
dependencies {
    implementation 'com.example:lib:1.2.3'
}

// ✅ 安全: 使用版本目录
// gradle/libs.versions.toml
[versions]
spring = "3.2.0"

[libraries]
spring-boot = { module = "org.springframework.boot:spring-boot-starter", version.ref = "spring" }

// build.gradle
dependencies {
    implementation libs.spring.boot
}

// ✅ 安全: 强制依赖版本
configurations.all {
    resolutionStrategy {
        force 'org.apache.logging.log4j:log4j-core:2.21.1'
        failOnVersionConflict()
    }
}

// ✅ 安全: 使用 OWASP Dependency Check
plugins {
    id 'org.owasp.dependencycheck' version '9.0.7'
}

dependencyCheck {
    failBuildOnCVSS = 7
    suppressionFile = 'dependency-check-suppression.xml'
    analyzers {
        assemblyEnabled = false
    }
}

// ✅ 安全: 使用依赖锁定
dependencyLocking {
    lockAllConfigurations()
}

// ✅ 安全: 配置依赖约束
dependencies {
    constraints {
        implementation('org.apache.logging.log4j:log4j-core') {
            version {
                strictly '[2.17.1,)'
                because 'CVE-2021-44228 fixed in 2.17.1'
            }
        }
    }
}
```

---

## Gradle 依赖安全

### 检测已知漏洞依赖

```groovy
// 使用 OWASP Dependency Check 插件
plugins {
    id 'org.owasp.dependencycheck' version '9.0.7'
}

dependencyCheck {
    failBuildOnCVSS = 7
    suppressionFile = 'dependency-check-suppression.xml'
    formats = ['HTML', 'JSON']
    outputDirectory = "${buildDir}/reports/dependency-check"
}

// 或使用 Gradle Versions 插件检查过时依赖
plugins {
    id 'com.github.ben-manes.versions' version '0.50.0'
}

// 或使用 Snyk 插件
plugins {
    id 'io.snyk.gradle.plugin.snykplugin' version '0.5.1'
}
```

---

## Gradle 安全检查清单

```yaml
gradle_security_checklist:
  命令执行:
    - [ ] exec 任务参数已验证
    - [ ] 不使用 .execute() 方法
    - [ ] 不使用 sh -c 执行动态命令
    - [ ] 使用 Gradle 内置任务替代 exec
  
  仓库安全:
    - [ ] 所有仓库使用 HTTPS
    - [ ] 不使用已废弃的 jcenter
    - [ ] 启用依赖验证
    - [ ] 配置依赖校验和
  
  插件安全:
    - [ ] 不从 HTTP 加载脚本
    - [ ] 不使用 SNAPSHOT 版本插件
    - [ ] 只使用官方或可信插件
    - [ ] 锁定插件版本
  
  构建脚本安全:
    - [ ] 不使用 Eval/GroovyShell
    - [ ] 验证动态任务名
    - [ ] 使用静态配置文件
  
  敏感信息:
    - [ ] 不硬编码凭据
    - [ ] 使用环境变量或密钥管理
    - [ ] 不打印敏感信息
    - [ ] gradle.properties 添加到 .gitignore
  
  依赖安全:
    - [ ] 使用固定版本号
    - [ ] 定期检查漏洞依赖
    - [ ] 使用 OWASP Dependency Check
    - [ ] 配置依赖锁定
    - [ ] 更新已知漏洞依赖
```

---

## Gradle 安全配置模板

```groovy
// settings.gradle
pluginManagement {
    repositories {
        gradlePluginPortal()  // HTTPS
        mavenCentral()  // HTTPS
    }
    plugins {
        // 锁定插件版本
        id 'org.springframework.boot' version '3.2.0'
    }
}

// build.gradle
plugins {
    id 'org.owasp.dependencycheck' version '9.0.7'
}

allprojects {
    repositories {
        mavenCentral()  // HTTPS
        // 禁止 HTTP 仓库
    }
}

// 依赖锁定
dependencyLocking {
    lockAllConfigurations()
}

// 强制安全版本
configurations.all {
    resolutionStrategy {
        force 'org.apache.logging.log4j:log4j-core:2.21.1'
    }
}

// OWASP 检查配置
dependencyCheck {
    failBuildOnCVSS = 7
}
```

### 依赖验证配置

```xml
<!-- gradle/verification-metadata.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<verification-metadata>
    <configuration>
        <verify-metadata>true</verify-metadata>
        <verify-signatures>true</verify-signatures>
    </configuration>
</verification-metadata>
```

---

## 参考资料

- [Gradle Security](https://docs.gradle.org/current/userguide/security.html)
- [Dependency Verification](https://docs.gradle.org/current/userguide/dependency_verification.html)
- [OWASP Dependency Check](https://owasp.org/www-project-dependency-check/)
- [Gradle Dependency Locking](https://docs.gradle.org/current/userguide/dependency_locking.html)
- [Snyk Gradle Plugin](https://docs.snyk.io/integrations/ci-cd-integrations/gradle-plugin)

---

**版本**: 2.0.0  
**更新时间**: 2025-12-22
