import { formatDistanceToNow } from "date-fns";
import { id as dateLocale } from "date-fns/locale";
import { NotificationData } from "@/types";

interface Props {
  notif: NotificationData;
  style: any;
  onRead?: () => void;
}

export default function NotificationCard({ notif, style, onRead }: Props) {
  const isRead = notif.isRead;
  return (
    <div
      onClick={() => {
        if (!isRead && onRead) onRead();
      }}
      className={`rounded-[1.5rem] p-4 flex gap-4 relative transition-all duration-300 ease-out group animate-in fade-in slide-in-from-bottom-2 ${isRead ? "bg-white/40 border border-gray-100 shadow-sm" : "bg-white border border-[#44ACFF]/30 shadow-md cursor-pointer"}`}
    >
      {!isRead && (
        <span className="absolute top-4 right-4 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#44ACFF] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#44ACFF]"></span>
        </span>
      )}
      <div
        className={`w-12 h-12 rounded-[1.2rem] border ${style.bgColor} flex items-center justify-center flex-shrink-0 shadow-sm transition-all duration-300 group-hover:scale-105`}
      >
        {style.icon}
      </div>
      <div
        className={`flex flex-col flex-1 pt-1 ${isRead ? "opacity-70" : "opacity-100"}`}
      >
        <div className="flex justify-between items-center mb-1">
          <span
            className={`text-[12px] font-semibold capitalize tracking-tight ${style.textColor}`}
          >
            {style.label}
          </span>
          <span className="text-[11px] font-semibold text-gray-400 tracking-tight mr-5">
            {formatDistanceToNow(new Date(notif.createdAt), {
              addSuffix: true,
              locale: dateLocale,
            })}
          </span>
        </div>
        <p
          className={`text-[13px] font-medium tracking-tight leading-relaxed pr-2 ${isRead ? "text-gray-500" : "text-gray-900"}`}
        >
          {notif.message}
        </p>
      </div>
    </div>
  );
}
