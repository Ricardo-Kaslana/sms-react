import axios from "axios";
import { API_BASE_URL } from "@/lib/config";

// 1. 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL, // 后端地址，通过 VITE_API_BASE_URL 配置
  timeout: 10000, // 超时时间
});

// 2. 配置请求拦截器 (自动附加JWT)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. 配置响应拦截器 (可选，但推荐，用于统一处理错误)
apiClient.interceptors.response.use(
  (response) => {
    // 如果响应成功，直接返回response
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // 如果是401错误 (Token无效或过期)，重定向到登录页
      localStorage.removeItem("authToken"); // 清除无效的token
      // 使用 window.location.href 而不是 useNavigate，因为这里不是React组件
      // 为了防止循环重定向，检查当前是否已在登录页
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    } else if (error.response && error.response.status === 403) {
      // 如果是403错误 (无权限访问)，重定向到403页
      window.location.href = "/403";
    } else if (error.response && error.response.status === 404) {
      // 如果是404错误 (资源不存在)，重定向到404页
      window.location.href = "/404";
    }
    return Promise.reject(error); // 将错误继续抛出，以便组件中的 catch 块可以捕获并显示 toast 等
  }
);

// --- 通用接口和类型定义 ---

// 后端API统一响应体
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 分页数据结构 (与MyBatis-Plus后端对应)
export interface Page<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

// 分页查询参数
export interface PageParams {
  current?: number;
  size?: number;
  [key: string]: unknown; // 允许其他查询参数
}

// --- 认证模块 ---
export interface CaptchaData {
  key: string;
  image: string;
}
export interface LoginData {
  token: string;
}

export const getCaptchaApi = () =>
  apiClient.get<ApiResponse<CaptchaData>>("/captcha");
export const loginApi = (data: unknown) =>
  apiClient.post<ApiResponse<LoginData>>("/user/login", data);
export const logoutApi = () =>
  apiClient.post<ApiResponse<null>>("/user/logout");

// --- 个人中心模块 ---
export const getProfileApi = () => apiClient.get("/user/profile");
export const updateProfileApi = (data: unknown) =>
  apiClient.put("/user/profile", data);
export const updatePasswordApi = (data: unknown) =>
  apiClient.put("/user/password", data);
export const uploadAvatarApi = (formData: FormData) =>
  apiClient.post("/user/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// --- 班级管理模块 ---
export const getClassPageApi = (params: PageParams) =>
  apiClient.get("/class/page", { params });
export const addClassApi = (data: unknown) => apiClient.post("/class", data);
export const updateClassApi = (data: unknown) => apiClient.put("/class", data);
export const deleteClassApi = (id: number | string) =>
  apiClient.delete(`/class/${id}`);
export const getClassListApi = () => apiClient.get("/class/list");

// --- 学生管理模块 ---
export const getStudentPageApi = (params: PageParams) =>
  apiClient.get("/student/page", { params });
export const addStudentApi = (data: unknown) => apiClient.post("/student", data);
export const updateStudentApi = (data: unknown) => apiClient.put("/student", data);
export const deleteStudentApi = (id: number | string) =>
  apiClient.delete(`/student/${id}`);
export const getStudentListApi = () => apiClient.get("/student/list"); // 新增接口

// --- 科目管理模块 ---
export const getSubjectPageApi = (params: PageParams) =>
  apiClient.get("/subject/page", { params });
export const addSubjectApi = (data: unknown) => apiClient.post("/subject", data);
export const updateSubjectApi = (data: unknown) => apiClient.put("/subject", data);
export const deleteSubjectApi = (id: number | string) =>
  apiClient.delete(`/subject/${id}`);
export const getSubjectListApi = () => apiClient.get("/subject/list");

// --- 成绩管理模块 ---
export const getGradePageApi = (params: PageParams) =>
  apiClient.get("/grade/page", { params });
export const addGradeApi = (data: unknown) => apiClient.post("/grade", data);
export const updateGradeApi = (data: unknown) => apiClient.put("/grade", data);
export const deleteGradeApi = (id: number | string) =>
  apiClient.delete(`/grade/${id}`);
export const getTermListApi = () =>
  apiClient.get<ApiResponse<string[]>>("/grade/terms");

// --- 数据统计模块 ---
export const getDashboardApi = (term?: string) =>
  apiClient.get("/statistics/dashboard", {
    params: { term },
  });

// --- 用户管理模块 (管理员) ---
export const getUserPageApi = (params: PageParams) =>
  apiClient.get("/user/page", { params });
export const addUserApi = (data: unknown) => apiClient.post("/user", data);
export const updateUserApi = (data: unknown) => apiClient.put("/user", data);
export const deleteUserApi = (id: number | string) =>
  apiClient.delete(`/user/${id}`);

// --- 日志管理模块 ---
export const getLogPageApi = (params: PageParams) =>
  apiClient.get("/log/page", { params });
export const exportLogsApi = (params: {
  operator?: string;
  operation?: string;
}) => apiClient.get("/log/export", { params });
