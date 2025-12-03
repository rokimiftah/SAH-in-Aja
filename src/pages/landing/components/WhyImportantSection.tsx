import { AlertTriangle, CircleDollarSign } from "lucide-react";

export const WhyImportantSection = () => {
  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Card 1 */}
        <div className="group overflow-hidden rounded-(--radius-card) bg-white shadow-md">
          <div className="p-6">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-50">
              <div className="relative">
                <CircleDollarSign className="text-warning-yellow h-10 w-10" />
              </div>
            </div>
            <h3 className="text-text-dark text-center text-lg leading-snug font-bold">
              <span className="text-warning-yellow block text-3xl font-extrabold">Mahal</span>
              Konsultan Pre-Audit
            </h3>
            <p className="text-text-muted mt-2 text-center text-sm font-medium">(2-5 Juta, belum audit resmi)</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="group overflow-hidden rounded-(--radius-card) bg-white shadow-md">
          <div className="p-6">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
              <AlertTriangle className="text-accent-pink h-10 w-10" />
            </div>
            <h3 className="text-text-dark text-center text-lg leading-snug font-bold">
              <span className="text-accent-pink block text-3xl font-extrabold">Takut</span>
              Gagal Audit
            </h3>
            <p className="text-text-muted mt-2 text-center text-sm font-medium">(Tidak tahu apa yang kurang)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
