import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaBox,
  FaShoppingBag,
  FaUsers,
  FaChartLine,
  FaCog,
} from "react-icons/fa";
import { APP_NAME } from "../../constants/constants";

const AdminSidebar = () => {
  const menuItems = [
    { path: "/admin", icon: FaHome, label: "Dashboard" },
    { path: "/admin/products", icon: FaBox, label: "Products" },
    { path: "/admin/orders", icon: FaShoppingBag, label: "Orders" },
    { path: "/admin/users", icon: FaUsers, label: "Users" },
    { path: "/admin/sales", icon: FaChartLine, label: "Sales" },
    { path: "/admin/settings", icon: FaCog, label: "Settings" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-gray-800 text-white shadow-lg">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">{APP_NAME}</h1>
        <p className="text-sm text-gray-400">Admin Panel</p>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`
            }
          >
            <item.icon className="text-lg" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
