// Offline Knowledge Base - FAQ cache untuk akses offline
// Berguna untuk UMKM di daerah dengan koneksi tidak stabil

interface FAQ {
  keywords: string[];
  question: string;
  answer: string;
}

const STORAGE_KEY = "sah_halal_faq_cache";
const CACHE_VERSION = "2.0"; // Updated version

// Built-in FAQ database (sama dengan backend - expanded)
const BUILTIN_FAQS: FAQ[] = [
  // === PENDAFTARAN & PROSES ===
  {
    keywords: ["daftar", "cara", "sertifikasi", "halal", "bpjph", "langkah"],
    question: "Bagaimana cara mendaftar sertifikasi halal?",
    answer: `Langkah pendaftaran sertifikasi halal BPJPH:

1. Buka website halal.go.id
2. Registrasi akun pelaku usaha
3. Login dan pilih "Pengajuan Sertifikasi Halal"
4. Lengkapi data usaha dan produk
5. Upload dokumen SJPH (SOP, Daftar Bahan, dll)
6. Bayar biaya sertifikasi
7. Tunggu jadwal audit dari LPH
8. Jika lulus, sertifikat halal akan diterbitkan

Biaya sertifikasi untuk UMKM Mikro: GRATIS (program SEHATI)
Untuk info lebih lanjut: halal.go.id atau hubungi BPJPH di 1500-363`,
  },
  {
    keywords: ["dokumen", "persyaratan", "sjph", "syarat", "berkas"],
    question: "Apa saja dokumen yang diperlukan untuk sertifikasi halal?",
    answer: `Dokumen wajib untuk sertifikasi halal BPJPH:

1. SOP Produksi Halal
2. Daftar Bahan Baku (dengan sertifikat halal masing-masing)
3. Perjanjian Supplier Halal
4. Form Traceability
5. Surat Komitmen Halal dari Pemilik Usaha
6. Denah Lokasi Produksi
7. Foto Area Produksi
8. NIB (Nomor Induk Berusaha)

Tips: Gunakan fitur "Dokumen Halal" di SAH-in Aja! untuk generate template dokumen ini.`,
  },
  {
    keywords: ["biaya", "harga", "tarif", "gratis", "sehati", "bayar"],
    question: "Berapa biaya sertifikasi halal?",
    answer: `Biaya sertifikasi halal BPJPH:

GRATIS untuk UMKM Mikro (Program SEHATI):
- Omset < 2 Miliar/tahun
- Daftar melalui halal.go.id pilih "SEHATI"

Berbayar untuk usaha menengah/besar:
- Tarif tergantung jenis dan jumlah produk
- Mulai dari Rp 300.000 - Rp 5.000.000
- Cek tarif resmi di halal.go.id

Biaya audit LPH (Lembaga Pemeriksa Halal):
- Terpisah dari biaya BPJPH
- Rata-rata Rp 1.500.000 - Rp 3.000.000`,
  },
  {
    keywords: ["lama", "waktu", "proses", "berapa hari", "durasi"],
    question: "Berapa lama proses sertifikasi halal?",
    answer: `Estimasi waktu proses sertifikasi halal:

1. Persiapan dokumen: 1-2 minggu (tergantung kesiapan)
2. Review dokumen BPJPH: 1-3 hari kerja
3. Audit LPH: 1-2 minggu (sesuai jadwal)
4. Penetapan kehalalan MUI: 1-2 minggu
5. Penerbitan sertifikat: 1-3 hari

TOTAL: sekitar 1-2 bulan

Tips untuk mempercepat:
- Siapkan semua dokumen dengan lengkap
- Gunakan SAH-in Aja! untuk cek kesiapan sebelum audit
- Pastikan tidak ada temuan critical saat audit`,
  },

  // === BAHAN BAKU ===
  {
    keywords: ["bahan", "haram", "critical", "tidak boleh", "dilarang"],
    question: "Bahan apa saja yang haram dan harus dihindari?",
    answer: `Bahan yang HARUS DIHINDARI untuk produk halal:

BAHAN JELAS HARAM:
- Daging babi dan turunannya (gelatin babi, lard)
- Alkohol (etanol, wine, mirin, sake)
- Darah dan produk darah
- Bangkai (hewan tidak disembelih)

BAHAN PERLU CEK SERTIFIKAT:
- Gelatin (bisa dari sapi halal atau babi)
- Emulsifier E471, E481, E482 (bisa dari hewani)
- Shortening, margarin (cek sumber lemak)
- Whey, kasein (dairy, perlu cek proses)
- Enzim (bisa dari mikroba atau hewani)
- Pewarna karmin/E120 (dari serangga)

TIPS: Selalu minta sertifikat halal dari supplier untuk setiap bahan!`,
  },
  {
    keywords: ["gelatin", "jelly", "agar", "pengental"],
    question: "Bagaimana status halal gelatin?",
    answer: `Panduan tentang GELATIN untuk produk halal:

STATUS GELATIN:
- Gelatin BABI: HARAM (tidak boleh digunakan sama sekali)
- Gelatin SAPI: Halal JIKA disembelih secara syar'i dan ada sertifikat
- Gelatin IKAN: Halal (pastikan ada sertifikat)

ALTERNATIF GELATIN HALAL:
- Agar-agar (dari rumput laut) - 100% halal
- Karagenan (dari rumput laut)
- Pektin (dari buah-buahan)
- Gelatin ikan (fish gelatin)

TIPS: Untuk UMKM, lebih aman gunakan agar-agar karena pasti halal dan mudah didapat.`,
  },
  {
    keywords: ["emulsifier", "e471", "e472", "e481", "pengemulsi"],
    question: "Apakah emulsifier E471 halal?",
    answer: `Panduan EMULSIFIER untuk produk halal:

E471 (Mono dan Digliserida):
- PERLU CEK SUMBER - bisa dari nabati atau hewani
- Jika dari hewani, WAJIB ada sertifikat halal
- Jika dari nabati (sawit/kedelai), umumnya halal

EMULSIFIER YANG AMAN (NABATI):
- Lesitin kedelai (E322)
- Lesitin bunga matahari
- DATEM dari nabati

TIPS: Pilih supplier yang sudah bersertifikat halal untuk menghindari keraguan.`,
  },
  {
    keywords: ["alkohol", "etanol", "miras", "wine", "khamr"],
    question: "Bagaimana aturan alkohol dalam produk halal?",
    answer: `Panduan ALKOHOL untuk produk halal:

HARAM (Tidak Boleh):
- Khamr/minuman keras (wine, bir, arak, sake)
- Mirin (alkohol masak Jepang)
- Vanilla extract dengan alkohol tinggi

DIBOLEHKAN:
- Alkohol dari fermentasi alami dalam jumlah sangat kecil (<0.5%)
- Alkohol sebagai pelarut yang menguap habis saat proses
- Cuka (alkohol sudah berubah jadi asam asetat)

TIPS: Hindari bahan yang mengandung alkohol jika ragu.`,
  },
  {
    keywords: ["pewarna", "karmin", "e120", "cochineal", "warna"],
    question: "Apakah pewarna karmin/E120 halal?",
    answer: `Panduan PEWARNA untuk produk halal:

PEWARNA YANG PERLU DICEK:
- E120 (Karmin/Cochineal): DARI SERANGGA - sebaiknya dihindari

PEWARNA YANG AMAN (HALAL):
- E100 (Kurkumin) - dari kunyit
- E140 (Klorofil) - dari daun
- E160a (Beta karoten) - dari wortel
- E162 (Betanin) - dari bit merah

TIPS: Gunakan pewarna alami dari tumbuhan untuk memastikan kehalalan.`,
  },
  {
    keywords: ["enzim", "rennet", "pepsin", "lipase"],
    question: "Bagaimana status halal enzim?",
    answer: `Panduan ENZIM untuk produk halal:

STATUS BERDASARKAN SUMBER:
1. Enzim dari MIKROBA/JAMUR: Halal
2. Enzim dari TANAMAN: Halal
3. Enzim dari HEWAN: Perlu sertifikat halal

ENZIM DALAM KEJU:
- Keju dengan "microbial rennet" atau "vegetable rennet": Halal
- Keju dengan "animal rennet": Perlu cek sertifikat

TIPS: Untuk produk keju, pilih yang berlabel halal atau vegetarian.`,
  },
  {
    keywords: ["daging", "sembelih", "penyembelihan", "potong", "ayam", "sapi"],
    question: "Bagaimana kriteria daging halal?",
    answer: `Kriteria DAGING HALAL:

SYARAT PENYEMBELIHAN:
1. Hewan harus halal (sapi, kambing, ayam, dll)
2. Disembelih oleh Muslim yang baligh berakal
3. Menyebut nama Allah (Bismillah, Allahu Akbar)
4. Memutus 3 saluran: tenggorokan, kerongkongan, pembuluh darah
5. Menggunakan pisau tajam
6. Hewan dalam keadaan hidup saat disembelih

TIPS: Pastikan supplier daging memiliki sertifikat halal yang masih berlaku.`,
  },
  {
    keywords: ["susu", "dairy", "whey", "kasein", "keju", "mentega"],
    question: "Apakah produk susu/dairy halal?",
    answer: `Panduan PRODUK SUSU/DAIRY:

YANG UMUMNYA HALAL:
- Susu segar murni
- Susu UHT tanpa tambahan
- Yogurt plain
- Butter/mentega plain

YANG PERLU SERTIFIKAT:
- Keju (karena enzim rennet)
- Whey protein
- Produk dairy dengan perisa/flavor

TIPS: Pilih produk dairy berlabel halal MUI/BPJPH.`,
  },

  // === AUDIT & LPH ===
  {
    keywords: ["lph", "auditor", "audit", "pemeriksa", "lembaga"],
    question: "Apa itu LPH dan bagaimana cara menghubungi?",
    answer: `LPH (Lembaga Pemeriksa Halal) adalah lembaga terakreditasi yang melakukan audit halal.

CARA MENCARI LPH:
1. Kunjungi halal.go.id
2. Pilih menu "Daftar LPH"
3. Cari LPH terdekat dari lokasi usaha Anda
4. Hubungi langsung untuk jadwal audit

LPH TERAKREDITASI POPULER:
- LPPOM MUI (www.halalmui.org)
- Sucofindo
- PT Surveyor Indonesia

TIPS: Pilih LPH yang dekat dengan lokasi untuk menghemat biaya transportasi auditor.`,
  },
  {
    keywords: ["gagal", "ditolak", "tidak lulus", "audit", "temuan"],
    question: "Apa yang harus dilakukan jika gagal audit?",
    answer: `Jika tidak lulus audit halal:

1. TERIMA LAPORAN TEMUAN
   - Baca dengan teliti temuan dari LPH
   - Temuan dibagi: Critical, Major, Minor

2. PERBAIKI TEMUAN
   - CRITICAL: Harus 100% diperbaiki
   - MAJOR: Wajib diperbaiki
   - Dokumentasikan proses perbaikan

3. AJUKAN AUDIT ULANG
   - Setelah perbaikan selesai
   - Biasanya ada biaya audit ulang (lebih murah)

TIPS: Gunakan fitur "Siap Halal" di SAH-in Aja! untuk cek kesiapan.`,
  },
  {
    keywords: ["persiapan", "tips", "sebelum", "audit", "siap"],
    question: "Bagaimana persiapan sebelum audit halal?",
    answer: `CHECKLIST PERSIAPAN AUDIT HALAL:

1. DOKUMEN:
   - SOP Produksi Halal lengkap
   - Daftar bahan baku + sertifikat halal
   - Form traceability terisi

2. FASILITAS:
   - Bersihkan area produksi total
   - Labeli semua bahan dan area
   - Cek peralatan bersih

3. SDM:
   - Briefing tim tentang prosedur halal
   - Siapkan Penyelia Halal

TIPS: Lakukan self-assessment dengan fitur "Siap Halal" di SAH-in Aja!`,
  },

  // === PERPANJANGAN ===
  {
    keywords: ["perpanjang", "expired", "kadaluarsa", "masa berlaku", "habis"],
    question: "Bagaimana cara perpanjang sertifikat halal?",
    answer: `Cara perpanjang sertifikat halal BPJPH:

MASA BERLAKU: 4 tahun sejak diterbitkan

WAKTU PENGAJUAN: 3-6 bulan sebelum expired

PROSES:
1. Login ke halal.go.id
2. Pilih "Perpanjangan Sertifikasi"
3. Update dokumen jika ada perubahan
4. Bayar biaya perpanjangan
5. Audit ulang (lebih sederhana)

DURASI: 2-4 minggu

TIPS: Set reminder 6 bulan sebelum expired.`,
  },

  // === KATEGORI PRODUK ===
  {
    keywords: ["makanan", "minuman", "fnb", "restoran", "katering"],
    question: "Bagaimana sertifikasi halal untuk usaha makanan/minuman?",
    answer: `Sertifikasi Halal untuk USAHA MAKANAN/MINUMAN:

PERSYARATAN KHUSUS:
- Semua bahan baku harus halal bersertifikat
- Dapur tidak boleh untuk masak bahan haram
- Peralatan khusus untuk produk halal

DOKUMEN TAMBAHAN:
- Menu lengkap dengan daftar bahan
- Resep standar setiap menu
- SOP kebersihan dapur

BIAYA: GRATIS untuk UMKM Mikro via program SEHATI`,
  },
  {
    keywords: ["kosmetik", "skincare", "makeup", "kecantikan"],
    question: "Bagaimana sertifikasi halal untuk kosmetik?",
    answer: `Sertifikasi Halal untuk KOSMETIK/SKINCARE:

BAHAN KRITIS:
- Kolagen (bisa dari babi atau sapi)
- Gelatin (perlu cek sumber)
- Gliserin (bisa hewani atau nabati)
- Karmin/E120 (dari serangga)

YANG HARUS DIHINDARI:
- Plasenta (dari hewan/manusia)
- Kolagen babi
- Alkohol dalam jumlah besar

TIPS: Gunakan bahan nabati sebagai alternatif.`,
  },
  {
    keywords: ["obat", "farmasi", "suplemen", "vitamin", "jamu"],
    question: "Bagaimana sertifikasi halal untuk obat/suplemen?",
    answer: `Sertifikasi Halal untuk OBAT/SUPLEMEN:

BAHAN KRITIS:
- Gelatin kapsul (banyak dari babi)
- Magnesium stearat (perlu cek sumber)
- Omega-3 (cek sumber)

ALTERNATIF HALAL:
- Kapsul HPMC (nabati) pengganti gelatin
- Softgel dari gelatin ikan/sapi halal

TIPS: Untuk UMKM jamu/herbal, lebih mudah karena bahan umumnya nabati.`,
  },

  // === SOP & MANAJEMEN ===
  {
    keywords: ["sop", "prosedur", "standar", "operasional"],
    question: "Bagaimana membuat SOP Produksi Halal?",
    answer: `Panduan Membuat SOP PRODUKSI HALAL:

ISI SOP:
1. Penerimaan bahan baku
   - Cek sertifikat halal supplier
   - Pencatatan di form traceability

2. Penyimpanan bahan
   - Area penyimpanan terpisah
   - Labeling yang jelas

3. Proses produksi
   - Alur produksi yang jelas
   - Pencegahan kontaminasi silang

4. Pengemasan & penyimpanan produk jadi

TIPS: Gunakan fitur "Dokumen Halal" di SAH-in Aja! untuk generate template SOP.`,
  },
  {
    keywords: ["penyelia", "halal", "supervisor", "penanggung jawab"],
    question: "Apa tugas Penyelia Halal?",
    answer: `PENYELIA HALAL:

TUGAS:
1. Mengawasi proses produksi halal
2. Memeriksa bahan baku yang masuk
3. Memastikan tidak ada kontaminasi silang
4. Koordinasi dengan LPH saat audit

SYARAT:
- Beragama Islam
- Memahami prinsip halal dasar

UNTUK UMKM:
- Pemilik usaha bisa menjadi Penyelia Halal
- Tidak perlu sertifikat khusus untuk UMKM Mikro`,
  },
  {
    keywords: ["traceability", "lacak", "pelacakan", "asal", "bahan"],
    question: "Apa itu form traceability?",
    answer: `FORM TRACEABILITY:

ISI FORM:
1. Nama bahan baku
2. Kode/batch number
3. Tanggal terima
4. Nama supplier
5. No. sertifikat halal bahan
6. Tanggal produksi yang menggunakan
7. Kode produksi/batch produk jadi

TIPS: Gunakan fitur "Dokumen Halal" untuk generate template form traceability.`,
  },

  // === UMKM ===
  {
    keywords: ["umkm", "mikro", "kecil", "usaha", "rumahan"],
    question: "Bagaimana sertifikasi halal untuk UMKM?",
    answer: `Sertifikasi Halal untuk UMKM:

PROGRAM SEHATI (Gratis):
- Untuk UMKM Mikro dengan omset < 2 Miliar/tahun
- Daftar di halal.go.id pilih "SEHATI"

KEUNTUNGAN UMKM:
- Dokumen lebih sederhana
- Audit lebih cepat
- Biaya terjangkau (atau gratis)

TIPS:
1. Mulai dari 1-2 produk dulu
2. Pilih bahan yang sudah pasti halal
3. Dokumentasikan semua dengan foto`,
  },
  {
    keywords: ["self", "declare", "mandiri", "deklarasi"],
    question: "Apa itu self-declare halal?",
    answer: `SELF-DECLARE HALAL:

APA ITU?
- Pernyataan mandiri kehalalan produk oleh pelaku usaha
- Tidak perlu audit fisik oleh LPH

SYARAT:
- UMKM Mikro (omset < 2 Miliar/tahun)
- Bahan baku tidak mengandung bahan kritis
- Proses produksi sederhana

CARA DAFTAR:
1. Login halal.go.id
2. Pilih "Pendaftaran Self-Declare"
3. Isi data dan upload foto
4. Tunggu verifikasi`,
  },
  {
    keywords: ["label", "logo", "kemasan", "packaging"],
    question: "Bagaimana aturan label halal pada kemasan?",
    answer: `ATURAN LABEL HALAL:

LOGO HALAL RESMI:
- Gunakan logo halal Indonesia dari BPJPH
- Logo harus jelas terlihat pada kemasan

INFORMASI WAJIB:
- Logo halal BPJPH
- Nomor sertifikat halal

YANG TIDAK BOLEH:
- Menggunakan logo halal tanpa sertifikat
- Memodifikasi logo halal

TIPS: Download logo halal resmi dari halal.go.id setelah mendapat sertifikat.`,
  },
  {
    keywords: ["supplier", "vendor", "pemasok", "beli", "bahan baku"],
    question: "Bagaimana memilih supplier halal?",
    answer: `PANDUAN MEMILIH SUPPLIER HALAL:

KRITERIA:
1. Memiliki sertifikat halal yang masih berlaku
2. Bisa menyediakan CoA (Certificate of Analysis)
3. Bersedia menandatangani perjanjian halal

CARA VERIFIKASI:
1. Cek sertifikat di halal.go.id
2. Minta referensi dari pelaku usaha lain

TIPS: Gunakan template "Perjanjian Supplier" di fitur Dokumen Halal.`,
  },
  {
    keywords: ["kontaminasi", "silang", "cross", "tercemar", "tercampur"],
    question: "Bagaimana mencegah kontaminasi silang?",
    answer: `PENCEGAHAN KONTAMINASI SILANG:

DI PENYIMPANAN:
- Area terpisah untuk bahan halal
- Labeling jelas
- Kontainer/wadah khusus

DI PRODUKSI:
- Peralatan khusus untuk produk halal
- Urutan produksi: halal dulu, baru non-halal

TIPS: Lebih baik fokus produk halal saja untuk UMKM.`,
  },

  // === INFORMASI UMUM ===
  {
    keywords: ["apa", "halal", "haram", "definisi", "pengertian"],
    question: "Apa itu halal dan haram?",
    answer: `PENGERTIAN HALAL DAN HARAM:

HALAL:
- Segala sesuatu yang diperbolehkan oleh syariat Islam

HARAM:
- Segala sesuatu yang dilarang oleh syariat Islam

CONTOH:
- Halal: sayuran, buah, daging sapi disembelih, ikan
- Haram: babi, alkohol, darah, bangkai

TIPS: Jika ragu, lebih baik tinggalkan.`,
  },
  {
    keywords: ["manfaat", "keuntungan", "benefit", "sertifikat"],
    question: "Apa manfaat sertifikasi halal bagi UMKM?",
    answer: `MANFAAT SERTIFIKASI HALAL:

KEUNTUNGAN BISNIS:
1. Akses pasar lebih luas (230+ juta Muslim Indonesia)
2. Kepercayaan konsumen meningkat
3. Bisa masuk marketplace/retail besar
4. Peluang ekspor ke negara Muslim

KEUNTUNGAN OPERASIONAL:
1. Standarisasi proses produksi
2. Kualitas produk lebih terjaga
3. Dokumentasi lebih rapi

TIPS: Sertifikasi halal adalah INVESTASI, bukan biaya!`,
  },
  {
    keywords: ["uu", "undang", "jph", "hukum", "wajib", "regulasi"],
    question: "Apa itu UU Jaminan Produk Halal?",
    answer: `UU JAMINAN PRODUK HALAL (JPH):

DASAR HUKUM:
- UU No. 33 Tahun 2014

KEWAJIBAN:
- Semua produk WAJIB bersertifikat halal

TAHAPAN:
- 2024: Makanan, minuman
- 2026: Obat, kosmetik
- 2029: Produk lainnya

TIPS: Segera daftarkan produk Anda!`,
  },
  {
    keywords: ["kontak", "hubungi", "call center", "bantuan", "telepon"],
    question: "Bagaimana menghubungi BPJPH?",
    answer: `KONTAK BPJPH:

CALL CENTER: 1500-363
Jam operasional: Senin-Jumat, 08.00-16.00 WIB

WEBSITE: halal.go.id
EMAIL: layanan@halal.go.id

SOSIAL MEDIA:
- Instagram: @halaborjakarta
- Twitter: @bpjph_ri`,
  },
];

interface CacheData {
  version: string;
  faqs: FAQ[];
  lastUpdated: number;
}

// Get cached FAQs from localStorage
export function getCachedFAQs(): FAQ[] {
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (!cached) return BUILTIN_FAQS;

    const data: CacheData = JSON.parse(cached);
    if (data.version !== CACHE_VERSION) {
      // Version mismatch, use builtin and update cache
      saveFAQsToCache(BUILTIN_FAQS);
      return BUILTIN_FAQS;
    }

    return data.faqs;
  } catch {
    return BUILTIN_FAQS;
  }
}

// Save FAQs to localStorage
export function saveFAQsToCache(faqs: FAQ[]): void {
  try {
    const data: CacheData = {
      version: CACHE_VERSION,
      faqs,
      lastUpdated: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage might be full or disabled
    console.warn("Failed to cache FAQs to localStorage");
  }
}

// Find matching FAQ from cache (for offline use)
export function findOfflineFAQ(query: string): { question: string; answer: string } | null {
  const faqs = getCachedFAQs();
  const lowerQuery = query.toLowerCase();

  let bestMatch: FAQ | null = null;
  let bestScore = 0;

  for (const faq of faqs) {
    const matchCount = faq.keywords.filter((kw) => lowerQuery.includes(kw)).length;
    const score = matchCount / faq.keywords.length;

    if (score > bestScore && score >= 0.3) {
      bestScore = score;
      bestMatch = faq;
    }
  }

  return bestMatch ? { question: bestMatch.question, answer: bestMatch.answer } : null;
}

// Check if user is online
export function isOnline(): boolean {
  return navigator.onLine;
}

// Initialize cache with builtin FAQs
export function initializeOfflineCache(): void {
  const cached = localStorage.getItem(STORAGE_KEY);
  if (!cached) {
    saveFAQsToCache(BUILTIN_FAQS);
  }
}
