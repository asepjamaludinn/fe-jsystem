import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import { updateProfile } from "@/services/authService";
import { ApiErrorResponse } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FiCheckCircle } from "react-icons/fi";

interface EditNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  onSuccess: (newName: string) => void;
}

export default function EditNameModal({
  isOpen,
  onClose,
  currentName,
  onSuccess,
}: EditNameModalProps) {
  const [inputName, setInputName] = useState(currentName);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (isOpen) {
      setInputName(currentName);
      setIsSuccess(false);
      setError(undefined);
    }
  }, [isOpen, currentName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName.trim()) return setError("Nama tidak boleh kosong");
    if (inputName.trim().length < 3) return setError("Nama minimal 3 karakter");
    if (inputName.trim() === currentName) return onClose();

    setIsLoading(true);
    setError(undefined);
    try {
      const res = await updateProfile({ name: inputName.trim() });
      localStorage.setItem("userName", res.data.name);
      onSuccess(res.data.name);
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
      }, 1800);
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      setError(axiosError.response?.data?.error || "Gagal memperbarui nama");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !isLoading && !isSuccess && onClose()}
    >
      {!isSuccess ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="text-center pt-2">
            <h3 className="font-semibold text-gray-900 text-xl">Ubah profil</h3>
            <p className="text-[13px] text-gray-400 mt-1">
              Sesuaikan nama tampilan administrator.
            </p>
          </div>
          <Input
            type="text"
            placeholder="Nama Lengkap Baru"
            value={inputName}
            disabled={isLoading}
            onChange={(e) => {
              setInputName(e.target.value);
              setError(undefined);
            }}
            error={error}
          />
          <div className="flex gap-3 mt-1">
            <Button
              type="button"
              variant="secondary"
              disabled={isLoading}
              onClick={onClose}
            >
              Batal
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              loadingText="Menyimpan..."
            >
              Simpan
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col items-center py-6 animate-in zoom-in-95">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4">
            <FiCheckCircle className="text-3xl animate-bounce" />
          </div>
          <h4 className="font-semibold text-gray-900 text-lg">
            Berhasil diperbarui
          </h4>
        </div>
      )}
    </Modal>
  );
}
