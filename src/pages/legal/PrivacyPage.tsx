import { useEffect } from "react";

import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

import { Footer, Navbar } from "@pages/landing/components";

export const PrivacyPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="font-poppins min-h-screen bg-white">
      <Navbar />

      <main className="px-4 pt-24 pb-16 sm:pt-28">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">Kebijakan Privasi</h1>
            <p className="mt-2 text-sm text-gray-500">
              Terakhir diperbarui: {new Date().toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          <div className="space-y-8 text-gray-600">
            <section>
              <h2 className="mb-3 text-lg font-semibold text-gray-900">1. Informasi yang Kami Kumpulkan</h2>
              <p className="leading-relaxed">
                Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami, seperti saat Anda membuat akun,
                mengunggah dokumen untuk dianalisis, atau menghubungi dukungan pelanggan. Informasi ini dapat mencakup nama,
                alamat email, dan konten dokumen yang Anda unggah.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-gray-900">2. Penggunaan Informasi</h2>
              <p className="mb-3 leading-relaxed">Kami menggunakan informasi yang kami kumpulkan untuk:</p>
              <ul className="list-disc space-y-2 pl-5 leading-relaxed">
                <li>Menyediakan, memelihara, dan meningkatkan layanan kami.</li>
                <li>Memproses dan menganalisis dokumen sesuai permintaan Anda.</li>
                <li>Mengirimkan notifikasi teknis, pembaruan, dan pesan dukungan.</li>
                <li>Memantau dan menganalisis tren penggunaan untuk meningkatkan pengalaman pengguna.</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-gray-900">3. Penyimpanan dan Keamanan Data</h2>
              <p className="leading-relaxed">
                Kami mengambil langkah-langkah keamanan yang wajar untuk melindungi informasi Anda dari akses, pengungkapan,
                pengubahan, atau perusakan yang tidak sah. Dokumen yang Anda unggah diproses secara aman.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-gray-900">4. Berbagi Informasi</h2>
              <p className="leading-relaxed">
                Kami tidak menjual data pribadi Anda kepada pihak ketiga. Kami hanya membagikan informasi jika diperlukan untuk
                mematuhi hukum atau melindungi hak dan keselamatan kami serta pengguna kami.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-gray-900">5. Hak Anda</h2>
              <p className="leading-relaxed">
                Anda memiliki hak untuk mengakses, memperbarui, atau menghapus informasi pribadi Anda yang kami simpan. Hubungi
                kami jika Anda ingin menggunakan hak-hak ini.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-gray-900">6. Hubungi Kami</h2>
              <p className="leading-relaxed">
                Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami melalui saluran dukungan yang
                tersedia di aplikasi.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
