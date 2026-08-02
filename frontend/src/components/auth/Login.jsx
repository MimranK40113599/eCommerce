import React, { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../../api/authApi";
import { setUser } from "../../redux/features/authSlice";
import { toast } from "react-toastify";
import { APP_NAME } from "../../constants/constants";

const loginSchema = yup.object({
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const [login, { isLoading }] = useLoginMutation();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const redirect = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [isAuthenticated, navigate, redirect]);

  const onSubmit = async (data) => {
    try {
      const response = await login(data).unwrap();
      dispatch(setUser(response.user));
      toast.success("Login successful!");
      navigate(redirect);
    } catch (error) {
      toast.error(error?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-8 pb-12 px-4">
      
      {/* Amazon Logo Header */}
      <div className="mb-6">
        <Link to="/" className="text-3xl font-bold tracking-tighter text-[#0f1111]">
          {APP_NAME}<span className="text-[#febd69]">.com</span>
        </Link>
      </div>

      {/* Main Login Box */}
      <div className="w-full max-w-[350px] border border-[#ddd] rounded-lg p-6 bg-white shadow-sm mb-6">
        <h1 className="text-[28px] font-normal mb-4 text-[#0f1111]">Sign in</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-[13px] font-bold text-[#0f1111] mb-1">
              Email or mobile phone number
            </label>
            <input
              type="email"
              {...register("email")}
              className={`w-full px-3 py-1 border ${errors.email ? 'border-[#c40000] focus:shadow-[0_0_3px_2px_rgba(196,0,0,0.5)]' : 'border-[#a6a6a6] focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)]'} rounded bg-white focus:outline-none`}
            />
            {errors.email && <p className="text-[#c40000] text-xs mt-1 flex items-center"><i>!</i> {errors.email.message}</p>}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[13px] font-bold text-[#0f1111]">
                Password
              </label>
              <Link to="/password/forgot" className="text-[13px] text-[#007185] hover:text-[#c45500] hover:underline">
                Forgot your password?
              </Link>
            </div>
            <input
              type="password"
              {...register("password")}
              className={`w-full px-3 py-1 border ${errors.password ? 'border-[#c40000] focus:shadow-[0_0_3px_2px_rgba(196,0,0,0.5)]' : 'border-[#a6a6a6] focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)]'} rounded bg-white focus:outline-none`}
            />
            {errors.password && <p className="text-[#c40000] text-xs mt-1 flex items-center"><i>!</i> {errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] text-[#0f1111] text-[13px] rounded-lg shadow-sm py-1.5 mt-2"
          >
            {isLoading ? "Signing in..." : "Continue"}
          </button>
        </form>

        <div className="mt-4 text-[12px] text-[#0f1111] leading-relaxed">
          By continuing, you agree to {APP_NAME}'s <Link to="#" className="text-[#007185] hover:text-[#c45500] hover:underline">Conditions of Use</Link> and <Link to="#" className="text-[#007185] hover:text-[#c45500] hover:underline">Privacy Notice</Link>.
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
           <Link to="#" className="text-[13px] text-[#007185] hover:text-[#c45500] hover:underline flex items-center">
             <span className="mr-1">▶</span> Need help?
           </Link>
        </div>
      </div>

      {/* New to Amazon Divider */}
      <div className="w-full max-w-[350px] flex items-center mb-4">
        <div className="flex-1 h-[1px] bg-gray-300"></div>
        <div className="px-3 text-[12px] text-[#767676]">New to {APP_NAME}?</div>
        <div className="flex-1 h-[1px] bg-gray-300"></div>
      </div>

      {/* Create Account Button */}
      <Link 
        to="/register" 
        className="w-full max-w-[350px] text-center bg-white hover:bg-gray-50 border border-[#D5D9D9] text-[#0f1111] text-[13px] rounded-lg shadow-sm py-1.5"
      >
        Create your {APP_NAME} account
      </Link>

      {/* Amazon Footer Links (Simple) */}
      <div className="mt-12 pt-8 border-t border-gray-100 w-full flex flex-col items-center">
         <div className="flex space-x-6 text-[11px] text-[#007185] mb-2">
           <Link to="#" className="hover:underline">Conditions of Use</Link>
           <Link to="#" className="hover:underline">Privacy Notice</Link>
           <Link to="#" className="hover:underline">Help</Link>
         </div>
         <p className="text-[11px] text-[#555]">© 1996-{new Date().getFullYear()}, {APP_NAME}.com, Inc. or its affiliates</p>
      </div>

    </div>
  );
};

export default Login;
