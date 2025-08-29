import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import NewsPage from "./pages/NewsPage";
import ContactPage from "./pages/ContactPage";
import LiveTVPage from "./pages/LiveTVPage";
import EmergencyContactsPage from "./pages/EmergencyContactsPage";
import UserManagementPage from "./pages/UserManagementPage";
import ActiveUsersPage from "./pages/ActiveUsersPage"; // New import
import MainLayout from "./components/layout/MainLayout";
import ViewPlatformPage from "./pages/ViewPlatformPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/live-tv" element={<LiveTVPage />} />
                <Route path="/emergency-contacts" element={<EmergencyContactsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/user-management" element={<UserManagementPage />} />
                <Route path="/active-users" element={<ActiveUsersPage />} /> {/* New route */}
                <Route path="/view/:encodedUrl/:itemName" element={<ViewPlatformPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;