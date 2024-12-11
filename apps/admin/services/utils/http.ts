import { Request } from './request';



export const http = new Request({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
});

// 设置拦截器
http.setInterceptors({
  request: async (config) => {
    // 请求前处理
    console.log('请求开始:', config);
    return config;
  },
  response: async (response) => {
    // 响应处理
    console.log('请求完成:', response);
    return response;
  },
  error: async (error) => {
    // 错误处理
    console.error('请求错误:', error);
    if (error.status === 401) {
      // 处理未授权
      window.location.href = '/login';
    }
    throw error;
  },
});
