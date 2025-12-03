import { AlertTriangle, Award, Check, CheckCircle, ChevronRight, FileText, Info, MapPin, Share2, XCircle } from "lucide-react";

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
  const getScoreConfig = () => {
    if (score >= 80)
      return {
        bg: "from-green-500 to-emerald-600",
        label: "Siap Audit",
        emoji: "🎉",
        desc: "Area produksi Anda sudah siap untuk audit resmi!",
      };
    if (score >= 60)
      return {
        bg: "from-yellow-500 to-orange-500",
        label: "Perlu Perbaikan",
        emoji: "⚠️",
        desc: "Ada beberapa hal yang perlu diperbaiki sebelum audit.",
      };
    return {
      bg: "from-red-500 to-rose-600",
      label: "Belum Siap",
      emoji: "🚨",
      desc: "Perlu perbaikan signifikan sebelum mengajukan audit.",
    };
  };

  const config = getScoreConfig();

  return (
    <div className="mb-8 text-center">
      <div className="relative mx-auto mb-4">
        {/* Glow effect */}
        <div className={cn("absolute inset-0 mx-auto h-32 w-32 rounded-full bg-gradient-to-br opacity-20 blur-xl", config.bg)} />
        {/* Score circle */}
        <div
          className={cn(
            "relative mx-auto flex h-32 w-32 flex-col items-center justify-center rounded-full bg-gradient-to-br shadow-lg",
            config.bg,
          )}
        >
          <span className="text-5xl font-bold text-white">{score}</span>
          <span className="text-sm text-white/80">/100</span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2">
        <span className="text-2xl">{config.emoji}</span>
        <h2 className="text-text-dark text-2xl font-bold">{config.label}</h2>
      </div>
      <p className="mt-2 text-sm text-gray-600">{config.desc}</p>
    </div>
  );
}

function StatsSummary({ findings }: { findings: Finding[] }) {
  const critical = findings.filter((f) => f.type === "critical").length;
  const warning = findings.filter((f) => f.type === "warning").length;
  const pass = findings.filter((f) => f.type === "pass").length;

  return (
    <div className="mb-6 grid grid-cols-3 gap-3">
      <div className="rounded-xl bg-red-50 p-3 text-center">
        <div className="text-2xl font-bold text-red-600">{critical}</div>
        <div className="text-xs text-red-600">Kritis</div>
      </div>
      <div className="rounded-xl bg-yellow-50 p-3 text-center">
        <div className="text-2xl font-bold text-yellow-600">{warning}</div>
        <div className="text-xs text-yellow-600">Peringatan</div>
      </div>
      <div className="rounded-xl bg-green-50 p-3 text-center">
        <div className="text-2xl font-bold text-green-600">{pass}</div>
        <div className="text-xs text-green-600">Sesuai</div>
      </div>
    </div>
  );
}

function FindingCard({ finding }: { finding: Finding }) {
  const config = {
    pass: {
      icon: CheckCircle,
      bg: "bg-green-50",
      border: "border-green-200",
      iconColor: "text-green-600",
      badgeBg: "bg-green-100",
      label: "Sesuai",
    },
    warning: {
      icon: AlertTriangle,
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      iconColor: "text-yellow-600",
      badgeBg: "bg-yellow-100",
      label: "Perhatian",
    },
    critical: {
      icon: XCircle,
      bg: "bg-red-50",
      border: "border-red-200",
      iconColor: "text-red-600",
      badgeBg: "bg-red-100",
      label: "Kritis",
    },
  }[finding.type];

  const Icon = config.icon;

  return (
    <div className={cn("overflow-hidden rounded-xl border", config.border, config.bg)}>
      {/* Header */}
      <div className={cn("flex items-center gap-2 px-4 py-2", config.badgeBg)}>
        <Icon className={cn("h-4 w-4", config.iconColor)} />
        <span className={cn("text-xs font-semibold", config.iconColor)}>{config.label}</span>
        {finding.confidence < 0.7 && (
          <span className="ml-auto rounded bg-gray-200 px-1.5 py-0.5 text-[10px] text-gray-600">Perlu verifikasi</span>
        )}
      </div>
      {/* Content */}
      <div className="p-4">
        <p className="text-text-dark mb-2 text-sm leading-relaxed font-medium">{finding.item}</p>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <MapPin className="h-3 w-3" />
          <span>{finding.location}</span>
        </div>
      </div>
    </div>
  );
}

function ActionItemCard({ item, index }: { item: string; index: number }) {
  return (
    <div className="flex gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="bg-primary-green flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white">
        {index + 1}
      </div>
      <p className="text-text-dark text-sm leading-relaxed">{item}</p>
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
    const shareText = `🎯 Skor Kesiapan Halal: ${score}/100

📊 Hasil Analisis:
• ${criticalFindings.length} temuan kritis
• ${warningFindings.length} perlu perhatian  
• ${passFindings.length} sudah sesuai

Dicek dengan SAH-in Aja! - Platform persiapan sertifikasi halal untuk UMKM
🔗 https://sahin.biz.id`;

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
    <div className="mx-auto max-w-lg pb-8">
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
          <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
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
      <div className="space-y-3">
        <button
          type="button"
          onClick={onGenerateDocuments}
          className="bg-primary-green flex w-full items-center justify-center gap-2 rounded-xl px-4 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:shadow-xl active:scale-[0.98]"
        >
          <FileText className="h-5 w-5" />
          Generate Dokumen SJPH
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onNewScan}
            className="flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Scan Ulang
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
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
