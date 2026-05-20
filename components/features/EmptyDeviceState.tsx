import Link from "next/link";
import { FiCpu, FiPlus } from "react-icons/fi";

export default function EmptyDeviceState() {
  return (
    <div className="flex flex-col items-center justify-center mt-12 bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 animate-in fade-in zoom-in-95 duration-500 text-center">
      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
        <FiCpu className="text-4xl" />
      </div>
      <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mb-2">
        Belum Ada Perangkat
      </h2>
      <p className="text-xs font-medium text-gray-400 tracking-tight leading-relaxed mb-8">
        Anda belum menambahkan ESP32 Jemuran Pintar ke akun ini. Silakan klaim
        perangkat untuk mulai memonitor cuaca.
      </p>
      <Link
        href="/claim"
        className="flex items-center gap-2 px-6 py-4 bg-[#1A201C] text-white rounded-full text-xs font-extrabold tracking-tight hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10"
      >
        <FiPlus className="text-base" />
        TAMBAH PERANGKAT BARU
      </Link>
    </div>
  );
}
