import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { formatPrice } from "../../helpers/helpers";
import { addToCart } from "../../redux/features/cartSlice";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { _id, name, price, images, ratings, numOfReviews, stock, discount = 0 } = product;
  const imageUrl = images?.[0]?.url || images?.[0] || 'https://via.placeholder.com/400?text=Product';
  const discountedPrice = discount > 0 ? price - (price * discount) / 100 : price;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (stock === 0) return;
    dispatch(addToCart({ product: _id, name, price: discountedPrice, image: imageUrl, quantity: 1, stock }));
    window.dispatchEvent(new Event('open-cart'));
  };

  const renderStars = () => {
    return (
      <div className="flex items-center space-x-1 text-[#de7921] text-[14px]">
        <span>★</span><span>★</span><span>★</span><span>★</span><span className="text-gray-300">★</span>
        <span className="text-[#007185] ml-1 hover:text-[#c45500] hover:underline cursor-pointer">{numOfReviews || 0}</span>
      </div>
    );
  };

  return (
    <div className="group bg-white border border-[#D5D9D9] p-4 flex flex-col relative transition-all duration-300 hover:shadow-xl hover:scale-[1.01] hover:z-10">
      
      {/* Image Container */}
      <div className="w-full h-[200px] mb-4 bg-gray-50 flex items-center justify-center p-2 rounded-sm overflow-hidden mix-blend-multiply">
        <Link to={`/products/${_id}`} className="w-full h-full flex justify-center">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        {discount > 0 && (
          <div className="absolute top-0 left-0 bg-[#cc0c39] text-white text-[11px] font-bold px-2 py-1">
            {discount}% off
          </div>
        )}
      </div>
      
      <div className="flex flex-col flex-1">
        <Link to={`/products/${_id}`}>
          <h3 className="text-[15px] font-normal text-[#0f1111] hover:text-[#c45500] line-clamp-2 leading-tight mb-1">
            {name}
          </h3>
        </Link>
        
        <div className="mb-1">
          {renderStars()}
        </div>

        <div className="mt-auto">
          <div className="flex items-start">
             <span className="text-[12px] font-normal mt-1 mr-[2px]">$</span>
             <span className="text-[28px] font-semibold leading-none">{Math.floor(discountedPrice)}</span>
             <span className="text-[12px] font-normal mt-1 ml-[2px]">{(discountedPrice % 1).toFixed(2).substring(2)}</span>
          </div>
          {discount > 0 && (
             <span className="text-[12px] text-[#565959]">List: <span className="line-through">${price}</span></span>
          )}
          
          <div className="mt-2 text-[12px]">
            <span className="text-[#565959]">Delivery </span>
            <span className="font-bold text-[#0f1111]">Tomorrow, Jan 1</span>
          </div>

          <div className="mt-3">
             <button 
                onClick={handleAddToCart}
                disabled={stock === 0}
                className={`w-full py-1.5 rounded-full text-sm shadow-sm border transition-transform active:scale-[0.98] ${stock > 0 ? 'bg-[#ffd814] hover:bg-[#f7ca00] border-[#fcd200] text-black cursor-pointer' : 'bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed'}`}
             >
                {stock > 0 ? 'Add to cart' : 'Out of stock'}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
