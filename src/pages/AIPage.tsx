import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Sparkles, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  const handleBack = () => {
    navigate(-1);
  };

  const generateMockAIResponse = (userQuestion: string): string => {
    const lowerCaseQuestion = userQuestion.toLowerCase();
    if (lowerCaseQuestion.includes("কেমন আছো")) {
      return "আমি একটি এআই, আমার কোনো অনুভূতি নেই, তবে আমি আপনাকে সাহায্য করতে প্রস্তুত!";
    } else if (lowerCaseQuestion.includes("তোমার নাম কি")) {
      return "আমার কোনো নাম নেই। আমি একটি এআই সহকারী।";
    } else if (lowerCaseQuestion.includes("বাংলাদেশ")) {
      return "বাংলাদেশ দক্ষিণ এশিয়ার একটি জনবহুল দেশ, যার রাজধানী ঢাকা। এটি তার সমৃদ্ধ সংস্কৃতি এবং প্রাকৃতিক সৌন্দর্যের জন্য পরিচিত।";
    } else if (lowerCaseQuestion.includes("সময়")) {
      return `বর্তমান সময় হলো: ${new Date().toLocaleTimeString('bn-BD')}`;
    } else if (lowerCaseQuestion.includes("তারিখ")) {
      return `আজকের তারিখ হলো: ${new Date().toLocaleDateString('bn-BD')}`;
    } else if (lowerCaseQuestion.includes("ধন্যবাদ")) {
      return "আপনাকে স্বাগতম! আরও কিছু জানতে চান?";
    } else if (lowerCaseQuestion.includes("হ্যালো") || lowerCaseQuestion.includes("হাই")) {
      return "হ্যালো! আমি কিভাবে আপনাকে সাহায্য করতে পারি?";
    } else if (lowerCaseQuestion.includes("আবহাওয়া")) {
      return "আমি আবহাওয়ার তথ্য সরাসরি দিতে পারি না, তবে আপনি আবহাওয়ার ওয়েবসাইট যেমন weather.com দেখতে পারেন।";
    } else if (lowerCaseQuestion.includes("গণিত")) {
      return "আমি গণিত সমস্যা সমাধানে সাহায্য করতে পারি। আপনার প্রশ্নটি বলুন।";
    } else if (lowerCaseQuestion.includes("ইতিহাস")) {
      return "ইতিহাস একটি বিশাল বিষয়! আপনি কোন নির্দিষ্ট বিষয় বা সময়কাল সম্পর্কে জানতে চান?";
    } else if (lowerCaseQuestion.includes("বিজ্ঞান")) {
      return "বিজ্ঞান সম্পর্কে জানতে চান? পদার্থবিজ্ঞান, রসায়ন, জীববিজ্ঞান - কোন বিষয়ে আপনার আগ্রহ?";
    } else if (lowerCaseQuestion.includes("কম্পিউটার")) {
      return "কম্পিউটার বিজ্ঞান এবং প্রযুক্তি সম্পর্কে আমার কাছে অনেক তথ্য আছে। আপনার নির্দিষ্ট প্রশ্নটি কী?";
    } else if (lowerCaseQuestion.includes("খবর")) {
      return "আমি রিয়েল-টাইম খবর দিতে পারি না, তবে আপনি প্রথম আলো, যুগান্তর বা বিবিসি বাংলার মতো সংবাদ ওয়েবসাইট দেখতে পারেন।";
    } else if (lowerCaseQuestion.includes("গান")) {
      return "আমি গান বাজাতে পারি না, তবে আপনি ইউটিউব বা স্পটিফাইয়ের মতো প্ল্যাটফর্মে গান শুনতে পারেন।";
    } else if (lowerCaseQuestion.includes("ছবি")) {
      return "আমি ছবি তৈরি করতে পারি না, তবে আপনি Unsplash বা Pixabay-এর মতো সাইটে ছবি খুঁজে পেতে পারেন।";
    } else if (lowerCaseQuestion.includes("বই")) {
      return "বই সম্পর্কে জানতে চান? কোন ধরনের বই বা লেখক সম্পর্কে আপনার আগ্রহ?";
    } else if (lowerCaseQuestion.includes("খেলা")) {
      return "কোন খেলা সম্পর্কে জানতে চান? ক্রিকেট, ফুটবল, বা অন্য কিছু?";
    } else if (lowerCaseQuestion.includes("রান্না")) {
      return "রান্নার রেসিপি বা টিপস জানতে চান? আমি সাহায্য করতে পারি!";
    } else if (lowerCaseQuestion.includes("ভ্রমণ")) {
      return "ভ্রমণ সম্পর্কে জানতে চান? কোন দেশ বা স্থান সম্পর্কে আপনার আগ্রহ?";
    } else if (lowerCaseQuestion.includes("স্বাস্থ্য")) {
      return "স্বাস্থ্য সম্পর্কিত তথ্য জানতে চান? মনে রাখবেন, আমি একজন এআই, চিকিৎসার পরামর্শ দিতে পারি না।";
    } else if (lowerCaseQuestion.includes("ব্যবসা")) {
      return "ব্যবসা বা উদ্যোক্তা সম্পর্কে জানতে চান? আমি আপনাকে তথ্য দিতে পারি।";
    } else if (lowerCaseQuestion.includes("শিক্ষা")) {
      return "শিক্ষা সম্পর্কিত তথ্য জানতে চান? আমি বিভিন্ন শিক্ষামূলক ওয়েবসাইট বা প্ল্যাটফর্ম সম্পর্কে বলতে পারি।";
    } else if (lowerCaseQuestion.includes("বিনোদন")) {
      return "বিনোদন সম্পর্কে জানতে চান? চলচ্চিত্র, সঙ্গীত, বা অন্য কিছু?";
    } else if (lowerCaseQuestion.includes("সামাজিক মাধ্যম")) {
      return "সামাজিক মাধ্যম সম্পর্কে জানতে চান? ফেসবুক, টুইটার, ইনস্টাগ্রাম - কোন প্ল্যাটফর্ম সম্পর্কে আপনার আগ্রহ?";
    } else if (lowerCaseQuestion.includes("সরকারি সেবা")) {
      return "বাংলাদেশের সরকারি সেবা সম্পর্কে জানতে চান? আমি আপনাকে জাতীয় তথ্য বাতায়ন বা ই-সেবা পোর্টালের মতো ওয়েবসাইট সম্পর্কে বলতে পারি।";
    } else if (lowerCaseQuestion.includes("যোগাযোগ")) {
      return "যোগাযোগের বিভিন্ন মাধ্যম সম্পর্কে জানতে চান? ইমেল, মেসেজিং অ্যাপস, ভিডিও কলিং - কোন বিষয়ে আপনার আগ্রহ?";
    } else if (lowerCaseQuestion.includes("ইউটিলিটি")) {
      return "বিভিন্ন ইউটিলিটি টুলস যেমন গুগল ম্যাপস, গুগল ট্রান্সলেট, ক্যালকুলেটর ইত্যাদি সম্পর্কে জানতে চান?";
    } else if (lowerCaseQuestion.includes("ফটোগ্রাফি")) {
      return "ফটোগ্রাফি বা ডিজাইন সম্পর্কে জানতে চান? আমি আপনাকে বিভিন্ন রিসোর্স বা টুলস সম্পর্কে বলতে পারি।";
    } else if (lowerCaseQuestion.includes("প্রযুক্তি")) {
      return "প্রযুক্তি সম্পর্কে জানতে চান? নতুন গ্যাজেট, সফটওয়্যার, বা প্রোগ্রামিং - কোন বিষয়ে আপনার আগ্রহ?";
    } else if (lowerCaseQuestion.includes("ব্লগ")) {
      return "ব্লগ বা ফোরাম সম্পর্কে জানতে চান? মিডিয়াম, ওয়ার্ডপ্রেস, রেডিট - কোন প্ল্যাটফর্ম সম্পর্কে আপনার আগ্রহ?";
    }
    return "আমি আপনার প্রশ্নটি বুঝতে পারিনি। আপনি কি অন্যভাবে জিজ্ঞাসা করতে পারেন?";
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMessage: Message = { id: messages.length + 1, sender: 'user', text: question.trim() };
    setMessages(prev => [...prev, userMessage]);
    setQuestion('');
    setIsLoading(true);

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1500));

    const aiResponseText = generateMockAIResponse(userMessage.text);
    const aiMessage: Message = { id: messages.length + 2, sender: 'ai', text: aiResponseText };
    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
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