// /app/api/getdashboard/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export async function GET(req: NextRequest) {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'No token' }, { status: 401 })

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }
        const clientLastUpdate = req.nextUrl.searchParams.get('lastUpdated') // 👉 frontend ส่งมาหากมี

        const serverLatest = await prisma.product.findFirst({
            orderBy: { updatedAt: 'desc' },
            select: { updatedAt: true },
        })

        if (clientLastUpdate && serverLatest) {
            const clientTime = new Date(clientLastUpdate)
            if (serverLatest.updatedAt.getTime() === clientTime.getTime()) {
                return NextResponse.json({ status: 'not_modified' }) // ✅ ไม่ต้องส่งข้อมูลซ้ำ
            }
        }

        const product = await prisma.product.findMany({
            orderBy: { id: 'asc' },
        })
        const user = await prisma.user.findMany()

        return NextResponse.json({
            product,
            user,
            lastUpdated: serverLatest?.updatedAt || null,
        })
    } catch (err) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
}
