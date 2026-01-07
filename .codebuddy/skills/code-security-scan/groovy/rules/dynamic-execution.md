# 动态代码执行检测规则

## 规则概述

| 规则ID | 规则名称 | 风险等级 |
|--------|---------|---------|
| GRV-001 | 动态代码执行 | 🔴 严重 |

---

## GRV-001: 动态代码执行

### 检测模式

```regex
Eval\.me\(
Eval\.x\(
Eval\.xy\(
Eval\.xyz\(
GroovyShell.*evaluate
GroovyClassLoader.*parseClass
new\s+GroovyShell\(
Binding.*setVariable
```

### 危险代码示例

```groovy
// ❌ 危险: Eval.me 执行用户输入
def userInput = params.code
def result = Eval.me(userInput)  // 可执行任意代码

// ❌ 危险: Eval.x 带参数执行
def expression = params.expr
def result = Eval.x(data, expression)  // expression 可能是恶意代码

// ❌ 危险: GroovyShell 执行
def shell = new GroovyShell()
def script = params.script
shell.evaluate(script)  // 可执行任意代码

// ❌ 危险: 动态加载类
def loader = new GroovyClassLoader()
def clazz = loader.parseClass(userCode)
clazz.newInstance().run()

// ❌ 危险: 绑定变量后执行
def binding = new Binding()
binding.setVariable("data", sensitiveData)
def shell = new GroovyShell(binding)
shell.evaluate(userScript)  // 可访问敏感数据
```

### 攻击示例

```groovy
// 攻击者输入
userInput = '''
    Runtime.getRuntime().exec("rm -rf /")
'''

// 或者
userInput = '''
    new File("/etc/passwd").text
'''

// 或者
userInput = '''
    System.getenv().each { println it }
'''
```

### 安全代码示例

```groovy
// ✅ 安全: 使用白名单表达式
def allowedExpressions = [
    'data.name',
    'data.age',
    'data.email'
]

if (userExpression in allowedExpressions) {
    def result = Eval.x(data, "x.${userExpression}")
}

// ✅ 安全: 使用沙箱
import org.codehaus.groovy.control.CompilerConfiguration
import org.codehaus.groovy.control.customizers.SecureASTCustomizer

def secure = new SecureASTCustomizer()
secure.with {
    closuresAllowed = false
    methodDefinitionAllowed = false
    importsWhitelist = []
    staticImportsWhitelist = []
    staticStarImportsWhitelist = []
    tokensWhitelist = []
    constantTypesClassesWhiteList = [Integer, String, Boolean]
    receiversClassesWhiteList = [Math, Integer, String]
}

def config = new CompilerConfiguration()
config.addCompilationCustomizers(secure)

def shell = new GroovyShell(config)
shell.evaluate(userScript)

// ✅ 安全: 使用模板引擎替代
import groovy.text.SimpleTemplateEngine

def engine = new SimpleTemplateEngine()
def template = engine.createTemplate('Hello, ${name}!')
def result = template.make([name: userName]).toString()

// ✅ 安全: 使用 GPath 表达式
def json = new JsonSlurper().parseText(jsonString)
def value = json."${allowedField}"  // allowedField 已验证
```

### 沙箱配置详解

```groovy
// 完整的安全沙箱配置
def createSecureSandbox() {
    def secure = new SecureASTCustomizer()
    
    // 禁止闭包
    secure.closuresAllowed = false
    
    // 禁止方法定义
    secure.methodDefinitionAllowed = false
    
    // 禁止所有导入
    secure.importsWhitelist = []
    secure.staticImportsWhitelist = []
    secure.staticStarImportsWhitelist = []
    
    // 只允许特定类
    secure.receiversClassesWhiteList = [
        Math,
        Integer,
        String,
        Boolean,
        List,
        Map
    ]
    
    // 禁止危险语句
    secure.statementsBlacklist = [
        org.codehaus.groovy.ast.stmt.WhileStatement,
        org.codehaus.groovy.ast.stmt.ForStatement
    ]
    
    // 禁止危险表达式
    secure.expressionsBlacklist = [
        org.codehaus.groovy.ast.expr.MethodPointerExpression
    ]
    
    return secure
}
```

---

## 相关漏洞

| CVE | 描述 | 影响版本 |
|-----|------|---------|
| CVE-2015-3253 | MethodClosure 远程代码执行 | < 2.4.4 |
| CVE-2016-6814 | 反序列化远程代码执行 | < 2.4.8 |

---

## 参考资料

- [Groovy Security](https://groovy-lang.org/security.html)
- [CWE-94: Code Injection](https://cwe.mitre.org/data/definitions/94.html)
- [SecureASTCustomizer](https://docs.groovy-lang.org/latest/html/api/org/codehaus/groovy/control/customizers/SecureASTCustomizer.html)

---

**版本**: 1.0.0  
**更新时间**: 2025-12-22
