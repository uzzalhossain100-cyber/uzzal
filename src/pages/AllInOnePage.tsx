import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';

interface PlatformItem {
  name: string;
  url: string;
}

interface Category {
  name: string;
  items: PlatformItem[];
}

const categories: Category[] = [
  {
    name: "সোশ্যাল মিডিয়া এবং ভিডিও প্ল্যাটফর্ম",
    items: [
      { name: "Facebook", url: "https://www.facebook.com/" },
      { name: "YouTube", url: "https://www.youtube.com/" },
      { name: "Instagram", url: "https://www.instagram.com/" },
      { name: "TikTok", url: "https://www.tiktok.com/" },
      { name: "Twitter (X)", url: "https://twitter.com/" },
      { name: "LinkedIn", url: "https://www.linkedin.com/" },
      { name: "Pinterest", url: "https://www.pinterest.com/" },
      { name: "Snapchat", url: "https://www.snapchat.com/" },
      { name: "Reddit", url: "https://www.reddit.com/" },
      { name: "Vimeo", url: "https://vimeo.com/" },
      { name: "Dailymotion", url: "https://www.dailymotion.com/" },
      { name: "Twitch", url: "https://www.twitch.tv/" },
      { name: "WhatsApp Web", url: "https://web.whatsapp.com/" },
      { name: "Telegram Web", url: "https://web.telegram.org/" },
      { name: "Messenger", url: "https://www.messenger.com/" },
    ],
  },
  {
    name: "অনলাইন কেনাকাটা",
    items: [
      { name: "Daraz", url: "https://www.daraz.com.bd/" },
      { name: "Amazon", url: "https://www.amazon.com/" },
      { name: "Alibaba", url: "https://www.alibaba.com/" },
      { name: "eBay", url: "https://www.ebay.com/" },
      { name: "AjkerDeal", url: "https://www.ajkerdeal.com/" },
      { name: "Pickaboo", url: "https://www.pickaboo.com/" },
      { name: "Chaldal", url: "https://chaldal.com/" },
      { name: "Foodpanda", url: "https://www.foodpanda.com.bd/" },
      { name: "Pathao Food", url: "https://pathaofood.com/" },
      { name: "Sheba.xyz", url: "https://sheba.xyz/" },
      { name: "Bikroy.com", url: "https://bikroy.com/" },
      { name: "Othoba.com", url: "https://www.othoba.com/" },
      { name: "Rokomari.com", url: "https://www.rokomari.com/" },
      { name: "PriyoShop.com", url: "https://priyoshop.com/" },
      { name: "Bagdoom.com", url: "https://www.bagdoom.com/" },
    ],
  },
  {
    name: "সংবাদপত্র (বাংলাদেশি ও আন্তর্জাতিক)",
    items: [
      { name: "প্রথম আলো", url: "https://www.prothomalo.com/" },
      { name: "যুগান্তর", url: "https://www.jugantor.com/" },
      { name: "কালের কণ্ঠ", url: "https://www.kalerkantho.com/" },
      { name: "বাংলাদেশ প্রতিদিন", url: "https://www.bd-pratidin.com/" },
      { name: "The Daily Star", url: "https://www.thedailystar.net/" },
      { name: "BBC News", url: "https://www.bbc.com/news" },
      { name: "CNN", url: "https://edition.cnn.com/" },
      { name: "The New York Times", url: "https://www.nytimes.com/" },
      { name: "Al Jazeera", url: "https://www.aljazeera.com/" },
      { name: "The Guardian", url: "https://www.theguardian.com/international" },
      { name: "Reuters", url: "https://www.reuters.com/" },
      { name: "Associated Press", url: "https://apnews.com/" },
      { name: "Hindustan Times", url: "https://www.hindustantimes.com/" },
      { name: "The Times of India", url: "https://timesofindia.indiatimes.com/" },
      { name: "Dawn", url: "https://www.dawn.com/" },
    ],
  },
  {
    name: "মেডিসিন ও স্বাস্থ্য বিষয়ক",
    items: [
      { name: "Labaid", url: "https://www.labaidgroup.com/hospital" },
      { name: "Square Hospitals", url: "https://www.squarehospital.com/" },
      { name: "United Hospital", url: "https://www.uhlbd.com/" },
      { name: "Evercare Hospital Dhaka", url: "https://www.evercarehospitaldhaka.com/" },
      { name: "Doctorola", url: "https://www.doctorola.com/" },
      { name: "Praava Health", url: "https://praavahealth.com/" },
      { name: "MedEasy", url: "https://medeasy.health/" },
      { name: "Mayoclinic", url: "https://www.mayoclinic.org/" },
      { name: "WebMD", url: "https://www.webmd.com/" },
      { name: "Healthline", url: "https://www.healthline.com/" },
      { name: "NHS", url: "https://www.nhs.uk/" },
      { name: "WHO", url: "https://www.who.int/" },
      { name: "CDC", url: "https://www.cdc.gov/" },
    ],
  },
  {
    name: "লাইভ টিভি",
    items: [
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
      { name: "সময় টিভি", url: "https://www.somoynews.tv/" },
      { name: "চ্যানেল টুয়েন্টিফোর", url: "https://www.channel24bd.tv/" },
    ],
  },
  {
    name: "চাকরি ও কর্মজীবন",
    items: [
      { name: "BDJobs", url: "https://www.bdjobs.com/" },
      { name: "LinkedIn Jobs", url: "https://www.linkedin.com/jobs/" },
      { name: "Indeed", url: "https://www.indeed.com/" },
      { name: "Naukri.com", url: "https://www.naukri.com/" },
      { name: "Monster.com", url: "https://www.monster.com/" },
      { name: "Glassdoor", url: "https://www.glassdoor.com/" },
      { name: "Upwork", url: "https://www.upwork.com/" },
      { name: "Fiverr", url: "https://www.fiverr.com/" },
      { name: "Freelancer.com", url: "https://www.freelancer.com/" },
      { name: "Prothom Alo Jobs", url: "https://jobs.prothomalo.com/" },
      { name: "Chakri.com", url: "https://www.chakri.com/" },
      { name: "CareerJet", url: "https://www.careerjet.com.bd/" },
      { name: "JobStreet", url: "https://www.jobstreet.com/" },
    ],
  },
  {
    name: "শিক্ষা ও ই-লার্নিং",
    items: [
      { name: "Khan Academy", url: "https://www.khanacademy.org/" },
      { name: "Coursera", url: "https://www.coursera.org/" },
      { name: "edX", url: "https://www.edx.org/" },
      { name: "Udemy", url: "https://www.udemy.com/" },
      { name: "Google Classroom", url: "https://classroom.google.com/" },
      { name: "Zoom", url: "https://zoom.us/" },
      { name: "Microsoft Teams", url: "https://www.microsoft.com/en-us/microsoft-teams/" },
      { name: "Wikipedia", url: "https://www.wikipedia.org/" },
      { name: "Bangla Academy", url: "http://banglaacademy.portal.gov.bd/" },
      { name: "Ten Minute School", url: "https://10minuteschool.com/" },
      { name: "Shikho", url: "https://shikho.com/" },
      { name: "Repto", url: "https://repto.com.bd/" },
    ],
  },
  {
    name: "ভ্রমণ ও পর্যটন",
    items: [
      { name: "Booking.com", url: "https://www.booking.com/" },
      { name: "Agoda", url: "https://www.agoda.com/" },
      { name: "Airbnb", url: "https://www.airbnb.com/" },
      { name: "Tripadvisor", url: "https://www.tripadvisor.com/" },
      { name: "GoZayaan", url: "https://www.gozayaan.com/" },
      { name: "ShareTrip", url: "https://sharetrip.net/" },
      { name: "Biman Bangladesh Airlines", url: "https://www.biman-airlines.com/" },
      { name: "Novoair", url: "https://www.novoair.com/" },
      { name: "US-Bangla Airlines", url: "https://usbair.com/" },
      { name: "Google Maps", url: "https://www.google.com/maps" },
      { name: "Lonely Planet", url: "https://www.lonelyplanet.com/" },
      { name: "National Geographic Travel", url: "https://www.nationalgeographic.com/travel/" },
    ],
  },
  {
    name: "খাবার ও রেসিপি",
    items: [
      { name: "Foodpanda", url: "https://www.foodpanda.com.bd/" },
      { name: "Pathao Food", url: "https://pathaofood.com/" },
      { name: "Allrecipes", url: "https://www.allrecipes.com/" },
      { name: "Food.com", url: "https://www.food.com/" },
      { name: "BBC Good Food", url: "https://www.bbcgoodfood.com/" },
      { name: "MyFoodRecipe", url: "https://myfoodrecipe.com/" },
      { name: "Taste of Home", url: "https://www.tasteofhome.com/" },
      { name: "ChefSteps", url: "https://www.chefsteps.com/" },
      { name: "Bon Appétit", url: "https://www.bonappetit.com/" },
      { name: "Epicurious", url: "https://www.epicurious.com/" },
    ],
  },
  {
    name: "খেলাধুলা",
    items: [
      { name: "ESPN", url: "https://www.espn.com/" },
      { name: "BBC Sport", url: "https://www.bbc.com/sport" },
      { name: "Cricbuzz", url: "https://www.cricbuzz.com/" },
      { name: "ESPNcricinfo", url: "https://www.espncricinfo.com/" },
      { name: "FIFA", url: "https://www.fifa.com/" },
      { name: "UEFA", url: "https://www.uefa.com/" },
      { name: "NBA", url: "https://www.nba.com/" },
      { name: "NFL", url: "https://www.nfl.com/" },
      { name: "Premier League", url: "https://www.premierleague.com/" },
      { name: "Star Sports", url: "https://www.starsports.com/" },
      { name: "Gazi TV Sports", url: "https://www.gtvbd.com/sports" },
      { name: "T Sports", url: "https://tsports.com/" },
    ],
  },
  {
    name: "প্রযুক্তি ও গ্যাজেট",
    items: [
      { name: "TechCrunch", url: "https://techcrunch.com/" },
      { name: "The Verge", url: "https://www.theverge.com/" },
      { name: "CNET", url: "https://www.cnet.com/" },
      { name: "GSM Arena", url: "https://www.gsmarena.com/" },
      { name: "AnandTech", url: "https://www.anandtech.com/" },
      { name: "Engadget", url: "https://www.engadget.com/" },
      { name: "Ars Technica", url: "https://arstechnica.com/" },
      { name: "Wired", url: "https://www.wired.com/" },
      { name: "PCMag", url: "https://www.pcmag.com/" },
      { name: "Tom's Hardware", url: "https://www.tomshardware.com/" },
      { name: "Gadgets 360", url: "https://www.gadgets360.com/" },
      { name: "TechRadar", url: "https://www.techradar.com/" },
    ],
  },
  {
    name: "বিনোদন (সিনেমা ও সিরিজ)",
    items: [
      { name: "Netflix", url: "https://www.netflix.com/" },
      { name: "Amazon Prime Video", url: "https://www.primevideo.com/" },
      { name: "Disney+", url: "https://www.disneyplus.com/" },
      { name: "HBO Max", url: "https://www.max.com/" },
      { name: "Chorki", url: "https://www.chorki.com/" },
      { name: "Binge", url: "https://www.binge.buzz/" },
      { name: "Hoichoi", url: "https://www.hoichoi.tv/" },
      { name: "IMDb", url: "https://www.imdb.com/" },
      { name: "Rotten Tomatoes", url: "https://www.rottentomatoes.com/" },
      { name: "Box Office Mojo", url: "https://www.boxofficemojo.com/" },
      { name: "YouTube Movies", url: "https://www.youtube.com/movies" },
    ],
  },
  {
    name: "সঙ্গীত এবং পডকাস্ট",
    items: [
      { name: "Spotify", url: "https://www.spotify.com/" },
      { name: "YouTube Music", url: "https://music.youtube.com/" },
      { name: "Apple Music", url: "https://music.apple.com/" },
      { name: "SoundCloud", url: "https://soundcloud.com/" },
      { name: "Google Podcasts", url: "https://podcasts.google.com/" },
      { name: "Anchor (Spotify for Podcasters)", url: "https://podcasters.spotify.com/" },
      { name: "Bangla Radio", url: "https://banglaradio.fm/" },
      { name: "Radio Today", url: "https://radiotodaybd.fm/" },
      { name: "Jago FM", url: "https://jagofm.com/" },
      { name: "Shadhin Music", url: "https://shadhinmusic.com/" },
    ],
  },
  {
    name: "জমির কেনাবেচা (রিয়েল এস্টেট)",
    items: [
      { name: "Bikroy.com (Property)", url: "https://bikroy.com/en/properties" },
      { name: "Bproperty.com", url: "https://www.bproperty.com/" },
      { name: "Lamudi.com.bd", url: "https://www.lamudi.com.bd/" },
      { name: "PropertyGuru", url: "https://www.propertyguru.com.sg/" },
      { name: "Zameen.com", url: "https://www.zameen.com/" },
      { name: "RealEstate.com.au", url: "https://www.realestate.com.au/" },
      { name: "Propertyshi.com", url: "https://propertyshi.com/" },
    ],
  },
  {
    name: "অর্থনীতি ও ব্যাংকিং",
    items: [
      { name: "Bangladesh Bank", url: "https://www.bb.org.bd/" },
      { name: "Sonali Bank", url: "https://www.sonalibank.com.bd/" },
      { name: "Janata Bank", url: "https://www.janatabank-bd.com/" },
      { name: "Agrani Bank", url: "https://www.agranibank.org/" },
      { name: "BRAC Bank", url: "https://www.bracbank.com/" },
      { name: "Eastern Bank Ltd", url: "https://www.ebl.com.bd/" },
      { name: "Dhaka Stock Exchange", url: "https://www.dsebd.org/" },
      { name: "Chittagong Stock Exchange", url: "https://www.csec.com.bd/" },
      { name: "The Business Standard", url: "https://www.tbsnews.net/" },
      { name: "Financial Express", url: "https://thefinancialexpress.com.bd/" },
      { name: "Bloomberg", url: "https://www.bloomberg.com/" },
      { name: "Reuters Business", url: "https://www.reuters.com/business/" },
    ],
  },
  {
    name: "সরকারি সেবা",
    items: [
      { name: "National Portal of Bangladesh", url: "https://bangladesh.gov.bd/" },
      { name: "E-Passport Portal", url: "https://www.epassport.gov.bd/" },
      { name: "NID Card Services", url: "https://services.nidw.gov.bd/" },
      { name: "Birth Registration", url: "https://bris.ldgd.gov.bd/pub/?pg=application_form" },
      { name: "Land Record Services", url: "https://land.gov.bd/" },
      { name: "Tax Portal (NBR)", url: "https://nbr.gov.bd/" },
      { name: "Police Clearance", url: "https://pcc.police.gov.bd/" },
      { name: "Ministry of Health", url: "https://www.mohfw.gov.bd/" },
      { name: "Ministry of Education", url: "https://moedu.gov.bd/" },
    ],
  },
  {
    name: "আবহাওয়া ও মানচিত্র",
    items: [
      { name: "Google Maps", url: "https://www.google.com/maps" },
      { name: "OpenStreetMap", url: "https://www.openstreetmap.org/" },
      { name: "Bangladesh Meteorological Department", url: "http://www.bmd.gov.bd/" },
      { name: "AccuWeather", url: "https://www.accuweather.com/" },
      { name: "Weather.com", url: "https://weather.com/" },
      { name: "Windy.com", url: "https://www.windy.com/" },
      { name: "Here WeGo", url: "https://wego.here.com/" },
      { name: "Waze", url: "https://www.waze.com/" },
    ],
  },
  {
    name: "শখ ও হ্যান্ডিক্রাফ্ট",
    items: [
      { name: "Pinterest", url: "https://www.pinterest.com/" },
      { name: "Etsy", url: "https://www.etsy.com/" },
      { name: "Instructables", url: "https://www.instructables.com/" },
      { name: "Craftsy", url: "https://www.craftsy.com/" },
      { name: "Ravelry", url: "https://www.ravelry.com/" },
      { name: "YouTube (DIY & Crafts)", url: "https://www.youtube.com/results?search_query=DIY+crafts" },
    ],
  },
  {
    name: "গাড়ি ও যানবাহন",
    items: [
      { name: "Bikroy.com (Vehicles)", url: "https://bikroy.com/en/vehicles" },
      { name: "Car.com", url: "https://www.cars.com/" },
      { name: "AutoTrader", url: "https://www.autotrader.com/" },
      { name: "Edmunds", url: "https://www.edmunds.com/" },
      { name: "PakWheels", url: "https://www.pakwheels.com/" },
      { name: "CarDekho", url: "https://www.cardekho.com/" },
      { name: "Used Car BD", url: "https://usedcarbd.com/" },
      { name: "OLX (Vehicles)", url: "https://www.olx.com.bd/vehicles" },
    ],
  },
  {
    name: "আইন ও বিচার",
    items: [
      { name: "Bangladesh Supreme Court", url: "https://www.supremecourt.gov.bd/" },
      { name: "Ministry of Law, Justice and Parliamentary Affairs", url: "https://www.minlaw.gov.bd/" },
      { name: "Ain o Salish Kendra (ASK)", url: "https://www.askbd.org/" },
      { name: "Legal Aid Bangladesh", url: "https://www.legalaidbd.org/" },
      { name: "Law Library of Congress", url: "https://www.loc.gov/law/" },
      { name: "FindLaw", url: "https://www.findlaw.com/" },
      { name: "Justia", url: "https://www.justia.com/" },
    ],
  },
];

const AllInOnePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedItemUrl, setSelectedItemUrl] = useState<string | null>(null);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setSelectedItemUrl(null); // Reset selected item when category changes
  };

  const handleItemSelect = (item: PlatformItem) => {
    setSelectedItemUrl(item.url);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedItemUrl(null);
  };

  const handleBackToItems = () => {
    setSelectedItemUrl(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Left Panel: Categories or Items List */}
      <Card className="w-full lg:w-1/3 flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {selectedCategory ? (
              <Button variant="ghost" onClick={handleBackToCategories} className="p-0 h-auto">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {selectedCategory.name}
              </Button>
            ) : (
              "All In One"
            )}
          </CardTitle>
          {selectedItemUrl && selectedCategory && (
            <Button variant="ghost" size="sm" onClick={handleBackToItems}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              তালিকা
            </Button>
          )}
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-[calc(100vh-200px)] w-full rounded-md border p-4">
            {!selectedCategory ? (
              // Display Categories
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {categories.map((category) => (
                  <Button
                    key={category.name}
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center text-center p-2"
                    onClick={() => handleCategorySelect(category)}
                  >
                    <span className="font-semibold text-base">{category.name}</span>
                  </Button>
                ))}
              </div>
            ) : (
              // Display Items for Selected Category
              <div className="grid gap-2">
                {selectedCategory.items.map((item, index) => (
                  <React.Fragment key={item.name}>
                    <Button
                      variant={selectedItemUrl === item.url ? "secondary" : "ghost"}
                      className="w-full justify-start text-left flex flex-col items-start h-auto py-2"
                      onClick={() => handleItemSelect(item)}
                    >
                      <span className="font-semibold text-base">{item.name}</span>
                      <span className="text-sm text-muted-foreground text-left truncate w-full">{item.url}</span>
                    </Button>
                    {index < selectedCategory.items.length - 1 && <Separator />}
                  </React.Fragment>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Right Panel: Iframe Viewer */}
      <Card className="w-full lg:w-2/3 flex flex-col">
        <CardHeader>
          <CardTitle>{selectedItemUrl ? selectedCategory?.items.find(item => item.url === selectedItemUrl)?.name : "প্ল্যাটফর্ম ভিউয়ার"}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          {selectedItemUrl ? (
            <iframe
              src={selectedItemUrl}
              title={selectedCategory?.items.find(item => item.url === selectedItemUrl)?.name || "Selected Platform"}
              className="w-full h-[calc(100vh-200px)] border-0"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              {selectedCategory ? "একটি প্ল্যাটফর্ম নির্বাচন করুন" : "একটি ক্যাটাগরি নির্বাচন করুন"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AllInOnePage;