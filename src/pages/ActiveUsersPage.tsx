import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Users, Circle, MessageSquareText, Search as SearchIcon, Loader2, User as UserIcon } from 'lucide-react'; // Added UserIcon
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Profile {
  id: string;
  username: string;
  mobile_number: string | null;
  is_active: boolean;
  email: string;
  created_at: string;
  is_guest?: boolean; // Added for guest users
}

const ActiveUsersPage: React.FC = () => {
  const { profile: currentUserProfile, onlineUsers, getUsersProfiles, loading: authLoading } = useAuth();
  const [allUsers, setAllUsers] = useState<Profile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAllUsers = async () => {
      setLoading(true);
      let fetchedUsers = await getUsersProfiles(); // This now only fetches real users
      if (!fetchedUsers) {
        fetchedUsers = [];
      }

      // If the current user is the mock admin, add them to the list if not already present
      if (currentUserProfile && currentUserProfile.email === 'Uzzal' && !fetchedUsers.some(u => u.id === currentUserProfile.id)) {
        fetchedUsers.push({
          ...currentUserProfile,
          is_active: true, // Admin is always active when logged in
          is_guest: false,
        });
      }
      
      setAllUsers(fetchedUsers);
      setLoading(false);
    };

    if (!authLoading) {
      fetchAllUsers();
    }
  }, [authLoading, getUsersProfiles, currentUserProfile]);

  useEffect(() => {
    // Combine all users (real and online guests) with online status
    const onlineUserIds = new Set(onlineUsers.map(u => u.id));
    const onlineGuestUsers = onlineUsers.filter(u => u.is_guest);

    const combinedUsers = [...allUsers, ...onlineGuestUsers.filter(guest => !allUsers.some(u => u.id === guest.id))];

    const usersWithStatus = combinedUsers.map(user => ({
      ...user,
      isOnline: onlineUserIds.has(user.id) || (currentUserProfile?.id === user.id && (currentUserProfile.email === 'Uzzal' || currentUserProfile.is_guest)), // Admin/Guest is online if logged in
    }));

    // Filter based on search query
    const searchFiltered = usersWithStatus.filter(user =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort: online users first, then offline. Within each group, sort by username.
    searchFiltered.sort((a, b) => {
      if (a.isOnline && !b.isOnline) return -1;
      if (!a.isOnline && b.isOnline) return 1;
      return a.username.localeCompare(b.username);
    });

    setFilteredUsers(searchFiltered);
  }, [allUsers, onlineUsers, searchQuery, currentUserProfile]);

  const handleChatClick = (user: Profile) => {
    toast.info(`'${user.username}' এর সাথে চ্যাট শুরু করার চেষ্টা হচ্ছে। (এই ফিচারটি এখনো ডেভেলপ করা হয়নি)`);
    // Here you would navigate to a chat page or open a chat modal
    // Example: navigate(`/chat/${user.id}`);
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg text-muted-foreground">ইউজার ডেটা লোড হচ্ছে...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Card className="w-full flex flex-col flex-1 shadow-lg border-primary/20 dark:border-primary/50">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <CardTitle className="text-3xl font-extrabold text-primary dark:text-primary-foreground flex items-center">
            <Users className="h-7 w-7 mr-2" /> সক্রিয় ইউজার
          </CardTitle>
          <CardDescription className="text-muted-foreground hidden sm:block">অনলাইন এবং নিবন্ধিত ইউজারদের তালিকা</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <div className="p-4 border-b">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="ইউজারনেম বা ইমেল দিয়ে সার্চ করুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg bg-background pl-8 border-primary/30 focus-visible:ring-primary"
              />
            </div>
          </div>
          <ScrollArea className="h-[calc(100vh-200px)] w-full p-4">
            <div className="grid gap-4">
              {filteredUsers.length === 0 ? (
                <div className="text-center text-muted-foreground p-4">কোনো ইউজার পাওয়া যায়নি।</div>
              ) : (
                filteredUsers.map((user) => (
                  <Card key={user.id} className="flex items-center justify-between p-4 shadow-sm border-primary/10 dark:border-primary/20">
                    <div className="flex items-center gap-3">
                      <Circle
                        className={cn(
                          "h-3 w-3",
                          user.isOnline ? "fill-green-500 text-green-500" : "fill-gray-400 text-gray-400"
                        )}
                      />
                      <div>
                        <p className="font-semibold text-foreground flex items-center">
                          {user.username}
                          {user.is_guest && <span className="ml-2 text-xs text-muted-foreground">(গেস্ট)</span>}
                        </p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    {currentUserProfile?.id !== user.id && ( // Don't allow chatting with self
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleChatClick(user)}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <MessageSquareText className="h-4 w-4 mr-2" /> চ্যাট
                      </Button>
                    )}
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActiveUsersPage;