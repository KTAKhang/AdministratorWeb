import AuthenticatedRoute from "../components/AuthenticatedRoute/index";
// import PrivateRoute from "../components/PrivateRouter/index";
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
// import ProfilePage from "../pages/ProfilePage";
import DefaultLayout from "../layout/DefaultLayout";
// import PendingPage from "../pages/PendingPage";
// import DraftPage from "../pages/DraftPage";
// import CreateClaim from "../pages/CreateClaim";
// import ClaimsLayout from "../layout/ClaimsLayout";
// import PendingDetail from "../pages/PendingDetail";
// import DraftDetail from "../pages/DraftDetail";
import AdminLayout from "../layout/AdminLayout";
// import StaffManagement from "../pages/StaffManagerment";
// import ProjectManagement from "../pages/ProjectManagerment";
import AdminPage from "../pages/AdminPage";
// import StaffDetail from "../pages/StaffDetail";
import CategoryManagement from "../pages/WarehouseManagerment/CategoryManagement";
import ProductManagement from "../pages/WarehouseManagerment/ProductManagement";
import CustomerManagement from "../pages/CustomerManagement/CustomerManagement";
import OrderManagement from "../pages/OrderManagerment/OrderManagerment";
import ProfileManagement from "../pages/ProfileManagerment/ProfileManagerment";
import UpdatePassword from "../pages/ProfileManagerment/UpdatePassword";




export const routes = [
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
    ],
  },
  {
    path: "/",
    element: (
      <AuthenticatedRoute>
        <DefaultLayout />
      </AuthenticatedRoute>
    ),
   
  },

  
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "",
        element: <AdminPage />,
      },
   
      {
        path: "category",
        element: <CategoryManagement />,
      },
      {
        path: "product",
        element: <ProductManagement />,
      },
      {
        path: "customer",
        element: <CustomerManagement />,
      },
      {
        path: "order",
        element: <OrderManagement />,
      },
      {
        path: "profile",
        element: <ProfileManagement />,
      },
      {
        path: "change-password",
        element: <UpdatePassword />,
      },
    ],
  },
  
  {
    path: "*",
    element: <NotFoundPage />,
  },
];
