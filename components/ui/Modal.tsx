import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: ReactNode;
  closeOnOutsideClick?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  children,
  closeOnOutsideClick = true,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-6 animate-in fade-in duration-300 backdrop-blur-md bg-black/30">
      <div
        className="absolute inset-0"
        onClick={() => {
          if (closeOnOutsideClick && onClose) onClose();
        }}
      ></div>
      <div className="bg-white rounded-[2rem] w-full max-w-sm p-6 relative z-10 shadow-2xl flex flex-col border border-white animate-in slide-in-from-bottom-8 duration-300 min-h-[220px] justify-center overflow-hidden">
        {children}
      </div>
    </div>
  );
}
