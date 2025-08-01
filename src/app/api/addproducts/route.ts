// /app/api/products/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { supabase } from '@/lib/supabase'
import { randomUUID } from 'crypto'
import jwt from 'jsonwebtoken'

export async function POST(req: Request) {
    const cookieHeader = req.headers.get('cookie') || ''
    const token = cookieHeader.split('; ').find(c => c.startsWith('token='))?.split('=')[1]; if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let userId: number
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }
        userId = decoded.userId
    } catch (err) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const formData = await req.formData()

    const name = formData.get('name') as string
    const price = parseFloat(formData.get('price') as string)
    const panelCount = parseInt(formData.get('panelCount') as string, 10)
    const file = formData.get('image') as File | null

    let imagePath = ''

    if (file && file.size > 0) {
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'File type not supported' }, { status: 400 })
        }
        if (file.size > 50 * 1024 * 1024) {
            return NextResponse.json({ error: 'File size exceeds 50MB limit' }, { status: 400 })
        }
        const rawName = file.name
        const sanitizedFileName = rawName
            .normalize("NFD")                        // แปลงให้เป็นรูปแบบ Unicode มาตรฐาน
            .replace(/[\u0300-\u036f]/g, "")        // ลบสระและวรรณยุกต์
            .replace(/\s+/g, "_")                   // แทนที่ space ด้วย "_"
            .replace(/[^\w.-]/g, "")                // ลบอักขระพิเศษที่ไม่ใช่ a-z, 0-9, ., -

        const fileName = `${Date.now()}-${sanitizedFileName}`

        try {
            const arrayBuffer = await file.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)

            const { data, error } = await supabase.storage
                .from('product')
                .upload(fileName, buffer, {
                    contentType: file.type,
                    upsert: false,
                })

            if (error) {
                console.error('Error uploading file:', error)
                return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
            }

            imagePath = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product/${fileName}`
        } catch (uploadError) {
            console.error('Upload error:', uploadError)
            return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
        }
    }

    try {
        const product = await prisma.product.create({
            data: {
                name,
                price,
                panelCount,
                image: imagePath,
                userId,
            },
        })

        return NextResponse.json({ message: 'Product created', product })
    } catch (dbError) {
        console.error('Database error:', dbError)
        return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
}
