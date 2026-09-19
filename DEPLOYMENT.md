# Deploy Frontend (React + Vite)

Panduan upload `money-management-frontend`. Ini aplikasi statis (hasil `npm run build` cuma HTML/CSS/JS), jadi bisa di-hosting di mana saja yang bisa serve file statis — tidak butuh Node.js jalan di server produksi.

## Pilihan hosting (dari paling gampang)

| Opsi | Kecepatan setup | Biaya |
|---|---|---|
| **IDWebhost (cPanel)** ✅ dipakai sekarang | Upload manual, lihat "Opsi E" di bawah | Sudah punya |
| **Vercel** | Tinggal connect repo GitHub, auto-deploy tiap push | Gratis untuk personal project |
| **Netlify** | Sama gampangnya dengan Vercel | Gratis untuk personal project |
| **Cloudflare Pages** | Sama, plus CDN cepat | Gratis |

## Opsi E: IDWebhost (cPanel) — sesuai hosting kamu sekarang

Frontend ini hasil build-nya cuma file statis (HTML/CSS/JS), jadi paling gampang dari semua opsi — tinggal upload ke `public_html`, tidak perlu Node.js jalan di server.

### 1. Build di laptop, arahkan ke backend produksi

Backend kamu di IDWebhost juga (lihat `DEPLOYMENT.md` repo backend) biasanya di subdomain, misal `api.namadomain.com`. Set itu sebagai target API sebelum build:

```bash
cd money-management-frontend
echo "VITE_API_BASE_URL=https://api.namadomain.com/api" > .env.production
npm install
npm run build
```

Ini menghasilkan folder `dist/` isinya `index.html`, `assets/`, dll — inilah yang diupload, **bukan** folder project mentah.

### 2. Tentukan lokasi upload

- Kalau frontend jadi domain utama (`namadomain.com`) → upload isi `dist/` ke `public_html/` langsung.
- Kalau frontend mau di subdomain (misal `app.namadomain.com`) sementara domain utama dipakai lain → cPanel **Domains → Subdomains**, buat subdomain dengan document root default (misal `app_namadomain_com` atau sesuai saran cPanel), lalu upload ke situ.

### 3. Upload lewat File Manager

1. Zip **isi dalam folder `dist/`** (bukan folder `dist` itu sendiri — supaya pas diekstrak, `index.html` langsung ada di root, bukan di dalam subfolder `dist/`).
2. cPanel → **File Manager** → masuk ke `public_html` (atau folder subdomain tadi).
3. Kalau upload ulang (redeploy), hapus dulu isi lama (`index.html`, folder `assets/` versi lama) supaya tidak numpuk file basi dengan hash beda.
4. Upload zip → klik kanan → **Extract**.
5. Pastikan struktur akhir: `public_html/index.html`, `public_html/assets/...` — bukan `public_html/dist/index.html`.

Alternatif: pakai **FTP** (cPanel → **FTP Accounts** → buat akun FTP, connect pakai FileZilla) kalau lebih nyaman drag-and-drop daripada zip-extract.

### 4. Aktifkan SSL

cPanel → **SSL/TLS Status** → centang domain/subdomain frontend → **Run AutoSSL**. Tunggu sampai statusnya aktif, lalu akses selalu lewat `https://`.

### 5. Redeploy saat ada perubahan kode

Setiap kali ubah kode: `npm run build` ulang di laptop → upload ulang isi `dist/` (timpa yang lama) via File Manager/FTP. Tidak ada proses otomatis seperti Vercel — ini manual tiap kali update.

### Kalau paket kamu ada Terminal DAN Node.js tersedia

Karena backend kamu punya akses Terminal, cek juga apakah `node`/`npm` ada:

```bash
node -v
npm -v
```

Kalau ada, bisa build langsung di server (tidak perlu upload manual):

```bash
cd ~
git clone https://github.com/Bayu-Pasifik/money_management_frontend.git frontend_src
cd frontend_src
echo "VITE_API_BASE_URL=https://api.namadomain.com/api" > .env.production
npm install
npm run build
cp -r dist/* ~/public_html/
```

