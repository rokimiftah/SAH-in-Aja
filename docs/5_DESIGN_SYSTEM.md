# **Design System: SAH-in Aja!**

## **1. Tipografi**

Gaya huruf yang digunakan adalah **Rounded Sans-Serif** (mirip dengan 'Nunito' atau 'Poppins') untuk kesan ramah dan modern.

- **Judul Utama (H1):** 28px - 32px Bold (Hitam)
- **Sub-Judul (H2):** 18px - 20px Semi-Bold (Hitam)
- **Teks Isi (Body):** 14px - 16px Regular (Hitam)
- **Teks Tombol (Button):** 16px - 18px Bold (Putih)
- **Judul Kartu Fitur (H3):** 18px Bold (Putih, sesuai warna kartu)
- **Teks Kartu Peringatan:** 14px Regular (Hitam)
- **Teks Footer:** 12px - 14px Regular (Abu-abu tua)

---

## **2. Palet Warna**

Palet warna yang digunakan cerah, hangat, dan ramah, dengan warna dasar krem yang lembut.

### **Warna Dasar (Background)**

- **Latar Belakang Utama:** Krem Hangat (`#FEFBEA` atau `#FDFBF3`)

### **Warna Aksen Utama (Tiga Pilar)**

- **Siap Halal (Hijau):** Hijau Zamrud (`#00A884` atau `#19AC93`)
- **Dokumen Halal (Biru):** Biru Langit Cerah (`#3D7FFF` atau `#3F78E0`)
- **Asisten Halal (Oranye):** Oranye Keemasan (`#F5A623` atau `#EF9802`)

### **Warna Peringatan & Informasi**

- **Peringatan (Warning):** Kuning Terang (`#FAD02C` atau `#FFCC00`)
- **Informasi (Merah Muda):** Merah Muda Cerah (`#FF6B6B` - untuk kartu '85% Transaksi')

### **Warna Teks & Ikon**

- **Teks Utama (Hitam):** Hitam Pekat (`#333333` atau `#222222`)
- **Ikon (Abu-abu/Hitam):** Abu-abu Gelap (`#666666` atau `#555555`)
- **Teks Putih (Tombol):** Putih Bersih (`#FFFFFF`)

---

## **3. Layout & Grid**

Website menggunakan layout mobile-first satu kolom (single-column) yang bersih.

- **Struktur Halaman:**
  - **Header:** Sticky di bagian atas dengan logo dan menu hamburger.
  - **Hero Section:** Ilustrasi utama, judul besar, deskripsi singkat, dan tombol CTA.
  - **Section "Kenapa Ini Penting Banget?":** Grid horizontal 3 kolom untuk kartu poin masalah.
  - **Section "3 Jurus SAH-in Aja!":** Tumpukan vertikal 3 kartu fitur besar dengan warna berbeda.
  - **Section "Semudah 1-2-3":** Timeline vertikal 3 langkah.
  - **Footer:** Kotak peringatan dan teks hak cipta di bagian bawah.
- **Padding & Margin:** Penggunaan white space yang konsisten untuk memisahkan section dan elemen, membuat konten mudah dibaca.

---

## **4. Komponen UI**

Komponen UI dirancang dengan gaya **Rounded (Tumpul)** dan ramah.

- **Tombol (Buttons):**
  - Bentuk: Rounded Rectangle (persegi panjang tumpul).
  - Warna: Mengikuti warna aksen utama (Hijau, Biru, Oranye).
  - Teks: Putih, tebal, sering dengan ikon panah di sampingnya.
- **Kartu (Cards):**
  - Bentuk: Rounded Rectangle dengan bayangan tipis untuk kedalaman.
  - Jenis: Kartu Poin Masalah, Kartu Fitur Besar (dengan judul putih di header), Kartu Peringatan.
- **Timeline (Alur Pengguna):**
  - Bentuk: Tiga node lingkaran berwarna (Hijau, Biru, Oranye) yang dihubungkan oleh garis vertikal tipis.
- **Ikon:**
  - Gaya: Ilustrasi datar (flat illustration) dengan garis luar yang ramah dan warna senada.
- **Input & Kontrol:**
  - Checklist: Menggunakan ikon centang putih di dalam lingkaran berwarna (sesuai kartu fitur).
  - Slider Navigasi: Titik-titik kecil di bawah kartu "Kenapa Ini Penting Banget?".

---

# **Design System: SAH-in Aja\! (Bagian 2: Implementasi)**

## **5. Variabel CSS (Design Tokens)**

Untuk memastikan konsistensi di seluruh kode, berikut adalah definisi variabel CSS berdasarkan palet warna dan tipografi yang telah ditentukan sebelumnya. Ini bisa langsung digunakan dalam file CSS utama atau konfigurasi Tailwind.

