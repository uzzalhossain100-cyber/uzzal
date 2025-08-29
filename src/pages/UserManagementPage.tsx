import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/context/AuthContext';
import { User, CheckCircle, Ban, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { showError } from '@/utils/toast';

interface Profile {
  id: string;
  username: string;
  mobile_number: string | null;
  is_active: boolean;
  email: string;
  created_at: string;
}

const UserManagementPage: React.FC = () => {
  const { profile, getUsersProfiles, updateUserProfileStatus, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading) {
      if (profile?.email !== 'Uzzal') {
        showError("এই পেজটি শুধুমাত্র এডমিনদের জন্য।");
        navigate('/'); // Redirect non-admin users
        return;
      }
      fetchUsers();
    }
  }, [profile, authLoading, navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    const fetchedUsers = await getUsersProfiles();
    if (fetchedUsers) {
      setUsers(fetchedUsers);
    }
    setLoading(false);
  };

  const handleStatusChange = async (userId: string, currentStatus: boolean) => {
    setUpdatingUserId(userId);
    const { success } = await updateUserProfileStatus(userId, !currentStatus);
    if (success) {
      fetchUsers(); // Re-fetch users to update the list
    }
    setUpdatingUserId(null);
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg text-muted-foreground">লোডিং ইউজার ডেটা...</span>
      </div>
    );
  }

  if (profile?.email !== 'Uzzal') {
    return null; // Should have been redirected by now, but as a fallback
  }

  return (
    <div className="flex flex-col h-full">
      <Card className="w-full flex flex-col flex-1 shadow-lg border-primary/20 dark:border-primary/50">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <CardTitle className="text-3xl font-extrabold text-primary dark:text-primary-foreground flex items-center">
            <User className="h-7 w-7 mr-2" /> ইউজার ম্যানেজমেন্ট
          </CardTitle>
          <CardDescription className="text-muted-foreground hidden sm:block">সকল নিবন্ধিত ইউজারদের তালিকা এবং স্ট্যাটাস</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-[calc(100vh-130px)] w-full p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ইউজারনেম</TableHead>
                  <TableHead>ইমেল</TableHead>
                  <TableHead className="hidden md:table-cell">মোবাইল নম্বর</TableHead>
                  <TableHead>স্ট্যাটাস</TableHead>
                  <TableHead className="text-right">অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((userProfile) => (
                  <TableRow key={userProfile.id}>
                    <TableCell className="font-medium">{userProfile.username}</TableCell>
                    <TableCell>{userProfile.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{userProfile.mobile_number || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={userProfile.is_active ? "default" : "destructive"}>
                        {userProfile.is_active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {userProfile.id !== profile?.id && ( // Admin cannot block/unblock themselves
                        <Button
                          variant={userProfile.is_active ? "destructive" : "default"}
                          size="sm"
                          onClick={() => handleStatusChange(userProfile.id, userProfile.is_active)}
                          disabled={updatingUserId === userProfile.id}
                          className="min-w-[90px]"
                        >
                          {updatingUserId === userProfile.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : userProfile.is_active ? (
                            <>
                              <Ban className="h-4 w-4 mr-2" /> ব্লক
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" /> অ্যাক্সেস
                            </>
                          )}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagementPage;