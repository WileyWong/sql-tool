# Java 依赖安全检测规则

本文档定义 Java 项目依赖安全检测规则。

## 规则列表

| 规则ID | 规则名称 | 风险等级 | 说明 |
|--------|---------|---------|------|
| JAVA-DEP-001 | 已知漏洞依赖 | 🔴 严重/🟠 高危 | 依赖存在已知 CVE 漏洞 |
| JAVA-DEP-002 | 过时依赖版本 | 🟡 中危 | 依赖版本过旧，可能存在未知风险 |
| JAVA-DEP-003 | 不安全依赖源 | 🟠 高危 | 使用非官方或不可信的依赖源 |

---

## JAVA-DEP-001: 已知漏洞依赖

### 描述
项目依赖的第三方库存在已知安全漏洞（CVE）。

### 检测范围

#### Maven (pom.xml)
```xml
<!-- 检测模式 -->
<dependency>
    <groupId>...</groupId>
    <artifactId>...</artifactId>
    <version>...</version>
</dependency>
```

#### Gradle (build.gradle)
```groovy
// 检测模式
implementation 'group:artifact:version'
compile 'group:artifact:version'
runtimeOnly 'group:artifact:version'
testImplementation 'group:artifact:version'
```

### 高危依赖清单

#### 严重漏洞 (必须立即修复)

| 依赖 | 漏洞版本 | CVE | 安全版本 |
|------|---------|-----|---------|
| `log4j:log4j` | 1.x 全部 | CVE-2019-17571 | 迁移到 log4j2 或 logback |
| `org.apache.logging.log4j:log4j-core` | <2.17.0 | CVE-2021-44228 | ≥2.17.0 |
| `com.alibaba:fastjson` | <1.2.83 | CVE-2022-25845 | ≥1.2.83 或迁移到 fastjson2 |
| `org.springframework:spring-beans` | <5.3.18 | CVE-2022-22965 | ≥5.3.18 |
| `org.apache.struts:struts2-core` | <2.3.32 | CVE-2017-5638 | ≥2.3.32 |

#### 高危漏洞 (本周内修复)

| 依赖 | 漏洞版本 | CVE | 安全版本 |
|------|---------|-----|---------|
| `com.fasterxml.jackson.core:jackson-databind` | <2.12.6.1 | CVE-2020-36518 | ≥2.12.6.1 |
| `org.apache.commons:commons-text` | <1.10.0 | CVE-2022-42889 | ≥1.10.0 |
| `ch.qos.logback:logback-core` | <1.2.9 | CVE-2021-42550 | ≥1.2.9 |
| `org.yaml:snakeyaml` | <2.0 | CVE-2022-1471 | ≥2.0 |
| `io.netty:netty-codec-http2` | <4.1.100 | CVE-2023-44487 | ≥4.1.100 |

### 检测示例

#### 问题代码 (pom.xml)
```xml
<!-- ❌ 存在 Log4Shell 漏洞 -->
<dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-core</artifactId>
    <version>2.14.1</version>
</dependency>

<!-- ❌ 存在 Fastjson RCE 漏洞 -->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>fastjson</artifactId>
    <version>1.2.68</version>
</dependency>
```

#### 修复代码
```xml
<!-- ✅ 升级到安全版本 -->
<dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-core</artifactId>
    <version>2.21.1</version>
</dependency>

<!-- ✅ 迁移到 fastjson2 -->
<dependency>
    <groupId>com.alibaba.fastjson2</groupId>
    <artifactId>fastjson2</artifactId>
    <version>2.0.43</version>
</dependency>
```

### 报告格式

```markdown
## 🔴 JAVA-DEP-001: 已知漏洞依赖

**文件**: pom.xml:45
**依赖**: org.apache.logging.log4j:log4j-core:2.14.1
**漏洞**: CVE-2021-44228 (Log4Shell)
**CVSS**: 10.0 (严重)
**风险**: 远程代码执行，攻击者可通过构造恶意日志消息完全控制服务器

**修复建议**:
升级到 2.17.0 或更高版本：
```xml
<dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-core</artifactId>
    <version>2.21.1</version>
</dependency>
```

**参考**:
- https://nvd.nist.gov/vuln/detail/CVE-2021-44228
- https://logging.apache.org/log4j/2.x/security.html
```

---

## JAVA-DEP-002: 过时依赖版本

### 描述
依赖版本过旧（超过 2 年未更新），可能存在未公开的安全风险。

### 检测规则

```yaml
outdated_threshold:
  critical: 3 years    # 超过 3 年标记为高危
  warning: 2 years     # 超过 2 年标记为中危
  
check_items:
  - 主版本落后 2 个以上
  - 最后更新超过 2 年
  - 官方已声明 EOL
```

### 常见过时依赖

| 依赖 | 过时版本 | 状态 | 建议 |
|------|---------|------|------|
| `log4j:log4j` | 1.x | EOL | 迁移到 log4j2 或 logback |
| `junit:junit` | 4.x | 维护模式 | 迁移到 JUnit 5 |
| `org.apache.httpcomponents:httpclient` | 4.x | 维护模式 | 迁移到 httpclient5 |
| `commons-collections:commons-collections` | 3.x | EOL | 迁移到 commons-collections4 |
| `javax.*` | 全部 | EOL | 迁移到 jakarta.* |

