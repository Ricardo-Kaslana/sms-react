import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
} from "@/components/ui/chart";
import {
  CartesianGrid,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  Users,
  School,
  BookOpen,
  Loader2,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { getDashboardApi, getTermListApi } from "@/services/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChartDataItem {
  name: string;
  value: number | string;
}

interface PanelData {
  studentCount: number;
  classCount: number;
  subjectCount: number;
  userCount: number;
}

interface DashboardData {
  panelData: PanelData;
  passRateData: ChartDataItem[];
  avgScoreBySubject: ChartDataItem[];
  scoreDistribution: ChartDataItem[];
}

const Statistics = () => {
  const [loading, setLoading] = useState(true);
  const [terms, setTerms] = useState<string[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<string>("");
  const [dashboardData, setDashboardData] = useState<Partial<DashboardData>>(
    {}
  );

  const PASS_RATE_COLORS = ["#10b981", "#ef4444"];
  const SCORE_DIST_COLORS = [
    "#10b981",
    "#3b82f6",
    "#f59e0b",
    "#f97316",
    "#ef4444",
  ];

  const fetchTerms = useCallback(async () => {
    try {
      const res = await getTermListApi();
      if (res.data.code === 200 && res.data.data.length > 0) {
        setTerms(res.data.data);
        setSelectedTerm(res.data.data[0]);
      }
    } catch (error) {
      toast.error("获取学期列表失败");
    }
  }, []);

  const fetchDashboardData = useCallback(async (term?: string) => {
    setLoading(true);
    try {
      const res = await getDashboardApi(term);
      if (res.data.code === 200) {
        setDashboardData(res.data.data);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("获取统计数据失败");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTerms();
  }, [fetchTerms]);

  useEffect(() => {
    if (selectedTerm) {
      fetchDashboardData(selectedTerm);
    } else {
      fetchDashboardData();
    }
  }, [selectedTerm, fetchDashboardData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <Toaster position="top-center" richColors />
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">数据统计</h1>
              <p className="text-gray-600">学生成绩数据分析与统计</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shadow-lg">
            <Select value={selectedTerm} onValueChange={setSelectedTerm}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="选择学期以查看图表" />
              </SelectTrigger>
              <SelectContent>
                {terms.map((term) => (
                  <SelectItem key={term} value={term}>
                    {term}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="w-full md:w-auto border-0 shadow-lg bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">学生总数</p>
                  <p className="text-2xl font-bold">
                    {dashboardData.panelData?.studentCount || 0}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="w-full md:w-auto border-0 shadow-lg bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">班级总数</p>
                  <p className="text-2xl font-bold">
                    {dashboardData.panelData?.classCount || 0}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <School className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="w-full md:w-auto border-0 shadow-lg bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">科目总数</p>
                  <p className="text-2xl font-bold">
                    {dashboardData.panelData?.subjectCount || 0}
                  </p>
                </div>
                <div className="p-3 bg-teal-100 rounded-full">
                  <BookOpen className="h-6 w-6 text-teal-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="w-full md:w-auto border-0 shadow-lg bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">用户总数</p>
                  <p className="text-2xl font-bold">
                    {dashboardData.panelData?.userCount || 0}
                  </p>
                </div>
                <div className="p-3 bg-indigo-100 rounded-full">
                  <BarChart3 className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          </div>
        )}

        {!loading && selectedTerm && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="w-full md:w-auto border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-indigo-600" />
                  成绩及格率
                </CardTitle>
                <CardDescription>{selectedTerm}</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    passRate: { color: PASS_RATE_COLORS[0] },
                    failRate: { color: PASS_RATE_COLORS[1] },
                  }}
                >
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={dashboardData.passRateData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        nameKey="name"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {dashboardData.passRateData?.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              PASS_RATE_COLORS[index % PASS_RATE_COLORS.length]
                            }
                          />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="w-full md:w-auto border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-indigo-600" />
                  成绩分数段分布
                </CardTitle>
                <CardDescription>{selectedTerm}</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    scoreDist: { color: SCORE_DIST_COLORS[0] },
                  }}
                >
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={dashboardData.scoreDistribution}>
                      <XAxis
                        dataKey="name"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}人`}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {dashboardData.scoreDistribution?.map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                SCORE_DIST_COLORS[
                                  index % SCORE_DIST_COLORS.length
                                ]
                              }
                            />
                          )
                        )}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 w-full md:w-auto border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-indigo-600" />
                  各科目平均分
                </CardTitle>
                <CardDescription>{selectedTerm}</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    avgScore: { color: "#3b82f6" },
                  }}
                >
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={dashboardData.avgScoreBySubject}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        fontSize={12}
                      />
                      <YAxis domain={[0, 100]} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey="value"
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                        name="平均分"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Statistics;
