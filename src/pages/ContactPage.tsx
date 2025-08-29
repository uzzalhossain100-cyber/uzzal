import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Phone, Mail, User, Code, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // Import Avatar components

// Source code of App.tsx for display purposes
const appTsxSourceCode = `import { Toaster } from "@/components/ui/toaster";
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
import EmergencyContactsPage from "./pages/EmergencyContactsPage"; // New import
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
`;

const ContactPage: React.FC = () => {
  const handleCopyCode = () => {
    navigator.clipboard.writeText(appTsxSourceCode);
    toast.success("App.tsx source code copied to clipboard!");
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)] p-4 bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 rounded-lg shadow-xl">
      <Card className="w-full max-w-md shadow-lg border-primary/20 dark:border-primary/50">
        <CardHeader className="text-center border-b pb-4">
          <CardTitle className="text-3xl font-bold text-primary dark:text-primary-foreground">যোগাযোগ</CardTitle>
          <CardDescription className="text-muted-foreground">আমাদের সাথে যোগাযোগ করুন</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 p-6">
          <div className="flex flex-col items-center gap-4 p-3 rounded-lg bg-accent/20 dark:bg-accent/30 border border-primary/10">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/images/uzzal-hossain.jpg" alt="Uzzal Hossain" />
              <AvatarFallback>UH</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">এডমিন নাম</p>
              <p className="text-xl font-semibold text-foreground">উজ্জ্বল হোসেন</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 rounded-lg bg-accent/20 dark:bg-accent/30 border border-primary/10">
            <Phone className="h-7 w-7 text-primary" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">মোবাইল নম্বর</p>
              <p className="text-xl font-semibold text-foreground">01713236980</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 rounded-lg bg-accent/20 dark:bg-accent/30 border border-primary/10">
            <Mail className="h-7 w-7 text-primary" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">ইমেল</p>
              <p className="text-xl font-semibold text-foreground">uzzalhossain.100@gmail.com</p>
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-4">
                <Code className="mr-2 h-5 w-5" /> কোড দেখুন
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
              <DialogHeader>
                <DialogTitle className="text-primary">অ্যাপ্লিকেশন কোড</DialogTitle>
                <DialogDescription>
                  এই ওয়েবসাইটটি একটি React অ্যাপ্লিকেশন। একটি React অ্যাপ্লিকেশন সরাসরি একটি `.html` ফাইলে কপি করে ব্রাউজারে চালানো যায় না। এটি চালানোর জন্য Node.js এবং একটি বিল্ড প্রক্রিয়া প্রয়োজন। নিচে `src/App.tsx` ফাইলের সোর্স কোড দেওয়া হলো।
                </DialogDescription>
              </DialogHeader>
              <div className="flex-1 overflow-hidden relative">
                <ScrollArea className="h-full w-full rounded-md border p-4 font-mono text-sm bg-muted/50">
                  <pre className="whitespace-pre-wrap break-all">
                    <code>{appTsxSourceCode}</code>
                  </pre>
                </ScrollArea>
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-4 right-4"
                  onClick={handleCopyCode}
                >
                  <Copy className="mr-2 h-4 w-4" /> কপি করুন
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactPage;