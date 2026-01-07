# 命令注入检测规则

## 规则概述

| 规则ID | 规则名称 | 风险等级 |
|--------|---------|---------|
| GRV-002 | 命令注入 | 🔴 严重 |

---

## GRV-002: 命令注入

### 检测模式

```regex
".*"\.execute\(\)
'.*'\.execute\(\)
\$\{.*\}.*\.execute\(\)
Runtime\.getRuntime\(\)\.exec
ProcessBuilder.*start
```

### 危险代码示例

```groovy
// ❌ 危险: 字符串 execute() 方法
def filename = params.filename
"cat ${filename}".execute()  // filename 可能是 "; rm -rf /"

// ❌ 危险: 用户输入直接执行
def command = params.command
command.execute()

// ❌ 危险: 拼接命令
def host = params.host
"ping -c 4 ${host}".execute()  // host 可能是 "localhost; cat /etc/passwd"

// ❌ 危险: Runtime.exec
def cmd = params.cmd
Runtime.getRuntime().exec(cmd)

// ❌ 危险: ProcessBuilder
def args = params.args.split(" ")
new ProcessBuilder(args).start()

// ❌ 危险: 管道命令
def input = params.input
"echo ${input} | grep pattern".execute()
```

### 攻击示例

```groovy
// 攻击者输入
filename = "test.txt; rm -rf /"
// 执行: cat test.txt; rm -rf /

host = "localhost; cat /etc/passwd"
// 执行: ping -c 4 localhost; cat /etc/passwd

input = "'; cat /etc/shadow; echo '"
// 执行: echo ''; cat /etc/shadow; echo '' | grep pattern
```

### 安全代码示例

```groovy
// ✅ 安全: 使用参数数组
def filename = params.filename
// 验证文件名
if (!filename.matches(/^[a-zA-Z0-9._-]+$/)) {
    throw new SecurityException("非法文件名")
}
["cat", filename].execute()

// ✅ 安全: 白名单验证
def allowedCommands = ["ls", "cat", "head", "tail"]
def command = params.command
if (!(command in allowedCommands)) {
    throw new SecurityException("不允许的命令")
}
[command, "-l"].execute()

// ✅ 安全: 使用 ProcessBuilder 数组参数
def host = params.host
// 验证主机名格式
if (!host.matches(/^[a-zA-Z0-9.-]+$/)) {
    throw new SecurityException("非法主机名")
}
def pb = new ProcessBuilder(["ping", "-c", "4", host])
pb.redirectErrorStream(true)
def process = pb.start()

// ✅ 安全: 转义特殊字符
import org.apache.commons.text.StringEscapeUtils

def input = params.input
def safeInput = StringEscapeUtils.escapeXSI(input)
["echo", safeInput].execute()

// ✅ 安全: 使用库替代命令
// 不要: "ping ${host}".execute()
// 改用: Java 网络库
import java.net.InetAddress
def address = InetAddress.getByName(host)
def reachable = address.isReachable(5000)
```

### 命令注入防护清单

```yaml
command_injection_prevention:
  输入验证:
    - [ ] 使用白名单验证命令
    - [ ] 使用正则验证参数格式
    - [ ] 拒绝包含特殊字符的输入
  
  安全执行:
    - [ ] 使用数组参数而非字符串
    - [ ] 避免 shell 解释 (不使用 sh -c)
    - [ ] 使用 ProcessBuilder 而非 Runtime.exec
  
  替代方案:
    - [ ] 使用 Java/Groovy 库替代命令
    - [ ] 使用 API 替代命令行工具
```

### 危险字符列表

| 字符 | 作用 | 示例 |
|------|------|------|
| `;` | 命令分隔 | `cmd1; cmd2` |
| `|` | 管道 | `cmd1 | cmd2` |
| `&` | 后台执行 | `cmd &` |
| `&&` | 条件执行 | `cmd1 && cmd2` |
| `||` | 条件执行 | `cmd1 || cmd2` |
| `` ` `` | 命令替换 | `` `cmd` `` |
| `$()` | 命令替换 | `$(cmd)` |
| `>` | 重定向 | `cmd > file` |
| `<` | 重定向 | `cmd < file` |
| `\n` | 换行 | 新命令 |

---

## 参考资料

- [OWASP Command Injection](https://owasp.org/www-community/attacks/Command_Injection)
- [CWE-78: OS Command Injection](https://cwe.mitre.org/data/definitions/78.html)

---

**版本**: 1.0.0  
**更新时间**: 2025-12-22
