export interface ApiResponse<T> {
    value?: T;
    error?: {
      message: string;
    };
  }
  
  export interface PaginatedResponse<T> {
    data: T[];
    pagination: Pagination;
  }
  
  export interface Pagination {
    page: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
  }
  
  export interface SortConfig {
    field: string;
    order: 'ASC' | 'DESC';
  }
  
  export interface FilterConfig {
    field: string;
    operator: string;
    value: string;
  }
  
  export interface GetCommonDto {
    page?: number;
    pageSize?: number;
    search?: string;
    sort?: string;
    filter?: string;
  }
  