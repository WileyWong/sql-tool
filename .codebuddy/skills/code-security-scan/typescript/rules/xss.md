# TypeScript XSS 跨站脚本检测规则

## 规则概述

| 规则ID | TS-001 |
|--------|--------|
| 名称 | XSS 跨站脚本 |
| 风险等级 | 🔴 严重 |
| CWE | CWE-79 |

---

## 检测模式

### 1. innerHTML/outerHTML 不安全使用

**危险模式**:
```typescript
// ❌ 危险：直接设置 innerHTML
element.innerHTML = userInput;
element.outerHTML = `<div>${userInput}</div>`;
document.getElementById('content').innerHTML = data;
```

**检测正则**:
```regex
\.(innerHTML|outerHTML)\s*=\s*[^"'`]
\.(innerHTML|outerHTML)\s*=\s*`.*?\$\{
```

**安全写法**:
```typescript
// ✅ 安全：使用 textContent
element.textContent = userInput;

// ✅ 安全：使用 DOMPurify
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);

// ✅ 安全：使用 DOM API
const textNode = document.createTextNode(userInput);
element.appendChild(textNode);
```

---

### 2. document.write 危险调用

**危险模式**:
```typescript
// ❌ 危险：document.write
document.write(userInput);
document.writeln(`<script>${userInput}</script>`);
```

**检测正则**:
```regex
document\.(write|writeln)\s*\(
```

---

### 3. eval 和动态代码执行

**危险模式**:
```typescript
// ❌ 危险：eval
eval(userInput);
new Function(userInput)();
setTimeout(userInput, 1000);
setInterval(userInput, 1000);
```

**检测正则**:
```regex
eval\s*\(
new\s+Function\s*\(
setTimeout\s*\(\s*[^()=>,]+\s*,
setInterval\s*\(\s*[^()=>,]+\s*,
```

**安全写法**:
```typescript
// ✅ 安全：使用函数引用
setTimeout(() => doSomething(), 1000);
setInterval(myFunction, 1000);
```

---

### 4. React dangerouslySetInnerHTML

**危险模式**:
```tsx
// ❌ 危险：未经过滤的 dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />
<div dangerouslySetInnerHTML={{ __html: props.content }} />
```

**检测正则**:
```regex
dangerouslySetInnerHTML\s*=\s*\{\s*\{\s*__html\s*:\s*[^}]+\}\s*\}
```

**安全写法**:
```tsx
// ✅ 安全：使用 DOMPurify
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />

// ✅ 更安全：避免使用 dangerouslySetInnerHTML
<div>{userInput}</div>
```

---

### 5. Vue v-html 指令

**危险模式**:
```vue
<!-- ❌ 危险：v-html 绑定用户输入 -->
<div v-html="userInput"></div>
<span v-html="content"></span>
```

**检测正则**:
```regex
v-html\s*=\s*["'][^"']+["']
```

**安全写法**:
```vue
<!-- ✅ 安全：使用文本插值 -->
<div>{{ userInput }}</div>

<!-- ✅ 安全：使用过滤后的 HTML -->
<div v-html="sanitizedContent"></div>

<script>
import DOMPurify from 'dompurify';
computed: {
  sanitizedContent() {
    return DOMPurify.sanitize(this.userInput);
  }
}
</script>
```

---

### 6. URL 注入

**危险模式**:
```typescript
// ❌ 危险：javascript: 协议
location.href = userInput;
window.location = userInput;
element.href = userInput;

// ❌ 危险：动态 script src
const script = document.createElement('script');
script.src = userInput;
```

**检测正则**:
```regex
(location\.href|window\.location)\s*=\s*[^"']
\.href\s*=\s*[^"']
\.src\s*=\s*[^"']
```

**安全写法**:
```typescript
// ✅ 安全：验证 URL 协议
function safeRedirect(url: string) {
  const parsed = new URL(url, window.location.origin);
  if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
    location.href = parsed.href;
  }
}
```

---

## 修复建议

### 1. 输入验证和转义

```typescript
// HTML 转义函数
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
```

### 2. 使用 Content Security Policy

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'">
```

### 3. 使用安全的框架 API

```typescript
// React 自动转义
<div>{userInput}</div>

// Vue 自动转义
<div>{{ userInput }}</div>

// Angular 自动转义
<div>{{ userInput }}</div>
```

---

## 参考资源

- [OWASP XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [DOMPurify](https://github.com/cure53/DOMPurify)
