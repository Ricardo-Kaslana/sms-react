import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Home,
  Users,
  GraduationCap,
  BookOpen,
  Trophy,
  Building2,
  FileText,
  User,
  Settings,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

// 定义JWT载荷的类型
interface JwtPayload {
  sub: string;
  role: string;
}

// 整理菜单项
const allUserItems = [
  { title: "仪表板", url: "/", icon: Home, color: "text-blue-600" },
  { title: "学生管理", url: "/students", icon: GraduationCap, color: "text-green-600" },
  { title: "班级管理", url: "/classes", icon: Building2, color: "text-purple-600" },
  { title: "科目管理", url: "/subjects", icon: BookOpen, color: "text-orange-600" },
  { title: "成绩管理", url: "/grades", icon: Trophy, color: "text-yellow-600" },
  { title: "数据统计", url: "/statistics", icon: BarChart3, color: "text-indigo-600" },
];

// 仅管理员可查看页面
const adminOnlyItems = [
  { title: "用户管理", url: "/users", icon: Users, color: "text-cyan-600" },
  { title: "日志记录", url: "/logs", icon: FileText, color: "text-gray-600" },
];

const systemItems = [
  { title: "个人资料", url: "/profile", icon: User, color: "text-cyan-600", adminOnly: false },
  { title: "系统设置", url: "/settings", icon: Settings, color: "text-pink-600", adminOnly: false },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const [userRole, setUserRole] = useState<string | null>(null);

  // 处理角色权限
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded: JwtPayload = jwtDecode(token);
        setUserRole(decoded.role);
      } catch (error) {
        console.error("Invalid token:", error);
        setUserRole(null);
      }
    } else {
        setUserRole(null);
    }
  }, [location]); // 依赖location，每次路由变化都会重新检查

  return (
    <Sidebar className={state === "collapsed" ? "w-16" : "w-64"} collapsible="icon">
      {/* 是否折叠 */}
      <SidebarHeader className="p-4 border-b bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          {state !== "collapsed" && (
            <div>
              <h1 className="text-base font-bold text-white">学生管理系统</h1>
              <p className="text-xs text-blue-100">Student Management</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-gray-50/50">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
            主要功能
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2">
              {allUserItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `group flex items-center gap-2 px-2 py-2 rounded-lg transition-all duration-200 relative overflow-hidden ${
                          isActive
                            ? "bg-white shadow-md text-gray-900 font-medium border border-gray-200/50"
                            : "text-gray-600 hover:bg-white/60 hover:text-gray-900 hover:shadow-sm"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-r-full" />}
                          <item.icon className={`h-4 w-4 transition-colors ${isActive ? item.color : 'group-hover:' + item.color}`} />
                          {state !== "collapsed" && <span className="flex-1 text-sm">{item.title}</span>}
                          {state !== "collapsed" && isActive && <ChevronRight className="h-3 w-3 text-gray-400" />}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {userRole === 'ROLE_ADMIN' && adminOnlyItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `group flex items-center gap-2 px-2 py-2 rounded-lg transition-all duration-200 relative overflow-hidden ${
                          isActive
                            ? "bg-white shadow-md text-gray-900 font-medium border border-gray-200/50"
                            : "text-gray-600 hover:bg-white/60 hover:text-gray-900 hover:shadow-sm"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-r-full" />}
                          <item.icon className={`h-4 w-4 transition-colors ${isActive ? item.color : 'group-hover:' + item.color}`} />
                          {state !== "collapsed" && <span className="flex-1 text-sm">{item.title}</span>}
                          {state !== "collapsed" && isActive && <ChevronRight className="h-3 w-3 text-gray-400" />}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
            系统管理
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2">
              {systemItems.map((item) => {
                if (item.adminOnly && userRole !== 'ROLE_ADMIN') {
                  return null;
                }
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={({ isActive }) =>
                          `group flex items-center gap-2 px-2 py-2 rounded-lg transition-all duration-200 relative overflow-hidden ${
                            isActive
                              ? "bg-white shadow-md text-gray-900 font-medium border border-gray-200/50"
                              : "text-gray-600 hover:bg-white/60 hover:text-gray-900 hover:shadow-sm"
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-r-full" />}
                            <item.icon className={`h-4 w-4 transition-colors ${isActive ? item.color : 'group-hover:' + item.color}`} />
                            {state !== "collapsed" && <span className="flex-1 text-sm">{item.title}</span>}
                            {state !== "collapsed" && isActive && <ChevronRight className="h-3 w-3 text-gray-400" />}
                          </>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t bg-gray-50/80">
        <div className="flex items-center gap-2 text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          {state !== "collapsed" && (
            <span className="text-xs">系统运行正常</span>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
