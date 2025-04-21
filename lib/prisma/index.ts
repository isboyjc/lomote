import { PrismaClient } from '@/generated/prisma'

// 避免开发环境下热重载创建多个 Prisma 实例
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
