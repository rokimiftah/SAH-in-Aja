import { Camera, Check, ChevronRight, FileText, MessageCircle } from "lucide-react";
import { Link } from "wouter";

export const FeaturesSection = () => {
  return (
    <div className="mb-8">
      <div className="space-y-4">
        {/* Siap Halal Card */}
        <Link href="/siap-halal" className="block">
          <div className="bg-primary-green rounded-(--radius-card) border-4 border-white p-6 shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Camera className="h-8 w-8 text-white" />
                <h3 className="flex items-center gap-2 text-2xl font-bold text-white">Siap Halal</h3>
              </div>
              <ChevronRight className="h-6 w-6 text-white/70" />
            </div>

            <div className="mb-4 rounded-2xl bg-teal-50 p-4">
              <p className="mb-3 font-medium text-gray-700">Foto dapurmu, AI kami cek kesiapannya.</p>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="text-primary-green h-5 w-5" />
                  <span className="text-gray-800">Cek kesiapan sebelum audit</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="text-primary-green h-5 w-5" />
                  <span className="text-gray-800">Hemat biaya konsultan</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="text-primary-green h-5 w-5" />
                  <span className="text-gray-800">Hasil dalam 2 menit</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 rounded-xl bg-white/20 py-2 text-sm font-semibold text-white">
              Mulai Cek Kesiapan
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
        </Link>

        {/* Dokumen Halal Card */}
        <Link href="/dokumen-halal" className="block">
          <div className="bg-primary-blue rounded-(--radius-card) border-4 border-white p-6 shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-white" />
                <h3 className="flex items-center gap-2 text-2xl font-bold text-white">Dokumen Halal</h3>
              </div>
              <span className="rounded-full bg-white/20 px-2 py-1 text-xs font-medium text-white">Segera</span>
            </div>

            <div className="mb-4 rounded-2xl bg-blue-50 p-4">
              <p className="mb-3 font-medium text-gray-700">Generate dokumen wajib SJPH otomatis.</p>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="text-primary-blue h-5 w-5" />
                  <span className="text-gray-800">SOP Produksi Halal</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="text-primary-blue h-5 w-5" />
                  <span className="text-gray-800">Perjanjian Supplier</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="text-primary-blue h-5 w-5" />
                  <span className="text-gray-800">Daftar Bahan Baku</span>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Asisten Halal Card */}
        <Link href="/asisten-halal" className="block">
          <div className="bg-primary-orange rounded-(--radius-card) border-4 border-white p-6 shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageCircle className="h-8 w-8 text-white" />
                <h3 className="flex items-center gap-2 text-2xl font-bold text-white">Asisten Halal</h3>
              </div>
              <span className="rounded-full bg-white/20 px-2 py-1 text-xs font-medium text-white">Segera</span>
            </div>

            <div className="mb-4 rounded-2xl bg-orange-50 p-4">
              <p className="mb-3 font-medium text-gray-700">Tanya jawab seputar sertifikasi halal 24/7.</p>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="text-primary-orange h-5 w-5" />
                  <span className="text-gray-800">Panduan BPJPH step-by-step</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="text-primary-orange h-5 w-5" />
                  <span className="text-gray-800">Rekomendasi supplier halal</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="text-primary-orange h-5 w-5" />
                  <span className="text-gray-800">Troubleshooting temuan audit</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};
