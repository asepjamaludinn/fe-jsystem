import { ButtonHTMLAttributes, ReactNode } from "react";

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
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseStyle =
    "w-full py-4 mt-2 rounded-full font-extrabold text-[13px] tracking-tight transition-all cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex justify-center items-center";

  const variants = {
    primary: "bg-[#1A201C] text-white hover:bg-gray-800 shadow-md",
    secondary: "bg-gray-100 text-gray-600 hover:bg-gray-200 shadow-none mt-0",
    danger:
      "bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-500/20 mt-0",
  };

  return (
    <button
      disabled={isLoading || props.disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {isLoading ? loadingText : children}
    </button>
  );
}
