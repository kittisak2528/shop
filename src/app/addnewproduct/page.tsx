'use client'
import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function AddNewProductPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: '',
        price: "40",
        panelCount: 0,
        image: null as File | null,
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: name === 'panelCount' ? Number(value) : value })
    }
    const handleSelectChange = (value: string) => {
        setFormData(prev => ({ ...prev, price: value }))
    }



    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        setFormData({ ...formData, image: file })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log('ส่งข้อมูล:', formData)

        const form = new FormData()
        form.append('name', formData.name)
        form.append('price', formData.price)
        form.append('panelCount', String(formData.panelCount))
        if (formData.image) {
            form.append('image', formData.image)
        }

        const res = await fetch('/api/addproducts', {
            method: 'POST',
            body: form,
        })

        const data = await res.json()
        if (res.ok) {
            toast.success('เพิ่มสินค้าเรียบร้อยแล้ว')
            setFormData({ name: '', price: "40", panelCount: 0, image: null })  // รีเซ็ตฟอร์ม ถ้าต้องการ
        } else {
            toast.error(data.error || 'เกิดข้อผิดพลาด')
        }
    }

    return (
        <div className="max-w-md mx-auto p-4 bg-white shadow rounded mt-10">
            <h1 className="text-xl font-bold mb-4">เพิ่มสินค้า</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label className="block font-medium">ชื่อสินค้า</Label>
                    <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>

                <div>
                    <Label className="block font-medium">ราคา</Label>
                    <Select
                        name="price"
                        value={formData.price}
                        onValueChange={handleSelectChange}
                    >
                        <SelectTrigger className="w-full border rounded p-2">
                            <SelectValue placeholder="เลือกราคา" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="35">35 บาท</SelectItem>
                                <SelectItem value="40">40 บาท</SelectItem>
                                <SelectItem value="80">80 บาท</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label className="block font-medium mb-1">จำนวนแผง</Label>
                    <div className="flex items-center space-x-2">
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
                            className="w-full border rounded p-2 text-center"
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

                <div>
                    <Label className="block font-medium">อัปโหลดรูป</Label>
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full"
                    />
                </div>

                <Button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    บันทึกสินค้า
                </Button>
            </form>
        </div>
    )
}
