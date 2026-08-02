import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { FaTimes, FaTrashAlt } from 'react-icons/fa';
import { formatPrice } from '../../helpers/helpers';
import { removeFromCart, addToCart } from '../../redux/features/cartSlice';

const CartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);

  useEffect(() => {
    const handleOpenCart = () => setIsOpen(true);
    const handleCloseCart = () => setIsOpen(false);
    
    window.addEventListener('open-cart', handleOpenCart);
    window.addEventListener('close-cart', handleCloseCart);

    return () => {
      window.removeEventListener('open-cart', handleOpenCart);
      window.removeEventListener('close-cart', handleCloseCart);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleUpdateQuantity = (item, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(addToCart({ ...item, quantity: newQuantity }));
  };

  const totalPrice = cartItems?.reduce((acc, item) => acc + item.quantity * item.price, 0) || 0;
  const totalItems = cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[#f2f4f8] shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-300 shadow-sm">
          <h2 className="text-[20px] font-bold text-[#0f1111]">
            Subtotal <span className="text-[#b12704]">{formatPrice(totalPrice)}</span>
          </h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 text-gray-500 hover:text-black rounded-full flex items-center justify-center transition-colors hover:bg-gray-100"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {cartItems.length > 0 && (
          <div className="p-4 bg-white border-b border-gray-300 shadow-sm flex flex-col gap-2">
            <button 
              onClick={() => { setIsOpen(false); navigate('/checkout'); }}
              className="w-full py-2 bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] text-[#0f1111] text-[14px] rounded-lg shadow-sm"
            >
              Proceed to checkout ({totalItems} items)
            </button>
            <button 
              onClick={() => { setIsOpen(false); navigate('/cart'); }}
              className="w-full py-2 bg-white hover:bg-gray-50 border border-[#D5D9D9] text-[#0f1111] text-[14px] rounded-lg shadow-sm"
            >
              Go to Cart
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-[#0f1111] p-4 bg-white rounded-lg shadow-sm">
              <p className="text-[18px] font-bold mb-2">Your Amazon Cart is empty</p>
              <button 
                onClick={() => { setIsOpen(false); navigate('/products'); }}
                className="px-6 py-2 bg-[#ffd814] border border-[#fcd200] text-black text-sm rounded-lg hover:bg-[#f7ca00] shadow-sm"
              >
                Sign in to your account
              </button>
              <button 
                onClick={() => { setIsOpen(false); navigate('/login'); }}
                className="px-6 py-2 bg-white border border-[#D5D9D9] text-black text-sm rounded-lg hover:bg-gray-50 shadow-sm mt-2"
              >
                Sign up now
              </button>
            </div>
          ) : (
            cartItems?.map((item) => (
              <div key={item.product} className="flex gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="w-20 h-20 bg-white flex-shrink-0 p-1">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 flex flex-col min-w-0">
                  <Link to={`/products/${item.product}`} onClick={() => setIsOpen(false)} className="text-[14px] text-[#007185] hover:text-[#c45500] hover:underline line-clamp-2 leading-tight mb-1">
                    {item.name}
                  </Link>
                  <span className="font-bold text-[#b12704] text-[16px] mb-2">{formatPrice(item.price)}</span>
                  
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="flex items-center bg-[#F0F2F2] border border-[#D5D9D9] rounded-lg shadow-sm">
                      <button 
                        onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                        className="px-3 py-1 text-gray-700 hover:bg-[#e3e6e6] rounded-l-lg"
                      >-</button>
                      <span className="w-8 text-center bg-white text-sm py-1 border-x border-[#D5D9D9]">{item.quantity}</span>
                      <button 
                        onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                        className="px-3 py-1 text-gray-700 hover:bg-[#e3e6e6] rounded-r-lg"
                      >+</button>
                    </div>
                    <button 
                      onClick={() => handleRemove(item.product)}
                      className="text-[12px] text-[#007185] hover:text-[#c45500] hover:underline border-l pl-4 border-gray-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
