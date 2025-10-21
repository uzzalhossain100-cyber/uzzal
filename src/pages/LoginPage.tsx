import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { showError } from '@/utils/toast';
// import GuestLoginDialog from '@/components/GuestLoginDialog'; // Removed
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from '@/lib/translations'; // Import useTranslation

const LoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState(''); // Can be email or username
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // const [isGuestLoginDialogOpen, setIsGuestLoginDialogOpen] = useState(false); // Removed
  // const [showAdminLoginForm, setShowAdminLoginForm] = useState(false); // Removed
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation(); // Initialize useTranslation

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { success, error } = await signIn(identifier, password);
    if (success) {
      navigate('/');
    } else {
      showError(error || t("common.login_failed"));
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md bg-background/80 backdrop-blur-sm shadow-lg border-primary/20 dark:border-primary/50">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold text-primary dark:text-primary-foreground">
            {t("common.login")}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {t("common.login_desc")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="identifier" className="font-bold">{t("common.username")} / {t("common.email")}</Label>
              <Input
                id="identifier"
                type="text"
                placeholder={t("common.enter_username_placeholder")}
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="border-primary/30 focus-visible:ring-primary"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="font-bold">{t("common.password")}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t("common.enter_password_placeholder")}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-primary/30 focus-visible:ring-primary"
              />
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold" disabled={isLoading}>
              {isLoading ? t("common.login_in_progress") : t("common.login")}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            {t("common.no_account")}{" "}
            <Link to="/signup" className="underline text-primary hover:text-primary/90 font-bold">
              {t("common.signup")}
            </Link>
          </div>
        </CardContent>
      </Card>
      {/* Removed GuestLoginDialog */}
    </div>
  );
};

export default LoginPage;