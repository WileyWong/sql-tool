# 文件操作安全检测规则

## 规则概述

| 规则ID | 规则名称 | 风险等级 |
|--------|---------|---------|
| FILE-001 | 路径遍历漏洞 | 🔴 严重 |
| FILE-002 | 文件上传未校验 | 🟠 高危 |
| FILE-003 | 任意文件读取 | 🔴 严重 |

---

## FILE-001: 路径遍历漏洞

### 检测模式

```regex
new\s+File\(.*\+.*\)
Paths\.get\(.*,.*\+
FileInputStream\(.*\+
FileOutputStream\(.*\+
```

### 危险代码示例

```java
// ❌ 危险: 直接拼接文件路径
@GetMapping("/download")
public void download(@RequestParam String filename, HttpServletResponse response) {
    String path = "/uploads/" + filename; // filename 可能是 "../../../etc/passwd"
    File file = new File(path);
    // ...
}

// ❌ 危险: 用户控制的路径
@PostMapping("/save")
public Result save(@RequestParam String path, @RequestBody String content) {
    Files.write(Paths.get(path), content.getBytes()); // 可写入任意位置
    return Result.success();
}

// ❌ 危险: 目录拼接
@GetMapping("/image/{category}/{name}")
public void getImage(@PathVariable String category, @PathVariable String name) {
    String path = "/images/" + category + "/" + name;
    // category 或 name 可能包含 ../
}
```

### 安全代码示例

```java
// ✅ 安全: 路径规范化 + 前缀验证
@GetMapping("/download")
public void download(@RequestParam String filename, HttpServletResponse response) {
    Path basePath = Paths.get("/uploads").toAbsolutePath().normalize();
    Path filePath = basePath.resolve(filename).normalize();
    
    // 验证文件在允许的目录内
    if (!filePath.startsWith(basePath)) {
        throw new SecurityException("非法路径");
    }
    
    File file = filePath.toFile();
    // ...
}

// ✅ 安全: 文件名白名单
@GetMapping("/download")
public void download(@RequestParam String filename, HttpServletResponse response) {
    // 只允许字母、数字、下划线、点
    if (!filename.matches("^[a-zA-Z0-9_.-]+$")) {
        throw new BadRequestException("非法文件名");
    }
    
    Path filePath = Paths.get("/uploads", filename);
    // ...
}

// ✅ 安全: 使用文件 ID 而非文件名
@GetMapping("/download/{fileId}")
public void download(@PathVariable Long fileId, HttpServletResponse response) {
    FileInfo fileInfo = fileService.getById(fileId);
    Path filePath = Paths.get(fileInfo.getStoragePath());
    // ...
}
```

---

## FILE-002: 文件上传未校验

### 检测模式

```regex
MultipartFile.*transferTo
file\.getOriginalFilename\(\)
# 未进行类型、大小校验
```

### 危险代码示例

```java
// ❌ 危险: 未校验文件类型
@PostMapping("/upload")
public Result upload(@RequestParam MultipartFile file) {
    String filename = file.getOriginalFilename();
    file.transferTo(new File("/uploads/" + filename));
    return Result.success();
}

// ❌ 危险: 仅校验后缀名
@PostMapping("/upload")
public Result upload(@RequestParam MultipartFile file) {
    String filename = file.getOriginalFilename();
    if (filename.endsWith(".jpg") || filename.endsWith(".png")) {
        // 可被绕过: shell.jpg.jsp
        file.transferTo(new File("/uploads/" + filename));
    }
    return Result.success();
}

// ❌ 危险: 未限制文件大小
@PostMapping("/upload")
public Result upload(@RequestParam MultipartFile file) {
    // 可上传超大文件导致磁盘耗尽
    file.transferTo(new File("/uploads/" + file.getOriginalFilename()));
    return Result.success();
}
```

### 安全代码示例

