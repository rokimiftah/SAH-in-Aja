import { useMemo } from "react";

import { useQuery } from "convex/react";
import { Camera, FileText, MessageCircle } from "lucide-react";

import { FEATURES } from "@shared/config/branding";

import { api } from "../../../convex/_generated/api";
import { FeatureCard, StatsCard, TipsCard } from "./components";

function getTimeBasedGreeting(): string {
  const now = new Date();
  const utc7Hour = (now.getUTCHours() + 7) % 24;

  if (utc7Hour >= 5 && utc7Hour < 11) return "Selamat Pagi";
  if (utc7Hour >= 11 && utc7Hour < 15) return "Selamat Siang";
  if (utc7Hour >= 15 && utc7Hour < 18) return "Selamat Sore";
  return "Selamat Malam";
}

export function DashboardHomePage() {
  const user = useQuery(api.users.getCurrentUser);
  const scans = useQuery(api.halalScans.getMyScans);
  const documents = useQuery(api.halalDocuments.getMyDocuments);
  const consultations = useQuery(api.halalConsultations.getByUser, user?._id ? { userId: user._id } : "skip");
  const name = (user?.name ?? "").trim();
  const email = (user?.email ?? "").trim();
  const displayName = name || email?.split("@")[0] || "";
  const isLoaded = user !== undefined;
  const timeGreeting = useMemo(() => getTimeBasedGreeting(), []);

  return (
    <div className="h-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="h-full overflow-y-auto p-6 lg:flex lg:flex-col lg:overflow-hidden lg:p-8">
        {/* Welcome */}
        <div className="mb-4">
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-800 lg:text-3xl">
            <span className={`transition-opacity duration-500 ${isLoaded ? "absolute opacity-0" : "opacity-100"}`}>
              {timeGreeting}!
            </span>
            <span className={`transition-opacity duration-500 ${isLoaded ? "opacity-100" : "absolute opacity-0"}`}>
              Hai, {displayName || "Pengguna"}!
            </span>
          </h1>
        </div>

        {/* Stats */}
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatsCard label="Total Scan" value={scans?.length ?? 0} icon={Camera} variant="emerald" />
          <StatsCard label="Dokumen" value={documents?.length ?? 0} icon={FileText} variant="blue" />
          <StatsCard label="Konsultasi" value={consultations?.length ?? 0} icon={MessageCircle} variant="orange" />
        </div>

        {/* Tips */}
        <div className="mb-4">
          <TipsCard />
        </div>

        {/* Features */}
        <div className="lg:flex lg:flex-1 lg:flex-col">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Fitur Utama</h2>
          <div className="grid gap-4 md:grid-cols-3 lg:flex-1">
            <FeatureCard
              icon={<Camera className="h-6 w-6 text-white" />}
              name={FEATURES.siapHalal.name}
              tagline={FEATURES.siapHalal.tagline}
              description="Foto area produksi, AI analisis kesiapan sertifikasi halal."
              ctaText={FEATURES.siapHalal.cta.primary}
              href="/dashboard/siap-halal"
              gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
              available={true}
            />
            <FeatureCard
              icon={<FileText className="h-6 w-6 text-white" />}
              name={FEATURES.dokumenHalal.name}
              tagline={FEATURES.dokumenHalal.tagline}
              description="Generate dokumen SJPH otomatis: SOP, Perjanjian, Daftar Bahan."
              ctaText={FEATURES.dokumenHalal.cta.primary}
              href="/dashboard/dokumen-halal"
              gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
              available={true}
            />
            <FeatureCard
              icon={<MessageCircle className="h-6 w-6 text-white" />}
              name={FEATURES.asistenHalal.name}
              tagline={FEATURES.asistenHalal.tagline}
              description="Tanya jawab sertifikasi halal, panduan BPJPH 24/7."
              ctaText={FEATURES.asistenHalal.cta.primary}
              href="/dashboard/asisten-halal"
              gradient="bg-gradient-to-br from-orange-500 to-rose-500"
              available={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
