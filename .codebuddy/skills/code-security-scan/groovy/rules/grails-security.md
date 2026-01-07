# Grails 框架安全检测规则

## 规则概述

| 规则ID | 规则名称 | 风险等级 |
|--------|---------|---------|
| GRV-015 | Grails 命令注入 | 🔴 严重 |
| GRV-016 | GORM 注入 | 🔴 严重 |
| GRV-017 | GSP XSS | 🟠 高危 |
| GRV-018 | 不安全数据绑定 | 🟠 高危 |
| GRV-019 | 会话安全问题 | 🟠 高危 |
| GRV-020 | URL 重定向漏洞 | 🟠 高危 |

---

## GRV-015: Grails 命令注入

### 检测模式

```regex
\.execute\(\)
Runtime\.getRuntime\(\)\.exec
ProcessBuilder
".*\$\{params\..*"\.execute
```

### 危险代码示例

```groovy
// ❌ 危险: 控制器中直接执行命令
class AdminController {
    def execute() {
        def cmd = params.command
        def result = cmd.execute()  // 命令注入
        render result.text
    }
}

// ❌ 危险: 服务中使用用户输入
class FileService {
    def processFile(String filename) {
        "cat ${filename}".execute()  // 文件名可能包含 ; rm -rf /
    }
}

// ❌ 危险: 动态构建命令
class ReportService {
    def generateReport(String format) {
        def cmd = "report-generator --format ${format}"
        cmd.execute()
    }
}
```

### 安全代码示例

```groovy
// ✅ 安全: 使用白名单验证
class AdminController {
    def execute() {
        def allowedCommands = ['status', 'health', 'version']
        def cmd = params.command
        
        if (!(cmd in allowedCommands)) {
            render status: 400, text: 'Invalid command'
            return
        }
        
        def result = ['app-cli', cmd].execute()
        render result.text
    }
}

// ✅ 安全: 使用数组参数
class FileService {
    def processFile(String filename) {
        // 验证文件名
        if (!(filename ==~ /^[a-zA-Z0-9_.-]+$/)) {
            throw new IllegalArgumentException("Invalid filename")
        }
        
        ['cat', filename].execute()
    }
}

// ✅ 安全: 使用枚举限制
enum ReportFormat {
    PDF, HTML, CSV
}

class ReportService {
    def generateReport(ReportFormat format) {
        ['report-generator', '--format', format.name()].execute()
    }
}
```

---

## GRV-016: GORM 注入

### 检测模式

```regex
\.executeQuery\s*\(\s*["'].*\$\{
\.executeUpdate\s*\(\s*["'].*\$\{
\.find\s*\(\s*["'].*\$\{
\.findAll\s*\(\s*["'].*\$\{
createCriteria.*sqlRestriction.*\$
```

### 危险代码示例

```groovy
// ❌ 危险: HQL 注入
class UserService {
    def findUser(String username) {
        User.executeQuery("from User where username = '${username}'")
    }
}

// ❌ 危险: 动态 HQL
class SearchService {
    def search(String field, String value) {
        User.executeQuery("from User where ${field} = '${value}'")
    }
}

// ❌ 危险: Criteria SQL 注入
class ReportService {
    def getReport(String filter) {
        User.createCriteria().list {
            sqlRestriction("status = '${filter}'")
        }
    }
}

// ❌ 危险: 动态排序
class ListService {
    def listUsers(String sortField) {
        User.executeQuery("from User order by ${sortField}")
    }
}
```

### 安全代码示例

```groovy
// ✅ 安全: 使用参数化查询
class UserService {
    def findUser(String username) {
        User.executeQuery(
            "from User where username = :username",
            [username: username]
        )
    }
}

// ✅ 安全: 使用 GORM 动态查找器
class UserService {
    def findUser(String username) {
        User.findByUsername(username)
    }
}

// ✅ 安全: 使用 Criteria Builder
class SearchService {
    def search(String value) {
        User.createCriteria().list {
            eq('username', value)
        }
    }
}

// ✅ 安全: 白名单验证排序字段
class ListService {
    private static final ALLOWED_SORT_FIELDS = ['username', 'email', 'createdDate']
    
    def listUsers(String sortField) {
        if (!(sortField in ALLOWED_SORT_FIELDS)) {
            sortField = 'username'
        }
        User.list(sort: sortField)
    }
}

// ✅ 安全: 使用 Where 查询
class UserService {
    def findActiveUsers(String role) {
        User.where {
            status == 'active' && userRole == role
        }.list()
    }
}
```

---

## GRV-017: GSP XSS

### 检测模式

```regex
\$\{.*\}(?!.*encodeAs)
<%=.*%>(?!.*encodeAs)
raw\s*\(
<g:fieldValue.*raw
```

### 危险代码示例

```gsp
<%-- ❌ 危险: 未编码输出 --%>
<div>${user.name}</div>
<div><%= params.message %></div>

<%-- ❌ 危险: 使用 raw 输出 --%>
<div>${raw(user.bio)}</div>

<%-- ❌ 危险: 属性中未编码 --%>
<input value="${params.search}">
<a href="${params.url}">Link</a>

<%-- ❌ 危险: JavaScript 中未编码 --%>
<script>
    var name = '${user.name}';
    var data = ${user.jsonData};
</script>
```

