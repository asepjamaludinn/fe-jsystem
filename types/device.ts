import {
  DEVICE_COMMAND,
  WEATHER_STATE,
  SECURITY_STATE,
} from "@/constants/device";

export type PosisiJemuranState =
  | typeof DEVICE_COMMAND.MASUK
  | typeof DEVICE_COMMAND.KELUAR;
export type CuacaState = (typeof WEATHER_STATE)[keyof typeof WEATHER_STATE];
export type KeamananState =
  (typeof SECURITY_STATE)[keyof typeof SECURITY_STATE];

export interface Device {
  id: string;
  serialNumber: string;
  name: string;
  status: string;
  posisiJemuran: PosisiJemuranState;
  nightModeEnabled: boolean;
  locationCity: string;
}

export interface SensorData {
  deviceId: string;
  cuaca: CuacaState;
  keamanan: KeamananState;
  hujanADC: number;
  ldrADC: number;
  pirStatus: number;
  posisiJemuran: PosisiJemuranState;
  isAutoMode: boolean;
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
  posisiJemuran: PosisiJemuranState;
  hujanADC: number;
}
