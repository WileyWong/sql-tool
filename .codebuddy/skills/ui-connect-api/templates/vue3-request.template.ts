/**
 * Vue3 Axios 请求封装模板
 * 
 * 使用方法：
 * 1. 复制此文件到项目 src/utils/request.ts
 * 2. 根据项目需求修改配置
 */

import axios, { 
  AxiosInstance, 
  AxiosRequestConfig, 
  AxiosResponse,
  InternalAxiosRequestConfig 
} from 'axios';
import { useRouter } from 'vue-router';

// ============ 配置区域 ============

/** 基础 URL */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/** 请求超时时间（毫秒） */
const TIMEOUT = 30000;

/** Token 存储 key */
const TOKEN_KEY = 'access_token';

/** Refresh Token 存储 key */
const REFRESH_TOKEN_KEY = 'refresh_token';

/** 登录路由路径 */
const LOGIN_PATH = '/login';

// ============ 类型定义 ============

/** API 响应结构 */
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

/** 分页响应结构 */
export interface PageResponse<T = any> {
  code: number;
  message: string;
  data: {
    list: T[];
    total: number;
    page: number;
    pageSize: number;
  };
}

/** 扩展的请求配置 */
interface ExtendedRequestConfig extends AxiosRequestConfig {
  /** 是否跳过错误处理 */
  skipErrorHandler?: boolean;
  /** 是否跳过 Token */
  skipAuth?: boolean;
  /** 重试次数 */
  retryCount?: number;
}

// ============ 工具函数 ============

/**
 * 获取 Token
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * 设置 Token
 */
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * 清除 Token
 */
export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

/**
 * 生成请求 ID
 */
function generateRequestId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

// ============ 创建实例 ============

const service: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ============ 请求拦截器 ============

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const extConfig = config as ExtendedRequestConfig;
    
    // 添加 Token
    if (!extConfig.skipAuth) {
      const token = getToken();
      if (token) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    
    // 添加请求 ID（用于日志追踪）
    config.headers['X-Request-ID'] = generateRequestId();
    
    // 添加时间戳（防止缓存）
    if (config.method?.toLowerCase() === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      };
    }
    
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// ============ 响应拦截器 ============

service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const res = response.data;
    const config = response.config as ExtendedRequestConfig;
    
    // 跳过错误处理
    if (config.skipErrorHandler) {
      return res;
    }
    
    // 业务状态码检查
    if (res.code !== 0 && res.code !== 200) {
      // 显示错误消息
      console.error('Business Error:', res.message);
      
      // 可以在这里集成 UI 库的消息提示
      // ElMessage.error(res.message || '请求失败');
      
      // Token 过期处理
      if (res.code === 401) {
        handleUnauthorized();
      }
      
      return Promise.reject(new Error(res.message || 'Error'));
    }
    
    return res;
  },
  async (error) => {
    const { response, config } = error;
    const extConfig = config as ExtendedRequestConfig;
    
    // 跳过错误处理
    if (extConfig?.skipErrorHandler) {
      return Promise.reject(error);
    }
    
    // HTTP 错误处理
    if (response) {
      const { status, data } = response;
      
      switch (status) {
        case 401:
          handleUnauthorized();
          break;
        case 403:
          console.error('Forbidden:', data?.message || '没有权限访问');
          break;
        case 404:
          console.error('Not Found:', data?.message || '请求的资源不存在');
          break;
        case 500:
          console.error('Server Error:', data?.message || '服务器内部错误');
          break;
        default:
          console.error('HTTP Error:', status, data?.message);
      }
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request Timeout');
    } else {
      console.error('Network Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// ============ 未授权处理 ============

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

/**
 * 处理未授权
 */
function handleUnauthorized(): void {
  clearToken();
  
  // 跳转登录页
  const currentPath = window.location.pathname;
  if (currentPath !== LOGIN_PATH) {
    window.location.href = `${LOGIN_PATH}?redirect=${encodeURIComponent(currentPath)}`;
  }
}

/**
 * 订阅 Token 刷新
 */
function subscribeTokenRefresh(callback: (token: string) => void): void {
  refreshSubscribers.push(callback);
}

/**
 * 通知所有订阅者
 */
function onTokenRefreshed(token: string): void {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
}

// ============ 导出请求方法 ============

/**
 * 通用请求方法
 */
export function request<T = any>(config: ExtendedRequestConfig): Promise<ApiResponse<T>> {
  return service.request(config);
}

/**
 * GET 请求
 */
export function get<T = any>(
  url: string, 
  params?: any, 
  config?: ExtendedRequestConfig
): Promise<ApiResponse<T>> {
  return service.get(url, { params, ...config });
}

/**
 * POST 请求
 */
export function post<T = any>(
  url: string, 
  data?: any, 
  config?: ExtendedRequestConfig
): Promise<ApiResponse<T>> {
  return service.post(url, data, config);
}

/**
 * PUT 请求
 */
export function put<T = any>(
  url: string, 
  data?: any, 
  config?: ExtendedRequestConfig
): Promise<ApiResponse<T>> {
  return service.put(url, data, config);
}

/**
 * PATCH 请求
 */
export function patch<T = any>(
  url: string, 
  data?: any, 
  config?: ExtendedRequestConfig
): Promise<ApiResponse<T>> {
  return service.patch(url, data, config);
}

/**
 * DELETE 请求
 */
export function del<T = any>(
  url: string, 
  params?: any, 
  config?: ExtendedRequestConfig
): Promise<ApiResponse<T>> {
  return service.delete(url, { params, ...config });
}

/**
 * 上传文件
 */
export function upload<T = any>(
  url: string,
  file: File,
  fieldName: string = 'file',
  data?: Record<string, any>,
  onProgress?: (progress: number) => void
): Promise<ApiResponse<T>> {
  const formData = new FormData();
  formData.append(fieldName, file);
  
  if (data) {
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }
  
  return service.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      }
    }
  });
}

/**
 * 下载文件
 */
export function download(
  url: string,
  params?: any,
  filename?: string
): Promise<void> {
  return service.get(url, {
    params,
    responseType: 'blob'
  }).then((response: any) => {
    const blob = new Blob([response]);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename || 'download';
    link.click();
    URL.revokeObjectURL(link.href);
  });
}

// ============ 默认导出 ============

export default service;

export type { ExtendedRequestConfig };
