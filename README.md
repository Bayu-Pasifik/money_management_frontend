# Money Management Frontend

React + TypeScript (Vite), tanpa UI framework tambahan (CSS polos). Konsumsi API dari `money-management-backend`.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Isi `VITE_API_BASE_URL` di `.env.local` sesuai URL backend Laravel (default `http://127.0.0.1:8000/api`).

## Struktur

- `src/api/client.ts` — fetch wrapper + token auth (localStorage)
- `src/context/AuthContext.tsx` — state login/register/logout
- `src/pages/` — Auth, Dashboard (ringkasan+budget), Transactions, Categories, Telegram (link chat ID)
- `src/App.tsx` — shell + tab navigation manual (tanpa router library)

## Alur Telegram + AI

Halaman **Telegram** kasih instruksi: user `/start` ke bot dulu buat dapat Chat ID, lalu tempel Chat ID di form ini biar akun ke-link. Setelah itu chat bebas ke bot Telegram, AI (Gemini via backend) yang balas berdasarkan data keuangan user.
