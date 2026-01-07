# 小程序请求配置规范

## 基础封装

```typescript
// utils/request.ts

// 配置
const BASE_URL = 'https://api.example.com';
const TIMEOUT = 10000;

// 请求配置接口
interface RequestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  header?: Record<string, string>;
  timeout?: number;
  showLoading?: boolean;
  showError?: boolean;
}

// API响应接口
interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// 请求封装
export function request<T = any>(config: RequestConfig): Promise<T> {
  const {
    url,
    method = 'GET',
    data,
    header = {},
    timeout = TIMEOUT,
    showLoading = true,
    showError = true,
  } = config;

  // 显示加载提示
  if (showLoading) {
    wx.showLoading({ title: '加载中...', mask: true });
  }

  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      timeout,
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${wx.getStorageSync('token') || ''}`,
        ...header,
      },
      success: (res) => {
        if (showLoading) {
          wx.hideLoading();
        }

        const { statusCode, data: responseData } = res;
        const apiResponse = responseData as ApiResponse<T>;

        // HTTP状态码检查
        if (statusCode !== 200) {
          handleHttpError(statusCode, showError);
          reject(new Error(`HTTP Error: ${statusCode}`));
          return;
        }

        // 业务状态码检查
        if (apiResponse.code !== 0) {
          if (showError) {
            wx.showToast({ title: apiResponse.message, icon: 'none' });
          }
          reject(new Error(apiResponse.message));
          return;
        }

        resolve(apiResponse.data);
      },
      fail: (err) => {
        if (showLoading) {
          wx.hideLoading();
        }

        if (showError) {
          wx.showToast({ title: '网络请求失败', icon: 'none' });
        }

        reject(err);
      },
    });
  });
}

// HTTP错误处理
function handleHttpError(statusCode: number, showError: boolean) {
  if (!showError) return;

  const messages: Record<number, string> = {
    400: '请求参数错误',
    401: '请重新登录',
    403: '权限不足',
    404: '资源不存在',
    500: '服务器错误',
    502: '网关错误',
    503: '服务不可用',
    504: '网关超时',
  };

  const message = messages[statusCode] || `请求失败 (${statusCode})`;
  wx.showToast({ title: message, icon: 'none' });

  // 401跳转登录
  if (statusCode === 401) {
    wx.removeStorageSync('token');
    wx.navigateTo({ url: '/pages/login/login' });
  }
}

// 快捷方法
export const http = {
  get<T>(url: string, data?: any, options?: Partial<RequestConfig>): Promise<T> {
    return request<T>({ url, method: 'GET', data, ...options });
  },

  post<T>(url: string, data?: any, options?: Partial<RequestConfig>): Promise<T> {
    return request<T>({ url, method: 'POST', data, ...options });
  },

  put<T>(url: string, data?: any, options?: Partial<RequestConfig>): Promise<T> {
    return request<T>({ url, method: 'PUT', data, ...options });
  },

  delete<T>(url: string, options?: Partial<RequestConfig>): Promise<T> {
    return request<T>({ url, method: 'DELETE', ...options });
  },
};
```

## JavaScript版本

```javascript
// utils/request.js

const BASE_URL = 'https://api.example.com';
const TIMEOUT = 10000;

/**
 * 请求封装
 * @param {object} config - 请求配置
 * @returns {Promise}
 */
