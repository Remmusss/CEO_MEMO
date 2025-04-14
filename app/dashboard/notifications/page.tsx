"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Clock, AlertTriangle, CheckCircle, Gift, Settings, Trash2 } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { motion } from "framer-motion"
import { NotificationDetailDialog, type NotificationType } from "@/components/notification-detail-dialog"
import { useToast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"

// Enhanced mock notification data with details
const mockNotifications: NotificationType[] = [
  {
    id: "not001",
    type: "anniversary",
    title: "Work Anniversary",
    message: "John Doe is celebrating 5 years with the company today!",
    date: "2025-04-04T09:00:00",
    read: false,
    details: {
      employeeId: "EMP001",
      yearsOfService: 5,
      department: "Engineering",
      joinDate: "2020-04-04",
      upcomingMilestone: "10 years - 2025-04-04",
    },
  },
  {
    id: "not002",
    type: "leave",
    title: "Leave Policy Violation",
    message: "Emily Davis has exceeded the allowed leave days for this month.",
    date: "2025-04-03T14:30:00",
    read: false,
    details: {
      employeeId: "EMP004",
      allowedLeaveDays: 3,
      takenLeaveDays: 5,
      excessDays: 2,
      leaveType: "Sick Leave",
      managerName: "Sarah Johnson",
    },
  },
  {
    id: "not003",
    type: "payroll",
    title: "Payroll Processed",
    message: "April 2025 payroll has been processed successfully.",
    date: "2025-04-02T16:45:00",
    read: true,
    details: {
      payrollId: "PAY2025-04",
      totalAmount: "$245,000",
      employeeCount: 120,
      processingDate: "2025-04-02",
      paymentDate: "2025-04-05",
      approvedBy: "Michael Wilson",
    },
  },
  {
    id: "not004",
    type: "system",
    title: "System Update",
    message: "The HR system will undergo maintenance on April 10, 2025, from 10 PM to 2 AM.",
    date: "2025-04-01T11:20:00",
    read: true,
    details: {
      maintenanceWindow: "April 10, 2025, 10 PM - 2 AM",
      affectedServices: "All HR services",
      expectedDowntime: "4 hours",
      contactPerson: "IT Support",
      priority: "High",
    },
  },
  {
    id: "not005",
    type: "anniversary",
    title: "Work Anniversary",
    message: "Sarah Brown is celebrating 1 year with the company tomorrow!",
    date: "2025-03-31T09:15:00",
    read: true,
    details: {
      employeeId: "EMP006",
      yearsOfService: 1,
      department: "Engineering",
      joinDate: "2024-04-01",
      upcomingMilestone: "5 years - 2029-04-01",
    },
  },
  {
    id: "not006",
    type: "payroll",
    title: "Payroll Error",
    message: "Potential calculation error detected in Michael Wilson's payroll. Please review.",
    date: "2025-03-30T13:10:00",
    read: true,
    details: {
      employeeId: "EMP005",
      payrollId: "PAY2025-03-EMP005",
      errorType: "Overtime calculation",
      reportedBy: "System Audit",
      priority: "Medium",
      requiredAction: "Manual review",
    },
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [activeTab, setActiveTab] = useState("all")
  const [userRole, setUserRole] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<NotificationType | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { t } = useLanguage()
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
    const role = localStorage.getItem("userRole")
    setUserRole(role)

    // Load notifications from localStorage if available
    const savedNotifications = localStorage.getItem("notifications")
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications))
    }
  }, [])

  // Save notifications to localStorage when they change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("notifications", JSON.stringify(notifications))
    }
  }, [notifications, mounted])

  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id ? { ...notification, read: true } : notification,
    )
    setNotifications(updatedNotifications)

    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read",
    })
  }

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((notification) => ({ ...notification, read: true }))
    setNotifications(updatedNotifications)

    toast({
      title: "All notifications marked as read",
      description: "All notifications have been marked as read",
    })
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))

    toast({
      title: "Notification deleted",
      description: "The notification has been removed",
      variant: "destructive",
    })
  }

  const getFilteredNotifications = () => {
    if (activeTab === "all") {
      return notifications
    }
    return notifications.filter((notification) => notification.type === activeTab)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "anniversary":
        return <Gift className="h-5 w-5 text-blue-500" />
      case "leave":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "payroll":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "system":
        return <Settings className="h-5 w-5 text-purple-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const handleNotificationClick = (notification: NotificationType) => {
    setSelectedNotification(notification)
    setDialogOpen(true)
  }

  if (!mounted) {
    return null
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          {t("notifications.title")}
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={markAllAsRead}
            className="border-slate-700 text-blue-300 hover:bg-blue-900/20 hover:text-blue-100"
          >
            {t("notifications.markAllRead")}
          </Button>
          {userRole === "admin" && (
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Settings className="mr-2 h-4 w-4" />
              {t("notifications.configureAlerts")}
            </Button>
          )}
        </div>
      </div>

      <Card className="border-0 shadow-xl bg-gradient-to-b from-slate-900 to-slate-800">
        <CardHeader className="border-b border-slate-700/50">
          <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <CardTitle className="text-white">{t("notifications.systemNotifications")}</CardTitle>
              <CardDescription className="text-blue-300">{t("notifications.notificationsDescription")}</CardDescription>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList className="grid w-full grid-cols-5 bg-slate-800 border border-slate-700">
                <TabsTrigger value="all" className="data-[state=active]:bg-blue-900 data-[state=active]:text-white">
                  {t("notifications.all")}
                </TabsTrigger>
                <TabsTrigger
                  value="anniversary"
                  className="data-[state=active]:bg-blue-900 data-[state=active]:text-white"
                >
                  {t("notifications.anniversary")}
                </TabsTrigger>
                <TabsTrigger value="leave" className="data-[state=active]:bg-blue-900 data-[state=active]:text-white">
                  {t("notifications.leave")}
                </TabsTrigger>
                <TabsTrigger value="payroll" className="data-[state=active]:bg-blue-900 data-[state=active]:text-white">
                  {t("notifications.payroll")}
                </TabsTrigger>
                <TabsTrigger value="system" className="data-[state=active]:bg-blue-900 data-[state=active]:text-white">
                  {t("notifications.system")}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {getFilteredNotifications().length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Bell className="h-12 w-12 text-slate-500" />
                <p className="mt-2 text-center text-slate-400">{t("notifications.noNotifications")}</p>
              </div>
            ) : (
              getFilteredNotifications().map((notification) => (
                <motion.div
                  key={notification.id}
                  className={`flex items-start space-x-4 rounded-lg border border-slate-700 p-4 cursor-pointer hover:bg-slate-800/50 transition-colors ${
                    !notification.read ? "bg-slate-800/50" : ""
                  }`}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-white">{notification.title}</p>
                      {!notification.read && (
                        <Badge variant="outline" className="ml-2 bg-blue-900/20 text-blue-400 border-blue-800">
                          {t("common.new")}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-400">{notification.message}</p>
                    <div className="flex items-center text-xs text-slate-500">
                      <Clock className="mr-1 h-3 w-3" />
                      {formatDate(notification.date)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          markAsRead(notification.id)
                        }}
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                      >
                        {t("notifications.markAsRead")}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteNotification(notification.id)
                      }}
                      className="text-slate-400 hover:text-red-400 hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {userRole === "admin" && (
        <Card className="border-0 shadow-xl bg-gradient-to-b from-slate-900 to-slate-800">
          <CardHeader className="border-b border-slate-700/50">
            <CardTitle className="text-white">{t("notifications.notificationSettings")}</CardTitle>
            <CardDescription className="text-blue-300">{t("notifications.configurePreferences")}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium text-white">{t("notifications.workAnniversary")}</div>
                  <div className="text-sm text-slate-400">{t("notifications.sendAnniversary")}</div>
                </div>
                <div className="ml-auto flex items-center space-x-2">
                  <Switch defaultChecked />
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-700 text-blue-300 hover:bg-blue-900/20 hover:text-blue-100"
                  >
                    {t("common.configure")}
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium text-white">{t("notifications.leavePolicy")}</div>
                  <div className="text-sm text-slate-400">{t("notifications.sendLeave")}</div>
                </div>
                <div className="ml-auto flex items-center space-x-2">
                  <Switch defaultChecked />
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-700 text-blue-300 hover:bg-blue-900/20 hover:text-blue-100"
                  >
                    {t("common.configure")}
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium text-white">{t("notifications.payrollNotifications")}</div>
                  <div className="text-sm text-slate-400">{t("notifications.sendPayroll")}</div>
                </div>
                <div className="ml-auto flex items-center space-x-2">
                  <Switch defaultChecked />
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-700 text-blue-300 hover:bg-blue-900/20 hover:text-blue-100"
                  >
                    {t("common.configure")}
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium text-white">{t("notifications.emailNotifications")}</div>
                  <div className="text-sm text-slate-400">{t("notifications.configureEmail")}</div>
                </div>
                <div className="ml-auto flex items-center space-x-2">
                  <Switch defaultChecked />
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-700 text-blue-300 hover:bg-blue-900/20 hover:text-blue-100"
                  >
                    {t("common.configure")}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <NotificationDetailDialog
        notification={selectedNotification}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onMarkAsRead={markAsRead}
      />
    </motion.div>
  )
}
