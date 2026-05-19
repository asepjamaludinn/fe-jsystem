import { api } from "./api";
import {
  ApiResponse,
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
  UpdatePasswordPayload,
  LoginResponseData,
  AvatarResponseData,
  ProfileResponseData,
} from "@/types";

export const loginUser = async (credentials: LoginPayload) => {
  const response = await api.post<ApiResponse<LoginResponseData>>(
    "/auth/login",
    credentials,
  );
  return response.data;
};

export const registerUser = async (userData: RegisterPayload) => {
  const response = await api.post<ApiResponse<any>>("/auth/register", userData);
  return response.data;
};

export const updateProfile = async (profileData: UpdateProfilePayload) => {
  const response = await api.put<ApiResponse<ProfileResponseData>>(
    "/auth/profile",
    profileData,
  );
  return response.data;
};

export const updatePassword = async (passwordData: UpdatePasswordPayload) => {
  const response = await api.put<ApiResponse<null>>(
    "/auth/profile/password",
    passwordData,
  );
  return response.data;
};

export const uploadAvatar = async (formData: FormData) => {
  const response = await api.post<ApiResponse<AvatarResponseData>>(
    "/auth/profile/avatar",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data;
};
