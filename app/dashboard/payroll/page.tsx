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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Search, MoreHorizontal, FileText, Download, Edit, Eye, Mail, CheckCircle, AlertCircle } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

// Mock payroll data
const initialPayrollData = [
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
  const [payrollData, setPayrollData] = useState(initialPayrollData)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMonth, setSelectedMonth] = useState("April 2025")
  const [userRole, setUserRole] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [selectedPayroll, setSelectedPayroll] = useState<(typeof initialPayrollData)[0] | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
    const role = localStorage.getItem("userRole")
    setUserRole(role)

    // Redirect if not admin or payroll manager
    if (role !== "admin" && role !== "payroll-manager") {
      router.push("/dashboard")
    }

    // Load payroll data from localStorage if available
    const savedPayrollData = localStorage.getItem("payrollData")
    if (savedPayrollData) {
      setPayrollData(JSON.parse(savedPayrollData))
    } else {
      // Save initial payroll data to localStorage
      localStorage.setItem("payrollData", JSON.stringify(initialPayrollData))
    }
  }, [router])

  // Save payroll data to localStorage when it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("payrollData", JSON.stringify(payrollData))
    }
  }, [payrollData, mounted])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const filteredPayrollData = payrollData.filter(
    (payroll) =>
      payroll.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payroll.employeeName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleGeneratePayslips = () => {
    toast({
      title: "Payslips Generated",
      description: "All payslips have been generated successfully",
    })
  }

  const handleExportPayroll = () => {
    toast({
      title: "Payroll Exported",
      description: "Payroll data has been exported successfully",
    })
  }

  const handleSendNotification = (payroll: (typeof initialPayrollData)[0]) => {
    toast({
      title: "Notification Sent",
      description: `Payroll notification sent to ${payroll.employeeName}`,
    })
  }

  const handleStatusChange = (payroll: (typeof initialPayrollData)[0], newStatus: string) => {
    const updatedPayrollData = payrollData.map((item) =>
      item.id === payroll.id ? { ...item, status: newStatus } : item,
    )
    setPayrollData(updatedPayrollData)

    toast({
      title: "Status Updated",
      description: `Payroll status for ${payroll.employeeName} updated to ${newStatus}`,
    })
  }

  if (!mounted || (userRole !== "admin" && userRole !== "payroll-manager")) {
    return null
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          {t("payroll.title")}
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleGeneratePayslips}
            className="border-slate-700 text-blue-300 hover:bg-blue-900/20 hover:text-blue-100"
          >
            <FileText className="mr-2 h-4 w-4" />
            {t("payroll.generatePayslips")}
          </Button>
          <Button onClick={handleExportPayroll} className="bg-blue-600 hover:bg-blue-700">
            <Download className="mr-2 h-4 w-4" />
            {t("payroll.exportPayroll")}
          </Button>
        </div>
      </div>

      <Card className="border-0 shadow-xl bg-gradient-to-b from-slate-900 to-slate-800">
        <CardHeader className="border-b border-slate-700/50">
          <CardTitle className="text-white">{t("payroll.payrollData")}</CardTitle>
          <CardDescription className="text-blue-300">{t("payroll.payrollDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-blue-400" />
              <Input
                type="search"
                placeholder={t("common.search")}
                value={searchTerm}
                onChange={handleSearch}
                className="pl-8 bg-slate-800 border-slate-700 text-white focus:border-blue-500"
              />
            </div>
            <div className="w-full sm:w-[180px]">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white focus:border-blue-500">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                  <SelectItem value="April 2025" className="focus:bg-blue-900/50 focus:text-white">
                    April 2025
                  </SelectItem>
                  <SelectItem value="March 2025" className="focus:bg-blue-900/50 focus:text-white">
                    March 2025
                  </SelectItem>
                  <SelectItem value="February 2025" className="focus:bg-blue-900/50 focus:text-white">
                    February 2025
                  </SelectItem>
                  <SelectItem value="January 2025" className="focus:bg-blue-900/50 focus:text-white">
                    January 2025
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border border-slate-700">
            <Table>
              <TableHeader className="bg-slate-800">
                <TableRow className="hover:bg-slate-800/50 border-slate-700">
                  <TableHead className="text-blue-300">{t("payroll.id")}</TableHead>
                  <TableHead className="text-blue-300">{t("payroll.employee")}</TableHead>
                  <TableHead className="text-blue-300">{t("payroll.baseSalary")}</TableHead>
                  <TableHead className="text-blue-300">{t("payroll.bonus")}</TableHead>
                  <TableHead className="text-blue-300">{t("payroll.deductions")}</TableHead>
                  <TableHead className="text-blue-300">{t("payroll.netSalary")}</TableHead>
                  <TableHead className="text-blue-300">{t("payroll.status")}</TableHead>
                  <TableHead className="text-right text-blue-300">{t("common.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayrollData.length === 0 ? (
                  <TableRow className="hover:bg-slate-800/50 border-slate-700">
                    <TableCell colSpan={8} className="text-center py-8 text-slate-400">
                      No payroll data found matching your search criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayrollData.map((payroll) => (
                    <TableRow key={payroll.id} className="hover:bg-slate-800/50 border-slate-700">
                      <TableCell className="text-slate-300">{payroll.id}</TableCell>
                      <TableCell>
                        <div className="font-medium text-white">{payroll.employeeName}</div>
                        <div className="text-sm text-slate-400">{payroll.employeeId}</div>
                      </TableCell>
                      <TableCell className="text-slate-300">${payroll.baseSalary.toLocaleString()}</TableCell>
                      <TableCell className="text-slate-300">${payroll.bonus.toLocaleString()}</TableCell>
                      <TableCell className="text-slate-300">${payroll.deductions.toLocaleString()}</TableCell>
                      <TableCell className="font-medium text-white">${payroll.netSalary.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            payroll.status === "Processed"
                              ? "bg-green-900/20 text-green-400 border-green-800"
                              : payroll.status === "On Hold"
                                ? "bg-yellow-900/20 text-yellow-400 border-yellow-800"
                                : "bg-red-900/20 text-red-400 border-red-800"
                          }
                        >
                          {payroll.status === "Processed" ? t("payroll.processed") : t("payroll.onHold")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-slate-300 hover:text-white hover:bg-slate-800"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">{t("common.actions")}</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-white">
                            <DropdownMenuLabel className="text-blue-300">{t("common.actions")}</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-slate-800" />
                            <DropdownMenuItem
                              className="focus:bg-blue-900/50 focus:text-white"
                              onClick={() => {
                                setSelectedPayroll(payroll)
                                setIsViewDialogOpen(true)
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              {t("payroll.viewDetails")}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-blue-900/50 focus:text-white">
                              <Edit className="mr-2 h-4 w-4" />
                              {t("payroll.editPayroll")}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-blue-900/50 focus:text-white">
                              <FileText className="mr-2 h-4 w-4" />
                              {t("payroll.generatePayslip")}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-800" />
                            <DropdownMenuItem
                              className="focus:bg-blue-900/50 focus:text-white"
                              onClick={() => handleSendNotification(payroll)}
                            >
                              <Mail className="mr-2 h-4 w-4" />
                              {t("payroll.sendNotification")}
                            </DropdownMenuItem>
                            {payroll.status === "On Hold" ? (
                              <DropdownMenuItem
                                className="focus:bg-green-900/50 focus:text-green-300"
                                onClick={() => handleStatusChange(payroll, "Processed")}
                              >
                                <CheckCircle className="mr-2 h-4 w-4 text-green-400" />
                                Mark as Processed
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                className="focus:bg-yellow-900/50 focus:text-yellow-300"
                                onClick={() => handleStatusChange(payroll, "On Hold")}
                              >
                                <AlertCircle className="mr-2 h-4 w-4 text-yellow-400" />
                                Put on Hold
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Payroll Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Payroll Details</DialogTitle>
            <DialogDescription className="text-blue-300">
              Detailed information about the selected payroll record
            </DialogDescription>
          </DialogHeader>
          {selectedPayroll && (
            <div className="py-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-white">{selectedPayroll.employeeName}</h3>
                  <Badge
                    variant="outline"
                    className={
                      selectedPayroll.status === "Processed"
                        ? "bg-green-900/20 text-green-400 border-green-800"
                        : "bg-yellow-900/20 text-yellow-400 border-yellow-800"
                    }
                  >
                    {selectedPayroll.status}
                  </Badge>
                </div>

                <div className="text-sm text-slate-400">
                  Employee ID: <span className="text-slate-300">{selectedPayroll.employeeId}</span>
                </div>

                <div className="text-sm text-slate-400">
                  Payroll Period: <span className="text-slate-300">{selectedPayroll.month}</span>
                </div>

                <div className="rounded-md border border-slate-700 p-4 bg-slate-800/50 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-blue-300">Base Salary:</span>
                    <span className="text-white font-medium">${selectedPayroll.baseSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-300">Bonus:</span>
                    <span className="text-white font-medium">${selectedPayroll.bonus.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-300">Deductions:</span>
                    <span className="text-white font-medium">${selectedPayroll.deductions.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-slate-700 pt-2 mt-2 flex justify-between">
                    <span className="text-blue-300 font-medium">Net Salary:</span>
                    <span className="text-white font-bold">${selectedPayroll.netSalary.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewDialogOpen(false)}
              className="border-slate-700 text-blue-300 hover:bg-slate-800"
            >
              Close
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <FileText className="mr-2 h-4 w-4" />
              Generate Payslip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
