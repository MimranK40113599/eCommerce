import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../../api/authApi";
import { setUser } from "../../redux/features/authSlice";
import { toast } from "react-toastify";
import { APP_NAME } from "../../constants/constants";

const registerSchema = yup.object({
  name: yup.string().required("Your name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Passwords must be at least 6 characters.")
    .required("Password is required"),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please re-enter your password"),
});

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const [registerUser, { isLoading }] = useRegisterMutation();

  const { register: registerForm, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(registerSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    try {
      const response = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      }).unwrap();

      dispatch(setUser(response.user));
      toast.success("Account created successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error?.data?.message || "Registration failed");
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

      {/* Main Register Box */}
      <div className="w-full max-w-[350px] border border-[#ddd] rounded-lg p-6 bg-white shadow-sm mb-6">
        <h1 className="text-[28px] font-normal mb-4 text-[#0f1111]">Create account</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-[13px] font-bold text-[#0f1111] mb-1">
              Your name
            </label>
            <input
              type="text"
              placeholder="First and last name"
              {...registerForm("name")}
              className={`w-full px-3 py-1 border ${errors.name ? 'border-[#c40000] focus:shadow-[0_0_3px_2px_rgba(196,0,0,0.5)]' : 'border-[#a6a6a6] focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)]'} rounded bg-white focus:outline-none`}
            />
            {errors.name && <p className="text-[#c40000] text-xs mt-1"><i>!</i> {errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-[13px] font-bold text-[#0f1111] mb-1">
              Mobile number or email
            </label>
            <input
              type="email"
              {...registerForm("email")}
              className={`w-full px-3 py-1 border ${errors.email ? 'border-[#c40000] focus:shadow-[0_0_3px_2px_rgba(196,0,0,0.5)]' : 'border-[#a6a6a6] focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)]'} rounded bg-white focus:outline-none`}
            />
            {errors.email && <p className="text-[#c40000] text-xs mt-1"><i>!</i> {errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-[13px] font-bold text-[#0f1111] mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="At least 6 characters"
              {...registerForm("password")}
              className={`w-full px-3 py-1 border ${errors.password ? 'border-[#c40000] focus:shadow-[0_0_3px_2px_rgba(196,0,0,0.5)]' : 'border-[#a6a6a6] focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)]'} rounded bg-white focus:outline-none`}
            />
            {errors.password ? (
              <p className="text-[#c40000] text-xs mt-1"><i>!</i> {errors.password.message}</p>
            ) : (
              <p className="text-[12px] text-[#0f1111] mt-1 flex items-center">
                 <i className="text-blue-500 mr-1">i</i> Passwords must be at least 6 characters.
              </p>
            )}
          </div>

          <div>
            <label className="block text-[13px] font-bold text-[#0f1111] mb-1">
              Re-enter password
            </label>
            <input
              type="password"
              {...registerForm("passwordConfirm")}
              className={`w-full px-3 py-1 border ${errors.passwordConfirm ? 'border-[#c40000] focus:shadow-[0_0_3px_2px_rgba(196,0,0,0.5)]' : 'border-[#a6a6a6] focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)]'} rounded bg-white focus:outline-none`}
            />
            {errors.passwordConfirm && <p className="text-[#c40000] text-xs mt-1"><i>!</i> {errors.passwordConfirm.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] text-[#0f1111] text-[13px] rounded-lg shadow-sm py-1.5 mt-2"
          >
            {isLoading ? "Creating account..." : "Continue"}
          </button>
        </form>

        <div className="mt-6 text-[12px] text-[#0f1111] leading-relaxed pb-6 border-b border-gray-200">
          By creating an account, you agree to {APP_NAME}'s <Link to="#" className="text-[#007185] hover:text-[#c45500] hover:underline">Conditions of Use</Link> and <Link to="#" className="text-[#007185] hover:text-[#c45500] hover:underline">Privacy Notice</Link>.
        </div>
        
        <div className="pt-4 text-[13px] text-[#0f1111]">
          Already have an account? <Link to="/login" className="text-[#007185] hover:text-[#c45500] hover:underline">Sign in <span className="text-[10px]">▶</span></Link>
        </div>
      </div>

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

export default Register;
