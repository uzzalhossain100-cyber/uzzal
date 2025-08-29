import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Newspaper as NewspaperIcon } from 'lucide-react'; // Renamed Newspaper to NewspaperIcon to avoid conflict

interface Newspaper {
  name: string;
  url: string;
}

const bangladeshiNewspapers: Newspaper[] = [
  { name: "প্রথম আলো", url: "https://www.prothomalo.com/" },
  { name: "যুগান্তর", url: "https://www.jugantor.com/" },
  { name: "কালের কণ্ঠ", url: "https://www.kalerkantho.com/" },
  { name: "বাংলাদেশ প্রতিদিন", url: "https://www.bd-pratidin.com/" },
  { name: "ইত্তেফাক", url: "https://www.ittefaq.com.bd/" },
  { name: "জনকণ্ঠ", url: "https://www.dailyjanakantha.com/" },
  { name: "নয়া দিগন্ত", url: "https://www.dailynayadiganta.com/" },
  { name: "সংবাদ প্রতিদিন", url: "https://www.sangbadpratidin.in/" },
  { name: "ভোরের কাগজ", url: "https://www.bhorerkagoj.com/" },
  { name: "সমকাল", url: "https://samakal.com/" },
  { name: "মানবজমিন", url: "https://mzamin.com/" },
  { name: "আলোকিত বাংলাদেশ", url: "https://www.alokitobangladesh.com/" },
  { name: "ইনকিলাব", url: "https://www.dailyinqilab.com/" },
  { name: "আমার সংবাদ", url: "https://www.amarsangbad.com/" },
  { name: "দৈনিক সংগ্রাম", url: "https://dailysangram.com/" },
  { name: "দৈনিক আজাদী", url: "https://dainikazadi.net/" },
  { name: "দৈনিক পূর্বকোণ", url: "https://dainikpurbokone.net/" },
  { name: "দৈনিক সুপ্রভাত বাংলাদেশ", url: "https://suprobhat.com/" },
  { name: "দৈনিক কক্সবাজার", url: "https://dainikcoxsbazar.com/" },
  { name: "দৈনিক চাঁদপুর কণ্ঠ", url: "https://chandpurkantho.com/" },
];

const NewsPage: React.FC = () => {
  const [selectedNewsUrl, setSelectedNewsUrl] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleNewspaperSelect = (url: string) => {
    setSelectedNewsUrl(url);
    setIsSheetOpen(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Mobile/Tablet View: Collapsible Sheet */}
      <div className="lg:hidden w-full">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full mb-4 bg-primary text-primary-foreground hover:bg-primary/90">
              <Menu className="mr-2 h-4 w-4" /> সংবাদপত্র তালিকা
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full sm:max-w-xs p-0 bg-background">
            <CardHeader className="px-4 pt-4 pb-2 border-b">
              <CardTitle className="flex items-center gap-2 text-primary">
                <NewspaperIcon className="h-5 w-5" /> বাংলাদেশের সংবাদপত্র
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden px-0">
              <ScrollArea className="h-[calc(100vh-80px)] w-full p-4">
                <div className="grid gap-2">
                  {bangladeshiNewspapers.map((paper, index) => (
                    <React.Fragment key={paper.name}>
                      <Button
                        variant={selectedNewsUrl === paper.url ? "secondary" : "ghost"}
                        className={`w-full justify-start text-left ${selectedNewsUrl === paper.url ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-accent"}`}
                        onClick={() => handleNewspaperSelect(paper.url)}
                      >
                        {paper.name}
                      </Button>
                      {index < bangladeshiNewspapers.length - 1 && <Separator className="bg-border" />}
                    </React.Fragment>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop View: Static Card */}
      <Card className="hidden lg:flex w-full lg:w-1/4 flex-col shadow-lg border-primary/20">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-primary">
            <NewspaperIcon className="h-5 w-5" /> বাংলাদেশের সংবাদপত্র
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-[calc(100vh-200px)] w-full p-4">
            <div className="grid gap-2">
              {bangladeshiNewspapers.map((paper, index) => (
                <React.Fragment key={paper.name}>
                  <Button
                    variant={selectedNewsUrl === paper.url ? "secondary" : "ghost"}
                    className={`w-full justify-start text-left ${selectedNewsUrl === paper.url ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-accent"}`}
                    onClick={() => setSelectedNewsUrl(paper.url)}
                  >
                    {paper.name}
                  </Button>
                  {index < bangladeshiNewspapers.length - 1 && <Separator className="bg-border" />}
                </React.Fragment>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* News Reader Card */}
      <Card className="w-full lg:w-3/4 flex flex-col shadow-lg border-primary/20">
        <CardHeader className="border-b">
          <CardTitle className="text-primary">সংবাদ পাঠ</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          {selectedNewsUrl ? (
            <iframe
              src={selectedNewsUrl}
              title="Selected Newspaper"
              className="w-full h-[calc(100vh-200px)] border-0 rounded-b-lg"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-lg p-4">
              একটি সংবাদপত্র নির্বাচন করুন
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsPage;