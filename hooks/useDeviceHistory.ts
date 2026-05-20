import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { useSocket } from "@/hooks/useSocket";
import { useDeviceStore } from "@/store/useDeviceStore";
import { SensorLog, SensorData } from "@/types";

export function useDeviceHistory() {
  const { socket } = useSocket();
  const { deviceId, deviceData, isDeviceLoading, fetchDevice } =
    useDeviceStore();

  const [logs, setLogs] = useState<SensorLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!deviceId && !isDeviceLoading) {
      fetchDevice();
    }
  }, [deviceId, isDeviceLoading, fetchDevice]);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!deviceId) return;
      setIsLoading(true);
      try {
        const logRes = await api.get(`/device/${deviceId}/logs`);
        setLogs(logRes.data.data);
      } catch (error) {
        console.error("Gagal mengambil log aktivitas:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, [deviceId]);

  useEffect(() => {
    if (!socket || !deviceId) return;

    const handleSensorUpdate = (data: SensorData) => {
      if (
        data.deviceId === deviceId ||
        data.deviceId === deviceData?.serialNumber
      ) {
        setLogs((prevLogs) => {
          const lastLog = prevLogs[0];

          if (
            !lastLog ||
            lastLog.cuaca !== data.cuaca ||
            lastLog.keamanan !== data.keamanan
          ) {
            const newLog: SensorLog = {
              id: Math.random().toString(36).substring(7),
              deviceId: deviceId,
              cuaca: data.cuaca,
              keamanan: data.keamanan,
              hujanADC: data.hujanADC,
              ldrADC: data.ldrADC,
              pirStatus: data.pirStatus,
              createdAt: new Date().toISOString(),
            };
            return [newLog, ...prevLogs];
          }
          return prevLogs;
        });
      }
    };

    socket.on("sensorUpdate", handleSensorUpdate);
    return () => {
      socket.off("sensorUpdate", handleSensorUpdate);
    };
  }, [socket, deviceId, deviceData]);

  const handleDeleteLog = async (logId: string) => {
    setLogs((prevLogs) => prevLogs.filter((log) => log.id !== logId));
    try {
      await api.delete(`/device/${deviceId}/logs/${logId}`);
    } catch (error) {
      console.error("Gagal menghapus log:", error);
    }
  };

  return { logs, isLoading: isLoading || isDeviceLoading, handleDeleteLog };
}
