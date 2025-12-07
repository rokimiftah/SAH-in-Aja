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

[Demo](https://sahin.biz.id) | [Dokumentasi](./docs/) | [Hackathon IMPHNEN x Kolosal.ai](https://kolosal.ai/)

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
- [Screenshots](#screenshots)
- [Dokumentasi](#dokumentasi)
- [Tim](#tim)
- [Disclaimer](#disclaimer)
- [License](#license)

---

## Tentang Proyek

**SAH-in Aja!** adalah platform berbasis AI yang membantu UMKM Indonesia mempersiapkan sertifikasi halal BPJPH/MUI. Platform ini menyediakan:

- **Assessment otomatis** kesiapan halal melalui foto area produksi
- **Generator dokumen SJPH** (Sistem Jaminan Produk Halal) otomatis
- **Konsultasi AI 24/7** seputar proses sertifikasi halal

### Filosofi Nama

- **SAH** = **S**iap **A**udit **H**alal
- **in** = Teknologi digital (modern, online)
- **Aja** = Casual, friendly, tidak intimidating
- **!** = Empowering, confident, action-oriented

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
<td width="33%" valign="top">

### Siap Halal

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
<td width="33%" valign="top">

### Dokumen Halal

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
<td width="33%" valign="top">

### Asisten Halal

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
</tr>
</table>

---

## Cara Penggunaan

### 1. Registrasi dan Login

1. Buka website [sahin.biz.id](https://sahin.biz.id)
2. Klik tombol "Mulai Sekarang" atau "Masuk"
3. Pilih metode login:
   - **Google OAuth** - Login dengan akun Google
   - **GitHub OAuth** - Login dengan akun GitHub
   - **Magic Link** - Masukkan email, klik link yang dikirim ke inbox
4. Setelah login, Anda akan diarahkan ke Dashboard

### 2. Menggunakan Siap Halal (Vision AI Assessment)

Fitur ini menganalisis foto area produksi/dapur Anda untuk menilai kesiapan sertifikasi halal.

**Langkah-langkah:**

1. Dari Dashboard, klik menu **"Siap Halal"**
2. Klik tombol **"Mulai Scan Baru"**
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

### 3. Menggunakan Dokumen Halal (AI Document Generator)

Fitur ini membuat dokumen SJPH (Sistem Jaminan Produk Halal) secara otomatis.

**Langkah-langkah:**

1. Dari Dashboard, klik menu **"Dokumen Halal"**
2. Pilih jenis dokumen yang ingin dibuat:
   - **SOP Produksi Halal** - Prosedur standar produksi
   - **Perjanjian Supplier Halal** - Kontrak dengan supplier
   - **Daftar Bahan Baku** - List bahan dengan status halal
   - **Form Traceability** - Pelacakan bahan dari supplier
   - **Surat Komitmen Halal** - Pernyataan komitmen pemilik
3. Isi informasi usaha:
   - Nama usaha
   - Alamat
   - Nama pemilik
   - Jenis produk
4. Tambahkan daftar bahan baku (nama, supplier, status halal)
5. Klik **"Generate Dokumen"**
6. Preview dokumen yang dihasilkan
7. Klik **"Download DOCX"** untuk mengunduh

**Jenis dokumen yang tersedia:**

| Dokumen             | Kegunaan                                                     |
| ------------------- | ------------------------------------------------------------ |
| SOP Produksi Halal  | Prosedur operasional standar untuk menjamin kehalalan produk |
| Perjanjian Supplier | Kontrak komitmen supplier menyediakan bahan halal            |
| Daftar Bahan Baku   | Inventaris bahan dengan sertifikat halal masing-masing       |
| Form Traceability   | Dokumentasi pelacakan bahan dari supplier ke produk jadi     |
| Surat Komitmen      | Pernyataan resmi komitmen menjaga kehalalan                  |

### 4. Menggunakan Asisten Halal (AI Chatbot)

Fitur ini menjawab pertanyaan seputar sertifikasi halal 24/7.

**Langkah-langkah:**

1. Dari Dashboard, klik menu **"Asisten Halal"**
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

### 5. Melihat Riwayat

Setiap fitur menyimpan riwayat penggunaan:

- **Riwayat Siap Halal** - Klik "Riwayat" di halaman Siap Halal untuk melihat scan sebelumnya
- **Riwayat Dokumen** - Klik "Riwayat" di halaman Dokumen Halal untuk melihat dokumen yang sudah dibuat
- **Riwayat Chat** - Klik "Riwayat" di halaman Asisten Halal untuk melanjutkan percakapan sebelumnya

### 6. Mengelola Profil

1. Klik ikon profil di pojok kanan atas
2. Pilih **"Edit Profil"**
3. Lengkapi informasi:
   - Nama lengkap
   - Nama usaha
   - Jenis usaha
   - Alamat
4. Klik **"Simpan"**

Informasi profil akan otomatis digunakan saat membuat dokumen.

---

## Tech Stack

### Frontend

| Technology                                    | Version | Purpose     |
| --------------------------------------------- | ------- | ----------- |
| [React](https://react.dev/)                   | 19      | UI Library  |
| [TypeScript](https://www.typescriptlang.org/) | 5.9     | Type Safety |
| [Tailwind CSS](https://tailwindcss.com/)      | 4.0     | Styling     |
| [Wouter](https://github.com/molefrog/wouter)  | 3.x     | Routing     |
| [Motion](https://motion.dev/)                 | 12.x    | Animations  |
| [Lucide React](https://lucide.dev/)           | -       | Icons       |
| [Rsbuild](https://rsbuild.dev/)               | -       | Build Tool  |

### Backend

| Technology                                       | Purpose                     |
| ------------------------------------------------ | --------------------------- |
| [Convex](https://convex.dev/)                    | Realtime Backend + Database |
| [@convex-dev/auth](https://labs.convex.dev/auth) | Authentication              |
| [Resend](https://resend.com/)                    | Email (Magic Link)          |

### AI/ML

| Provider                       | Model             | Purpose                     |
| ------------------------------ | ----------------- | --------------------------- |
| [Kolosal](https://kolosal.ai/) | Claude Sonnet 4.5 | Vision AI (Siap Halal)      |
| [Kolosal](https://kolosal.ai/) | Claude Sonnet 4.5 | Text AI (Dokumen & Asisten) |

### Infrastructure

| Service        | Purpose                    |
| -------------- | -------------------------- |
| VPS + Docker   | Self-hosted Convex Backend |
| GitHub Actions | CI/CD Deployment           |
| Cloudflare     | CDN + DNS                  |

---

## AI Models

Platform ini menggunakan **Kolosal API** sebagai provider AI utama:

### Vision AI - Siap Halal

```
Model: global.anthropic.claude-sonnet-4-5-20250929-v1:0
Context: 200K tokens
Pricing: $3.0/1M input, $15.0/1M output
```

**Kemampuan:**

- Multimodal (text + images)
- Base64 image encoding untuk kompatibilitas
- Excellent reasoning untuk analisis kehalalan
- Structured JSON output

### Text AI - Dokumen & Asisten Halal

```
Model: global.anthropic.claude-sonnet-4-5-20250929-v1:0
Context: 200K tokens
Pricing: $3.0/1M input, $15.0/1M output
```

**Kemampuan:**

- Cost-effective untuk text generation
- Large context window
- Good instruction following
- Structured document output

### Alternative Models (Available on Kolosal)

| Model         | Context | Price (in/out per 1M) | Use Case             |
| ------------- | ------- | --------------------- | -------------------- |
| Qwen 3 VL 30B | 262K    | $0.3 / $1.0           | Vision (budget)      |
| Kimi K2       | 262K    | $0.6 / $2.5           | Text (large context) |
| GLM 4.6       | 200K    | $0.6 / $2.2           | Text (alternative)   |
| MiniMax M2    | 204K    | $0.3 / $1.2           | Text (alternative)   |

> **Note:** Selama development menggunakan NVIDIA API (build.nvidia.com) karena memiliki free credits untuk testing. Kolosal API digunakan untuk production/demo.

---

## Arsitektur

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  React 19 + TypeScript + Tailwind CSS 4             │    │
│  │  ├── Landing Page (/)                               │    │
│  │  ├── Auth (/login, /link)                           │    │
│  │  └── Dashboard (/dashboard/*)                       │    │
│  │      ├── Siap Halal (Vision AI)                     │    │
│  │      ├── Dokumen Halal (Document Gen)               │    │
│  │      └── Asisten Halal (Chat AI)                    │    │
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
│  │  halal_consultations, user_daily_credits,           │    │
│  │  promo_codes, promo_code_usages                     │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                        │
│  ┌──────────────┬──────────────┬──────────────────────┐     │
│  │ Kolosal API  │ Resend       │ Convex Storage       │     │
│  │ (AI Models)  │ (Email)      │ (File Upload)        │     │
│  └──────────────┴──────────────┴──────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) >= 1.0
- [Node.js](https://nodejs.org/) >= 18 (for Convex CLI)
- Akun [Convex](https://convex.dev/)
- API Key [Kolosal](https://kolosal.ai/)

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
│   │   └── auth/               # Authentication
│   ├── pages/                  # Page components
│   │   ├── landing/            # Landing page
│   │   ├── dashboard/          # Dashboard pages
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
│   ├── analyzeHalal.ts         # Vision AI action
│   ├── generateDocument.ts     # Document AI action
│   ├── consultHalal.ts         # Chat AI action
│   ├── credits.ts              # Credit system
│   ├── lib/
│   │   └── kolosal.ts          # AI client & prompts
│   └── _generated/             # Auto-generated types
├── docs/                       # Documentation (20K+ lines)
│   ├── 0_BRANDING_GUIDE.md
│   ├── 1_MASTERPLAN.md
│   ├── 2_SIAP_HALAL_COMPLETE_PLAN.md
│   ├── 3_DOKUMEN_HALAL_COMPLETE_PLAN.md
│   ├── 4_ASISTEN_HALAL_COMPLETE_PLAN.md
│   └── 5_DESIGN_SYSTEM.md
├── public/                     # Static assets
├── docker/                     # Docker configs
└── biome.json                  # Linter config
```

---

## Sistem Kredit

Platform menggunakan sistem kredit harian untuk mengontrol penggunaan:

### Free Tier (Reset Setiap Hari UTC+7)

| Fitur         | Kredit Harian | Keterangan              |
| ------------- | ------------- | ----------------------- |
| Siap Halal    | 3x            | 3 scan foto per hari    |
| Dokumen Halal | 3x            | 3 dokumen per hari      |
| Asisten Halal | 5x            | 5 chat session per hari |

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
```

### Backend (Convex Dashboard)

```env
# Authentication
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret
JWKS=your_jwks_json
JWT_PRIVATE_KEY=your_jwt_private_key
SITE_URL=https://sahin.biz.id

# AI Provider
KOLOSAL_API_KEY=kol__your_api_key

# Email (Optional)
RESEND_API_KEY=re_your_api_key
```

---

## Screenshots

### Landing Page

![Landing](https://cdn.sahin.biz.id/landing.png)

### Dashboard

![Dashboard](https://cdn.sahin.biz.id/dashboard.png)

### Siap Halal - Vision AI Assessment

![Siap Halal](https://cdn.sahin.biz.id/siap-halal.png)

### Dokumen Halal - AI Document Generator

![Dokumen Halal](https://cdn.sahin.biz.id/dokumen-halal.png)

### Asisten Halal - AI Chatbot

![Asisten Halal](https://cdn.sahin.biz.id/asisten-halal.png)

---

## Dokumentasi

Proyek ini dilengkapi dengan **20,000+ baris** dokumentasi teknis:

| Dokumen                                                     | Konten                                   | Lines  |
| ----------------------------------------------------------- | ---------------------------------------- | ------ |
| [Branding Guide](docs/0_BRANDING_GUIDE.md)                  | Brand identity, messaging, tone of voice | 800+   |
| [Masterplan](docs/1_MASTERPLAN.md)                          | Architecture, roadmap, business model    | 2,000+ |
| [Siap Halal Plan](docs/2_SIAP_HALAL_COMPLETE_PLAN.md)       | Complete implementation guide            | 4,600+ |
| [Dokumen Halal Plan](docs/3_DOKUMEN_HALAL_COMPLETE_PLAN.md) | Document generator specs                 | 6,700+ |
| [Asisten Halal Plan](docs/4_ASISTEN_HALAL_COMPLETE_PLAN.md) | Chatbot implementation                   | 4,100+ |
| [Design System](docs/5_DESIGN_SYSTEM.md)                    | UI/UX guidelines                         | 1,500+ |
| [Deployment Guide](docker/README.md)                        | Docker self-host & Convex managed setup  | 300+   |

---

## Optimasi Mobile

Platform dioptimasi untuk device low-end yang umum digunakan UMKM Indonesia:

### Target Device

```
Device: Samsung A03, Xiaomi Redmi 9A, Oppo A16
├── RAM: 2-3GB
├── CPU: MediaTek Helio P22 / Snapdragon 450
├── Network: 3G/4G (0.5-2 Mbps)
├── Browser: Chrome 110+
└── Android: 11-12
```

---

## Tim

**Hackathon IMPHNEN x Kolosal.ai 2025**

| Name                      | Role                           |
| ------------------------- | ------------------------------ |
| **Roki Miftah Kamaludin** | Bagian Nyengir, Dimarahin Mulu |
| **Indah Prabadewi**       | Market Analyst, QA, Supporter  |

---

## Disclaimer

> **SAH-in Aja!** adalah platform **informasi dan panduan**, bukan pengganti profesional atau badan sertifikasi resmi.
>
> - **Siap Halal** = Assessment **persiapan**, bukan sertifikasi resmi BPJPH/MUI
> - **Dokumen Halal** = **Draft** dokumen, perlu review oleh profesional
> - **Asisten Halal** = **Panduan umum**, bukan nasihat hukum
>
> Untuk kepastian sertifikasi halal resmi, selalu konsultasikan dengan:
>
> - **BPJPH** (Badan Penyelenggara Jaminan Produk Halal)
> - **LPH** (Lembaga Pemeriksa Halal) terakreditasi
> - **MUI** (Majelis Ulama Indonesia)
>
> Website resmi: [halal.go.id](https://halal.go.id) | Hotline: 1500-363

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

Made with love for Indonesian MSMEs

**Hackathon IMPHNEN x Kolosal.ai 2025**

</div>
