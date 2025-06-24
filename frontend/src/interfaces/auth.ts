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