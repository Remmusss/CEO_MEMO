"use client";

import { useEffect, useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  DollarSign,
  Building2,
  Bell,
  Clock,
  TrendingUp,
  Percent,
  UserPlus,
  ArrowUpRight,
  Activity,
  BarChart3,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "@/components/ui/chart";
import { useLanguage } from "@/lib/i18n/language-context";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Định nghĩa các interface cho dữ liệu
interface DepartmentData {
  name: string;
  value: number;
}

interface SalaryData {
  name: string;
  amount: number;
}

interface GrowthData {
  name: string;
  count: number;
}

interface AttendanceData {
  name: string;
  value: number;
}

interface DashboardStats {
  total: number;
}

// URL cơ bản của API (giả định)
const API_BASE_URL = `${process.env.NEXT_PUBLIC_DOMAIN}/api`;

export default function DashboardPage() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [departmentData, setDepartmentData] = useState<DepartmentData[]>([]);
  const [salaryData, setSalaryData] = useState<SalaryData[]>([]);
  const [employeeGrowthData, setEmployeeGrowthData] = useState<GrowthData[]>(
    []
  );
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();
  const chartRef = useRef<HTMLDivElement>(null);

  // Hàm lấy dữ liệu từ API
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Lấy tổng số nhân viên
      const employeesResponse = await fetch(
        `${API_BASE_URL}/employees?per_page=1`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("userToken") || ""}`,
          },
        }
      );
      if (!employeesResponse.ok) {
        console.warn(
          `API call to ${API_BASE_URL}/employees failed with status ${employeesResponse.status}`
        );
        setTotalEmployees(0); // Gán mặc định khi lỗi
      } else {
        const employeesData: DashboardStats = await employeesResponse.json();
        setTotalEmployees(employeesData.total || 0);
      }

      // Lấy dữ liệu phân bố phòng ban
      const departmentsResponse = await fetch(
        `${API_BASE_URL}/employees/departments`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("userToken") || ""}`,
          },
        }
      );
      if (!departmentsResponse.ok) {
        console.warn(
          `API call to ${API_BASE_URL}/employees/departments failed with status ${departmentsResponse.status}`
        );
        setDepartmentData([]);
      } else {
        const departmentsData = await departmentsResponse.json();
        console.log("Departments Data:", departmentsData); // Debug
        if (Array.isArray(departmentsData)) {
          setDepartmentData(
            departmentsData.map((dept: any) => ({
              name: dept.DepartmentName || dept.name || "Unknown",
              value: dept.employeeCount || dept.value || 0,
            }))
          );
        } else {
          console.warn("Departments data is not an array:", departmentsData);
          setDepartmentData([]);
        }
      }

      // Lấy dữ liệu lương theo tháng
      const salaryResponse = await fetch(`${API_BASE_URL}/payroll/monthly`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("userToken") || ""}`,
        },
      });
      if (!salaryResponse.ok) {
        console.warn(
          `API call to ${API_BASE_URL}/payroll/monthly failed with status ${salaryResponse.status}`
        );
        setSalaryData([]);
      } else {
        const salaryDataResponse: { month: string; totalAmount: number }[] =
          await salaryResponse.json();
        setSalaryData(
          salaryDataResponse.map((item) => ({
            name: item.month,
            amount: item.totalAmount,
          }))
        );
      }

      // Lấy dữ liệu tăng trưởng nhân viên
      const growthResponse = await fetch(`${API_BASE_URL}/employees/growth`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("userToken") || ""}`,
        },
      });
      if (!growthResponse.ok) {
        console.warn(
          `API call to ${API_BASE_URL}/employees/growth failed with status ${growthResponse.status}`
        );
        setEmployeeGrowthData([]);
      } else {
        const growthDataResponse: { month: string; employeeCount: number }[] =
          await growthResponse.json();
        setEmployeeGrowthData(
          growthDataResponse.map((item) => ({
            name: item.month,
            count: item.employeeCount,
          }))
        );
      }

      // Lấy dữ liệu chấm công
      const attendanceResponse = await fetch(
        `${API_BASE_URL}/attendance/summary`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("userToken") || ""}`,
          },
        }
      );
      if (!attendanceResponse.ok) {
        console.warn(
          `API call to ${API_BASE_URL}/attendance/summary failed with status ${attendanceResponse.status}`
        );
        setAttendanceData([]);
      } else {
        const attendanceDataResponse: {
          present: number;
          absent: number;
          leave: number;
        } = await attendanceResponse.json();
        setAttendanceData([
          { name: "Present", value: attendanceDataResponse.present || 0 },
          { name: "Absent", value: attendanceDataResponse.absent || 0 },
          { name: "Leave", value: attendanceDataResponse.leave || 0 },
        ]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu dashboard:", error);
      // Gán giá trị mặc định khi có lỗi
      setTotalEmployees(0);
      setDepartmentData([]);
      setSalaryData([]);
      setEmployeeGrowthData([]);
      setAttendanceData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    const role = localStorage.getItem("userRole");
    setUserRole(role);
    fetchDashboardData(); // Gọi API khi component mount
  }, []);

  if (!mounted) {
    return null;
  }

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { duration: 0.8 },
    },
  };

  const slideUp = {
    hidden: { y: 50, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  // Cập nhật thời gian hiện tại (05:03 PM +07, 23/05/2025)
  const currentTime = new Date().toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Ho_Chi_Minh",
  });
  const lastUpdated = `Today, ${currentTime}`;

  return (
    <motion.div
      className="space-y-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        variants={fadeIn}
      >
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {t("dashboard.title")}
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's an overview of your organization.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full"
          >
            <Clock className="mr-1 h-3 w-3" /> Last updated: {lastUpdated}
          </Badge>
        </div>
      </motion.div>

      <motion.div
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        variants={container}
      >
        <motion.div
          variants={item}
          whileHover={{
            scale: 1.03,
            transition: { duration: 0.2 },
          }}
        >
          <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 dark:from-slate-900 dark:to-blue-950 hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("dashboard.totalEmployees")}
              </CardTitle>
              <div className="rounded-full bg-blue-100 p-2 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                <Users className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {isLoading ? "..." : totalEmployees}
              </div>
              <div className="flex items-center pt-1">
                <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                <span className="text-xs font-medium text-green-600">
                  +4.3%
                </span>
                <span className="ml-1 text-xs text-muted-foreground">
                  from last month
                </span>
              </div>
              <div className="mt-4 h-1 w-full bg-blue-100 dark:bg-blue-900 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: isLoading ? "0%" : "85%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={item}
          whileHover={{
            scale: 1.03,
            transition: { duration: 0.2 },
          }}
        >
          <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-green-50 dark:from-slate-900 dark:to-green-950 hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("dashboard.departments")}
              </CardTitle>
              <div className="rounded-full bg-green-100 p-2 text-green-600 dark:bg-green-900 dark:text-green-200">
                <Building2 className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {isLoading ? "..." : departmentData.length}
              </div>
              <div className="flex items-center pt-1">
                <UserPlus className="mr-1 h-3 w-3 text-green-600" />
                <span className="text-xs font-medium text-green-600">+1</span>
                <span className="ml-1 text-xs text-muted-foreground">
                  new department
                </span>
              </div>
              <div className="mt-4 h-1 w-full bg-green-100 dark:bg-green-900 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-green-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: isLoading ? "0%" : "65%" }}
                  transition={{ duration: 1, delay: 0.6 }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={item}
          whileHover={{
            scale: 1.03,
            transition: { duration: 0.2 },
          }}
        >
          <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-yellow-50 dark:from-slate-900 dark:to-yellow-950 hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("dashboard.payrollTotal")}
              </CardTitle>
              <div className="rounded-full bg-yellow-100 p-2 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-200">
                <DollarSign className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {isLoading
                  ? "..."
                  : `$${salaryData
                      .reduce((sum, curr) => sum + (curr.amount || 0), 0)
                      .toLocaleString()}`}
              </div>
              <div className="flex items-center pt-1">
                <Percent className="mr-1 h-3 w-3 text-green-600" />
                <span className="text-xs font-medium text-green-600">
                  +2.5%
                </span>
                <span className="ml-1 text-xs text-muted-foreground">
                  from last month
                </span>
              </div>
              <div className="mt-4 h-1 w-full bg-yellow-100 dark:bg-yellow-900 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-yellow-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: isLoading ? "0%" : "75%" }}
                  transition={{ duration: 1, delay: 0.7 }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={item}
          whileHover={{
            scale: 1.03,
            transition: { duration: 0.2 },
          }}
        >
          <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-purple-50 dark:from-slate-900 dark:to-purple-950 hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("dashboard.notificationsCount")}
              </CardTitle>
              <div className="rounded-full bg-purple-100 p-2 text-purple-600 dark:bg-purple-900 dark:text-purple-200">
                <Bell className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12</div>
              <div className="flex items-center pt-1">
                <span className="text-xs font-medium text-blue-600">5</span>
                <span className="ml-1 text-xs text-muted-foreground">
                  unread messages
                </span>
              </div>
              <div className="mt-4 h-1 w-full bg-purple-100 dark:bg-purple-900 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-purple-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "45%" }}
                  transition={{ duration: 1, delay: 0.8 }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div variants={slideUp}>
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-muted/50 rounded-lg p-1 border">
            <TabsTrigger value="overview" className="rounded-md">
              {t("dashboard.overview")}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-md">
              {t("dashboard.analytics")}
            </TabsTrigger>
            {userRole === "admin" && (
              <TabsTrigger value="reports" className="rounded-md">
                {t("dashboard.reports")}
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <motion.div
                className="col-span-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                whileHover={{
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  transition: { duration: 0.2 },
                }}
              >
                <Card className="col-span-2 border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-b">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          <BarChart3 className="mr-2 h-5 w-5 text-blue-600" />
                          {t("dashboard.monthlyPayroll")}
                        </CardTitle>
                        <CardDescription>
                          {t("dashboard.payrollDistribution")}
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm" className="gap-1">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        Details
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="h-80" ref={chartRef}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={salaryData}>
                          <defs>
                            <linearGradient
                              id="colorAmount"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#3b82f6"
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="95%"
                                stopColor="#3b82f6"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                          />
                          <XAxis dataKey="name" stroke="#6b7280" />
                          <YAxis stroke="#6b7280" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "rgba(255, 255, 255, 0.9)",
                              borderRadius: "8px",
                              boxShadow:
                                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                              border: "none",
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="amount"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorAmount)"
                            animationDuration={1500}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                whileHover={{
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  transition: { duration: 0.2 },
                }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-b">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          <Activity className="mr-2 h-5 w-5 text-blue-600" />
                          {t("dashboard.departmentDistribution")}
                        </CardTitle>
                        <CardDescription>
                          Employee count by department
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm" className="gap-1">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        Details
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={departmentData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) =>
                              `${name} ${(percent * 100).toFixed(0)}%`
                            }
                            animationDuration={1500}
                            animationBegin={300}
                          >
                            {departmentData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "rgba(255, 255, 255, 0.9)",
                              borderRadius: "8px",
                              boxShadow:
                                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                              border: "none",
                            }}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                whileHover={{
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  transition: { duration: 0.2 },
                }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-b">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          <Users className="mr-2 h-5 w-5 text-blue-600" />
                          {t("dashboard.attendanceOverview")}
                        </CardTitle>
                        <CardDescription>
                          Current month attendance statistics
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm" className="gap-1">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        Details
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={attendanceData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) =>
                              `${name} ${(percent * 100).toFixed(0)}%`
                            }
                            animationDuration={1500}
                            animationBegin={300}
                          >
                            {attendanceData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "rgba(255, 255, 255, 0.9)",
                              borderRadius: "8px",
                              boxShadow:
                                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                              border: "none",
                            }}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                className="col-span-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                whileHover={{
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  transition: { duration: 0.2 },
                }}
              >
                <Card className="col-span-2 border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-b">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          <Clock className="mr-2 h-5 w-5 text-blue-600" />
                          {t("dashboard.recentActivities")}
                        </CardTitle>
                        <CardDescription>
                          Latest system activities
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm" className="gap-1">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-0 divide-y">
                      <motion.div
                        className="flex items-center p-4 hover:bg-muted/50 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        whileHover={{ x: 5 }}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                          <UserPlus className="h-5 w-5" />
                        </div>
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            New employee added
                          </p>
                          <p className="text-xs text-muted-foreground">
                            2 hours ago
                          </p>
                        </div>
                        <Badge className="ml-auto">New</Badge>
                      </motion.div>

                      <motion.div
                        className="flex items-center p-4 hover:bg-muted/50 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                        whileHover={{ x: 5 }}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200">
                          <DollarSign className="h-5 w-5" />
                        </div>
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            Payroll processed for April
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Yesterday at 3:45 PM
                          </p>
                        </div>
                      </motion.div>

                      <motion.div
                        className="flex items-center p-4 hover:bg-muted/50 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                        whileHover={{ x: 5 }}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-200">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            Department structure updated
                          </p>
                          <p className="text-xs text-muted-foreground">
                            2 days ago
                          </p>
                        </div>
                      </motion.div>

                      <motion.div
                        className="flex items-center p-4 hover:bg-muted/50 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 }}
                        whileHover={{ x: 5 }}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-200">
                          <Bell className="h-5 w-5" />
                        </div>
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            5 employees marked anniversary
                          </p>
                          <p className="text-xs text-muted-foreground">
                            3 days ago
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                transition: { duration: 0.2 },
              }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>HR Analytics</CardTitle>
                      <CardDescription>
                        Detailed analytics about employee data
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="gap-1">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={employeeGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            borderRadius: "8px",
                            boxShadow:
                              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                            border: "none",
                          }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="#3b82f6"
                          strokeWidth={3}
                          activeDot={{ r: 8 }}
                          animationDuration={1500}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                transition: { duration: 0.2 },
              }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>System Reports</CardTitle>
                      <CardDescription>
                        Administrative reports and system status
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="gap-1">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                      Generate
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-blue-100 p-3 text-blue-600 dark:bg-blue-900 dark:text-blue-200 mb-4">
                      <BarChart3 className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                      Administrative reports will be displayed here
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Generate custom reports based on your organization's data
                      to gain valuable insights and make informed decisions.
                    </p>
                    <Button className="mt-6">Create New Report</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
