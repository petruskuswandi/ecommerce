import "./App.css";
import "izitoast/dist/css/iziToast.min.css";
import "react-quill/dist/quill.snow.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import DetailProduct from "./pages/product/DetailProduct";
import Cart from "./pages/Cart/Cart";
import Profile from "./pages/user/Profile";
import Orders from "./pages/user/order/Orders";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import UserPage from "./pages/admin/users/UserPage";
import ProductsPage from "./pages/admin/products/ProductsPage";
import OrdersPage from "./pages/admin/orders/OrdersPage";
import ReportPage from "./pages/admin/report/ReportPage";
import LoginPage from "./components/login/LoginPage";
import SignUp from "./components/signup/SignUp";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadUser } from "./state/api/authApi";
import Confirm from "./pages/product/Confirm";
import ForgotPassword from "./components/forgot-password/ForgotPassword";
import Reset from "./components/forgot-password/Reset";
import AddProduct from "./pages/admin/products/AddProduct";
import EditProduct from "./pages/admin/products/EditProduct";
import VouchersPage from "./pages/admin/voucher/VouchersPage";
import AddVoucher from "./pages/admin/voucher/AddVoucher";
import EditVoucher from "./pages/admin/voucher/EditVoucher";
import SettingPage from "./pages/admin/setting/SettingPage";
import PrivacyPolicy from "./pages/Google/PrivacyPolicy";
import TermsOfService from "./pages/Google/TermsService";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const load = localStorage.getItem("login");

    if (load) {
      dispatch(loadUser());
    }
  }, [dispatch]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/daftar" element={<SignUp />} />

        <Route path="/" element={<Home />} />

        <Route path="/:name" element={<DetailProduct />} />

        <Route path="/cart" element={<Cart />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/order" element={<Orders />} />

        <Route path="/confirmation" element={<Confirm />} />

        <Route path="/admin-dashboard" element={<Dashboard />} />

        <Route path="/admin-pelanggan" element={<UserPage />} />

        <Route path="/admin-voucher" element={<VouchersPage />} />

        <Route path="/admin-voucher/tambah" element={<AddVoucher />} />

        <Route path="admin-voucher/edit/:code" element={<EditVoucher />} />

        <Route path="/admin-produk" element={<ProductsPage />} />

        <Route path="/admin-produk/tambah" element={<AddProduct />} />

        <Route path="/admin-produk/edit/:name" element={<EditProduct />} />

        <Route path="/admin-pesanan" element={<OrdersPage />} />

        <Route path="/admin-laporan" element={<ReportPage />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/reset-password/:token" element={<Reset />} />

        <Route path="/admin-settings" element={<SettingPage />} />

        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        <Route path="/terms-of-service" element={<TermsOfService />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
