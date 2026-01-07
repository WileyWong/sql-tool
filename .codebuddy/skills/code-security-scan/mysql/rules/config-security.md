# MySQL 配置安全检测规则

## 规则概述

| 规则ID | SQL-004 |
|--------|---------|
| 名称 | 配置安全风险 |
| 风险等级 | 🟡 中危 |
| CWE | CWE-16 |

---

## 检测模式

### 1. 不安全的服务器配置

**危险配置**:
```ini
# ❌ 危险：允许远程 root 登录
[mysqld]
bind-address = 0.0.0.0

# ❌ 危险：启用 LOCAL INFILE
local_infile = ON

# ❌ 危险：禁用安全文件权限
secure_file_priv = ""

# ❌ 危险：启用符号链接
symbolic-links = 1

# ❌ 危险：禁用密码验证插件
skip-grant-tables
```

**安全配置**:
```ini
# ✅ 安全：限制绑定地址
[mysqld]
bind-address = 127.0.0.1

# ✅ 安全：禁用 LOCAL INFILE
local_infile = OFF

# ✅ 安全：限制文件导出目录
secure_file_priv = /var/mysql-exports/

# ✅ 安全：禁用符号链接
symbolic-links = 0

# ✅ 安全：启用密码验证
validate_password.policy = STRONG
validate_password.length = 12
```

---

### 2. SSL/TLS 配置

**危险配置**:
```ini
# ❌ 危险：禁用 SSL
[mysqld]
skip_ssl

# ❌ 危险：使用弱加密套件
ssl_cipher = DES-CBC3-SHA
```

**安全配置**:
```ini
# ✅ 安全：启用 SSL
[mysqld]
require_secure_transport = ON
ssl_ca = /etc/mysql/ca.pem
ssl_cert = /etc/mysql/server-cert.pem
ssl_key = /etc/mysql/server-key.pem

# ✅ 安全：使用强加密套件
ssl_cipher = ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256

# ✅ 安全：要求 TLS 1.2+
tls_version = TLSv1.2,TLSv1.3
```

---

### 3. 日志配置

**危险配置**:
```ini
# ❌ 危险：禁用错误日志
[mysqld]
log_error = ""

# ❌ 危险：记录明文密码
log_raw = ON
```

**安全配置**:
```ini
# ✅ 安全：启用必要日志
[mysqld]
log_error = /var/log/mysql/error.log
general_log = OFF  # 生产环境关闭
slow_query_log = ON
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2

# ✅ 安全：不记录明文密码
log_raw = OFF
```

---

### 4. 危险的 SQL 模式

**危险模式**:
```sql
-- ❌ 危险：禁用严格模式
SET GLOBAL sql_mode = '';
SET sql_mode = 'NO_ENGINE_SUBSTITUTION';

-- ❌ 危险：允许除零
SET sql_mode = 'ALLOW_INVALID_DATES';
```

**检测正则**:
```regex
SET\s+(GLOBAL\s+)?sql_mode\s*=\s*['"]?['"]?\s*;
sql_mode\s*=\s*['"]?['"]?$
```

**安全配置**:
```sql
-- ✅ 安全：启用严格模式
SET GLOBAL sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- 或在配置文件中
-- sql_mode = STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION
```

---

### 5. 不安全的函数和特性

**危险模式**:
```sql
-- ❌ 危险：启用危险函数
SET GLOBAL log_bin_trust_function_creators = 1;

-- ❌ 危险：允许任意文件读取
SELECT LOAD_FILE('/etc/passwd');

-- ❌ 危险：系统命令执行（UDF）
CREATE FUNCTION sys_exec RETURNS INT SONAME 'lib_mysqludf_sys.so';
```

**检测正则**:
```regex
log_bin_trust_function_creators\s*=\s*1
LOAD_FILE\s*\(
CREATE\s+FUNCTION.*?SONAME
```

**安全配置**:
```sql
-- ✅ 安全：禁用危险特性
SET GLOBAL log_bin_trust_function_creators = 0;

-- 确保 secure_file_priv 限制文件访问
SHOW VARIABLES LIKE 'secure_file_priv';
```

---

## 修复建议

### 1. 安全基线配置

```ini
[mysqld]
# 网络安全
bind-address = 127.0.0.1
port = 3306
skip-networking = 0

# 文件安全
local_infile = OFF
secure_file_priv = /var/mysql-exports/
symbolic-links = 0

# SSL/TLS
require_secure_transport = ON
ssl_ca = /etc/mysql/ca.pem
ssl_cert = /etc/mysql/server-cert.pem
ssl_key = /etc/mysql/server-key.pem
tls_version = TLSv1.2,TLSv1.3

# 密码策略
validate_password.policy = STRONG
validate_password.length = 12
validate_password.mixed_case_count = 1
validate_password.number_count = 1
validate_password.special_char_count = 1

# SQL 模式
sql_mode = STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION

# 日志
log_error = /var/log/mysql/error.log
slow_query_log = ON
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2
log_raw = OFF

# 其他安全设置
log_bin_trust_function_creators = 0
```

### 2. 安全检查脚本

```sql
-- 检查不安全配置
SELECT @@global.local_infile AS local_infile,
       @@global.secure_file_priv AS secure_file_priv,
       @@global.sql_mode AS sql_mode,
       @@global.require_secure_transport AS require_ssl;

-- 检查危险用户
SELECT user, host, authentication_string 
FROM mysql.user 
WHERE authentication_string = '' 
   OR host = '%';

-- 检查危险权限
SELECT user, host, Super_priv, File_priv, Process_priv 
FROM mysql.user 
WHERE Super_priv = 'Y' OR File_priv = 'Y';
```

### 3. 定期安全审计

```sql
-- 创建安全审计存储过程
DELIMITER //
CREATE PROCEDURE security_audit()
BEGIN
    -- 检查空密码用户
    SELECT 'Empty Password Users' AS check_type, user, host 
    FROM mysql.user 
    WHERE authentication_string = '';
    
    -- 检查过度权限用户
    SELECT 'Overprivileged Users' AS check_type, user, host 
    FROM mysql.user 
    WHERE Super_priv = 'Y' AND user != 'root';
    
    -- 检查远程 root 访问
    SELECT 'Remote Root Access' AS check_type, user, host 
    FROM mysql.user 
    WHERE user = 'root' AND host NOT IN ('localhost', '127.0.0.1', '::1');
    
    -- 检查不安全配置
    SELECT 'Insecure Config' AS check_type, 
           @@global.local_infile AS local_infile,
           @@global.secure_file_priv AS secure_file_priv;
END //
DELIMITER ;

-- 执行审计
CALL security_audit();
```

---

## 参考资源

- [MySQL Security Guidelines](https://dev.mysql.com/doc/refman/8.0/en/security-guidelines.html)
- [CIS MySQL Benchmark](https://www.cisecurity.org/benchmark/mysql)
- [MySQL Server Options](https://dev.mysql.com/doc/refman/8.0/en/server-options.html)
