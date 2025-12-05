// Offline Knowledge Base - FAQ cache untuk akses offline
// Berguna untuk UMKM di daerah dengan koneksi tidak stabil

interface FAQ {
  keywords: string[];
  question: string;
  answer: string;
}

const STORAGE_KEY = "sah_halal_faq_cache";
const CACHE_VERSION = "1.0";

// Built-in FAQ database (sama dengan backend)
const BUILTIN_FAQS: FAQ[] = [
  {
    keywords: ["daftar", "cara", "sertifikasi", "halal", "bpjph"],
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
    keywords: ["dokumen", "persyaratan", "sjph", "syarat"],
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
    keywords: ["biaya", "harga", "tarif", "gratis", "sehati"],
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
    keywords: ["lph", "auditor", "audit", "pemeriksa"],
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
    keywords: ["gagal", "ditolak", "tidak lulus", "audit"],
    question: "Apa yang harus dilakukan jika gagal audit?",
    answer: `Jika tidak lulus audit halal:

1. TERIMA LAPORAN TEMUAN
   - Baca dengan teliti temuan dari LPH
   - Pahami setiap poin yang perlu diperbaiki

2. PERBAIKI TEMUAN
   - Temuan Critical: harus diperbaiki 100%
   - Temuan Warning: sebaiknya diperbaiki
   - Dokumentasikan proses perbaikan

3. AJUKAN AUDIT ULANG
   - Setelah perbaikan selesai
   - Biasanya ada biaya audit ulang
   - Waktu audit ulang lebih singkat

TIPS: Gunakan fitur "Siap Halal" di SAH-in Aja! untuk cek kesiapan sebelum audit berikutnya.`,
  },
  {
    keywords: ["perpanjang", "expired", "kadaluarsa", "masa berlaku"],
    question: "Bagaimana cara perpanjang sertifikat halal?",
    answer: `Cara perpanjang sertifikat halal BPJPH:

MASA BERLAKU: 4 tahun sejak diterbitkan

WAKTU PENGAJUAN PERPANJANGAN:
- Ajukan 3-6 bulan sebelum expired
- Jangan sampai terlambat!

PROSES PERPANJANGAN:
1. Login ke halal.go.id
2. Pilih "Perpanjangan Sertifikasi"
3. Update dokumen jika ada perubahan
4. Bayar biaya perpanjangan
5. Audit ulang (biasanya lebih sederhana)

BIAYA: Lebih murah dari sertifikasi baru
DURASI: 2-4 minggu`,
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
