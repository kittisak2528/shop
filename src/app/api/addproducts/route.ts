// /app/api/products/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { supabase } from '@/lib/supabase'
import { randomUUID } from 'crypto'
import jwt from 'jsonwebtoken'

export async function POST(req: Request) {
    const token = req.headers.get('cookie')?.split('; ').find((c) => c.startsWith('token='))?.split('=')[1]

    if (!token) {
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
        const fileName = `${file.name}`

        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // อัปโหลดไฟล์ไป Supabase Storage bucket ชื่อ 'product'
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

        // สร้าง URL สำหรับเรียกดูไฟล์รูป
        imagePath = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product/${fileName}`
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
    } catch (error) {
        console.error('❌ Prisma error:', error)
        return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
}
