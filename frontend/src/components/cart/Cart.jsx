import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash, FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../../redux/features/cartSlice";
import {
  formatPrice,
  calculateCartTotal,
  calculateCartItemCount,
} from "../../helpers/helpers";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const totalItems = calculateCartItemCount(cartItems);
  const totalPrice = calculateCartTotal(cartItems);

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
    toast.info("Item removed from cart");
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(productId);
      return;
    }
    dispatch(updateQuantity({ productId, quantity: newQuantity }));
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      dispatch(clearCart());
      toast.info("Cart cleared");
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.warning("Please login to proceed with checkout");
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-12">
        <div className="text-6xl mb-4 text-gray-300">
          <FaShoppingCart />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-600 mb-6">
          Looks like you haven't added any items yet.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {totalItems} {totalItems === 1 ? "item" : "items"} in cart
              </span>
              <button
                onClick={handleClearCart}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Clear Cart
              </button>
            </div>

            <div className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <div
                  key={item.product}
                  className="p-4 flex items-center space-x-4"
                >
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
                      onClick={() =>
                        handleUpdateQuantity(item.product, item.quantity - 1)
                      }
                      className="w-8 h-8 border border-gray-300 rounded-lg hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.product, item.quantity + 1)
                      }
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
                    onClick={() => handleRemoveItem(item.product)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Order Summary
            </h3>

            <div className="space-y-3 border-b border-gray-200 pb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Subtotal ({totalItems} items)
                </span>
                <span className="font-medium">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">Calculated at checkout</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-bold mt-4">
              <span>Total</span>
              <span className="text-blue-600">{formatPrice(totalPrice)}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full mt-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Proceed to Checkout
            </button>

            <Link
              to="/products"
              className="block text-center text-sm text-gray-600 hover:text-blue-600 mt-4"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
