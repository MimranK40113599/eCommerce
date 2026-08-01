import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const AdminRoute = () => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    toast.error("Please login to access admin panel");
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    toast.error("You do not have permission to access this page");
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
