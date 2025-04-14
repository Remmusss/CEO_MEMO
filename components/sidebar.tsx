"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/language-context"
import { useTheme } from "next-themes"
import {
  Users,
  Briefcase,
  Building2,
  Bell,
  Settings,
  Home,
  DollarSign,
  BarChart4,
  UserCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react"

type SidebarProps = {
  userRole: string
  onLogout: () => void
}

export function Sidebar({ userRole, onLogout }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { t } = useLanguage()
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
    // Load sidebar state from localStorage
    const savedState = localStorage.getItem("sidebarCollapsed")
    if (savedState !== null) {
      setCollapsed(savedState === "true")
    } else {
      // Default to expanded on larger screens, collapsed on smaller ones
      setCollapsed(window.innerWidth < 1024)
    }
  }, [])

  const toggleSidebar = () => {
    const newState = !collapsed
    setCollapsed(newState)
    localStorage.setItem("sidebarCollapsed", String(newState))
  }

  const sidebarLinks = [
    {
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
      label: t("common.dashboard"),
      roles: ["admin", "hr-manager", "payroll-manager", "employee"],
    },
    {
      href: "/dashboard/employees",
      icon: <Users className="h-5 w-5" />,
      label: t("common.employees"),
      roles: ["admin", "hr-manager"],
    },
    {
      href: "/dashboard/payroll",
      icon: <DollarSign className="h-5 w-5" />,
      label: t("common.payroll"),
      roles: ["admin", "payroll-manager"],
    },
    {
      href: "/dashboard/departments",
      icon: <Building2 className="h-5 w-5" />,
      label: t("common.departments"),
      roles: ["admin", "hr-manager"],
    },
    {
      href: "/dashboard/reports",
      icon: <BarChart4 className="h-5 w-5" />,
      label: t("common.reports"),
      roles: ["admin", "hr-manager", "payroll-manager"],
    },
    {
      href: "/dashboard/notifications",
      icon: <Bell className="h-5 w-5" />,
      label: t("common.notifications"),
      roles: ["admin", "hr-manager", "payroll-manager", "employee"],
    },
    {
      href: "/dashboard/profile",
      icon: <UserCircle className="h-5 w-5" />,
      label: t("common.profile"),
      roles: ["admin", "hr-manager", "payroll-manager", "employee"],
    },
    {
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
      label: t("common.settings"),
      roles: ["admin"],
    },
  ]

  if (!mounted) return null

  return (
    <div className="relative flex h-screen">
      <motion.div
        initial={false}
        animate={{
          width: collapsed ? 80 : 280,
          transition: { duration: 0.3, ease: "easeInOut" },
        }}
        className={`fixed left-0 top-0 z-20 h-screen ${
          theme === "dark" ? "bg-slate-950 border-r border-slate-800" : "bg-white border-r border-slate-200"
        } shadow-lg`}
      >
        <div
          className={`flex h-14 items-center justify-between ${theme === "dark" ? "border-b border-slate-800" : "border-b border-slate-200"} px-4`}
        >
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center"
              >
                <Briefcase className="mr-2 h-5 w-5 text-blue-600" />
                <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent font-bold">
                  ZenHRM
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className={`rounded-full ${theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>

        <div className="flex flex-col h-[calc(100vh-3.5rem)] justify-between">
          <nav className="flex-1 overflow-y-auto py-4 px-2">
            <ul className="space-y-1">
              {sidebarLinks.map(
                (link) =>
                  link.roles.includes(userRole) && (
                    <li key={link.href}>
                      <Link href={link.href}>
                        <Button
                          variant={pathname === link.href ? "default" : "ghost"}
                          className={cn(
                            "w-full justify-start",
                            pathname === link.href
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : `${theme === "dark" ? "hover:bg-slate-800 text-slate-300" : "hover:bg-slate-100 text-slate-700"}`,
                            collapsed ? "justify-center px-2" : "",
                          )}
                        >
                          {link.icon}
                          <AnimatePresence initial={false}>
                            {!collapsed && (
                              <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.2 }}
                                className="ml-2 overflow-hidden whitespace-nowrap"
                              >
                                {link.label}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </Button>
                      </Link>
                    </li>
                  ),
              )}
            </ul>
          </nav>

          <div className={`${theme === "dark" ? "border-t border-slate-800" : "border-t border-slate-200"} p-4`}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900 dark:hover:text-red-400",
                collapsed ? "justify-center px-2" : "",
              )}
              onClick={onLogout}
            >
              <LogOut className="h-5 w-5" />
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-2 overflow-hidden whitespace-nowrap"
                  >
                    {t("common.logout")}
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Spacer to push content to the right of the sidebar */}
      <motion.div
        initial={false}
        animate={{
          width: collapsed ? 80 : 280,
          transition: { duration: 0.3, ease: "easeInOut" },
        }}
        className="flex-shrink-0"
      />
    </div>
  )
}
