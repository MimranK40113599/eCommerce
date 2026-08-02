import React from "react";
import { Link } from "react-router-dom";
import { APP_NAME } from "../../constants/constants";

const Footer = () => {
  return (
    <footer className="w-full mt-auto text-white">
      {/* Back to top */}
      <div 
        className="bg-[#37475a] hover:bg-[#485769] text-center py-4 cursor-pointer text-[13px] font-semibold transition-colors"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        Back to top
      </div>

      {/* Main Footer Links */}
      <div className="bg-[#232f3e] py-10 px-4">
        <div className="max-w-[1000px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-[16px] mb-3">Get to Know Us</h3>
            <ul className="text-[#DDDDDD] text-[14px] space-y-2">
              <li><a href="#" className="hover:underline">Careers</a></li>
              <li><a href="#" className="hover:underline">Blog</a></li>
              <li><a href="#" className="hover:underline">About {APP_NAME}</a></li>
              <li><a href="#" className="hover:underline">Investor Relations</a></li>
              <li><a href="#" className="hover:underline">{APP_NAME} Devices</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-[16px] mb-3">Make Money with Us</h3>
            <ul className="text-[#DDDDDD] text-[14px] space-y-2">
              <li><a href="#" className="hover:underline">Sell products on {APP_NAME}</a></li>
              <li><a href="#" className="hover:underline">Sell on {APP_NAME} Business</a></li>
              <li><a href="#" className="hover:underline">Sell apps on {APP_NAME}</a></li>
              <li><a href="#" className="hover:underline">Become an Affiliate</a></li>
              <li><a href="#" className="hover:underline">Advertise Your Products</a></li>
              <li><a href="#" className="hover:underline">Self-Publish with Us</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-[16px] mb-3">Amazon Payment Products</h3>
            <ul className="text-[#DDDDDD] text-[14px] space-y-2">
              <li><a href="#" className="hover:underline">{APP_NAME} Business Card</a></li>
              <li><a href="#" className="hover:underline">Shop with Points</a></li>
              <li><a href="#" className="hover:underline">Reload Your Balance</a></li>
              <li><a href="#" className="hover:underline">{APP_NAME} Currency Converter</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-[16px] mb-3">Let Us Help You</h3>
            <ul className="text-[#DDDDDD] text-[14px] space-y-2">
              <li><a href="#" className="hover:underline">{APP_NAME} and COVID-19</a></li>
              <li><a href="#" className="hover:underline">Your Account</a></li>
              <li><a href="#" className="hover:underline">Your Orders</a></li>
              <li><a href="#" className="hover:underline">Shipping Rates & Policies</a></li>
              <li><a href="#" className="hover:underline">Returns & Replacements</a></li>
              <li><a href="#" className="hover:underline">Manage Your Content and Devices</a></li>
              <li><a href="#" className="hover:underline">Help</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Divider & Logo */}
      <div className="bg-[#232f3e] border-t border-[#3a4553] py-8 flex flex-col items-center">
         <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold tracking-tighter">{APP_NAME}</span>
         </div>
         <div className="flex space-x-2 mt-4 text-[13px] text-[#CCCCCC]">
           <span className="border border-[#848688] rounded-sm px-2 py-1 cursor-pointer">English</span>
           <span className="border border-[#848688] rounded-sm px-2 py-1 cursor-pointer">$ USD - U.S. Dollar</span>
           <span className="border border-[#848688] rounded-sm px-2 py-1 cursor-pointer">United States</span>
         </div>
      </div>

      {/* Bottom Legal Section */}
      <div className="bg-[#131921] py-8 text-center text-[12px] text-[#DDDDDD]">
        <div className="flex justify-center space-x-4 mb-2">
          <a href="#" className="hover:underline">Conditions of Use</a>
          <a href="#" className="hover:underline">Privacy Notice</a>
          <a href="#" className="hover:underline">Consumer Health Data Privacy Disclosure</a>
          <a href="#" className="hover:underline">Your Ads Privacy Choices</a>
        </div>
        <p>&copy; 1996-{new Date().getFullYear()}, {APP_NAME}.com, Inc. or its affiliates</p>
      </div>
    </footer>
  );
};

export default Footer;
