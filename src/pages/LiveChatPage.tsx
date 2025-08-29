import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Search, Send, CircleDot, Circle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface OnlineUser {
  user_id: string;
  username: string;
  email: string;
  last_active: string;
}

interface Message {
  id: string;
  sender_id: string;
  sender_username: string;
  content: string;
  created_at: string;
}

const LiveChatPage: React.FC = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (authLoading || !user) return;

    // Setup Presence Channel
    if (!channelRef.current) {
      channelRef.current = supabase.channel('online_users', {
        config: {
          presence: {
            key: user.id,
          },
        },
      });

      channelRef.current
        .on('presence', { event: 'sync' }, () => {
          const newState = channelRef.current.presenceState();
          const currentOnlineUsers: OnlineUser[] = [];
          for (const userId in newState) {
            // newState[userId] is an array of presence states for that user_id
            // We take the first one as it contains the tracked metadata
            const userPresence = newState[userId][0];
            currentOnlineUsers.push({
              user_id: userPresence.user_id,
              username: userPresence.username,
              email: userPresence.email,
              last_active: userPresence.last_active,
            });
          }
          // Sort online users: current user first, then by username
          currentOnlineUsers.sort((a, b) => {
            if (a.user_id === user.id) return -1;
            if (b.user_id === user.id) return 1;
            return a.username.localeCompare(b.username);
          });
          setOnlineUsers(currentOnlineUsers);
        })
        .subscribe(async (status: string) => {
          if (status === 'SUBSCRIBED' && profile) {
            await channelRef.current.track({
              user_id: user.id,
              username: profile.username,
              email: profile.email,
              last_active: new Date().toISOString(),
            });
          }
        });
    }

    // Fetch initial messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(50); // Fetch last 50 messages

      if (error) {
        console.error("Error fetching messages:", error);
      } else {
        setMessages(data as Message[]);
      }
    };

    fetchMessages();

    // Setup Realtime for Messages
    const messageSubscription = supabase
      .channel('messages_channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages((prevMessages) => [...prevMessages, payload.new as Message]);
      })
      .subscribe();

    return () => {
      if (channelRef.current) {
        channelRef.current.untrack();
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
      messageSubscription.unsubscribe();
    };
  }, [user, profile, authLoading]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !profile) return;

    const { error } = await supabase.from('messages').insert({
      sender_id: user.id,
      sender_username: profile.username,
      content: newMessage.trim(),
    });

    if (error) {
      console.error("Error sending message:", error);
      showError("মেসেজ পাঠাতে ব্যর্থ।");
    } else {
      setNewMessage('');
    }
  };

  const filteredUsers = onlineUsers.filter(
    (onlineUser) =>
      onlineUser.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      onlineUser.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg text-muted-foreground">লোডিং চ্যাট...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Active Users Card */}
      <Card className="w-full lg:w-1/4 flex flex-col shadow-lg border-primary/20 dark:border-primary/50">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-primary">
            <CircleDot className="h-5 w-5 text-green-500" /> সক্রিয় ইউজার
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="ইউজার সার্চ করুন..."
                className="w-full rounded-lg bg-background pl-8 border-primary/30 focus-visible:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <ScrollArea className="h-[calc(100vh-280px)] w-full p-4">
            <div className="grid gap-2">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((onlineUser) => (
                  <div
                    key={onlineUser.user_id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg transition-colors",
                      onlineUser.user_id === user?.id ? "bg-primary/10 border border-primary" : "hover:bg-accent/50",
                    )}
                  >
                    {onlineUsers.some(u => u.user_id === onlineUser.user_id) ? (
                      <CircleDot className="h-4 w-4 text-green-500" />
                    ) : (
                      <Circle className="h-4 w-4 text-gray-400" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{onlineUser.username}</p>
                      <p className="text-sm text-muted-foreground">{onlineUser.email}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground">কোনো ইউজার পাওয়া যায়নি।</p>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Global Chat Card */}
      <Card className="w-full lg:w-3/4 flex flex-col shadow-lg border-primary/20 dark:border-primary/50">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-primary">
            <MessageSquare className="h-5 w-5" /> গ্লোবাল চ্যাট
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-0 flex flex-col">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex",
                    msg.sender_id === user?.id ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[70%] p-3 rounded-lg",
                      msg.sender_id === user?.id
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-muted text-muted-foreground rounded-bl-none"
                    )}
                  >
                    <p className="font-semibold text-sm mb-1">
                      {msg.sender_id === user?.id ? "আপনি" : msg.sender_username}
                    </p>
                    <p>{msg.content}</p>
                    <p className="text-xs opacity-75 mt-1">
                      {format(new Date(msg.created_at), 'MMM d, hh:mm a')}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          <form onSubmit={handleSendMessage} className="flex items-center p-4 border-t gap-2">
            <Input
              type="text"
              placeholder="মেসেজ লিখুন..."
              className="flex-1 border-primary/30 focus-visible:ring-primary"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={!user || !profile}
            />
            <Button type="submit" disabled={!user || !profile || !newMessage.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">মেসেজ পাঠান</span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveChatPage;