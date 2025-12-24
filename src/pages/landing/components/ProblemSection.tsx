import { AlertTriangle, CircleDollarSign } from "lucide-react";
import { motion } from "motion/react";

export const ProblemSection = () => {
  return (
    <section className="py-12 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-8 max-w-2xl text-center sm:mb-12"
        >
          <h2 className="mb-2 text-xl font-semibold text-gray-900 sm:mb-3 sm:text-3xl">
            Kenapa Persiapan Sertifikasi Halal Sulit?
          </h2>
          <p className="text-sm text-gray-500 sm:text-base">Masalah yang sering dihadapi UMKM</p>
        </motion.div>

        <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-[0_4px_15px_rgba(239,68,68,0.1)] sm:rounded-xl sm:p-6"
          >
            <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold tracking-tight text-gray-900 sm:text-xl">
              <CircleDollarSign className="h-5 w-5 text-gray-400" />
              Biaya Konsultan Mahal
            </h3>
            <p className="text-sm leading-relaxed text-gray-500 sm:text-[15px]">
              Konsultan pre-audit bisa menghabiskan 2-5 juta rupiah, belum termasuk biaya audit resmi.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-[0_4px_15px_rgba(239,68,68,0.1)] sm:rounded-xl sm:p-6"
          >
            <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold tracking-tight text-gray-900 sm:text-xl">
              <AlertTriangle className="h-5 w-5 text-gray-400" />
              Takut Gagal Audit
            </h3>
            <p className="text-sm leading-relaxed text-gray-500 sm:text-[15px]">
              Tidak tahu apa yang kurang dan harus diperbaiki sebelum proses audit resmi.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
