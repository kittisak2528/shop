'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

export default function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()  // ป้องกันรีเฟรชหน้า
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
                headers: { 'Content-Type': 'application/json' },
            })

            if (res.ok) {
                const data = await res.json()
                Cookies.set('token', data.token, {
                    expires: 1,
                    path: '/',               // ให้ cookie มีผลทุกหน้า
                    secure: true,            // ส่ง cookie เฉพาะ HTTPS เท่านั้น (ควรเปิดตอนโปรดักชัน)
                    sameSite: 'Strict',      // ป้องกัน CSRF
                })
                router.push('/dashboard')  // เปลี่ยนเส้นทางไปหน้า dashboard
            } else {
                const data = await res.json()
                alert(data.error)
            }
        } catch (error) {

        }
    }

    return (
        <div className="p-10 max-w-md mx-auto">
            <h1 className="text-2xl mb-4">Login</h1>
            <form onSubmit={handleSubmit}>
                <input
                    className="border p-2 w-full mb-4"
                    placeholder="Username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}

                />
                <input
                    className="border p-2 w-full mb-4"
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}

                />
                <button
                    type="submit"  // ปุ่ม submit
                    className="bg-blue-500 text-white p-2 w-full"
                >
                    Login
                </button>
            </form>
        </div>
    )
}