### 安全代码示例

```gsp
<%-- ✅ 安全: 使用编码 --%>
<div>${user.name.encodeAsHTML()}</div>
<div><g:encodeAs codec="HTML">${user.name}</g:encodeAs></div>

<%-- ✅ 安全: 使用 fieldValue 标签 --%>
<g:fieldValue bean="${user}" field="name"/>

<%-- ✅ 安全: 属性编码 --%>
<input value="${params.search?.encodeAsHTML()}">
<a href="${params.url?.encodeAsURL()}">Link</a>

<%-- ✅ 安全: JavaScript 编码 --%>
<script>
    var name = '${user.name.encodeAsJavaScript()}';
    var data = ${user.jsonData.encodeAsJSON()};
</script>

<%-- ✅ 安全: 使用 g:message --%>
<g:message code="welcome.message" args="[user.name]"/>
```

### Grails 编码配置

```groovy
// grails-app/conf/application.groovy
grails {
    views {
        gsp {
            encoding = 'UTF-8'
            htmlcodec = 'xml'  // 默认 HTML 编码
            codecs {
                expression = 'html'  // 表达式默认编码
                scriptlet = 'html'
                taglib = 'none'
                staticparts = 'none'
            }
        }
    }
}
```

---

## GRV-018: 不安全数据绑定

### 检测模式

```regex
bindData\s*\(.*,\s*params\s*\)
new\s+\w+\s*\(\s*params\s*\)
\.properties\s*=\s*params
```

### 危险代码示例

```groovy
// ❌ 危险: 直接绑定所有参数
class UserController {
    def update() {
        def user = User.get(params.id)
        user.properties = params  // 可能修改 role, admin 等敏感字段
        user.save()
    }
}

// ❌ 危险: 构造函数绑定
class UserController {
    def create() {
        def user = new User(params)  // 可能设置敏感字段
        user.save()
    }
}

// ❌ 危险: bindData 无过滤
class UserController {
    def update() {
        def user = User.get(params.id)
        bindData(user, params)
        user.save()
    }
}
```

### 安全代码示例

```groovy
// ✅ 安全: 使用 include 白名单
class UserController {
    def update() {
        def user = User.get(params.id)
        bindData(user, params, [include: ['name', 'email', 'phone']])
        user.save()
    }
}

// ✅ 安全: 使用 exclude 黑名单
class UserController {
    def update() {
        def user = User.get(params.id)
        bindData(user, params, [exclude: ['role', 'admin', 'password']])
        user.save()
    }
}

// ✅ 安全: 使用 Command Object
class UpdateUserCommand {
    String name
    String email
    String phone
    
    static constraints = {
        name blank: false
        email email: true
    }
}

class UserController {
    def update(UpdateUserCommand cmd) {
        if (cmd.hasErrors()) {
            render status: 400
            return
        }
        
        def user = User.get(params.id)
        user.name = cmd.name
        user.email = cmd.email
        user.phone = cmd.phone
        user.save()
    }
}

// ✅ 安全: 使用 @Validateable
@Validateable
class UserForm {
    String name
    String email
    
    static constraints = {
        name blank: false, maxSize: 100
        email email: true
    }
}
```

---

## GRV-019: 会话安全问题

### 检测模式

```regex
session\[.*\]\s*=\s*params
session\..*\s*=\s*params
request\.getSession\(\)
```

### 危险代码示例

```groovy
// ❌ 危险: 会话固定
class AuthController {
    def login() {
        if (authService.authenticate(params.username, params.password)) {
            session.user = params.username  // 未重新生成会话
            redirect action: 'dashboard'
        }
    }
}

// ❌ 危险: 敏感数据存储在会话
class PaymentController {
    def checkout() {
        session.creditCard = params.cardNumber
        session.cvv = params.cvv
    }
}

// ❌ 危险: 会话数据未验证
class CartController {
    def addItem() {
        session.cartItems = params.items  // 可能被篡改
    }
}
```

### 安全代码示例

```groovy
// ✅ 安全: 登录后重新生成会话
class AuthController {
    def login() {
        if (authService.authenticate(params.username, params.password)) {
            // 重新生成会话 ID
            session.invalidate()
            def newSession = request.getSession(true)
            newSession.user = params.username
            redirect action: 'dashboard'
        }
    }
}

// ✅ 安全: 不在会话中存储敏感数据
class PaymentController {
    def checkout() {
        // 使用加密的临时令牌
        def token = paymentService.createSecureToken(params.cardNumber)
        session.paymentToken = token
    }
}

// ✅ 安全: 验证会话数据
class CartController {
    def addItem() {
        def items = params.list('items')
        // 验证每个商品
        items.each { itemId ->
            if (!Product.exists(itemId)) {
                throw new IllegalArgumentException("Invalid product")
            }
        }
        session.cartItems = items
    }
}

// ✅ 安全: 配置会话超时
// grails-app/conf/application.yml
server:
    session:
        timeout: 1800  # 30 分钟
        cookie:
            http-only: true
            secure: true
```

