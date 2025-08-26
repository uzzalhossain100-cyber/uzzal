import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IndexLayout from "./pages/Index"; // Renamed to IndexLayout
import NotFound from "./pages/NotFound";
import HomePage from "./pages/HomePage";
import VoucherEntryPage from "./pages/VoucherEntryPage";
import FirstApprovalPage from "./pages/FirstApprovalPage";
import PaymentPage from "./pages/PaymentPage";
import CheckAndApprovePage from "./pages/CheckAndApprovePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<IndexLayout />}> {/* Use IndexLayout for common layout */}
            <Route index element={<HomePage />} /> {/* Default content for "/" */}
            <Route path="voucher-entry" element={<VoucherEntryPage />} />
            <Route path="first-approval" element={<FirstApprovalPage />} />
            <Route path="payment" element={<PaymentPage />} />
            <Route path="check-and-approve" element={<CheckAndApprovePage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;