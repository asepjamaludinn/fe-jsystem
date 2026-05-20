"use client";

import Image from "next/image";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { FiUsers } from "react-icons/fi";
import { NAMA_KELOMPOK, TEAM_MEMBERS } from "@/constants/team";

export default function ProfilePage() {
  return (
    <main className="flex-1 px-6 pt-12 pb-32 flex flex-col relative min-h-screen">
      <Header />

      <div className="mt-8 mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#44ACFF]/10 flex items-center justify-center text-[#44ACFF]">
            <FiUsers className="text-xl" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-[#44ACFF] tracking-[0.2em]">
              Identitas Tim
            </p>
            <h2 className="text-2xl font-extrabold tracking-tighter text-gray-900">
              {NAMA_KELOMPOK}
            </h2>
          </div>
        </div>
        <p className="text-[13px] font-medium text-gray-500 tracking-tight leading-relaxed pl-1">
          Pengembang sistem IoT Jemuran Pintar.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {TEAM_MEMBERS.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100 flex flex-col items-center text-center transition-all duration-300 group hover:shadow-md"
          >
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-50 mb-3 relative border-2 border-gray-100 group-hover:scale-105 transition-transform duration-300">
              <Image
                src={member.avatar}
                alt={member.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>

            <h3 className="text-[13px] font-extrabold tracking-tight text-gray-900 line-clamp-1 w-full">
              {member.name}
            </h3>

            <p className="text-[10px] font-bold text-gray-400 tracking-widest mt-1 mb-4 line-clamp-1 w-full">
              {member.nim}
            </p>
          </div>
        ))}
      </div>

      <BottomNav />
    </main>
  );
}
