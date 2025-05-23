"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  FileText,
  BarChart4,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  RotateCcw,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  Area,
  AreaChart,
  LineChart,
  Line,
} from "@/components/ui/chart";
import { useLanguage } from "@/lib/i18n/language-context";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";

// Định nghĩa interface dựa trên dữ liệu API
interface DepartmentAllocation {
  department_id: number;
  department_name: string;
  employee_count: number;
  percentage: number;
}

interface PositionAllocation {
  position_id: number;
  position_name: string;
  employee_count: number;
  percentage: number;
}

interface StatusAllocation {
  status: string;
  employee_count: number;
  percentage: number;
}

interface HRReportData {
  total_employees: number;
  department_allocation: DepartmentAllocation[];
  position_allocation: PositionAllocation[];
  status_allocation: StatusAllocation[];
}

interface HRReport {
  status: string;
  message: string;
  data: HRReportData;
  metadata: Record<string, any>;
}

interface DepartmentAnalysis {
  department_id: number;
  department_name: string;
  total_salary_department_count: number;
  total_salary: number;
  average_salary: number;
  budget_percentage: number;
}

interface PayrollReportData {
  report_period: string;
  total_budget: number;
  average_salary: number;
  total_salary_count: number;
  department_analysis: DepartmentAnalysis[];
}

interface PayrollReport {
  status: string;
  message: string;
  data: PayrollReportData;
  metadata: Record<string, any>;
}

interface EmployeeWithShares {
  employee_id: number;
  employee_name: string;
  department: string;
  position: string;
  total_dividend: number;
  dividend_count: number;
  percentage: number;
}

interface DividendReportData {
  report_period: string;
  total_dividend_paid: number;
  employee_count: number;
  employees_with_shares: EmployeeWithShares[];
}

interface DividendReport {
  status: string;
  message: string;
  data: DividendReportData;
  metadata: Record<string, any>;
}

// Thêm interface cho các props của formatter
interface TooltipFormatterProps {
  payload?: {
    department_name?: string;
    employee_name?: string;
    status?: string;
    percentage?: number;
    budget_percentage?: number;
    [key: string]: any;
  };
  [key: string]: any;
}

// Thêm interface cho các props của Legend formatter
interface LegendFormatterProps {
  payload?: {
    department_name?: string;
    employee_name?: string;
    status?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

// Format numbers to be more concise (K for thousands, M for millions)
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  } else {
    return num.toString();
  }
};

// Gradient colors for charts
const CHART_COLORS = {
  blue: ["#3b82f6", "#1d4ed8"],
  green: ["#10b981", "#047857"],
  purple: ["#8b5cf6", "#6d28d9"],
  orange: ["#f97316", "#c2410c"],
  yellow: ["#f59e0b", "#b45309"],
  red: ["#ef4444", "#b91c1c"],
  pink: ["#ec4899", "#be185d"],
  indigo: ["#6366f1", "#4338ca"],
  teal: ["#14b8a6", "#0f766e"],
  cyan: ["#06b6d4", "#0e7490"],
};

// Enhanced color palette for pie charts
const PIE_COLORS = [
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // yellow
  "#ef4444", // red
  "#8b5cf6", // purple
  "#06b6d4", // cyan
  "#ec4899", // pink
  "#f97316", // orange
  "#22c55e", // emerald
  "#a855f7", // violet
  "#0ea5e9", // sky
  "#14b8a6", // teal
  "#f43f5e", // rose
  "#84cc16", // lime
  "#6366f1", // indigo
];

// Custom tooltip styles
const tooltipStyle = {
  backgroundColor: "rgba(17, 24, 39, 0.95)",
  borderColor: "#374151",
  borderRadius: "6px",
  boxShadow:
    "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
  color: "#f9fafb",
  padding: "12px",
};

