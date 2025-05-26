"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
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
  CardHeader,
  CardTitle,
  CardDescription,
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
  Plus,
  Trash2,
  Edit,
  Eye,
  ChevronLeft,
  ChevronRight,
  Send,
  Clock,
  LogIn,
  LogOut,
  Timer,
  FileText,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

// Định nghĩa interface cho Payroll
interface Payroll {
  SalaryID: number;
  EmployeeID: number;
  FullName: string;
  BaseSalary: number;
  Bonus: number;
  Deductions: number;
  NetSalary: number;
  Status: string;
}

// Định nghĩa interface cho phản hồi API
interface ApiResponse {
  items?: Payroll[];
  data?: Payroll[];
  total?: number;
}

// URL cơ bản của API
const API_BASE_URL = `${process.env.NEXT_PUBLIC_DOMAIN}/payroll`;
const NOTIFICATION_API_URL = `${process.env.NEXT_PUBLIC_DOMAIN}/notifications/email-salary-notification`;

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

// Hàm lấy danh sách lương
const fetchPayroll = async (page = 1, perPage = 10): Promise<ApiResponse> => {
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
        `Không thể lấy danh sách lương: ${response.status} ${
          response.statusText
        }${errorData?.detail ? ` - ${JSON.stringify(errorData.detail)}` : ""}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Lỗi khi lấy danh sách lương:", error);
    return { items: [], total: 0 };
  }
};

// Hàm tìm kiếm lương
const searchPayroll = async (
  query: string,
  page = 1,
  perPage = 10
): Promise<ApiResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/search?search_query=${encodeURIComponent(
        query
      )}&page=${page}&per_page=${perPage}`,
      {
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Phản hồi lỗi từ API:", errorData);
      throw new Error(
        `Không thể tìm kiếm lương: ${response.status} ${response.statusText}${
          errorData?.detail ? ` - ${JSON.stringify(errorData.detail)}` : ""
        }`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Lỗi khi tìm kiếm lương:", error);
    return { items: [], total: 0 };
  }
};

// Hàm thêm lương
const addPayroll = async (payrollData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/add`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payrollData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Phản hồi lỗi từ API:", errorData);
      throw new Error(
        `Không thể thêm lương: ${response.status} ${response.statusText}${
          errorData?.detail ? ` - ${JSON.stringify(errorData.detail)}` : ""
        }`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Lỗi khi thêm lương:", error);
    throw error;
  }
};

// Hàm xóa lương
const deletePayroll = async (payrollId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/delete/${payrollId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Phản hồi lỗi từ API:", errorData);
      throw new Error(
        `Không thể xóa lương: ${response.status} ${response.statusText}${
          errorData?.detail ? ` - ${JSON.stringify(errorData.detail)}` : ""
        }`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Lỗi khi xóa lương:", error);
    throw error;
  }
};

// Hàm cập nhật lương
const updatePayroll = async (payrollId: number, updateData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/update/${payrollId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Phản hồi lỗi từ API:", errorData);
      throw new Error(
        `Không thể cập nhật lương: ${response.status} ${response.statusText}${
          errorData?.detail ? ` - ${JSON.stringify(errorData.detail)}` : ""
        }`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Lỗi khi cập nhật lương:", error);
    throw error;
  }
};

// Hàm gửi thông báo lương qua email
const sendSalaryNotification = async (monthStr: string) => {
  try {
    const response = await fetch(
      `${NOTIFICATION_API_URL}?month_str=${encodeURIComponent(monthStr)}`,
      {
        method: "POST",
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Phản hồi lỗi từ API gửi thông báo:", errorData);
      throw new Error(
        `Không thể gửi thông báo lương: ${response.status} ${
          response.statusText
        }${errorData?.detail ? ` - ${JSON.stringify(errorData.detail)}` : ""}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Lỗi khi gửi thông báo lương:", error);
    throw error;
  }
};

