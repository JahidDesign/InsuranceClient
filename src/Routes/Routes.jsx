// File: src/routes/AppRoutes.jsx
import React, { useContext, Suspense, lazy } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// ---------------- Lazy load pages ----------------
const Home = lazy(() => import("../pages/Home"));
const About = lazy(() => import("../pages/About"));
const Blog = lazy(() => import("../pages/Blog"));
const AllPolicies = lazy(() => import("../pages/AllPolicies"));
const ContactPage = lazy(() => import("../pages/Contact"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const Profile = lazy(() => import("../pages/Profile"));
const NotFound = lazy(() => import("../pages/NotFound"));
const VisitorDetailsPage = lazy(() => import("../pages/VisitorDetailsPage"));
const InsuranceDetails  = lazy(() => import("../pages/InsuranceDetails"));
const MyBookQuote  = lazy(() => import("../pages/MyBookQuote"));
const BlogDetail = lazy(() => import("../pages/BlogDetail"));

// Admin Pages
const AdminLayout = lazy(() => import("../components/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("../pages/admin/Dashboard"));
const ManagePolicies = lazy(() => import("../pages/admin/ManagePolicies"));
const ManageUsers = lazy(() => import("../pages/admin/ManageUsers"));
const ManageBlog = lazy(() => import("../pages/admin/ManageBlog"));
const Transactions = lazy(() => import("../pages/admin/Transactions"));
const ManagementTable = lazy(() => import("../pages/admin/ManagementTable"));
const AddBlogForm = lazy(() => import("../pages/admin/AddBlogForm"));
const ManageBlogTable = lazy(() => import("../pages/admin/ManageBlogTable"));
const InsuranceForm = lazy(() => import("../pages/admin/LifeInsuranceFrom"));
const QuoteLifeInsuranceFrom = lazy(() => import("../pages/QuoteLifeInsuranceFrom"));
const CarouselSliderForm = lazy(() => import("../pages/InsuranceFormCaro"));
const HeroCarouselForm = lazy(() => import("../pages/HeroCarouselForm"));
const HeroCarouselManager = lazy(() => import("../pages/HeroCarouselManager"));
const InsuranceCarousel = lazy(() => import("../pages/InsuranceCarouselManager"));
const UserInsuranceTabs = lazy(() => import("../pages/UserInsuranceTabs"));
const ReviewsSectionForm = lazy(() => import("../pages/ReviewsSectionForm"));
const AdminReviewsTable = lazy(() => import("../pages/AdminReviewsTable"));
const VisitorNews = lazy(() => import("../pages/admin/visitorNews"));
const ReviewsSection = lazy(() => import("../pages/admin/ReviewsSection"));
const AddVisitorForm = lazy(() => import("../pages/admin/AddVisitorNewsForm"));
const AddPolicyForm = lazy(() => import("../pages/admin/AddPolicyForm"));
const PolicyManagementTable = lazy(() => import("../pages/admin/PolicyTableEidt"));
const ContactManager = lazy(() => import("../pages/admin/adminContact"));
const ContactTableManager = lazy(() => import("../pages/admin/ContactTableManager"));
const VisitorNewsTable = lazy(() => import("../pages/admin/VisitorNewsTable"));
const Messages = lazy(() => import("../pages/admin/Messages"));

// Agent Pages
const AgentDashboard = lazy(() => import("../components/agents/AgentDashboard"));

// Insurance Management
const InsuranceServiceForm = lazy(() => import("../pages/InsuranceServiceForm"));
const OurInsurancePolicy = lazy(() => import("../pages/ourInsurancePolice"));
const InsuranceDashboardManager = lazy(() => import("../pages/InsuranceDashboard"));

// ---------------- PrivateRoute Component ----------------
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

// ---------------- Management Layout ----------------
const ManagementLayout = () => (
  <div>
    <h1 className="text-2xl font-bold mb-4">Management Section</h1>
    <Outlet />
  </div>
);

// ---------------- App Routes ----------------
const AppRoutes = () => (
  <Suspense fallback={<p className="text-center mt-20">Loading...</p>}>
    <Routes>
      {/* ---------------- Public Routes ---------------- */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/blog" element={<Blog />} />
      <Route
        path="/all-policies"
        element={
          <PrivateRoute>
            <AllPolicies />
          </PrivateRoute>
        }
      />
      <Route
        path="/mybook-quote"
        element={
          <PrivateRoute>
            <MyBookQuote />
          </PrivateRoute>
        }
      />
      <Route
        path="/quote-insurance"
        element={
          <PrivateRoute>
            <QuoteLifeInsuranceFrom />
          </PrivateRoute>
        }
      />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/visitor/:id" element={<VisitorDetailsPage />} />
      <Route path="/insurance/:id" element={<InsuranceDetails />} />
      <Route path="/blog/:blogId" element={<BlogDetail />} />
      <Route path="/*" element={<NotFound />} />

      {/* ---------------- User Dashboard ---------------- */}
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />

      {/* ---------------- Agent Dashboard ---------------- */}
      <Route
        path="/agent/*"
        element={
          <PrivateRoute allowedRoles={["agent"]}>
            <AgentDashboard />
          </PrivateRoute>
        }
      />

      {/* ---------------- Management Section (Admin + Agent) ---------------- */}
      <Route
        path="/management/*"
        element={
          <PrivateRoute allowedRoles={["admin", "agent"]}>
            <ManagementLayout />
          </PrivateRoute>
        }
      >
        <Route path="all-policies" element={<AllPolicies />} />
        {/* More nested management routes can go here */}
      </Route>

      {/* ---------------- Admin Panel ---------------- */}
      <Route
        path="/admin/*"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<AdminDashboard />} />

        {/* Policies */}
        <Route path="manage-policies" element={<ManagePolicies />} />
        <Route path="manage-policies/:mode/:id?" element={<CarouselSliderForm />} />
        <Route path="policies/:mode/:id?" element={<AddPolicyForm />} />

        {/* Insurance */}
        <Route path="insurance-policies/:mode/:id?" element={<InsuranceServiceForm />} />
        <Route path="all-policies/edit" element={<InsuranceDashboardManager />} />
        <Route path="all-policies/add" element={<OurInsurancePolicy />} />

        {/* Users */}
        <Route path="manage-users" element={<ManageUsers />} />
        <Route path="manage-users/:mode/:id?" element={<InsuranceForm />} />
        <Route path="manage-users/edit/" element={<UserInsuranceTabs />} />

        {/* Transactions & Applications */}
        <Route path="transactions" element={<Transactions />} />
        <Route path="manage-applications" element={<ManagementTable />} />

        {/* Blog */}
        <Route path="manage-blog" element={<ManageBlog />} />
        <Route path="manage-blog/:mode/:id?" element={<AddBlogForm />} />
        <Route path="manage-blog/edit/:id" element={<ManageBlogTable />} />

        {/* Messages */}
        <Route path="messages-section" element={<Messages />} />
        <Route path="messages-section/:mode/:id?" element={<ContactManager />} />
        <Route path="messages-section/edit/:id" element={<ContactTableManager />} />

        {/* Visitor News */}
        <Route path="visitor-news" element={<VisitorNews />} />
        <Route path="visitor-news/:mode/:id?" element={<AddVisitorForm />} />
        <Route path="visitor-news/edit/:id" element={<VisitorNewsTable />} />

        {/* Reviews Section */}
        <Route path="reviews-section" element={<ReviewsSection />} />
        <Route path="reviews-section/:mode/:id?" element={<ReviewsSectionForm />} />
        <Route path="reviews-section/edit/:id" element={<AdminReviewsTable />} />

        {/* Hero Section */}
        <Route path="hero-section" element={<HeroCarouselManager />} />
        <Route path="hero-section/:mode/:id?" element={<HeroCarouselForm />} />
        <Route path="hero-section/edit/:id" element={<HeroCarouselManager />} />
      </Route>
    </Routes>
  </Suspense>
);

export default AppRoutes;
