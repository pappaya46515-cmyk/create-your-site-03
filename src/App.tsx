import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AdminPortal from "./pages/AdminPortal";
import SellerPortal from "./pages/SellerPortal";
import BuyerPortal from "./pages/BuyerPortal";
import RoleSelect from "./pages/RoleSelect";
import PortalSelector from "./pages/PortalSelector";
import VehicleBrowse from "./pages/buyer/VehicleBrowse";
import AddVehicle from "./pages/seller/AddVehicle";
import VehicleDocuments from "./pages/seller/VehicleDocuments";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
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
          <Route path="/seller-portal/add-vehicle" element={
            <ProtectedRoute requiredRole="seller">
              <AddVehicle />
            </ProtectedRoute>
          } />
          <Route path="/seller-portal/vehicles/:vehicleId/documents" element={
            <ProtectedRoute requiredRole="seller">
              <VehicleDocuments />
            </ProtectedRoute>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
