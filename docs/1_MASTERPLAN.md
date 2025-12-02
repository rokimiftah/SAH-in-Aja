# MASTERPLAN: SAH-in Aja!

**Title:** SAH-in Aja! - Siap Halal dari Dapur hingga Sertifikat  
**Tagline:** Siap Halal dari Dapur hingga Sertifikat  
**Slogan:** Paham Dulu, Baru Usahamu SAH!  
**Filosofi:** "SAH" = **Siap Audit Halal** (persiapan sertifikasi halal MUI/BPJPH)  
**Target Users:** UMKM Indonesia yang ingin sertifikasi halal, dengan Android jadul, internet lambat  
**Performance Target:** < 1.5s FCP, < 3s TTI on 3G + 2GB RAM device

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Problem Statement](#problem-statement)
3. [Solution Overview](#solution-overview)
4. [Core Features](#core-features)
5. [Technical Architecture](#technical-architecture)
6. [Business Model](#business-model)
7. [Implementation Roadmap](#implementation-roadmap)
8. [Critical Considerations](#critical-considerations)
9. [Prerequisites & Resources](#prerequisites--resources)
10. [Success Metrics](#success-metrics)

---

## 🎯 Executive Summary

**SAH-in Aja!** adalah platform persiapan sertifikasi halal berbasis AI yang membantu UMKM Indonesia siap audit BPJPH/MUI melalui tiga fitur utama:

1. **Siap Halal** (Vision AI) - Assessment kesiapan halal berbasis foto area produksi
2. **Dokumen Halal** (Template Generator) - Generate dokumen wajib SJPH otomatis
3. **Asisten Halal** (Chatbot AI) - Tanya jawab proses sertifikasi halal

**Target:** 30+ juta UMKM Indonesia yang belum memiliki sertifikasi halal.

**Nilai Unik:** AI Vision yang memahami standar SJPH HAS 23000, auto-generate dokumen persyaratan, dan knowledge base BPJPH regulations.

---

## 🔥 Problem Statement

### Pain Points UMKM Indonesia: Halal Certification Barriers

1. **Biaya Pre-Audit Tinggi**
   - Konsultan pre-audit Rp 2-5 juta (sebelum bayar audit resmi)
   - Biaya audit resmi BPJPH/LPH: Rp 2-10 juta
   - Takut gagal audit setelah keluar biaya besar
   - UMKM mikro tidak mampu bayar konsultan

2. **Kompleksitas Standar SJPH HAS 23000**
   - Tidak paham kriteria Sistem Jaminan Produk Halal
   - Standar 11 kategori terlalu teknis untuk dipahami
   - Bahasa regulasi BPJPH sulit dicerna pelaku UMKM
   - Tidak tahu apa yang perlu diperbaiki di dapur/area produksi

3. **Dokumentasi Persyaratan Rumit**
   - Tidak tahu dokumen apa saja yang diperlukan
   - SOP Produksi Halal, Perjanjian Supplier, Traceability terasa ribet
   - Tidak ada template yang mudah digunakan
   - Informasi tercecer di berbagai portal BPJPH/LPH

---

## 💡 Solution Overview

### User Journey: "Ibu Sari" (Pembuat Keripik Pisang Rumahan)

```
┌─────────────────────────────────────────────────────────────┐
│  FASE 1: ASSESSMENT - CEK KESIAPAN HALAL                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Fitur: SIAP HALAL (Vision AI Assessment)             │   │
│  │ Input: 5 foto (dapur, gudang bahan, area produksi)   │   │
│  │ Output: Halal Readiness Score + Findings Detail      │   │
│  │ Result: Score 72/100 - Perlu Perbaikan Minor         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  FASE 2: PERBAIKAN & DOKUMENTASI                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Fitur: ASISTEN HALAL (Chatbot Q&A)                   │   │
│  │ Q: "Skor 72, apa yang harus diperbaiki?"             │   │
│  │ A: "Ganti kecap dengan brand bersertifikat halal...  │   │
│  │     Supplier: PT XYZ (sudah ada sertifikat MUI)"     │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Fitur: DOKUMEN HALAL (Template Generator)            │   │
│  │ Generate: SOP Produksi, Perjanjian Supplier,         │   │
│  │           Daftar Bahan Baku, Traceability            │   │
│  │ Auto-fill dari hasil assessment foto sebelumnya      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  FASE 3: RE-ASSESSMENT & SUBMIT KE BPJPH                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Fitur: SIAP HALAL (Re-Assessment)                    │   │
│  │ Input: Foto area produksi setelah perbaikan          │   │
│  │ Output: Score naik jadi 88/100 - Siap Audit! ✅      │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Fitur: ASISTEN HALAL (Guidance)                      │   │
│  │ Q: "Cara daftar sertifikasi halal ke BPJPH?"         │   │
│  │ A: "1. Buka halal.go.id → 2. Registrasi akun..."     │   │
│  │ Checklist dokumen yang sudah digenerate: ✅ SOP...   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Core Features

### 1. 🎯 SIAP HALAL (Persiapan Sertifikasi Halal MUI)

**Purpose:** Photo-based halal readiness assessment and preparation guidance for MUI certification.

**Why Photos (not video):**

- ✅ 20x lighter upload (1.5MB vs 30MB)
- ✅ Works on old Android devices
- ✅ 4G-friendly (15-30s upload vs 2-3 minutes)
- ✅ Single API call (saves rate limit)
- ✅ Better battery life
- ✅ Simpler UX

#### Key Capabilities:

- **Object Detection:** Detect non-halal items (alcohol bottles, pork products, pets in kitchen)
- **OCR Label Reading:** Read ingredient labels to flag critical materials (gelatin, emulsifier E471)
- **Hygiene Assessment:** Check cleanliness standards (proper storage, waste management, cross-contamination risks)
- **Tiered Scoring:** Different standards for UMK (Mikro) vs Industrial level

#### Technical Flow:

```
User Takes 3-5 Photos (guided)
    ↓
Client-side Compression:
  - Original: 2-3MB per photo
  - Compressed: 200-300KB per photo (quality: 0.7, max: 1024px)
  - Library: browser-image-compression
  - Total: 900KB-1.5MB for all photos
    ↓
Sequential Upload to Convex Storage (not parallel)
  - Upload 1 → Success → Upload 2 → etc.
  - Show progress: "Mengirim foto 1/5... 45%"
    ↓
Convex Action → NVIDIA Llama 4 Maverick Vision
  - Model: llama-4-maverick-17b-128e-instruct
  - Multimodal: Send all 5 photos in single request
  - 1M context window, 128 experts (MoE)
    ↓
System Prompt: "Analyze based on SJPH HAS 23000 criteria..."
    ↓
Streaming Response: Real-time findings
    ↓
Final Output: {
  score: 85,
  findings: [
    { type: "warning", item: "Botol kecap tanpa label halal", location: "Rak atas" },
    { type: "pass", item: "Lantai bersih, tidak ada hewan" }
  ],
  actionItems: ["Ganti kecap dengan merek bersertifikat halal MUI/BPJPH"]
}
    ↓
Cache Results in localStorage (offline capability)
```

#### UX Considerations (Mobile-First):

- **Guided Photo Capture:** Text overlay guides each photo ("Foto 1: Area kompor", "Foto 2: Rak bumbu")
- **Large Touch Targets:** Min 56×56px buttons (easy for older hands)
- **Simple Progress:** "1/5", "2/5" (not percentages)
- **Interactive Verification:** AI bertanya balik jika ragu ("Botol hijau itu isinya apa Bu?")
- **Offline Review:** Past scan results available without internet
- **No Fancy Animations:** Keep UI snappy on old devices

---

### 2. 📄 DOKUMEN HALAL

**Purpose:** Generate dokumen wajib SJPH (Sistem Jaminan Produk Halal) secara otomatis untuk persyaratan sertifikasi halal BPJPH/MUI.

#### Key Capabilities:

- **Template Generator:** 5 jenis dokumen wajib SJPH HAS 23000
- **Auto-fill dari Assessment:** Data dari hasil Siap Halal otomatis mengisi template
- **Customizable Forms:** User dapat edit dan sesuaikan sebelum download
- **PDF Export:** Download dokumen siap print untuk submission ke BPJPH

#### Document Types:

1. **SOP Produksi Halal** - Prosedur standar produksi yang menjamin kehalalan
2. **Perjanjian Supplier Halal** - Komitmen supplier untuk menyediakan bahan halal
3. **Daftar Bahan Baku** - List ingredients dengan status halal dan sumbernya
4. **Form Traceability** - Dokumentasi pelacakan bahan dari supplier ke produk
5. **Surat Komitmen Halal** - Pernyataan komitmen pelaku usaha

#### Technical Flow:

```
User Selects Document Type
    ↓
Load Template + User Business Profile
    ↓
Auto-fill from Previous Assessment:
  - Business name, address, owner
  - Ingredient list from Siap Halal scan
  - Supplier info (if available)
    ↓
Form UI: User reviews & edits
  - Pre-filled fields (editable)
  - Required fields validation
  - Real-time preview
    ↓
Convex Action → NVIDIA GPT-OSS-120B
    ↓
System Prompt: "Generate dokumen SJPH berdasarkan template dan data berikut..."
    ↓
AI Processing:
  - Format sesuai standar BPJPH
  - Generate klausul yang sesuai jenis usaha
  - Validasi kelengkapan dokumen
    ↓
PDF Generation (Server-Side via Convex Action):
  - Uses jsPDF on server (NOT bundled to client)
  - Professional formatting dengan header SAH-in Aja!
  - Returns download URL from Convex Storage
    ↓
Client receives PDF URL → Download/Share button
Watermark: "Dokumen persiapan - Review sebelum submit ke BPJPH"
```

#### UX Considerations:

- **Guided Form:** Step-by-step wizard untuk pengisian data
- **Smart Suggestions:** AI suggest isi berdasarkan jenis usaha
- **Preview Mode:** Lihat hasil dokumen sebelum generate PDF
- **Edit History:** Track perubahan yang dilakukan user

---

### 3. 💬 ASISTEN HALAL (Halal Certification Guide)

**Purpose:** AI chatbot khusus untuk panduan proses sertifikasi halal BPJPH/MUI.

#### Key Capabilities:

- **Halal Knowledge Base:** 500+ FAQs tentang SJPH, BPJPH, LPH, dan proses sertifikasi
- **Assessment-Aware:** Akses hasil Siap Halal untuk memberikan saran spesifik
- **Step-by-Step Guidance:** Panduan detail proses pendaftaran sertifikasi halal
- **Supplier Recommendations:** Database supplier bahan baku bersertifikat halal

#### Technical Flow (Halal-Focused):

```
User Chat Query: "Gimana cara daftar sertifikasi halal ke BPJPH?"
    ↓
Categorization: "halal_certification" (keyword: "sertifikasi", "BPJPH", "halal")
    ↓
Convex Query: Retrieve user profile {
  businessType: "Makanan ringan",
  halalScore: 85,
  assessmentFindings: ["Perlu ganti supplier kecap", "Dokumentasi lengkap"]
}
    ↓
Knowledge Retrieval: Find relevant FAQs from halal knowledge base
    ↓
System Prompt:
  "Anda adalah asisten sertifikasi halal SAH-in Aja!. Knowledge base:
   Q: Cara daftar sertifikasi halal BPJPH?
   A: 1. Buka halal.go.id → 2. Registrasi akun → 3. Lengkapi dokumen SJPH...

   User context: Skor halal 85%, usaha keripik pisang, perlu ganti supplier kecap"
    ↓
NVIDIA GPT-OSS-120B: Generate personalized answer
    ↓
Response: Step-by-step guide + link ke BPJPH + checklist dokumen
```

#### Why This Approach (Hybrid: FAQ + LLM Fallback):

- ✅ **FAQ First:** Pertanyaan umum dijawab dari curated FAQ (high confidence)
- ✅ **LLM Fallback:** Pertanyaan di luar FAQ tetap dijawab LLM + disclaimer
- ✅ **Assessment-Aware:** Jawaban berdasarkan hasil scan Siap Halal user
- ✅ **Actionable:** Setiap jawaban ada next step yang jelas
- ✅ **Official Sources:** Selalu cite sumber resmi (BPJPH, MUI, LPH)
- ⚠️ **Disclaimer:** Jawaban LLM selalu disertai "konsultasi ke LPH untuk kepastian"

#### Response Strategy:

```
Pertanyaan User
    ↓
FAQ Matching (keyword/similarity)
    ├── Match → Jawab dari FAQ (✅ high confidence)
    └── No Match → LLM Answer + Disclaimer (⚠️ medium confidence)
                   "Untuk kepastian, konsultasikan dengan LPH"
```

#### UX Considerations:

- **Assessment Context:** "Berdasarkan hasil scan kemarin, skor Ibu 85%..."
- **Proactive Guidance:** "Ibu tinggal 2 langkah lagi: ganti supplier kecap dan submit dokumen!"
- **Official Links:** Selalu sertakan link ke halal.go.id untuk action items
- **Honest Limitations:** "Untuk konsultasi lebih detail, hubungi LPH terdekat..."

---

## 🏗️ Technical Architecture

### Complete Tech Stack

#### 🎨 Frontend Stack

**Core Framework:**

- **React** `^19.2.0` - UI library with latest concurrent features
- **TypeScript** `^5.9.3` - Type safety and better DX
- **React DOM** `^19.2.0` - DOM rendering

**Build & Development:**

- **Rsbuild** `@rsbuild/core@^1.6.9` - Fast Rspack-based build tool (4x faster than Webpack)
- **@rsbuild/plugin-react** `^1.4.2` - React plugin for Rsbuild
- **HMR Mode** - HMR (Hot Module Replacement) for instant dev feedback

**Routing:**

- \*\*Wouter `^3.0.0` - Minimalist routing (2.1KB)

**Styling & UI:**

- **Tailwind CSS** `^4.0.0` - Utility-first CSS framework
- **@tailwindcss/forms** `^0.5.10` - Better form styles
- **@tailwindcss/typography** `^0.5.16` - Prose styling
- **clsx** `^2.1.1` - Conditional className utility
- **tailwind-merge** `^2.7.0` - Merge Tailwind classes

**UI Components:**

- **shadcn/ui** - Headless, accessible components (on-demand):
  - Installed via CLI: `npx shadcn@latest init`
  - Add components: `npx shadcn@latest add [component]`
  - Built on Radix UI primitives
  - Full React 19 support
  - Tree-shakeable (only bundle what you use)

- **lucide-react** `^0.468.0` - Icon library (tree-shakeable, ~10KB)

**Media Handling:**

- **getUserMedia API** (Native) - Camera access untuk foto (0KB - built into browser)
- **browser-image-compression** `^2.0.2` - Client-side compression (~20KB gzipped)
- **jsPDF** - Server-side PDF generation untuk dokumen halal

**Utilities:**

- **nanoid** `^5.0.9` - ID generation (~1KB)
- **Native APIs:** `navigator.clipboard`, `Intl.DateTimeFormat`, native forms (0KB)

---

#### ⚙️ Backend Stack (Convex)

**Core Platform:**

- **Convex** `^1.18.0` - Backend-as-a-Service
  - Real-time reactive database
  - Serverless functions (queries, mutations, actions)
  - File storage with built-in CDN
  - Scheduled functions (cron)
  - Vector search for RAG
  - Full-stack TypeScript

**Authentication:**

- **convex-auth** `^0.10.0` - Auth library
  - Phone OTP
  - Email magic link
  - Session management

**Database Tables:**

```typescript
(users, halal_scans, halal_documents, halal_consultations, transactions, halal_knowledge_base);
```

**File Storage:**

- Photo uploads (JPEG, PNG, WebP) - untuk Siap Halal assessment
- Generated PDFs - untuk Dokumen Halal templates
- Auto-CDN delivery

**Server Functions:**

- **Actions:** HTTP-like functions for AI API calls
- **Queries:** Real-time reactive data reads
- **Mutations:** Transactional data writes
- **Scheduled:** Cron jobs for analytics

---

#### 🤖 AI/ML Stack

**Provider 1: NVIDIA Build (40 RPM - Strict)**

**Vision AI - Siap Halal:**

- **Llama 4 Maverick 17B 128E Instruct** (FREE - 40 rpm)
  - Model ID: `meta-llama/llama-4-maverick-17b-128e-instruct`
  - Architecture: 17B active params, 128 experts MoE (400B total)
  - Context: 1M tokens
  - Capabilities: Native multimodal (text + images), tool use, JSON mode
  - Performance: Beats GPT-4o on multimodal benchmarks, ELO 1417
  - Rate Limit: 40 RPM (shared with text AI)
  - API: OpenAI-compatible via build.nvidia.com
  - **Why Maverick > Llama 3.2 90B Vision:**
    - ✅ Newer (April 2025 vs Sept 2024)
    - ✅ Better performance (beats GPT-4o)
    - ✅ Larger context (1M vs 128K)
    - ✅ More efficient (MoE architecture)

**Text AI - Dokumen Halal + Asisten Halal:**

- **GPT-OSS-120B** (FREE - 40 rpm, shared with vision)
  - Model ID: `openai/gpt-oss-120b`
  - Architecture: 116.8B total, 5.1B active (MoE)
  - Context: 128K tokens
  - Training: RL from OpenAI o3, o4 (state-of-the-art reasoning)
  - Capabilities: Strong legal drafting, tool use, structured output
  - Performance: Near o4-mini on reasoning benchmarks
  - License: Apache 2.0 (fully open)
  - **Why GPT-OSS-120B:**
    - ✅ Best reasoning (trained by OpenAI)
    - ✅ Excellent instruction following
    - ✅ Strong structured output (JSON, function calling)
    - ✅ Perfect for legal contracts

**Rate Limit Management:**

```
NVIDIA (40 RPM strict):
- Siap Halal: 1 scan = 1 API call (multimodal batch)
  → Testing: ~5-10 scans/day = 0.08-0.16 RPM average
- Dokumen Halal: 1 document template = 1 API call
  → Testing: ~3-5 per day = 0.05 RPM average
- Asisten Halal: 1 chat = 1 API call
  → Testing: ~10-20 per day = 0.16 RPM average
TOTAL: ~0.3 RPM average (massive headroom!)

Conclusion: Rate limits are NON-ISSUE for development!
```

**Knowledge Base Strategy:**

- **NO Vector Embeddings/RAG** (Simplified approach)
- **Smart Hardcoding:** 30-50 curated FAQs with categorization
- **Simple String Matching:** Keyword-based retrieval (fast, reliable)
- Saves 8+ hours of implementation time

**AI SDKs:**

- **openai** `^4.0.0` - For NVIDIA API (OpenAI-compatible)

---

#### 🚀 Infrastructure & Deployment

**Frontend Hosting:**

- **Self-Hosted VPS + GitHub Actions**
  - Automatic deployment via GitHub Actions
  - Cloudflare CDN
  - SSL via Cloudflare or Let's Encrypt
  - Branch-based deployments
  - Environment variables

**Backend Platform:**

- **Convex Self-Hosted (Docker)**
  - Docker Compose deployment on VPS
  - Manual scaling (vertical or horizontal)
  - Rolling updates via Docker
  - Monitoring via Docker logs + custom tools

**CDN:**

- **Cloudflare CDN** - All static assets
- **Cloudflare R2** (optional) - File storage

**Domain:**

- Custom domain: `sahin.biz.id`
- **Cloudflare DNS + CDN**

---

#### 🔐 Security & Auth

**Authentication:**

- **Convex Auth** - Email (via Resend) / Phone OTP / Google OAuth
  - **Resend** - Email provider for OTP and magic links
  - **Google OAuth** - Social authentication
- JWT tokens
- Session management

**Rate Limiting:**

- 10 photo scans/hour per user
- 100 requests/day per IP
- Convex built-in rate limiter

**Security:**

- Auto-blur faces (client-side)
- Data retention: 30 days
- HTTPS enforced
- CORS policy

---

#### 💳 Payment Integration (Optional)

**Gateway:**

- **Xendit** `^4.2.0` - Indonesian payments
  - E-wallet (Gopay, OVO, Dana)
  - Bank transfer
  - Credit card
- **Midtrans** (Alternative)

---

#### 🧪 Development Tools

**Code Quality:**

- **Biome** `@biomejs/biome@^2.3.7` - Linter + Formatter
- **Prettier** `^3.6.2` - Code formatter
  - `@ianvs/prettier-plugin-sort-imports` `^4.7.0`
  - `prettier-plugin-tailwindcss` `^0.7.1`

**Type Checking:**

- **TypeScript** `tsc --noEmit`

**Testing (Optional):**

- **Vitest** `^2.1.8` - Unit testing
- **@testing-library/react** `^16.1.0` - Component testing
- **Playwright** `^1.49.1` - E2E testing

**Package Manager:**

- **Bun** `1.1.38+` - Fast runtime & package manager
- Alternative: npm, pnpm

**Version Control:**

- **Git** `2.39.5+`
- **GitHub** - Repository

---

#### 📦 Complete Dependencies (Ultra-Lean for Old Devices)

**Performance Budget:** Total bundle < 200KB gzipped for initial load

```json
{
  "dependencies": {
    // CORE (Essential - ~50KB)
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "wouter": "^3.0.0", // ~2KB

    // BACKEND (~100KB)
    "convex": "^1.18.0",

    // AI SDKs (~140KB total)

    // EMAIL (~30KB)
    "resend": "^4.0.1", // ✅ Email provider for auth
    "@auth/core": "^0.37.2", // ✅ Auth providers (Google OAuth, etc)
    "openai": "^4.0.0", // ~80KB (NVIDIA API)

    // UI - ESSENTIAL ONLY (~10KB total)
    "clsx": "^2.1.1", // ~1KB ✅ Keep (conditional classnames)
    "lucide-react": "^0.468.0", // Tree-shakeable ✅ Keep

    // MEDIA (~20KB)
    "browser-image-compression": "^2.0.2", // ✅ Critical for 3G

    // UTILITIES (MINIMAL)
    "nanoid": "^5.0.9" // ~1KB ✅ Keep (ID generation)

    // ❌ REMOVED (Too heavy for old devices):
    // "@radix-ui/*" - 200KB+ → Use native HTML instead!
    // "framer-motion" - 180KB → Not needed for MVP
    // "@react-pdf/renderer" - 500KB+ → Generate PDF on server
    // "react-hook-form" - 40KB → Use native forms
    // "zod" - 60KB → Simple validation only
    // "date-fns" - 200KB → Use native Intl.DateTimeFormat
    // "react-markdown" - 80KB → Plain text only
    // "copy-to-clipboard" - 5KB → Use native navigator.clipboard
    // "tailwind-merge" - 10KB → Careful class management instead
    // "@tailwindcss/forms" - 20KB → Custom form styles
    // "@tailwindcss/typography" - 30KB → Not needed

    // TOTAL PRODUCTION DEPS: 9 packages
    // Estimated: ~250KB minified → ~80-90KB gzipped (realistic!)
  },
  "devDependencies": {
    // BUILD TOOLS
    "@rsbuild/core": "^1.6.9",
    "@rsbuild/plugin-react": "^1.4.2",

    // STYLING
    "tailwindcss": "^4.1.17", // ✅ Latest stable (purged to ~15-20KB)

    // TYPESCRIPT
    "typescript": "^5.9.3",
    "@types/react": "^19.2.7",
    "@types/react-dom": "^19.2.3",
    "@types/node": "^22.10.2",

    // CODE QUALITY (Fast linter)
    "@biomejs/biome": "^2.3.7", // Replaces ESLint + Prettier

    // PWA
    "@aaroon/workbox-rspack-plugin": "^0.20.0" // Service worker generation

    // TESTING (Optional - Low priority for MVP)
    // "vitest": "^2.1.8",
    // "@testing-library/react": "^16.1.0"
  }
}
```

**Bundle Size Breakdown (Realistic Estimates):**

```
Initial Load (First Visit):
├── HTML: 10KB (inline critical CSS)
├── CSS: 15-20KB (purged Tailwind 4)
├── JS (React 19 + React DOM): ~40KB gzipped (core framework)
├── JS (Wouter): ~1KB gzipped (tiny router!)
├── JS (App Shell + Utils): ~10-15KB gzipped
└── TOTAL INITIAL: ~75-85KB gzipped ✅

Lazy Loaded Per Feature:
├── Convex SDK: ~30KB gzipped (lazy loaded on first interaction)
├── Siap Halal Module: ~45KB gzipped
│   ├── Camera logic: ~10KB
│   ├── Image compression: ~20KB
│   ├── OpenAI client: ~15KB
├── Dokumen Halal Module: ~30KB gzipped
│   ├── Template Form UI: ~15KB
│   ├── PDF Generator (server): 0KB client
│   ├── Document Preview: ~15KB
├── Asisten Halal Module: ~25KB gzipped
    ├── Chat UI: ~10KB
    ├── OpenAI client (shared): 0KB (already loaded)
    └── FAQ logic: ~15KB

TOTAL WITH ALL FEATURES LOADED: ~200-210KB gzipped
Still under 250KB target! ✅

Performance on 3G (Target Device):
├── Initial HTML + CSS: < 1 second (25KB)
├── Initial JS (App Shell): 1-2 seconds (75KB)
├── Time to Interactive: < 3 seconds ✅
├── Feature Load (on demand): +1-2 seconds
└── Total to Full Interactivity: < 5 seconds ✅
```

---

#### 🌐 External APIs & Services

| Service                       | Purpose                           | Pricing   | Rate Limit                |
| ----------------------------- | --------------------------------- | --------- | ------------------------- |
| **NVIDIA - Llama 4 Maverick** | Vision AI (Siap Halal)            | ✅ FREE   | 40 RPM (shared)           |
| **NVIDIA - GPT-OSS-120B**     | Text AI (Dokumen Halal + Asisten) | ✅ FREE   | 40 RPM (shared)           |
| **jsPDF (Server)**            | PDF generation for documents      | ✅ FREE   | Server-side only          |
| **Convex Cloud**              | Backend + Database + Storage      | ✅ FREE   | 1GB, 1M actions/mo        |
| **Cloudflare**                | CDN + DNS + R2 Storage            | ✅ FREE   | 100GB R2, unlimited CDN   |
| **Total Development Cost**    | All APIs                          | **$0.00** | Non-issue for development |

---

#### 📱 Target Platform & Device Reality

**Primary Target (90% of users):**

- **Device:** Samsung A03, Xiaomi Redmi 9A, Oppo A16
- **RAM:** 2-3GB (Android Go possible)
- **CPU:** MediaTek Helio P22, Snapdragon 450 (4 tahun lalu)
- **Screen:** 720×1600 HD+ (not FHD)
- **Browser:** Chrome 110-120 (not latest!)
- **Android:** 11-12
- **Network:** 3G/4G (frequently drops to 3G)
- **Speed:** 0.5-2 Mbps real-world
- **Latency:** 200-500ms
- **Data Quota:** 1-2GB/month (must be frugal!)

**Secondary Target:**

- Desktop Web (Chrome, Firefox, Edge 120+)
- Modern smartphones (testing/demo)

**Critical Success Metrics:**

```
Performance on 3G + Old Android (Non-Negotiable):
├── First Contentful Paint: < 1.5s
├── Time to Interactive: < 3s
├── Button tap response: < 100ms
├── Photo upload (5 photos): < 30s
├── Total bundle: < 200KB gzipped
├── No jank/lag on 2GB RAM device
└── Works smoothly without crashes

User Experience (Must Pass "Ibu-Ibu Warung" Test):
├── Can use without instructions
├── All text in simple Bahasa Indonesia
├── Touch targets: All >= 56×56px
├── High contrast (no gray text on white)
├── No complex gestures (just tap and scroll)
└── Feels like WhatsApp (familiar patterns)
```

---

#### 🌐 PWA (Progressive Web App) Requirements

**Why PWA for UMKM:**

- ✅ No need to download from Play Store (saves data quota)
- ✅ Offline capability (review past scans without internet)
- ✅ Add to Home Screen (feels like native app)
- ✅ Push notifications (remind to complete halal cert)
- ✅ Background sync (upload when network improves)

**Implementation Checklist:**

```json
// manifest.json
{
  "name": "SAH-in Aja! - Asisten Halal & Legal UMKM",
  "short_name": "SAH-in Aja!",
  "description": "Siap Halal dari Dapur hingga Sertifikat - Platform Persiapan Sertifikasi Halal BPJPH/MUI",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#16a34a", // Green (halal theme)
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "categories": ["business", "productivity", "food"],
  "lang": "id-ID",
  "dir": "ltr"
}
```

**Service Worker Strategy:**

```typescript
// Network-first for API calls (always fresh data)
// Cache-first for static assets (fast load)
// Offline fallback (show cached results)

const CACHE_NAME = "sahinaja-v1";

// iOS Safari PWA Limitations (be aware!)
const isIOSSafari = /iPhone|iPad|iPod/.test(navigator.userAgent) && !window.MSStream;

if (isIOSSafari) {
  // Limitations on iOS Safari:
  // 1. Service Worker cache limit: ~50MB (vs unlimited on Chrome)
  // 2. No background sync
  // 3. No push notifications (unless installed to Home Screen)
  // 4. IndexedDB storage may be cleared after 7 days of inactivity
  // 5. Must be installed to Home Screen for full PWA features

  console.warn("iOS Safari detected: Limited PWA capabilities");
}
const STATIC_ASSETS = [
  "/",
  "/offline.html", // Fallback page
  "/icon-192.png",
  // Critical assets only (< 1MB total)
];

// Cache static assets on install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }),
  );
});

// Network-first, fallback to cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
        }
        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(event.request).then((cached) => {
          return cached || caches.match("/offline.html");
        });
      }),
  );
});
```

**Install Prompt:**

```typescript
// Show "Add to Home Screen" prompt after successful scan
let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  // Show custom install button after user completes first scan
  if (userCompletedFirstScan) {
    showInstallPrompt();
  }
});

