import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Globe, Tv, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface TVChannel {
  name: string;
  url: string;
}

interface Country {
  name: string;
  channels: TVChannel[];
}

const countries: Country[] = [
  {
    name: "বাংলাদেশ",
    channels: [
      { name: "বাংলাদেশ টেলিভিশন (বিটিভি)", url: "https://www.btvlive.gov.bd/channel/BTV" },
      { name: "সংসদ বাংলাদেশ টেলিভিশন", url: "https://sansad.btv.gov.bd/" },
      { name: "এটিএন বাংলা", url: "https://atnbangla.tv/" },
      { name: "চ্যানেল আই", url: "https://www.channelionline.com/" },
      { name: "একুশে টেলিভিশন", url: "https://ekusheytv.com/" },
      { name: "এনটিভি", url: "https://www.ntvbd.com/" },
      { name: "আরটিভি", url: "https://www.rtvonline.com/" },
      { name: "বৈশাখী টেলিভিশন", url: "https://www.boishakhitv.com/" },
      { name: "বাংলাভিশন", url: "https://www.banglavision.tv/" },
      { name: "দেশ টিভি", url: "https://www.desh.tv/" },
      { name: "মাইটিভি", url: "https://www.mytvbd.tv/" },
      { name: "মোহনা টেলিভিশন", url: "https://mohonatv.com/" },
      { name: "মাছরাঙা টেলিভিশন", url: "https://www.maasranga.tv/" },
      { name: "চ্যানেল নাইন", url: "https://www.channelninebd.tv/" },
      { name: "এটিএন নিউজ", url: "https://atnnewstv.com/" },
      { name: "সময় টিভি", url: "https://www.somoynews.tv/" },
      { name: "চ্যানেল টুয়েন্টিফোর", url: "https://www.channel24bd.tv/" },
      { name: "জিটিভি (গাজী টেলিভিশন)", url: "https://www.gtvbd.com/" },
      { name: "একাত্তর টিভি", url: "https://www.ekattor.tv/" },
      { name: "এশিয়ান টিভি", url: "https://www.asiantv.com.bd/" },
      { name: "এসএ টিভি", url: "https://satv.tv/" },
      { name: "দীপ্ত টিভি", url: "https://www.deeptotv.net/" },
      { name: "নিউজ টুয়েন্টিফোর", url: "https://www.news24bd.tv/" },
      { name: "ডিবিসি নিউজ", url: "https://www.dbcnews.tv/" },
      { name: "যমুনা টেলিভিশন", url: "https://www.jamuna.tv/" },
      { name: "নাগরিক টিভি", url: "https://nagorik.com/" },
      { name: "দুরন্ত টিভি (শিশুদের জন্য)", url: "https://duronto.tv/" },
      { name: "গান বাংলা", url: "https://gaanbangla.tv/" },
    ],
  },
  {
    name: "ভারত",
    channels: [
      { name: "আজ তাক", url: "https://www.aajtak.in/livetv" },
      { name: "এনডিটিভি ইন্ডিয়া", url: "https://www.ndtv.com/video/live/channel/ndtv-india" },
      { name: "রিপাবলিক টিভি", url: "https://www.republicworld.com/live-tv.html" },
      { name: "জি নিউজ", url: "https://zeenews.india.com/hindi/live-tv" },
      { name: "স্টার প্লাস", url: "https://www.hotstar.com/in/channels/star-plus/1260000001" }, // Requires Hotstar subscription
      { name: "সনি সাব", url: "https://www.sonyliv.com/channels/sab-tv-1700000001" }, // Requires SonyLIV subscription
      { name: "কালারস টিভি", url: "https://www.voot.com/live-tv/colors-hindi/1000001" }, // Requires Voot subscription
      { name: "ইটিভি ভারত", url: "https://www.etvbharat.com/bengali/west-bengal/live-tv" },
      { name: "এবিপি আনন্দ", url: "https://bengali.abplive.com/live-tv" },
      { name: "নিউজ ১৮ বাংলা", url: "https://bengali.news18.com/live-tv/" },
    ],
  },
  {
    name: "যুক্তরাষ্ট্র",
    channels: [
      { name: "সিএনএন", url: "https://edition.cnn.com/live" },
      { name: "ফক্স নিউজ", url: "https://video.foxnews.com/v/5990796069001" },
      { name: "এমএসএনবিসি", url: "https://www.msnbc.com/live" },
      { name: "এবিসি নিউজ", url: "https://abcnews.go.com/live" },
      { name: "সিবিএস নিউজ", url: "https://www.cbsnews.com/live/" },
    ],
  },
  {
    name: "যুক্তরাজ্য",
    channels: [
      { name: "বিবিসি নিউজ", url: "https://www.bbc.co.uk/news/live/uk-67000000" },
      { name: "স্কাই নিউজ", url: "https://news.sky.com/watch-live" },
      { name: "আইটিভি", url: "https://www.itv.com/hub/itv" },
      { name: "চ্যানেল ৪", url: "https://www.channel4.com/live" },
      { name: "চ্যানেল ৫", url: "https://www.channel5.com/live" },
    ],
  },
  {
    name: "কানাডা",
    channels: [
      { name: "সিবিসি নিউজ", url: "https://www.cbc.ca/news/canada/live" },
      { name: "সিটিভি নিউজ", url: "https://www.ctvnews.ca/live" },
      { name: "গ্লোবাল নিউজ", url: "https://globalnews.ca/live/" },
    ],
  },
  {
    name: "অস্ট্রেলিয়া",
    channels: [
      { name: "এবিসি নিউজ অস্ট্রেলিয়া", url: "https://www.abc.net.au/news/live/news-channel" },
      { name: "সেভেন নেটওয়ার্ক", url: "https://7plus.com.au/live-tv" },
      { name: "নাইন নেটওয়ার্ক", url: "https://www.9now.com.au/live-tv" },
    ],
  },
  {
    name: "জার্মানি",
    channels: [
      { name: "ডয়চে ভেলে (DW)", url: "https://www.dw.com/en/live-tv/s-100825" },
      { name: "এআরডি", url: "https://www.ardmediathek.de/live" },
      { name: "জেডডিএফ", url: "https://www.zdf.de/live-tv" },
    ],
  },
  {
    name: "ফ্রান্স",
    channels: [
      { name: "ফ্রান্স ২৪", url: "https://www.france24.com/en/live" },
      { name: "টিএফ১", url: "https://www.tf1.fr/tf1/direct" },
      { name: "ফ্রান্স ২", url: "https://www.france.tv/france-2/direct.html" },
    ],
  },
  {
    name: "জাপান",
    channels: [
      { name: "এনএইচকে ওয়ার্ল্ড-জাপান", url: "https://www3.nhk.or.jp/nhkworld/en/live/" },
      { name: "ফুজি টিভি", url: "https://www.fujitv.co.jp/en/fujitv/" }, // No direct live stream link easily available
    ],
  },
  {
    name: "দক্ষিণ কোরিয়া",
    channels: [
      { name: "কেবিএস ওয়ার্ল্ড", url: "https://www.youtube.com/c/kbsworld/live" },
      { name: "এমবিসি", url: "https://www.mbc.co.kr/onair/tv" }, // Requires login/subscription
    ],
  },
];

