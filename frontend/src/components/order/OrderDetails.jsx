import React from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaPrint } from "react-icons/fa";
import { useGetOrderDetailsQuery } from "../../api/orderApi";
import {
  formatPrice,
  formatDate,
  getOrderStatusColor,
  getOrderStatusBadge,
} from "../../helpers/helpers";
import Loader from "../common/Loader";

const OrderDetails = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useGetOrderDetailsQuery(id);

  if (isLoading) return <Loader />;

  if (error || !data?.order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Order not found.</p>
        <Link
          to="/me/orders"
          className="text-blue-600 hover:underline mt-2 inline-block"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  const order = data.order;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link
            to="/me/orders"
            className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-2"
          >
            <FaArrowLeft className="mr-2" />
            Back to Orders
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Order Details</h1>
          <p className="text-sm text-gray-500">Order ID: #{order._id}</p>
        </div>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <FaPrint className="inline mr-2" />
          Print
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-semibold text-gray-800 mb-2">Order Status</h3>
            <div className="flex items-center space-x-3">
              <span
                className={`px-3 py-1 text-sm font-semibold rounded-full ${getOrderStatusColor(order.orderStatus)}`}
              >
                {getOrderStatusBadge(order.orderStatus)}
              </span>
              {order.deliveredAt && (
                <span className="text-sm text-gray-500">
                  Delivered on {formatDate(order.deliveredAt)}
                </span>
              )}
              {order.shippedAt && (
                <span className="text-sm text-gray-500">
                  Shipped on {formatDate(order.shippedAt)}
                </span>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div
                  key={item.product}
                  className="flex items-center space-x-4 pb-4 border-b border-gray-100 last:border-0"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <Link
                      to={`/products/${item.product}`}
                      className="font-medium text-gray-800 hover:text-blue-600"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-gray-500">
                      {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Items Price</span>
                <span className="font-medium">
                  {formatPrice(order.itemsPrice)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">
                  {formatPrice(order.taxAmount)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {formatPrice(order.shippingAmount)}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-semibold text-gray-800 mb-4">
              Shipping Information
            </h3>
            <div className="space-y-1 text-sm">
              <p className="text-gray-700">{order.shippingInfo.address}</p>
              <p className="text-gray-700">
                {order.shippingInfo.city}, {order.shippingInfo.zipCode}
              </p>
              <p className="text-gray-700">{order.shippingInfo.country}</p>
              <p className="text-gray-700">
                Phone: {order.shippingInfo.phoneNo}
              </p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-semibold text-gray-800 mb-4">
              Payment Information
            </h3>
            <div className="space-y-1 text-sm">
              <p className="text-gray-700">
                <span className="font-medium">Method:</span>{" "}
                {order.paymentMethod}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={
                    order.paymentInfo?.status === "Paid"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }
                >
                  {order.paymentInfo?.status || "Pending"}
                </span>
              </p>
              {order.paymentInfo?.id && (
                <p className="text-gray-500 text-xs font-mono">
                  Payment ID: {order.paymentInfo.id}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
