import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Product from "./pages/Product";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Layout from "./pages/Layout";
import Cart from "./pages/Cart";
import WishCart from "./pages/WishCart";
import Contact from "./pages/Contact";
import About from "./pages/About";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ForgotPassword from "./pages/ForgotPassword";
import Tracking from "./pages/Tracking";
import AcceptOrder from "./pages/AcceptOrder";
import RejectedOrder from "./pages/RejectedOrder";
import Loading from "./Component/Loading";
import PrivateRoute from "./pages/PrivateRoute";
import { useEffect, useState } from "react";
import ProfilePage from "./pages/ProfilePage";
import CancelledOrder from "./pages/CancelledOrder";
import SuccessPage from "./pages/SuccessPage";
import CancelPage from "./pages/CancelPage";
import ResetPassword from "./pages/ResetPassword";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "product/:productId", element: <Product /> },
      { path: "products", element: <Products /> },
      { path: "about", element: <About /> },
      { path: "privacy-policy", element: <PrivacyPolicy /> },
      { path: "contact", element: <Contact /> },

      // Protected Routes for users
      {
        path: "orders",
        element: <PrivateRoute element={<Orders />} />,
      },
      {
        path: "order-tracking/:orderId",
        element: <PrivateRoute element={<Tracking />} />,
      },
      {
        path: "accepted-order/:orderId",
        element: <PrivateRoute element={<AcceptOrder />} />,
      },
      {
        path: "rejected-order/:orderId",
        element: <PrivateRoute element={<RejectedOrder />} />,
      },
      {
        path: "Canceled-order/:orderId",
        element: <PrivateRoute element={<CancelledOrder />} />,
      },
      {
        path: "place-order",
        element: <PrivateRoute element={<PlaceOrder />} />,
      },
      {
        path: "cart",
        element: <PrivateRoute element={<Cart />} />,
      },
      {
        path: "profile",
        element: <PrivateRoute element={<ProfilePage />} />,
      },
      {
        path: "success",
        element: <PrivateRoute element={<SuccessPage />} />,
      },
      {
        path: "cancel",
        element: <PrivateRoute element={<CancelPage />} />,
      },

      { path: "favorite-cart", element: <WishCart /> },
      { path: "register", element: <Register /> },
      { path: "/login", element: <Login /> },
      { path: "/reset-password/:token", element: <ResetPassword /> },
      { path: "forgot-password", element: <ForgotPassword /> },
    ],
  },
]);

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>{isLoading ? <Loading /> : <RouterProvider router={router} />}</div>
  );
}

export default App;
