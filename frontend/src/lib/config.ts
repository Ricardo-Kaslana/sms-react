// 后端服务地址，可通过 .env 中的 VITE_API_BASE_URL 覆盖
export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8088"
).replace(/\/+$/, "");

// 将后端返回的相对资源路径（如头像）拼接为完整 URL
export const resolveAssetUrl = (path?: string | null) => {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};
