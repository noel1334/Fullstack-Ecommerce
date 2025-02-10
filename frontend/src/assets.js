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
import ListProducts from "./AdminPages/Dashboard.jsx/ListProducts";
import DashboardLayout from "./AdminPages/Component/DashboardLayout";
import Dashboard from "./AdminPages/Dashboard.jsx/Dashboard";
import AdminOrder from "./AdminPages/Dashboard.jsx/AdminOrder";
import Reports from "./AdminPages/Dashboard.jsx/Reports";
import Categories from "./AdminPages/Dashboard.jsx/Categories";
import SubCategories from "./AdminPages/Dashboard.jsx/SubCategories";
import Settings from "./AdminPages/Dashboard.jsx/Settings";
import Users from "./AdminPages/Dashboard.jsx/Users";
import ProductDetail from "./AdminPages/Dashboard.jsx/ProductDetail";
import ProtectedRoute from "./pages/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <Home /> },
      { path: "product/:productId", element: <Product /> },
      { path: "products", element: <Products /> },
      { path: "about", element: <About /> },
      { path: "privacy-policy", element: <PrivacyPolicy /> },
      { path: "contact", element: <Contact /> },
      {
        path: "orders",
        element: <ProtectedRoute element={<Orders />} />,
      },
      {
        path: "place-order",
        element: <ProtectedRoute element={<PlaceOrder />} />,
      },
      {
        path: "cart",
        element: <ProtectedRoute element={<Cart />} />,
      },
      { path: "favorite-cart", element: <WishCart /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "forgot-password", element: <ForgotPassword /> },
    ],
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute element={<DashboardLayout />} adminOnly={true} />,
    children: [
      { path: "", element: <Dashboard /> }, // Default child route
      { path: "products", element: <ListProducts /> },
      { path: "orders", element: <AdminOrder /> },
      { path: "reports", element: <Reports /> },
      { path: "categories", element: <Categories /> },
      { path: "subcategories", element: <SubCategories /> },
      { path: "settings", element: <Settings /> },
      { path: "users", element: <Users /> },
      { path: "product/:id", element: <ProductDetail /> },
    ],
  },
]);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
