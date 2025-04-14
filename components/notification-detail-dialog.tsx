"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Clock, AlertTriangle, CheckCircle, Gift, Settings, Calendar, User } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

export type NotificationType = {
  id: string
  type: string
  title: string
  message: string
  date: string
  read: boolean
  details?: {
    [key: string]: string | number | boolean
  }
}

interface NotificationDetailDialogProps {
  notification: NotificationType | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onMarkAsRead: (id: string) => void
}

export function NotificationDetailDialog({
  notification,
  open,
  onOpenChange,
  onMarkAsRead,
}: NotificationDetailDialogProps) {
  const { t } = useLanguage()

  if (!notification) return null

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

  const handleMarkAsRead = () => {
    onMarkAsRead(notification.id)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800">
              {getNotificationIcon(notification.type)}
            </div>
            <DialogTitle className="text-white">{notification.title}</DialogTitle>
          </div>
          <DialogDescription className="flex items-center gap-1 pt-1 text-slate-400">
            <Clock className="h-3 w-3" />
            <span>{formatDate(notification.date)}</span>
            {!notification.read && (
              <Badge variant="outline" className="ml-2 bg-blue-900/20 text-blue-400 border-blue-800">
                {t("common.new")}
              </Badge>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-slate-300">{notification.message}</p>

          {notification.details && (
            <div className="rounded-md border border-slate-700 p-3 bg-slate-800/50">
              <h4 className="text-sm font-medium mb-2 text-blue-300">{t("notifications.additionalDetails")}</h4>
              <div className="space-y-2">
                {Object.entries(notification.details).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}:</span>
                    <span className="font-medium text-slate-300">{value.toString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {notification.type === "anniversary" && (
            <div className="flex items-center gap-2 rounded-md border border-slate-700 p-3 bg-blue-900/20">
              <User className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-slate-300">Send congratulations to this employee</span>
            </div>
          )}

          {notification.type === "payroll" && (
            <div className="flex items-center gap-2 rounded-md border border-slate-700 p-3 bg-green-900/20">
              <Calendar className="h-4 w-4 text-green-400" />
              <span className="text-sm text-slate-300">View complete payroll report</span>
            </div>
          )}

          {notification.type === "leave" && (
            <div className="flex items-center gap-2 rounded-md border border-slate-700 p-3 bg-yellow-900/20">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-slate-300">Review leave policy with this employee</span>
            </div>
          )}
        </div>
        <DialogFooter className="flex sm:justify-between">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-slate-700 text-blue-300 hover:bg-slate-800"
          >
            {t("common.close")}
          </Button>
          {!notification.read && (
            <Button onClick={handleMarkAsRead} className="bg-blue-600 hover:bg-blue-700">
              {t("notifications.markAsRead")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
