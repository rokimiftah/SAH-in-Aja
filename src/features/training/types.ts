import type { Doc } from "../../../convex/_generated/dataModel";

export type TrainingSession = Doc<"training_sessions">;

export interface QuizQuestion {
  id: string;
  question: string;
  options: { value: string; label: string }[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
}

export const PASSING_SCORE = 100;

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Dasar-dasar Halal
  {
    id: "q1",
    question: "Apa yang dimaksud dengan halal dalam konteks makanan?",
    options: [
      { value: "a", label: "Makanan yang enak dan bergizi" },
      { value: "b", label: "Makanan yang diperbolehkan menurut syariat Islam" },
      { value: "c", label: "Makanan yang dibuat di Indonesia" },
      { value: "d", label: "Makanan yang murah dan terjangkau" },
    ],
    correctAnswer: "b",
    explanation: "Halal berarti diperbolehkan atau diizinkan menurut hukum Islam (syariat).",
  },
  {
    id: "q2",
    question: "Apa lawan kata dari halal?",
    options: [
      { value: "a", label: "Haram" },
      { value: "b", label: "Makruh" },
      { value: "c", label: "Mubah" },
      { value: "d", label: "Syubhat" },
    ],
    correctAnswer: "a",
    explanation: "Haram adalah lawan kata dari halal, yang berarti dilarang menurut syariat Islam.",
  },
  {
    id: "q3",
    question: "Apa yang dimaksud dengan syubhat?",
    options: [
      { value: "a", label: "Jelas halal" },
      { value: "b", label: "Jelas haram" },
      { value: "c", label: "Meragukan/tidak jelas status halalnya" },
      { value: "d", label: "Makanan impor" },
    ],
    correctAnswer: "c",
    explanation: "Syubhat adalah sesuatu yang meragukan atau tidak jelas status halal-haramnya, sebaiknya dihindari.",
  },
  // Najis dan Pencucian
  {
    id: "q4",
    question: "Manakah dari berikut ini yang termasuk najis berat (mughallazhah)?",
    options: [
      { value: "a", label: "Darah" },
      { value: "b", label: "Babi dan anjing" },
      { value: "c", label: "Air kencing" },
      { value: "d", label: "Kotoran hewan" },
    ],
    correctAnswer: "b",
    explanation: "Najis mughallazhah (berat) meliputi babi dan anjing beserta turunannya.",
  },
  {
    id: "q5",
    question: "Berapa kali pencucian yang diperlukan untuk mensucikan najis mughallazhah?",
    options: [
      { value: "a", label: "3 kali" },
      { value: "b", label: "5 kali" },
      { value: "c", label: "7 kali, salah satunya dengan tanah" },
      { value: "d", label: "1 kali dengan air mengalir" },
    ],
    correctAnswer: "c",
    explanation: "Najis mughallazhah harus dicuci 7 kali, salah satunya dengan tanah atau debu (sertu/samak).",
  },
  {
    id: "q6",
    question: "Apa yang dimaksud dengan najis mutawassithah?",
    options: [
      { value: "a", label: "Najis ringan" },
      { value: "b", label: "Najis sedang" },
      { value: "c", label: "Najis berat" },
      { value: "d", label: "Najis yang tidak terlihat" },
    ],
    correctAnswer: "b",
    explanation: "Najis mutawassithah adalah najis sedang seperti darah, nanah, kotoran, dan air kencing.",
  },
  {
    id: "q7",
    question: "Bagaimana cara mensucikan najis mutawassithah?",
    options: [
      { value: "a", label: "Cukup dilap dengan kain" },
      { value: "b", label: "Dicuci hingga hilang warna, bau, dan rasanya" },
      { value: "c", label: "Dicuci 7 kali dengan tanah" },
      { value: "d", label: "Tidak perlu dicuci" },
    ],
    correctAnswer: "b",
    explanation: "Najis mutawassithah disucikan dengan mencuci hingga hilang sifat najisnya (warna, bau, rasa).",
  },
  // Bahan Haram
  {
    id: "q8",
    question: "Bahan mana yang PASTI tidak halal?",
    options: [
      { value: "a", label: "Gelatin dari sapi" },
      { value: "b", label: "Lemak babi (lard)" },
      { value: "c", label: "Minyak kelapa sawit" },
      { value: "d", label: "Gula tebu" },
    ],
    correctAnswer: "b",
    explanation: "Lemak babi (lard) berasal dari babi yang haram dikonsumsi dalam Islam.",
  },
  {
    id: "q9",
    question: "Manakah minuman yang haram dikonsumsi?",
    options: [
      { value: "a", label: "Jus buah segar" },
      { value: "b", label: "Khamr (minuman beralkohol yang memabukkan)" },
      { value: "c", label: "Susu sapi" },
      { value: "d", label: "Air kelapa" },
    ],
    correctAnswer: "b",
    explanation: "Khamr atau minuman beralkohol yang memabukkan hukumnya haram dalam Islam.",
  },
  {
    id: "q10",
    question: "Hewan apa yang halal dimakan menurut Islam?",
    options: [
      { value: "a", label: "Babi" },
      { value: "b", label: "Anjing" },
      { value: "c", label: "Sapi yang disembelih dengan menyebut nama Allah" },
      { value: "d", label: "Bangkai" },
    ],
    correctAnswer: "c",
    explanation: "Hewan halal seperti sapi, kambing, ayam harus disembelih dengan menyebut nama Allah (bismillah).",
  },
  {
    id: "q11",
    question: "Apa hukum mengonsumsi darah yang mengalir?",
    options: [
      { value: "a", label: "Halal" },
      { value: "b", label: "Makruh" },
      { value: "c", label: "Haram" },
      { value: "d", label: "Mubah" },
    ],
    correctAnswer: "c",
    explanation: "Darah yang mengalir (dam masfuh) hukumnya haram dikonsumsi berdasarkan Al-Quran.",
  },
  // SJPH dan Regulasi
  {
    id: "q12",
    question: "Apa yang dimaksud dengan SJPH?",
    options: [
      { value: "a", label: "Surat Jaminan Produk Halal" },
      { value: "b", label: "Sistem Jaminan Produk Halal" },
      { value: "c", label: "Standar Jaminan Produk Halal" },
      { value: "d", label: "Sertifikasi Jaminan Produk Halal" },
    ],
    correctAnswer: "b",
    explanation: "SJPH adalah Sistem Jaminan Produk Halal yang wajib dimiliki pelaku usaha.",
  },
  {
    id: "q13",
    question: "Siapa yang berwenang menerbitkan sertifikat halal di Indonesia?",
    options: [
      { value: "a", label: "Kementerian Kesehatan" },
      { value: "b", label: "BPOM" },
      { value: "c", label: "BPJPH (Badan Penyelenggara Jaminan Produk Halal)" },
      { value: "d", label: "Kementerian Perdagangan" },
    ],
    correctAnswer: "c",
    explanation: "Berdasarkan UU JPH, BPJPH adalah lembaga yang berwenang menerbitkan sertifikat halal.",
  },
  {
    id: "q14",
    question: "Apa dasar hukum sertifikasi halal di Indonesia?",
    options: [
      { value: "a", label: "UU No. 33 Tahun 2014 tentang Jaminan Produk Halal" },
      { value: "b", label: "UU No. 8 Tahun 1999 tentang Perlindungan Konsumen" },
      { value: "c", label: "PP No. 69 Tahun 1999" },
      { value: "d", label: "Permenkes No. 33 Tahun 2012" },
    ],
    correctAnswer: "a",
    explanation: "UU No. 33 Tahun 2014 tentang Jaminan Produk Halal (UU JPH) adalah dasar hukum utama.",
  },
  {
    id: "q15",
    question: "Berapa lama masa berlaku sertifikat halal?",
    options: [
      { value: "a", label: "1 tahun" },
      { value: "b", label: "2 tahun" },
      { value: "c", label: "4 tahun" },
      { value: "d", label: "5 tahun" },
    ],
    correctAnswer: "c",
    explanation: "Sertifikat halal berlaku selama 4 tahun sejak diterbitkan dan wajib diperpanjang.",
  },
  // Penyelia Halal
  {
    id: "q16",
    question: "Apa fungsi utama Penyelia Halal di perusahaan?",
    options: [
      { value: "a", label: "Mengelola keuangan perusahaan" },
      { value: "b", label: "Mengawasi dan menjamin kehalalan produk" },
      { value: "c", label: "Memproduksi makanan halal" },
      { value: "d", label: "Menjual produk ke konsumen" },
    ],
    correctAnswer: "b",
    explanation: "Penyelia Halal bertanggung jawab mengawasi Proses Produk Halal (PPH).",
  },
  {
    id: "q17",
    question: "Siapa yang wajib memiliki Penyelia Halal?",
    options: [
      { value: "a", label: "Hanya perusahaan besar" },
      { value: "b", label: "Semua pelaku usaha yang mengajukan sertifikasi halal" },
      { value: "c", label: "Hanya restoran" },
      { value: "d", label: "Hanya pabrik makanan" },
    ],
    correctAnswer: "b",
    explanation: "Setiap pelaku usaha yang mengajukan sertifikasi halal wajib memiliki Penyelia Halal.",
  },
  {
    id: "q18",
    question: "Apa syarat menjadi Penyelia Halal?",
    options: [
      { value: "a", label: "Beragama Islam dan memiliki sertifikat pelatihan" },
      { value: "b", label: "Memiliki gelar sarjana" },
      { value: "c", label: "Bekerja minimal 5 tahun" },
      { value: "d", label: "Berusia minimal 30 tahun" },
    ],
    correctAnswer: "a",
    explanation: "Penyelia Halal wajib beragama Islam dan telah mengikuti pelatihan serta lulus ujian.",
  },
  // Proses Produksi Halal
  {
    id: "q19",
    question: "Apa yang dimaksud dengan 'titik kritis kehalalan'?",
    options: [
      { value: "a", label: "Titik produksi yang paling menguntungkan" },
      { value: "b", label: "Tahapan proses yang berpotensi menimbulkan risiko ketidakhalalan" },
      { value: "c", label: "Lokasi penyimpanan bahan baku" },
      { value: "d", label: "Area pengiriman produk" },
    ],
    correctAnswer: "b",
    explanation: "Titik kritis kehalalan adalah tahapan yang berisiko menyebabkan produk menjadi tidak halal.",
  },
  {
    id: "q20",
    question: "Apa yang harus dilakukan jika menemukan kontaminasi najis di area produksi?",
    options: [
      { value: "a", label: "Lanjutkan produksi seperti biasa" },
      { value: "b", label: "Hentikan produksi dan lakukan prosedur pencucian (samak)" },
      { value: "c", label: "Pindahkan kontaminasi ke tempat lain" },
      { value: "d", label: "Tutup-tutupi agar tidak diketahui" },
    ],
    correctAnswer: "b",
    explanation: "Kontaminasi najis harus segera dihentikan dan dilakukan prosedur pencucian sesuai syariat.",
  },
  {
    id: "q21",
    question: "Apa tujuan dari traceability dalam sistem halal?",
    options: [
      { value: "a", label: "Menghitung keuntungan perusahaan" },
      { value: "b", label: "Melacak asal-usul bahan dari supplier hingga produk jadi" },
      { value: "c", label: "Mempromosikan produk ke konsumen" },
      { value: "d", label: "Mempercepat proses produksi" },
    ],
    correctAnswer: "b",
    explanation: "Traceability memastikan semua bahan dapat dilacak asalnya untuk menjamin kehalalan.",
  },
  {
    id: "q22",
    question: "Bagaimana cara memisahkan bahan halal dan non-halal di gudang?",
    options: [
      { value: "a", label: "Tidak perlu dipisahkan" },
      { value: "b", label: "Cukup diberi label berbeda" },
      { value: "c", label: "Disimpan di area terpisah dengan pembatas jelas" },
      { value: "d", label: "Dicampur saja asal tidak bersentuhan" },
    ],
    correctAnswer: "c",
    explanation: "Bahan halal dan non-halal harus disimpan terpisah dengan pembatas jelas untuk mencegah kontaminasi.",
  },
  // Audit dan Dokumentasi
  {
    id: "q23",
    question: "Apa yang diperiksa saat audit halal?",
    options: [
      { value: "a", label: "Hanya dokumen perusahaan" },
      { value: "b", label: "Bahan, proses produksi, fasilitas, dan dokumentasi" },
      { value: "c", label: "Hanya kebersihan dapur" },
      { value: "d", label: "Hanya label produk" },
    ],
    correctAnswer: "b",
    explanation: "Audit halal mencakup pemeriksaan bahan, proses, fasilitas, dan kelengkapan dokumentasi SJPH.",
  },
  {
    id: "q24",
    question: "Dokumen apa yang wajib dimiliki dalam SJPH?",
    options: [
      { value: "a", label: "Hanya surat izin usaha" },
      { value: "b", label: "Kebijakan halal, SOP, daftar bahan, dan bukti pelatihan" },
      { value: "c", label: "Hanya laporan keuangan" },
      { value: "d", label: "Hanya sertifikat BPOM" },
    ],
    correctAnswer: "b",
    explanation: "SJPH mencakup kebijakan halal, prosedur, daftar bahan baku, dan bukti pelatihan penyelia halal.",
  },
  {
    id: "q25",
    question: "Apa yang harus dilakukan jika ada perubahan bahan baku?",
    options: [
      { value: "a", label: "Langsung ganti tanpa lapor" },
      { value: "b", label: "Melapor ke BPJPH dan memperbarui dokumen SJPH" },
      { value: "c", label: "Tidak perlu melapor jika bahan serupa" },
      { value: "d", label: "Menunggu audit berikutnya" },
    ],
    correctAnswer: "b",
    explanation: "Setiap perubahan bahan baku wajib dilaporkan ke BPJPH dan dokumen SJPH harus diperbarui.",
  },
  // Kriteria Sistem Jaminan Produk Halal (SJPH) Tambahan
  {
    id: "q26",
    question: "Berapa batas maksimal kandungan etanol dalam produk makanan (bukan minuman) agar tetap bisa disertifikasi halal?",
    options: [
      { value: "a", label: "0%" },
      { value: "b", label: "0.5%" },
      { value: "c", label: "1%" },
      { value: "d", label: "5%" },
    ],
    correctAnswer: "b",
    explanation:
      "Menurut Fatwa MUI, kandungan etanol pada produk akhir makanan tidak boleh melebihi 0.5% selama tidak membahayakan medis.",
  },
  {
    id: "q27",
    question: "Apa peran Komisi Fatwa MUI dalam proses sertifikasi halal?",
    options: [
      { value: "a", label: "Memeriksa pabrik" },
      { value: "b", label: "Menerbitkan sertifikat" },
      { value: "c", label: "Menetapkan kehalalan produk melalui sidang fatwa" },
      { value: "d", label: "Melatih penyelia halal" },
    ],
    correctAnswer: "c",
    explanation: "Komisi Fatwa MUI berwenang menetapkan status kehalalan produk yang diajukan sertifikasi.",
  },
  {
    id: "q28",
    question: "Apa itu LPH (Lembaga Pemeriksa Halal)?",
    options: [
      { value: "a", label: "Lembaga yang menerbitkan sertifikat" },
      { value: "b", label: "Lembaga yang melakukan pemeriksaan dan/atau pengujian kehalalan produk" },
      { value: "c", label: "Lembaga pelatihan halal" },
      { value: "d", label: "Lembaga konsultasi halal" },
    ],
    correctAnswer: "b",
    explanation: "LPH bertugas melakukan pemeriksaan dokumen dan audit lapangan terhadap kehalalan produk.",
  },
  {
    id: "q29",
    question: "Kapan Audit Internal halal harus dilakukan oleh perusahaan?",
    options: [
      { value: "a", label: "Setiap bulan" },
      { value: "b", label: "Minimal satu kali dalam satu tahun" },
      { value: "c", label: "Hanya saat ada audit eksternal" },
      { value: "d", label: "Setiap 5 tahun sekali" },
    ],
    correctAnswer: "b",
    explanation: "Audit internal wajib dilakukan minimal satu kali setahun untuk memastikan SJPH berjalan efektif.",
  },
  {
    id: "q30",
    question: "Apa syarat utama air yang digunakan untuk pencucian dalam proses produksi halal?",
    options: [
      { value: "a", label: "Air hangat" },
      { value: "b", label: "Air mutlak (suci dan mensucikan)" },
      { value: "c", label: "Air yang dicampur sabun" },
      { value: "d", label: "Air mineral kemasan" },
    ],
    correctAnswer: "b",
    explanation: "Air yang digunakan harus air mutlak (suci mensucikan) dan bebas dari najis.",
  },
  // Bahan Kritis dan Titik Kritis
  {
    id: "q31",
    question: "Manakah berikut ini yang merupakan titik kritis pada keju?",
    options: [
      { value: "a", label: "Susu murni" },
      { value: "b", label: "Enzim Rennet/Pepsin" },
      { value: "c", label: "Garam" },
      { value: "d", label: "Air" },
    ],
    correctAnswer: "b",
    explanation:
      "Enzim rennet/pepsin sering berasal dari lambung hewan, sehingga harus dipastikan berasal dari hewan halal yang disembelih syar'i.",
  },
  {
    id: "q32",
    question: "Apa status hukum bangkai ikan dan belalang?",
    options: [
      { value: "a", label: "Haram" },
      { value: "b", label: "Halal" },
      { value: "c", label: "Makruh" },
      { value: "d", label: "Syubhat" },
    ],
    correctAnswer: "b",
    explanation: "Rasulullah SAW bersabda bahwa dua bangkai yang halal dimakan adalah ikan dan belalang.",
  },
  {
    id: "q33",
    question: "Apakah penggunaan nama 'Rum Cake' diperbolehkan untuk sertifikasi halal?",
    options: [
      { value: "a", label: "Boleh asal tidak memabukkan" },
      { value: "b", label: "Tidak boleh, karena menggunakan nama minuman keras" },
      { value: "c", label: "Boleh jika alkoholnya < 0.5%" },
      { value: "d", label: "Boleh jika rasanya enak" },
    ],
    correctAnswer: "b",
    explanation: "Produk tidak boleh menggunakan nama yang mengarah pada produk haram seperti 'Rum', 'Whisky', atau 'Babi'.",
  },
  {
    id: "q34",
    question: "Bagaimana hukum penggunaan kuas dari bulu babi untuk mengoles roti?",
    options: [
      { value: "a", label: "Halal jika dicuci" },
      { value: "b", label: "Haram dan menajiskan roti" },
      { value: "c", label: "Makruh" },
      { value: "d", label: "Boleh darurat" },
    ],
    correctAnswer: "b",
    explanation: "Bulu babi adalah najis mughallazhah. Penggunaannya haram dan membuat produk menjadi najis.",
  },
  {
    id: "q35",
    question: "Apa yang dimaksud dengan bahan penolong (processing aid)?",
    options: [
      { value: "a", label: "Bahan yang dimakan langsung" },
      { value: "b", label: "Bahan yang digunakan dalam proses tapi tidak ada di produk akhir" },
      { value: "c", label: "Bahan kemasan" },
      { value: "d", label: "Bahan pengawet" },
    ],
    correctAnswer: "b",
    explanation:
      "Bahan penolong digunakan untuk membantu proses produksi tetapi tidak menjadi bagian komposisi produk akhir (namun tetap harus halal).",
  },
  // Penyembelihan
  {
    id: "q36",
    question: "Berapa saluran yang wajib terputus saat penyembelihan hewan?",
    options: [
      { value: "a", label: "1 saluran (napas)" },
      { value: "b", label: "2 saluran (makan & napas)" },
      { value: "c", label: "3 saluran (makan, napas, dua pembuluh darah)" },
      { value: "d", label: "Kepala harus putus" },
    ],
    correctAnswer: "c",
    explanation: "Wajib terputus saluran napas (hulqum), saluran makan (mari'), dan dua pembuluh darah leher (wadajain).",
  },
  {
    id: "q37",
    question: "Apa hukum melakukan stunning (pemingsanan) hewan sebelum disembelih?",
    options: [
      { value: "a", label: "Haram mutlak" },
      { value: "b", label: "Diperbolehkan dengan syarat hewan tidak mati sebelum disembelih" },
      { value: "c", label: "Wajib dilakukan" },
      { value: "d", label: "Makruh" },
    ],
    correctAnswer: "b",
    explanation:
      "Stunning diperbolehkan asalkan hanya menyebabkan pingsan sementara (tidak mematikan) untuk memudahkan penyembelihan.",
  },
  {
    id: "q38",
    question: "Siapa yang boleh menjadi juru sembelih halal (Juleha)?",
    options: [
      { value: "a", label: "Siapa saja yang kuat" },
      { value: "b", label: "Muslim, baligh, berakal, dan memahami tata cara syar'i" },
      { value: "c", label: "Orang non-muslim ahli jagal" },
      { value: "d", label: "Anak-anak" },
    ],
    correctAnswer: "b",
    explanation: "Juru sembelih harus beragama Islam, dewasa (baligh), berakal sehat, dan mengerti syariat penyembelihan.",
  },
  // Manajemen Halal
  {
    id: "q39",
    question: "Apa yang dimaksud dengan Kaji Ulang Manajemen dalam SJPH?",
    options: [
      { value: "a", label: "Menghitung ulang gaji karyawan" },
      { value: "b", label: "Evaluasi efektivitas penerapan SJPH oleh manajemen puncak" },
      { value: "c", label: "Pemeriksaan stok gudang" },
      { value: "d", label: "Rapat bulanan biasa" },
    ],
    correctAnswer: "b",
    explanation:
      "Kaji ulang manajemen adalah evaluasi berkala oleh pimpinan untuk memastikan SJPH tetap efektif dan sesuai standar.",
  },
  {
    id: "q40",
    question: "Apa kewajiban pelaku usaha terhadap logo halal?",
    options: [
      { value: "a", label: "Disimpan di kantor" },
      { value: "b", label: "Dicantumkan pada kemasan produk yang telah bersertifikat" },
      { value: "c", label: "Hanya dipasang di website" },
      { value: "d", label: "Tidak wajib dicantumkan" },
    ],
    correctAnswer: "b",
    explanation: "Pelaku usaha wajib mencantumkan label Halal Indonesia pada kemasan produk yang telah mendapat sertifikat.",
  },
  {
    id: "q41",
    question: "Media fermentasi mikroba menjadi haram jika...",
    options: [
      { value: "a", label: "Menggunakan gula" },
      { value: "b", label: "Menggunakan bahan yang berasal dari babi" },
      { value: "c", label: "Dilakukan di laboratorium" },
      { value: "d", label: "Menggunakan air" },
    ],
    correctAnswer: "b",
    explanation: "Media pertumbuhan mikroba tidak boleh mengandung bahan najis/haram seperti turunan babi.",
  },
  {
    id: "q42",
    question: "Apa yang dimaksud dengan produk kosmetik halal?",
    options: [
      { value: "a", label: "Kosmetik yang mahal" },
      { value: "b", label: "Kosmetik yang bebas dari bahan najis dan aman digunakan (thayyib)" },
      { value: "c", label: "Kosmetik impor" },
      { value: "d", label: "Kosmetik herbal" },
    ],
    correctAnswer: "b",
    explanation: "Kosmetik halal harus terbuat dari bahan halal, suci, dan tidak membahayakan penggunanya.",
  },
  {
    id: "q43",
    question: "Bagaimana aturan penggunaan fasilitas produksi untuk produk halal?",
    options: [
      { value: "a", label: "Boleh campur dengan produk babi" },
      { value: "b", label: "Harus bebas dari kontaminasi najis dan tidak bergantian dengan produk babi" },
      { value: "c", label: "Boleh bergantian asal dicuci air biasa" },
      { value: "d", label: "Tidak ada aturan khusus" },
    ],
    correctAnswer: "b",
    explanation: "Fasilitas produksi tidak boleh digunakan bergantian dengan produk yang mengandung babi/najis berat.",
  },
  {
    id: "q44",
    question: "Apa fungsi matriks bahan dalam dokumen SJPH?",
    options: [
      { value: "a", label: "Daftar harga bahan" },
      { value: "b", label: "Memetakan bahan yang digunakan pada setiap produk" },
      { value: "c", label: "Jadwal kedatangan bahan" },
      { value: "d", label: "Daftar supplier" },
    ],
    correctAnswer: "b",
    explanation: "Matriks bahan digunakan untuk menunjukkan distribusi penggunaan bahan baku pada setiap jenis produk.",
  },
  {
    id: "q45",
    question: "Apa yang harus dilakukan jika sertifikat halal akan habis masa berlakunya?",
    options: [
      { value: "a", label: "Membiarkannya mati" },
      { value: "b", label: "Mengajukan perpanjangan minimal 3 bulan sebelum habis" },
      { value: "c", label: "Membuat sertifikat sendiri" },
      { value: "d", label: "Tetap jualan tanpa logo halal" },
    ],
    correctAnswer: "b",
    explanation: "Pelaku usaha wajib mengajukan perpanjangan sertifikat halal, idealnya 3 bulan sebelum masa berlaku habis.",
  },
  {
    id: "q46",
    question: "Apakah kulit bangkai hewan bisa menjadi suci?",
    options: [
      { value: "a", label: "Tidak bisa" },
      { value: "b", label: "Bisa, dengan cara disamak (kecuali anjing & babi)" },
      { value: "c", label: "Bisa dicuci dengan sabun" },
      { value: "d", label: "Bisa dijemur saja" },
    ],
    correctAnswer: "b",
    explanation: "Kulit bangkai (selain anjing dan babi) dapat menjadi suci setelah melalui proses penyamakan.",
  },
  {
    id: "q47",
    question: "Emulsifier (E471) sering menjadi titik kritis karena...",
    options: [
      { value: "a", label: "Beracun" },
      { value: "b", label: "Bisa berasal dari lemak hewani atau nabati" },
      { value: "c", label: "Terlalu mahal" },
      { value: "d", label: "Mengandung alkohol" },
    ],
    correctAnswer: "b",
    explanation:
      "Emulsifier dapat dibuat dari lemak nabati (halal) atau lemak hewani (harus dari hewan halal disembelih), sehingga perlu dipastikan sumbernya.",
  },
  {
    id: "q48",
    question: "Program sosialisasi kebijakan halal ditujukan kepada...",
    options: [
      { value: "a", label: "Hanya direktur" },
      { value: "b", label: "Seluruh karyawan dan pihak terkait" },
      { value: "c", label: "Hanya satpam" },
      { value: "d", label: "Hanya konsumen" },
    ],
    correctAnswer: "b",
    explanation: "Kebijakan halal harus disosialisasikan kepada seluruh pemangku kepentingan internal perusahaan.",
  },
  {
    id: "q49",
    question: "Apa sanksi bagi pelaku usaha yang tidak menjaga kesinambungan PPH (Proses Produk Halal)?",
    options: [
      { value: "a", label: "Diberi hadiah" },
      { value: "b", label: "Pencabutan sertifikat halal" },
      { value: "c", label: "Dinaikkan pajaknya" },
      { value: "d", label: "Tidak ada sanksi" },
    ],
    correctAnswer: "b",
    explanation:
      "Pelanggaran terhadap konsistensi PPH dapat mengakibatkan sanksi administratif hingga pencabutan sertifikat halal.",
  },
  {
    id: "q50",
    question: "Salah satu tujuan UU Jaminan Produk Halal adalah...",
    options: [
      { value: "a", label: "Meningkatkan harga jual" },
      { value: "b", label: "Memberikan kenyamanan, keamanan, dan kepastian bagi masyarakat" },
      { value: "c", label: "Mempersulit pedagang kecil" },
      { value: "d", label: "Meningkatkan ekspor babi" },
    ],
    correctAnswer: "b",
    explanation:
      "Tujuan utama UU JPH adalah memberikan jaminan kenyamanan, keamanan, keselamatan, dan kepastian ketersediaan produk halal bagi masyarakat.",
  },
];

/**
 * Mengacak urutan array menggunakan Fisher-Yates shuffle
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Jumlah soal yang ditampilkan dalam satu kuis
 */
export const QUIZ_QUESTION_COUNT = 10;

/**
 * Mendapatkan soal kuis acak (10 soal dari 50 soal)
 */
export function getShuffledQuestions(): QuizQuestion[] {
  const shuffledQuestions = shuffleArray(QUIZ_QUESTIONS);
  return shuffledQuestions.slice(0, QUIZ_QUESTION_COUNT);
}
