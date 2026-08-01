import React from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaArrowRight } from "react-icons/fa";
import { useGetProductsQuery } from "../api/productApi";
import ProductCard from "./product/ProductCard";
import { APP_NAME } from "../constants/constants";

const Home = () => {
  const { data, isLoading, error } = useGetProductsQuery({
    limit: 8,
    page: 1,
  });

  const featuredProducts = data?.products?.slice(0, 8) || [];

  // Categories for display
  const categories = [
    { name: "Electronics", icon: "💻", color: "bg-blue-100" },
    { name: "Laptops", icon: "🖥️", color: "bg-purple-100" },
    { name: "Headphones", icon: "🎧", color: "bg-green-100" },
    { name: "Cameras", icon: "📷", color: "bg-yellow-100" },
    { name: "Accessories", icon: "⌚", color: "bg-pink-100" },
    { name: "Fashion", icon: "👕", color: "bg-red-100" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 rounded-2xl mb-12 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to {APP_NAME}
            </h1>
            <p className="text-lg md:text-xl mb-8 text-blue-100">
              Discover amazing products at unbeatable prices. Shop the latest
              trends in electronics, fashion, and more.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                <FaShoppingCart className="mr-2" />
                Start Shopping
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Explore Products
                <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-blue-400 rounded-full opacity-20"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-blue-400 rounded-full opacity-20"></div>
      </section>

      {/* Categories Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/products?category=${category.name}`}
              className={`${category.color} p-4 rounded-xl text-center hover:shadow-lg transition-shadow`}
            >
              <div className="text-3xl mb-2">{category.icon}</div>
              <p className="text-sm font-medium text-gray-700">
                {category.name}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Featured Products
          </h2>
          <Link
            to="/products"
            className="text-blue-600 hover:text-blue-700 flex items-center"
          >
            View All
            <FaArrowRight className="ml-2" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
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
              Failed to load products. Please try again later.
            </p>
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-600">
              No products found. Check back later!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Trust Badges */}
      <section className="mt-12 bg-gray-50 rounded-xl p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-2">🚚</div>
            <p className="font-semibold text-gray-800">Free Shipping</p>
            <p className="text-sm text-gray-600">On orders over $200</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🔒</div>
            <p className="font-semibold text-gray-800">Secure Payment</p>
            <p className="text-sm text-gray-600">100% secure transactions</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">⭐</div>
            <p className="font-semibold text-gray-800">Quality Products</p>
            <p className="text-sm text-gray-600">Premium quality guaranteed</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">💬</div>
            <p className="font-semibold text-gray-800">24/7 Support</p>
            <p className="text-sm text-gray-600">Dedicated customer service</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
