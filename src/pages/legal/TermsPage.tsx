import { Link } from "wouter";

import { Footer, Header } from "@shared/components/layout";

export const TermsPage = () => {
  return (
    <div className="bg-bg-cream font-poppins text-text-dark min-h-screen">
      <Header />

      <section className="px-4 pt-8 pb-12 sm:pt-12">
        <div className="mx-auto max-w-4xl rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="mb-6">
            <Link href="/" className="text-primary-blue mb-4 inline-block text-sm hover:underline">
              &larr; Kembali ke Beranda
            </Link>
            <h1 className="text-primary-green mb-2 text-3xl font-bold">Syarat & Ketentuan</h1>
            <p className="text-sm text-gray-500">
              Terakhir diperbarui: {new Date().toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          <div className="prose prose-slate max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-text-dark mb-3 text-xl font-bold">1. Pendahuluan</h2>
              <p>
                Selamat datang di SAH-in Aja! ("Layanan"). Dengan mengakses atau menggunakan layanan kami, Anda menyetujui untuk
                terikat dengan Syarat dan Ketentuan ini. Jika Anda tidak setuju dengan bagian mana pun dari syarat ini, mohon
                untuk tidak menggunakan layanan kami.
              </p>
            </section>

            <section>
              <h2 className="text-text-dark mb-3 text-xl font-bold">2. Layanan Kami</h2>
              <p>
                SAH-in Aja menyediakan layanan analisis dokumen dan bantuan pengecekan kepatuhan (compliance) untuk produk halal
                dan keperluan administratif lainnya. Hasil analisis yang diberikan oleh sistem kami bersifat sebagai referensi dan
                pendukung, bukan sebagai pengganti nasihat hukum profesional atau keputusan resmi dari badan sertifikasi terkait.
              </p>
            </section>

            <section>
              <h2 className="text-text-dark mb-3 text-xl font-bold">3. Akun Pengguna</h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>Anda bertanggung jawab untuk menjaga kerahasiaan kredensial akun Anda.</li>
                <li>Anda harus memberikan informasi yang akurat dan lengkap saat mendaftar.</li>
                <li>Kami berhak menangguhkan atau menghentikan akun Anda jika terindikasi melanggar ketentuan ini.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-text-dark mb-3 text-xl font-bold">4. Hak Kekayaan Intelektual</h2>
              <p>
                Layanan dan konten aslinya, fitur, dan fungsionalitasnya adalah dan akan tetap menjadi milik eksklusif SAH-in Aja
                dan pemberi lisensinya.
              </p>
            </section>

            <section>
              <h2 className="text-text-dark mb-3 text-xl font-bold">5. Batasan Tanggung Jawab</h2>
              <p>
                SAH-in Aja tidak bertanggung jawab atas kerugian langsung, tidak langsung, insidental, atau konsekuensi yang
                timbul dari penggunaan Anda terhadap layanan ini. Keputusan akhir mengenai sertifikasi atau persetujuan dokumen
                tetap berada di tangan lembaga yang berwenang.
              </p>
            </section>

            <section>
              <h2 className="text-text-dark mb-3 text-xl font-bold">6. Perubahan Ketentuan</h2>
              <p>
                Kami berhak untuk mengubah atau mengganti Syarat ini kapan saja. Kami akan memberitahukan perubahan tersebut
                melalui layanan kami.
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
