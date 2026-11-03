import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string;
  role: string;
  // 其他可能的字段
}

const AdminRoute = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        setIsAdmin(decoded.role === 'ROLE_ADMIN');
      } catch (error) {
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
  }, []);

  if (isAdmin === null) {
    // 正在验证
    return <div>Loading...</div>;
  }

  return isAdmin ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export default AdminRoute;