function showInstallPrompt() {
  // Custom UI: "Install SAH-in Aja untuk akses lebih cepat!"
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === "accepted") {
      // Track installation
      analytics.track("pwa_installed");
    }
    deferredPrompt = null;
  });
}
```

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (React App)                      │
│  ┌──────────────┐  ┌─────────────────┐  ┌───────────────┐   │
│  │ Siap Halal   │  │ Dokumen Halal   │  │ Asisten Halal │   │
│  │ (Photo UI)   │  │ (Form UI)       │  │ (Chat UI)     │   │
│  └──────┬───────┘  └───────┬─────────┘  └─────┬─────────┘   │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          │ Photos Upload    │ Form Data        │ Text Query
          ↓                  ↓                  ↓
┌─────────────────────────────────────────────────────────────┐
│                    CONVEX BACKEND                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  ACTIONS (Server Functions)                          │   │
│  │  • analyzeKitchen(photoUrls)                         │   │
│  │  • generateHalalDocument(templateType, formData)     │   │
│  │  • consultHalal(query, userId)                       │   │
│  └────────────────────┬─────────────────────────────────┘   │
│                       │                                     │
│  ┌────────────────────┴─────────────────────────────────┐   │
│  │  MIDDLEWARE                                          │   │
│  │  • Check user credits                                │   │
│  │  • Rate limiting                                     │   │
│  │  • Audit logging                                     │   │
│  └──────────────────────┬───────────────────────────────┘   │
└─────────────────────────┼───────────────────────────────────┘
                          │
                          ↓
              ┌──────────────────────┐
              │ NVIDIA API           │
              │ (Vision + Text Gen)  │
              └──────────────────────┘
```

