import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  variant?: "primary" | "secondary" | "danger";
  children: ReactNode;
}

export function Button({
  isLoading,
  loadingText = "Memproses...",
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={isLoading || props.disabled}
      className={cn(
        "w-full py-4 mt-2 rounded-full font-extrabold text-[13px] tracking-tight transition-all cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex justify-center items-center",
        {
          "bg-[#1A201C] text-white hover:bg-gray-800 shadow-md":
            variant === "primary",
          "bg-gray-100 text-gray-600 hover:bg-gray-200 shadow-none mt-0":
            variant === "secondary",
          "bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-500/20 mt-0":
            variant === "danger",
        },
        className,
      )}
      {...props}
    >
      {isLoading ? loadingText : children}
    </button>
  );
}
