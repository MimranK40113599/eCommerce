import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash, FaShoppingCart, FaArrowLeft, FaShieldAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
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
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-[60vh] flex flex-col items-center justify-center py-12"
      >
        <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-5xl text-slate-300">
          <FaShoppingCart />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Your cart is empty
        </h2>
        <p className="text-slate-500 mb-8 text-lg">
          Looks like you haven't added any items yet.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/30"
        >
          <FaArrowLeft className="mr-3" />
          Start Shopping
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto py-8"
    >
      <div className="flex items-end justify-between mb-8 border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-bold text-slate-900">Shopping Cart</h1>
        <span className="text-slate-500 font-medium">
          {totalItems} {totalItems === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-semibold text-slate-700 uppercase tracking-wider text-sm">Products</h2>
              <button
                onClick={handleClearCart}
                className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
              >
                Clear Cart
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {cartItems.map((item) => (
                <div key={item.product} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 hover:bg-slate-50/50 transition-colors">
                  {/* Product Image */}
                  <Link to={`/products/${item.product}`} className="w-24 h-24 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200">
                    <img src={item.image || 'https://via.placeholder.com/150'} alt={item.name} className="w-full h-full object-contain p-2 hover:scale-110 transition-transform" />
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0 w-full">
                    <Link to={`/products/${item.product}`} className="text-lg font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-2 leading-tight">
                      {item.name}
                    </Link>
                    <p className="text-xl font-black text-indigo-600 mt-2">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  {/* Mobile Actions Row (Qty + Remove + Total) */}
                  <div className="flex items-center justify-between w-full sm:w-auto sm:flex-row gap-4 mt-2 sm:mt-0">
                    {/* Quantity */}
                    <div className="flex items-center bg-white border border-slate-200 rounded-full p-1 shadow-sm">
                      <button
                        onClick={() => handleUpdateQuantity(item.product, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 rounded-full transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-slate-800 text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.product, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 rounded-full transition-colors"
                        disabled={item.quantity >= item.stock}
                      >
                        +
                      </button>
                    </div>

                    {/* Item Total (Visible on mobile, hidden on sm unless configured) */}
                    <div className="text-right sm:hidden">
                      <p className="font-bold text-slate-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => handleRemoveItem(item.product)}
                      className="p-2 text-slate-300 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors"
                      title="Remove item"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  
                  {/* Item Total (Desktop) */}
                  <div className="hidden sm:block text-right min-w-[100px]">
                    <p className="font-black text-slate-900 text-lg">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8 sticky top-24">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h3>

            <div className="space-y-4 border-b border-slate-100 pb-6">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({totalItems} items)</span>
                <span className="font-medium text-slate-900">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping estimate</span>
                <span className="font-medium text-emerald-600">Free</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax estimate</span>
                <span className="font-medium text-slate-900">Calculated at checkout</span>
              </div>
            </div>

            <div className="flex justify-between items-end mt-6 mb-8">
              <span className="text-lg font-bold text-slate-900">Order Total</span>
              <span className="text-3xl font-black text-indigo-600">{formatPrice(totalPrice)}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-4 bg-indigo-600 text-white rounded-full font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2"
            >
              <span>Checkout</span>
              <FaArrowLeft className="rotate-180" />
            </button>

            <div className="mt-6 flex items-center justify-center space-x-2 text-slate-400 text-sm">
              <FaShieldAlt />
              <span>Secure checkout powered by Stripe</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Cart;