### Database Schema (Convex)

```typescript
// users table
{
  _id: Id<"users">,
  phone: string,
  name: string,
  businessName: string,
  businessType: string, // KBLI code
  credits: number, // Koin SAH
  tier: "free" | "eceran" | "juragan",
  createdAt: number,
}

// scans table (Siap Halal history)
{
  _id: Id<"scans">,
  userId: Id<"users">,
  type: "halal_lens",
  photoUrls: string[], // Array of Convex storage URLs
  findings: Array<{
    type: "pass" | "warning" | "critical",
    item: string,
    location: string,
    confidence: number,
  }>,
  score: number, // 0-100
  creditsUsed: 1,
  createdAt: number,
}

// halal_documents table (Dokumen Halal history)
{
  _id: Id<"halal_documents">,
  userId: Id<"users">,
  templateType: "sop_produksi" | "perjanjian_supplier" | "daftar_bahan" | "traceability" | "komitmen_halal",
  businessInfo: {
    name: string,
    address: string,
    owner: string,
    productType: string,
  },
  ingredients: Array<{ name: string, supplier: string, halalStatus: string }>,
  generatedContent: string, // AI-generated document content
  pdfUrl: string, // Convex storage URL
  creditsUsed: 2,
  createdAt: number,
}

// halal_consultations table (Asisten Halal history)
{
  _id: Id<"consultations">,
  userId: Id<"users">,
  messages: Array<{
    role: "user" | "assistant",
    content: string,
    timestamp: number,
  }>,
  topic: string, // "NIB", "PIRT", "Halal Cert", etc.
  resolved: boolean,
  createdAt: number,
}
```

