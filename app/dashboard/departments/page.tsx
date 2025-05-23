"use client";

import { useState, useEffect } from "react";
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
import { Label } from "@/components/ui/label";
import {
  Plus,
  MoreHorizontal,
  Building2,
  Users,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

// API base URLs
const DEPT_API_BASE_URL = `${process.env.NEXT_PUBLIC_DOMAIN}/departments`;
const POS_API_BASE_URL = `${process.env.NEXT_PUBLIC_DOMAIN}/positions`;

// Thời gian hiện tại: 09:41 PM +07, 23/05/2025
const currentTime = format(
  new Date("2025-05-23T21:41:00+07:00"),
  "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"
);

// Hàm lấy header xác thực
const getAuthHeaders = () => {
  const token = localStorage.getItem("userToken");
  if (!token) {
    console.warn("No userToken found in localStorage");
    throw new Error("Thiếu token xác thực");
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// API functions for departments
const fetchDepartments = async () => {
  try {
    const response = await fetch(`${DEPT_API_BASE_URL}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `Lỗi khi lấy danh sách phòng ban: ${response.status} ${
          response.statusText
        }${errorData?.detail ? ` - ${JSON.stringify(errorData.detail)}` : ""}`
      );
    }
    const data = await response.json();
    const departments = (Array.isArray(data) ? data : data?.data || []).map(
      (dept: any) => ({
        ...dept,
        id:
          dept.DepartmentID !== undefined
            ? parseInt(dept.DepartmentID, 10)
            : undefined, // Sửa thành dept.DepartmentID
      })
    );
    console.log("Fetched departments:", departments);
    return departments;
  } catch (error) {
    console.error("Fetch departments failed:", error);
    throw error;
  }
};

const addDepartment = async (departmentData: {
  DepartmentName: string;
  CreatedAt: string;
  UpdatedAt: string;
}) => {
  try {
    const response = await fetch(`${DEPT_API_BASE_URL}/add`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(departmentData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `Lỗi khi thêm phòng ban: ${response.status} ${response.statusText}${
          errorData?.detail ? ` - ${JSON.stringify(errorData.detail)}` : ""
        }`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Add department failed:", error);
    throw error;
  }
};

const updateDepartment = async (
  departmentId: number,
  departmentData: { DepartmentName: string; UpdatedAt: string }
) => {
  try {
    if (!Number.isInteger(departmentId)) {
      throw new Error("ID phòng ban phải là một số nguyên hợp lệ");
    }
    const response = await fetch(
      `${DEPT_API_BASE_URL}/update/${departmentId}`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(departmentData),
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `Lỗi khi cập nhật phòng ban: ${response.status} ${response.statusText}${
          errorData?.detail ? ` - ${JSON.stringify(errorData.detail)}` : ""
        }`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Update department failed:", error);
    throw error;
  }
};

const deleteDepartment = async (departmentId: number) => {
  try {
    if (!Number.isInteger(departmentId)) {
      throw new Error("ID phòng ban phải là một số nguyên hợp lệ");
    }
    const response = await fetch(
      `${DEPT_API_BASE_URL}/delete/${departmentId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `Lỗi khi xóa phòng ban: ${response.status} ${response.statusText}${
          errorData?.detail ? ` - ${JSON.stringify(errorData.detail)}` : ""
        }`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Delete department failed:", error);
    throw error;
  }
};

// API functions for positions
const fetchPositions = async () => {
  try {
    const response = await fetch(`${POS_API_BASE_URL}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `Lỗi khi lấy danh sách vị trí: ${response.status} ${
          response.statusText
        }${errorData?.detail ? ` - ${JSON.stringify(errorData.detail)}` : ""}`
      );
    }
    const data = await response.json();
    const positions = (Array.isArray(data) ? data : data?.data || []).map(
      (pos: any) => ({
        ...pos,
        PositionID:
          pos.PositionID !== undefined
            ? parseInt(pos.PositionID, 10)
            : undefined,
      })
    );
    console.log("Fetched positions:", positions);
    return positions;
  } catch (error) {
    console.error("Fetch positions failed:", error);
    throw error;
  }
};

const fetchPositionDistribution = async (positionId: number) => {
  try {
    if (!Number.isInteger(positionId)) {
      throw new Error("ID vị trí phải là một số nguyên hợp lệ");
    }
    const response = await fetch(
      `${POS_API_BASE_URL}/distribution/${positionId}`,
      {
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `Lỗi khi lấy phân bổ vị trí: ${response.status} ${response.statusText}${
          errorData?.detail ? ` - ${JSON.stringify(errorData.detail)}` : ""
        }`
      );
    }
    const data = await response.json();
    return Array.isArray(data) ? data : data?.data || [];
  } catch (error) {
    console.error("Fetch position distribution failed:", error);
    throw error;
  }
};

const addPosition = async (positionData: {
  PositionName: string;
  CreatedAt: string;
  UpdatedAt: string;
}) => {
  try {
    const response = await fetch(`${POS_API_BASE_URL}/add`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(positionData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `Lỗi khi thêm vị trí: ${response.status} ${response.statusText}${
          errorData?.detail ? ` - ${JSON.stringify(errorData.detail)}` : ""
        }`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Add position failed:", error);
    throw error;
  }
};

const updatePosition = async (
  positionId: number,
  positionData: { PositionName: string; UpdatedAt: string }
) => {
  try {
    if (!Number.isInteger(positionId)) {
      throw new Error("ID vị trí phải là một số nguyên hợp lệ");
    }
    const response = await fetch(`${POS_API_BASE_URL}/update/${positionId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(positionData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `Lỗi khi cập nhật vị trí: ${response.status} ${response.statusText}${
          errorData?.detail ? ` - ${JSON.stringify(errorData.detail)}` : ""
        }`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Update position failed:", error);
    throw error;
  }
};

const deletePosition = async (positionId: number) => {
  try {
    if (!Number.isInteger(positionId)) {
      throw new Error("ID vị trí phải là một số nguyên hợp lệ");
    }
    const response = await fetch(`${POS_API_BASE_URL}/delete/${positionId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `Lỗi khi xóa vị trí: ${response.status} ${response.statusText}${
          errorData?.detail ? ` - ${JSON.stringify(errorData.detail)}` : ""
        }`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Delete position failed:", error);
    throw error;
  }
};

interface Department {
  id?: number;
  DepartmentID?: number;
  DepartmentName: string;
  NumbersOfEmployees?: number;
  CreatedAt: string;
  UpdatedAt: string;
}

interface Position {
  PositionID?: number;
  PositionName: string;
  TotalEmployees: number;
  CreatedAt: string;
  UpdatedAt: string;
}

interface PositionDistribution {
  department: string;
  employeeCount: number;
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [positionDistributions, setPositionDistributions] = useState<{
    [key: number]: PositionDistribution[];
  }>({});
  const [activeTab, setActiveTab] = useState("departments");
  const [newDepartment, setNewDepartment] = useState({
    DepartmentName: "",
    CreatedAt: currentTime,
    UpdatedAt: currentTime,
  });
  const [newPosition, setNewPosition] = useState({
    PositionName: "",
    CreatedAt: currentTime,
    UpdatedAt: currentTime,
  });
  const [editDepartment, setEditDepartment] = useState<Department | null>(null);
  const [editPosition, setEditPosition] = useState<Position | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();
  const { toast } = useToast();

  // Load initial data
  useEffect(() => {
    setMounted(true);
    const role = localStorage.getItem("userRole");
    console.log("User Role:", role);
    setUserRole(role);

    if (role !== "admin" && role !== "hr-manager") {
      toast({
        title: "Quyền truy cập bị từ chối",
        description: "Bạn không có quyền truy cập trang này.",
        variant: "destructive",
      });
      router.push("/dashboard");
    }

    loadDepartments();
    loadPositions();
  }, [router, toast]);

  // Load departments from API
  const loadDepartments = async () => {
    setIsLoading(true);
    try {
      const data = await fetchDepartments();
      setDepartments(data);
      console.log("Updated departments state:", data);
    } catch (error: any) {
      console.error("Load departments failed:", error);
      if (error.message.includes("401")) {
        toast({
          title: "Lỗi Xác Thực",
          description: "Vui lòng đăng nhập lại để tiếp tục.",
          variant: "destructive",
        });
        router.push("/login");
      } else {
        toast({
          title: "Lỗi",
          description: `Không thể tải danh sách phòng ban: ${error.message}`,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Load positions from API
  const loadPositions = async () => {
    setIsLoading(true);
    try {
      const data = await fetchPositions();
      setPositions(data);
      console.log("Updated positions state:", data);
    } catch (error: any) {
      console.error("Load positions failed:", error);
      if (error.message.includes("401")) {
        toast({
          title: "Lỗi Xác Thực",
          description: "Vui lòng đăng nhập lại để tiếp tục.",
          variant: "destructive",
        });
        router.push("/login");
      } else {
        toast({
          title: "Lỗi",
          description: `Không thể tải danh sách vị trí: ${error.message}`,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Load position distribution for each position
  const loadPositionDistribution = async (positionId: number) => {
    setIsLoading(true);
    try {
      const data = await fetchPositionDistribution(positionId);
      setPositionDistributions((prev) => ({
        ...prev,
        [positionId]: data,
      }));
    } catch (error: any) {
      console.error(
        `Load distribution for position ${positionId} failed:`,
        error
      );
      setPositionDistributions((prev) => ({
        ...prev,
        [positionId]: [],
      }));
      toast({
        title: "Lỗi",
        description: `Không thể tải phân bổ vị trí ${positionId}: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    positions.forEach((position) => {
      if (position.PositionID && !positionDistributions[position.PositionID]) {
        loadPositionDistribution(position.PositionID);
      }
    });
  }, [positions]);

  const handleAddDepartment = async () => {
    if (newDepartment.DepartmentName) {
      setIsLoading(true);
      try {
        const now = currentTime;
        await addDepartment({
          ...newDepartment,
          CreatedAt: now,
          UpdatedAt: now,
        });
        setNewDepartment({
          DepartmentName: "",
          CreatedAt: now,
          UpdatedAt: now,
        });
        setIsAddDialogOpen(false);
        loadDepartments();
        toast({
          title: "Đã thêm phòng ban",
          description: `${newDepartment.DepartmentName} đã được thêm thành công`,
        });
      } catch (error: any) {
        console.error("Add department error:", error);
        toast({
          title: "Lỗi",
          description: `Không thể thêm phòng ban: ${error.message}`,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      toast({
        title: "Lỗi",
        description: "Tên phòng ban không được để trống.",
        variant: "destructive",
      });
    }
  };

  const handleEditDepartment = async () => {
    if (
      editDepartment?.id &&
      Number.isInteger(editDepartment.id) &&
      editDepartment.DepartmentName
    ) {
      setIsLoading(true);
      try {
        await updateDepartment(editDepartment.id, {
          DepartmentName: editDepartment.DepartmentName,
          UpdatedAt: currentTime,
        });
        setIsEditDialogOpen(false);
        loadDepartments();
        toast({
          title: "Đã cập nhật phòng ban",
          description: `${editDepartment.DepartmentName} đã được cập nhật thành công`,
        });
      } catch (error: any) {
        console.error("Edit department error:", error);
        toast({
          title: "Lỗi",
          description: `Không thể cập nhật phòng ban: ${error.message}`,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      toast({
        title: "Lỗi",
        description: "Tên phòng ban hoặc ID không hợp lệ.",
        variant: "destructive",
      });
    }
  };

  const handleAddPosition = async () => {
    if (newPosition.PositionName) {
      setIsLoading(true);
      try {
        const now = currentTime;
        await addPosition({
          ...newPosition,
          CreatedAt: now,
          UpdatedAt: now,
        });
        setNewPosition({
          PositionName: "",
          CreatedAt: now,
          UpdatedAt: now,
        });
        setIsAddDialogOpen(false);
        loadPositions();
        toast({
          title: "Đã thêm vị trí",
          description: `${newPosition.PositionName} đã được thêm thành công`,
        });
      } catch (error: any) {
        console.error("Add position error:", error);
        toast({
          title: "Lỗi",
          description: `Không thể thêm vị trí: ${error.message}`,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      toast({
        title: "Lỗi",
        description: "Tên vị trí không được để trống.",
        variant: "destructive",
      });
    }
  };

  const handleEditPosition = async () => {
    if (
      editPosition?.PositionID &&
      Number.isInteger(editPosition.PositionID) &&
      editPosition.PositionName
    ) {
      setIsLoading(true);
      try {
        await updatePosition(editPosition.PositionID, {
          PositionName: editPosition.PositionName,
          UpdatedAt: currentTime,
        });
        setIsEditDialogOpen(false);
        loadPositions();
        toast({
          title: "Đã cập nhật vị trí",
          description: `${editPosition.PositionName} đã được cập nhật thành công`,
        });
      } catch (error: any) {
        console.error("Edit position error:", error);
        toast({
          title: "Lỗi",
          description: `Không thể cập nhật vị trí: ${error.message}`,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      toast({
        title: "Lỗi",
        description: "Tên vị trí hoặc ID không hợp lệ.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteItem = async () => {
    if (!selectedItem) {
      toast({
        title: "Lỗi",
        description: "Không có mục nào được chọn để xóa.",
        variant: "destructive",
      });
      setIsDeleteDialogOpen(false);
      return;
    }

    setIsLoading(true);
    if (activeTab === "departments") {
      const departmentId = selectedItem.id;
      if (!departmentId || !Number.isInteger(departmentId)) {
        toast({
          title: "Lỗi",
          description: "ID phòng ban không hợp lệ, phải là một số nguyên.",
          variant: "destructive",
        });
        setIsLoading(false);
        setIsDeleteDialogOpen(false);
        return;
      }

      try {
        await deleteDepartment(departmentId);
        loadDepartments();
        toast({
          title: "Đã xóa phòng ban",
          description: `${selectedItem.DepartmentName} đã được xóa thành công`,
          variant: "destructive",
        });
      } catch (error: any) {
        console.error("Delete department failed:", error);
        toast({
          title: "Lỗi",
          description: `Không thể xóa phòng ban: ${error.message}`,
          variant: "destructive",
        });
      }
    } else {
      const positionId = selectedItem.PositionID;
      if (!positionId || !Number.isInteger(positionId)) {
        toast({
          title: "Lỗi",
          description: "ID vị trí không hợp lệ, phải là một số nguyên.",
          variant: "destructive",
        });
        setIsLoading(false);
        setIsDeleteDialogOpen(false);
        return;
      }

      try {
        await deletePosition(positionId);
        loadPositions();
        toast({
          title: "Đã xóa vị trí",
          description: `${selectedItem.PositionName} đã được xóa thành công`,
          variant: "destructive",
        });
      } catch (error: any) {
        console.error("Delete position failed:", error);
        toast({
          title: "Lỗi",
          description: `Không thể xóa vị trí: ${error.message}`,
          variant: "destructive",
        });
      }
    }
    setIsDeleteDialogOpen(false);
    setIsLoading(false);
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
          {t("departments.title")}
        </h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              {activeTab === "departments"
                ? t("departments.addDepartment")
                : t("departments.addJobTitle")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-white">
                {activeTab === "departments"
                  ? t("departments.addDepartment")
                  : t("departments.addJobTitle")}
              </DialogTitle>
              <DialogDescription className="text-blue-300">
                {activeTab === "departments"
                  ? "Điền thông tin để tạo phòng ban mới."
                  : "Điền thông tin để tạo vị trí mới."}
              </DialogDescription>
            </DialogHeader>
            {isLoading ? (
              <div className="flex justify-center items-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
              </div>
            ) : activeTab === "departments" ? (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-blue-300">
                    {t("departments.departmentName")}
                  </Label>
                  <Input
                    id="name"
                    value={newDepartment.DepartmentName}
                    onChange={(e) =>
                      setNewDepartment((prev) => ({
                        ...prev,
                        DepartmentName: e.target.value,
                      }))
                    }
                    placeholder={t("departments.departmentName")}
                    className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="createdAt" className="text-blue-300">
                    {t("departments.createdAt")}
                  </Label>
                  <Input
                    id="createdAt"
                    value={newDepartment.CreatedAt}
                    onChange={(e) =>
                      setNewDepartment((prev) => ({
                        ...prev,
                        CreatedAt: e.target.value,
                      }))
                    }
                    placeholder={t("departments.createdAt")}
                    className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                    type="datetime-local"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="updatedAt" className="text-blue-300">
                    {t("departments.updatedAt")}
                  </Label>
                  <Input
                    id="updatedAt"
                    value={newDepartment.UpdatedAt}
                    onChange={(e) =>
                      setNewDepartment((prev) => ({
                        ...prev,
                        UpdatedAt: e.target.value,
                      }))
                    }
                    placeholder={t("departments.updatedAt")}
                    className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                    type="datetime-local"
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
                    value={newPosition.PositionName}
                    onChange={(e) =>
                      setNewPosition((prev) => ({
                        ...prev,
                        PositionName: e.target.value,
                      }))
                    }
                    placeholder={t("departments.jobTitle")}
                    className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="createdAt" className="text-blue-300">
                    {t("departments.createdAt")}
                  </Label>
                  <Input
                    id="createdAt"
                    value={newPosition.CreatedAt}
                    onChange={(e) =>
                      setNewPosition((prev) => ({
                        ...prev,
                        CreatedAt: e.target.value,
                      }))
                    }
                    placeholder={t("departments.createdAt")}
                    className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                    type="datetime-local"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="updatedAt" className="text-blue-300">
                    {t("departments.updatedAt")}
                  </Label>
                  <Input
                    id="updatedAt"
                    value={newPosition.UpdatedAt}
                    onChange={(e) =>
                      setNewPosition((prev) => ({
                        ...prev,
                        UpdatedAt: e.target.value,
                      }))
                    }
                    placeholder={t("departments.updatedAt")}
                    className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                    type="datetime-local"
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                className="border-slate-700 text-blue-300 hover:bg-slate-800"
              >
                {t("common.cancel")}
              </Button>
              <Button
                onClick={
                  activeTab === "departments"
                    ? handleAddDepartment
                    : handleAddPosition
                }
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
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
              <CardTitle className="text-white">
                {t("departments.organizationStructure")}
              </CardTitle>
              <CardDescription className="text-blue-300">
                {t("departments.organizationStructure")}
              </CardDescription>
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
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
              <span className="ml-2 text-slate-400">Đang tải dữ liệu...</span>
            </div>
          ) : activeTab === "departments" ? (
            <div className="rounded-md border border-slate-700">
              <Table>
                <TableHeader className="bg-slate-800">
                  <TableRow className="hover:bg-slate-800/50 border-slate-700">
                    <TableHead className="text-blue-300">
                      {t("departments.id")}
                    </TableHead>
                    <TableHead className="text-blue-300">
                      {t("departments.departmentName")}
                    </TableHead>
                    <TableHead className="text-blue-300">
                      {t("departments.createdAt")}
                    </TableHead>
                    <TableHead className="text-blue-300">
                      {t("departments.updatedAt")}
                    </TableHead>
                    <TableHead className="text-right text-blue-300">
                      {t("common.actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.length === 0 ? (
                    <TableRow className="hover:bg-slate-808/50 border-slate-700">
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-slate-400"
                      >
                        {t("departments.noDepartments")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    departments.map((department) => (
                      <TableRow
                        key={department.id || Math.random()}
                        className="hover:bg-slate-800/50 border-slate-700"
                      >
                        <TableCell className="text-slate-300">
                          {department.id ?? "N/A"}
                        </TableCell>
                        <TableCell className="font-medium text-white">
                          {department.DepartmentName}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {new Date(department.CreatedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {new Date(department.UpdatedAt).toLocaleDateString()}
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
                                onClick={() => {
                                  setEditDepartment(department);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                {t("departments.editDepartment")}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-slate-800" />
                              <DropdownMenuItem
                                className="text-red-400 focus:bg-red-900/50 focus:text-red-300"
                                onClick={() => {
                                  setSelectedItem(department);
                                  setIsDeleteDialogOpen(true);
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
                    <TableHead className="text-blue-300">
                      {t("departments.id")}
                    </TableHead>
                    <TableHead className="text-blue-300">
                      {t("departments.jobTitle")}
                    </TableHead>
                    <TableHead className="text-blue-300">
                      {t("departments.distribution")}
                    </TableHead>
                    <TableHead className="text-blue-300">
                      {t("departments.totalEmployees")}
                    </TableHead>
                    <TableHead className="text-blue-300">
                      {t("departments.createdAt")}
                    </TableHead>
                    <TableHead className="text-blue-300">
                      {t("departments.updatedAt")}
                    </TableHead>
                    <TableHead className="text-right text-blue-300">
                      {t("common.actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {positions.length === 0 ? (
                    <TableRow className="hover:bg-slate-800/50 border-slate-700">
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-slate-400"
                      >
                        {t("departments.noJobTitles")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    positions.map((position) => {
                      const distribution =
                        position.PositionID &&
                        Array.isArray(
                          positionDistributions[position.PositionID]
                        )
                          ? positionDistributions[position.PositionID]
                          : [];
                      const distributionList =
                        distribution.length > 0
                          ? distribution
                              .map(
                                (dist) =>
                                  `${dist.department} (${dist.employeeCount})`
                              )
                              .join(", ")
                          : "N/A";
                      return (
                        <TableRow
                          key={position.PositionID || Math.random()}
                          className="hover:bg-slate-800/50 border-slate-700"
                        >
                          <TableCell className="text-slate-300">
                            {position.PositionID ?? "N/A"}
                          </TableCell>
                          <TableCell className="font-medium text-white">
                            {position.PositionName}
                          </TableCell>
                          <TableCell className="text-slate-300">
                            {distributionList}
                          </TableCell>
                          <TableCell className="text-slate-300">
                            {position.TotalEmployees}
                          </TableCell>
                          <TableCell className="text-slate-300">
                            {new Date(position.CreatedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-slate-300">
                            {new Date(position.UpdatedAt).toLocaleDateString()}
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
                                  onClick={() => {
                                    setEditPosition(position);
                                    setIsEditDialogOpen(true);
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  {t("departments.editJobTitle")}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-slate-800" />
                                <DropdownMenuItem
                                  className="text-red-400 focus:bg-red-900/50 focus:text-red-300"
                                  onClick={() => {
                                    setSelectedItem(position);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  {t("departments.deleteJobTitle")}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">
              {activeTab === "departments"
                ? t("departments.editDepartment")
                : t("departments.editJobTitle")}
            </DialogTitle>
            <DialogDescription className="text-blue-300">
              {activeTab === "departments"
                ? "Cập nhật thông tin cho phòng ban này."
                : "Cập nhật thông tin cho vị trí này."}
            </DialogDescription>
          </DialogHeader>
          {isLoading ? (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
            </div>
          ) : activeTab === "departments" ? (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name" className="text-blue-300">
                  {t("departments.departmentName")}
                </Label>
                <Input
                  id="edit-name"
                  value={editDepartment?.DepartmentName || ""}
                  onChange={(e) =>
                    setEditDepartment((prev) =>
                      prev ? { ...prev, DepartmentName: e.target.value } : null
                    )
                  }
                  placeholder={t("departments.departmentName")}
                  className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-updatedAt" className="text-blue-300">
                  {t("departments.updatedAt")}
                </Label>
                <Input
                  id="edit-updatedAt"
                  value={editDepartment?.UpdatedAt || currentTime}
                  onChange={(e) =>
                    setEditDepartment((prev) =>
                      prev ? { ...prev, UpdatedAt: e.target.value } : null
                    )
                  }
                  placeholder={t("departments.updatedAt")}
                  className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                  type="datetime-local"
                />
              </div>
            </div>
          ) : (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title" className="text-blue-300">
                  {t("departments.jobTitle")}
                </Label>
                <Input
                  id="edit-title"
                  value={editPosition?.PositionName || ""}
                  onChange={(e) =>
                    setEditPosition((prev) =>
                      prev ? { ...prev, PositionName: e.target.value } : null
                    )
                  }
                  placeholder={t("departments.jobTitle")}
                  className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-updatedAt" className="text-blue-300">
                  {t("departments.updatedAt")}
                </Label>
                <Input
                  id="edit-updatedAt"
                  value={editPosition?.UpdatedAt || currentTime}
                  onChange={(e) =>
                    setEditPosition((prev) =>
                      prev ? { ...prev, UpdatedAt: e.target.value } : null
                    )
                  }
                  placeholder={t("departments.updatedAt")}
                  className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                  type="datetime-local"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="border-slate-700 text-blue-300 hover:bg-slate-800"
            >
              {t("common.cancel")}
            </Button>
            <Button
              onClick={
                activeTab === "departments"
                  ? handleEditDepartment
                  : handleEditPosition
              }
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {t("common.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Xác nhận xóa</DialogTitle>
            <DialogDescription className="text-blue-300">
              Bạn có chắc chắn muốn xóa{" "}
              {activeTab === "departments" ? "phòng ban" : "vị trí"} này? Hành
              động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          {isLoading ? (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
            </div>
          ) : selectedItem ? (
            <div className="py-4">
              <div className="rounded-md border border-slate-700 p-4 bg-slate-800/50">
                <div className="space-y-1">
                  <p className="text-white font-medium">
                    {activeTab === "departments"
                      ? selectedItem.DepartmentName
                      : selectedItem.PositionName}
                  </p>
                  {activeTab === "departments" ? (
                    <>
                      <p className="text-sm text-slate-400">
                        {t("departments.createdAt")}:{" "}
                        {new Date(selectedItem.CreatedAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-slate-400">
                        {t("departments.updatedAt")}:{" "}
                        {new Date(selectedItem.UpdatedAt).toLocaleDateString()}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-slate-400">
                        {`Phân bổ: ${
                          selectedItem.PositionID &&
                          Array.isArray(
                            positionDistributions[selectedItem.PositionID]
                          )
                            ? positionDistributions[selectedItem.PositionID]
                                .map(
                                  (dist: PositionDistribution) =>
                                    `${dist.department} (${dist.employeeCount})`
                                )
                                .join(", ")
                            : "N/A"
                        }`}
                      </p>
                      <p className="text-sm text-slate-400">
                        {`Tổng số nhân viên: ${selectedItem.TotalEmployees}`}
                      </p>
                      <p className="text-sm text-slate-400">
                        {t("departments.createdAt")}:{" "}
                        {new Date(selectedItem.CreatedAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-slate-400">
                        {t("departments.updatedAt")}:{" "}
                        {new Date(selectedItem.UpdatedAt).toLocaleDateString()}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-slate-700 text-blue-300 hover:bg-slate-800"
            >
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleDeleteItem}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Xóa {activeTab === "departments" ? "Phòng ban" : "Vị trí"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