```css
:root {
  /* --- Palet Warna --- */
  /* Background */
  --color-bg-cream: #fefbea; /* Krem Hangat */

  /* Brand Primary Colors (Tiga Pilar) */
  --color-primary-green: #00a884; /* Siap Halal */
  --color-primary-blue: #3d7fff; /* Dokumen Halal */
  --color-primary-orange: #f5a623; /* Asisten Halal */

  /* Status & Aksen */
  --color-warning-yellow: #fad02c; /* Peringatan */
  --color-accent-pink: #ff6b6b; /* Kartu Masalah 1 */

  /* Neutral */
  --color-text-dark: #333333; /* Teks Utama */
  --color-text-muted: #666666; /* Subteks/Footer */
  --color-white: #ffffff; /* Teks Tombol/Kartu */

  /* --- Tipografi --- */
  /* Gunakan font rounded seperti Nunito, Quicksand, atau Poppins */
  --font-family-base: "Nunito", sans-serif;

  /* Skala Ukuran Font */
  --text-h1: 28px;
  --text-h2: 20px;
  --text-h3: 18px;
  --text-body: 16px;
  --text-small: 14px;
  --text-caption: 12px;

  /* --- Border Radius (Gaya Rounded) --- */
  --radius-button: 50px; /* Bulat penuh untuk tombol */
  --radius-card: 16px; /* Sudut tumpul untuk kartu */
  --radius-box: 12px; /* Sudut tumpul untuk kotak peringatan */
}
```

---

## **6. Spesifikasi Komponen Utama**

Berikut adalah detail teknis untuk membangun komponen UI utama agar sesuai dengan desain.

### **A. Tombol Utama (Primary Button)**

Tombol aksi utama yang besar dan menonjol (misal: "Mulai Cek Gratis" atau tombol di dalam kartu pilar).

- **Bentuk:** _Full Rounded_ (Pil).
- **Tinggi:** \~48px - 56px (untuk area sentuh mobile yang nyaman).
- **Padding Horizontal:** 24px - 32px.
- **Border Radius:** `50px` (atau nilai yang cukup besar untuk membuatnya bulat sempurna di ujung).
- **Tipografi:** 16px atau 18px, **Bold**, warna Putih.
- **Ikon:** Sering menggunakan ikon panah kanan (`→`) di sebelah teks.
- **Contoh Variasi:**
  - `btn-green`: Background `--color-primary-green`
  - `btn-blue`: Background `--color-primary-blue`
  - `btn-orange`: Background `--color-primary-orange`

### **B. Kartu Fitur (Feature Card)**

Kartu besar yang merepresentasikan tiga pilar utama.

- **Container:**
  - Background: Putih (`#FFFFFF`) atau warna pilar yang sangat muda.
  - Border Radius: `16px`.
  - Box Shadow: Bayangan halus (misal: `0 4px 12px rgba(0,0,0,0.08)`).
  - Overflow: `hidden` (agar header berwarna tidak keluar sudut).
- **Header Kartu:**
  - Background: Warna pilar solid (Hijau/Biru/Oranye).
  - Padding: \~16px - 20px.
  - Konten: Ikon outline putih + Judul H3 Putih Bold.
- **Body Kartu:**
  - Padding: \~20px.
  - Konten: Teks deskripsi + Checklist item.

### **C. Checklist Item**

Item poin-poin di dalam kartu fitur.

- **Ikon:** Lingkaran solid berwarna pilar (diameter \~20px) berisi ikon centang putih.
- **Teks:** 14px - 16px Regular, warna `--color-text-dark`.
- **Jarak:** Margin kanan pada ikon \~8px.

### **D. Timeline (User Journey)**

Alur vertikal "Semudah 1-2-3".

- **Node (Titik):** Lingkaran solid (diameter \~32px - 40px) berisi teks "Step X" berwarna putih. Warna node mengikuti urutan pilar (Hijau -\> Biru -\> Oranye).
- **Garis Konektor:** Garis vertikal tipis (\~2px) solid, warna abu-abu muda, menghubungkan antar node.
- **Konten:** Judul langkah (Bold) dan deskripsi (Regular) diletakkan di sebelah kanan node.

### **E. Kotak Peringatan (Disclaimer Box)**

- **Background:** Kuning Terang (`--color-warning-yellow`).
- **Border:** Border tipis (\~1px - 2px) dengan warna kuning yang sedikit lebih gelap atau oranye.
- **Border Radius:** `12px`.
- **Padding:** \~16px.
- **Ikon:** Ikon segitiga peringatan outline hitam/gelap di kiri atas.

---

## **7. Gaya Ilustrasi & Ikon (Brand Assets Guide)**

Agar desain tetap konsisten jika ada penambahan aset baru:

- **Gaya Ilustrasi:** Flat Design, ramah, ceria, dan bersih. Menggunakan _outline_ (garis luar) hitam tipis yang tidak kaku.
- **Karakter:** Manusia dengan proporsi yang sedikit _chibi_ (kepala agak besar), ekspresi tersenyum ramah.
- **Pewarnaan Aset:** Menggunakan palet warna utama brand, ditambah warna-warna sekunder yang hangat. Hindari gradien yang kompleks, gunakan warna solid atau shading minimalis.
- **Ikon UI:** Menggunakan gaya _outline_ (garis) dengan ketebalan sedang, sudut tumpul (rounded corners), memberikan kesan bersahabat.
