import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import { useEffect, useState } from "react"
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { Product, User } from "@prisma/client"

const DashBoard = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState<Product[]>([
        {
            id: 0,
            name: '',
            price: 0,
            image: '',
            userId: 0,
        }
    ] as Product[]) // ประกาศ type array
    const [user, setUser] = useState<User[]>([
        {
            id: 0,
            firstName: '',
            lastName: '',
        }
    ] as User[])

    useEffect(() => {
        const token = Cookies.get('token')
        if (!token) {
            router.push('/login')
            return
        }
        fetch('/api/getdashboard', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(async (res) => {
                if (res.ok) {
                    const data = await res.json()
                    console.log('Fetched product data:', data)
                    setProducts(data.product || []) // ตรวจสอบว่ามี product หรือไม่
                    setUser(data.user || []) // ตรวจสอบว่ามี user หรือไม่
                } else {
                    Cookies.remove('token')
                    router.push('/login')
                }
            })
            .catch(() => {
                Cookies.remove('token')
                router.push('/login')
            })
            .finally(() => {
                setLoading(false)
            })
    }, [router])
    if (loading) return <div className="p-10 text-center">กำลังโหลด...</div>
    return (
        <div className="">
            {products.map((p) => (
                <p key={p.id}>
                    id: {p.id} - name: {p.name} - price: {p.price}  - userId: {p.userId}
                </p>
            ))}
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <SectionCards product={products} user={user} />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default DashBoard