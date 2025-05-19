import AuthenticatedRoute from "../components/AuthenticatedRoute/index";
import PrivateRoute from "../components/PrivateRouter/index";
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import ProfilePage from "../pages/ProfilePage";
import DefaultLayout from "../layout/DefaultLayout";
import PendingPage from "../pages/PendingPage";
import DraftPage from "../pages/DraftPage";
import CreateClaim from "../pages/CreateClaim";


import ClaimsLayout from "../layout/ClaimsLayout";
import PendingDetail from "../pages/PendingDetail";
import DraftDetail from "../pages/DraftDetail";
import AdminLayout from "../layout/AdminLayout";
import StaffManagement from "../pages/StaffManagerment";
import ProjectManagement from "../pages/ProjectManagerment";
import AdminPage from "../pages/AdminPage";
import StaffDetail from "../pages/StaffDetail";
// Approver Routes
import Dashboard from "../pages/ApproverPages/Dashboard";
import ClaimsHistory from "../pages/ApproverPages/ClaimsHistory";
import ForMyVetting from "../pages/ApproverPages/ForMyVetting";
import Detail from "../pages/ApproverPages/Detail";
import ApproverLayout from "../layout/ApproverLayout";

// Finance Routes
import FinanceLayout from "../layout/FinanceLayout";
import FinanceDashboardPage from "../pages/FinancePage/FinanceDashboardPage";
import FinanceApprovedPage from "../pages/FinancePage/FinanceApprovedPage";
import FinancePaidPage from "../pages/FinancePage/FinancePaidPage";
import FinanceDetailPage from "../pages/FinancePage/FinanceDetailPage";
import RejectedClaims from "../pages/RejectedClaimsPage";
import ApprovedClaims from "../pages/ApprovedClaimsPage";
import PaidClaims from "../pages/PaidClaimsPage";
import RejectedDetail from "../pages/RejectedDetail";
import ApprovedDetail from "../pages/ApprovedDetail";
import PaidDetail from "../pages/PaidDetail";

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
    children: [
      {
        path: "/profile",
        element: <ProfilePage />,
      },
    ],
  },

  {
    path: "/claimer",
    element: <ClaimsLayout />,
    children: [
      {
        path: "/claimer/create-claim",
        element: <CreateClaim />,
      },
      {
        path: "pending",
        element: <PendingPage />,
      },
      {
        path: "pending/:id",
        element: <PendingDetail />,
      },
      {
        path: "draft/:id",
        element: <DraftDetail />,
      },
      {
        path: "draft",
        element: <DraftPage />,
      },
      {
        path: "rejected",
        element: <RejectedClaims />,
      },
      {
        path: "rejected/:id",
        element: <RejectedDetail />,
      },
      {
        path: "approved",
        element: <ApprovedClaims />,
      },
      {
        path: "approved/:id",
        element: <ApprovedDetail />,
      },
      {
        path: "paid",
        element: <PaidClaims />,
      },
      {
        path: "paid/:id",
        element: <PaidDetail />,
      },
    ],
  },
  // {
  //   path: "admin",
  //   element: (
  //     <PrivateRoute requiredRole="true">
  //       <AdminLayout />
  //     </PrivateRoute>
  //   ),
  //   children: [
  //     {
  //       path: "",
  //       element: < AdminPage />,
  //     },

  //   ],
  // },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "",
        element: <AdminPage />,
      },
      {
        path: "staff",
        element: <StaffManagement />,
      },
      {
        path: "staff/detail/:id",
        element: <StaffDetail />,
      },
      {
        path: "project",
        element: <ProjectManagement />,
      },
    ],
  },
  {
    path: "/approver",
    element: <ApproverLayout />,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "vetting",
        element: <ForMyVetting />,
      },
      {
        path: "vetting/:id",
        element: <Detail />,
      },
      {
        path: "history/:id",
        element: <Detail />,
      },
      {
        path: "history",
        element: <ClaimsHistory />,
      },
    ],
  },
  {
    path: "/finance",
    element: <FinanceLayout />,
    children: [
      {
        path: "",
        element: <FinanceDashboardPage />,
      },
      {
        path: "approved",
        element: <FinanceApprovedPage />,
      },
      {
        path: "paid",
        element: <FinancePaidPage />,
      },
      {
        path: "approved/:id",
        element: <FinanceDetailPage />,
      },
      {
        path: "paid/:id",
        element: <FinanceDetailPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];
