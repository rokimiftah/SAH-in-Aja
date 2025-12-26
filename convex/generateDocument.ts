import { v } from "convex/values";

import { action } from "./_generated/server";
import { createLLMClient, getLLMModel, SYSTEM_PROMPTS } from "./lib/llmClient";

const TEMPLATE_PROMPTS: Record<string, string> = {
  sop_produksi: `Buat SOP Produksi Halal yang mencakup:
1. Tujuan dan Ruang Lingkup
2. Prosedur Pemilihan dan Penerimaan Bahan Baku
3. Prosedur Penyimpanan Bahan
4. Prosedur Produksi
5. Prosedur Pengemasan
6. Prosedur Penyimpanan Produk Jadi
7. Prosedur Distribusi
8. Dokumentasi dan Pencatatan`,

  perjanjian_supplier: `Buat Surat Perjanjian Supplier Halal yang mencakup:
1. Para Pihak (Pembeli dan Penjual)
2. Definisi dan Istilah
3. Komitmen Penyediaan Bahan Halal
4. Jaminan Sertifikat Halal
5. Kewajiban Supplier
6. Sanksi Pelanggaran
7. Masa Berlaku
8. Tanda Tangan Para Pihak`,

  daftar_bahan: `Buat Daftar Bahan Baku yang mencakup:
1. Nama Bahan
2. Merek/Produsen
3. Nomor Sertifikat Halal
4. Masa Berlaku Sertifikat
5. Supplier/Distributor
6. Kode Bahan Internal
7. Status Halal (Halal/Dalam Proses/Perlu Verifikasi)`,

  traceability: `Buat Tabel Matriks Traceability (Ketertelusuran) yang mencakup:
1. Kolom Vertikal: Daftar seluruh Bahan Baku
2. Kolom Horizontal: Daftar seluruh Produk (Varian)
3. Isi Tabel: Tanda centang (v) jika bahan digunakan pada produk tersebut
4. Informasi Supplier dan Status Halal untuk setiap bahan
5. Kode Produksi/Batch untuk simulasi tracking
6. Kesimpulan: Apakah semua produk terjamin kehalalannya berdasarkan matriks bahan?`,

  komitmen_halal: `Buat Surat Komitmen Halal yang mencakup:
1. Identitas Pelaku Usaha
2. Pernyataan Komitmen Menjaga Kehalalan
3. Komitmen Menggunakan Bahan Halal
4. Komitmen Menjaga Kebersihan Fasilitas
5. Komitmen Pelatihan Karyawan
6. Komitmen Audit Internal
7. Tanda Tangan dan Materai`,

  sop_pencucian_najis: `Buat SOP Pencucian Najis (Samak) yang SPESIFIK sesuai kondisi usaha ini, mencakup:
1. Tujuan: Memastikan semua fasilitas bebas dari najis sebelum digunakan produksi halal.
2. Identifikasi Sumber Air:
   - Wajib menggunakan AIR MENGALIR (kran/selang) untuk pembilasan akhir.
   - Dilarang hanya menggunakan metode celup (ember statis) untuk penyucian najis.
3. Prosedur Teknis (Wajib Detil):
   - Langkah 1: Buang kotoran/sisa makanan (Solid Waste).
   - Langkah 2: Gosok dengan sabun/deterjen.
   - Langkah 3: Bilas dengan AIR MENGALIR sampai hilang 3 sifat (bau, rasa, warna).
   - Langkah 4: Keringkan dan simpan di rak tertutup.
4. Penanganan Khusus (Jika ada kontaminasi Najis Berat/Mughallazhah):
   - Wajib sertu (7x cuci, 1x dengan tanah) jika terkena babi/anjing.
5. Verifikasi:
   - Cara mengecek kebersihan (visual & organoleptik).
6. Dokumentasi:
   - Log harian pembersihan.`,

  pernyataan_bebas_babi: `Buat Surat Pernyataan Bebas Babi yang mencakup:
1. Kop Surat
   - Logo perusahaan (placeholder)
   - Nama dan alamat perusahaan
2. Judul: SURAT PERNYATAAN BEBAS BABI DAN TURUNANNYA
3. Identitas Pelaku Usaha
   - Nama pemilik/penanggung jawab
   - Jabatan
   - Nama usaha
   - Alamat usaha
   - Nomor telepon
4. Pernyataan Resmi
   - Menyatakan dengan sebenar-benarnya bahwa:
   - Tidak menggunakan daging babi dalam proses produksi
   - Tidak menggunakan lemak babi (lard) atau minyak babi
   - Tidak menggunakan gelatin dari babi
   - Tidak menggunakan turunan babi lainnya (kolagen, enzim, emulsifier)
   - Tidak menggunakan peralatan yang pernah bersentuhan dengan babi
5. Daftar Bahan yang Digunakan
   - Nama bahan
   - Sumber/asal bahan
   - Status halal (jika ada sertifikat)
6. Komitmen
   - Bersedia menerima sanksi jika pernyataan tidak benar
   - Bersedia diaudit sewaktu-waktu
   - Menjamin kehalalan produk dari kontaminasi babi
7. Penutup
   - Tempat dan tanggal
   - Tanda tangan bermaterai
   - Nama terang dan jabatan`,
};

