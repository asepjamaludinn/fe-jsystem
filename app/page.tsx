"use client";

import { useState, useEffect } from "react";
import { useSocket } from "@/hooks/useSocket";
import { useDeviceStore } from "@/store/useDeviceStore";
import { controlJemuran } from "@/services/deviceService";
import { api } from "@/services/api";

import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import MainStatusCard from "@/app/(dashboard)/_components/MainStatusCard";
import DeviceControls from "@/app/(dashboard)/_components/DeviceControls";

import EmptyDeviceState from "@/app/(dashboard)/_components/EmptyDeviceState";
import WeatherSensorWidget from "@/app/(dashboard)/_components/WeatherSensorWidget";

import { WeatherData, DeviceStatus } from "@/types";

export default function Dashboard() {
  const { realtimeData } = useSocket();
  const { deviceId, deviceData, isDeviceLoading, fetchDevice } =
    useDeviceStore();

  const [loadingCommand, setLoadingCommand] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [userName, setUserName] = useState("User");
  const [greeting, setGreeting] = useState("Halo");

  const [isAuto, setIsAuto] = useState(true);
  const [lastKnownStatus, setLastKnownStatus] = useState<DeviceStatus>({
    cuaca: "--",
    keamanan: "Menunggu Sensor...",
    posisiJemuran: "MASUK",
    hujanADC: 0,
  });
  const serialNumber = deviceData?.serialNumber;

  useEffect(() => {
    if (
      realtimeData &&
      (realtimeData.deviceId === deviceId ||
        realtimeData.deviceId === serialNumber)
    ) {
      setLastKnownStatus({
        cuaca: realtimeData.cuaca,
        keamanan: realtimeData.keamanan,
        posisiJemuran: realtimeData.posisiJemuran,
        hujanADC: realtimeData.hujanADC,
      });

      if (realtimeData.isAutoMode !== undefined) {
        setIsAuto(realtimeData.isAutoMode);
        localStorage.setItem(
          `autoMode_${deviceId}`,
          realtimeData.isAutoMode.toString(),
        );
      }
    }
  }, [realtimeData, deviceId, serialNumber]);

  useEffect(() => {
    const name = localStorage.getItem("userName");
    if (name) setUserName(name);

    const hour = new Date().getHours();
    if (hour < 11) setGreeting("Selamat Pagi");
    else if (hour < 15) setGreeting("Selamat Siang");
    else if (hour < 18) setGreeting("Selamat Sore");
    else setGreeting("Selamat Malam");

    if (!deviceId) {
      fetchDevice();
    }
  }, []);

  useEffect(() => {
    const fetchDependencies = async () => {
      if (!deviceId) return;
      try {
        let isAutoNow = true;
        const savedAutoMode = localStorage.getItem(`autoMode_${deviceId}`);
        if (savedAutoMode !== null) {
          isAutoNow = savedAutoMode === "true";
          setIsAuto(isAutoNow);
        }

        try {
          await controlJemuran(deviceId, isAutoNow ? "AUTO_ON" : "AUTO_OFF");
        } catch (e) {
          console.error("Gagal auto-sync auto mode ke ESP32");
        }

        const logsRes = await api.get(`/device/${deviceId}/logs`);
        const logsData = logsRes.data.data;
        if (logsData && logsData.length > 0) {
          const lastLog = logsData[0];
          setLastKnownStatus({
            cuaca: lastLog.cuaca,
            keamanan: lastLog.keamanan,
            posisiJemuran: deviceData?.posisiJemuran || "MASUK",
            hujanADC: lastLog.hujanADC,
          });
        }

        const weatherRes = await api.get(`/device/${deviceId}/weather`);
        setWeatherData(weatherRes.data.data);
      } catch (error) {
        console.error("Gagal sinkronisasi dependensi data:", error);
      }
    };

    fetchDependencies();
  }, [deviceId]);

  const handleControl = async (
    command: "MASUK" | "KELUAR" | "AUTO_ON" | "AUTO_OFF",
  ) => {
    if (!deviceId)
      return alert("Anda belum memiliki alat. Silakan Claim Device!");

    setLoadingCommand(true);
    try {
      await controlJemuran(deviceId, command);

      if (command === "AUTO_ON") {
        setIsAuto(true);
        localStorage.setItem(`autoMode_${deviceId}`, "true");
      }
      if (command === "AUTO_OFF") {
        setIsAuto(false);
        localStorage.setItem(`autoMode_${deviceId}`, "false");
      }
      if (command === "MASUK") {
        setLastKnownStatus((prev) => ({ ...prev, posisiJemuran: "MASUK" }));
      }
      if (command === "KELUAR") {
        setLastKnownStatus((prev) => ({ ...prev, posisiJemuran: "KELUAR" }));
      }
    } catch (error) {
      console.error("Gagal mengirim perintah", error);
      alert("Gagal mengirim perintah ke alat!");
    } finally {
      setLoadingCommand(false);
    }
  };

  const isRaining = lastKnownStatus.cuaca === "Hujan";
  const temp =
    weatherData?.main?.temp !== undefined
      ? Math.round(weatherData.main.temp)
      : "--";
  const humidity =
    weatherData?.main?.humidity !== undefined
      ? weatherData.main.humidity
      : "--";
  const cityName = weatherData?.name || "Memuat Lokasi...";

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
