import { v } from "convex/values";

import { action } from "./_generated/server";
import { createNvidiaClient, NVIDIA_MODELS, SYSTEM_PROMPTS } from "./lib/nvidia";

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

  traceability: `Buat Form Traceability yang mencakup:
1. Informasi Produk
2. Tanggal Produksi
3. Nomor Batch
4. Daftar Bahan yang Digunakan
5. Supplier Setiap Bahan
6. Nomor Lot Bahan
7. Tanggal Masuk Bahan
8. Catatan Proses Produksi`,

  komitmen_halal: `Buat Surat Komitmen Halal yang mencakup:
1. Identitas Pelaku Usaha
2. Pernyataan Komitmen Menjaga Kehalalan
3. Komitmen Menggunakan Bahan Halal
4. Komitmen Menjaga Kebersihan Fasilitas
5. Komitmen Pelatihan Karyawan
6. Komitmen Audit Internal
7. Tanda Tangan dan Materai`,
};

export const generateHalalDocument = action({
  args: {
    templateType: v.string(),
    businessInfo: v.object({
      name: v.string(),
      address: v.string(),
      owner: v.string(),
      productType: v.string(),
    }),
    ingredients: v.array(
      v.object({
        name: v.string(),
        supplier: v.string(),
        halalStatus: v.string(),
      }),
    ),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) {
      throw new Error("NVIDIA_API_KEY not configured");
    }

    const nvidia = createNvidiaClient(apiKey);
    const templatePrompt = TEMPLATE_PROMPTS[args.templateType] || TEMPLATE_PROMPTS.sop_produksi;

    const response = await nvidia.chat.completions.create({
      model: NVIDIA_MODELS.TEXT,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPTS.DOCUMENT_GENERATOR,
        },
        {
          role: "user",
          content: `${templatePrompt}

DATA USAHA:
- Nama Usaha: ${args.businessInfo.name}
- Alamat: ${args.businessInfo.address}
- Pemilik: ${args.businessInfo.owner}
- Jenis Produk: ${args.businessInfo.productType}

DAFTAR BAHAN:
${args.ingredients.map((i) => `- ${i.name} (Supplier: ${i.supplier}, Status: ${i.halalStatus})`).join("\n")}

Buat dokumen lengkap dalam bahasa Indonesia formal.`,
        },
      ],
      temperature: 0.3,
      max_tokens: 3000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    return { content };
  },
});
