import { Camera, Check, FileText, MessageCircle } from "lucide-react";

export const FeaturesSection = () => {
  return (
    <div className="mb-8">
      <div className="space-y-4">
        {/* Siap Halal Card */}
        <div className="bg-primary-green rounded-(--radius-card) border-4 border-white p-6 shadow-lg">
          <div className="mb-4 flex items-center gap-3">
            <Camera className="h-8 w-8 text-white" />
            <h3 className="flex items-center gap-2 text-2xl font-bold text-white">Siap Halal</h3>
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
        </div>

        {/* Dokumen Halal Card */}
        <div className="bg-primary-blue rounded-(--radius-card) border-4 border-white p-6 shadow-lg">
          <div className="mb-4 flex items-center gap-3">
            <FileText className="h-8 w-8 text-white" />
            <h3 className="flex items-center gap-2 text-2xl font-bold text-white">Dokumen Halal</h3>
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

        {/* Asisten Halal Card */}
        <div className="bg-primary-orange rounded-(--radius-card) border-4 border-white p-6 shadow-lg">
          <div className="mb-4 flex items-center gap-3">
            <MessageCircle className="h-8 w-8 text-white" />
            <h3 className="flex items-center gap-2 text-2xl font-bold text-white">Asisten Halal</h3>
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
      </div>
    </div>
  );
};
