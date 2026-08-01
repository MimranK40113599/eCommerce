import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FaFilter, FaTimes } from "react-icons/fa";
import { useGetProductsQuery } from "../../api/productApi";
import ProductCard from "./ProductCard";
import ProductFilters from "./ProductFilters";
import Pagination from "../common/Pagination";
import { PRODUCTS_PER_PAGE } from "../../constants/constants";

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

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

  const clearFilters = () => {
    setSearchParams({});
  };

  // Apply filters from URL
  const hasActiveFilters = keyword || category || minPrice || maxPrice;

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {keyword ? `Search Results for "${keyword}"` : "All Products"}
        </h1>
        <p className="text-gray-600 mt-1">
          {totalCount} {totalCount === 1 ? "product" : "products"} found
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FaFilter className="mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {
                  [
                    keyword && 1,
                    category && 1,
                    minPrice && 1,
                    maxPrice && 1,
                  ].filter(Boolean).length
                }
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
            >
              <FaTimes className="mr-1" />
              Clear all
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <select
          value={sort}
          onChange={(e) => {
            searchParams.set("sort", e.target.value);
            setSearchParams(searchParams);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="-createdAt">Newest First</option>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
          <option value="-ratings">Highest Rated</option>
        </select>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
          <ProductFilters onClose={() => setShowFilters(false)} />
        </div>
      )}

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-100 rounded-xl p-4 animate-pulse"
            >
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-gray-600">
            Failed to load products. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-600">
            No products found matching your criteria.
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8">
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
  );
};

export default ProductList;
