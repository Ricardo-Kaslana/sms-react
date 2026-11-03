import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Search, User, LogOut, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast"; // 使用自定义的toast
import { logoutApi, getProfileApi } from "@/services/api"; // 导入API
import { resolveAssetUrl } from "@/lib/config";

// 定义用户信息的类型
interface UserProfile {
  username: string;
  fullName: string;
  avatar?: string;
}

export function TopNavbar() {
  const navigate = useNavigate();
  // 使用状态来存储用户信息
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // 在组件加载时获取用户信息
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getProfileApi();
        if (response.data.code === 200) {
          setUserProfile(response.data.data);
        }
        // 如果获取失败，不提示错误，让组件优雅地回退到默认显示
      } catch (error) {
        console.error("Failed to fetch user profile for navbar", error);
      }
    };
    fetchUserProfile();
  }, []);

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleSettingsClick = () => {
    navigate("/settings");
  };

  // 登出逻辑保持不变
  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error(
        "Logout API call failed, but proceeding with client-side logout.",
        error
      );
    } finally {
      localStorage.removeItem("authToken");
      toast({
        title: "登出成功",
        description: "您已成功登出系统",
      });
      setTimeout(() => {
        // 使用 window.location.replace 可以强制刷新页面并清空所有状态，更彻底
        window.location.replace("/login");
      }, 1000);
    }
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm sticky top-0 z-30">
      {/* 左侧：侧边栏切换按钮和搜索 */}
      <div className="flex items-center gap-4">
        <SidebarTrigger className="h-8 w-8" />
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="搜索学生、班级或科目..."
            className="w-80 pl-10 bg-gray-50 border-gray-200 focus:bg-white"
          />
        </div>
      </div>

      {/* 中间：系统标题（在小屏幕上显示） */}
      <div className="md:hidden">
        <h1 className="text-lg font-semibold text-gray-900">学生管理系统</h1>
      </div>

      <div className="md:hidden">
        <h1 className="text-lg font-semibold text-gray-900">学生管理系统</h1>
      </div>

      {/* 右侧：通知、用户菜单 */}
      <div className="flex items-center gap-3">
        {/* 通知按钮 */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            3
          </span>
        </Button>

        {/* 用户菜单部分，使用 state 中的数据 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                {/* 动态显示头像，注意拼接后端地址 */}
                <AvatarImage
                  src={resolveAssetUrl(userProfile?.avatar)}
                  alt="用户头像"
                />
                <AvatarFallback className="bg-blue-100 text-blue-700">
                  {/* 如果有全名显示全名首字母，否则显示用户名首字母 */}
                  {userProfile ? (
                    (userProfile.fullName || userProfile.username)
                      .charAt(0)
                      .toUpperCase()
                  ) : (
                    <User />
                  )}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {/* 显示全名或用户名 */}
                  {userProfile?.fullName || "用户"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {/* 显示用户名 */}
                  {userProfile?.username || "loading..."}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleProfileClick}>
              <User className="mr-2 h-4 w-4" />
              <span>个人资料</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSettingsClick}>
              <Settings className="mr-2 h-4 w-4" />
              <span>系统设置</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:bg-red-50 focus:text-red-700"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>退出登录</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
