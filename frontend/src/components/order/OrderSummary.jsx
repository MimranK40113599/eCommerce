import React from "react";
import { formatPrice } from "../../helpers/helpers";

const OrderSummary = ({
  items,
  itemsPrice,
  taxAmount,
  shippingAmount,
  totalAmount,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h3>

      <div className="space-y-3 border-b border-gray-200 pb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Items ({items?.length || 0})</span>
          <span className="font-medium">{formatPrice(itemsPrice || 0)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">
            {formatPrice(shippingAmount || 0)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax</span>
          <span className="font-medium">{formatPrice(taxAmount || 0)}</span>
        </div>
      </div>

      <div className="flex justify-between text-lg font-bold mt-4">
        <span>Total</span>
        <span className="text-blue-600">{formatPrice(totalAmount || 0)}</span>
      </div>
    </div>
  );
};

export default OrderSummary;
