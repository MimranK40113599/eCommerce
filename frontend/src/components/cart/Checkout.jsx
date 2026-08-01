import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useCreateOrderMutation } from "../../api/orderApi";
import { clearCart } from "../../redux/features/cartSlice";
import { formatPrice, calculateCartTotal } from "../../helpers/helpers";
import { PAYMENT_METHODS } from "../../constants/constants";

const checkoutSchema = yup.object({
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  phoneNo: yup.string().required("Phone number is required"),
  zipCode: yup.string().required("Zip code is required"),
  country: yup.string().required("Country is required"),
  paymentMethod: yup.string().required("Payment method is required"),
});

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [isProcessing, setIsProcessing] = useState(false);
  const [createOrder] = useCreateOrderMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(checkoutSchema),
    defaultValues: {
      country: "United States",
      paymentMethod: PAYMENT_METHODS.COD,
    },
  });

  const totalPrice = calculateCartTotal(cartItems);
  const taxAmount = totalPrice * 0.08; // 8% tax
  const shippingAmount = totalPrice >= 200 ? 0 : 15;
  const totalAmount = totalPrice + taxAmount + shippingAmount;

  // Redirect if cart is empty
  React.useEffect(() => {
    if (cartItems.length === 0) {
      toast.warning("Your cart is empty");
      navigate("/products");
    }
  }, [cartItems, navigate]);

  const onSubmit = async (data) => {
    setIsProcessing(true);

    try {
      const orderData = {
        shippingInfo: {
          address: data.address,
          city: data.city,
          phoneNo: data.phoneNo,
          zipCode: data.zipCode,
          country: data.country,
        },
        orderItems: cartItems.map((item) => ({
          product: item.product,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
        })),
        itemsPrice: totalPrice,
        taxAmount: taxAmount,
        shippingAmount: shippingAmount,
        totalAmount: totalAmount,
        paymentMethod: data.paymentMethod,
        paymentInfo: {
          status: "Pending",
        },
      };

      const response = await createOrder(orderData).unwrap();

      if (response.success) {
        dispatch(clearCart());
        toast.success("Order placed successfully! 🎉");
        navigate(`/orders/${response.order._id}`);
      }
    } catch (error) {
      const errorMessage =
        error?.data?.message || "Failed to place order. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Shipping Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  {...register("address")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="123 Main St"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    {...register("city")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="New York"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.city.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Zip Code *
                  </label>
                  <input
                    type="text"
                    {...register("zipCode")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="10001"
                  />
                  {errors.zipCode && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.zipCode.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    {...register("phoneNo")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="(123) 456-7890"
                  />
                  {errors.phoneNo && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.phoneNo.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    {...register("country")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="United States"
                  />
                  {errors.country && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.country.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <h2 className="text-lg font-bold text-gray-800 mt-6 mb-4">
              Payment Method
            </h2>
            <div>
              <div className="space-y-2">
                {Object.values(PAYMENT_METHODS).map((method) => (
                  <label key={method} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      value={method}
                      {...register("paymentMethod")}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">
                      {method === "COD" ? "Cash on Delivery" : "Card Payment"}
                    </span>
                  </label>
                ))}
              </div>
              {errors.paymentMethod && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.paymentMethod.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full mt-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </div>
              ) : (
                `Place Order - ${formatPrice(totalAmount)}`
              )}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Order Summary
            </h3>

            <div className="space-y-3 border-b border-gray-200 pb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Items ({cartItems.length})
                </span>
                <span className="font-medium">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {formatPrice(shippingAmount)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (8%)</span>
                <span className="font-medium">{formatPrice(taxAmount)}</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-bold mt-4">
              <span>Total</span>
              <span className="text-blue-600">{formatPrice(totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
