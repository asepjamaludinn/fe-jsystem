import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import AuthGuard from "@/components/layout/AuthGuard";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Jemuran Pintar",
  description: "Dashboard kontrol jemuran otomatis berbasis IoT",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${dmSans.variable} antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-100 font-sans tracking-tight">
        <div className="w-full max-w-md mx-auto min-h-screen bg-[#E8F3EB] relative shadow-2xl overflow-x-hidden flex flex-col">
          <AuthGuard>{children}</AuthGuard>
        </div>
      </body>
    </html>
  );
}