---

## 💰 Business Model

### Revenue Streams

#### 1. Tier "Subsidi" (Freemium)

- **Price:** Rp 0
- **Quota:**
  - 3x Siap Halal/bulan
  - 1x Dokumen Halal/bulan
  - Unlimited chat konsultasi
- **Funding Source:** Government CSR, hackathon prize, investor subsidy
- **Goal:** Acquisition & data collection

#### 2. Tier "Eceran" (Pay-As-You-Go)

- **Price:** Rp 10.000 = 5 Koin SAH
- **Usage:**
  - 1 Koin = 1x Siap Halal
  - 2 Koin = 1x Dokumen Halal (PDF download)
  - 0 Koin = Chat (unlimited)
- **Target:** 80% of users (casual usage)
- **Payment:** Transfer bank, e-wallet (Gopay/OVO/Dana via Xendit)

#### 3. Tier "Juragan" (Subscription)

- **Price:** Rp 99.000/bulan
- **Quota:**
  - 50x Siap Halal
  - 20x Dokumen Halal
  - Priority support
  - Advanced analytics dashboard
- **Target:** Catering businesses, suppliers, aggregators

### Unit Economics (Rough Estimate)

```
Cost per Request:
- Siap Halal: ~$0.05 (NVIDIA Llama 4 Maverick) = Rp 750
- Dokumen Halal: ~$0.05 (Template generation) = Rp 750
- Chat Konsultasi: ~$0.01 (GPT-OSS-120B) = Rp 150

Revenue per Koin: Rp 2.000 (Rp 10k / 5 koin)

Margin:
- Lensa (1 koin): Rp 2.000 - Rp 750 = Rp 1.250 (62% margin)
- Dokumen Halal (2 koin): Rp 4.000 - Rp 750 = Rp 3.250 (81% margin)
```

**Break-even:** ~500 paying users with avg 3 transactions/month

---

## 🗓️ Implementation Roadmap

**Timeline: 1-7 Desember 2025** (7 hari fokus)

**Development Philosophy:**

- Work 8 hours/day MAX (sustainable pace, avoid burnout)
- Use AI coding assistants aggressively (Cursor, GitHub Copilot)
- Build one feature at a time (ship working code daily)
- Test on real mobile devices (not just browser devtools)

---

