import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const steps = [
  {
    step: "1",
    title: "Siap Halal",
    description: "Foto area produksi, AI analisis kesiapan halal dalam 2 menit.",
    color: "bg-primary-green",
  },
  {
    step: "2",
    title: "Dokumen Halal",
    description: "Generate dokumen SJPH dan SOP produksi secara otomatis.",
    color: "bg-primary-blue",
  },
  {
    step: "3",
    title: "Siap Sertifikasi",
    description: "Daftar ke BPJPH. Butuh bantuan? Tanya Asisten Halal 24/7.",
    color: "bg-primary-orange",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-12 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div {...fadeInUp} className="mx-auto mb-10 max-w-2xl text-center sm:mb-16">
          <h2 className="mb-2 text-xl font-semibold text-gray-900 sm:mb-3 sm:text-3xl">Semudah 1-2-3</h2>
          <p className="text-sm text-gray-500 sm:text-base">Tiga langkah sederhana menuju sertifikasi halal</p>
        </motion.div>

        <div className="grid gap-4 sm:gap-8 md:grid-cols-3">
          {steps.map((item, index, arr) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] sm:rounded-xl sm:p-6">
                <div className="mb-2 flex items-center gap-3 sm:mb-3">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white sm:h-8 sm:w-8 sm:text-sm ${item.color}`}
                  >
                    {item.step}
                  </span>
                  <h3 className="text-base font-semibold tracking-tight text-gray-900 sm:text-lg">{item.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-gray-500 sm:text-[15px]">{item.description}</p>
              </div>
              {index < arr.length - 1 && (
                <div className="absolute top-1/2 -right-4 z-10 hidden translate-x-1/2 -translate-y-1/2 md:block">
                  <ArrowRight className="text-primary-green h-5 w-5" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
