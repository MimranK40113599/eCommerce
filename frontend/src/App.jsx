import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Helmet } from "react-helmet-async";

// Layouts
import Layout from "./components/layout/Layout";
import AdminLayout from "./components/layout/AdminLayout";

// Public Routes
import Home from "./components/home/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import ProductDetails from "./components/product/ProductDetails";
import ProductList from "./components/product/ProductList";

// Protected Routes
import PrivateRoute from "./components/common/PrivateRoute";
import AdminRoute from "./components/common/AdminRoute";

// User Routes
import Profile from "./components/user/Profile";
import UpdateProfile from "./components/user/UpdateProfile";
import UpdatePassword from "./components/user/UpdatePassword";
import OrderList from "./components/order/OrderList";
import OrderDetails from "./components/order/OrderDetails";

// Cart & Checkout
import Cart from "./components/cart/Cart";
import Checkout from "./components/cart/Checkout";

// Admin Routes
import AdminDashboard from "./components/admin/Dashboard";
import ProductManagement from "./components/admin/ProductManagement";
import OrderManagement from "./components/admin/OrderManagement";
import UserManagement from "./components/admin/UserManagement";

// Constants
import { APP_NAME } from "./constants";

function App() {
  return (
    <Router>
      <Helmet defaultTitle={APP_NAME} titleTemplate={`%s | ${APP_NAME}`} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/:id" element={<ProductDetails />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="password/forgot" element={<ForgotPassword />} />
          <Route path="password/reset/:token" element={<ResetPassword />} />
          <Route path="cart" element={<Cart />} />
        </Route>

        {/* Protected User Routes */}
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/" element={<Layout />}>
            <Route path="me" element={<Profile />} />
            <Route path="me/update" element={<UpdateProfile />} />
            <Route path="password/update" element={<UpdatePassword />} />
            <Route path="me/orders" element={<OrderList />} />
            <Route path="orders/:id" element={<OrderDetails />} />
            <Route path="checkout" element={<Checkout />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="users" element={<UserManagement />} />
          </Route>
        </Route>

        {/* 404 - Not Found */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
