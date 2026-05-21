import { useState, useEffect } from "react";
import { useSocket } from "@/hooks/useSocket";
import { useDeviceStore } from "@/store/useDeviceStore";
import { controlJemuran } from "@/services/deviceService";
import { api } from "@/services/api";
import { WeatherData, DeviceStatus } from "@/types";

export function useDashboardController() {
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

  return {
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
  };
}
