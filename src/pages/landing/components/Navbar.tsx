import { motion } from "motion/react";
import { Link, useLocation } from "wouter";

export const Navbar = () => {
  const [location] = useLocation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.history.replaceState(null, "", "/");
  };

  const scrollToPricing = () => {
    const section = document.getElementById("pricing");
    if (!section) return;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.pushState(null, "", "#pricing");
  };

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-1 sm:px-6">
        <Link
          href="/"
          onClick={(event) => {
            if (location === "/") {
              event.preventDefault();
              scrollToTop();
            }
          }}
          className="flex items-center gap-2"
        >
          <img src="/logo.avif" alt="SAH-in Aja!" className="h-10 w-auto sm:h-11" />
        </Link>
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/#pricing"
            onClick={(event) => {
              if (location === "/") {
                event.preventDefault();
                scrollToPricing();
              }
            }}
            className="hidden py-2 text-sm font-medium text-gray-600 transition hover:text-gray-900 sm:block"
          >
            Harga
          </Link>
          <Link
            href="/login"
            className="hidden px-2 py-2 text-sm font-medium text-gray-600 transition hover:text-gray-900 sm:block"
          >
            Masuk
          </Link>
          <Link
            href="/login"
            className="bg-primary-green hover:bg-primary-green/90 rounded-lg px-4 py-2 text-sm font-medium text-white transition"
          >
            Mulai Gratis
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};
