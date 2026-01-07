# Vue3 Composables规范

## toValue 工具函数

> **⭐ Vue 3.3+ 推荐**: 使用 `toValue()` 处理可能是 ref、getter 或普通值的参数

```typescript
import { toValue, MaybeRefOrGetter } from 'vue';

// toValue 可以处理三种类型的输入：
// 1. 普通值 → 直接返回
// 2. ref → 返回 .value
// 3. getter 函数 → 调用并返回结果

// 示例
const count = ref(1);
const getter = () => 2;
const plain = 3;

toValue(count);   // 1
toValue(getter);  // 2
toValue(plain);   // 3
```

### 在 Composable 中使用 toValue

```typescript
// src/composables/useFetch.ts
import { ref, watch, toValue, MaybeRefOrGetter } from 'vue';

export function useFetch<T>(url: MaybeRefOrGetter<string>) {
  const data = ref<T | null>(null);
  const error = ref<Error | null>(null);
  const loading = ref(false);

  async function fetchData() {
    loading.value = true;
    error.value = null;

    try {
      // ⭐ 使用 toValue 解包 url，支持 ref/getter/plain value
      const resolvedUrl = toValue(url);
      const response = await fetch(resolvedUrl);
      if (!response.ok) throw new Error(response.statusText);
      data.value = await response.json();
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err));
    } finally {
      loading.value = false;
    }
  }

  // 监听 url 变化，支持响应式 URL
  watch(() => toValue(url), fetchData, { immediate: true });

  return { data, error, loading, refetch: fetchData };
}

// 使用示例
const userId = ref(1);

// 方式1：传入 ref
const { data } = useFetch(computed(() => `/api/users/${userId.value}`));

// 方式2：传入 getter
const { data } = useFetch(() => `/api/users/${userId.value}`);

// 方式3：传入普通字符串
const { data } = useFetch('/api/users/1');
```

## 通用请求Composable

```typescript
// src/composables/useRequest.ts
import { ref, Ref, UnwrapRef } from 'vue';

interface UseRequestOptions<T> {
  immediate?: boolean;
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseRequestReturn<T, P extends any[]> {
  data: Ref<T | null>;
  loading: Ref<boolean>;
  error: Ref<Error | null>;
  execute: (...args: P) => Promise<T | null>;
  reset: () => void;
}

export function useRequest<T, P extends any[] = []>(
  requestFn: (...args: P) => Promise<T>,
  options: UseRequestOptions<T> = {}
): UseRequestReturn<T, P> {
  const { immediate = false, initialData, onSuccess, onError } = options;

  const data = ref<T | null>(initialData ?? null) as Ref<T | null>;
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const execute = async (...args: P): Promise<T | null> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await requestFn(...args);
      data.value = result as UnwrapRef<T>;
      onSuccess?.(result);
      return result;
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));
      error.value = err;
      onError?.(err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const reset = () => {
    data.value = initialData ?? null;
    loading.value = false;
    error.value = null;
  };

  if (immediate) {
    execute(...([] as unknown as P));
  }

  return { data, loading, error, execute, reset };
}
```

## 列表查询Composable

```typescript
// src/composables/useList.ts
import { ref, reactive, watch, Ref, onMounted } from 'vue';

interface Pagination {
  page: number;
  size: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface PageResponse<T> {
  items: T[];
  pagination: Pagination;
}

interface UseListOptions<P> {
  immediate?: boolean;
  defaultParams?: Partial<P>;
  defaultPageSize?: number;
}

export function useList<T, P extends Record<string, any> = Record<string, any>>(
  fetchFn: (params: P & { page: number; size: number }) => Promise<PageResponse<T>>,
  options: UseListOptions<P> = {}
) {
  const { immediate = true, defaultParams = {}, defaultPageSize = 20 } = options;

  const items = ref<T[]>([]) as Ref<T[]>;
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const pagination = reactive<Pagination>({
    page: 1,
    size: defaultPageSize,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  const params = reactive<P>({ ...defaultParams } as P);

  const fetch = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetchFn({
        ...params,
        page: pagination.page,
        size: pagination.size,
      } as P & { page: number; size: number });

      items.value = response.items;
      Object.assign(pagination, response.pagination);
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e));
    } finally {
      loading.value = false;
    }
  };

  const changePage = (page: number) => {
    pagination.page = page;
  };

  const changePageSize = (size: number) => {
    pagination.size = size;
    pagination.page = 1;
  };

  const refresh = () => {
    pagination.page = 1;
    fetch();
  };

  const reset = () => {
    Object.assign(params, defaultParams);
    pagination.page = 1;
    fetch();
  };

  // 监听分页变化
  watch(
    () => [pagination.page, pagination.size],
    () => fetch(),
    { flush: 'post' }
  );

  if (immediate) {
    onMounted(fetch);
  }

  return {
    items,
    loading,
    error,
    pagination,
    params,
    fetch,
    refresh,
    reset,
    changePage,
    changePageSize,
  };
}
```

## 详情查询Composable

```typescript
// src/composables/useDetail.ts
import { ref, Ref, watch } from 'vue';

interface UseDetailOptions<T> {
  immediate?: boolean;
  initialData?: T;
}

export function useDetail<T, ID = number>(
  fetchFn: (id: ID) => Promise<T>,
  options: UseDetailOptions<T> = {}
) {
  const { immediate = false, initialData } = options;

  const data = ref<T | null>(initialData ?? null) as Ref<T | null>;
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const currentId = ref<ID | null>(null) as Ref<ID | null>;

  const fetch = async (id: ID) => {
    currentId.value = id;
    loading.value = true;
    error.value = null;

    try {
      data.value = await fetchFn(id) as any;
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e));
    } finally {
      loading.value = false;
    }
  };

  const refresh = () => {
    if (currentId.value !== null) {
      fetch(currentId.value);
    }
  };

  const reset = () => {
    data.value = initialData ?? null;
    currentId.value = null;
    error.value = null;
  };

  return {
    data,
    loading,
    error,
    currentId,
    fetch,
    refresh,
    reset,
  };
}
```

