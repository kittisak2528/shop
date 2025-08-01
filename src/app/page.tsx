'use client'

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider, useSidebar } from "@/components/ui/sidebar"
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import LoginPage from "./login/page"
import RegisterPage from "./register/page"
import DashBoard from "@/component/dashboard"
import AddNewProductPage from "./addnewproduct/page"
import ProductPage from "./product/page"

export default function Page() {
  const [currentPage, setCurrentPage] = useState('Product')
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [user, setUser] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
  } | null>(null)

  useEffect(() => {
    const token = Cookies.get('token')

    if (!token) {
      router.push('/login')
      return
    }

    fetch('/api/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json()
          setUser({
            ...data.user,
            avatar: data.user.avatar ?? "/avatars/default.jpg",
          })
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
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <PageContent currentPage={currentPage} setCurrentPage={setCurrentPage} user={user} />
    </SidebarProvider>
  )
}

function PageContent({
  currentPage,
  setCurrentPage,
  user,
}: {
  currentPage: string
  setCurrentPage: (menu: string) => void
  user: {
    firstName: string
    lastName: string
    email: string
    avatar: string
  } | null
}) {
  const { setOpenMobile } = useSidebar()

  const handleMenuChange = (menu: string) => {
    setCurrentPage(menu)
    setOpenMobile(false) // ✅ ปิด sidebar หลังเลือกเมนู
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'Dashboard':
        return <DashBoard />
      case 'AddNewProduct':
        return <AddNewProductPage />
      case 'Product':
        return <ProductPage />
      case 'list':
        return <LoginPage />
      case 'overview':
        return <div className="p-10 text-center">Dashboard Overview</div>
      default:
        return <div className="p-10 text-center">ไม่พบหน้า</div>
    }
  }

  return (
    <>
      <AppSidebar user={user} onMenuChange={handleMenuChange} variant="inset" />
      <SidebarInset>
        <SiteHeader />
        {renderContent()}
      </SidebarInset>
    </>
  )
}
