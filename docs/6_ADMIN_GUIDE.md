# 6. ADMIN DASHBOARD & MANAGEMENT

> **Status**: ✅ Completed
> **Tech**: React 19, Wouter, Convex, Tailwind CSS
> **Role Access**: `role: "admin"` only

## 1. Overview

Admin Dashboard ("SAH-in Admin") adalah pusat kontrol untuk pengelola platform SAH-in Aja!. Fitur ini memungkinkan admin untuk memantau pertumbuhan pengguna, mengelola akses, dan mendistribusikan kode promo untuk kredit tambahan.

Akses URL: `/admin` (Redirect otomatis ke `/dashboard` jika bukan admin).

## 2. Fitur Utama

### 2.1. Dashboard Overview

Halaman utama yang menampilkan statistik vital platform secara real-time.

**Metrics:**

- **Total Users**: Jumlah pengguna terdaftar (+ trend pertumbuhan).
- **Total Scans**: Total analisis Siap Halal yang telah dilakukan.
- **Documents Generated**: Jumlah dokumen SJPH yang telah dibuat.

**Quick Actions:**

- Create Promo: Shortcut untuk membuat kode promo baru.
- Manage Users: Shortcut ke daftar pengguna.

### 2.2. User Management

Halaman untuk melihat dan memfilter database pengguna.

**Fitur:**

- **Search**: Cari user berdasarkan Nama atau Email.
- **Filter**: Filter berdasarkan Role (All, Admin, User).
- **User Card**: Menampilkan:
  - Avatar & Nama
  - Email & No. HP
  - Nama Usaha (Business Name)
  - Tanggal Bergabung
  - Role Badge (Admin/User)

### 2.3. Promo Codes

Sistem manajemen kredit berbasis kode promo. Digunakan untuk event, workshop, atau reward pengguna.

**Schema (`promo_codes`):**

```typescript
{
  code: string,        // Unique code (e.g., "WORKSHOP2025")
  credits: number,     // Jumlah kredit yang diberikan
  maxUsage: number,    // Batas maksimal penukaran (opsional)
  usageCount: number,  // Jumlah yang sudah ditukarkan
  expiresAt: number,   // Timestamp kadaluarsa (opsional)
  isActive: boolean    // Toggle on/off manual
}
```

**Flow Penggunaan:**

1. Admin membuat kode di `/admin/promos`.
2. User memasukkan kode di menu Profile Sidebar (`Apply Promo`).
3. Kredit user bertambah instan (melebihi limit harian standar).

## 3. Security & Access Control

### 3.1. Role-Based Access Control (RBAC)

Sistem menggunakan field `role` pada tabel `users`.

- `role: "admin"`: Akses penuh ke `/admin/*` dan `/dashboard/*`.
- `role: "user"` (or undefined): Akses hanya ke `/dashboard/*`.

### 3.2. Protected Routes

Implementasi di `src/app/App.tsx`:

```tsx
<AdminRoute>
  <AdminLayout>
    <Switch>
      <Route path="/admin" component={DashboardPage} />
      {/* ... other admin routes */}
    </Switch>
  </AdminLayout>
</AdminRoute>
```

**Logic `AdminRoute`:**

1. Cek autentikasi user.
2. Query data user dari database (`api.users.getCurrentUser`).
3. Jika `user.role !== "admin"`, redirect ke `/dashboard`.
4. Jika belum login, redirect ke login page.

### 3.3. Menambahkan Admin Baru (Manual)

Saat ini belum ada UI untuk mengubah role user menjadi admin. Penambahan admin dilakukan secara manual melalui Convex Dashboard atau script maintenance.

**Cara 1: Via Convex Dashboard**

1. Buka [dashboard.convex.dev](https://dashboard.convex.dev).
2. Pilih project `sah-in-aja`.
3. Masuk ke menu **Data** > Table `users`.
4. Cari user yang akan dijadikan admin.
5. Edit row tersebut, tambahkan/ubah field `role` menjadi `"admin"`.

**Cara 2: Via Maintenance Script**
Telah disediakan internal mutation di `convex/maintenance.ts` untuk promosi user.

```typescript
// Jalankan via Convex Dashboard Functions (Run Function)
// Function: maintenance:promoteToAdmin
{
  "email": "user@example.com"
}
```

## 4. UI/UX Guidelines

Dashboard Admin mengikuti design system yang sama dengan User Dashboard untuk konsistensi, namun dengan nuansa yang lebih padat data.

- **Layout**: Sidebar navigation (Desktop: fixed left, Mobile: drawer).
- **Mobile Responsive**: Semua tabel dan form dioptimalkan untuk layar kecil (horizontal scroll, card layouts).
- **Feedback**: Toast notifications untuk sukses/gagal aksi (Create Promo, Copy Code).
- **Loading States**: Skeleton loading atau spinner saat fetching data statistik.

## 5. Future Roadmap (Admin)

- [ ] **Content Management**: Edit artikel/panduan Asisten Halal.
- [ ] **User Details**: View detail scan history pengguna tertentu (untuk support).
- [ ] **Broadcast**: Kirim notifikasi ke semua user.
- [ ] **Export Data**: Download data user/usage ke CSV/Excel.
