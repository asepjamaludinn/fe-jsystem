import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { SensorData } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const SOCKET_URL = API_URL.replace("/api", "");

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [realtimeData, setRealtimeData] = useState<SensorData | null>(null);

  useEffect(() => {
    const socketInstance = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    });

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("Web Socket Terhubung ke Backend!");
    });

    socketInstance.on("sensorUpdate", (data: SensorData) => {
      console.log("Data Realtime Diterima:", data);
      setRealtimeData(data);
    });

    socketInstance.on("connect_error", (err) => {
      console.error("Error Web Socket:", err.message);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return { socket, realtimeData };
};
