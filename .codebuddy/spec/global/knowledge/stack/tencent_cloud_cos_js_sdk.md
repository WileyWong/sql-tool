# 腾讯云对象存储 COS JavaScript SDK 使用指南

> **文档版本**: v1.0  
> **SDK版本**: cos-js-sdk-v5 (最新版)  
> **更新时间**: 2025-11-13  
> **文档类型**: 技术栈知识库  
> **适用场景**: Web浏览器、微信小程序、Node.js环境

---

## 📚 目录

- [简介](#-简介)
- [环境要求](#-环境要求)
- [安装配置](#-安装配置)
- [快速开始](#-快速开始)
- [核心API](#-核心api)
- [小程序SDK](#-小程序sdk)
- [高级功能](#-高级功能)
- [最佳实践](#-最佳实践)
- [常见问题](#-常见问题)
- [相关资源](#-相关资源)

---

## 📖 简介

### 产品概述

**腾讯云对象存储（COS）JavaScript SDK** 提供了在浏览器、小程序、Node.js环境中操作COS服务的完整能力。SDK基于XML API封装,支持文件上传、下载、删除、查询等全方位操作。

### 核心特性

- ✅ **多环境支持**: 浏览器、微信小程序、Node.js
- ✅ **安全可靠**: 支持临时密钥,自动刷新凭证
- ✅ **智能上传**: 自动选择简单上传或分块上传
- ✅ **断点续传**: 大文件支持断点续传,提升稳定性
- ✅ **并发控制**: 灵活控制文件和分块并发数
- ✅ **进度监控**: 实时监控上传下载进度

### SDK版本说明

- **浏览器端**: cos-js-sdk-v5
- **小程序端**: cos-wx-sdk-v5
- **源码地址**: [GitHub - cos-js-sdk-v5](https://github.com/tencentyun/cos-js-sdk-v5)
- **NPM包**: [cos-js-sdk-v5](https://www.npmjs.com/package/cos-js-sdk-v5)
- **更新日志**: [CHANGELOG](https://github.com/tencentyun/cos-js-sdk-v5/blob/master/CHANGELOG.md)
- **示例Demo**: [Demo示例](https://github.com/tencentyun/cos-js-sdk-v5/tree/master/demo)

> ⚠️ **重要提示**: JSON版本SDK已停止维护,请使用XML版本SDK

### 适用场景

- Web应用文件上传下载
- 图片、视频等媒体资源管理
- 在线文档编辑与存储
- 小程序文件上传
- 静态资源CDN分发

---

## 🔧 环境要求

### 浏览器环境

- **最低要求**: 支持HTML5特性的浏览器
- **兼容性**: IE10+, Chrome, Firefox, Safari, Edge等现代浏览器
- **必须支持**: 
  - XMLHttpRequest Level 2
  - File API
  - Blob API

### 前置准备

1. **创建存储桶**
   - 登录[COS控制台](https://console.cloud.tencent.com/cos)
   - 创建存储桶,获取Bucket名称和地域(Region)

2. **获取API密钥**
   - 访问[API密钥管理](https://console.cloud.tencent.com/cam/capi)
   - 获取SecretId和SecretKey
   - **生产环境强烈建议使用临时密钥**

3. **配置CORS规则**（浏览器环境必须）
   - 在COS控制台配置CORS规则:
   ```json
   {
     "AllowedOrigins": ["*"],
     "AllowedMethods": ["GET", "POST", "PUT", "DELETE", "HEAD"],
     "AllowedHeaders": ["*"],
     "ExposeHeaders": ["ETag", "Content-Length", "x-cos-request-id"],
     "MaxAgeSeconds": 600
   }
   ```

---

## 📦 安装配置

### 方式一: Script标签引入

适用于传统Web项目:

```html
<!-- 引入SDK -->
<script src="https://cdn.jsdelivr.net/npm/cos-js-sdk-v5/dist/cos-js-sdk-v5.min.js"></script>

<script>
  // 全局变量 COS 即可使用
  const cos = new COS({
    SecretId: 'YOUR_SECRET_ID',
    SecretKey: 'YOUR_SECRET_KEY'
  });
</script>
```

**本地下载方式**:
```bash
# 下载到项目目录
wget https://cdn.jsdelivr.net/npm/cos-js-sdk-v5/dist/cos-js-sdk-v5.min.js
```

### 方式二: NPM安装（推荐）

适用于Webpack、Vue、React等现代前端项目:

```bash
npm install cos-js-sdk-v5 --save
```

**使用方式**:
```javascript
// CommonJS
const COS = require('cos-js-sdk-v5');

// ES Module
import COS from 'cos-js-sdk-v5';

const cos = new COS({
  // 配置项
});
```

### 方式三: 小程序环境

微信小程序需使用专用SDK:

```bash
npm install cos-wx-sdk-v5 --save
```

---

## 🚀 快速开始

### 步骤1: 初始化COS实例

#### 方式A: 单次临时密钥（适合一次性操作）

```javascript
const cos = new COS({
  SecretId: 'TMPID_xxxxx',           // 临时密钥SecretId
  SecretKey: 'TMPKey_xxxxx',         // 临时密钥SecretKey
  SecurityToken: 'TOKEN_xxxxx',      // 会话令牌SessionToken
  StartTime: 1720770679,             // 服务端时间戳(秒)
  ExpiredTime: 1720771991            // 过期时间戳(秒)
});
```

#### 方式B: 临时密钥回调（推荐,自动刷新）

```javascript
const cos = new COS({
  getAuthorization: async (options, callback) => {
    // 从您的服务端获取临时密钥
    const response = await fetch('https://your-sts-server.com/sts');
    const data = await response.json();
    
    callback({
      TmpSecretId: data.credentials.tmpSecretId,
      TmpSecretKey: data.credentials.tmpSecretKey,
      SecurityToken: data.credentials.sessionToken,
      StartTime: data.startTime,      // 服务端时间戳(秒)
      ExpiredTime: data.expiredTime,  // 过期时间戳(秒)
      ScopeLimit: true                // 细粒度权限控制
    });
  }
});
```

**临时密钥服务端示例（Node.js）**:
```javascript
// 使用 qcloud-cos-sts 生成临时密钥
const STS = require('qcloud-cos-sts');

app.get('/sts', (req, res) => {
  const policy = {
    version: '2.0',
    statement: [{
      action: ['name/cos:PutObject', 'name/cos:GetObject'],
      effect: 'allow',
      resource: ['qcs::cos:ap-guangzhou:uid/1250000000:examplebucket-1250000000/*']
    }]
  };
  
  STS.getCredential({
    secretId: process.env.SECRET_ID,
    secretKey: process.env.SECRET_KEY,
    durationSeconds: 1800,
    policy: policy
  }, (err, credential) => {
    res.json(credential);
  });
});
```

#### 方式C: 永久密钥（仅用于测试环境）

```javascript
const cos = new COS({
  SecretId: 'AKIDxxxxxxxxxxxxxxxx',      // 永久密钥ID
  SecretKey: 'xxxxxxxxxxxxxxxxxxxxxxxx'  // 永久密钥Key
});
```

> ⚠️ **安全警告**: 生产环境禁止使用永久密钥,避免密钥泄露风险

### 步骤2: 高级上传（推荐）

`uploadFile` 方法会自动根据文件大小选择简单上传或分块上传:

```javascript
// HTML文件选择器
<input type="file" id="fileInput" />

<script>
document.getElementById('fileInput').addEventListener('change', function(e) {
  const file = e.target.files[0];
  
  cos.uploadFile({
    Bucket: 'examplebucket-1250000000',  // 存储桶名称
    Region: 'ap-guangzhou',              // 地域
    Key: 'folder/' + file.name,          // 对象键(文件路径)
    Body: file,                          // 文件对象
    SliceSize: 5 * 1024 * 1024,         // 超过5MB使用分块上传
    
    // 进度回调
    onProgress: function(progressData) {
      const percent = parseInt(progressData.percent * 100);
      console.log('上传进度:', percent + '%');
      console.log('已上传:', progressData.loaded);
      console.log('文件总大小:', progressData.total);
    },
    
    // 任务创建回调
    onTaskReady: function(taskId) {
      console.log('任务ID:', taskId);
    }
  }, function(err, data) {
    if (err) {
      console.error('上传失败:', err);
    } else {
      console.log('上传成功:', data);
      console.log('文件访问URL:', 'https://' + data.Location);
      console.log('ETag:', data.ETag);
    }
  });
});
</script>
```

### 步骤3: 查询对象列表

```javascript
cos.getBucket({
  Bucket: 'examplebucket-1250000000',
  Region: 'ap-guangzhou',
  Prefix: 'folder/',    // 前缀匹配
  MaxKeys: 100          // 最多返回100个
}, function(err, data) {
  if (err) {
    console.error('查询失败:', err);
  } else {
    console.log('对象列表:', data.Contents);
    data.Contents.forEach(item => {
      console.log('文件名:', item.Key);
      console.log('大小:', item.Size);
      console.log('修改时间:', item.LastModified);
    });
  }
});
```

### 步骤4: 获取下载URL

```javascript
// 方式1: 获取不带签名的URL（公有读存储桶）
const url = cos.getObjectUrl({
  Bucket: 'examplebucket-1250000000',
  Region: 'ap-guangzhou',
  Key: 'folder/picture.jpg',
  Sign: false  // 不签名
});
console.log('下载链接:', url);

// 方式2: 获取带签名的URL（私有存储桶）
cos.getObjectUrl({
  Bucket: 'examplebucket-1250000000',
  Region: 'ap-guangzhou',
  Key: 'folder/document.pdf',
  Sign: true,
  Expires: 3600  // 签名有效期1小时
}, function(err, data) {
  if (!err) {
    console.log('预签名URL:', data.Url);
  }
});
```

### 步骤5: 删除对象

```javascript
cos.deleteObject({
  Bucket: 'examplebucket-1250000000',
  Region: 'ap-guangzhou',
  Key: 'folder/old-file.txt'
}, function(err, data) {
  if (err) {
    console.error('删除失败:', err);
  } else {
    console.log('删除成功:', data);
  }
});
```

---

## 🔑 核心API

### 对象操作

| 方法名 | 功能说明 | 适用场景 |
|--------|----------|----------|
| `uploadFile` | 智能上传（推荐） | 自动选择简单/分块上传,支持断点续传 |
| `putObject` | 简单上传 | 小文件上传(≤5GB) |
| `sliceUploadFile` | 分块上传 | 大文件上传,手动控制分块 |
| `getObject` | 下载对象 | 下载文件到本地 |
| `getObjectUrl` | 获取URL | 生成访问链接 |
| `deleteObject` | 删除对象 | 删除单个文件 |
| `deleteMultipleObject` | 批量删除 | 批量删除多个文件 |
| `headObject` | 查询元数据 | 获取文件属性信息 |
| `copyObject` | 复制对象 | 复制文件到新位置 |

### 存储桶操作

| 方法名 | 功能说明 | 适用场景 |
|--------|----------|----------|
| `getBucket` | 查询对象列表 | 列出存储桶中的文件 |
| `headBucket` | 检查存储桶 | 检查存储桶是否存在 |
| `putBucketCors` | 设置CORS | 配置跨域规则 |
| `getBucketCors` | 查询CORS | 获取跨域配置 |
| `deleteBucketCors` | 删除CORS | 删除跨域配置 |

### 任务管理

| 方法名 | 功能说明 | 适用场景 |
|--------|----------|----------|
| `getTaskList` | 获取任务列表 | 查看当前上传任务 |
| `pauseTask` | 暂停任务 | 暂停上传任务 |
| `restartTask` | 恢复任务 | 恢复暂停的任务 |
| `cancelTask` | 取消任务 | 取消上传任务 |

### 简单上传示例

适用于小于5GB的文件:

```javascript
cos.putObject({
  Bucket: 'examplebucket-1250000000',
  Region: 'ap-guangzhou',
  Key: 'images/photo.jpg',
  Body: file,  // File对象或Blob对象
  
  // 可选参数
  StorageClass: 'STANDARD',  // 存储类型
  ContentType: 'image/jpeg', // 文件类型
  
  onProgress: function(progressData) {
    console.log('上传进度:', progressData.percent);
  }
}, function(err, data) {
  if (err) {
    console.error(err);
  } else {
    console.log('上传成功, ETag:', data.ETag);
  }
});
```

### 分块上传示例

适用于大文件,支持断点续传:

```javascript
cos.sliceUploadFile({
  Bucket: 'examplebucket-1250000000',
  Region: 'ap-guangzhou',
  Key: 'videos/movie.mp4',
  Body: file,
  
  // 分块配置
  ChunkSize: 1024 * 1024,  // 每块1MB
  AsyncLimit: 5,           // 并发上传5个分块
  
  onProgress: function(progressData) {
    console.log('上传进度:', progressData.percent);
  },
  
  onHashProgress: function(progressData) {
    console.log('计算MD5进度:', progressData.percent);
  }
}, function(err, data) {
  if (err) {
    console.error('上传失败:', err);
  } else {
    console.log('上传成功:', data);
  }
});
```

### 批量上传示例

```javascript
const files = document.getElementById('fileInput').files;

cos.uploadFiles({
  files: [{
    Bucket: 'examplebucket-1250000000',
    Region: 'ap-guangzhou',
    Key: 'file1.txt',
    Body: files[0]
  }, {
    Bucket: 'examplebucket-1250000000',
    Region: 'ap-guangzhou',
    Key: 'file2.txt',
    Body: files[1]
  }],
  
  SliceSize: 5 * 1024 * 1024,  // 超过5MB使用分块上传
  
  onProgress: function(info) {
    const percent = parseInt(info.percent * 100);
    console.log('总进度:', percent + '%');
    console.log('已完成:', info.loaded, '/', info.total);
  },
  
  onFileFinish: function(err, data, options) {
    console.log(options.Key + ' 上传' + (err ? '失败' : '完成'));
  }
}, function(err, data) {
  if (err) {
    console.error('批量上传失败:', err);
  } else {
    console.log('批量上传成功:', data);
  }
});
```

---

## 📱 小程序SDK

### 安装与引入

微信小程序需使用专用SDK `cos-wx-sdk-v5`:

```bash
npm install cos-wx-sdk-v5 --save
```

**小程序中引入**:
```javascript
const COS = require('cos-wx-sdk-v5');

const cos = new COS({
  getAuthorization: function(options, callback) {
    // 从服务端获取临时密钥
    wx.request({
      url: 'https://your-server.com/sts',
      success: function(result) {
        const data = result.data.credentials;
        callback({
          TmpSecretId: data.tmpSecretId,
          TmpSecretKey: data.tmpSecretKey,
          SecurityToken: data.sessionToken,
          StartTime: result.data.startTime,
          ExpiredTime: result.data.expiredTime
        });
      }
    });
  }
});
```

### 小程序上传文件

```javascript
// 选择图片
wx.chooseImage({
  count: 1,
  success: function(res) {
    const filePath = res.tempFilePaths[0];
    
    // 上传到COS
    cos.uploadFile({
      Bucket: 'examplebucket-1250000000',
      Region: 'ap-guangzhou',
      Key: 'images/' + Date.now() + '.jpg',
      FilePath: filePath,  // 小程序临时文件路径
      
      onProgress: function(progressData) {
        console.log('上传进度:', parseInt(progressData.percent * 100) + '%');
      }
    }, function(err, data) {
      if (err) {
        wx.showToast({ title: '上传失败', icon: 'none' });
      } else {
        wx.showToast({ title: '上传成功', icon: 'success' });
        console.log('文件URL:', 'https://' + data.Location);
      }
    });
  }
});
```

### 小程序选择文件

```javascript
// 选择任意类型文件
wx.chooseMessageFile({
  count: 1,
  type: 'file',
  success: function(res) {
    const file = res.tempFiles[0];
    
    cos.uploadFile({
      Bucket: 'examplebucket-1250000000',
      Region: 'ap-guangzhou',
      Key: 'files/' + file.name,
      FilePath: file.path,
      
      onProgress: function(info) {
        console.log('上传进度:', info.percent);
      }
    }, function(err, data) {
      console.log(err || data);
    });
  }
});
```

### 小程序特殊配置

#### 1. 域名配置

小程序SDK **无需**在小程序后台配置COS域名,SDK内部已处理。但如果使用临时密钥服务,需在小程序后台的 **request合法域名** 中添加临时密钥服务地址。

#### 2. 安全建议

- ✅ 必须使用临时密钥,禁止在小程序中硬编码永久密钥
- ✅ 临时密钥权限应遵循最小权限原则
- ✅ 建议临时密钥有效期不超过30分钟

#### 3. 文件路径限制

小程序中需使用 `wx.chooseImage`、`wx.chooseMessageFile` 等API获取的临时文件路径,不可使用本地绝对路径。

---

## 🚀 高级功能

### 1. 初始化配置选项

```javascript
const cos = new COS({
  // 密钥配置(必填)
  getAuthorization: getAuthorizationCallback,
  
  // 可选配置
  FileParallelLimit: 3,      // 文件并发上传数
  ChunkParallelLimit: 8,     // 分块并发上传数
  ChunkSize: 1024 * 1024,    // 分块大小(1MB)
  SliceSize: 5 * 1024 * 1024, // 分块上传阈值(5MB)
  ProgressInterval: 1000,    // 进度回调间隔(ms)
  Protocol: 'https:',        // 协议(https:或http:)
  Domain: '',                // 自定义域名
  UploadCheckContentMd5: true, // 上传校验MD5
  Timeout: 0,                // 超时时间(毫秒,0表示不超时)
  ForcePathStyle: false,     // 强制使用路径样式
  UseAccelerate: false,      // 启用全球加速
  UploadQueueSize: 10000     // 上传队列大小
});
```

### 2. 设置对象元数据

```javascript
cos.putObject({
  Bucket: 'examplebucket-1250000000',
  Region: 'ap-guangzhou',
  Key: 'document.pdf',
  Body: file,
  
  // 设置HTTP头部
  CacheControl: 'max-age=7200',
  ContentType: 'application/pdf',
  ContentDisposition: 'attachment; filename="report.pdf"',
  ContentEncoding: 'gzip',
  
  // 自定义元数据
  Metadata: {
    'x-cos-meta-author': 'John Doe',
    'x-cos-meta-version': '1.0.0'
  },
  
  // 存储类型
  StorageClass: 'STANDARD'  // STANDARD, STANDARD_IA, ARCHIVE等
}, callback);
```

### 3. 限速上传

控制单个链接的上传速度,避免占用过多带宽:

```javascript
cos.uploadFile({
  Bucket: 'examplebucket-1250000000',
  Region: 'ap-guangzhou',
  Key: 'large-file.zip',
  Body: file,
  
  // 限速设置(单位: bit/s)
  Headers: {
    'x-cos-traffic-limit': 819200  // 100KB/s = 819200 bit/s
  },
  // 限速范围: 819200 (100KB/s) ~ 838860800 (100MB/s)
  
  onProgress: function(info) {
    console.log('限速上传进度:', info.percent);
  }
}, callback);
```

### 4. 服务端加密

```javascript
cos.putObject({
  Bucket: 'examplebucket-1250000000',
  Region: 'ap-guangzhou',
  Key: 'encrypted-file.txt',
  Body: file,
  
  // 使用COS托管加密(SSE-COS)
  ServerSideEncryption: 'AES256'
  
  // 或使用KMS托管加密(SSE-KMS)
  // ServerSideEncryption: 'cos/kms',
  // SSEKMSKeyId: 'your-kms-key-id'
}, callback);
```

### 5. 上传时自动添加MD5

```javascript
cos.uploadFile({
  Bucket: 'examplebucket-1250000000',
  Region: 'ap-guangzhou',
  Key: 'file.zip',
  Body: file,
  
  // 自动在元数据中添加MD5
  UploadAddMetaMd5: true,
  
  onHashProgress: function(progressData) {
    console.log('计算MD5进度:', progressData.percent);
  }
}, function(err, data) {
  if (!err) {
    console.log('文件MD5:', data.Metadata['x-cos-meta-md5']);
  }
});
```

### 6. 任务队列管理

```javascript
// 开始上传
const taskId = cos.uploadFile({
  Bucket: 'examplebucket-1250000000',
  Region: 'ap-guangzhou',
  Key: 'large-video.mp4',
  Body: file,
  
  onTaskReady: function(tid) {
    console.log('任务创建, ID:', tid);
    taskId = tid;
  },
  
  onProgress: function(info) {
    console.log('进度:', info.percent);
  }
}, callback);

// 暂停任务
cos.pauseTask(taskId);
console.log('任务已暂停');

// 恢复任务
cos.restartTask(taskId);
console.log('任务已恢复');

// 取消任务
cos.cancelTask(taskId);
console.log('任务已取消');

// 获取任务列表
const list = cos.getTaskList();
console.log('当前任务列表:', list);
```

### 7. 跨域复制

```javascript
cos.copyObject({
  Bucket: 'target-bucket-1250000000',
  Region: 'ap-shanghai',
  Key: 'target-file.jpg',
  
  CopySource: 'source-bucket-1250000000.cos.ap-guangzhou.myqcloud.com/source-file.jpg'
}, function(err, data) {
  if (err) {
    console.error('复制失败:', err);
  } else {
    console.log('复制成功:', data);
  }
});
```

### 8. 预签名URL（临时分享）

```javascript
// 生成上传预签名URL
const uploadUrl = cos.getObjectUrl({
  Bucket: 'examplebucket-1250000000',
  Region: 'ap-guangzhou',
  Key: 'upload-target.jpg',
  Method: 'PUT',
  Sign: true,
  Expires: 3600  // 1小时有效期
}, function(err, data) {
  if (!err) {
    console.log('上传URL:', data.Url);
    // 其他客户端可直接使用此URL上传文件
  }
});

// 生成下载预签名URL
cos.getObjectUrl({
  Bucket: 'examplebucket-1250000000',
  Region: 'ap-guangzhou',
  Key: 'private-document.pdf',
  Sign: true,
  Expires: 1800  // 30分钟有效期
}, function(err, data) {
  if (!err) {
    console.log('下载URL:', data.Url);
    // 可分享此链接给他人临时下载
  }
});
```

---

## 💡 最佳实践

### 1. 密钥安全管理

✅ **推荐做法**:
```javascript
// 使用临时密钥回调,从服务端动态获取
const cos = new COS({
  getAuthorization: async (options, callback) => {
    // 从您的服务端获取临时密钥
    const response = await fetch('https://your-server.com/sts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // 可传递业务参数,服务端根据用户身份授权
        userId: getCurrentUserId()
      })
    });
    
    const credentials = await response.json();
    callback(credentials);
  }
});
```

❌ **避免做法**:
```javascript
// 永远不要在前端代码中硬编码永久密钥
const cos = new COS({
  SecretId: 'AKIDxxxxxxxx',  // 危险!
  SecretKey: 'xxxxxxxx'      // 危险!
});
```

### 2. 上传方式选择

**决策树**:
```
文件大小 < 5MB
  └─ 使用 putObject (简单上传)

文件大小 >= 5MB
  └─ 使用 uploadFile (智能上传,推荐)
      └─ 自动选择简单/分块上传
      └─ 支持断点续传
      └─ 自动并发控制

需要手动控制分块
  └─ 使用 sliceUploadFile (分块上传)
```

**代码示例**:
```javascript
// 推荐: 使用 uploadFile,适用于所有场景
function smartUpload(file) {
  cos.uploadFile({
    Bucket: 'examplebucket-1250000000',
    Region: 'ap-guangzhou',
    Key: 'uploads/' + file.name,
    Body: file,
    SliceSize: 5 * 1024 * 1024,  // 5MB以上分块
    onProgress: progressCallback
  }, uploadCallback);
}
```

### 3. 错误处理与重试

```javascript
function uploadWithRetry(file, maxRetries = 3) {
  let retryCount = 0;
  
  function attemptUpload() {
    cos.uploadFile({
      Bucket: 'examplebucket-1250000000',
      Region: 'ap-guangzhou',
      Key: 'files/' + file.name,
      Body: file,
      
      onProgress: function(info) {
        console.log('进度:', info.percent);
      }
    }, function(err, data) {
      if (err) {
        // 判断是否为网络错误
        if (err.error && err.error.Code === 'NetworkError') {
          if (retryCount < maxRetries) {
            retryCount++;
            console.log(`网络错误,重试第${retryCount}次...`);
            setTimeout(attemptUpload, 2000);  // 2秒后重试
            return;
          }
        }
        
        // 错误分类处理
        if (err.statusCode === 403) {
          console.error('权限不足,请检查密钥权限');
        } else if (err.statusCode === 404) {
          console.error('存储桶不存在');
        } else {
          console.error('上传失败:', err);
        }
      } else {
        console.log('上传成功:', data);
      }
    });
  }
  
  attemptUpload();
}
```

### 4. 进度条实现

```html
<div class="upload-progress">
  <div class="progress-bar" id="progressBar" style="width: 0%"></div>
  <span id="progressText">0%</span>
</div>

<script>
function uploadWithProgress(file) {
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  
  cos.uploadFile({
    Bucket: 'examplebucket-1250000000',
    Region: 'ap-guangzhou',
    Key: 'uploads/' + file.name,
    Body: file,
    
    onProgress: function(progressData) {
      const percent = parseInt(progressData.percent * 100);
      progressBar.style.width = percent + '%';
      progressText.textContent = percent + '%';
      
      // 显示上传速度
      const speed = progressData.speed || 0;
      const speedMB = (speed / 1024 / 1024).toFixed(2);
      console.log('上传速度:', speedMB + ' MB/s');
    }
  }, function(err, data) {
    if (!err) {
      progressText.textContent = '上传完成!';
    } else {
      progressText.textContent = '上传失败';
      progressBar.style.backgroundColor = 'red';
    }
  });
}
</script>
```

### 5. 大文件上传优化

```javascript
const cos = new COS({
  getAuthorization: getAuthCallback,
  
  // 优化配置
  ChunkParallelLimit: 8,        // 并发上传8个分块
  ChunkSize: 2 * 1024 * 1024,   // 每块2MB
  ProgressInterval: 500          // 500ms更新一次进度
});

function uploadLargeFile(file) {
  cos.uploadFile({
    Bucket: 'examplebucket-1250000000',
    Region: 'ap-guangzhou',
    Key: 'large-files/' + file.name,
    Body: file,
    
    SliceSize: 5 * 1024 * 1024,   // 5MB以上分块
    
    onHashProgress: function(info) {
      console.log('计算MD5:', info.percent);
    },
    
    onProgress: function(info) {
      console.log('上传进度:', info.percent);
      console.log('已上传:', (info.loaded / 1024 / 1024).toFixed(2), 'MB');
      console.log('总大小:', (info.total / 1024 / 1024).toFixed(2), 'MB');
      
      if (info.speed) {
        const speedMB = (info.speed / 1024 / 1024).toFixed(2);
        console.log('速度:', speedMB, 'MB/s');
      }
    }
  }, function(err, data) {
    console.log(err || data);
  });
}
```

### 6. 批量操作优化

```javascript
// 批量上传文件
function batchUpload(files) {
  const uploadTasks = Array.from(files).map(file => ({
    Bucket: 'examplebucket-1250000000',
    Region: 'ap-guangzhou',
    Key: 'batch/' + file.name,
    Body: file
  }));
  
  cos.uploadFiles({
    files: uploadTasks,
    SliceSize: 5 * 1024 * 1024,
    
    onProgress: function(info) {
      console.log('总进度:', parseInt(info.percent * 100) + '%');
    },
    
    onFileFinish: function(err, data, options) {
      const fileName = options.Key.split('/').pop();
      if (err) {
        console.error(`${fileName} 上传失败:`, err);
      } else {
        console.log(`${fileName} 上传成功`);
      }
    }
  }, function(err, data) {
    if (!err) {
      console.log('批量上传完成, 成功:', data.files.length);
    }
  });
}
```

### 7. CORS配置最佳实践

在COS控制台配置CORS规则:

```json
[
  {
    "id": "web-upload",
    "allowedOrigin": ["https://yourdomain.com"],
    "allowedMethod": ["GET", "POST", "PUT", "DELETE", "HEAD"],
    "allowedHeader": ["*"],
    "exposeHeader": [
      "ETag",
      "Content-Length",
      "x-cos-request-id",
      "x-cos-hash-crc64ecma"
    ],
    "maxAgeSeconds": 600
  }
]
```

---

## ❓ 常见问题

### Q1: 上传失败,报403错误?

**A**: 权限不足,检查以下几点:
1. 临时密钥是否过期
2. 临时密钥权限策略是否包含 `PutObject` 操作
3. 存储桶是否存在
4. 密钥与存储桶是否属于同一账号

**解决方案**:
```javascript
// 检查临时密钥策略
{
  "version": "2.0",
  "statement": [{
    "action": [
      "name/cos:PutObject",
      "name/cos:PostObject",
      "name/cos:InitiateMultipartUpload",
      "name/cos:UploadPart",
      "name/cos:CompleteMultipartUpload"
    ],
    "effect": "allow",
    "resource": [
      "qcs::cos:ap-guangzhou:uid/1250000000:examplebucket-1250000000/*"
    ]
  }]
}
```

### Q2: 跨域错误(CORS Error)?

**A**: CORS配置不正确,需要在COS控制台配置CORS规则:

1. 登录[COS控制台](https://console.cloud.tencent.com/cos)
2. 选择存储桶 → 安全管理 → 跨域访问CORS设置
3. 添加规则:
   - 来源Origin: `*` 或具体域名
   - 允许方法: GET, POST, PUT, DELETE, HEAD
   - 允许Headers: `*`
   - 暴露Headers: `ETag, Content-Length, x-cos-request-id`
   - 最大缓存时间: 600秒

### Q3: 上传进度回调不准确?

**A**: 可能原因:
1. 项目中有拦截XHR的库(如Mock.js),需要配置白名单
2. 使用了代理或VPN,导致进度计算不准
3. 网络波动导致进度跳跃

**解决方案**:
```javascript
// 如使用Mock.js,配置白名单
Mock.setup({
  timeout: '200-600',
  xhr: {
    exclude: /\.myqcloud\.com/ // 排除COS域名
  }
});
```

### Q4: 小程序上传失败?

**A**: 检查以下几点:
1. 是否使用了 `cos-wx-sdk-v5`(不是 `cos-js-sdk-v5`)
2. 临时密钥服务地址是否已添加到request合法域名
3. 文件路径是否使用了小程序临时文件路径
4. 是否正确使用 `FilePath` 参数(小程序特有)

### Q5: 如何实现断点续传?

**A**: 使用 `uploadFile` 或 `sliceUploadFile`,SDK会自动实现断点续传:

```javascript
cos.uploadFile({
  Bucket: 'examplebucket-1250000000',
  Region: 'ap-guangzhou',
  Key: 'large-file.zip',
  Body: file,
  
  // SDK会自动检测未完成的上传任务
  // 如果Key和文件内容一致,会自动续传
  
  onProgress: function(info) {
    // 刷新页面后再次上传同一文件,进度会从断点继续
    console.log('进度:', info.percent);
  }
}, callback);
```

### Q6: 如何获取上传后的文件URL?

**A**: 三种方式:

```javascript
// 方式1: 从回调数据中获取
cos.uploadFile({...}, function(err, data) {
  if (!err) {
    const url = 'https://' + data.Location;
    console.log('文件URL:', url);
  }
});

// 方式2: 使用 getObjectUrl 方法
const url = cos.getObjectUrl({
  Bucket: 'examplebucket-1250000000',
  Region: 'ap-guangzhou',
  Key: 'file.jpg',
  Sign: false  // 公有读存储桶不需要签名
});

// 方式3: 手动拼接(公有读存储桶)
const url = `https://${Bucket}.cos.${Region}.myqcloud.com/${Key}`;
```

### Q7: 如何删除大量文件?

**A**: 使用批量删除接口:

```javascript
// 一次最多删除1000个
cos.deleteMultipleObject({
  Bucket: 'examplebucket-1250000000',
  Region: 'ap-guangzhou',
  Objects: [
    { Key: 'file1.txt' },
    { Key: 'file2.txt' },
    { Key: 'folder/file3.jpg' }
    // ... 最多1000个
  ]
}, function(err, data) {
  if (!err) {
    console.log('删除成功:', data.Deleted);
    console.log('删除失败:', data.Error);
  }
});
```

### Q8: 如何设置上传文件的访问权限?

**A**: 使用ACL参数:

```javascript
cos.putObject({
  Bucket: 'examplebucket-1250000000',
  Region: 'ap-guangzhou',
  Key: 'public-file.jpg',
  Body: file,
  
  // 设置对象ACL
  ACL: 'public-read'  // 公有读私有写
  // 其他选项: private, public-read-write, authenticated-read
}, callback);
```

---

## 📚 相关资源

### 官方文档

- **产品文档**: https://cloud.tencent.com/document/product/436
- **JavaScript SDK文档**: https://cloud.tencent.com/document/product/436/11459
- **小程序SDK文档**: https://cloud.tencent.com/document/product/436/31953
- **API参考**: https://cloud.tencent.com/document/product/436/7751
- **常见问题**: https://cloud.tencent.com/document/product/436/30743

### 代码资源

- **GitHub仓库**: https://github.com/tencentyun/cos-js-sdk-v5
- **NPM包**: https://www.npmjs.com/package/cos-js-sdk-v5
- **小程序SDK**: https://www.npmjs.com/package/cos-wx-sdk-v5
- **Demo示例**: https://github.com/tencentyun/cos-js-sdk-v5/tree/master/demo
- **更新日志**: https://github.com/tencentyun/cos-js-sdk-v5/blob/master/CHANGELOG.md

### 工具推荐

- **COSBrowser**: 图形化管理工具
  - 下载地址: https://cloud.tencent.com/document/product/436/11366
- **COSCLI**: 命令行工具
  - 使用指南: https://cloud.tencent.com/document/product/436/63143
- **在线体验**: COS控制台在线操作
  - 控制台: https://console.cloud.tencent.com/cos

### 安全与权限

- **临时密钥生成**: https://cloud.tencent.com/document/product/436/14048
- **访问管理CAM**: https://console.cloud.tencent.com/cam
- **API密钥管理**: https://console.cloud.tencent.com/cam/capi
- **权限策略配置**: https://cloud.tencent.com/document/product/436/31923

### 性能优化

- **全球加速**: https://cloud.tencent.com/document/product/436/38866
- **CDN加速**: https://cloud.tencent.com/document/product/436/18669
- **批量操作最佳实践**: https://cloud.tencent.com/document/product/436/35214

---

## 📝 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | 2025-11-13 | 初始版本,整合Web端和小程序SDK文档 |

---

## 🔗 相关文档

- [腾讯云COS Java SDK](./tencent_cloud_cos_java_sdk.md)
- [Spring Kafka 使用指南](./spring_kafka.md)
- [微信小程序开发指南](../miniprogram/)

---

**文档维护**: 本文档由Spec-Code项目组维护,如有疑问或建议,请提交Issue。