```java
// ✅ 安全: 完整的文件上传校验
@PostMapping("/upload")
public Result upload(@RequestParam MultipartFile file) {
    // 1. 校验文件大小
    if (file.getSize() > 10 * 1024 * 1024) { // 10MB
        throw new BadRequestException("文件大小超过限制");
    }
    
    // 2. 校验 MIME 类型
    String contentType = file.getContentType();
    Set<String> allowedTypes = Set.of("image/jpeg", "image/png", "image/gif");
    if (!allowedTypes.contains(contentType)) {
        throw new BadRequestException("不支持的文件类型");
    }
    
    // 3. 校验文件头 (Magic Number)
    byte[] header = new byte[8];
    file.getInputStream().read(header);
    if (!isValidImageHeader(header)) {
        throw new BadRequestException("文件内容与类型不匹配");
    }
    
    // 4. 生成安全的文件名
    String extension = getExtension(contentType);
    String safeFilename = UUID.randomUUID() + extension;
    
    // 5. 存储到安全目录
    Path uploadPath = Paths.get("/uploads", safeFilename);
    file.transferTo(uploadPath.toFile());
    
    return Result.success(safeFilename);
}

// 文件头校验
private boolean isValidImageHeader(byte[] header) {
    // JPEG: FF D8 FF
    if (header[0] == (byte) 0xFF && header[1] == (byte) 0xD8) {
        return true;
    }
    // PNG: 89 50 4E 47
    if (header[0] == (byte) 0x89 && header[1] == (byte) 0x50 
        && header[2] == (byte) 0x4E && header[3] == (byte) 0x47) {
        return true;
    }
    // GIF: 47 49 46 38
    if (header[0] == (byte) 0x47 && header[1] == (byte) 0x49 
        && header[2] == (byte) 0x46 && header[3] == (byte) 0x38) {
        return true;
    }
    return false;
}

// 配置文件大小限制
// application.yml
spring:
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB
```

---

## FILE-003: 任意文件读取

### 检测模式

```regex
FileInputStream\(.*request\.getParameter
Files\.readAllBytes\(.*\+
new\s+File\(.*getParameter
```

### 危险代码示例

```java
// ❌ 危险: 任意文件读取
@GetMapping("/read")
public String readFile(@RequestParam String path) {
    return new String(Files.readAllBytes(Paths.get(path)));
}

// ❌ 危险: 配置文件读取
@GetMapping("/config")
public String getConfig(@RequestParam String name) {
    return new String(Files.readAllBytes(Paths.get("/config/" + name)));
}

// ❌ 危险: 日志文件读取
@GetMapping("/logs/{date}")
public String getLogs(@PathVariable String date) {
    return new String(Files.readAllBytes(Paths.get("/logs/app-" + date + ".log")));
}
```

### 安全代码示例

```java
// ✅ 安全: 白名单 + 路径验证
@GetMapping("/read")
public String readFile(@RequestParam String filename) {
    // 白名单验证
    Set<String> allowedFiles = Set.of("readme.txt", "help.txt", "faq.txt");
    if (!allowedFiles.contains(filename)) {
        throw new ForbiddenException("不允许访问此文件");
    }
    
    // 路径验证
    Path basePath = Paths.get("/public").toAbsolutePath().normalize();
    Path filePath = basePath.resolve(filename).normalize();
    
    if (!filePath.startsWith(basePath)) {
        throw new SecurityException("非法路径");
    }
    
    return new String(Files.readAllBytes(filePath));
}

// ✅ 安全: 使用文件 ID
@GetMapping("/documents/{id}")
public ResponseEntity<Resource> getDocument(@PathVariable Long id) {
    Document doc = documentService.getById(id);
    
    // 权限检查
    if (!doc.getUserId().equals(SecurityUtils.getCurrentUserId())) {
        throw new ForbiddenException("无权访问此文档");
    }
    
    Path filePath = Paths.get(doc.getStoragePath());
    Resource resource = new FileSystemResource(filePath);
    
    return ResponseEntity.ok()
        .contentType(MediaType.parseMediaType(doc.getContentType()))
        .body(resource);
}
```

---

## 文件操作安全检查清单

```yaml
file_security_checklist:
  路径安全:
    - [ ] 使用 Paths.normalize() 规范化路径
    - [ ] 验证路径在允许的目录内
    - [ ] 不使用用户输入直接构造路径
    - [ ] 使用白名单验证文件名
  
  上传安全:
    - [ ] 限制文件大小
    - [ ] 校验 MIME 类型
    - [ ] 校验文件头 (Magic Number)
    - [ ] 生成随机文件名
    - [ ] 存储到非 Web 可访问目录
  
  下载安全:
    - [ ] 验证用户权限
    - [ ] 使用文件 ID 而非文件名
    - [ ] 设置正确的 Content-Type
    - [ ] 设置 Content-Disposition
```

---

## 参考资料

- [OWASP Path Traversal](https://owasp.org/www-community/attacks/Path_Traversal)
- [CWE-22: Path Traversal](https://cwe.mitre.org/data/definitions/22.html)
- [CWE-434: Unrestricted Upload](https://cwe.mitre.org/data/definitions/434.html)

---

**版本**: 1.0.0  
**更新时间**: 2025-12-22
