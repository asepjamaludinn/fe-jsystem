import { api } from "./api";
import { Device, ApiResponse } from "@/types";

export const getMyDevices = async () => {
  const response = await api.get<ApiResponse<Device[]>>("/device");
  return response.data;
};

export const controlJemuran = async (
  deviceId: string,
  command: "MASUK" | "KELUAR" | "AUTO_ON" | "AUTO_OFF",
) => {
  const response = await api.post<ApiResponse<any>>(
    `/device/${deviceId}/control`,
    {
      command,
    },
  );
  return response.data;
};

export const toggleNightMode = async (
  deviceId: string,
  nightModeEnabled: boolean,
) => {
  const response = await api.put<ApiResponse<any>>(
    `/device/${deviceId}/nightmode`,
    {
      nightModeEnabled,
    },
  );
  return response.data;
};

export const unclaimDevice = async (deviceId: string) => {
  const response = await api.delete<ApiResponse<any>>(
    `/device/${deviceId}/unclaim`,
  );
  return response.data;
};
