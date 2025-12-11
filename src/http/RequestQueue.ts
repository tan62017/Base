import type { RequestConfig } from '../types/request';

interface QueueItem {
  config: RequestConfig;
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
  timestamp: number;
  priority: number;
}

export class RequestQueueManager {
  private static instance: RequestQueueManager;
  private queue: QueueItem[] = [];
  private activeRequests = 0;
  private maxConcurrent: number;
  private processing = false;

  private constructor(maxConcurrent: number = 20) {
    this.maxConcurrent = maxConcurrent;
  }

  public static getInstance(maxConcurrent?: number): RequestQueueManager {
    if (!RequestQueueManager.instance) {
      RequestQueueManager.instance = new RequestQueueManager(maxConcurrent);
    }
    return RequestQueueManager.instance;
  }

  /**
   * 添加请求到队列
   */
  public addToQueue(config: RequestConfig): Promise<any> {
    return new Promise((resolve, reject) => {
      const queueItem: QueueItem = {
        config,
        resolve,
        reject,
        timestamp: Date.now(),
        priority: config.priority || 0
      };

      this.queue.push(queueItem);
      // 按优先级排序，优先级高的在前面
      this.queue.sort((a, b) => b.priority - a.priority);

      this.processQueue();
    });
  }
  /**
   * 
   */
  public deleteQueueItem(url: string, method: string): void {
    this.queue = this.queue.filter(
      (item) => !(item.config.url === url && item.config.method?.toUpperCase() === method.toUpperCase())
    );
  }
  /**
   * 处理队列
   */
  private processQueue(): void {
    if (this.processing) return;

    this.processing = true;

    while (this.activeRequests < this.maxConcurrent && this.queue.length > 0) {
      const item = this.queue.shift();
      if (item) {
        this.executeRequest(item);
      }
    }

    this.processing = false;
  }

  /**
   * 执行请求
   */
  private async executeRequest(item: QueueItem): Promise<void> {
    this.activeRequests++;

    try {
      // 这里会调用实际的请求函数
      const result = await this.makeRequest(item.config);
      item.resolve(result);
    } catch (error) {
      item.reject(error);
    } finally {
      this.activeRequests--;
      this.processQueue(); // 继续处理队列
    }
  }

  /**
   * 实际发起请求的方法（由外部注入）
   */
  private makeRequest(config: RequestConfig): Promise<any> {
    // 这个方法会在 RequestClient 中重写
    return Promise.resolve();
  }

  /**
   * 设置实际请求方法
   */
  public setRequestMethod(method: (config: RequestConfig) => Promise<any>): void {
    this.makeRequest = method;
  }

  /**
   * 获取队列状态
   */
  public getQueueStatus(): { queueLength: number; activeRequests: number } {
    return {
      queueLength: this.queue.length,
      activeRequests: this.activeRequests
    };
  }

  /**
   * 清空队列
   */
  public clearQueue(): void {
    this.queue.forEach(item => {
      item.reject(new Error('请求队列已清空'));
    });
    this.queue = [];
  }

  /**
   * 设置最大并发数
   */
  public setMaxConcurrent(max: number): void {
    this.maxConcurrent = max;
    this.processQueue();
  }
}