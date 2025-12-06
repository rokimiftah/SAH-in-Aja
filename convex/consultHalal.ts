import { v } from "convex/values";

import { action } from "./_generated/server";
import { createKolosalClient, KOLOSAL_MODELS, SYSTEM_PROMPTS } from "./lib/kolosal";

// Comprehensive FAQ database for halal certification
const HALAL_FAQS: Array<{ keywords: string[]; question: string; answer: string; category: string }> = [
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
    category: "pendaftaran",
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
    category: "dokumen",
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
    category: "biaya",
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
    category: "proses",
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
    category: "bahan",
  },
  {
    keywords: ["gelatin", "jelly", "agar", "pengental"],
    question: "Bagaimana status halal gelatin?",
    answer: `Panduan tentang GELATIN untuk produk halal:

STATUS GELATIN:
- Gelatin BABI: HARAM (tidak boleh digunakan sama sekali)
- Gelatin SAPI: Halal JIKA disembelih secara syar'i dan ada sertifikat
- Gelatin IKAN: Halal (pastikan ada sertifikat)

CARA CEK GELATIN:
1. Minta CoA (Certificate of Analysis) dari supplier
2. Cek sumber gelatin (porcine/bovine/fish)
3. Minta sertifikat halal gelatin

ALTERNATIF GELATIN HALAL:
- Agar-agar (dari rumput laut) - 100% halal
- Karagenan (dari rumput laut)
- Pektin (dari buah-buahan)
- Gelatin ikan (fish gelatin)
- Gelatin sapi halal bersertifikat

TIPS: Untuk UMKM, lebih aman gunakan agar-agar karena pasti halal dan mudah didapat.`,
    category: "bahan",
  },
  {
    keywords: ["emulsifier", "e471", "e472", "e481", "pengemulsi", "mono", "digliserida"],
    question: "Apakah emulsifier E471 halal?",
    answer: `Panduan EMULSIFIER untuk produk halal:

E471 (Mono dan Digliserida):
- PERLU CEK SUMBER - bisa dari nabati atau hewani
- Jika dari hewani, WAJIB ada sertifikat halal
- Jika dari nabati (sawit/kedelai), umumnya halal

EMULSIFIER YANG PERLU DICEK:
- E471, E472a-f: Mono/Digliserida (cek sumber)
- E481, E482: Sodium/Calcium Stearoyl Lactylate
- E491-E495: Sorbitan ester (cek sumber)

EMULSIFIER YANG AMAN (NABATI):
- Lesitin kedelai (E322)
- Lesitin bunga matahari
- DATEM dari nabati

CARA MEMASTIKAN:
1. Minta CoA (Certificate of Analysis)
2. Tanyakan sumber bahan ke supplier
3. Minta sertifikat halal emulsifier

TIPS: Pilih supplier yang sudah bersertifikat halal untuk menghindari keraguan.`,
    category: "bahan",
  },
  {
    keywords: ["alkohol", "etanol", "miras", "wine", "khamr"],
    question: "Bagaimana aturan alkohol dalam produk halal?",
    answer: `Panduan ALKOHOL untuk produk halal:

HARAM (Tidak Boleh):
- Khamr/minuman keras (wine, bir, arak, sake)
- Mirin (alkohol masak Jepang)
- Vanilla extract dengan alkohol tinggi
- Rum/brandy untuk masakan

PERLU CEK (Syubhat):
- Perisa/flavor dengan alkohol sebagai pelarut
- Tape/fermentasi alami
- Kecap dengan fermentasi alkohol

DIBOLEHKAN:
- Alkohol dari fermentasi alami dalam jumlah sangat kecil (<0.5%)
- Alkohol sebagai pelarut yang menguap habis saat proses
- Cuka (alkohol sudah berubah jadi asam asetat)

FATWA MUI:
- Alkohol hasil industri untuk non-minuman: halal jika tidak memabukkan
- Minuman dengan alkohol <0.5%: halal jika bukan dari khamr

TIPS: Hindari bahan yang mengandung alkohol jika ragu. Gunakan alternatif seperti vanilla bubuk, kecap halal bersertifikat.`,
    category: "bahan",
  },
  {
    keywords: ["pewarna", "karmin", "e120", "cochineal", "warna", "merah"],
    question: "Apakah pewarna karmin/E120 halal?",
    answer: `Panduan PEWARNA untuk produk halal:

PEWARNA YANG PERLU DICEK:
- E120 (Karmin/Cochineal): DARI SERANGGA - perlu fatwa
  * Menurut sebagian ulama: haram karena dari serangga
  * Menurut sebagian lain: halal karena istihalah
  * REKOMENDASI: Hindari untuk menghindari keraguan

- E904 (Shellac): dari serangga - perlu cek fatwa
- E542 (Bone Phosphate): dari tulang - perlu sertifikat

PEWARNA YANG AMAN (HALAL):
- E100 (Kurkumin) - dari kunyit
- E101 (Riboflavin) - vitamin B2
- E140 (Klorofil) - dari daun
- E160a (Beta karoten) - dari wortel
- E162 (Betanin) - dari bit merah
- E163 (Antosianin) - dari anggur

TIPS: Gunakan pewarna alami dari tumbuhan untuk memastikan kehalalan dan lebih sehat.`,
    category: "bahan",
  },
  {
    keywords: ["enzim", "rennet", "pepsin", "lipase"],
    question: "Bagaimana status halal enzim?",
    answer: `Panduan ENZIM untuk produk halal:

ENZIM PERLU CEK SUMBER:
- Rennet (untuk keju): bisa dari anak sapi atau mikroba
- Pepsin: bisa dari babi atau sapi
- Lipase: bisa dari hewani atau mikroba
- Tripsin: biasanya dari pankreas babi

STATUS BERDASARKAN SUMBER:
1. Enzim dari MIKROBA/JAMUR: Halal (tidak perlu sertifikat khusus)
2. Enzim dari TANAMAN: Halal
3. Enzim dari HEWAN: Perlu sertifikat halal (harus dari hewan halal disembelih syar'i)

ENZIM DALAM KEJU:
- Keju dengan "microbial rennet" atau "vegetable rennet": Halal
- Keju dengan "animal rennet": Perlu cek sertifikat
- Keju dengan "pepsin": Kemungkinan dari babi

TIPS: 
- Untuk produk keju, pilih yang berlabel halal atau vegetarian
- Minta CoA enzim dari supplier`,
    category: "bahan",
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

YANG MEMBATALKAN KEHALALAN:
- Hewan mati sebelum disembelih (bangkai)
- Tidak menyebut nama Allah
- Disembelih oleh non-Muslim
- Stunning yang membuat hewan mati sebelum disembelih

CARA MEMASTIKAN:
1. Beli dari supplier dengan sertifikat halal
2. Kunjungi RPH (Rumah Potong Hewan) bersertifikat
3. Minta surat keterangan penyembelihan halal

TIPS: Untuk UMKM, pastikan supplier daging memiliki sertifikat halal yang masih berlaku.`,
    category: "bahan",
  },
  {
    keywords: ["susu", "dairy", "whey", "kasein", "keju", "mentega"],
    question: "Apakah produk susu/dairy halal?",
    answer: `Panduan PRODUK SUSU/DAIRY untuk produk halal:

YANG PERLU DICEK:
- Whey (air dadih): Perlu cek proses pembuatan
- Kasein: Perlu cek sumber enzim
- Keju: Perlu cek jenis rennet (enzim)
- Mentega: Umumnya halal, cek jika ada tambahan

YANG UMUMNYA HALAL:
- Susu segar murni
- Susu UHT tanpa tambahan
- Yogurt plain
- Krim/cream murni
- Butter/mentega plain

YANG PERLU SERTIFIKAT:
- Keju (karena enzim rennet)
- Whey protein
- Produk dairy dengan perisa/flavor
- Ice cream (cek emulsifier dan perisa)

TIPS:
- Pilih produk dairy berlabel halal MUI/BPJPH
- Untuk keju, pilih "vegetable rennet" atau "microbial rennet"
- Cek komposisi untuk bahan tambahan`,
    category: "bahan",
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
- BPOM (untuk beberapa kategori)

BIAYA AUDIT LPH:
- Berkisar Rp 1.500.000 - Rp 5.000.000
- Tergantung lokasi dan kompleksitas usaha

TIPS: Pilih LPH yang dekat dengan lokasi untuk menghemat biaya transportasi auditor.`,
    category: "audit",
  },
  {
    keywords: ["gagal", "ditolak", "tidak lulus", "audit", "temuan"],
    question: "Apa yang harus dilakukan jika gagal audit?",
    answer: `Jika tidak lulus audit halal:

1. TERIMA LAPORAN TEMUAN
   - Baca dengan teliti temuan dari LPH
   - Pahami setiap poin yang perlu diperbaiki
   - Temuan dibagi: Critical, Major, Minor

2. KATEGORISASI TEMUAN:
   - CRITICAL: Harus 100% diperbaiki (bahan haram, kontaminasi)
   - MAJOR: Wajib diperbaiki (dokumen tidak lengkap)
   - MINOR: Sebaiknya diperbaiki (kebersihan kurang)

3. PERBAIKI TEMUAN
   - Prioritaskan temuan Critical
   - Dokumentasikan proses perbaikan dengan foto/bukti
   - Siapkan CAPA (Corrective Action Preventive Action)

4. AJUKAN AUDIT ULANG
   - Setelah perbaikan selesai
   - Biasanya ada biaya audit ulang (lebih murah)
   - Waktu audit ulang lebih singkat

TIPS: Gunakan fitur "Siap Halal" di SAH-in Aja! untuk cek kesiapan sebelum audit.`,
    category: "audit",
  },
  {
    keywords: ["persiapan", "tips", "sebelum", "audit", "siap"],
    question: "Bagaimana persiapan sebelum audit halal?",
    answer: `CHECKLIST PERSIAPAN AUDIT HALAL:

1. DOKUMEN (1-2 minggu sebelum):
   ✓ SOP Produksi Halal lengkap
   ✓ Daftar bahan baku + sertifikat halal
   ✓ Perjanjian supplier halal
   ✓ Form traceability terisi
   ✓ Surat komitmen halal
   ✓ NIB dan izin usaha

2. FASILITAS (1 minggu sebelum):
   ✓ Bersihkan area produksi total
   ✓ Pisahkan bahan halal dan non-halal (jika ada)
   ✓ Labeli semua bahan dan area
   ✓ Cek peralatan bersih
   ✓ Siapkan tempat sampah tertutup

3. SDM (3 hari sebelum):
   ✓ Briefing tim tentang prosedur halal
   ✓ Siapkan Penyelia Halal untuk mendampingi auditor
   ✓ Pastikan tim paham SOP

4. HARI-H:
   ✓ Siapkan dokumen dalam folder rapi
   ✓ Area produksi dalam kondisi operasional normal
   ✓ Penyelia Halal standby
   ✓ Siapkan ruang untuk closing meeting

TIPS: Lakukan self-assessment dengan fitur "Siap Halal" di SAH-in Aja!`,
    category: "audit",
  },

  // === PERPANJANGAN & MASA BERLAKU ===
  {
    keywords: ["perpanjang", "expired", "kadaluarsa", "masa berlaku", "habis"],
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
DURASI: 2-4 minggu

JIKA TERLAMBAT:
- Sertifikat expired = produk tidak boleh berlabel halal
- Harus mengajukan sertifikasi baru (lebih lama & mahal)

TIPS: Set reminder 6 bulan sebelum expired di kalender Anda.`,
    category: "perpanjangan",
  },

  // === KATEGORI PRODUK ===
  {
    keywords: ["makanan", "minuman", "fnb", "restoran", "katering"],
    question: "Bagaimana sertifikasi halal untuk usaha makanan/minuman?",
    answer: `Sertifikasi Halal untuk USAHA MAKANAN/MINUMAN:

KATEGORI:
1. Restoran/Rumah Makan
2. Katering
3. UMKM Makanan Kemasan
4. Kedai/Warung Makan

PERSYARATAN KHUSUS:
- Semua bahan baku harus halal bersertifikat
- Dapur tidak boleh untuk masak bahan haram
- Peralatan khusus untuk produk halal
- Penyimpanan terpisah dari bahan non-halal

DOKUMEN TAMBAHAN:
- Menu lengkap dengan daftar bahan
- Resep standar setiap menu
- SOP kebersihan dapur

TIPS UNTUK RESTORAN:
- Mulai dari menu yang sederhana dulu
- Hindari menu dengan bahan kritis (misal: gelatin, alkohol)
- Pastikan supplier daging bersertifikat halal

BIAYA: GRATIS untuk UMKM Mikro via program SEHATI`,
    category: "kategori",
  },
  {
    keywords: ["kosmetik", "skincare", "makeup", "kecantikan"],
    question: "Bagaimana sertifikasi halal untuk kosmetik?",
    answer: `Sertifikasi Halal untuk KOSMETIK/SKINCARE:

BAHAN KRITIS KOSMETIK:
- Kolagen (bisa dari babi atau sapi)
- Gelatin (perlu cek sumber)
- Lanolin (dari domba - perlu sertifikat)
- Gliserin (bisa hewani atau nabati)
- Stearic acid (perlu cek sumber)
- Karmin/E120 (dari serangga)

YANG HARUS DIHINDARI:
- Plasenta (dari hewan/manusia)
- Kolagen babi
- Alkohol dalam jumlah besar
- Bahan dari hewan tidak disembelih

PROSES SERTIFIKASI:
1. Audit formula dan bahan baku
2. Audit fasilitas produksi
3. Cek tidak ada kontaminasi silang

BIAYA: Tergantung jumlah SKU (produk)

TIPS:
- Gunakan bahan nabati sebagai alternatif
- Pilih kolagen ikan atau nabati
- Minta sertifikat halal setiap bahan dari supplier`,
    category: "kategori",
  },
  {
    keywords: ["obat", "farmasi", "suplemen", "vitamin", "jamu"],
    question: "Bagaimana sertifikasi halal untuk obat/suplemen?",
    answer: `Sertifikasi Halal untuk OBAT/SUPLEMEN:

BAHAN KRITIS:
- Gelatin kapsul (banyak dari babi)
- Magnesium stearat (perlu cek sumber)
- Gliserin (bisa hewani/nabati)
- Omega-3 (cek sumber - ikan/hewan lain)
- Vitamin D3 (bisa dari lanolin domba)

ALTERNATIF HALAL:
- Kapsul HPMC (nabati) pengganti gelatin
- Softgel dari gelatin ikan/sapi halal
- Vitamin D3 dari lichens (lumut)

REGULASI:
- Obat: diatur BPOM + sertifikasi halal BPJPH
- Suplemen: perlu izin edar + sertifikat halal
- Jamu: perlu BPOM TR + sertifikat halal

TANTANGAN:
- Bahan baku farmasi terbatas pilihan halal
- Beberapa bahan aktif hanya tersedia non-halal

TIPS: Untuk UMKM jamu/herbal, lebih mudah karena bahan umumnya nabati.`,
    category: "kategori",
  },
  {
    keywords: ["fashion", "pakaian", "tas", "sepatu", "kulit"],
    question: "Bagaimana sertifikasi halal untuk produk fashion?",
    answer: `Sertifikasi Halal untuk PRODUK FASHION:

YANG PERLU DICEK:
- Bahan kulit (harus dari hewan halal disembelih)
- Bulu/wool (perlu cek sumber)
- Sutra (umumnya halal)
- Lem/perekat (cek bahan dasar)

BAHAN YANG AMAN:
- Katun/cotton - halal
- Polyester/sintetis - halal
- Sutra - halal
- Kulit sintetis/PU leather - halal

BAHAN PERLU SERTIFIKAT:
- Kulit sapi/kambing/domba asli
- Bulu/wool natural
- Produk berbahan dasar hewan

PROSES:
1. Audit bahan baku
2. Cek rantai pasok (supply chain)
3. Pastikan tidak tercampur bahan haram

TIPS: Untuk UMKM fashion, lebih mudah gunakan bahan sintetis atau kulit sintetis yang pasti halal.`,
    category: "kategori",
  },

  // === SOP & MANAJEMEN ===
  {
    keywords: ["sop", "prosedur", "standar", "operasional"],
    question: "Bagaimana membuat SOP Produksi Halal?",
    answer: `Panduan Membuat SOP PRODUKSI HALAL:

KOMPONEN SOP:
1. TUJUAN - Menjamin kehalalan produk
2. RUANG LINGKUP - Area yang dicakup
3. DEFINISI - Istilah yang digunakan
4. PROSEDUR - Langkah-langkah detail
5. DOKUMENTASI - Form yang digunakan
6. PENANGGUNG JAWAB - Siapa melakukan apa

ISI SOP PRODUKSI HALAL:
1. Penerimaan bahan baku
   - Cek sertifikat halal supplier
   - Inspeksi visual bahan
   - Pencatatan di form traceability

2. Penyimpanan bahan
   - Area penyimpanan terpisah
   - Labeling yang jelas
   - FIFO (First In First Out)

3. Proses produksi
   - Alur produksi yang jelas
   - Pencegahan kontaminasi silang
   - Kebersihan peralatan

4. Pengemasan & penyimpanan produk jadi
   - Labeling halal yang benar
   - Penyimpanan terpisah

TIPS: Gunakan fitur "Dokumen Halal" di SAH-in Aja! untuk generate template SOP.`,
    category: "dokumen",
  },
  {
    keywords: ["penyelia", "halal", "supervisor", "penanggung jawab"],
    question: "Apa tugas Penyelia Halal?",
    answer: `PENYELIA HALAL - Penanggung Jawab Kehalalan:

SIAPA ITU PENYELIA HALAL?
- Orang yang ditunjuk perusahaan untuk mengawasi kehalalan
- Wajib ada untuk setiap usaha yang bersertifikat halal
- Harus Muslim dan memahami syariat

TUGAS PENYELIA HALAL:
1. Mengawasi proses produksi halal
2. Memeriksa bahan baku yang masuk
3. Memastikan tidak ada kontaminasi silang
4. Menangani komplain terkait kehalalan
5. Koordinasi dengan LPH saat audit
6. Update dokumen SJPH

SYARAT PENYELIA HALAL:
- Beragama Islam
- Memahami prinsip halal dasar
- Sudah mengikuti pelatihan halal (dianjurkan)
- Bertanggung jawab dan teliti

UNTUK UMKM:
- Pemilik usaha bisa menjadi Penyelia Halal
- Tidak perlu sertifikat khusus untuk UMKM Mikro
- Cukup memahami SOP yang sudah dibuat

TIPS: Ikuti webinar gratis tentang halal dari BPJPH/LPH untuk menambah pengetahuan.`,
    category: "manajemen",
  },
  {
    keywords: ["traceability", "lacak", "pelacakan", "asal", "bahan"],
    question: "Apa itu form traceability dan cara mengisinya?",
    answer: `FORM TRACEABILITY - Pelacakan Bahan:

APA ITU TRACEABILITY?
- Kemampuan melacak bahan dari supplier sampai produk jadi
- Wajib ada dalam sistem SJPH
- Membantu jika ada masalah/recall produk

ISI FORM TRACEABILITY:
1. Nama bahan baku
2. Kode/batch number
3. Tanggal terima
4. Nama supplier
5. No. sertifikat halal bahan
6. Tanggal produksi yang menggunakan
7. Kode produksi/batch produk jadi

CARA MENGISI:
1. Setiap bahan masuk, catat di form
2. Simpan copy sertifikat halal bahan
3. Saat produksi, catat bahan yang dipakai
4. Hubungkan ke kode batch produk jadi

CONTOH:
- Tepung terigu "ABC" batch T001
- Masuk tanggal 1 Jan 2024
- Supplier: PT XYZ (Sertifikat halal no. 123)
- Dipakai untuk produksi batch P001 tanggal 5 Jan

TIPS: Gunakan fitur "Dokumen Halal" untuk generate template form traceability.`,
    category: "dokumen",
  },

  // === UMUM ===
  {
    keywords: ["umkm", "mikro", "kecil", "usaha", "rumahan"],
    question: "Bagaimana sertifikasi halal untuk UMKM?",
    answer: `Sertifikasi Halal untuk UMKM:

PROGRAM SEHATI (Sertifikasi Halal Gratis):
- Untuk UMKM Mikro dengan omset < 2 Miliar/tahun
- GRATIS biaya sertifikasi
- Daftar di halal.go.id pilih "SEHATI"

KEUNTUNGAN UMKM:
- Dokumen lebih sederhana
- Audit lebih cepat
- Biaya terjangkau (atau gratis)
- Bisa self-declare untuk beberapa kategori

DOKUMEN UMKM MIKRO:
- NIB (Nomor Induk Berusaha)
- Daftar produk dan bahan
- Foto area produksi
- Form komitmen halal

TIPS UNTUK UMKM:
1. Mulai dari 1-2 produk dulu
2. Pilih bahan yang sudah pasti halal
3. Dokumentasikan semua dengan foto
4. Manfaatkan program SEHATI

BANTUAN: Banyak pemda menyediakan fasilitasi sertifikasi halal gratis untuk UMKM.`,
    category: "umkm",
  },
  {
    keywords: ["self", "declare", "mandiri", "deklarasi"],
    question: "Apa itu self-declare halal?",
    answer: `SELF-DECLARE HALAL:

APA ITU?
- Pernyataan mandiri kehalalan produk oleh pelaku usaha
- Berlaku untuk produk dengan bahan yang jelas kehalalannya
- Tidak perlu audit fisik oleh LPH

SYARAT SELF-DECLARE:
- UMKM Mikro (omset < 2 Miliar/tahun)
- Produk kategori tertentu (makanan/minuman sederhana)
- Bahan baku tidak mengandung bahan kritis
- Proses produksi sederhana

CARA DAFTAR:
1. Login halal.go.id
2. Pilih "Pendaftaran Self-Declare"
3. Isi data usaha dan produk
4. Upload foto produk dan bahan
5. Tanda tangani surat pernyataan
6. Tunggu verifikasi

KETENTUAN:
- Tetap bertanggung jawab atas kehalalan
- Bisa diaudit sewaktu-waktu
- Jika ditemukan pelanggaran, sertifikat dicabut

TIPS: Self-declare cocok untuk UMKM makanan rumahan dengan bahan sederhana.`,
    category: "umkm",
  },
  {
    keywords: ["label", "logo", "kemasan", "packaging"],
    question: "Bagaimana aturan label halal pada kemasan?",
    answer: `ATURAN LABEL HALAL pada Kemasan:

LOGO HALAL RESMI:
- Gunakan logo halal Indonesia yang dikeluarkan BPJPH
- Tidak boleh menggunakan logo halal luar negeri saja
- Logo harus jelas terlihat pada kemasan

KETENTUAN PENEMPATAN:
- Logo halal harus mudah dilihat
- Tidak boleh tertutup atau terlalu kecil
- Warna kontras dengan background
- Bisa di depan atau belakang kemasan

INFORMASI WAJIB:
- Logo halal BPJPH
- Nomor sertifikat halal
- Masa berlaku sertifikat (opsional)

YANG TIDAK BOLEH:
- Menggunakan logo halal tanpa sertifikat
- Memodifikasi logo halal
- Klaim "halal" tanpa sertifikasi resmi

SANKSI PELANGGARAN:
- Produk ditarik dari peredaran
- Denda sesuai UU JPH
- Pencabutan izin usaha

TIPS: Download logo halal resmi dari halal.go.id setelah mendapat sertifikat.`,
    category: "label",
  },
  {
    keywords: ["supplier", "vendor", "pemasok", "beli", "bahan baku"],
    question: "Bagaimana memilih supplier halal?",
    answer: `PANDUAN MEMILIH SUPPLIER HALAL:

KRITERIA SUPPLIER:
1. Memiliki sertifikat halal yang masih berlaku
2. Bisa menyediakan CoA (Certificate of Analysis)
3. Konsisten dalam kualitas dan kehalalan
4. Bersedia menandatangani perjanjian halal

DOKUMEN YANG DIMINTA:
- Sertifikat halal produk/bahan
- CoA setiap batch
- Surat perjanjian supplier halal
- Spesifikasi produk

CARA VERIFIKASI:
1. Cek sertifikat di halal.go.id atau website LPH
2. Kunjungi supplier jika memungkinkan
3. Minta referensi dari pelaku usaha lain
4. Cek review dan reputasi supplier

TIPS MENCARI SUPPLIER:
- BPJPH menyediakan database supplier halal
- Gabung komunitas UMKM halal
- Ikuti pameran/expo produk halal
- Tanya rekomendasi dari LPH

PERJANJIAN SUPPLIER:
- Wajib dibuat tertulis
- Supplier menjamin kehalalan bahan
- Ada klausul jika melanggar

TIPS: Gunakan template "Perjanjian Supplier" di fitur Dokumen Halal.`,
    category: "supplier",
  },
  {
    keywords: ["kontaminasi", "silang", "cross", "tercemar", "tercampur"],
    question: "Bagaimana mencegah kontaminasi silang?",
    answer: `PENCEGAHAN KONTAMINASI SILANG:

APA ITU KONTAMINASI SILANG?
- Tercampurnya bahan/produk halal dengan yang haram
- Bisa terjadi saat penyimpanan, produksi, atau pengiriman
- Menyebabkan produk menjadi tidak halal

PENCEGAHAN DI PENYIMPANAN:
- Area terpisah untuk bahan halal
- Labeling jelas "HALAL" dan "NON-HALAL"
- Rak berbeda, tidak bertumpuk
- Kontainer/wadah khusus

PENCEGAHAN DI PRODUKSI:
- Peralatan khusus untuk produk halal
- Jika berbagi, harus dicuci 7x dengan tanah (sertu)
- Urutan produksi: halal dulu, baru non-halal
- Jadwal produksi terpisah

PENCEGAHAN DI PENGIRIMAN:
- Kendaraan bersih
- Tidak dicampur dengan produk non-halal
- Kemasan tertutup rapat

JIKA SUDAH USAHA 100% HALAL:
- Tidak perlu pemisahan (semua halal)
- Lebih mudah dikelola
- Rekomendasi untuk UMKM

TIPS: Lebih baik fokus produk halal saja untuk UMKM, hindari produksi campuran.`,
    category: "produksi",
  },
  {
    keywords: ["wudhu", "cuci", "sertu", "najis", "suci"],
    question: "Bagaimana prosedur pencucian/penyucian peralatan?",
    answer: `PROSEDUR PENCUCIAN PERALATAN untuk Halal:

JIKA PERALATAN TIDAK PERNAH KENA NAJIS:
- Cuci biasa dengan air dan sabun
- Pastikan bersih dari sisa makanan
- Keringkan sebelum digunakan

JIKA PERALATAN TERKENA BABI/ANJING (SERTU):
- Cuci 7 kali
- Salah satunya dengan air yang dicampur tanah
- Bilas hingga bersih
- Keringkan

REKOMENDASI UNTUK UMKM:
- Gunakan peralatan KHUSUS untuk produk halal
- Tidak usah berbagi dengan produk non-halal
- Lebih praktis dan aman

LANGKAH PENCUCIAN STANDAR:
1. Buang sisa makanan
2. Rendam dengan air sabun
3. Gosok hingga bersih
4. Bilas dengan air bersih
5. Keringkan atau lap bersih
6. Simpan di tempat bersih

TIPS: Label peralatan dengan "HALAL ONLY" untuk mencegah salah pakai.`,
    category: "produksi",
  },

  // === INFORMASI UMUM ===
  {
    keywords: ["apa", "halal", "haram", "definisi", "pengertian"],
    question: "Apa itu halal dan haram?",
    answer: `PENGERTIAN HALAL DAN HARAM:

HALAL:
- Bahasa Arab: dibolehkan, diizinkan
- Segala sesuatu yang diperbolehkan oleh syariat Islam
- Meliputi makanan, minuman, produk, dan tindakan

HARAM:
- Bahasa Arab: dilarang
- Segala sesuatu yang dilarang oleh syariat Islam
- Wajib dijauhi oleh umat Muslim

KATEGORI DALAM ISLAM:
1. HALAL - Boleh dikonsumsi/digunakan
2. HARAM - Dilarang keras
3. SYUBHAT - Meragukan, sebaiknya dihindari
4. MAKRUH - Tidak disukai tapi tidak dosa

DASAR KEHALALAN:
- Al-Quran dan Hadits
- Ijma (kesepakatan ulama)
- Fatwa MUI

CONTOH:
- Halal: sayuran, buah, daging sapi disembelih, ikan
- Haram: babi, alkohol, darah, bangkai
- Syubhat: bahan dengan sumber tidak jelas

TIPS: Jika ragu, lebih baik tinggalkan. "Tinggalkan yang meragukanmu."`,
    category: "umum",
  },
  {
    keywords: ["manfaat", "keuntungan", "benefit", "sertifikat"],
    question: "Apa manfaat sertifikasi halal bagi UMKM?",
    answer: `MANFAAT SERTIFIKASI HALAL untuk UMKM:

KEUNTUNGAN BISNIS:
1. Akses pasar lebih luas (230+ juta Muslim Indonesia)
2. Kepercayaan konsumen meningkat
3. Bisa masuk marketplace/retail besar
4. Peluang ekspor ke negara Muslim
5. Diferensiasi dari kompetitor

KEUNTUNGAN OPERASIONAL:
1. Standarisasi proses produksi
2. Kualitas produk lebih terjaga
3. Dokumentasi lebih rapi
4. Manajemen bahan baku lebih baik

KEUNTUNGAN LEGAL:
1. Memenuhi UU Jaminan Produk Halal
2. Terhindar dari sanksi hukum
3. Perlindungan brand/merek

DATA STATISTIK:
- 87% konsumen Indonesia memilih produk halal
- Pasar halal global senilai $2+ triliun
- Indonesia target pusat halal dunia

TIPS: Sertifikasi halal adalah INVESTASI, bukan biaya. ROI-nya sangat tinggi!`,
    category: "umum",
  },
  {
    keywords: ["uu", "undang", "jph", "hukum", "wajib", "regulasi"],
    question: "Apa itu UU Jaminan Produk Halal?",
    answer: `UU JAMINAN PRODUK HALAL (JPH):

DASAR HUKUM:
- UU No. 33 Tahun 2014 tentang Jaminan Produk Halal
- PP No. 39 Tahun 2021 (Peraturan Pelaksana)

KEWAJIBAN:
- Semua produk yang masuk, beredar, dan diperdagangkan di Indonesia WAJIB bersertifikat halal
- Berlaku bertahap sesuai kategori produk

TAHAPAN KEWAJIBAN:
- 2024: Makanan, minuman
- 2026: Obat, kosmetik, produk kimia
- 2029: Produk lainnya

SANKSI PELANGGARAN:
- Peringatan tertulis
- Denda administratif
- Pencabutan sertifikat halal
- Penarikan produk dari peredaran

PENGECUALIAN:
- Produk dengan bahan yang jelas haram
- Harus mencantumkan "TIDAK HALAL" pada kemasan

TIPS: Segera daftarkan produk Anda sebelum tenggat waktu kewajiban!`,
    category: "regulasi",
  },
  {
    keywords: ["kontak", "hubungi", "call center", "bantuan", "telepon"],
    question: "Bagaimana menghubungi BPJPH?",
    answer: `KONTAK BPJPH (Badan Penyelenggara Jaminan Produk Halal):

CALL CENTER:
- Telepon: 1500-363
- Jam operasional: Senin-Jumat, 08.00-16.00 WIB

WEBSITE:
- Portal utama: halal.go.id
- Pendaftaran online: ptsp.halal.go.id

EMAIL:
- layanan@halal.go.id

ALAMAT KANTOR:
- Jl. Raya Bogor KM 24, Cijantung
- Jakarta Timur 13770

SOSIAL MEDIA:
- Instagram: @halaborjakarta
- Twitter: @bpjph_ri

LAYANAN YANG TERSEDIA:
- Informasi sertifikasi halal
- Bantuan pendaftaran
- Tracking status pengajuan
- Pengaduan dan komplain

TIPS: Untuk pertanyaan teknis, lebih baik hubungi LPH langsung yang akan melakukan audit.`,
    category: "kontak",
  },
];

// Guardrails - Keywords that indicate off-topic or inappropriate questions
const BLOCKED_KEYWORDS = [
  // Harmful content
  "bunuh",
  "mati",
  "racun",
  "bom",
  "senjata",
  "narkoba",
  "drugs",
  "teror",
  // Adult content
  "sex",
  "porn",
  "bokep",
  "bugil",
  "telanjang",
  "mesum",
  "cabul",
  // Hate speech
  "kafir",
  "benci",
  "serang",
  "hina",
  "rasis",
  // Illegal activities
  "hack",
  "crack",
  "bajak",
  "cheat",
  "curang",
  "ilegal",
  "penipuan",
];

// Keywords that indicate halal-related context (WHITELIST)
const HALAL_CONTEXT_KEYWORDS = [
  // Core halal terms
  "halal",
  "haram",
  "syubhat",
  "najis",
  "suci",
  "thoyib",
  // Certification bodies & processes
  "sertifikasi",
  "sertifikat",
  "bpjph",
  "mui",
  "lph",
  "lppom",
  "sjph",
  "audit",
  "auditor",
  "inspeksi",
  "fatwa",
  // Documents
  "dokumen",
  "sop",
  "traceability",
  "manual",
  "formulir",
  "form",
  // Ingredients & materials
  "bahan",
  "bahan baku",
  "ingredient",
  "komposisi",
  "kandungan",
  "gelatin",
  "emulsifier",
  "enzim",
  "rennet",
  "pewarna",
  "pengawet",
  "e471",
  "e472",
  "e120",
  "karmin",
  "alkohol",
  "etanol",
  // Products
  "produk",
  "makanan",
  "minuman",
  "kosmetik",
  "skincare",
  "obat",
  "suplemen",
  "daging",
  "ayam",
  "sapi",
  "kambing",
  "ikan",
  "seafood",
  // Production
  "produksi",
  "pabrik",
  "dapur",
  "masak",
  "olah",
  "proses produksi",
  "kontaminasi",
  "kontaminasi silang",
  "penyimpanan",
  // Business
  "umkm",
  "usaha",
  "bisnis",
  "warung",
  "restoran",
  "katering",
  "supplier",
  "pemasok",
  "vendor",
  // Labeling & packaging
  "kemasan",
  "label",
  "logo halal",
  "packaging",
  // Administrative
  "izin",
  "daftar",
  "pendaftaran",
  "biaya",
  "tarif",
  "gratis",
  "sehati",
  "syarat",
  "persyaratan",
  "perpanjang",
  "expired",
  // Religious terms related to halal
  "sembelih",
  "penyembelihan",
  "zabihah",
  "bismillah",
  "syariah",
  "syariat",
  "islam",
  "muslim",
  "fiqih",
  "hukum islam",
  // Specific halal concerns
  "penyelia halal",
  "juru sembelih",
  "rph",
  "rumah potong",
];

// Check if message contains blocked content (harmful, inappropriate)
function containsBlockedContent(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return BLOCKED_KEYWORDS.some((keyword) => lowerMessage.includes(keyword));
}

// Check if message has halal-related context
function hasHalalContext(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return HALAL_CONTEXT_KEYWORDS.some((keyword) => lowerMessage.includes(keyword));
}

// Simple greetings that are allowed without halal context
const ALLOWED_GREETINGS = [
  "halo",
  "hai",
  "hi",
  "hello",
  "selamat pagi",
  "selamat siang",
  "selamat sore",
  "selamat malam",
  "assalamualaikum",
  "terima kasih",
  "makasih",
  "thanks",
  "oke",
  "ok",
  "baik",
  "siap",
  "ya",
  "tidak",
  "bisa",
  "tolong bantu",
  "bantu saya",
  "mau tanya",
];

// Check if message is a simple greeting
function isGreeting(message: string): boolean {
  const lowerMessage = message.toLowerCase().trim();
  // Very short messages (1-3 words) that are greetings
  const words = lowerMessage.split(/\s+/);
  if (words.length <= 4) {
    return ALLOWED_GREETINGS.some((greeting) => lowerMessage.includes(greeting));
  }
  return false;
}

// STRICT GUARDRAIL: Block ALL messages without halal context
function isOffTopic(message: string): boolean {
  const lowerMessage = message.toLowerCase();

  // Allow simple greetings
  if (isGreeting(lowerMessage)) return false;

  // If message has halal-related context, it's on-topic
  if (hasHalalContext(lowerMessage)) return false;

  // BLOCK everything else that doesn't have halal context
  return true;
}

function findMatchingFAQ(query: string): { question: string; answer: string } | null {
  const lowerQuery = query.toLowerCase();
  let bestMatch: (typeof HALAL_FAQS)[0] | null = null;
  let bestScore = 0;

  for (const faq of HALAL_FAQS) {
    const matchCount = faq.keywords.filter((kw) => lowerQuery.includes(kw)).length;
    const score = matchCount / faq.keywords.length;
    if (score > bestScore && score >= 0.3) {
      bestScore = score;
      bestMatch = faq;
    }
  }

  return bestMatch;
}

export const chat = action({
  args: {
    message: v.string(),
    conversationHistory: v.optional(
      v.array(
        v.object({
          role: v.union(v.literal("user"), v.literal("assistant")),
          content: v.string(),
        }),
      ),
    ),
    userContext: v.optional(
      v.object({
        halalScore: v.optional(v.number()),
        lastScanFindings: v.optional(v.array(v.string())),
      }),
    ),
  },
  handler: async (_ctx, args) => {
    // === GUARDRAILS ===
    // Check for blocked content (harmful, adult, hate speech)
    if (containsBlockedContent(args.message)) {
      return {
        response:
          "Maaf, saya tidak dapat memproses pertanyaan tersebut. Saya adalah Asisten Halal yang fokus membantu pertanyaan seputar sertifikasi halal, bahan baku, dan proses produksi halal. Silakan ajukan pertanyaan terkait halal.",
        source: "guardrail",
        confidence: 0,
      };
    }

    // Check for off-topic questions
    if (isOffTopic(args.message)) {
      return {
        response:
          "Maaf, pertanyaan Anda sepertinya di luar topik yang bisa saya bantu. Saya adalah Asisten Halal yang khusus membantu:\n\n• Proses sertifikasi halal BPJPH\n• Persyaratan dokumen SJPH\n• Informasi bahan baku halal/haram\n• Tips persiapan audit halal\n• Panduan untuk UMKM\n\nSilakan ajukan pertanyaan terkait halal, dan saya siap membantu!",
        source: "guardrail",
        confidence: 0,
      };
    }

    // Try FAQ matching first
    const faqMatch = findMatchingFAQ(args.message);

    if (faqMatch) {
      return {
        response: faqMatch.answer,
        source: "faq",
        confidence: 1.0,
      };
    }

    // Fallback to LLM
    const apiKey = process.env.KOLOSAL_API_KEY;
    if (!apiKey) {
      return {
        response: "Maaf, sistem sedang tidak tersedia. Silakan coba lagi nanti atau hubungi BPJPH di 1500-363.",
        source: "error",
        confidence: 0,
      };
    }

    const kolosal = createKolosalClient(apiKey);

    // Build context from user data
    let contextPrompt = "";
    if (args.userContext?.halalScore) {
      contextPrompt += `\n\nKonteks user: Skor kesiapan halal terakhir adalah ${args.userContext.halalScore}/100.`;
    }
    if (args.userContext?.lastScanFindings?.length) {
      contextPrompt += `\nTemuan dari scan terakhir: ${args.userContext.lastScanFindings.join(", ")}`;
    }

    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      {
        role: "system",
        content: SYSTEM_PROMPTS.HALAL_ASSISTANT + contextPrompt,
      },
    ];

    // Add conversation history
    if (args.conversationHistory) {
      for (const msg of args.conversationHistory) {
        messages.push({
          role: msg.role,
          content: msg.content,
        });
      }
    }

    messages.push({
      role: "user",
      content: args.message,
    });

    const response = await kolosal.chat.completions.create({
      model: KOLOSAL_MODELS.TEXT,
      messages,
      temperature: 0.7,
      max_tokens: 4096,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return {
        response: "Maaf, tidak dapat memproses pertanyaan Anda. Silakan coba lagi.",
        source: "error",
        confidence: 0,
      };
    }

    return {
      response: `${content}\n\n_Catatan: Jawaban ini dihasilkan AI. Untuk kepastian, konsultasikan dengan LPH atau BPJPH._`,
      source: "llm",
      confidence: 0.7,
    };
  },
});
