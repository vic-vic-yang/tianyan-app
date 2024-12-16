
export interface ApiResponse<T = any> {
  code: number;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export enum ApiCode {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  SERVER_ERROR = 500,
}

export const apiResponse = {
  success<T>(data: T, message?: string): ApiResponse<T> {
    return {
      code: ApiCode.SUCCESS,
      data,
      message,
    };
  },

  error(message: string, code = ApiCode.SERVER_ERROR): ApiResponse {
    return {
      code,
      message,
    };
  },

  validationError(errors: Record<string, string[]>): ApiResponse {
    return {
      code: ApiCode.BAD_REQUEST,
      errors,
    };
  },
};
