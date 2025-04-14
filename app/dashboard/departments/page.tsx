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
import { Plus, MoreHorizontal, Building2, Users, Edit, Trash2, UserPlus, Eye } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

// Mock department data
const initialDepartments = [
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
const initialJobTitles = [
  { id: "JOB001", title: "Software Engineer", department: "Engineering", employeeCount: 20 },
  { id: "JOB002", title: "Senior Developer", department: "Engineering", employeeCount: 15 },
  { id: "JOB003", title: "Marketing Specialist", department: "Marketing", employeeCount: 10 },
  { id: "JOB004", title: "Sales Representative", department: "Sales", employeeCount: 18 },
  { id: "JOB005", title: "HR Specialist", department: "Human Resources", employeeCount: 5 },
  { id: "JOB006", title: "Financial Analyst", department: "Finance", employeeCount: 8 },
  { id: "JOB007", title: "Operations Manager", department: "Operations", employeeCount: 5 },
]

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState(initialDepartments)
  const [jobTitles, setJobTitles] = useState(initialJobTitles)
  const [activeTab, setActiveTab] = useState("departments")
  const [newDepartment, setNewDepartment] = useState({ name: "", location: "" })
  const [newJobTitle, setNewJobTitle] = useState({ title: "", department: "" })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
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

    // Load data from localStorage if available
    const savedDepartments = localStorage.getItem("departments")
    if (savedDepartments) {
      setDepartments(JSON.parse(savedDepartments))
    } else {
      localStorage.setItem("departments", JSON.stringify(initialDepartments))
    }

    const savedJobTitles = localStorage.getItem("jobTitles")
    if (savedJobTitles) {
      setJobTitles(JSON.parse(savedJobTitles))
    } else {
      localStorage.setItem("jobTitles", JSON.stringify(initialJobTitles))
    }
  }, [router])

  // Save data to localStorage when it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("departments", JSON.stringify(departments))
      localStorage.setItem("jobTitles", JSON.stringify(jobTitles))
    }
  }, [departments, jobTitles, mounted])

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

      toast({
        title: "Department Added",
        description: `${newDepartment.name} has been added successfully`,
      })
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

      toast({
        title: "Job Title Added",
        description: `${newJobTitle.title} has been added successfully`,
      })
    }
  }

  const handleDeleteItem = () => {
    if (selectedItem) {
      if (activeTab === "departments") {
        setDepartments(departments.filter((dept) => dept.id !== selectedItem.id))
        toast({
          title: "Department Deleted",
          description: `${selectedItem.name} has been deleted successfully`,
          variant: "destructive",
        })
      } else {
        setJobTitles(jobTitles.filter((job) => job.id !== selectedItem.id))
        toast({
          title: "Job Title Deleted",
          description: `${selectedItem.title} has been deleted successfully`,
          variant: "destructive",
        })
      }
      setIsDeleteDialogOpen(false)
    }
  }

  if (!mounted || (userRole !== "admin" && userRole !== "hr-manager")) {
    return null
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          {t("departments.title")}
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              {activeTab === "departments" ? t("departments.addDepartment") : t("departments.addJobTitle")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-white">
                {activeTab === "departments" ? t("departments.addDepartment") : t("departments.addJobTitle")}
              </DialogTitle>
              <DialogDescription className="text-blue-300">
                {activeTab === "departments"
                  ? "Fill in the details to create a new department."
                  : "Fill in the details to create a new job title."}
              </DialogDescription>
            </DialogHeader>
            {activeTab === "departments" ? (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-blue-300">
                    {t("departments.departmentName")}
                  </Label>
                  <Input
                    id="name"
                    value={newDepartment.name}
                    onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                    placeholder={t("departments.departmentName")}
                    className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location" className="text-blue-300">
                    {t("departments.location")}
                  </Label>
                  <Input
                    id="location"
                    value={newDepartment.location}
                    onChange={(e) => setNewDepartment({ ...newDepartment, location: e.target.value })}
                    placeholder={t("departments.location")}
                    className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                  />
                </div>
              </div>
            ) : (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title" className="text-blue-300">
                    {t("departments.jobTitle")}
                  </Label>
                  <Input
                    id="title"
                    value={newJobTitle.title}
                    onChange={(e) => setNewJobTitle({ ...newJobTitle, title: e.target.value })}
                    placeholder={t("departments.jobTitle")}
                    className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="department" className="text-blue-300">
                    {t("departments.department")}
                  </Label>
                  <select
                    id="department"
                    value={newJobTitle.department}
                    onChange={(e) => setNewJobTitle({ ...newJobTitle, department: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">{t("departments.department")}</option>
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
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="border-slate-700 text-blue-300 hover:bg-slate-800"
              >
                {t("common.cancel")}
              </Button>
              <Button
                onClick={activeTab === "departments" ? handleAddDepartment : handleAddJobTitle}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {t("common.save")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-0 shadow-xl bg-gradient-to-b from-slate-900 to-slate-800">
        <CardHeader className="border-b border-slate-700/50">
          <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <CardTitle className="text-white">{t("departments.organizationStructure")}</CardTitle>
              <CardDescription className="text-blue-300">{t("departments.organizationStructure")}</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button
                variant={activeTab === "departments" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("departments")}
                className={
                  activeTab === "departments"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "border-slate-700 text-blue-300 hover:bg-blue-900/20 hover:text-blue-100"
                }
              >
                <Building2 className="mr-2 h-4 w-4" />
                {t("departments.departmentsTab")}
              </Button>
              <Button
                variant={activeTab === "jobTitles" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("jobTitles")}
                className={
                  activeTab === "jobTitles"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "border-slate-700 text-blue-300 hover:bg-blue-900/20 hover:text-blue-100"
                }
              >
                <Users className="mr-2 h-4 w-4" />
                {t("departments.jobTitlesTab")}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {activeTab === "departments" ? (
            <div className="rounded-md border border-slate-700">
              <Table>
                <TableHeader className="bg-slate-800">
                  <TableRow className="hover:bg-slate-800/50 border-slate-700">
                    <TableHead className="text-blue-300">{t("departments.id")}</TableHead>
                    <TableHead className="text-blue-300">{t("departments.departmentName")}</TableHead>
                    <TableHead className="text-blue-300">{t("departments.manager")}</TableHead>
                    <TableHead className="text-blue-300">{t("departments.employees")}</TableHead>
                    <TableHead className="text-blue-300">{t("departments.location")}</TableHead>
                    <TableHead className="text-blue-300">{t("departments.budget")}</TableHead>
                    <TableHead className="text-right text-blue-300">{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.length === 0 ? (
                    <TableRow className="hover:bg-slate-800/50 border-slate-700">
                      <TableCell colSpan={7} className="text-center py-8 text-slate-400">
                        No departments found
                      </TableCell>
                    </TableRow>
                  ) : (
                    departments.map((department) => (
                      <TableRow key={department.id} className="hover:bg-slate-800/50 border-slate-700">
                        <TableCell className="text-slate-300">{department.id}</TableCell>
                        <TableCell className="font-medium text-white">{department.name}</TableCell>
                        <TableCell className="text-slate-300">{department.manager}</TableCell>
                        <TableCell className="text-slate-300">{department.employeeCount}</TableCell>
                        <TableCell className="text-slate-300">{department.location}</TableCell>
                        <TableCell className="text-slate-300">${department.budget.toLocaleString()}</TableCell>
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
                                {t("departments.viewDetails")}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="focus:bg-blue-900/50 focus:text-white">
                                <Edit className="mr-2 h-4 w-4" />
                                {t("departments.editDepartment")}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="focus:bg-blue-900/50 focus:text-white">
                                <UserPlus className="mr-2 h-4 w-4" />
                                {t("departments.assignManager")}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-slate-800" />
                              <DropdownMenuItem
                                className="text-red-400 focus:bg-red-900/50 focus:text-red-300"
                                onClick={() => {
                                  setSelectedItem(department)
                                  setIsDeleteDialogOpen(true)
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {t("departments.deleteDepartment")}
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
          ) : (
            <div className="rounded-md border border-slate-700">
              <Table>
                <TableHeader className="bg-slate-800">
                  <TableRow className="hover:bg-slate-800/50 border-slate-700">
                    <TableHead className="text-blue-300">{t("departments.id")}</TableHead>
                    <TableHead className="text-blue-300">{t("departments.jobTitle")}</TableHead>
                    <TableHead className="text-blue-300">{t("departments.department")}</TableHead>
                    <TableHead className="text-blue-300">{t("departments.employees")}</TableHead>
                    <TableHead className="text-right text-blue-300">{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobTitles.length === 0 ? (
                    <TableRow className="hover:bg-slate-800/50 border-slate-700">
                      <TableCell colSpan={5} className="text-center py-8 text-slate-400">
                        No job titles found
                      </TableCell>
                    </TableRow>
                  ) : (
                    jobTitles.map((job) => (
                      <TableRow key={job.id} className="hover:bg-slate-800/50 border-slate-700">
                        <TableCell className="text-slate-300">{job.id}</TableCell>
                        <TableCell className="font-medium text-white">{job.title}</TableCell>
                        <TableCell className="text-slate-300">{job.department}</TableCell>
                        <TableCell className="text-slate-300">{job.employeeCount}</TableCell>
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
                                {t("departments.viewDetails")}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="focus:bg-blue-900/50 focus:text-white">
                                <Edit className="mr-2 h-4 w-4" />
                                {t("departments.editJobTitle")}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-slate-800" />
                              <DropdownMenuItem
                                className="text-red-400 focus:bg-red-900/50 focus:text-red-300"
                                onClick={() => {
                                  setSelectedItem(job)
                                  setIsDeleteDialogOpen(true)
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {t("departments.deleteJobTitle")}
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
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Confirm Deletion</DialogTitle>
            <DialogDescription className="text-blue-300">
              Are you sure you want to delete this {activeTab === "departments" ? "department" : "job title"}? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="py-4">
              <div className="rounded-md border border-slate-700 p-4 bg-slate-800/50">
                <div className="space-y-1">
                  <p className="text-white font-medium">
                    {activeTab === "departments" ? selectedItem.name : selectedItem.title}
                  </p>
                  <p className="text-sm text-slate-400">
                    {activeTab === "departments"
                      ? `Location: ${selectedItem.location}`
                      : `Department: ${selectedItem.department}`}
                  </p>
                  <p className="text-sm text-slate-400">
                    {`Employees: ${selectedItem.employeeCount}`}
                    {activeTab === "departments" && ` • Budget: $${selectedItem.budget.toLocaleString()}`}
                  </p>
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
            <Button onClick={handleDeleteItem} variant="destructive" className="bg-red-600 hover:bg-red-700 text-white">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete {activeTab === "departments" ? "Department" : "Job Title"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
