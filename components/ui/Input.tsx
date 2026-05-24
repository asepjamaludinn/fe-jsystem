import { InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider pl-2 block mb-1.5 selection:bg-transparent">
          {label}
        </label>
      )}
      <input
        className={cn(
          "w-full px-5 py-4 rounded-2xl bg-gray-50 border focus:outline-none transition-all text-[13px] font-semibold tracking-tight text-gray-800 placeholder:text-gray-300 shadow-inner disabled:opacity-50 disabled:cursor-not-allowed",
          error
            ? "border-red-400 focus:border-red-500 bg-red-50/50"
            : "border-transparent focus:border-[#44ACFF]/40 focus:bg-white",
          className,
        )}
        {...props}
      />

      {error && (
        <p className="text-red-500 text-[10px] font-bold mt-1.5 pl-3 tracking-wide animate-in fade-in slide-in-from-top-1">
          * {error}
        </p>
      )}
    </div>
  );
}
