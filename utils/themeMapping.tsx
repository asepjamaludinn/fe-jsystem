import {
  FiCloudRain,
  FiSun,
  FiMoon,
  FiShield,
  FiAlertTriangle,
  FiActivity,
  FiBell,
  FiInfo,
} from "react-icons/fi";
import { SensorLog } from "@/types";

export const getLogStyle = (log: SensorLog) => {
  if (log.keamanan === "ADA ORANG!") {
    return {
      category: "Keamanan",
      title: "Peringatan keamanan",
      desc: "Terdeteksi pergerakan di area jemuran. Buzzer aktif.",
      icon: <FiAlertTriangle className="text-red-500" />,
      bg: "bg-red-50 border-red-100",
    };
  }
  if (log.keamanan === "Gerakan") {
    return {
      category: "Keamanan",
      title: "Gerakan terdeteksi",
      desc: "Sensor pasif mendeteksi aktivitas mencurigakan.",
      icon: <FiShield className="text-amber-500" />,
      bg: "bg-amber-50 border-amber-100",
    };
  }
  if (log.cuaca === "Hujan") {
    return {
      category: "Cuaca",
      title: "Hujan terdeteksi",
      desc: "Air mengenai sensor hujan. Jemuran ditarik otomatis.",
      icon: <FiCloudRain className="text-[#44ACFF]" />,
      bg: "bg-blue-50 border-blue-100",
    };
  }
  if (log.cuaca === "Cerah") {
    return {
      category: "Cuaca",
      title: "Cuaca cerah",
      desc: "Cahaya matahari optimal. Jemuran dikeluarkan.",
      icon: <FiSun className="text-orange-400" />,
      bg: "bg-orange-50 border-orange-100",
    };
  }
  if (log.cuaca === "Gelap") {
    return {
      category: "Cuaca",
      title: "Kondisi gelap",
      desc: "Minim cahaya. Jemuran ditarik masuk.",
      icon: <FiMoon className="text-indigo-500" />,
      bg: "bg-indigo-50 border-indigo-100",
    };
  }
  return {
    category: "Sistem",
    title: "Pembaruan sistem",
    desc: "Sistem merekam data sensor terkini.",
    icon: <FiActivity className="text-emerald-500" />,
    bg: "bg-emerald-50 border-emerald-100",
  };
};

export const getNotifStyle = (type: string, isRead: boolean) => {
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