---

## GRV-020: URL 重定向漏洞

### 检测模式

```regex
redirect\s*\(\s*url:\s*params\.
redirect\s*\(\s*uri:\s*params\.
response\.sendRedirect\s*\(\s*params\.
```

### 危险代码示例

```groovy
// ❌ 危险: 开放重定向
class AuthController {
    def login() {
        if (authService.authenticate(params.username, params.password)) {
            redirect url: params.returnUrl  // 可重定向到恶意网站
        }
    }
}

// ❌ 危险: 未验证的 URI
class NavigationController {
    def goto() {
        redirect uri: params.target
    }
}
```

### 安全代码示例

```groovy
// ✅ 安全: 验证重定向 URL
class AuthController {
    def login() {
        if (authService.authenticate(params.username, params.password)) {
            def returnUrl = params.returnUrl
            
            // 只允许相对路径或同域名
            if (returnUrl && isValidRedirect(returnUrl)) {
                redirect url: returnUrl
            } else {
                redirect action: 'dashboard'
            }
        }
    }
    
    private boolean isValidRedirect(String url) {
        // 只允许相对路径
        if (url.startsWith('/') && !url.startsWith('//')) {
            return true
        }
        
        // 或验证是否为同域名
        try {
            def uri = new URI(url)
            return uri.host == null || uri.host == grailsApplication.config.grails.serverURL
        } catch (Exception e) {
            return false
        }
    }
}

// ✅ 安全: 使用白名单
class NavigationController {
    private static final ALLOWED_TARGETS = [
        'home': '/home',
        'profile': '/user/profile',
        'settings': '/user/settings'
    ]
    
    def goto() {
        def target = ALLOWED_TARGETS[params.target] ?: '/home'
        redirect uri: target
    }
}

// ✅ 安全: 使用控制器/动作重定向
class AuthController {
    def login() {
        if (authService.authenticate(params.username, params.password)) {
            redirect controller: 'dashboard', action: 'index'
        }
    }
}
```

---

## Grails 安全检查清单

```yaml
grails_security_checklist:
  命令执行:
    - [ ] 不直接执行用户输入
    - [ ] 使用白名单验证命令
    - [ ] 使用数组参数传递
  
  GORM 查询:
    - [ ] 使用参数化查询
    - [ ] 使用动态查找器
    - [ ] 验证排序字段
    - [ ] 不拼接 HQL/SQL
  
  GSP 输出:
    - [ ] 配置默认编码
    - [ ] 使用 encodeAs 方法
    - [ ] JavaScript 中使用 encodeAsJavaScript
    - [ ] URL 使用 encodeAsURL
  
  数据绑定:
    - [ ] 使用 include/exclude 过滤
    - [ ] 使用 Command Object
    - [ ] 不直接绑定 params
  
  会话安全:
    - [ ] 登录后重新生成会话
    - [ ] 不存储敏感数据
    - [ ] 配置会话超时
    - [ ] 启用 HttpOnly 和 Secure
  
  URL 重定向:
    - [ ] 验证重定向 URL
    - [ ] 使用白名单
    - [ ] 优先使用控制器重定向
```

---

## Grails 安全配置模板

```groovy
// grails-app/conf/application.groovy
grails {
    // GSP 编码配置
    views {
        gsp {
            encoding = 'UTF-8'
            htmlcodec = 'xml'
            codecs {
                expression = 'html'
                scriptlet = 'html'
                taglib = 'none'
                staticparts = 'none'
            }
        }
    }
    
    // CORS 配置
    cors {
        enabled = true
        allowedOrigins = ['https://trusted-domain.com']
        allowedMethods = ['GET', 'POST', 'PUT', 'DELETE']
        allowCredentials = true
    }
}

// Spring Security 配置
grails.plugin.springsecurity {
    // 密码编码
    password.algorithm = 'bcrypt'
    password.bcrypt.logrounds = 12
    
    // 会话固定保护
    useSessionFixationPrevention = true
    
    // CSRF 保护
    csrf.enabled = true
    
    // 安全头
    securityConfigType = 'InterceptUrlMap'
    
    // 登录配置
    auth.loginFormUrl = '/login'
    auth.failureHandler.defaultFailureUrl = '/login?error=true'
    
    // 记住我
    rememberMe.cookieName = 'remember_me'
    rememberMe.key = 'uniqueAndSecretKey'
}
```

---

## 参考资料

- [Grails Security Plugin](https://grails-plugins.github.io/grails-spring-security-core/)
- [OWASP Grails Security](https://owasp.org/www-project-web-security-testing-guide/)
- [Grails Data Binding](https://docs.grails.org/latest/guide/theWebLayer.html#dataBinding)
- [GSP Encoding](https://docs.grails.org/latest/guide/theWebLayer.html#gsp)

---

**版本**: 1.0.0  
**更新时间**: 2025-12-22
