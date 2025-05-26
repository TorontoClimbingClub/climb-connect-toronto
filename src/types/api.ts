
export interface ApiError {
  message: string;
  code?: string;
  details?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

export interface SupabaseError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}
