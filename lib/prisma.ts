// lib/prisma.ts
// Prisma Singleton + PostgreSQL Adapter + Connection Pooling
// Aman untuk Next.js development & production

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// Ambil DATABASE_URL dari .env
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL belum ada di .env");
}

// Buat PostgreSQL pool connection
const pool = new pg.Pool({
  connectionString,
});

// Prisma PostgreSQL adapter
const adapter = new PrismaPg(pool);

// Global singleton untuk mencegah multiple Prisma instances
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// Buat Prisma Client
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,

    // Logging saat development
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

// Simpan ke global saat development
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;