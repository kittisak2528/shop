import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
// import { prisma } from '@/lib/prisma'
import prisma from '@/lib/prisma'  // ใช้ prisma ที่ import มาจาก lib/prisma.ts




export async function POST(request: Request) {
    const { username, password } = await request.json()
    const user = await prisma.user.findUnique({ where: { username } })
    console.log('User found:', user)  // แสดงข้อมูลผู้ใช้ที่ค้นพบ

    if (!user || !(await bcrypt.compare(password, user.password))) {
        console.error('Invalid credentials for user:', username)  // แสดงชื่อผู้ใช้ที่ไม่ถูกต้อง
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1d' })

    return NextResponse.json({ token })
}
