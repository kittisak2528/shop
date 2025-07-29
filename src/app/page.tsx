'use client'

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import AddProductPage from "./addproduct/page"
import LoginPage from "./login/page"
import RegisterPage from "./register/page"
import DashBoard from "@/component/dashboard"



export default function Page() {
  const [currentPage, setCurrentPage] = useState('Dashboard')
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
          console.log('Fetched user data:', data)
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
  const renderContent = () => {
    switch (currentPage) {
      case 'Dashboard':
        return <DashBoard />
      case 'AddProduct':
        return <AddProductPage />
      case 'list':
        return <LoginPage />
      case 'overview':
        return <div className="p-10 text-center">Dashboard Overview</div>
      default:
        return <RegisterPage />
    }
  }
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar user={user} onMenuChange={setCurrentPage} variant="inset" />
      <SidebarInset>
        <SiteHeader />
        
        {renderContent()}
      </SidebarInset>
    </SidebarProvider>
  )
}
