import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/context/AuthContext';
import { User, CheckCircle, Ban, Loader2, Eye, CalendarDays, Calendar, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { showError } from '@/utils/toast';
import { supabase } from '@/lib/supabaseClient';
import { format, startOfDay, endOfDay, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns'; // Added date-fns functions

interface Profile {
  id: string;
  username: string;
  mobile_number: string | null;
  is_active: boolean;
  email: string;
  created_at: string;
}

interface Visit {
  id: string;
  user_id: string | null;
  guest_id: string | null;
  username: string | null;
  email: string | null;
  ip_address: string | null;
  visited_at: string;
  is_guest_visit: boolean;
}

interface VisitCounts {
  today: number;
  thisMonth: number;
  thisYear: number;
  total: number;
}

const UserManagementPage: React.FC = () => {
  const { profile: currentUserProfile, getUsersProfiles, updateUserProfileStatus, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [recentVisits, setRecentVisits] = useState<Visit[]>([]);
  const [visitCounts, setVisitCounts] = useState<VisitCounts>({ today: 0, thisMonth: 0, thisYear: 0, total: 0 });
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingVisits, setLoadingVisits] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading) {
      if (currentUserProfile?.email !== 'uzzal@admin.com') { // Corrected admin email check
        showError("এই পেজটি শুধুমাত্র এডমিনদের জন্য।");
        navigate('/'); // Redirect non-admin users
        return;
      }
      fetchUsers();
      fetchVisitsData();
    }
  }, [currentUserProfile, authLoading, navigate]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    let fetchedUsers = await getUsersProfiles();
    if (!fetchedUsers) {
      fetchedUsers = [];
    }

    // If the current user is the mock admin, add them to the list if not already present
    if (currentUserProfile && currentUserProfile.email === 'uzzal@admin.com' && !fetchedUsers.some(u => u.id === currentUserProfile.id)) {
      fetchedUsers.push({
        ...currentUserProfile,
        is_active: true, // Admin is always active when logged in
      });
    }
    
    setUsers(fetchedUsers);
    setLoadingUsers(false);
  };

  const fetchVisitsData = async () => {
    setLoadingVisits(true);
    
    // Fetch recent visits
    const { data: visitsData, error: visitsError } = await supabase
      .from('visits')
      .select('*')
      .order('visited_at', { ascending: false })
      .limit(50);

    if (visitsError) {
      console.error("Error fetching visits:", visitsError.message);
      showError("ভিজিট ডেটা লোড করতে ব্যর্থ।");
      setLoadingVisits(false); // Ensure loading state is reset even on error
      return;
    } else {
      setRecentVisits(visitsData || []);
    }

    // Calculate date boundaries in local time and convert to ISO strings for Supabase
    const now = new Date();
    const todayStart = startOfDay(now).toISOString();
    const todayEnd = endOfDay(now).toISOString();
    const thisMonthStart = startOfMonth(now).toISOString();
    const thisMonthEnd = endOfMonth(now).toISOString();
    const thisYearStart = startOfYear(now).toISOString();
    const thisYearEnd = endOfYear(now).toISOString();

    // Fetch visit counts
    const { count: todayCount, error: todayError } = await supabase
      .from('visits')
      .select('*', { count: 'exact', head: true })
      .gte('visited_at', todayStart)
      .lte('visited_at', todayEnd);

    const { count: monthCount, error: monthError } = await supabase
      .from('visits')
      .select('*', { count: 'exact', head: true })
      .gte('visited_at', thisMonthStart)
      .lte('visited_at', thisMonthEnd);

    const { count: yearCount, error: yearError } = await supabase
      .from('visits')
      .select('*', { count: 'exact', head: true })
      .gte('visited_at', thisYearStart)
      .lte('visited_at', thisYearEnd);

    const { count: totalCount, error: totalError } = await supabase
      .from('visits')
      .select('*', { count: 'exact', head: true });

    if (todayError || monthError || yearError || totalError) {
      console.error("Error fetching visit counts:", todayError?.message || monthError?.message || yearError?.message || totalError?.message);
      showError("ভিজিট কাউন্ট লোড করতে ব্যর্থ।");
    } else {
      setVisitCounts({
        today: todayCount || 0,
        thisMonth: monthCount || 0,
        thisYear: yearCount || 0,
        total: totalCount || 0,
      });
    }
    setLoadingVisits(false);
  };

  const handleStatusChange = async (userId: string, currentStatus: boolean) => {
    setUpdatingUserId(userId);
    const { success } = await updateUserProfileStatus(userId, !currentStatus);
    if (success) {
      fetchUsers(); // Re-fetch users to update the list
    }
    setUpdatingUserId(null);
  };

  if (authLoading || loadingUsers || loadingVisits) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg text-muted-foreground">ডেটা লোড হচ্ছে...</span>
      </div>
    );
  }

  if (currentUserProfile?.email !== 'uzzal@admin.com') { // Corrected admin email check
    return null; // Should have been redirected by now, but as a fallback
  }

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Visit Statistics Section */}
      <Card className="w-full bg-background/80 backdrop-blur-sm shadow-lg border-primary/20 dark:border-primary/50"> {/* Added bg-background/80 backdrop-blur-sm */}
        <CardHeader className="pb-4 border-b">
          <CardTitle className="text-2xl font-extrabold text-primary dark:text-primary-foreground flex items-center">
            <Eye className="h-6 w-6 mr-2" /> ভিজিটর পরিসংখ্যান
          </CardTitle>
          <CardDescription className="text-muted-foreground">সাইটে মোট ভিজিট এবং সময়ভিত্তিক পরিসংখ্যান</CardDescription>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col items-center justify-center p-4 bg-accent/10 dark:bg-accent/20 rounded-lg border border-primary/10">
            <Clock className="h-8 w-8 text-primary mb-2" />
            <p className="text-sm text-muted-foreground">আজকে</p>
            <p className="text-2xl font-bold text-foreground">{visitCounts.today}</p>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-accent/10 dark:bg-accent/20 rounded-lg border border-primary/10">
            <CalendarDays className="h-8 w-8 text-primary mb-2" />
            <p className="text-sm text-muted-foreground">এই মাসে</p>
            <p className="text-2xl font-bold text-foreground">{visitCounts.thisMonth}</p>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-accent/10 dark:bg-accent/20 rounded-lg border border-primary/10">
            <Calendar className="h-8 w-8 text-primary mb-2" />
            <p className="text-sm text-muted-foreground">এই বছরে</p>
            <p className="text-2xl font-bold text-foreground">{visitCounts.thisYear}</p>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-accent/10 dark:bg-accent/20 rounded-lg border border-primary/10">
            <Eye className="h-8 w-8 text-primary mb-2" />
            <p className="text-sm text-muted-foreground">মোট ভিজিট</p>
            <p className="text-2xl font-bold text-foreground">{visitCounts.total}</p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Visitors List */}
      <Card className="w-full flex flex-col flex-1 bg-background/80 backdrop-blur-sm shadow-lg border-primary/20 dark:border-primary/50"> {/* Added bg-background/80 backdrop-blur-sm */}
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <CardTitle className="text-2xl font-extrabold text-primary dark:text-primary-foreground flex items-center">
            <User className="h-6 w-6 mr-2" /> সাম্প্রতিক ভিজিটর
          </CardTitle>
          <CardDescription className="text-muted-foreground hidden sm:block">সাইটে শেষ ভিজিট করা ইউজারদের তালিকা</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-[300px] w-full p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>ইউজারনেম</TableHead>
                  <TableHead>ইমেল</TableHead>
                  <TableHead>আইপি অ্যাড্রেস</TableHead>
                  <TableHead>ভিজিটের সময়</TableHead>
                  <TableHead>প্রকার</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentVisits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">কোনো সাম্প্রতিক ভিজিট পাওয়া যায়নি।</TableCell>
                  </TableRow>
                ) : (
                  recentVisits.map((visit) => (
                    <TableRow key={visit.id}>
                      <TableCell className="font-medium">{visit.username || 'Anonymous'}</TableCell>
                      <TableCell>{visit.email || 'N/A'}</TableCell>
                      <TableCell>{visit.ip_address || 'N/A'}</TableCell>
                      <TableCell>{format(new Date(visit.visited_at), 'yyyy-MM-dd HH:mm')}</TableCell>
                      <TableCell>
                        <Badge variant={visit.is_guest_visit ? "secondary" : (visit.user_id ? "default" : "outline")}>
                          {visit.is_guest_visit ? "গেস্ট" : (visit.user_id ? "নিবন্ধিত" : "অজ্ঞাত")}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* User Management Section (Existing) */}
      <Card className="w-full flex flex-col flex-1 bg-background/80 backdrop-blur-sm shadow-lg border-primary/20 dark:border-primary/50"> {/* Added bg-background/80 backdrop-blur-sm */}
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <CardTitle className="text-3xl font-extrabold text-primary dark:text-primary-foreground flex items-center">
            <User className="h-7 w-7 mr-2" /> ইউজার ম্যানেজমেন্ট
          </CardTitle>
          <CardDescription className="text-muted-foreground hidden sm:block">সকল নিবন্ধিত ইউজারদের তালিকা এবং স্ট্যাটাস</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-[calc(100vh-130px-500px)] w-full p-4"> {/* Adjusted height */}
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
                      {userProfile.id !== currentUserProfile?.id && ( // Admin cannot block/unblock themselves
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