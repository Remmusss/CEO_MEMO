"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { Label } from "@/components/ui/label"
import { Plus, MoreHorizontal, Building2, Users } from "lucide-react"

// Mock department data
const mockDepartments = [
  {
    id: "DEP001",
    name: "Engineering",
    manager: "John Doe",
    employeeCount: 45,
    location: "Main Office",
    budget: 500000,
  },
  {
    id: "DEP002",
    name: "Marketing",
    manager: "Jane Smith",
    employeeCount: 20,
    location: "Main Office",
    budget: 300000,
  },
  {
    id: "DEP003",
    name: "Sales",
    manager: "Robert Johnson",
    employeeCount: 30,
    location: "East Wing",
    budget: 450000,
  },
  {
    id: "DEP004",
    name: "Human Resources",
    manager: "Emily Davis",
    employeeCount: 10,
    location: "Main Office",
    budget: 200000,
  },
  {
    id: "DEP005",
    name: "Finance",
    manager: "Michael Wilson",
    employeeCount: 15,
    location: "West Wing",
    budget: 350000,
  },
  {
    id: "DEP006",
    name: "Operations",
    manager: "Sarah Brown",
    employeeCount: 25,
    location: "East Wing",
    budget: 400000,
  },
]

// Mock job titles
const mockJobTitles = [
  { id: "JOB001", title: "Software Engineer", department: "Engineering", employeeCount: 20 },
  { id: "JOB002", title: "Senior Developer", department: "Engineering", employeeCount: 15 },
  { id: "JOB003", title: "Marketing Specialist", department: "Marketing", employeeCount: 10 },
  { id: "JOB004", title: "Sales Representative", department: "Sales", employeeCount: 18 },
  { id: "JOB005", title: "HR Specialist", department: "Human Resources", employeeCount: 5 },
  { id: "JOB006", title: "Financial Analyst", department: "Finance", employeeCount: 8 },
  { id: "JOB007", title: "Operations Manager", department: "Operations", employeeCount: 5 },
]

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState(mockDepartments)
  const [jobTitles, setJobTitles] = useState(mockJobTitles)
  const [activeTab, setActiveTab] = useState("departments")
  const [newDepartment, setNewDepartment] = useState({ name: "", location: "" })
  const [newJobTitle, setNewJobTitle] = useState({ title: "", department: "" })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    const role = localStorage.getItem("userRole")
    setUserRole(role)

    // Redirect if not admin or HR manager
    if (role !== "admin" && role !== "hr-manager") {
      router.push("/dashboard")
    }
  }, [router])

  const handleAddDepartment = () => {
    if (newDepartment.name && newDepartment.location) {
      const newId = `DEP${(departments.length + 1).toString().padStart(3, "0")}`
      setDepartments([
        ...departments,
        {
          id: newId,
          name: newDepartment.name,
          manager: "Not Assigned",
          employeeCount: 0,
          location: newDepartment.location,
          budget: 0,
        },
      ])
      setNewDepartment({ name: "", location: "" })
      setIsDialogOpen(false)
    }
  }

  const handleAddJobTitle = () => {
    if (newJobTitle.title && newJobTitle.department) {
      const newId = `JOB${(jobTitles.length + 1).toString().padStart(3, "0")}`
      setJobTitles([
        ...jobTitles,
        {
          id: newId,
          title: newJobTitle.title,
          department: newJobTitle.department,
          employeeCount: 0,
        },
      ])
      setNewJobTitle({ title: "", department: "" })
      setIsDialogOpen(false)
    }
  }

  if (!mounted || (userRole !== "admin" && userRole !== "hr-manager")) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Department & Job Title Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {activeTab === "departments" ? "Add Department" : "Add Job Title"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{activeTab === "departments" ? "Add New Department" : "Add New Job Title"}</DialogTitle>
              <DialogDescription>
                {activeTab === "departments"
                  ? "Fill in the details to create a new department."
                  : "Fill in the details to create a new job title."}
              </DialogDescription>
            </DialogHeader>
            {activeTab === "departments" ? (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Department Name</Label>
                  <Input
                    id="name"
                    value={newDepartment.name}
                    onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                    placeholder="Enter department name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newDepartment.location}
                    onChange={(e) => setNewDepartment({ ...newDepartment, location: e.target.value })}
                    placeholder="Enter department location"
                  />
                </div>
              </div>
            ) : (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={newJobTitle.title}
                    onChange={(e) => setNewJobTitle({ ...newJobTitle, title: e.target.value })}
                    placeholder="Enter job title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="department">Department</Label>
                  <select
                    id="department"
                    value={newJobTitle.department}
                    onChange={(e) => setNewJobTitle({ ...newJobTitle, department: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select a department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={activeTab === "departments" ? handleAddDepartment : handleAddJobTitle}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <CardTitle>Organization Structure</CardTitle>
              <CardDescription>Manage departments and job titles across the organization.</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button
                variant={activeTab === "departments" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("departments")}
              >
                <Building2 className="mr-2 h-4 w-4" />
                Departments
              </Button>
              <Button
                variant={activeTab === "jobTitles" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("jobTitles")}
              >
                <Users className="mr-2 h-4 w-4" />
                Job Titles
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === "departments" ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Department Name</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Employees</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.map((department) => (
                    <TableRow key={department.id}>
                      <TableCell>{department.id}</TableCell>
                      <TableCell className="font-medium">{department.name}</TableCell>
                      <TableCell>{department.manager}</TableCell>
                      <TableCell>{department.employeeCount}</TableCell>
                      <TableCell>{department.location}</TableCell>
                      <TableCell>${department.budget.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Department</DropdownMenuItem>
                            <DropdownMenuItem>Assign Manager</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Delete Department</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Employees</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobTitles.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>{job.id}</TableCell>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{job.department}</TableCell>
                      <TableCell>{job.employeeCount}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Job Title</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Delete Job Title</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

