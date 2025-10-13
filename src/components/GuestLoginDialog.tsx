import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { showError } from '@/utils/toast';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/lib/translations'; // Import useTranslation

interface GuestLoginDialogProps {
  onOpenChange: (open: boolean) => void;
  isOpen: boolean;
}

const GuestLoginDialog: React.FC<GuestLoginDialogProps> = ({ onOpenChange, isOpen }) => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { guestSignIn } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation(); // Initialize useTranslation

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[a-zA-Z0-9_-]*$/.test(value)) {
      setUsername(value);
    } else {
      showError(t("common.username_validation_error"));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      showError(t("common.username_required"));
      return;
    }
    setIsLoading(true);
    const { success, error } = await guestSignIn(username);
    if (success) {
      onOpenChange(false);
      navigate('/');
    } else {
      showError(error || t("common.guest_login_failed"));
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-primary">{t("common.guest_login_title")}</DialogTitle>
          <DialogDescription>
            {t("common.guest_login_dialog_desc")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="guest-username">{t("common.username")}</Label>
            <div className="relative">
              <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="guest-username"
                type="text"
                placeholder={t("common.enter_username_placeholder")}
                value={username}
                onChange={handleUsernameChange}
                className="pl-8 border-primary/30 focus-visible:ring-primary"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
            {isLoading ? t("common.logging_in") : t("common.login")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GuestLoginDialog;