import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Phone, Mail, User, Facebook } from 'lucide-react'; // Import Facebook icon
import { useTranslation } from '@/lib/translations'; // Import useTranslation

const ContactPage: React.FC = () => {
  const { t } = useTranslation(); // Initialize useTranslation

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)] p-4 rounded-lg shadow-xl">
      <Card className="w-full max-w-md bg-background/80 backdrop-blur-sm shadow-lg border-primary/20 dark:border-primary/50"> {/* Added bg-background/80 backdrop-blur-sm */}
        <CardHeader className="text-center border-b pb-4">
          <CardTitle className="text-3xl font-extrabold text-primary dark:text-primary-foreground">{t("common.contact_page_title")}</CardTitle>
          <CardDescription className="text-muted-foreground">{t("common.contact_us")}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 p-6">
          <div className="flex flex-col items-center gap-4 p-3 rounded-lg bg-accent/20 dark:bg-accent/30 border border-primary/10">
            <img
              src="/images/uzzal-hossain.jpg"
              alt="Uzzal Hossain"
              className="h-64 w-48 object-cover rounded-lg shadow-md border-2 border-primary/30"
            />
            <div className="text-center">
              <p className="text-sm font-bold text-muted-foreground">{t("common.admin_name")}</p>
              <p className="text-xl font-extrabold text-foreground">উজ্জ্বল হোসেন</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 rounded-lg bg-accent/20 dark:bg-accent/30 border border-primary/10">
            <Phone className="h-7 w-7 text-primary" />
            <div>
              <p className="text-sm font-bold text-muted-foreground">{t("common.mobile_number")}</p>
              <p className="text-xl font-extrabold text-foreground">01713236980</p>
            </div>
          </div>
          {/* New Facebook ID section */}
          <div className="flex items-center gap-4 p-3 rounded-lg bg-accent/20 dark:bg-accent/30 border border-primary/10">
            <Facebook className="h-7 w-7 text-primary" />
            <div>
              <p className="text-sm font-bold text-muted-foreground">{t("common.facebook_id")}</p>
              <a
                href="https://www.facebook.com/BrightBroBD"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl font-extrabold text-foreground hover:underline"
              >
                BrightBroBD
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 rounded-lg bg-accent/20 dark:bg-accent/30 border border-primary/10">
            <Mail className="h-7 w-7 text-primary" />
            <div>
              <p className="text-sm font-bold text-muted-foreground">{t("common.email")}</p>
              <p className="text-xl font-extrabold text-foreground">uzzalhossain.100@gmail.com</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactPage;