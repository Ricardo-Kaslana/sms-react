import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, Search, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const commonPages = [
    { name: "仪表板", path: "/" },
    { name: "学生管理", path: "/students" },
    { name: "班级管理", path: "/classes" },
    { name: "科目管理", path: "/subjects" },
    { name: "成绩管理", path: "/grades" },
    { name: "个人资料", path: "/profile" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardContent className="p-8 text-center">
          {/* 404 图标和数字 */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-4">
              <AlertTriangle className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-6xl font-bold text-gray-800 mb-2">404</h1>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          {/* 错误信息 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              页面未找到
            </h2>
            <p className="text-gray-600 mb-4">
              抱歉，您访问的页面不存在或已被移动。
            </p>
            <div className="bg-gray-100 rounded-lg p-3 mb-6">
              <p className="text-sm text-gray-500">
                <span className="font-medium">错误路径：</span>
                <code className="bg-gray-200 px-2 py-1 rounded text-red-600 ml-2">
                  {location.pathname}
                </code>
              </p>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button onClick={handleGoBack} variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              返回上页
            </Button>
            <Button onClick={handleGoHome} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Home className="w-4 h-4" />
              回到首页
            </Button>
          </div>

          {/* 常用页面链接 */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center justify-center gap-2">
              <Search className="w-5 h-5" />
              您可能在寻找
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {commonPages.map((page) => (
                <Button
                  key={page.path}
                  variant="ghost"
                  onClick={() => navigate(page.path)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-blue-200 hover:border-blue-300"
                >
                  {page.name}
                </Button>
              ))}
            </div>
          </div>

          {/* 帮助信息 */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <span className="font-medium">需要帮助？</span>
              如果您认为这是一个错误，请联系系统管理员。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
