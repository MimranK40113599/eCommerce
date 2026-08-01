import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaShoppingBag } from "react-icons/fa";
import { useGetMyOrdersQuery } from "../../api/orderApi";
import {
  formatPrice,
  formatDate,
  getOrderStatusColor,
  getOrderStatusBadge,
} from "../../helpers/helpers";
import Pagination from "../common/Pagination";
import Loader from "../common/Loader";

const OrderList = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useGetMyOrdersQuery({ page, limit: 10 });

  const orders = data?.orders || [];
  const totalCount = data?.pagination?.totalCount || 0;
  const totalPages = data?.pagination?.totalPages || 1;

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">
          Failed to load orders. Please try again.
        </p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-12">
        <div className="text-6xl mb-4 text-gray-300">
          <FaShoppingBag />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Orders Yet</h2>
        <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
        <Link
          to="/products"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                    #{order._id.slice(-8)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {formatPrice(order.totalAmount)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getOrderStatusColor(order.orderStatus)}`}
                    >
                      {getOrderStatusBadge(order.orderStatus)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {order.paymentMethod}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/orders/${order._id}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700"
                    >
                      <FaEye className="mr-1" />
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
};

export default OrderList;
