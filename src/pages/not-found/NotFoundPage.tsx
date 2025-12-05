import { Link } from "wouter";

import { Footer, Header } from "@shared/components/layout";

export const NotFoundPage = () => {
  return (
    <div className="bg-bg-cream font-poppins text-text-dark flex min-h-screen flex-col">
      <Header />

      <main className="flex grow flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="text-primary-green mb-4 text-9xl font-bold">404</h1>
        <h2 className="text-text-dark mb-4 text-2xl font-semibold md:text-3xl">Waduh! Halaman tidak ditemukan</h2>
        <p className="text-text-muted mb-8 max-w-md">
          Sepertinya Anda tersesat. Halaman yang Anda cari mungkin sudah dihapus atau tautannya salah.
        </p>

        <Link
          href="/"
          className="bg-primary-green hover:bg-primary-green/90 inline-flex cursor-pointer items-center justify-center rounded-full px-8 py-3 font-semibold text-white transition-all duration-200"
        >
          Kembali ke Beranda
        </Link>
      </main>

      <div className="w-full px-4 pb-6">
        <div className="mx-auto max-w-5xl">
          <Footer />
        </div>
      </div>
    </div>
  );
};
