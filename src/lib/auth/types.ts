export interface User {
  email: string;
  password: string;
  name?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface LoginInputs {
  email: string;
  password: string;
}

export interface SignupInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
