import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import ListProducts from "./pages/ListProducts";
import AdminOrder from "./pages/AdminOrder";
import Reports from "./pages/Reports";
import Categories from "./pages/Categories";
import Settings from "./pages/Settings";
import Users from "./pages/Users";
import ProductDetail from "./pages/ProductDetail";
import DashboardLayout from "./Component/DashboardLayout";
import ProtectedRoute from "./pages/ProtectedRoute";
import OrderDetail from "./pages/OrderDetail";
import ResetPassword from "./pages/ResetPassword";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute element={<DashboardLayout />} />,

    children: [
      { path: "/", element: <ProtectedRoute element={<Dashboard />} /> },
      {
        path: "/products",
        element: <ProtectedRoute element={<ListProducts />} />,
      },
      { path: "/orders", element: <ProtectedRoute element={<AdminOrder />} /> },
      { path: "/reports", element: <ProtectedRoute element={<Reports />} /> },
      {
        path: "/categories",
        element: <ProtectedRoute element={<Categories />} />,
      },
      { path: "/settings", element: <ProtectedRoute element={<Settings />} /> },
      { path: "/users", element: <ProtectedRoute element={<Users />} /> },
      {
        path: "/product/:id",
        element: <ProtectedRoute element={<ProductDetail />} />,
      },
      { path: "product/:id", element: <ProductDetail /> },
      { path: "orders/:orderId", element: <OrderDetail /> },
    ],
  },
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password/:token", element: <ResetPassword /> },
]);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
