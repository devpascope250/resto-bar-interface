"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store/auth-store"
import { Sidebar } from "@/components/dashboard/sidebar"
import { useEffect } from "react";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { checkAuth, user } = useAuthStore();
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated())

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/")
    }
  }, [isAuthenticated, router])

  // This ensures consistent server-client rendering
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}