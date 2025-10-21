import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Users, Circle, MessageSquareText, Search as SearchIcon, Loader2, User as UserIcon, Group } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge'; // Import Badge component
import { useTranslation } from '@/lib/translations'; // Import useTranslation

interface Profile {
  id: string;
  username: string;
  mobile_number: string | null;
  is_active: boolean;
  email: string;
  created_at: string;
  // is_guest?: boolean; // Removed
  isOnline?: boolean; // Added for online status
}

const ActiveUsersPanel: React.FC = () => {
  const { profile: currentUserProfile, onlineUsers } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Profile[]>([]);
  const { t } = useTranslation(); // Initialize useTranslation

  const filteredOnlineUsers = onlineUsers.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => a.username.localeCompare(b.username));

  const handleUserSelect = (user: Profile) => {
    setSelectedUsers(prev =>
      prev.some(u => u.id === user.id)
        ? prev.filter(u => u.id !== user.id)
        : [...prev, user]
    );
  };

  const handleStartPrivateChat = (user: Profile) => {
    toast.info(t("common.start_private_chat", { username: user.username }));
    // Future: navigate to private chat with this user
  };

  const handleStartGroupChat = () => {
    if (selectedUsers.length < 2) {
      toast.error(t("common.select_at_least_two_users"));
      return;
    }
    const userNames = selectedUsers.map(u => u.username).join(', ');
    toast.info(t("common.start_group_chat", { userNames }));
    // Future: navigate to group chat with selected users
    setSelectedUsers([]); // Clear selection after attempting to start chat
  };

  return (
    <Card className="w-full flex flex-col h-full bg-background/80 backdrop-blur-sm shadow-lg border-primary/20 dark:border-primary/50">
      <CardHeader className="pb-4 border-b">
        <CardTitle className="text-xl font-extrabold text-primary dark:text-primary-foreground flex items-center">
          <Users className="h-5 w-5 mr-2" /> {t("common.active_users_page_title")}
        </CardTitle>
        <CardDescription className="text-muted-foreground">{t("common.online_users_list")}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-0 flex flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("common.search_users_placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg bg-background pl-8 border-primary/30 focus-visible:ring-primary"
            />
          </div>
        </div>
        <ScrollArea className="flex-1 w-full p-4">
          <div className="grid gap-3">
            {filteredOnlineUsers.length === 0 ? (
              <div className="text-center text-muted-foreground p-4 font-bold">{t("common.no_active_users_message")}</div>
            ) : (
              filteredOnlineUsers.map((user) => (
                <div
                  key={user.id}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg shadow-sm border transition-all duration-200 cursor-pointer",
                    "bg-background/60 text-foreground border-primary/10 hover:bg-primary/5 dark:border-primary/20 dark:hover:bg-primary/10",
                    selectedUsers.some(u => u.id === user.id) && "bg-primary/10 border-primary dark:bg-primary/20"
                  )}
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="flex items-center gap-2">
                    <Circle className="h-3 w-3 fill-green-500 text-green-500" />
                    <div>
                      <p className="font-extrabold text-foreground flex items-center">
                        {user.username}
                        {/* Removed is_guest badge */}
                      </p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  {currentUserProfile?.id !== user.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); handleStartPrivateChat(user); }}
                      className="text-primary hover:bg-primary/10 font-bold"
                    >
                      <MessageSquareText className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        {selectedUsers.length > 0 && (
          <div className="p-4 border-t flex flex-col gap-2">
            <p className="text-sm text-muted-foreground font-bold">{t("common.selected_users_count", { count: selectedUsers.length })}</p>
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map(user => (
                <Badge key={user.id} variant="secondary" className="flex items-center gap-1 font-bold">
                  {user.username}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => handleUserSelect(user)}
                  >
                    x
                  </Button>
                </Badge>
              ))}
            </div>
            <Button
              onClick={handleStartGroupChat}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-2 font-bold"
              disabled={selectedUsers.length < 2}
            >
              <Group className="h-4 w-4 mr-2" /> {t("common.start_group_chat_btn")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveUsersPanel;