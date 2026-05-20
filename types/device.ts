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
