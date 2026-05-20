import { useState, useRef, ReactNode } from "react";
import { format } from "date-fns";
import { id as dateLocale } from "date-fns/locale";
import { FiTrash2 } from "react-icons/fi";
import { SensorLog } from "@/types";

export interface LogStyleData {
  category: string;
  title: string;
  desc: string;
  icon: ReactNode;
  bg: string;
}

interface Props {
  log: SensorLog;
  style: LogStyleData;
  onDelete: (id: string) => void;
}

export default function SwipeableLogCard({ log, style, onDelete }: Props) {
  const [offset, setOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const MAX_SWIPE = -80;

  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    currentXRef.current = e.touches[0].clientX;
    const diff = currentXRef.current - startXRef.current;
    if (diff < 0) setOffset(Math.max(diff, MAX_SWIPE - 20));
    else if (diff > 0 && offset < 0) setOffset(Math.min(offset + diff, 0));
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
    if (offset < MAX_SWIPE / 2) setOffset(MAX_SWIPE);
    else setOffset(0);
  };

  return (
    <div className="relative overflow-hidden rounded-[1.5rem] group bg-red-50 border border-red-100 shadow-sm">
      <div className="absolute inset-y-0 right-0 w-[80px] flex items-center justify-center">
        <button
          onClick={() => onDelete(log.id)}
          className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center cursor-pointer active:scale-90 transition-transform hover:bg-red-600 shadow-md"
        >
          <FiTrash2 className="text-lg" />
        </button>
      </div>

      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ transform: `translateX(${offset}px)` }}
        className={`relative bg-white rounded-[1.5rem] p-4 flex flex-col gap-3 group border border-gray-100/80 shadow-sm touch-pan-y ${isSwiping ? "" : "transition-transform duration-300 ease-out"}`}
      >
        <div className="flex items-start gap-4 pointer-events-none">
          <div
            className={`w-12 h-12 rounded-[1.2rem] border flex items-center justify-center flex-shrink-0 ${style.bg}`}
          >
            {style.icon}
          </div>
          <div className="flex flex-col flex-1 pt-0.5">
            <div className="flex justify-between items-start">
              <h4 className="font-semibold tracking-tight text-gray-900 text-[13px]">
                {style.title}
              </h4>
              <span className="text-[10px] font-semibold text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                {format(new Date(log.createdAt), "dd MMM, HH:mm", {
                  locale: dateLocale,
                })}
              </span>
            </div>
            <p className="text-[12px] font-medium text-gray-500 tracking-tight mt-1 leading-relaxed">
              {style.desc}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 pt-2 mt-1 border-t border-gray-50 overflow-x-auto scrollbar-hide whitespace-nowrap pointer-events-none">
          <span className="text-[10px] font-medium text-gray-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#44ACFF]"></span>{" "}
            Sensor air:{" "}
            <strong className="text-gray-700">{log.hujanADC}</strong>
          </span>
          <span className="w-1 h-1 rounded-full bg-gray-200"></span>
          <span className="text-[10px] font-medium text-gray-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>{" "}
            Cahaya:{" "}
            <strong className="text-gray-700">
              {log.ldrADC === 0 ? "Terang" : "Gelap"}
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
}
