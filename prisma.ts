import { PrismaClient } from "@prisma/client";

declare global {
  // لضمان Singleton في التطوير
  var prisma: PrismaClient | undefined;
}

// إنشاء PrismaClient واحد فقط أثناء التطوير
export const prisma =
  global.prisma ||
  new PrismaClient({
    // لو تستخدم Prisma Accelerate:
    // accelerateUrl: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
