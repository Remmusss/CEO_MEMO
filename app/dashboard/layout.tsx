"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/lib/i18n/language-context"
import { LanguageSelector } from "@/components/language-selector"
import { Sidebar } from "@/components/sidebar"
import { motion } from "framer-motion"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "next-themes"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [userAvatar, setUserAvatar] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useLanguage()
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
    // In a real app, we would get this from an auth context or API
    const role = localStorage.getItem("userRole")
    const name = localStorage.getItem("userName")

    // Get user data for avatar
    const userData = localStorage.getItem("userData")
    let avatar = "/placeholder.svg?height=32&width=32"
    if (userData) {
      try {
        const parsedData = JSON.parse(userData)
        if (parsedData.avatar) {
          avatar = parsedData.avatar
        }
      } catch (e) {
        console.error("Failed to parse user data", e)
      }
    }
    setUserAvatar(avatar)

    // Count unread notifications
    const notifications = localStorage.getItem("notifications")
    if (notifications) {
      try {
        const parsedNotifications = JSON.parse(notifications)
        const unreadCount = parsedNotifications.filter((n: any) => !n.read).length
        setUnreadNotifications(unreadCount)
      } catch (e) {
        console.error("Failed to parse notifications", e)
      }
    }

    if (!role) {
      router.push("/login")
    } else {
      setUserRole(role)
      setUserName(name)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("userName")
    toast({
      title: t("common.logout"),
      description: "You have been logged out successfully",
    })
    router.push("/login")
  }

  if (!mounted || !userRole) {
    return null
  }

  return (
    <div
      className={`flex min-h-screen ${theme === "dark" ? "bg-gradient-to-br from-slate-900 to-slate-800" : "bg-gradient-to-br from-slate-50 to-slate-100"}`}
    >
      {/* Sidebar */}
      <Sidebar userRole={userRole} onLogout={handleLogout} />

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header
          className={`sticky top-0 z-10 flex h-14 items-center justify-end border-b ${
            theme === "dark" ? "border-slate-800 bg-slate-900/90" : "border-slate-200 bg-white/90"
          } backdrop-blur-sm px-4 md:px-6`}
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full"
              onClick={() => router.push("/dashboard/notifications")}
            >
              <Bell className={`h-5 w-5 ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`} />
              {unreadNotifications > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                  {unreadNotifications}
                </span>
              )}
            </Button>
            <ThemeToggle />
            <LanguageSelector />
            <Avatar className={`h-8 w-8 border ${theme === "dark" ? "border-slate-700" : "border-slate-200"}`}>
              <AvatarImage src={userAvatar || "/placeholder.svg?height=32&width=32"} alt={userName || ""} />
              <AvatarFallback
                className={`${theme === "dark" ? "bg-blue-900 text-blue-100" : "bg-blue-100 text-blue-800"}`}
              >
                {userName?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mx-auto max-w-7xl"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
