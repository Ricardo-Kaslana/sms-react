import React, { useState, useEffect, useCallback } from "react";
import { generatePagination } from "@/lib/pagination";
import { resolveAssetUrl } from "@/lib/config";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Users as UsersIcon,
  Trash2,
  Search,
} from "lucide-react";
import { toast } from "@/hooks/use-toast"; // 使用自定义的toast

import { getUserPageApi, deleteUserApi, Page } from "@/services/api";
import AddUserDialog from "@/components/users/AddUserDialog";
import EditUserDialog from "@/components/users/EditUserDialog";

// 定义与后端实体匹配的用户类型
export interface User {
  id: number;
  username: string;
  fullName: string;
  role: "ROLE_ADMIN" | "ROLE_TEACHER";
  avatar?: string;
  createTime: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
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
    username: "",
    role: "ALL", // 修改初始值为'ALL'
  });

  // 在API调用前处理role参数
  const fetchUsers = useCallback(async () => {
    // 1. 准备要发送到后端的参数
    const paramsToSend = {
      ...queryParams,
      // 如果 role 是 'ALL'，则将其值变为空字符串，这样后端接收到空字符串就不会进行角色筛选
      role: queryParams.role === "ALL" ? "" : queryParams.role,
    };

    setLoading(true);
    try {
      // 使用处理过的 paramsToSend 发送API请求
      const response = await getUserPageApi(paramsToSend);

      if (response.data.code === 200) {
        const pageData: Page<User> = response.data.data;
        setUsers(pageData.records);
        setPagination({
          current: pageData.current,
          size: pageData.size,
          total: pageData.total,
          pages: pageData.pages,
        });
      } else {
        toast({
          title: "获取用户列表失败",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      const status = (error as { response?: { status?: number } }).response
        ?.status;
      if (status === 401 || status === 403) {
        toast({
          title: "您没有权限访问此页面",
          description: "您没有权限访问此页面",
          variant: "destructive",
        });
      } else {
        toast({
          title: "获取用户列表失败",
          description: "获取失败",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [queryParams]); // 依赖项是正确的，保持不变

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSuccess = () => fetchUsers();

  const handleDelete = async (id: number) => {
    if (confirm("确定要删除该用户吗？此操作不可逆！")) {
      try {
        const res = await deleteUserApi(id);
        if (res.data.code === 200) {
          toast({
            title: "删除成功",
            description: "用户已成功删除",
          });
          // 如果删除的是当前页的最后一条数据，则跳转到上一页
          if (users.length === 1 && pagination.current > 1) {
            setQueryParams((prev) => ({ ...prev, current: prev.current - 1 }));
          } else {
            handleSuccess();
          }
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
          description: "删除失败",
          variant: "destructive",
        });
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    setQueryParams((prev) => ({ ...prev, current: newPage }));
  };

  const handleSearch = () => {
    setQueryParams((prev) => ({ ...prev, current: 1 }));
  };

  const getRoleBadge = (role: string) => {
    if (role === "ROLE_ADMIN")
      return <Badge className="bg-red-100 text-red-700">管理员</Badge>;
    if (role === "ROLE_TEACHER")
      return <Badge className="bg-blue-100 text-blue-700">教师</Badge>;
    return <Badge variant="secondary">未知</Badge>;
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
                <UsersIcon className="h-6 w-6 text-indigo-600" />
                用户管理
              </CardTitle>
              <AddUserDialog onSuccess={handleSuccess} />
            </div>
            <CardDescription>管理系统所有用户的账号和权限。</CardDescription>
          </CardHeader>
        </Card>

        <Card className="w-full md:w-auto border-0 shadow-lg bg-white">
          <CardContent className="p-4 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="按用户名搜索..."
                value={queryParams.username}
                onChange={(e) =>
                  setQueryParams((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                className="pl-10"
              />
            </div>
            <Select
              value={queryParams.role}
              onValueChange={(value) =>
                setQueryParams((prev) => ({ ...prev, role: value, current: 1 }))
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="所有角色" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">所有角色</SelectItem>
                <SelectItem value="ROLE_ADMIN">管理员</SelectItem>
                <SelectItem value="ROLE_TEACHER">教师</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch}>搜索</Button>
          </CardContent>
        </Card>

        <Card className="w-full md:w-auto border-0 shadow-lg bg-white">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <UsersIcon className="h-5 w-5 text-blue-600" />
              用户列表
            </CardTitle>
            <CardDescription>
              共 {pagination.total} 名用户，当前显示第{" "}
              {(pagination.current - 1) * pagination.size + 1} -{" "}
              {Math.min(pagination.current * pagination.size, pagination.total)}{" "}
              名
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>用户信息</TableHead>
                    <TableHead>角色</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={resolveAssetUrl(user.avatar)} />
                            <AvatarFallback>
                              {user.fullName?.charAt(0) ||
                                user.username.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold">
                              {user.fullName || user.username}
                            </div>
                            <div className="text-sm text-gray-500">
                              @{user.username}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>
                        {new Date(user.createTime).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <EditUserDialog
                            user={user}
                            onSuccess={handleSuccess}
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-700"
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

export default Users;
