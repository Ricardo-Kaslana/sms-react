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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  School,
  Loader2,
  BookOpen,
} from "lucide-react";
import { toast } from "@/hooks/use-toast"; // 使用自定义的toast
// 导入API函数和类型
import {
  getClassPageApi,
  addClassApi,
  updateClassApi,
  deleteClassApi,
  Page,
} from "@/services/api";
import { generatePagination } from "@/lib/pagination";

// 定义与后端 t_class 实体对应的类型
interface TClass {
  id: number;
  name: string;
  createTime: string;
  updateTime: string;
}

// 定义表单数据类型
type ClassFormData = {
  id?: number;
  name: string;
};

const Classes = () => {
  // --- 状态管理 ---
  const [classes, setClasses] = useState<TClass[]>([]);
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
    size: 8, // 保持与原设计一致
    name: "",
  });

  // 弹窗状态
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 表单数据状态
  const [formData, setFormData] = useState<ClassFormData>({ name: "" });

  // --- API调用逻辑 ---

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getClassPageApi(queryParams);
      if (response.data.code === 200) {
        const pageData: Page<TClass> = response.data.data;
        setClasses(pageData.records);
        setPagination({
          current: pageData.current,
          size: pageData.size,
          total: pageData.total,
          pages: pageData.pages,
        });
      } else {
        toast({
          title: "获取失败",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "获取失败",
        description: "获取班级列表失败",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  // --- 事件处理函数 ---
  const handlePageChange = (newPage: number) => {
    setQueryParams((prev) => ({ ...prev, current: newPage }));
  };

  const handleSearch = () => {
    setQueryParams((prev) => ({ ...prev, current: 1 }));
  };

  const handleOpenDialog = (cls?: TClass) => {
    if (cls) {
      // 编辑模式
      setFormData({ id: cls.id, name: cls.name });
    } else {
      // 新增模式
      setFormData({ name: "" });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      toast({
        title: "失败",
        description: "班级名称不能为空",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const apiCall = formData.id ? updateClassApi : addClassApi;
      const response = await apiCall(formData);
      if (response.data.code === 200) {
        toast({
          title: "成功",
          description: formData.id ? "修改成功" : "新增成功",
        });
        setIsDialogOpen(false);
        fetchClasses();
      } else {
        toast({
          title: "失败",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "失败",
        description: formData.id ? "修改失败" : "新增失败",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (
      confirm(
        "确定要删除这个班级吗？删除后，该班级下的所有学生和成绩信息也将被删除！"
      )
    ) {
      setLoading(true);
      try {
        const response = await deleteClassApi(id);
        if (response.data.code === 200) {
          toast({
            title: "成功",
            description: "删除成功",
          });
          if (classes.length === 1 && pagination.current > 1) {
            handlePageChange(pagination.current - 1);
          } else {
            fetchClasses();
          }
        } else {
          toast({
            title: "失败",
            description: response.data.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "失败",
          description: "删除失败",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // 渲染分页器
  const renderPagination = () => {
    if (pagination.pages <= 1) return null;

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 头部和统计卡片 */}
        <Card className="w-full md:w-auto border-0 shadow-lg bg-white">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <School className="h-6 w-6 text-orange-500" />
                班级管理
              </CardTitle>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" /> 新增班级
              </Button>
            </div>
            <CardDescription>管理学校的所有班级信息。</CardDescription>
          </CardHeader>
        </Card>

        {/* 统计卡片，只保留一个总数 */}
        <Card className="w-full md:w-auto border-0 shadow-lg bg-white">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">总班级数</p>
              <p className="text-3xl font-bold text-gray-900">
                {pagination.total}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <BookOpen className="h-6 w-6 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        {/* 简化筛选区域 */}
        <Card>
          <CardContent className="p-4 flex gap-4 shadow-lg">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="按班级名称搜索..."
                value={queryParams.name}
                onChange={(e) =>
                  setQueryParams((prev) => ({ ...prev, name: e.target.value }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch}>搜索</Button>
          </CardContent>
        </Card>

        <Card className="w-full md:w-auto border-0 shadow-lg bg-white">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-amber-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <School className="h-5 w-5 text-amber-600" />
              班级列表
            </CardTitle>
            <CardDescription>
              共 {pagination.total} 个班级，当前显示第{" "}
              {(pagination.current - 1) * pagination.size + 1} -{" "}
              {Math.min(pagination.current * pagination.size, pagination.total)}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
              </div>
            ) : (
              <Table>
                {/* 表头以匹配后端数据 */}
                <TableHeader>
                  <TableRow>
                    <TableHead>班级名称</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead>更新时间</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classes.map((cls) => (
                    <TableRow key={cls.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg">
                            <School className="h-5 w-5 text-amber-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {cls.name}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(cls.createTime).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {new Date(cls.updateTime).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDialog(cls)}
                          >
                            <Edit className="h-3 w-3 mr-1" /> 编辑
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(cls.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3 mr-1" /> 删除
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

        {/* 统一使用一个Dialog，并简化表单 */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{formData.id ? "编辑班级" : "新增班级"}</DialogTitle>
              <DialogDescription>
                {formData.id ? "修改班级名称。" : "填写新的班级名称。"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  班级名称
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="例如：高一(1)班"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleSubmit}>
                {formData.id ? "保存修改" : "创建班级"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Classes;