## CRUD操作Composable

```typescript
// src/composables/useCrud.ts
import { ref } from 'vue';

interface CrudService<T, CreateDTO, UpdateDTO, ID = number> {
  getList: (params: any) => Promise<{ items: T[]; pagination: any }>;
  getById: (id: ID) => Promise<T>;
  create: (data: CreateDTO) => Promise<T>;
  update: (id: ID, data: UpdateDTO) => Promise<T>;
  delete: (id: ID) => Promise<void>;
}

export function useCrud<T, CreateDTO, UpdateDTO, ID = number>(
  service: CrudService<T, CreateDTO, UpdateDTO, ID>
) {
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const withLoading = async <R>(fn: () => Promise<R>): Promise<R | null> => {
    loading.value = true;
    error.value = null;
    try {
      return await fn();
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e));
      return null;
    } finally {
      loading.value = false;
    }
  };

  const create = (data: CreateDTO) => withLoading(() => service.create(data));
  const update = (id: ID, data: UpdateDTO) => withLoading(() => service.update(id, data));
  const remove = (id: ID) => withLoading(() => service.delete(id));
  const getById = (id: ID) => withLoading(() => service.getById(id));

  return {
    loading,
    error,
    create,
    update,
    remove,
    getById,
  };
}
```

## 搜索防抖Composable

```typescript
// src/composables/useSearch.ts
import { ref, watch, Ref } from 'vue';

interface UseSearchOptions {
  delay?: number;
  immediate?: boolean;
}

export function useSearch<T>(
  searchFn: (keyword: string) => Promise<T[]>,
  options: UseSearchOptions = {}
) {
  const { delay = 300, immediate = false } = options;

  const keyword = ref('');
  const results = ref<T[]>([]) as Ref<T[]>;
  const loading = ref(false);
  const error = ref<Error | null>(null);

  let timer: ReturnType<typeof setTimeout> | null = null;

  const search = async (value: string) => {
    if (timer) clearTimeout(timer);

    if (!value.trim()) {
      results.value = [];
      return;
    }

    timer = setTimeout(async () => {
      loading.value = true;
      error.value = null;

      try {
        results.value = await searchFn(value);
      } catch (e) {
        error.value = e instanceof Error ? e : new Error(String(e));
      } finally {
        loading.value = false;
      }
    }, delay);
  };

  watch(keyword, search);

  const clear = () => {
    keyword.value = '';
    results.value = [];
  };

  return {
    keyword,
    results,
    loading,
    error,
    search,
    clear,
  };
}
```

## 表单提交Composable

```typescript
// src/composables/useForm.ts
import { reactive, ref, Ref } from 'vue';

interface UseFormOptions<T> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  validate?: (values: T) => Record<string, string> | null;
}

export function useForm<T extends Record<string, any>>(options: UseFormOptions<T>) {
  const { initialValues, onSubmit, onSuccess, onError, validate } = options;

  const values = reactive<T>({ ...initialValues });
  const errors = ref<Record<string, string>>({});
  const submitting = ref(false);
  const dirty = ref(false);

  const setFieldValue = <K extends keyof T>(field: K, value: T[K]) => {
    values[field] = value;
    dirty.value = true;
    // 清除该字段的错误
    if (errors.value[field as string]) {
      delete errors.value[field as string];
    }
  };

  const setFieldError = (field: string, message: string) => {
    errors.value[field] = message;
  };

  const clearErrors = () => {
    errors.value = {};
  };

  const reset = () => {
    Object.assign(values, initialValues);
    errors.value = {};
    dirty.value = false;
  };

  const handleSubmit = async () => {
    // 验证
    if (validate) {
      const validationErrors = validate(values);
      if (validationErrors) {
        errors.value = validationErrors;
        return;
      }
    }

    submitting.value = true;
    clearErrors();

    try {
      await onSubmit(values);
      onSuccess?.();
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e));
      onError?.(error);
    } finally {
      submitting.value = false;
    }
  };

  return {
    values,
    errors,
    submitting,
    dirty,
    setFieldValue,
    setFieldError,
    clearErrors,
    reset,
    handleSubmit,
  };
}
```

## 使用示例

```typescript
// src/composables/useUsers.ts
import { userService } from '@/services/userService';
import { useList } from './useList';
import { useCrud } from './useCrud';
import type { User, UserQueryParams, CreateUserRequest, UpdateUserRequest } from '@/types/user';

export function useUserList(defaultParams?: Partial<UserQueryParams>) {
  return useList<User, UserQueryParams>(
    (params) => userService.getList(params),
    { defaultParams }
  );
}

export function useUserCrud() {
  return useCrud<User, CreateUserRequest, UpdateUserRequest>(userService);
}
```

```vue
<!-- 组件中使用 -->
<script setup lang="ts">
import { useUserList, useUserCrud } from '@/composables/useUsers';

const { items: users, loading, pagination, params, refresh, changePage } = useUserList();
const { create, remove, loading: crudLoading } = useUserCrud();

const handleCreate = async (data: CreateUserRequest) => {
  const user = await create(data);
  if (user) {
    refresh();
  }
};

const handleDelete = async (id: number) => {
  await remove(id);
  refresh();
};
</script>
```
