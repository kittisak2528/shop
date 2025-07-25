import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export async function POST(request: Request) {
    const { username, password, firstName, lastName, email } = await request.json()

    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { username },
                { email }
            ]
        }
    })

    if (existingUser) {
        return NextResponse.json({ error: 'Username or email already exists' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data: {
            username,
            password: hashedPassword,
            firstName,
            lastName,
            email,
        },
    })

    return NextResponse.json({ message: 'User registered', userId: user.id })
}
