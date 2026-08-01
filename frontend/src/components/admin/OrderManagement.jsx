import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  useGetAdminOrdersQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
} from "../../api/orderApi";
import {
  formatPrice,
  formatDate,
  getOrderStatusColor,
} from "../../helpers/helpers";
import Pagination from "../common/Pagination";
import Loader from "../common/Loader";
import Modal from "../common/Modal";
import { ORDER_STATUS_OPTIONS } from "../../constants/constants";

const OrderManagement = () => {
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const { data, isLoading, refetch } = useGetAdminOrdersQuery({
    page,
    limit: 10,
  });
  const [updateOrderStatus, { isLoading: updateLoading }] =
    useUpdateOrderStatusMutation();
  const [deleteOrder, { isLoading: deleteLoading }] = useDeleteOrderMutation();

  const orders = data?.orders || [];
  const totalCount = data?.pagination?.totalCount || 0;
  const totalPages = data?.pagination?.totalPages || 1;

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) return;
    try {
      await updateOrderStatus({
        id: selectedOrder._id,
        status: newStatus,
      }).unwrap();
      toast.success("Order status updated successfully");
      setShowStatusModal(false);
      setSelectedOrder(null);
      setNewStatus("");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update order status");
    }
  };

  const handleDelete = async () => {
    if (!selectedOrder) return;
    try {
      await deleteOrder(selectedOrder._id).unwrap();
      toast.success("Order deleted successfully");
      setShowStatusModal(false);
      setSelectedOrder(null);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete order");
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
        <span className="text-sm text-gray-500">{totalCount} total orders</span>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
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
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
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
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getOrderStatusColor(order.orderStatus)}`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span
                        className={
                          order.paymentInfo?.status === "Paid"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }
                      >
                        {order.paymentInfo?.status || "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/orders/${order._id}`}
                          className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                          title="View"
                        >
                          <FaEye />
                        </Link>
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setNewStatus(order.orderStatus);
                            setShowStatusModal(true);
                          }}
                          className="p-1.5 text-gray-400 hover:text-yellow-600 transition-colors"
                          title="Update Status"
                        >
                          <FaEdit />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
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

      {/* Update Status Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          setSelectedOrder(null);
          setNewStatus("");
        }}
        title="Update Order Status"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order #{selectedOrder?._id?.slice(-8)}
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ORDER_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button
              onClick={() => {
                setShowStatusModal(false);
                setSelectedOrder(null);
                setNewStatus("");
              }}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleStatusUpdate}
              disabled={updateLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {updateLoading ? "Updating..." : "Update Status"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OrderManagement;
