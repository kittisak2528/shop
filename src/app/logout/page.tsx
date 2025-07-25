'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

export default function LogoutPage() {
    const router = useRouter()

    useEffect(() => {
        // ลบคุกกี้ token
        Cookies.remove('token')

        // ส่งผู้ใช้กลับไปหน้า login
        router.replace('/login')
    }, [router])

    return (
        <div className="p-10 text-center">
            <p>Logging out...</p>
        </div>
    )
}
