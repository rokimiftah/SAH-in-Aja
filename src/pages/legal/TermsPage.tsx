import { useEffect } from "react";

import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

import { Footer, Navbar } from "@pages/landing/components";

export const TermsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white font-poppins">
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
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">Syarat & Ketentuan</h1>
            <p className="mt-2 text-sm text-gray-500">
              Terakhir diperbarui: {new Date().toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          <div className="space-y-8 text-gray-600">
            <section>
              <h2 className="mb-3 text-lg font-semibold text-gray-900">1. Pendahuluan</h2>
              <p className="leading-relaxed">
                Selamat datang di SAH-in Aja! ("Layanan"). Dengan mengakses atau menggunakan layanan kami, Anda menyetujui untuk
                terikat dengan Syarat dan Ketentuan ini. Jika Anda tidak setuju dengan bagian mana pun dari syarat ini, mohon
                untuk tidak menggunakan layanan kami.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-gray-900">2. Layanan Kami</h2>
              <p className="leading-relaxed">
                SAH-in Aja menyediakan layanan analisis dokumen dan bantuan pengecekan kepatuhan (compliance) untuk produk halal
                dan keperluan administratif lainnya. Hasil analisis yang diberikan oleh sistem kami bersifat sebagai referensi dan
                pendukung, bukan sebagai pengganti nasihat hukum profesional atau keputusan resmi dari badan sertifikasi terkait.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-gray-900">3. Akun Pengguna</h2>
              <ul className="list-disc space-y-2 pl-5 leading-relaxed">
                <li>Anda bertanggung jawab untuk menjaga kerahasiaan kredensial akun Anda.</li>
                <li>Anda harus memberikan informasi yang akurat dan lengkap saat mendaftar.</li>
                <li>Kami berhak menangguhkan atau menghentikan akun Anda jika terindikasi melanggar ketentuan ini.</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-gray-900">4. Hak Kekayaan Intelektual</h2>
              <p className="leading-relaxed">
                Layanan dan konten aslinya, fitur, dan fungsionalitasnya adalah dan akan tetap menjadi milik eksklusif SAH-in Aja
                dan pemberi lisensinya.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-gray-900">5. Batasan Tanggung Jawab</h2>
              <p className="leading-relaxed">
                SAH-in Aja tidak bertanggung jawab atas kerugian langsung, tidak langsung, insidental, atau konsekuensi yang
                timbul dari penggunaan Anda terhadap layanan ini. Keputusan akhir mengenai sertifikasi atau persetujuan dokumen
                tetap berada di tangan lembaga yang berwenang.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-gray-900">6. Perubahan Ketentuan</h2>
              <p className="leading-relaxed">
                Kami berhak untuk mengubah atau mengganti Syarat ini kapan saja. Kami akan memberitahukan perubahan tersebut
                melalui layanan kami.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
