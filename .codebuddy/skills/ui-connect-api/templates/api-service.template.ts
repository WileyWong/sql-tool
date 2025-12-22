import api from '../config/axios';

// 通用API响应类型
interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  success: boolean;
}

// 分页响应类型
interface PaginatedResponse<T = any> {
  code: number;
  message: string;
  data: {
    list: T[];
    total: number;
    page: number;
    pageSize: number;
  };
  success: boolean;
}

// 示例：用户相关API
interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export class UserService {
  // 获取用户列表
  static async getUsers(page = 1, pageSize = 10): Promise<PaginatedResponse<User>> {
    const response = await api.get<PaginatedResponse<User>>('/users', {
      params: { page, pageSize }
    });
    return response.data;
  }
  
  // 获取单个用户
  static async getUserById(id: number): Promise<ApiResponse<User>> {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  }
  
  // 创建用户
  static async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<ApiResponse<User>> {
    const response = await api.post<ApiResponse<User>>('/users', userData);
    return response.data;
  }
  
  // 更新用户
  static async updateUser(id: number, userData: Partial<User>): Promise<ApiResponse<User>> {
    const response = await api.put<ApiResponse<User>>(`/users/${id}`, userData);
    return response.data;
  }
  
  // 删除用户
  static async deleteUser(id: number): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(`/users/${id}`);
    return response.data;
  }
}

// 示例：文件上传API
export class FileService {
  // 上传文件
  static async uploadFile(file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post<ApiResponse<{ url: string }>>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
    
    return response.data;
  }
}