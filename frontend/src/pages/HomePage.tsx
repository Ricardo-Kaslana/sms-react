import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Loader2 } from "lucide-react";
// 这个组件本身不渲染任何UI，它的唯一作用就是判断和重定向。
// 当HomePage组件加载时，它会检查 localStorage 中是否存在JWT。
// 如果没有JWT，它会立即将用户重定向到 /login。
// 如果有JWT，它会解析JWT获取用户角色。
// 根据角色，它会重定向到相应的默认页面
// 使用 useNavigate 的 replace: true 选项进行重定向，这样用户点击浏览器后退按钮时不会回到这个空白的重定向页面。

// 定义JWT载荷的类型
interface JwtPayload {
  sub: string;
  role: string;
}

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      // 没有token，重定向到登录页
      navigate("/login", { replace: true });
      return;
    }

    try {
      const decoded: JwtPayload = jwtDecode(token);

      // 根据角色重定向
      if (decoded.role === "ROLE_ADMIN") {
        navigate("/index", { replace: true });
      } else if (decoded.role === "ROLE_TEACHER") {
        // 教师的默认页面
        navigate("/dashboard", { replace: true });
      } else {
        // 其他角色的默认页面或回退页面
        navigate("/profile", { replace: true });
      }
    } catch (error) {
      console.error("Invalid token, redirecting to login.", error);
      // token解析失败，也重定向到登录页
      localStorage.removeItem("authToken");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // 在重定向生效前，显示一个加载动画，避免页面闪烁
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
    </div>
  );
};

export default HomePage;
