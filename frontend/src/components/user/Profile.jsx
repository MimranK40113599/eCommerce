import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaUser,
  FaEnvelope,
  FaUserTag,
  FaEdit,
  FaKey,
  FaShoppingBag,
} from "react-icons/fa";
import { getAvatarUrl, formatDate } from "../../helpers/helpers";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please login to view your profile.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-200">
              {user.avatar?.url ? (
                <img
                  src={getAvatarUrl(user.avatar)}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-4xl font-bold">
                  {user.name?.charAt(0) || <FaUser />}
                </div>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-800 mt-4">
              {user.name}
            </h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500 mt-1">
              <span className="capitalize">Role: {user.role}</span>
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Joined {formatDate(user.createdAt)}
            </p>
          </div>
        </div>

        {/* Profile Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-semibold text-gray-800 mb-4">
              Account Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                to="/me/update"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-3">
                  <FaEdit />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Edit Profile</p>
                  <p className="text-sm text-gray-500">
                    Update your personal information
                  </p>
                </div>
              </Link>

              <Link
                to="/password/update"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600 mr-3">
                  <FaKey />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Change Password</p>
                  <p className="text-sm text-gray-500">Update your password</p>
                </div>
              </Link>

              <Link
                to="/me/orders"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mr-3">
                  <FaShoppingBag />
                </div>
                <div>
                  <p className="font-medium text-gray-800">My Orders</p>
                  <p className="text-sm text-gray-500">
                    View your order history
                  </p>
                </div>
              </Link>

              <div className="flex items-center p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mr-3">
                  <FaEnvelope />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{user.email}</p>
                  <p className="text-sm text-gray-500">Email Address</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
