import { Camera, CheckCircle2, FileText, MessageCircle, Mic, Package } from "lucide-react";

const features = [
  {
    id: "siap-halal",
    icon: Camera,
    label: "Cek Dapur Halal",
    title: "Cek Kesiapan dengan AI Vision",
    description:
      "Foto area produksimu, dan AI kami akan menganalisis kesiapan halal secara otomatis. Dapatkan skor dan rekomendasi perbaikan dalam hitungan menit.",
    items: ["Analisis foto area produksi", "Skor kesiapan halal otomatis", "Rekomendasi perbaikan detail", "Hasil dalam 2 menit"],
    image: "/landing/cek_dapur_halal.avif",
    color: "text-emerald-600",
    shadow: "shadow-[0_6px_20px_rgba(16,185,129,0.15)]",
    imagePosition: "right",
  },
  {
    id: "cek-bahan",
    icon: Package,
    label: "Cek Bahan Halal",
    title: "Smart Material Scanner",
    description:
      "Foto kemasan produk, AI deteksi logo halal, cek Positive List, dan analisis komposisi bahan untuk memastikan status halal sebelum digunakan.",
    items: ["Deteksi logo halal otomatis", "Cek bahan kritis E-Number", "Analisis komposisi bahan", "Hasil instan 10 detik"],
    image: "/landing/cek_bahan_halal.avif",
    color: "text-cyan-600",
    shadow: "shadow-[0_6px_20px_rgba(6,182,212,0.15)]",
    imagePosition: "left",
  },
  {
    id: "dokumen-halal",
    icon: FileText,
    label: "Dokumen Halal",
    title: "Generate Dokumen SJPH Otomatis",
    description:
      "Buat dokumen wajib untuk sertifikasi halal secara otomatis. Dari SOP produksi hingga daftar bahan baku, semua tersedia dalam format siap pakai.",
    items: ["SOP Produksi Halal", "Manual SJPH lengkap", "Daftar Bahan Baku", "Template siap pakai"],
    image: "/landing/dokumen_halal.avif",
    color: "text-blue-600",
    shadow: "shadow-[0_6px_20px_rgba(37,99,235,0.15)]",
    imagePosition: "right",
  },
  {
    id: "asisten-halal",
    icon: MessageCircle,
    label: "Asisten Halal",
    title: "Konsultasi AI 24/7",
    description:
      "Tanya jawab seputar sertifikasi halal kapan saja. Asisten AI kami siap membantu menjawab pertanyaan dan memberikan panduan step-by-step.",
    items: ["Panduan BPJPH lengkap", "Jawaban real-time", "Rekomendasi supplier halal", "Tips lulus audit"],
    image: "/landing/asisten_halal.avif",
    color: "text-orange-600",
    shadow: "shadow-[0_6px_20px_rgba(234,88,12,0.15)]",
    imagePosition: "left",
  },
  {
    id: "voice-audit",
    icon: Mic,
    label: "Simulasi Audit Halal",
    title: "Latih Mental Menghadapi Auditor",
    description:
      "Simulasi wawancara suara dengan AI sebagai auditor BPJPH. Latih mental dan pelajari jawaban yang benar sebelum menghadapi audit resmi.",
    items: ["Wawancara suara real-time", "Auditor AI yang supportif", "Feedback langsung", "Referensi standar SJPH"],
    image: "/landing/simulasi_audit_halal.avif",
    color: "text-rose-600",
    shadow: "shadow-[0_6px_20px_rgba(225,29,72,0.15)]",
    imagePosition: "right",
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="bg-gray-50 py-12 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-16">
          <h2 className="mb-2 text-xl font-semibold text-gray-900 sm:mb-3 sm:text-3xl">5 Fitur Utama</h2>
          <p className="text-sm text-gray-500 sm:text-base">Semua yang kamu butuhkan untuk persiapan sertifikasi halal</p>
        </div>

        <div className="space-y-12 sm:space-y-20">
          {features.map((feature) => (
            <div key={feature.id} className="grid items-center gap-6 sm:gap-10 lg:grid-cols-2">
              <div className={feature.imagePosition === "right" ? "order-2 lg:order-1" : "order-2"}>
                <div className={`mb-2 inline-flex items-center gap-1.5 text-xs font-medium sm:mb-3 sm:text-sm ${feature.color}`}>
                  <feature.icon className="h-4 w-4" />
                  {feature.label}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 sm:mb-3 sm:text-2xl">{feature.title}</h3>
                <p className="mb-4 text-sm text-gray-500 sm:mb-5 sm:text-base">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-gray-600 sm:text-sm">
                      <CheckCircle2 className={`h-4 w-4 shrink-0 ${feature.color}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={feature.imagePosition === "right" ? "order-1 lg:order-2" : "order-1"}>
                <img
                  src={feature.image}
                  alt={`Fitur ${feature.label}`}
                  className={`w-full rounded-lg border border-gray-200 sm:rounded-xl ${feature.shadow}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
