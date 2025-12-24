import { motion } from "motion/react";
import { Link } from "wouter";

export const Navbar = () => {
  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-1 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.avif" alt="SAH-in Aja!" className="h-10 w-auto sm:h-11" />
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="hidden px-4 py-2 text-sm font-medium text-gray-600 transition hover:text-gray-900 sm:block"
          >
            Masuk
          </Link>
          <Link
            href="/login"
            className="bg-primary-green hover:bg-primary-green/90 rounded-lg px-3 py-2 text-sm font-medium text-white transition sm:px-4"
          >
            Mulai Gratis
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};
