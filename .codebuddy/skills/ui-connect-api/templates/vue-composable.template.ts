import { ref, computed, onMounted } from 'vue';
import { UserService } from '../services/user-service';

// 通用API状态
interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// 用户列表Composable
export function useUsers(initialPage = 1, pageSize = 10) {
  const data = ref<User[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  const pagination = ref({
    page: initialPage,
    pageSize,
    total: 0,
  });

  const fetchUsers = async (page?: number) => {
    loading.value = true;
    error.value = null;
    
    try {
      const targetPage = page ?? pagination.value.page;
      const response = await UserService.getUsers(targetPage, pagination.value.pageSize);
      
      if (response.success) {
        data.value = response.data.list;
        pagination.value = {
          ...pagination.value,
          page: targetPage,
          total: response.data.total,
        };
      } else {
        error.value = response.message;
      }
    } catch (err: any) {
      error.value = err.message || '获取用户列表失败';
    } finally {
      loading.value = false;
    }
  };

  const changePage = (newPage: number) => {
    fetchUsers(newPage);
  };

  const refresh = () => {
    fetchUsers();
  };

  onMounted(() => {
    fetchUsers();
  });

  return {
    data: computed(() => data.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    pagination: computed(() => pagination.value),
    changePage,
    refresh,
  };
}

// 单个用户Composable
export function useUser(id: number) {
  const data = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchUser = async () => {
    if (!id) return;
    
    loading.value = true;
    error.value = null;
    
    try {
      const response = await UserService.getUserById(id);
      
      if (response.success) {
        data.value = response.data;
      } else {
        error.value = response.message;
      }
    } catch (err: any) {
      error.value = err.message || '获取用户信息失败';
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    fetchUser();
  });

  return {
    data: computed(() => data.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    refetch: fetchUser,
  };
}

// 用户操作Composable
export function useUserActions() {
  const loading = ref(false);
  const error = ref<string | null>(null);

  const createUser = async (userData: Omit<User, 'id' | 'createdAt'>) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await UserService.createUser(userData);
      
      if (response.success) {
        return response.data;
      } else {
        error.value = response.message;
        throw new Error(response.message);
      }
    } catch (err: any) {
      const errorMessage = err.message || '创建用户失败';
      error.value = errorMessage;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateUser = async (id: number, userData: Partial<User>) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await UserService.updateUser(id, userData);
      
      if (response.success) {
        return response.data;
      } else {
        error.value = response.message;
        throw new Error(response.message);
      }
    } catch (err: any) {
      const errorMessage = err.message || '更新用户失败';
      error.value = errorMessage;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteUser = async (id: number) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await UserService.deleteUser(id);
      
      if (!response.success) {
        error.value = response.message;
        throw new Error(response.message);
      }
    } catch (err: any) {
      const errorMessage = err.message || '删除用户失败';
      error.value = errorMessage;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    createUser,
    updateUser,
    deleteUser,
  };
}