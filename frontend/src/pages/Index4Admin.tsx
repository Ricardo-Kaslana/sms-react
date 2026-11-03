import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";
import {
  School,
  GraduationCap,
  BookOpen,
  UserPlus,
  FileText,
  Calendar,
  BarChart3,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

// 导入API和类型
import { getDashboardApi, getLogPageApi } from "@/services/api";
import { toast } from "@/hooks/use-toast"; // 使用自定义的toast

// 定义Dashboard面板数据类型
interface PanelData {
  studentCount: number;
  classCount: number;
  subjectCount: number;
  userCount: number;
}

// 定义Log类型
interface Log {
  id: number;
  operator: string;
  operation: string;
  createTime: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // 用状态管理从API获取的数据
  const [panelData, setPanelData] = useState<PanelData | null>(null);
  const [recentLogs, setRecentLogs] = useState<Log[]>([]);

  // 在useEffect中获取数据
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 并行获取面板数据和最新日志
        const [dashboardRes, logRes] = await Promise.all([
          getDashboardApi(),
          getLogPageApi({ current: 1, size: 5 }), // 获取最新的5条日志
        ]);

        if (dashboardRes.data.code === 200) {
          setPanelData(dashboardRes.data.data.panelData);
        } else {
          toast({
            title: "获取统计数据失败",
            description: dashboardRes.data.msg,
            variant: "destructive",
          });
        }

        if (logRes.data.code === 200) {
          setRecentLogs(logRes.data.data.records);
        } else {
          toast({
            title: "获取最近活动失败",
            description: logRes.data.msg,
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "加载仪表盘数据失败",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 快速操作数据保持不变
  const quickActions = [
    {
      title: "添加学生",
      description: "录入新学生信息",
      icon: UserPlus,
      onClick: () => navigate("/students"),
    },
    {
      title: "录入成绩",
      description: "录入学生成绩",
      icon: BarChart3,
      onClick: () => navigate("/grades"),
    },
    {
      title: "数据统计",
      description: "查看学生成绩统计数据",
      icon: FileText,
      onClick: () => navigate("/statistics"),
    },
    {
      title: "管理课程",
      description: "添加删除或编辑课程",
      icon: Calendar,
      onClick: () => navigate("/subjects"),
    },
  ];

  // 将后端日志数据映射到最近活动数组
  const mapLogToActivity = (log: Log) => {
    // 简单的关键词匹配来决定图标
    if (log.operation.includes("学生"))
      return {
        type: "student",
        message: `${log.operator} ${log.operation}`,
        icon: UserPlus,
      };
    if (log.operation.includes("成绩"))
      return {
        type: "grade",
        message: `${log.operator} ${log.operation}`,
        icon: BarChart3,
      };
    return {
      type: "system",
      message: `${log.operator} ${log.operation}`,
      icon: FileText,
    };
  };

  const recentActivities = recentLogs.map((log) => ({
    ...mapLogToActivity(log),
    time: new Date(log.createTime).toLocaleString(), // 格式化时间
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">仪表盘</h1>
        <p className="text-gray-600 mt-2">欢迎回来，祝您有美好的一天！</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="w-full md:w-auto border-0 shadow-lg bg-white hover:bg-gray-100 transform hover:-translate-y-1 transition duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">学生总数</p>
                <p className="text-2xl font-bold">
                  {panelData?.studentCount || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full md:w-auto border-0 shadow-lg bg-white hover:bg-gray-100 transform hover:-translate-y-1 transition duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">班级总数</p>
                <p className="text-2xl font-bold">
                  {panelData?.classCount || 0}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <School className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full md:w-auto border-0 shadow-lg bg-white hover:bg-gray-100 transform hover:-translate-y-1 transition duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">科目总数</p>
                <p className="text-2xl font-bold">
                  {panelData?.subjectCount || 0}
                </p>
              </div>
              <div className="p-3 bg-teal-100 rounded-full">
                <BookOpen className="h-6 w-6 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full md:w-auto border-0 shadow-lg bg-white hover:bg-gray-100 transform hover:-translate-y-1 transition duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">用户总数</p>
                <p className="text-2xl font-bold">
                  {panelData?.userCount || 0}
                </p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-full">
                <BarChart3 className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 快速操作 */}
      <div>
        <QuickActions actions={quickActions} />
      </div>

      {/* 最近活动 */}
      <div>
        <RecentActivity activities={recentActivities} />
      </div>
    </div>
  );
};

export default Index;
