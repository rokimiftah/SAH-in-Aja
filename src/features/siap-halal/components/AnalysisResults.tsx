import type { LucideIcon } from "lucide-react";

import {
  AlertTriangle,
  Award,
  Camera,
  Check,
  CheckCircle,
  ChevronRight,
  FileText,
  Info,
  MapPin,
  Share2,
  ShieldCheck,
  ShieldX,
  XCircle,
} from "lucide-react";

import { FEATURES } from "@shared/config/branding";
import { cn } from "@shared/lib";

interface Finding {
  type: "pass" | "warning" | "critical";
  item: string;
  location: string;
  confidence: number;
}

interface AnalysisResultsProps {
  score: number;
  findings: Finding[];
  actionItems: string[];
  summaryPoints: string[];
  overallMessage: string;
  onNewScan: () => void;
  onGenerateDocuments: () => void;
}

function ScoreBadge({ score }: { score: number }) {
  const getScoreConfig = (): {
    bg: string;
    ringColor: string;
    label: string;
    icon: LucideIcon;
    iconColor: string;
    badgeBg: string;
    desc: string;
  } => {
    if (score >= 80)
      return {
        bg: "from-green-500 to-emerald-600",
        ringColor: "ring-green-200",
        label: "Siap Audit",
        icon: ShieldCheck,
        iconColor: "text-green-600",
        badgeBg: "bg-green-100",
        desc: "Area produksi Anda sudah siap untuk audit resmi!",
      };
    if (score >= 60)
      return {
        bg: "from-yellow-500 to-orange-500",
        ringColor: "ring-yellow-200",
        label: "Perlu Perbaikan",
        icon: AlertTriangle,
        iconColor: "text-yellow-600",
        badgeBg: "bg-yellow-100",
        desc: "Ada beberapa hal yang perlu diperbaiki sebelum audit.",
      };
    return {
      bg: "from-red-500 to-rose-600",
      ringColor: "ring-red-200",
      label: "Belum Siap",
      icon: ShieldX,
      iconColor: "text-red-600",
      badgeBg: "bg-red-100",
      desc: "Perlu perbaikan signifikan sebelum mengajukan audit.",
    };
  };

  const config = getScoreConfig();
  const Icon = config.icon;

  return (
    <div className="mb-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="bg-linear-to-br from-gray-50 to-white p-8 text-center">
        <div className="relative mx-auto mb-6">
          {/* Glow effect */}
          <div className={cn("absolute inset-0 mx-auto h-36 w-36 rounded-full bg-linear-to-br opacity-30 blur-2xl", config.bg)} />
          {/* Outer ring */}
          <div
            className={cn("relative mx-auto flex h-36 w-36 items-center justify-center rounded-full ring-8", config.ringColor)}
          >
            {/* Score circle */}
            <div
              className={cn(
                "flex h-28 w-28 flex-col items-center justify-center rounded-full bg-linear-to-br shadow-xl",
                config.bg,
              )}
            >
              <span className="text-5xl font-bold tracking-tight text-white">{score}</span>
              <span className="text-sm font-medium text-white/80">/100</span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className={cn("mx-auto mb-3 inline-flex items-center gap-2 rounded-full px-4 py-2", config.badgeBg)}>
          <Icon className={cn("h-5 w-5", config.iconColor)} />
          <span className={cn("text-lg font-bold", config.iconColor)}>{config.label}</span>
        </div>

        <p className="mx-auto max-w-sm text-gray-600">{config.desc}</p>
      </div>
    </div>
  );
}

