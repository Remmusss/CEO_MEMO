"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Search, MoreHorizontal, UserPlus, Trash2, Edit, DollarSign, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/i18n/language-context"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

// Mock employee data
const initialEmployees = [
  {
    id: "EMP001",
    name: "John Doe",
    email: "john.doe@example.com",
    department: "Engineering",
    jobTitle: "Senior Developer",
    status: "Active",
    joinDate: "2020-05-12",
  },
  {
    id: "EMP002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    department: "Marketing",
    jobTitle: "Marketing Manager",
    status: "Active",
    joinDate: "2019-11-03",
  },
  {
    id: "EMP003",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    department: "Finance",
    jobTitle: "Financial Analyst",
    status: "Active",
    joinDate: "2021-02-15",
  },
  {
    id: "EMP004",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    department: "Human Resources",
    jobTitle: "HR Specialist",
    status: "On Leave",
    joinDate: "2018-07-22",
  },
  {
    id: "EMP005",
    name: "Michael Wilson",
    email: "michael.wilson@example.com",
    department: "Sales",
    jobTitle: "Sales Representative",
    status: "Active",
    joinDate: "2022-01-10",
  },
  {
    id: "EMP006",
    name: "Sarah Brown",
    email: "sarah.brown@example.com",
    department: "Engineering",
    jobTitle: "QA Engineer",
    status: "Active",
    joinDate: "2021-09-05",
  },
  {
    id: "EMP007",
    name: "David Miller",
    email: "david.miller@example.com",
    department: "Operations",
    jobTitle: "Operations Manager",
    status: "Inactive",
    joinDate: "2017-03-18",
  },
]

