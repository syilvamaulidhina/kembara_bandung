# Kembara Bandung

## Cara Setup

1. Clone repo
   git clone https://github.com/bintangpreciosa/kembara_bandung.git
   cd kembara_bandung

2. Install dependencies
   npm install

3. Setup environment

- Copy .env.example ke .env
- Ganti YOUR_PASSWORD dengan password PostgreSQL kamu
- Buat database bernama kembara_bandung di pgAdmin

4. Setup database
   npx prisma generate
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

- WISATAWAN → akses /pengunjung
- PENGELOLA → akses /pengelola
- ADMIN → akses /admin