function StatsSummary({ findings }: { findings: Finding[] }) {
  const critical = findings.filter((f) => f.type === "critical").length;
  const warning = findings.filter((f) => f.type === "warning").length;
  const pass = findings.filter((f) => f.type === "pass").length;

  return (
    <div className="mb-6 grid grid-cols-3 gap-3">
      <div className="overflow-hidden rounded-2xl border border-red-100 bg-linear-to-br from-red-50 to-white p-4 text-center shadow-sm transition-shadow hover:shadow-md">
        <XCircle className="mx-auto mb-2 h-6 w-6 text-red-500" />
        <div className="text-3xl font-bold text-red-600">{critical}</div>
        <div className="text-xs font-medium text-red-600">Kritis</div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-yellow-100 bg-linear-to-br from-yellow-50 to-white p-4 text-center shadow-sm transition-shadow hover:shadow-md">
        <AlertTriangle className="mx-auto mb-2 h-6 w-6 text-yellow-500" />
        <div className="text-3xl font-bold text-yellow-600">{warning}</div>
        <div className="text-xs font-medium text-yellow-600">Peringatan</div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-green-100 bg-linear-to-br from-green-50 to-white p-4 text-center shadow-sm transition-shadow hover:shadow-md">
        <CheckCircle className="mx-auto mb-2 h-6 w-6 text-green-500" />
        <div className="text-3xl font-bold text-green-600">{pass}</div>
        <div className="text-xs font-medium text-green-600">Sesuai</div>
      </div>
    </div>
  );
}

function FindingCard({ finding }: { finding: Finding }) {
  const config = {
    pass: {
      icon: CheckCircle,
      bg: "bg-gradient-to-br from-green-50 to-white",
      border: "border-green-200",
      iconColor: "text-green-600",
      badgeBg: "bg-green-100",
      label: "Sesuai",
    },
    warning: {
      icon: AlertTriangle,
      bg: "bg-gradient-to-br from-yellow-50 to-white",
      border: "border-yellow-200",
      iconColor: "text-yellow-600",
      badgeBg: "bg-yellow-100",
      label: "Perhatian",
    },
    critical: {
      icon: XCircle,
      bg: "bg-gradient-to-br from-red-50 to-white",
      border: "border-red-200",
      iconColor: "text-red-600",
      badgeBg: "bg-red-100",
      label: "Kritis",
    },
  }[finding.type];

  const Icon = config.icon;

  return (
    <div className={cn("overflow-hidden rounded-2xl border shadow-sm transition-all hover:shadow-md", config.border, config.bg)}>
      {/* Header */}
      <div className={cn("flex items-center gap-2 px-4 py-2.5", config.badgeBg)}>
        <Icon className={cn("h-4 w-4", config.iconColor)} />
        <span className={cn("text-xs font-bold tracking-wide uppercase", config.iconColor)}>{config.label}</span>
        {finding.confidence < 0.7 && (
          <span className="ml-auto rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-medium text-gray-600">
            Perlu verifikasi
          </span>
        )}
      </div>
      {/* Content */}
      <div className="p-4">
        <p className="text-text-dark mb-3 text-sm leading-relaxed font-medium">{finding.item}</p>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
          <MapPin className="h-3 w-3" />
          <span>{finding.location}</span>
        </div>
      </div>
    </div>
  );
}

function ActionItemCard({ item, index }: { item: string; index: number }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="bg-primary-green flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white">
        {index + 1}
      </div>
      <p className="text-text-dark pt-1 text-sm leading-relaxed">{item}</p>
    </div>
  );
}

