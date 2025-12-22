# 示例 6: 安全漏洞审查

## 6.1 SSRF 漏洞

```java
// ❌ 问题代码：用户控制的 URL
@RestController
public class ProxyController {
    
    @Autowired
    private RestTemplate restTemplate;
    
    @GetMapping("/fetch")
    public String fetchUrl(@RequestParam String url) {
        // 用户可以请求任意 URL，包括内网地址!
        return restTemplate.getForObject(url, String.class);
    }
}
```

```java
// ✅ 修复后代码
@RestController
@Slf4j
public class ProxyController {
    
    private static final Set<String> ALLOWED_HOSTS = Set.of(
        "api.example.com",
        "cdn.example.com"
    );
    
    private static final Set<String> BLOCKED_PREFIXES = Set.of(
        "10.", "172.16.", "172.17.", "172.18.", "172.19.",
        "172.20.", "172.21.", "172.22.", "172.23.", "172.24.",
        "172.25.", "172.26.", "172.27.", "172.28.", "172.29.",
        "172.30.", "172.31.", "192.168.", "127.", "0.", "169.254."
    );
    
    @Autowired
    private RestTemplate restTemplate;
    
    @GetMapping("/fetch")
    public String fetchUrl(@RequestParam String url) {
        validateUrl(url);
        return restTemplate.getForObject(url, String.class);
    }
    
    private void validateUrl(String urlString) {
        try {
            URL url = new URL(urlString);
            String host = url.getHost();
            
            // 检查协议
            if (!url.getProtocol().equals("https")) {
                throw new SecurityException("只允许 HTTPS 协议");
            }
            
            // 检查白名单
            if (!ALLOWED_HOSTS.contains(host)) {
                throw new SecurityException("不允许的目标地址: " + host);
            }
            
            // 检查内网地址
            InetAddress address = InetAddress.getByName(host);
            String ip = address.getHostAddress();
            for (String prefix : BLOCKED_PREFIXES) {
                if (ip.startsWith(prefix)) {
                    throw new SecurityException("禁止访问内网地址");
                }
            }
            
        } catch (MalformedURLException | UnknownHostException e) {
            throw new SecurityException("无效的 URL: " + urlString);
        }
    }
}
```

---

## 6.2 Mass Assignment 漏洞

```java
// ❌ 问题代码：直接绑定实体
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @PostMapping
    public User createUser(@RequestBody User user) {
        // 攻击者可以设置 isAdmin=true!
        return userRepository.save(user);
    }
    
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        user.setId(id);
        return userRepository.save(user);  // 可以修改任意字段!
    }
}
```

```java
// ✅ 修复后代码：使用 DTO + 白名单字段
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    @PostMapping
    public UserResponse createUser(@Valid @RequestBody CreateUserRequest request) {
        return userService.createUser(request);
    }
    
    @PutMapping("/{id}")
    public UserResponse updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request,
            @AuthenticationPrincipal UserDetails currentUser) {
        return userService.updateUser(id, request, currentUser);
    }
}

// DTO 只包含允许的字段
@Data
public class CreateUserRequest {
    @NotBlank
    @Size(min = 2, max = 50)
    private String username;
    
    @NotBlank
    @Email
    private String email;
    
    @NotBlank
    @Size(min = 8, max = 32)
    private String password;
    
    // 不包含 isAdmin、role 等敏感字段
}

@Service
public class UserService {
    
    public UserResponse createUser(CreateUserRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);  // 默认角色，不从请求获取
        user.setIsAdmin(false);   // 默认非管理员
        
        return convertToResponse(userRepository.save(user));
    }
}
```

---

## 审查要点

| 漏洞类型 | 风险 | 防护措施 |
|---------|------|---------|
| SSRF | 访问内网资源、端口扫描 | URL 白名单、协议限制、内网 IP 黑名单 |
| Mass Assignment | 越权修改敏感字段 | 使用 DTO、白名单字段、服务层设置默认值 |
| SQL 注入 | 数据泄露、数据篡改 | 参数化查询、MyBatis `#{}` |
| XSS | 窃取 Cookie、会话劫持 | 输出编码、CSP 头 |
