import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import type { RequestConfig, RequestInstance, ResponseData } from '../types/request';
import { StatusCodeHandler } from './StatusHandler';
import { RequestQueueManager } from './RequestQueue';
import { RequestController } from './RequestController';

export class RequestClient implements RequestInstance {
  private instance: AxiosInstance;
  private statusHandler: StatusCodeHandler;
  private queueManager: RequestQueueManager;
  private requestController: RequestController;

  constructor(config: RequestConfig) {
    this.instance = axios.create(config);

    this.statusHandler = StatusCodeHandler.getInstance();
    this.queueManager = RequestQueueManager.getInstance(); // 默认最大并发20个
    this.requestController = RequestController.getInstance();

    this.setupInterceptors();
    this.setupQueueManager();
  }

  /**
   * 设置拦截器
   */
  private setupInterceptors(): void {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: any) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // 处理 HTTP 状态码
        this.statusHandler.handleHttpStatus(response);
        return response;
      },
      (error) => {
        // 如果是取消的请求，不处理
        if (axios.isCancel(error)) {
          return Promise.reject(error);
        }
        // 处理网络错误
        return Promise.reject(this.statusHandler.handleNetworkError(error));
      }
    );
  }

  /**
   * 设置队列管理器
   */
  private setupQueueManager(): void {
    this.queueManager.setRequestMethod(this.makeRequest.bind(this));
  }

  /**
   * 实际发起请求
   */
  private async makeRequest(config: RequestConfig): Promise<any> {
    const axiosConfig: AxiosRequestConfig = {
      url: config.url,
      method: config.method,
      data: config.data,
      params: config.params,
      headers: config.headers,
      // timeout: config.timeout
    };

    // 处理重复请求取消
    if (config.enableCancel) {
      const abortController = this.requestController.addPendingRequest(config);
      axiosConfig.signal = abortController.signal;
    }

    try {
      const response = await this.instance.request(axiosConfig);

      // 移除 pending 请求
      if (config.enableCancel) {
        const key = this.requestController.getRequestKey(config);
        this.requestController.removePendingRequest(key);
      }

      // 处理业务状态码
      return this.statusHandler.handleBusinessCode(response.data);
    } catch (error) {
      // 移除 pending 请求（如果是取消的请求，这里已经自动移除了）
      if (config.enableCancel && !axios.isCancel(error)) {
        const key = this.requestController.getRequestKey(config);
        this.requestController.removePendingRequest(key);
      }
      throw error;
    }
  }

  /**
   * 发起请求
   */
  public async request<T = any>(config: RequestConfig): Promise<T> {
    // 如果启用了队列，使用队列管理
    if (this.queueManager) {
      return this.queueManager.addToQueue(config);
    }

    return this.makeRequest(config);
  }

  /**
   * GET 请求
   */
  public async get<T = any>(url: string, params?: any, config?: Partial<RequestConfig>): Promise<T> {
    return this.request<T>({
      url,
      method: 'GET',
      params,
      ...config
    });
  }

  /**
   * POST 请求
   */
  public async post<T = any>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<T> {
    return this.request<T>({
      url,
      method: 'POST',
      data,
      ...config
    });
  }

  /**
   * PUT 请求
   */
  public async put<T = any>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<T> {
    return this.request<T>({
      url,
      method: 'PUT',
      data,
      ...config
    });
  }

  /**
   * DELETE 请求
   */
  public async delete<T = any>(url: string, params?: any, config?: Partial<RequestConfig>): Promise<T> {
    return this.request<T>({
      url,
      method: 'DELETE',
      params,
      ...config
    });
  }

  /**
   * 取消指定请求
   */
  public cancelRequest(url: string, method: string): void {
    this.queueManager.deleteQueueItem(url, method);
    this.requestController.cancelRequestByUrl(url, method);
  }

  /**
   * 取消所有请求
   */
  public cancelAllRequests(): void {
    this.requestController.cancelAllRequests();
    this.queueManager.clearQueue();
  }

  /**
   * 设置最大并发数
   */
  public setMaxConcurrent(max: number): void {
    this.queueManager.setMaxConcurrent(max);
  }

  /**
   * 获取请求状态
   */
  public getRequestStatus(): { pending: number; queue: number; active: number } {
    const queueStatus = this.queueManager.getQueueStatus();
    return {
      pending: this.requestController.getPendingCount(),
      queue: queueStatus.queueLength,
      active: queueStatus.activeRequests
    };
  }
}

// 创建默认配置的请求实例
const defaultConfig: RequestConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json'
  }
}
// 创建默认实例
export const request = new RequestClient(defaultConfig);

export default request;