'use client'

import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { IconLogout } from '@tabler/icons-react'

export default function LogoutButton() {
    const router = useRouter()
    const handleLogout = () => {
        Cookies.remove('token')           // ลบ cookie ด้วย js-cookie
        router.push('/login')              // พาไปหน้า login
    }

    return (
        <button 
        onClick={handleLogout} className="flex items-center gap-2 ">
            <IconLogout /> Log out
        </button>
    )
}
