import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Phone, Mail, User } from 'lucide-react';

const ContactPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">যোগাযোগ</CardTitle>
          <CardDescription>আমাদের সাথে যোগাযোগ করুন</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center gap-4">
            <User className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm font-medium">এডমিন নাম</p>
              <p className="text-lg font-semibold">Uzzal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Phone className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm font-medium">মোবাইল নম্বর</p>
              <p className="text-lg font-semibold">01713236980</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Mail className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm font-medium">ইমেল</p>
              <p className="text-lg font-semibold">admin@example.com</p> {/* Added a placeholder email */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactPage;