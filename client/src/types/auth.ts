export interface User {
  id: string;
  name: string;
  email: string;
  dateOfBirth?: string;
  isEmailVerified?: boolean;
  profilePicture?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user?: User;
    token?: string;
    email?: string;
    otpSent?: boolean;
  };
  error?: string;
}

export interface SignupData {
  name: string;
  email: string;
  dateOfBirth: string;
}

export interface LoginData {
  email: string;
  otp: string;
}

export interface OTPVerificationData {
  email: string;
  otp: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}
