/**
 * 微信小程序请求封装模板
 * 
 * 使用方法：
 * 1. 复制此文件到项目 utils/request.ts
 * 2. 根据项目需求修改配置
 */

// ============ 配置区域 ============

/** 基础 URL */
const BASE_URL = 'https://api.example.com';

/** 请求超时时间（毫秒） */
const TIMEOUT = 30000;

/** Token 存储 key */
const TOKEN_KEY = 'access_token';

/** 登录页路径 */
const LOGIN_PAGE = '/pages/login/index';

// ============ 类型定义 ============

/** 请求配置 */
interface RequestConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: any;
  header?: Record<string, string>;
  timeout?: number;
  /** 是否显示 loading */
  showLoading?: boolean;
  /** loading 提示文字 */
  loadingText?: string;
  /** 是否显示错误提示 */
  showError?: boolean;
}

/** API 响应结构 */
interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

/** 分页响应结构 */
interface PageResponse<T = any> {
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
function getToken(): string {
  return wx.getStorageSync(TOKEN_KEY) || '';
}

/**
 * 设置 Token
 */
function setToken(token: string): void {
  wx.setStorageSync(TOKEN_KEY, token);
}

/**
 * 清除 Token
 */
function clearToken(): void {
  wx.removeStorageSync(TOKEN_KEY);
}

/**
 * 跳转登录页
 */
function redirectToLogin(): void {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const currentPath = currentPage ? `/${currentPage.route}` : '';
  
  // 避免重复跳转
  if (currentPath === LOGIN_PAGE) return;
  
  clearToken();
  wx.redirectTo({
    url: `${LOGIN_PAGE}?redirect=${encodeURIComponent(currentPath)}`
  });
}

// ============ 错误处理 ============

/** 业务错误码映射 */
const BusinessErrorMessages: Record<number, string> = {
  401: '登录已过期，请重新登录',
  403: '没有权限访问',
  404: '请求的资源不存在',
  500: '服务器内部错误'
};

/**
 * 处理业务错误
 */
function handleBusinessError(response: ApiResponse): void {
  const message = BusinessErrorMessages[response.code] || response.message || '操作失败';
  
  wx.showToast({
    title: message,
    icon: 'none',
    duration: 2000
  });
  
  // Token 过期处理
  if (response.code === 401) {
    redirectToLogin();
  }
}

/**
 * 处理 HTTP 错误
 */
function handleHttpError(statusCode: number): void {
  const messages: Record<number, string> = {
    400: '请求参数错误',
    401: '未授权，请重新登录',
    403: '拒绝访问',
    404: '请求地址不存在',
    408: '请求超时',
    500: '服务器内部错误',
    502: '网关错误',
    503: '服务不可用',
    504: '网关超时'
  };
  
  wx.showToast({
    title: messages[statusCode] || `请求失败(${statusCode})`,
    icon: 'none',
    duration: 2000
  });
  
  if (statusCode === 401) {
    redirectToLogin();
  }
}

/**
 * 处理网络错误
 */
function handleNetworkError(err: WechatMiniprogram.GeneralCallbackResult): void {
  console.error('Network Error:', err);
  
  wx.showToast({
    title: '网络连接失败，请检查网络设置',
    icon: 'none',
    duration: 2000
  });
}

// ============ 核心请求函数 ============

/**
 * 发起请求
 */
export function request<T = any>(config: RequestConfig): Promise<ApiResponse<T>> {
  const {
    url,
    method,
    data,
    header = {},
    timeout = TIMEOUT,
    showLoading = false,
    loadingText = '加载中...',
    showError = true
  } = config;
  
  // 显示 loading
  if (showLoading) {
    wx.showLoading({
      title: loadingText,
      mask: true
    });
  }
  
  return new Promise((resolve, reject) => {
    const token = getToken();
    
    wx.request({
      url: url.startsWith('http') ? url : `${BASE_URL}${url}`,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...header
      },
      timeout,
      success: (res) => {
        // 隐藏 loading
        if (showLoading) {
          wx.hideLoading();
        }
        
        const response = res.data as ApiResponse<T>;
        
        // HTTP 状态码检查
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // 业务状态码检查
          if (response.code === 0 || response.code === 200) {
            resolve(response);
          } else {
            // 业务错误
            if (showError) {
              handleBusinessError(response);
            }
            reject(response);
          }
        } else {
          // HTTP 错误
          if (showError) {
            handleHttpError(res.statusCode);
          }
          reject(new Error(`HTTP Error: ${res.statusCode}`));
        }
      },
      fail: (err) => {
        // 隐藏 loading
        if (showLoading) {
          wx.hideLoading();
        }
        
        // 网络错误
        if (showError) {
          handleNetworkError(err);
        }
        reject(err);
      }
    });
  });
}

// ============ 便捷方法 ============

/**
 * GET 请求
 */
export function get<T = any>(url: string, params?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
  return request<T>({
    url,
    method: 'GET',
    data: params,
    ...config
  });
}

/**
 * POST 请求
 */
export function post<T = any>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
  return request<T>({
    url,
    method: 'POST',
    data,
    ...config
  });
}

/**
 * PUT 请求
 */
export function put<T = any>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
  return request<T>({
    url,
    method: 'PUT',
    data,
    ...config
  });
}

/**
 * DELETE 请求
 */
export function del<T = any>(url: string, params?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
  return request<T>({
    url,
    method: 'DELETE',
    data: params,
    ...config
  });
}

// ============ 文件上传 ============

/** 上传配置 */
interface UploadConfig {
  url: string;
  filePath: string;
  name?: string;
  formData?: Record<string, any>;
  header?: Record<string, string>;
  showLoading?: boolean;
  loadingText?: string;
}

/**
 * 上传文件
 */
export function uploadFile<T = any>(config: UploadConfig): Promise<ApiResponse<T>> {
  const {
    url,
    filePath,
    name = 'file',
    formData = {},
    header = {},
    showLoading = true,
    loadingText = '上传中...'
  } = config;
  
  if (showLoading) {
    wx.showLoading({
      title: loadingText,
      mask: true
    });
  }
  
  return new Promise((resolve, reject) => {
    const token = getToken();
    
    wx.uploadFile({
      url: url.startsWith('http') ? url : `${BASE_URL}${url}`,
      filePath,
      name,
      formData,
      header: {
        'Authorization': token ? `Bearer ${token}` : '',
        ...header
      },
      success: (res) => {
        if (showLoading) {
          wx.hideLoading();
        }
        
        if (res.statusCode === 200) {
          try {
            const data = JSON.parse(res.data) as ApiResponse<T>;
            if (data.code === 0 || data.code === 200) {
              resolve(data);
            } else {
              handleBusinessError(data);
              reject(data);
            }
          } catch (e) {
            reject(new Error('解析响应失败'));
          }
        } else {
          handleHttpError(res.statusCode);
          reject(new Error(`Upload failed: ${res.statusCode}`));
        }
      },
      fail: (err) => {
        if (showLoading) {
          wx.hideLoading();
        }
        handleNetworkError(err);
        reject(err);
      }
    });
  });
}

// ============ 导出 ============

export {
  getToken,
  setToken,
  clearToken,
  redirectToLogin
};

export type {
  RequestConfig,
  ApiResponse,
  PageResponse,
  UploadConfig
};
