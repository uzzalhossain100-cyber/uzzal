import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { showError } from '@/utils/toast';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { success, error } = await signIn(email, password);
    if (success) {
      navigate('/');
    } else {
      showError(error || "Login failed.");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 p-4">
      <Card className="w-full max-w-md shadow-lg border-primary/20 dark:border-primary/50">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary dark:text-primary-foreground">লগইন</CardTitle>
          <CardDescription className="text-muted-foreground">আপনার অ্যাকাউন্ট অ্যাক্সেস করতে আপনার ইমেল এবং পাসওয়ার্ড লিখুন।</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">ইমেল / ইউজারনেম</Label>
              <Input
                id="email"
                type="text"
                placeholder="ইউজার নেম লিখুন"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
          <div className="mt-4 text-center text-sm text-muted-foreground">
            অ্যাকাউন্ট নেই?{" "}
            <Link to="/signup" className="underline text-primary hover:text-primary/90">
              সাইন আপ করুন
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;