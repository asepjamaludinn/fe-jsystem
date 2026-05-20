import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import { updatePassword } from "@/services/authService";
import { ApiErrorResponse } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FiCheckCircle } from "react-icons/fi";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({
  isOpen,
  onClose,
}: ChangePasswordModalProps) {
  const [passForm, setPassForm] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [errors, setErrors] = useState<{
    old?: string;
    new?: string;
    general?: string;
  }>({});

  useEffect(() => {
    if (isOpen) {
      setPassForm({ oldPassword: "", newPassword: "" });
      setErrors({});
      setIsSuccess(false);
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!passForm.oldPassword) newErrors.old = "Password lama wajib diisi";
    if (!passForm.newPassword) newErrors.new = "Password baru wajib diisi";
    else if (passForm.newPassword.length < 6)
      newErrors.new = "Password baru minimal 6 karakter";
    else if (passForm.oldPassword === passForm.newPassword)
      newErrors.new = "Tidak boleh sama dengan sandi lama";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    try {
      await updatePassword(passForm);
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
      }, 1800);
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      setErrors({
        general: error.response?.data?.error || "Gagal mengganti password",
      });
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="text-center pt-2 mb-1">
            <h3 className="font-semibold text-gray-900 text-xl">
              Ganti password
            </h3>
            <p className="text-[13px] text-gray-400 mt-1">
              Gunakan kombinasi sandi yang aman.
            </p>
          </div>

          {errors.general && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-[11px] font-bold text-center border border-red-100">
              {errors.general}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Input
              type="password"
              placeholder="Password Lama"
              value={passForm.oldPassword}
              disabled={isLoading}
              onChange={(e) =>
                setPassForm({ ...passForm, oldPassword: e.target.value })
              }
              error={errors.old}
            />
            <Input
              type="password"
              placeholder="Password Baru (Min. 6 Karakter)"
              value={passForm.newPassword}
              disabled={isLoading}
              onChange={(e) =>
                setPassForm({ ...passForm, newPassword: e.target.value })
              }
              error={errors.new}
            />
          </div>
          <div className="flex gap-3 mt-2">
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
              variant="danger"
              isLoading={isLoading}
              loadingText="Memproses..."
            >
              Update Sandi
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col items-center py-6 animate-in zoom-in-95">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4">
            <FiCheckCircle className="text-3xl animate-bounce" />
          </div>
          <h4 className="font-semibold text-gray-900 text-lg">
            Password diperbarui
          </h4>
        </div>
      )}
    </Modal>
  );
}
