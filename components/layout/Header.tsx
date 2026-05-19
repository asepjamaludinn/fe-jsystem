"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiBell } from "react-icons/fi";
import { api } from "@/services/api";

export default function Header() {
  const [userName, setUserName] = useState("User");
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const storedAvatar = localStorage.getItem("userAvatar");
    if (storedName) setUserName(storedName);
    if (storedAvatar) setUserAvatar(storedAvatar);

    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/profile");
        const userData = res.data.data;

        setUserName(userData.name || "User");
        setUserAvatar(userData.avatarUrl);

        localStorage.setItem("userName", userData.name || "User");
        if (userData.avatarUrl) {
          localStorage.setItem("userAvatar", userData.avatarUrl);
        }
      } catch (error) {
        console.error("Gagal memuat profil header:", error);
      }
    };

    fetchProfile();
  }, []);

  const isNotificationPage = pathname === "/notifications";
  const finalAvatarUrl = userAvatar || "/images/default-avatar.png";

  return (
    <header className="flex justify-between items-center w-full mb-6 animate-in fade-in duration-500 relative z-50">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-white border-2 border-white shadow-sm flex-shrink-0 relative">
          <Image
            src={finalAvatarUrl}
            alt="Avatar"
            fill
            sizes="48px"
            className="object-cover"
            priority
            unoptimized
          />
        </div>

        <div className="flex flex-col">
          <p className="text-[13px] font-medium text-gray-500 tracking-tight leading-none">
            Halo,
          </p>
          <h1 className="text-lg font-extrabold text-gray-900 tracking-tighter line-clamp-1 capitalize mt-1">
            {userName}
          </h1>
        </div>
      </div>

      {!isNotificationPage ? (
        <Link
          href="/notifications"
          className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center relative hover:bg-gray-50 active:scale-95 transition-all flex-shrink-0 border border-gray-100/50 cursor-pointer"
        >
          <FiBell className="text-xl text-gray-700" />
          <span className="absolute top-2 right-2.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 border border-white"></span>
          </span>
        </Link>
      ) : (
        <div className="w-10 h-10 flex-shrink-0"></div>
      )}
    </header>
  );
}
