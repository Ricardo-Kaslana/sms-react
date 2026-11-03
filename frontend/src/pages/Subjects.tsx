import React, { useState, useEffect, useCallback } from "react";
import { generatePagination } from "@/lib/pagination";
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
import { Search, Trash2, BookOpen, GraduationCap, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast"; // 使用自定义的toast
// 导入API函数和类型
import { getSubjectPageApi, deleteSubjectApi, Page } from "@/services/api";
// 导入弹窗组件
import AddSubjectDialog from "@/components/subjects/AddSubjectDialog";
import EditSubjectDialog from "@/components/subjects/EditSubjectDialog";

// 定义与后端 t_subject 实体对应的类型
interface Subject {
  id: number;
  name: string;
  credits: number;
  createTime: string;
}

const Subjects = () => {
  // --- 状态管理 ---
  const [subjects, setSubjects] = useState<Subject[]>([]);
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
  });

  // --- API调用逻辑 ---

  const fetchSubjects = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getSubjectPageApi(queryParams);
      if (response.data.code === 200) {
        const pageData: Page<Subject> = response.data.data;
        setSubjects(pageData.records);
        setPagination({
          current: pageData.current,
          size: pageData.size,
          total: pageData.total,
          pages: pageData.pages,
        });
      } else {
        toast({
          title: "获取科目列表失败",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "获取科目列表失败",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  // --- 事件处理函数 ---
  const handlePageChange = (newPage: number) => {
    setQueryParams((prev) => ({ ...prev, current: newPage }));
  };

  const handleSearch = () => {
    setQueryParams((prev) => ({ ...prev, current: 1 }));
  };

  // 新增/编辑成功后的回调函数
  const handleSuccess = () => {
    fetchSubjects();
  };

  const handleDelete = async (id: number) => {
    if (confirm("确定要删除这个科目吗？")) {
      setLoading(true);
      try {
        const response = await deleteSubjectApi(id);
        if (response.data.code === 200) {
          toast({
            title: "删除成功",
            description: "该科目已被成功删除",
          });
          fetchSubjects();
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
                <BookOpen className="h-6 w-6 text-teal-600" />
                科目管理
              </CardTitle>
              {/* 传递onSuccess回调函数给子组件 */}
              <AddSubjectDialog onSuccess={handleSuccess} />
            </div>
            <CardDescription>管理所有课程科目信息。</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardContent className="p-4 flex gap-4 shadow-lg">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="按科目名称搜索..."
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
          <CardHeader className="bg-gradient-to-r from-gray-50 to-emerald-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <BookOpen className="h-5 w-5 text-emerald-600" />
              科目列表
            </CardTitle>
            <CardDescription>
              共 {pagination.total} 门科目，当前显示第{" "}
              {(pagination.current - 1) * pagination.size + 1} -{" "}
              {Math.min(pagination.current * pagination.size, pagination.total)}{" "}
              门
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
              </div>
            ) : (
              <Table>
                {/* 修改表头 */}
                <TableHeader>
                  <TableRow>
                    <TableHead>科目名称</TableHead>
                    <TableHead>学分</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subjects.map((subject) => (
                    <TableRow key={subject.id}>
                                          <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg">
                          <BookOpen className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{subject.name}</div>
                        </div>
                      </div>
                    </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <GraduationCap className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{subject.credits}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(subject.createTime).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {/* 传递 subject 和 onSuccess 回调函数给子组件 */}
                          <EditSubjectDialog
                            subject={subject}
                            onSuccess={handleSuccess}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(subject.id)}
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
      </div>
    </div>
  );
};

export default Subjects;
