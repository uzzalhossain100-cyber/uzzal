import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { showError } from '@/utils/toast';

const SignupPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { success, error } = await signUp(username, email, mobileNumber, password);
    if (success) {
      navigate('/login'); // Redirect to login after successful signup
    } else {
      showError(error || "Signup failed.");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 p-4">
      <Card className="w-full max-w-md shadow-lg border-primary/20 dark:border-primary/50">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary dark:text-primary-foreground">সাইন আপ</CardTitle>
          <CardDescription className="text-muted-foreground">একটি নতুন অ্যাকাউন্ট তৈরি করতে আপনার তথ্য লিখুন।</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">ইউজারনেম</Label>
              <Input
                id="username"
                type="text"
                placeholder="আপনার ইউজারনেম"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border-primary/30 focus-visible:ring-primary"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">ইমেল</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-primary/30 focus-visible:ring-primary"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mobileNumber">মোবাইল নম্বর</Label>
              <Input
                id="mobileNumber"
                type="tel"
                placeholder="01XXXXXXXXX"
                required
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="border-primary/30 focus-visible:ring-primary"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">পাসওয়ার্ড</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-primary/30 focus-visible:ring-primary"
              />
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? 'সাইন আপ হচ্ছে...' : 'সাইন আপ করুন'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            ইতিমধ্যে একটি অ্যাকাউন্ট আছে?{" "}
            <Link to="/login" className="underline text-primary hover:text-primary/90">
              লগইন করুন
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;