
export interface UpdateUserPayload {
  first_name?: string;
  last_name?: string;
  phone?: string;
}

export interface UpdateProfilePayload {
  avatar?: string;
  date_of_birth?: string;
  gender?: string;
}

export interface UserProfile {
  id: string;
  avatar: string;
  date_of_birth: string;
  gender: string;
  created_at: string;
  updated_at: string;
}

export type UserRole = "admin" | "customer";

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export interface RegisterResponse {
  user: User;
  tokens: AuthTokens;
  message: string;
}

export interface SignupFormData {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: UserRole;
  password: string;
  password_confirm: string;
}


export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  user: User;
}

export interface RefreshResponse {
  access: string;
}