### 检测示例

```xml
<!-- ❌ 过时依赖 -->
<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.12</version>
    <scope>test</scope>
</dependency>
```

```xml
<!-- ✅ 升级到 JUnit 5 -->
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.10.1</version>
    <scope>test</scope>
</dependency>
```

### 报告格式

```markdown
## 🟡 JAVA-DEP-002: 过时依赖版本

**文件**: pom.xml:78
**依赖**: junit:junit:4.12
**当前版本发布**: 2014-12-04 (9 年前)
**最新版本**: 4.13.2 (JUnit 4) / 5.10.1 (JUnit 5)
**风险**: 可能存在未公开的安全漏洞，缺少安全更新

**修复建议**:
迁移到 JUnit 5：
```xml
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.10.1</version>
    <scope>test</scope>
</dependency>
```
```

---

## JAVA-DEP-003: 不安全依赖源

### 描述
项目配置了非官方或不可信的 Maven 仓库，可能导致依赖投毒攻击。

### 检测规则

```yaml
trusted_repositories:
  - https://repo.maven.apache.org/maven2
  - https://repo1.maven.org/maven2
  - https://maven.aliyun.com/repository/public
  - https://maven.aliyun.com/repository/central
  - https://mirrors.cloud.tencent.com/nexus/repository/maven-public

suspicious_patterns:
  - http://  # 非 HTTPS
  - 私有 IP 地址
  - 未知域名
```

### 检测示例

#### 问题配置 (pom.xml)
```xml
<!-- ❌ 使用 HTTP 协议 -->
<repository>
    <id>insecure-repo</id>
    <url>http://repo.example.com/maven2</url>
</repository>

<!-- ❌ 未知仓库 -->
<repository>
    <id>unknown-repo</id>
    <url>https://unknown-maven-repo.com/releases</url>
</repository>
```

#### 安全配置
```xml
<!-- ✅ 使用官方仓库 -->
<repository>
    <id>central</id>
    <url>https://repo.maven.apache.org/maven2</url>
</repository>

<!-- ✅ 使用可信镜像 -->
<repository>
    <id>aliyun</id>
    <url>https://maven.aliyun.com/repository/public</url>
</repository>
```

### 报告格式

```markdown
## 🟠 JAVA-DEP-003: 不安全依赖源

**文件**: pom.xml:15
**仓库**: http://repo.example.com/maven2
**问题**: 使用 HTTP 协议，存在中间人攻击风险

**修复建议**:
1. 改用 HTTPS 协议
2. 使用官方或可信的 Maven 仓库
```

---

## 检测流程

### 1. 依赖文件识别

```yaml
scan_files:
  maven:
    - pom.xml
    - **/pom.xml
  gradle:
    - build.gradle
    - build.gradle.kts
    - **/build.gradle
    - **/build.gradle.kts
```

### 2. 依赖解析

#### Maven POM 解析
```python
# 伪代码
def parse_maven_dependencies(pom_xml):
    dependencies = []
    for dep in pom_xml.findall('.//dependency'):
        group_id = dep.find('groupId').text
        artifact_id = dep.find('artifactId').text
        version = dep.find('version').text
        dependencies.append({
            'group': group_id,
            'artifact': artifact_id,
            'version': resolve_version(version, pom_xml)
        })
    return dependencies
```

#### Gradle 解析
```python
# 伪代码 - 正则匹配
patterns = [
    r"implementation\s+['\"](.+):(.+):(.+)['\"]",
    r"compile\s+['\"](.+):(.+):(.+)['\"]",
    r"runtimeOnly\s+['\"](.+):(.+):(.+)['\"]",
]
```

### 3. 漏洞匹配

```yaml
matching_rules:
  - 精确版本匹配
  - 版本范围匹配
  - 通配符匹配
  
severity_mapping:
  cvss >= 9.0: critical
  cvss >= 7.0: high
  cvss >= 4.0: medium
  cvss < 4.0: low
```

---

## 最佳实践

### 1. 依赖管理

```xml
<!-- 使用 dependencyManagement 统一版本 -->
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-dependencies</artifactId>
            <version>3.2.1</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

### 2. 版本锁定

```xml
<!-- 使用 versions-maven-plugin -->
<plugin>
    <groupId>org.codehaus.mojo</groupId>
    <artifactId>versions-maven-plugin</artifactId>
    <version>2.16.2</version>
</plugin>
```

### 3. 安全扫描集成

```xml
<!-- OWASP Dependency Check -->
<plugin>
    <groupId>org.owasp</groupId>
    <artifactId>dependency-check-maven</artifactId>
    <version>9.0.7</version>
    <executions>
        <execution>
            <goals>
                <goal>check</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

### 4. 定期更新

```bash
# 检查可更新的依赖
mvn versions:display-dependency-updates

# 检查插件更新
mvn versions:display-plugin-updates
```

---

## 参考资源

- [OWASP Dependency Check](https://owasp.org/www-project-dependency-check/)
- [Snyk Vulnerability Database](https://snyk.io/vuln/)
- [NVD - National Vulnerability Database](https://nvd.nist.gov/)
- [漏洞知识库](../shared/vulnerability-db.md)

---

**版本**: 1.0.0  
**更新时间**: 2025-12-22