export default function EmployeesPage() {
  const [employees, setEmployees] = useState(initialEmployees)
  const [searchTerm, setSearchTerm] = useState("")
  const [userRole, setUserRole] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<(typeof initialEmployees)[0] | null>(null)
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    department: "",
    jobTitle: "",
  })
  const router = useRouter()
  const { t } = useLanguage()
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
    const role = localStorage.getItem("userRole")
    setUserRole(role)

    // Redirect if not admin or HR manager
    if (role !== "admin" && role !== "hr-manager") {
      router.push("/dashboard")
    }

    // Load employees from localStorage if available
    const savedEmployees = localStorage.getItem("employees")
    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees))
    } else {
      // Save initial employees to localStorage
      localStorage.setItem("employees", JSON.stringify(initialEmployees))
    }
  }, [router])

  // Save employees to localStorage when they change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("employees", JSON.stringify(employees))
    }
  }, [employees, mounted])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddEmployee = () => {
    if (newEmployee.name && newEmployee.email && newEmployee.department && newEmployee.jobTitle) {
      const newId = `EMP${(employees.length + 1).toString().padStart(3, "0")}`
      const newEmployeeData = {
        id: newId,
        name: newEmployee.name,
        email: newEmployee.email,
        department: newEmployee.department,
        jobTitle: newEmployee.jobTitle,
        status: "Active",
        joinDate: new Date().toISOString().split("T")[0],
      }

      setEmployees([...employees, newEmployeeData])
      setNewEmployee({ name: "", email: "", department: "", jobTitle: "" })
      setIsAddDialogOpen(false)

      toast({
        title: "Employee Added",
        description: `${newEmployee.name} has been added successfully`,
      })
    }
  }

  const handleDeleteEmployee = () => {
    if (selectedEmployee) {
      setEmployees(employees.filter((emp) => emp.id !== selectedEmployee.id))
      setIsDeleteDialogOpen(false)

      toast({
        title: "Employee Deleted",
        description: `${selectedEmployee.name} has been removed from the system`,
        variant: "destructive",
      })
    }
  }

  if (!mounted || (userRole !== "admin" && userRole !== "hr-manager")) {
    return null
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          {t("employees.title")}
        </h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="mr-2 h-4 w-4" />
              {t("employees.addEmployee")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-white">{t("employees.addEmployee")}</DialogTitle>
              <DialogDescription className="text-blue-300">
                Fill in the details to add a new employee to the system
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-blue-300">
                  Full Name
                </label>
                <Input
                  id="name"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                  placeholder="John Doe"
                  className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="email" className="text-blue-300">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                  placeholder="john.doe@example.com"
                  className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="department" className="text-blue-300">
                  Department
                </label>
                <Input
                  id="department"
                  value={newEmployee.department}
                  onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                  placeholder="Engineering"
                  className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="jobTitle" className="text-blue-300">
                  Job Title
                </label>
                <Input
                  id="jobTitle"
                  value={newEmployee.jobTitle}
                  onChange={(e) => setNewEmployee({ ...newEmployee, jobTitle: e.target.value })}
                  placeholder="Software Engineer"
                  className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                className="border-slate-700 text-blue-300 hover:bg-slate-800"
              >
                Cancel
              </Button>
              <Button onClick={handleAddEmployee} className="bg-blue-600 hover:bg-blue-700">
                Add Employee
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-0 shadow-xl bg-gradient-to-b from-slate-950 to-slate-900">
        <CardHeader className="border-b border-slate-800/50">
          <CardTitle className="text-white">{t("common.employees")}</CardTitle>
          <CardDescription className="text-blue-300">{t("employees.manageEmployees")}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-4 flex items-center gap-2">
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
          </div>

          <div className="rounded-md border border-slate-700">
            <Table>
              <TableHeader className="bg-slate-800">
                <TableRow className="hover:bg-slate-800/50 border-slate-700">
                  <TableHead className="text-blue-300">{t("employees.id")}</TableHead>
                  <TableHead className="text-blue-300">{t("employees.name")}</TableHead>
                  <TableHead className="text-blue-300">{t("employees.department")}</TableHead>
                  <TableHead className="text-blue-300">{t("employees.jobTitle")}</TableHead>
                  <TableHead className="text-blue-300">{t("employees.status")}</TableHead>
                  <TableHead className="text-blue-300">{t("employees.joinDate")}</TableHead>
                  <TableHead className="text-right text-blue-300">{t("common.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow className="hover:bg-slate-800/50 border-slate-700">
                    <TableCell colSpan={7} className="text-center py-8 text-slate-400">
                      No employees found matching your search criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.id} className="hover:bg-slate-800/50 border-slate-700">
                      <TableCell className="text-slate-300">{employee.id}</TableCell>
                      <TableCell>
                        <div className="font-medium text-white">{employee.name}</div>
                        <div className="text-sm text-slate-400">{employee.email}</div>
                      </TableCell>
                      <TableCell className="text-slate-300">{employee.department}</TableCell>
                      <TableCell className="text-slate-300">{employee.jobTitle}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            employee.status === "Active"
                              ? "bg-green-900/20 text-green-400 border-green-800"
                              : employee.status === "On Leave"
                                ? "bg-yellow-900/20 text-yellow-400 border-yellow-800"
                                : "bg-red-900/20 text-red-400 border-red-800"
                          }
                        >
                          {employee.status === "Active"
                            ? t("common.active")
                            : employee.status === "On Leave"
                              ? t("common.onLeave")
                              : t("common.inactive")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {new Date(employee.joinDate).toLocaleDateString()}
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
                            <DropdownMenuItem className="focus:bg-blue-900/50 focus:text-white">
                              <Eye className="mr-2 h-4 w-4" />
                              {t("employees.viewDetails")}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-blue-900/50 focus:text-white">
                              <Edit className="mr-2 h-4 w-4" />
                              {t("employees.editEmployee")}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-blue-900/50 focus:text-white">
                              <DollarSign className="mr-2 h-4 w-4" />
                              {t("employees.managePayroll")}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-800" />
                            <DropdownMenuItem
                              className="text-red-400 focus:bg-red-900/50 focus:text-red-300"
                              onClick={() => {
                                setSelectedEmployee(employee)
                                setIsDeleteDialogOpen(true)
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {t("employees.deleteEmployee")}
                            </DropdownMenuItem>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Confirm Deletion</DialogTitle>
            <DialogDescription className="text-blue-300">
              Are you sure you want to delete this employee? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <div className="py-4">
              <div className="rounded-md border border-slate-700 p-4 bg-slate-800/50">
                <div className="space-y-1">
                  <p className="text-white font-medium">{selectedEmployee.name}</p>
                  <p className="text-sm text-slate-400">{selectedEmployee.email}</p>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span>{selectedEmployee.department}</span>
                    <span>•</span>
                    <span>{selectedEmployee.jobTitle}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-slate-700 text-blue-300 hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteEmployee}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Employee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
