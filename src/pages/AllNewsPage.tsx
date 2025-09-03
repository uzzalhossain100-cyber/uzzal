import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Newspaper as NewspaperIcon, Loader2, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner'; // Import toast for messages

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string; // Placeholder for actual news URL
}

// Dummy news data for demonstration
const dummyNews: NewsItem[] = [
  {
    id: '1',
    title: 'দেশের অর্থনীতিতে নতুন দিগন্ত: রপ্তানি আয়ে রেকর্ড বৃদ্ধি',
    summary: 'সাম্প্রতিক মাসগুলোতে বাংলাদেশের রপ্তানি আয় উল্লেখযোগ্যভাবে বৃদ্ধি পেয়েছে, যা দেশের অর্থনীতিতে নতুন আশার সঞ্চার করেছে। পোশাক শিল্প এবং অন্যান্য খাত থেকে আসা ইতিবাচক ফলাফল এই বৃদ্ধিতে সহায়তা করেছে।',
    source: 'প্রথম আলো',
    url: 'https://www.prothomalo.com/economy/trade/example-news-1',
  },
  {
    id: '2',
    title: 'শিক্ষাব্যবস্থায় ডিজিটাল রূপান্তর: নতুন কারিকুলামের প্রভাব',
    summary: 'জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (এনসিটিবি) কর্তৃক প্রবর্তিত নতুন কারিকুলাম দেশের শিক্ষাব্যবস্থায় এক যুগান্তকারী পরিবর্তন আনছে। শিক্ষার্থীদের মধ্যে সৃজনশীলতা ও ব্যবহারিক জ্ঞান বৃদ্ধিতে এটি সহায়ক হবে বলে আশা করা হচ্ছে।',
    source: 'যুগান্তর',
    url: 'https://www.jugantor.com/education/example-news-2',
  },
  {
    id: '3',
    title: 'কৃষি খাতে আধুনিক প্রযুক্তির ব্যবহার: কৃষকদের মুখে হাসি',
    summary: 'বাংলাদেশের কৃষি খাতে আধুনিক প্রযুক্তির ব্যবহার বাড়ছে, যা কৃষকদের উৎপাদনশীলতা বৃদ্ধিতে সহায়তা করছে। স্মার্ট কৃষি পদ্ধতি এবং উন্নত বীজ ব্যবহারের ফলে ফলন বৃদ্ধি পাচ্ছে।',
    source: 'কালের কণ্ঠ',
    url: 'https://www.kalerkantho.com/agriculture/example-news-3',
  },
  {
    id: '4',
    title: 'স্বাস্থ্যসেবায় নতুন উদ্যোগ: কমিউনিটি ক্লিনিকের ভূমিকা',
    summary: 'সরকারের নতুন স্বাস্থ্যসেবা উদ্যোগের অংশ হিসেবে কমিউনিটি ক্লিনিকগুলো গ্রামীণ জনগোষ্ঠীর দোরগোড়ায় স্বাস্থ্যসেবা পৌঁছে দিচ্ছে। এতে প্রাথমিক স্বাস্থ্যসেবার মান উন্নত হচ্ছে।',
    source: 'বাংলাদেশ প্রতিদিন',
    url: 'https://www.bd-pratidin.com/health/example-news-4',
  },
  {
    id: '5',
    title: 'পর্যটন শিল্পে সম্ভাবনা: নতুন গন্তব্য উন্মোচন',
    summary: 'বাংলাদেশের পর্যটন শিল্পে নতুন সম্ভাবনা দেখা দিয়েছে। সরকার নতুন নতুন পর্যটন গন্তব্য উন্মোচন করছে এবং অবকাঠামোগত উন্নয়নে জোর দিচ্ছে, যা বিদেশি পর্যটকদের আকর্ষণ করবে।',
    source: 'ইত্তেফাক',
    url: 'https://www.ittefaq.com.bd/tourism/example-news-5',
  },
  {
    id: '6',
    title: 'ডিজিটাল নিরাপত্তা আইন: বিতর্ক ও সমাধান',
    summary: 'ডিজিটাল নিরাপত্তা আইন নিয়ে চলমান বিতর্ক এবং এর সমাধানের উপায় নিয়ে আলোচনা চলছে। সরকার এবং সংশ্লিষ্ট পক্ষগুলো একটি গ্রহণযোগ্য সমাধানে পৌঁছানোর চেষ্টা করছে।',
    source: 'জনকণ্ঠ',
    url: 'https://www.dailyjanakantha.com/law/example-news-6',
  },
  {
    id: '7',
    title: 'জলবায়ু পরিবর্তন মোকাবিলায় বাংলাদেশের ভূমিকা',
    summary: 'জলবায়ু পরিবর্তনের বিরূপ প্রভাব মোকাবিলায় বাংলাদেশ আন্তর্জাতিক অঙ্গনে গুরুত্বপূর্ণ ভূমিকা পালন করছে। নবায়নযোগ্য শক্তি এবং পরিবেশবান্ধব প্রযুক্তির ব্যবহারে জোর দেওয়া হচ্ছে।',
    source: 'নয়া দিগন্ত',
    url: 'https://www.dailynayadiganta.com/environment/example-news-7',
  },
  {
    id: '8',
    title: 'যানজট নিরসনে নতুন পরিকল্পনা: ঢাকার পরিবহন ব্যবস্থা',
    summary: 'ঢাকার যানজট নিরসনে সরকার নতুন নতুন পরিকল্পনা গ্রহণ করছে। মেট্রোরেল এবং এলিভেটেড এক্সপ্রেসওয়ের মতো প্রকল্পগুলো শহরের পরিবহন ব্যবস্থায় ইতিবাচক প্রভাব ফেলছে।',
    source: 'সমকাল',
    url: 'https://samakal.com/city/example-news-8',
  },
  {
    id: '9',
    title: 'সংস্কৃতি ও ঐতিহ্য সংরক্ষণ: নতুন প্রজন্মের আগ্রহ',
    summary: 'বাংলাদেশের সমৃদ্ধ সংস্কৃতি ও ঐতিহ্য সংরক্ষণে নতুন প্রজন্ম আগ্রহ দেখাচ্ছে। বিভিন্ন সাংস্কৃতিক অনুষ্ঠান এবং ঐতিহ্যবাহী উৎসবগুলো তরুণদের মধ্যে জনপ্রিয়তা লাভ করছে।',
    source: 'মানবজমিন',
    url: 'https://mzamin.com/culture/example-news-9',
  },
  {
    id: '10',
    title: 'তথ্যপ্রযুক্তি খাতে বিনিয়োগ বৃদ্ধি: কর্মসংস্থানের সুযোগ',
    summary: 'বাংলাদেশের তথ্যপ্রযুক্তি খাতে বিদেশি বিনিয়োগ বাড়ছে, যা নতুন কর্মসংস্থানের সুযোগ তৈরি করছে। ফ্রিল্যান্সিং এবং আউটসোর্সিং সেক্টরও দেশের অর্থনীতিতে অবদান রাখছে।',
    source: 'আলোকিত বাংলাদেশ',
    url: 'https://www.alokitobangladesh.com/it/example-news-10',
  },
];

const AllNewsPage: React.FC = () => {
  const navigate = useNavigate();
  const [loadingNews, setLoadingNews] = React.useState(true); // Simulate loading
  const [selectedNews, setSelectedNews] = React.useState<NewsItem | null>(null); // State to hold selected news for detail view

  React.useEffect(() => {
    // Simulate fetching news data from a backend
    const timer = setTimeout(() => {
      setLoadingNews(false);
    }, 1500); // Simulate 1.5 seconds loading time
    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    if (selectedNews) {
      setSelectedNews(null); // Go back to news headlines list
    } else {
      navigate(-1); // Go back to the previous page (Bangladesh newspapers list)
    }
  };

  const handleViewDetails = (newsItem: NewsItem) => {
    setSelectedNews(newsItem);
    // In a real application, this would fetch full news content from a backend
    // For now, we'll just show the summary as detail and a toast message.
    toast.info(`'${newsItem.title}' এর বিস্তারিত খবর লোড হচ্ছে। (এই ফিচারটির জন্য একটি ব্যাকএন্ড প্রয়োজন)`);
  };

  const handleOpenOriginalSource = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col h-full">
      <Card className="w-full flex flex-col flex-1 bg-background/80 backdrop-blur-sm shadow-lg border-primary/20 dark:border-primary/50">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <CardTitle className="text-3xl font-extrabold text-primary dark:text-primary-foreground flex items-center">
            <Button variant="ghost" onClick={handleBack} className="p-0 h-auto mr-2 text-primary dark:text-primary-foreground hover:bg-transparent hover:text-primary/80">
              <ArrowLeft className="h-6 w-6" />
            </Button>
            {selectedNews ? 'খবরের বিস্তারিত' : 'সব খবর'}
          </CardTitle>
          <CardDescription className="text-muted-foreground hidden sm:block">
            {selectedNews ? 'নির্বাচিত খবরের বিস্তারিত বিবরণ' : 'বিভিন্ন পত্রিকা থেকে সংগৃহীত প্রধান খবর'}
          </CardDescription>
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
            ) : selectedNews ? (
              // Display detailed news view
              <div className="space-y-4">
                <h2 className="text-3xl font-extrabold text-foreground">{selectedNews.title}</h2>
                <p className="text-sm text-muted-foreground">উৎস: {selectedNews.source}</p>
                <p className="text-base text-foreground leading-relaxed">{selectedNews.summary}</p>
                <p className="text-base text-foreground leading-relaxed">
                  এটি একটি ডেমো বিস্তারিত খবর। সম্পূর্ণ খবর দেখতে, আপনাকে একটি ব্যাকএন্ড সিস্টেম তৈরি করতে হবে যা প্রতিটি খবরের জন্য সম্পূর্ণ বিষয়বস্তু সরবরাহ করবে।
                </p>
                <Button
                  variant="outline"
                  onClick={() => handleOpenOriginalSource(selectedNews.url)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
                >
                  <ExternalLink className="h-4 w-4 mr-2" /> মূল উৎস দেখুন
                </Button>
              </div>
            ) : (
              // Display news headlines list
              <div className="grid gap-4">
                <div className="text-center text-muted-foreground p-4 font-bold">
                  <NewspaperIcon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <p className="text-xl font-extrabold text-foreground mb-2">খবর একত্রিত করার জন্য একটি ব্যাকএন্ড প্রয়োজন।</p>
                  <p className="text-base">
                    বিভিন্ন সংবাদ ওয়েবসাইট থেকে রিয়েল-টাইম খবর সংগ্রহ এবং প্রদর্শনের জন্য একটি সার্ভার-সাইড কম্পোনেন্ট (যেমন Node.js, Python) বা একটি ডেডিকেটেড নিউজ এগ্রিগেশন API প্রয়োজন।
                    বর্তমানে, নিচের খবরগুলো শুধুমাত্র একটি ডেমো হিসেবে কাজ করছে।
                  </p>
                  <p className="mt-4 text-sm text-muted-foreground">
                    আপনি যদি এই ফিচারটি সম্পূর্ণরূপে বাস্তবায়ন করতে চান, তাহলে আপনাকে একটি ব্যাকএন্ড সেটআপ করতে হবে যা ওয়েব স্ক্র্যাপিং বা নিউজ API ব্যবহার করে খবর সংগ্রহ করবে এবং সেগুলিকে আপনার ফ্রন্টএন্ডে সরবরাহ করবে।
                  </p>
                </div>
                {dummyNews.map((newsItem) => (
                  <Card key={newsItem.id} className="p-4 bg-background/60 backdrop-blur-sm border-primary/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-extrabold text-lg text-foreground mb-1">{newsItem.title}</h3>
                      <p className="text-sm text-muted-foreground">উৎস: {newsItem.source}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(newsItem)}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold w-full sm:w-auto"
                    >
                      বিস্তারিত দেখুন
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default AllNewsPage;