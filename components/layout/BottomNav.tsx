"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiGrid, FiSettings, FiClock, FiUser, FiPlus } from "react-icons/fi";

export default function BottomNav() {
  const pathname = usePathname();

  const getIconClass = (path: string) =>
    `flex flex-col items-center justify-center gap-1 transition-colors duration-200 ${
      pathname === path ? "text-[#1A201C]" : "text-gray-400 hover:text-gray-600"
    }`;

  return (
    <div className="fixed bottom-6 left-0 w-full flex justify-center z-50 pointer-events-none px-5">
      <div className="w-full max-w-[360px] bg-white/95 backdrop-blur-xl border border-gray-100/50 rounded-[2rem] h-[75px] flex items-center shadow-[0_10px_40px_rgba(0,0,0,0.05)] relative pointer-events-auto px-6">
        <div className="flex-1 flex justify-between pr-7">
          <Link href="/" className={getIconClass("/")}>
            <FiGrid className="text-[22px]" />
            <span className="text-[10px] font-bold tracking-tight mt-0.5">
              Home
            </span>
          </Link>
          <Link href="/history" className={getIconClass("/history")}>
            <FiClock className="text-[22px]" />
            <span className="text-[10px] font-bold tracking-tight mt-0.5">
              History
            </span>
          </Link>
        </div>

        <div className="absolute left-1/2 -top-5 -translate-x-1/2">
          <Link
            href="/claim"
            className="w-[50px] h-[50px] rounded-full bg-[#1A201C] flex items-center justify-center shadow-xl shadow-black/20 text-white hover:scale-105 active:scale-95 transition-all"
            title="Tambah Alat Baru"
          >
            <FiPlus className="text-[25px]" />
          </Link>
        </div>

        <div className="flex-1 flex justify-between pl-7">
          <Link href="/profile" className={getIconClass("/profile")}>
            <FiUser className="text-[22px]" />
            <span className="text-[10px] font-bold tracking-tight mt-0.5">
              Profile
            </span>
          </Link>
          <Link href="/settings" className={getIconClass("/settings")}>
            <FiSettings className="text-[22px]" />
            <span className="text-[10px] font-bold tracking-tight mt-0.5">
              Settings
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
