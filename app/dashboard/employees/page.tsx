"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MoreHorizontal,
  UserPlus,
  Trash2,
  Edit,
  DollarSign,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/language-context";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

// Định nghĩa interface
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

interface Department {
  DepartmentID: number;
  DepartmentName: string;
}

interface ApiResponse {
  items?: Employee[];
  data?: Employee[];
  total?: number;
}

interface DepartmentApiResponse {
  items?: Department[];
  data?: Department[];
  total?: number;
}

// URL API
const API_BASE_URL = `${process.env.NEXT_PUBLIC_DOMAIN}/employees`;
const DEPARTMENTS_API_URL = `${process.env.NEXT_PUBLIC_DOMAIN}/departments`;

// Hàm lấy header xác thực
const getAuthHeaders = () => {
  const token = localStorage.getItem("userToken");
  if (!token) {
    console.error("Không tìm thấy token trong localStorage");
    throw new Error("Thiếu token xác thực");
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// API Calls
const fetchDepartments = async (): Promise<Department[]> => {
  try {
    const response = await fetch(DEPARTMENTS_API_URL, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Phản hồi lỗi từ API danh sách phòng ban:", errorData);
      throw new Error(
        `Không thể lấy danh sách phòng ban: ${response.status} ${response.statusText}`
      );
    }
    const data: DepartmentApiResponse = await response.json();
    let departmentArray: Department[] = [];
    if (Array.isArray(data)) departmentArray = data;
    else if (data?.items && Array.isArray(data.items))
      departmentArray = data.items;
    else if (data?.data && Array.isArray(data.data))
      departmentArray = data.data;
    else {
      console.error("Định dạng phản hồi API phòng ban không mong muốn:", data);
      throw new Error("Định dạng phản hồi từ server không đúng.");
    }
    return departmentArray;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách phòng ban:", error);
    return [];
  }
};

const fetchEmployees = async (page = 1, perPage = 10): Promise<ApiResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}?page=${page}&per_page=${perPage}`,
      {
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Phản hồi lỗi từ API:", errorData);
      throw new Error(
        `Không thể lấy danh sách nhân viên: ${response.status} ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Lỗi khi lấy danh sách nhân viên:", error);
    return { items: [], total: 0 };
  }
};

const searchEmployees = async (
  query: string,
  page = 1,
  perPage = 10
): Promise<ApiResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/search?search_query=${encodeURIComponent(
        query
      )}&page=${page}&per_page=${perPage}`,
      { headers: getAuthHeaders() }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Phản hồi lỗi từ API:", errorData);
      throw new Error(
        `Không thể tìm kiếm nhân viên: ${response.status} ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Lỗi khi tìm kiếm nhân viên:", error);
    return { items: [], total: 0 };
  }
};

const addEmployee = async (employeeData: any) => {
  try {
    console.log(
      "Request URL:",
      `${API_BASE_URL}/add`,
      "Headers:",
      getAuthHeaders(),
      "Body:",
      employeeData
    );
    const response = await fetch(`${API_BASE_URL}/add`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(employeeData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Phản hồi lỗi từ API:", errorData);
      throw new Error(
        `Không thể thêm nhân viên: ${response.status} ${
          response.statusText
        } - ${errorData?.detail || "Không có chi tiết lỗi"}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Lỗi khi thêm nhân viên:", error);
    throw error;
  }
};

const deleteEmployee = async (employeeId: number) => {
  try {
    console.log("Gửi yêu cầu xóa nhân viên với ID:", employeeId);
    console.log("Token sử dụng:", localStorage.getItem("userToken"));
    const response = await fetch(`${API_BASE_URL}/delete/${employeeId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Phản hồi lỗi từ API khi xóa nhân viên:", {
        status: response.status,
        statusText: response.statusText,
        errorData,
      });
      throw new Error(
        `Không thể xóa nhân viên: ${response.status} ${response.statusText} - ${
          errorData?.detail || "Không có chi tiết lỗi"
        }`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Lỗi khi xóa nhân viên:", error);
    throw error;
  }
};

const getEmployeeDetails = async (employeeId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/details/${employeeId}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Phản hồi lỗi từ API:", errorData);
      throw new Error(
        `Không thể lấy chi tiết nhân viên: ${response.status} ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết nhân viên:", error);
    throw error;
  }
};

const updateEmployee = async (employeeId: number, updateData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/update/${employeeId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Phản hồi lỗi từ API:", errorData);
      throw new Error(
        `Không thể cập nhật nhân viên: ${response.status} ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Lỗi khi cập nhật nhân viên:", error);
    throw error;
  }
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [newEmployee, setNewEmployee] = useState({
    FullName: "",
    Email: "",
    PhoneNumber: "",
    DateOfBirth: "",
    Gender: "",
    HireDate: new Date().toISOString().split("T")[0],
    DepartmentID: 0,
    PositionID: 0,
    Status: "Active",
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);

  const router = useRouter();
  const { t } = useLanguage();
  const { toast } = useToast();

  // Load dữ liệu
  const loadDepartments = async () => {
    try {
      const departmentData = await fetchDepartments();
      setDepartments(departmentData);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách phòng ban.",
        variant: "destructive",
      });
    }
  };

  const loadEmployees = useCallback(async () => {
    setIsLoading(true);
    try {
      let data: ApiResponse;
      if (searchTerm)
        data = await searchEmployees(searchTerm, currentPage, perPage);
      else data = await fetchEmployees(currentPage, perPage);

      console.log("Phản hồi API:", data);

      let employeeArray: Employee[] = [];
      let total = 0;
      if (Array.isArray(data)) {
        employeeArray = data;
        total = data.length;
      } else if (data?.items && Array.isArray(data.items)) {
        employeeArray = data.items;
        total = data.total || data.items.length;
      } else if (data?.data && Array.isArray(data.data)) {
        employeeArray = data.data;
        total = data.total || data.data.length;
      } else {
        console.error("Định dạng phản hồi API không mong muốn:", data);
        toast({
          title: "Lỗi",
          description: "Định dạng phản hồi từ server không đúng.",
          variant: "destructive",
        });
      }

      setEmployees(employeeArray);
      setTotalEmployees(total);
    } catch (error) {
      console.error("Không thể tải danh sách nhân viên:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách nhân viên. Vui lòng thử lại sau.",
        variant: "destructive",
      });
      setEmployees([]);
      setTotalEmployees(0);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, perPage, searchTerm, toast]);

  // Effects
  useEffect(() => {
    loadDepartments();
  }, []);

  useEffect(() => {
    setMounted(true);
    const role = localStorage.getItem("userRole");
    setUserRole(role);
    // Điều hướng chỉ khi mounted và role không hợp lệ
    if (role !== "admin" && role !== "hr-manager") {
      // Tránh lặp redirect nếu đã ở dashboard
      if (window.location.pathname !== "/dashboard") {
        window.location.href = "/dashboard";
      }
    }
  }, [router]);

  useEffect(() => {
    if (mounted && (userRole === "admin" || userRole === "hr-manager"))
      loadEmployees();
  }, [mounted, userRole, loadEmployees]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (mounted) {
        setCurrentPage(1);
        loadEmployees();
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm, mounted, loadEmployees]);

  // Event Handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(e.target.value);

  const handlePageChange = (newPage: number) => setCurrentPage(newPage);

  // Validate phone number (Vietnam format)
  const isValidPhoneNumber = (phone: string) => {
    // Cho phép +84 hoặc 0, theo chuẩn VN (9-10 số sau đầu số)
    return /^(\+84|0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/.test(
      phone.trim()
    );
  };

  const handleAddEmployee = async () => {
    if (
      !newEmployee.FullName ||
      !newEmployee.Email ||
      !newEmployee.DepartmentID ||
      !newEmployee.PositionID
    ) {
      toast({
        title: "Lỗi",
        description:
          "Vui lòng điền đầy đủ thông tin bắt buộc (Họ tên, Email, Phòng ban, Vị trí).",
        variant: "destructive",
      });
      return;
    }
    if (
      newEmployee.PhoneNumber &&
      !isValidPhoneNumber(newEmployee.PhoneNumber)
    ) {
      toast({
        title: "Lỗi",
        description:
          "Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng số điện thoại Việt Nam.",
        variant: "destructive",
      });
      return;
    }
    try {
      await addEmployee(newEmployee);
      setIsAddDialogOpen(false);
      loadEmployees();
      toast({
        title: "Đã thêm nhân viên",
        description: `${newEmployee.FullName} đã được thêm thành công`,
      });
      setNewEmployee({
        FullName: "",
        Email: "",
        PhoneNumber: "",
        DateOfBirth: "",
        Gender: "",
        HireDate: new Date().toISOString().split("T")[0],
        DepartmentID: 0,
        PositionID: 0,
        Status: "Active",
      });
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: `Không thể thêm nhân viên: ${
          error.message || "Lỗi không xác định"
        }`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteEmployee = async () => {
    if (!selectedEmployee || !selectedEmployee.EmployeeID) {
      toast({
        title: "Lỗi",
        description: "Không chọn nhân viên để xóa hoặc ID không hợp lệ.",
        variant: "destructive",
      });
      return;
    }
    try {
      console.log("Xóa nhân viên với ID:", selectedEmployee.EmployeeID);
      await deleteEmployee(selectedEmployee.EmployeeID);
      setIsDeleteDialogOpen(false);
      loadEmployees();
      toast({
        title: "Đã xóa nhân viên",
        description: `${selectedEmployee.FullName} đã được xóa khỏi hệ thống`,
        variant: "destructive",
      });
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: `Không thể xóa nhân viên: ${
          error.message || "Vui lòng kiểm tra log để biết chi tiết."
        }`,
        variant: "destructive",
      });
    }
  };

  const handleEditEmployee = async () => {
    if (!editEmployee?.EmployeeID) {
      toast({
        title: "Thiếu thông tin",
        description: "Không có ID nhân viên.",
        variant: "destructive",
      });
      return;
    }
    try {
      const updateData = {
        DepartmentID: editEmployee.DepartmentID,
        PositionID: editEmployee.PositionID,
        Status: editEmployee.Status || "Active",
      };
      await updateEmployee(editEmployee.EmployeeID, updateData);
      setIsEditDialogOpen(false);
      loadEmployees();
      toast({
        title: "Cập nhật thành công",
        description: `${editEmployee.FullName} đã được cập nhật.`,
      });
    } catch (error) {
      toast({
        title: "Lỗi cập nhật",
        description: "Không thể cập nhật nhân viên.",
        variant: "destructive",
      });
    }
  };

  const totalPages = Math.ceil(totalEmployees / perPage);

  if (!mounted || (userRole !== "admin" && userRole !== "hr-manager"))
    return null;

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          {t("employees.title")}
        </h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="mr-2 h-4 w-4" /> {t("employees.addEmployee")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-white">
                {t("employees.addEmployee")}
              </DialogTitle>
              <DialogDescription className="text-blue-300">
                Điền thông tin để thêm nhân viên mới vào hệ thống
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-blue-300">
                  Họ và Tên
                </label>
                <Input
                  id="name"
                  value={newEmployee.FullName}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, FullName: e.target.value })
                  }
                  placeholder="Nguyễn Văn A"
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
                  value={newEmployee.Email}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, Email: e.target.value })
                  }
                  placeholder="nguyenvana@example.com"
                  className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="phone" className="text-blue-300">
                  Số điện thoại
                </label>
                <Input
                  id="phone"
                  value={newEmployee.PhoneNumber}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      PhoneNumber: e.target.value,
                    })
                  }
                  placeholder="+84 123 456 789"
                  className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="dob" className="text-blue-300">
                    Ngày bắt đầu
                  </label>
                  <Input
                    id="dob"
                    type="date"
                    value={newEmployee.DateOfBirth}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        DateOfBirth: e.target.value,
                      })
                    }
                    className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="gender" className="text-blue-300">
                    Giới tính
                  </label>
                  <Select
                    value={newEmployee.Gender}
                    onValueChange={(value) =>
                      setNewEmployee({ ...newEmployee, Gender: value })
                    }
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      <SelectItem value="Male">Nam</SelectItem>
                      <SelectItem value="Female">Nữ</SelectItem>
                      <SelectItem value="Other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <label htmlFor="department" className="text-blue-300">
                  Phòng ban
                </label>
                <Select
                  value={newEmployee.DepartmentID.toString()}
                  onValueChange={(value) =>
                    setNewEmployee({
                      ...newEmployee,
                      DepartmentID: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Chọn phòng ban" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white">
                    {departments.length > 0 ? (
                      departments.map((dept) => (
                        <SelectItem
                          key={dept.DepartmentID}
                          value={dept.DepartmentID.toString()}
                        >
                          {dept.DepartmentName}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="0" disabled>
                        Không có phòng ban
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="position" className="text-blue-300">
                  Vị trí
                </label>
                <Select
                  value={newEmployee.PositionID.toString()}
                  onValueChange={(value) =>
                    setNewEmployee({
                      ...newEmployee,
                      PositionID: parseInt(value),
                    })
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
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                className="border-slate-700 text-blue-300 hover:bg-slate-800"
              >
                Hủy
              </Button>
              <Button
                onClick={handleAddEmployee}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Thêm nhân viên
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-white text-xl font-semibold text-center">
                {t("employees.editEmployee")}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-5 py-4">
              <div className="grid gap-2">
                <label
                  htmlFor="edit-name"
                  className="text-blue-400 font-medium"
                >
                  Họ và Tên
                </label>
                <Input
                  id="edit-name"
                  value={editEmployee?.FullName || ""}
                  readOnly
                  placeholder="Nguyễn Văn A"
                  className="bg-slate-800 border-slate-700 text-white cursor-not-allowed"
                />
              </div>
              <div className="grid gap-2">
                <label
                  htmlFor="edit-email"
                  className="text-blue-400 font-medium"
                >
                  Email
                </label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editEmployee?.Email || ""}
                  readOnly
                  placeholder="nguyenvana@example.com"
                  className="bg-slate-800 border-slate-700 text-white cursor-not-allowed"
                />
              </div>
              <div className="grid gap-2">
                <label
                  htmlFor="edit-phone"
                  className="text-blue-400 font-medium"
                >
                  Số điện thoại
                </label>
                <Input
                  id="edit-phone"
                  value={editEmployee?.PhoneNumber || ""}
                  readOnly
                  placeholder="+84 123 456 789"
                  className="bg-slate-800 border-slate-700 text-white cursor-not-allowed"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label
                    htmlFor="edit-dob"
                    className="text-blue-400 font-medium"
                  >
                    Ngày sinh
                  </label>
                  <Input
                    id="edit-dob"
                    type="date"
                    value={editEmployee?.DateOfBirth || ""}
                    readOnly
                    className="bg-slate-800 border-slate-700 text-white cursor-not-allowed"
                  />
                </div>
                <div className="grid gap-2">
                  <label
                    htmlFor="edit-gender"
                    className="text-blue-400 font-medium"
                  >
                    Giới tính
                  </label>
                  <Select value={editEmployee?.Gender || ""} disabled>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white cursor-not-allowed">
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      <SelectItem value="Male">Nam</SelectItem>
                      <SelectItem value="Female">Nữ</SelectItem>
                      <SelectItem value="Other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <label
                  htmlFor="edit-department"
                  className="text-blue-400 font-medium"
                >
                  Phòng ban
                </label>
                <Select
                  value={editEmployee?.DepartmentID?.toString() || ""}
                  onValueChange={(value) =>
                    setEditEmployee((prev: any) => ({
                      ...prev,
                      DepartmentID: parseInt(value),
                    }))
                  }
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Chọn phòng ban" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white">
                    {departments.length > 0 ? (
                      departments.map((dept) => (
                        <SelectItem
                          key={dept.DepartmentID}
                          value={dept.DepartmentID.toString()}
                        >
                          {dept.DepartmentName}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="0" disabled>
                        Không có phòng ban
                      </SelectItem>
                    )}
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
                  value={editEmployee?.PositionID?.toString() || ""}
                  onValueChange={(value) =>
                    setEditEmployee((prev: any) => ({
                      ...prev,
                      PositionID: parseInt(value),
                    }))
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
            </div>
            <DialogFooter className="mt-4">
              <Button
                onClick={handleEditEmployee}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition duration-200"
              >
                {t("common.save")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-0 shadow-xl bg-gradient-to-b from-slate-950 to-slate-900">
        <CardHeader className="border-b border-slate-800/50">
          <CardTitle className="text-white">{t("common.employees")}</CardTitle>
          <CardDescription className="text-blue-300">
            {t("employees.manageEmployees")}
          </CardDescription>
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
            <Select
              value={perPage.toString()}
              onValueChange={(value) => {
                setPerPage(parseInt(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[120px] bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="10 mỗi trang" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                <SelectItem value="10">10 mỗi trang</SelectItem>
                <SelectItem value="25">25 mỗi trang</SelectItem>
                <SelectItem value="50">50 mỗi trang</SelectItem>
                <SelectItem value="100">100 mỗi trang</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border border-slate-700">
            <Table>
              <TableHeader className="bg-slate-800">
                <TableRow className="hover:bg-slate-800/50 border-slate-700">
                  <TableHead className="text-blue-300">
                    {t("employees.id")}
                  </TableHead>
                  <TableHead className="text-blue-300">
                    {t("employees.name")}
                  </TableHead>
                  <TableHead className="text-blue-300">
                    {t("employees.department")}
                  </TableHead>
                  <TableHead className="text-blue-300">
                    {t("employees.jobTitle")}
                  </TableHead>
                  <TableHead className="text-blue-300">
                    {t("employees.status")}
                  </TableHead>
                  <TableHead className="text-blue-300">
                    {t("employees.joinDate")}
                  </TableHead>
                  <TableHead className="text-right text-blue-300">
                    {t("common.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow className="hover:bg-slate-800/50 border-slate-700">
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-slate-400"
                    >
                      Đang tải danh sách nhân viên...
                    </TableCell>
                  </TableRow>
                ) : !Array.isArray(employees) || employees.length === 0 ? (
                  <TableRow className="hover:bg-slate-800/50 border-slate-700">
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-slate-400"
                    >
                      Không tìm thấy nhân viên phù hợp với tiêu chí tìm kiếm
                    </TableCell>
                  </TableRow>
                ) : (
                  employees.map((employee) => (
                    <TableRow
                      key={employee.EmployeeID}
                      className="hover:bg-slate-800/50 border-slate-700"
                    >
                      <TableCell className="text-slate-300">
                        {employee.EmployeeID}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-white">
                          {employee.FullName}
                        </div>
                        <div className="text-sm text-slate-400">
                          {employee.Email}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {employee.department?.DepartmentName || "N/A"}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {employee.position?.PositionName || "N/A"}
                      </TableCell>
                      <TableCell>
                        {(() => {
                          const getBadgeClass = (status: string) =>
                            status === "Active"
                              ? "bg-green-900/20 text-green-400 border-green-800"
                              : status === "On Leave"
                              ? "bg-yellow-900/20 text-yellow-400 border-yellow-800"
                              : "bg-red-900/20 text-red-400 border-red-800";
                          const getBadgeText = (status: string) =>
                            status === "Active"
                              ? t("common.active")
                              : status === "On Leave"
                              ? t("common.onLeave")
                              : t("common.inactive");
                          return (
                            <Badge
                              variant="outline"
                              className={getBadgeClass(employee.Status)}
                            >
                              {getBadgeText(employee.Status)}
                            </Badge>
                          );
                        })()}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {employee.HireDate
                          ? new Date(employee.HireDate).toLocaleDateString()
                          : "N/A"}
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
                              <span className="sr-only">
                                {t("common.actions")}
                              </span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-slate-900 border-slate-800 text-white"
                          >
                            <DropdownMenuLabel className="text-blue-300">
                              {t("common.actions")}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-slate-800" />
                            <DropdownMenuItem
                              className="focus:bg-blue-900/50 focus:text-white"
                              onClick={() =>
                                router.push(
                                  `/dashboard/employees/${employee.EmployeeID}/details`
                                )
                              }
                            >
                              <Eye className="mr-2 h-4 w-4" />{" "}
                              {t("employees.viewDetails")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              asChild
                              className="focus:bg-blue-900/50 focus:text-white"
                            >
                              <button
                                className="flex items-center w-full px-2 py-1.5 text-sm"
                                onClick={() => {
                                  setEditEmployee(employee);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />{" "}
                                {t("employees.editEmployee")}
                              </button>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-blue-900/50 focus:text-white">
                              <DollarSign className="mr-2 h-4 w-4" />{" "}
                              {t("employees.managePayroll")}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-800" />
                            <DropdownMenuItem
                              className="text-red-400 focus:bg-red-900/50 focus:text-red-300"
                              onClick={() => {
                                setSelectedEmployee(employee);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />{" "}
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

          {totalPages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-slate-400">
                Đang hiển thị{" "}
                <span className="font-medium text-white">
                  {employees.length}
                </span>{" "}
                trong số{" "}
                <span className="font-medium text-white">{totalEmployees}</span>{" "}
                nhân viên
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0 border-slate-700 text-blue-300 hover:bg-slate-800"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Trang trước</span>
                </Button>
                <div className="text-sm text-slate-300">
                  Trang {currentPage} / {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0 border-slate-700 text-blue-300 hover:bg-slate-800"
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Trang sau</span>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Xác nhận xóa</DialogTitle>
            <DialogDescription className="text-blue-300">
              Bạn có chắc chắn muốn xóa nhân viên này? Hành động này không thể
              hoàn tác.
            </DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <div className="py-4">
              <div className="rounded-md border border-slate-700 p-4 bg-slate-800/50">
                <div className="space-y-1">
                  <p className="text-white font-medium">
                    {selectedEmployee.FullName}
                  </p>
                  <p className="text-sm text-slate-400">
                    {selectedEmployee.Email}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span>
                      {selectedEmployee.department?.DepartmentName || "N/A"}
                    </span>
                    <span>•</span>
                    <span>
                      {selectedEmployee.position?.PositionName || "N/A"}
                    </span>
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
              Hủy
            </Button>
            <Button
              onClick={handleDeleteEmployee}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Xóa nhân viên
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
