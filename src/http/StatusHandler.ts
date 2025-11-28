import type { ResponseData } from '@/types/request';
import type { AxiosResponse } from 'axios';

export class StatusCodeHandler {
  private static instance: StatusCodeHandler;

  public static getInstance(): StatusCodeHandler {
    if (!StatusCodeHandler.instance) {
      StatusCodeHandler.instance = new StatusCodeHandler();
    }
    return StatusCodeHandler.instance;
  }

  /**
   * 处理 HTTP 状态码
   */
  public handleHttpStatus(response: AxiosResponse): void {
    const { status, config } = response;

    switch (status) {
      case 200:
        // 成功，不处理
        break;
      case 201:
        console.log('创建成功:', config.url);
        break;
      case 204:
        console.log('无内容:', config.url);
        break;
      case 304:
        console.log('资源未修改，使用缓存:', config.url);
        break;
      case 400:
        throw new Error('请求参数错误');
      case 401:
        this.handleUnauthorized();
        throw new Error('未授权，请重新登录');
      case 403:
        throw new Error('禁止访问');
      case 404:
        throw new Error('请求资源不存在');
      case 405:
        throw new Error('请求方法不允许');
      case 408:
        throw new Error('请求超时');
      case 500:
        throw new Error('服务器内部错误');
      case 502:
        throw new Error('网关错误');
      case 503:
        throw new Error('服务不可用');
      case 504:
        throw new Error('网关超时');
      default:
        if (status >= 500) {
          throw new Error(`服务器错误: ${status}`);
        } else if (status >= 400) {
          throw new Error(`客户端错误: ${status}`);
        }
    }
  }

  /**
   * 处理业务状态码
   */
  public handleBusinessCode<T>(data: ResponseData): T {
    const { code, message, data: responseData } = data;

    switch (code) {
      case 200:
        return responseData;
      case 401:
        this.handleUnauthorized();
        throw new Error(message || '未授权');
      case 403:
        throw new Error(message || '权限不足');
      case 404:
        throw new Error(message || '资源不存在');
      case 500:
        throw new Error(message || '服务器错误');
      case 1001:
        throw new Error(message || '业务逻辑错误');
      case 1002:
        throw new Error(message || '数据验证失败');
      default:
        if (code !== 200) {
          throw new Error(message || `业务错误: ${code}`);
        }
        return responseData;
    }
  }

  /**
   * 处理未授权情况
   */
  private handleUnauthorized(): void {
    // 清除 token
    localStorage.removeItem('token');
    // 跳转到登录页
    window.location.href = '/login';
  }

  /**
   * 处理网络错误
   */
  public handleNetworkError(error: any): never {
    if (error.message.includes('Network Error')) {
      throw new Error('网络连接失败，请检查网络设置');
    }
    if (error.message.includes('timeout')) {
      throw new Error('请求超时，请重试');
    }
    if (error.code === 'ECONNABORTED') {
      throw new Error('连接中断，请重试');
    }
    throw error;
  }
}