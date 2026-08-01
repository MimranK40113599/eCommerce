import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { CATEGORIES } from "../../constants/constants";

const ProductFilters = ({ onClose }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [minPrice, setMinPrice] = useState(
    searchParams.get("price[gte]") || "",
  );
  const [maxPrice, setMaxPrice] = useState(
    searchParams.get("price[lte]") || "",
  );

  const applyFilters = () => {
    const params = {};

    // Preserve existing params except filters
    searchParams.forEach((value, key) => {
      if (!["category", "price[gte]", "price[lte]"].includes(key)) {
        params[key] = value;
      }
    });

    if (category) params.category = category;
    if (minPrice) params["price[gte]"] = minPrice;
    if (maxPrice) params["price[lte]"] = maxPrice;

    // Reset to page 1 when applying filters
    params.page = 1;

    setSearchParams(params);
    if (onClose) onClose();
  };

  const resetFilters = () => {
    setCategory("");
    setMinPrice("");
    setMaxPrice("");

    const params = {};
    searchParams.forEach((value, key) => {
      if (!["category", "price[gte]", "price[lte]"].includes(key)) {
        params[key] = value;
      }
    });
    params.page = 1;
    setSearchParams(params);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <FaTimes />
        </button>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range
        </label>
        <div className="flex space-x-4">
          <div className="flex-1">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>
          <div className="flex-1">
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={applyFilters}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Apply Filters
        </button>
        <button
          onClick={resetFilters}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default ProductFilters;
