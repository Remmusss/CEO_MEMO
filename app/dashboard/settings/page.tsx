"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Settings, Shield, Bell, Database, Globe, Mail, Lock, Save } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

export default function SettingsPage() {
  const [userRole, setUserRole] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [formState, setFormState] = useState({
    companyName: "Acme Inc",
    systemEmail: "system@acmeinc.com",
    timezone: "utc-8",
    dateFormat: "mm-dd-yyyy",
    maintenanceMode: false,
    twoFactor: true,
    passwordPolicy: true,
    sessionTimeout: "30",
    loginAttempts: "5",
    emailNotifications: true,
  })
  const router = useRouter()
  const { t } = useLanguage()
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
    const role = localStorage.getItem("userRole")
    setUserRole(role)

    // Redirect if not admin
    if (role !== "admin") {
      router.push("/dashboard")
    }

    // Load settings from localStorage if available
    const savedSettings = localStorage.getItem("systemSettings")
    if (savedSettings) {
      setFormState(JSON.parse(savedSettings))
    }
  }, [router])

  // Save settings to localStorage when they change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("systemSettings", JSON.stringify(formState))
    }
  }, [formState, mounted])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target
    setFormState({
      ...formState,
      [id]: type === "checkbox" ? checked : value,
    })
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormState({
      ...formState,
      [id]: value,
    })
  }

  const handleSwitchChange = (id: string, checked: boolean) => {
    setFormState({
      ...formState,
      [id]: checked,
    })
  }

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your system settings have been updated successfully",
    })
  }

  const handleTestEmail = () => {
    toast({
      title: "Test Email Sent",
      description: "A test email has been sent to the system email address",
    })
  }

  if (!mounted || userRole !== "admin") {
    return null
  }

  return (
    <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
        {t("settings.title")}
      </h1>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 md:grid-cols-6 bg-slate-800 border border-slate-700">
          <TabsTrigger value="general" className="data-[state=active]:bg-blue-900 data-[state=active]:text-white">
            <Settings className="mr-2 h-4 w-4" />
            {t("settings.generalTab")}
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-blue-900 data-[state=active]:text-white">
            <Users className="mr-2 h-4 w-4" />
            {t("settings.usersTab")}
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-blue-900 data-[state=active]:text-white">
            <Shield className="mr-2 h-4 w-4" />
            {t("settings.securityTab")}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-blue-900 data-[state=active]:text-white">
            <Bell className="mr-2 h-4 w-4" />
            {t("settings.notificationsTab")}
          </TabsTrigger>
          <TabsTrigger
            value="database"
            className="hidden md:flex data-[state=active]:bg-blue-900 data-[state=active]:text-white"
          >
            <Database className="mr-2 h-4 w-4" />
            {t("settings.databaseTab")}
          </TabsTrigger>
          <TabsTrigger
            value="integrations"
            className="hidden md:flex data-[state=active]:bg-blue-900 data-[state=active]:text-white"
          >
            <Globe className="mr-2 h-4 w-4" />
            {t("settings.integrationsTab")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card className="border-0 shadow-xl bg-gradient-to-b from-slate-900 to-slate-800">
            <CardHeader className="border-b border-slate-700/50">
              <CardTitle className="text-white">{t("settings.generalSettings")}</CardTitle>
              <CardDescription className="text-blue-300">{t("settings.generalDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-blue-300">
                  {t("settings.companyName")}
                </Label>
                <Input
                  id="companyName"
                  value={formState.companyName}
                  onChange={handleInputChange}
                  className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="systemEmail" className="text-blue-300">
                  {t("settings.systemEmail")}
                </Label>
                <Input
                  id="systemEmail"
                  value={formState.systemEmail}
                  onChange={handleInputChange}
                  className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone" className="text-blue-300">
                  {t("settings.timezone")}
                </Label>
                <Select value={formState.timezone} onValueChange={(value) => handleSelectChange("timezone", value)}>
                  <SelectTrigger
                    id="timezone"
                    className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                  >
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700 text-white">
                    <SelectItem value="utc-12" className="focus:bg-blue-900/50 focus:text-white">
                      UTC-12:00
                    </SelectItem>
                    <SelectItem value="utc-8" className="focus:bg-blue-900/50 focus:text-white">
                      UTC-08:00 (Pacific Time)
                    </SelectItem>
                    <SelectItem value="utc-5" className="focus:bg-blue-900/50 focus:text-white">
                      UTC-05:00 (Eastern Time)
                    </SelectItem>
                    <SelectItem value="utc-0" className="focus:bg-blue-900/50 focus:text-white">
                      UTC+00:00 (GMT)
                    </SelectItem>
                    <SelectItem value="utc+1" className="focus:bg-blue-900/50 focus:text-white">
                      UTC+01:00 (Central European Time)
                    </SelectItem>
                    <SelectItem value="utc+8" className="focus:bg-blue-900/50 focus:text-white">
                      UTC+08:00 (China Standard Time)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateFormat" className="text-blue-300">
                  {t("settings.dateFormat")}
                </Label>
                <Select value={formState.dateFormat} onValueChange={(value) => handleSelectChange("dateFormat", value)}>
                  <SelectTrigger
                    id="dateFormat"
                    className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                  >
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700 text-white">
                    <SelectItem value="mm-dd-yyyy" className="focus:bg-blue-900/50 focus:text-white">
                      MM/DD/YYYY
                    </SelectItem>
                    <SelectItem value="dd-mm-yyyy" className="focus:bg-blue-900/50 focus:text-white">
                      DD/MM/YYYY
                    </SelectItem>
                    <SelectItem value="yyyy-mm-dd" className="focus:bg-blue-900/50 focus:text-white">
                      YYYY/MM/DD
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenanceMode" className="text-blue-300">
                    {t("settings.maintenanceMode")}
                  </Label>
                  <p className="text-sm text-slate-400">Put the system in maintenance mode</p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={formState.maintenanceMode}
                  onCheckedChange={(checked) => handleSwitchChange("maintenanceMode", checked)}
                />
              </div>
              <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700 mt-2">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card className="border-0 shadow-xl bg-gradient-to-b from-slate-900 to-slate-800">
            <CardHeader className="border-b border-slate-700/50">
              <CardTitle className="text-white">{t("settings.userManagement")}</CardTitle>
              <CardDescription className="text-blue-300">{t("settings.userDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="rounded-md border border-slate-700 bg-slate-800/50">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-white">Admin Users</h3>
                      <p className="text-sm text-slate-400">Users with full system access</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-700 text-blue-300 hover:bg-blue-900/20 hover:text-blue-100"
                    >
                      Manage
                    </Button>
                  </div>
                </div>
              </div>
              <div className="rounded-md border border-slate-700 bg-slate-800/50">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-white">HR Managers</h3>
                      <p className="text-sm text-slate-400">Users with HR management access</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-700 text-blue-300 hover:bg-blue-900/20 hover:text-blue-100"
                    >
                      Manage
                    </Button>
                  </div>
                </div>
              </div>
              <div className="rounded-md border border-slate-700 bg-slate-800/50">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-white">Payroll Managers</h3>
                      <p className="text-sm text-slate-400">Users with payroll management access</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-700 text-blue-300 hover:bg-blue-900/20 hover:text-blue-100"
                    >
                      Manage
                    </Button>
                  </div>
                </div>
              </div>
              <div className="rounded-md border border-slate-700 bg-slate-800/50">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-white">Employees</h3>
                      <p className="text-sm text-slate-400">Regular employee accounts</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-700 text-blue-300 hover:bg-blue-900/20 hover:text-blue-100"
                    >
                      Manage
                    </Button>
                  </div>
                </div>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">Add New User</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card className="border-0 shadow-xl bg-gradient-to-b from-slate-900 to-slate-800">
            <CardHeader className="border-b border-slate-700/50">
              <CardTitle className="text-white">{t("settings.securitySettings")}</CardTitle>
              <CardDescription className="text-blue-300">{t("settings.securityDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center">
                    <Lock className="mr-2 h-4 w-4 text-blue-400" />
                    <Label htmlFor="2fa" className="text-blue-300">
                      {t("settings.twoFactor")}
                    </Label>
                  </div>
                  <p className="text-sm text-slate-400">Require 2FA for all admin users</p>
                </div>
                <Switch
                  id="twoFactor"
                  checked={formState.twoFactor}
                  onCheckedChange={(checked) => handleSwitchChange("twoFactor", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center">
                    <Lock className="mr-2 h-4 w-4 text-blue-400" />
                    <Label htmlFor="passwordPolicy" className="text-blue-300">
                      {t("settings.passwordPolicy")}
                    </Label>
                  </div>
                  <p className="text-sm text-slate-400">Enforce strong password requirements</p>
                </div>
                <Switch
                  id="passwordPolicy"
                  checked={formState.passwordPolicy}
                  onCheckedChange={(checked) => handleSwitchChange("passwordPolicy", checked)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout" className="text-blue-300">
                  {t("settings.sessionTimeout")}
                </Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={formState.sessionTimeout}
                  onChange={handleInputChange}
                  className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loginAttempts" className="text-blue-300">
                  {t("settings.maxLoginAttempts")}
                </Label>
                <Input
                  id="loginAttempts"
                  type="number"
                  value={formState.loginAttempts}
                  onChange={handleInputChange}
                  className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                />
              </div>
              <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700 mt-2">
                <Save className="mr-2 h-4 w-4" />
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="border-0 shadow-xl bg-gradient-to-b from-slate-900 to-slate-800">
            <CardHeader className="border-b border-slate-700/50">
              <CardTitle className="text-white">{t("settings.notificationSettings")}</CardTitle>
              <CardDescription className="text-blue-300">{t("settings.notificationDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center">
                    <Mail className="mr-2 h-4 w-4 text-blue-400" />
                    <Label htmlFor="emailNotifications" className="text-blue-300">
                      {t("settings.emailNotifications")}
                    </Label>
                  </div>
                  <p className="text-sm text-slate-400">Send system notifications via email</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={formState.emailNotifications}
                  onCheckedChange={(checked) => handleSwitchChange("emailNotifications", checked)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpServer" className="text-blue-300">
                  SMTP Server
                </Label>
                <Input
                  id="smtpServer"
                  defaultValue="smtp.acmeinc.com"
                  className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPort" className="text-blue-300">
                  SMTP Port
                </Label>
                <Input
                  id="smtpPort"
                  defaultValue="587"
                  className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpUsername" className="text-blue-300">
                  SMTP Username
                </Label>
                <Input
                  id="smtpUsername"
                  defaultValue="notifications@acmeinc.com"
                  className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPassword" className="text-blue-300">
                  SMTP Password
                </Label>
                <Input
                  id="smtpPassword"
                  type="password"
                  defaultValue="********"
                  className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                />
              </div>
              <Button onClick={handleTestEmail} className="bg-blue-600 hover:bg-blue-700 mt-2">
                Test Email Configuration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card className="border-0 shadow-xl bg-gradient-to-b from-slate-900 to-slate-800">
            <CardHeader className="border-b border-slate-700/50">
              <CardTitle className="text-white">{t("settings.databaseSettings")}</CardTitle>
              <CardDescription className="text-blue-300">{t("settings.databaseDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="rounded-md border border-slate-700 p-4 bg-slate-800/50">
                <h3 className="font-medium text-white">Database Information</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-blue-300">Type:</span>
                    <span className="text-sm text-slate-300">PostgreSQL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-blue-300">Version:</span>
                    <span className="text-sm text-slate-300">14.5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-blue-300">Status:</span>
                    <span className="text-sm text-green-500">Connected</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-blue-300">Database Backup</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="border-slate-700 text-blue-300 hover:bg-blue-900/20 hover:text-blue-100"
                  >
                    Manual Backup
                  </Button>
                  <Button
                    variant="outline"
                    className="border-slate-700 text-blue-300 hover:bg-blue-900/20 hover:text-blue-100"
                  >
                    Restore Backup
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoBackup" className="text-blue-300">
                    Automatic Backups
                  </Label>
                  <p className="text-sm text-slate-400">Schedule regular database backups</p>
                </div>
                <Switch id="autoBackup" defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="backupFrequency" className="text-blue-300">
                  Backup Frequency
                </Label>
                <Select defaultValue="daily">
                  <SelectTrigger
                    id="backupFrequency"
                    className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                  >
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700 text-white">
                    <SelectItem value="hourly" className="focus:bg-blue-900/50 focus:text-white">
                      Hourly
                    </SelectItem>
                    <SelectItem value="daily" className="focus:bg-blue-900/50 focus:text-white">
                      Daily
                    </SelectItem>
                    <SelectItem value="weekly" className="focus:bg-blue-900/50 focus:text-white">
                      Weekly
                    </SelectItem>
                    <SelectItem value="monthly" className="focus:bg-blue-900/50 focus:text-white">
                      Monthly
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card className="border-0 shadow-xl bg-gradient-to-b from-slate-900 to-slate-800">
            <CardHeader className="border-b border-slate-700/50">
              <CardTitle className="text-white">{t("settings.systemIntegrations")}</CardTitle>
              <CardDescription className="text-blue-300">{t("settings.integrationsDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="rounded-md border border-slate-700 bg-slate-800/50">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-white">PAYROLL Integration</h3>
                      <p className="text-sm text-slate-400">Connect to external payroll system</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-green-900/20 text-green-400 border-green-800">
                        Connected
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-700 text-blue-300 hover:bg-blue-900/20 hover:text-blue-100"
                      >
                        Configure
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-md border border-slate-700 bg-slate-800/50">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-white">HUMAN_2025 Integration</h3>
                      <p className="text-sm text-slate-400">Connect to HR management system</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-green-900/20 text-green-400 border-green-800">
                        Connected
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-700 text-blue-300 hover:bg-blue-900/20 hover:text-blue-100"
                      >
                        Configure
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-md border border-slate-700 bg-slate-800/50">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-white">Email Service Integration</h3>
                      <p className="text-sm text-slate-400">Connect to email notification service</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-green-900/20 text-green-400 border-green-800">
                        Connected
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-700 text-blue-300 hover:bg-blue-900/20 hover:text-blue-100"
                      >
                        Configure
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">Add New Integration</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
