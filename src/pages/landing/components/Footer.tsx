import { Link } from "wouter";

export const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white py-6 sm:py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <img src="/logo.avif" alt="SAH-in Aja!" className="h-8 w-auto sm:h-10" />
          <div className="flex items-center gap-4 text-xs text-gray-500 sm:gap-6 sm:text-sm">
            <Link href="/terms" className="transition hover:text-gray-900">
              Syarat & Ketentuan
            </Link>
            <Link href="/privacy" className="transition hover:text-gray-900">
              Kebijakan Privasi
            </Link>
          </div>
        </div>
        <div className="mt-4 border-t border-gray-100 pt-4 text-center text-xs text-gray-400 sm:mt-6 sm:pt-6">
          Hackathon IMPHNEN x Kolosai.ai 2025
        </div>
      </div>
    </footer>
  );
};
