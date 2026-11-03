import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Users, Plus, Search, Edit, Trash2, Eye, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast"; // 使用自定义的toast

// 导入API函数和类型
import {
  getStudentPageApi,
  addStudentApi,
  updateStudentApi,
  deleteStudentApi,
  getClassListApi,
  Page,
} from "@/services/api";
import { generatePagination } from "@/lib/pagination";

// 定义更精确的类型，与后端VO对应
interface StudentVO {
  id: number;
  studentNo: string;
  name: string;
  gender: "男" | "女";
  classId: number;
  className: string;
  createTime: string;
}

interface Class {
  id: number;
  name: string;
}

// 定义表单数据类型
type StudentFormData = {
  id?: number;
  studentNo: string;
  name: string;
  gender: string;
  classId: number | null;
};

const Students = () => {
  // --- 状态管理 ---
  const [students, setStudents] = useState<StudentVO[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    size: 10,
    total: 0,
    pages: 1,
  });
  const [loading, setLoading] = useState(true);

  // 查询参数状态
  const [queryParams, setQueryParams] = useState({
    current: 1,
    size: 10,
    name: "",
    classId: undefined as number | undefined,
  });

  // 弹窗状态
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  // 新增状态
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewStudent, setViewStudent] = useState<StudentVO | null>(null);

  // 表单数据状态
  const [formData, setFormData] = useState<StudentFormData>({
    studentNo: "",
    name: "",
    gender: "",
    classId: null,
  });

  // --- API调用逻辑 ---

  // 获取学生分页数据的函数
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getStudentPageApi(queryParams);
      if (response.data.code === 200) {
        const pageData: Page<StudentVO> = response.data.data;
        setStudents(pageData.records);
        setPagination({
          current: pageData.current,
          size: pageData.size,
          total: pageData.total,
          pages: pageData.pages,
        });
      } else {
        toast({
          title: "获取学生列表失败",
          description: response.data.message,
        });
      }
    } catch (error) {
      toast({
        title: "获取学生列表失败",
        description: "获取学生列表失败，请重试",
      });
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  // 获取班级列表的函数
  const fetchClasses = useCallback(async () => {
    try {
      const response = await getClassListApi();
      if (response.data.code === 200) {
        setClasses(response.data.data);
      } else {
        toast({
          title: "获取班级列表失败",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "获取班级列表失败",
        description: "获取班级列表失败，请重试",
        variant: "destructive",
      });
    }
  }, []);

  // 页面加载时获取数据
  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, [fetchStudents, fetchClasses]);

  // --- 事件处理函数 ---

  // 处理搜索/筛选条件变化
  const handleSearch = () => {
    setQueryParams((prev) => ({ ...prev, current: 1 })); // 搜索时重置到第一页
    // 这里依赖useEffect来触发fetchStudents，所以不需要直接调用
  };

  // 处理翻页
  const handlePageChange = (newPage: number) => {
    setQueryParams((prev) => ({ ...prev, current: newPage }));
  };

  // 打开编辑弹窗
  const handleEditOpen = (student: StudentVO) => {
    setFormData({
      id: student.id,
      studentNo: student.studentNo,
      name: student.name,
      gender: student.gender,
      classId: student.classId,
    });
    setIsEditDialogOpen(true);
  };

  // 打开新增弹窗 (重置表单)
  const handleAddOpen = () => {
    setFormData({ studentNo: "", name: "", gender: "", classId: null });
    setIsAddDialogOpen(true);
  };

  // 统一处理表单提交 (新增/编辑)
  const handleSubmit = async () => {
    if (
      !formData.studentNo ||
      !formData.name ||
      !formData.gender ||
      formData.classId === null
    ) {
      toast({
        title: "请填写所有必填项",
        description: "请填写所有必填项，包括学号、姓名、性别和班级",
      });
      return;
    }

    setLoading(true);
    try {
      const apiCall = formData.id ? updateStudentApi : addStudentApi;
      const response = await apiCall(formData);

      if (response.data.code === 200) {
        toast({
          title: formData.id ? "修改成功" : "添加成功",
          description: response.data.message,
        });
        setIsAddDialogOpen(false);
        setIsEditDialogOpen(false);
        fetchStudents(); // 重新获取数据
      } else {
        toast({
          title: formData.id ? "修改失败" : "添加失败",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: formData.id ? "修改失败" : "添加失败",
        description: "添加失败，请重试",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // 删除学生
  const handleDelete = async (id: number) => {
    if (confirm("确定要删除这个学生吗？这会同步删除该学生的全部成绩记录，此操作不可逆！")) {
      setLoading(true);
      try {
        const response = await deleteStudentApi(id);
        if (response.data.code === 200) {
          toast({
            title: "删除成功",
            description: response.data.message,
          });
          // 如果删除的是当前页最后一条数据，则需要考虑回到上一页
          if (students.length === 1 && pagination.current > 1) {
            setQueryParams((prev) => ({ ...prev, current: prev.current - 1 }));
          } else {
            fetchStudents();
          }
        } else {
          toast({
            title: "删除失败",
            description: response.data.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "删除失败",
          description: "删除失败，请重试",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // 修改handleView函数 查看详情
  const handleView = (student: StudentVO) => {
    setViewStudent(student);
    setIsViewDialogOpen(true);
  };

  // --- 辅助渲染函数 ---
  const getGenderBadge = (gender: string) => {
    return gender === "男" ? (
      <Badge className="bg-blue-100 text-blue-700 border-blue-200">男</Badge>
    ) : (
      <Badge className="bg-pink-100 text-pink-700 border-pink-200">女</Badge>
    );
  };

  // 渲染分页器
  const renderPagination = () => {
    if (pagination.pages <= 1) return null;

    // 调用工具函数生成要显示的页码数组
    const pageNumbers = generatePagination(
      pagination.current,
      pagination.pages
    );

    return (
      <div className="mt-6 flex justify-center pb-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (pagination.current > 1)
                    handlePageChange(pagination.current - 1);
                }}
                className={
                  pagination.current === 1
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>

            {/* 遍历页码数组来渲染 */}
            {pageNumbers.map((page, index) =>
              typeof page === "number" ? (
                <PaginationItem key={index}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(page);
                    }}
                    isActive={pagination.current === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ) : (
                <PaginationItem key={index}>
                  <span className="px-2">...</span>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (pagination.current < pagination.pages)
                    handlePageChange(pagination.current + 1);
                }}
                className={
                  pagination.current === pagination.pages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  };

  // 渲染新增/编辑弹窗的公共内容
  const renderFormDialog = () => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="studentNo" className="text-right">
          学号
        </Label>
        <Input
          id="studentNo"
          className="col-span-3"
          value={formData.studentNo}
          onChange={(e) =>
            setFormData({ ...formData, studentNo: e.target.value })
          }
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          姓名
        </Label>
        <Input
          id="name"
          className="col-span-3"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="gender" className="text-right">
          性别
        </Label>
        <Select
          value={formData.gender}
          onValueChange={(value) => setFormData({ ...formData, gender: value })}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="选择性别" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="男">男</SelectItem>
            <SelectItem value="女">女</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="className" className="text-right">
          班级
        </Label>
        <Select
          value={formData.classId?.toString()}
          onValueChange={(value) =>
            setFormData({ ...formData, classId: Number(value) })
          }
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="选择班级" />
          </SelectTrigger>
          <SelectContent>
            {classes.map((cls) => (
              <SelectItem key={cls.id} value={cls.id.toString()}>
                {cls.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Card */}
        <Card className="w-full md:w-auto border-0 shadow-lg bg-white">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-blue-500" />
                学生管理
              </CardTitle>
              <Button
                onClick={handleAddOpen}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="mr-2 h-4 w-4" /> 添加学生
              </Button>
            </div>
            <CardDescription>管理所有学生的档案信息。</CardDescription>
          </CardHeader>
        </Card>

        <Card className="w-full md:w-auto border-0 shadow-lg bg-white">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">总学生数</p>
              {/* 使用从后端获取的总数 */}
              <p className="text-2xl font-bold text-gray-900">
                {pagination.total}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        {/* Filter Card */}
        {/* --- 操作与筛选区域 --- */}
        <Card>
          <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center shadow-lg">
            <div className="w-full md:w-auto flex-grow relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="搜索学生姓名或学号..."
                className="pl-10 w-full"
                value={queryParams.name}
                onChange={(e) =>
                  setQueryParams((prev) => ({ ...prev, name: e.target.value }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") fetchStudents();
                }}
              />
            </div>
            <Select
              value={queryParams.classId?.toString() ?? ""}
              onValueChange={(value) =>
                setQueryParams((prev) => ({
                  ...prev,
                  classId: value === "all" ? undefined : Number(value), // 增加 "all" 选项
                  current: 1,
                }))
              }
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="所有班级" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有班级</SelectItem>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id.toString()}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() => fetchStudents()}
              className="w-full md:w-auto"
            >
              搜索
            </Button>
          </CardContent>
        </Card>

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>学生详情</DialogTitle>
            </DialogHeader>
            {viewStudent && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">学号</Label>
                  <div className="col-span-3">{viewStudent.studentNo}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">姓名</Label>
                  <div className="col-span-3">{viewStudent.name}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">性别</Label>
                  <div className="col-span-3">{viewStudent.gender}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">班级</Label>
                  <div className="col-span-3">{viewStudent.className}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">创建时间</Label>
                  <div className="col-span-3">
                    {new Date(viewStudent.createTime).toLocaleString()}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setIsViewDialogOpen(false)}>关闭</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Table Card */}
        {/* --- 学生列表区域 --- */}
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Users className="h-5 w-5 text-blue-600" />
              学生列表
            </CardTitle>
            <CardDescription>
              共 {pagination.total} 名学生，当前显示第{" "}
              {(pagination.current - 1) * pagination.size + 1} -{" "}
              {Math.min(pagination.current * pagination.size, pagination.total)}{" "}
              名
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {/* Table 部分保持不变 */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : (
              <Table>
                {/* TableHeader 和 TableBody */}
                <TableHeader>
                  <TableRow>
                    <TableHead>学号</TableHead>
                    <TableHead>姓名</TableHead>
                    <TableHead>性别</TableHead>
                    <TableHead>班级</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.studentNo}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg">
                            <Users className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="font-medium text-gray-900">
                            {student.name}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getGenderBadge(student.gender)}</TableCell>
                      <TableCell>{student.className}</TableCell>
                      <TableCell>
                        {new Date(student.createTime).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleView(student)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditOpen(student)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(student.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {renderPagination()}
          </CardContent>
        </Card>
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加新学生</DialogTitle>
          </DialogHeader>
          {renderFormDialog()}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSubmit}>确定</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑学生信息</DialogTitle>
          </DialogHeader>
          {renderFormDialog()}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              取消
            </Button>
            <Button onClick={handleSubmit}>保存</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Students;
