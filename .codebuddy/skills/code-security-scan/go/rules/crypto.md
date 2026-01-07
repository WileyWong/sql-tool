# Go 不安全加密检测规则

## 规则概述

| 规则ID | GO-005 |
|--------|--------|
| 名称 | 不安全加密 |
| 风险等级 | 🟠 高危 |
| CWE | CWE-327, CWE-328 |

---

## 检测模式

### 1. 弱哈希算法

**危险模式**:
```go
// ❌ 危险：MD5 用于密码或安全场景
import "crypto/md5"
hash := md5.Sum([]byte(password))
h := md5.New()

// ❌ 危险：SHA1 用于安全场景
import "crypto/sha1"
hash := sha1.Sum([]byte(data))
```

**检测正则**:
```regex
import\s+"crypto/md5"
import\s+"crypto/sha1"
md5\.(Sum|New)\s*\(
sha1\.(Sum|New)\s*\(
```

**安全写法**:
```go
// ✅ 安全：使用 SHA-256 或更强
import "crypto/sha256"
hash := sha256.Sum256([]byte(data))

// ✅ 安全：密码使用 bcrypt
import "golang.org/x/crypto/bcrypt"
hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
```

---

### 2. 不安全的随机数

**危险模式**:
```go
// ❌ 危险：使用 math/rand 生成安全相关的随机数
import "math/rand"
token := rand.Int()
rand.Seed(time.Now().UnixNano())
```

**检测正则**:
```regex
import\s+"math/rand"
rand\.(Int|Intn|Float|Read|Seed)\s*\(
```

**安全写法**:
```go
// ✅ 安全：使用 crypto/rand
import "crypto/rand"
b := make([]byte, 32)
crypto_rand.Read(b)
token := hex.EncodeToString(b)
```

---

### 3. 硬编码加密密钥

**危险模式**:
```go
// ❌ 危险：硬编码密钥
key := []byte("my-secret-key-16")
block, _ := aes.NewCipher(key)

const encryptionKey = "hardcoded-key-32bytes-here!!"
```

**检测正则**:
```regex
aes\.NewCipher\s*\(\s*\[\]byte\s*\(\s*["']
(key|Key|KEY)\s*[:=]\s*\[\]byte\s*\(\s*["']
```

**安全写法**:
```go
// ✅ 安全：从环境变量或密钥管理服务获取
key := []byte(os.Getenv("ENCRYPTION_KEY"))
if len(key) != 32 {
    log.Fatal("Invalid encryption key length")
}
block, _ := aes.NewCipher(key)
```

---

### 4. 不安全的 ECB 模式

**危险模式**:
```go
// ❌ 危险：ECB 模式（直接使用 block cipher）
block, _ := aes.NewCipher(key)
block.Encrypt(dst, src) // 直接加密，无 IV
```

**安全写法**:
```go
// ✅ 安全：使用 GCM 模式
block, _ := aes.NewCipher(key)
gcm, _ := cipher.NewGCM(block)
nonce := make([]byte, gcm.NonceSize())
crypto_rand.Read(nonce)
ciphertext := gcm.Seal(nonce, nonce, plaintext, nil)
```

---

### 5. 不安全的 TLS 配置

**危险模式**:
```go
// ❌ 危险：跳过证书验证
client := &http.Client{
    Transport: &http.Transport{
        TLSClientConfig: &tls.Config{
            InsecureSkipVerify: true,
        },
    },
}

// ❌ 危险：使用弱 TLS 版本
tlsConfig := &tls.Config{
    MinVersion: tls.VersionTLS10,
}
```

**检测正则**:
```regex
InsecureSkipVerify\s*:\s*true
MinVersion\s*:\s*tls\.Version(TLS10|TLS11|SSL)
```

**安全写法**:
```go
// ✅ 安全：正确的 TLS 配置
tlsConfig := &tls.Config{
    MinVersion: tls.VersionTLS12,
    CipherSuites: []uint16{
        tls.TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,
        tls.TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,
    },
}
```

---

## 修复建议

### 密码哈希最佳实践

```go
import "golang.org/x/crypto/bcrypt"

// 哈希密码
func hashPassword(password string) (string, error) {
    bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
    return string(bytes), err
}

// 验证密码
func checkPassword(password, hash string) bool {
    err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
    return err == nil
}
```

### 安全的 AES-GCM 加密

```go
func encrypt(plaintext []byte, key []byte) ([]byte, error) {
    block, err := aes.NewCipher(key)
    if err != nil {
        return nil, err
    }
    
    gcm, err := cipher.NewGCM(block)
    if err != nil {
        return nil, err
    }
    
    nonce := make([]byte, gcm.NonceSize())
    if _, err := crypto_rand.Read(nonce); err != nil {
        return nil, err
    }
    
    return gcm.Seal(nonce, nonce, plaintext, nil), nil
}
```

---

## 参考资源

- [Go crypto 包文档](https://pkg.go.dev/crypto)
- [OWASP Cryptographic Failures](https://owasp.org/Top10/A02_2021-Cryptographic_Failures/)
