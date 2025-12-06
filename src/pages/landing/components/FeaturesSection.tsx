import { Camera, CheckCircle2, FileText, MessageCircle } from "lucide-react";
import { motion } from "motion/react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const features = [
  {
    id: "siap-halal",
    icon: Camera,
    label: "Siap Halal",
    title: "Cek Kesiapan dengan AI Vision",
    description:
      "Foto area produksimu, dan AI kami akan menganalisis kesiapan halal secara otomatis. Dapatkan skor dan rekomendasi perbaikan dalam hitungan menit.",
    items: ["Analisis foto area produksi", "Skor kesiapan halal otomatis", "Rekomendasi perbaikan detail", "Hasil dalam 2 menit"],
    image: "/landing/siap_halal.avif",
    color: "text-primary-green",
    shadow: "shadow-[0_6px_20px_rgba(0,168,132,0.15)]",
    imagePosition: "right",
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
    color: "text-primary-blue",
    shadow: "shadow-[0_6px_20px_rgba(61,127,255,0.15)]",
    imagePosition: "left",
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
    color: "text-primary-orange",
    shadow: "shadow-[0_6px_20px_rgba(245,166,35,0.15)]",
    imagePosition: "right",
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="bg-gray-50 py-12 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div {...fadeInUp} className="mx-auto mb-10 max-w-2xl text-center sm:mb-16">
          <h2 className="mb-2 text-xl font-semibold text-gray-900 sm:mb-3 sm:text-3xl">3 Fitur Utama</h2>
          <p className="text-sm text-gray-500 sm:text-base">Semua yang kamu butuhkan untuk persiapan sertifikasi halal</p>
        </motion.div>

        <div className="space-y-12 sm:space-y-20">
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid items-center gap-6 sm:gap-10 lg:grid-cols-2"
            >
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
