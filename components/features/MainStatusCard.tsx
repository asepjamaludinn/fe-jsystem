import Image from "next/image";

interface MainStatusCardProps {
  posisi: "MASUK" | "KELUAR";
  isManual: boolean;
  cuaca: string;
}

export default function MainStatusCard({
  posisi,
  isManual,
  cuaca,
}: MainStatusCardProps) {
  const isKeluar = posisi === "KELUAR";

  const getImageSrc = () => {
    if (cuaca === "Hujan") return "/images/ujan.png";
    if (cuaca === "Gelap") return "/images/moon.png";
    return "/images/cerah.png";
  };

  return (
    <div className="bg-gradient-to-br from-[#53B2FF] to-[#3192FF] rounded-[2.5rem] p-7 shadow-2xl shadow-[#3192FF]/30 relative mt-4 overflow-hidden border border-white/20 transition-all duration-700">
      <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full blur-3xl bg-white/25"></div>
      <div className="absolute -left-10 -bottom-10 w-48 h-48 rounded-full blur-3xl bg-white/10"></div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
          <div
            key={cuaca + posisi}
            className="w-28 h-28 relative flex-shrink-0 drop-shadow-2xl animate-in fade-in zoom-in-50 duration-700 ease-out"
          >
            <Image
              src={getImageSrc()}
              alt={`Cuaca ${cuaca}`}
              fill
              sizes="112px"
              className="object-contain transition-transform hover:scale-105 duration-500"
              priority
            />
          </div>

          <div className="flex flex-col items-end pt-2">
            <span className="text-[10px] font-bold text-white/80 uppercase tracking-[0.2em] mb-1">
              Status Jemuran
            </span>
            <h2
              key={posisi}
              className="text-5xl font-black tracking-tighter text-white drop-shadow-lg animate-in slide-in-from-right-4 fade-in duration-500"
            >
              {posisi}
            </h2>
          </div>
        </div>

        <div className="flex flex-col gap-6 mt-2">
          <p
            key={cuaca}
            className="text-[13px] font-medium text-white/95 leading-relaxed tracking-tight animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-[90%]"
          >
            {isKeluar
              ? "Perangkat beroperasi di luar ruangan. Kondisi lingkungan optimal untuk pengeringan pakaian."
              : "Perangkat berada di area teduh. Terlindungi dari potensi anomali cuaca di luar."}
          </p>

          <div
            className={`inline-flex items-center self-start gap-2.5 px-3.5 py-2 rounded-full shadow-lg backdrop-blur-md border transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 ${
              isManual
                ? "bg-amber-500/20 border-amber-300/40 text-amber-50"
                : "bg-emerald-400/20 border-emerald-300/40 text-emerald-50"
            }`}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 duration-1000 ${
                  isManual ? "bg-amber-400" : "bg-emerald-400"
                }`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  isManual ? "bg-amber-500" : "bg-emerald-500"
                }`}
              ></span>
            </span>

            {isManual ? (
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-widest drop-shadow-sm text-amber-50">
                  Manual Override
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-widest drop-shadow-sm text-emerald-50">
                  Sensor Active
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
