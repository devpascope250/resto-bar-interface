import type React from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Toaster } from "@/components/ui/toaster"
export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>
    <Toaster/>
    {children}</DashboardLayout>
}