export function AnalysisResults({
  score,
  findings,
  actionItems,
  summaryPoints,
  overallMessage,
  onNewScan,
  onGenerateDocuments,
}: AnalysisResultsProps) {
  const criticalFindings = findings.filter((f) => f.type === "critical");
  const warningFindings = findings.filter((f) => f.type === "warning");
  const passFindings = findings.filter((f) => f.type === "pass");

  const handleShare = async () => {
    const shareText = `Skor Kesiapan Halal: ${score}/100

Hasil Analisis:
- ${criticalFindings.length} temuan kritis
- ${warningFindings.length} perlu perhatian  
- ${passFindings.length} sudah sesuai

Dicek dengan SAH-in Aja! - Platform persiapan sertifikasi halal untuk UMKM
https://sahin.biz.id`;

    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      alert("Hasil disalin ke clipboard!");
    }
  };

  return (
    <div className="mx-auto max-w-3xl pb-2">
      {/* Score */}
      <ScoreBadge score={score} />

      {/* Stats Summary */}
      <StatsSummary findings={findings} />

      {/* Overall Message */}
      {overallMessage && (
        <div className="bg-primary-green/10 border-primary-green/30 mb-6 rounded-xl border p-4">
          <p className="text-text-dark text-center text-base leading-relaxed font-medium">{overallMessage}</p>
        </div>
      )}

      {/* Summary Points */}
      {summaryPoints.length > 0 && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Award className="text-primary-blue h-5 w-5" />
            <h3 className="text-text-dark font-semibold">Ringkasan</h3>
          </div>
          <ul className="space-y-2">
            {summaryPoints.map((point, idx) => (
              <li key={idx} className="text-text-dark flex items-start gap-2 text-sm leading-relaxed">
                <span className="mt-0.5">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Items */}
      {actionItems.length > 0 && (
        <div className="mb-8">
          <h3 className="text-text-dark mb-4 flex items-center gap-2 text-lg font-bold">
            <Check className="text-primary-green h-5 w-5" />
            Langkah Perbaikan
          </h3>
          <div className="space-y-3">
            {actionItems.map((item, idx) => (
              <ActionItemCard key={idx} item={item} index={idx} />
            ))}
          </div>
        </div>
      )}

      {/* Critical Findings */}
      {criticalFindings.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-red-600">
            <XCircle className="h-5 w-5" />
            Harus Diperbaiki
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-sm">{criticalFindings.length}</span>
          </h3>
          <div className="space-y-3">
            {criticalFindings.map((f, idx) => (
              <FindingCard key={idx} finding={f} />
            ))}
          </div>
        </div>
      )}

      {/* Warning Findings */}
      {warningFindings.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-yellow-600">
            <AlertTriangle className="h-5 w-5" />
            Perlu Perhatian
            <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-sm">{warningFindings.length}</span>
          </h3>
          <div className="space-y-3">
            {warningFindings.map((f, idx) => (
              <FindingCard key={idx} finding={f} />
            ))}
          </div>
        </div>
      )}

      {/* Pass Findings - Collapsible */}
      {passFindings.length > 0 && (
        <details className="mb-6">
          <summary className="mb-4 flex cursor-pointer items-center gap-2 text-lg font-bold text-green-600">
            <CheckCircle className="h-5 w-5" />
            Sudah Sesuai
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-sm">{passFindings.length}</span>
          </summary>
          <div className="space-y-3">
            {passFindings.map((f, idx) => (
              <FindingCard key={idx} finding={f} />
            ))}
          </div>
        </details>
      )}

      {/* Disclaimer */}
      <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <div className="mb-2 flex items-start gap-2">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <h4 className="font-semibold text-amber-800">Penting!</h4>
            <p className="mt-1 text-xs leading-relaxed text-amber-700">
              Ini adalah analisis <strong>PERSIAPAN</strong>, bukan sertifikasi halal resmi. Untuk sertifikasi resmi, daftar ke{" "}
              <a href="https://halal.go.id" target="_blank" rel="noopener noreferrer" className="font-semibold underline">
                BPJPH (halal.go.id)
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <button
          type="button"
          onClick={onGenerateDocuments}
          className="bg-primary-green flex w-full items-center justify-center gap-3 rounded-2xl px-6 py-5 text-lg font-semibold text-white shadow-md transition-shadow hover:shadow-xl"
        >
          <FileText className="h-6 w-6" />
          <span>Generate Dokumen SJPH</span>
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onNewScan}
            className="flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-4 py-3.5 font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm"
          >
            <Camera className="h-4 w-4" />
            Scan Ulang
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-4 py-3.5 font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm"
          >
            <Share2 className="h-4 w-4" />
            Bagikan
          </button>
        </div>
      </div>

      {/* Official Resources */}
      <div className="mt-8 border-t border-gray-200 pt-6">
        <h4 className="mb-3 text-sm font-semibold text-gray-500">SUMBER RESMI</h4>
        <div className="space-y-2">
          {FEATURES.siapHalal.officialResources.map((resource) => (
            <a
              key={resource.name}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-gray-300 hover:shadow-sm"
            >
              <div>
                <p className="text-text-dark font-medium">{resource.name}</p>
                <p className="text-xs text-gray-500">{resource.description}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
