import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { showError } from '@/utils/toast';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from '@/lib/translations'; // Import useTranslation

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState(''); // Changed identifier to email
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation(); // Initialize useTranslation

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => { // Changed to handleEmailChange
    const value = e.target.value;
    // Allow only ASCII characters for email
    if (/^[\x00-\x7F]*$/.test(value)) {
      setEmail(value);
    } else {
      showError(t("common.email_validation_error")); // Updated error message
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only ASCII characters for password
    if (/^[\x00-\x7F]*$/.test(value)) {
      setPassword(value);
    } else {
      showError(t("common.password_validation_error"));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { success, error } = await signIn(email, password); // Updated call
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
              <Label htmlFor="email" className="font-bold">{t("common.email")}</Label> {/* Changed label */}
              <Input
                id="email"
                type="email" // Changed type to email
                placeholder={t("common.enter_email_placeholder")} // Updated placeholder
                required
                value={email}
                onChange={handleEmailChange} // Updated handler
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
                onChange={handlePasswordChange}
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
    </div>
  );
};

export default LoginPage;