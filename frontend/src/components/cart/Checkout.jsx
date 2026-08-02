import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { FaLock } from "react-icons/fa";
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

  const [isProcessing, setIsProcessing] = useState(false);
  const [createOrder] = useCreateOrderMutation();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(checkoutSchema),
    defaultValues: { country: "United States", paymentMethod: PAYMENT_METHODS.COD },
  });

  const totalPrice = calculateCartTotal(cartItems);
  const taxAmount = totalPrice * 0.08; 
  const shippingAmount = totalPrice >= 25 ? 0 : 5.99;
  const totalAmount = totalPrice + taxAmount + shippingAmount;

  React.useEffect(() => {
    if (cartItems.length === 0) {
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
        paymentInfo: { status: "Pending" },
      };

      const response = await createOrder(orderData).unwrap();
      if (response.success) {
        dispatch(clearCart());
        navigate(`/orders/${response.order._id}`);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to place order.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Amazon Checkout Header */}
      <div className="bg-gray-100 border-b border-gray-300 py-6 px-4 text-center relative shadow-sm">
        <h1 className="text-[28px] font-normal text-[#0f1111]">
          Checkout (<span className="text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer">{cartItems?.reduce((a,c)=>a+c.quantity,0) || 0} items</span>)
        </h1>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 flex flex-col items-center">
          <FaLock className="text-2xl mb-1 text-gray-400" />
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Forms */}
        <div className="lg:col-span-8 space-y-6">
          <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Step 1: Shipping Address */}
            <div className="border border-gray-300 rounded-lg p-5">
              <h2 className="text-[18px] font-bold text-[#0f1111] mb-4 text-[#c45500]">1 &nbsp;&nbsp; Shipping address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 border-l-2 border-transparent">
                <div className="md:col-span-2">
                  <label className="block text-[13px] font-bold mb-1">Street Address</label>
                  <input type="text" {...register("address")} className="w-full px-3 py-1 border border-[#a6a6a6] rounded bg-[#f7fafa] focus:bg-white focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)]" />
                  {errors.address && <p className="text-[#c40000] text-xs mt-1">{errors.address.message}</p>}
                </div>
                <div>
                  <label className="block text-[13px] font-bold mb-1">City</label>
                  <input type="text" {...register("city")} className="w-full px-3 py-1 border border-[#a6a6a6] rounded bg-[#f7fafa] focus:bg-white focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)]" />
                  {errors.city && <p className="text-[#c40000] text-xs mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="block text-[13px] font-bold mb-1">ZIP Code</label>
                  <input type="text" {...register("zipCode")} className="w-full px-3 py-1 border border-[#a6a6a6] rounded bg-[#f7fafa] focus:bg-white focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)]" />
                  {errors.zipCode && <p className="text-[#c40000] text-xs mt-1">{errors.zipCode.message}</p>}
                </div>
                <div>
                  <label className="block text-[13px] font-bold mb-1">Phone Number</label>
                  <input type="tel" {...register("phoneNo")} className="w-full px-3 py-1 border border-[#a6a6a6] rounded bg-[#f7fafa] focus:bg-white focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)]" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold mb-1">Country</label>
                  <input type="text" {...register("country")} className="w-full px-3 py-1 border border-[#a6a6a6] rounded bg-[#f7fafa] focus:bg-white focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)]" />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="border border-gray-300 rounded-lg p-5">
              <h2 className="text-[18px] font-bold text-[#0f1111] mb-4 text-[#c45500]">2 &nbsp;&nbsp; Payment method</h2>
              <div className="pl-6 space-y-3">
                {Object.values(PAYMENT_METHODS).map((method) => (
                  <label key={method} className="flex items-center text-[14px] cursor-pointer">
                    <input
                      type="radio"
                      value={method}
                      {...register("paymentMethod")}
                      className="mr-3"
                    />
                    <span className="font-bold">{method === "COD" ? "Cash on Delivery (Pay at your doorstep)" : "Credit Card / Debit Card"}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Step 3: Review Items */}
            <div className="border border-gray-300 rounded-lg p-5">
              <h2 className="text-[18px] font-bold text-[#0f1111] mb-4 text-[#c45500]">3 &nbsp;&nbsp; Review items and shipping</h2>
              <div className="pl-6 space-y-4">
                 <div className="border border-gray-300 rounded-lg p-4">
                   <h3 className="font-bold text-[#007600] mb-4">Delivery date: Tomorrow, Jan 1</h3>
                   {cartItems?.map(item => (
                     <div key={item.product} className="flex gap-4 mb-4 pb-4 border-b border-gray-200 last:border-0 last:mb-0 last:pb-0">
                       <img src={item.image} className="w-20 h-20 object-contain" />
                       <div>
                         <p className="font-bold text-[14px]">{item.name}</p>
                         <p className="text-[#b12704] font-bold text-[14px]">{formatPrice(item.price)}</p>
                         <p className="text-[12px] text-gray-500">Qty: {item.quantity}</p>
                       </div>
                     </div>
                   ))}
                 </div>
              </div>
            </div>

          </form>
        </div>

        {/* Order Summary Right Panel */}
        <div className="lg:col-span-4">
          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <button
              type="submit"
              form="checkout-form"
              disabled={isProcessing}
              className="w-full bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] text-[#0f1111] text-[13px] rounded-lg shadow-sm py-2 px-3 mb-4"
            >
              {isProcessing ? "Processing..." : "Place your order"}
            </button>

            <p className="text-[11px] text-[#565959] text-center mb-4 leading-tight">
              By placing your order, you agree to Amazon's <span className="text-[#007185] hover:underline">privacy notice</span> and <span className="text-[#007185] hover:underline">conditions of use</span>.
            </p>

            <h3 className="font-bold text-[18px] mb-2">Order Summary</h3>
            
            <div className="text-[14px] space-y-1 mb-2 border-b border-gray-300 pb-2">
              <div className="flex justify-between">
                <span>Items:</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping & handling:</span>
                <span>{shippingAmount === 0 ? '$0.00' : formatPrice(shippingAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total before tax:</span>
                <span>{formatPrice(totalPrice + shippingAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated tax to be collected:</span>
                <span>{formatPrice(taxAmount)}</span>
              </div>
            </div>
            
            <div className="flex justify-between font-bold text-[18px] text-[#b12704] mb-4">
              <span>Order total:</span>
              <span>{formatPrice(totalAmount)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
