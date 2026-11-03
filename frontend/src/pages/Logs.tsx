import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { Search, Download, History, Loader2, LogsIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast"; // 使用自定义的toast

import { getLogPageApi, exportLogsApi, Page } from "@/services/api";
import { generatePagination } from "@/lib/pagination"; // 导入分页工具函数

// 定义Log类型
interface Log {
  id: number;
  operator: string;
  operation: string;
  ipAddress: string;
  createTime: string;
}

const Logs = () => {
  const [logs, setLogs] = useState<Log[]>([]);
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
    operator: "",
    operation: "",
  });

  const [exporting, setExporting] = useState(false);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getLogPageApi(queryParams);
      if (response.data.code === 200) {
        const pageData: Page<Log> = response.data.data;
        setLogs(pageData.records);
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
      const status = (error as { response?: { status?: number } }).response
        ?.status;
      if (status === 401 || status === 403) {
        toast({
          title: "权限错误",
          description: "您没有权限访问此页面",
          variant: "destructive",
        });
      } else {
        toast({
          title: "获取失败",
          description: "获取日志列表失败",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handlePageChange = (newPage: number) => {
    setQueryParams((prev) => ({ ...prev, current: newPage }));
  };

  const handleSearch = () => {
    setQueryParams((prev) => ({ ...prev, current: 1 }));
  };

  const exportToCSV = (data: Log[], filename: string) => {
    const headers = ["ID", "操作时间", "操作人", "操作内容", "IP地址"];
    const csvContent = [
      headers.join(","),
      ...data.map((log) =>
        [
          log.id,
          new Date(log.createTime).toLocaleString(),
          log.operator,
          `"${log.operation.replace(/"/g, '""')}"`, // 处理描述中可能存在的引号
          log.ipAddress,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    toast({
      title: "导出日志",
      description: "正在准备导出数据...",
    });
    try {
      // 使用当前的筛选条件，但不分页
      const exportParams = {
        operator: queryParams.operator,
        operation: queryParams.operation,
      };
      const response = await exportLogsApi(exportParams);

      if (response.data.code === 200 && response.data.data.length > 0) {
        const timestamp = new Date()
          .toISOString()
          .slice(0, 19)
          .replace(/[:-]/g, "");
        const filename = `系统日志_${timestamp}.csv`;
        exportToCSV(response.data.data, filename);
        toast({
          title: "导出成功",
          description: `共导出 ${response.data.data.length} 条记录`,
        });
      } else if (response.data.data.length === 0) {
        toast({
          title: "没有符合条件的日志",
          description: "当前筛选条件下没有日志可以导出",
          variant: "destructive",
        });
      } else {
        toast({
          title: "导出失败",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "导出失败",
        description: "导出日志失败，请重试",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <LogsIcon className="h-6 w-6 text-indigo-600" />
                日志记录
              </CardTitle>
              <Button onClick={handleExport} disabled={exporting}>
                {exporting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                导出日志
              </Button>
            </div>
            <CardDescription>
              导出系统的操作日志，包含操作时间、操作人、操作内容和 IP 地址。
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardContent className="p-4 flex flex-col md:flex-row gap-4">
            <Input
              placeholder="按操作人搜索..."
              value={queryParams.operator}
              onChange={(e) =>
                setQueryParams((prev) => ({
                  ...prev,
                  operator: e.target.value,
                }))
              }
            />
            <Input
              placeholder="按操作内容搜索..."
              value={queryParams.operation}
              onChange={(e) =>
                setQueryParams((prev) => ({
                  ...prev,
                  operation: e.target.value,
                }))
              }
            />
            <Button onClick={handleSearch} className="w-full md:w-auto">
              搜索
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History /> 操作日志
            </CardTitle>
            <CardDescription>
              共 {pagination.total} 条日志记录，当前显示第{" "}
              {(pagination.current - 1) * pagination.size + 1} -{" "}
              {Math.min(pagination.current * pagination.size, pagination.total)}{" "}
              条
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>操作人</TableHead>
                    <TableHead>操作内容</TableHead>
                    <TableHead>IP地址</TableHead>
                    <TableHead>操作时间</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{log.id}</TableCell>
                      <TableCell className="font-medium">
                        {log.operator}
                      </TableCell>
                      <TableCell>{log.operation}</TableCell>
                      <TableCell className="font-mono">
                        {log.ipAddress}
                      </TableCell>
                      <TableCell>
                        {new Date(log.createTime).toLocaleString()}
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

export default Logs;
