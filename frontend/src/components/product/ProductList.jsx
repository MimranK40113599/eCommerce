import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetProductsQuery } from "../../api/productApi";
import ProductCard from "./ProductCard";
import ProductFilters from "./ProductFilters";
import Pagination from "../common/Pagination";
import { PRODUCTS_PER_PAGE } from "../../constants/constants";

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get("page")) || 1;
  const keyword = searchParams.get("keyword") || "";
  const category = searchParams.get("category") || "";
  const minPrice = searchParams.get("price[gte]") || "";
  const maxPrice = searchParams.get("price[lte]") || "";
  const sort = searchParams.get("sort") || "-createdAt";

  const queryParams = {
    page: currentPage,
    limit: PRODUCTS_PER_PAGE,
    ...(keyword && { keyword }),
    ...(category && { category }),
    ...(minPrice && { "price[gte]": minPrice }),
    ...(maxPrice && { "price[lte]": maxPrice }),
    sort,
  };

  const { data, isLoading, error, refetch } = useGetProductsQuery(queryParams);

  const products = data?.products || [];
  const totalCount = data?.filteredProductsCount || 0;
  const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);

  const handlePageChange = (page) => {
    searchParams.set("page", page);
    setSearchParams(searchParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-white min-h-screen border-t border-gray-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] pt-2 pb-12">
      {/* Top Results Bar */}
      <div className="w-full bg-white border-b border-gray-200 px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between text-[14px] text-[#0f1111] shadow-sm mb-4">
        <div>
          {totalCount > 0 ? (
            <span>
              1-{Math.min(PRODUCTS_PER_PAGE, products.length)} of over {totalCount} results for <span className="font-bold text-[#c45500]">"{keyword || category || 'All Products'}"</span>
            </span>
          ) : (
            <span>No results for <span className="font-bold text-[#c45500]">"{keyword || category || 'All Products'}"</span></span>
          )}
        </div>
        
        <div className="flex items-center mt-2 sm:mt-0 bg-[#F0F2F2] border border-[#D5D9D9] rounded-lg px-2 py-1 shadow-sm">
          <label className="mr-2 text-xs">Sort by:</label>
          <select
            value={sort}
            onChange={(e) => {
              searchParams.set("sort", e.target.value);
              setSearchParams(searchParams);
            }}
            className="bg-transparent text-sm focus:outline-none cursor-pointer"
          >
            <option value="-createdAt">Featured</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="-ratings">Avg. Customer Review</option>
          </select>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-2 md:px-4 flex flex-col md:flex-row gap-4">
        {/* Filters Sidebar */}
        <div className="w-full md:w-[240px] flex-shrink-0">
          <ProductFilters />
        </div>

        {/* Products Grid */}
        <div className="flex-1 w-full">
          <h2 className="text-[20px] font-bold text-[#0f1111] mb-2">Results</h2>
          <p className="text-[14px] text-[#565959] mb-4">Check each product page for other buying options.</p>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-gray-100 p-4 animate-pulse h-[350px] border border-gray-200"></div>
              ))}
            </div>
          ) : error ? (
            <div className="py-10 text-[#b12704]">
              <p className="font-bold">Failed to load products.</p>
              <button onClick={() => refetch()} className="mt-2 text-[#007185] hover:underline">Try Again</button>
            </div>
          ) : products.length === 0 ? (
            <div className="py-10">
              <p className="text-[16px] text-[#0f1111]">Try checking your spelling or use more general terms</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                  <div key={product._id} className="w-full">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
