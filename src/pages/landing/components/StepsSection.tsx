export const StepsSection = () => {
  return (
    <div className="mb-8">
      <div className="rounded-(--radius-card) bg-white p-8 shadow-lg">
        <div className="space-y-6">
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="shrink-0">
              <div className="bg-primary-green flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white">
                1
              </div>
            </div>
            <div className="flex-1 pt-3">
              <h3 className="mb-1 text-lg font-bold">Foto Area Produksi</h3>
              <p className="text-gray-600">
                Ambil 5 foto dapur/area produksi: dapur, gudang bahan, area produksi, tempat cuci, dan area penyimpanan.
              </p>
            </div>
          </div>

          {/* Connector */}
          <div className="ml-8 h-8 w-1 bg-teal-300"></div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="shrink-0">
              <div className="bg-primary-blue flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white">
                2
              </div>
            </div>
            <div className="flex-1 pt-3">
              <h3 className="mb-1 text-lg font-bold">Dapat Laporan Kesiapan</h3>
              <p className="text-gray-600">AI analisis dan kasih skor kesiapan halal + action items yang perlu diperbaiki.</p>
            </div>
          </div>

          {/* Connector */}
          <div className="ml-8 h-8 w-1 bg-orange-300"></div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="shrink-0">
              <div className="bg-primary-orange flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white">
                3
              </div>
            </div>
            <div className="flex-1 pt-3">
              <h3 className="mb-1 text-lg font-bold">Siap Submit ke BPJPH</h3>
              <p className="text-gray-600">
                Generate dokumen wajib, perbaiki temuan, lalu daftar sertifikasi halal resmi ke BPJPH/MUI.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
