"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store/auth-store"
import { Sidebar } from "@/components/dashboard/sidebar"
import { useEffect } from "react";
import { socketService } from '@/lib/socketService';
import toast from "react-hot-toast"
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

  useEffect(() => {
    socketService.initialize();
  },[]);
  // This ensures consistent server-client rendering



    useEffect(() => {
  const handleResult = (data: any) => {
    toast.error(data.message, {
      id: "ebmMessage",
      position: "top-right"
    });
    // console.log('Received data:', data);
  };
  
  // Initialize the socket
  socketService.initialize();
  
  // Join the ebm_message room
  // socketService.ebmJoinRoom('ebm_message');
  
  // Listen for the correct event name
  socketService.onWhenConnected('ebm:ebmMessage', handleResult);
  
  return () => {
    socketService.off('ebm:ebmMessage');
  };
}, []);
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}