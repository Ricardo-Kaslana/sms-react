import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import ErrorBoundary from "./components/ErrorBoundary";
import AdminRoute from "./components/AdminRoute";
import Unauthorized from "./pages/Unauthorized"; // 创建一个403页面
import HomePage from "./pages/HomePage"; // 导入HomePage组件
import Index4Teacher from "./pages/Index4Teacher";
import Index4Admin from "./pages/Index4Admin";
import Login from "./pages/Login";
import Students from "./pages/Students";
import Classes from "./pages/Classes";
import Subjects from "./pages/Subjects";
import Grades from "./pages/Grades";
import Users from "./pages/Users";
import Logs from "./pages/Logs";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Statistics from "./pages/Statistics";
import NotFound from "./pages/NotFound";
import Error from "./pages/Error";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {/* 路由结构 */}
          <Routes>
            {/* 不需要布局的公共页面 */}
            <Route path="/login" element={<Login />} />
            <Route path="/error" element={<Error />} />
            <Route path="/403" element={<Unauthorized />} />
            <Route path="/404" element={<NotFound />} />

            {/* 需要布局的主应用页面 */}
            <Route
              path="*"
              element={
                <Layout>
                  <Routes>
                    {/* 根路径，由HomePage处理重定向 */}
                    <Route index element={<HomePage />} />

                    {/* 具体页面 */}
                    <Route path="dashboard" element={<Index4Teacher />} />
                    <Route path="students" element={<Students />} />
                    <Route path="classes" element={<Classes />} />
                    <Route path="subjects" element={<Subjects />} />
                    <Route path="grades" element={<Grades />} />
                    <Route path="statistics" element={<Statistics />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="settings" element={<Settings />} />

                    {/* 需要管理员权限的页面组 */}
                    <Route element={<AdminRoute />}>
                      <Route path="index" element={<Index4Admin />} />
                      <Route path="users" element={<Users />} />
                      <Route path="logs" element={<Logs />} />
                    </Route>

                    {/* Layout内部的404页面 */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              }
            ></Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
