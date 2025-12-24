import { ArrowRight } from "lucide-react";

const steps = [
  {
    step: "1",
    title: "Cek Kesiapan",
    description: "Foto area produksi atau kemasan bahan, AI analisis kesiapan halal dalam 2 menit.",
    color: "bg-emerald-500",
  },
  {
    step: "2",
    title: "Siapkan Dokumen",
    description: "Generate dokumen SJPH dan SOP produksi secara otomatis. Konsultasi 24/7 dengan AI.",
    color: "bg-blue-500",
  },
  {
    step: "3",
    title: "Siap Sertifikasi",
    description: "Latih mental dengan simulasi audit, lalu daftar ke BPJPH dengan percaya diri.",
    color: "bg-orange-500",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-12 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-16">
          <h2 className="mb-2 text-xl font-semibold text-gray-900 sm:mb-3 sm:text-3xl">Semudah 1-2-3</h2>
          <p className="text-sm text-gray-500 sm:text-base">Tiga langkah sederhana menuju sertifikasi halal</p>
        </div>

        <div className="grid gap-4 sm:gap-8 md:grid-cols-3">
          {steps.map((item, index, arr) => (
            <div key={item.step} className="relative">
              <div className="h-full rounded-xl border border-gray-200 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] sm:p-6">
                <div className="mb-3 flex items-center gap-3">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${item.color}`}
                  >
                    {item.step}
                  </span>
                  <h3 className="text-base font-semibold tracking-tight text-gray-900 sm:text-lg">{item.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-gray-500">{item.description}</p>
              </div>
              {index < arr.length - 1 && (
                <div className="absolute top-1/2 -right-4 z-10 hidden translate-x-1/2 -translate-y-1/2 md:block">
                  <ArrowRight className="h-5 w-5 text-gray-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
