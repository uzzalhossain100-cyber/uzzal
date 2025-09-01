import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { showError, showSuccess } from '@/utils/toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ChatMessage {
  id: string;
  user_id: string;
  username: string;
  email: string;
  message_text: string;
  created_at: string;
  comments?: ChatComment[];
}

interface ChatComment {
  id: string;
  message_id: string;
  user_id: string;
  username: string;
  email: string;
  comment_text: string;
  created_at: string;
}

interface PublicChatPanelProps {
  user: any; // Supabase User object
  profile: any; // User Profile object
  isAdmin: boolean;
}

const PublicChatPanel: React.FC<PublicChatPanelProps> = ({ user, profile, isAdmin }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [postingMessage, setPostingMessage] = useState(false);
  const [commentTexts, setCommentTexts] = useState<{ [key: string]: string }>({});
  const [postingComment, setPostingComment] = useState<{ [key: string]: boolean }>({});
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const fetchMessagesAndComments = async () => {
    setLoadingMessages(true);
    const { data: messagesData, error: messagesError } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (messagesError) {
      showError("মেসেজ লোড করতে ব্যর্থ: " + messagesError.message);
      setLoadingMessages(false);
      return;
    }

    const { data: commentsData, error: commentsError } = await supabase
      .from('chat_comments')
      .select('*')
      .order('created_at', { ascending: true });

    if (commentsError) {
      showError("কমেন্ট লোড করতে ব্যর্থ: " + commentsError.message);
      setLoadingMessages(false);
      return;
    }

    const messagesWithComments = messagesData.map(msg => ({
      ...msg,
      comments: commentsData.filter(comment => comment.message_id === msg.id),
    }));

    setMessages(messagesWithComments);
    setLoadingMessages(false);
  };

  useEffect(() => {
    fetchMessagesAndComments();

    const messageChannel = supabase
      .channel('chat_messages_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_messages' }, payload => {
        if (payload.eventType === 'INSERT') {
          setMessages(prev => [...prev, { ...payload.new as ChatMessage, comments: [] }]);
        } else if (payload.eventType === 'DELETE') {
          setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
        }
      })
      .subscribe();

    const commentChannel = supabase
      .channel('chat_comments_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_comments' }, payload => {
        if (payload.eventType === 'INSERT') {
          setMessages(prev =>
            prev.map(msg =>
              msg.id === (payload.new as ChatComment).message_id
                ? { ...msg, comments: [...(msg.comments || []), payload.new as ChatComment] }
                : msg
            )
          );
        } else if (payload.eventType === 'DELETE') {
          setMessages(prev =>
            prev.map(msg => ({
              ...msg,
              comments: (msg.comments || []).filter(comment => comment.id !== payload.old.id),
            }))
          );
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messageChannel);
      supabase.removeChannel(commentChannel);
    };
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handlePostMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !profile || !user) {
      showError("মেসেজ খালি হতে পারে না বা ইউজার লগইন করা নেই।");
      return;
    }

    setPostingMessage(true);
    const { error } = await supabase.from('chat_messages').insert({
      user_id: user.id,
      username: profile.username,
      email: profile.email,
      message_text: newMessage.trim(),
    });

    if (error) {
      showError("মেসেজ পোস্ট করতে ব্যর্থ: " + error.message);
    } else {
      setNewMessage('');
      showSuccess("মেসেজ সফলভাবে পোস্ট করা হয়েছে!");
    }
    setPostingMessage(false);
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!isAdmin) {
      showError("আপনার এই মেসেজ ডিলিট করার অনুমতি নেই।");
      return;
    }
    const { error } = await supabase.from('chat_messages').delete().eq('id', messageId);
    if (error) {
      showError("মেসেজ ডিলিট করতে ব্যর্থ: " + error.message);
    } else {
      showSuccess("মেসেজ সফলভাবে ডিলিট করা হয়েছে!");
    }
  };

  const handleCommentChange = (messageId: string, value: string) => {
    setCommentTexts(prev => ({ ...prev, [messageId]: value }));
  };

  const handlePostComment = async (messageId: string) => {
    const commentText = commentTexts[messageId];
    if (!commentText?.trim() || !profile || !user) {
      showError("কমেন্ট খালি হতে পারে না বা ইউজার লগইন করা নেই।");
      return;
    }

    setPostingComment(prev => ({ ...prev, [messageId]: true }));
    const { error } = await supabase.from('chat_comments').insert({
      message_id: messageId,
      user_id: user.id,
      username: profile.username,
      email: profile.email,
      comment_text: commentText.trim(),
    });

    if (error) {
      showError("কমেন্ট পোস্ট করতে ব্যর্থ: " + error.message);
    } else {
      setCommentTexts(prev => ({ ...prev, [messageId]: '' }));
      showSuccess("কমেন্ট সফলভাবে পোস্ট করা হয়েছে!");
    }
    setPostingComment(prev => ({ ...prev, [messageId]: false }));
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!isAdmin) {
      showError("আপনার এই কমেন্ট ডিলিট করার অনুমতি নেই।");
      return;
    }
    const { error } = await supabase.from('chat_comments').delete().eq('id', commentId);
    if (error) {
      showError("কমেন্ট ডিলিট করতে ব্যর্থ: " + error.message);
    } else {
      showSuccess("কমেন্ট সফলভাবে ডিলিট করা হয়েছে!");
    }
  };

  if (loadingMessages) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg text-muted-foreground">চ্যাট লোড হচ্ছে...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground p-4">কোনো মেসেজ নেই। একটি নতুন মেসেজ পোস্ট করুন!</div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="flex flex-col gap-2 p-4 bg-accent/10 dark:bg-accent/20 rounded-lg shadow-sm border border-primary/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${msg.username}`} alt={msg.username} />
                      <AvatarFallback>{msg.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground">{msg.username}</span>
                      <span className="text-xs text-muted-foreground">{new Date(msg.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                  {isAdmin && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>মেসেজ ডিলিট করুন</DialogTitle>
                          <DialogDescription>
                            আপনি কি নিশ্চিত যে আপনি এই মেসেজটি ডিলিট করতে চান? এই অ্যাকশনটি পূর্বাবস্থায় ফেরানো যাবে না।
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => {}}>বাতিল করুন</Button>
                          <Button variant="destructive" onClick={() => handleDeleteMessage(msg.id)}>ডিলিট করুন</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
                <p className="text-foreground text-base mt-2">{msg.username}: {msg.message_text}</p>

                {/* Comments Section */}
                {msg.comments && msg.comments.length > 0 && (
                  <div className="ml-8 mt-4 space-y-3 border-l-2 border-primary/20 pl-4">
                    {msg.comments.map(comment => (
                      <div key={comment.id} className="flex items-start justify-between gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.username}`} alt={comment.username} />
                            <AvatarFallback>{comment.username.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">{comment.username}</span>
                            <span className="text-xs">{comment.comment_text}</span>
                            <span className="text-xs text-muted-foreground">{new Date(comment.created_at).toLocaleString()}</span>
                          </div>
                        </div>
                        {isAdmin && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 h-6 w-6">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>কমেন্ট ডিলিট করুন</DialogTitle>
                                <DialogDescription>
                                  আপনি কি নিশ্চিত যে আপনি এই কমেন্টটি ডিলিট করতে চান? এই অ্যাকশনটি পূর্বাবস্থায় ফেরানো যাবে না।
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => {}}>বাতিল করুন</Button>
                                <Button variant="destructive" onClick={() => handleDeleteComment(comment.id)}>ডিলিট করুন</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Comment Input */}
                <form onSubmit={(e) => { e.preventDefault(); handlePostComment(msg.id); }} className="flex gap-2 mt-3 ml-8">
                  <Input
                    placeholder="একটি কমেন্ট লিখুন..."
                    value={commentTexts[msg.id] || ''}
                    onChange={(e) => handleCommentChange(msg.id, e.target.value)}
                    className="flex-1 border-primary/30 focus-visible:ring-primary"
                    disabled={postingComment[msg.id]}
                  />
                  <Button type="submit" size="icon" disabled={postingComment[msg.id]}>
                    {postingComment[msg.id] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </form>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <form onSubmit={handlePostMessage} className="flex gap-2">
          <Input
            placeholder="আপনার মেসেজ লিখুন..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 border-primary/30 focus-visible:ring-primary"
            disabled={postingMessage}
          />
          <Button type="submit" disabled={postingMessage}>
            {postingMessage ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
            পোস্ট করুন
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PublicChatPanel;