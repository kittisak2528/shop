// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

declare global {
    // ใช้เพื่อป้องกันการสร้าง instance ซ้ำใน dev mode
    var prisma: PrismaClient | undefined
}

export const prisma =
    global.prisma ||
    new PrismaClient()

if (process.env.NODE_ENV !== 'production') global.prisma = prisma
