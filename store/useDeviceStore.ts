import { create } from "zustand";
import { api } from "@/services/api";
import { Device } from "@/types";

interface DeviceState {
  deviceId: string | null;
  deviceData: Device | null;
  isDeviceLoading: boolean;
  fetchDevice: () => Promise<void>;
}

export const useDeviceStore = create<DeviceState>((set, get) => ({
  deviceId: null,
  deviceData: null,
  isDeviceLoading: true,
  fetchDevice: async () => {
    set({ isDeviceLoading: true });
    try {
      const res = await api.get("/device");
      const devices = res.data.data;

      if (devices && devices.length > 0) {
        set({
          deviceId: devices[0].id,
          deviceData: devices[0],
          isDeviceLoading: false,
        });
      } else {
        set({ deviceId: null, deviceData: null, isDeviceLoading: false });
      }
    } catch (error) {
      console.error("Gagal mengambil data perangkat:", error);
      set({ isDeviceLoading: false });
    }
  },
}));
