import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

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

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      <Card className="w-full lg:w-1/3 flex flex-col">
        <CardHeader>
          <CardTitle>বাংলাদেশের সংবাদপত্র</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-[calc(100vh-200px)] w-full rounded-md border p-4">
            <div className="grid gap-2">
              {bangladeshiNewspapers.map((paper, index) => (
                <React.Fragment key={paper.name}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left"
                    onClick={() => setSelectedNewsUrl(paper.url)}
                  >
                    {paper.name}
                  </Button>
                  {index < bangladeshiNewspapers.length - 1 && <Separator />}
                </React.Fragment>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="w-full lg:w-2/3 flex flex-col">
        <CardHeader>
          <CardTitle>সংবাদ পাঠ</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          {selectedNewsUrl ? (
            <iframe
              src={selectedNewsUrl}
              title="Selected Newspaper"
              className="w-full h-[calc(100vh-200px)] border-0"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms" // Added sandbox for security
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              একটি সংবাদপত্র নির্বাচন করুন
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsPage;