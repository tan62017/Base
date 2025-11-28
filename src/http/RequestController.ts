import type { RequestConfig, PendingRequest } from '../types/request';

export class RequestController {
  private static instance: RequestController;
  private pendingRequests: Map<string, PendingRequest> = new Map();
  private readonly REQUEST_TIMEOUT = 30000; // 30秒自动清理

  private constructor() {
    this.startCleanupTimer();
  }

  public static getInstance(): RequestController {
    if (!RequestController.instance) {
      RequestController.instance = new RequestController();
    }
    return RequestController.instance;
  }

  /**
   * 生成请求唯一标识
   */
  private generateRequestKey(config: RequestConfig): string {
    const { url, method = 'GET', data, params } = config;
    return `${method}-${url}-${JSON.stringify(params || {})}-${JSON.stringify(data || {})}`;
  }

  /**
   * 添加 pending 请求
   */
  public addPendingRequest(config: RequestConfig): AbortController {
    const key = this.generateRequestKey(config);

    // 如果存在相同请求，取消之前的
    if (this.pendingRequests.has(key)) {
      this.removePendingRequest(key, '重复请求，取消前一个');
    }

    const abortController = new AbortController();

    this.pendingRequests.set(key, {
      url: config.url as string,
      method: config.method || 'GET',
      cancel: abortController,
      timestamp: Date.now()
    });

    return abortController;
  }

  /**
   * 移除 pending 请求
   */
  public removePendingRequest(key: string, message?: string): void {
    if (this.pendingRequests.has(key)) {
      const request = this.pendingRequests.get(key);
      if (message) {
        request?.cancel.abort(message);
      }
      this.pendingRequests.delete(key);
    }
  }

  /**
   * 根据 URL 取消请求
   */
  public cancelRequestByUrl(url: string, method: string): void {
    for (const [key, request] of this.pendingRequests.entries()) {
      if (request.url === url && request.method.toUpperCase() === method.toUpperCase()) {
        this.removePendingRequest(key, `手动取消请求: ${url}`);
      }
    }
  }

  /**
   * 取消所有请求
   */
  public cancelAllRequests(): void {
    for (const [key] of this.pendingRequests.entries()) {
      this.removePendingRequest(key, '取消所有请求');
    }
  }

  /**
   * 获取请求标识
   */
  public getRequestKey(config: RequestConfig): string {
    return this.generateRequestKey(config);
  }

  /**
   * 启动清理定时器
   */
  private startCleanupTimer(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [key, request] of this.pendingRequests.entries()) {
        if (now - request.timestamp > this.REQUEST_TIMEOUT) {
          this.removePendingRequest(key, '请求超时自动清理');
        }
      }
    }, 60000); // 每分钟清理一次
  }

  /**
   * 获取 pending 请求数量
   */
  public getPendingCount(): number {
    return this.pendingRequests.size;
  }
}