export interface RegisterPayload {
  email: string;
  password: string;
  password_confirm: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  [key: string]: any;
}

export interface UpdateUserPayload {
  email?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  [key: string]: any;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ResetPasswordPayload {
  email: string;
}

export interface ResetPasswordConfirmPayload {
  token: string;
  password: string;
  password_confirm: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  brief_description: string;
  last_name: string;
  profile_image_url?: string;
  banner_url: string;
  created_at: string;
  updated_at: string;
  country: string;
  city: string;
  postal_code: string;
  street: string;
  phone_number: string;
  house_number: string;
  full_name: string;
  full_adresse: string;
  bio: string;
}
