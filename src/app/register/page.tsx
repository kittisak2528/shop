'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        email: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleRegister = async () => {
        const res = await fetch('/api/register', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: { 'Content-Type': 'application/json' },
        })

        if (res.ok) {
            alert('สมัครสำเร็จ! กรุณาล็อกอิน')
            router.push('/login')
        } else {
            const data = await res.json()
            alert(data.error || 'เกิดข้อผิดพลาด')
        }
    }

    return (
        <div className="p-10 max-w-md mx-auto">
            <h1 className="text-2xl mb-4">Register</h1>
            <input name="firstName" placeholder="ชื่อจริง" value={formData.firstName} onChange={handleChange} className="border p-2 rounded w-full mb-2" />
            <input name="lastName" placeholder="นามสกุล" value={formData.lastName} onChange={handleChange} className="border p-2 rounded w-full mb-2" />
            <input name="email" placeholder="อีเมล" type="email" value={formData.email} onChange={handleChange} className="border p-2 rounded w-full mb-2" />
            <input name="username" placeholder="ชื่อผู้ใช้" value={formData.username} onChange={handleChange} className="border p-2 rounded w-full mb-2" />
            <input name="password" placeholder="รหัสผ่าน" type="password" value={formData.password} onChange={handleChange} className="border p-2 rounded w-full mb-4" />
            <button className="bg-green-500 text-white p-2 w-full rounded" onClick={handleRegister}>
                สมัครสมาชิก
            </button>
        </div>
    )
}
