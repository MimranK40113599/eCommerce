import React from "react";
import { FaStar, FaUser, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { formatDate, getAvatarUrl } from "../../helpers/helpers";

const ReviewList = ({ reviews, onDelete, showDelete = false }) => {
  const { user } = useSelector((state) => state.auth);

  // Helper to render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-0.5">
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            className={index < rating ? "text-yellow-400" : "text-gray-300"}
            size={14}
          />
        ))}
      </div>
    );
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div
          key={review._id}
          className="border-b border-gray-200 pb-6 last:border-0"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                {review.user?.avatar?.url ? (
                  <img
                    src={getAvatarUrl(review.user.avatar)}
                    alt={review.user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white font-bold">
                    {review.user?.name?.charAt(0) || <FaUser />}
                  </div>
                )}
              </div>

              {/* Review Content */}
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-800">
                    {review.user?.name || "Anonymous"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(review.createdAt)}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  {renderStars(review.rating)}
                  <span className="text-sm text-gray-600">
                    {review.rating}.0
                  </span>
                </div>
                <p className="mt-2 text-gray-700">{review.comment}</p>
              </div>
            </div>

            {/* Delete Button (Admin only) */}
            {showDelete && user?.role === "admin" && (
              <button
                onClick={() => onDelete?.(review._id)}
                className="text-gray-400 hover:text-red-600 transition-colors"
                title="Delete review"
              >
                <FaTrash />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
