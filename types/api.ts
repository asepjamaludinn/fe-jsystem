export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  error?: string;
  data: T;
}

export interface ApiErrorResponse {
  success: boolean;
  error: string;
}
