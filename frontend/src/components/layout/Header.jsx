import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaShoppingCart,
  FaSearch,
  FaBars,
  FaMapMarkerAlt
} from "react-icons/fa";
import { APP_NAME } from "../../constants/constants";
import { logout } from "../../redux/features/authSlice";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const cartItemCount = cartItems?.reduce((count, item) => count + item.quantity, 0) || 0;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?keyword=${searchTerm}`);
    } else {
      navigate(`/products`);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="flex flex-col w-full text-white">
      {/* Tier 1: Main Nav */}
      <div className="bg-[#131921] px-2 py-2 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4 w-full h-auto md:h-[60px]">
        
        {/* Left Section: Logo & Location */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Logo */}
          <Link to="/" className="flex items-center pt-1 border border-transparent hover:border-white p-1 rounded-sm transition-colors">
            <span className="text-2xl font-bold tracking-tighter text-white leading-none">
              {APP_NAME}<span className="text-[#febd69]">.com</span>
            </span>
          </Link>

          {/* Location (Hidden on mobile) */}
          <div className="hidden md:flex items-end border border-transparent hover:border-white p-1 rounded-sm cursor-pointer transition-colors">
             <div className="flex items-end text-slate-300 mr-1 mt-3">
               <FaMapMarkerAlt />
             </div>
             <div className="flex flex-col leading-tight">
               <span className="text-[12px] text-slate-300">Deliver to</span>
               <span className="text-[14px] font-bold text-white">United States</span>
             </div>
          </div>
        </div>

        {/* Middle: Search Bar */}
        <form onSubmit={handleSearch} className="flex flex-1 w-full md:w-auto h-10 rounded-md overflow-hidden bg-white focus-within:ring-[3px] focus-within:ring-[#f90] transition-shadow duration-200">
          <select className="bg-gray-100 text-black px-2 border-r border-gray-300 text-xs hidden md:block focus:outline-none focus:ring-2 focus:ring-[#f90] cursor-pointer">
            <option>All</option>
          </select>
          <input
            type="text"
            placeholder="Search Amazon"
            className="flex-1 px-3 text-black focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="bg-[#febd69] hover:bg-[#f3a847] px-4 flex items-center justify-center text-gray-800 transition-colors">
            <FaSearch className="text-xl" />
          </button>
        </form>

        {/* Auth / Account */}
        <div className="flex items-center space-x-1">
          {isAuthenticated ? (
            <div className="relative group">
              <div className="flex flex-col items-start leading-tight border border-transparent hover:border-white p-1 rounded-sm transition-colors cursor-pointer">
                <span className="text-[12px] text-gray-300">Hello, {user?.name?.split(" ")[0]}</span>
                <span className="text-[14px] font-bold">Account & Lists</span>
              </div>
              {/* Dropdown */}
              <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-gray-300 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible z-50 p-4 text-black text-sm">
                 <h3 className="font-bold mb-2">Your Account</h3>
                 <ul className="space-y-2">
                   <li><Link to="/me" className="hover:text-[#e47911] hover:underline">Account Settings</Link></li>
                   <li><Link to="/me/orders" className="hover:text-[#e47911] hover:underline">Your Orders</Link></li>
                   {user?.role === "admin" && (
                     <li><Link to="/admin" className="hover:text-[#e47911] hover:underline text-indigo-600">Admin Dashboard</Link></li>
                   )}
                   <li className="pt-2 border-t mt-2">
                     <button onClick={handleLogout} className="hover:text-[#e47911] hover:underline w-full text-left">Sign Out</button>
                   </li>
                 </ul>
              </div>
            </div>
          ) : (
            <Link to="/login" className="flex flex-col items-start leading-tight border border-transparent hover:border-white p-1 rounded-sm transition-colors">
              <span className="text-[12px] text-gray-300">Hello, sign in</span>
              <span className="text-[14px] font-bold">Account & Lists</span>
            </Link>
          )}

          {/* Returns & Orders (Hidden on mobile) */}
          <Link to="/me/orders" className="hidden md:flex flex-col items-start leading-tight border border-transparent hover:border-white p-1 rounded-sm transition-colors">
            <span className="text-[12px] text-gray-300">Returns</span>
            <span className="text-[14px] font-bold">& Orders</span>
          </Link>

          {/* Cart */}
          <div onClick={() => window.dispatchEvent(new Event('open-cart'))} className="flex items-center cursor-pointer relative border border-transparent hover:border-white p-1 rounded-sm transition-colors">
            <div className="relative flex items-center h-full">
              <span className="absolute top-[-4px] left-[18px] text-[#f08804] text-[16px] font-bold z-10 w-4 text-center">{cartItemCount}</span>
              <FaShoppingCart className="text-[34px] relative z-0" />
              <span className="text-[14px] font-bold text-white mb-1 ml-1 mt-auto hidden sm:block">Cart</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sub-nav */}
      <div className="w-full bg-[#232f3e] text-white text-[14px] font-medium px-4 py-2 flex items-center overflow-x-auto whitespace-nowrap hide-scrollbar">
        <ul className="flex items-center space-x-2">
          <li>
            <Link to="/products" className="flex items-center border border-transparent hover:border-white px-2 py-1 rounded-sm transition-colors">
              <FaBars className="mr-1" /> All
            </Link>
          </li>
          <li><Link to="/products?category=Electronics" className="border border-transparent hover:border-white px-2 py-1 rounded-sm transition-colors">Today's Deals</Link></li>
          <li><Link to="/products?category=Customer%20Service" className="border border-transparent hover:border-white px-2 py-1 rounded-sm transition-colors">Customer Service</Link></li>
          <li><Link to="/products?category=Registry" className="border border-transparent hover:border-white px-2 py-1 rounded-sm transition-colors">Registry</Link></li>
          <li><Link to="/products?category=Gift%20Cards" className="border border-transparent hover:border-white px-2 py-1 rounded-sm transition-colors">Gift Cards</Link></li>
          <li><Link to="/products?category=Sell" className="border border-transparent hover:border-white px-2 py-1 rounded-sm transition-colors">Sell</Link></li>
          
          {user?.role === "admin" && (
            <li><Link to="/admin" className="border border-transparent hover:border-white px-2 py-1 rounded-sm text-indigo-300 transition-colors">Admin Dashboard</Link></li>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
