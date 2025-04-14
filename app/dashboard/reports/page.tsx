"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText, BarChart4, Calendar, TrendingUp } from "lucide-react"
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
} from "@/components/ui/chart"
import { useLanguage } from "@/lib/i18n/language-context"
import { motion } from "framer-motion"

// Mock data for charts
const departmentSalaryData = [
  { name: "Engineering", value: 450000 },
  { name: "Marketing", value: 280000 },
  { name: "Sales", value: 350000 },
  { name: "HR", value: 180000 },
  { name: "Finance", value: 320000 },
  { name: "Operations", value: 290000 },
]

const monthlySalaryData = [
  { name: "Jan", amount: 1800000 },
  { name: "Feb", amount: 1850000 },
  { name: "Mar", amount: 1900000 },
  { name: "Apr", amount: 1950000 },
  { name: "May", amount: 2000000 },
  { name: "Jun", amount: 2050000 },
]

const employeeGrowthData = [
  { name: "Jan", count: 100 },
  { name: "Feb", count: 105 },
  { name: "Mar", count: 110 },
  { name: "Apr", count: 115 },
  { name: "May", count: 118 },
  { name: "Jun", count: 120 },
]

const attendanceData = [
  { name: "Present", value: 85 },
  { name: "Absent", value: 5 },
  { name: "Leave", value: 10 },
]

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]

export default function ReportsPage() {
  const [reportType, setReportType] = useState("hr")
  const [timeRange, setTimeRange] = useState("6months")
  const [userRole, setUserRole] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()

  useEffect(() => {
    setMounted(true)
    const role = localStorage.getItem("userRole")
    setUserRole(role)

    // Redirect if employee
    if (role === "employee") {
      router.push("/dashboard")
    }
  }, [router])

  if (!mounted || userRole === "employee") {
    return null
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          {t("reports.title")}
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-700 text-blue-300 hover:bg-blue-900/20 hover:text-blue-100">
            <FileText className="mr-2 h-4 w-4" />
            {t("reports.generateReport")}
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="mr-2 h-4 w-4" />
            {t("reports.exportData")}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-900 to-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-300">{t("reports.totalEmployees")}</CardTitle>
            <div className="rounded-full bg-blue-900/50 p-2 text-blue-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">120</div>
            <p className="text-xs text-blue-300">+5 from last month</p>
            <div className="mt-3 h-1 w-full bg-blue-900/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-blue-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "85%" }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-900 to-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-300">{t("reports.averageSalary")}</CardTitle>
            <div className="rounded-full bg-green-900/50 p-2 text-green-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">$4,850</div>
            <p className="text-xs text-green-400">+2.5% from last month</p>
            <div className="mt-3 h-1 w-full bg-green-900/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-green-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "65%" }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-900 to-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-300">{t("reports.totalPayroll")}</CardTitle>
            <div className="rounded-full bg-purple-900/50 p-2 text-purple-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">$582,000</div>
            <p className="text-xs text-purple-400">+3.2% from last month</p>
            <div className="mt-3 h-1 w-full bg-purple-900/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-purple-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "75%" }}
                transition={{ duration: 1, delay: 0.4 }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-900 to-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-300">{t("reports.attendanceRate")}</CardTitle>
            <div className="rounded-full bg-yellow-900/50 p-2 text-yellow-400">
              <Calendar className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">95%</div>
            <p className="text-xs text-yellow-400">+1% from last month</p>
            <div className="mt-3 h-1 w-full bg-yellow-900/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-yellow-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "95%" }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-2">
          <Card className="h-full border-0 shadow-xl bg-gradient-to-b from-slate-900 to-slate-800">
            <CardHeader className="border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">{t("reports.reportControls")}</CardTitle>
                  <CardDescription className="text-blue-300">{t("reports.configureReports")}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger className="w-[180px] bg-slate-800 border-slate-700 text-white focus:border-blue-500">
                      <SelectValue placeholder={t("reports.reportType")} />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-white">
                      <SelectItem value="hr" className="focus:bg-blue-900/50 focus:text-white">
                        {t("reports.hrReports")}
                      </SelectItem>
                      <SelectItem value="payroll" className="focus:bg-blue-900/50 focus:text-white">
                        {t("reports.payrollReports")}
                      </SelectItem>
                      {userRole === "admin" && (
                        <SelectItem value="stock" className="focus:bg-blue-900/50 focus:text-white">
                          {t("reports.stockReports")}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[180px] bg-slate-800 border-slate-700 text-white focus:border-blue-500">
                      <SelectValue placeholder={t("reports.timeRange")} />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-white">
                      <SelectItem value="1month" className="focus:bg-blue-900/50 focus:text-white">
                        {t("reports.lastMonth")}
                      </SelectItem>
                      <SelectItem value="3months" className="focus:bg-blue-900/50 focus:text-white">
                        {t("reports.last3Months")}
                      </SelectItem>
                      <SelectItem value="6months" className="focus:bg-blue-900/50 focus:text-white">
                        {t("reports.last6Months")}
                      </SelectItem>
                      <SelectItem value="1year" className="focus:bg-blue-900/50 focus:text-white">
                        {t("reports.lastYear")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs defaultValue="charts" className="space-y-4">
                <TabsList className="bg-slate-800 border border-slate-700">
                  <TabsTrigger
                    value="charts"
                    className="data-[state=active]:bg-blue-900 data-[state=active]:text-white"
                  >
                    <BarChart4 className="mr-2 h-4 w-4" />
                    {t("reports.charts")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="tables"
                    className="data-[state=active]:bg-blue-900 data-[state=active]:text-white"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    {t("reports.tables")}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="charts" className="space-y-4">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={employeeGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1e293b",
                            borderColor: "#334155",
                            color: "#f8fafc",
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
                </TabsContent>
                <TabsContent value="tables">
                  <div className="rounded-md border border-slate-700 bg-slate-800/50">
                    <div className="p-4">
                      <p className="text-sm text-slate-400">{t("reports.tabularData")}</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <Card className="h-full border-0 shadow-xl bg-gradient-to-b from-slate-900 to-slate-800">
          <CardHeader className="border-b border-slate-700/50">
            <CardTitle className="text-white">{t("reports.departmentDistribution")}</CardTitle>
            <CardDescription className="text-blue-300">{t("reports.salaryDistribution")}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentSalaryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    animationDuration={1500}
                  >
                    {departmentSalaryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      borderColor: "#334155",
                      color: "#f8fafc",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-0 shadow-xl bg-gradient-to-b from-slate-900 to-slate-800">
          <CardHeader className="border-b border-slate-700/50">
            <CardTitle className="text-white">{t("reports.monthlyPayroll")}</CardTitle>
            <CardDescription className="text-blue-300">{t("reports.payrollDistribution")}</CardDescription>
          </CardHeader>
          <CardContent className="h-80 pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlySalaryData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    borderColor: "#334155",
                    color: "#f8fafc",
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
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-b from-slate-900 to-slate-800">
          <CardHeader className="border-b border-slate-700/50">
            <CardTitle className="text-white">{t("reports.attendanceOverview")}</CardTitle>
            <CardDescription className="text-blue-300">{t("reports.attendanceStatistics")}</CardDescription>
          </CardHeader>
          <CardContent className="h-80 pt-6">
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
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  animationDuration={1500}
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    borderColor: "#334155",
                    color: "#f8fafc",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
