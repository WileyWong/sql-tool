/**
 * Vue2 Axios 请求封装模板
 * 
 * 使用方法：
 * 1. 复制此文件到项目 src/utils/request.ts
 * 2. 根据项目需求修改配置
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Message, MessageBox } from 'element-ui';
import store from '@/store';
import router from '@/router';

// ============ 配置区域 ============

/** 基础 URL */
const BASE_URL = process.env.VUE_APP_BASE_API || '/api';

/** 请求超时时间（毫秒） */
const TIMEOUT = 30000;

/** Token 存储 key */
const TOKEN_KEY = 'access_token';

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

// ============ 工具函数 ============

/**
 * 获取 Token
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) || store?.getters?.token;
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
  (config: AxiosRequestConfig) => {
    // 添加 Token
    const token = getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // 添加请求 ID
    config.headers = config.headers || {};
    config.headers['X-Request-ID'] = generateRequestId();
    
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// ============ 响应拦截器 ============

// 是否正在刷新 Token
let isRefreshing = false;
// 重试队列
let retryRequests: Function[] = [];

service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const res = response.data;
    
    // 业务状态码检查
    if (res.code !== 0 && res.code !== 200) {
      Message({
        message: res.message || '请求失败',
        type: 'error',
        duration: 5000
      });
      
      // Token 过期处理
      if (res.code === 401) {
        handleUnauthorized();
      }
      
      return Promise.reject(new Error(res.message || 'Error'));
    }
    
    return res;
  },
  (error) => {
    const { response } = error;
    
    if (response) {
      const { status, data } = response;
      
      switch (status) {
        case 401:
          handleUnauthorized();
          break;
        case 403:
          Message({
            message: data?.message || '没有权限访问',
            type: 'error',
            duration: 5000
          });
          break;
        case 404:
          Message({
            message: data?.message || '请求的资源不存在',
            type: 'error',
            duration: 5000
          });
          break;
        case 500:
          Message({
            message: data?.message || '服务器内部错误',
            type: 'error',
            duration: 5000
          });
          break;
        default:
          Message({
            message: data?.message || `请求失败(${status})`,
            type: 'error',
            duration: 5000
          });
      }
    } else if (error.code === 'ECONNABORTED') {
      Message({
        message: '请求超时，请稍后重试',
        type: 'error',
        duration: 5000
      });
    } else {
      Message({
        message: '网络错误，请检查网络连接',
        type: 'error',
        duration: 5000
      });
    }
    
    return Promise.reject(error);
  }
);

// ============ 未授权处理 ============

/**
 * 处理未授权
 */
function handleUnauthorized(): void {
  if (isRefreshing) return;
  
  isRefreshing = true;
  
  MessageBox.confirm('登录已过期，请重新登录', '提示', {
    confirmButtonText: '重新登录',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    clearToken();
    
    // 调用 Vuex logout action
    if (store.dispatch) {
      store.dispatch('user/logout');
    }
    
    // 跳转登录页
    const currentPath = router.currentRoute.fullPath;
    router.push({
      path: LOGIN_PATH,
      query: { redirect: currentPath }
    });
  }).finally(() => {
    isRefreshing = false;
  });
}

// ============ 导出请求方法 ============

/**
 * 通用请求方法
 */
export function request<T = any>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
  return service.request(config);
}

/**
 * GET 请求
 */
export function get<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  return service.get(url, { params, ...config });
}

/**
 * POST 请求
 */
export function post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  return service.post(url, data, config);
}

/**
 * PUT 请求
 */
export function put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  return service.put(url, data, config);
}

/**
 * DELETE 请求
 */
export function del<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
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

// ============ 默认导出 ============

export default service;
