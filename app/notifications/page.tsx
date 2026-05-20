"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/layout/BottomNav";
import NotificationCard from "@/components/features/NotificationCard";
import { useDeviceStore } from "@/store/useDeviceStore";
import { api } from "@/services/api";
import { useSocket } from "@/hooks/useSocket";
import {
  FiBell,
  FiAlertTriangle,
  FiInfo,
  FiArrowLeft,
  FiCheckCircle,
  FiFilter,
  FiCheck,
} from "react-icons/fi";
import { NotificationData } from "@/types";

export default function NotificationsPage() {
  const router = useRouter();
  const { socket } = useSocket();
  const { deviceId, isDeviceLoading, fetchDevice } = useDeviceStore();

  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeFilter, setActiveFilter] = useState<
    "Semua" | "Baru" | "Bahaya" | "Peringatan" | "Info"
  >("Semua");

  useEffect(() => {
    if (!deviceId && !isDeviceLoading) fetchDevice();
  }, [deviceId, isDeviceLoading, fetchDevice]);

  useEffect(() => {
    const fetchNotifs = async () => {
      if (!deviceId) return;
      setIsLoading(true);
      try {
        const notifRes = await api.get(`/device/${deviceId}/notifications`);
        setNotifications(notifRes.data.data);
      } catch (error) {
        console.error("Gagal mengambil notifikasi:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotifs();
  }, [deviceId]);

  useEffect(() => {
    if (!socket || !deviceId) return;

    const handleNewNotif = (notif: NotificationData) => {
      if (notif.deviceId === deviceId) {
        setNotifications((prev) => [notif, ...prev]);
      }
    };

    socket.on("notification", handleNewNotif);
    return () => {
      socket.off("notification", handleNewNotif);
    };
  }, [socket, deviceId]);

  const handleMarkAllAsRead = async () => {
    if (!deviceId) return;
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true })),
    );
    try {
      await api.put(`/device/${deviceId}/notifications/read`);
    } catch (error) {
      console.error("Gagal menandai semua notifikasi:", error);
    }
  };

  const handleMarkSingleAsRead = async (notifId: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notifId ? { ...notif, isRead: true } : notif,
      ),
    );
    try {
      await api.put(`/device/${deviceId}/notifications/${notifId}/read`);
    } catch (error) {
      console.error("Gagal menandai notifikasi:", error);
    }
  };

  const getNotifStyle = (type: string, isRead: boolean) => {
    const opacityClass = isRead ? "opacity-60 grayscale-[30%]" : "opacity-100";
    switch (type) {
      case "danger":
        return {
          icon: <FiAlertTriangle className="text-xl text-red-500" />,
          bgColor: `bg-red-50 border-red-100 ${opacityClass}`,
          textColor: isRead ? "text-gray-400" : "text-red-600",
          label: "Bahaya",
        };
      case "warning":
        return {
          icon: <FiBell className="text-xl text-amber-500" />,
          bgColor: `bg-amber-50 border-amber-100 ${opacityClass}`,
          textColor: isRead ? "text-gray-400" : "text-amber-600",
          label: "Peringatan",
        };
      case "info":
      default:
        return {
          icon: <FiInfo className="text-xl text-[#44ACFF]" />,
          bgColor: `bg-[#44ACFF]/10 border-[#44ACFF]/20 ${opacityClass}`,
          textColor: isRead ? "text-gray-400" : "text-[#44ACFF]",
          label: "Info",
        };
    }
  };

  const filteredNotifs = notifications.filter((notif) => {
    if (activeFilter === "Semua") return true;
    if (activeFilter === "Baru") return !notif.isRead;
    if (activeFilter === "Bahaya") return notif.type === "danger";
    if (activeFilter === "Peringatan") return notif.type === "warning";
    if (activeFilter === "Info") return notif.type === "info";
    return true;
  });

  const unreadNotifs = filteredNotifs.filter((n) => !n.isRead);
  const readNotifs = filteredNotifs.filter((n) => n.isRead);

  return (
    <main className="flex-1 px-6 pt-10 pb-32 flex flex-col relative min-h-screen">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4 relative z-10 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-gray-100 hover:bg-gray-50 hover:shadow-md hover:-translate-x-0.5 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            <FiArrowLeft className="text-lg text-gray-700" />
          </button>
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            Notifikasi
          </h2>
        </div>

        {unreadNotifs.length > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="group flex items-center gap-1.5 px-3.5 py-2 bg-transparent hover:bg-blue-50/80 text-[#44ACFF] rounded-full transition-all duration-300 cursor-pointer active:scale-95"
          >
            <FiCheck className="text-sm group-hover:scale-110 transition-transform" />
            <span className="text-[13px] font-semibold tracking-tight hidden sm:block">
              Tandai semua
            </span>
          </button>
        )}
      </div>

      <div className="mb-4 animate-in fade-in slide-in-from-top-2 duration-500">
        <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide px-1">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm border border-gray-100 text-gray-400 flex-shrink-0">
            <FiFilter className="text-sm" />
          </div>
          {(["Semua", "Baru", "Bahaya", "Peringatan", "Info"] as const).map(
            (filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`relative px-4 py-2 rounded-full text-[13px] font-semibold tracking-tight transition-all duration-300 ease-out flex-shrink-0 cursor-pointer outline-none ${
                  activeFilter === filter
                    ? "bg-gray-900 text-white shadow-md transform scale-105"
                    : "bg-white text-gray-500 border border-transparent hover:border-gray-200 hover:bg-gray-50 active:scale-95 shadow-sm"
                }`}
              >
                {filter}
                {filter === "Baru" && unreadNotifs.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex items-center justify-center rounded-full min-w-[18px] h-[18px] px-1.5 bg-red-500 text-[10px] font-semibold text-white leading-none">
                      {unreadNotifs.length > 9 ? "9+" : unreadNotifs.length}
                    </span>
                  </span>
                )}
              </button>
            ),
          )}
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-[1.5rem] p-5 h-24 animate-pulse border border-gray-50 shadow-sm"
              ></div>
            ))}
          </div>
        ) : filteredNotifs.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center justify-center bg-white/60 rounded-[2rem] border border-dashed border-gray-200 backdrop-blur-sm transition-all">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4 text-gray-300 border border-gray-100">
              <FiCheckCircle className="text-4xl" />
            </div>
            <h4 className="text-lg font-semibold tracking-tight text-gray-900">
              Semua bersih
            </h4>
            <p className="text-sm font-medium text-gray-500 tracking-tight mt-1 max-w-[200px]">
              Tidak ada riwayat peringatan pada kategori ini.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {unreadNotifs.length > 0 && (
              <div>
                <h3 className="text-[13px] font-semibold text-[#44ACFF] tracking-tight mb-3 pl-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#44ACFF] rounded-full animate-pulse shadow-[0_0_8px_rgba(68,172,255,0.8)]"></span>
                  Peringatan baru
                </h3>
                <div className="flex flex-col gap-3">
                  {unreadNotifs.map((notif) => (
                    <NotificationCard
                      key={notif.id}
                      notif={notif}
                      style={getNotifStyle(notif.type, false)}
                      onRead={() => handleMarkSingleAsRead(notif.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {readNotifs.length > 0 && (
              <div>
                <h3 className="text-[13px] font-semibold text-gray-400 tracking-tight mb-3 pl-2 mt-2">
                  Sudah dibaca
                </h3>
                <div className="flex flex-col gap-3">
                  {readNotifs.map((notif) => (
                    <NotificationCard
                      key={notif.id}
                      notif={notif}
                      style={getNotifStyle(notif.type, true)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}
