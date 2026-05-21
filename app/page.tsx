"use client";

import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import MainStatusCard from "@/app/(dashboard)/_components/MainStatusCard";
import DeviceControls from "@/app/(dashboard)/_components/DeviceControls";
import EmptyDeviceState from "@/app/(dashboard)/_components/EmptyDeviceState";
import WeatherSensorWidget from "@/app/(dashboard)/_components/WeatherSensorWidget";
import { useDashboardController } from "@/app/(dashboard)/_hooks/useDashboardController";

export default function Dashboard() {
  const {
    deviceId,
    isDeviceLoading,
    loadingCommand,
    userName,
    greeting,
    isAuto,
    lastKnownStatus,
    handleControl,
    fetchDevice,
    isRaining,
    temp,
    humidity,
    cityName,
  } = useDashboardController();

  return (
    <main className="flex-1 px-6 pt-12 pb-32 flex flex-col relative min-h-screen">
      <Header />

      <div className="mb-2 mt-2">
        <h1 className="text-3xl font-extrabold tracking-tighter text-gray-900">
          {greeting}, <br />
          <span className="text-[#44ACFF]">{userName.split(" ")[0]}!</span>
        </h1>
        {deviceId && (
          <p className="text-sm font-medium text-gray-500 mt-2 leading-relaxed pr-4">
            {isAuto
              ? "Mode Auto Aktif. Perangkat beroperasi otomatis mendeteksi parameter cuaca di sekitarnya."
              : "Mode Manual Aktif. Sensor pergerakan dimatikan, Anda memegang kendali penuh atas motor servo."}
          </p>
        )}
      </div>

      {isDeviceLoading ? (
        <div className="flex flex-col items-center justify-center mt-20 animate-pulse">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-[#44ACFF] rounded-full animate-spin mb-4"></div>
          <p className="text-sm font-bold text-gray-400">
            Menyinkronkan data alat...
          </p>
        </div>
      ) : !deviceId ? (
        <EmptyDeviceState />
      ) : (
        <div className="animate-in fade-in duration-500">
          <MainStatusCard
            posisi={lastKnownStatus.posisiJemuran as "MASUK" | "KELUAR"}
            isManual={!isAuto}
            cuaca={lastKnownStatus.cuaca}
          />

          <DeviceControls
            isAuto={isAuto}
            loading={loadingCommand}
            onControl={handleControl}
          />

          <WeatherSensorWidget
            temp={temp}
            cityName={cityName}
            humidity={humidity}
            isRaining={isRaining}
            lastKnownStatus={lastKnownStatus}
            isDeviceLoading={isDeviceLoading}
            fetchDevice={fetchDevice}
          />
        </div>
      )}

      <BottomNav />
    </main>
  );
}
