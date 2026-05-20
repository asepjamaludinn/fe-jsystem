import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { FiLogOut } from "react-icons/fi";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    router.replace("/login");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center pt-2">
        <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4 border border-red-100/50">
          <FiLogOut className="text-3xl" />
        </div>
        <h3 className="font-semibold text-gray-900 text-xl">
          Keluar dari akun?
        </h3>
        <p className="text-[13px] text-gray-400 mt-1">
          Anda harus masuk kembali untuk mengontrol jemuran pintar.
        </p>
      </div>
      <div className="flex gap-3 mt-6">
        <Button variant="secondary" onClick={onClose}>
          Batal
        </Button>
        <Button variant="danger" onClick={handleLogout}>
          Keluar
        </Button>
      </div>
    </Modal>
  );
}
