import {
  MdOutlineArrowCircleDown,
  MdOutlineArrowCircleUp,
  MdAutoMode,
} from "react-icons/md";

interface DeviceControlsProps {
  isAuto: boolean;
  loading: boolean;
  onControl: (command: "MASUK" | "KELUAR" | "AUTO_ON" | "AUTO_OFF") => void;
}

export default function DeviceControls({
  isAuto,
  loading,
  onControl,
}: DeviceControlsProps) {
  return (
    <div className="bg-white rounded-[2rem] p-4 shadow-sm flex justify-between items-center -mt-4 relative z-10 mx-2 border border-gray-50">
      <button
        onClick={() => onControl("KELUAR")}
        disabled={loading || isAuto}
        className={`flex flex-col items-center gap-2 flex-1 transition-all duration-300 ${
          isAuto
            ? "opacity-25 cursor-not-allowed"
            : "hover:opacity-70 cursor-pointer"
        }`}
      >
        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
          <MdOutlineArrowCircleUp className="text-2xl text-gray-700" />
        </div>
        <span className="text-xs font-semibold text-gray-600 tracking-tight">
          Jemur
        </span>
      </button>

      <div className="w-[1px] h-10 bg-gray-100"></div>

      <button
        onClick={() => onControl("MASUK")}
        disabled={loading || isAuto}
        className={`flex flex-col items-center gap-2 flex-1 transition-all duration-300 ${
          isAuto
            ? "opacity-25 cursor-not-allowed"
            : "hover:opacity-70 cursor-pointer"
        }`}
      >
        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
          <MdOutlineArrowCircleDown className="text-2xl text-gray-700" />
        </div>
        <span className="text-xs font-semibold text-gray-600 tracking-tight">
          Teduh
        </span>
      </button>

      <div className="w-[1px] h-10 bg-gray-100"></div>

      <button
        onClick={() => onControl(isAuto ? "AUTO_OFF" : "AUTO_ON")}
        disabled={loading}
        className="flex flex-col items-center gap-2 flex-1 hover:opacity-70 transition cursor-pointer"
      >
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300 ${
            isAuto
              ? "bg-[#89D4FF]/20 border-[#89D4FF]/40 text-[#44ACFF]"
              : "bg-gray-100 border-gray-300 text-gray-400"
          }`}
        >
          <MdAutoMode className="text-2xl" />
        </div>
        <span
          className={`text-xs font-bold tracking-tight transition-colors duration-300 ${
            isAuto ? "text-[#44ACFF]" : "text-gray-400"
          }`}
        >
          {isAuto ? "Auto: ON" : "Auto: OFF"}
        </span>
      </button>
    </div>
  );
}
