# XSS 跨站脚本检测规则

## 规则概述

| 规则ID | 规则名称 | 风险等级 |
|--------|---------|---------|
| XSS-001 | 未转义的用户输入 | 🟠 高危 |
| XSS-002 | innerHTML 直接设置 | 🟠 高危 |
| XSS-003 | 富文本未过滤 | 🟡 中危 |

---

## XSS-001: 未转义的用户输入

### 检测模式

```regex
return\s+".*<.*>.*"\s*\+\s*\w+
model\.addAttribute\(.*,\s*request\.getParameter
response\.getWriter\(\)\.write\(.*\+
```

### 危险代码示例

```java
// ❌ 危险模式 1: 直接拼接 HTML
@GetMapping("/greeting")
public String greeting(@RequestParam String name) {
    return "<h1>Hello, " + name + "!</h1>";
}

// ❌ 危险模式 2: Model 直接传递用户输入
@GetMapping("/profile")
public String profile(@RequestParam String bio, Model model) {
    model.addAttribute("bio", bio); // 前端未转义
    return "profile";
}

// ❌ 危险模式 3: 直接写入响应
@GetMapping("/echo")
public void echo(@RequestParam String input, HttpServletResponse response) throws IOException {
    response.getWriter().write("<div>" + input + "</div>");
}
```

### 安全代码示例

```java
// ✅ 安全模式 1: 使用 HtmlUtils 转义
@GetMapping("/greeting")
public String greeting(@RequestParam String name) {
    String safeName = HtmlUtils.htmlEscape(name);
    return "<h1>Hello, " + safeName + "!</h1>";
}

// ✅ 安全模式 2: 使用 StringEscapeUtils
import org.apache.commons.text.StringEscapeUtils;

String safeInput = StringEscapeUtils.escapeHtml4(userInput);

// ✅ 安全模式 3: Thymeleaf 自动转义
// 模板: <span th:text="${name}"></span>
// 自动转义 HTML 特殊字符

// ✅ 安全模式 4: 设置正确的 Content-Type
response.setContentType("application/json");
response.getWriter().write(jsonResponse);
```

### 攻击示例

```
输入: name = "<script>alert('XSS')</script>"
生成HTML: <h1>Hello, <script>alert('XSS')</script>!</h1>
结果: 执行恶意脚本

输入: name = "<img src=x onerror=alert('XSS')>"
生成HTML: <h1>Hello, <img src=x onerror=alert('XSS')>!</h1>
结果: 执行恶意脚本
```

---

## XSS-002: innerHTML 直接设置

### 检测模式

```regex
\.innerHTML\s*=
\.outerHTML\s*=
document\.write\(
dangerouslySetInnerHTML
```

### 危险代码示例

```javascript
// ❌ 危险: 直接设置 innerHTML
element.innerHTML = userInput;

// ❌ 危险: document.write
document.write(userInput);

// ❌ 危险: React dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{__html: userInput}} />
```

### 安全代码示例

```javascript
// ✅ 安全: 使用 textContent
element.textContent = userInput;

// ✅ 安全: 使用 DOM API
const textNode = document.createTextNode(userInput);
element.appendChild(textNode);

// ✅ 安全: React 默认转义
<div>{userInput}</div>

// ✅ 安全: 使用 DOMPurify 过滤
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);
```

---

## XSS-003: 富文本未过滤

### 检测模式

```regex
// 检测富文本编辑器输出未过滤
editor\.getContent\(\)
editor\.getData\(\)
// 直接存储或展示富文本
```

### 危险代码示例

```java
// ❌ 危险: 富文本直接存储
@PostMapping("/article")
public Result saveArticle(@RequestBody ArticleDTO dto) {
    article.setContent(dto.getContent()); // 未过滤
    articleRepository.save(article);
}

// ❌ 危险: 富文本直接展示
model.addAttribute("content", article.getContent());
// 前端: <div th:utext="${content}"></div>
```

### 安全代码示例

```java
// ✅ 安全: 使用 OWASP HTML Sanitizer
import org.owasp.html.PolicyFactory;
import org.owasp.html.Sanitizers;

PolicyFactory policy = Sanitizers.FORMATTING
    .and(Sanitizers.LINKS)
    .and(Sanitizers.BLOCKS);

String safeHtml = policy.sanitize(userHtml);

// ✅ 安全: 使用 Jsoup
import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;

String safeHtml = Jsoup.clean(userHtml, Safelist.basic());
```

### 推荐的 HTML 白名单

```java
// 允许的标签
Safelist whitelist = Safelist.none()
    .addTags("p", "br", "strong", "em", "u", "s", "blockquote")
    .addTags("ul", "ol", "li")
    .addTags("h1", "h2", "h3", "h4", "h5", "h6")
    .addTags("a")
    .addAttributes("a", "href")
    .addProtocols("a", "href", "http", "https")
    .addTags("img")
    .addAttributes("img", "src", "alt")
    .addProtocols("img", "src", "http", "https");
```

---

## 修复建议汇总

| 场景 | 推荐方案 |
|------|---------|
| 普通文本输出 | `HtmlUtils.htmlEscape()` |
| JSON 响应 | 设置 `Content-Type: application/json` |
| Thymeleaf | 使用 `th:text` (自动转义) |
| 富文本存储 | OWASP HTML Sanitizer / Jsoup |
| 前端 JavaScript | `textContent` / DOMPurify |
| React | 默认转义，避免 `dangerouslySetInnerHTML` |

---

## 参考资料

- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [CWE-79: XSS](https://cwe.mitre.org/data/definitions/79.html)
- [OWASP HTML Sanitizer](https://github.com/OWASP/java-html-sanitizer)

---

**版本**: 1.0.0  
**更新时间**: 2025-12-22
