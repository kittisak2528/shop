import { createClient } from '@supabase/supabase-js'

const bucket_name = 'product'
const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

// Create Supabase client
export const supabase = createClient(url, key)

// Upload file using standard upload
async function uploadFile(image: File) {
    // ✅ ตรวจสอบว่าเป็นรูปภาพ
    if (!image.type.startsWith('image/')) {
        throw new Error('ไฟล์ต้องเป็นรูปภาพเท่านั้น (JPG, PNG, WEBP)')
    }
    // ✅ ตรวจสอบขนาดไฟล์ (สูงสุด 5MB)
    const MAX_SIZE = 5 * 1024 * 1024 // 5MB
    if (image.size > MAX_SIZE) {
        throw new Error('ขนาดไฟล์ต้องไม่เกิน 5MB')
    }
    // ✅ ตั้งชื่อไฟล์แบบสุ่มไม่ให้ซ้ำกัน
    const timestamp = Date.now()
    const extension = image.name.split('.').pop()
    const uniqueName = `Image-${timestamp}.${extension}`

    const { data, error } = await supabase.storage
        .from(bucket_name)
        .upload(uniqueName, image, {
            cacheControl: '3600',
            upsert: false, // ไม่ให้เขียนทับชื่อเดิม
        })

    if (!data) throw new Error(`อัปโหลดไม่สำเร็จ: ${error?.message || 'ไม่ทราบสาเหตุ'}`)
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket_name}/${uniqueName}`
}