import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function PUT(req: NextRequest) {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let userId: number
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }
        userId = decoded.userId
    } catch {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { productId, panelCount } = await req.json()

    if (!productId || panelCount < 0) {
        return NextResponse.json({ error: 'ข้อมูลไม่ถูกต้อง' }, { status: 400 })
    }

    try {
        const product = await prisma.product.updateMany({
            where: {
                id: productId,
            },
            data: {
                panelCount,
            },
        })

        if (product.count === 0) {
            return NextResponse.json({ error: 'ไม่พบสินค้าหรือไม่มีสิทธิ์แก้ไข' }, { status: 403 })
        }

        return NextResponse.json({ message: 'อัปเดตสำเร็จ' })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' }, { status: 500 })
    }
}
