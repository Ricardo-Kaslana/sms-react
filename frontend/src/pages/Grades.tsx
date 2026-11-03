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
  Loader2,
  Search,
  Filter,
  Trash2,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import { toast } from "@/hooks/use-toast"; // 使用自定义的toast

// API
import {
  getStudentListApi,
  getGradePageApi,
  deleteGradeApi,
  Page,
  getClassListApi,
  getSubjectListApi,
} from "@/services/api";

// 定义学生列表的类型
interface Student {
  id: number;
  name: string;
  studentNo: string;
}

// 子组件
import AddGradeDialog from "@/components/grades/AddGradeDialog";
import EditGradeDialog from "@/components/grades/EditGradeDialog";

// 类型定义
export interface GradeVO {
  id: number;
  studentId: number;
  subjectId: number;
  score: number;
  term: string;
  studentName: string;
  studentNo: string;
  subjectName: string;
  className: string;
  createTime: string;
}
interface Class {
  id: number;
  name: string;
}
interface Subject {
  id: number;
  name: string;
}

const Grades = () => {
  // --- 状态管理 ---
  const [allStudents, setAllStudents] = useState<Student[]>([]); // 新增状态，存储所有学生
  const [grades, setGrades] = useState<GradeVO[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    size: 10,
    total: 0,
    pages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [queryParams, setQueryParams] = useState({
    current: 1,
    size: 10,
    term: "",
    studentName: "",
    subjectId: undefined as number | undefined,
    classId: undefined as number | undefined,
  });

  // --- API 调用 ---
  const fetchGrades = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getGradePageApi(queryParams);
      if (response.data.code === 200) {
        const pageData: Page<GradeVO> = response.data.data;
        setGrades(pageData.records);
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
        description: "获取成绩列表失败",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  const fetchFiltersData = useCallback(async () => {
    try {
      // 并行获取三类数据
      const [classRes, subjectRes, studentRes] = await Promise.all([
        getClassListApi(),
        getSubjectListApi(),
        getStudentListApi(), // 调用新API
      ]);
      if (classRes.data.code === 200) setClasses(classRes.data.data);
      if (subjectRes.data.code === 200) setSubjects(subjectRes.data.data);
      if (studentRes.data.code === 200) setAllStudents(studentRes.data.data); // 设置学生列表
    } catch (error) {
      toast({
        title: "获取失败",
        description: "获取筛选数据失败",
        variant: "destructive",
      });
    }
  }, []);

  useEffect(() => {
    fetchGrades();
  }, [fetchGrades]);

  useEffect(() => {
    fetchFiltersData();
  }, [fetchFiltersData]);

  // --- 事件处理 ---
  const handleSuccess = () => fetchGrades();
  const handleDelete = async (id: number) => {
    if (confirm("确定要删除这条成绩记录吗？")) {
      try {
        const res = await deleteGradeApi(id);
        if (res.data.code === 200) {
          toast({
            title: "删除成功",
            description: "成绩记录已删除",
          });
          fetchGrades(); // 直接调用fetchGrades而不是handleSuccess
        } else {
          toast({
            title: "删除失败",
            description: res.data.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "删除失败",
          description: "删除失败，请稍后重试",
          variant: "destructive",
        });
      }
    }
  };
  const handlePageChange = (newPage: number) =>
    setQueryParams((prev) => ({ ...prev, current: newPage }));
  const handleSearch = () =>
    setQueryParams((prev) => ({ ...prev, current: 1 }));

  // --- 渲染函数 ---
  const getScoreBadge = (score: number) => {
    if (score >= 90)
      return <Badge className="bg-green-100 text-green-700">优秀</Badge>;
    if (score >= 80)
      return <Badge className="bg-blue-100 text-blue-700">良好</Badge>;
    if (score >= 60)
      return <Badge className="bg-orange-100 text-orange-700">及格</Badge>;
    return <Badge className="bg-red-100 text-red-700">不及格</Badge>;
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
        <Card className="w-full md:w-auto border-0 shadow-lg bg-white">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-purple-600" />
                成绩管理
              </CardTitle>
              <AddGradeDialog
                onSuccess={handleSuccess}
                students={allStudents}
                subjects={subjects}
              />{" "}
              {/* 需要传递学生列表 */}
            </div>
            <CardDescription>
              管理所有学生的考试成绩和评估记录。
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardContent className="p-4 grid grid-cols-1 md:grid-cols-5 gap-4 shadow-lg">
            <Input
              placeholder="按学生姓名搜索..."
              value={queryParams.studentName}
              onChange={(e) =>
                setQueryParams((prev) => ({
                  ...prev,
                  studentName: e.target.value,
                }))
              }
              className="md:col-span-2"
            />
            <Input
              placeholder="按学期搜索..."
              value={queryParams.term}
              onChange={(e) =>
                setQueryParams((prev) => ({ ...prev, term: e.target.value }))
              }
            />
            <Select
              value={queryParams.subjectId?.toString() ?? ""}
              onValueChange={(value) =>
                setQueryParams((prev) => ({
                  ...prev,
                  subjectId: value === "all" ? undefined : Number(value), // 增加 "all" 选项
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="所有科目" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有科目</SelectItem>
                {subjects.map((s) => (
                  <SelectItem key={s.id} value={s.id.toString()}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} className="w-full md:w-auto">
              搜索
            </Button>
          </CardContent>
        </Card>

        <Card className="w-full md:w-auto border-0 shadow-lg bg-white">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <GraduationCap className="h-5 w-5 text-purple-600" />
              成绩列表
            </CardTitle>
            <CardDescription>
              共 {pagination.total} 条记录，当前显示第{" "}
              {(pagination.current - 1) * pagination.size + 1} -{" "}
              {Math.min(pagination.current * pagination.size, pagination.total)}{" "}
              条
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>学生姓名</TableHead>
                    <TableHead>科目</TableHead>
                    <TableHead>成绩</TableHead>
                    <TableHead>学期</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grades.map((grade) => (
                    <TableRow key={grade.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
                            <GraduationCap className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {grade.studentName}({grade.studentNo})
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-gray-400" />
                          <span className="font-medium text-gray-700">
                            {grade.subjectName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">
                            {grade.score}
                          </span>
                          {getScoreBadge(grade.score)}
                        </div>
                      </TableCell>
                      <TableCell>{grade.term}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <EditGradeDialog
                            grade={grade}
                            onSuccess={handleSuccess}
                            students={allStudents}
                            subjects={subjects}
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(grade.id)}
                            className="text-red-500"
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
    </div>
  );
};

export default Grades;
