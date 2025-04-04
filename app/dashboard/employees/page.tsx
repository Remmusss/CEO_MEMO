"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Search, MoreHorizontal, UserPlus, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { translations, type Language, type Translations } from "@/lib/i18n/translations"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"

// Mock employee data
const mockEmployees = [
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
  const [employees, setEmployees] = useState(mockEmployees)
  const [searchTerm, setSearchTerm] = useState("")
  const [userRole, setUserRole] = useState<string | null>(null)
  const [language, setLanguage] = useState<Language>("en")
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  
  // New states for dialogs
  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [openConfirm, setOpenConfirm] = useState(false)
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    department: "",
    jobTitle: "",
  })

  useEffect(() => {
    setMounted(true)
    const role = localStorage.getItem("userRole")
    const savedLanguage = (localStorage.getItem("language") as Language) || "en"
    
    setUserRole(role)
    setLanguage(savedLanguage)

    // Redirect if not admin or HR manager
    if (role !== "admin" && role !== "hr-manager") {
      router.push("/dashboard")
    }
  }, [router])

  const t = translations[language]

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    if (e.target.value === "") {
      setEmployees(mockEmployees)
    } else {
      const filtered = mockEmployees.filter(
        (employee) =>
          employee.id.toLowerCase().includes(e.target.value.toLowerCase()) ||
          employee.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
          employee.department.toLowerCase().includes(e.target.value.toLowerCase()) ||
          employee.jobTitle.toLowerCase().includes(e.target.value.toLowerCase()),
      )
      setEmployees(filtered)
    }
  }
  
  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewEmployee(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = () => {
    setOpenAddDialog(false)
    setOpenConfirm(true)
  }
  
  const handleConfirm = () => {
    // Just close the dialog in this minimal implementation
    setOpenConfirm(false)
    // Reset form
    setNewEmployee({
      name: "",
      email: "",
      department: "",
      jobTitle: "",
    })
  }

  if (!mounted || (userRole !== "admin" && userRole !== "hr-manager")) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t.employees.title}</h1>
        <Button onClick={() => setOpenAddDialog(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          {t.employees.addEmployee}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.common.employees}</CardTitle>
          <CardDescription>{t.employees.manageEmployees}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={`${t.common.search} ${t.employees.id}, ${t.employees.name}, ${t.employees.department}...`}
                value={searchTerm}
                onChange={handleSearch}
                className="pl-8"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.employees.id}</TableHead>
                  <TableHead>{t.employees.name}</TableHead>
                  <TableHead>{t.employees.department}</TableHead>
                  <TableHead>{t.employees.jobTitle}</TableHead>
                  <TableHead>{t.employees.status}</TableHead>
                  <TableHead>{t.employees.joinDate}</TableHead>
                  <TableHead className="text-right">{t.common.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.id}</TableCell>
                    <TableCell>
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-sm text-muted-foreground">{employee.email}</div>
                    </TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.jobTitle}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          employee.status === "Active"
                            ? "default"
                            : employee.status === "On Leave"
                              ? "outline"
                              : "secondary"
                        }
                      >
                        {employee.status === "Active" 
                          ? t.common.active 
                          : employee.status === "On Leave" 
                            ? t.common.onLeave 
                            : t.common.inactive}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(employee.joinDate).toLocaleDateString()}</TableCell>
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
                          <DropdownMenuItem>{t.employees.viewDetails}</DropdownMenuItem>
                          <DropdownMenuItem>{t.employees.editEmployee}</DropdownMenuItem>
                          <DropdownMenuItem>{t.employees.managePayroll}</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">{t.employees.deleteEmployee}</DropdownMenuItem>
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
      
      {/* Add Employee Dialog */}
      <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.employees.addEmployee}</DialogTitle>
            <DialogDescription>Add a new employee to the system</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input 
                id="name" 
                name="name"
                value={newEmployee.name}
                onChange={handleInputChange}
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input 
                id="email" 
                name="email"
                value={newEmployee.email}
                onChange={handleInputChange}
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">Department</Label>
              <Input 
                id="department" 
                name="department"
                value={newEmployee.department}
                onChange={handleInputChange}
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="jobTitle" className="text-right">Job Title</Label>
              <Input 
                id="jobTitle" 
                name="jobTitle"
                value={newEmployee.jobTitle}
                onChange={handleInputChange}
                className="col-span-3" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpenAddDialog(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmit}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Confirmation Dialog */}
      <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm New Employee</AlertDialogTitle>
            <AlertDialogDescription>
              Please confirm that you want to add the following employee:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <div className="rounded-md bg-muted p-4">
              <p><strong>Name:</strong> {newEmployee.name}</p>
              <p><strong>Email:</strong> {newEmployee.email}</p>
              <p><strong>Department:</strong> {newEmployee.department}</p>
              <p><strong>Job Title:</strong> {newEmployee.jobTitle}</p>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}