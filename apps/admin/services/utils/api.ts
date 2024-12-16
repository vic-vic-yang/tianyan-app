interface ApiResponse<T = any> {
  code: number;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface RequestConfig extends RequestInit {
  timeout?: number;
  baseURL?: string;
  retry?: number;  // 重试次数
  retryDelay?: number;  // 重试延迟
  cache?: boolean;  // 是否缓存
  cacheTime?: number;  // 缓存时间
  withToken?: boolean;  // 是否需要token
  transform?: boolean;  // 是否转换响应数据
}

export interface RequestInterceptors {
  request?: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
  response?: (response: ApiResponse) => ApiResponse | Promise<ApiResponse>;
  error?: (error: any) => any;
}

export interface CacheItem {
  data: any;
  timestamp: number;
}
