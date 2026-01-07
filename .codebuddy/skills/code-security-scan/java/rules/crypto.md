# 加密安全检测规则

## 规则概述

| 规则ID | 规则名称 | 风险等级 |
|--------|---------|---------|
| CRYPTO-001 | MD5/SHA1 加密密码 | 🟠 高危 |
| CRYPTO-002 | DES/3DES 加密 | 🟠 高危 |
| CRYPTO-003 | ECB 模式 | 🟡 中危 |
| CRYPTO-004 | 硬编码密钥 | 🟠 高危 |

---

## CRYPTO-001: MD5/SHA1 加密密码

### 检测模式

```regex
MessageDigest\.getInstance\("MD5"\)
MessageDigest\.getInstance\("SHA-1"\)
DigestUtils\.md5Hex
DigestUtils\.sha1Hex
Md5Utils
MD5Util
```

### 危险代码示例

```java
// ❌ 危险: MD5 加密密码
MessageDigest md = MessageDigest.getInstance("MD5");
byte[] hash = md.digest(password.getBytes());

// ❌ 危险: SHA1 加密密码
MessageDigest md = MessageDigest.getInstance("SHA-1");
String hashedPassword = DigestUtils.sha1Hex(password);

// ❌ 危险: 使用工具类
String hashedPassword = DigestUtils.md5Hex(password);
String hashedPassword = Md5Utils.encode(password);
```

### 安全代码示例

```java
// ✅ 安全: BCrypt
BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
String hashedPassword = encoder.encode(password);
boolean matches = encoder.matches(rawPassword, hashedPassword);

// ✅ 安全: Argon2
Argon2PasswordEncoder encoder = new Argon2PasswordEncoder(16, 32, 1, 65536, 3);
String hashedPassword = encoder.encode(password);

// ✅ 安全: PBKDF2
String hashedPassword = Pbkdf2PasswordEncoder.defaultsForSpringSecurity_v5_8()
    .encode(password);

// ✅ 安全: SCrypt
SCryptPasswordEncoder encoder = SCryptPasswordEncoder.defaultsForSpringSecurity_v5_8();
String hashedPassword = encoder.encode(password);
```

### 为什么 MD5/SHA1 不安全

| 算法 | 问题 | 风险 |
|------|------|------|
| MD5 | 碰撞攻击已被证实 | 可伪造哈希值 |
| SHA1 | 碰撞攻击已被证实 | 可伪造哈希值 |
| MD5/SHA1 | 速度太快 | 易被暴力破解 |
| MD5/SHA1 | 无盐值 | 易被彩虹表攻击 |

---

## CRYPTO-002: DES/3DES 加密

### 检测模式

```regex
Cipher\.getInstance\("DES"\)
Cipher\.getInstance\("DESede"\)
Cipher\.getInstance\("DES/.*"\)
```

### 危险代码示例

```java
// ❌ 危险: DES 加密
Cipher cipher = Cipher.getInstance("DES");
cipher.init(Cipher.ENCRYPT_MODE, key);

// ❌ 危险: 3DES 加密
Cipher cipher = Cipher.getInstance("DESede");
cipher.init(Cipher.ENCRYPT_MODE, key);

// ❌ 危险: DES/ECB
Cipher cipher = Cipher.getInstance("DES/ECB/PKCS5Padding");
```

### 安全代码示例

```java
// ✅ 安全: AES-GCM
Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
GCMParameterSpec spec = new GCMParameterSpec(128, iv);
cipher.init(Cipher.ENCRYPT_MODE, secretKey, spec);

// ✅ 安全: AES-CBC (需要 HMAC 验证)
Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
IvParameterSpec ivSpec = new IvParameterSpec(iv);
cipher.init(Cipher.ENCRYPT_MODE, secretKey, ivSpec);

// ✅ 安全: ChaCha20-Poly1305
Cipher cipher = Cipher.getInstance("ChaCha20-Poly1305");
```

### 为什么 DES/3DES 不安全

| 算法 | 密钥长度 | 问题 |
|------|---------|------|
| DES | 56 位 | 可被暴力破解 |
| 3DES | 112/168 位 | 速度慢，已被弃用 |

---

## CRYPTO-003: ECB 模式

### 检测模式

```regex
Cipher\.getInstance\(".*ECB.*"\)
Cipher\.getInstance\("AES/ECB
```

### 危险代码示例

```java
// ❌ 危险: ECB 模式
Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
cipher.init(Cipher.ENCRYPT_MODE, secretKey);
```

### 安全代码示例

```java
// ✅ 安全: GCM 模式 (推荐)
Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
GCMParameterSpec spec = new GCMParameterSpec(128, iv);
cipher.init(Cipher.ENCRYPT_MODE, secretKey, spec);

// ✅ 安全: CBC 模式
Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
IvParameterSpec ivSpec = new IvParameterSpec(iv);
cipher.init(Cipher.ENCRYPT_MODE, secretKey, ivSpec);

// ✅ 安全: CTR 模式
Cipher cipher = Cipher.getInstance("AES/CTR/NoPadding");
```

### 为什么 ECB 不安全

- 相同明文产生相同密文
- 可通过模式分析推断内容
- 不提供语义安全性

---

## CRYPTO-004: 硬编码密钥

### 检测模式

```regex
String\s+key\s*=\s*"[A-Za-z0-9+/=]{16,}"
byte\[\]\s+key\s*=\s*\{
private\s+static\s+final\s+String\s+.*KEY.*=
private\s+static\s+final\s+String\s+.*SECRET.*=
```

### 危险代码示例

```java
// ❌ 危险: 硬编码密钥
private static final String SECRET_KEY = "1234567890abcdef";
private static final String AES_KEY = "MySecretKey12345";

// ❌ 危险: 硬编码字节数组
byte[] key = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16};

// ❌ 危险: 硬编码盐值
private static final byte[] SALT = "fixedsalt".getBytes();
```

### 安全代码示例

```java
// ✅ 安全: 从环境变量获取
String secretKey = System.getenv("SECRET_KEY");

// ✅ 安全: 从配置文件获取 (加密存储)
@Value("${encryption.key}")
private String secretKey;

// ✅ 安全: 从密钥管理服务获取
String secretKey = vaultClient.getSecret("encryption-key");

// ✅ 安全: 动态生成密钥
KeyGenerator keyGen = KeyGenerator.getInstance("AES");
keyGen.init(256);
SecretKey secretKey = keyGen.generateKey();

// ✅ 安全: 随机生成盐值
SecureRandom random = new SecureRandom();
byte[] salt = new byte[16];
random.nextBytes(salt);
```

---

## 推荐加密方案

| 用途 | 推荐算法 | 配置 |
|------|---------|------|
| 密码存储 | BCrypt/Argon2 | cost factor ≥ 10 |
| 对称加密 | AES-GCM | 256 位密钥 |
| 非对称加密 | RSA | ≥ 2048 位 |
| 数字签名 | ECDSA | P-256 或更高 |
| 哈希 | SHA-256/SHA-3 | - |
| 密钥派生 | PBKDF2/Argon2 | ≥ 100000 次迭代 |

---

## 参考资料

- [OWASP Cryptographic Failures](https://owasp.org/Top10/A02_2021-Cryptographic_Failures/)
- [CWE-327: Use of a Broken or Risky Cryptographic Algorithm](https://cwe.mitre.org/data/definitions/327.html)
- [CWE-321: Use of Hard-coded Cryptographic Key](https://cwe.mitre.org/data/definitions/321.html)

---

**版本**: 1.0.0  
**更新时间**: 2025-12-22
