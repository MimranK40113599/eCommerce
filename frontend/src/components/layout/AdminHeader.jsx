import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { useLogoutMutation } from "../../api/authApi";
import { logout } from "../../redux/features/authSlice";

const AdminHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [logoutUser] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logout());
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
            <FaUser />
          </div>
          <span className="text-sm text-gray-700">{user?.name || "Admin"}</span>
        </div>

        <button
          onClick={handleLogout}
          className="text-gray-500 hover:text-red-600 transition-colors"
          title="Logout"
        >
          <FaSignOutAlt className="text-lg" />
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
