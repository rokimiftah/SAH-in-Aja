import { Link } from "wouter";

import { Footer, Header } from "@shared/components/layout";

export const PrivacyPage = () => {
  return (
    <div className="bg-bg-cream font-poppins text-text-dark min-h-screen">
      <Header />

      <section className="px-4 pt-8 pb-12 sm:pt-12">
        <div className="mx-auto max-w-4xl rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="mb-6">
            <Link href="/" className="text-primary-blue mb-4 inline-block text-sm hover:underline">
              &larr; Kembali ke Beranda
            </Link>
            <h1 className="text-primary-green mb-2 text-3xl font-bold">Kebijakan Privasi</h1>
            <p className="text-sm text-gray-500">
              Terakhir diperbarui: {new Date().toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          <div className="prose prose-slate max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-text-dark mb-3 text-xl font-bold">1. Informasi yang Kami Kumpulkan</h2>
              <p>
                Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami, seperti saat Anda membuat akun,
                mengunggah dokumen untuk dianalisis, atau menghubungi dukungan pelanggan. Informasi ini dapat mencakup nama,
                alamat email, dan konten dokumen yang Anda unggah.
              </p>
            </section>

            <section>
              <h2 className="text-text-dark mb-3 text-xl font-bold">2. Penggunaan Informasi</h2>
              <p>Kami menggunakan informasi yang kami kumpulkan untuk:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Menyediakan, memelihara, dan meningkatkan layanan kami.</li>
                <li>Memproses dan menganalisis dokumen sesuai permintaan Anda.</li>
                <li>Mengirimkan notifikasi teknis, pembaruan, dan pesan dukungan.</li>
                <li>Memantau dan menganalisis tren penggunaan untuk meningkatkan pengalaman pengguna.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-text-dark mb-3 text-xl font-bold">3. Penyimpanan dan Keamanan Data</h2>
              <p>
                Kami mengambil langkah-langkah keamanan yang wajar untuk melindungi informasi Anda dari akses, pengungkapan,
                pengubahan, atau perusakan yang tidak sah. Dokumen yang Anda unggah diproses secara aman.
              </p>
            </section>

            <section>
              <h2 className="text-text-dark mb-3 text-xl font-bold">4. Berbagi Informasi</h2>
              <p>
                Kami tidak menjual data pribadi Anda kepada pihak ketiga. Kami hanya membagikan informasi jika diperlukan untuk
                mematuhi hukum atau melindungi hak dan keselamatan kami serta pengguna kami.
              </p>
            </section>

            <section>
              <h2 className="text-text-dark mb-3 text-xl font-bold">5. Hak Anda</h2>
              <p>
                Anda memiliki hak untuk mengakses, memperbarui, atau menghapus informasi pribadi Anda yang kami simpan. Hubungi
                kami jika Anda ingin menggunakan hak-hak ini.
              </p>
            </section>

            <section>
              <h2 className="text-text-dark mb-3 text-xl font-bold">6. Hubungi Kami</h2>
              <p>
                Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami melalui saluran dukungan yang
                tersedia di aplikasi.
              </p>
            </section>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-4xl">
          <Footer />
        </div>
      </section>
    </div>
  );
};
