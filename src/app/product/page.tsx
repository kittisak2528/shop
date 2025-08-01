'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { Product } from "@prisma/client"
import Image from "next/image"

import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Minus, PackageOpen, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"


const ProductPage = () => {
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState<Product[]>([])
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const router = useRouter()
    const [formData, setFormData] = useState({
        panelCount: selectedProduct?.panelCount || 0,
    })
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: name === 'panelCount' ? Number(value) : value })
    }

    const handleSave = async () => {
        if (!selectedProduct) return
        const token = Cookies.get('token')
        if (!token) {
            Cookies.remove('token')
            router.push('/login')
            return
        }
        try {
            const res = await fetch('/api/update-product-panel', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    productId: selectedProduct.id,
                    panelCount: formData.panelCount
                }),
            })
            const result = await res.json()
            if (res.ok) {
                // ✅ อัปเดตค่าใน products
                setProducts(prev =>
                    prev.map(p =>
                        p.id === selectedProduct.id
                            ? { ...p, panelCount: formData.panelCount }
                            : p
                    )
                )
                alert('บันทึกสำเร็จ')
                setSelectedProduct(null) // ปิด modal
            } else {
                alert(result.error || 'บันทึกไม่สำเร็จ')
            }
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message)
            }
        }
    }

    useEffect(() => {
        const token = Cookies.get('token')
        if (!token) {
            router.push('/login')
            return
        }

        fetch('/api/getproduct', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(async (res) => {
                if (res.ok) {
                    const data = await res.json()
                    setProducts((data.product || []).sort((a: Product, b: Product) => a.id - b.id))


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
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">สินค้าที่มีทั้งหมด</h1>
                </div>

                <Card className="bg-white/90 border-0 shadow-lg">
                    <CardContent>
                        {products.map((product) => (
                            <Card key={product.id} className="flex flex-row items-center gap-4 bg-white border-0 shadow-md mb-4 p-4">
                                <Image
                                    src={product.image || "/placeholder.jpg"}
                                    alt={product.name}
                                    width={80}
                                    height={80}
                                    className="w-20 h-20 object-contain rounded-md"
                                />

                                <div>
                                    <CardTitle className="font-bold text-gray-800">{product.name}</CardTitle>
                                    <p className="text-gray-700">ราคา: {product.price} บาท</p>
                                </div>

                                <div className="ml-auto text-right">
                                    <p
                                        className="text-gray-600 font-medium"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setSelectedProduct(product)
                                            setFormData({ panelCount: product.panelCount })
                                        }}
                                    > จำนวนที่มี: {product.panelCount}</p>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setSelectedProduct(product)
                                            setFormData({ panelCount: product.panelCount })
                                        }}
                                        className="mt-2"
                                    >
                                        <PackageOpen className="w-4 h-4 mr-1" />
                                        <span>แก้ไขจำนวนสินค้า</span>
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </CardContent>
                </Card>
            </div >

            {/* ✅ Modal */}
            {
                selectedProduct && (
                    <div
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                        onClick={() => setSelectedProduct(null)}
                    >
                        <div
                            className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-center text-xl font-semibold mb-4">รายละเอียดสินค้า</h2>
                            <p className="text-2xl"><strong>ชื่อ:</strong> {selectedProduct.name}</p>
                            <p><strong>ราคา:</strong> {selectedProduct.price} บาท</p>
                            <div>
                                <label className="block font-medium mb-1">จำนวนแผง</label>
                                <div className="text-2xl flex items-center space-x-2">
                                    <Button
                                        type="button"
                                        onClick={() =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                panelCount: Math.max(1, prev.panelCount - 1),
                                            }))
                                        }
                                        className="p-2 text-black bg-gray-200 rounded hover:bg-gray-300"
                                    >
                                        <Minus size={16} />
                                    </Button>

                                    <Input
                                        type="number"
                                        name="panelCount"
                                        value={formData.panelCount}
                                        onChange={handleChange}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSave()
                                            }
                                        }}
                                        onFocus={() => setFormData(prev => ({
                                            ...prev, panelCount: 0
                                        }))} // ✅ ลบค่าเมื่อคลิก
                                        className="text-2xl w-full border rounded p-2 text-center"
                                        min={1}
                                    />

                                    <Button
                                        type="button"
                                        onClick={() =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                panelCount: prev.panelCount + 1,
                                            }))
                                        }
                                        className="p-2 text-black bg-gray-200 rounded hover:bg-gray-300"
                                    >
                                        <Plus size={16} />
                                    </Button>

                                </div>
                            </div>

                            <Button
                                onClick={() => setSelectedProduct(null)}
                                className="mt-4 w-full bg-blue-600 text-white hover:bg-blue-700"
                            >
                                ปิด
                            </Button>
                            <Button
                                onClick={handleSave}
                                className="mt-4 w-full bg-green-600 text-white hover:bg-green-700"
                            >
                                บันทึก
                            </Button>
                        </div>
                    </div>
                )
            }

        </div >
    )
}

export default ProductPage
