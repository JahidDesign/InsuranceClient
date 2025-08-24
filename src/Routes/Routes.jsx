// File: AppRoutes.jsx
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

// Pages
import Home from "../pages/Home";
import About from "../pages/About";
import Blog from "../pages/Blog";
import AllPolicies from "../pages/AllPolicies";
import ContactPage from "../pages/Contact";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import VisitorDetailsPage from "../pages/VisitorDetailsPage";
import InsuranceServiceForm from "../pages/InsuranceServiceForm";
import InsuranceServicesDashboard from "../pages/InsuranceServicesDashboard";

// Admin Pages & Layout
import AdminLayout from "../components/admin/AdminLayout";
import AdminDashboard from "../pages/admin/Dashboard";
import ManagePolicies from "../pages/admin/ManagePolicies";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageBlog from "../pages/admin/ManageBlog";
import Transactions from "../pages/admin/Transactions";
import ManagementTable from "../pages/admin/ManagementTable";
import AddBlogForm from "../pages/admin/AddBlogForm";
import ManageBlogTable from "../pages/admin/ManageBlogTable";
import InsuranceForm from "../pages/admin/LifeInsuranceFrom";
import CarouselSliderForm from "../pages/InsuranceFormCaro";
import HeroCarouselForm from "../pages/HeroCarouselForm";
import HeroCarouselManager from "../pages/HeroCarouselManager";
import InsuranceCarousel from "../pages/InsuranceCarouselManager";
import ReviewsSectionForm from "../pages/ReviewsSectionForm";
import AdminReviewsTable from "../pages/AdminReviewsTable";
import VisitorNews from "../pages/admin/visitorNews";
import ReviewsSection from "../pages/admin/ReviewsSection";
import AddVisitorForm from "../pages/admin/AddVisitorNewsForm";
import AddPolicyForm from "../pages/admin/AddPolicyForm";
import PolicyManagementTable from "../pages/admin/PolicyTableEidt";
import  ContactManager from "../pages/admin/adminContact";
import  ContactTableManager from "../pages/admin/ContactTableManager";
import VisitorNewsTable from "../pages/admin/VisitorNewsTable";
import Messages from "../pages/admin/Messages";

// Agent Pages
import AgentDashboard from "../components/agents/AgentDashboard";

// ✅ PrivateRoute Component
const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, role, isAdmin } = useContext(AuthContext);

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;

  // Super admin override
  if (isAdmin) return children;

  // Role-based access
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// ✅ Management Layout with Outlet for nested routes
const ManagementLayout = () => (
  <div>
    <h1 className="text-2xl font-bold mb-4">Management Section</h1>
    <Outlet />
  </div>
);

// ✅ App Routes
const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/blog" element={<Blog />} />
    <Route
      path="/allpolicies"
      element={
        <ProtectedRoute>
          <AllPolicies />
        </ProtectedRoute>
      }
    />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/visitor/:id" element={<VisitorDetailsPage />} />
    <Route path="/*" element={<NotFound />} />

    {/* User Dashboard */}
    <Route
      path="/profile"
      element={
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      }
    />

    {/* Agent Dashboard */}
    <Route
      path="/agent/*"
      element={
        <PrivateRoute allowedRoles={["agent"]}>
          <AgentDashboard />
        </PrivateRoute>
      }
    />

    {/* Management Section (Admin + Agent) */}
    <Route
      path="/management/*"
      element={
        <PrivateRoute allowedRoles={["admin", "agent"]}>
          <ManagementLayout />
        </PrivateRoute>
      }
    >
      <Route path="allpolicies" element={<AllPolicies />} />
      {/* Add more nested management routes here */}
    </Route>

    {/* Admin Panel */}
    <Route
      path="/admin/*"
      element={
        <PrivateRoute allowedRoles={["admin"]}>
          <AdminLayout />
        </PrivateRoute>
      }
    >
      <Route index element={<AdminDashboard />} />
      <Route path="manage-policies" element={<ManagePolicies />} />
      <Route path="manage-policies/add" element={<CarouselSliderForm />} />
      <Route path="manage-policies/edit" element={<InsuranceCarousel />} />

      <Route path="policies/add" element={<AddPolicyForm />} />
      <Route path="policies/edit" element={<PolicyManagementTable />} />

      <Route path="insurance-policies/add" element={<InsuranceServiceForm />} />
      <Route path="insurance-policies/edit" element={<InsuranceServicesDashboard />} />

      <Route path="manage-users" element={<ManageUsers />} />
      <Route path="manage-users/add" element={<InsuranceForm />} />

      <Route path="transactions" element={<Transactions />} />
      <Route path="manage-applications" element={<ManagementTable />} />
      

      <Route path="manage-blog" element={<ManageBlog />} />
      <Route path="manage-blog/add" element={<AddBlogForm />} />
      <Route path="manage-blog/edit" element={<ManageBlogTable />} />

      <Route path="messages-section" element={<Messages />} />
      <Route path="messages-section/add" element={<ContactManager />} />
      <Route path="messages-section/edit" element={<ContactTableManager />} />

      <Route path="visitor-news" element={<VisitorNews />} />
      <Route path="visitor-news/add" element={<AddVisitorForm />} />
      <Route path="visitor-news/edit" element={<VisitorNewsTable />} />

      <Route path="reviews-section" element={<ReviewsSection />} />
      <Route path="reviews-section/add" element={<ReviewsSectionForm />} />
      <Route path="reviews-section/edit" element={<AdminReviewsTable />} />

      <Route path="hero-section" element={<HeroCarouselManager />} />
      <Route path="hero-section/add" element={<HeroCarouselForm />} />
      <Route path="hero-section/edit" element={<HeroCarouselManager />} />
    </Route>
  </Routes>
);

export default AppRoutes;
