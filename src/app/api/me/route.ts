import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
        return NextResponse.json({ error: 'No token' }, { status: 401 })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { 
                firstName: true, 
                lastName: true, 
                username: true,
                email: true},
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({ user })
    } catch (err) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
}
