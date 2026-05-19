"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AxiosError } from "axios";
import { registerUser } from "@/services/authService";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ApiErrorResponse } from "@/types";
import { FiCheckCircle } from "react-icons/fi";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!form.name || form.name.length < 3)
      newErrors.name = "Nama minimal 3 karakter";
    if (!form.email) newErrors.email = "Email tidak boleh kosong";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Format email tidak valid";
    if (!form.password || form.password.length < 6)
      newErrors.password = "Kata sandi minimal 6 karakter";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    try {
      await registerUser(form);
      setIsSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      setErrors({
        general: error.response?.data?.error || "Gagal melakukan registrasi",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <main className="flex-1 px-8 flex flex-col justify-center items-center min-h-screen relative">
        <div className="w-16 h-16 rounded-full bg-green-50 text-green-500 flex items-center justify-center mb-5 border border-green-100/50 shadow-inner animate-in zoom-in duration-500">
          <FiCheckCircle className="text-3xl animate-bounce" />
        </div>
        <h2 className="text-2xl font-extrabold tracking-tighter text-gray-900 mb-2">
          Registrasi Berhasil!
        </h2>
        <p className="text-xs font-medium text-gray-400">
          Mengarahkan ke halaman login...
        </p>
      </main>
    );
  }

  return (
    <main className="flex-1 px-8 flex flex-col justify-center min-h-screen relative">
      <div className="w-full max-w-sm mx-auto">
        <div className="mb-10 text-center animate-in fade-in slide-in-from-top-4 duration-500">
          <h1 className="text-3xl font-extrabold tracking-tighter text-gray-900 mb-2">
            Buat Akun
          </h1>
          <p className="text-xs font-medium text-gray-400 tracking-tight max-w-[240px] mx-auto leading-relaxed">
            Daftarkan perangkat baru dan lindungi pakaian Anda dari anomali
            cuaca
          </p>
        </div>

        <form
          onSubmit={handleRegister}
          className="bg-white rounded-[2.5rem] p-6 shadow-[0_20px_40px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-6 duration-500"
        >
          {errors.general && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold text-center border border-red-100">
              {errors.general}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Input
              label="Nama Lengkap"
              type="text"
              placeholder="Masukkan nama Anda"
              disabled={isLoading}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={errors.name}
            />
            <Input
              label="Alamat Email"
              type="email"
              placeholder="Nama@email.com"
              disabled={isLoading}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email}
            />
            <Input
              label="Kata Sandi Baru"
              type="password"
              placeholder="Minimal 6 karakter"
              disabled={isLoading}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={errors.password}
            />
          </div>

          <Button isLoading={isLoading} loadingText="Mendaftarkan...">
            Daftar Akun
          </Button>
        </form>

        <p className="text-center text-xs font-semibold text-gray-400 mt-8 animate-in fade-in duration-700">
          Sudah memiliki akun administrator?{" "}
          <Link
            href="/login"
            className="text-gray-900 font-extrabold hover:underline tracking-tight ml-0.5"
          >
            Masuk Sekarang
          </Link>
        </p>
      </div>
    </main>
  );
}
