import { SectionCards } from "@/components/section-cards"
import { useEffect, useState } from "react"
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { Product, User } from "@prisma/client"

type ResponseData = {
    product: Product[],
    user: User[],
    lastUpdated: string
}
const DashBoard = () => {
    const [lastUpdated, setLastUpdated] = useState<string | null>(null)
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState<Product[]>([
        {
            id: 0,
            name: '',
            price: 0,
            image: '',
            userId: 0,
            createdAt: new Date(),
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

        const fetchData = async () => {
            const res = await fetch(`/api/getdashboard?lastUpdated=${lastUpdated ?? ''}`, {
                headers: { Authorization: `Bearer ${token}` },
            })

            const data = await res.json()

            if (res.ok && data.status === 'not_modified') {
                console.log('status: ', data.status)
                console.log('🔁 No change in data')
                return
            }

            if (res.ok) {
                setProducts(data.product || [])
                setUser(data.user || [])
                setLastUpdated(data.lastUpdated)
            } else {
                Cookies.remove('token')
                router.push('/login')
            }

            setLoading(false)
        }

        fetchData()
    }, [router, lastUpdated])
    if (loading) return <div className="p-10 text-center">กำลังโหลด...</div>
    return (
        <div className="">
            {products.map((p) => (
                <p key={p.id}>
                    id: {p.id}
                    - name: {p.name}
                    - price: {p.price}
                    - userId: {p.userId}
                    เวลา: {new Date(p.createdAt).toLocaleTimeString('th-TH', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false,
                    })}
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