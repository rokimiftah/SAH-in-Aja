import { useState } from "react";

import { AnimatePresence, motion } from "motion/react";

import { SparklesText } from "@shared/components/ui";

export const HeroSection = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="border-primary-green mb-6 rounded-(--radius-card) border-4 bg-white p-6 shadow-lg">
      <div className="mb-4 flex justify-center sm:mb-2">
        <img src="/hero.avif" alt="Sah-in Aja Hero" className="w-full rounded-(--radius-card) object-cover" />
      </div>

      <div className="px-4 text-center sm:p-8">
        <div className="mb-2 flex flex-col justify-center pt-2">
          <AnimatePresence mode="wait">
            {!isHovered ? (
              <motion.h1
                key="original"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-text-dark text-2xl leading-tight font-bold sm:text-3xl"
              >
                <span className="whitespace-nowrap">Paham Dulu,</span>
                <br className="block sm:hidden" />{" "}
                <span>
                  Baru Usahamu <span className="text-accent-pink">SAH!</span>
                </span>
              </motion.h1>
            ) : (
              <motion.h1
                key="thankyou"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-2xl leading-tight font-bold sm:text-3xl"
              >
                <span className="text-text-muted">Terima kasih</span>{" "}
                <span className="from-primary-blue to-accent-pink bg-linear-to-r via-purple-500 bg-clip-text text-transparent">
                  IMPHNEN
                </span>
                <span className="bg-linear-to-r from-[#2E7D32] via-[#00838F] to-[#1565C0] bg-clip-text text-transparent"> &</span>{" "}
                <span className="</span>">Kolosal.ai</span>
              </motion.h1>
            )}
          </AnimatePresence>
        </div>
        <div className="text-text-muted mx-auto mb-2 max-w-md text-base sm:text-lg">
          Asisten{" "}
          <div
            className="inline-block cursor-pointer align-bottom"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <SparklesText className="text-base sm:text-lg" colors={{ first: "#FF5D8F", second: "#00A896" }}>
              <span className="underline underline-offset-3">AI</span>
            </SparklesText>
          </div>{" "}
          untuk Persiapan Sertifikasi Halal.
          <br />
          Siap Halal dari Dapur hingga Sertifikat!
        </div>
        <button className="rounded-button bg-primary-green mt-4 w-full cursor-pointer px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:opacity-90 hover:shadow-xl active:scale-[0.98]">
          Cek Kesiapan Halal Gratis!
        </button>
      </div>
    </div>
  );
};
