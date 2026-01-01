import "./globals.css"
export const metadata = {
  title: 'Bar-Restaurant',
  description: 'Certified Invoicing Syatem that work as Bar-Restaurant System Saas',
}

import { Providers } from "@/lib/providers"
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers></body>
    </html>
  )
}
