import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { showError } from '@/utils/toast';
import GuestLoginDialog from '@/components/GuestLoginDialog';
import { ArrowLeft } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState(''); // Can be email or username
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGuestLoginDialogOpen, setIsGuestLoginDialogOpen] = useState(false);
  const [showAdminLoginForm, setShowAdminLoginForm] = useState(false); // New state to toggle admin login form
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { success, error } = await signIn(identifier, password);
    if (success) {
      navigate('/');
    } else {
      showError(error || "Login failed.");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4"> {/* Removed bg-gradient-to-br classes */}
      <Card className="w-full max-w-md shadow-lg border-primary/20 dark:border-primary/50">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary dark:text-primary-foreground">
            {showAdminLoginForm ? 'এডমিন লগইন' : 'লগইন'}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {showAdminLoginForm
              ? 'এডমিন হিসেবে প্রবেশ করতে আপনার ইউজারনেম/ইমেল এবং পাসওয়ার্ড লিখুন।'
              : 'আপনার অ্যাকাউন্টে প্রবেশ করুন বা সাধারণ ইউজার হিসেবে চালিয়ে যান।'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showAdminLoginForm ? (
            <div className="grid gap-4">
              <Button
                variant="default"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => setIsGuestLoginDialogOpen(true)}
              >
                সাধারণ ইউজার হিসেবে প্রবেশ করুন
              </Button>
              <div className="mt-2 text-center text-sm text-muted-foreground">
                অথবা{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-primary hover:text-primary/90"
                  onClick={() => setShowAdminLoginForm(true)}
                >
                  এডমিন হিসাবে প্রবেশ করুন
                </Button>
              </div>
              <div className="mt-4 text-center text-sm text-muted-foreground">
                অ্যাকাউন্ট নেই?{" "}
                <Link to="/signup" className="underline text-primary hover:text-primary/90">
                  সাইন আপ করুন
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-4">
              <Button
                variant="ghost"
                onClick={() => setShowAdminLoginForm(false)}
                className="p-0 h-auto justify-start text-primary dark:text-primary-foreground hover:bg-transparent hover:text-primary/80"
              >
                <ArrowLeft className="h-5 w-5 mr-2" /> ফিরে যান
              </Button>
              <div className="grid gap-2">
                <Label htmlFor="identifier">ইউজারনেম / ইমেল</Label>
                <Input
                  id="identifier"
                  type="text"
                  placeholder="ইউজারনেম বা ইমেল লিখুন"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="border-primary/30 focus-visible:ring-primary"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">পাসওয়ার্ড</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="পাসওয়ার্ড"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-primary/30 focus-visible:ring-primary"
                />
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
      <GuestLoginDialog
        isOpen={isGuestLoginDialogOpen}
        onOpenChange={setIsGuestLoginDialogOpen}
      />
    </div>
  );
};

export default LoginPage;