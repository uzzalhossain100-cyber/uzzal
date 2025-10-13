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
import { useTranslation } from '@/lib/translations'; // Import useTranslation

const LoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState(''); // Can be email or username
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGuestLoginDialogOpen, setIsGuestLoginDialogOpen] = useState(false);
  const [showAdminLoginForm, setShowAdminLoginForm] = useState(false); // New state to toggle admin login form
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
      <Card className="w-full max-w-md bg-background/80 backdrop-blur-sm shadow-lg border-primary/20 dark:border-primary/50"> {/* Added bg-background/80 backdrop-blur-sm */}
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold text-primary dark:text-primary-foreground">
            {showAdminLoginForm ? t("common.admin_login") : t("common.login")}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {showAdminLoginForm
              ? t("common.admin_login_desc")
              : t("common.login_desc")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showAdminLoginForm ? (
            <div className="grid gap-4">
              <Button
                variant="default"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
                onClick={() => setIsGuestLoginDialogOpen(true)}
              >
                {t("common.guest_login_button")}
              </Button>
              <div className="mt-2 text-center text-sm text-muted-foreground">
                {t("common.or")}{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-primary hover:text-primary/90 font-bold"
                  onClick={() => setShowAdminLoginForm(true)}
                >
                  {t("common.login_as_admin_button")}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm text-muted-foreground">
                {t("common.no_account")}{" "}
                <Link to="/signup" className="underline text-primary hover:text-primary/90 font-bold">
                  {t("common.signup")}
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-4">
              <Button
                variant="ghost"
                onClick={() => setShowAdminLoginForm(false)}
                className="p-0 h-auto justify-start text-primary dark:text-primary-foreground hover:bg-transparent hover:text-primary/80 font-bold"
              >
                <ArrowLeft className="h-5 w-5 mr-2" /> {t("common.go_back")}
              </Button>
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