### **HARI 1 (1 Desember 2025): FOUNDATION & PROMPT ENGINEERING** (12 hours)

**Strategy: Parallel work - Setup + Testing sekaligus**

#### **Pagi (6h): Setup & Architecture + API Testing**

**Checklist:**

- [x] ✅ Project setup complete (Rsbuild + React + TypeScript)
- [ ] Install ALL dependencies:
  ```bash
  bun add wouter convex openai resend @auth/core clsx lucide-react browser-image-compression nanoid
  bun add -D tailwindcss @biomejs/biome @aaroon/workbox-rspack-plugin
  ```
- [ ] Initialize Convex + define schema (users, scans, contracts, consultations, roadmaps, reminders)
- [ ] Setup Wouter routes + base layout
- [ ] Setup environment variables (.env.local)
- [ ] Create folder structure (src/features/, convex/actions/, docs/prompts/)

#### **Siang (6h): Prompt Engineering & API Testing**

**Test Vision AI (NVIDIA Llama 4 Maverick):**

- [ ] Create NVIDIA API client helper (OpenAI-compatible):

  ```typescript
  import OpenAI from "openai";

  const nvidia = new OpenAI({
    apiKey: process.env.NVIDIA_API_KEY,
    baseURL: "https://integrate.api.nvidia.com/v1",
  });
  ```

- [ ] Find 10-15 test kitchen photos + test vision prompt
- [ ] Test legal contract generation (GPT-OSS-120B)
- [ ] Test consultation Q&A (GPT-OSS-120B)
- [ ] Document all prompts in `docs/prompts/`
- [ ] **Build FAQ Knowledge Base:**
  ```json
  // docs/knowledge-base/faqs.json
  {
    "halal": [
      { "q": "Berapa lama proses sertifikasi halal?", "a": "...", "source": "..." }
      // 10 total halal FAQs
    ],
    "business": [
      { "q": "Cara daftar NIB untuk usaha makanan?", "a": "...", "source": "..." }
      // 10 total business FAQs
    ],
    "legal": [
      { "q": "Syarat sah perjanjian?", "a": "...", "source": "..." }
      // 10 total legal FAQs
    ]
  }
  ```

---

---

### **HARI 2-3 (2-3 Desember 2025): SIAP HALAL CORE + ENHANCEMENTS** (16 hours)

#### **Hari 2 (8h): Photo Capture, Compression & AI Analysis**

**Fokus: Siap Halal Core (Camera → Compression → AI → Results)**

- [ ] Build `PhotoCapture.tsx` component with iOS Safari compatibility:

  ```typescript
  // iOS Safari camera input (doesn't fully respect "environment" attribute)
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <input
      type="file"
      accept="image/*"
      capture={isIOS ? undefined : "environment"}  // iOS: let user choose camera
      multiple={false}
      onChange={handlePhotoCapture}
    />
  );
  ```

  - Use `<input type="file" accept="image/*" capture="environment">` for Android (works great!)
  - iOS Safari: Remove `capture` attribute (let user choose front/back camera manually)
  - Alternative: `navigator.mediaDevices.getUserMedia()` for advanced control (heavier)
  - Guided photo capture: "Foto 1/5: Area kompor", "Foto 2/5: Rak bumbu", etc.
  - Show preview thumbnail after each photo
  - Large shutter button (min 80×80px)
  - Responsive for mobile

- [ ] Implement client-side compression:

  ```typescript
  import imageCompression from "browser-image-compression";

  async function compressPhoto(file: File) {
    const options = {
      maxSizeMB: 0.3, // Target: 300KB per photo
      maxWidthOrHeight: 1024, // Good enough for OCR + detection
      useWebWorker: true, // Don't block UI
      quality: 0.7, // Balance size vs quality
    };

    const compressed = await imageCompression(file, options);
    // Original: 2-3MB → Compressed: 200-300KB ✅
    return compressed;
  }
  ```

**Afternoon (4h):**

- [ ] Sequential upload to Convex Storage (3G-friendly):
  ```typescript
  // NOT parallel! Upload one by one for 3G bandwidth
  for (let i = 0; i < photos.length; i++) {
    const compressed = await compressPhoto(photos[i]);
    const url = await uploadToConvex(compressed);
    updateProgress(i + 1, photos.length); // "Mengirim foto 2/5..."
    photoUrls.push(url);
  }
  ```
- [ ] Build progress indicator UI:
  - "Mengompresi foto... 1/5"
  - "Mengirim foto 2/5... 45%" (show bytes uploaded)
  - "Menganalisis dengan AI..."
  - Simple progress bar (no fancy animations)

- [ ] Create Convex action: `convex/actions/analyzeKitchen.ts`

  ```typescript
  import OpenAI from "openai";

  const nvidia = new OpenAI({
    apiKey: process.env.NVIDIA_API_KEY,
    baseURL: "https://integrate.api.nvidia.com/v1",
  });

  export const analyzeKitchen = action({
    args: { photoUrls: v.array(v.string()), userId: v.id("users") },
    handler: async (ctx, args) => {
      // Single API call with all 5 photos! (multimodal batch)
      const messages = [
        {
          role: "system",
          content: `Anda adalah auditor kehalalan untuk UMKM Indonesia...
          [SJPH HAS 23000 criteria here]`,
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Analisis dapur ini untuk kehalalan:" },
            ...args.photoUrls.map((url) => ({
              type: "image_url",
              image_url: { url },
            })),
          ],
        },
      ];

      const response = await nvidia.chat.completions.create({
        model: "meta-llama/llama-4-maverick-17b-128e-instruct",
        messages,
        temperature: 0.3, // More deterministic for compliance
        max_tokens: 2000,
        stream: true, // Stream findings in real-time
      });

      // Stream + parse structured findings
      // Calculate score (0-100)
      // Save to database
      // Return results
    },
  });
  ```

- [ ] Implement streaming response (show findings as they appear)
- [ ] Test with 10+ kitchen photo sets (diverse cases)

- [ ] Design results UI (score badge, findings list, action items)
- [ ] Add "Interactive Verification" if AI uncertain
- [ ] Error handling + loading states

---

#### **Hari 3 (8h): Siap Halal Polish + 3 Enhancement Features**

**Checklist:**

- [ ] Error handling + retry logic (camera, network, API)
- [ ] Mobile optimization (test on real device)
- [ ] Offline capability (localStorage cache)
- [ ] Scan history (offline-first)

**Siang (4h): 3 Enhancement Features (dari FEATURE_IMPLEMENTATION_GUIDE.md)**

- [ ] **Feature 1: Progress Tracking** (1.5h)
  - Update schema: add `previousScanId`, `improvement` fields
  - Query: `getProgressHistory` with line chart data
  - UI: Line chart component showing score over time
- [ ] **Feature 2: Cost Estimation** (1.5h)
  - Create `COST_ESTIMATES` database (replacements, equipment, services)
  - Function: `calculateCostEstimate(findings)` → budget breakdown
  - UI: Cost breakdown table with total estimate
- [ ] **Feature 3: Share Results** (1h)
  - Function: Generate canvas image (1200x630 OG image with score)
  - WhatsApp share button: `wa.me/?text=...` with image
  - Social media share (copy link + preview)

---

### **HARI 4 (4 Desember 2025): DOKUMEN HALAL** (10 hours)

#### **Pagi (5h): Template Selection & Form UI**

- [ ] Build template selection UI (`src/features/dokumen-halal/TemplateSelector.tsx`):

  ```typescript
  const HALAL_TEMPLATES = [
    { id: "sop_produksi", name: "SOP Produksi Halal", icon: "📋" },
    { id: "perjanjian_supplier", name: "Perjanjian Supplier Halal", icon: "🤝" },
    { id: "daftar_bahan", name: "Daftar Bahan Baku", icon: "📝" },
    { id: "traceability", name: "Form Traceability", icon: "🔍" },
    { id: "komitmen_halal", name: "Surat Komitmen Halal", icon: "✅" },
  ];
  ```

  - Card-based selection dengan icon dan deskripsi singkat
  - Highlight dokumen yang paling penting (SOP Produksi)
  - Show progress: "3/5 dokumen selesai"

- [ ] Build form wizard (`src/features/dokumen-halal/DocumentForm.tsx`):

  ```typescript
  // Step 1: Business Info (auto-fill dari profile)
  const businessInfoFields = [
    { name: "businessName", label: "Nama Usaha", required: true },
    { name: "ownerName", label: "Nama Pemilik", required: true },
    { name: "address", label: "Alamat Usaha", required: true },
    { name: "productType", label: "Jenis Produk", required: true },
  ];

  // Step 2: Ingredient List (auto-fill dari Siap Halal scan)
  const ingredientFields = [
    {
      name: "ingredients",
      type: "array",
      fields: [
        { name: "name", label: "Nama Bahan" },
        { name: "supplier", label: "Supplier" },
        { name: "halalStatus", label: "Status Halal" },
      ],
    },
  ];

  // Step 3: Review & Generate
  ```

  - Multi-step wizard dengan progress indicator
  - Auto-fill dari user profile dan hasil assessment Siap Halal
  - Validation untuk required fields
  - Real-time preview di sidebar (mobile: bottom sheet)

