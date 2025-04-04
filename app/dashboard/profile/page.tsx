"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Phone, Calendar, Building2, Briefcase, DollarSign, Clock, Shield } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { translations, type Language } from "@/lib/i18n/translations"

// Mock user data
const mockUserData = {
  id: "EMP001",
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  department: "Engineering",
  jobTitle: "Senior Developer",
  joinDate: "2020-05-12",
  status: "Active",
  salary: {
    base: 5000,
    bonus: 500,
    deductions: 750,
    net: 4750,
  },
  attendance: {
    present: 21,
    absent: 0,
    leave: 1,
    total: 22,
  },
  manager: "Sarah Johnson",
  address: "123 Main St, Anytown, USA",
  emergencyContact: "Jane Doe, +1 (555) 987-6543",
}

export default function ProfilePage() {
  const [userData, setUserData] = useState(mockUserData)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [language, setLanguage] = useState<Language>("en")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const role = localStorage.getItem("userRole")
    const savedLanguage = (localStorage.getItem("language") as Language) || "en"
    
    setUserRole(role)
    setLanguage(savedLanguage)
  }, [])

  const t = translations[language]

  if (!mounted) {
    return null
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t.profile.title}</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex flex-col items-center space-y-2">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder-user.jpg" alt={userData.name} />
                <AvatarFallback>
                  {userData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1 text-center">
                <h2 className="text-xl font-bold">{userData.name}</h2>
                <p className="text-sm text-muted-foreground">{userData.jobTitle}</p>
                <Badge variant="outline">{userData.department}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{userData.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{userData.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{t.profile.joinDate} {new Date(userData.joinDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{t.profile.manager} {userData.manager}</span>
              </div>
              <div className="pt-4">
                <Button className="w-full">{t.profile.editProfile}</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t.profile.employeeInformation}</CardTitle>
            <CardDescription>{t.profile.title}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="personal" className="space-y-4">
              <TabsList>
                <TabsTrigger value="personal">
                  <User className="mr-2 h-4 w-4" />
                  {t.profile.personalTab}
                </TabsTrigger>
                <TabsTrigger value="employment">
                  <Briefcase className="mr-2 h-4 w-4" />
                  {t.profile.employmentTab}
                </TabsTrigger>
                <TabsTrigger value="payroll">
                  <DollarSign className="mr-2 h-4 w-4" />
                  {t.profile.payrollTab}
                </TabsTrigger>
                <TabsTrigger value="attendance">
                  <Clock className="mr-2 h-4 w-4" />
                  {t.profile.attendanceTab}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" value={userData.name} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={userData.email} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" value={userData.phone} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" value={userData.address} readOnly />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="emergency">Emergency Contact</Label>
                    <Input id="emergency" value={userData.emergencyContact} readOnly />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="employment" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="employeeId">Employee ID</Label>
                    <Input id="employeeId" value={userData.id} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" value={userData.department} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input id="jobTitle" value={userData.jobTitle} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="joinDate">Join Date</Label>
                    <Input id="joinDate" value={new Date(userData.joinDate).toLocaleDateString()} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Input id="status" value={userData.status} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manager">Manager</Label>
                    <Input id="manager" value={userData.manager} readOnly />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="payroll" className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium">Base Salary</p>
                      <p className="text-2xl font-bold">${userData.salary.base.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Bonus</p>
                      <p className="text-2xl font-bold">${userData.salary.bonus.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Deductions</p>
                      <p className="text-2xl font-bold">${userData.salary.deductions.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Net Salary</p>
                      <p className="text-2xl font-bold">${userData.salary.net.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" className="w-full">
                      View Salary History
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="attendance" className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="grid gap-4 md:grid-cols-4">
                    <div>
                      <p className="text-sm font-medium">Present Days</p>
                      <p className="text-2xl font-bold">{userData.attendance.present}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Absent Days</p>
                      <p className="text-2xl font-bold">{userData.attendance.absent}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Leave Days</p>
                      <p className="text-2xl font-bold">{userData.attendance.leave}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Working Days</p>
                      <p className="text-2xl font-bold">{userData.attendance.total}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" className="w-full">
                      View Attendance History
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {userRole === "admin" && (
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Manage your account security and access settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center">
                    <Shield className="mr-2 h-4 w-4" />
                    <span className="font-medium">Password</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Change your account password</div>
                </div>
                <Button variant="outline">Change Password</Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center">
                    <Shield className="mr-2 h-4 w-4" />
                    <span className="font-medium">Two-Factor Authentication</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Add an extra layer of security to your account</div>
                </div>
                <Button variant="outline">Enable</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

