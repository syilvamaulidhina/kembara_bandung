# Kembara Bandung

Aplikasi sistem informasi pariwisata Bandung Raya dengan role Admin, Pengelola Wisata, dan Wisatawan.

## Cara Setup

1. Install dependencies

npm install

2. Setup environment

Copy `.env.example` menjadi `.env`, lalu sesuaikan `DATABASE_URL` dengan PostgreSQL lokal kamu.

3. Generate Prisma Client

npx prisma generate

4. Jalankan migration

npx prisma migrate dev

5. Jalankan project

npm run dev

6. Buka browser

http://localhost:3000

## Struktur Route

- /login → halaman login
- /register → halaman register
- /select-role → pilih role setelah register
- /pengunjung → halaman wisatawan
- /pengelola → halaman pengelola
- /admin → halaman admin

## Role

- WISATAWAN → akses wisatawan
- PENGELOLA → akses pengelola wisata
- ADMIN → akses admin