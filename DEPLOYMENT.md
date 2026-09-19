# Deploy Frontend (React + Vite)

Panduan upload `money-management-frontend`. Ini aplikasi statis (hasil `npm run build` cuma HTML/CSS/JS), jadi bisa di-hosting di mana saja yang bisa serve file statis — tidak butuh Node.js jalan di server produksi.

## Pilihan hosting (dari paling gampang)

| Opsi | Kecepatan setup | Biaya |
|---|---|---|
| **Vercel** | Tinggal connect repo GitHub, auto-deploy tiap push | Gratis untuk personal project |
| **Netlify** | Sama gampangnya dengan Vercel | Gratis untuk personal project |
| **Cloudflare Pages** | Sama, plus CDN cepat | Gratis |
| **VPS / server sendiri** (Nginx) | Manual, tapi kalau backend juga di VPS yang sama, bisa satu domain | Sesuai biaya VPS |

## Opsi A: Vercel (paling direkomendasikan)

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