export default function ReportsPage() {
  const [reportType, setReportType] = useState("hr");
  const [timeRange, setTimeRange] = useState("6months");
  const [chartType, setChartType] = useState("bar");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [hrReport, setHrReport] = useState<HRReport | null>(null);
  const [payrollReport, setPayrollReport] = useState<PayrollReport | null>(
    null
  );
  const [dividendReport, setDividendReport] = useState<DividendReport | null>(
    null
  );

  const router = useRouter();
  const { t } = useLanguage();

  const getAuthHeaders = () => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      throw new Error("Thiếu token xác thực");
    }
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchHrReport = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/reports/hr`,
        {
          headers: getAuthHeaders(),
        }
      );
      if (response.status === 401) {
        setError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
        localStorage.removeItem("userToken");
        router.push("/login");
        return;
      }
      if (response.status === 422) {
        const errorData = await response.json();
        throw new Error(
          `Lỗi xác thực: ${errorData.detail[0]?.msg || "Dữ liệu không hợp lệ"}`
        );
      }
      if (!response.ok) {
        throw new Error(`Lỗi: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setHrReport(data);
    } catch (err: any) {
      console.error("Lỗi khi tải báo cáo HR:", err);
      setError(err.message || "Không thể tải báo cáo HR");
    }
  };

  const fetchPayrollReport = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/reports/payroll`,
        {
          headers: getAuthHeaders(),
        }
      );
      if (response.status === 401) {
        setError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
        localStorage.removeItem("userToken");
        router.push("/login");
        return;
      }
      if (response.status === 422) {
        const errorData = await response.json();
        throw new Error(
          `Lỗi xác thực: ${errorData.detail[0]?.msg || "Dữ liệu không hợp lệ"}`
        );
      }
      if (!response.ok) {
        throw new Error(`Lỗi: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Fetched Payroll Report:", JSON.stringify(data, null, 2)); // Debug
      setPayrollReport(data);
    } catch (err: any) {
      console.error("Lỗi khi tải báo cáo Payroll:", err);
      setError(err.message || "Không thể tải báo cáo Payroll");
    }
  };

  const fetchDividendReport = async () => {
    if (userRole !== "admin") return;
    try {
      const year = new Date().getFullYear(); // Sử dụng năm hiện tại làm mặc định
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/reports/dividend?year=${year}`,
        {
          headers: getAuthHeaders(),
        }
      );
      if (response.status === 401) {
        setError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
        localStorage.removeItem("userToken");
        router.push("/login");
        return;
      }
      if (response.status === 422) {
        const errorData = await response.json();
        throw new Error(
          `Lỗi xác thực: ${errorData.detail[0]?.msg || "Dữ liệu không hợp lệ"}`
        );
      }
      if (!response.ok) {
        throw new Error(`Lỗi: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setDividendReport(data);
    } catch (err: any) {
      console.error("Lỗi khi tải báo cáo Dividend:", err);
      setError(err.message || "Không thể tải báo cáo Dividend");
    }
  };

  useEffect(() => {
    setMounted(true);
    const role = localStorage.getItem("userRole");
    setUserRole(role);
    if (role === "employee") {
      router.push("/dashboard");
    }
  }, [router]);

  useEffect(() => {
    if (!mounted || userRole === "employee") return;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Report Type:", reportType, "Time Range:", timeRange); // Debug
        if (
          reportType === "hr" &&
          (userRole === "admin" || userRole === "payroll-manager")
        ) {
          await fetchHrReport();
        } else if (reportType === "payroll") {
          await fetchPayrollReport();
        } else if (reportType === "stock" && userRole === "admin") {
          await fetchDividendReport();
        } else {
          setError("Bạn không có quyền truy cập báo cáo này");
        }
      } catch (err: any) {
        console.error("Lỗi khi tải báo cáo:", err);
        setError(err.message || "Không thể tải báo cáo");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [mounted, userRole, reportType, timeRange]);

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    if (reportType === "hr" && hrReport?.data) {
      // Sheet 1: Department Allocation
      const deptData = hrReport.data.department_allocation.map((item) => ({
        "Phòng ban": item.department_name,
        "Số nhân viên": item.employee_count,
        "Tỷ lệ (%)": (item.percentage * 100).toFixed(2),
        "ID phòng ban": item.department_id,
      }));
      const deptWS = XLSX.utils.json_to_sheet(deptData);
      XLSX.utils.book_append_sheet(wb, deptWS, "Phân bổ phòng ban");

      // Sheet 2: Status Allocation
      if (hrReport.data.status_allocation) {
        const statusData = hrReport.data.status_allocation.map((item) => ({
          "Trạng thái": item.status,
          "Số nhân viên": item.employee_count,
          "Tỷ lệ (%)": (item.percentage * 100).toFixed(2),
        }));
        const statusWS = XLSX.utils.json_to_sheet(statusData);
        XLSX.utils.book_append_sheet(wb, statusWS, "Trạng thái nhân viên");
      }

      // Sheet 3: Summary
      const summaryData = [
        {
          "Thông số": "Tổng số nhân viên",
          "Giá trị": hrReport.data.total_employees,
        },
        {
          "Thông số": "Số phòng ban",
          "Giá trị": hrReport.data.department_allocation.length,
        },
        {
          "Thông số": "Số trạng thái",
          "Giá trị": hrReport.data.status_allocation?.length || 0,
        },
        {
          "Thông số": "Ngày tạo báo cáo",
          "Giá trị": new Date().toLocaleDateString("vi-VN"),
        },
      ];
      const summaryWS = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, summaryWS, "Tổng quan");

      XLSX.writeFile(
        wb,
        `HR_Report_${new Date().toISOString().split("T")[0]}.xlsx`
      );
    } else if (reportType === "payroll" && payrollReport?.data) {
      // Sheet 1: Department Analysis
      const deptData = payrollReport.data.department_analysis.map((item) => ({
        "Phòng ban": item.department_name,
        "Tổng lương": item.total_salary,
        "Lương trung bình": item.average_salary,
        "Tỷ lệ ngân sách (%)": item.budget_percentage.toFixed(2),
        "Số lượng lương": item.total_salary_department_count,
        "ID phòng ban": item.department_id,
      }));
      const deptWS = XLSX.utils.json_to_sheet(deptData);
      XLSX.utils.book_append_sheet(wb, deptWS, "Phân tích phòng ban");

      // Sheet 2: Summary
      const summaryData = [
        {
          "Thông số": "Tổng ngân sách",
          "Giá trị": payrollReport.data.total_budget,
        },
        {
          "Thông số": "Lương trung bình",
          "Giá trị": payrollReport.data.average_salary,
        },
        {
          "Thông số": "Tổng số lương",
          "Giá trị": payrollReport.data.total_salary_count,
        },
        {
          "Thông số": "Kỳ báo cáo",
          "Giá trị": payrollReport.data.report_period,
        },
        {
          "Thông số": "Ngày tạo báo cáo",
          "Giá trị": new Date().toLocaleDateString("vi-VN"),
        },
      ];
      const summaryWS = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, summaryWS, "Tổng quan");

      XLSX.writeFile(
        wb,
        `Payroll_Report_${new Date().toISOString().split("T")[0]}.xlsx`
      );
    } else if (reportType === "stock" && dividendReport?.data) {
      // Sheet 1: Employee Dividends
      const empData = dividendReport.data.employees_with_shares.map((item) => ({
        "Tên nhân viên": item.employee_name,
        "Phòng ban": item.department,
        "Chức vụ": item.position,
        "Tổng cổ tức": item.total_dividend,
        "Số lần nhận cổ tức": item.dividend_count,
        "Tỷ lệ (%)": item.percentage.toFixed(2),
        "ID nhân viên": item.employee_id,
      }));
      const empWS = XLSX.utils.json_to_sheet(empData);
      XLSX.utils.book_append_sheet(wb, empWS, "Cổ tức nhân viên");

      // Sheet 2: Summary
      const summaryData = [
        {
          "Thông số": "Tổng cổ tức đã trả",
          "Giá trị": dividendReport.data.total_dividend_paid,
        },
        {
          "Thông số": "Số nhân viên nhận cổ tức",
          "Giá trị": dividendReport.data.employee_count,
        },
        {
          "Thông số": "Kỳ báo cáo",
          "Giá trị": dividendReport.data.report_period,
        },
        {
          "Thông số": "Ngày tạo báo cáo",
          "Giá trị": new Date().toLocaleDateString("vi-VN"),
        },
      ];
      const summaryWS = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, summaryWS, "Tổng quan");

      XLSX.writeFile(
        wb,
        `Dividend_Report_${new Date().toISOString().split("T")[0]}.xlsx`
      );
    }
  };

  const resetPage = () => {
    // Reset tất cả state về giá trị mặc định
    setReportType("hr");
    setTimeRange("6months");
    setChartType("bar");
    setError(null);
    setHrReport(null);
    setPayrollReport(null);
    setDividendReport(null);
    setLoading(false);

    // Reload lại trang
    window.location.reload();
  };

  // Custom chart label component
  const CustomizedLabel = (props: any) => {
    const { x, y, width, value } = props;
    return (
      <text
        x={x + width / 2}
        y={y - 10}
        fill="#fff"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {formatNumber(value)}
      </text>
    );
  };

  // Custom pie chart label
  const renderCustomizedPieLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, name } = props;

    // Kiểm tra nếu percent không tồn tại hoặc bằng 0
    if (percent === undefined || percent === null || percent <= 0.05)
      return null;

    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
      <text
        x={x}
        y={y}
        fill="#fff"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (!mounted) {
    return null;
  }

  if (!userRole) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
        <div className="text-red-500 text-5xl">⚠️</div>
        <h2 className="text-xl font-semibold text-white">
          Không thể xác định vai trò người dùng
        </h2>
        <p className="text-slate-400">Vui lòng đăng nhập lại.</p>
        <Button
          onClick={() => router.push("/login")}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Đăng nhập
        </Button>
      </div>
    );
  }

  if (userRole === "employee") {
    router.push("/dashboard");
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center space-y-4">
          <div className="relative w-20 h-20">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500/20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-blue-400 font-medium">Đang tải báo cáo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
        <div className="text-red-500 text-5xl">⚠️</div>
        <h2 className="text-xl font-semibold text-white">
          Không thể tải báo cáo
        </h2>
        <p className="text-slate-400">{error}</p>
        <Button
          onClick={() => router.push("/dashboard")}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Quay lại Dashboard
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <motion.h1
          className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {t("reports.title")}
        </motion.h1>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="border-slate-700 text-blue-300 hover:bg-blue-900/20 hover:text-blue-100 transition-all"
          >
            <Calendar className="mr-2 h-4 w-4" />
            {t("reports.selectPeriod")}
          </Button>
          <Button
            variant="outline"
            className="border-slate-700 text-blue-300 hover:bg-blue-900/20 hover:text-blue-100 transition-all"
          >
            <FileText className="mr-2 h-4 w-4" />
            {t("reports.generateReport")}
          </Button>
          <Button
            variant="outline"
            className="border-slate-700 text-orange-300 hover:bg-orange-900/20 hover:text-orange-100 transition-all"
            onClick={resetPage}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset Page
          </Button>
          <Button
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all"
            onClick={exportToExcel}
          >
            <Download className="mr-2 h-4 w-4" />
            Tải Excel
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-300">
                {t("reports.totalEmployees")}
              </CardTitle>
              <div className="rounded-full bg-blue-900/50 p-2 text-blue-400">
                <TrendingUp className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {hrReport?.data?.total_employees
                  ? formatNumber(hrReport.data.total_employees)
                  : 0}
              </div>
              <div className="flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 text-green-400 mr-1" />
                <p className="text-xs text-green-400">+5 từ tháng trước</p>
              </div>
              <div className="mt-3 h-1.5 w-full bg-blue-900/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: hrReport?.data?.total_employees ? "85%" : "0%",
                  }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-300">
                {t("reports.averageSalary")}
              </CardTitle>
              <div className="rounded-full bg-green-900/50 p-2 text-green-400">
                <TrendingUp className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {payrollReport?.data?.average_salary
                  ? `$${formatNumber(payrollReport.data.average_salary)}`
                  : "N/A"}
              </div>
              <div className="flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 text-green-400 mr-1" />
                <p className="text-xs text-green-400">+2.5% từ tháng trước</p>
              </div>
              <div className="mt-3 h-1.5 w-full bg-green-900/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: payrollReport?.data?.average_salary ? "65%" : "0%",
                  }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-300">
                {t("reports.totalPayroll")}
              </CardTitle>
              <div className="rounded-full bg-purple-900/50 p-2 text-purple-400">
                <TrendingUp className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {payrollReport?.data?.total_budget
                  ? `$${formatNumber(payrollReport.data.total_budget)}`
                  : "N/A"}
              </div>
              <div className="flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 text-green-400 mr-1" />
                <p className="text-xs text-green-400">+3.2% từ tháng trước</p>
              </div>
              <div className="mt-3 h-1.5 w-full bg-purple-900/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: payrollReport?.data?.total_budget ? "75%" : "0%",
                  }}
                  transition={{ duration: 1, delay: 0.4 }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-300">
                {t("reports.totalDividend")}
              </CardTitle>
              <div className="rounded-full bg-yellow-900/50 p-2 text-yellow-400">
                <TrendingUp className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {dividendReport?.data?.total_dividend_paid
                  ? `$${formatNumber(dividendReport.data.total_dividend_paid)}`
                  : "N/A"}
              </div>
              <div className="flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 text-green-400 mr-1" />
                <p className="text-xs text-green-400">+1% từ năm trước</p>
              </div>
              <div className="mt-3 h-1.5 w-full bg-yellow-900/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: dividendReport?.data?.total_dividend_paid
                      ? "70%"
                      : "0%",
                  }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <motion.div
          className="col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Card className="h-full border-0 shadow-xl bg-gradient-to-b from-slate-900 to-slate-800 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-500/5 to-purple-500/5 blur-3xl"></div>
            <CardHeader className="border-b border-slate-700/50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-white">
                    {t("reports.reportControls")}
                  </CardTitle>
                  <CardDescription className="text-blue-300">
                    {t("reports.configureReports")}
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger className="w-[180px] bg-slate-800 border-slate-700 text-white focus:border-blue-500">
                      <SelectValue placeholder={t("reports.reportType")} />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-white">
                      <SelectItem
                        value="hr"
                        className="focus:bg-blue-900/50 focus:text-white"
                      >
                        {t("reports.hrReports")}
                      </SelectItem>
                      <SelectItem
                        value="payroll"
                        className="focus:bg-blue-900/50 focus:text-white"
                      >
                        {t("reports.payrollReports")}
                      </SelectItem>
                      {userRole === "admin" && (
                        <SelectItem
                          value="stock"
                          className="focus:bg-blue-900/50 focus:text-white"
                        >
                          {t("reports.stockReports")}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[180px] bg-slate-800 border-slate-700 text-white focus:border-blue-500">
                      <SelectValue placeholder={t("reports.timeRange")} />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-white">
                      <SelectItem
                        value="1month"
                        className="focus:bg-blue-900/50 focus:text-white"
                      >
                        {t("reports.lastMonth")}
                      </SelectItem>
                      <SelectItem
                        value="3months"
                        className="focus:bg-blue-900/50 focus:text-white"
                      >
                        {t("reports.last3Months")}
                      </SelectItem>
                      <SelectItem
                        value="6months"
                        className="focus:bg-blue-900/50 focus:text-white"
                      >
                        {t("reports.last6Months")}
                      </SelectItem>
                      <SelectItem
                        value="1year"
                        className="focus:bg-blue-900/50 focus:text-white"
                      >
                        {t("reports.lastYear")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={chartType} onValueChange={setChartType}>
                    <SelectTrigger className="w-[180px] bg-slate-800 border-slate-700 text-white focus:border-blue-500">
                      <SelectValue placeholder="Loại biểu đồ" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-white">
                      <SelectItem
                        value="bar"
                        className="focus:bg-blue-900/50 focus:text-white"
                      >
                        Biểu đồ cột
                      </SelectItem>
                      <SelectItem
                        value="line"
                        className="focus:bg-blue-900/50 focus:text-white"
                      >
                        Biểu đồ đường
                      </SelectItem>
                      <SelectItem
                        value="area"
                        className="focus:bg-blue-900/50 focus:text-white"
                      >
                        Biểu đồ vùng
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs defaultValue="charts" className="space-y-4">
                <TabsList className="bg-slate-800 border border-slate-700">
                  <TabsTrigger
                    value="charts"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white transition-all"
                  >
                    <BarChart4 className="mr-2 h-4 w-4" />
                    {t("reports.charts")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="tables"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white transition-all"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    {t("reports.tables")}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="charts" className="space-y-4">
                  <AnimatePresence mode="wait">
                    {reportType === "hr" && (
                      <motion.div
                        key="hr-chart"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="h-[350px] p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                      >
                        {hrReport?.data?.department_allocation &&
                        hrReport.data.department_allocation.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            {chartType === "bar" ? (
                              <BarChart
                                data={hrReport.data.department_allocation}
                                barSize={40}
                              >
                                <defs>
                                  <linearGradient
                                    id="colorEmployees"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                  >
                                    <stop
                                      offset="5%"
                                      stopColor={CHART_COLORS.blue[0]}
                                      stopOpacity={0.8}
                                    />
                                    <stop
                                      offset="95%"
                                      stopColor={CHART_COLORS.blue[1]}
                                      stopOpacity={0.8}
                                    />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke="#334155"
                                  vertical={false}
                                />
                                <XAxis
                                  dataKey="department_name"
                                  stroke="#94a3b8"
                                  tick={{ fill: "#94a3b8" }}
                                  axisLine={{ stroke: "#334155" }}
                                  tickLine={{ stroke: "#334155" }}
                                />
                                <YAxis
                                  stroke="#94a3b8"
                                  tick={{ fill: "#94a3b8" }}
                                  axisLine={{ stroke: "#334155" }}
                                  tickLine={{ stroke: "#334155" }}
                                />
                                <Tooltip
                                  contentStyle={tooltipStyle}
                                  cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                                  formatter={(
                                    value: any,
                                    name: string,
                                    props: TooltipFormatterProps
                                  ) => {
                                    if (props && props.payload) {
                                      const payload = props.payload;
                                      if (
                                        payload.department_name &&
                                        payload.percentage !== undefined
                                      ) {
                                        return [
                                          `${value} nhân viên (${(
                                            payload.percentage * 100
                                          ).toFixed(1)}%)`,
                                          payload.department_name,
                                        ];
                                      }
                                      if (
                                        payload.budget_percentage !== undefined
                                      ) {
                                        return [
                                          `$${formatNumber(
                                            value
                                          )} (${payload.budget_percentage.toFixed(
                                            1
                                          )}%)`,
                                          payload.department_name || name,
                                        ];
                                      }
                                    }
                                    return [
                                      typeof value === "number"
                                        ? `$${formatNumber(value)}`
                                        : value,
                                      name,
                                    ];
                                  }}
                                />
                                <Legend
                                  formatter={(
                                    value: string,
                                    entry: LegendFormatterProps
                                  ) => {
                                    if (entry && entry.payload) {
                                      const payload = entry.payload;
                                      if (payload.department_name) {
                                        return (
                                          <span className="text-slate-300">
                                            {payload.department_name}
                                          </span>
                                        );
                                      }
                                    }
                                    return (
                                      <span className="text-slate-300">
                                        {value}
                                      </span>
                                    );
                                  }}
                                  layout="vertical"
                                  verticalAlign="middle"
                                  align="right"
                                  wrapperStyle={{ fontSize: 12 }}
                                />
                                <Bar
                                  dataKey="employee_count"
                                  name="Số nhân viên"
                                  fill="url(#colorEmployees)"
                                  radius={[4, 4, 0, 0]}
                                />
                              </BarChart>
                            ) : chartType === "line" ? (
                              <LineChart
                                data={hrReport.data.department_allocation}
                              >
                                <defs>
                                  <linearGradient
                                    id="colorEmployees"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                  >
                                    <stop
                                      offset="5%"
                                      stopColor={CHART_COLORS.blue[0]}
                                      stopOpacity={0.8}
                                    />
                                    <stop
                                      offset="95%"
                                      stopColor={CHART_COLORS.blue[1]}
                                      stopOpacity={0.8}
                                    />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke="#334155"
                                />
                                <XAxis
                                  dataKey="department_name"
                                  stroke="#94a3b8"
                                  tick={{ fill: "#94a3b8" }}
                                  axisLine={{ stroke: "#334155" }}
                                  tickLine={{ stroke: "#334155" }}
                                />
                                <YAxis
                                  stroke="#94a3b8"
                                  tick={{ fill: "#94a3b8" }}
                                  axisLine={{ stroke: "#334155" }}
                                  tickLine={{ stroke: "#334155" }}
                                />
                                <Tooltip
                                  contentStyle={tooltipStyle}
                                  formatter={(
                                    value: any,
                                    name: string,
                                    props: TooltipFormatterProps
                                  ) => {
                                    if (props && props.payload) {
                                      const payload = props.payload;
                                      if (
                                        payload.department_name &&
                                        payload.percentage !== undefined
                                      ) {
                                        return [
                                          `${value} nhân viên (${(
                                            payload.percentage * 100
                                          ).toFixed(1)}%)`,
                                          payload.department_name,
                                        ];
                                      }
                                      if (
                                        payload.budget_percentage !== undefined
                                      ) {
                                        return [
                                          `$${formatNumber(
                                            value
                                          )} (${payload.budget_percentage.toFixed(
                                            1
                                          )}%)`,
                                          payload.department_name || name,
                                        ];
                                      }
                                    }
                                    return [
                                      typeof value === "number"
                                        ? `$${formatNumber(value)}`
                                        : value,
                                      name,
                                    ];
                                  }}
                                />
                                <Legend
                                  formatter={(
                                    value: string,
                                    entry: LegendFormatterProps
                                  ) => {
                                    if (entry && entry.payload) {
                                      const payload = entry.payload;
                                      if (payload.department_name) {
                                        return (
                                          <span className="text-slate-300">
                                            {payload.department_name}
                                          </span>
                                        );
                                      }
                                    }
                                    return (
                                      <span className="text-slate-300">
                                        {value}
                                      </span>
                                    );
                                  }}
                                  wrapperStyle={{ paddingTop: "10px" }}
                                />
                                <Line
                                  type="monotone"
                                  dataKey="employee_count"
                                  name="Số nhân viên"
                                  stroke={CHART_COLORS.blue[0]}
                                  strokeWidth={3}
                                  dot={{
                                    fill: CHART_COLORS.blue[0],
                                    r: 6,
                                    strokeWidth: 2,
                                    stroke: "#1e293b",
                                  }}
                                  activeDot={{
                                    r: 8,
                                    stroke: CHART_COLORS.blue[0],
                                    strokeWidth: 2,
                                  }}
                                />
                              </LineChart>
                            ) : (
                              <AreaChart
                                data={hrReport.data.department_allocation}
                              >
                                <defs>
                                  <linearGradient
                                    id="colorEmployees"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                  >
                                    <stop
                                      offset="5%"
                                      stopColor={CHART_COLORS.blue[0]}
                                      stopOpacity={0.8}
                                    />
                                    <stop
                                      offset="95%"
                                      stopColor={CHART_COLORS.blue[1]}
                                      stopOpacity={0}
                                    />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke="#334155"
                                />
                                <XAxis
                                  dataKey="department_name"
                                  stroke="#94a3b8"
                                  tick={{ fill: "#94a3b8" }}
                                  axisLine={{ stroke: "#334155" }}
                                  tickLine={{ stroke: "#334155" }}
                                />
                                <YAxis
                                  stroke="#94a3b8"
                                  tick={{ fill: "#94a3b8" }}
                                  axisLine={{ stroke: "#334155" }}
                                  tickLine={{ stroke: "#334155" }}
                                />
                                <Tooltip
                                  contentStyle={tooltipStyle}
                                  formatter={(
                                    value: any,
                                    name: string,
                                    props: TooltipFormatterProps
                                  ) => {
                                    if (props && props.payload) {
                                      const payload = props.payload;
                                      if (
                                        payload.department_name &&
                                        payload.percentage !== undefined
                                      ) {
                                        return [
                                          `${value} nhân viên (${(
                                            payload.percentage * 100
                                          ).toFixed(1)}%)`,
                                          payload.department_name,
                                        ];
                                      }
                                      if (
                                        payload.budget_percentage !== undefined
                                      ) {
                                        return [
                                          `$${formatNumber(
                                            value
                                          )} (${payload.budget_percentage.toFixed(
                                            1
                                          )}%)`,
                                          payload.department_name || name,
                                        ];
                                      }
                                    }
                                    return [
                                      typeof value === "number"
                                        ? `$${formatNumber(value)}`
                                        : value,
                                      name,
                                    ];
                                  }}
                                />
                                <Legend
                                  formatter={(
                                    value: string,
                                    entry: LegendFormatterProps
                                  ) => {
                                    if (entry && entry.payload) {
                                      const payload = entry.payload;
                                      if (payload.department_name) {
                                        return (
                                          <span className="text-slate-300">
                                            {payload.department_name}
                                          </span>
                                        );
                                      }
                                    }
                                    return (
                                      <span className="text-slate-300">
                                        {value}
                                      </span>
                                    );
                                  }}
                                  wrapperStyle={{ paddingTop: "10px" }}
                                />
                                <Area
                                  type="monotone"
                                  dataKey="employee_count"
                                  name="Số nhân viên"
                                  stroke={CHART_COLORS.blue[0]}
                                  fillOpacity={1}
                                  fill="url(#colorEmployees)"
                                  strokeWidth={3}
                                />
                              </AreaChart>
                            )}
                          </ResponsiveContainer>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <p className="text-center text-slate-400">
                              Không có dữ liệu phân bổ nhân viên theo phòng ban.
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                    {reportType === "payroll" && (
                      <motion.div
                        key="payroll-chart"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="h-[350px] p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                      >
                        {payrollReport?.data?.department_analysis &&
                        payrollReport.data.department_analysis.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            {chartType === "bar" ? (
                              <BarChart
                                data={payrollReport.data.department_analysis}
                                barSize={40}
                              >
                                <defs>
                                  <linearGradient
                                    id="colorSalary"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                  >
                                    <stop
                                      offset="5%"
                                      stopColor={CHART_COLORS.green[0]}
                                      stopOpacity={0.8}
                                    />
                                    <stop
                                      offset="95%"
                                      stopColor={CHART_COLORS.green[1]}
                                      stopOpacity={0.8}
                                    />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke="#334155"
                                  vertical={false}
                                />
                                <XAxis
                                  dataKey="department_name"
                                  stroke="#94a3b8"
                                  tick={{ fill: "#94a3b8" }}
                                  axisLine={{ stroke: "#334155" }}
                                  tickLine={{ stroke: "#334155" }}
                                />
                                <YAxis
                                  stroke="#94a3b8"
                                  tick={{ fill: "#94a3b8" }}
                                  axisLine={{ stroke: "#334155" }}
                                  tickLine={{ stroke: "#334155" }}
                                />
                                <Tooltip
                                  contentStyle={tooltipStyle}
                                  cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                                  formatter={(
                                    value: any,
                                    name: string,
                                    props: TooltipFormatterProps
                                  ) => {
                                    if (props && props.payload) {
                                      const payload = props.payload;
                                      if (
                                        payload.department_name &&
                                        payload.budget_percentage !== undefined
                                      ) {
                                        return [
                                          `$${formatNumber(
                                            value
                                          )} (${payload.budget_percentage.toFixed(
                                            1
                                          )}%)`,
                                          payload.department_name,
                                        ];
                                      }
                                      if (
                                        payload.budget_percentage !== undefined
                                      ) {
                                        return [
                                          `$${formatNumber(
                                            value
                                          )} (${payload.budget_percentage.toFixed(
                                            1
                                          )}%)`,
                                          payload.department_name || name,
                                        ];
                                      }
                                    }
                                    return [
                                      typeof value === "number"
                                        ? `$${formatNumber(value)}`
                                        : value,
                                      name,
                                    ];
                                  }}
                                />
                                <Legend
                                  formatter={(
                                    value: string,
                                    entry: LegendFormatterProps
                                  ) => {
                                    if (entry && entry.payload) {
                                      const payload = entry.payload;
                                      if (payload.department_name) {
                                        return (
                                          <span className="text-slate-300">
                                            {payload.department_name}
                                          </span>
                                        );
                                      }
                                    }
                                    return (
                                      <span className="text-slate-300">
                                        {value}
                                      </span>
                                    );
                                  }}
                                  wrapperStyle={{ paddingTop: "10px" }}
                                />
                                <Bar
                                  dataKey="total_salary"
                                  name="Tổng lương"
                                  fill="url(#colorSalary)"
                                  radius={[4, 4, 0, 0]}
                                />
                              </BarChart>
                            ) : chartType === "line" ? (
                              <LineChart
                                data={payrollReport.data.department_analysis}
                              >
                                <defs>
                                  <linearGradient
                                    id="colorSalary"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                  >
                                    <stop
                                      offset="5%"
                                      stopColor={CHART_COLORS.green[0]}
                                      stopOpacity={0.8}
                                    />
                                    <stop
                                      offset="95%"
                                      stopColor={CHART_COLORS.green[1]}
                                      stopOpacity={0.8}
                                    />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke="#334155"
                                />
                                <XAxis
                                  dataKey="department_name"
                                  stroke="#94a3b8"
                                  tick={{ fill: "#94a3b8" }}
                                  axisLine={{ stroke: "#334155" }}
                                  tickLine={{ stroke: "#334155" }}
                                />
                                <YAxis
                                  stroke="#94a3b8"
                                  tick={{ fill: "#94a3b8" }}
                                  axisLine={{ stroke: "#334155" }}
                                  tickLine={{ stroke: "#334155" }}
                                />
                                <Tooltip
                                  contentStyle={tooltipStyle}
                                  formatter={(
                                    value: any,
                                    name: string,
                                    props: TooltipFormatterProps
                                  ) => {
                                    if (props && props.payload) {
                                      const payload = props.payload;
                                      if (
                                        payload.department_name &&
                                        payload.budget_percentage !== undefined
                                      ) {
                                        return [
                                          `$${formatNumber(
                                            value
                                          )} (${payload.budget_percentage.toFixed(
                                            1
                                          )}%)`,
                                          payload.department_name,
                                        ];
                                      }
                                      if (
                                        payload.budget_percentage !== undefined
                                      ) {
                                        return [
                                          `$${formatNumber(
                                            value
                                          )} (${payload.budget_percentage.toFixed(
                                            1
                                          )}%)`,
                                          payload.department_name || name,
                                        ];
                                      }
                                    }
                                    return [
                                      typeof value === "number"
                                        ? `$${formatNumber(value)}`
                                        : value,
                                      name,
                                    ];
                                  }}
                                />
                                <Legend
                                  formatter={(
                                    value: string,
                                    entry: LegendFormatterProps
                                  ) => {
                                    if (entry && entry.payload) {
                                      const payload = entry.payload;
                                      if (payload.department_name) {
                                        return (
                                          <span className="text-slate-300">
                                            {payload.department_name}
                                          </span>
                                        );
                                      }
                                    }
                                    return (
                                      <span className="text-slate-300">
                                        {value}
                                      </span>
                                    );
                                  }}
                                  wrapperStyle={{ paddingTop: "10px" }}
                                />
                                <Line
                                  type="monotone"
                                  dataKey="total_salary"
                                  name="Tổng lương"
                                  stroke={CHART_COLORS.green[0]}
                                  strokeWidth={3}
                                  dot={{
                                    fill: CHART_COLORS.green[0],
                                    r: 6,
                                    strokeWidth: 2,
                                    stroke: "#1e293b",
                                  }}
                                  activeDot={{
                                    r: 8,
                                    stroke: CHART_COLORS.green[0],
                                    strokeWidth: 2,
                                  }}
                                />
                              </LineChart>
                            ) : (
                              <AreaChart
                                data={payrollReport.data.department_analysis}
                              >
                                <defs>
                                  <linearGradient
                                    id="colorSalary"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                  >
                                    <stop
                                      offset="5%"
                                      stopColor={CHART_COLORS.green[0]}
                                      stopOpacity={0.8}
                                    />
                                    <stop
                                      offset="95%"
                                      stopColor={CHART_COLORS.green[1]}
                                      stopOpacity={0}
                                    />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke="#334155"
                                />
                                <XAxis
                                  dataKey="department_name"
                                  stroke="#94a3b8"
                                  tick={{ fill: "#94a3b8" }}
                                  axisLine={{ stroke: "#334155" }}
                                  tickLine={{ stroke: "#334155" }}
                                />
                                <YAxis
                                  stroke="#94a3b8"
                                  tick={{ fill: "#94a3b8" }}
                                  axisLine={{ stroke: "#334155" }}
                                  tickLine={{ stroke: "#334155" }}
                                />
                                <Tooltip
                                  contentStyle={tooltipStyle}
                                  formatter={(
                                    value: any,
                                    name: string,
                                    props: TooltipFormatterProps
                                  ) => {
                                    if (props && props.payload) {
                                      const payload = props.payload;
                                      if (
                                        payload.department_name &&
                                        payload.budget_percentage !== undefined
                                      ) {
                                        return [
                                          `$${formatNumber(
                                            value
                                          )} (${payload.budget_percentage.toFixed(
                                            1
                                          )}%)`,
                                          payload.department_name,
                                        ];
                                      }
                                      if (
                                        payload.budget_percentage !== undefined
                                      ) {
                                        return [
                                          `$${formatNumber(
                                            value
                                          )} (${payload.budget_percentage.toFixed(
                                            1
                                          )}%)`,
                                          payload.department_name || name,
                                        ];
                                      }
                                    }
                                    return [
                                      typeof value === "number"
                                        ? `$${formatNumber(value)}`
                                        : value,
                                      name,
                                    ];
                                  }}
                                />
                                <Legend
                                  formatter={(
                                    value: string,
                                    entry: LegendFormatterProps
                                  ) => {
                                    if (entry && entry.payload) {
                                      const payload = entry.payload;
                                      if (payload.department_name) {
                                        return (
                                          <span className="text-slate-300">
                                            {payload.department_name}
                                          </span>
                                        );
                                      }
                                    }
                                    return (
                                      <span className="text-slate-300">
                                        {value}
                                      </span>
                                    );
                                  }}
                                  wrapperStyle={{ paddingTop: "10px" }}
                                />
                                <Area
                                  type="monotone"
                                  dataKey="total_salary"
                                  name="Tổng lương"
                                  stroke={CHART_COLORS.green[0]}
                                  fillOpacity={1}
                                  fill="url(#colorSalary)"
                                  strokeWidth={3}
                                />
                              </AreaChart>
                            )}
                          </ResponsiveContainer>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <p className="text-center text-slate-400">
                              Không có dữ liệu phân bổ lương theo phòng ban.
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                    {reportType === "stock" && (
                      <motion.div
                        key="stock-chart"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="h-[350px] p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                      >
                        {dividendReport?.data?.employees_with_shares &&
                        dividendReport.data.employees_with_shares.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            {chartType === "bar" ? (
                              <BarChart
                                data={dividendReport.data.employees_with_shares.slice(
                                  0,
                                  10
                                )}
                                barSize={40}
                                margin={{
                                  top: 20,
                                  right: 30,
                                  left: 20,
                                  bottom: 5,
                                }}
                              >
                                <defs>
                                  <linearGradient
                                    id="colorDividend"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                  >
                                    <stop
                                      offset="5%"
                                      stopColor={CHART_COLORS.yellow[0]}
                                      stopOpacity={0.8}
                                    />
                                    <stop
                                      offset="95%"
                                      stopColor={CHART_COLORS.yellow[1]}
                                      stopOpacity={0.8}
                                    />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke="#334155"
                                  vertical={false}
                                />
                                <XAxis
                                  dataKey="employee_name"
                                  stroke="#94a3b8"
                                  tick={{ fill: "#94a3b8" }}
                                  axisLine={{ stroke: "#334155" }}
                                  tickLine={{ stroke: "#334155" }}
                                  angle={-45}
                                  textAnchor="end"
                                  height={80}
                                />
                                <YAxis
                                  stroke="#94a3b8"
                                  tick={{ fill: "#94a3b8" }}
                                  axisLine={{ stroke: "#334155" }}
                                  tickLine={{ stroke: "#334155" }}
                                />
                                <Tooltip
                                  contentStyle={tooltipStyle}
                                  cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                                  formatter={(
                                    value: any,
                                    name: string,
                                    props: TooltipFormatterProps
                                  ) => {
                                    if (props && props.payload) {
                                      const payload = props.payload;
                                      if (
                                        payload.employee_name &&
                                        payload.percentage !== undefined
                                      ) {
                                        return [
                                          `$${formatNumber(
                                            value
                                          )} (${payload.percentage.toFixed(
                                            1
                                          )}%)`,
                                          payload.employee_name,
                                        ];
                                      }
                                      if (
                                        payload.budget_percentage !== undefined
                                      ) {
                                        return [
                                          `$${formatNumber(
                                            value
                                          )} (${payload.budget_percentage.toFixed(
                                            1
                                          )}%)`,
                                          payload.department_name || name,
                                        ];
                                      }
                                    }
                                    return [
                                      typeof value === "number"
                                        ? `$${formatNumber(value)}`
                                        : value,
                                      name,
                                    ];
                                  }}
                                />
                                <Legend
                                  formatter={(
                                    value: string,
                                    entry: LegendFormatterProps
                                  ) => {
                                    if (entry && entry.payload) {
                                      const payload = entry.payload;
                                      if (payload.employee_name) {
                                        return (
                                          <span className="text-slate-300">
                                            {payload.employee_name}
                                          </span>
                                        );
                                      }
                                      if (payload.employee_name) {
                                        return (
                                          <span className="text-slate-300">
                                            {payload.employee_name}
                                          </span>
                                        );
                                      }
                                      if (payload.status) {
                                        return (
                                          <span className="text-slate-300">
                                            {payload.status}
                                          </span>
                                        );
                                      }
                                    }
                                    return (
                                      <span className="text-slate-300">
                                        {value}
                                      </span>
                                    );
                                  }}
                                  wrapperStyle={{ paddingTop: "10px" }}
                                />
                                <Bar
                                  dataKey="total_dividend"
                                  name="Cổ tức"
                                  fill="url(#colorDividend)"
                                  radius={[4, 4, 0, 0]}
                                />
                              </BarChart>
                            ) : chartType === "line" ? (
                              <LineChart
                                data={dividendReport.data.employees_with_shares.slice(
                                  0,
                                  10
                                )}
                                margin={{
                                  top: 20,
                                  right: 30,
                                  left: 20,
                                  bottom: 5,
                                }}
                              >
                                <defs>
                                  <linearGradient
                                    id="colorDividend"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                  >
                                    <stop
                                      offset="5%"
                                      stopColor={CHART_COLORS.yellow[0]}
                                      stopOpacity={0.8}
                                    />
                                    <stop
                                      offset="95%"
                                      stopColor={CHART_COLORS.yellow[1]}
                                      stopOpacity={0.8}
                                    />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke="#334155"
                                />
                                <XAxis
                                  dataKey="employee_name"
                                  stroke="#94a3b8"
                                  tick={{ fill: "#94a3b8" }}
                                  axisLine={{ stroke: "#334155" }}
                                  tickLine={{ stroke: "#334155" }}
                                  angle={-45}
                                  textAnchor="end"
                                  height={80}
                                />
                                <YAxis
                                  stroke="#94a3b8"
                                  tick={{ fill: "#94a3b8" }}
                                  axisLine={{ stroke: "#334155" }}
                                  tickLine={{ stroke: "#334155" }}
                                />
                                <Tooltip
                                  contentStyle={tooltipStyle}
                                  formatter={(
                                    value: any,
                                    name: string,
                                    props: TooltipFormatterProps
                                  ) => {
                                    if (props && props.payload) {
                                      const payload = props.payload;
                                      if (
                                        payload.employee_name &&
                                        payload.percentage !== undefined
                                      ) {
                                        return [
                                          `$${formatNumber(
                                            value
                                          )} (${payload.percentage.toFixed(
                                            1
                                          )}%)`,
                                          payload.employee_name,
                                        ];
                                      }
                                      if (
                                        payload.budget_percentage !== undefined
                                      ) {
                                        return [
                                          `$${formatNumber(
                                            value
                                          )} (${payload.budget_percentage.toFixed(
                                            1
                                          )}%)`,
                                          payload.department_name || name,
                                        ];
                                      }
                                    }
                                    return [
                                      typeof value === "number"
                                        ? `$${formatNumber(value)}`
                                        : value,
                                      name,
                                    ];
                                  }}
                                />
                                <Legend
                                  formatter={(
                                    value: string,
                                    entry: LegendFormatterProps
                                  ) => {
                                    if (entry && entry.payload) {
                                      const payload = entry.payload;
                                      if (payload.employee_name) {
                                        return (
                                          <span className="text-slate-300">
                                            {payload.employee_name}
                                          </span>
                                        );
                                      }
                                      if (payload.employee_name) {
                                        return (
                                          <span className="text-slate-300">
                                            {payload.employee_name}
                                          </span>
                                        );
                                      }
                                      if (payload.status) {
                                        return (
                                          <span className="text-slate-300">
                                            {payload.status}
                                          </span>
                                        );
                                      }
                                    }
                                    return (
                                      <span className="text-slate-300">
                                        {value}
                                      </span>
                                    );
                                  }}
                                  wrapperStyle={{ paddingTop: "10px" }}
                                />
                                <Line
                                  type="monotone"
                                  dataKey="total_dividend"
                                  name="Cổ tức"
                                  stroke={CHART_COLORS.yellow[0]}
                                  strokeWidth={3}
                                  dot={{
                                    fill: CHART_COLORS.yellow[0],
                                    r: 6,
                                    strokeWidth: 2,
                                    stroke: "#1e293b",
                                  }}
                                  activeDot={{
                                    r: 8,
                                    stroke: CHART_COLORS.yellow[0],
                                    strokeWidth: 2,
                                  }}
                                />
                              </LineChart>
                            ) : (
                              <AreaChart
                                data={dividendReport.data.employees_with_shares.slice(
                                  0,
                                  10
                                )}
                                margin={{
                                  top: 20,
                                  right: 30,
                                  left: 20,
                                  bottom: 5,
                                }}
                              >
                                <defs>
                                  <linearGradient
                                    id="colorDividend"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                  >
                                    <stop
                                      offset="5%"
                                      stopColor={CHART_COLORS.yellow[0]}
                                      stopOpacity={0.8}
                                    />
                                    <stop
                                      offset="95%"
                                      stopColor={CHART_COLORS.yellow[1]}
                                      stopOpacity={0}
                                    />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke="#334155"
                                />
                                <XAxis
                                  dataKey="employee_name"
                                  stroke="#94a3b8"
                                  tick={{ fill: "#94a3b8" }}
                                  axisLine={{ stroke: "#334155" }}
                                  tickLine={{ stroke: "#334155" }}
                                  angle={-45}
                                  textAnchor="end"
                                  height={80}
                                />
                                <YAxis
                                  stroke="#94a3b8"
                                  tick={{ fill: "#94a3b8" }}
                                  axisLine={{ stroke: "#334155" }}
                                  tickLine={{ stroke: "#334155" }}
                                />
                                <Tooltip
                                  contentStyle={tooltipStyle}
                                  formatter={(
                                    value: any,
                                    name: string,
                                    props: TooltipFormatterProps
                                  ) => {
                                    if (props && props.payload) {
                                      const payload = props.payload;
                                      if (
                                        payload.employee_name &&
                                        payload.percentage !== undefined
                                      ) {
                                        return [
                                          `$${formatNumber(
                                            value
                                          )} (${payload.percentage.toFixed(
                                            1
                                          )}%)`,
                                          payload.employee_name,
                                        ];
                                      }
                                      if (
                                        payload.budget_percentage !== undefined
                                      ) {
                                        return [
                                          `$${formatNumber(
                                            value
                                          )} (${payload.budget_percentage.toFixed(
                                            1
                                          )}%)`,
                                          payload.department_name || name,
                                        ];
                                      }
                                    }
                                    return [
                                      typeof value === "number"
                                        ? `$${formatNumber(value)}`
                                        : value,
                                      name,
                                    ];
                                  }}
                                />
                                <Legend
                                  formatter={(
                                    value: string,
                                    entry: LegendFormatterProps
                                  ) => {
                                    if (entry && entry.payload) {
                                      const payload = entry.payload;
                                      if (payload.employee_name) {
                                        return (
                                          <span className="text-slate-300">
                                            {payload.employee_name}
                                          </span>
                                        );
                                      }
                                      if (payload.employee_name) {
                                        return (
                                          <span className="text-slate-300">
                                            {payload.employee_name}
                                          </span>
                                        );
                                      }
                                      if (payload.status) {
                                        return (
                                          <span className="text-slate-300">
                                            {payload.status}
                                          </span>
                                        );
                                      }
                                    }
                                    return (
                                      <span className="text-slate-300">
                                        {value}
                                      </span>
                                    );
                                  }}
                                  wrapperStyle={{ paddingTop: "10px" }}
                                />
                                <Area
                                  type="monotone"
                                  dataKey="total_dividend"
                                  name="Cổ tức"
                                  stroke={CHART_COLORS.yellow[0]}
                                  fillOpacity={1}
                                  fill="url(#colorDividend)"
                                  strokeWidth={3}
                                />
                              </AreaChart>
                            )}
                          </ResponsiveContainer>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <p className="text-center text-slate-400">
                              Không có dữ liệu phân bổ cổ tức cho nhân viên.
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </TabsContent>
                <TabsContent value="tables">
                  <div className="rounded-md border border-slate-700 bg-slate-800/50 overflow-hidden">
                    <div className="p-4 overflow-auto max-h-[350px] scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
                      {reportType === "hr" && (
                        <table className="w-full text-sm text-white">
                          <thead className="sticky top-0 bg-slate-800 z-10">
                            <tr className="border-b border-slate-700">
                              <th className="p-3 text-left font-medium text-slate-300">
                                Phòng ban
                              </th>
                              <th className="p-3 text-left font-medium text-slate-300">
                                Số nhân viên
                              </th>
                              <th className="p-3 text-left font-medium text-slate-300">
                                Tỷ lệ
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {hrReport?.data?.department_allocation?.map(
                              (item, index) => (
                                <tr
                                  key={item.department_id}
                                  className={`border-b border-slate-700 hover:bg-slate-700/30 transition-colors ${
                                    index % 2 === 0 ? "bg-slate-800/30" : ""
                                  }`}
                                >
                                  <td className="p-3">
                                    {item.department_name}
                                  </td>
                                  <td className="p-3">{item.employee_count}</td>
                                  <td className="p-3">
                                    <div className="flex items-center">
                                      <div className="w-16 h-2 bg-slate-700 rounded-full mr-2 overflow-hidden">
                                        <div
                                          className="h-full bg-blue-500 rounded-full"
                                          style={{
                                            width: `${item.percentage * 100}%`,
                                          }}
                                        ></div>
                                      </div>
                                      {(item.percentage * 100).toFixed(2)}%
                                    </div>
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      )}
                      {reportType === "payroll" && (
                        <table className="w-full text-sm text-white">
                          <thead className="sticky top-0 bg-slate-800 z-10">
                            <tr className="border-b border-slate-700">
                              <th className="p-3 text-left font-medium text-slate-300">
                                Phòng ban
                              </th>
                              <th className="p-3 text-left font-medium text-slate-300">
                                Tổng lương
                              </th>
                              <th className="p-3 text-left font-medium text-slate-300">
                                Lương trung bình
                              </th>
                              <th className="p-3 text-left font-medium text-slate-300">
                                Tỷ lệ ngân sách
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {payrollReport?.data?.department_analysis?.map(
                              (item, index) => (
                                <tr
                                  key={item.department_id}
                                  className={`border-b border-slate-700 hover:bg-slate-700/30 transition-colors ${
                                    index % 2 === 0 ? "bg-slate-800/30" : ""
                                  }`}
                                >
                                  <td className="p-3">
                                    {item.department_name}
                                  </td>
                                  <td className="p-3">
                                    ${formatNumber(item.total_salary)}
                                  </td>
                                  <td className="p-3">
                                    ${formatNumber(item.average_salary)}
                                  </td>
                                  <td className="p-3">
                                    <div className="flex items-center">
                                      <div className="w-16 h-2 bg-slate-700 rounded-full mr-2 overflow-hidden">
                                        <div
                                          className="h-full bg-green-500 rounded-full"
                                          style={{
                                            width: `${item.budget_percentage}%`,
                                          }}
                                        ></div>
                                      </div>
                                      {item.budget_percentage.toFixed(2)}%
                                    </div>
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      )}
                      {reportType === "stock" && (
                        <table className="w-full text-sm text-white">
                          <thead className="sticky top-0 bg-slate-800 z-10">
                            <tr className="border-b border-slate-700">
                              <th className="p-3 text-left font-medium text-slate-300">
                                Nhân viên
                              </th>
                              <th className="p-3 text-left font-medium text-slate-300">
                                Phòng ban
                              </th>
                              <th className="p-3 text-left font-medium text-slate-300">
                                Chức vụ
                              </th>
                              <th className="p-3 text-left font-medium text-slate-300">
                                Tổng cổ tức
                              </th>
                              <th className="p-3 text-left font-medium text-slate-300">
                                Tỷ lệ
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {dividendReport?.data?.employees_with_shares?.map(
                              (item, index) => (
                                <tr
                                  key={item.employee_id}
                                  className={`border-b border-slate-700 hover:bg-slate-700/30 transition-colors ${
                                    index % 2 === 0 ? "bg-slate-800/30" : ""
                                  }`}
                                >
                                  <td className="p-3">{item.employee_name}</td>
                                  <td className="p-3">{item.department}</td>
                                  <td className="p-3">{item.position}</td>
                                  <td className="p-3">
                                    ${formatNumber(item.total_dividend)}
                                  </td>
                                  <td className="p-3">
                                    <div className="flex items-center">
                                      <div className="w-16 h-2 bg-slate-700 rounded-full mr-2 overflow-hidden">
                                        <div
                                          className="h-full bg-yellow-500 rounded-full"
                                          style={{
                                            width: `${item.percentage}%`,
                                          }}
                                        ></div>
                                      </div>
                                      {item.percentage.toFixed(2)}%
                                    </div>
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <Card className="h-full border-0 shadow-xl bg-gradient-to-b from-slate-900 to-slate-800 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <CardHeader className="border-b border-slate-700/50">
              <CardTitle className="text-white">
                {reportType === "hr"
                  ? t("reports.departmentDistribution")
                  : reportType === "payroll"
                  ? t("reports.payrollDistribution")
                  : t("reports.dividendDistribution")}
              </CardTitle>
              <CardDescription className="text-blue-300">
                {reportType === "hr"
                  ? t("reports.employeeDistribution")
                  : reportType === "payroll"
                  ? t("reports.payrollDistribution")
                  : t("reports.dividendDistribution")}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[350px]">
                <AnimatePresence mode="wait">
                  {reportType === "hr" &&
                  hrReport?.data?.department_allocation &&
                  hrReport.data.department_allocation.length > 0 ? (
                    <motion.div
                      key="hr-pie"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="h-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={hrReport.data.department_allocation.filter(
                              (item) => item.employee_count > 0
                            )}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={120}
                            innerRadius={60}
                            fill="#8884d8"
                            dataKey="employee_count"
                            label={renderCustomizedPieLabel}
                            animationDuration={1500}
                            animationBegin={200}
                            paddingAngle={2}
                          >
                            {hrReport.data.department_allocation
                              .filter((item) => item.employee_count > 0)
                              .map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={PIE_COLORS[index % PIE_COLORS.length]}
                                />
                              ))}
                          </Pie>
                          <Tooltip
                            contentStyle={tooltipStyle}
                            formatter={(
                              value: any,
                              name: string,
                              props: TooltipFormatterProps
                            ) => {
                              if (props && props.payload) {
                                const payload = props.payload;
                                if (
                                  payload.department_name &&
                                  payload.percentage !== undefined
                                ) {
                                  return [
                                    `${value} nhân viên (${(
                                      payload.percentage * 100
                                    ).toFixed(1)}%)`,
                                    payload.department_name,
                                  ];
                                }
                                if (payload.budget_percentage !== undefined) {
                                  return [
                                    `$${formatNumber(
                                      value
                                    )} (${payload.budget_percentage.toFixed(
                                      1
                                    )}%)`,
                                    payload.department_name || name,
                                  ];
                                }
                              }
                              return [
                                typeof value === "number"
                                  ? `$${formatNumber(value)}`
                                  : value,
                                name,
                              ];
                            }}
                          />
                          <Legend
                            layout="vertical"
                            verticalAlign="middle"
                            align="right"
                            wrapperStyle={{ fontSize: 12 }}
                            formatter={(
                              value: string,
                              entry: LegendFormatterProps
                            ) => {
                              if (entry && entry.payload) {
                                const payload = entry.payload;
                                if (payload.department_name) {
                                  return (
                                    <span className="text-slate-300">
                                      {payload.department_name}
                                    </span>
                                  );
                                }
                                if (payload.employee_name) {
                                  return (
                                    <span className="text-slate-300">
                                      {payload.employee_name}
                                    </span>
                                  );
                                }
                                if (payload.status) {
                                  return (
                                    <span className="text-slate-300">
                                      {payload.status}
                                    </span>
                                  );
                                }
                              }
                              return (
                                <span className="text-slate-300">{value}</span>
                              );
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </motion.div>
                  ) : reportType === "payroll" &&
                    payrollReport?.data?.department_analysis &&
                    payrollReport.data.department_analysis.length > 0 ? (
                    <motion.div
                      key="payroll-pie"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="h-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={payrollReport.data.department_analysis.filter(
                              (item) => item.total_salary > 0
                            )}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={120}
                            innerRadius={60}
                            fill="#8884d8"
                            dataKey="total_salary"
                            label={renderCustomizedPieLabel}
                            animationDuration={1500}
                            animationBegin={200}
                            paddingAngle={2}
                          >
                            {payrollReport.data.department_analysis
                              .filter((item) => item.total_salary > 0)
                              .map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={PIE_COLORS[index % PIE_COLORS.length]}
                                />
                              ))}
                          </Pie>
                          <Tooltip
                            contentStyle={tooltipStyle}
                            formatter={(
                              value: any,
                              name: string,
                              props: TooltipFormatterProps
                            ) => {
                              if (props && props.payload) {
                                const payload = props.payload;
                                if (
                                  payload.department_name &&
                                  payload.budget_percentage !== undefined
                                ) {
                                  return [
                                    `$${formatNumber(
                                      value
                                    )} (${payload.budget_percentage.toFixed(
                                      1
                                    )}%)`,
                                    payload.department_name,
                                  ];
                                }
                                if (payload.budget_percentage !== undefined) {
                                  return [
                                    `$${formatNumber(
                                      value
                                    )} (${payload.budget_percentage.toFixed(
                                      1
                                    )}%)`,
                                    payload.department_name || name,
                                  ];
                                }
                              }
                              return [
                                typeof value === "number"
                                  ? `$${formatNumber(value)}`
                                  : value,
                                name,
                              ];
                            }}
                          />
                          <Legend
                            layout="vertical"
                            verticalAlign="middle"
                            align="right"
                            wrapperStyle={{ fontSize: 12 }}
                            formatter={(
                              value: string,
                              entry: LegendFormatterProps
                            ) => {
                              if (entry && entry.payload) {
                                const payload = entry.payload;
                                if (payload.department_name) {
                                  return (
                                    <span className="text-slate-300">
                                      {payload.department_name}
                                    </span>
                                  );
                                }
                                if (payload.employee_name) {
                                  return (
                                    <span className="text-slate-300">
                                      {payload.employee_name}
                                    </span>
                                  );
                                }
                                if (payload.status) {
                                  return (
                                    <span className="text-slate-300">
                                      {payload.status}
                                    </span>
                                  );
                                }
                              }
                              return (
                                <span className="text-slate-300">{value}</span>
                              );
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </motion.div>
                  ) : reportType === "stock" &&
                    dividendReport?.data?.employees_with_shares &&
                    dividendReport.data.employees_with_shares.length > 0 ? (
                    <motion.div
                      key="stock-pie"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="h-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={dividendReport.data.employees_with_shares
                              .slice(0, 10)
                              .filter((item) => item.total_dividend > 0)}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={120}
                            innerRadius={60}
                            fill="#8884d8"
                            dataKey="total_dividend"
                            label={renderCustomizedPieLabel}
                            animationDuration={1500}
                            animationBegin={200}
                            paddingAngle={2}
                          >
                            {dividendReport.data.employees_with_shares
                              .slice(0, 10)
                              .filter((item) => item.total_dividend > 0)
                              .map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={PIE_COLORS[index % PIE_COLORS.length]}
                                />
                              ))}
                          </Pie>
                          <Tooltip
                            contentStyle={tooltipStyle}
                            formatter={(
                              value: any,
                              name: string,
                              props: TooltipFormatterProps
                            ) => {
                              if (props && props.payload) {
                                const payload = props.payload;
                                if (
                                  payload.employee_name &&
                                  payload.percentage !== undefined
                                ) {
                                  return [
                                    `$${formatNumber(
                                      value
                                    )} (${payload.percentage.toFixed(1)}%)`,
                                    payload.employee_name,
                                  ];
                                }
                                if (payload.budget_percentage !== undefined) {
                                  return [
                                    `$${formatNumber(
                                      value
                                    )} (${payload.budget_percentage.toFixed(
                                      1
                                    )}%)`,
                                    payload.department_name || name,
                                  ];
                                }
                              }
                              return [
                                typeof value === "number"
                                  ? `$${formatNumber(value)}`
                                  : value,
                                name,
                              ];
                            }}
                          />
                          <Legend
                            layout="vertical"
                            verticalAlign="middle"
                            align="right"
                            wrapperStyle={{ fontSize: 12 }}
                            formatter={(
                              value: string,
                              entry: LegendFormatterProps
                            ) => {
                              if (entry && entry.payload) {
                                const payload = entry.payload;
                                if (payload.department_name) {
                                  return (
                                    <span className="text-slate-300">
                                      {payload.department_name}
                                    </span>
                                  );
                                }
                                if (payload.employee_name) {
                                  return (
                                    <span className="text-slate-300">
                                      {payload.employee_name}
                                    </span>
                                  );
                                }
                                if (payload.status) {
                                  return (
                                    <span className="text-slate-300">
                                      {payload.status}
                                    </span>
                                  );
                                }
                              }
                              return (
                                <span className="text-slate-300">{value}</span>
                              );
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </motion.div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-center text-slate-400">
                        Không có dữ liệu để hiển thị.
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <Card className="border-0 shadow-xl bg-gradient-to-b from-slate-900 to-slate-800 overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full -ml-16 -mt-16 blur-3xl"></div>
            <CardHeader className="border-b border-slate-700/50">
              <CardTitle className="text-white">
                {reportType === "hr"
                  ? t("reports.statusOverview")
                  : reportType === "payroll"
                  ? t("reports.payrollOverview")
                  : t("reports.dividendOverview")}
              </CardTitle>
              <CardDescription className="text-blue-300">
                {reportType === "hr"
                  ? t("reports.employeeStatusStatistics")
                  : reportType === "payroll"
                  ? t("reports.payrollStatistics")
                  : t("reports.dividendStatistics")}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80 pt-6">
              <AnimatePresence mode="wait">
                {reportType === "hr" &&
                hrReport?.data?.status_allocation &&
                hrReport.data.status_allocation.length > 0 ? (
                  <motion.div
                    key="hr-status"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={hrReport.data.status_allocation.filter(
                            (item) => item.employee_count > 0
                          )}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          innerRadius={50}
                          fill="#8884d8"
                          dataKey="employee_count"
                          label={renderCustomizedPieLabel}
                          animationDuration={1500}
                          animationBegin={200}
                          paddingAngle={2}
                        >
                          {hrReport.data.status_allocation
                            .filter((item) => item.employee_count > 0)
                            .map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={PIE_COLORS[index % PIE_COLORS.length]}
                              />
                            ))}
                        </Pie>
                        <Tooltip
                          contentStyle={tooltipStyle}
                          formatter={(
                            value: any,
                            name: string,
                            props: TooltipFormatterProps
                          ) => {
                            if (props && props.payload) {
                              const payload = props.payload;
                              if (
                                payload.status &&
                                payload.percentage !== undefined
                              ) {
                                return [
                                  `${value} nhân viên (${(
                                    payload.percentage * 100
                                  ).toFixed(1)}%)`,
                                  payload.status,
                                ];
                              }
                              if (payload.budget_percentage !== undefined) {
                                return [
                                  `$${formatNumber(
                                    value
                                  )} (${payload.budget_percentage.toFixed(
                                    1
                                  )}%)`,
                                  payload.department_name || name,
                                ];
                              }
                            }
                            return [
                              typeof value === "number"
                                ? `$${formatNumber(value)}`
                                : value,
                              name,
                            ];
                          }}
                        />
                        <Legend
                          formatter={(
                            value: string,
                            entry: LegendFormatterProps
                          ) => {
                            if (entry && entry.payload) {
                              const payload = entry.payload;
                              if (payload.department_name) {
                                return (
                                  <span className="text-slate-300">
                                    {payload.department_name}
                                  </span>
                                );
                              }
                              if (payload.employee_name) {
                                return (
                                  <span className="text-slate-300">
                                    {payload.employee_name}
                                  </span>
                                );
                              }
                              if (payload.status) {
                                return (
                                  <span className="text-slate-300">
                                    {payload.status}
                                  </span>
                                );
                              }
                            }
                            return (
                              <span className="text-slate-300">{value}</span>
                            );
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </motion.div>
                ) : reportType === "payroll" &&
                  payrollReport?.data?.department_analysis &&
                  payrollReport.data.department_analysis.length > 0 ? (
                  <motion.div
                    key="payroll-avg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={payrollReport.data.department_analysis}
                        barSize={30}
                      >
                        <defs>
                          <linearGradient
                            id="colorAvgSalary"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor={CHART_COLORS.purple[0]}
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor={CHART_COLORS.purple[1]}
                              stopOpacity={0.8}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#334155"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="department_name"
                          stroke="#94a3b8"
                          tick={{ fill: "#94a3b8" }}
                          axisLine={{ stroke: "#334155" }}
                          tickLine={{ stroke: "#334155" }}
                        />
                        <YAxis
                          stroke="#94a3b8"
                          tick={{ fill: "#94a3b8" }}
                          axisLine={{ stroke: "#334155" }}
                          tickLine={{ stroke: "#334155" }}
                        />
                        <Tooltip
                          contentStyle={tooltipStyle}
                          formatter={(
                            value: any,
                            name: string,
                            props: TooltipFormatterProps
                          ) => {
                            if (props && props.payload) {
                              const payload = props.payload;
                              if (
                                payload.department_name &&
                                payload.budget_percentage !== undefined
                              ) {
                                return [
                                  `$${formatNumber(
                                    value
                                  )} (${payload.budget_percentage.toFixed(
                                    1
                                  )}%)`,
                                  payload.department_name,
                                ];
                              }
                              if (payload.budget_percentage !== undefined) {
                                return [
                                  `$${formatNumber(
                                    value
                                  )} (${payload.budget_percentage.toFixed(
                                    1
                                  )}%)`,
                                  payload.department_name || name,
                                ];
                              }
                            }
                            return [
                              typeof value === "number"
                                ? `$${formatNumber(value)}`
                                : value,
                              name,
                            ];
                          }}
                        />
                        <Legend
                          wrapperStyle={{ paddingTop: "10px" }}
                          formatter={(
                            value: string,
                            entry: LegendFormatterProps
                          ) => {
                            if (entry && entry.payload) {
                              const payload = entry.payload;
                              if (payload.department_name) {
                                return (
                                  <span className="text-slate-300">
                                    {payload.department_name}
                                  </span>
                                );
                              }
                              if (payload.employee_name) {
                                return (
                                  <span className="text-slate-300">
                                    {payload.employee_name}
                                  </span>
                                );
                              }
                              if (payload.status) {
                                return (
                                  <span className="text-slate-300">
                                    {payload.status}
                                  </span>
                                );
                              }
                            }
                            return (
                              <span className="text-slate-300">{value}</span>
                            );
                          }}
                        />
                        <Bar
                          dataKey="average_salary"
                          name="Lương trung bình"
                          fill="url(#colorAvgSalary)"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                ) : reportType === "stock" &&
                  dividendReport?.data?.employees_with_shares &&
                  dividendReport.data.employees_with_shares.length > 0 ? (
                  <motion.div
                    key="stock-bar"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={dividendReport.data.employees_with_shares.slice(
                          0,
                          5
                        )}
                        barSize={30}
                      >
                        <defs>
                          <linearGradient
                            id="colorTopDividend"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor={CHART_COLORS.orange[0]}
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor={CHART_COLORS.orange[1]}
                              stopOpacity={0.8}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#334155"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="employee_name"
                          stroke="#94a3b8"
                          tick={{ fill: "#94a3b8" }}
                          axisLine={{ stroke: "#334155" }}
                          tickLine={{ stroke: "#334155" }}
                        />
                        <YAxis
                          stroke="#94a3b8"
                          tick={{ fill: "#94a3b8" }}
                          axisLine={{ stroke: "#334155" }}
                          tickLine={{ stroke: "#334155" }}
                        />
                        <Tooltip
                          contentStyle={tooltipStyle}
                          formatter={(
                            value: any,
                            name: string,
                            props: TooltipFormatterProps
                          ) => {
                            if (props && props.payload) {
                              const payload = props.payload;
                              if (
                                payload.employee_name &&
                                payload.percentage !== undefined
                              ) {
                                return [`$${formatNumber(value)}`, "Cổ tức"];
                              }
                              if (payload.budget_percentage !== undefined) {
                                return [
                                  `$${formatNumber(
                                    value
                                  )} (${payload.budget_percentage.toFixed(
                                    1
                                  )}%)`,
                                  payload.department_name || name,
                                ];
                              }
                            }
                            return [
                              typeof value === "number"
                                ? `$${formatNumber(value)}`
                                : value,
                              name,
                            ];
                          }}
                        />
                        <Legend
                          wrapperStyle={{ paddingTop: "10px" }}
                          formatter={(
                            value: string,
                            entry: LegendFormatterProps
                          ) => {
                            if (entry && entry.payload) {
                              const payload = entry.payload;
                              if (payload.department_name) {
                                return (
                                  <span className="text-slate-300">
                                    {payload.department_name}
                                  </span>
                                );
                              }
                              if (payload.employee_name) {
                                return (
                                  <span className="text-slate-300">
                                    {payload.employee_name}
                                  </span>
                                );
                              }
                              if (payload.status) {
                                return (
                                  <span className="text-slate-300">
                                    {payload.status}
                                  </span>
                                );
                              }
                            }
                            return (
                              <span className="text-slate-300">{value}</span>
                            );
                          }}
                        />
                        <Bar
                          dataKey="total_dividend"
                          name="Cổ tức"
                          fill="url(#colorTopDividend)"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-center text-slate-400">
                      Không có dữ liệu để hiển thị.
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
        >
          <Card className="border-0 shadow-xl bg-gradient-to-b from-slate-900 to-slate-800 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <CardHeader className="border-b border-slate-700/50">
              <CardTitle className="text-white">
                {t("reports.summaryStatistics")}
              </CardTitle>
              <CardDescription className="text-blue-300">
                {t("reports.summaryDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80 pt-6">
              <AnimatePresence mode="wait">
                {reportType === "hr" && (
                  <motion.div
                    key="hr-summary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Tổng nhân viên</span>
                        <span className="text-xl font-bold text-white">
                          {hrReport?.data?.total_employees ?? 0}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Phòng ban</span>
                        <span className="text-xl font-bold text-white">
                          {hrReport?.data?.department_allocation?.length ?? 0}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Trạng thái</span>
                        <span className="text-xl font-bold text-white">
                          {hrReport?.data?.status_allocation?.length ?? 0}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
                {reportType === "payroll" && (
                  <motion.div
                    key="payroll-summary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">
                          Tổng ngân sách lương
                        </span>
                        <span className="text-xl font-bold text-white">
                          $
                          {payrollReport?.data?.total_budget
                            ? formatNumber(payrollReport.data.total_budget)
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Lương trung bình</span>
                        <span className="text-xl font-bold text-white">
                          $
                          {payrollReport?.data?.average_salary
                            ? formatNumber(payrollReport.data.average_salary)
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Số lượng lương</span>
                        <span className="text-xl font-bold text-white">
                          {payrollReport?.data?.total_salary_count ?? 0}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
                {reportType === "stock" && (
                  <motion.div
                    key="stock-summary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Tổng cổ tức</span>
                        <span className="text-xl font-bold text-white">
                          $
                          {dividendReport?.data?.total_dividend_paid
                            ? formatNumber(
                                dividendReport.data.total_dividend_paid
                              )
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">
                          Số nhân viên nhận cổ tức
                        </span>
                        <span className="text-xl font-bold text-white">
                          {dividendReport?.data?.employee_count ?? 0}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Kỳ báo cáo</span>
                        <span className="text-xl font-bold text-white">
                          {dividendReport?.data?.report_period ?? "N/A"}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
