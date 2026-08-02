import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaBoxOpen, FaLock, FaAddressCard, FaCreditCard, FaHeadset, FaGift } from "react-icons/fa";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="bg-white min-h-[70vh] pb-12">
      <div className="max-w-[1000px] mx-auto px-4 py-6">
        
        <h1 className="text-[28px] font-normal text-[#0f1111] mb-6">Your Account</h1>
        
        {/* Amazon Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Box 1 */}
          <Link to="/me/orders" className="border border-[#D5D9D9] hover:bg-gray-50 rounded-lg p-4 flex items-start cursor-pointer shadow-sm">
            <div className="w-[60px] h-[60px] mr-3 mt-1">
              <FaBoxOpen className="text-5xl text-[#007185] opacity-80" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-[17px] text-[#0f1111] font-normal">Your Orders</h2>
              <p className="text-[13px] text-[#565959] leading-tight mt-1">Track, return, or buy things again</p>
            </div>
          </Link>

          {/* Box 2 */}
          <Link to="/me/update" className="border border-[#D5D9D9] hover:bg-gray-50 rounded-lg p-4 flex items-start cursor-pointer shadow-sm">
            <div className="w-[60px] h-[60px] mr-3 mt-1">
              <FaLock className="text-5xl text-[#007185] opacity-80" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-[17px] text-[#0f1111] font-normal">Login & security</h2>
              <p className="text-[13px] text-[#565959] leading-tight mt-1">Edit login, name, and mobile number</p>
            </div>
          </Link>

          {/* Box 3 */}
          <Link to="/me/update" className="border border-[#D5D9D9] hover:bg-gray-50 rounded-lg p-4 flex items-start cursor-pointer shadow-sm">
            <div className="w-[60px] h-[60px] mr-3 mt-1">
              <FaAddressCard className="text-5xl text-[#007185] opacity-80" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-[17px] text-[#0f1111] font-normal">Your Addresses</h2>
              <p className="text-[13px] text-[#565959] leading-tight mt-1">Edit addresses for orders and gifts</p>
            </div>
          </Link>

          {/* Box 4 */}
          <div className="border border-[#D5D9D9] hover:bg-gray-50 rounded-lg p-4 flex items-start cursor-pointer shadow-sm">
            <div className="w-[60px] h-[60px] mr-3 mt-1">
              <FaGift className="text-5xl text-[#007185] opacity-80" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-[17px] text-[#0f1111] font-normal">Gift cards</h2>
              <p className="text-[13px] text-[#565959] leading-tight mt-1">View balance, redeem, or reload cards</p>
            </div>
          </div>

          {/* Box 5 */}
          <div className="border border-[#D5D9D9] hover:bg-gray-50 rounded-lg p-4 flex items-start cursor-pointer shadow-sm">
            <div className="w-[60px] h-[60px] mr-3 mt-1">
              <FaCreditCard className="text-5xl text-[#007185] opacity-80" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-[17px] text-[#0f1111] font-normal">Your Payments</h2>
              <p className="text-[13px] text-[#565959] leading-tight mt-1">Manage payment methods and settings, view all transactions</p>
            </div>
          </div>

          {/* Box 6 */}
          <div className="border border-[#D5D9D9] hover:bg-gray-50 rounded-lg p-4 flex items-start cursor-pointer shadow-sm">
            <div className="w-[60px] h-[60px] mr-3 mt-1">
              <FaHeadset className="text-5xl text-[#007185] opacity-80" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-[17px] text-[#0f1111] font-normal">Customer Service</h2>
              <p className="text-[13px] text-[#565959] leading-tight mt-1">Browse self service options, help articles or contact us</p>
            </div>
          </div>

        </div>
        
        {/* Profile specific minimal info */}
        <div className="mt-8 pt-8 border-t border-gray-200">
           <h3 className="font-bold text-[16px] text-[#0f1111] mb-2">Account snapshot</h3>
           <p className="text-[14px] text-[#565959]">Logged in as: <span className="font-bold text-[#0f1111]">{user?.name}</span> ({user?.email})</p>
           {user?.role === "admin" && (
             <Link to="/admin" className="text-[14px] text-[#007185] hover:text-[#c45500] hover:underline mt-2 inline-block font-bold">
               Go to Admin Dashboard
             </Link>
           )}
        </div>

      </div>
    </div>
  );
};

export default Profile;
