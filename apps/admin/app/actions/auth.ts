'use server';

import { apiResponse } from '@/services/utils/apiResponse';
import { http } from '@/services/utils/http';

export async function login(formData: FormData) {
  try {
    const email = formData.get('email');
    const password = formData.get('password');
    const response = await http.post<any>('/api/login', { email, password });
    return apiResponse.success(response);
  } catch (error) {
    return apiResponse.error('登录失败');
  }
}