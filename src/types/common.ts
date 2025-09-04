// Common interfaces for the application
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface DatabaseConfig {
  uri: string;
  dbName: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'admin' | 'user';
}