- [ ] Query Convex untuk auto-fill:
  ```typescript
  // Ambil data dari assessment terakhir
  const latestScan = useQuery(api.scans.getLatest, { userId });
  const userProfile = useQuery(api.users.getProfile, { userId });
  ```

#### **Siang (5h): AI Document Generation & PDF Export**

- [ ] Build Convex action: `convex/actions/generateHalalDocument.ts`

  ```typescript
  import OpenAI from "openai";

  const nvidia = new OpenAI({
    apiKey: process.env.NVIDIA_API_KEY,
    baseURL: "https://integrate.api.nvidia.com/v1",
  });

  export const generateHalalDocument = action({
    args: {
      templateType: v.string(),
      businessInfo: v.object({...}),
      ingredients: v.array(v.object({...})),
    },
    handler: async (ctx, args) => {
      const response = await nvidia.chat.completions.create({
        model: "openai/gpt-oss-120b",
        messages: [
          {
            role: "system",
            content: `Anda adalah asisten pembuat dokumen SJPH. Generate dokumen ${args.templateType}
            sesuai standar BPJPH HAS 23000. Format output dalam bahasa Indonesia formal.`,
          },
          {
            role: "user",
            content: JSON.stringify(args),
          },
        ],
        temperature: 0.3,
      });

      return response.choices[0].message.content;
    },
  });
  ```

- [ ] Create SJPH document templates:

  ```typescript
  // convex/lib/halal-templates.ts (Server-side)
  - SOP Produksi Halal (prosedur pemilihan bahan, proses produksi, penyimpanan)
  - Perjanjian Supplier Halal (komitmen supplier menyediakan bahan halal)
  - Daftar Bahan Baku (list lengkap ingredients dengan sertifikat halal)
  - Form Traceability (tracking bahan dari supplier ke produk jadi)
  - Surat Komitmen Halal (pernyataan komitmen pelaku usaha)
  ```

- [ ] Implement PDF generation SERVER-SIDE (Convex Action):

  ```typescript
  // convex/actions/generatePDF.ts
  import { jsPDF } from "jspdf";

  export const generateHalalPDF = action({
    handler: async (ctx, { documentContent, templateType }) => {
      const doc = new jsPDF();

      // Header dengan logo SAH-in Aja!
      doc.setFontSize(14);
      doc.text("DOKUMEN SJPH - SAH-in Aja!", 20, 20);

      // Content dari AI generation
      doc.setFontSize(12);
      doc.text(documentContent, 20, 40);

      // Footer disclaimer
      doc.setFontSize(8);
      doc.text("Dokumen ini dibuat dengan bantuan AI. Review sebelum submit ke BPJPH.", 20, 280);

      const pdfBuffer = doc.output("arraybuffer");
      const storageId = await ctx.storage.store(new Blob([pdfBuffer], { type: "application/pdf" }));
      return await ctx.storage.getUrl(storageId);
    },
  });
  ```

- [ ] Build document preview & download UI:
  - Preview generated content sebelum PDF
  - Edit content jika perlu (textarea)
  - Generate PDF button → loading state → download
  - Share to WhatsApp button
  - Save to document history

---

### **HARI 5 (5 Desember 2025): ASISTEN HALAL + ROADMAP** (10 hours)

#### **Pagi-Siang (6h): Chat UI + FAQ System + Learning Roadmap**

- [ ] Build chat UI (`src/features/mentor-bisnis/Chat.tsx`):
  - Message list (user + assistant)
  - Auto-scroll to bottom
  - Input field with auto-resize textarea
  - Suggested questions (chips): "Cara urus NIB?", "Syarat PIRT?", etc.
  - Typing indicator when AI is thinking
  - Markdown rendering for responses

- [ ] Implement smart FAQ system (load FAQs, categorize, find similar, call GPT, stream)
- [ ] Add "Out of scope" handling

#### **Sore (4h): Feature 5 - Learning Roadmap Generator**

- [ ] **Learning Roadmap** (from FEATURE_IMPLEMENTATION_GUIDE_PART2.md)
  - Update schema: add `roadmaps` table (steps, status, requirements, progress)
  - Query: `generateRoadmap` based on user state (halal score, contracts, consultations)
  - Build roadmap algorithm (5 steps: Halal → Legal → NIB → PIRT → Brand)
  - UI: Roadmap component with step cards, progress bar, unlock requirements
- [ ] Test with different user states (new user, partial completion, advanced)

---

### **HARI 6 (6 Desember 2025): DASHBOARD + EXPERT ESCALATION** (10 hours)

#### **Pagi (4h): Feature 6 - Expert Escalation System**

- [ ] **Expert Escalation** (from FEATURE_IMPLEMENTATION_GUIDE_PART2.md)
  - Update `consultWithAI` to return confidence score
  - If confidence < 0.7 → trigger escalation UI
  - Create `expertContacts` table (specialists with WhatsApp numbers)
  - Query: `getExpertOptions` by category
  - UI: ExpertEscalation component (community forum option + expert cards)
  - WhatsApp integration: `wa.me/{number}?text=...`
- [ ] Test with low-confidence questions

#### **Siang-Sore (6h): Feature 7 - Unified Dashboard + Integration**

- [ ] **Unified Dashboard** (from FEATURE_IMPLEMENTATION_GUIDE_PART2.md)
  - Query: `getDashboardData` aggregating ALL features (scans, contracts, consultations, roadmap)
  - Calculate completion score algorithm (Halal 40%, Legal 30%, Consultations 30%)
  - Generate smart recommendations based on user state
  - UI: Dashboard page with progress card + 3 feature cards + recommendations
- [ ] Test dashboard with different user profiles
- [ ] Cross-feature integration testing (data flows between features)

  ```typescript
  // rsbuild.config.ts
  import { GenerateSW } from "@aaroon/workbox-rspack-plugin";
  import { defineConfig } from "@rsbuild/core";
  import { pluginReact } from "@rsbuild/plugin-react";

  export default defineConfig({
    plugins: [pluginReact()],
    tools: {
      rspack: {
        plugins: [
          new GenerateSW({
            clientsClaim: true,
            skipWaiting: true,
            runtimeCaching: [
              {
                urlPattern: /^https:\/\/.*\.convex\.cloud.*/i,
                handler: "NetworkFirst",
                options: {
                  cacheName: "convex-api-cache",
                  expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 86400,
                  },
                },
              },
            ],
          }),
        ],
      },
    },
  });
  ```

- [ ] Add install prompt (use template from MASTERPLAN)
- [ ] Test PWA installation on Android device

**Afternoon (4h) - Final Integration & Testing:**

- [ ] Connect all features via navigation:
  - Dashboard page (overview of user status)
  - Bottom nav bar (icons + labels)
  - No complex transitions (too heavy)
- [ ] Cross-feature context (simple):
  - Mentor can reference Siap Halal score
  - Show latest scan result in dashboard
- [ ] Final bug sweep on REAL OLD DEVICE:
  - Test every button and link
  - Test all error states
  - Test offline mode (airplane mode)
  - Test 3G throttling (Chrome DevTools)
  - Check memory usage (Chrome Task Manager)
- [ ] Performance optimization:
  - Lazy load routes: `React.lazy(() => import('./features/LensaDapur'))`
  - Remove all `console.log()`
  - Purge Tailwind CSS (should auto-purge)
  - Check bundle size: `bun run build` and verify < 200KB gzipped
- [ ] Basic accessibility:
  - All buttons have labels
  - High contrast colors
  - Touch targets ≥ 56×56px
  - Simple keyboard nav (tab through forms)

---

### **HARI 7 (7 Desember 2025): REMINDERS + PWA + POLISH + DEPLOY** (12 hours)

#### **Pagi (4h): Feature 8 - Smart Reminders + PWA Setup**

- [ ] **Smart Reminders System** (from FEATURE_IMPLEMENTATION_GUIDE_PART2.md)
  - Update schema: add `reminders` table (type, trigger date, status)
  - Create Convex cron jobs (`convex/crons.ts`):
    - Hourly: `sendDueReminders`
    - Daily: `checkContractExpiries`, `checkRescanRecommendations`
  - UI: ReminderBanner component on dashboard
- [ ] PWA Implementation:
  - Create `manifest.json` + generate icons (192×192, 512×512)
  - Setup Service Worker with `@aaroon/workbox-rspack-plugin`

#### **Siang (4h): End-to-end Testing + Polish**

- [ ] Final testing (full flow on real devices, 3G simulation)
- [ ] Performance audit (Lighthouse 90+, bundle < 100KB)
- [ ] UI polish (alignment, spacing, error states)
- [ ] Fix any blocking bugs

#### **Sore (4h): Demo Prep + Deploy**

- [ ] **Record demo video (3 minutes)** - showing all 3 features + 8 enhancements
- [ ] Create presentation deck (10-12 slides):
  1. Title + Team
  2. Problem (statistics + pain points)
  3. Solution overview (3 features diagram)
  4. Demo video (embedded or link)
  5. Technical architecture (simplified)
  6. Tech stack highlights
  7. Business model (freemium + pay-as-you-go)
  8. Market size (30M UMKM)
  9. Impact projection (users, revenue, social)
  10. Roadmap (post-MVP features)
  11. Thank you + QR code to try app
- [ ] Deploy to production:
  - `bun run build`
  - Deploy to VPS via GitHub Actions
  - Deploy Convex backend
  - Test deployed version thoroughly
  - Create short link: sahin.biz.id
  - Generate QR code
- [ ] Practice presentation (5-7 minutes)

---

### **BUFFER TIME:**

- Days 3-9: Built-in buffer in each day (8h planned, can extend to 10h if needed)
- Day 10 evening: Final polish and contingency

---

### **DAILY MILESTONES (Definition of Done):**

- **Hari 1 (1 Des):** ✅ Can run app locally, Convex connected, all APIs tested, FAQs ready
- **Hari 2 (2 Des):** ✅ Siap Halal core working (Camera → AI Analysis → Results)
- **Hari 3 (3 Des):** ✅ Siap Halal polished + 3 enhancements (Progress, Cost, Share)
- **Hari 4 (4 Des):** ✅ Dokumen Halal working (Template → Auto-fill → PDF) + Data Verification
- **Hari 5 (5 Des):** ✅ Asisten Halal working + Halal Certification Action Plan generated
- **Hari 6 (6 Des):** ✅ Expert Escalation working + Unified Dashboard aggregating all data
- **Hari 7 (7 Des):** ✅ Smart Reminders + PWA working + Demo ready + Deployed to production

---

## ⚠️ Critical Considerations

### 1. Halusinasi & Tanggung Jawab Hukum

**Risk:** AI salah mendeteksi bahan haram atau membuat kontrak merugikan.  
**Mitigation:**

- Positioning: "Pre-Audit Tools" bukan "Pengganti Auditor"
- Watermark: "Draf AI - konsultasikan ahli sebelum tanda tangan"
- Confidence Score: Tampilkan "AI ragu, mohon verifikasi manual"

### 2. Latency & User Experience

**Risk:** Processing photos/audio lama, user pikir app hang.  
**Mitigation:**

- Optimistic UI: Show loading progress per stage
- Streaming: Display results incrementally (not all at once)
- Client-side processing: Photo compression, audio compression before upload

### 3. Bahasa Daerah & Konteks Lokal

**Risk:** AI tidak mengerti konteks lokal (istilah daerah, jenis usaha lokal).  
**Mitigation:**

- System Prompt: "Expert in Indonesian UMKM context..."
- Knowledge base: Include local food terms, traditional business types
- Demo: Show understanding of local context (juri akan terkesan!)

### 4. Privasi Data

**Risk:** UMKM takut data dicuri/diaudit pajak.  
**Mitigation:**

- Auto-blur faces in Siap Halal photos (if needed)
- Clear privacy policy: "Data hanya untuk AI processing, not stored permanently"
- Local processing option: Photo compression on device

### 5. Ambiguitas Visual

**Risk:** Botol kecap diisi arak, AI tertipu.  
**Mitigation:**

- Interactive Verification: AI bertanya "Botol X isinya apa?"
- Multi-angle: "Mohon foto label dari dekat"

### 6. Materai Digital & Legal Validity

**Risk:** Kontrak PDF tidak sah tanpa materai.  
**Mitigation:**

- PDF template includes materai placeholder box
- Footer note: "Tempel materai Rp 10.000 sebelum tanda tangan"

### 7. Audio Quality & Speaker Diarization

**Risk:** Suara tumpang tindih, salah identifikasi pembicara.  
**Mitigation:**

- Sound Check: User intro diri untuk voice anchor
- Fallback: If diarization fails, ask user to label speakers manually

### 8. Bias Ekonomi & Standar Kebersihan

**Risk:** AI terlalu ketat, warung kecil selalu gagal.  
**Mitigation:**

- Tiered Scoring: "Level UMK (Mikro)" vs "Level Industri"
- Toleransi visual: Tembok kusam OK, tapi kontaminasi hewan TIDAK OK

### 9. Ketergantungan Token & Biaya

**Risk:** Upload photo batch = ribuan token = mahal.  
**Mitigation:**

- Photo compression: 5 photos @ 200-300KB each
- Audio transcription first: Cheaper than sending raw audio to LLM
- Model selection: Use cheaper models for non-critical tasks (GPT-OSS-120B for chat)

### 10. Skalabilitas & Abuse Prevention

**Risk:** User spam scan 100x/hari untuk iseng.  
**Mitigation:**

- Rate limiting: Max 10 requests/hour per user
- Credits system: Must have balance to use
- CAPTCHA: On suspicious activity patterns

---

## 📚 Prerequisites & Resources

### Knowledge Base (RAG Documents)

#### 1. Halal Documents (Dokumen Halal)

- **KUHPerdata:** Pasal 1320 (syarat sah perjanjian), Pasal 1338 (asas kebebasan)
- **UU ITE No. 11/2008:** Kekuatan hukum dokumen elektronik
- **Contract Templates:**
  - Surat Perjanjian Sewa Menyewa (5 templates)
  - Perjanjian Konsinyasi (3 templates)
  - Perjanjian Utang-Piutang (3 templates)
  - Perjanjian Kerjasama Suplai (2 templates)
