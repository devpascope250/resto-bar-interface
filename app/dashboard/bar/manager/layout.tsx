import type React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as HotToster } from "react-hot-toast";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout>
      <Toaster />
      <HotToster />
      {children}
    </DashboardLayout>
  );
}
