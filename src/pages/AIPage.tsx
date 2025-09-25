import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Sparkles, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { showError } from '@/utils/toast';

interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
}

const AIPage: React.FC = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const genAI = useRef<GoogleGenerativeAI | null>(null);
  const model = useRef<any>(null); // To store the generative model

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      showError("Gemini API Key not found in .env file. Please set VITE_GEMINI_API_KEY.");
      return;
    }
    genAI.current = new GoogleGenerativeAI(apiKey);
    model.current = genAI.current.getGenerativeModel({ model: "gemini-pro" });
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    if (!model.current) {
      showError("এআই মডেল লোড হয়নি। অনুগ্রহ করে API কী চেক করুন।");
      return;
    }

    const userMessage: Message = { id: messages.length + 1, sender: 'user', text: question.trim() };
    setMessages(prev => [...prev, userMessage]);
    setQuestion('');
    setIsLoading(true);

    try {
      const result = await model.current.generateContent(userMessage.text);
      const response = await result.response;
      const aiResponseText = response.text();

      const aiMessage: Message = { id: messages.length + 2, sender: 'ai', text: aiResponseText };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      console.error("Error calling Gemini API:", error);
      showError("এআই উত্তর দিতে ব্যর্থ হয়েছে: " + (error.message || "অজানা ত্রুটি।"));
      const errorMessage: Message = { id: messages.length + 2, sender: 'ai', text: "দুঃখিত, আমি আপনার প্রশ্নের উত্তর দিতে পারিনি। অনুগ্রহ করে আবার চেষ্টা করুন।" };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <Card className="w-full flex flex-col flex-1 bg-background/80 backdrop-blur-sm shadow-lg border-primary/20 dark:border-primary/50">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <CardTitle className="text-3xl font-extrabold text-primary dark:text-primary-foreground flex items-center">
            <Button variant="ghost" onClick={handleBack} className="p-0 h-auto mr-2 text-primary dark:text-primary-foreground hover:bg-transparent hover:text-primary/80">
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <Sparkles className="h-7 w-7 mr-2" /> এআই সহকারী
          </CardTitle>
          <CardDescription className="text-muted-foreground hidden sm:block">আপনার যেকোনো প্রশ্ন জিজ্ঞাসা করুন</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-0 flex flex-col">
          <ScrollArea className="flex-1 w-full p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground p-4 font-bold">কোনো প্রশ্ন জিজ্ঞাসা করা হয়নি।</div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex items-start gap-3",
                      msg.sender === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    {msg.sender === 'ai' && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/public/placeholder.svg" alt="AI" />
                        <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        "max-w-[70%] p-3 rounded-lg shadow-sm",
                        msg.sender === 'user'
                          ? "bg-primary text-primary-foreground rounded-br-none"
                          : "bg-accent text-accent-foreground rounded-bl-none"
                      )}
                    >
                      <p className="font-semibold">{msg.sender === 'user' ? 'আপনি:' : 'এআই:'} {msg.text}</p>
                    </div>
                    {msg.sender === 'user' && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                        <AvatarFallback className="bg-secondary text-secondary-foreground">ইউ</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex items-center justify-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/public/placeholder.svg" alt="AI" />
                    <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                  </Avatar>
                  <div className="max-w-[70%] p-3 rounded-lg shadow-sm bg-accent text-accent-foreground rounded-bl-none flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span className="font-semibold">এআই উত্তর দিচ্ছে...</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="p-4 border-t bg-background/80 backdrop-blur-sm">
            <form onSubmit={handleAskQuestion} className="flex gap-2">
              <Input
                placeholder="আপনার প্রশ্ন জিজ্ঞাসা করুন..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="flex-1 border-primary/30 focus-visible:ring-primary"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading} className="font-bold">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                জিজ্ঞাসা করুন
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIPage;