import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import About from "./pages/About";
import Auth from "./pages/Auth";
import BuyerRegister from "./pages/BuyerRegister";
import SellerRegister from "./pages/SellerRegister";
import Dashboard from "./pages/Dashboard";
import AdminPortal from "./pages/AdminPortal";
import SellerPortal from "./pages/SellerPortal";
import BuyerPortal from "./pages/BuyerPortal";
import BuyerNotifications from "./pages/buyer/BuyerNotifications";
import RoleSelect from "./pages/RoleSelect";
import PortalSelector from "./pages/PortalSelector";
import VehicleBrowse from "./pages/buyer/VehicleBrowse";
import BuyerPurchases from "./pages/buyer/BuyerPurchases";
import SavedVehicles from "./pages/buyer/SavedVehicles";
import CCUpload from "./pages/buyer/CCUpload";
import AddVehicle from "./pages/seller/AddVehicle";
import MyListings from "./pages/seller/MyListings";
import VehicleDocuments from "./pages/seller/VehicleDocuments";
import SellerNotifications from "./pages/seller/SellerNotifications";
import UserManagement from "./pages/admin/UserManagement";
import VehicleManagement from "./pages/admin/VehicleManagement";
import DocumentVerification from "./pages/admin/DocumentVerification";
import Analytics from "./pages/admin/Analytics";
import AdminNotifications from "./pages/admin/AdminNotifications";
import CMSPortal from "./pages/admin/CMSPortal";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/register/buyer" element={<BuyerRegister />} />
            <Route path="/register/seller" element={<SellerRegister />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminPortal />
              </ProtectedRoute>
            } />
            <Route path="/seller-portal" element={
              <ProtectedRoute requiredRole="seller">
                <SellerPortal />
              </ProtectedRoute>
            } />
            <Route path="/buyer-portal" element={
              <ProtectedRoute requiredRole="buyer">
                <BuyerPortal />
              </ProtectedRoute>
            } />
            <Route path="/role-select" element={
              <ProtectedRoute>
                <RoleSelect />
              </ProtectedRoute>
            } />
            <Route path="/portal-select" element={
              <ProtectedRoute>
                <PortalSelector />
              </ProtectedRoute>
            } />
            <Route path="/buyer-portal/browse" element={
              <ProtectedRoute requiredRole="buyer">
                <VehicleBrowse />
              </ProtectedRoute>
            } />
            <Route path="/buyer-portal/purchases" element={
              <ProtectedRoute requiredRole="buyer">
                <BuyerPurchases />
              </ProtectedRoute>
            } />
            <Route path="/buyer-portal/saved" element={
              <ProtectedRoute requiredRole="buyer">
                <SavedVehicles />
              </ProtectedRoute>
            } />
            <Route path="/buyer-portal/notifications" element={
              <ProtectedRoute requiredRole="buyer">
                <BuyerNotifications />
              </ProtectedRoute>
            } />
            <Route path="/buyer-portal/cc-upload" element={
              <ProtectedRoute requiredRole="buyer">
                <CCUpload />
              </ProtectedRoute>
            } />
            <Route path="/seller-portal/add-vehicle" element={
              <ProtectedRoute requiredRole="seller">
                <AddVehicle />
              </ProtectedRoute>
            } />
            <Route path="/seller-portal/listings" element={
              <ProtectedRoute requiredRole="seller">
                <MyListings />
              </ProtectedRoute>
            } />
            <Route path="/seller-portal/vehicles/:vehicleId/documents" element={
              <ProtectedRoute requiredRole="seller">
                <VehicleDocuments />
              </ProtectedRoute>
            } />
            <Route path="/seller-portal/notifications" element={
              <ProtectedRoute requiredRole="seller">
                <SellerNotifications />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute requiredRole="admin">
                <UserManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/vehicles" element={
              <ProtectedRoute requiredRole="admin">
                <VehicleManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/documents" element={
              <ProtectedRoute requiredRole="admin">
                <DocumentVerification />
              </ProtectedRoute>
            } />
            <Route path="/admin/analytics" element={
              <ProtectedRoute requiredRole="admin">
                <Analytics />
              </ProtectedRoute>
            } />
            <Route path="/admin/notifications" element={
              <ProtectedRoute requiredRole="admin">
                <AdminNotifications />
              </ProtectedRoute>
            } />
            <Route path="/admin/cms" element={
              <ProtectedRoute requiredRole="admin">
                <CMSPortal />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
