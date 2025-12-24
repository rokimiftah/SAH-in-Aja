import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "wouter";

export const CTASection = () => {
  return (
    <section className="border-t border-gray-200 bg-gray-50 py-12 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl px-4 text-center sm:px-6"
      >
        <h2 className="mb-2 text-xl font-semibold text-gray-900 sm:mb-3 sm:text-3xl">Siap Memulai?</h2>
        <p className="mx-auto mb-5 max-w-xl text-sm text-gray-500 sm:mb-6 sm:text-base">
          Bergabung dengan ratusan UMKM lainnya yang sudah menggunakan SAH-in Aja!
        </p>
        <Link
          href="/login"
          className="group bg-primary-green hover:bg-primary-green/90 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition sm:px-6 sm:py-3"
        >
          Mulai Gratis Sekarang
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </Link>
      </motion.div>
    </section>
  );
};
