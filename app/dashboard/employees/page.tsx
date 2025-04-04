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
import { Search, MoreHorizontal, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"
import { translations, type Language, type Translations } from "@/lib/i18n/translations"

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

  if (!mounted || (userRole !== "admin" && userRole !== "hr-manager")) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t.employees.title}</h1>
        <Button>
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
    </div>
  )
}

