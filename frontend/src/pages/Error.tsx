import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Home, ArrowLeft, RefreshCw, AlertTriangle, Bug, Mail } from "lucide-react";

const Error = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const error = location.state?.error;
  const errorMessage = location.state?.message || "发生了未知错误";

  useEffect(() => {
    console.error("Error page accessed:", {
      error,
      message: errorMessage,
      pathname: location.pathname,
      timestamp: new Date().toISOString()
    });
  }, [error, errorMessage, location.pathname]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleReportError = () => {
    const subject = encodeURIComponent("错误报告 - 学生管理系统");
    const body = encodeURIComponent(`
错误信息：${errorMessage}
发生时间：${new Date().toLocaleString()}
页面路径：${location.pathname}
用户代理：${navigator.userAgent}

请描述您在遇到错误前执行的操作：


`);
    window.open(`mailto:admin@school.edu?subject=${subject}&body=${body}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4 mx-auto">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
          <CardTitle className="text-3xl text-red-700 mb-2">系统错误</CardTitle>
          <div className="w-24 h-1 bg-red-600 mx-auto rounded-full"></div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert variant="destructive">
            <Bug className="h-4 w-4" />
            <AlertDescription className="text-base">
              {errorMessage}
            </AlertDescription>
          </Alert>

          {error && (
            <div className="bg-gray-100 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">技术信息：</h3>
              <div className="bg-white rounded p-3 border">
                <code className="text-sm text-red-600 break-all">
                  {error.toString()}
                </code>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">可能的解决方案：</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 刷新页面重试</li>
              <li>• 检查网络连接</li>
              <li>• 清除浏览器缓存</li>
              <li>• 返回上一页面重新操作</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button onClick={handleRefresh} variant="outline" className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              刷新页面
            </Button>
            <Button onClick={handleGoBack} variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              返回上页
            </Button>
            <Button onClick={handleGoHome} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Home className="w-4 h-4" />
              回到首页
            </Button>
            <Button onClick={handleReportError} variant="secondary" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              报告错误
            </Button>
          </div>

          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">需要帮助？</span>
            </p>
            <p className="text-xs text-gray-500">
              如果问题持续存在，请联系技术支持：admin@school.edu
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Error;
