export interface RequestConfig {
  url?: string;
  baseURL?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: any;
  params?: any;
  headers?: Record<string, string>;
  timeout?: number;
  retry?: number;
  enableCancel?: boolean; // 是否启用重复请求取消
  priority?: number; // 请求优先级
  withCredentials?: boolean; // 跨域请求时是否需要使用凭证
}

export interface ResponseData<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface RequestInstance {
  request: <T = any>(config: RequestConfig) => Promise<T>;
  get: <T = any>(url: string, params?: any, config?: Partial<RequestConfig>) => Promise<T>;
  post: <T = any>(url: string, data?: any, config?: Partial<RequestConfig>) => Promise<T>;
  put: <T = any>(url: string, data?: any, config?: Partial<RequestConfig>) => Promise<T>;
  delete: <T = any>(url: string, params?: any, config?: Partial<RequestConfig>) => Promise<T>;
  cancelRequest: (url: string, method: string) => void;
  cancelAllRequests: () => void;
}

export interface PendingRequest {
  url: string;
  method: string;
  cancel: AbortController;
  timestamp: number;
}