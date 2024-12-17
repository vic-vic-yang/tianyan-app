import { cookies } from 'next/headers';
import { RequestConfig, RequestInterceptors } from './api';
import { ApiResponse } from './apiResponse';
import { CacheManager } from './cache';
import { RequestQueue } from './requestQueue';

export class Request {
  private baseURL: string;
  private timeout: number;
  private queue: RequestQueue;
  private cache: CacheManager;
  private interceptors: RequestInterceptors;

  constructor(config: RequestConfig = {}) {
    this.baseURL = config.baseURL || process.env.NEXT_PUBLIC_API_BASE_URL || '';
    this.timeout = config.timeout || 10000;
    this.queue = new RequestQueue();
    this.cache = new CacheManager();
    this.interceptors = {};
  }

  // 设置拦截器
  setInterceptors(interceptors: RequestInterceptors) {
    this.interceptors = interceptors;
  }

  // 重试机制
  private async retry<T>(fn: () => Promise<T>, retries: number, delay: number): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retries <= 0) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay));
      return this.retry(fn, retries - 1, delay);
    }
  }

  // 数据转换
  private transformResponse(data: any) {
    // 示例转换逻辑
    if (Array.isArray(data)) {
      return data.map((item) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      }));
    }
    return {
      ...data,
      createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
    };
  }

  private async fetchWithTimeout(input: RequestInfo, init?: RequestConfig): Promise<Response> {
    const controller = new AbortController();
    const timeout = init?.timeout || this.timeout;
    console.log('input', input);
    console.log('init', init);

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    try {
      const response = await fetch(input, {
        ...init,
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...init?.headers,
        },
        cache: init?.cache ? 'default' : 'no-store',
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`请求超时 (${timeout}ms)`);
      }

      throw error;
    }
  }

  private getFullUrl(url: string): string {
    return `${this.baseURL}${url}`;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    // 检查响应状态码
    if (!response.ok) {
      // 尝试读取错误响应内容
      const errorText = await response.text();
      console.error('Response error:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: errorText.slice(0, 200), // 只显示前200个字符
      });

      throw new Error(`HTTP 错误! 状态码: ${response.status}, 响应内容: ${errorText.slice(0, 100)}...`);
    }

    const contentType = response.headers.get('content-type');

    // 调试信息
    console.debug('Response headers:', {
      contentType,
      allHeaders: Object.fromEntries(response.headers.entries()),
    });

    try {
      // 即使 Content-Type 不是 JSON，也尝试解析
      const text = await response.text();
      console.log('text', text);
      const data = JSON.parse(text);
      return {
        ...data,
        data: this.transformResponse(data.data),
      };
    } catch (error) {
      console.error('Response parsing error:', error);
      throw new Error(`解析响应失败: ${error}\n接收到的 Content-Type: ${contentType}`);
    }
  }

  async request<T = any>(
    url: string,
    config: RequestConfig = {
      withToken: true,
    }
  ): Promise<ApiResponse<T>> {
    const finalConfig = { ...config };

    // 应用请求拦截器
    if (this.interceptors.request) {
      const interceptedConfig = await this.interceptors.request(finalConfig);
      Object.assign(finalConfig, interceptedConfig);
    }

    // 处理缓存
    if (finalConfig.cache) {
      const cacheKey = this.queue.getRequestKey(url, finalConfig);
      const cachedData = this.cache.get(cacheKey);
      if (cachedData) return cachedData;
    }

    // 处理请求队列
    const requestKey = this.queue.getRequestKey(url, finalConfig);
    if (this.queue.has(requestKey)) {
      return this.queue.get(requestKey)!;
    }

    const request = async () => {
      try {
        // 处理 token
        if (finalConfig.withToken !== false) {
          const token =
            typeof window === 'undefined' ? (await cookies()).get('token')?.value : document.cookie.split('=')[1];
          if (token) {
            finalConfig.headers = {
              ...finalConfig.headers,
              Authorization: `Bearer ${token}`,
            };
          }
        }

        console.log('finalConfig===', finalConfig);

        const response = await this.fetchWithTimeout(this.getFullUrl(url), finalConfig);
        console.log('response===', response);

        let result = await this.handleResponse<T>(response);

        console.log('result===', result);

        // 应用响应拦截器
        if (this.interceptors.response) {
          result = await this.interceptors.response(result);
        }

        // 数据转换
        if (finalConfig.transform) {
          result.data = this.transformResponse(result.data);
        }

        // 设置缓存
        if (finalConfig.cache) {
          this.cache.set(requestKey, result, finalConfig.cacheTime || 5 * 60 * 1000);
        }

        return result;
      } catch (error) {
        if (this.interceptors.error) {
          return this.interceptors.error(error);
        }
        throw error;
      }
    };

    // 添加到请求队列
    return this.queue.add(requestKey, this.retry(request, finalConfig.retry || 0, finalConfig.retryDelay || 1000));
  }

  // 便捷方法
  async get<T = any>(url: string, config?: RequestConfig) {
    return this.request<T>(url, { ...config, method: 'GET' });
  }

  async post<T = any>(url: string, data?: any, config?: RequestConfig) {
    return this.request<T>(url, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T = any>(url: string, data?: any, config?: RequestConfig) {
    return this.request<T>(url, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T = any>(url: string, config?: RequestConfig) {
    return this.request<T>(url, { ...config, method: 'DELETE' });
  }
}
