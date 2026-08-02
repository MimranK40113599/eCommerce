import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { CATEGORIES } from "../../constants/constants";

const ProductFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("price[gte]") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("price[lte]") || "");

  useEffect(() => {
    setCategory(searchParams.get("category") || "");
    setMinPrice(searchParams.get("price[gte]") || "");
    setMaxPrice(searchParams.get("price[lte]") || "");
  }, [searchParams]);

  const updateFilters = (key, value) => {
    if (value) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
    searchParams.set("page", 1);
    setSearchParams(searchParams);
  };

  const applyPriceFilter = (e) => {
    e.preventDefault();
    if (minPrice) searchParams.set("price[gte]", minPrice);
    else searchParams.delete("price[gte]");
    
    if (maxPrice) searchParams.set("price[lte]", maxPrice);
    else searchParams.delete("price[lte]");
    
    searchParams.set("page", 1);
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    searchParams.delete("category");
    searchParams.delete("price[gte]");
    searchParams.delete("price[lte]");
    searchParams.set("page", 1);
    setSearchParams(searchParams);
  };

  return (
    <div className="flex flex-col space-y-6 text-[#0f1111]">
      
      {/* Category Filter */}
      <div>
        <h4 className="font-bold text-[14px] mb-2">Department</h4>
        <ul className="space-y-1 text-[14px]">
          <li>
            <button 
              onClick={() => updateFilters("category", "")}
              className={`hover:text-[#c45500] text-left ${category === "" ? "font-bold text-[#e47911]" : "text-[#007185]"}`}
            >
              Any Department
            </button>
          </li>
          {CATEGORIES.map((cat) => (
            <li key={cat}>
               <button 
                onClick={() => updateFilters("category", cat)}
                className={`hover:text-[#c45500] text-left ${category === cat ? "font-bold text-[#e47911]" : "text-[#0f1111] hover:underline"}`}
               >
                 {cat}
               </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Customer Reviews */}
      <div>
        <h4 className="font-bold text-[14px] mb-2">Customer Reviews</h4>
        <ul className="space-y-2 text-[14px]">
          {[4, 3, 2, 1].map((stars) => (
            <li key={stars} className="flex items-center text-[#de7921] cursor-pointer hover:text-[#c45500]">
              {'★'.repeat(stars)}{'★'.repeat(5-stars).replace(/★/g, '☆')} <span className="text-[#0f1111] ml-1">& Up</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-bold text-[14px] mb-2">Price</h4>
        <ul className="space-y-1 text-[14px] mb-2 text-[#0f1111]">
          <li><button className="hover:text-[#c45500] hover:underline">Under $25</button></li>
          <li><button className="hover:text-[#c45500] hover:underline">$25 to $50</button></li>
          <li><button className="hover:text-[#c45500] hover:underline">$50 to $100</button></li>
          <li><button className="hover:text-[#c45500] hover:underline">$100 to $200</button></li>
          <li><button className="hover:text-[#c45500] hover:underline">$200 & Above</button></li>
        </ul>
        <form onSubmit={applyPriceFilter} className="flex items-center space-x-2 mt-2">
          <input
            type="number"
            placeholder="$ Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-16 px-2 py-1 border border-gray-400 rounded-md focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] text-[14px]"
            min="0"
          />
          <span className="text-gray-500">-</span>
          <input
            type="number"
            placeholder="$ Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-16 px-2 py-1 border border-gray-400 rounded-md focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] text-[14px]"
            min="0"
          />
          <button
            type="submit"
            className="px-3 py-1 bg-white border border-[#D5D9D9] hover:bg-[#F0F2F2] rounded-lg shadow-sm text-[13px] font-medium"
          >
            Go
          </button>
        </form>
      </div>

      {(category || minPrice || maxPrice) && (
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={clearFilters}
            className="text-[14px] text-[#007185] hover:text-[#c45500] hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;