Redeploy berikutnya tinggal:

```bash
cd ~/frontend_src && git pull origin main && npm install && npm run build && cp -r dist/* ~/public_html/
```

Kalau `node -v` tidak ketemu (banyak shared hosting cPanel memang tidak menyediakan Node di Terminal biasa, beda dengan fitur "Setup Node.js App"), pakai cara upload manual di langkah 1–3 di atas — itu tetap cara paling pasti jalan di semua paket.

---

## Opsi A: Vercel

1. Buka [vercel.com](https://vercel.com), login pakai GitHub.
2. **Add New Project** → pilih repo `money_management_frontend`.
3. Vercel otomatis deteksi Vite. Biarkan default:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Di bagian **Environment Variables**, tambahkan:
   ```
   VITE_API_BASE_URL = https://api.bukukas.app/api
   ```
   (ganti dengan URL backend yang sudah di-deploy, lihat `DEPLOYMENT.md` di repo backend)
5. Klik **Deploy**. Tiap kali `git push` ke `main`, Vercel deploy ulang otomatis.

## Opsi B: Netlify

1. Buka [netlify.com](https://netlify.com) → **Add new site** → **Import an existing project** → pilih repo dari GitHub.
2. Build command: `npm run build`, Publish directory: `dist`.
3. **Site settings → Environment variables** → tambahkan `VITE_API_BASE_URL` sama seperti di atas.
4. Deploy.

## Opsi C: Cloudflare Pages

1. Buka dashboard Cloudflare → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Pilih repo, framework preset otomatis kedeteksi "Vite".
3. Build command: `npm run build`, Build output directory: `dist`.
4. Tambahkan environment variable `VITE_API_BASE_URL` di **Settings → Environment variables**.

## Opsi D: Upload manual ke VPS/hosting sendiri

Build lokal dulu:

```bash
cd money-management-frontend
echo "VITE_API_BASE_URL=https://api.bukukas.app/api" > .env.production
npm install
npm run build
```

Ini menghasilkan folder `dist/` — isinya file statis siap upload. Upload isi folder `dist/` ke server (via `scp`, FTP, atau cPanel File Manager), taruh di document root domain, misal `bukukas.app`.

**Nginx** contoh konfigurasi:

```nginx
server {
    listen 443 ssl http2;
    server_name bukukas.app;
    root /var/www/money_management_frontend/dist;
    index index.html;

    ssl_certificate     /etc/letsencrypt/live/bukukas.app/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/bukukas.app/privkey.pem;

    location / {
        try_files $uri /index.html;
    }
}
```

`try_files $uri /index.html` penting supaya refresh halaman (misal buka langsung `/transaksi`) tidak 404 — tapi karena app ini pakai tab-based navigation (bukan URL routing), sebenarnya semua tab tetap di path `/`, jadi baris ini cukup buat jaga-jaga.

## Setelah deploy: sambungkan ke backend

1. Pastikan backend sudah live dan bisa diakses via HTTPS (lihat `DEPLOYMENT.md` di repo backend).
2. Pastikan `VITE_API_BASE_URL` di frontend menunjuk persis ke URL backend + `/api`, contoh:
   ```
   https://api.bukukas.app/api
   ```
3. CORS: backend Laravel secara default sudah `allowed_origins: ['*']`, jadi frontend dari domain manapun bisa akses API tanpa konfigurasi tambahan.
4. Buka domain frontend, coba register/login — kalau berhasil, kedua server sudah tersambung dengan benar.

## Checklist sebelum live

- [ ] `VITE_API_BASE_URL` diset ke URL backend produksi (bukan `127.0.0.1`)
- [ ] Backend sudah bisa diakses lewat HTTPS
- [ ] Build (`npm run build`) sukses tanpa error tipe
- [ ] Coba login di domain produksi, pastikan data dari API kebaca
