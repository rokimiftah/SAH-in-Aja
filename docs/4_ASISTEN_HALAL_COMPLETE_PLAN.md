# 💬 ASISTEN HALAL - COMPLETE IMPLEMENTATION PLAN

## 📌 Document Information

- **Feature**: Asisten Halal (Halal Certification Assistant AI)
- **Version**: 3.0.0 (Full Halal Certification Focus)
- **Author**: SAH-in Aja! Development Team
- **Status**: Planning Phase

**NOTE**: This document focuses **exclusively** on halal certification guidance.
All features are designed to help UMKMs achieve BPJPH/MUI halal certification.

---

# 📋 TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Halal Certification Context in Indonesia](#2-halal-certification-context-in-indonesia)
3. [Halal Knowledge Base & FAQ System](#3-halal-knowledge-base--faq-system)
4. [Technical Architecture](#4-technical-architecture)
5. [User Flow & Workflow](#5-user-flow--workflow)
6. [AI Pipeline & Prompt Engineering](#6-ai-pipeline--prompt-engineering)
7. [Accuracy Optimization](#7-accuracy-optimization)
8. [Error Handling & Edge Cases](#8-error-handling--edge-cases)
9. [Security & Privacy](#9-security--privacy)
10. [Performance Optimization](#10-performance-optimization)
11. [UI/UX Design](#11-uiux-design)
12. [Dashboard & Analytics](#12-dashboard--analytics)
13. [PWA Implementation](#13-pwa-implementation)
14. [Quality Assurance](#14-quality-assurance)
15. [Features Not Thought Of](#15-features-not-thought-of)
16. [Implementation Roadmap](#16-implementation-roadmap)
17. [Best Practices & Guardrails](#17-best-practices--guardrails)
18. [Risk Analysis & Mitigation](#18-risk-analysis--mitigation)

---

# 1. EXECUTIVE SUMMARY

## 🎯 Vision & Value Proposition

**Asisten Halal** is a **24/7 AI-powered halal certification assistant** specifically designed for Indonesian UMKMs pursuing BPJPH/MUI halal certification. Unlike generic business chatbots, this feature provides:

- **Halal Certification Expertise**: Deep knowledge of SJPH HAS 23000 standards and BPJPH regulations
- **Personalized Guidance**: Tailored roadmaps based on Siap Halal assessment results
- **Ingredient Verification**: Quick check for halal status of ingredients and suppliers
- **Document Assistance**: Help with SJPH documentation requirements
- **Process Navigation**: Step-by-step guidance through certification process

## 🎁 Core Value Propositions

### For Food Producers (UMKM Makanan/Minuman)

- **Halal Readiness Assessment**: Evaluasi kesiapan sertifikasi halal
- **SJPH Document Guidance**: Bantuan lengkapi dokumen SJPH HAS 23000
- **Supplier Verification**: Rekomendasi supplier bahan baku halal bersertifikat
- **Process Compliance**: Panduan SOP produksi yang sesuai standar halal

### For Food Service (Warung/Resto/Catering)

- **Kitchen Halal Audit**: Panduan pemisahan peralatan halal/non-halal
- **Menu Halal Compliance**: Evaluasi bahan menu untuk status kehalalan
- **Staff Training Guide**: Panduan pelatihan karyawan tentang produksi halal
- **BPJPH Registration**: Step-by-step proses pendaftaran sertifikasi halal

### For Retailers (Toko/Distributor)

- **Product Halal Verification**: Verifikasi status halal produk yang dijual
- **Halal Storage Guide**: Panduan penyimpanan produk halal
- **Traceability Setup**: Sistem pelacakan produk dari supplier
- **Halal Certification Benefits**: Edukasi keuntungan sertifikasi halal

## 📊 Key Capabilities

### 1. Halal FAQ Assistant

- **500+ curated halal FAQs** covering certification process
- **Instant answers** to common halal questions
- **Hybrid approach**: FAQ matching first, LLM fallback with disclaimer
- **Assessment-aware responses** based on Siap Halal results

### 2. Ingredient Checker

- **Database of 1000+ common ingredients** with halal status
- **Quick lookup** for ingredient verification
- **Supplier recommendations** for halal-certified alternatives
- **E-code checker** for food additives

### 3. Certification Process Guide

- **Step-by-step roadmap** from pre-application to certificate
- **Document checklist** for SJPH requirements
- **Timeline estimation** based on business type
- **Cost breakdown** for certification fees

### 4. SJPH Document Helper

- **Template guidance** for required documents
- **Common mistakes** to avoid in documentation
- **Sample formats** for SOP, supplier agreements, etc.
- **Review checklist** before submission

### 5. Post-Certification Support

- **Maintenance requirements** for halal status
- **Renewal process** guidance
- **Audit preparation** tips
- **Continuous compliance** monitoring

## 🎯 Accuracy Target

**≥ 92% Accuracy** for halal certification guidance

- Verified against BPJPH/LPPOM MUI official sources
- FAQ answers validated by halal certification experts
- User satisfaction rating ≥ 4.5/5.0
- Assessment-to-certification conversion rate ≥ 60%

## 📈 Success Metrics

### Engagement Metrics

- **Daily Active Sessions**: 500+ within 3 months
- **Average Session Duration**: 5-8 minutes
- **Return Rate**: 60%+ users come back within 7 days
- **Feature Discovery**: 80%+ users try FAQ + Ingredient Checker

### Certification Impact Metrics

- **Assessment Completion**: 80%+ users complete Siap Halal assessment
- **Document Download**: 70%+ users download SJPH templates
- **Certification Applications**: 40%+ users proceed to actual certification
- **Time to Certification**: Reduce average time by 30%

### Quality Metrics

- **FAQ Accuracy**: 95%+ answers verified correct
- **Ingredient Accuracy**: 98%+ ingredient status correct
- **Response Relevance**: 92%+ responses rated "helpful"
- **Response Time**: <2 seconds for FAQ, <3 seconds for LLM

---

# 2. HALAL CERTIFICATION CONTEXT IN INDONESIA

## 🇮🇩 Halal Certification Landscape

### Regulatory Framework

```
┌─────────────────────────────────────────────────────────────────┐
│                HALAL CERTIFICATION ECOSYSTEM                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────┐     ┌─────────────────────┐
│      BPJPH          │     │     LPPOM MUI       │
│  (Badan Penyelenggara│←───│  (Lembaga Pengkajian│
│   Jaminan Produk    │     │   Pangan Obat-obatan│
│       Halal)        │     │   & Kosmetika MUI)  │
└──────────┬──────────┘     └──────────┬──────────┘
           │                           │
           │    ┌─────────────┐        │
           └───→│   LPH       │←───────┘
                │(Lembaga     │
                │ Pemeriksa   │
                │ Halal)      │
                └──────┬──────┘
                       │
                       ↓
              ┌─────────────────┐
              │     UMKM        │
              │ (Pelaku Usaha)  │
              └─────────────────┘
```

### Key Regulations

| Regulation               | Description          | Impact                                |
| ------------------------ | -------------------- | ------------------------------------- |
| **UU No. 33/2014**       | Jaminan Produk Halal | Mandatory halal certification by 2024 |
| **PP No. 31/2019**       | Pelaksanaan JPH      | Implementation guidelines             |
| **PP No. 39/2021**       | Penyelenggaraan JPH  | BPJPH authority & process             |
| **Permenag No. 26/2019** | Sertifikasi Halal    | Certification procedures              |
| **HAS 23000**            | Sistem Jaminan Halal | SJPH requirements & standards         |

### Market Statistics (2024)

- **Total UMKMs requiring certification**: 64.2 million businesses
- **Currently certified**: ~15% of eligible businesses
- **Government target**: 100% compliance by 2024
- **Free certification program**: UMKMs with assets <Rp 1 billion
- **Average certification time**: 3-6 months

## 🍽️ Industry Categories for Halal Certification

### Category 1: Food & Beverages (Makanan & Minuman)

**Subcategories:**

- Processed foods (makanan olahan)
- Beverages (minuman)
- Food ingredients (bahan pangan)
- Food additives (bahan tambahan pangan)

**Key Halal Concerns:**

- Ingredient sourcing (halal-certified suppliers)
- Processing equipment (no cross-contamination)
- Storage & transportation (segregation from non-halal)
- Packaging materials (halal-compliant)

**Critical Check Points:**

1. ✅ All raw materials have halal certificates
2. ✅ Production equipment never used for non-halal
3. ✅ Cleaning procedures comply with halal standards
4. ✅ Storage separate from non-halal products
5. ✅ Staff trained on halal production

### Category 2: Cosmetics & Personal Care (Kosmetik & Perawatan)

**Subcategories:**

- Skincare products
- Makeup & color cosmetics
- Hair care products
- Personal hygiene products

**Key Halal Concerns:**

- Animal-derived ingredients (collagen, glycerin)
- Alcohol content (ethanol from non-halal sources)
- Testing methods (no animal testing with non-halal animals)
- Fragrance ingredients (musk, civet)

**Critical Check Points:**

1. ✅ No pig-derived ingredients
2. ✅ Alcohol from halal fermentation only
3. ✅ Collagen from halal sources (fish, plants)
4. ✅ No cross-contamination in production
5. ✅ Halal-certified raw material suppliers

### Category 3: Pharmaceuticals & Health Products

**Subcategories:**

- Medicines (obat-obatan)
- Health supplements (suplemen kesehatan)
- Traditional medicines (obat tradisional/jamu)
- Medical devices (alat kesehatan)

**Key Halal Concerns:**

- Gelatin capsules (pork-derived common)
- Alcohol as solvent
- Animal-derived active ingredients
- Coating materials

**Critical Check Points:**

1. ✅ Capsules from halal gelatin or plant-based
2. ✅ Alcohol content within permissible limits
3. ✅ No porcine insulin or similar
4. ✅ Manufacturing facility halal-compliant

### Category 4: Fashion & Textiles

**Subcategories:**

- Clothing (pakaian)
- Leather goods (produk kulit)
- Accessories (aksesoris)
- Footwear (alas kaki)

**Key Halal Concerns:**

- Leather source (pig leather, improperly slaughtered animals)
- Silk processing (use of non-halal substances)
- Dyes and chemicals (animal-derived colorants)
- Fur and feathers (source verification)

**Critical Check Points:**

1. ✅ Leather from halal-slaughtered animals
2. ✅ No pig skin or derivatives
3. ✅ Processing chemicals halal-certified
4. ✅ Supply chain traceability

## 📋 SJPH (Sistem Jaminan Produk Halal) Requirements

### HAS 23000 Standard Components

```
┌─────────────────────────────────────────────────────────────────┐
│                    SJPH HAS 23000 FRAMEWORK                     │
└─────────────────────────────────────────────────────────────────┘

1. HALAL POLICY (Kebijakan Halal)
   └── Komitmen manajemen tertulis untuk produksi halal

2. HALAL MANAGEMENT TEAM (Tim Manajemen Halal)
   └── Struktur organisasi dengan penanggung jawab halal

3. TRAINING & EDUCATION (Pelatihan & Edukasi)
   └── Program pelatihan karyawan tentang halal

4. MATERIALS (Bahan)
   └── Daftar bahan baku dengan status halal

5. PRODUCTS (Produk)
   └── Daftar produk yang akan disertifikasi

6. PRODUCTION FACILITIES (Fasilitas Produksi)
   └── Denah dan spesifikasi fasilitas

7. CRITICAL ACTIVITIES (Aktivitas Kritis)
   └── SOP untuk aktivitas yang mempengaruhi kehalalan

8. TRACEABILITY (Ketertelusuran)
   └── Sistem pelacakan dari bahan hingga produk

9. HANDLING OF NON-CONFORMING PRODUCTS
   └── Prosedur penanganan produk tidak sesuai

10. INTERNAL AUDIT (Audit Internal)
    └── Jadwal dan prosedur audit internal

11. MANAGEMENT REVIEW (Tinjauan Manajemen)
    └── Evaluasi berkala sistem halal
```

### Required Documents Checklist

```typescript
interface SJPHDocumentChecklist {
  // Mandatory documents
  mandatory: [
    "Surat Permohonan Sertifikasi Halal",
    "Kebijakan Halal (Halal Policy)",
    "Daftar Produk yang Didaftarkan",
    "Daftar Bahan & Dokumen Pendukung",
    "Diagram Alir Proses Produksi",
    "Daftar Alamat Fasilitas Produksi",
    "Bukti Sosialisasi Kebijakan Halal",
    "Bukti Pelatihan Internal",
    "Manual SJPH",
    "Prosedur Aktivitas Kritis",
    "Form Audit Internal Halal",
    "Form Tinjauan Manajemen",
  ];

  // Supporting documents
  supporting: [
    "NIB (Nomor Induk Berusaha)",
    "Sertifikat Halal Bahan Baku",
    "Surat Keterangan Bahan Non-Halal Critical",
    "Layout Fasilitas Produksi",
    "Foto Fasilitas & Peralatan",
    "Struktur Organisasi Tim Halal",
  ];
}
```

## 🔄 Certification Process Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              HALAL CERTIFICATION PROCESS FLOW                   │
└─────────────────────────────────────────────────────────────────┘

[PHASE 1: PREPARATION] ─────────────────────────────────────────
│
├─► Step 1: Self-Assessment (Siap Halal)
│   └── Evaluate readiness using SAH-in Aja! assessment
│
├─► Step 2: Gap Analysis
│   └── Identify missing requirements
│
├─► Step 3: Document Preparation
│   └── Prepare SJPH documents (use Dokumen Halal feature)
│
└─► Step 4: Internal Training
    └── Train staff on halal procedures

[PHASE 2: APPLICATION] ─────────────────────────────────────────
│
├─► Step 5: PTSP Registration
│   └── Register at ptsp.halal.go.id
│
├─► Step 6: Document Upload
│   └── Submit all SJPH documents
│
├─► Step 7: Payment (if applicable)
│   └── Free for eligible UMKMs, or pay certification fee
│
└─► Step 8: Application Review
    └── BPJPH reviews completeness

[PHASE 3: INSPECTION] ─────────────────────────────────────────
│
├─► Step 9: LPH Assignment
│   └── BPJPH assigns inspection body
│
├─► Step 10: Facility Audit
│   └── On-site inspection by LPH
│
├─► Step 11: Product Testing (if needed)
│   └── Laboratory testing for critical products
│
└─► Step 12: Audit Report
    └── LPH submits findings to BPJPH

[PHASE 4: CERTIFICATION] ─────────────────────────────────────────
│
├─► Step 13: Fatwa Decision
│   └── MUI issues halal fatwa
│
├─► Step 14: Certificate Issuance
│   └── BPJPH issues halal certificate
│
└─► Step 15: Halal Label Usage
    └── Apply halal label to products

[PHASE 5: MAINTENANCE] ─────────────────────────────────────────
│
├─► Ongoing: Compliance Monitoring
│   └── Maintain halal standards
│
├─► Annual: Internal Audit
│   └── Conduct yearly self-audit
│
└─► Every 4 Years: Renewal
    └── Recertification process
```

## ⏱️ Timeline & Costs

### Certification Timeline by Business Type

| Business Type      | Preparation | Application | Inspection | Total      |
| ------------------ | ----------- | ----------- | ---------- | ---------- |
| Micro (home-based) | 2-4 weeks   | 1-2 weeks   | 2-4 weeks  | 2-3 months |
| Small (UMKM)       | 4-8 weeks   | 2-3 weeks   | 3-6 weeks  | 3-4 months |
| Medium             | 8-12 weeks  | 3-4 weeks   | 4-8 weeks  | 4-6 months |
| Large/Complex      | 12-16 weeks | 4-6 weeks   | 6-12 weeks | 6-9 months |

### Certification Costs

```typescript
interface HalalCertificationCosts {
  // Free certification (Sertifikasi Halal Gratis)
  freeEligibility: {
    requirement: "UMKM dengan aset ≤ Rp 1 miliar";
    coverage: "Biaya sertifikasi ditanggung pemerintah";
    documents: "Surat keterangan UMKM dari kelurahan/kecamatan";
  };

  // Paid certification
  paidCertification: {
    applicationFee: "Rp 300.000 - 500.000";
    inspectionFee: "Rp 1.500.000 - 5.000.000"; // varies by complexity
    labTestingFee: "Rp 500.000 - 2.000.000"; // if required
    totalEstimate: "Rp 2.500.000 - 7.500.000";
  };

  // Additional costs (self-funded)
  additionalCosts: {
    consultantFee: "Rp 5.000.000 - 15.000.000"; // optional
    facilityUpgrade: "Varies by requirement";
    staffTraining: "Rp 500.000 - 2.000.000";
  };
}
```

## 🚨 Common Halal Certification Challenges

### Challenge 1: Ingredient Documentation

**Problem**: UMKMs struggle to obtain halal certificates from suppliers
**Impact**: Application rejected or delayed
**Solution**:

- Use Asisten Halal ingredient checker
- Request supplier documentation early
- Consider alternative halal-certified suppliers

### Challenge 2: Facility Requirements

**Problem**: Shared facilities or equipment with non-halal products
**Impact**: Must separate or dedicate equipment
**Solution**:

- Conduct facility audit with Siap Halal
- Plan equipment separation/cleaning SOP
- Document all procedures

### Challenge 3: Understanding SJPH Requirements

**Problem**: Complex documentation requirements
**Impact**: Incomplete applications, multiple revisions
**Solution**:

- Use Dokumen Halal template generator
- Follow Asisten Halal document checklist
- Review before submission

### Challenge 4: Staff Knowledge

**Problem**: Employees unaware of halal requirements
**Impact**: Compliance failures during audit
**Solution**:

- Internal training program
- Clear SOPs posted in facility
- Regular refresher training

### Challenge 5: Cost Concerns

**Problem**: Perceived high certification costs
**Impact**: Delay or avoid certification
**Solution**:

- Check eligibility for free certification
- Prioritize products for certification
- Plan budget in phases

---

# 3. HALAL KNOWLEDGE BASE & FAQ SYSTEM

## 🗄️ Knowledge Base Architecture

### Hybrid Approach: FAQ + LLM Fallback

```
┌─────────────────────────────────────────────────────────────────┐
│                 ASISTEN HALAL RESPONSE FLOW                     │
└─────────────────────────────────────────────────────────────────┘

[User Question]
        │
        ▼
┌───────────────────┐
│  FAQ Matching     │ ◄── 500+ curated halal FAQs
│  (Semantic Search)│
└────────┬──────────┘
         │
    ┌────┴────┐
    │ Match   │
    │ Found?  │
    └────┬────┘
         │
    ┌────┴────┐
   YES       NO
    │         │
    ▼         ▼
┌─────────┐  ┌───────────────────┐
│ Return  │  │ LLM Fallback      │
│ FAQ     │  │ (with disclaimer) │
│ Answer  │  └────────┬──────────┘
└─────────┘           │
                      ▼
              ┌───────────────┐
              │ "Berdasarkan  │
              │ pengetahuan   │
              │ umum..."      │
              │ + Disclaimer  │
              └───────────────┘
```

## 📚 FAQ Categories

### Category 1: Certification Process (150 FAQs)

```json
{
  "category": "certification_process",
  "faqs": [
    {
      "id": "CP-001",
      "question": "Bagaimana cara mendaftar sertifikasi halal?",
      "answer": "Pendaftaran sertifikasi halal dilakukan melalui PTSP (Pelayanan Terpadu Satu Pintu) di ptsp.halal.go.id. Langkah-langkahnya:\n\n1. Buat akun di ptsp.halal.go.id\n2. Lengkapi profil perusahaan\n3. Pilih jenis sertifikasi (baru/perpanjangan)\n4. Upload dokumen SJPH\n5. Tunggu verifikasi dan jadwal audit\n\nUntuk UMKM dengan aset ≤ Rp 1 miliar, sertifikasi GRATIS.",
      "keywords": ["daftar", "pendaftaran", "cara daftar", "ptsp"],
      "source": "BPJPH Official Guide",
      "lastUpdated": "2024-11-01"
    },
    {
      "id": "CP-002",
      "question": "Berapa lama proses sertifikasi halal?",
      "answer": "Waktu proses sertifikasi halal bervariasi:\n\n- **UMKM Mikro**: 2-3 bulan\n- **UMKM Kecil**: 3-4 bulan\n- **Usaha Menengah**: 4-6 bulan\n\nFaktor yang mempengaruhi:\n- Kelengkapan dokumen\n- Kompleksitas produk\n- Jadwal audit LPH\n\n**Tips**: Siapkan dokumen lengkap untuk mempercepat proses.",
      "keywords": ["berapa lama", "waktu", "durasi", "proses"],
      "source": "BPJPH Statistics 2024"
    },
    {
      "id": "CP-003",
      "question": "Apakah UMKM bisa dapat sertifikasi halal gratis?",
      "answer": "Ya! UMKM dapat sertifikasi halal GRATIS jika memenuhi syarat:\n\n**Syarat:**\n- Aset usaha ≤ Rp 1 miliar (tidak termasuk tanah & bangunan)\n- Memiliki NIB (Nomor Induk Berusaha)\n- Produk termasuk dalam daftar produk wajib halal\n\n**Dokumen tambahan:**\n- Surat keterangan UMKM dari kelurahan/kecamatan\n- Formulir pernyataan aset\n\n**Cara daftar:** Pilih opsi 'Sertifikasi Halal Gratis' di ptsp.halal.go.id",
      "keywords": ["gratis", "free", "umkm", "biaya"],
      "source": "Permenag 26/2019"
    }
  ]
}
```

### Category 2: SJPH & Documentation (100 FAQs)

```json
{
  "category": "sjph_documentation",
  "faqs": [
    {
      "id": "SJPH-001",
      "question": "Apa itu SJPH dan apa saja isinya?",
      "answer": "SJPH (Sistem Jaminan Produk Halal) adalah sistem manajemen yang menjamin kehalalan produk. Berdasarkan HAS 23000, SJPH mencakup:\n\n**11 Komponen SJPH:**\n1. Kebijakan Halal\n2. Tim Manajemen Halal\n3. Pelatihan & Edukasi\n4. Bahan\n5. Produk\n6. Fasilitas Produksi\n7. Prosedur Aktivitas Kritis\n8. Kemampuan Telusur\n9. Penanganan Produk Tidak Sesuai\n10. Audit Internal\n11. Kaji Ulang Manajemen\n\nGunakan fitur **Dokumen Halal** di SAH-in Aja! untuk generate template SJPH.",
      "keywords": ["sjph", "sistem jaminan", "has 23000", "dokumen"],
      "source": "HAS 23000 Standard"
    },
    {
      "id": "SJPH-002",
      "question": "Dokumen apa saja yang dibutuhkan untuk sertifikasi halal?",
      "answer": "**Dokumen Wajib:**\n1. Surat permohonan sertifikasi\n2. NIB (Nomor Induk Berusaha)\n3. Manual SJPH lengkap\n4. Daftar produk yang didaftarkan\n5. Daftar bahan & sertifikat halal bahan\n6. Diagram alir proses produksi\n7. Denah fasilitas produksi\n8. Bukti pelatihan halal internal\n\n**Dokumen Pendukung:**\n- Foto fasilitas & peralatan\n- SOP aktivitas kritis\n- Form audit internal\n- Form kaji ulang manajemen\n\n**Tips:** Gunakan fitur **Dokumen Halal** untuk generate template lengkap!",
      "keywords": ["dokumen", "persyaratan", "syarat", "berkas"],
      "source": "BPJPH Document Requirements"
    }
  ]
}
```

### Category 3: Ingredients & Materials (150 FAQs)

```json
{
  "category": "ingredients_materials",
  "faqs": [
    {
      "id": "ING-001",
      "question": "Bagaimana cara mengetahui bahan baku halal atau tidak?",
      "answer": "Cara verifikasi status halal bahan baku:\n\n**1. Cek Sertifikat Halal**\n- Minta sertifikat halal dari supplier\n- Verifikasi di halal.go.id atau app BPJPH\n\n**2. Cek Daftar Bahan LPPOM MUI**\n- Akses halalmuindo.com\n- Cari nama bahan/merk produk\n\n**3. Analisis Komposisi**\n- Perhatikan kode E-number\n- Waspadai bahan kritis (gelatin, gliserin, emulsifier)\n\n**4. Gunakan Asisten Halal**\n- Tanya langsung di chat ini\n- Gunakan fitur cek bahan\n\n⚠️ **Bahan Kritis** yang sering bermasalah:\n- Gelatin (bisa dari babi)\n- Shortening (lemak hewani)\n- Emulsifier E471 (bisa dari babi)\n- Pewarna karmin E120 (dari serangga)",
      "keywords": ["bahan", "ingredient", "halal", "cek", "verifikasi"],
      "source": "LPPOM MUI Guidelines"
    },
    {
      "id": "ING-002",
      "question": "Apa saja bahan yang pasti haram?",
      "answer": "**Bahan yang PASTI HARAM:**\n\n🐷 **Dari Babi:**\n- Daging babi & turunannya\n- Gelatin babi\n- Lemak babi (lard)\n- Kolagen babi\n- Enzim dari pankreas babi\n\n🍺 **Khamr (Minuman Keras):**\n- Alkohol dari fermentasi non-halal\n- Wine, beer, spirits\n- Ekstrak yang mengandung alkohol tinggi\n\n🦴 **Bangkai:**\n- Hewan mati tanpa disembelih\n- Darah yang mengalir\n\n🐕 **Hewan Haram:**\n- Anjing & turunannya\n- Hewan buas bertaring\n- Burung berkuku tajam\n\n⚠️ **Perhatian:** Turunan bahan ini juga haram, termasuk dalam bentuk olahan (gelatin, kolagen, enzyme, dll)",
      "keywords": ["haram", "dilarang", "tidak boleh", "najis"],
      "source": "MUI Fatwa Collection"
    }
  ]
}
```

### Category 4: Facility & Production (80 FAQs)

```json
{
  "category": "facility_production",
  "faqs": [
    {
      "id": "FAC-001",
      "question": "Apakah peralatan produksi harus terpisah untuk produk halal?",
      "answer": "**Ketentuan Pemisahan Peralatan:**\n\n✅ **WAJIB TERPISAH** jika:\n- Pernah digunakan untuk produk mengandung babi\n- Tidak dapat dibersihkan sempurna\n\n🔄 **BOLEH SHARED** dengan syarat:\n- Tidak pernah untuk produk babi\n- Ada prosedur pembersihan (7x bilas, 1x dengan tanah/samak)\n- Terdokumentasi dalam SOP\n\n**Prosedur Pembersihan (Samak):**\n1. Bilas dengan air mengalir\n2. Gosok dengan tanah atau sabun\n3. Bilas 7 kali dengan air bersih\n4. Dokumentasikan proses\n\n**Tips:** Lebih aman untuk memiliki peralatan khusus halal.",
      "keywords": ["peralatan", "alat", "terpisah", "dedicate", "shared"],
      "source": "HAS 23000 - Facility Requirements"
    },
    {
      "id": "FAC-002",
      "question": "Bagaimana cara menyimpan bahan baku halal yang benar?",
      "answer": "**Standar Penyimpanan Bahan Halal:**\n\n📦 **Segregasi:**\n- Pisahkan dari bahan non-halal/tidak jelas statusnya\n- Beri label 'HALAL' yang jelas\n- Gunakan area penyimpanan terpisah\n\n🏷️ **Labeling:**\n- Tandai dengan label 'BAHAN HALAL'\n- Cantumkan tanggal penerimaan\n- Catat nomor batch\n\n📝 **Dokumentasi:**\n- Catat semua penerimaan bahan\n- Simpan sertifikat halal supplier\n- Tracking First-In-First-Out (FIFO)\n\n🧹 **Kebersihan:**\n- Area bersih dari najis\n- Terlindung dari kontaminasi\n- Cegah hama (pest control)\n\n**Checklist Penyimpanan:**\n- [ ] Area terpisah dari non-halal\n- [ ] Label halal terpasang\n- [ ] Sertifikat halal tersimpan\n- [ ] Log penerimaan tercatat",
      "keywords": ["simpan", "penyimpanan", "storage", "gudang"],
      "source": "HAS 23000 - Storage Guidelines"
    }
  ]
}
```

### Category 5: Specific Industries (70 FAQs)

```json
{
  "category": "industry_specific",
  "faqs": [
    {
      "id": "IND-FOOD-001",
      "question": "Apa saja yang perlu diperhatikan untuk sertifikasi halal makanan rumahan?",
      "answer": "**Sertifikasi Halal Makanan Rumahan:**\n\n🏠 **Persyaratan Fasilitas:**\n- Dapur terpisah atau khusus untuk produksi\n- Peralatan masak dedicated\n- Area penyimpanan bahan terpisah\n\n📋 **Dokumen yang Dibutuhkan:**\n1. NIB (bisa NIB perorangan)\n2. Manual SJPH sederhana\n3. Daftar bahan & supplier\n4. Foto area produksi\n5. SOP produksi\n\n✅ **Tips Sukses:**\n- Gunakan bahan yang sudah bersertifikat halal\n- Dokumentasikan semua proses\n- Latih anggota keluarga yang membantu\n- Pisahkan alat masak rumah tangga\n\n💰 **Biaya:**\nUMKM dengan aset ≤ Rp 1 miliar = **GRATIS**\n\nGunakan **Siap Halal** untuk cek kesiapan Anda!",
      "keywords": ["rumahan", "home", "umkm", "usaha rumah", "dapur"],
      "source": "BPJPH UMKM Guidelines"
    },
    {
      "id": "IND-COSM-001",
      "question": "Apakah kosmetik wajib sertifikasi halal?",
      "answer": "**Status Sertifikasi Halal Kosmetik:**\n\n📅 **Timeline Kewajiban:**\n- Kosmetik masuk dalam produk wajib halal\n- Deadline: 17 Oktober 2026\n\n🔍 **Bahan Kritis di Kosmetik:**\n- Kolagen (bisa dari babi/sapi)\n- Gliserin (bisa hewani/nabati)\n- Alkohol (sumber fermentasi)\n- Karmin/cochineal (dari serangga)\n- Musk (dari hewan)\n\n✅ **Yang Perlu Disiapkan:**\n1. Daftar semua bahan dengan sertifikat halal\n2. Ganti bahan non-halal dengan alternatif\n3. SOP produksi yang halal-compliant\n4. Verifikasi supplier\n\n💡 **Alternatif Bahan:**\n- Kolagen → Kolagen ikan/nabati\n- Gliserin hewani → Gliserin nabati\n- Karmin → Pewarna sintetis/nabati",
      "keywords": ["kosmetik", "cosmetic", "skincare", "makeup"],
      "source": "BPJPH Cosmetics Regulation"
    }
  ]
}
```

## 🔍 Ingredient Database

### Halal Ingredient Checker

```typescript
interface IngredientDatabase {
  totalIngredients: 1000;
  categories: [
    "additives", // E-codes
    "preservatives",
    "colorings",
    "flavorings",
    "emulsifiers",
    "thickeners",
    "sweeteners",
    "proteins",
    "fats_oils",
  ];
}

// Example ingredient entries
const ingredientDB = [
  {
    id: "ING-E471",
    name: "Mono- and Diglycerides of Fatty Acids",
    ecode: "E471",
    category: "emulsifiers",
    halalStatus: "SYUBHAT",
    statusReason: "Bisa dari lemak hewani (babi) atau nabati. Perlu verifikasi sumber.",
    alternatives: ["E471 dari minyak sawit (verified halal)", "Lecithin E322"],
    commonProducts: ["Roti", "Margarin", "Es krim", "Cokelat"],
    checkPoints: [
      "Minta sertifikat halal dari supplier",
      "Verifikasi sumber lemak (hewani/nabati)",
      "Cek COA (Certificate of Analysis)",
    ],
  },
  {
    id: "ING-E120",
    name: "Cochineal/Carmine",
    ecode: "E120",
    category: "colorings",
    halalStatus: "HARAM",
    statusReason: "Berasal dari serangga cochineal. Tidak halal menurut sebagian ulama.",
    alternatives: ["Betanin E162 (bit merah)", "Anthocyanin E163", "Pewarna sintetis merah"],
    commonProducts: ["Minuman merah", "Permen", "Yogurt", "Lipstik"],
    checkPoints: ["Hindari produk dengan E120", "Ganti dengan pewarna nabati atau sintetis"],
  },
  {
    id: "ING-GELATIN",
    name: "Gelatin",
    ecode: null,
    category: "proteins",
    halalStatus: "SYUBHAT",
    statusReason: "Bisa dari babi, sapi, atau ikan. HARAM jika dari babi.",
    alternatives: ["Gelatin ikan", "Gelatin sapi halal", "Agar-agar", "Karagenan", "Pektin"],
    commonProducts: ["Kapsul obat", "Permen kenyal", "Marshmallow", "Yogurt"],
    checkPoints: ["Wajib cek sumber gelatin", "Minta sertifikat halal", "Pilih gelatin ikan/sapi halal"],
  },
];
```

### E-Code Quick Reference

```typescript
const ecodeReference = {
  GENERALLY_HALAL: [
    "E100 - Curcumin (Kunyit)",
    "E101 - Riboflavin (Vitamin B2)",
    "E140 - Chlorophyll",
    "E160a - Carotenes",
    "E162 - Beetroot Red",
    "E163 - Anthocyanins",
    "E170 - Calcium Carbonate",
    "E300 - Ascorbic Acid (Vitamin C)",
    "E322 - Lecithin (if from soy/sunflower)",
    "E330 - Citric Acid",
    "E400-E405 - Alginates",
    "E406 - Agar",
    "E407 - Carrageenan",
  ],

  NEED_VERIFICATION: [
    "E101 - Riboflavin (check if from pork liver)",
    "E153 - Vegetable Carbon (check source)",
    "E270 - Lactic Acid (fermentation source)",
    "E322 - Lecithin (if from animal/egg)",
    "E422 - Glycerol (animal or plant)",
    "E441 - Gelatin (CRITICAL - check source)",
    "E471 - Mono/Diglycerides (fat source)",
    "E472a-f - Fatty Acid Esters (fat source)",
    "E491-495 - Sorbitan Esters (fat source)",
    "E542 - Bone Phosphate (animal source)",
    "E570 - Stearic Acid (fat source)",
    "E572 - Magnesium Stearate (fat source)",
    "E631 - Disodium Inosinate (meat/fish)",
    "E635 - Disodium Ribonucleotides (meat/fish)",
  ],

  HARAM_OR_AVOID: [
    "E120 - Cochineal/Carmine (insect)",
    "E441 - Gelatin (if from pork)",
    "E542 - Bone Phosphate (if from pork)",
    "E904 - Shellac (insect secretion)",
    "E920 - L-Cysteine (if from human hair/pork)",
  ],
};
```

## 💬 LLM Fallback with Disclaimer

### Fallback Response Template

```typescript
const fallbackResponseTemplate = `
Berdasarkan pengetahuan umum tentang sertifikasi halal:

{AI_GENERATED_RESPONSE}

---
⚠️ **Disclaimer:**
Jawaban ini dihasilkan oleh AI berdasarkan pengetahuan umum. Untuk informasi resmi dan terkini, silakan:
- Kunjungi website BPJPH: halal.go.id
- Hubungi call center BPJPH: 1500-363
- Konsultasi dengan LPH (Lembaga Pemeriksa Halal) terdekat

Apakah ada pertanyaan lain yang bisa saya bantu?
`;

// Fallback detection
function shouldUseFallback(faqMatchScore: number): boolean {
  return faqMatchScore < 0.75; // Use LLM if FAQ match < 75%
}

// Generate fallback response
async function generateFallbackResponse(query: string, context: UserContext): Promise<string> {
  const systemPrompt = `
Anda adalah Asisten Halal AI untuk membantu UMKM dengan pertanyaan sertifikasi halal.

ATURAN PENTING:
1. Jawab HANYA tentang sertifikasi halal, SJPH, dan topik terkait
2. Jika tidak yakin, katakan "Saya tidak memiliki informasi pasti tentang ini"
3. Selalu sarankan untuk verifikasi ke BPJPH untuk informasi resmi
4. Gunakan bahasa Indonesia yang jelas dan mudah dipahami
5. Jangan memberikan fatwa atau keputusan halal/haram definitif

KONTEKS USER:
- Hasil Assessment: ${context.assessmentScore}/100
- Jenis Usaha: ${context.businessType}
- Produk: ${context.products}
`;

  const response = await llm.generate({
    model: "openai/gpt-oss-120b",
    systemPrompt,
    userMessage: query,
    temperature: 0.3, // Lower temperature for factual responses
    maxTokens: 500,
  });

  return fallbackResponseTemplate.replace("{AI_GENERATED_RESPONSE}", response);
}
```

---

# 4. TECHNICAL ARCHITECTURE

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  React 19 PWA (Rsbuild + Tailwind 4)                      │  │
│  │  ┌────────────┬──────────────┬─────────────────────────┐  │  │
│  │  │ Chat UI    │ Ingredient   │ Assessment Integration  │  │  │
│  │  │            │ Checker      │                         │  │  │
│  │  ├────────────┼──────────────┼─────────────────────────┤  │  │
│  │  │ FAQ        │ Document     │ Progress Tracking       │  │  │
│  │  │ Browser    │ Helper       │                         │  │  │
│  │  └────────────┴──────────────┴─────────────────────────┘  │  │
│  │                                                           │  │
│  │  Service Worker (Offline FAQ Support)                     │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓ ↑
                        WebSocket + HTTP
                              ↓ ↑
┌─────────────────────────────────────────────────────────────────┐
│                       BACKEND LAYER (Convex)                    │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Real-time Queries & Mutations                            │  │
│  │  ┌──────────────┬──────────────┬───────────────────────┐  │  │
│  │  │ Chat API     │ FAQ API      │ Ingredient API        │  │  │
│  │  ├──────────────┼──────────────┼───────────────────────┤  │  │
│  │  │ Assessment   │ Document     │ Analytics API         │  │  │
│  │  │ Integration  │ Helper API   │                       │  │  │
│  │  └──────────────┴──────────────┴───────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  AI Pipeline (Convex Actions)                             │  │
│  │  ┌──────────────────────────────────────────────────────┐ │  │
│  │  │  FAQ Matching → LLM Fallback → Response Formatting   │ │  │
│  │  │  ↓               ↓                  ↓                │ │  │
│  │  │  Semantic       NVIDIA API         Disclaimer        │ │  │
│  │  │  Search         Streaming          Addition          │ │  │
│  │  └──────────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Database Tables                                          │  │
│  │  ┌────────────┬──────────────┬─────────────────────────┐  │  │
│  │  │ users      │ halal_faqs   │ chat_sessions           │  │  │
│  │  │            │              │                         │  │  │
│  │  ├────────────┼──────────────┼─────────────────────────┤  │  │
│  │  │ ingredients│ assessments  │ chat_messages           │  │  │
│  │  │            │              │                         │  │  │
│  │  ├────────────┼──────────────┼─────────────────────────┤  │  │
│  │  │ analytics  │ feedback     │ notifications           │  │  │
│  │  │            │              │                         │  │  │
│  │  └────────────┴──────────────┴─────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓ ↑
                          API Calls
                              ↓ ↑
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                            │
│  ┌──────────────┬──────────────┬──────────────┬─────────────┐   │
│  │ NVIDIA API   │ OpenAI API   │ Resend       │ BPJPH API   │   │
│  │ (LLM)        │ (Embeddings) │ (Email)      │ (Verify)    │   │
│  └──────────────┴──────────────┴──────────────┴─────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## 📊 Database Schema

```typescript
// convex/schema.ts

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Halal FAQs
  halal_faqs: defineTable({
    faqId: v.string(),
    category: v.string(), // 'certification_process' | 'sjph' | 'ingredients' | 'facility' | 'industry'
    question: v.string(),
    answer: v.string(),
    keywords: v.array(v.string()),
    source: v.string(),
    lastUpdated: v.number(),
    usageCount: v.number(),
    helpfulCount: v.number(),
    embedding: v.optional(v.array(v.float64())), // For semantic search
  })
    .index("by_category", ["category"])
    .index("by_usage", ["usageCount"])
    .searchIndex("by_question", {
      searchField: "question",
      filterFields: ["category"],
    })
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
      filterFields: ["category"],
    }),

  // Ingredient database
  halal_ingredients: defineTable({
    ingredientId: v.string(),
    name: v.string(),
    aliases: v.array(v.string()), // Alternative names
    ecode: v.optional(v.string()), // E-code if applicable
    category: v.string(),
    halalStatus: v.string(), // 'HALAL' | 'HARAM' | 'SYUBHAT' | 'NEED_VERIFICATION'
    statusReason: v.string(),
    alternatives: v.array(v.string()),
    commonProducts: v.array(v.string()),
    checkPoints: v.array(v.string()),
    source: v.string(),
    lastVerified: v.number(),
  })
    .index("by_status", ["halalStatus"])
    .index("by_category", ["category"])
    .index("by_ecode", ["ecode"])
    .searchIndex("by_name", {
      searchField: "name",
      filterFields: ["category", "halalStatus"],
    }),

  // Chat sessions
  halal_chat_sessions: defineTable({
    userId: v.id("users"),
    assessmentId: v.optional(v.id("halal_assessments")), // Link to Siap Halal assessment
    startedAt: v.number(),
    lastMessageAt: v.number(),
    messageCount: v.number(),
    status: v.string(), // 'active' | 'archived'
    primaryTopic: v.optional(v.string()),
    summary: v.optional(v.string()),
    userRating: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"]),

  // Chat messages
  halal_chat_messages: defineTable({
    sessionId: v.id("halal_chat_sessions"),
    role: v.string(), // 'user' | 'assistant'
    content: v.string(),
    timestamp: v.number(),

    // Response metadata
    responseType: v.optional(v.string()), // 'faq_match' | 'llm_fallback' | 'ingredient_check'
    faqId: v.optional(v.string()), // If matched to FAQ
    matchScore: v.optional(v.number()), // Confidence score

    // User feedback
    helpful: v.optional(v.boolean()),
    feedbackReason: v.optional(v.string()),
  })
    .index("by_session", ["sessionId"])
    .index("by_timestamp", ["timestamp"]),

  // Analytics
  halal_assistant_analytics: defineTable({
    userId: v.optional(v.id("users")),
    eventType: v.string(), // 'query' | 'faq_match' | 'llm_fallback' | 'ingredient_check' | 'feedback'
    eventData: v.any(),
    timestamp: v.number(),
  })
    .index("by_type", ["eventType"])
    .index("by_timestamp", ["timestamp"]),

  // User feedback for improvement
  halal_feedback: defineTable({
    messageId: v.id("halal_chat_messages"),
    userId: v.id("users"),
    helpful: v.boolean(),
    reason: v.optional(v.string()),
    suggestedAnswer: v.optional(v.string()), // User can suggest better answer
    timestamp: v.number(),
    reviewStatus: v.string(), // 'pending' | 'reviewed' | 'applied'
  })
    .index("by_status", ["reviewStatus"])
    .index("by_timestamp", ["timestamp"]),
});
```

## 🔌 Core API Endpoints

### FAQ Search API

```typescript
// convex/halalAssistant/faq.ts

import { v } from "convex/values";

import { mutation, query } from "../_generated/server";

// Search FAQs with semantic matching
export const searchFAQs = query({
  args: {
    query: v.string(),
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { query, category, limit = 5 } = args;

    // First try keyword search
    let results = await ctx.db
      .query("halal_faqs")
      .withSearchIndex("by_question", (q) => {
        let search = q.search("question", query);
        if (category) {
          search = search.filter((f) => f.eq("category", category));
        }
        return search;
      })
      .take(limit);

    // If no good results, try vector search
    if (results.length === 0) {
      const embedding = await generateEmbedding(query);
      results = await ctx.db
        .query("halal_faqs")
        .withVectorIndex("by_embedding", (q) => q.vector("embedding", embedding).limit(limit))
        .collect();
    }

    return results;
  },
});

// Get FAQ by ID
export const getFAQ = query({
  args: { faqId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("halal_faqs")
      .filter((q) => q.eq(q.field("faqId"), args.faqId))
      .first();
  },
});

// Track FAQ usage
export const trackFAQUsage = mutation({
  args: { faqId: v.string() },
  handler: async (ctx, args) => {
    const faq = await ctx.db
      .query("halal_faqs")
      .filter((q) => q.eq(q.field("faqId"), args.faqId))
      .first();

    if (faq) {
      await ctx.db.patch(faq._id, {
        usageCount: faq.usageCount + 1,
      });
    }
  },
});
```

### Ingredient Check API

```typescript
// convex/halalAssistant/ingredients.ts

import { v } from "convex/values";

import { query } from "../_generated/server";

// Search ingredient by name or E-code
export const checkIngredient = query({
  args: {
    query: v.string(), // Name or E-code
  },
  handler: async (ctx, args) => {
    const searchQuery = args.query.toLowerCase();

    // Check if it's an E-code
    if (searchQuery.match(/^e\d+/i)) {
      const result = await ctx.db
        .query("halal_ingredients")
        .withIndex("by_ecode", (q) => q.eq("ecode", searchQuery.toUpperCase()))
        .first();

      if (result) return result;
    }

    // Search by name
    const results = await ctx.db
      .query("halal_ingredients")
      .withSearchIndex("by_name", (q) => q.search("name", searchQuery))
      .take(5);

    return results[0] || null;
  },
});

// Get ingredients by status
export const getIngredientsByStatus = query({
  args: {
    status: v.string(), // 'HALAL' | 'HARAM' | 'SYUBHAT'
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("halal_ingredients")
      .withIndex("by_status", (q) => q.eq("halalStatus", args.status))
      .take(args.limit || 50);
  },
});

// Get E-code reference
export const getEcodeReference = query({
  args: {},
  handler: async (ctx) => {
    const allIngredients = await ctx.db
      .query("halal_ingredients")
      .filter((q) => q.neq(q.field("ecode"), null))
      .collect();

    return {
      halal: allIngredients.filter((i) => i.halalStatus === "HALAL"),
      needVerification: allIngredients.filter((i) => i.halalStatus === "SYUBHAT"),
      haram: allIngredients.filter((i) => i.halalStatus === "HARAM"),
    };
  },
});
```

### Chat API with Hybrid Response

```typescript
// convex/halalAssistant/chat.ts

import { v } from "convex/values";

import { api } from "../_generated/api";
import { action, mutation, query } from "../_generated/server";

// Send message with hybrid FAQ/LLM response
export const sendMessage = action({
  args: {
    sessionId: v.id("halal_chat_sessions"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    // Save user message
    const userMessageId = await ctx.runMutation(api.halalAssistant.chat.saveMessage, {
      sessionId: args.sessionId,
      role: "user",
      content: args.content,
    });

    // Get user context (assessment results)
    const session = await ctx.runQuery(api.halalAssistant.chat.getSession, {
      sessionId: args.sessionId,
    });

    let assessmentContext = null;
    if (session.assessmentId) {
      assessmentContext = await ctx.runQuery(api.siapHalal.getAssessment, {
        assessmentId: session.assessmentId,
      });
    }

    // Step 1: Try FAQ matching
    const faqResults = await ctx.runQuery(api.halalAssistant.faq.searchFAQs, {
      query: args.content,
      limit: 3,
    });

    const bestMatch = faqResults[0];
    const matchScore = calculateMatchScore(args.content, bestMatch?.question);

    let response: AssistantResponse;

    if (matchScore >= 0.75) {
      // Use FAQ answer
      response = {
        content: formatFAQResponse(bestMatch, assessmentContext),
        type: "faq_match",
        faqId: bestMatch.faqId,
        matchScore,
      };

      // Track FAQ usage
      await ctx.runMutation(api.halalAssistant.faq.trackFAQUsage, {
        faqId: bestMatch.faqId,
      });
    } else {
      // Fallback to LLM
      const llmResponse = await generateLLMResponse(
        args.content,
        assessmentContext,
        faqResults, // Provide partial matches as context
      );

      response = {
        content: llmResponse,
        type: "llm_fallback",
        matchScore,
      };
    }

    // Save assistant response
    await ctx.runMutation(api.halalAssistant.chat.saveMessage, {
      sessionId: args.sessionId,
      role: "assistant",
      content: response.content,
      responseType: response.type,
      faqId: response.faqId,
      matchScore: response.matchScore,
    });

    // Track analytics
    await ctx.runMutation(api.halalAssistant.analytics.trackEvent, {
      eventType: response.type,
      eventData: {
        query: args.content,
        matchScore,
        faqId: response.faqId,
      },
    });

    return response;
  },
});

// Format FAQ response with context
function formatFAQResponse(faq: FAQ, assessmentContext: Assessment | null): string {
  let response = faq.answer;

  // Add personalized context if assessment available
  if (assessmentContext) {
    const score = assessmentContext.overallScore;

    if (score < 50) {
      response +=
        "\n\n💡 **Berdasarkan hasil assessment Anda**, ada beberapa area yang perlu diperbaiki sebelum mengajukan sertifikasi. Gunakan fitur **Siap Halal** untuk melihat rekomendasi lengkap.";
    } else if (score < 80) {
      response +=
        "\n\n💡 **Berdasarkan hasil assessment Anda**, Anda sudah cukup siap. Pastikan untuk melengkapi dokumen yang masih kurang.";
    } else {
      response += "\n\n✅ **Berdasarkan hasil assessment Anda**, Anda sudah sangat siap untuk mengajukan sertifikasi halal!";
    }
  }

  // Add source reference
  response += `\n\n📚 *Sumber: ${faq.source}*`;

  return response;
}

// Generate LLM response with disclaimer
async function generateLLMResponse(query: string, assessmentContext: Assessment | null, partialMatches: FAQ[]): Promise<string> {
  const systemPrompt = buildSystemPrompt(assessmentContext);
  const contextPrompt = buildContextFromPartialMatches(partialMatches);

  const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "system", content: contextPrompt },
        { role: "user", content: query },
      ],
      temperature: 0.3,
      max_tokens: 500,
    }),
  });

  const result = await response.json();
  const aiResponse = result.choices[0].message.content;

  // Add disclaimer
  return `${aiResponse}

---
⚠️ **Disclaimer:**
Jawaban ini dihasilkan oleh AI berdasarkan pengetahuan umum. Untuk informasi resmi dan terkini:
- Website BPJPH: halal.go.id
- Call center: 1500-363
- Konsultasi LPH terdekat

Ada pertanyaan lain?`;
}
```

---

# 5. USER FLOW & WORKFLOW

## 🔄 Complete User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                   ASISTEN HALAL USER FLOW                       │
└─────────────────────────────────────────────────────────────────┘

[ASSESSMENT] → [ASISTEN HALAL] → [DOCUMENT PREP] → [CERTIFICATION]
     ↓              ↓                  ↓               ↓
  Siap Halal    FAQ + Chat         Dokumen Halal    Application
  Score         Ingredient Check   Templates        to BPJPH
```

### Step 1: Integration with Siap Halal Assessment

```typescript
interface AssessmentIntegration {
  // When user completes Siap Halal assessment
  onAssessmentComplete: (assessment: Assessment) => {
    // Link assessment to chat session
    // Provide personalized responses based on score
    // Highlight weak areas in recommendations
  };

  // Context available in chat
  assessmentContext: {
    overallScore: number;
    categoryScores: Record<string, number>;
    weakAreas: string[];
    recommendations: string[];
  };
}
```

### Step 2: Main Chat Interface

```
User: "Bagaimana cara daftar sertifikasi halal?"
    ↓
[FAQ Search] → Match found (score: 0.92)
    ↓
[Return FAQ Answer] + [Assessment Context]
    ↓
"Pendaftaran sertifikasi halal dilakukan melalui PTSP..."
+ "💡 Berdasarkan hasil assessment Anda (72/100)..."
```

### Step 3: Ingredient Checking

```
User: "Apakah E471 halal?"
    ↓
[Ingredient DB Search] → Found E471
    ↓
[Return Ingredient Info]
    ↓
"E471 (Mono- and Diglycerides) berstatus SYUBHAT.
Bisa dari lemak hewani atau nabati. Perlu verifikasi sumber.

✅ Alternatif halal: E471 dari minyak sawit (verified halal)

🔍 Yang perlu dicek:
- Minta sertifikat halal dari supplier
- Verifikasi sumber lemak
- Cek COA (Certificate of Analysis)"
```

## 📱 Screen-by-Screen Flow

### Screen 1: Asisten Halal Home

```
┌─────────────────────────────────────────┐
│ 💬 Asisten Halal                    ≡   │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ Skor Siap Halal: 72/100   [→]   │    │
│  │ ████████████░░░░ Cukup Siap     │    │
│  └─────────────────────────────────┘    │
│                                         │
│  💬 Tanya tentang sertifikasi halal     │
│  ┌─────────────────────────────────┐    │
│  │ "Ketik pertanyaan..."           │    │
│  └─────────────────────────────────┘    │
│                                         │
│  🔥 Pertanyaan Populer                  │
│  ┌─────────────────────────────────┐    │
│  │ • Cara daftar sertifikasi halal │    │
│  │ • Dokumen apa saja yang perlu?  │    │
│  │ • Berapa biaya sertifikasi?     │    │
│  │ • Apa itu SJPH?                 │    │
│  └─────────────────────────────────┘    │
│                                         │
│  🧪 Cek Bahan                           │
│  ┌─────────────────────────────────┐    │
│  │ [Cari bahan atau E-code...]     │    │
│  └─────────────────────────────────┘    │
│                                         │
│  📚 Quick Links                         │
│  [FAQ] [Panduan SJPH] [Daftar Bahan]    │
│                                         │
└─────────────────────────────────────────┘
```

### Screen 2: Chat Interface

```
┌─────────────────────────────────────────┐
│ ← Asisten Halal             🗑️ Clear    │
├─────────────────────────────────────────┤
│                                         │
│  🤖 Halo! Saya Asisten Halal SAH-in Aja!│
│     Ada yang bisa saya bantu tentang    │
│     sertifikasi halal?                  │
│                                         │
│                    Bagaimana cara  ▐    │
│                    daftar sertifikasi   │
│                    halal?          ▐    │
│                                         │
│  🤖 Pendaftaran sertifikasi halal       │
│     dilakukan melalui PTSP di           │
│     ptsp.halal.go.id. Langkahnya:       │
│                                         │
│     1. Buat akun di ptsp.halal.go.id    │
│     2. Lengkapi profil perusahaan       │
│     3. Upload dokumen SJPH              │
│     4. Tunggu verifikasi & jadwal audit │
│                                         │
│     💡 Berdasarkan assessment Anda      │
│     (72/100), Anda sudah cukup siap.    │
│     Pastikan lengkapi dokumen dulu.     │
│                                         │
│     📚 Sumber: BPJPH Official Guide     │
│                                         │
│  [Siapkan Dokumen] [Cek Biaya] [FAQ]    │
│                                         │
├─────────────────────────────────────────┤
│ [🧪] Ketik pertanyaan...         [Send] │
└─────────────────────────────────────────┘
```

### Screen 3: Ingredient Checker

```
┌─────────────────────────────────────────┐
│ ← Cek Bahan Halal                       │
├─────────────────────────────────────────┤
│                                         │
│  🔍 Cari bahan atau kode E              │
│  ┌─────────────────────────────────┐    │
│  │ E471                            │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ E471 - Mono & Diglycerides      │    │
│  │                                 │    │
│  │ Status: ⚠️ SYUBHAT              │    │
│  │                                 │    │
│  │ Alasan:                         │    │
│  │ Bisa dari lemak hewani (babi)   │    │
│  │ atau nabati. Perlu verifikasi.  │    │
│  │                                 │    │
│  │ ✅ Alternatif Halal:            │    │
│  │ • E471 dari minyak sawit        │    │
│  │ • Lecithin E322 (dari kedelai)  │    │
│  │                                 │    │
│  │ 🔍 Yang perlu dicek:            │    │
│  │ • Sertifikat halal supplier     │    │
│  │ • COA (Certificate of Analysis) │    │
│  │ • Sumber lemak (hewani/nabati)  │    │
│  │                                 │    │
│  │ 📦 Produk yang sering pakai:    │    │
│  │ Roti, Margarin, Es krim         │    │
│  └─────────────────────────────────┘    │
│                                         │
│  [Cari Supplier Halal] [Tanya Asisten]  │
│                                         │
└─────────────────────────────────────────┘
```

---

# 6. AI PIPELINE & PROMPT ENGINEERING

## 🧠 AI Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      AI PIPELINE FLOW                           │
└─────────────────────────────────────────────────────────────────┘

[User Input]
        │
        ▼
┌───────────────────┐
│  Intent Detection │ ◄── Is this about halal certification?
└────────┬──────────┘
         │
    ┌────┴────┐
    │  Type?  │
    └────┬────┘
         │
    ┌────┴────┬─────────────┐
    │         │             │
    ▼         ▼             ▼
┌───────┐ ┌───────────┐ ┌──────────┐
│ FAQ   │ │ Ingredient│ │ General  │
│ Query │ │ Check     │ │ Question │
└───┬───┘ └─────┬─────┘ └────┬─────┘
    │           │            │
    ▼           ▼            ▼
┌───────┐ ┌───────────┐ ┌──────────┐
│ FAQ   │ │ Ingredient│ │ LLM      │
│ Search│ │ DB Lookup │ │ Fallback │
└───┬───┘ └─────┬─────┘ └────┬─────┘
    │           │            │
    └───────────┴────────────┘
                │
                ▼
        ┌───────────────┐
        │ Add Context   │ ◄── Assessment results
        │ & Disclaimer  │
        └───────┬───────┘
                │
                ▼
        [Response to User]
```

## 📝 Core System Prompts

### Main Halal Assistant System Prompt

```typescript
const HALAL_ASSISTANT_SYSTEM_PROMPT = `Anda adalah **Asisten Halal AI SAH-in Aja!** - asisten khusus untuk membantu UMKM Indonesia dengan sertifikasi halal BPJPH/MUI.

## IDENTITAS
- Nama: Asisten Halal SAH-in Aja!
- Keahlian: Sertifikasi halal, SJPH HAS 23000, bahan halal, proses BPJPH
- Gaya: Ramah, informatif, dan praktis

## DOMAIN KEAHLIAN
1. **Proses Sertifikasi Halal**: Pendaftaran, dokumen, audit, timeline
2. **SJPH HAS 23000**: Komponen, persyaratan, dokumentasi
3. **Bahan & Ingredient**: Status halal, E-code, alternatif
4. **Fasilitas Produksi**: Persyaratan, pemisahan, SOP
5. **Industri Spesifik**: Makanan, kosmetik, farmasi

## ATURAN PENTING
1. ✅ HANYA jawab tentang sertifikasi halal dan topik terkait
2. ✅ Berikan informasi akurat dari sumber resmi (BPJPH, MUI, LPPOM)
3. ✅ Jika tidak yakin, katakan "Saya perlu memverifikasi informasi ini"
4. ✅ Selalu sarankan verifikasi ke BPJPH untuk keputusan penting
5. ❌ JANGAN memberikan fatwa halal/haram definitif
6. ❌ JANGAN menjawab di luar topik sertifikasi halal

## FORMAT JAWABAN
- Gunakan bullet points untuk clarity
- Bold untuk poin penting
- Berikan langkah praktis
- Cantumkan sumber jika ada
- Akhiri dengan pertanyaan follow-up atau CTA

## DISCLAIMER
Untuk setiap jawaban yang bukan dari FAQ terverifikasi, tambahkan:
"⚠️ Untuk informasi resmi, kunjungi halal.go.id atau hubungi 1500-363"

## BAHASA
- Bahasa Indonesia yang jelas dan mudah dipahami
- Istilah teknis halal dijelaskan dengan sederhana`;
```

### Intent Classification Prompt

```typescript
const INTENT_CLASSIFICATION_PROMPT = `Klasifikasikan pertanyaan user berikut:

Pertanyaan: "{user_message}"

Tentukan:
1. is_halal_related: boolean (apakah tentang sertifikasi halal?)
2. intent_type: 'faq' | 'ingredient_check' | 'document_help' | 'process_guide' | 'general' | 'off_topic'
3. specific_topic: string (topik spesifik)
4. requires_assessment_context: boolean (apakah perlu data assessment user?)

Output JSON:
{
  "is_halal_related": true/false,
  "intent_type": "...",
  "specific_topic": "...",
  "requires_assessment_context": true/false
}`;
```

### Ingredient Check Response Prompt

```typescript
const INGREDIENT_RESPONSE_PROMPT = `
Berdasarkan database bahan:

**{ingredient_name}** ({ecode})

Status: {halal_status}
Alasan: {status_reason}

Berikan respons yang informatif dengan format:
1. Status halal dengan penjelasan
2. Alasan status tersebut
3. Alternatif halal jika ada
4. Yang perlu diverifikasi
5. Produk yang umum menggunakan bahan ini

Gunakan emoji untuk visual appeal:
✅ = Halal
⚠️ = Syubhat/Perlu verifikasi
❌ = Haram`;
```

---

# 7. ACCURACY OPTIMIZATION

## 🎯 Accuracy Strategy

### Target: ≥92% Response Relevance & Accuracy

```
┌─────────────────────────────────────────────────────────────────┐
│              3-STAGE ACCURACY PIPELINE                          │
└─────────────────────────────────────────────────────────────────┘

[Stage 1: FAQ Quality]
    → 500+ curated FAQs from official BPJPH sources
    → Expert-verified answers
    → Regular updates (monthly)
    ↓
[Stage 2: Matching Precision]
    → Semantic search with embeddings
    → Keyword fallback
    → Confidence threshold (0.75)
    ↓
[Stage 3: LLM Safety]
    → Strict system prompt
    → Low temperature (0.3)
    → Always add disclaimer
```

## 📊 Quality Metrics

```typescript
interface QualityMetrics {
  // FAQ metrics
  faqCoverage: number; // % of queries matched to FAQ
  faqAccuracy: number; // % of FAQ answers verified correct

  // Ingredient metrics
  ingredientAccuracy: number; // % of ingredient status correct
  ingredientCoverage: number; // % of queries found in DB

  // Response metrics
  responseRelevance: number; // User rating of relevance
  helpfulnessRating: number; // User helpful/not helpful

  // Safety metrics
  llmFallbackRate: number; // % of queries using LLM
  disclaimerCompliance: number; // % of LLM responses with disclaimer
}

const TARGETS = {
  faqCoverage: 0.7, // 70% queries matched to FAQ
  faqAccuracy: 0.95, // 95% FAQ accuracy
  ingredientAccuracy: 0.98, // 98% ingredient status accuracy
  responseRelevance: 0.92, // 92% relevance rating
  helpfulnessRating: 0.9, // 90% helpful rating
};
```

---

# 8. ERROR HANDLING & EDGE CASES

## ⚠️ Error Taxonomy

```typescript
enum HalalAssistantErrorType {
  // Input errors
  EMPTY_MESSAGE = "EMPTY_MESSAGE",
  OFF_TOPIC = "OFF_TOPIC",

  // Search errors
  FAQ_NOT_FOUND = "FAQ_NOT_FOUND",
  INGREDIENT_NOT_FOUND = "INGREDIENT_NOT_FOUND",

  // AI errors
  LLM_TIMEOUT = "LLM_TIMEOUT",
  LLM_RATE_LIMIT = "LLM_RATE_LIMIT",

  // System errors
  DATABASE_ERROR = "DATABASE_ERROR",
}

const ERROR_RESPONSES: Record<HalalAssistantErrorType, string> = {
  EMPTY_MESSAGE: "Silakan ketik pertanyaan Anda tentang sertifikasi halal.",
  OFF_TOPIC: "Maaf, saya hanya bisa membantu tentang sertifikasi halal. Ada pertanyaan tentang sertifikasi halal?",
  FAQ_NOT_FOUND: "Saya akan mencoba menjawab berdasarkan pengetahuan umum...",
  INGREDIENT_NOT_FOUND: "Bahan tidak ditemukan di database. Silakan verifikasi langsung ke LPPOM MUI.",
  LLM_TIMEOUT: "Maaf, sistem sedang sibuk. Coba lagi dalam beberapa detik.",
};
```

## 🛡️ Edge Case Handlers

```typescript
// Handle off-topic questions
function handleOffTopic(query: string): string | null {
  const offTopicPatterns = [
    { pattern: /cuaca|weather/i, response: "Maaf, saya khusus untuk sertifikasi halal. Ada yang bisa saya bantu tentang halal?" },
    {
      pattern: /resep|masak/i,
      response: "Untuk resep masakan, silakan cari di sumber lain. Tapi kalau mau tanya bahan halal, saya bisa bantu!",
    },
    { pattern: /politik|pemilu/i, response: "Maaf, saya tidak bisa membahas politik. Fokus saya adalah sertifikasi halal." },
  ];

  for (const { pattern, response } of offTopicPatterns) {
    if (pattern.test(query)) return response;
  }
  return null;
}

// Handle uncertain ingredient status
function handleUncertainIngredient(ingredientName: string): string {
  return `Saya tidak menemukan "${ingredientName}" di database.

**Yang bisa Anda lakukan:**
1. Periksa ejaan atau nama alternatif
2. Cek di website LPPOM MUI: halalmuindo.com
3. Minta sertifikat halal dari supplier
4. Konsultasi ke LPH terdekat

Mau saya bantu dengan bahan lain?`;
}
```

---

# 9-18. REMAINING SECTIONS

The remaining sections (Security, Performance, UI/UX, Dashboard, PWA, QA, Features, Roadmap, Best Practices, Risk Analysis) follow the same structure as the original document but with halal-specific content. Key differences:

## Security Highlights

- Protect user assessment data
- No storage of sensitive business information
- Anonymize analytics data

## Performance Targets

- FAQ response: <2 seconds
- LLM fallback: <3 seconds
- Ingredient lookup: <1 second

## UI/UX Focus

- Simple chat interface
- Quick access to ingredient checker
- Integration with Siap Halal assessment
- Popular questions shortcut

## Key Features Not Thought Of

1. **Halal Supplier Directory** - Verified halal-certified suppliers
2. **Certification Tracker** - Track application progress
3. **Audit Preparation Checklist** - Interactive checklist for audit day
4. **Community Forum** - Connect with other UMKMs going through certification
5. **Expert Consultation** - Book sessions with halal consultants
6. **Document Review** - AI-assisted SJPH document review

## Implementation Roadmap (7-Day MVP)

```
Day 1: Foundation
├── Database schema (faqs, ingredients, sessions)
├── FAQ data seeding (100+ essential FAQs)
└── Basic chat UI

Day 2: FAQ System
├── FAQ search implementation
├── Semantic search with embeddings
└── Response formatting

Day 3: Ingredient Checker
├── Ingredient database seeding (500+ items)
├── E-code reference system
└── Ingredient check UI

Day 4: LLM Integration
├── NVIDIA API integration
├── Fallback logic implementation
└── Disclaimer system

Day 5: Assessment Integration
├── Link to Siap Halal results
├── Personalized responses
└── Context-aware answers

Day 6: Polish & PWA
├── UI refinements
├── Offline FAQ support
└── Error handling

Day 7: Testing & Deploy
├── FAQ accuracy testing
├── Ingredient verification
├── Production deployment
```

---

# 📋 SUMMARY

## Asisten Halal Complete Plan - Key Highlights

| Aspect                | Details                                          |
| --------------------- | ------------------------------------------------ |
| **Core Features**     | FAQ Chat, Ingredient Checker, SJPH Guide         |
| **Knowledge Base**    | 500+ curated halal FAQs, 1000+ ingredients       |
| **Accuracy Target**   | ≥92% response relevance                          |
| **Response Time**     | <2s FAQ, <3s LLM                                 |
| **Response Strategy** | Hybrid: FAQ first → LLM fallback with disclaimer |
| **Integration**       | Siap Halal assessment, Dokumen Halal templates   |
| **Industries**        | Food, Cosmetics, Pharmaceuticals, Fashion        |

## Key Differentiators

1. **Halal-Only Focus**: Unlike generic chatbots, exclusively for halal certification
2. **Official Sources**: All FAQs verified from BPJPH/MUI sources
3. **Ingredient Database**: Comprehensive E-code and ingredient checker
4. **Assessment Integration**: Personalized responses based on Siap Halal results
5. **Safety First**: Disclaimers on AI-generated content, no definitive fatwa

---

**Document Version**: 3.0.0
**Last Updated**: 2024-12-02
**Status**: Ready for Implementation
