import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Home, ArrowLeft, Lock, ShieldAlert } from "lucide-react";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4 mx-auto">
            <Lock className="w-10 h-10 text-blue-600" />
          </div>
          <CardTitle className="text-3xl text-blue-700 mb-2">访问被拒绝</CardTitle>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert variant="default">
            <ShieldAlert className="h-4 w-4" />
            <AlertDescription className="text-base">
              您没有权限访问此页面
            </AlertDescription>
          </Alert>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">可能的解决方案：</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 使用有权限的账户登录</li>
              <li>• 联系管理员获取访问权限</li>
              <li>• 返回上一页面</li>
              <li>• 回到首页</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button onClick={handleGoBack} variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              返回上页
            </Button>
            <Button onClick={handleGoHome} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Home className="w-4 h-4" />
              回到首页
            </Button>
          </div>

          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">需要帮助？</span>
            </p>
            <p className="text-xs text-gray-500">
              如需访问权限，请联系管理员：admin@school.edu
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnauthorizedPage;
