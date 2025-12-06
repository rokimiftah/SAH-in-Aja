# Deployment Guide

Panduan untuk menjalankan backend Convex, baik self-hosted dengan Docker maupun menggunakan Convex Managed (Cloud).

---

## Daftar Isi

- [Opsi 1: Convex Self-Hosted (Docker)](#opsi-1-convex-self-hosted-docker)
- [Opsi 2: Convex Managed (Cloud)](#opsi-2-convex-managed-cloud)
- [Konfigurasi Frontend](#konfigurasi-frontend)
- [Environment Variables Reference](#environment-variables-reference)

---

## Opsi 1: Convex Self-Hosted (Docker)

Menjalankan backend Convex di server sendiri menggunakan Docker.

### Prerequisites

- Docker >= 20.10
- Docker Compose >= 2.0
- VPS/Server dengan minimal 2GB RAM
- Domain dengan SSL (untuk production)

### Langkah-langkah

#### 1. Setup Environment

```bash
cd docker

# Copy dan edit environment file
cp .env.example env
nano env
```

Edit file `env`:

```env
INSTANCE_NAME="sah-in-aja"
CONVEX_CLOUD_ORIGIN="https://your-domain.com:3220"
CONVEX_SITE_ORIGIN="https://your-domain.com:3221"
```

#### 2. Jalankan Docker Compose

```bash
# Jalankan di background
docker compose up -d

# Cek status
docker compose ps

# Lihat logs
docker compose logs -f
```

#### 3. Generate Admin Key

```bash
# Jalankan script untuk generate admin key
./get-admin-key.sh

# Atau manual:
docker compose exec backend ./generate_admin_key.sh
```

Simpan admin key yang dihasilkan, akan digunakan untuk deploy.

#### 4. Deploy Schema dan Functions

Dari root project:

```bash
# Set environment variables
export CONVEX_SELF_HOSTED_URL="https://your-domain.com:3220"
export CONVEX_SELF_HOSTED_ADMIN_KEY="your-admin-key"

# Deploy ke self-hosted
bunx convex deploy --admin-key $CONVEX_SELF_HOSTED_ADMIN_KEY --url $CONVEX_SELF_HOSTED_URL
```

#### 5. Set Environment Variables di Convex Dashboard

Buka dashboard di `https://your-domain.com:6796` dan set environment variables:

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

### Port yang Digunakan

| Port | Service      | Keterangan                          |
| ---- | ------------ | ----------------------------------- |
| 3220 | Backend API  | Convex backend (mapped from 3210)   |
| 3221 | Site/Actions | HTTP actions (mapped from 3211)     |
| 6796 | Dashboard    | Convex dashboard (mapped from 6791) |

### Docker Compose Services

| Service   | Image                               | Keterangan                 |
| --------- | ----------------------------------- | -------------------------- |
| backend   | ghcr.io/get-convex/convex-backend   | Convex backend server      |
| dashboard | ghcr.io/get-convex/convex-dashboard | Web dashboard untuk manage |

### Maintenance Commands

```bash
# Stop services
docker compose down

# Restart services
docker compose restart

# Update images
docker compose pull
docker compose up -d

# Lihat logs backend
docker compose logs -f backend

# Backup data
docker compose exec backend tar -czf /tmp/backup.tar.gz /convex/data
docker cp $(docker compose ps -q backend):/tmp/backup.tar.gz ./backup.tar.gz
```

---

## Opsi 2: Convex Managed (Cloud)

Menggunakan Convex Cloud yang di-manage oleh Convex (lebih mudah, tanpa perlu manage server).

### Prerequisites

- Akun Convex di [convex.dev](https://convex.dev)
- Convex CLI terinstall

### Langkah-langkah

#### 1. Login ke Convex

```bash
bunx convex login
```

#### 2. Inisialisasi Project

```bash
# Jika project baru
bunx convex init

# Jika sudah ada project, link ke existing
bunx convex dev
```

#### 3. Deploy

```bash
# Development
bunx convex dev

# Production
bunx convex deploy
```

#### 4. Set Environment Variables

Buka [Convex Dashboard](https://dashboard.convex.dev), pilih project, lalu Settings > Environment Variables:

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

## Konfigurasi Frontend

### Untuk Convex Self-Hosted

Buat file `.env.local` di root project:

```env
# Convex Self-Hosted
CONVEX_SELF_HOSTED_URL="https://your-domain.com:3220"
CONVEX_SELF_HOSTED_ADMIN_KEY="your-admin-key-from-step-3"
PUBLIC_CONVEX_URL="https://your-domain.com:3220"
```

### Untuk Convex Managed (Cloud)

Buat file `.env.local` di root project:

```env
# Convex Managed
CONVEX_DEPLOYMENT="dev:nama-proyek-anda"
PUBLIC_CONVEX_URL="https://url-proyek-anda.convex.cloud"
```

Nilai `CONVEX_DEPLOYMENT` dan `PUBLIC_CONVEX_URL` bisa dilihat di Convex Dashboard setelah project dibuat.

---

## Environment Variables Reference

### Frontend (.env.local)

| Variable                       | Self-Hosted | Managed  | Keterangan                |
| ------------------------------ | ----------- | -------- | ------------------------- |
| `CONVEX_SELF_HOSTED_URL`       | Required    | -        | URL backend self-hosted   |
| `CONVEX_SELF_HOSTED_ADMIN_KEY` | Required    | -        | Admin key untuk deploy    |
| `PUBLIC_CONVEX_URL`            | Required    | Required | URL publik Convex         |
| `CONVEX_DEPLOYMENT`            | -           | Required | Nama deployment (dev:xxx) |

### Backend (Convex Dashboard / Environment)

| Variable             | Keterangan                            |
| -------------------- | ------------------------------------- |
| `AUTH_GOOGLE_ID`     | Google OAuth Client ID                |
| `AUTH_GOOGLE_SECRET` | Google OAuth Client Secret            |
| `JWKS`               | JSON Web Key Set untuk auth           |
| `JWT_PRIVATE_KEY`    | Private key untuk JWT                 |
| `SITE_URL`           | URL frontend (untuk callback)         |
| `KOLOSAL_API_KEY`    | API key Kolosal (kol\_\_xxx)          |
| `RESEND_API_KEY`     | API key Resend untuk email (optional) |

---

## Perbandingan Self-Hosted vs Managed

| Aspek             | Self-Hosted              | Managed               |
| ----------------- | ------------------------ | --------------------- |
| **Setup**         | Lebih kompleks           | Sangat mudah          |
| **Biaya**         | Biaya server sendiri     | Free tier available   |
| **Maintenance**   | Perlu manage sendiri     | Fully managed         |
| **Scaling**       | Manual                   | Otomatis              |
| **Data Location** | Di server sendiri        | Convex cloud          |
| **Cocok untuk**   | Full control, compliance | Prototype, production |

---

## Troubleshooting

### Docker: Backend tidak start

```bash
# Cek logs
docker compose logs backend

# Cek disk space
df -h

# Restart
docker compose restart backend
```

### Docker: Tidak bisa connect ke backend

1. Pastikan port 3220, 3221, 6796 tidak diblokir firewall
2. Cek apakah service running: `docker compose ps`
3. Cek health: `curl http://localhost:3220/version`

### Convex Managed: Deploy gagal

```bash
# Clear cache dan retry
rm -rf .convex
bunx convex dev
```

### Admin key tidak bisa di-generate

```bash
# Pastikan backend sudah healthy
docker compose ps

# Tunggu beberapa detik setelah start
sleep 10
./get-admin-key.sh
```

---

## Links

- [Convex Documentation](https://docs.convex.dev)
- [Convex Self-Hosting Guide](https://docs.convex.dev/self-hosting)
- [Docker Documentation](https://docs.docker.com)
