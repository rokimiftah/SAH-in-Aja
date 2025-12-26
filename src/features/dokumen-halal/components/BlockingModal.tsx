import { useEffect } from "react";

import { AlertTriangle, ArrowRight, ClipboardCheck, Info, ShieldCheck } from "lucide-react";

interface BlockingModalProps {
  type: "not_eligible" | "high_risk";
  onClose?: () => void;
  onAction: () => void;
}

export function BlockingModal({ type, onClose, onAction }: BlockingModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (type === "not_eligible") {
    return (
      <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md duration-300">
        <div className="animate-in zoom-in-95 slide-in-from-bottom-4 relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl duration-300">
          {/* Gradient Header */}
          <div className="relative bg-linear-to-br from-blue-500 via-blue-600 to-indigo-600 px-6 pt-8 pb-12">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6bTAtMThjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />

            <div className="relative text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                <ClipboardCheck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Langkah Penting!</h3>
              <p className="mt-2 text-base text-blue-100">Satu langkah lagi sebelum membuat dokumen</p>
            </div>
          </div>

          {/* Content */}
          <div className="-mt-6 rounded-t-3xl bg-white px-6 pt-8 pb-6">
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100">
                <Info className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-base font-medium text-gray-800">Cek Jalur Sertifikasi Diperlukan</p>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  Untuk memastikan dokumen valid dan tidak ditolak BPJPH, Anda perlu melakukan pengecekan jalur terlebih dahulu.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={onAction}
                className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-blue-500 to-indigo-600 px-4 py-4 text-base font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98]"
              >
                <ShieldCheck className="h-5 w-5" />
                <span className="whitespace-nowrap">Cek Jalur Sekarang</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full cursor-pointer rounded-2xl px-4 py-3 text-base font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                >
                  Nanti Saja
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // High Risk
  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md duration-300">
      <div className="animate-in zoom-in-95 slide-in-from-bottom-4 relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl duration-300">
        {/* Gradient Header */}
        <div className="relative bg-linear-to-br from-red-500 via-red-600 to-orange-600 px-6 pt-8 pb-12">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6bTAtMThjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />

          <div className="relative text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">Perhatian Penting</h3>
            <p className="mt-2 text-base text-red-100">Usaha Anda terdeteksi Risiko Tinggi</p>
          </div>
        </div>

        {/* Content */}
        <div className="-mt-6 rounded-t-3xl bg-white px-6 pt-8 pb-6">
          <div className="mb-4 space-y-3">
            <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50/50 p-4">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100">
                <span className="text-base font-bold text-red-600">!</span>
              </div>
              <div>
                <p className="text-base font-medium text-gray-800">Wajib Jalur Reguler</p>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  Usaha dengan risiko tinggi <strong>WAJIB</strong> melalui jalur Reguler dengan audit LPH (Lembaga Pemeriksa
                  Halal).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50/50 p-4">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100">
                <Info className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-base font-medium text-gray-800">Aplikasi untuk Self-Declare</p>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  SAH-in Aja dioptimalkan untuk jalur Self-Declare (UMK Risiko Rendah). Memaksakan pembuatan dokumen berisiko{" "}
                  <strong>DITOLAK</strong>.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onAction}
            className="w-full cursor-pointer rounded-2xl border-2 border-gray-200 bg-white px-4 py-4 text-base font-bold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98]"
          >
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}
