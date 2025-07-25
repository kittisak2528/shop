import { createClient } from '@supabase/supabase-js'

const bucket_name = 'product'
const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

// Create Supabase client
export const supabase = createClient(url, key)

// Upload file using standard upload
async function uploadFile(image: File) {
    const imageName = `Image-${image.name}`
    const { data, error } = await supabase.storage
        .from(bucket_name)
        .upload(imageName, image, {
            cacheControl: '3600',
            upsert: true,
        })

    if (!data) throw new Error(`Error uploading file: ${error?.message || 'Unknown error'}`)
    return data
}