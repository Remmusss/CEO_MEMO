"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
  Users,
  Briefcase,
  Building2,
  Bell,
  Settings,
  LogOut,
  Home,
  DollarSign,
  BarChart4,
  UserCircle,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/lib/i18n/language-context"
import { LanguageSelector } from "@/components/language-selector"
import { motion } from "framer-motion"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const { t } = useLanguage()

  useEffect(() => {
    setMounted(true)
    // In a real app, we would get this from an auth context or API
    const role = localStorage.getItem("userRole")
    const name = localStorage.getItem("userName")

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

  const sidebarLinks = [
    {
      href: "/dashboard",
      icon: <Home className="mr-2 h-4 w-4" />,
      label: t("common.dashboard"),
      roles: ["admin", "hr-manager", "payroll-manager", "employee"],
    },
    {
      href: "/dashboard/employees",
      icon: <Users className="mr-2 h-4 w-4" />,
      label: t("common.employees"),
      roles: ["admin", "hr-manager"],
    },
    {
      href: "/dashboard/payroll",
      icon: <DollarSign className="mr-2 h-4 w-4" />,
      label: t("common.payroll"),
      roles: ["admin", "payroll-manager"],
    },
    {
      href: "/dashboard/departments",
      icon: <Building2 className="mr-2 h-4 w-4" />,
      label: t("common.departments"),
      roles: ["admin", "hr-manager"],
    },
    {
      href: "/dashboard/reports",
      icon: <BarChart4 className="mr-2 h-4 w-4" />,
      label: t("common.reports"),
      roles: ["admin", "hr-manager", "payroll-manager"],
    },
    {
      href: "/dashboard/notifications",
      icon: <Bell className="mr-2 h-4 w-4" />,
      label: t("common.notifications"),
      roles: ["admin", "hr-manager", "payroll-manager", "employee"],
    },
    {
      href: "/dashboard/profile",
      icon: <UserCircle className="mr-2 h-4 w-4" />,
      label: t("common.profile"),
      roles: ["admin", "hr-manager", "payroll-manager", "employee"],
    },
    {
      href: "/dashboard/settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
      label: t("common.settings"),
      roles: ["admin"],
    },
  ]

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Desktop Sidebar */}
      <div className="hidden w-64 flex-col bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 md:flex">
        <div className="flex h-14 items-center border-b border-slate-200 dark:border-slate-800 px-4">
          <Link href="/dashboard" className="flex items-center font-semibold">
            <Briefcase className="mr-2 h-5 w-5 text-blue-600" />
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent font-bold">
            ZenHRM
            </span>
          </Link>
        </div>
        <nav className="flex-1 overflow-auto py-4 px-2">
          <div className="space-y-1">
            {sidebarLinks.map(
              (link) =>
                link.roles.includes(userRole) && (
                  <Link href={link.href} key={link.href}>
                    <Button
                      variant={pathname === link.href ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        pathname === link.href
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      {link.icon}
                      {link.label}
                    </Button>
                  </Link>
                ),
            )}
          </div>
        </nav>
        <div className="border-t border-slate-200 dark:border-slate-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-muted-foreground capitalize">{userRole.replace("-", " ")}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900 dark:hover:text-red-400"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="fixed top-0 left-0 right-0 z-20 flex h-14 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 md:hidden">
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex h-14 items-center border-b border-slate-200 dark:border-slate-800 px-4">
                <Link href="/dashboard" className="flex items-center font-semibold">
                  <Briefcase className="mr-2 h-5 w-5 text-blue-600" />
                  <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent font-bold">
                    HR & Payroll
                  </span>
                </Link>
              </div>
              <nav className="flex-1 overflow-auto py-4 px-2">
                <div className="space-y-1">
                  {sidebarLinks.map(
                    (link) =>
                      link.roles.includes(userRole) && (
                        <Link href={link.href} key={link.href}>
                          <Button
                            variant={pathname === link.href ? "default" : "ghost"}
                            className={`w-full justify-start ${
                              pathname === link.href
                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                : "hover:bg-slate-100 dark:hover:bg-slate-800"
                            }`}
                          >
                            {link.icon}
                            {link.label}
                          </Button>
                        </Link>
                      ),
                  )}
                </div>
              </nav>
              <div className="border-t border-slate-200 dark:border-slate-800 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{userName}</p>
                    <p className="text-xs text-muted-foreground capitalize">{userRole.replace("-", " ")}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900 dark:hover:text-red-400"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/dashboard" className="flex items-center font-semibold">
            <Briefcase className="mr-2 h-5 w-5 text-blue-600" />
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent font-bold">
              HR & Payroll
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 hidden h-14 items-center border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 md:flex md:px-6">
          <div className="ml-auto flex items-center gap-2">
            <LanguageSelector />
            <Button variant="outline" size="sm" className="hidden md:flex" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              {t("common.logout")}
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 mt-14 md:mt-0">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            {children}
          </motion.div>
        </main>
      </div>

      {/* Mobile navigation */}
      <div className="fixed bottom-0 left-0 z-10 flex w-full justify-between border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-2 md:hidden">
        <Link href="/dashboard">
          <Button
            variant={pathname === "/dashboard" ? "default" : "ghost"}
            size="icon"
            className={pathname === "/dashboard" ? "bg-blue-600" : ""}
          >
            <Home className="h-5 w-5" />
          </Button>
        </Link>

        {(userRole === "admin" || userRole === "hr-manager") && (
          <Link href="/dashboard/employees">
            <Button
              variant={pathname === "/dashboard/employees" ? "default" : "ghost"}
              size="icon"
              className={pathname === "/dashboard/employees" ? "bg-blue-600" : ""}
            >
              <Users className="h-5 w-5" />
            </Button>
          </Link>
        )}

        {(userRole === "admin" || userRole === "payroll-manager") && (
          <Link href="/dashboard/payroll">
            <Button
              variant={pathname === "/dashboard/payroll" ? "default" : "ghost"}
              size="icon"
              className={pathname === "/dashboard/payroll" ? "bg-blue-600" : ""}
            >
              <DollarSign className="h-5 w-5" />
            </Button>
          </Link>
        )}

        <Link href="/dashboard/notifications">
          <Button
            variant={pathname === "/dashboard/notifications" ? "default" : "ghost"}
            size="icon"
            className={pathname === "/dashboard/notifications" ? "bg-blue-600" : ""}
          >
            <Bell className="h-5 w-5" />
          </Button>
        </Link>

        <Link href="/dashboard/profile">
          <Button
            variant={pathname === "/dashboard/profile" ? "default" : "ghost"}
            size="icon"
            className={pathname === "/dashboard/profile" ? "bg-blue-600" : ""}
          >
            <UserCircle className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

