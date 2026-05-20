"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiWifi,
  FiAlertTriangle,
} from "react-icons/fi";
import { api } from "@/services/api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useDeviceStore } from "@/store/useDeviceStore";
import { AxiosError } from "axios";
import { ApiErrorResponse, ClaimedData } from "@/types";

export default function ClaimDevicePage() {
  const router = useRouter();
  const [serialNumber, setSerialNumber] = useState("");
  const [name, setName] = useState("");
  const [locationCity, setLocationCity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [claimedData, setClaimedData] = useState<ClaimedData | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow =
      isSuccessModalOpen || errorMessage !== null ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSuccessModalOpen, errorMessage]);

  const { fetchDevice } = useDeviceStore();

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post("/device/claim", {
        serialNumber,
        name,
        locationCity,
      });
      setClaimedData({
        serialNumber: response.data.device.serialNumber,
        status: response.data.device.status,
        isShared: response.data.isShared,
      });

      await fetchDevice();
      setIsSuccessModalOpen(true);
      setTimeout(() => router.push("/"), 3500);
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      // Mengubah state errorMessage, bukan memanggil alert browser
      setErrorMessage(error.response?.data?.error || "Gagal menambahkan alat");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 px-8 pt-12 flex flex-col min-h-screen relative selection:bg-[#44ACFF]/20">
      <button
        onClick={() => router.back()}
        disabled={isLoading || isSuccessModalOpen || errorMessage !== null}
        className="w-10 h-10 rounded-full bg-white shadow-[0_4px_12_rgba(0,0,0,0.02)] flex items-center justify-center border border-gray-100/50 mb-6 hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
      >
        <FiArrowLeft className="text-lg text-gray-700" />
      </button>

      <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-3xl font-extrabold tracking-tighter text-gray-900 mb-2">
          Claim Device
        </h1>
        <p className="text-xs font-medium text-gray-400 tracking-tight leading-relaxed">
          Masukkan Serial Number yang terdapat pada stiker mesin ESP32 Jemuran
          Pintar Anda
        </p>
      </div>

      <form
        onSubmit={handleClaim}
        className="bg-white rounded-[2.5rem] p-6 shadow-[0_25px_60px_rgba(68,172,255,0.05)] border border-gray-100/80 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-6 duration-500"
      >
        <div className="flex flex-col gap-3">
          <Input
            label="Serial Number Perangkat"
            type="text"
            placeholder="Contoh: SN-1010"
            required
            disabled={isLoading || isSuccessModalOpen}
            className="uppercase"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value.toUpperCase())}
          />
          <Input
            label="Nama Jemuran"
            type="text"
            placeholder="Contoh: Jemuran Balkon Utama"
            required
            disabled={isLoading || isSuccessModalOpen}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Lokasi Kota (Untuk Cuaca)"
            type="text"
            placeholder="Contoh: Bandung"
            required
            disabled={isLoading || isSuccessModalOpen}
            value={locationCity}
            onChange={(e) => setLocationCity(e.target.value)}
          />
        </div>

        <Button isLoading={isLoading} loadingText="Memverifikasi...">
          Tambahkan Alat Baru
        </Button>
      </form>

      {/* --- MODAL SUKSES --- */}
      <Modal
        isOpen={isSuccessModalOpen && claimedData !== null}
        closeOnOutsideClick={false}
      >
        <div className="flex flex-col items-center justify-center py-4 animate-in zoom-in-95 fade-in duration-300">
          <div className="w-16 h-16 rounded-full bg-green-50 text-green-500 flex items-center justify-center mb-5 border border-green-100/50 shadow-inner">
            <FiCheckCircle className="text-3xl animate-bounce" />
          </div>
          <h4 className="font-extrabold tracking-tighter text-gray-900 text-[22px] text-center leading-tight">
            {claimedData?.isShared ? "Akses Diberikan!" : "Alat Ditambahkan!"}
          </h4>
          <p className="text-xs font-medium text-gray-400 tracking-tight mt-1.5 text-center max-w-[220px]">
            {claimedData?.isShared
              ? "Perangkat ini terdeteksi sebagai alat keluarga Anda."
              : "Jemuran pintar Anda kini siap dikendalikan."}
          </p>

          <div className="mt-6 flex items-center justify-between w-full bg-gray-50 border border-gray-100 p-3 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100/50">
                <FiWifi className="text-gray-400 text-sm" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-gray-400 tracking-widest uppercase">
                  ID Perangkat
                </span>
                <span className="text-sm font-bold text-gray-800 tracking-tight uppercase">
                  {claimedData?.serialNumber}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100/50 rounded-lg border border-green-200/50">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[10px] font-bold text-green-600 tracking-tight uppercase">
                {claimedData?.status === "online" ? "Tersambung" : "Offline"}
              </span>
            </div>
          </div>
        </div>
      </Modal>

      {/* --- MODAL ERROR --- */}
      <Modal
        isOpen={errorMessage !== null}
        onClose={() => setErrorMessage(null)}
      >
        <div className="flex flex-col items-center justify-center py-4 animate-in zoom-in-95 fade-in duration-300">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-5 border border-red-100/50 shadow-inner">
            <FiAlertTriangle className="text-3xl animate-pulse" />
          </div>
          <h4 className="font-extrabold tracking-tighter text-gray-900 text-[22px] text-center leading-tight">
            Klaim Gagal
          </h4>
          <p className="text-xs font-medium text-gray-400 tracking-tight mt-1.5 text-center max-w-[220px]">
            {errorMessage}
          </p>

          <div className="mt-6 w-full">
            <Button variant="secondary" onClick={() => setErrorMessage(null)}>
              Tutup
            </Button>
          </div>
        </div>
      </Modal>
    </main>
  );
}
