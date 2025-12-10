export interface AccountRoleRef {
    _id: string;
    name: string;
  }
  
  export interface Account {
    _id: string;
    email: string;
    avatarImage?: string;
    fullName: string;
    isActive: boolean;
    lastActiveAt?: string;
    roleId: AccountRoleRef;
    streakCount?: number;
    experiencePoint?: number;
    heartCount?: number;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
  }
  
  export interface AccountsPagination {
    page: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
  }
  
  export interface AccountsListResponse {
    value: {
      pagination: AccountsPagination;
      data: Account[];
    };
  }
  
  export interface CreateAccountDto {
    password: string;
    email: string;
    fullName: string;
    roleId: string;
    avatarImage?: string;
    // Nếu backend bắt buộc mấy field này thì thêm default tại đây
    streakCount?: number;
    experiencePoint?: number;
    heartCount?: number;
    lastActiveAt?: string;
  }
  
  export interface UpdateAccountDto {
    password?: string;
    email?: string;
    fullName?: string;
    roleId?: string;
    avatarImage?: string;
  }
  