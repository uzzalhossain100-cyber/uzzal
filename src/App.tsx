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
import ContactPage from "./pages/ContactPage";
import EmergencyContactsPage from "./pages/EmergencyContactsPage";
import UserManagementPage from "./pages/UserManagementPage";
import ActiveUsersPage from "./pages/ActiveUsersPage";
import MainLayout from "./components/layout/MainLayout";
import ViewPlatformPage from "./pages/ViewPlatformPage";
import LiveChatPage from "./pages/LiveChatPage";
import VisitorTracker from "./components/VisitorTracker";
import AdvertisementPage from "./pages/AdvertisementPage";
import ConverterPage from "./pages/ConverterPage";
import AIPage from "./pages/AIPage";
import QuizPage from "./pages/QuizPage";
import { LanguageProvider } from "./context/LanguageContext"; // Import LanguageProvider

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LanguageProvider> {/* Wrap with LanguageProvider */}
          <AuthProvider>
            <VisitorTracker />
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              
              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/emergency-contacts" element={<EmergencyContactsPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/user-management" element={<UserManagementPage />} />
                  <Route path="/active-users" element={<ActiveUsersPage />} />
                  <Route path="/live-chat" element={<LiveChatPage />} />
                  <Route path="/advertisements" element={<AdvertisementPage />} />
                  <Route path="/converter" element={<ConverterPage />} />
                  <Route path="/ai" element={<AIPage />} />
                  <Route path="/quiz" element={<QuizPage />} />
                  <Route path="/view/:encodedUrl/:itemName" element={<ViewPlatformPage />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                </Route>
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;