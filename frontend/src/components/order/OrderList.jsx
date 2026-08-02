import React from "react";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../api/orderApi";
import { formatPrice } from "../../helpers/helpers";
import { APP_NAME } from "../../constants/constants";

const OrderList = () => {
  const { data, isLoading } = useGetMyOrdersQuery();

  const orders = data?.orders || [];

  return (
    <div className="bg-white min-h-[70vh] pb-12">
      <div className="max-w-[1000px] mx-auto px-4 py-6">
        
        {/* Breadcrumb */}
        <div className="text-sm text-[#565959] mb-4">
          <Link to="/me" className="hover:underline text-[#007185]">Your Account</Link> &rsaquo; 
          <span className="text-[#c45500] font-bold ml-1">Your Orders</span>
        </div>

        <div className="flex flex-col md:flex-row justify-between md:items-end mb-6 gap-4">
          <h1 className="text-[28px] font-normal text-[#0f1111]">Your Orders</h1>
          
          <div className="flex items-center">
            <input 
               type="text" 
               placeholder="Search all orders" 
               className="w-full md:w-[250px] px-3 py-1 border border-gray-400 rounded-l-md focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] text-[14px]"
            />
            <button className="bg-gray-800 text-white px-4 py-1 border border-gray-800 rounded-r-md text-[14px] hover:bg-gray-700">
               Search Orders
            </button>
          </div>
        </div>

        {/* Amazon Tabs */}
        <div className="border-b border-gray-300 mb-6 flex space-x-6 text-[14px]">
           <span className="font-bold text-[#e47911] border-b-2 border-[#e47911] pb-2 cursor-pointer">Orders</span>
           <span className="text-[#007185] hover:text-[#c45500] hover:underline pb-2 cursor-pointer">Buy Again</span>
           <span className="text-[#007185] hover:text-[#c45500] hover:underline pb-2 cursor-pointer">Not Yet Shipped</span>
           <span className="text-[#007185] hover:text-[#c45500] hover:underline pb-2 cursor-pointer">Cancelled Orders</span>
        </div>

        <div>
          <div className="mb-4 text-[14px] text-[#0f1111]">
            <span className="font-bold">{orders.length} orders</span> placed in 
            <select className="ml-2 border border-[#D5D9D9] bg-[#F0F2F2] rounded-md px-2 py-1 text-[13px] shadow-sm focus:outline-none cursor-pointer">
              <option>past 3 months</option>
              <option>2024</option>
              <option>2023</option>
            </select>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-10"><div className="spinner"></div></div>
          ) : orders.length === 0 ? (
            <div className="py-10 text-[14px] text-[#0f1111]">
              You have not placed any orders in the past 3 months.
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="border border-[#D5D9D9] rounded-lg overflow-hidden flex flex-col">
                  
                  {/* Order Header (Gray) */}
                  <div className="bg-[#F0F2F2] p-4 text-[13px] text-[#565959] flex flex-wrap justify-between items-start border-b border-[#D5D9D9]">
                    <div className="flex space-x-8">
                       <div className="flex flex-col">
                         <span>ORDER PLACED</span>
                         <span className="text-[#0f1111]">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                       </div>
                       <div className="flex flex-col">
                         <span>TOTAL</span>
                         <span className="text-[#0f1111]">{formatPrice(order.totalAmount)}</span>
                       </div>
                       <div className="flex flex-col hidden sm:flex">
                         <span>SHIP TO</span>
                         <span className="text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer">
                           {order.user?.name}
                         </span>
                       </div>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <span>ORDER # {order._id.substring(0, 10).toUpperCase()}-XXXX</span>
                      <div className="flex space-x-2 mt-1">
                        <Link to={`/orders/${order._id}`} className="text-[#007185] hover:text-[#c45500] hover:underline">View order details</Link>
                        <span className="text-gray-300">|</span>
                        <span className="text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer">View invoice</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Body (White) */}
                  <div className="p-4 bg-white flex flex-col md:flex-row gap-6">
                     <div className="flex-1">
                       <h3 className="font-bold text-[16px] text-[#0f1111] mb-2">
                         {order.orderStatus === 'Delivered' ? (
                           <span className="text-[#007600]">Delivered</span>
                         ) : (
                           `Status: ${order.orderStatus}`
                         )}
                       </h3>
                       
                       <div className="space-y-4">
                         {order.orderItems.map(item => (
                           <div key={item.product} className="flex gap-4">
                             <img src={item.image} alt={item.name} className="w-[90px] h-[90px] object-contain" />
                             <div className="flex-1">
                                <Link to={`/products/${item.product}`} className="text-[14px] text-[#007185] hover:text-[#c45500] hover:underline font-bold">
                                  {item.name}
                                </Link>
                                <p className="text-[12px] text-[#565959] mt-1">Return window closed on {new Date(new Date(order.createdAt).getTime() + 30*24*60*60*1000).toLocaleDateString()}</p>
                                <div className="mt-2 flex space-x-2">
                                   <button className="bg-[#ffd814] hover:bg-[#f7ca00] text-black text-[13px] px-3 py-1 rounded-full border border-[#fcd200] shadow-sm">Buy it again</button>
                                   <button className="bg-white hover:bg-gray-50 text-black text-[13px] px-3 py-1 rounded-full border border-[#D5D9D9] shadow-sm">View your item</button>
                                </div>
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>

                     {/* Actions */}
                     <div className="w-full md:w-[250px] flex flex-col space-y-2">
                        <button className="w-full bg-white hover:bg-gray-50 text-[#0f1111] text-[13px] py-1.5 rounded-full border border-[#D5D9D9] shadow-sm">Track package</button>
                        <button className="w-full bg-white hover:bg-gray-50 text-[#0f1111] text-[13px] py-1.5 rounded-full border border-[#D5D9D9] shadow-sm">Return or replace items</button>
                        <button className="w-full bg-white hover:bg-gray-50 text-[#0f1111] text-[13px] py-1.5 rounded-full border border-[#D5D9D9] shadow-sm">Share gift receipt</button>
                        <button className="w-full bg-white hover:bg-gray-50 text-[#0f1111] text-[13px] py-1.5 rounded-full border border-[#D5D9D9] shadow-sm">Write a product review</button>
                     </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default OrderList;
