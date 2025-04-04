"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Search, MoreHorizontal, FileText, Download } from "lucide-react"
import { translations, type Language } from "@/lib/i18n/translations"

// Mock payroll data
const mockPayrollData = [
  {
    id: "PAY001",
    employeeId: "EMP001",
    employeeName: "John Doe",
    month: "April 2025",
    baseSalary: 5000,
    bonus: 500,
    deductions: 750,
    netSalary: 4750,
    status: "Processed",
  },
  {
    id: "PAY002",
    employeeId: "EMP002",
    employeeName: "Jane Smith",
    month: "April 2025",
    baseSalary: 6000,
    bonus: 800,
    deductions: 900,
    netSalary: 5900,
    status: "Processed",
  },
  {
    id: "PAY003",
    employeeId: "EMP003",
    employeeName: "Robert Johnson",
    month: "April 2025",
    baseSalary: 4500,
    bonus: 300,
    deductions: 675,
    netSalary: 4125,
    status: "Processed",
  },
  {
    id: "PAY004",
    employeeId: "EMP004",
    employeeName: "Emily Davis",
    month: "April 2025",
    baseSalary: 5200,
    bonus: 0,
    deductions: 780,
    netSalary: 4420,
    status: "On Hold",
  },
  {
    id: "PAY005",
    employeeId: "EMP005",
    employeeName: "Michael Wilson",
    month: "April 2025",
    baseSalary: 4800,
    bonus: 1000,
    deductions: 720,
    netSalary: 5080,
    status: "Processed",
  },
  {
    id: "PAY006",
    employeeId: "EMP006",
    employeeName: "Sarah Brown",
    month: "April 2025",
    baseSalary: 4700,
    bonus: 400,
    deductions: 705,
    netSalary: 4395,
    status: "Processed",
  },
]

export default function PayrollPage() {
  const [payrollData, setPayrollData] = useState(mockPayrollData)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMonth, setSelectedMonth] = useState("April 2025")
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

    // Redirect if not admin or payroll manager
    if (role !== "admin" && role !== "payroll-manager") {
      router.push("/dashboard")
    }
  }, [router])

  const t = translations[language]

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    if (e.target.value === "") {
      setPayrollData(mockPayrollData)
    } else {
      const filtered = mockPayrollData.filter(
        (payroll) =>
          payroll.employeeId.toLowerCase().includes(e.target.value.toLowerCase()) ||
          payroll.employeeName.toLowerCase().includes(e.target.value.toLowerCase()),
      )
      setPayrollData(filtered)
    }
  }

  if (!mounted || (userRole !== "admin" && userRole !== "payroll-manager")) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t.payroll.title}</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            {t.payroll.generatePayslips}
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            {t.payroll.exportPayroll}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.payroll.payrollData}</CardTitle>
          <CardDescription>{t.payroll.payrollDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={`${t.common.search} ${t.payroll.employeeId} ${t.common} ${t.payroll.employee}...`}
                value={searchTerm}
                onChange={handleSearch}
                className="pl-8"
              />
            </div>
            <div className="w-full sm:w-[180px]">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder={t.common.search} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="April 2025">April 2025</SelectItem>
                  <SelectItem value="March 2025">March 2025</SelectItem>
                  <SelectItem value="February 2025">February 2025</SelectItem>
                  <SelectItem value="January 2025">January 2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.employees.id}</TableHead>
                  <TableHead>{t.payroll.employee}</TableHead>
                  <TableHead>{t.payroll.baseSalary}</TableHead>
                  <TableHead>{t.payroll.bonus}</TableHead>
                  <TableHead>{t.payroll.deductions}</TableHead>
                  <TableHead>{t.payroll.netSalary}</TableHead>
                  <TableHead>{t.common.status}</TableHead>
                  <TableHead className="text-right">{t.common.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payrollData.map((payroll) => (
                  <TableRow key={payroll.id}>
                    <TableCell>{payroll.id}</TableCell>
                    <TableCell>
                      <div className="font-medium">{payroll.employeeName}</div>
                      <div className="text-sm text-muted-foreground">{payroll.employeeId}</div>
                    </TableCell>
                    <TableCell>${payroll.baseSalary.toLocaleString()}</TableCell>
                    <TableCell>${payroll.bonus.toLocaleString()}</TableCell>
                    <TableCell>${payroll.deductions.toLocaleString()}</TableCell>
                    <TableCell className="font-medium">${payroll.netSalary.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          payroll.status === "Processed"
                            ? "default"
                            : payroll.status === "On Hold"
                              ? "outline"
                              : "secondary"
                        }
                      >
                        {payroll.status === "Processed" ? t.payroll.processed : t.payroll.onHold}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">{t.common.actions}</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>{t.common.actions}</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>{t.payroll.viewDetails}</DropdownMenuItem>
                          <DropdownMenuItem>{t.payroll.editPayroll}</DropdownMenuItem>
                          <DropdownMenuItem>{t.payroll.generatePayslip}</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>{t.payroll.sendNotification}</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

