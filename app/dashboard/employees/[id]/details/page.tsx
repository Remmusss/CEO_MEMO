"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  Calendar,
  User,
  Briefcase,
  Building,
  Clock,
  Award,
  Save,
} from "lucide-react";

// Employee interface
interface Employee {
  EmployeeID: number;
  FullName: string;
  Email: string;
  PhoneNumber?: string;
  DateOfBirth?: string;
  Gender?: string;
  HireDate: string;
  DepartmentID: number;
  PositionID: number;
  Status: string;
  department?: { DepartmentName: string };
  position?: { PositionName: string };
}

interface ApiResponse {
  data?: Employee | Employee[];
}

const EmployeeDetailsPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const employeeId = params.id as string;

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);

  // Fetch employee details
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("userToken");
        if (!token) {
          throw new Error("Thiếu token xác thực");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_DOMAIN}/employees/details/${employeeId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Lỗi: ${response.status} ${response.statusText}`);
        }

        const data: ApiResponse = await response.json();

        // Xử lý dữ liệu từ API (mảng hoặc đối tượng)
        let employeeData: Employee | null = null;
        if (Array.isArray(data.data)) {
          employeeData =
            data.data.find((emp) => emp.EmployeeID.toString() === employeeId) ||
            null;
        } else if (data.data && typeof data.data === "object") {
          employeeData = data.data as Employee;
        } else {
          throw new Error("Dữ liệu trả về không hợp lệ");
        }

        if (!employeeData) {
          throw new Error("Không tìm thấy thông tin nhân viên");
        }

        setEmployee(employeeData);
        setEditEmployee(employeeData);
      } catch (err: any) {
        console.error("Lỗi khi lấy thông tin nhân viên:", err);
        setError(err.message || "Không thể tải thông tin nhân viên");
        toast({
          title: "Lỗi",
          description: err.message || "Không thể tải thông tin nhân viên",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (employeeId) {
      fetchEmployeeDetails();
    }
  }, [employeeId, toast]);

  // Handle employee update
  const handleUpdateEmployee = async () => {
    if (!editEmployee || !employee) return;

    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        throw new Error("Thiếu token xác thực");
      }

      const updateData = {
        DepartmentID: editEmployee.DepartmentID,
        PositionID: editEmployee.PositionID,
        Status: editEmployee.Status,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/employees/update/${employee.EmployeeID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        throw new Error(`Lỗi: ${response.status} ${response.statusText}`);
      }

      // Update local state with new data
      setEmployee({
        ...employee,
        ...updateData,
        department: {
          DepartmentName: getDepartmentName(editEmployee.DepartmentID),
        },
        position: {
          PositionName: getPositionName(editEmployee.PositionID),
        },
      });

      setIsEditDialogOpen(false);
      toast({
        title: "Thành công",
        description: "Thông tin nhân viên đã được cập nhật",
      });
    } catch (err: any) {
      console.error("Lỗi khi cập nhật nhân viên:", err);
      toast({
        title: "Lỗi",
        description: err.message || "Không thể cập nhật thông tin nhân viên",
        variant: "destructive",
      });
    }
  };

  // Helper functions to get department and position names
  const getDepartmentName = (id: number): string => {
    const departments: Record<number, string> = {
      1: "Phòng nhân sự",
      2: "Phòng Kế toán",
      3: "Phòng Kinh doanh",
      4: "Phòng Kỹ thuật",
      5: "Phòng IT",
      6: "Phòng Marketing",
    };
    return departments[id] || "Không xác định";
  };

  const getPositionName = (id: number): string => {
    const positions: Record<number, string> = {
      1: "Nhân viên",
      2: "Trưởng phòng",
      3: "Phó phòng",
      4: "Giám đốc",
      5: "Kỹ sư phần mềm",
      6: "Kế toán viên",
    };
    return positions[id] || "Không xác định";
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Get status badge class
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-900/20 text-green-400 border-green-800";
      case "On Leave":
        return "bg-yellow-900/20 text-yellow-400 border-yellow-800";
      default:
        return "bg-red-900/20 text-red-400 border-red-800";
    }
  };

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "Active":
        return "Đang làm việc";
      case "On Leave":
        return "Nghỉ phép";
      default:
        return "Không hoạt động";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-700 border-l-blue-600 border-r-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-blue-400 font-medium">
            Đang tải thông tin nhân viên...
          </p>
        </div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
        <div className="text-red-500 text-5xl">⚠️</div>
        <h2 className="text-xl font-semibold text-white">
          Không thể tải thông tin nhân viên
        </h2>
        <p className="text-slate-400">
          {error || "Đã xảy ra lỗi không xác định"}
        </p>
        <Button
          onClick={() => router.push("/dashboard/employees")}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại danh sách nhân viên
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/dashboard/employees")}
            className="h-10 w-10 rounded-full border-slate-700 text-blue-300 hover:bg-slate-800"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Quay lại</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              {employee.FullName}
            </h1>
            <p className="text-slate-400">{employee.Email}</p>
          </div>
        </div>
        <Button
          onClick={() => setIsEditDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Edit className="mr-2 h-4 w-4" />
          Chỉnh sửa thông tin
        </Button>
      </div>

      {/* Main content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-slate-800 border border-slate-700 p-1">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-blue-600"
          >
            Tổng quan
          </TabsTrigger>
          <TabsTrigger
            value="employment"
            className="data-[state=active]:bg-blue-600"
          >
            Thông tin công việc
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Personal Information */}
          <Card className="border-0 shadow-xl bg-gradient-to-b from-slate-950 to-slate-900">
            <CardHeader className="border-b border-slate-800/50">
              <CardTitle className="text-white">Thông tin cá nhân</CardTitle>
              <CardDescription className="text-blue-300">
                Thông tin chi tiết về nhân viên
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <User className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-300">
                        Họ và tên
                      </p>
                      <p className="text-white">{employee.FullName}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-300">Email</p>
                      <p className="text-white">{employee.Email}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-300">
                        Số điện thoại
                      </p>
                      <p className="text-white">
                        {employee.PhoneNumber || "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-300">
                        Ngày sinh
                      </p>
                      <p className="text-white">
                        {formatDate(employee.DateOfBirth)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <User className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-300">
                        Giới tính
                      </p>
                      <p className="text-white">
                        {employee.Gender === "Male"
                          ? "Nam"
                          : employee.Gender === "Female"
                          ? "Nữ"
                          : employee.Gender || "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-300">
                        Trạng thái
                      </p>
                      <Badge
                        variant="outline"
                        className={getStatusBadge(employee.Status)}
                      >
                        {getStatusText(employee.Status)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employment" className="mt-6 space-y-6">
          {/* Employment Information */}
          <Card className="border-0 shadow-xl bg-gradient-to-b from-slate-950 to-slate-900">
            <CardHeader className="border-b border-slate-800/50">
              <CardTitle className="text-white">Thông tin công việc</CardTitle>
              <CardDescription className="text-blue-300">
                Chi tiết về vị trí và phòng ban
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Building className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-300">
                        Phòng ban
                      </p>
                      <p className="text-white">
                        {employee.department?.DepartmentName ||
                          getDepartmentName(employee.DepartmentID)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Briefcase className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-300">
                        Vị trí
                      </p>
                      <p className="text-white">
                        {employee.position?.PositionName ||
                          getPositionName(employee.PositionID)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-300">
                        Ngày vào làm
                      </p>
                      <p className="text-white">
                        {formatDate(employee.HireDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Award className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-300">
                        Mã nhân viên
                      </p>
                      <p className="text-white">#{employee.EmployeeID}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-white text-xl font-semibold text-center">
              Chỉnh sửa thông tin nhân viên
            </DialogTitle>
            <DialogDescription className="text-blue-300 text-center">
              Cập nhật thông tin công việc của {employee.FullName}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            <div className="grid gap-2">
              <label htmlFor="edit-name" className="text-blue-400 font-medium">
                Họ và Tên
              </label>
              <Input
                id="edit-name"
                value={employee.FullName}
                readOnly
                className="bg-slate-800 border-slate-700 text-white cursor-not-allowed"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="edit-email" className="text-blue-400 font-medium">
                Email
              </label>
              <Input
                id="edit-email"
                type="email"
                value={employee.Email}
                readOnly
                className="bg-slate-800 border-slate-700 text-white cursor-not-allowed"
              />
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="edit-department"
                className="text-blue-400 font-medium"
              >
                Phòng ban
              </label>
              <Select
                value={editEmployee?.DepartmentID?.toString()}
                onValueChange={(value) =>
                  setEditEmployee((prev) =>
                    prev
                      ? {
                          ...prev,
                          DepartmentID: Number.parseInt(value),
                        }
                      : null
                  )
                }
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Chọn phòng ban" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value="1">Phòng nhân sự</SelectItem>
                  <SelectItem value="2">Phòng Kế toán</SelectItem>
                  <SelectItem value="3">Phòng Kinh doanh</SelectItem>
                  <SelectItem value="4">Phòng Kỹ thuật</SelectItem>
                  <SelectItem value="5">Phòng IT</SelectItem>
                  <SelectItem value="6">Phòng Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="edit-position"
                className="text-blue-400 font-medium"
              >
                Vị trí
              </label>
              <Select
                value={editEmployee?.PositionID?.toString()}
                onValueChange={(value) =>
                  setEditEmployee((prev) =>
                    prev
                      ? {
                          ...prev,
                          PositionID: Number.parseInt(value),
                        }
                      : null
                  )
                }
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Chọn vị trí" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value="1">Nhân viên</SelectItem>
                  <SelectItem value="2">Trưởng phòng</SelectItem>
                  <SelectItem value="3">Phó phòng</SelectItem>
                  <SelectItem value="4">Giám đốc</SelectItem>
                  <SelectItem value="5">Kỹ sư phần mềm</SelectItem>
                  <SelectItem value="6">Kế toán viên</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="edit-status"
                className="text-blue-400 font-medium"
              >
                Trạng thái
              </label>
              <Select
                value={editEmployee?.Status}
                onValueChange={(value) =>
                  setEditEmployee((prev) =>
                    prev
                      ? {
                          ...prev,
                          Status: value,
                        }
                      : null
                  )
                }
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value="Active">Đang làm việc</SelectItem>
                  <SelectItem value="On Leave">Nghỉ phép</SelectItem>
                  <SelectItem value="Inactive">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              onClick={handleUpdateEmployee}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition duration-200"
            >
              <Save className="mr-2 h-4 w-4" />
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default EmployeeDetailsPage;