export default function PayrollPage() {
  // Quản lý trạng thái
  const [payrollData, setPayrollData] = useState<Payroll[]>([]);
  const [totalPayroll, setTotalPayroll] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSendNotificationDialogOpen, setIsSendNotificationDialogOpen] =
    useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<Payroll | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [monthStr, setMonthStr] = useState("");
  const [newPayroll, setNewPayroll] = useState({
    EmployeeID: 0,
    FullName: "",
    BaseSalary: 0,
    Bonus: 0,
    Deductions: 0,
    NetSalary: 0,
    Status: "Pending",
  });
  const [editPayroll, setEditPayroll] = useState<Payroll | null>(null);
  const [isCheckInDialogOpen, setIsCheckInDialogOpen] = useState(false);
  const [isCheckOutDialogOpen, setIsCheckOutDialogOpen] = useState(false);
  const [isQuickAttendanceOpen, setIsQuickAttendanceOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const router = useRouter();
  const { t } = useLanguage();
  const { toast } = useToast();

  // Hàm tải danh sách lương
  const loadPayroll = useCallback(async () => {
    setIsLoading(true);
    try {
      let data: ApiResponse;
      if (searchTerm) {
        data = await searchPayroll(searchTerm, currentPage, perPage);
      } else {
        data = await fetchPayroll(currentPage, perPage);
      }

      console.log("Phản hồi API:", data);

      let payrollArray: Payroll[] = [];
      let total = 0;

      if (Array.isArray(data)) {
        payrollArray = data;
        total = data.length;
      } else if (data && data.items && Array.isArray(data.items)) {
        payrollArray = data.items;
        total = data.total || data.items.length;
      } else if (data && data.data && Array.isArray(data.data)) {
        payrollArray = data.data;
        total = data.total || data.data.length;
      } else {
        console.error("Định dạng phản hồi API không mong muốn:", data);
        toast({
          title: "Lỗi",
          description: "Định dạng phản hồi từ server không đúng.",
          variant: "destructive",
        });
      }

      setPayrollData(payrollArray);
      setTotalPayroll(total);
    } catch (error: any) {
      console.error("Không thể tải danh sách lương:", error);
      if (
        error.message.includes("401") ||
        error.message.includes("Thiếu token xác thực")
      ) {
        toast({
          title: "Lỗi Xác Thực",
          description: "Vui lòng đăng nhập để truy cập dữ liệu lương.",
          variant: "destructive",
        });
        router.push("/login");
      } else if (error.message.includes("404")) {
        toast({
          title: "Lỗi",
          description:
            "Không tìm thấy endpoint API lương. Vui lòng kiểm tra cấu hình server.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Lỗi",
          description: `Không thể tải danh sách lương: ${error.message}`,
          variant: "destructive",
        });
      }
      setPayrollData([]);
      setTotalPayroll(0);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, perPage, searchTerm, toast, router]);

  // Tải ban đầu
  useEffect(() => {
    setMounted(true);
    const role = localStorage.getItem("userRole");
    setUserRole(role);
    if (role !== "admin" && role !== "payroll-manager") {
      router.push("/dashboard");
    }
  }, [router]);

  // Tải lương khi dependencies thay đổi
  useEffect(() => {
    if (mounted && (userRole === "admin" || userRole === "payroll-manager")) {
      loadPayroll();
    }
  }, [mounted, userRole, loadPayroll]);

  // Xử lý tìm kiếm với độ trễ
  useEffect(() => {
    const handler = setTimeout(() => {
      if (mounted) {
        setCurrentPage(1);
        loadPayroll();
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm, mounted, loadPayroll]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlerSendNotification = async () => {
    if (!monthStr) {
      toast({
        title: "Lỗi",
        description:
          "Vui lòng nhập tháng để gửi thông báo (định dạng YYYY-MM hoặc YYYY-MM-DD).",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await sendSalaryNotification(monthStr);
      setIsSendNotificationDialogOpen(false);
      setMonthStr("");
      toast({
        title: "Thành công",
        description: `Thông báo lương cho tháng ${monthStr} đã được gửi thành công.`,
      });
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: `Không thể gửi thông báo lương: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleAddPayroll = async () => {
    if (
      newPayroll.EmployeeID &&
      newPayroll.FullName &&
      newPayroll.BaseSalary >= 0
    ) {
      try {
        const payrollData = {
          ...newPayroll,
          NetSalary:
            newPayroll.BaseSalary + newPayroll.Bonus - newPayroll.Deductions,
        };
        await addPayroll(payrollData);
        setIsAddDialogOpen(false);
        loadPayroll();
        toast({
          title: "Đã thêm lương",
          description: `Lương cho ${newPayroll.FullName} đã được thêm thành công`,
        });
        setNewPayroll({
          EmployeeID: 0,
          FullName: "",
          BaseSalary: 0,
          Bonus: 0,
          Deductions: 0,
          NetSalary: 0,
          Status: "Pending",
        });
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể thêm lương",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive",
      });
    }
  };

  const handleDeletePayroll = async () => {
    if (selectedPayroll) {
      try {
        await deletePayroll(selectedPayroll.SalaryID);
        setIsDeleteDialogOpen(false);
        loadPayroll();
        toast({
          title: "Đã xóa lương",
          description: `Lương của ${selectedPayroll.FullName} đã được xóa`,
          variant: "destructive",
        });
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể xóa lương",
          variant: "destructive",
        });
      }
    }
  };

  const handleEditPayroll = async () => {
    if (editPayroll?.SalaryID) {
      try {
        const updateData = {
          Bonus: editPayroll.Bonus,
          Deductions: editPayroll.Deductions,
          Status: editPayroll.Status,
          NetSalary:
            editPayroll.BaseSalary + editPayroll.Bonus - editPayroll.Deductions,
        };
        await updatePayroll(editPayroll.SalaryID, updateData);
        setIsEditDialogOpen(false);
        loadPayroll();
        toast({
          title: "Cập nhật thành công",
          description: `Lương của ${editPayroll.FullName} đã được cập nhật`,
        });
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể cập nhật lương",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy ID lương để cập nhật",
        variant: "destructive",
      });
    }
  };

  const handleCheckIn = async () => {
    try {
      toast({
        title: "Chấm công vào thành công",
        description: `Đã ghi nhận thời gian vào làm lúc ${currentTime.toLocaleTimeString(
          "vi-VN"
        )}`,
      });
      setIsCheckInDialogOpen(false);
    } catch (error) {
      toast({
        title: "Lỗi chấm công",
        description: "Không thể thực hiện chấm công vào. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  const handleCheckOut = async () => {
    try {
      toast({
        title: "Chấm công ra thành công",
        description: `Đã ghi nhận thời gian ra về lúc ${currentTime.toLocaleTimeString(
          "vi-VN"
        )}`,
      });
      setIsCheckOutDialogOpen(false);
    } catch (error) {
      toast({
        title: "Lỗi chấm công",
        description: "Không thể thực hiện chấm công ra. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  const handleQuickAttendance = async (type: "in" | "out") => {
    try {
      const message = type === "in" ? "vào làm" : "ra về";
      toast({
        title: `Chấm công ${message} nhanh thành công`,
        description: `Đã ghi nhận thời gian ${message} lúc ${currentTime.toLocaleTimeString(
          "vi-VN"
        )}`,
      });
      setIsQuickAttendanceOpen(false);
    } catch (error) {
      toast({
        title: "Lỗi chấm công nhanh",
        description: "Không thể thực hiện chấm công nhanh. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  // Cập nhật thời gian thực
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const totalPages = Math.ceil(totalPayroll / perPage);

  if (!mounted || (userRole !== "admin" && userRole !== "payroll-manager")) {
    return null;
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Quản Lý Lương
        </h1>
        <div className="flex gap-3">
          {/* Quick Attendance Button */}
          <Dialog
            open={isQuickAttendanceOpen}
            onOpenChange={setIsQuickAttendanceOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Timer className="mr-2 h-4 w-4" /> Chấm công nhanh
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800">
              <DialogHeader>
                <DialogTitle className="text-white">
                  Chấm công nhanh
                </DialogTitle>
                <DialogDescription className="text-blue-300">
                  Chọn loại chấm công để thực hiện nhanh
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="text-center space-y-4">
                  <div className="text-2xl font-bold text-white">
                    {currentTime.toLocaleTimeString("vi-VN")}
                  </div>
                  <div className="text-blue-300">
                    {currentTime.toLocaleDateString("vi-VN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
              <DialogFooter className="flex gap-2">
                <Button
                  onClick={() => handleQuickAttendance("in")}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <LogIn className="mr-2 h-4 w-4" /> Vào làm
                </Button>
                <Button
                  onClick={() => handleQuickAttendance("out")}
                  className="flex-1 bg-orange-600 hover:bg-orange-700"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Ra về
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Check In Button */}
          <Dialog
            open={isCheckInDialogOpen}
            onOpenChange={setIsCheckInDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <LogIn className="mr-2 h-4 w-4" /> Chấm công vào
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800">
              <DialogHeader>
                <DialogTitle className="text-white">
                  Chấm công vào làm
                </DialogTitle>
                <DialogDescription className="text-blue-300">
                  Xác nhận thời gian bắt đầu làm việc hôm nay
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="text-center space-y-4">
                  <div className="text-3xl font-bold text-white">
                    {currentTime.toLocaleTimeString("vi-VN")}
                  </div>
                  <div className="text-blue-300">
                    {currentTime.toLocaleDateString("vi-VN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCheckInDialogOpen(false)}
                  className="border-slate-700 text-blue-300 hover:bg-slate-800"
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleCheckIn}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Clock className="mr-2 h-4 w-4" /> Xác nhận vào làm
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Check Out Button */}
          <Dialog
            open={isCheckOutDialogOpen}
            onOpenChange={setIsCheckOutDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-orange-600 hover:bg-orange-700">
                <LogOut className="mr-2 h-4 w-4" /> Chấm công ra
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800">
              <DialogHeader>
                <DialogTitle className="text-white">
                  Chấm công ra về
                </DialogTitle>
                <DialogDescription className="text-blue-300">
                  Xác nhận thời gian kết thúc làm việc hôm nay
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="text-center space-y-4">
                  <div className="text-3xl font-bold text-white">
                    {currentTime.toLocaleTimeString("vi-VN")}
                  </div>
                  <div className="text-blue-300">
                    {currentTime.toLocaleDateString("vi-VN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="text-sm text-slate-400 mb-1">
                      Thời gian làm việc hôm nay
                    </div>
                    <div className="text-lg font-semibold text-white">
                      8 giờ 30 phút
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCheckOutDialogOpen(false)}
                  className="border-slate-700 text-blue-300 hover:bg-slate-800"
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleCheckOut}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Clock className="mr-2 h-4 w-4" /> Xác nhận ra về
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Attendance Report Button */}
          <Button
            className="bg-cyan-600 hover:bg-cyan-700"
            onClick={() => router.push("/dashboard/payroll/attendance-page")}
          >
            <FileText className="mr-2 h-4 w-4" /> Báo cáo chấm công
          </Button>

          <Dialog
            open={isSendNotificationDialogOpen}
            onOpenChange={setIsSendNotificationDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Send className="mr-2 h-4 w-4" />
                Gửi Thông Báo Lương
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800">
              <DialogHeader>
                <DialogTitle className="text-white">
                  Gửi Thông Báo Lương
                </DialogTitle>
                <DialogDescription className="text-blue-300">
                  Nhập tháng để gửi thông báo lương qua email cho tất cả nhân
                  viên.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="monthStr" className="text-blue-300">
                    Tháng (YYYY-MM hoặc YYYY-MM-DD)
                  </label>
                  <Input
                    id="monthStr"
                    value={monthStr}
                    onChange={(e) => setMonthStr(e.target.value)}
                    placeholder="Ví dụ: 2025-05 hoặc 2025-05-01"
                    className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsSendNotificationDialogOpen(false);
                    setMonthStr("");
                  }}
                  className="border-slate-700 text-blue-300 hover:bg-slate-800"
                >
                  Hủy
                </Button>
                <Button
                  onClick={handlerSendNotification}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Gửi Thông Báo
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Thêm Lương
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800">
              <DialogHeader>
                <DialogTitle className="text-white">Thêm Lương</DialogTitle>
                <DialogDescription className="text-blue-300">
                  Điền thông tin để thêm bản ghi lương mới
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="employeeId" className="text-blue-300">
                    Mã Nhân Viên
                  </label>
                  <Input
                    id="employeeId"
                    type="number"
                    value={newPayroll.EmployeeID}
                    onChange={(e) =>
                      setNewPayroll({
                        ...newPayroll,
                        EmployeeID: Number.parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="Nhập mã nhân viên"
                    className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="fullName" className="text-blue-300">
                    Họ và Tên
                  </label>
                  <Input
                    id="fullName"
                    value={newPayroll.FullName}
                    onChange={(e) =>
                      setNewPayroll({ ...newPayroll, FullName: e.target.value })
                    }
                    placeholder="Nguyễn Văn A"
                    className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="baseSalary" className="text-blue-300">
                    Lương Cơ Bản (VND)
                  </label>
                  <Input
                    id="baseSalary"
                    type="number"
                    value={newPayroll.BaseSalary}
                    onChange={(e) =>
                      setNewPayroll({
                        ...newPayroll,
                        BaseSalary: Number.parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="Nhập lương cơ bản"
                    className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="bonus" className="text-blue-300">
                    Thưởng (VND)
                  </label>
                  <Input
                    id="bonus"
                    type="number"
                    value={newPayroll.Bonus}
                    onChange={(e) =>
                      setNewPayroll({
                        ...newPayroll,
                        Bonus: Number.parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="Nhập số tiền thưởng"
                    className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="deductions" className="text-blue-300">
                    Khấu Trừ (VND)
                  </label>
                  <Input
                    id="deductions"
                    type="number"
                    value={newPayroll.Deductions}
                    onChange={(e) =>
                      setNewPayroll({
                        ...newPayroll,
                        Deductions: Number.parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="Nhập số tiền khấu trừ"
                    className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="status" className="text-blue-300">
                    Trạng Thái
                  </label>
                  <Select
                    value={newPayroll.Status}
                    onValueChange={(value) =>
                      setNewPayroll({ ...newPayroll, Status: value })
                    }
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      <SelectItem value="Pending">Chờ xử lý</SelectItem>
                      <SelectItem value="Paid">Đã thanh toán</SelectItem>
                      <SelectItem value="On Hold">Tạm hoãn</SelectItem>
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
                  onClick={handleAddPayroll}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Thêm Lương
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="border-0 shadow-xl bg-gradient-to-b from-slate-950 to-slate-900">
        <CardHeader className="border-b border-slate-800/50">
          <CardTitle className="text-white">Danh Sách Lương</CardTitle>
          <CardDescription className="text-blue-300">
            Quản lý thông tin lương của nhân viên
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-blue-400" />
              <Input
                type="search"
                placeholder="Tìm kiếm nhân viên..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-8 bg-slate-800 border-slate-700 text-white focus:border-blue-500"
              />
            </div>
            <Select
              value={perPage.toString()}
              onValueChange={(value) => {
                setPerPage(Number.parseInt(value));
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
                  <TableHead className="text-blue-300">Mã Lương</TableHead>
                  <TableHead className="text-blue-300">Nhân Viên</TableHead>
                  <TableHead className="text-blue-300">Lương Cơ Bản</TableHead>
                  <TableHead className="text-blue-300">Thưởng</TableHead>
                  <TableHead className="text-blue-300">Khấu Trừ</TableHead>
                  <TableHead className="text-blue-300">Lương Ròng</TableHead>
                  <TableHead className="text-blue-300">Trạng Thái</TableHead>
                  <TableHead className="text-right text-blue-300">
                    Hành Động
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow className="hover:bg-slate-800/50 border-slate-700">
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-slate-400"
                    >
                      Đang tải danh sách lương...
                    </TableCell>
                  </TableRow>
                ) : !Array.isArray(payrollData) || payrollData.length === 0 ? (
                  <TableRow className="hover:bg-slate-800/50 border-slate-700">
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-slate-400"
                    >
                      Không tìm thấy dữ liệu lương phù hợp với tiêu chí tìm kiếm
                    </TableCell>
                  </TableRow>
                ) : (
                  payrollData.map((payroll) => (
                    <TableRow
                      key={payroll.SalaryID}
                      className="hover:bg-slate-800/50 border-slate W-700"
                    >
                      <TableCell className="text-slate-300">
                        {payroll.SalaryID}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-white">
                          {payroll.FullName || "N/A"}
                        </div>
                        <div className="text-sm text-slate-400">
                          {payroll.EmployeeID}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {payroll.BaseSalary
                          ? payroll.BaseSalary.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {payroll.Bonus
                          ? payroll.Bonus.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {payroll.Deductions
                          ? payroll.Deductions.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })
                          : "N/A"}
                      </TableCell>
                      <TableCell className="font-medium text-white">
                        {payroll.NetSalary
                          ? payroll.NetSalary.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            payroll.Status === "Paid"
                              ? "bg-green-900/20 text-green-400 border-green-800"
                              : payroll.Status === "Pending"
                              ? "bg-yellow-900/20 text-yellow-400 border-yellow-800"
                              : "bg-red-900/20 text-red-400 border-red-800"
                          }
                        >
                          {payroll.Status === "Paid"
                            ? "Đã thanh toán"
                            : payroll.Status === "Pending"
                            ? "Chờ xử lý"
                            : "Tạm hoãn"}
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
                              <span className="sr-only">Hành động</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-slate-900 border-slate-800 text-white"
                          >
                            <DropdownMenuLabel className="text-blue-300">
                              Hành động
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-slate-800" />
                            <DropdownMenuItem
                              className="focus:bg-blue-900/50 focus:text-white"
                              onClick={() =>
                                router.push(
                                  `/dashboard/payroll/${payroll.SalaryID}/details`
                                )
                              }
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              asChild
                              className="focus:bg-blue-900/50 focus:text-white"
                            >
                              <button
                                className="flex items-center w-full px-2 py-1.5 text-sm"
                                onClick={() => {
                                  setEditPayroll(payroll);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Chỉnh sửa lương
                              </button>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-800" />
                            <DropdownMenuItem
                              className="text-red-400 focus:bg-red-900/50 focus:text-red-300"
                              onClick={() => {
                                setSelectedPayroll(payroll);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa lương
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

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800">
              <DialogHeader>
                <DialogTitle className="text-white">
                  Chỉnh Sửa Lương
                </DialogTitle>
                <DialogDescription className="text-blue-300">
                  Cập nhật thông tin lương cho{" "}
                  {editPayroll?.FullName || "nhân viên"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="edit-bonus" className="text-blue-300">
                    Thưởng (VND)
                  </label>
                  <Input
                    id="edit-bonus"
                    type="number"
                    value={editPayroll?.Bonus || 0}
                    onChange={(e) =>
                      setEditPayroll((prev: any) => ({
                        ...prev,
                        Bonus: Number.parseFloat(e.target.value) || 0,
                      }))
                    }
                    placeholder="Nhập số tiền thưởng"
                    className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="edit-deductions" className="text-blue-300">
                    Khấu Trừ (VND)
                  </label>
                  <Input
                    id="edit-deductions"
                    type="number"
                    value={editPayroll?.Deductions || 0}
                    onChange={(e) =>
                      setEditPayroll((prev: any) => ({
                        ...prev,
                        Deductions: Number.parseFloat(e.target.value) || 0,
                      }))
                    }
                    placeholder="Nhập số tiền khấu trừ"
                    className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="edit-status" className="text-blue-300">
                    Trạng Thái
                  </label>
                  <Select
                    value={editPayroll?.Status || ""}
                    onValueChange={(value) =>
                      setEditPayroll((prev: any) => ({
                        ...prev,
                        Status: value,
                      }))
                    }
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      <SelectItem value="Pending">Chờ xử lý</SelectItem>
                      <SelectItem value="Paid">Đã thanh toán</SelectItem>
                      <SelectItem value="On Hold">Tạm hoãn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="border-slate-700 text-blue-300 hover:bg-slate-800"
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleEditPayroll}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Lưu
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800">
              <DialogHeader>
                <DialogTitle className="text-white">Xác nhận xóa</DialogTitle>
                <DialogDescription className="text-blue-300">
                  Bạn có chắc chắn muốn xóa bản ghi lương này? Hành động này
                  không thể hoàn tác.
                </DialogDescription>
              </DialogHeader>
              {selectedPayroll && (
                <div className="py-4">
                  <div className="rounded-md border border-slate-700 p-4 bg-slate-800/50">
                    <div className="space-y-1">
                      <p className="text-white font-medium">
                        {selectedPayroll.FullName}
                      </p>
                      <p className="text-sm text-slate-400">
                        Mã Lương: {selectedPayroll.SalaryID}
                      </p>
                      <p className="text-sm text-slate-400">
                        Lương Ròng:{" "}
                        {selectedPayroll.NetSalary.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
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
                  Hủy
                </Button>
                <Button
                  onClick={handleDeletePayroll}
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa Lương
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {totalPages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-slate-400">
                Đang hiển thị{" "}
                <span className="font-medium text-white">
                  {payrollData.length}
                </span>{" "}
                trong số{" "}
                <span className="font-medium text-white">{totalPayroll}</span>{" "}
                bản ghi lương
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
    </motion.div>
  );
}
