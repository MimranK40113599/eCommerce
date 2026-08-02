import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaMapMarkerAlt, FaLock } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useGetReviewsQuery,
  useCanReviewQuery,
  useCreateReviewMutation,
} from "../../api/productApi";
import { addToCart } from "../../redux/features/cartSlice";
import { formatPrice, getImageUrl } from "../../helpers/helpers";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { data: productData, isLoading, error } = useGetProductDetailsQuery(id);
  const { data: reviewsData } = useGetReviewsQuery(id, { skip: !id });
  const { data: canReviewData } = useCanReviewQuery(id, { skip: !isAuthenticated || !id });
  const [createReview] = useCreateReviewMutation();

  const product = productData?.product;
  const reviews = reviewsData?.reviews || [];
  const canReview = canReviewData?.canReview || false;
  const hasReviewed = canReviewData?.hasReviewed || false;

  useEffect(() => {
    if (error?.status === 404) {
      toast.error("Product not found");
      navigate("/products");
    }
  }, [error, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white">
        <div className="spinner border-t-[#febd69]"></div>
      </div>
    );
  }

  if (!product) return null;

  const { name, price, description, ratings, numOfReviews, images = [], stock, seller, discount = 0 } = product;
  const imageUrl = getImageUrl(images[selectedImage]);
  const discountedPrice = discount > 0 ? price - (price * discount) / 100 : price;

  const renderStars = () => {
    return (
      <div className="flex items-center space-x-1 text-[#de7921] text-[18px]">
        <span>★</span><span>★</span><span>★</span><span>★</span><span className="text-gray-300">★</span>
        <span className="text-[#007185] ml-2 text-sm hover:text-[#c45500] hover:underline cursor-pointer">{numOfReviews || 0} ratings</span>
      </div>
    );
  };

  const handleAddToCart = () => {
    if (stock === 0) return;
    dispatch(addToCart({ product: id, name, price: discountedPrice, image: imageUrl, quantity, stock }));
    window.dispatchEvent(new Event('open-cart'));
  };

  const handleBuyNow = () => {
    if (stock === 0) return;
    dispatch(addToCart({ product: id, name, price: discountedPrice, image: imageUrl, quantity, stock }));
    navigate("/checkout");
  };

  return (
    <div className="bg-white min-h-screen pb-12">
      {/* Breadcrumb */}
      <div className="text-sm text-[#565959] py-2 px-4 border-b border-gray-200">
        <Link to="/" className="hover:underline text-[#565959]">Home</Link> &rsaquo; 
        <Link to="/products" className="hover:underline text-[#565959] ml-1">Products</Link>
      </div>

      <div className="max-w-[1500px] mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left: Image Gallery */}
          <div className="w-full lg:w-[40%] flex gap-4">
            <div className="flex flex-col gap-2 w-[50px]">
              {images.map((img, index) => (
                <div 
                  key={index} 
                  onMouseEnter={() => setSelectedImage(index)}
                  className={`w-[40px] h-[40px] border rounded overflow-hidden cursor-pointer ${selectedImage === index ? 'border-[#e77600] shadow-[0_0_3px_2px_rgba(228,121,17,0.5)]' : 'border-gray-400 hover:border-gray-500'}`}
                >
                  <img src={getImageUrl(img)} alt="" className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
            <div className="flex-1 max-w-[500px] flex items-center justify-center p-4">
               <img src={imageUrl} alt={name} className="w-full object-contain max-h-[500px] mix-blend-multiply" />
            </div>
          </div>

          {/* Center: Details */}
          <div className="w-full lg:w-[40%] flex flex-col">
            <h1 className="text-[24px] font-normal leading-tight text-[#0f1111] mb-1">
              {name}
            </h1>
            <div className="mb-2">
              <span className="text-[14px] text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer">Brand: {seller}</span>
            </div>
            <div className="flex items-center pb-2 border-b border-gray-300 mb-4">
              {renderStars()}
            </div>

            <div className="flex flex-col mb-4">
               {discount > 0 && (
                 <div className="flex items-center text-[#cc0c39] mb-1">
                   <span className="text-[24px] font-normal mr-2">-{discount}%</span>
                   <div className="flex items-start">
                     <span className="text-[14px] font-normal mt-1 mr-[2px]">$</span>
                     <span className="text-[28px] font-medium leading-none">{Math.floor(discountedPrice)}</span>
                     <span className="text-[14px] font-normal mt-1 ml-[2px]">{(discountedPrice % 1).toFixed(2).substring(2)}</span>
                   </div>
                 </div>
               )}
               {!discount && (
                  <div className="flex items-start mb-1">
                     <span className="text-[14px] font-normal mt-1 mr-[2px]">$</span>
                     <span className="text-[28px] font-medium leading-none">{Math.floor(price)}</span>
                     <span className="text-[14px] font-normal mt-1 ml-[2px]">{(price % 1).toFixed(2).substring(2)}</span>
                  </div>
               )}
               {discount > 0 && (
                 <span className="text-[12px] text-[#565959]">Typical price: <span className="line-through">${price}</span></span>
               )}
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-[16px] text-[#0f1111] mb-2">About this item</h3>
              <ul className="list-disc pl-5 text-[14px] text-[#0f1111] space-y-1">
                {description.split('. ').map((point, index) => point && (
                  <li key={index}>{point.trim()}{point.endsWith('.') ? '' : '.'}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Buy Box */}
          <div className="w-full lg:w-[20%]">
             <div className="border border-gray-300 rounded-[8px] p-4 flex flex-col w-full shadow-sm">
                <div className="flex items-start mb-4 text-[#0f1111]">
                   <span className="text-[14px] font-normal mt-1 mr-[2px]">$</span>
                   <span className="text-[28px] font-medium leading-none">{Math.floor(discountedPrice)}</span>
                   <span className="text-[14px] font-normal mt-1 ml-[2px]">{(discountedPrice % 1).toFixed(2).substring(2)}</span>
                </div>
                
                <div className="text-[14px] text-[#565959] mb-4 leading-tight">
                  <span className="text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer">FREE Returns</span>
                </div>

                <div className="text-[14px] text-[#0f1111] mb-4 leading-tight">
                  <span className="font-bold">FREE delivery</span> <b>Tomorrow, Jan 1</b>. Order within <span className="text-[#007185]">5 hrs 30 mins</span>
                </div>

                <div className="flex items-start text-[#007185] text-[12px] hover:text-[#c45500] hover:underline cursor-pointer mb-4">
                  <FaMapMarkerAlt className="mt-1 mr-1 text-[#0f1111]"/> Deliver to United States
                </div>

                <div className="mb-4">
                  {stock > 0 ? (
                    <span className="text-[18px] text-[#007600] font-medium">In Stock</span>
                  ) : (
                    <span className="text-[18px] text-[#b12704] font-medium">Out of Stock</span>
                  )}
                </div>

                {stock > 0 && (
                  <>
                    <div className="flex items-center mb-4">
                      <span className="text-[14px] mr-2 text-[#0f1111] shadow-sm bg-[#f0f2f2] border border-[#d5d9d9] rounded-lg px-3 py-1 cursor-pointer">
                        Qty: 
                        <select className="bg-transparent outline-none ml-1 cursor-pointer" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}>
                          {[...Array(Math.min(stock, 10))].map((_, i) => (
                            <option key={i+1} value={i+1}>{i+1}</option>
                          ))}
                        </select>
                      </span>
                    </div>

                    <div className="flex flex-col gap-2 mb-4">
                      <button 
                        onClick={handleAddToCart}
                        className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] text-[14px] rounded-full py-1.5 shadow-sm border border-[#fcd200]"
                      >
                        Add to Cart
                      </button>
                      <button 
                        onClick={handleBuyNow}
                        className="w-full bg-[#ffa41c] hover:bg-[#fa8900] text-[#0f1111] text-[14px] rounded-full py-1.5 shadow-sm border border-[#ff8f00]"
                      >
                        Buy Now
                      </button>
                    </div>

                    <div className="flex items-center text-[12px] text-[#565959]">
                      <FaLock className="mr-2 text-gray-400" /> <span className="text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer">Secure transaction</span>
                    </div>

                    <div className="grid grid-cols-[1fr_2fr] gap-x-2 gap-y-1 text-[12px] mt-4">
                      <span className="text-[#565959]">Ships from</span>
                      <span className="text-[#0f1111]">Amazon</span>
                      <span className="text-[#565959]">Sold by</span>
                      <span className="text-[#0f1111]">{seller}</span>
                      <span className="text-[#565959]">Returns</span>
                      <span className="text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer">Eligible for Return</span>
                    </div>
                  </>
                )}
             </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 border-t border-gray-300 pt-8">
           <h2 className="text-[21px] font-bold text-[#0f1111] mb-6">Customer reviews</h2>
           {reviews.length === 0 ? (
             <p className="text-[14px] text-[#565959]">No reviews yet.</p>
           ) : (
             <div className="max-w-[800px]">
               <ReviewList reviews={reviews} />
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
