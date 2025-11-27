// src/types/index.ts
export interface User {
  userId: number;
  email: string;
  Password?: string;       
  verifyCode?: string | null;
  Status: string;
  fullName: string;
  joinDate: string;
  phoneNumber: string;
  username?: string;
  totalSpent?: number;
  loyaltyPoints?: number;
  statusWork: string;
  roleId?: number;
  avatar?: string;
  gender?: string;
  statusId?: number;
  createdAt: string;
  updatedAt: string;
  role?: {
    RoleId?: number;
    RoleName?: string;
    Description?: string;
  };
}

export interface Booking {
  id: string;
  userId: string;
  date: Date;
  time: string;
  guests: number;
  name: string;
  phone: string;
  notes?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData extends LoginFormData {
  name: string;
  confirmPassword: string;
}

export interface BookingFormData {
  date: Date;
  time: string;
  guests: number;
  name: string;
  phone: string;
  notes?: string;
}

export interface RoleOption {
  RoleID: number;
  RoleName: string;
  Description?: string;
}

export interface StatusOption {
  id: number;         
  description: string; 
  code?: string;
}


export type AppRoute = {
  path: string;
  component: React.FC<any>;
};
