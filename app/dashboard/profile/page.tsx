"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Building2,
  Briefcase,
  DollarSign,
  Clock,
  Shield,
  Save,
  X,
  AlertTriangle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/i18n/language-context";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { AvatarUpload } from "@/components/avatar-upload";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Default user data structure (used when API fails)
const defaultUserData = {
  id: "EMP001",
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  department: "Engineering",
  jobTitle: "Senior Developer",
  joinDate: "2020-05-12",
  status: "Active",
  bio: "Experienced software developer with expertise in web technologies and system architecture.",
  address: "123 Main St, Anytown, USA",
  emergencyContact: "Jane Doe, +1 (555) 987-6543",
  manager: "Sarah Johnson",
  avatar: "/placeholder.svg?height=96&width=96",
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
  salaryGapWarnings: [],
};

// API base URLs
const PROFILE_API_BASE_URL = `${process.env.NEXT_PUBLIC_DOMAIN}/profile`;

// Function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("userToken");
  if (!token) {
    console.warn("No userToken found in localStorage");
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// API functions
const fetchProfile = async () => {
  try {
    const response = await fetch(`${PROFILE_API_BASE_URL}/`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error(
        "Fetch profile error:",
        errorData,
        response.status,
        response.statusText
      );
      throw new Error(
        `Lỗi khi lấy thông tin hồ sơ: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    console.log("Profile API Response:", JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error("Fetch profile failed:", error);
    throw error;
  }
};

const changePassword = async (oldPassword: string, newPassword: string) => {
  try {
    const response = await fetch(
      `${PROFILE_API_BASE_URL}/change_password?old_password=${encodeURIComponent(
        oldPassword
      )}&new_password=${encodeURIComponent(newPassword)}`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Change password error:", errorData);
      throw new Error(
        `Lỗi khi thay đổi mật khẩu: ${response.status} ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Change password failed:", error);
    throw error;
  }
};

export default function ProfilePage() {
  const [userData, setUserData] = useState(defaultUserData);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(defaultUserData);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] =
    useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { t } = useLanguage();
  const { toast } = useToast();

  // Load initial data
  useEffect(() => {
    setMounted(true);
    const role = localStorage.getItem("userRole");
    setUserRole(role);

    // Fetch profile from API
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profileData = await fetchProfile();
      if (profileData.status === "success" && profileData.data) {
        // Map data from API response
        const apiData = profileData.data;
        const mappedData = {
          ...defaultUserData,
          id: apiData.employee_id?.toString() || defaultUserData.id,
          name: apiData.employee_details?.FullName || defaultUserData.name, // Changed from username to FullName
          email: apiData.employee_details?.Email || defaultUserData.email,
          phone: apiData.employee_details?.PhoneNumber || defaultUserData.phone,
          department:
            apiData.employee_details?.DepartmentName ||
            defaultUserData.department,
          jobTitle:
            apiData.employee_details?.PositionName || defaultUserData.jobTitle,
          joinDate:
            apiData.employee_details?.HireDate || defaultUserData.joinDate,
          status: apiData.employee_details?.Status || defaultUserData.status,
          bio: apiData.employee_details?.Bio || defaultUserData.bio,
          address: apiData.employee_details?.Address || defaultUserData.address,
          emergencyContact:
            apiData.employee_details?.EmergencyContact ||
            defaultUserData.emergencyContact,
          manager: apiData.employee_details?.Manager || defaultUserData.manager,
          salary: {
            ...defaultUserData.salary,
            base:
              apiData.payroll_details?.[0]?.BaseSalary ||
              defaultUserData.salary.base,
            bonus:
              apiData.payroll_details?.[0]?.Bonus ||
              defaultUserData.salary.bonus,
            deductions:
              apiData.payroll_details?.[0]?.Deductions ||
              defaultUserData.salary.deductions,
            net:
              (apiData.payroll_details?.[0]?.BaseSalary || 0) +
                (apiData.payroll_details?.[0]?.Bonus || 0) -
                (apiData.payroll_details?.[0]?.Deductions || 0) ||
              defaultUserData.salary.net,
          },
          attendance: {
            ...defaultUserData.attendance,
            present:
              apiData.attendance_details?.filter(
                (d: any) => d.Status === "Present"
              ).length || defaultUserData.attendance.present,
            absent:
              apiData.attendance_details?.filter(
                (d: any) => d.Status === "Absent"
              ).length || defaultUserData.attendance.absent,
            leave:
              apiData.attendance_details?.filter(
                (d: any) => d.Status === "On Leave"
              ).length || defaultUserData.attendance.leave,
            total:
              apiData.attendance_details?.length ||
              defaultUserData.attendance.total,
          },
          salaryGapWarnings: apiData.salary_gap_warning || [],
        };
        setUserData(mappedData);
        setEditedData(mappedData);
        localStorage.setItem("userData", JSON.stringify(mappedData));
        localStorage.setItem("userName", mappedData.name);
      }
    } catch (error: any) {
      console.error("Load profile failed:", error);
      if (error.message.includes("401")) {
        toast({
          title: "Lỗi Xác Thực",
          description: "Vui lòng đăng nhập lại để tiếp tục.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Lỗi",
          description:
            "Không thể tải thông tin hồ sơ. Sử dụng dữ liệu mặc định.",
          variant: "destructive",
        });
      }
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedData(userData);
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = () => {
    setUserData(editedData);
    setIsEditing(false);

    // Save to localStorage
    localStorage.setItem("userData", JSON.stringify(editedData));
    localStorage.setItem("userName", editedData.name);

    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated",
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      const parentValue = editedData[parent as keyof typeof editedData];

      if (parentValue && typeof parentValue === "object") {
        setEditedData({
          ...editedData,
          [parent]: {
            ...(parentValue as Record<string, any>),
            [child]: value,
          },
        });
      }
    } else {
      setEditedData({
        ...editedData,
        [name]: value,
      });
    }
  };

  const handleAvatarChange = (imageUrl: string) => {
    setEditedData({
      ...editedData,
      avatar: imageUrl,
    });
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập cả mật khẩu cũ và mật khẩu mới.",
        variant: "destructive",
      });
      return;
    }

    try {
      await changePassword(oldPassword, newPassword);
      setIsChangePasswordDialogOpen(false);
      setOldPassword("");
      setNewPassword("");
      toast({
        title: "Thành Công",
        description: "Mật khẩu của bạn đã được thay đổi thành công.",
      });
    } catch (error: any) {
      console.error("Change password failed:", error);
      if (error.message.includes("422")) {
        toast({
          title: "Lỗi Xác Thực",
          description: "Mật khẩu cũ không đúng hoặc mật khẩu mới không hợp lệ.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Lỗi",
          description: "Không thể thay đổi mật khẩu. Vui lòng thử lại sau.",
          variant: "destructive",
        });
      }
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          {t("profile.title")}
        </h1>
        <Button
          onClick={handleEditToggle}
          className={
            isEditing
              ? "bg-red-600 hover:bg-red-700"
              : "bg-blue-600 hover:bg-blue-700"
          }
        >
          {isEditing ? (
            <>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </>
          ) : (
            <>
              <User className="mr-2 h-4 w-4" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-1 border-0 shadow-xl bg-gradient-to-b from-slate-900 to-slate-800">
          <CardHeader>
            <div className="flex flex-col items-center space-y-4">
              {isEditing ? (
                <AvatarUpload
                  initialImage={userData.avatar}
                  name={userData.name}
                  onAvatarChange={handleAvatarChange}
                />
              ) : (
                <Avatar className="h-24 w-24 border-2 border-blue-500/20">
                  <AvatarImage
                    src={userData.avatar || "/placeholder.svg"}
                    alt={userData.name}
                  />
                  <AvatarFallback className="bg-blue-900 text-blue-100">
                    {userData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="space-y-1 text-center">
                <h2 className="text-xl font-bold text-white">
                  {userData.name}
                </h2>
                <p className="text-sm text-blue-300">{userData.jobTitle}</p>
                <Badge
                  variant="outline"
                  className="bg-blue-900/50 text-blue-100 border-blue-700"
                >
                  {userData.department}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="border-t border-slate-700/50 pt-4">
            <div className="space-y-4">
              {userData.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-slate-300">
                    {userData.email}
                  </span>
                </div>
              )}
              {userData.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-slate-300">
                    {userData.phone}
                  </span>
                </div>
              )}
              {userData.joinDate && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-slate-300">
                    Joined {new Date(userData.joinDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              {userData.manager && (
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-slate-300">
                    Reports to {userData.manager}
                  </span>
                </div>
              )}
              {!isEditing && userData.bio && (
                <div className="pt-4">
                  <div className="rounded-md border border-slate-700 p-3 bg-slate-800/50">
                    <h4 className="text-sm font-medium mb-2 text-blue-300">
                      About Me
                    </h4>
                    <p className="text-sm text-slate-400">
                      {userData.bio || "No bio provided."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border-0 shadow-xl bg-gradient-to-b from-slate-900 to-slate-800">
          <CardHeader className="border-b border-slate-700/50">
            <CardTitle className="text-white">
              {t("profile.employeeInformation")}
            </CardTitle>
            <CardDescription className="text-blue-300">
              View and manage your personal and employment details
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue="personal" className="space-y-4">
              <TabsList className="bg-slate-800 border border-slate-700">
                <TabsTrigger
                  value="personal"
                  className="data-[state=active]:bg-blue-900 data-[state=active]:text-white"
                >
                  <User className="mr-2 h-4 w-4" />
                  {t("profile.personalTab")}
                </TabsTrigger>
                <TabsTrigger
                  value="employment"
                  className="data-[state=active]:bg-blue-900 data-[state=active]:text-white"
                >
                  <Briefcase className="mr-2 h-4 w-4" />
                  {t("profile.employmentTab")}
                </TabsTrigger>
                <TabsTrigger
                  value="payroll"
                  className="data-[state=active]:bg-blue-900 data-[state=active]:text-white"
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  {t("profile.payrollTab")}
                </TabsTrigger>
                <TabsTrigger
                  value="attendance"
                  className="data-[state=active]:bg-blue-900 data-[state=active]:text-white"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  {t("profile.attendanceTab")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-blue-300">
                      {t("profile.fullName")}
                    </Label>
                    {isEditing ? (
                      <Input
                        id="fullName"
                        name="name"
                        value={editedData.name}
                        onChange={handleInputChange}
                        className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                      />
                    ) : (
                      <Input
                        id="fullName"
                        value={userData.name}
                        readOnly
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-blue-300">
                      {t("profile.email")}
                    </Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        name="email"
                        value={editedData.email}
                        onChange={handleInputChange}
                        className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                      />
                    ) : (
                      <Input
                        id="email"
                        value={userData.email}
                        readOnly
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-blue-300">
                      {t("profile.phone")}
                    </Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        name="phone"
                        value={editedData.phone}
                        onChange={handleInputChange}
                        className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                      />
                    ) : (
                      <Input
                        id="phone"
                        value={userData.phone}
                        readOnly
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-blue-300">
                      {t("profile.address")}
                    </Label>
                    {isEditing ? (
                      <Input
                        id="address"
                        name="address"
                        value={editedData.address}
                        onChange={handleInputChange}
                        className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                      />
                    ) : (
                      <Input
                        id="address"
                        value={userData.address}
                        readOnly
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    )}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="emergency" className="text-blue-300">
                      {t("profile.emergencyContact")}
                    </Label>
                    {isEditing ? (
                      <Input
                        id="emergency"
                        name="emergencyContact"
                        value={editedData.emergencyContact}
                        onChange={handleInputChange}
                        className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                      />
                    ) : (
                      <Input
                        id="emergency"
                        value={userData.emergencyContact}
                        readOnly
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    )}
                  </div>
                  {isEditing && (
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="bio" className="text-blue-300">
                        About Me
                      </Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={editedData.bio}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Tell us about yourself"
                        className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                      />
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="employment" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="employeeId" className="text-blue-300">
                      {t("profile.employeeId")}
                    </Label>
                    <Input
                      id="employeeId"
                      value={userData.id}
                      readOnly
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-blue-300">
                      {t("profile.department")}
                    </Label>
                    {isEditing ? (
                      <Input
                        id="department"
                        name="department"
                        value={editedData.department}
                        onChange={handleInputChange}
                        className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                      />
                    ) : (
                      <Input
                        id="department"
                        value={userData.department}
                        readOnly
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle" className="text-blue-300">
                      {t("profile.jobTitle")}
                    </Label>
                    {isEditing ? (
                      <Input
                        id="jobTitle"
                        name="jobTitle"
                        value={editedData.jobTitle}
                        onChange={handleInputChange}
                        className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                      />
                    ) : (
                      <Input
                        id="jobTitle"
                        value={userData.jobTitle}
                        readOnly
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="joinDate" className="text-blue-300">
                      {t("profile.joinDate")}
                    </Label>
                    <Input
                      id="joinDate"
                      value={new Date(userData.joinDate).toLocaleDateString()}
                      readOnly
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-blue-300">
                      {t("profile.status")}
                    </Label>
                    <Input
                      id="status"
                      value={userData.status}
                      readOnly
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manager" className="text-blue-300">
                      {t("profile.manager")}
                    </Label>
                    <Input
                      id="manager"
                      value={userData.manager}
                      readOnly
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="payroll" className="space-y-4">
                <div className="rounded-md border border-slate-700 p-6 bg-slate-800/50">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-lg border border-slate-700">
                      <p className="text-sm font-medium text-blue-300">
                        {t("profile.baseSalary")}
                      </p>
                      <p className="text-3xl font-bold text-white mt-2">
                        {userData.salary.base.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </p>
                      <div className="mt-2 h-1 w-full bg-blue-900/30 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-blue-600 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 1, delay: 0.2 }}
                        />
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-lg border border-slate-700">
                      <p className="text-sm font-medium text-blue-300">
                        {t("profile.bonus")}
                      </p>
                      <p className="text-3xl font-bold text-white mt-2">
                        {userData.salary.bonus.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </p>
                      <div className="mt-2 h-1 w-full bg-green-900/30 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-green-600 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "60%" }}
                          transition={{ duration: 1, delay: 0.3 }}
                        />
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-lg border border-slate-700">
                      <p className="text-sm font-medium text-blue-300">
                        {t("profile.deductions")}
                      </p>
                      <p className="text-3xl font-bold text-white mt-2">
                        {userData.salary.deductions.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </p>
                      <div className="mt-2 h-1 w-full bg-red-900/30 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-red-600 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "40%" }}
                          transition={{ duration: 1, delay: 0.4 }}
                        />
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-lg border border-slate-700">
                      <p className="text-sm font-medium text-blue-300">
                        {t("profile.netSalary")}
                      </p>
                      <p className="text-3xl font-bold text-white mt-2">
                        {userData.salary.net.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </p>
                      <div className="mt-2 h-1 w-full bg-purple-900/30 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-purple-600 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "80%" }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                    </div>
                  </div>
                  {userData.salaryGapWarnings.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium mb-2 text-blue-300 flex items-center">
                        <AlertTriangle className="mr-2 h-4 w-4 text-yellow-400" />
                        Salary Gap Warnings
                      </h4>
                      <Table>
                        <TableHeader>
                          <TableRow className="border-slate-700">
                            <TableHead className="text-blue-300">
                              Employee Name
                            </TableHead>
                            <TableHead className="text-blue-300">
                              Previous Month
                            </TableHead>
                            <TableHead className="text-blue-300">
                              Previous Salary
                            </TableHead>
                            <TableHead className="text-blue-300">
                              Current Month
                            </TableHead>
                            <TableHead className="text-blue-300">
                              Current Salary
                            </TableHead>
                            <TableHead className="text-blue-300">
                              Gap Percentage
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {userData.salaryGapWarnings.map(
                            (warning: any, index: number) => (
                              <TableRow
                                key={index}
                                className="border-slate-700 hover:bg-slate-800/50"
                              >
                                <TableCell className="text-white">
                                  {warning.EmployeeName}
                                </TableCell>
                                <TableCell className="text-white">
                                  {new Date(
                                    warning.PreviousMonth
                                  ).toLocaleString("en-US", {
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </TableCell>
                                <TableCell className="text-white">
                                  {warning.PreviousSalary.toLocaleString(
                                    "vi-VN",
                                    {
                                      style: "currency",
                                      currency: "VND",
                                    }
                                  )}
                                </TableCell>
                                <TableCell className="text-white">
                                  {new Date(
                                    warning.CurrentMonth
                                  ).toLocaleString("en-US", {
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </TableCell>
                                <TableCell className="text-white">
                                  {warning.CurrentSalary.toLocaleString(
                                    "vi-VN",
                                    {
                                      style: "currency",
                                      currency: "VND",
                                    }
                                  )}
                                </TableCell>
                                <TableCell
                                  className={
                                    warning.GapPercentage < 0
                                      ? "text-red-400"
                                      : "text-green-400"
                                  }
                                >
                                  {warning.GapPercentage.toFixed(2)}%
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                  <div className="mt-6">
                    <Button
                      variant="outline"
                      className="w-full border-slate-700 text-blue-300 hover:bg-blue-900/20 hover:text-blue-100"
                    >
                      {t("profile.viewSalaryHistory")}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="attendance" className="space-y-4">
                <div className="rounded-md border border-slate-700 p-6 bg-slate-800/50">
                  <div className="grid gap-6 md:grid-cols-4">
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-lg border border-slate-700">
                      <p className="text-sm font-medium text-blue-300">
                        {t("profile.presentDays")}
                      </p>
                      <p className="text-3xl font-bold text-white mt-2">
                        {userData.attendance.present}
                      </p>
                      <div className="mt-2 h-1 w-full bg-green-900/30 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-green-600 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "95%" }}
                          transition={{ duration: 1, delay: 0.2 }}
                        />
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-lg border border-slate-700">
                      <p className="text-sm font-medium text-blue-300">
                        {t("profile.absentDays")}
                      </p>
                      <p className="text-3xl font-bold text-white mt-2">
                        {userData.attendance.absent}
                      </p>
                      <div className="mt-2 h-1 w-full bg-red-900/30 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-red-600 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "0%" }}
                          transition={{ duration: 1, delay: 0.3 }}
                        />
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-lg border border-slate-700">
                      <p className="text-sm font-medium text-blue-300">
                        {t("profile.leaveDays")}
                      </p>
                      <p className="text-3xl font-bold text-white mt-2">
                        {userData.attendance.leave}
                      </p>
                      <div className="mt-2 h-1 w-full bg-yellow-900/30 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-yellow-600 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "5%" }}
                          transition={{ duration: 1, delay: 0.4 }}
                        />
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-lg border border-slate-700">
                      <p className="text-sm font-medium text-blue-300">
                        {t("profile.workingDays")}
                      </p>
                      <p className="text-3xl font-bold text-white mt-2">
                        {userData.attendance.total}
                      </p>
                      <div className="mt-2 h-1 w-full bg-blue-900/30 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-blue-600 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button
                      variant="outline"
                      className="w-full border-slate-700 text-blue-300 hover:bg-blue-900/20 hover:text-blue-100"
                    >
                      {t("profile.viewAttendanceHistory")}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          {isEditing && (
            <CardFooter className="flex justify-end space-x-2 border-t border-slate-700/50 p-4">
              <Button
                variant="outline"
                onClick={handleEditToggle}
                className="border-slate-700 text-blue-300 hover:bg-red-900/20 hover:text-red-100"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button
                onClick={handleSaveProfile}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>

      {userRole === "admin" && (
        <Card className="border-0 shadow-xl bg-gradient-to-b from-slate-900 to-slate-800">
          <CardHeader className="border-b border-slate-700/50">
            <CardTitle className="text-white">Security Settings</CardTitle>
            <CardDescription className="text-blue-300">
              Manage your account security and access settings
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center">
                    <Shield className="mr-2 h-4 w-4 text-blue-400" />
                    <span className="font-medium text-white">Password</span>
                  </div>
                  <div className="text-sm text-slate-400">
                    Change your account password
                  </div>
                </div>
                <Dialog
                  open={isChangePasswordDialogOpen}
                  onOpenChange={setIsChangePasswordDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-slate-700 text-blue-300 hover:bg-blue-900/20 hover:text-blue-100"
                    >
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800">
                    <DialogHeader>
                      <DialogTitle className="text-white">
                        Change Password
                      </DialogTitle>
                      <DialogDescription className="text-blue-300">
                        Enter your old and new password to update your account.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="oldPassword" className="text-blue-300">
                          Old Password
                        </Label>
                        <Input
                          id="oldPassword"
                          type="password"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-blue-300">
                          New Password
                        </Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsChangePasswordDialogOpen(false)}
                        className="border-slate-700 text-blue-300 hover:bg-slate-800"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleChangePassword}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Save
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center">
                    <Shield className="mr-2 h-4 w-4 text-blue-400" />
                    <span className="font-medium text-white">
                      Two-Factor Authentication
                    </span>
                  </div>
                  <div className="text-sm text-slate-400">
                    Add an extra layer of security to your account
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="border-slate-700 text-blue-300 hover:bg-blue-900/20 hover:text-blue-100"
                >
                  Enable
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
