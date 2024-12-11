import { ApiResponse, ApiCode } from './api';

export const apiResponse = {
  success<T>(data: T, message?: string): ApiResponse<T> {
    return {
      code: ApiCode.SUCCESS,
      data,
      message
    };
  },

  error(message: string, code = ApiCode.SERVER_ERROR): ApiResponse {
    return {
      code,
      message
    };
  },

  validationError(errors: Record<string, string[]>): ApiResponse {
    return {
      code: ApiCode.BAD_REQUEST,
      errors
    };
  }
};
