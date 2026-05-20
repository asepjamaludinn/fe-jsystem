import { Modal } from "@/components/ui/Modal";
import { FiCheckCircle } from "react-icons/fi";

export default function AvatarSuccessModal({ isOpen }: { isOpen: boolean }) {
  return (
    <Modal isOpen={isOpen} closeOnOutsideClick={false}>
      <div className="flex flex-col items-center justify-center py-4 animate-in zoom-in-95 fade-in duration-300">
        <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4 border border-emerald-100/50">
          <FiCheckCircle className="text-3xl animate-bounce" />
        </div>
        <h4 className="font-semibold tracking-tight text-gray-900 text-lg text-center">
          Foto profil diperbarui
        </h4>
      </div>
    </Modal>
  );
}
