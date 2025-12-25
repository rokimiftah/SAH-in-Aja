import { useEffect, useMemo, useState } from "react";

import { useQuery } from "convex/react";
import { Camera, FileText, MessageCircle, Mic, Package } from "lucide-react";
import { motion } from "motion/react";

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
  const materialScans = useQuery(api.materialScans.getMyScans);
  const documents = useQuery(api.halalDocuments.getMyDocuments);
  const consultations = useQuery(api.halalConsultations.getByUser, user?._id ? { userId: user._id } : "skip");
  const voiceAuditHistory = useQuery(api.voiceAudit.getMyHistory, { limit: 100 });
  const name = (user?.name ?? "").trim();
  const email = (user?.email ?? "").trim();
  const displayName = name || email?.split("@")[0] || "";
  const timeGreeting = useMemo(() => getTimeBasedGreeting(), []);
  const [showName, setShowName] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowName(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="h-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
    >
      <div className="h-full overflow-y-auto p-6 lg:flex lg:flex-col lg:overflow-hidden lg:p-8">
        {/* Welcome */}
        <div className="mb-4">
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-800 lg:text-3xl">
            <span className={`transition-opacity duration-500 ${showName ? "absolute opacity-0" : "opacity-100"}`}>
              {timeGreeting}!
            </span>
            <span className={`transition-opacity duration-500 ${showName ? "opacity-100" : "absolute opacity-0"}`}>
              Hai, {displayName}!
            </span>
          </h1>
        </div>

        {/* Stats */}
        <div className="mb-4 flex flex-col gap-3 sm:grid sm:grid-cols-3 lg:grid-cols-5">
          <StatsCard label="Cek Dapur" value={scans?.length ?? 0} icon={Camera} variant="emerald" />
          <StatsCard label="Cek Bahan" value={materialScans?.length ?? 0} icon={Package} variant="cyan" />
          <StatsCard label="Dokumen" value={documents?.length ?? 0} icon={FileText} variant="blue" />
          <StatsCard label="Konsultasi" value={consultations?.length ?? 0} icon={MessageCircle} variant="orange" />
          <StatsCard label="Voice Audit" value={voiceAuditHistory?.length ?? 0} icon={Mic} variant="rose" />
        </div>

        {/* Tips */}
        <div className="mb-4">
          <TipsCard />
        </div>

        {/* Features */}
        <div className="lg:flex lg:flex-1 lg:flex-col">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Fitur Utama</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:flex-1 lg:grid-cols-3 xl:grid-cols-5">
            <FeatureCard
              icon={<Camera className="h-6 w-6 text-white" />}
              name={FEATURES.cekDapur.name}
              tagline={FEATURES.cekDapur.tagline}
              description="Foto area produksi, AI analisis kesiapan sertifikasi halal."
              ctaText={FEATURES.cekDapur.cta.primary}
              href="/dashboard/cek-dapur"
              gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
              available={true}
            />
            <FeatureCard
              icon={<Package className="h-6 w-6 text-white" />}
              name={FEATURES.cekBahan.name}
              tagline={FEATURES.cekBahan.tagline}
              description="Foto kemasan bahan, cek logo halal dan status bahan."
              ctaText={FEATURES.cekBahan.cta.primary}
              href="/dashboard/cek-bahan"
              gradient="bg-gradient-to-br from-cyan-500 to-teal-600"
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
            <FeatureCard
              icon={<Mic className="h-6 w-6 text-white" />}
              name={FEATURES.voiceAudit.name}
              tagline={FEATURES.voiceAudit.tagline}
              description="Simulasi wawancara audit halal dengan AI auditor."
              ctaText={FEATURES.voiceAudit.cta.primary}
              href="/dashboard/voice-audit"
              gradient="bg-gradient-to-br from-rose-500 to-pink-600"
              available={true}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
