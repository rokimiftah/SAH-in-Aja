import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

import { Footer, Navbar } from "@pages/landing/components";

export const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-white font-poppins">
      <Navbar />

      <main className="flex grow flex-col items-center justify-center px-4 py-16 text-center">
        <p className="mb-4 text-8xl font-bold text-gray-200 sm:text-9xl">404</p>
        <h1 className="mb-3 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">Halaman tidak ditemukan</h1>
        <p className="mb-8 max-w-md text-sm text-gray-500 sm:text-base">
          Sepertinya Anda tersesat. Halaman yang Anda cari mungkin sudah dihapus atau tautannya salah.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-green px-6 py-3 text-sm font-medium text-white transition hover:bg-primary-green/90"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Beranda
        </Link>
      </main>

      <Footer />
    </div>
  );
};
