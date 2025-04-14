"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/lib/i18n/language-context"
import { LanguageSelector } from "@/components/language-selector"
import { motion } from "framer-motion"
import { Briefcase, User, Lock, ChevronRight, Info } from "lucide-react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useLanguage()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real application, we would validate credentials against a database
    // For demo purposes, we'll just check if fields are filled and redirect to dashboard
    if (username && password && role) {
      // Create a mock user object with more details based on the role
      const mockUserData = {
        id: `EMP${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0")}`,
        name: username,
        email: `${username.toLowerCase().replace(/\s+/g, ".")}@example.com`,
        role: role,
        department:
          role === "hr-manager"
            ? "Human Resources"
            : role === "payroll-manager"
              ? "Finance"
              : role === "admin"
                ? "Administration"
                : "Engineering",
        jobTitle:
          role === "hr-manager"
            ? "HR Manager"
            : role === "payroll-manager"
              ? "Payroll Manager"
              : role === "admin"
                ? "System Administrator"
                : "Software Engineer",
        joinDate: "2023-01-15",
        lastLogin: new Date().toISOString(),
      }

      // Store user data in localStorage for demo purposes
      localStorage.setItem("userRole", role)
      localStorage.setItem("userName", username)
      localStorage.setItem("userData", JSON.stringify(mockUserData))

      toast({
        title: t("auth.loginSuccess"),
        description: `${t("auth.loginSuccess")} ${role}`,
      })

      router.push("/dashboard")
    } else {
      toast({
        title: t("auth.loginFailed"),
        description: "Please fill in all fields",
        variant: "destructive",
      })
    }
  }

  // Don't render the full component until client-side hydration is complete
  if (!mounted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
            <CardDescription className="text-center">Enter your credentials to access the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-8">
              <div className="animate-pulse">Loading...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mb-6 shadow-lg shadow-blue-500/30"
          >
            <Briefcase className="h-10 w-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
            ZenHRM System
          </h1>
          <p className="mt-2 text-blue-200/80">Enterprise management solution</p>
        </div>

        <Card className="w-full shadow-xl border-0 bg-black/40 backdrop-blur-md">
          <CardHeader className="space-y-1 border-b border-white/10 bg-white/5">
            <CardTitle className="text-2xl font-bold text-center text-white">{t("auth.loginTitle")}</CardTitle>
            <CardDescription className="text-center text-blue-200/70">{t("auth.loginDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="username" className="text-blue-100">
                  {t("auth.username")}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-blue-400" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={t("auth.username")}
                    className="pl-10 bg-white/10 border-white/10 text-white placeholder:text-blue-200/50 focus:border-blue-400"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-blue-100">
                  {t("auth.password")}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-blue-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("auth.password")}
                    className="pl-10 bg-white/10 border-white/10 text-white placeholder:text-blue-200/50 focus:border-blue-400"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role" className="text-blue-100">
                  {t("auth.role")}
                </Label>
                <Select value={role} onValueChange={setRole} required>
                  <SelectTrigger id="role" className="bg-white/10 border-white/10 text-white focus:border-blue-400">
                    <SelectValue placeholder={t("auth.selectRole")} />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-white">
                    <SelectItem value="admin" className="focus:bg-blue-900/50 focus:text-white">
                      {t("auth.admin")}
                    </SelectItem>
                    <SelectItem value="hr-manager" className="focus:bg-blue-900/50 focus:text-white">
                      {t("auth.hrManager")}
                    </SelectItem>
                    <SelectItem value="payroll-manager" className="focus:bg-blue-900/50 focus:text-white">
                      {t("auth.payrollManager")}
                    </SelectItem>
                    <SelectItem value="employee" className="focus:bg-blue-900/50 focus:text-white">
                      {t("auth.employee")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-700/20"
              >
                {t("auth.loginButton")}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
          <CardFooter className="border-t border-white/10 bg-white/5 flex justify-center py-4">
            <div className="flex items-center text-xs text-blue-200/70">
              <Info className="mr-1 h-3 w-3" />
              <span>For demo purposes, any credentials will work</span>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
