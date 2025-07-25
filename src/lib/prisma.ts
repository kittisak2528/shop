// lib/prisma.ts
import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient
}

// ✅ ตรวจว่าเคยมี instance หรือยัง แล้วขยายด้วย Accelerate
const prisma =
    globalForPrisma.prisma ??
    new PrismaClient().$extends(withAccelerate())

// ✅ ใน dev เท่านั้นที่เก็บไว้ใน global (เพื่อป้องกันสร้างหลาย instance ตอน hot reload)
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}

export default prisma
