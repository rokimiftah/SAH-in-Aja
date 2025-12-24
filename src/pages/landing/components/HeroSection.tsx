import { useState } from "react";

import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "wouter";

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5 },
};

export const HeroSection = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <section className="pt-20 pb-12 sm:pt-24 sm:pb-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div {...fadeIn} className="mx-auto max-w-3xl pt-6 text-center sm:pt-16">
          <h1 className="mb-4 text-3xl font-semibold tracking-tight text-gray-900 sm:mb-5 sm:text-5xl lg:text-6xl">
            Persiapan Sertifikasi Halal Lebih Mudah
          </h1>
          <p className="mx-auto mb-6 max-w-2xl text-base text-gray-500 sm:mb-8 sm:text-lg">
            Platform AI lengkap untuk persiapan sertifikasi halal UMKM. Cek kesiapan, analisis bahan, buat dokumen, konsultasi,
            dan latihan audit.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/login"
              className="group bg-primary-green hover:bg-primary-green/90 flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-medium text-white transition sm:w-auto"
            >
              Coba Gratis Sekarang
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#features"
              className="w-full rounded-lg border border-gray-200 px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:w-auto"
            >
              Lihat Fitur
            </a>
          </div>
        </motion.div>
      </div>

      <div className="mx-auto mt-8 max-w-7xl px-4 sm:mt-12 sm:px-6">
        <motion.img
          src="/landing/dashboard.avif"
          alt="Dashboard SAH-in Aja"
          onLoad={() => setImageLoaded(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: imageLoaded ? 1 : 0 }}
          transition={{ duration: 0.6 }}
          className="w-full rounded-lg border border-gray-200 shadow-[0_20px_40px_-15px_rgba(0,168,132,0.4)] sm:rounded-xl sm:shadow-[0_35px_60px_-20px_rgba(0,168,132,0.5)]"
        />
      </div>
    </section>
  );
};
