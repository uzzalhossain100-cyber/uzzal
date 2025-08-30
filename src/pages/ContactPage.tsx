import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Phone, Mail, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // Import Avatar components

const ContactPage: React.FC = () => {
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
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactPage;