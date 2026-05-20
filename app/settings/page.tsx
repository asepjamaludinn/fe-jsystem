"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/types";

import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { useDeviceStore } from "@/store/useDeviceStore";
import { toggleNightMode, unclaimDevice } from "@/services/deviceService";
import { uploadAvatar } from "@/services/authService";
import { api } from "@/services/api";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

import EditNameModal from "./components/EditNameModal";
import ChangePasswordModal from "./components/ChangePasswordModal";
import LogoutModal from "./components/LogoutModal";
import AvatarSuccessModal from "./components/AvatarSuccessModal";

import {
  FiMoon,
  FiSmartphone,
  FiLogOut,
  FiLock,
  FiChevronRight,
  FiCamera,
  FiEdit2,
  FiLoader,
  FiTrash2,
  FiAlertTriangle,
} from "react-icons/fi";

export default function SettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { deviceId, deviceData, fetchDevice } = useDeviceStore();
  const [isNightMode, setIsNightMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [userName, setUserName] = useState("User");
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);
  const [isAvatarSuccess, setIsAvatarSuccess] = useState(false);

  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isUnclaimModalOpen, setIsUnclaimModalOpen] = useState(false);
  const [isUnclaiming, setIsUnclaiming] = useState(false);

  const [globalError, setGlobalError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await api.get("/auth/profile");
        const userData = res.data.data;
        setUserName(userData.name || "User");
        setUserAvatar(userData.avatarUrl);
        localStorage.setItem("userName", userData.name || "User");
      } catch (error) {
        console.error("Gagal mengambil profil:", error);
      }
    };
    fetchProfileData();

    if (!deviceId) fetchDevice();
  }, []);

  useEffect(() => {
    if (deviceData) setIsNightMode(deviceData.nightModeEnabled);
  }, [deviceData]);

  useEffect(() => {
    document.body.style.overflow =
      isNameModalOpen ||
      isPassModalOpen ||
      isLogoutModalOpen ||
      isAvatarSuccess ||
      isUnclaimModalOpen ||
      globalError
        ? "hidden"
        : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [
    isNameModalOpen,
    isPassModalOpen,
    isLogoutModalOpen,
    isAvatarSuccess,
    isUnclaimModalOpen,
    globalError,
  ]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type))
      return setGlobalError("Hanya format JPG atau PNG yang diperbolehkan!");
    if (file.size > 2 * 1024 * 1024)
      return setGlobalError("Ukuran file terlalu besar! Maksimal 2MB.");

    const formData = new FormData();
    formData.append("avatar", file);
    setIsAvatarLoading(true);
    try {
      const res = await uploadAvatar(formData);
      setUserAvatar(res.data.avatarUrl);
      localStorage.setItem("userAvatar", res.data.avatarUrl);
      setIsAvatarSuccess(true);
      setTimeout(() => setIsAvatarSuccess(false), 2000);
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      setGlobalError(
        error.response?.data?.error || "Gagal mengunggah foto profil.",
      );
    } finally {
      setIsAvatarLoading(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleToggleNightMode = async () => {
    if (!deviceId) return setGlobalError("Tidak ada perangkat yang terhubung!");
    setIsLoading(true);
    try {
      const newState = !isNightMode;
      setIsNightMode(newState);
      await toggleNightMode(deviceId, newState);
      await fetchDevice();
    } catch (error) {
      setIsNightMode(!isNightMode);
      setGlobalError("Gagal menghubungi server untuk mengubah mode malam!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnclaimDevice = async () => {
    if (!deviceId) return;
    setIsUnclaiming(true);
    try {
      await unclaimDevice(deviceId);
      setIsUnclaimModalOpen(false);
      await fetchDevice();
    } catch (error) {
      const err = error as AxiosError<ApiErrorResponse>;
      setGlobalError(err.response?.data?.error || "Gagal menghapus perangkat");
    } finally {
      setIsUnclaiming(false);
    }
  };

  const finalAvatarUrl = userAvatar || "/images/default-avatar.png";

  return (
    <main className="flex-1 px-6 pt-12 pb-32 flex flex-col relative min-h-screen">
      <Header />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/jpg"
        className="hidden"
      />

      <div className="mt-8 flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div
          className="relative w-28 h-28 mb-4 group cursor-pointer active:scale-95 transition-transform duration-300 ease-out"
          onClick={() => fileInputRef.current?.click()}
        >
          <div
            className={`w-full h-full rounded-full bg-white border-4 border-white shadow-md group-hover:shadow-lg transition-all duration-300 relative ${isAvatarLoading ? "p-1" : "overflow-hidden"}`}
          >
            {isAvatarLoading ? (
              <div className="w-full h-full rounded-full bg-gray-50 flex items-center justify-center text-[#44ACFF]">
                <FiLoader className="text-3xl animate-spin" />
              </div>
            ) : (
              <Image
                src={finalAvatarUrl}
                alt="Profile Avatar"
                fill
                sizes="112px"
                className="object-cover group-hover:opacity-90 transition-opacity"
                priority
                unoptimized
              />
            )}
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#1A201C] text-white flex items-center justify-center shadow-lg border-2 border-white pointer-events-none">
            <FiCamera className="text-[13px]" />
          </button>
        </div>
        <div
          onClick={() => setIsNameModalOpen(true)}
          className="flex items-center gap-2 cursor-pointer group px-4 py-1.5 rounded-xl hover:bg-white/60 active:scale-95 transition-all"
        >
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 group-hover:text-[#44ACFF]">
            {userName}
          </h2>
          <FiEdit2 className="text-gray-400 group-hover:text-[#44ACFF] text-sm" />
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
        <div>
          <h3 className="text-[13px] font-semibold text-gray-400 tracking-tight mb-3 pl-2">
            Informasi perangkat
          </h3>
          <div className="bg-white rounded-[1.5rem] p-5 shadow-sm flex flex-col gap-4 border border-gray-100">
            {deviceId ? (
              <>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-blue-50/50 flex items-center justify-center text-[#44ACFF] border border-blue-100/50">
                    <FiSmartphone className="text-xl" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold tracking-tight text-gray-900 uppercase">
                      {deviceData?.serialNumber}
                    </p>
                    <p className="text-[12px] font-medium text-gray-500 tracking-tight mt-0.5 line-clamp-1">
                      {deviceData?.name}
                    </p>
                  </div>
                  <div className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[10px] font-bold tracking-tight border border-emerald-100">
                    ONLINE
                  </div>
                </div>
                <div className="w-full h-[1px] bg-gray-50 my-1"></div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-medium">
                    Lokasi operasi
                  </span>
                  <span className="text-xs font-semibold text-gray-900">
                    {deviceData?.locationCity}, ID
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-medium">
                    Versi firmware
                  </span>
                  <span className="text-xs font-semibold text-gray-900">
                    v1.0.2 (Stable)
                  </span>
                </div>
                <div className="w-full h-[1px] bg-gray-50 my-1"></div>
                <button
                  onClick={() => setIsUnclaimModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 font-bold text-[12px] transition-colors cursor-pointer active:scale-95"
                >
                  <FiTrash2 className="text-sm" /> Hapus Perangkat
                </button>
              </>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4 font-medium tracking-tight">
                Belum ada perangkat terhubung.
              </p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-[13px] font-semibold text-gray-400 tracking-tight mb-3 pl-2">
            Kontrol keamanan
          </h3>
          <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-500 border ${isNightMode ? "bg-gray-900 text-white border-gray-800" : "bg-gray-50 text-gray-400 border-gray-100"}`}
              >
                <FiMoon className="text-xl" />
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-semibold tracking-tight text-gray-900">
                  Mode malam
                </p>
                <p className="text-[12px] font-medium text-gray-500 tracking-tight mt-0.5 max-w-[180px]">
                  Sensor gerak & alarm aktif.
                </p>
              </div>
            </div>
            <button
              onClick={handleToggleNightMode}
              disabled={isLoading || !deviceId}
              className={`cursor-pointer relative w-14 h-7 rounded-full transition-all duration-300 ease-out ${isNightMode ? "bg-[#44ACFF] shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]" : "bg-gray-200 shadow-inner"} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <span
                className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full transition-transform duration-300 ease-out shadow-sm ${isNightMode ? "transform translate-x-7" : ""}`}
              ></span>
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-[13px] font-semibold text-gray-400 tracking-tight mb-3 pl-2">
            Manajemen akun
          </h3>
          <div className="bg-white rounded-[1.5rem] p-3 shadow-sm flex flex-col border border-gray-100">
            <button
              onClick={() => setIsPassModalOpen(true)}
              className="flex items-center justify-between w-full text-left group transition-all duration-300 cursor-pointer hover:bg-gray-50 p-2 rounded-xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 text-gray-500 flex items-center justify-center group-hover:border-gray-300 shadow-sm">
                  <FiLock className="text-lg" />
                </div>
                <p className="text-[13px] font-semibold text-gray-900">
                  Ganti password
                </p>
              </div>
              <FiChevronRight className="text-gray-400 group-hover:translate-x-1 transition-transform mr-2" />
            </button>
            <div className="w-[calc(100%-1rem)] mx-auto h-[1px] bg-gray-50 my-1"></div>
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="flex items-center gap-4 w-full text-left group transition-all duration-300 cursor-pointer hover:bg-red-50 p-2 rounded-xl"
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-red-50 text-red-400 flex items-center justify-center group-hover:border-red-200 group-hover:text-red-500 shadow-sm">
                <FiLogOut className="text-lg" />
              </div>
              <p className="text-[13px] font-semibold text-red-500 group-hover:text-red-600">
                Keluar aplikasi
              </p>
            </button>
          </div>
        </div>
      </div>

      <AvatarSuccessModal isOpen={isAvatarSuccess} />
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />
      <EditNameModal
        isOpen={isNameModalOpen}
        onClose={() => setIsNameModalOpen(false)}
        currentName={userName}
        onSuccess={(newName) => setUserName(newName)}
      />
      <ChangePasswordModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
      />

      <Modal
        isOpen={isUnclaimModalOpen}
        onClose={() => !isUnclaiming && setIsUnclaimModalOpen(false)}
      >
        <div className="text-center pt-2">
          <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4 border border-red-100/50">
            <FiAlertTriangle className="text-3xl" />
          </div>
          <h3 className="font-semibold text-gray-900 text-xl tracking-tight">
            Hapus Perangkat?
          </h3>
          <p className="text-[13px] font-medium text-gray-400 mt-1.5 leading-relaxed">
            Perangkat akan dilepas dari akun ini. Histori data akan tetap aman,
            namun Anda tidak bisa memantaunya lagi.
          </p>
        </div>
        <div className="flex gap-3 mt-6">
          <Button
            variant="secondary"
            onClick={() => setIsUnclaimModalOpen(false)}
            disabled={isUnclaiming}
          >
            Batal
          </Button>
          <Button
            variant="danger"
            onClick={handleUnclaimDevice}
            isLoading={isUnclaiming}
            loadingText="Menghapus..."
          >
            Ya, Hapus
          </Button>
        </div>
      </Modal>

      <Modal isOpen={globalError !== null} onClose={() => setGlobalError(null)}>
        <div className="text-center pt-2">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-4 border border-amber-100/50">
            <FiAlertTriangle className="text-3xl" />
          </div>
          <h3 className="font-semibold text-gray-900 text-xl tracking-tight">
            Terjadi Kesalahan
          </h3>
          <p className="text-[13px] font-medium text-gray-400 mt-1.5 leading-relaxed">
            {globalError}
          </p>
        </div>
        <div className="mt-6 w-full">
          <Button variant="secondary" onClick={() => setGlobalError(null)}>
            Tutup
          </Button>
        </div>
      </Modal>

      <BottomNav />
    </main>
  );
}
