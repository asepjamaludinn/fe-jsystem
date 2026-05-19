"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AxiosError } from "axios";
import { loginUser } from "@/services/authService";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ApiErrorResponse } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = "Email tidak boleh kosong";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email =
        "Format email tidak valid (harus mengandung @ dan domain)";

    if (!password) newErrors.password = "Kata sandi tidak boleh kosong";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    try {
      const response = await loginUser({ email, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userName", response.data.name);
      router.push("/");
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;

      setErrors({
        general:
          error.response?.data?.error ||
          "Gagal masuk, periksa kembali data Anda.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 px-8 flex flex-col justify-center min-h-screen relative">
      <div className="w-full max-w-sm mx-auto">
        <div className="mb-10 text-center animate-in fade-in slide-in-from-top-4 duration-500">
          <h1 className="text-3xl font-extrabold tracking-tighter text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-xs font-medium text-gray-400 tracking-tight max-w-[240px] mx-auto leading-relaxed">
            Masuk untuk memantau dan mengontrol ekosistem jemuran pintar Anda
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-white rounded-[2.5rem] p-6 shadow-[0_20px_40px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-6 duration-500"
        >
          {errors.general && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold text-center border border-red-100">
              {errors.general}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Input
              label="Alamat Email"
              type="email"
              placeholder="Nama@email.com"
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
            <Input
              label="Kata Sandi"
              type="password"
              placeholder="Masukkan kata sandi"
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />
          </div>

          <Button isLoading={isLoading} loadingText="Proses Masuk...">
            Masuk Sistem
          </Button>
        </form>

        <p className="text-center text-xs font-semibold text-gray-400 mt-8 animate-in fade-in duration-700">
          Belum memiliki akun administrator?{" "}
          <Link
            href="/register"
            className="text-gray-900 font-extrabold hover:underline tracking-tight ml-0.5"
          >
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </main>
  );
}
