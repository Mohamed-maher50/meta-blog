import { PrismaClient } from "@prisma/client";
import config from "./prisma/prisma.config";

declare global {
  // لضمان Singleton في التطوير
  var prisma: PrismaClient | undefined;
}

// إنشاء PrismaClient واحد فقط أثناء التطوير
export const prisma =
  global.prisma ||
  new PrismaClient({
    datasourceUrl: config.datasource.url,
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
