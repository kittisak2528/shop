'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import LogoutButton from '@/component/Logout';
import Cookies from 'js-cookie'

export default function DashboardPage() {
    const [user, setUser] = useState<{
        firstName: string;
        lastName: string;
        email: string;
    } | null>(null)
    const router = useRouter()

    useEffect(() => {
        const token = Cookies.get('token')
        fetch('/api/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(async (res) => {
                if (res.ok) {
                    const data = await res.json()
                    setUser(data.user)
                } 
                else {
                    Cookies.remove('token')
                    router.push('/login')
                }
            })
            .catch(() => {
                router.push('/login')
            })
    }, [router])

    if (!user) return <p className="text-center mt-10">กำลังโหลด...</p>

    return (
        <div className="p-10 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">ยินดีต้อนรับ</h1>
            <p className="text-lg">คุณ: <strong>{user.firstName} {user.lastName}</strong></p>
            <p className="text-lg">อีเมล: <strong>{user.email}</strong></p>
            <LogoutButton />
        </div>
    )
}
