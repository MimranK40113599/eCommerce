import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaShoppingCart,
  FaHeart,
  FaShare,
} from "react-icons/fa";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useGetReviewsQuery,
  useCanReviewQuery,
  useCreateReviewMutation,
} from "../../api/productApi";
import { addToCart } from "../../redux/features/cartSlice";
import {
  formatPrice,
  getImageUrl,
  getRatingPercentage,
} from "../../helpers/helpers";
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

  const {
    data: productData,
    isLoading: productLoading,
    error: productError,
  } = useGetProductDetailsQuery(id);

  const { data: reviewsData, isLoading: reviewsLoading } = useGetReviewsQuery(
    id,
    {
      skip: !id,
    },
  );

  const { data: canReviewData } = useCanReviewQuery(id, {
    skip: !isAuthenticated || !id,
  });

  const [createReview, { isLoading: reviewLoading }] =
    useCreateReviewMutation();

  const product = productData?.product;
  const reviews = reviewsData?.reviews || [];
  const canReview = canReviewData?.canReview || false;
  const hasReviewed = canReviewData?.hasReviewed || false;

  // Navigate to products if product not found
  useEffect(() => {
    if (productError?.status === 404) {
      toast.error("Product not found");
      navigate("/products");
    }
  }, [productError, navigate]);

  if (productLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const {
    name,
    price,
    description,
    ratings,
    numOfReviews,
    images = [],
    stock,
    category,
    seller,
    discount = 0,
  } = product;

  const imageUrl = getImageUrl(images[selectedImage]);
  const discountedPrice =
    discount > 0 ? price - (price * discount) / 100 : price;

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

  const handleAddToCart = () => {
    if (stock === 0) {
      toast.error("Product is out of stock");
      return;
    }

    dispatch(
      addToCart({
        product: id,
        name,
        price: discountedPrice,
        image: imageUrl,
        quantity,
        stock,
      }),
    );

    toast.success(`${name} added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      await createReview({
        productId: id,
        ...reviewData,
      }).unwrap();
      toast.success("Review submitted successfully!");
      setShowReviewForm(false);
      // Refetch reviews
    } catch (error) {
      toast.error(error?.data?.message || "Failed to submit review");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Product Images */}
          <div>
            <div className="bg-gray-100 rounded-lg overflow-hidden h-96">
              <img
                src={imageUrl}
                alt={name}
                className="w-full h-full object-contain"
              />
            </div>
            {images.length > 1 && (
              <div className="flex space-x-2 mt-4 overflow-x-auto">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg border-2 overflow-hidden ${
                      selectedImage === index
                        ? "border-blue-500"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={getImageUrl(img)}
                      alt={`${name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">{name}</h1>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {renderStars(ratings || 0)}
              </div>
              <span className="text-sm text-gray-500">
                ({numOfReviews || 0} {numOfReviews === 1 ? "review" : "reviews"}
                )
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(discountedPrice)}
              </span>
              {discount > 0 && (
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(price)}
                </span>
              )}
              {discount > 0 && (
                <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                  {discount}% OFF
                </span>
              )}
            </div>

            <div className="flex items-center space-x-4 text-sm">
              <span className="text-gray-600">Category:</span>
              <Link
                to={`/products?category=${category}`}
                className="text-blue-600 hover:underline"
              >
                {category}
              </Link>
            </div>

            <div className="flex items-center space-x-4 text-sm">
              <span className="text-gray-600">Seller:</span>
              <span className="text-gray-800">{seller}</span>
            </div>

            <div>
              <p className="text-gray-700">{description}</p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {stock > 0 ? (
                <>
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-green-600 font-medium">
                    In Stock ({stock} available)
                  </span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span className="text-red-600 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Quantity Selector */}
            {stock > 0 && (
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">
                  Quantity:
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                    className="px-3 py-1 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-500">max {stock}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={stock === 0}
                className="flex-1 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FaShoppingCart className="inline mr-2" />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={stock === 0}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Buy Now
              </button>
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <FaHeart className="text-gray-400 hover:text-red-500" />
              </button>
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <FaShare className="text-gray-400 hover:text-blue-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Customer Reviews
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
              </span>
            </h2>
            {isAuthenticated && canReview && !hasReviewed && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {showReviewForm ? "Cancel" : "Write a Review"}
              </button>
            )}
          </div>

          {showReviewForm && (
            <ReviewForm
              onSubmit={handleReviewSubmit}
              onCancel={() => setShowReviewForm(false)}
              isLoading={reviewLoading}
            />
          )}

          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No reviews yet. Be the first to review this product!
            </p>
          ) : (
            <ReviewList reviews={reviews} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
