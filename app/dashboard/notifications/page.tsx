"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Clock,
  AlertTriangle,
  CheckCircle,
  Gift,
  Settings,
  Trash2,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import { motion } from "framer-motion";
import {
  NotificationDetailDialog,
  type NotificationType,
} from "@/components/notification-detail-dialog";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

// API base URLs
const NOTIFICATIONS_API_BASE_URL = `${process.env.NEXT_PUBLIC_DOMAIN}/notifications`;

// Hàm lấy header xác thực
const getAuthHeaders = () => {
  const token = localStorage.getItem("userToken");
  if (!token) {
    console.warn("No userToken found in localStorage");
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// API functions
const fetchAnniversaries = async () => {
  try {
    const response = await fetch(
      `${NOTIFICATIONS_API_BASE_URL}/anniversaries`,
      {
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Fetch anniversaries error:", errorData);
      throw new Error(
        `Lỗi khi lấy thông báo kỷ niệm: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    // Chuẩn hóa trả về mảng
    return {
      status: data.status,
      data: data.data?.upcoming_anniversaries || [],
    };
  } catch (error) {
    console.error("Fetch anniversaries failed:", error);
    throw error;
  }
};

const fetchAbsentDaysWarning = async () => {
  try {
    const response = await fetch(
      `${NOTIFICATIONS_API_BASE_URL}/absent-days-warning`,
      {
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Fetch absent days warning error:", errorData);
      throw new Error(
        `Lỗi khi lấy thông báo nghỉ phép: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    // Chuẩn hóa trả về mảng
    return {
      status: data.status,
      data: data.data?.absent_days_warning || [],
    };
  } catch (error) {
    console.error("Fetch absent days warning failed:", error);
    throw error;
  }
};

const fetchAbsentDaysPersonalWarning = async () => {
  try {
    const response = await fetch(
      `${NOTIFICATIONS_API_BASE_URL}/absent-days-personal-warning`,
      {
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Fetch personal absent days warning error:", errorData);
      throw new Error(
        `Lỗi khi lấy thông báo nghỉ phép cá nhân: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    // Chuẩn hóa trả về mảng
    return {
      status: data.status,
      data: data.data?.absent_days_warning || [],
    };
  } catch (error) {
    console.error("Fetch personal absent days warning failed:", error);
    throw error;
  }
};

const fetchSalaryGapWarning = async () => {
  try {
    const response = await fetch(
      `${NOTIFICATIONS_API_BASE_URL}/salary-gap-warning`,
      {
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Fetch salary gap warning error:", errorData);
      throw new Error(
        `Lỗi khi lấy thông báo chênh lệch lương: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    // Chuẩn hóa trả về mảng
    return {
      status: data.status,
      data: data.data?.salary_gap_warning || [],
    };
  } catch (error) {
    console.error("Fetch salary gap warning failed:", error);
    throw error;
  }
};

const fetchSalaryGapWarningPersonal = async () => {
  try {
    const response = await fetch(
      `${NOTIFICATIONS_API_BASE_URL}/salary-gap-warning-personal`,
      {
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Fetch personal salary gap warning error:", errorData);
      throw new Error(
        `Lỗi khi lấy thông báo chênh lệch lương cá nhân: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    // Chuẩn hóa trả về mảng
    return {
      status: data.status,
      data: data.data?.salary_gap_warning || [],
    };
  } catch (error) {
    console.error("Fetch personal salary gap warning failed:", error);
    throw error;
  }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();

  // Load initial data
  useEffect(() => {
    setMounted(true);
    const role = localStorage.getItem("userRole");
    setUserRole(role);

    if (
      !role ||
      (role !== "admin" && role !== "hr-manager" && role !== "employee")
    ) {
      toast({
        title: "Lỗi Quyền Truy Cập",
        description: "Bạn không có quyền truy cập trang này.",
        variant: "destructive",
      });
      return;
    }

    loadNotifications();
  }, []);

  // Load notifications based on user role
  const loadNotifications = async () => {
    try {
      let data: NotificationType[] = [];
      if (userRole === "admin" || userRole === "hr-manager") {
        const [anniversaries, absentDays, salaryGap] = await Promise.all([
          fetchAnniversaries(),
          fetchAbsentDaysWarning(),
          fetchSalaryGapWarning(),
        ]);
        // Anniversaries
        const anniversaryNotifications =
          anniversaries.status === "success" &&
          Array.isArray(anniversaries.data)
            ? anniversaries.data.map((n: any) => ({
                id: `anniversary-${n.EmployeeID}-${n.AnniversaryDate}`,
                type: "anniversary",
                title: `Kỷ niệm làm việc: ${n.FullName}`,
                message: `Sẽ đạt mốc ${n.MilestoneYears} năm vào ngày ${n.AnniversaryDate}. Gia nhập: ${n.JoinDate}. Mốc tiếp theo: ${n.UpcomingMilestone} năm.`,
                date: n.AnniversaryDate,
                read: false,
              }))
            : [];
        // Absent Days
        const absentNotifications =
          absentDays.status === "success" && Array.isArray(absentDays.data)
            ? absentDays.data.map((n: any) => ({
                id: `leave-${n.EmployeeID}-${n.AttendanceMonth}`,
                type: "leave",
                title: `Cảnh báo nghỉ phép: Nhân viên #${n.EmployeeID}`,
                message: `Tháng ${n.AttendanceMonth}: Được phép ${n.AllowedLeaveDays} ngày, đã nghỉ ${n.TakenLeaveDays} ngày, vượt quá ${n.ExcessDays} ngày.`,
                date: n.AttendanceMonth,
                read: false,
              }))
            : [];
        // Payroll
        const payrollNotifications =
          salaryGap.status === "success" && Array.isArray(salaryGap.data)
            ? salaryGap.data.map((n: any) => ({
                id: `payroll-${n.EmployeeID || n.id || Math.random()}`,
                type: "payroll",
                title: `Cảnh báo chênh lệch lương: Nhân viên #${
                  n.EmployeeID || n.id || ""
                }`,
                message:
                  n.Month1 && n.Month2
                    ? `Lương tháng ${n.Month1}: ${n.Salary1}, tháng ${
                        n.Month2
                      }: ${n.Salary2}, chênh lệch: ${
                        n.Gap || n.SalaryGap || ""
                      }`
                    : "Có sự thay đổi lương trong 2 tháng gần đây.",
                date: n.Month2 || n.date || new Date().toISOString(),
                read: false,
              }))
            : [];
        data = [
          ...anniversaryNotifications,
          ...absentNotifications,
          ...payrollNotifications,
        ];
      } else {
        const [anniversaries, absentDaysPersonal, salaryGapPersonal] =
          await Promise.all([
            fetchAnniversaries(),
            fetchAbsentDaysPersonalWarning(),
            fetchSalaryGapWarningPersonal(),
          ]);
        // Anniversaries
        const anniversaryNotifications =
          anniversaries.status === "success" &&
          Array.isArray(anniversaries.data)
            ? anniversaries.data.map((n: any) => ({
                id: `anniversary-${n.EmployeeID}-${n.AnniversaryDate}`,
                type: "anniversary",
                title: `Kỷ niệm làm việc: ${n.FullName}`,
                message: `Sẽ đạt mốc ${n.MilestoneYears} năm vào ngày ${n.AnniversaryDate}. Gia nhập: ${n.JoinDate}. Mốc tiếp theo: ${n.UpcomingMilestone} năm.`,
                date: n.AnniversaryDate,
                read: false,
              }))
            : [];
        // Absent Days (personal)
        const absentNotifications =
          absentDaysPersonal.status === "success" &&
          Array.isArray(absentDaysPersonal.data)
            ? absentDaysPersonal.data.map((n: any) => ({
                id: `leave-${n.EmployeeID}-${n.AttendanceMonth}`,
                type: "leave",
                title: `Cảnh báo nghỉ phép cá nhân`,
                message: `Tháng ${n.AttendanceMonth}: Được phép ${n.AllowedLeaveDays} ngày, đã nghỉ ${n.TakenLeaveDays} ngày, vượt quá ${n.ExcessDays} ngày.`,
                date: n.AttendanceMonth,
                read: false,
              }))
            : [];
        // Payroll
        const payrollNotifications =
          salaryGapPersonal.status === "success" &&
          Array.isArray(salaryGapPersonal.data)
            ? salaryGapPersonal.data.map((n: any) => ({
                id: `payroll-${n.EmployeeID || n.id || Math.random()}`,
                type: "payroll",
                title: `Cảnh báo chênh lệch lương cá nhân`,
                message:
                  n.Month1 && n.Month2
                    ? `Lương tháng ${n.Month1}: ${n.Salary1}, tháng ${
                        n.Month2
                      }: ${n.Salary2}, chênh lệch: ${
                        n.Gap || n.SalaryGap || ""
                      }`
                    : "Có sự thay đổi lương trong 2 tháng gần đây.",
                date: n.Month2 || n.date || new Date().toISOString(),
                read: false,
              }))
            : [];
        data = [
          ...anniversaryNotifications,
          ...absentNotifications,
          ...payrollNotifications,
        ];
      }
      // Sắp xếp mới nhất lên đầu (nếu muốn)
      data.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setNotifications(data);
    } catch (error: any) {
      console.error("Load notifications failed:", error);
      if (error.message.includes("401")) {
        toast({
          title: "Lỗi Xác Thực",
          description: "Vui lòng đăng nhập lại để tiếp tục.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Lỗi",
          description: "Không thể tải thông báo. Vui lòng thử lại sau.",
          variant: "destructive",
        });
      }
      setNotifications([]);
    }
  };

  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read",
    });
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      read: true,
    }));
    setNotifications(updatedNotifications);
    toast({
      title: "All notifications marked as read",
      description: "All notifications have been marked as read",
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
    toast({
      title: "Notification deleted",
      description: "The notification has been removed",
      variant: "destructive",
    });
  };

  const getFilteredNotifications = () => {
    if (activeTab === "all") {
      return notifications;
    }
    return notifications.filter(
      (notification) => notification.type === activeTab
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "anniversary":
        return <Gift className="h-5 w-5 text-blue-500" />;
      case "leave":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "payroll":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleNotificationClick = (notification: NotificationType) => {
    setSelectedNotification(notification);
    setDialogOpen(true);
  };

  if (!mounted) {
    return null;
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
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
          {(userRole === "admin" || userRole === "hr-manager") && (
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
              <CardTitle className="text-white">
                {t("notifications.systemNotifications")}
              </CardTitle>
              <CardDescription className="text-blue-300">
                {t("notifications.notificationsDescription")}
              </CardDescription>
            </div>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full md:w-auto"
            >
              <TabsList className="grid w-full grid-cols-4 bg-slate-800 border border-slate-700">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-blue-900 data-[state=active]:text-white"
                >
                  {t("notifications.all")}
                </TabsTrigger>
                <TabsTrigger
                  value="anniversary"
                  className="data-[state=active]:bg-blue-900 data-[state=active]:text-white"
                >
                  {t("notifications.anniversary")}
                </TabsTrigger>
                <TabsTrigger
                  value="leave"
                  className="data-[state=active]:bg-blue-900 data-[state=active]:text-white"
                >
                  {t("notifications.leave")}
                </TabsTrigger>
                <TabsTrigger
                  value="payroll"
                  className="data-[state=active]:bg-blue-900 data-[state=active]:text-white"
                >
                  {t("notifications.payroll")}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {getFilteredNotifications().length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Bell className="h-12 w-12 text-slate-500" />
                <p className="mt-2 text-center text-slate-400">
                  {t("notifications.noNotifications")}
                </p>
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
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-white">
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <Badge
                          variant="outline"
                          className="ml-2 bg-blue-900/20 text-blue-400 border-blue-800"
                        >
                          {t("common.new")}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-400">
                      {notification.message}
                    </p>
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
                          e.stopPropagation();
                          markAsRead(notification.id);
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
                        e.stopPropagation();
                        deleteNotification(notification.id);
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

      {(userRole === "admin" || userRole === "hr-manager") && (
        <Card className="border-0 shadow-xl bg-gradient-to-b from-slate-900 to-slate-800">
          <CardHeader className="border-b border-slate-700/50">
            <CardTitle className="text-white">
              {t("notifications.notificationSettings")}
            </CardTitle>
            <CardDescription className="text-blue-300">
              {t("notifications.configurePreferences")}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium text-white">
                    {t("notifications.workAnniversary")}
                  </div>
                  <div className="text-sm text-slate-400">
                    {t("notifications.sendAnniversary")}
                  </div>
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
                  <div className="font-medium text-white">
                    {t("notifications.leavePolicy")}
                  </div>
                  <div className="text-sm text-slate-400">
                    {t("notifications.sendLeave")}
                  </div>
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
                  <div className="font-medium text-white">
                    {t("notifications.payrollNotifications")}
                  </div>
                  <div className="text-sm text-slate-400">
                    {t("notifications.sendPayroll")}
                  </div>
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
                  <div className="font-medium text-white">
                    {t("notifications.emailNotifications")}
                  </div>
                  <div className="text-sm text-slate-400">
                    {t("notifications.configureEmail")}
                  </div>
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
  );
}
