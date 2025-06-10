import AuthenticatedRoute from "../components/AuthenticatedRoute/index";
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import AdminLayout from "../layout/AdminLayout";
import AdminPage from "../pages/AdminPage";
import CategoryManagement from "../pages/WarehouseManagerment/CategoryManagement";
import ProductManagement from "../pages/WarehouseManagerment/ProductManagement";
import CustomerManagement from "../pages/CustomerManagement/CustomerManagement";
import OrderManagement from "../pages/OrderManagerment/OrderManagerment";
import ProfileManagement from "../pages/ProfileManagerment/ProfileManagerment";
import UpdatePassword from "../pages/ProfileManagerment/UpdatePassword";
import PrivateRoute from "../components/PrivateRouter"; // đảm bảo component này hoạt động

export const routes = [
  // Trang login (HomePage)
  {
    path: "/",
    element: <HomePage />, // login page
  },

  // Các route dành cho admin (cần xác thực + vai trò)
  {
    path: "/admin",
    element: (
      <PrivateRoute requiredRole="admin">
        <AdminLayout />
      </PrivateRoute>
    ),
    children: [
      { path: "", element: <AdminPage /> },
      { path: "category", element: <CategoryManagement /> },
      { path: "product", element: <ProductManagement /> },
      { path: "customer", element: <CustomerManagement /> },
      { path: "order", element: <OrderManagement /> },
      { path: "profile", element: <ProfileManagement /> },
      { path: "change-password", element: <UpdatePassword /> },
    ],
  },

  // Trang 404
  {
    path: "*",
    element: <NotFoundPage />,
  },
];
