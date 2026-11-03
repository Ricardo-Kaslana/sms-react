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
import { Label } from "@/components/ui/label";
import {
  GraduationCap,
  Eye,
  EyeOff,
  User,
  Lock,
  RefreshCw,
  Loader,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
// 导入API调用函数和类型
import { getCaptchaApi, loginApi, CaptchaData } from "@/services/api";
import { toast } from "@/hooks/use-toast"; // 使用自定义的toast

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // captcha 存储从后端获取的图片和key
  const [captcha, setCaptcha] = useState<CaptchaData>({ key: "", image: "" });

  // 改造 formData 状态，添加 captchaKey
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    captchaCode: "", // 将原captcha字段改为captchaCode，以示区分
    captchaKey: "",
  });

  //创建一个函数来调用API获取验证码
  const fetchCaptcha = useCallback(async () => {
    try {
      const response = await getCaptchaApi();
      if (response.data.code === 200) {
        setCaptcha(response.data.data);
        // 将获取到的key存入formData
        setFormData((prev) => ({
          ...prev,
          captchaKey: response.data.data.key,
          captchaCode: "",
        }));
      } else {
        toast({
          description: "获取验证码失败，请刷新页面",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        description: "网络错误，无法连接到服务器",
        variant: "destructive",
      });
    }
  }, []);

  // 使用useEffect在组件首次加载时获取验证码
  useEffect(() => {
    fetchCaptcha();
  }, [fetchCaptcha]);

  // 刷新验证码
  const refreshCaptcha = () => {
    fetchCaptcha();
  };

  // 重写 handleLogin 登录逻辑
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // 准备发送到后端的数据
    const loginPayload = {
      username: formData.username,
      password: formData.password,
      captchaKey: formData.captchaKey,
      captchaCode: formData.captchaCode,
    };

    try {
      const response = await loginApi(loginPayload);

      if (response.data.code === 200) {
        toast({
          title: "成功",
          description: "登录成功！",
        });
        // 将 token 存储到 localStorage
        localStorage.setItem("authToken", response.data.data.token);
        // 延迟一小会再跳转，让用户能看到成功提示
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        // 处理后端返回的业务错误
        toast({
          title: "失败",
          description: response.data.message,
          variant: "destructive",
        });
        refreshCaptcha(); // 登录失败后刷新验证码
      }
    } catch (error) {
      // 处理网络错误或后端返回的非200状态码的错误
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast({
          title: "失败",
          description: error.response.data.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "失败",
          description: "登录失败，请检查网络或联系管理员",
          variant: "destructive",
        });
      }
      refreshCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 添加视频背景容器
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* 新增视频背景元素 */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        {/* 视频路径 */}
        <source src="/bg.webm" type="video/webm" />
        你的浏览器不支持视频背景
      </video>

      {/* 添加半透明遮罩层增强文字可读性 */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>
      <div className="min-h-screen flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          {/* Logo和标题 - 改为水平排列 */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="flex-shrink-0">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold text-gray-900">学生管理系统</h1>
            </div>
          </div>

          {/* 登录表单 */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">
                欢迎回来
              </CardTitle>
              <CardDescription>输入您的凭据以访问系统</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                {/* 用户名和密码输入框 */}
                <div className="space-y-2">
                  <Label htmlFor="username">用户名</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      className="pl-10 h-12"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">密码</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="pl-10 pr-12 h-12"
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* 验证码区域 */}
                <div className="space-y-2">
                  <Label htmlFor="captcha">验证码</Label>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Input
                        id="captcha"
                        placeholder="请输入验证码"
                        value={formData.captchaCode}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            captchaCode: e.target.value,
                          })
                        }
                        className="h-12"
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-12 w-[120px] bg-gray-100 border border-gray-200 rounded-md flex items-center justify-center">
                        {captcha.image ? (
                          <img
                            src={`data:image/png;base64,${captcha.image}`}
                            alt="Captcha"
                            className="h-full w-full cursor-pointer"
                            onClick={refreshCaptcha}
                          />
                        ) : (
                          <Loader className="h-5 w-5 animate-spin text-gray-400" />
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={refreshCaptcha}
                        className="h-12 w-12"
                        disabled={isLoading}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* 记住我选项 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      disabled={isLoading}
                      title="记住我"
                      aria-label="记住我"
                    />
                    <Label
                      htmlFor="remember"
                      className="ml-2 text-sm text-gray-600"
                    >
                      记住我
                    </Label>
                  </div>
                  <a
                    href="#"
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    忘记密码？
                  </a>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      登录中...
                    </>
                  ) : (
                    "登录"
                  )}
                </Button>
              </form>
              {/* 其他登录选项 */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  还没有账户？
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-800 hover:underline ml-1"
                  >
                    联系管理员
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} 学生管理系统. 保留所有权利</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
