import { cookies } from 'next/headers';
import { ApiResponse, ApiCode } from '../types/api';
import { RequestConfig, RequestError, RequestInterceptors } from '../types/request';
import { RequestQueue } from './requestQueue';
import { CacheManager } from './cache';

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
  private async retry<T>(
    fn: () => Promise<T>,
    retries: number,
    delay: number
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retries <= 0) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
      return this.retry(fn, retries - 1, delay);
    }
  }

  // 数据转换
  private transformResponse(data: any) {
    // 示例转换逻辑
    if (Array.isArray(data)) {
      return data.map(item => ({
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

  private async fetchWithTimeout(
    input: RequestInfo,
    init?: RequestConfig
  ): Promise<Response> {
    // 创建 AbortController 用于手动中断请求
    const controller = new AbortController();
    const timeout = init?.timeout || this.timeout;
    
    // 设置超时定时器
    const timeoutId = setTimeout(() => {
      controller.abort(); // 超时后中断请求
    }, timeout);
    
    try {
      // 发起请求，并将 controller.signal 传入以便可以中断
      const response = await fetch(input, {
        ...init,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...init?.headers,
        },
      });
      
      // 请求成功，清除超时定时器
      clearTimeout(timeoutId);
      return response;
      
    } catch (error) {
      // 发生错误，清除超时定时器
      clearTimeout(timeoutId);
      
      // 判断是否为超时错误
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`请求超时 (${timeout}ms)`);
      }
      
      throw error;
    }
  }

  async request<T = any>(
    url: string,
    config: RequestConfig = {}
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
          const token = cookies().get('token')?.value;
          if (token) {
            finalConfig.headers = {
              ...finalConfig.headers,
              Authorization: `Bearer ${token}`,
            };
          }
        }

        const response = await this.fetchWithTimeout(
          this.getFullUrl(url),
          finalConfig
        );

        let result = await this.handleResponse<T>(response);

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
          this.cache.set(
            requestKey,
            result,
            finalConfig.cacheTime || 5 * 60 * 1000
          );
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
    return this.queue.add(
      requestKey,
      this.retry(
        request,
        finalConfig.retry || 0,
        finalConfig.retryDelay || 1000
      )
    );
  }

  // ... 其他原有方法 ...
} 