const LiveTVPage: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedChannelUrl, setSelectedChannelUrl] = useState<string | null>(null);
  const [isCountrySheetOpen, setIsCountrySheetOpen] = useState(false);
  const [isChannelSheetOpen, setIsChannelSheetOpen] = useState(false);
  const [showDesktopCountryList, setShowDesktopCountryList] = useState(true);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setSelectedChannelUrl(null);
    setIsCountrySheetOpen(false);
    setIsChannelSheetOpen(true);
    setShowDesktopCountryList(false);
  };

  const handleChannelSelect = (channel: TVChannel) => {
    setSelectedChannelUrl(channel.url);
    setIsChannelSheetOpen(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Mobile/Tablet View: Collapsible Sheets */}
      <div className="lg:hidden w-full flex flex-col sm:flex-row gap-4 mb-4">
        {!selectedCountry ? (
          <Sheet open={isCountrySheetOpen} onOpenChange={setIsCountrySheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Menu className="mr-2 h-4 w-4" /> দেশ নির্বাচন করুন
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:max-w-xs p-0 bg-background">
              <CardHeader className="px-4 pt-4 pb-2 border-b">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Globe className="h-5 w-5" /> দেশ নির্বাচন করুন
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden px-0">
                <ScrollArea className="h-[calc(100vh-80px)] w-full p-4">
                  <div className="grid gap-2">
                    {countries.map((country, index) => (
                      <React.Fragment key={country.name}>
                        <Button
                          variant={selectedCountry?.name === country.name ? "secondary" : "ghost"}
                          className={`w-full justify-start text-left ${selectedCountry?.name === country.name ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-accent"}`}
                          onClick={() => handleCountrySelect(country)}
                        >
                          {country.name}
                        </Button>
                        {index < countries.length - 1 && <Separator className="bg-border" />}
                      </React.Fragment>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </SheetContent>
          </Sheet>
        ) : (
          <>
            <Sheet open={isChannelSheetOpen} onOpenChange={setIsChannelSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full sm:w-1/2 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Menu className="mr-2 h-4 w-4" /> চ্যানেল তালিকা
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:max-w-xs p-0 bg-background">
                <CardHeader className="px-4 pt-4 pb-2 border-b">
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Tv className="h-5 w-5" /> চ্যানেল তালিকা
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden px-0">
                  {selectedCountry ? (
                    <ScrollArea className="h-[calc(100vh-80px)] w-full p-4">
                      <div className="grid gap-2">
                        {selectedCountry.channels.map((channel, index) => (
                          <React.Fragment key={channel.name}>
                            <Button
                              variant={selectedChannelUrl === channel.url ? "secondary" : "ghost"}
                              className={`w-full justify-start text-left ${selectedChannelUrl === channel.url ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-accent"}`}
                              onClick={() => handleChannelSelect(channel)}
                            >
                              {channel.name}
                            </Button>
                            {index < selectedCountry.channels.length - 1 && <Separator className="bg-border" />}
                          </React.Fragment>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground p-4">
                      একটি দেশ নির্বাচন করুন
                    </div>
                  )}
                </CardContent>
              </SheetContent>
            </Sheet>
            <Button
              variant="outline"
              className="w-full sm:w-1/2 bg-secondary text-secondary-foreground hover:bg-secondary/90"
              onClick={() => setIsCountrySheetOpen(true)}
            >
              <Globe className="mr-2 h-4 w-4" /> দেশ নির্বাচন করুন
            </Button>
          </>
        )}
      </div>

      {/* Desktop View: Static Cards */}
      {(!selectedCountry || showDesktopCountryList) && (
        <Card className="hidden lg:flex w-full lg:w-1/4 flex-col shadow-lg border-primary/20">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-primary">
              <Globe className="h-5 w-5" /> দেশ নির্বাচন করুন
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            <ScrollArea className="h-[calc(100vh-200px)] w-full p-4">
              <div className="grid gap-2">
                {countries.map((country, index) => (
                  <React.Fragment key={country.name}>
                    <Button
                      variant={selectedCountry?.name === country.name ? "secondary" : "ghost"}
                      className={`w-full justify-start text-left ${selectedCountry?.name === country.name ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-accent"}`}
                      onClick={() => handleCountrySelect(country)}
                    >
                      {country.name}
                    </Button>
                    {index < countries.length - 1 && <Separator className="bg-border" />}
                  </React.Fragment>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {selectedCountry && (
        <Card className="hidden lg:flex w-full lg:w-1/4 flex-col shadow-lg border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <CardTitle className="flex items-center gap-2 text-primary">
              <Tv className="h-5 w-5" /> চ্যানেল তালিকা
            </CardTitle>
            {!showDesktopCountryList && (
              <Button variant="outline" size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90" onClick={() => setShowDesktopCountryList(true)}>
                <Globe className="mr-2 h-4 w-4" /> দেশ নির্বাচন করুন
              </Button>
            )}
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            {selectedCountry ? (
              <ScrollArea className="h-[calc(100vh-200px)] w-full p-4">
                <div className="grid gap-2">
                  {selectedCountry.channels.map((channel, index) => (
                    <React.Fragment key={channel.name}>
                      <Button
                        variant={selectedChannelUrl === channel.url ? "secondary" : "ghost"}
                        className={`w-full justify-start text-left ${selectedChannelUrl === channel.url ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-accent"}`}
                        onClick={() => handleChannelSelect(channel)}
                      >
                        {channel.name}
                      </Button>
                      {index < selectedCountry.channels.length - 1 && <Separator className="bg-border" />}
                    </React.Fragment>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-lg p-4">
                একটি দেশ নির্বাচন করুন
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Live TV Player Card */}
      <Card className="w-full lg:w-2/4 flex flex-col shadow-lg border-primary/20">
        <CardHeader className="border-b">
          <CardTitle className="text-primary">{selectedChannelUrl ? "লাইভ স্ট্রিম" : "লাইভ টিভি প্লেয়ার"}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          {selectedChannelUrl ? (
            <iframe
              src={selectedChannelUrl}
              title="Live TV Stream"
              className="w-full h-[calc(100vh-200px)] border-0 rounded-b-lg"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              allow="autoplay; fullscreen; picture-in-picture"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-lg p-4">
              একটি চ্যানেল নির্বাচন করুন
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveTVPage;