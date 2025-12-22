# MyBatis-Plus 文档站点

这是 MyBatis-Plus 官方文档网站的源码仓库，基于 Astro 和 Starlight 构建。该项目包含完整的多语言文档系统和自动化翻译插件，支持中文、英文、日文三种语言。MyBatis-Plus 是 MyBatis 的增强工具，在不改变 MyBatis 原有功能的基础上提供强大的 CRUD 操作、Lambda 表达式支持、内置分页插件、代码生成器等功能。

本项目采用现代化的文档生成技术栈，利用 Astro 的静态站点生成能力和 Starlight 的文档主题，提供了优秀的性能和用户体验。翻译系统支持多种 AI 提供商（DeepSeek、Kimi、PPIO），可以自动化处理文档翻译工作，大幅提升多语言文档的维护效率。

## 核心功能和配置

### 启动开发服务器

```bash
# 启动开发服务器，默认运行在 http://localhost:4321
npm run dev

# 或者使用简短命令
npm start
```

### 构建生产版本

```bash
# 执行类型检查并构建静态站点到 dist/ 目录
npm run build

# 预览构建后的站点
npm run preview
```

### 翻译全部文档到所有目标语言

```bash
# 将所有中文文档翻译为英文和日文（基于 config.json 配置）
npm run translate

# 翻译过程会：
# 1. 扫描 src/content/docs/ 下的所有 .md 和 .mdx 文件
# 2. 排除已存在的目标语言目录（en/, ja/）
# 3. 使用配置的 AI 提供商进行翻译
# 4. 生成对应的翻译文件到目标语言目录
```

### 翻译到特定语言

```bash
# 仅翻译为英文
npm run translate:en

# 仅翻译为日文
npm run translate:ja

# 执行示例：
# $ npm run translate:en
# 🤖 调用 AI 服务: deepseek (deepseek)
# 📤 发送请求 - 模型: deepseek-chat, 最大Token: 8192
# ✅ 请求完成，耗时: 3.45秒
# 📊 Token 使用: 输入 1234, 输出 2345, 成本 $0.015
# 翻译完成: src/content/docs/en/guides/code-generator.md
```

### 增量翻译模式

```bash
# 仅翻译修改过的文件（基于文件修改时间比较）
npm run translate:incremental

# 工作原理：
# 1. 比较源文件和目标文件的修改时间
# 2. 如果源文件更新或目标文件不存在，则重新翻译
# 3. 否则跳过该文件，节省 API 调用成本
```

### 翻译单个文件

```bash
# 交互式选择要翻译的文件
npm run translate:file

# 翻译指定文件到英文
npm run translate:en:file

# 使用示例：
# $ npm run translate:en:file
# ? 请输入要翻译的文件路径（相对于 src/content/docs/）: guides/code-generator.md
# 🔄 开始翻译: guides/code-generator.md -> en
# ✅ 翻译完成: src/content/docs/en/guides/code-generator.md
```

### 预览翻译（不写入文件）

```bash
# 预览模式，显示将要翻译的文件但不实际执行翻译
npm run translate:check

# 输出示例：
# 📋 待翻译文件列表:
#   - src/content/docs/introduce.mdx
#   - src/content/docs/getting-started/install.md
#   - src/content/docs/guides/code-generator.md
#   ...
# 📊 共 45 个文件待翻译
# ⚠️ 预览模式，未执行实际翻译
```

## 翻译系统配置

### 配置 AI 提供商

```json
// translation-plugin/config.json
{
  "defaultProvider": "deepseek",
  "aiProviders": {
    "deepseek": {
      "service": "deepseek",
      "model": "deepseek-chat",
      "maxTokens": 8192,
      "temperature": 0.1,
      "baseURL": "https://api.deepseek.com"
    },
    "kimi": {
      "service": "kimi",
      "model": "kimi-k2-0905-preview",
      "maxTokens": 8192,
      "temperature": 0.1,
      "baseURL": "https://api.moonshot.cn/v1"
    },
    "ppio": {
      "service": "ppio",
      "model": "qwen/qwen3-next-80b-a3b-instruct",
      "maxTokens": 8192,
      "temperature": 0.1,
      "baseURL": "https://api.ppinfra.com/openai"
    }
  }
}
```

### 配置翻译目标语言和目录

```json
// translation-plugin/config.json
{
  "targetLanguages": ["en", "ja"],
  "sourceDir": "src/content/docs",
  "excludeDirs": ["en", "ja"],
  "excludeFiles": [],
  "frontmatterKeys": ["title", "description", "tagline"]
}
```

### 配置缓存和性能优化

```json
// translation-plugin/config.json
{
  "cache": {
    "enabled": true,
    "cacheDir": "translation-plugin/cache"
  },
  "parallel": {
    "enabled": true,
    "segmentParallel": false,
    "maxConcurrency": 30
  },
  "segmentation": {
    "enabled": true,
    "maxLength": 8000,
    "maxHeadingLevel": 3
  },
  "retryConfig": {
    "maxRetries": 3,
    "baseDelay": 1000,
    "maxDelay": 10000
  }
}
```

## 翻译插件核心 API

### TranslationPlugin.translateFile()

```javascript
// translation-plugin/src/core/translator.js
import { TranslationPlugin } from './translation-plugin/src/core/translator.js';
import { loadConfig } from './translation-plugin/src/core/config.js';

// 加载配置
const config = await loadConfig('./translation-plugin/config.json');

// 创建翻译器实例
const translator = new TranslationPlugin(config);

// 翻译单个文件
try {
  const result = await translator.translateFile(
    'src/content/docs/guides/code-generator.md',
    'en'
  );

  console.log('翻译完成:', result.targetFilePath);
  console.log('源文件:', result.sourceFilePath);
  console.log('目标语言:', result.targetLanguage);
  // 输出:
  // 翻译完成: src/content/docs/en/guides/code-generator.md
  // 源文件: src/content/docs/guides/code-generator.md
  // 目标语言: en
} catch (error) {
  console.error('翻译失败:', error.message);
}
```

### TranslationPlugin.translateFiles() 批量翻译

```javascript
// 批量翻译多个文件到多个目标语言
const files = [
  'src/content/docs/introduce.mdx',
  'src/content/docs/guides/code-generator.md',
  'src/content/docs/guides/batch-operation.md'
];

const targetLanguages = ['en', 'ja'];

try {
  // 根据配置决定顺序或并行执行
  const results = await translator.translateFiles(files, targetLanguages);

  // 统计结果
  const succeeded = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;

  console.log(`翻译完成: 成功 ${succeeded}, 失败 ${failed}`);
  // 输出: 翻译完成: 成功 5, 失败 1

  // 查看失败详情
  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.error(`文件 ${index} 失败:`, result.reason.message);
    }
  });
} catch (error) {
  console.error('批量翻译失败:', error.message);
}
```

### FileProcessor.getFilesToTranslate() 获取待翻译文件

```javascript
// translation-plugin/src/core/file-processor.js
import { FileProcessor } from './translation-plugin/src/core/file-processor.js';

const fileProcessor = new FileProcessor(config);

// 获取所有待翻译文件
const allFiles = await fileProcessor.getFilesToTranslate();
console.log(`找到 ${allFiles.length} 个文件`);

// 获取特定文件
const specificFile = await fileProcessor.getFilesToTranslate({
  specificFile: 'guides/code-generator.md'
});
console.log('目标文件:', specificFile[0]);

// 增量模式：仅获取修改过的文件
const changedFiles = await fileProcessor.getFilesToTranslate({
  incremental: true
});
console.log(`找到 ${changedFiles.length} 个修改过的文件`);
changedFiles.forEach(file => {
  console.log(`- ${fileProcessor.getRelativePath(file)}`);
});

// 输出示例:
// 找到 3 个修改过的文件
// - guides/code-generator.md
// - guides/batch-operation.md
// - introduce.mdx
```

### FileProcessor.parseFile() 解析文档

```javascript
// 解析 Markdown/MDX 文件，提取 frontmatter 和内容
const parsed = await fileProcessor.parseFile(
  'src/content/docs/guides/code-generator.md'
);

console.log('Frontmatter:', parsed.frontmatter);
// 输出:
// Frontmatter: {
//   title: '代码生成器',
//   sidebar: { order: 2 }
// }

console.log('内容长度:', parsed.content.length);
console.log('原始内容长度:', parsed.originalContent.length);

// 验证文档格式
const isValid = fileProcessor.validateDocument(parsed);
console.log('文档格式有效:', isValid);
// 输出: 文档格式有效: true
```

### TranslationPlugin.callAI() 调用 AI 服务

```javascript
// 直接调用 AI 服务进行翻译（带重试机制）
const prompt = `Translate the following MyBatis-Plus documentation to English:

# 代码生成器

AutoGenerator 是 MyBatis-Plus 的代码生成器...`;

try {
  const translatedContent = await translator.callAI(prompt);

  console.log('翻译结果:', translatedContent);
  // 输出:
  // 🤖 调用 AI 服务: deepseek (deepseek)
  // 📤 发送请求 - 模型: deepseek-chat, 最大Token: 8192
  // ⏳ 请求进行中，请耐心等待...
  // ✅ 请求完成，耗时: 2.34秒
  // 📊 Token 使用: 输入 256, 输出 312, 成本 $0.008
  // 翻译结果: # Code Generator\n\nAutoGenerator is the code generator...
} catch (error) {
  // 自动重试 3 次（基于 retryConfig）
  console.error('AI 调用失败:', error.message);
  // 可能输出:
  // ❌ AI 调用失败 (尝试 1/3): Network timeout
  // ⏸️ 1000ms 后重试...
  // ❌ AI 调用失败 (尝试 2/3): Network timeout
  // ⏸️ 2000ms 后重试...
}
```

### generateTranslationPrompt() 生成翻译提示词

```javascript
// translation-plugin/src/core/prompt-template.js
import { generateTranslationPrompt } from './translation-plugin/src/core/prompt-template.js';

const prompt = generateTranslationPrompt(
  'en',
  ['title', 'description'],
  '---\ntitle: 代码生成器\ndescription: 快速生成代码\n---\n\n# 介绍\n\nAutoGenerator 是代码生成工具...'
);

console.log(prompt);
// 输出:
// You are an expert technical documentation translator specializing in English localization...
// TARGET LANGUAGE: English
// FRONTMATTER KEYS TO TRANSLATE: title, description
//
// DOCUMENT TO TRANSLATE:
// ---
// title: 代码生成器
// ...
```

## 文档内容管理

### 添加新文档页面

```markdown
<!-- src/content/docs/guides/my-new-guide.md -->
---
title: 我的新指南
description: 这是一个新的使用指南
sidebar:
  order: 10
---

## 简介

这里是新指南的内容...

## 使用方法

```java
// 示例代码
public class Example {
    public static void main(String[] args) {
        System.out.println("Hello MyBatis-Plus!");
    }
}
```
```

### 配置侧边栏

```javascript
// doc.config.mjs
export const sidebar = [
  {
    label: "简介",
    translations: {
      en: "Introduction",
      ja: "イントロダクション"
    },
    link: "/introduce"
  },
  {
    label: "指南",
    translations: {
      en: "Guides",
      ja: "ガイドライン"
    },
    autogenerate: {
      directory: "guides"
    }
  }
];
```

### 配置多语言支持

```javascript
// doc.config.mjs
export const locales = {
  root: {
    label: "简体中文",
    lang: "zh-CN"
  },
  en: {
    label: "English",
    lang: "en"
  },
  ja: {
    label: "日本語",
    lang: "ja"
  }
};
```

### 自定义组件使用

```astro
---
// 在 MDX 文件中导入和使用自定义组件
import SupportDb from '@/components/SupportDb.astro';
import Partner from '@/components/Partner.astro';
import Badge from '@/components/Badge.astro';
---

# 我的文档页面

<Badge type="tip" text="新功能" />

## 支持的数据库

<SupportDb />

## 合作伙伴

<Partner />
```

## 总结

MyBatis-Plus 文档站点项目提供了完整的文档生成和多语言翻译解决方案。主要应用场景包括：开发文档网站时通过 `npm run dev` 实时预览修改效果；使用 `npm run build` 构建优化的静态站点用于生产部署；通过翻译系统快速生成多语言版本文档，支持全量翻译、增量翻译、单文件翻译等多种模式；利用缓存机制和并行处理提高翻译效率，降低 API 调用成本。

集成模式方面，项目采用 Astro + Starlight 作为文档框架，支持 Markdown/MDX 格式的文档编写；翻译系统基于 llm.js 统一接口，可灵活切换不同的 AI 提供商（DeepSeek、Kimi、OpenAI、Google Gemini 等）；通过 gray-matter 解析 frontmatter 元数据，支持标题、描述等字段的自动翻译；文档内容按标题层级智能分段，支持大型文档的分段翻译；使用 TailwindCSS 和 Svelte 组件增强页面交互体验。整个系统设计注重开发效率和文档质量，适合需要维护多语言技术文档的开源项目使用。
