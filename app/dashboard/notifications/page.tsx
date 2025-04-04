"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Clock, AlertTriangle, CheckCircle, Gift, Settings } from "lucide-react"
import { translations, type Language } from "@/lib/i18n/translations"

// Mock notification data
const mockNotifications = [
  {
    id: "not001",
    type: "anniversary",
    title: "Work Anniversary",
    message: "John Doe is celebrating 5 years with the company today!",
    date: "2025-04-04T09:00:00",
    read: false,
  },
  {
    id: "not002",
    type: "leave",
    title: "Leave Policy Violation",
    message: "Emily Davis has exceeded the allowed leave days for this month.",
    date: "2025-04-03T14:30:00",
    read: false,
  },
  {
    id: "not003",
    type: "payroll",
    title: "Payroll Processed",
    message: "April 2025 payroll has been processed successfully.",
    date: "2025-04-02T16:45:00",
    read: true,
  },
  {
    id: "not004",
    type: "system",
    title: "System Update",
    message: "The HR system will undergo maintenance on April 10, 2025, from 10 PM to 2 AM.",
    date: "2025-04-01T11:20:00",
    read: true,
  },
  {
    id: "not005",
    type: "anniversary",
    title: "Work Anniversary",
    message: "Sarah Brown is celebrating 1 year with the company tomorrow!",
    date: "2025-03-31T09:15:00",
    read: true,
  },
  {
    id: "not006",
    type: "payroll",
    title: "Payroll Error",
    message: "Potential calculation error detected in Michael Wilson's payroll. Please review.",
    date: "2025-03-30T13:10:00",
    read: true,
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [activeTab, setActiveTab] = useState("all")
  const [userRole, setUserRole] = useState<string | null>(null)
  const [language, setLanguage] = useState<Language>("en")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const role = localStorage.getItem("userRole")
    const savedLanguage = (localStorage.getItem("language") as Language) || "en"
    
    setUserRole(role)
    setLanguage(savedLanguage)
  }, [])

  const t = translations[language]

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
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

  if (!mounted) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t.notifications.title}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={markAllAsRead}>
            {t.notifications.markAllRead}
          </Button>
          {userRole === "admin" && (
            <Button>
              <Settings className="mr-2 h-4 w-4" />
              {t.notifications.configureAlerts}
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <CardTitle>{t.notifications.systemNotifications}</CardTitle>
              <CardDescription>{t.notifications.notificationsDescription}</CardDescription>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">{t.notifications.all}</TabsTrigger>
                <TabsTrigger value="anniversary">{t.notifications.anniversary}</TabsTrigger>
                <TabsTrigger value="leave">{t.notifications.leave}</TabsTrigger>
                <TabsTrigger value="payroll">{t.notifications.payroll}</TabsTrigger>
                <TabsTrigger value="system">{t.notifications.system}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getFilteredNotifications().length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Bell className="h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-center text-muted-foreground">{t.notifications.noNotifications}</p>
              </div>
            ) : (
              getFilteredNotifications().map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start space-x-4 rounded-lg border p-4 ${
                    !notification.read ? "bg-muted/50" : ""
                  }`}
                >
                  <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{notification.title}</p>
                      {!notification.read && (
                        <Badge variant="outline" className="ml-2">
                          {t.common.view}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      {formatDate(notification.date)}
                    </div>
                  </div>
                  {!notification.read && (
                    <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                      {t.notifications.markAsRead}
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {userRole === "admin" && (
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Configure system-wide notification preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Work Anniversary Notifications</div>
                  <div className="text-sm text-muted-foreground">
                    Send notifications for employee work anniversaries
                  </div>
                </div>
                <div className="ml-auto flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Leave Policy Alerts</div>
                  <div className="text-sm text-muted-foreground">Send alerts when employees violate leave policies</div>
                </div>
                <div className="ml-auto flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Payroll Notifications</div>
                  <div className="text-sm text-muted-foreground">
                    Send notifications about payroll processing and errors
                  </div>
                </div>
                <div className="ml-auto flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Email Notifications</div>
                  <div className="text-sm text-muted-foreground">Configure email delivery for system notifications</div>
                </div>
                <div className="ml-auto flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