function request(config) {
  const {
    url,
    method = 'GET',
    data,
    header = {},
    timeout = TIMEOUT,
    showLoading = true,
    showError = true,
  } = config;

  if (showLoading) {
    wx.showLoading({ title: '加载中...', mask: true });
  }

  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      timeout,
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${wx.getStorageSync('token') || ''}`,
        ...header,
      },
      success(res) {
        if (showLoading) {
          wx.hideLoading();
        }

        if (res.statusCode !== 200) {
          handleHttpError(res.statusCode, showError);
          reject(new Error(`HTTP Error: ${res.statusCode}`));
          return;
        }

        if (res.data.code !== 0) {
          if (showError) {
            wx.showToast({ title: res.data.message, icon: 'none' });
          }
          reject(new Error(res.data.message));
          return;
        }

        resolve(res.data.data);
      },
      fail(err) {
        if (showLoading) {
          wx.hideLoading();
        }
        if (showError) {
          wx.showToast({ title: '网络请求失败', icon: 'none' });
        }
        reject(err);
      },
    });
  });
}

function handleHttpError(statusCode, showError) {
  if (!showError) return;

  const messages = {
    400: '请求参数错误',
    401: '请重新登录',
    403: '权限不足',
    404: '资源不存在',
    500: '服务器错误',
  };

  wx.showToast({
    title: messages[statusCode] || `请求失败 (${statusCode})`,
    icon: 'none',
  });

  if (statusCode === 401) {
    wx.removeStorageSync('token');
    wx.navigateTo({ url: '/pages/login/login' });
  }
}

module.exports = {
  request,
  get: (url, data, options) => request({ url, method: 'GET', data, ...options }),
  post: (url, data, options) => request({ url, method: 'POST', data, ...options }),
  put: (url, data, options) => request({ url, method: 'PUT', data, ...options }),
  del: (url, options) => request({ url, method: 'DELETE', ...options }),
};
```

## 文件上传

```typescript
// utils/upload.ts

interface UploadConfig {
  url: string;
  filePath: string;
  name?: string;
  formData?: Record<string, any>;
  showLoading?: boolean;
}

export function uploadFile<T = any>(config: UploadConfig): Promise<T> {
  const {
    url,
    filePath,
    name = 'file',
    formData = {},
    showLoading = true,
  } = config;

  if (showLoading) {
    wx.showLoading({ title: '上传中...', mask: true });
  }

  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: `${BASE_URL}${url}`,
      filePath,
      name,
      formData,
      header: {
        'Authorization': `Bearer ${wx.getStorageSync('token') || ''}`,
      },
      success: (res) => {
        if (showLoading) {
          wx.hideLoading();
        }

        if (res.statusCode !== 200) {
          wx.showToast({ title: '上传失败', icon: 'none' });
          reject(new Error(`Upload failed: ${res.statusCode}`));
          return;
        }

        try {
          const data = JSON.parse(res.data);
          if (data.code !== 0) {
            wx.showToast({ title: data.message, icon: 'none' });
            reject(new Error(data.message));
            return;
          }
          resolve(data.data);
        } catch (e) {
          reject(new Error('Parse response failed'));
        }
      },
      fail: (err) => {
        if (showLoading) {
          wx.hideLoading();
        }
        wx.showToast({ title: '上传失败', icon: 'none' });
        reject(err);
      },
    });
  });
}
```

## 环境配置

```typescript
// config/env.ts

type EnvType = 'development' | 'staging' | 'production';

interface EnvConfig {
  baseUrl: string;
  timeout: number;
}

const envConfigs: Record<EnvType, EnvConfig> = {
  development: {
    baseUrl: 'https://dev-api.example.com',
    timeout: 30000,
  },
  staging: {
    baseUrl: 'https://staging-api.example.com',
    timeout: 15000,
  },
  production: {
    baseUrl: 'https://api.example.com',
    timeout: 10000,
  },
};

// 通过小程序账号信息判断环境
const accountInfo = wx.getAccountInfoSync();
const envVersion = accountInfo.miniProgram.envVersion as EnvType;

export const config = envConfigs[envVersion] || envConfigs.production;
```

## 请求拦截器模式

```typescript
// utils/interceptor.ts

type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
type ResponseInterceptor = (response: any) => any | Promise<any>;

class RequestManager {
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  useRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor);
  }

  useResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor);
  }

  async request<T>(config: RequestConfig): Promise<T> {
    // 执行请求拦截器
    let finalConfig = config;
    for (const interceptor of this.requestInterceptors) {
      finalConfig = await interceptor(finalConfig);
    }

    // 发送请求
    let response = await this.doRequest(finalConfig);

    // 执行响应拦截器
    for (const interceptor of this.responseInterceptors) {
      response = await interceptor(response);
    }

    return response;
  }

  private doRequest(config: RequestConfig): Promise<any> {
    // 实际请求逻辑
    return request(config);
  }
}

export const requestManager = new RequestManager();

// 添加Token拦截器
requestManager.useRequestInterceptor((config) => {
  const token = wx.getStorageSync('token');
  if (token) {
    config.header = {
      ...config.header,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

// 添加日志拦截器
requestManager.useResponseInterceptor((response) => {
  console.log('[Response]', response);
  return response;
});
```
