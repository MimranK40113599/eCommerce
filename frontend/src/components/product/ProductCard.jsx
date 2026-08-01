import React from "react";
import { Link } from "react-router-dom";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaShoppingCart,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  formatPrice,
  getImageUrl,
  getRatingPercentage,
} from "../../helpers/helpers";
import { addToCart } from "../../redux/features/cartSlice";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const {
    _id,
    name,
    price,
    images,
    ratings,
    numOfReviews,
    stock,
    discount = 0,
  } = product;

  const imageUrl = getImageUrl(images?.[0]);

  // Calculate discounted price
  const discountedPrice =
    discount > 0 ? price - (price * discount) / 100 : price;

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-400" />);
    }

    return stars;
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (stock === 0) {
      toast.error("Product is out of stock");
      return;
    }

    dispatch(
      addToCart({
        product: _id,
        name,
        price: discountedPrice,
        image: imageUrl,
        quantity: 1,
        stock,
      }),
    );

    toast.success(`${name} added to cart!`);
  };

  return (
    <Link
      to={`/products/${_id}`}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
    >
      <div className="relative">
        {/* Product Image */}
        <div className="h-48 overflow-hidden bg-gray-100">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {discount}% OFF
          </div>
        )}

        {/* Out of Stock Badge */}
        {stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick Add to Cart Button */}
        {stock > 0 && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-700"
          >
            <FaShoppingCart />
          </button>
        )}
      </div>

      <div className="p-4">
        {/* Product Name */}
        <h3 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2 min-h-[40px]">
          {name}
        </h3>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-2">
          <div className="flex text-sm">{renderStars(ratings || 0)}</div>
          <span className="text-xs text-gray-500 ml-1">
            ({numOfReviews || 0})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(discountedPrice)}
            </span>
            {discount > 0 && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(price)}
              </span>
            )}
          </div>
          {stock > 0 && (
            <span className="text-xs text-green-600 font-medium">In Stock</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
