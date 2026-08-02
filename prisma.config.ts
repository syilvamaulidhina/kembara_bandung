// prisma.config.ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
    seed: 'ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts',
  },

  datasource: {
    // NOTE: sengaja pakai DIRECT_URL (bukan DATABASE_URL) di sini.
    // prisma.config.ts ini HANYA dipakai untuk operasi CLI (generate,
    // db push, migrate, seed) — bukan untuk koneksi aplikasi saat
    // runtime (itu urusan lib/prisma.ts yang pakai adapter PrismaPg
    // terpisah dengan DATABASE_URL/pooler).
    //
    // DATABASE_URL (port 6543) itu connection pooler dari Supabase,
    // cocok untuk banyak koneksi pendek dari aplikasi, tapi kurang
    // stabil untuk operasi DDL/schema seperti db push atau migrate.
    // DIRECT_URL (port 5432) adalah direct connection yang stabil
    // untuk operasi CLI/migrasi semacam ini.
    url: env("DIRECT_URL"),
  },
});