export const generateHalalDocument = action({
  args: {
    templateType: v.string(),
    businessInfo: v.object({
      name: v.string(),
      address: v.string(),
      owner: v.string(),
      productType: v.string(),
      washingMethod: v.optional(v.string()),
    }),
    products: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
      }),
    ),
    ingredients: v.array(
      v.object({
        name: v.string(),
        supplier: v.string(),
        halalStatus: v.string(),
        productsUsedIn: v.optional(v.array(v.string())), // Changed to array of IDs
      }),
    ),
  },
  handler: async (_ctx, args) => {
    const templatePrompt = TEMPLATE_PROMPTS[args.templateType] || TEMPLATE_PROMPTS.sop_produksi;

    // Helper to resolve product names from IDs
    const getProductNames = (productIds?: string[]) => {
      if (!productIds || productIds.length === 0) return "";
      return productIds
        .map((id) => args.products.find((p) => p.id === id)?.name)
        .filter(Boolean)
        .join(", ");
    };

    const userContent = `${templatePrompt}

DATA USAHA:
- Nama Usaha: ${args.businessInfo.name}
- Alamat: ${args.businessInfo.address}
- Pemilik: ${args.businessInfo.owner}
- Jenis Produk: ${args.businessInfo.productType}
- Metode Pencucian: ${args.businessInfo.washingMethod || "Belum ditentukan"}

DAFTAR PRODUK (VARIAN):
${args.products.map((p, i) => `${i + 1}. ${p.name}`).join("\n")}

DAFTAR BAHAN & MATRIKS PENGGUNAAN:
${args.ingredients
  .map(
    (i) =>
      `- ${i.name} (Supplier: ${i.supplier}, Status: ${i.halalStatus}) ${
        i.productsUsedIn && i.productsUsedIn.length > 0
          ? `[Digunakan di: ${getProductNames(i.productsUsedIn)}]`
          : "[Digunakan di: Semua Produk/Umum]"
      }`,
  )
  .join("\n")}

TANGGAL HARI INI: ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" })}

Buat dokumen lengkap dalam bahasa Indonesia formal. Gunakan tahun ${new Date().toLocaleDateString("id-ID", { year: "numeric", timeZone: "Asia/Jakarta" })} untuk nomor dokumen.`;

    try {
      const llmClient = createLLMClient();

      const response = await llmClient.chat.completions.create({
        model: getLLMModel("text"),
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPTS.DOCUMENT_GENERATOR,
          },
          {
            role: "user",
            content: userContent,
          },
        ],
        temperature: 0.7,
        max_tokens: 4096,
      });

      const message = response.choices[0]?.message;
      const content = message?.content;

      if (!content || content.trim() === "") {
        console.error("Content is empty or missing");
        throw new Error("No content in API response");
      }

      return { content };
    } catch (error) {
      console.error("Error generating document:", error);

      // Handle specific error types
      if (error instanceof Error) {
        const message = error.message;

        // API rate limit or quota errors
        if (message.includes("429") || message.includes("rate limit")) {
          throw new Error("Layanan sedang sibuk. Silakan coba lagi dalam beberapa menit.");
        }

        // API key or authentication errors
        if (message.includes("401") || message.includes("403") || message.includes("authentication")) {
          throw new Error("Terjadi kesalahan sistem. Silakan coba lagi nanti.");
        }

        // Bad request errors (400)
        if (message.includes("400")) {
          throw new Error("Terjadi kesalahan saat memproses permintaan. Silakan coba lagi.");
        }

        // Server errors
        if (message.includes("500") || message.includes("502") || message.includes("503")) {
          throw new Error("Layanan sedang tidak tersedia. Silakan coba lagi nanti.");
        }
      }

      throw new Error("Gagal generate dokumen. Silakan coba lagi.");
    }
  },
});
