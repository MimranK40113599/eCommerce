import React from 'react';
import ProductCard from './ProductCard';

const HorizontalProductScroll = ({ products }) => {
  const displayProducts = products && products.length > 0 ? products : [
    { _id: '1', name: 'Premium Over-Ear Headphones', price: 299.99, images: ['/images/premium_headphones_1785664610467.jpg'], stock: 10, ratings: 5, numOfReviews: 124 },
    { _id: '2', name: 'Minimalist Smart Watch', price: 199.99, images: ['/images/smart_watch_1785664618811.jpg'], stock: 15, ratings: 4.8, numOfReviews: 89 },
    { _id: '3', name: 'Pro Mechanical Keyboard', price: 149.99, images: ['/images/mechanical_keyboard_1785664628630.jpg'], stock: 5, ratings: 4.9, numOfReviews: 210 },
    { _id: '4', name: 'Ergonomic Wireless Mouse', price: 89.99, images: ['/images/wireless_mouse_1785664636672.jpg'], stock: 20, ratings: 4.7, numOfReviews: 156 },
  ];

  return (
    <div className="relative">
      <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar">
        {displayProducts.map((product) => (
          <div 
            key={product._id} 
            className="w-[200px] md:w-[240px] flex-shrink-0 snap-start"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalProductScroll;
