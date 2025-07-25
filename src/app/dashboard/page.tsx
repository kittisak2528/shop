'use client'
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import data from "./data.json"
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import LoginPage from "../login/page"
import AddProductPage from "../addproduct/page"

export default function Page() {
  const [user, setUser] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
  } | null>(null)
  const router = useRouter()
  useEffect(() => {
    const token = Cookies.get('token')
    console.log("token", token)
    fetch('/api/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json()
          //ถ้าไม่มี avatar ให้ใช้ default
          //ถ้ามี avatar ให้ใช้ avatar ที่ได้จากข้อมูลผู้ใช้
          setUser({
            ...data.user,
            avatar: data.user.avatar ?? "/avatars/default.jpg",
          })
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

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar user={user} variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <AddProductPage />
      </SidebarInset>
    </SidebarProvider>
  )
}

        // <div className="flex flex-1 flex-col">
        //   <div className="@container/main flex flex-1 flex-col gap-2">
        //     <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        //       <SectionCards />
        //       <div className="px-4 lg:px-6">
        //         <ChartAreaInteractive />
        //       </div>
        //       <DataTable data={data} />
        //     </div>
        //   </div>
        // </div>
