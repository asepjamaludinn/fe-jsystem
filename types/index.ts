export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  error?: string;
  data: T;
}

export interface ApiErrorResponse {
  success: boolean;
  error: string;
}

export interface Device {
  id: string;
  serialNumber: string;
  name: string;
  status: string;
  posisiJemuran: "MASUK" | "KELUAR";
  nightModeEnabled: boolean;
  locationCity: string;
}

export interface SensorData {
  deviceId: string;
  cuaca: "Cerah" | "Hujan" | "Gelap";
  keamanan: "Aman" | "Gerakan" | "ADA ORANG!";
  hujanADC: number;
  ldrADC: number;
  pirStatus: number;
  posisiJemuran: "MASUK" | "KELUAR";
  isAutoMode: boolean;
}

export interface NotificationData {
  id: string;
  deviceId: string;
  type: "warning" | "danger" | "info";
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface SensorLog {
  id: string;
  deviceId: string;
  cuaca: string;
  keamanan: string;
  hujanADC: number;
  ldrADC: number;
  pirStatus: number;
  createdAt: string;
}

export interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
}

export interface ClaimedData {
  serialNumber: string;
  status: string;
  isShared: boolean;
}

export interface DeviceStatus {
  cuaca: string;
  keamanan: string;
  posisiJemuran: "MASUK" | "KELUAR";
  hujanADC: number;
}

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
