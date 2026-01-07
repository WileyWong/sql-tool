# Vue2 Axios配置规范

## 完整配置示例

```javascript
// src/utils/request.js
import axios from 'axios';
import { Message, MessageBox } from 'element-ui';
import store from '@/store';
import router from '@/router';

// 创建实例
const request = axios.create({
  baseURL: process.env.VUE_APP_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
request.interceptors.request.use(
  config => {
    // Token注入
    const token = store.getters.token || localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 请求追踪ID
    config.headers['X-Request-ID'] = generateRequestId();

    return config;
  },
  error => Promise.reject(error)
);

// 响应拦截器
request.interceptors.response.use(
  response => {
    const { code, message } = response.data;

    // 业务状态码检查
    if (code !== 0) {
      Message.error(message || '请求失败');
      return Promise.reject(new Error(message));
    }

    return response;
  },
  error => {
    handleHttpError(error);
    return Promise.reject(error);
  }
);

// 生成请求ID
function generateRequestId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

// HTTP错误处理
function handleHttpError(error) {
  if (!error.response) {
    Message.error('网络连接失败，请检查网络');
    return;
  }

  const { status, data } = error.response;

  switch (status) {
    case 400:
      Message.error(data?.message || '请求参数错误');
      break;
    case 401:
      handleUnauthorized();
      break;
    case 403:
      Message.error('权限不足');
      break;
    case 404:
      Message.error('资源不存在');
      break;
    case 422:
      // 验证错误由调用方处理
      break;
    case 500:
    case 502:
    case 503:
    case 504:
      Message.error('服务暂时不可用');
      break;
    default:
      Message.error(`请求失败 (${status})`);
  }
}

// 401处理
function handleUnauthorized() {
  MessageBox.confirm('登录已过期，请重新登录', '提示', {
    confirmButtonText: '重新登录',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    store.dispatch('user/logout');
    router.push('/login');
  });
}

export default request;
```

## TypeScript版本

```typescript
// src/utils/request.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { Message, MessageBox } from 'element-ui';
import store from '@/store';
import router from '@/router';

interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

const request: AxiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL || '/api',
  timeout: 10000,
});

request.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = store.getters.token;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { code, message } = response.data;
    if (code !== 0) {
      Message.error(message || '请求失败');
      return Promise.reject(new Error(message));
    }
    return response;
  },
  (error: AxiosError) => {
    // 错误处理...
    return Promise.reject(error);
  }
);

export default request;
```

## 请求方法封装

```javascript
// src/utils/http.js
import request from './request';

/**
 * GET请求
 * @param {string} url 请求地址
 * @param {object} params 查询参数
 * @returns {Promise}
 */
export function get(url, params) {
  return request.get(url, { params }).then(res => res.data.data);
}

/**
 * POST请求
 * @param {string} url 请求地址
 * @param {object} data 请求体
 * @returns {Promise}
 */
export function post(url, data) {
  return request.post(url, data).then(res => res.data.data);
}

/**
 * PUT请求
 * @param {string} url 请求地址
 * @param {object} data 请求体
 * @returns {Promise}
 */
export function put(url, data) {
  return request.put(url, data).then(res => res.data.data);
}

/**
 * DELETE请求
 * @param {string} url 请求地址
 * @returns {Promise}
 */
export function del(url) {
  return request.delete(url).then(res => res.data.data);
}

/**
 * 文件上传
 * @param {string} url 上传地址
 * @param {File} file 文件
 * @param {function} onProgress 进度回调
 * @returns {Promise}
 */
export function upload(url, file, onProgress) {
  const formData = new FormData();
  formData.append('file', file);

  return request.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: event => {
      if (event.total && onProgress) {
        onProgress(Math.round((event.loaded * 100) / event.total));
      }
    },
  }).then(res => res.data.data);
}
```

## 开发代理配置

```javascript
// vue.config.js
module.exports = {
  devServer: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
};
```

## 环境配置

```bash
# .env.development
VUE_APP_API_URL=/api

# .env.production
VUE_APP_API_URL=https://api.example.com
```
