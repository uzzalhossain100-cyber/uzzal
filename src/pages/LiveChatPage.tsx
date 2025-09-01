import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircleMore, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import PublicChatPanel from '@/components/chat/PublicChatPanel';
import ActiveUsersPanel from '@/components/chat/ActiveUsersPanel';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Navigate } from 'react-router-dom';
import { showError } from '@/utils/toast';

const LiveChatPage: React.FC = () => {
  const { user, profile, loading: authLoading } = useAuth();

  const isAdmin = profile?.email === 'uzzal@admin.com';

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg text-muted-foreground">চ্যাট লোড হচ্ছে...</span>
      </div>
    );
  }

  // Redirect if not logged in or not admin
  if (!user || !profile) {
    showError("চ্যাট ব্যবহার করার জন্য আপনাকে লগইন করতে হবে।");
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    showError("আপনার এই পেজটি অ্যাক্সেস করার অনুমতি নেই।");
    return <Navigate to="/" replace />; // Redirect non-admin users to home
  }

  return (
    <div className="flex flex-col h-full">
      <Card className="w-full flex flex-col flex-1 shadow-lg border-primary/20 dark:border-primary/50">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <CardTitle className="text-3xl font-extrabold text-primary dark:text-primary-foreground flex items-center">
            <MessageCircleMore className="h-7 w-7 mr-2" /> লাইভ চ্যাট
          </CardTitle>
        </CardHeader>
        <ResizablePanelGroup
          direction="horizontal"
          className="flex-1 rounded-b-lg"
        >
          <ResizablePanel defaultSize={75} minSize={50}>
            <PublicChatPanel user={user} profile={profile} isAdmin={isAdmin} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={25} minSize={20}>
            <ActiveUsersPanel />
          </ResizablePanel>
        </ResizablePanelGroup>
      </Card>
    </div>
  );
};

export default LiveChatPage;