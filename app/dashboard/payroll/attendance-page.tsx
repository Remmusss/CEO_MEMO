"use client";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Clock,
  Calendar,
  Users,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Coffee,
  TrendingUp,
  LogIn,
  LogOut,
  Timer,
  MapPin,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/language-context";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

// Định nghĩa interface cho dữ liệu chấm công
interface AttendanceRecord {
  AttendanceID: number;
  EmployeeID: number;
  AttendanceMonth: string;
  WorkDays: number;
  AbsentDays: number;
  LeaveDays: number;
  CreatedAt: string;
  employee: {
    EmployeeID: number;
    FullName: string;
    DepartmentID: number;
    PositionID: number;
    Status: string;
    department: {
      DepartmentID: number;
      DepartmentName: string;
    };
    position: {
      PositionName: string;
      PositionID: number;
    };
  };
}

interface AttendanceApiResponse {
  status: string;
  message: string;
  data: AttendanceRecord[];
  metadata: any;
}

// URL API
const ATTENDANCE_API_URL = `${process.env.NEXT_PUBLIC_DOMAIN}/payroll/attendance`;

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
const fetchAttendanceRecords = async (
  page = 1,
  perPage = 10,
  searchDate?: string,
  employeeId?: number
): Promise<AttendanceApiResponse> => {
  try {
    let url = `${ATTENDANCE_API_URL}?page=${page}&per_page=${perPage}`;
    if (searchDate) url += `&search_date=${searchDate}`;
    if (employeeId) url += `&employee_id=${employeeId}`;

    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Phản hồi lỗi từ API:", errorData);
      throw new Error(
        `Không thể lấy dữ liệu chấm công: ${response.status} ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu chấm công:", error);
    return { status: "error", message: "Lỗi kết nối", data: [], metadata: {} };
  }
};

// Component chính
export default function AttendancePage() {
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchDate, setSearchDate] = useState("");
  const [searchEmployeeId, setSearchEmployeeId] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckInDialogOpen, setIsCheckInDialogOpen] = useState(false);
  const [isCheckOutDialogOpen, setIsCheckOutDialogOpen] = useState(false);
  const [isQuickAttendanceOpen, setIsQuickAttendanceOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [isOnline, setIsOnline] = useState(true);
  const [selectedEmployee, setSelectedEmployee] =
    useState<AttendanceRecord | null>(null);

  const router = useRouter();
  const { t } = useLanguage();
  const { toast } = useToast();

  // Load dữ liệu chấm công
  const loadAttendanceRecords = useCallback(async () => {
    setIsLoading(true);
    try {
      const employeeId = searchEmployeeId
        ? Number.parseInt(searchEmployeeId)
        : undefined;
      const data = await fetchAttendanceRecords(
        currentPage,
        perPage,
        searchDate,
        employeeId
      );

      if (data.status === "success") {
        setAttendanceRecords(data.data || []);
      } else {
        toast({
          title: "Lỗi",
          description: data.message || "Không thể tải dữ liệu chấm công",
          variant: "destructive",
        });
        setAttendanceRecords([]);
      }
    } catch (error) {
      console.error("Không thể tải dữ liệu chấm công:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu chấm công. Vui lòng thử lại sau.",
        variant: "destructive",
      });
      setAttendanceRecords([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, perPage, searchDate, searchEmployeeId, toast]);

  // Effects
  useEffect(() => {
    setMounted(true);
    const role = localStorage.getItem("userRole");
    setUserRole(role);
    if (role !== "admin" && role !== "hr-manager") {
      router.push("/dashboard");
    }
  }, [router]);

  useEffect(() => {
    if (mounted && (userRole === "admin" || userRole === "hr-manager")) {
      loadAttendanceRecords();
    }
  }, [mounted, userRole, loadAttendanceRecords]);

  // Cập nhật thời gian thực
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Kiểm tra trạng thái online
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Event Handlers
  const handlePageChange = (newPage: number) => setCurrentPage(newPage);

  const handleCheckIn = async () => {
    try {
      // Lấy vị trí hiện tại
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        });
      }

      // Simulate check-in API call
      toast({
        title: "Chấm công vào thành công",
        description: `Đã ghi nhận thời gian vào làm lúc ${currentTime.toLocaleTimeString(
          "vi-VN"
        )}`,
      });
      setIsCheckInDialogOpen(false);
      loadAttendanceRecords();
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
      loadAttendanceRecords();
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
      loadAttendanceRecords();
    } catch (error) {
      toast({
        title: "Lỗi chấm công nhanh",
        description: "Không thể thực hiện chấm công nhanh. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  // Tính toán thống kê
  const totalRecords = attendanceRecords.length;
  const totalWorkDays = attendanceRecords.reduce(
    (sum, record) => sum + record.WorkDays,
    0
  );
  const totalAbsentDays = attendanceRecords.reduce(
    (sum, record) => sum + record.AbsentDays,
    0
  );
  const totalLeaveDays = attendanceRecords.reduce(
    (sum, record) => sum + record.LeaveDays,
    0
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Đang làm việc":
        return (
          <Badge className="bg-green-900/20 text-green-400 border-green-800">
            Đang làm việc
          </Badge>
        );
      case "Tạm nghỉ":
        return (
          <Badge className="bg-yellow-900/20 text-yellow-400 border-yellow-800">
            Tạm nghỉ
          </Badge>
        );
      case "Nghỉ việc":
        return (
          <Badge className="bg-red-900/20 text-red-400 border-red-800">
            Nghỉ việc
          </Badge>
        );
      case "Nghỉ thai sản":
        return (
          <Badge className="bg-blue-900/20 text-blue-400 border-blue-800">
            Nghỉ thai sản
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-900/20 text-gray-400 border-gray-800">
            {status}
          </Badge>
        );
    }
  };

  if (!mounted || (userRole !== "admin" && userRole !== "hr-manager")) {
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
          Quản lý chấm công
        </h1>
        <div className="flex gap-3">
          {/* Quick Attendance Button */}
          <Dialog
            open={isQuickAttendanceOpen}
            onOpenChange={setIsQuickAttendanceOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
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
                  <div className="flex items-center justify-center gap-2 text-sm">
                    {isOnline ? (
                      <>
                        <Wifi className="h-4 w-4 text-green-400" />
                        <span className="text-green-400">Đang kết nối</span>
                      </>
                    ) : (
                      <>
                        <WifiOff className="h-4 w-4 text-red-400" />
                        <span className="text-red-400">Mất kết nối</span>
                      </>
                    )}
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
                  {location && (
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                      <MapPin className="h-4 w-4" />
                      <span>
                        Vị trí: {location.lat.toFixed(4)},{" "}
                        {location.lng.toFixed(4)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-center gap-2 text-sm">
                    {isOnline ? (
                      <>
                        <Wifi className="h-4 w-4 text-green-400" />
                        <span className="text-green-400">Kết nối ổn định</span>
                      </>
                    ) : (
                      <>
                        <WifiOff className="h-4 w-4 text-red-400" />
                        <span className="text-red-400">Mất kết nối mạng</span>
                      </>
                    )}
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
                  disabled={!isOnline}
                >
                  <CheckCircle className="mr-2 h-4 w-4" /> Xác nhận vào làm
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
                  disabled={!isOnline}
                >
                  <CheckCircle className="mr-2 h-4 w-4" /> Xác nhận ra về
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Thống kê thời gian thực */}
      <Card className="border-0 shadow-xl bg-gradient-to-b from-slate-950 to-slate-900">
        <CardHeader className="border-b border-slate-800/50">
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-400" />
            Thời gian thực
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {currentTime.toLocaleTimeString("vi-VN")}
              </div>
              <p className="text-sm text-slate-400">Thời gian hiện tại</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">08:30</div>
              <p className="text-sm text-slate-400">Giờ vào làm</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">17:30</div>
              <p className="text-sm text-slate-400">Giờ ra về</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Thống kê tổng quan */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-xl bg-gradient-to-b from-slate-950 to-slate-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-300">
              Tổng nhân viên
            </CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalRecords}</div>
            <p className="text-xs text-slate-400">Đang theo dõi chấm công</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-b from-slate-950 to-slate-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-300">
              Tổng ngày làm việc
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalWorkDays}</div>
            <p className="text-xs text-slate-400">Ngày trong tháng</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-b from-slate-950 to-slate-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-300">
              Tổng ngày vắng
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {totalAbsentDays}
            </div>
            <p className="text-xs text-slate-400">Ngày vắng mặt</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-b from-slate-950 to-slate-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-300">
              Tổng ngày nghỉ phép
            </CardTitle>
            <Coffee className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {totalLeaveDays}
            </div>
            <p className="text-xs text-slate-400">Ngày nghỉ có phép</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-xl bg-gradient-to-b from-slate-950 to-slate-900">
        <CardHeader className="border-b border-slate-800/50">
          <CardTitle className="text-white">Bảng chấm công</CardTitle>
          <CardDescription className="text-blue-300">
            Theo dõi và quản lý chấm công nhân viên
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-blue-400" />
              <Input
                type="search"
                placeholder="Tìm kiếm theo ID nhân viên..."
                value={searchEmployeeId}
                onChange={(e) => setSearchEmployeeId(e.target.value)}
                className="pl-8 bg-slate-800 border-slate-700 text-white focus:border-blue-500"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-blue-400" />
              <Input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
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
                  <TableHead className="text-blue-300">ID</TableHead>
                  <TableHead className="text-blue-300">Nhân viên</TableHead>
                  <TableHead className="text-blue-300">Phòng ban</TableHead>
                  <TableHead className="text-blue-300">Chức vụ</TableHead>
                  <TableHead className="text-blue-300">Trạng thái</TableHead>
                  <TableHead className="text-blue-300">Tháng</TableHead>
                  <TableHead className="text-blue-300">Ngày làm việc</TableHead>
                  <TableHead className="text-blue-300">Ngày vắng</TableHead>
                  <TableHead className="text-blue-300">
                    Ngày nghỉ phép
                  </TableHead>
                  <TableHead className="text-blue-300">Hiệu suất</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow className="hover:bg-slate-800/50 border-slate-700">
                    <TableCell
                      colSpan={10}
                      className="text-center py-8 text-slate-400"
                    >
                      Đang tải dữ liệu chấm công...
                    </TableCell>
                  </TableRow>
                ) : attendanceRecords.length === 0 ? (
                  <TableRow className="hover:bg-slate-800/50 border-slate-700">
                    <TableCell
                      colSpan={10}
                      className="text-center py-8 text-slate-400"
                    >
                      Không tìm thấy dữ liệu chấm công
                    </TableCell>
                  </TableRow>
                ) : (
                  attendanceRecords.map((record) => {
                    const totalDays =
                      record.WorkDays + record.AbsentDays + record.LeaveDays;
                    const efficiency =
                      totalDays > 0
                        ? ((record.WorkDays / totalDays) * 100).toFixed(1)
                        : "0";

                    return (
                      <TableRow
                        key={record.AttendanceID}
                        className="hover:bg-slate-800/50 border-slate-700"
                      >
                        <TableCell className="text-slate-300">
                          {record.employee.EmployeeID}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-white">
                            {record.employee.FullName}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {record.employee.department.DepartmentName}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {record.employee.position.PositionName}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(record.employee.Status)}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {new Date(record.AttendanceMonth).toLocaleDateString(
                            "vi-VN",
                            {
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span className="text-green-400 font-medium">
                              {record.WorkDays}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <XCircle className="h-4 w-4 text-red-400" />
                            <span className="text-red-400 font-medium">
                              {record.AbsentDays}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Coffee className="h-4 w-4 text-yellow-400" />
                            <span className="text-yellow-400 font-medium">
                              {record.LeaveDays}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-blue-400" />
                            <span
                              className={`font-medium ${
                                Number.parseFloat(efficiency) >= 90
                                  ? "text-green-400"
                                  : Number.parseFloat(efficiency) >= 75
                                  ? "text-yellow-400"
                                  : "text-red-400"
                              }`}
                            >
                              {efficiency}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {attendanceRecords.length > 0 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-slate-400">
                Đang hiển thị{" "}
                <span className="font-medium text-white">
                  {attendanceRecords.length}
                </span>{" "}
                bản ghi chấm công
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
                  Trang {currentPage}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={attendanceRecords.length < perPage}
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
