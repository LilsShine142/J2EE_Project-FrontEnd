// src/types/index.ts
export interface User {
  id: string;
  email: string;
  password: string;  // Hash in real app
  name?: string;
  role?: 'customer' | 'admin';
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