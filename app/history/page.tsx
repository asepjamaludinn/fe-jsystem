"use client";

import { useState, useRef, useEffect } from "react";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import SwipeableLogCard from "./components/SwipeableLogCard";
import { useDeviceHistory } from "@/hooks/useDeviceHistory";
import { FiSearch, FiFilter, FiCalendar, FiX } from "react-icons/fi";
import { getLogStyle } from "@/utils/themeMapping";

export default function HistoryPage() {
  const { logs, isLoading, handleDeleteLog } = useDeviceHistory();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "Semua" | "Cuaca" | "Keamanan"
  >("Semua");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredLogs = logs.filter((log) => {
    const style = getLogStyle(log);
    const matchFilter =
      activeFilter === "Semua" || style.category === activeFilter;
    const query = searchQuery.toLowerCase();
    const matchSearch =
      style.title.toLowerCase().includes(query) ||
      style.desc.toLowerCase().includes(query);

    let matchDate = true;
    if (selectedDate) {
      const logDate = new Date(log.createdAt).toISOString().split("T")[0];
      matchDate = logDate === selectedDate;
    }
    return matchFilter && matchSearch && matchDate;
  });

  return (
    <main className="flex-1 px-6 pt-12 pb-32 flex flex-col relative min-h-screen">
      <Header />

      <div className="mt-6 mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-3 relative" ref={dropdownRef}>
          <div className="relative flex-1 group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg group-focus-within:text-[#44ACFF] transition-colors" />
            <input
              type="text"
              placeholder="Cari kejadian..."
              className="w-full pl-11 pr-4 py-3.5 rounded-[1.2rem] bg-white border border-gray-100 focus:outline-none focus:border-[#44ACFF]/50 transition-all text-[13px] font-medium shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center justify-center gap-2 px-4 py-3.5 rounded-[1.2rem] transition-all duration-300 border shadow-sm cursor-pointer active:scale-95 ${
              activeFilter !== "Semua"
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-600 border-gray-100 hover:bg-gray-50"
            }`}
          >
            <FiFilter className="text-lg" />
            <span className="text-[13px] font-semibold tracking-tight hidden sm:block">
              Filter
            </span>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-48 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Kategori
                </span>
              </div>
              <ul className="flex flex-col py-1">
                {(["Semua", "Cuaca", "Keamanan"] as const).map((filter) => (
                  <li key={filter}>
                    <button
                      onClick={() => {
                        setActiveFilter(filter);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-[13px] font-semibold tracking-tight transition-colors cursor-pointer ${
                        activeFilter === filter
                          ? "bg-blue-50/50 text-[#44ACFF]"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {filter}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Date Picker */}
        <div className="relative mt-3 flex items-center gap-3">
          <div className="relative flex-1 group">
            <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg z-10 group-focus-within:text-[#44ACFF] transition-colors" />
            <input
              type="date"
              className="w-full pl-11 pr-4 py-3.5 rounded-[1.2rem] bg-white border border-gray-100 focus:outline-none focus:border-[#44ACFF]/50 transition-all text-[13px] font-medium shadow-sm text-gray-600 cursor-pointer appearance-none"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          {selectedDate && (
            <button
              onClick={() => setSelectedDate("")}
              className="w-[52px] h-[52px] rounded-[1.2rem] bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors border border-red-100 shadow-sm cursor-pointer active:scale-95"
              title="Reset Tanggal"
            >
              <FiX className="text-xl" />
            </button>
          )}
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-end mb-4 px-1">
          <h2 className="text-xl font-semibold tracking-tight text-gray-900">
            Riwayat aktivitas
          </h2>
          <span className="text-[11px] font-semibold text-gray-400 tracking-tight">
            {filteredLogs.length} hasil
          </span>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-[1.5rem] p-4 h-24 animate-pulse border border-gray-100 shadow-sm"
              ></div>
            ))}
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center justify-center bg-white/60 rounded-[2rem] border border-dashed border-gray-200 backdrop-blur-sm transition-all">
            <p className="text-gray-400 text-[13px] font-medium tracking-tight">
              Tidak ada aktivitas yang sesuai.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            {filteredLogs.map((log) => (
              <SwipeableLogCard
                key={log.id}
                log={log}
                style={getLogStyle(log)}
                onDelete={handleDeleteLog}
              />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}
