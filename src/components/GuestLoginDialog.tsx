import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { showError } from '@/utils/toast';

interface GuestLoginDialogProps {
  onOpenChange: (open: boolean) => void;
  isOpen: boolean;
}

const GuestLoginDialog: React.FC<GuestLoginDialogProps> = ({ onOpenChange, isOpen }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { guestSignIn } = useAuth();

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[a-zA-Z0-9_-]*$/.test(value)) {
      setUsername(value);
    } else {
      showError("ইউজারনেম শুধুমাত্র ইংরেজি অক্ষর, সংখ্যা, আন্ডারস্কোর এবং হাইফেন দিয়ে গঠিত হতে পারে।");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim()) {
      showError("ইউজারনেম এবং ইমেল উভয়ই প্রয়োজন।");
      return;
    }
    setIsLoading(true);
    const { success, error } = await guestSignIn(username, email);
    if (success) {
      onOpenChange(false); // Close dialog on successful guest login
    } else {
      showError(error || "সাধারণ ইউজার হিসেবে লগইন ব্যর্থ হয়েছে।");
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-primary">সাধারণ ইউজার হিসেবে প্রবেশ করুন</DialogTitle>
          <DialogDescription>
            আপনার ইউজারনেম এবং ইমেল আইডি দিয়ে সাইটে প্রবেশ করুন।
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="guest-username">ইউজারনেম</Label>
            <div className="relative">
              <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="guest-username"
                type="text"
                placeholder="আপনার ইউজারনেম (শুধুমাত্র ইংরেজি)"
                value={username}
                onChange={handleUsernameChange}
                className="pl-8 border-primary/30 focus-visible:ring-primary"
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="guest-email">ইমেল</Label>
            <div className="relative">
              <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="guest-email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-8 border-primary/30 focus-visible:ring-primary"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
            {isLoading ? 'প্রবেশ করা হচ্ছে...' : 'প্রবেশ করুন'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GuestLoginDialog;