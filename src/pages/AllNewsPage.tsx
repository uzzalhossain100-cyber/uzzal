import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Newspaper as NewspaperIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const AllNewsPage: React.FC = () => {
  const navigate = useNavigate();
  const [loadingNews, setLoadingNews] = React.useState(true); // Simulate loading

  React.useEffect(() => {
    // Simulate fetching news data from a backend
    const timer = setTimeout(() => {
      setLoadingNews(false);
    }, 1500); // Simulate 1.5 seconds loading time
    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    navigate(-1); // Go back to the previous page (Bangladesh newspapers list)
  };

  return (
    <div className="flex flex-col h-full">
      <Card className="w-full flex flex-col flex-1 bg-background/80 backdrop-blur-sm shadow-lg border-primary/20 dark:border-primary/50">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <CardTitle className="text-3xl font-extrabold text-primary dark:text-primary-foreground flex items-center">
            <Button variant="ghost" onClick={handleBack} className="p-0 h-auto mr-2 text-primary dark:text-primary-foreground hover:bg-transparent hover:text-primary/80">
              <ArrowLeft className="h-6 w-6" />
            </Button>
            সব খবর
          </CardTitle>
          <CardDescription className="text-muted-foreground hidden sm:block">বিভিন্ন পত্রিকা থেকে সংগৃহীত প্রধান খবর</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-[calc(100vh-130px)] w-full p-4">
            {loadingNews ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-lg font-bold">খবর লোড হচ্ছে...</p>
                <p className="text-sm text-center mt-2">
                  এই ফিচারটির জন্য একটি ব্যাকএন্ড প্রয়োজন যা বিভিন্ন সংবাদ ওয়েবসাইট থেকে খবর সংগ্রহ করবে।
                  বর্তমানে এটি শুধুমাত্র একটি ডেমো হিসেবে কাজ করছে।
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                <div className="text-center text-muted-foreground p-4 font-bold">
                  <NewspaperIcon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <p className="text-xl font-extrabold text-foreground mb-2">খবর একত্রিত করার জন্য একটি ব্যাকএন্ড প্রয়োজন।</p>
                  <p className="text-base">
                    বিভিন্ন সংবাদ ওয়েবসাইট থেকে রিয়েল-টাইম খবর সংগ্রহ এবং প্রদর্শনের জন্য একটি সার্ভার-সাইড কম্পোনেন্ট (যেমন Node.js, Python) বা একটি ডেডিকেটেড নিউজ এগ্রিগেশন API প্রয়োজন।
                    বর্তমানে, এই ফিচারটি শুধুমাত্র একটি ডেমো হিসেবে কাজ করছে।
                  </p>
                  <p className="mt-4 text-sm text-muted-foreground">
                    আপনি যদি এই ফিচারটি সম্পূর্ণরূপে বাস্তবায়ন করতে চান, তাহলে আপনাকে একটি ব্যাকএন্ড সেটআপ করতে হবে যা ওয়েব স্ক্র্যাপিং বা নিউজ API ব্যবহার করে খবর সংগ্রহ করবে এবং সেগুলিকে আপনার ফ্রন্টএন্ডে সরবরাহ করবে।
                  </p>
                </div>
                {/* Here would be the actual list of news headlines */}
                {/* Example placeholder for news items: */}
                {/*
                <Card className="p-4 bg-background/60 backdrop-blur-sm border-primary/10">
                  <h3 className="font-bold text-lg text-foreground">একটি গুরুত্বপূর্ণ খবর শিরোনাম</h3>
                  <p className="text-sm text-muted-foreground">সংক্ষিপ্ত বিবরণ... <a href="#" className="text-primary underline">বিস্তারিত</a></p>
                </Card>
                <Card className="p-4 bg-background/60 backdrop-blur-sm border-primary/10">
                  <h3 className="font-bold text-lg text-foreground">আরেকটি ব্রেকিং নিউজ</h3>
                  <p className="text-sm text-muted-foreground">সংক্ষিপ্ত বিবরণ... <a href="#" className="text-primary underline">বিস্তারিত</a></p>
                </Card>
                */}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default AllNewsPage;