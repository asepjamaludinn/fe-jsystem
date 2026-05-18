"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const isAuthPage = pathname === "/login" || pathname === "/register";

    if (!token) {
      if (!isAuthPage) {
        router.replace("/login");
      } else {
        setIsVerified(true);
      }
    } else {
      if (isAuthPage) {
        router.replace("/");
      } else {
        setIsVerified(true);
      }
    }
  }, [pathname, router]);

  if (!isVerified) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[#E8F3EB] min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-800 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-900"></span>
          </span>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-2">
            Authenticating...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
