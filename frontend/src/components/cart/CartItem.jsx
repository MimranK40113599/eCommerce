import React from "react";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { formatPrice } from "../../helpers/helpers";

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="p-4 flex items-center space-x-4 hover:bg-gray-50 transition-colors">
      {/* Product Image */}
      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <Link
          to={`/products/${item.product}`}
          className="text-sm font-medium text-gray-800 hover:text-blue-600 truncate"
        >
          {item.name}
        </Link>
        <p className="text-sm font-bold text-gray-900 mt-1">
          {formatPrice(item.price)}
        </p>
      </div>

      {/* Quantity */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onUpdateQuantity(item.product, item.quantity - 1)}
          className="w-8 h-8 border border-gray-300 rounded-lg hover:bg-gray-100"
        >
          -
        </button>
        <span className="w-8 text-center font-medium">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.product, item.quantity + 1)}
          className="w-8 h-8 border border-gray-300 rounded-lg hover:bg-gray-100"
          disabled={item.quantity >= item.stock}
        >
          +
        </button>
      </div>

      {/* Item Total */}
      <div className="text-right min-w-[80px]">
        <p className="font-bold text-gray-900">
          {formatPrice(item.price * item.quantity)}
        </p>
      </div>

      {/* Remove */}
      <button
        onClick={() => onRemove(item.product)}
        className="text-gray-400 hover:text-red-600 transition-colors"
      >
        <FaTrash />
      </button>
    </div>
  );
};

export default CartItem;
