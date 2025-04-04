"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText, BarChart4 } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "@/components/ui/chart"
import { translations, type Language } from "@/lib/i18n/translations"

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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"]

export default function ReportsPage() {
  const [reportType, setReportType] = useState("hr")
  const [timeRange, setTimeRange] = useState("6months")
  const [userRole, setUserRole] = useState<string | null>(null)
  const [language, setLanguage] = useState<Language>("en")
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    const role = localStorage.getItem("userRole")
    const savedLanguage = (localStorage.getItem("language") as Language) || "en"
    
    setUserRole(role)
    setLanguage(savedLanguage)

    // Redirect if employee
    if (role === "employee") {
      router.push("/dashboard")
    }
  }, [router])

  const t = translations[language]

  if (!mounted || userRole === "employee") {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t.dashboard.reports}</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            {t.dashboard.reports}
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            {t.payroll.exportPayroll}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.dashboard.totalEmployees}</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">120</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">120</div>
            <p className="text-xs text-muted-foreground">+5 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">$4,850</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,850</div>
            <p className="text-xs text-muted-foreground">+2.5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">$582,000</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$582,000</div>
            <p className="text-xs text-muted-foreground">+3.2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">95%</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95%</div>
            <p className="text-xs text-muted-foreground">+1% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-2">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Report Controls</CardTitle>
                  <CardDescription>Configure and generate reports</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Report Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hr">HR Reports</SelectItem>
                      <SelectItem value="payroll">Payroll Reports</SelectItem>
                      {userRole === "admin" && <SelectItem value="stock">Stock Dividend Reports</SelectItem>}
                    </SelectContent>
                  </Select>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Time Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1month">Last Month</SelectItem>
                      <SelectItem value="3months">Last 3 Months</SelectItem>
                      <SelectItem value="6months">Last 6 Months</SelectItem>
                      <SelectItem value="1year">Last Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="charts" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="charts">
                    <BarChart4 className="mr-2 h-4 w-4" />
                    Charts
                  </TabsTrigger>
                  <TabsTrigger value="tables">
                    <FileText className="mr-2 h-4 w-4" />
                    Tables
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="charts" className="space-y-4">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={employeeGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                <TabsContent value="tables">
                  <div className="rounded-md border">
                    <div className="p-4">
                      <p className="text-sm text-muted-foreground">
                        Tabular data will be displayed here based on the selected report type and time range.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <Card className="h-full">
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
            <CardDescription>Salary distribution by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={departmentSalaryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {departmentSalaryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Payroll Trend</CardTitle>
            <CardDescription>Total payroll distribution for the last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySalaryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance Overview</CardTitle>
            <CardDescription>Current month attendance statistics</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