- **Source:** [hukumonline.com](https://www.hukumonline.com), Perpustakaan Cyber Hukum

#### 2. Halal Compliance (Siap Halal)

- **SJPH HAS 23000:** 11 Kriteria Sistem Jaminan Halal
  1. Kebijakan Halal
  2. Tim Manajemen Halal
  3. Pelatihan dan Edukasi
  4. Bahan (Material)
  5. Produk (Product)
  6. Fasilitas Produksi (Production Facility)
  7. Prosedur Tertulis Aktivitas Kritis (Written Procedure)
  8. Kemampuan Telusur (Traceability)
  9. Penanganan Produk Tidak Sesuai Kriteria (Handling of Non-conforming Product)
  10. Audit Internal (Internal Audit)
  11. Kaji Ulang Manajemen (Management Review)
- **Critical Materials List:**
  - Gelatin (babi/sapi/ikan)
  - Emulsifier: E471, E481, E482
  - Shortening, Margarin (lemak hewani)
  - Whey, Kasein (dairy)
  - Alkohol (etanol, wine, sake, mirin)
  - Enzim (animal-derived)
- **Visual Dataset:** 50+ labeled images (halal kitchen, non-halal items, ambiguous cases)
- **Source:** [halalmui.org](https://www.halalmui.org), BPJPH, LPPOM MUI

#### 3. Business Regulation (Micro-Consultant)

- **OSS RBA (Online Single Submission):**
  - NIB registration flow
  - KBLI codes for food businesses (10791, 10792, 10793)
  - Risk matrix (Rendah, Menengah, Tinggi)
- **PIRT (Pangan Industri Rumah Tangga):** Requirements for home food businesses
- **Brand/Label Registration:** BPOM process
- **Tax:** PKP (Pengusaha Kena Pajak) threshold
- **Source:** [oss.go.id](https://oss.go.id), [pirt.kemkes.go.id](https://pirt.kemkes.go.id), [bpom.go.id](https://www.pom.go.id)

### Demo Materials

#### Dummy Data to Prepare:

1. **Document Generation (Dokumen Halal):**
   - 2-3 minute negotiation between "Bu Sari" and "Pak Budi"
   - Mix Bahasa Indonesia + Javanese dialect
   - Clear terms: price (50 ribu/tandan), quantity (10 tandan), delivery (setiap Selasa), payment (tempo 1 minggu)

2. **Photo Collection (Siap Halal):**
   - Take 5 guided photos of kitchen areas
   - Include "issues": visible in photos, botol tanpa label, jarak sampah terlalu dekat
   - Also include "good" elements: lantai bersih, alat masak tertata

3. **Chat Queries (Asisten Halal):**
   - "Gimana cara urus NIB untuk usaha keripik pisang?"
   - "Syarat PIRT apa saja?"
   - "Bedanya sertifikat halal MUI lama dan BPJPH baru?"
   - "Daerah Tebet lagi trend jualan apa?"
   - "Apa yang kurang dari hasil scan dapur saya?"

### Developer Tools

- **Convex Dashboard:** [convex.dev](https://convex.dev)
- **NVIDIA Build:** [build.nvidia.com](https://build.nvidia.com)
- **jsPDF:** [github.com/parallax/jsPDF](https://github.com/parallax/jsPDF)
- **BPJPH Portal:** [halal.go.id](https://halal.go.id)

---

## 📊 Success Metrics

### Judging Criteria (All Weighted 100%)

**Requirements:** Full working demo of all 3 features

1. **Innovation (100%):**
   - ✅ Multimodal AI (vision + text) in one unified app
   - ✅ Solves 3 interconnected problems (legal + halal + consultation)
   - ✅ Indonesian context-aware (dialects, local regulations, cultural nuances)
   - ✅ API usage (democratizing AI for UMKM)
   - ✅ Novel approach: Smart FAQ instead of complex RAG (pragmatic innovation)

2. **Impact (100%):**
   - ✅ TAM: 30M+ UMKM in Indonesia (massive market)
   - ✅ Direct alignment with government programs (SJPH, OSS digitalization)
   - ✅ True inclusivity: Low literacy (voice input), low income (free tier), low tech (works on 3G)
   - ✅ Social impact: Levels playing field between large corporations and home businesses
   - ✅ Measurable outcomes: X% reduction in failed halal audits, Y% increase in formalized contracts

3. **Technical Execution (100%):**
   - ✅ All 3 features fully functional (not mocks)
   - ✅ Real AI processing (NVIDIA Build: Llama 4 Maverick + GPT-OSS-120B)
   - ✅ Production-ready: Error handling, edge cases, mobile-optimized
   - ✅ Smart architecture: Simplified RAG for realistic hackathon scope
   - ✅ Code quality: TypeScript, proper structure, maintainable
   - ✅ Performance: Fast load times, optimistic UI, good UX

4. **Business Viability (100%):**
   - ✅ Clear revenue model (freemium → pay-as-you-go → subscription)
   - ✅ Positive unit economics (62% margin, sustainable)
   - ✅ Realistic GTM: Partner with UMKM communities, cooperatives, government programs
   - ✅ Scalable tech stack (serverless Convex, pay-per-use APIs)
   - ✅ Defensibility: Domain expertise + localized data + trust

5. **Presentation (100%):**
   - ✅ Compelling storytelling (Bu Sari's journey)
   - ✅ Professional demo video (3 min, polished, emotional hook)
   - ✅ Clear slides (problem → solution → demo → business → impact)
   - ✅ Confident delivery (practice makes perfect)
   - ✅ Interactive element (QR code for judges to try)

---

### Demo Strategy: Recorded Video (Risk-Free)

**Why Recorded:**

- ✅ Zero technical glitches (Murphy's Law proof)
- ✅ Perfect timing and pacing
- ✅ Professional editing (captions, music, transitions)
- ✅ Can show "perfect case" without network latency
- ✅ Backup: Live app available via QR code for judges to explore

**Video Structure (3 minutes):**

```
[00:00-00:20] HOOK - Problem Statement
  - Black screen with text: "85% UMKM Indonesia tidak punya kontrak tertulis"
  - Fade to Bu Sari in her kitchen (intro)
  - Quick cuts showing her 3 struggles

[00:20-00:40] SOLUTION - Introduce SAH-in Aja
  - Logo animation
  - "3 fitur. 1 aplikasi. 0 biaya."
  - Show app dashboard

[00:40-01:20] DEMO 1 - Siap Halal
  - Bu Sari takes kitchen photos (show screen recording)
  - AI analyzes (show loading stages)
  - Results appear: Score 75/100, findings list
  - Reaction shot: "Ohh... jadi ini yang kurang!"

[01:20-02:00] DEMO 2 - Dokumen Halal
  - Bu Sari pilih template "SOP Produksi Halal"
  - Form auto-fill dari hasil assessment
  - AI generate dokumen SJPH
  - PDF preview & download
  - Reaction: "Gampang banget!"

[02:00-02:40] DEMO 3 - Asisten Halal
  - Bu Sari asks: "Gimana cara daftar sertifikasi halal?"
  - Chat interface, AI typing
  - Answer with step-by-step guide ke BPJPH
  - Action button: "Buka halal.go.id"

[02:40-03:00] IMPACT - Call to Action
  - Text overlay: "30 juta UMKM menunggu solusi ini"
  - Show QR code: "Coba sendiri: sahin.biz.id"
  - Logo + Tagline + Slogan: "SAH-in Aja! - Siap Halal dari Dapur hingga Sertifikat - Paham Dulu, Baru Usahamu SAH!"
```

---

### Presentation Deck Structure (10-12 slides)

1. **Title Slide**
   - SAH-in Aja! logo
   - Title: "SAH-in Aja! - Asisten Halal & Legal UMKM"
   - Tagline: "Siap Halal dari Dapur hingga Sertifikat"
   - Slogan: "Paham Dulu, Baru Usahamu SAH!"

2. **Problem Slide**
   - 3 pain points with statistics
   - Photos of real UMKM struggles
   - Emotional hook: "Meet Bu Sari..."

3. **Solution Overview**
   - 3 features diagram (icons + one-liners)
   - "Multimodal AI: Lihat, Dengar, Bantu"

4. **Demo Video** (3 min)
   - Full-screen video
   - Or embedded if presenting virtually

5. **How It Works - Siap Halal**
   - Screenshot of photo analysis
   - Brief tech explanation (NVIDIA Llama 4 Maverick)

6. **How It Works - Dokumen Halal**
   - Screenshot of contract PDF
   - Brief tech explanation (Web Speech + NVIDIA NIM)

7. **How It Works - Asisten Halal**
   - Screenshot of chat interface
   - Explain smart FAQ approach (honest about no full RAG)

8. **Tech Stack Highlight**
   - Logos: NVIDIA Build, Convex, Cloudflare
   - Cost: $0.00 for development

9. **Business Model**
   - 3 tiers diagram (Subsidi, Eceran, Juragan)
   - Unit economics: 62% margin
   - Break-even: 500 users

10. **Market & Impact**
    - TAM: 30M UMKM
    - Government alignment (SJPH, OSS programs)
    - Social impact metrics

11. **Roadmap**
    - "What's Next" (post-MVP features)
    - Partnerships (MUI, BPJPH, Kemenkop)
    - Scaling plan

12. **Thank You + CTA**
    - Big QR code: "Try it now!"
    - Contact info
    - "Questions?"

---

## 🎯 Next Steps

### Immediate Actions (TODAY):

1. ✅ **Get API Keys:**
   - [ ] NVIDIA Build API: https://build.nvidia.com (Free 40 RPM - vision + text)
   - [ ] BPJPH Portal: https://halal.go.id (Reference for SJPH requirements)
   - [ ] Save in .env.local

2. ✅ **Install Dependencies:**

   ```bash
   bun add wouter convex openai resend @auth/core clsx lucide-react browser-image-compression nanoid
   bun add -D tailwindcss @biomejs/biome @aaroon/workbox-rspack-plugin
   ```

3. ✅ **Initialize Convex:**

   ```bash
   npx convex init
   npx convex dev
   ```

4. ✅ **Test APIs:**
   - [ ] Test NVIDIA Llama 4 Maverick with sample photos
   - [ ] Test NVIDIA NIM with sample text
   - [ ] Verify rate limits work

5. ✅ **Create Project Structure:**
   - [ ] Follow folder structure from Day 1 plan
   - [ ] Setup TypeScript paths for clean imports
   - [ ] Configure Tailwind CSS

---

### Decision Log

**Major Architecture Decisions:**

- ✅ **Photo-based ONLY (NO video support)** for Siap Halal: 20x lighter, works on old devices, 3G-friendly
- ✅ **Single provider**: NVIDIA (vision + text) for simplicity
- ✅ **Ultra-lean bundle**: Cut heavy libs (Radix, Framer, react-pdf), < 200KB gzipped
- ✅ **PWA-first**: Offline capability, Add to Home Screen, feels native
- ✅ **Performance-first**: Target 3G + 2GB RAM devices explicitly

**AI Model Choices:**

- ✅ **Llama 4 Maverick 17B 128E** for vision (beats GPT-4o, 1M context, MoE efficient)
- ✅ **GPT-OSS-120B** for text (OpenAI RL trained, best reasoning for document generation)

**Simplifications (Time-Saving):**

- ❌ No vector embeddings/RAG (saves 8+ hours) → Smart FAQ matching
- ❌ No heavy UI libraries (saves 200KB+) → Native HTML + Tailwind
- ❌ No client-side PDF generation (saves 500KB) → Server-side or simple text
- ❌ No real payment integration (mock with localStorage)
- ❌ No complex auth (phone login not essential for demo)
- ❌ No fancy animations (laggy on old devices)

**Performance Optimizations:**

- ✅ Sequential photo upload (not parallel) for 3G bandwidth
- ✅ Client-side compression: 2-3MB → 200-300KB per photo
- ✅ Lazy loading: Each feature loads only when needed
- ✅ Critical CSS inline: < 1.5s First Contentful Paint
- ✅ Service Worker caching: Offline-capable

**Target User Reality Check:**

- ✅ Device: Samsung A03, Redmi 9A (2-3GB RAM, 4-year old CPU)
- ✅ Network: 3G/4G that drops to 3G (0.5-2 Mbps real-world)
- ✅ Literacy: Low-tech, expects "gampang kayak WhatsApp"
- ✅ Language: Simple Bahasa Indonesia (no jargon)
- ✅ Touch targets: Min 56×56px (easy for older hands)

---
