/* import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBox,
  FaShoppingBag,
  FaUsers,
  FaDollarSign,
  FaArrowUp,
  FaArrowDown,
  FaEye,
} from "react-icons/fa";
import {
  useGetAdminOrdersQuery,
  useGetSalesStatsQuery,
} from "../../api/orderApi";
import { useGetAdminUsersQuery } from "../../api/userApi";
import { formatPrice, formatDate } from "../../helpers/helpers";

const Dashboard = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const { data: ordersData, isLoading: ordersLoading } = useGetAdminOrdersQuery(
    { limit: 5 },
  );
  const { data: usersData, isLoading: usersLoading } = useGetAdminUsersQuery();
  const { data: salesData, isLoading: salesLoading } = useGetSalesStatsQuery({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  const recentOrders = ordersData?.orders || [];
  const totalOrders = ordersData?.pagination?.totalCount || 0;
  const totalUsers = usersData?.count || 0;

  const stats = [
    {
      title: "Total Revenue",
      value: formatPrice(salesData?.totalSales || 0),
      icon: FaDollarSign,
      color: "bg-green-500",
      bg: "bg-green-100",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: FaShoppingBag,
      color: "bg-blue-500",
      bg: "bg-blue-100",
    },
    {
      title: "Total Users",
      value: totalUsers,
      icon: FaUsers,
      color: "bg-purple-500",
      bg: "bg-purple-100",
    },
    {
      title: "Total Products",
      value: "N/A",
      icon: FaBox,
      color: "bg-orange-500",
      bg: "bg-orange-100",
    },
  ];

  if (ordersLoading || usersLoading || salesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) =>
              setDateRange({ ...dateRange, startDate: e.target.value })
            }
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) =>
              setDateRange({ ...dateRange, endDate: e.target.value })
            }
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      </div>

      {/ Stats Grid /}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`${stat.color} text-xl`} />
              </div>
              <span className="text-2xl font-bold text-gray-800">
                {stat.value}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">{stat.title}</p>
          </div>
        ))}
      </div>

      {/ Recent Orders /}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
          <Link
            to="/admin/orders"
            className="text-sm text-blue-600 hover:underline"
          >
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No orders found
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono">
                      #{order._id.slice(-8)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.user?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          order.orderStatus === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : order.orderStatus === "Shipped"
                              ? "bg-blue-100 text-blue-800"
                              : order.orderStatus === "Processing"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/admin/orders/${order._id}`}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <FaEye />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
 */

/* 







*/

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBox,
  FaShoppingBag,
  FaUsers,
  FaDollarSign,
  FaEye,
} from "react-icons/fa";
import {
  useGetAdminOrdersQuery,
  useGetSalesStatsQuery,
} from "../../api/orderApi";
import { useGetAdminUsersQuery } from "../../api/userApi";
import { formatPrice, formatDate } from "../../helpers/helpers";

const Dashboard = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const { data: ordersData, isLoading: ordersLoading } = useGetAdminOrdersQuery(
    { limit: 5 },
  );
  const { data: usersData, isLoading: usersLoading } = useGetAdminUsersQuery();
  const { data: salesData, isLoading: salesLoading } = useGetSalesStatsQuery({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  if (ordersLoading || usersLoading || salesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  const recentOrders = ordersData?.orders || [];
  const totalOrders = ordersData?.pagination?.totalCount || 0;
  const totalUsers = usersData?.count || 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) =>
              setDateRange({ ...dateRange, startDate: e.target.value })
            }
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) =>
              setDateRange({ ...dateRange, endDate: e.target.value })
            }
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-green-100">
              <FaDollarSign className="text-green-500 text-xl" />
            </div>
            <span className="text-2xl font-bold text-gray-800">
              {formatPrice(salesData?.totalSales || 0)}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2">Total Revenue</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-blue-100">
              <FaShoppingBag className="text-blue-500 text-xl" />
            </div>
            <span className="text-2xl font-bold text-gray-800">
              {totalOrders}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2">Total Orders</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-purple-100">
              <FaUsers className="text-purple-500 text-xl" />
            </div>
            <span className="text-2xl font-bold text-gray-800">
              {totalUsers}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2">Total Users</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-orange-100">
              <FaBox className="text-orange-500 text-xl" />
            </div>
            <span className="text-2xl font-bold text-gray-800">-</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">Total Products</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
          <Link
            to="/admin/orders"
            className="text-sm text-blue-600 hover:underline"
          >
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No orders found
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono">
                      #{order._id.slice(-8)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.user?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          order.orderStatus === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : order.orderStatus === "Shipped"
                              ? "bg-blue-100 text-blue-800"
                              : order.orderStatus === "Processing"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/admin/orders/${order._id}`}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <FaEye />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
