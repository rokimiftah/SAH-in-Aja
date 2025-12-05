import { useQuery } from "convex/react";
import { Camera, FileText, MessageCircle } from "lucide-react";

import { FEATURES } from "@shared/config/branding";

import { api } from "../../../convex/_generated/api";
import { FeatureCard, StatsCard } from "./components";

export function DashboardHomePage() {
  const user = useQuery(api.users.getCurrentUser);
  const scans = useQuery(api.halalScans.getMyScans);
  const name = (user?.name ?? "").trim();
  const email = (user?.email ?? "").trim();
  const displayName = name || email?.split("@")[0] || "Pengguna";

  return (
    <div className="h-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="h-full overflow-y-auto p-6 lg:p-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-800 lg:text-3xl">Hai, {displayName}!</h1>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:gap-6">
          <StatsCard label="Total Scan" value={scans?.length ?? 0} icon={Camera} variant="emerald" />
          <StatsCard label="Dokumen" value={0} icon={FileText} variant="blue" />
          <StatsCard label="Konsultasi" value={0} icon={MessageCircle} variant="orange" />
        </div>

        {/* Features */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Fitur Utama</h2>
          <div className="grid gap-6 md:grid-cols-3 xl:grid-cols-3">
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
              available={false}
            />
            <FeatureCard
              icon={<MessageCircle className="h-6 w-6 text-white" />}
              name={FEATURES.asistenHalal.name}
              tagline={FEATURES.asistenHalal.tagline}
              description="Tanya jawab sertifikasi halal, panduan BPJPH 24/7."
              ctaText={FEATURES.asistenHalal.cta.primary}
              href="/dashboard/asisten-halal"
              gradient="bg-gradient-to-br from-orange-500 to-rose-500"
              available={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
