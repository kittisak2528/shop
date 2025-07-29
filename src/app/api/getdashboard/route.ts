import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
        console.error('No token provided')
        return NextResponse.json({ error: 'No token' }, { status: 401 })
    }

    try {
        const product = await prisma.product.findMany({
            select: { 
                id: true,
                name: true, 
                price: true, 
                image: true,
                userId: true
            }
        })
        const user = await prisma.user.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
            }
        })
        console.log('Fetched products:', product)

        if (!product) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({ product, user })
    } catch (err) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
}
