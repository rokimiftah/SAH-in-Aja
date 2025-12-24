<div align="center">

<img src="https://cdn.sahin.biz.id/logo.avif" alt="SAH-in Aja! Logo" width="200">

### Siap Halal dari Dapur hingga Sertifikat

**Platform Persiapan Sertifikasi Halal Berbasis AI untuk UMKM Indonesia**

> _"Paham Dulu, Baru Usahamu SAH!"_

[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Convex](https://img.shields.io/badge/Convex-Backend-FF6B6B?style=for-the-badge)](https://convex.dev/)
[![Kolosal AI](https://img.shields.io/badge/Kolosal-AI-76B900?style=for-the-badge)](https://kolosal.ai/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

</div>

---

## Daftar Isi

- [Tentang Proyek](#tentang-proyek)
- [Masalah yang Diselesaikan](#masalah-yang-diselesaikan)
- [Fitur Utama](#fitur-utama)
- [Cara Penggunaan](#cara-penggunaan)
- [Tech Stack](#tech-stack)
- [AI Models](#ai-models)
- [Arsitektur](#arsitektur)
- [Quick Start](#quick-start)
- [Struktur Proyek](#struktur-proyek)
- [Sistem Kredit](#sistem-kredit)
- [Environment Variables](#environment-variables)
- [Disclaimer](#disclaimer)
- [Kontribusi](#kontribusi)
- [License](#license)

---

## Tentang Proyek

**SAH-in Aja!** adalah platform berbasis AI yang membantu UMKM Indonesia mempersiapkan sertifikasi halal BPJPH/MUI. Platform ini menyediakan:

- **Assessment dapur** kesiapan halal melalui foto area produksi
- **Cek bahan** (OCR + AI) untuk verifikasi komposisi produk
- **Generator dokumen SJPH** (Sistem Jaminan Produk Halal) otomatis
- **Konsultasi AI 24/7** seputar proses sertifikasi halal
- **Simulasi audit** dengan AI Voice untuk latihan wawancara audit

---

## Masalah yang Diselesaikan

<table>
<tr>
<td align="center" width="33%">

### Rp 2-10 Juta

Biaya audit halal yang **mahal** untuk UMKM

</td>
<td align="center" width="33%">

### 82%

UMKM **kesulitan** dengan persyaratan sertifikasi

</td>
<td align="center" width="33%">

### 1-3 Bulan

Waktu proses sertifikasi yang **lama**

</td>
</tr>
</table>

**SAH-in Aja!** hadir sebagai **asisten AI gratis** yang membantu **30+ juta UMKM Indonesia** mempersiapkan sertifikasi halal dengan:

- Pre-assessment gratis sebelum audit resmi
- Dokumen SJPH otomatis sesuai standar HAS 23000
- Panduan step-by-step proses sertifikasi
- Estimasi perbaikan yang diperlukan

---

## Fitur Utama

<table>
<tr>

<td width="25%" valign="top">

### 1. Cek Dapur Halal

**Vision AI Assessment**

Foto area produksi, AI analisis, Skor kesiapan + Action plan

- Analisis hingga 5 foto sekaligus
- Deteksi bahan berpotensi non-halal
- Skor kesiapan 0-100
- Standar SJPH HAS 23000
- Rekomendasi perbaikan detail
- Hasil dalam < 2 menit

**Model:** Claude Sonnet 4.5 (Vision)

</td>

<td width="25%" valign="top">

### 4. Cek Bahan Halal

**Smart Material Scanner**

Foto label produk, AI baca komposisi + validasi halal

- OCR otomatis baca ingredients
- Deteksi logo halal (MUI/BPJPH)
- Verifikasi Positive List (KMA 335/2022)
- Database bahan kritis (E-codes)
- Status: Aman/Meragukan/Tidak Halal
- Rekomendasi tindakan

**Model:** Claude Sonnet 4.5 (Vision + OCR)

</td>

<td width="25%" valign="top">

### 2. Dokumen Halal

**AI Document Generator**

Pilih template, Isi data, Generate dokumen

- SOP Produksi Halal
- Perjanjian Supplier Halal
- Daftar Bahan Baku
- Form Traceability
- Surat Komitmen Halal
- Export ke DOCX

**Model:** Claude Sonnet 4.5

</td>
</tr>

<tr>
<td width="25%" valign="top">

### 3. Asisten Halal

**AI Chatbot 24/7**

Tanya, Jawab instan, Panduan lengkap

- FAQ database 30+ topik
- Panduan BPJPH lengkap
- Info persyaratan dokumen
- Tips lulus audit
- Guardrails anti-penyalahgunaan
- Konteks percakapan

**Model:** Claude Sonnet 4.5

</td>

<td width="25%" valign="top">

### 5. Simulasi Audit Halal

**AI Voice Simulator**

Latihan wawancara audit dengan AI auditor

- Auditor supportif
- Fokus topik (Bahan/Produksi/SOP)
- Percakapan real-time via Vapi.ai
- Feedback hasil audit

**Model:** Vapi.ai (Voice AI)

</td>

<td width="25%" valign="top">

### 6. Admin Dashboard

**Pusat Kontrol Platform**

Kelola user, promo, dan analytics

- User Management (role, tier)
- Promo Codes (kredit tambahan)
- Real-time Analytics (usage stats)

</td>
</tr>
</table>

---

## Cara Penggunaan

### 1. Registrasi dan Login

1. Buka website [sahin.biz.id](https://sahin.biz.id)
2. Klik tombol "Mulai Sekarang" atau "Masuk"
3. Pilih metode login:
   - **Google OAuth** - Login dengan akun Google
   - **Magic Link** - Masukkan email, klik link yang dikirim ke inbox
4. Setelah login, Anda akan diarahkan ke Dashboard

### 2. Menggunakan Cek Dapur Halal

Fitur ini menganalisis foto area produksi/dapur Anda untuk menilai kesiapan sertifikasi halal.

**Langkah-langkah:**

1. Dari Dashboard, klik menu **"Cek Dapur Halal - Analisis Baru"**
2. Klik tombol **"Cek Kesiapan Dapur"**
3. Upload foto area produksi (maksimal 5 foto):
   - Area kompor/masak
   - Rak bumbu dan bahan
   - Tempat penyimpanan
   - Area cuci/pembersihan
   - Area pengemasan
4. Klik **"Analisis Sekarang"**
5. Tunggu 1-2 menit, AI akan menganalisis foto
6. Lihat hasil:
   - **Skor Kesiapan** (0-100)
   - **Temuan** - hal yang sudah baik dan perlu diperbaiki
   - **Action Items** - langkah perbaikan yang harus dilakukan
   - **Pesan Keseluruhan** - ringkasan dan motivasi

**Tips untuk hasil optimal:**

- Pastikan pencahayaan cukup
- Foto dalam keadaan normal (bukan saat sudah dibersihkan khusus)
- Tampilkan label produk/bahan yang ada
- Foto dari berbagai sudut

### 5. Menggunakan Cek Bahan

Fitur ini menganalisis label produk untuk memvalidasi status halal bahan-bahan yang tertera.

**Langkah-langkah:**

1. Dari Dashboard, klik menu **"Cek Bahan Halal - Scan Baru"**
2. Klik tombol **"Foto Kemasan Bahan"**
3. Upload foto label kemasan (maksimal 2 foto):
   - Bagian depan kemasan (logo halal jika ada)
   - Bagian belakang (komposisi/ingredients)
4. Klik **"Analisis"**
5. Tunggu ~1 menit, AI akan membaca dan menganalisis
6. Lihat hasil:
   - **Logo Halal** - Deteksi sertifikat halal (MUI/BPJPH)
   - **Positive List** - Status bahan alam yang otomatis halal
   - **Komposisi** - Daftar bahan yang terdeteksi OCR
   - **Analisis per Bahan** - Status (Aman/Meragukan/Tidak Halal) + alasan
   - **Status Keseluruhan** - Kesimpulan final
   - **Rekomendasi** - Tindakan yang perlu dilakukan

**Tips untuk hasil optimal:**

- Foto harus jelas dan fokus pada bagian komposisi/ingredients
- Pastikan pencahayaan cukup (tidak gelap/silau)
- Fokus pada teks komposisi, hindari background yang ramai
- Untuk produk import, pastikan ada label Indonesia/BPOM

**Apa yang dicek AI:**

| Kategori             | Contoh Bahan                       |
| -------------------- | ---------------------------------- |
| Logo Halal           | MUI, BPJPH, JAKIM, IFANCA          |
| Positive List        | Gula pasir, garam, sayur segar     |
| Bahan Kritis E-codes | E471, E120, E441 (gelatin), E422   |
| Enzim                | Rennet, Pepsin, Lipase             |
| Lemak                | Shortening, Lard, Tallow           |
| Produk Susu          | Whey, Casein, L-Cysteine (E920)    |
| Bahan Haram          | Pork, Babi, Bacon, Wine, Rum, Sake |

### 3. Menggunakan Dokumen Halal

Fitur ini membuat dokumen SJPH (Sistem Jaminan Produk Halal) secara otomatis.

**Langkah-langkah:**

1. Dari Dashboard, klik menu **"Dokumen Halal - Buat Dokumen"**
2. Klik tombol **"Generate Dokumen Wajib"**
3. Pilih jenis dokumen yang ingin dibuat:
   - **SOP Produksi Halal** - Prosedur standar produksi
   - **Perjanjian Supplier Halal** - Kontrak dengan supplier
   - **Daftar Bahan Baku** - List bahan dengan status halal
   - **Form Traceability** - Pelacakan bahan dari supplier
   - **Surat Komitmen Halal** - Pernyataan komitmen pemilik
4. Isi informasi usaha:
   - Nama usaha
   - Nama pemilik
   - Alamat usaha
   - Jenis produk
5. Tambahkan daftar bahan baku (nama, supplier, status halal)
6. Klik **"Lanjut"**
7. Preview dokumen yang dihasilkan
8. Klik **"Download DOCX"** untuk mengunduh

**Jenis dokumen yang tersedia:**

| Dokumen             | Kegunaan                                                     |
| ------------------- | ------------------------------------------------------------ |
| SOP Produksi Halal  | Prosedur operasional standar untuk menjamin kehalalan produk |
| Perjanjian Supplier | Kontrak komitmen supplier menyediakan bahan halal            |
| Daftar Bahan Baku   | Inventaris bahan dengan sertifikat halal masing-masing       |
| Form Traceability   | Dokumentasi pelacakan bahan dari supplier ke produk jadi     |
| Surat Komitmen      | Pernyataan resmi komitmen menjaga kehalalan                  |

### 4. Menggunakan Asisten Halal

Fitur ini menjawab pertanyaan seputar sertifikasi halal 24/7.

**Langkah-langkah:**

1. Dari Dashboard, klik menu **"Asisten Halal - Konsultasi Baru"**
2. Ketik pertanyaan di kolom chat, contoh:
   - "Bagaimana cara daftar sertifikasi halal?"
   - "Apa saja dokumen yang diperlukan?"
   - "Berapa biaya sertifikasi halal untuk UMKM?"
   - "Apakah gelatin halal?"
   - "Bagaimana prosedur audit halal?"
3. Tekan Enter atau klik tombol kirim
4. AI akan menjawab dengan informasi lengkap
5. Lanjutkan bertanya untuk klarifikasi

**Topik yang bisa ditanyakan:**

| Kategori    | Contoh Pertanyaan                          |
| ----------- | ------------------------------------------ |
| Pendaftaran | Cara daftar di halal.go.id, program SEHATI |
| Dokumen     | Persyaratan SJPH, cara membuat SOP         |
| Biaya       | Tarif sertifikasi, program gratis UMKM     |
| Bahan       | Status halal gelatin, emulsifier, enzim    |
| Audit       | Persiapan audit, tips lulus, LPH terdekat  |
| Proses      | Waktu proses, perpanjangan sertifikat      |

**Catatan:** Asisten Halal memiliki guardrails yang hanya menjawab pertanyaan terkait halal. Pertanyaan di luar topik akan diarahkan kembali.

### 6. Menggunakan Simulasi Audit Halal

Fitur ini memberikan simulasi wawancara audit halal dengan AI auditor menggunakan voice conversation.

**Langkah-langkah:**

1. Dari Dashboard, klik menu **"Simulasi Audit Halal - Simulasi Baru"**
2. Klik tombol **"Mulai Simulasi Audit"**
3. Pilih pengaturan sesi:
   - **Panggilan Anda**: Bapak, Ibu, Mas, atau Mbak
   - **Fokus Topik**: Bahan Baku, Proses Produksi, SOP, atau Umum
4. Klik **"Mulai Sekarang"**
5. Izinkan akses mikrofon browser
6. Percakapan dimulai, AI auditor akan bertanya seputar topik yang dipilih
7. Jawab dengan suara seperti wawancara asli
8. Klik **"Akhiri Sesi"** saat selesai
9. Lihat hasil:
   - **Feedback** - Komentar AI tentang persiapan Anda

**Tips untuk hasil optimal:**

- Gunakan lingkungan yang tenang
- Bicara dengan jelas dan tidak terburu-buru
- Anggap ini wawancara asli, jawab se-jujur mungkin
- Jika tidak tahu, lebih baik bilang "tidak tahu" daripada mengarang

**Topik yang akan ditanyakan:**

| Fokus Topik     | Contoh Pertanyaan                                  |
| --------------- | -------------------------------------------------- |
| Bahan Baku      | Dari mana Anda beli bahan? Ada sertifikat halal?   |
| Proses Produksi | Bagaimana proses produksi? Ada risiko kontaminasi? |
| SOP             | Apakah ada SOP tertulis? Siapa yang bertanggung?   |
| Umum            | Mix dari semua topik di atas                       |

### 7. Melihat Riwayat

Setiap fitur menyimpan riwayat penggunaan:

- **Riwayat Cek Dapur Halal** - Klik "Riwayat" di halaman Cek Dapur Halal untuk melihat scan sebelumnya
- **Riwayat Cek Bahan Halal** - Klik "Riwayat" di halaman Cek Bahan Halal untuk melihat produk yang sudah dicek
- **Riwayat Dokumen Halal** - Klik "Riwayat" di halaman Dokumen Halal untuk melihat dokumen yang sudah dibuat
- **Riwayat Asisten Halal** - Klik "Riwayat" di halaman Asisten Halal untuk melanjutkan percakapan sebelumnya
- **Riwayat Simulasi Audit Halal** - Klik "Riwayat" di halaman Simulasi Audit Halal untuk melihat sesi sebelumnya

---

## Tech Stack

### Frontend

| Technology                                                   | Version | Purpose            |
| ------------------------------------------------------------ | ------- | ------------------ |
| [React](https://react.dev/)                                  | 19      | UI Library         |
| [TypeScript](https://www.typescriptlang.org/)                | 5.9     | Type Safety        |
| [Tailwind CSS](https://tailwindcss.com/)                     | 4.1     | Styling            |
| [Wouter](https://github.com/molefrog/wouter)                 | 3.9     | Routing            |
| [Motion](https://motion.dev/)                                | 12.23   | Animations         |
| [Lucide React](https://lucide.dev/)                          | 0.562   | Icons              |
| [Rsbuild](https://rsbuild.dev/)                              | 1.6     | Build Tool         |
| [Biome](https://biomejs.dev/)                                | 2.3     | Linter & Formatter |
| [Docx](https://docx.js.org/)                                 | 9.5     | DOCX Generator     |
| [React Markdown](https://github.com/remarkjs/react-markdown) | 10.1    | Markdown Renderer  |

### Backend

| Technology                                         | Version | Purpose                     |
| -------------------------------------------------- | ------- | --------------------------- |
| [Convex](https://convex.dev/)                      | 1.31    | Realtime Backend + Database |
| [@convex-dev/auth](https://labs.convex.dev/auth)   | 0.0.90  | Authentication              |
| [Resend](https://resend.com/)                      | 6.6     | Email (Magic Link)          |
| [OpenAI SDK](https://www.npmjs.com/package/openai) | 6.15    | LLM API Client              |
| [Zod](https://zod.dev/)                            | 4.2     | Schema Validation           |

### AI/ML

| Provider                          | Model             | Purpose               |
| --------------------------------- | ----------------- | --------------------- |
| [Kolosal AI](https://kolosal.ai/) | Claude Sonnet 4.5 | Vision AI             |
| [Kolosal AI](https://kolosal.ai/) | Claude Sonnet 4.5 | Text AI               |
| [Vapi.ai](https://vapi.ai/)       | Realtime Voice AI | Voice Audit Simulator |

### Infrastructure & Tools

| Service        | Purpose                    |
| -------------- | -------------------------- |
| Convex Cloud   | Backend Hosting            |
| Convex Storage | File Upload (Images, PDFs) |
| GitHub         | Version Control            |
| Bun            | Package Manager + Runtime  |

---

## AI Models

Platform ini menggunakan **Kolosal AI** (Claude Sonnet 4.5) dan **Vapi.ai** sebagai provider AI utama:

### Vision AI - Siap Halal & Cek Bahan

```
Model: global.anthropic.claude-sonnet-4-5-20250929-v1:0
Provider: Kolosal AI (OpenAI-compatible API)
Context: 200K tokens
Pricing: $3.0/1M input, $15.0/1M output
```

**Kemampuan:**

- Multimodal (text + images)
- Base64 image encoding untuk kompatibilitas
- Excellent reasoning untuk analisis kehalalan
- OCR built-in untuk membaca label produk
- Structured JSON output

### Text AI - Dokumen & Asisten Halal

```
Model: global.anthropic.claude-sonnet-4-5-20250929-v1:0
Provider: Kolosal AI (OpenAI-compatible API)
Context: 200K tokens
Pricing: $3.0/1M input, $15.0/1M output
```

**Kemampuan:**

- Cost-effective untuk text generation
- Large context window
- Good instruction following
- Structured document output
- Guardrails untuk topik halal

### Voice AI - Audit Suara

```
Provider: Vapi.ai
Model: Realtime Voice AI
Features: Speech-to-Text, Text-to-Speech, Conversational AI
```

**Kemampuan:**

- Real-time voice conversation
- Low latency (\<1s response)
- Natural Indonesian language

---

## Arsitektur

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  React 19 + TypeScript + Tailwind CSS 4.1           │    │
│  │  ├── Landing Page (/)                               │    │
│  │  ├── Auth (/login, /link)                           │    │
│  │  ├── Dashboard (/dashboard/*)                       │    │
│  │  │   ├── Siap Halal (Vision AI)                     │    │
│  │  │   ├── Dokumen Halal (Document Gen)               │    │
│  │  │   ├── Asisten Halal (Chat AI)                    │    │
│  │  │   ├── Cek Bahan (Material Scanner)               │    │
│  │  │   └── Audit Suara (Voice Simulator)              │    │
│  │  └── Admin (/admin/*)                               │    │
│  │      ├── Dashboard (Analytics)                      │    │
│  │      ├── Users (Management)                         │    │
│  │      └── Promo Codes                                │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    CONVEX BACKEND                           │
│  ┌─────────────┬─────────────┬─────────────┬────────────┐   │
│  │  Queries    │  Mutations  │  Actions    │  Crons     │   │
│  │  (realtime) │  (writes)   │  (AI calls) │  (daily)   │   │
│  └─────────────┴─────────────┴─────────────┴────────────┘   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Database Tables:                                   │    │
│  │  users, halal_scans, halal_documents,               │    │
│  │  halal_consultations, material_scans,               │    │
│  │  voice_audit_sessions, user_daily_credits,          │    │
│  │  promo_codes, promo_code_usages                     │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                        │
│  ┌───────────────┬──────────────┬──────────────────────┐    │
│  │ Kolosal AI    │ Vapi.ai      │ Convex Storage       │    │
│  │ (Claude 4.5)  │ (Voice AI)   │ (File Upload)        │    │
│  └───────────────┴──────────────┴──────────────────────┘    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Resend (Email for Magic Link)                        │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) >= 1.0
- [Node.js](https://nodejs.org/) >= 18 (for Convex CLI)
- Akun [Convex](https://convex.dev/)
- API Key LLM

### Installation

```bash
# Clone repository
git clone https://github.com/rokimiftah/SAH-in-Aja.git
cd SAH-in-Aja

# Install dependencies
bun install

# Setup environment variables
cp .env.local.example .env.local
# Edit .env.local dengan API keys Anda

# Run Convex backend (terminal 1)
bun run convex:dev

# Run frontend (terminal 2)
bun dev
```

### Production Build

```bash
# Build frontend
bun run build

# Deploy Convex
bun run convex:deploy
```

---

## Struktur Proyek

```
SAH-in-Aja/
├── src/
│   ├── app/                    # App entry point
│   │   ├── App.tsx             # Main router
│   │   ├── providers.tsx       # Context providers
│   │   └── styles/             # Global styles
│   ├── features/               # Feature modules
│   │   ├── siap-halal/         # Vision AI assessment
│   │   │   ├── components/     # UI components
│   │   │   └── hooks/          # Custom hooks
│   │   ├── dokumen-halal/      # Document generator
│   │   │   ├── components/
│   │   │   └── hooks/
│   │   ├── asisten-halal/      # AI chatbot
│   │   │   ├── components/
│   │   │   └── hooks/
│   │   ├── cek-bahan/          # Material scanner
│   │   │   ├── components/
│   │   │   └── hooks/
│   │   ├── voice-audit/        # Voice simulator
│   │   │   ├── components/
│   │   │   └── hooks/
│   │   └── auth/               # Authentication
│   ├── pages/                  # Page components
│   │   ├── landing/            # Landing page
│   │   ├── dashboard/          # Dashboard pages
│   │   │   ├── DashboardHomePage.tsx
│   │   │   ├── SiapHalalPage.tsx
│   │   │   ├── DokumenHalalPage.tsx
│   │   │   ├── AsistenHalalPage.tsx
│   │   │   ├── CekBahanPage.tsx
│   │   │   ├── VoiceAuditPage.tsx
│   │   │   ├── EditProfilePage.tsx
│   │   │   └── *HistoryPage.tsx (riwayat)
│   │   ├── admin/              # Admin pages
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── UsersPage.tsx
│   │   │   └── PromoCodesPage.tsx
│   │   ├── Auth/               # Login pages
│   │   ├── legal/              # Terms & Privacy
│   │   └── not-found/          # 404 page
│   └── shared/                 # Shared utilities
│       ├── components/         # UI components
│       ├── hooks/              # Shared hooks
│       ├── lib/                # Utilities
│       └── types/              # TypeScript types
├── convex/                     # Backend
│   ├── schema.ts               # Database schema
│   ├── auth.ts                 # Authentication
│   ├── auth.config.ts          # Auth configuration
│   ├── analyzeHalal.ts         # Vision AI action (Siap Halal)
│   ├── analyzeMaterial.ts      # Vision AI action (Cek Bahan)
│   ├── generateDocument.ts     # Document AI action
│   ├── consultHalal.ts         # Chat AI action
│   ├── voiceAudit.ts           # Voice audit mutations
│   ├── credits.ts              # Credit system
│   ├── crons.ts                # Daily credit reset
│   ├── admin.ts                # Admin functions
│   ├── lib/
│   │   ├── llmClient.ts        # LLM client & prompts
│   │   └── magicLink.ts        # Email auth provider
│   └── _generated/             # Auto-generated types
├── public/                     # Static assets
│   ├── favicon.avif
│   ├── logo.avif
│   └── landing/                # Landing page images
├── biome.json                  # Linter config
├── rsbuild.config.ts           # Build configuration
├── tailwind.config.mjs         # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

---

## Sistem Kredit

Platform menggunakan sistem kredit harian untuk mengontrol penggunaan:

### Free Tier (Reset Setiap Hari UTC+7)

| Fitur         | Kredit Harian | Keterangan                    |
| ------------- | ------------- | ----------------------------- |
| Siap Halal    | 3x            | 3 scan foto per hari          |
| Dokumen Halal | 3x            | 3 dokumen per hari            |
| Asisten Halal | 5x            | 5 chat session per hari       |
| Cek Bahan     | 10x           | 10 scan label produk per hari |
| Audit Suara   | 2x            | 2 simulasi wawancara per hari |

### Promo Code

Admin dapat membuat promo code melalui Convex Dashboard untuk memberikan kredit tambahan:

```typescript
// Schema promo_codes
{
  code: string,        // Kode promo (case-sensitive)
  credits: number,     // Kredit yang ditambahkan
  maxUsage: number,    // Maksimal penggunaan
  expiresAt: number,   // Tanggal kadaluarsa
  isActive: boolean,   // Status aktif
}
```

---

## Environment Variables

### Frontend (.env.local)

```env
# Convex
CONVEX_DEPLOYMENT=your_deployment_name
PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key
```

### Backend (Convex Dashboard)

```env
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
CUSTOM_AUTH_SITE_URL=
JWKS=
JWT_PRIVATE_KEY=
LLM_API_KEY=
LLM_API_URL=
LLM_MODEL_TEXT=
LLM_MODEL_VISION=
RESEND_API_KEY=
SITE_URL=
```

---

## Disclaimer

> **SAH-in Aja!** adalah platform **informasi dan panduan**, bukan pengganti profesional atau badan sertifikasi resmi.
>
> Untuk kepastian sertifikasi halal resmi, selalu konsultasikan dengan:
>
> - **BPJPH** (Badan Penyelenggara Jaminan Produk Halal)
> - **LPH** (Lembaga Pemeriksa Halal) terakreditasi
> - **MUI** (Majelis Ulama Indonesia)
>
> Website resmi: [halal.go.id](https://halal.go.id) | Hotline: 1500-363

---

## Kontribusi

Kami sangat terbuka untuk kontribusi dari komunitas! Berikut cara berkontribusi:

### Panduan Kontribusi

1. **Fork** repository ini
2. **Clone** fork Anda:
   ```bash
   git clone https://github.com/rokimiftah/SAH-in-Aja.git
   ```
3. Buat **branch** untuk fitur baru:
   ```bash
   git checkout -b feature/nama-fitur-anda
   ```
4. Commit perubahan Anda:
   ```bash
   git commit -m "feat: tambah fitur X"
   ```
5. Push ke branch Anda:
   ```bash
   git push origin feature/nama-fitur-anda
   ```
6. Buat **Pull Request** ke branch `main`

### Area yang Bisa Dikontribusi

- **Bug fixes** - Perbaikan bug yang Anda temukan
- **New features** - Fitur baru yang bermanfaat untuk UMKM
- **Documentation** - Perbaikan atau tambahan dokumentasi
- **UI/UX improvements** - Peningkatan desain dan pengalaman pengguna
- **Testing** - Tambahkan unit test atau integration test
- **Localization** - Dukungan bahasa daerah (Jawa, Sunda, dll)
- **Analytics** - Insight dan tracking untuk admin

### Commit Convention

Gunakan conventional commits:

- `feat:` - Fitur baru
- `fix:` - Perbaikan bug
- `docs:` - Perubahan dokumentasi
- `style:` - Perubahan formatting (tidak mengubah logika)
- `refactor:` - Refactoring kode
- `test:` - Menambah atau memperbaiki test
- `chore:` - Maintenance (dependencies, build, dll)

### Code Style

- Gunakan **Biome** untuk linting: `bun run lint`
- Gunakan **TypeScript** strict mode
- Ikuti struktur folder yang sudah ada
- Tambahkan komentar untuk logika yang kompleks

---

## License

MIT License - Bebas digunakan untuk kebaikan UMKM Indonesia!

```
Copyright (c) 2025 SAH-in Aja!

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

<div align="center">

### Kami bukan yang mengerjakan untuk Anda.

### Kami yang membantu Anda PAHAM caranya!

---

**Paham Dulu, Baru Usahamu SAH!**

<br>

Made for Indonesian MSMEs

</div>
