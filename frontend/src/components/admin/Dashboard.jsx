import React from "react";
import { Link } from "react-router-dom";
import { useGetSalesStatsQuery } from "../../api/orderApi";
import { formatPrice } from "../../helpers/helpers";
import { FaChartLine, FaBox, FaUsers, FaClipboardList, FaPlus, FaCog } from "react-icons/fa";
import { APP_NAME } from "../../constants/constants";

const Dashboard = () => {
  const { data: statsData, isLoading } = useGetSalesStatsQuery({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
    endDate: new Date().toISOString()
  });

  const stats = statsData || { totalSales: 0, totalOrders: 0, totalUsers: 0, totalProducts: 0 };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="spinner border-t-[#febd69]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-12">
      
      {/* Seller Central Header */}
      <div className="bg-[#232f3e] text-white px-6 py-4 flex justify-between items-center shadow-md">
         <div className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tighter">{APP_NAME}</span>
            <span className="text-xs uppercase tracking-widest text-[#febd69] font-bold border-l border-gray-500 pl-2 ml-2">Seller Central</span>
         </div>
         <div className="flex items-center space-x-6 text-sm">
            <Link to="/" className="hover:text-[#febd69] hover:underline">View Store</Link>
            <span className="hover:text-[#febd69] hover:underline cursor-pointer flex items-center"><FaCog className="mr-1"/> Settings</span>
         </div>
      </div>
      
      {/* Sub Nav */}
      <div className="bg-white border-b border-gray-300 shadow-sm px-6 py-3 flex space-x-6 text-[14px] font-bold text-[#0f1111]">
         <span className="text-[#007185] border-b-2 border-[#e47911] pb-[10px] cursor-pointer">Dashboard</span>
         <Link to="/admin/products" className="hover:text-[#c45500] hover:underline cursor-pointer">Inventory</Link>
         <Link to="/admin/orders" className="hover:text-[#c45500] hover:underline cursor-pointer">Orders</Link>
         <Link to="/admin/users" className="hover:text-[#c45500] hover:underline cursor-pointer">Customers</Link>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-6">
        
        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          <div className="bg-white border border-[#D5D9D9] rounded-lg p-5 shadow-sm">
             <div className="flex justify-between items-start mb-2">
               <span className="text-[14px] text-[#565959] font-bold">Sales (30 days)</span>
               <FaChartLine className="text-[#007185] text-xl" />
             </div>
             <div className="text-[28px] font-medium text-[#0f1111]">{formatPrice(stats.totalSales || 0)}</div>
             <div className="text-[12px] text-[#007600] mt-1">▲ 12% vs previous period</div>
          </div>

          <div className="bg-white border border-[#D5D9D9] rounded-lg p-5 shadow-sm">
             <div className="flex justify-between items-start mb-2">
               <span className="text-[14px] text-[#565959] font-bold">Orders (30 days)</span>
               <FaClipboardList className="text-[#007185] text-xl" />
             </div>
             <div className="text-[28px] font-medium text-[#0f1111]">{stats.totalOrders || 0}</div>
             <div className="text-[12px] text-[#007600] mt-1">▲ 4% vs previous period</div>
          </div>

          <div className="bg-white border border-[#D5D9D9] rounded-lg p-5 shadow-sm">
             <div className="flex justify-between items-start mb-2">
               <span className="text-[14px] text-[#565959] font-bold">Active Inventory</span>
               <FaBox className="text-[#007185] text-xl" />
             </div>
             <div className="text-[28px] font-medium text-[#0f1111]">{stats.totalProducts || 0}</div>
             <Link to="/admin/products" className="text-[12px] text-[#007185] hover:text-[#c45500] hover:underline mt-1 inline-block">Manage inventory ▶</Link>
          </div>

          <div className="bg-white border border-[#D5D9D9] rounded-lg p-5 shadow-sm">
             <div className="flex justify-between items-start mb-2">
               <span className="text-[14px] text-[#565959] font-bold">Total Customers</span>
               <FaUsers className="text-[#007185] text-xl" />
             </div>
             <div className="text-[28px] font-medium text-[#0f1111]">{stats.totalUsers || 0}</div>
             <Link to="/admin/users" className="text-[12px] text-[#007185] hover:text-[#c45500] hover:underline mt-1 inline-block">View customers ▶</Link>
          </div>

        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Quick Actions */}
          <div className="lg:col-span-1">
             <div className="bg-white border border-[#D5D9D9] rounded-lg shadow-sm">
                <div className="bg-[#f0f2f2] px-4 py-3 border-b border-[#D5D9D9]">
                  <h2 className="font-bold text-[16px] text-[#0f1111]">Quick Actions</h2>
                </div>
                <div className="p-4 space-y-3">
                   <Link to="/admin/product/new" className="flex items-center justify-between p-3 border border-[#D5D9D9] rounded bg-gray-50 hover:bg-[#F0F2F2]">
                     <span className="text-[14px] font-bold text-[#0f1111]">Add a Product</span>
                     <FaPlus className="text-[#007185]" />
                   </Link>
                   <Link to="/admin/orders" className="flex items-center justify-between p-3 border border-[#D5D9D9] rounded bg-gray-50 hover:bg-[#F0F2F2]">
                     <span className="text-[14px] font-bold text-[#0f1111]">Manage Orders</span>
                     <FaClipboardList className="text-[#007185]" />
                   </Link>
                   <div className="mt-4 pt-4 border-t border-[#D5D9D9]">
                     <h3 className="text-[14px] font-bold mb-2">Seller News</h3>
                     <p className="text-[12px] text-[#565959] mb-2"><span className="font-bold text-[#007185]">New:</span> Boost your sales with sponsored products ads.</p>
                     <p className="text-[12px] text-[#565959]"><span className="font-bold text-[#007185]">Alert:</span> Holiday shipping deadlines are approaching.</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Chart Placeholder / Data Table */}
          <div className="lg:col-span-2">
             <div className="bg-white border border-[#D5D9D9] rounded-lg shadow-sm mb-6">
                <div className="bg-[#f0f2f2] px-4 py-3 border-b border-[#D5D9D9]">
                  <h2 className="font-bold text-[16px] text-[#0f1111]">Sales Performance</h2>
                </div>
                <div className="p-8 flex items-center justify-center h-[300px] bg-gray-50">
                  {/* Faux Chart */}
                  <div className="w-full h-full border-l-2 border-b-2 border-gray-300 relative flex items-end justify-between px-2 pt-10">
                     {[40, 60, 45, 80, 50, 90, 70].map((h, i) => (
                       <div key={i} className="w-[10%] bg-[#007185] hover:bg-[#e77600] transition-colors rounded-t-sm" style={{height: `${h}%`}}></div>
                     ))}
                     <span className="absolute -left-12 top-0 text-[11px] text-gray-500">$10k</span>
                     <span className="absolute -left-12 bottom-0 text-[11px] text-gray-500">$0</span>
                  </div>
                </div>
             </div>
          </div>
          
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
