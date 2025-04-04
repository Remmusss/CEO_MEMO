import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/lib/i18n/language-context"
import { Toaster } from "@/components/ui/toaster"
import Image from "next/image"  


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ZenHRM System",
  description: "A comprehensive ZenHRM System management system with role-based access control",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          {children}
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  )
}



import './globals.css'