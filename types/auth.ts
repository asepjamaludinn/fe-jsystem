export interface LoginPayload {
  email: string;
  password?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
}

export interface UpdateProfilePayload {
  name: string;
}

export interface UpdatePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface LoginResponseData {
  token: string;
  name: string;
}

export interface AvatarResponseData {
  avatarUrl: string;
}

export interface ProfileResponseData {
  name: string;
}
