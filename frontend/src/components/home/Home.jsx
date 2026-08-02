import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../product/ProductCard";
import HorizontalProductScroll from "../product/HorizontalProductScroll";
import { useGetProductsQuery } from "../../api/productApi";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const heroImages = [
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop", // Dark theme devices
  "https://images.unsplash.com/photo-1555529771-835f59fc5efe?q=80&w=2070&auto=format&fit=crop", // Fashion
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop", // Shoes
  "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070&auto=format&fit=crop" // Tech desk
];

const Home = () => {
  const { data, isLoading } = useGetProductsQuery({ limit: 12 });
  const products = data?.products || [];
  
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide(currentSlide === heroImages.length - 1 ? 0 : currentSlide + 1);
  const prevSlide = () => setCurrentSlide(currentSlide === 0 ? heroImages.length - 1 : currentSlide - 1);

  return (
    <div className="relative w-full max-w-[1500px] mx-auto pb-10">
      {/* 1. Amazon Hero Slider (Fades at bottom) */}
      <div className="relative w-full h-[300px] md:h-[600px] -z-10 bg-slate-900 overflow-hidden group">
        
        {/* Slides Container */}
        <div 
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {heroImages.map((img, idx) => (
            <img 
              key={idx}
              src={img}
              alt={`Promo ${idx + 1}`}
              className="w-full h-full object-cover object-top flex-shrink-0"
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <button 
          onClick={prevSlide}
          className="absolute top-0 left-0 h-[250px] md:h-[400px] px-2 md:px-6 flex items-center justify-center opacity-0 group-hover:opacity-100 focus:outline-none focus:ring-4 focus:ring-white transition-opacity z-20"
        >
          <div className="text-white hover:text-gray-300 text-3xl md:text-5xl drop-shadow-md">
            <FaChevronLeft />
          </div>
        </button>
        <button 
          onClick={nextSlide}
          className="absolute top-0 right-0 h-[250px] md:h-[400px] px-2 md:px-6 flex items-center justify-center opacity-0 group-hover:opacity-100 focus:outline-none focus:ring-4 focus:ring-white transition-opacity z-20"
        >
          <div className="text-white hover:text-gray-300 text-3xl md:text-5xl drop-shadow-md">
            <FaChevronRight />
          </div>
        </button>

        {/* Gradient fade to match background */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#e3e6e6] via-[#e3e6e6]/80 to-transparent z-10 pointer-events-none"></div>
      </div>

      {/* 2. Floating Content Grid (overlaps hero image) */}
      <div className="relative z-10 px-4 md:px-6 -mt-32 md:-mt-80">
        
        {/* Amazon-style Dense Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 mb-8">
          
          {/* Card 1: Single Item Promo */}
          <div className="bg-white p-5 flex flex-col cursor-pointer z-20">
            <h2 className="text-[21px] font-bold text-[#0f1111] mb-3 leading-tight">Gaming accessories</h2>
            <div className="flex-1 bg-gray-100 flex items-center justify-center p-4 h-[260px] overflow-hidden">
               <img src="https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=600" alt="Gaming" className="w-full h-full object-cover" />
            </div>
            <Link to="/products?category=Electronics" className="mt-4 text-[13px] text-[#007185] hover:text-[#c45500] hover:underline">
              See more
            </Link>
          </div>

          {/* Card 2: Quad Grid */}
          <div className="bg-white p-5 flex flex-col cursor-pointer z-20">
            <h2 className="text-[21px] font-bold text-[#0f1111] mb-3 leading-tight">Shop deals in Fashion</h2>
            <div className="grid grid-cols-2 gap-3 h-[260px]">
              <div className="flex flex-col"><div className="flex-1 bg-gray-100 mb-1 overflow-hidden"><img src="https://images.unsplash.com/photo-1576995853123-5a10305d93c0" className="w-full h-full object-cover"/></div><span className="text-[12px]">Jeans</span></div>
              <div className="flex flex-col"><div className="flex-1 bg-gray-100 mb-1 overflow-hidden"><img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab" className="w-full h-full object-cover"/></div><span className="text-[12px]">Tops</span></div>
              <div className="flex flex-col"><div className="flex-1 bg-gray-100 mb-1 overflow-hidden"><img src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a" className="w-full h-full object-cover"/></div><span className="text-[12px]">Shoes</span></div>
              <div className="flex flex-col"><div className="flex-1 bg-gray-100 mb-1 overflow-hidden"><img src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809" className="w-full h-full object-cover"/></div><span className="text-[12px]">Dresses</span></div>
            </div>
            <Link to="/products?category=Fashion" className="mt-4 text-[13px] text-[#007185] hover:text-[#c45500] hover:underline">
              See all deals
            </Link>
          </div>

          {/* Card 3: Sign in Box */}
          <div className="flex flex-col gap-5 z-20">
            <div className="bg-white p-5 flex flex-col items-center text-center">
              <h2 className="text-[21px] font-bold text-[#0f1111] mb-2 leading-tight">Sign in for the best experience</h2>
              <Link to="/login" className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-black text-sm font-semibold py-2 rounded-lg border border-[#fcd200] shadow-sm mb-3">
                Sign in securely
              </Link>
            </div>
            
            {/* Ad Banner Below Sign in */}
            <div className="bg-white p-5 flex-1 flex flex-col">
              <div className="flex-1 bg-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
                <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff" alt="Ad" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>

          {/* Card 4: Single Item Promo */}
          <div className="bg-white p-5 flex flex-col cursor-pointer z-20 hidden lg:flex">
            <h2 className="text-[21px] font-bold text-[#0f1111] mb-3 leading-tight">Deals in PCs</h2>
            <div className="flex-1 bg-gray-100 flex items-center justify-center p-4 h-[260px] overflow-hidden">
               <img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=600" alt="PC" className="w-full h-full object-cover" />
            </div>
            <Link to="/products?category=Electronics" className="mt-4 text-[13px] text-[#007185] hover:text-[#c45500] hover:underline">
              Shop now
            </Link>
          </div>

        </div>

        {/* 3. Horizontal Scroller - Amazon Style */}
        <div className="bg-white p-5 mb-5 relative z-20">
          <h2 className="text-xl md:text-2xl font-bold text-[#0f1111] mb-4">Related to items you've viewed</h2>
          {isLoading ? (
             <div className="flex gap-4 overflow-hidden h-[250px]">
               {[1,2,3,4,5,6].map(i => <div key={i} className="w-[200px] h-full bg-gray-100 animate-pulse"></div>)}
             </div>
          ) : (
            <HorizontalProductScroll products={products} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
