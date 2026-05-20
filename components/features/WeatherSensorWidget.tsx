import {
  FiSun,
  FiCloudRain,
  FiShield,
  FiWind,
  FiRefreshCw,
} from "react-icons/fi";
import { DeviceStatus } from "@/types";

interface WeatherSensorWidgetProps {
  temp: number | string;
  cityName: string;
  humidity: number | string;
  isRaining: boolean;
  lastKnownStatus: DeviceStatus;
  isDeviceLoading: boolean;
  fetchDevice: () => void;
}

export default function WeatherSensorWidget({
  temp,
  cityName,
  humidity,
  isRaining,
  lastKnownStatus,
  isDeviceLoading,
  fetchDevice,
}: WeatherSensorWidgetProps) {
  return (
    <>
      <div className="mt-8 px-1">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-[14px] font-bold text-gray-800 tracking-tight">
            Cuaca Wilayah
          </h3>
          <button
            onClick={fetchDevice}
            disabled={isDeviceLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#44ACFF]/10 text-[#44ACFF] rounded-full text-[10px] font-extrabold tracking-wide hover:bg-[#44ACFF]/20 transition-all active:scale-95 disabled:opacity-50"
          >
            <FiRefreshCw className={isDeviceLoading ? "animate-spin" : ""} />
            {isDeviceLoading ? "SINKRONISASI" : "SYNC DATA"}
          </button>
        </div>

        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex justify-between items-center relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#44ACFF]/10 rounded-full blur-3xl"></div>

          <div className="flex flex-col z-10">
            <div className="flex items-end gap-1 mb-1">
              <h2 className="text-6xl font-black tracking-tighter text-gray-900">
                {temp}°
              </h2>
              <span className="text-xl font-bold text-gray-400 mb-2">C</span>
            </div>
            <p className="text-[13px] font-bold text-gray-500 tracking-tight flex items-center gap-1.5">
              <FiWind className="text-[#44ACFF]" />
              {cityName} • Hum: {humidity}%
            </p>
          </div>

          <div className="w-20 h-20 bg-gradient-to-br from-[#44ACFF] to-[#89D4FF] rounded-[1.5rem] shadow-lg shadow-[#44ACFF]/30 flex items-center justify-center z-10 text-white transform rotate-3">
            {isRaining ? (
              <FiCloudRain className="text-4xl" />
            ) : (
              <FiSun className="text-4xl" />
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 px-1">
        <h3 className="text-[14px] font-bold text-gray-800 tracking-tight mb-3">
          Sensor Jemuran
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-[1.5rem] p-5 shadow-sm flex flex-col gap-3 border border-gray-100">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                isRaining
                  ? "bg-[#44ACFF] text-white"
                  : "bg-orange-100 text-orange-500"
              }`}
            >
              {isRaining ? (
                <FiCloudRain className="text-xl" />
              ) : (
                <FiSun className="text-xl" />
              )}
            </div>
            <div className="mt-auto">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">
                Kondisi Alat
              </p>
              <p className="text-xl font-extrabold tracking-tight mt-0.5 text-gray-800">
                {lastKnownStatus.cuaca}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[1.5rem] p-5 shadow-sm flex flex-col gap-3 border border-gray-100">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                lastKnownStatus.keamanan === "Aman"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-500 text-white"
              }`}
            >
              <FiShield className="text-xl" />
            </div>
            <div className="mt-auto">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">
                Keamanan
              </p>
              <p
                className={`text-xl font-extrabold tracking-tight mt-0.5 ${
                  lastKnownStatus.keamanan === "Aman"
                    ? "text-gray-800"
                    : "text-red-600"
                }`}
              >
                {lastKnownStatus.keamanan}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
