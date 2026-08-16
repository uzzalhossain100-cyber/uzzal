import {
  BookOpen, Film, Users, Newspaper, ShoppingCart, Banknote, Plane, HeartPulse,
  Building, MessageSquare, Settings, Utensils, Gamepad, Laptop, MessageCircle,
  Camera, Briefcase, Sparkles, Smartphone,
  Calculator,
  Brain
} from 'lucide-react';
import React from 'react';

export interface CategoryItem {
  name: string;
  url?: string;
  subItems?: CategoryItem[];
  internalRoute?: string;
}

export interface Category {
  name: string;
  icon?: React.ElementType;
  items?: CategoryItem[];
  internalRoute?: string;
}

export const allInOneCategories: Category[] = [
  {
    name: "category.mobile_apps",
    icon: Smartphone,
    internalRoute: "/mobile-apps",
  },
  {
    name: "category.news",
    icon: Newspaper,
    items: [
      {
        name: "country.bangladesh",
        subItems: [
          { name: "item.amar_desh", url: "https://www.dailyamardesh.com/" },
          { name: "item.prothom_alo", url: "https://www.prothomalo.com/" },
          { name: "item.jugantor", url: "https://www.jugantor.com/" },
          { name: "item.kaler_kantho", url: "https://www.kalerkantho.com/" },
          { name: "item.bangladesh_protidin", url: "https://www.bd-pratidin.com/" },
          { name: "item.ittefaq", url: "https://www.ittefaq.com.bd/" },
          { name: "item.janakantha", url: "https://www.dailyjanakantha.com/" },
          { name: "item.naya_diganta", url: "https://www.dailynayadiganta.com/" },
          { name: "item.bhorer_kagoj", url: "https://www.bhorerkagoj.com/" },
          { name: "item.samakal", url: "https://samakal.com/" },
          { name: "item.manobjamin", url: "https://mzamin.com/" },
          { name: "item.alokito_bangladesh", url: "https://www.alokitobangladesh.com/" },
          { name: "item.inqilab", url: "https://www.dailyinqilab.com/" },
          { name: "item.banglanews24", url: "https://www.banglanews24.com/" },
          { name: "item.bdnews24", url: "https://bangla.bdnews24.com/" },
          { name: "item.jagonews24", url: "https://www.jagonews24.com/" },
          { name: "item.desh_rupantor", url: "https://www.deshrupantor.com/" },
        ],
      },
      {
        name: "country.india",
        subItems: [
          { name: "item.anandabazar_patrika", url: "https://www.anandabazar.com/" },
          { name: "item.bartaman", url: "https://www.bartamanpatrika.com/" },
          { name: "item.ei_samay", url: "https://eisamay.indiatimes.com/" },
          { name: "item.the_times_of_india", url: "https://timesofindia.indiatimes.com/" },
          { name: "item.hindustan_times", url: "https://www.hindustantimes.com/" },
          { name: "item.the_hindu", url: "https://www.thehindu.com/" },
        ],
      },
      {
        name: "country.united_kingdom",
        subItems: [
          { name: "item.bbc_news", url: "https://www.bbc.com/news" },
          { name: "item.the_guardian", url: "https://www.theguardian.com/uk" },
          { name: "item.the_times", url: "https://www.thetimes.co.uk/" },
        ],
      },
      {
        name: "country.united_states",
        subItems: [
          { name: "item.the_new_york_times", url: "https://www.nytimes.com/" },
          { name: "item.the_washington_post", url: "https://www.washingtonpost.com/" },
          { name: "item.cnn", url: "https://edition.cnn.com/" },
          { name: "item.fox_news", url: "https://www.foxnews.com/" },
        ],
      },
      {
        name: "country.saudi_arabia",
        subItems: [
          { name: "item.arab_news", url: "https://www.arabnews.com/" },
          { name: "item.saudi_gazette", url: "https://saudigazette.com.sa/" },
        ],
      },
    ],
  },
  {
    name: "category.live_tv",
    icon: Film,
    items: [
      {
        name: "country.bangladesh",
        subItems: [
          { name: "item.toffee_tv", url: "https://toffeelive.com/en/live" },
          { name: "item.jago_tv", url: "https://www.jagobd.com/category/bangla-channel" },
          { name: "item.roar_tv", url: "http://tv.roarzone.info/" },
          { name: "item.chorki", url: "https://www.chorki.com/movie" },
          { name: "item.bongo_bd", url: "https://bongobd.com/movies" },
          { name: "item.hoichoi", url: "https://www.hoichoi.tv/bd" },
        ],
      },
      {
        name: "country.india",
        subItems: [
          { name: "item.aaj_tak", url: "https://www.aajtak.in/livetv" },
          { name: "item.ndtv_india", url: "https://www.ndtv.com/video/live/channel/ndtv-india" },
          { name: "item.abp_ananda", url: "https://bengali.abplive.com/live-tv" },
        ],
      },
      {
        name: "country.international",
        subItems: [
          { name: "item.al_arabiya", url: "https://www.alarabiya.net/live" },
          { name: "item.bbc_one", url: "https://www.bbc.co.uk/bbcone/watch/live" },
          { name: "item.cnn_live", url: "https://edition.cnn.com/tv/cnn-live-tv" },
        ]
      }
    ],
  },
  {
    name: "category.education",
    icon: BookOpen,
    items: [
      {
        name: "country.bangladesh",
        subItems: [
          { name: "item.udvash_unmesh", url: "https://udvash.com/HomePage" },
          { name: "item.uttoron", url: "https://uttoron.academy/HomePage" },
          { name: "item.10_minute_school", url: "https://10minuteschool.com/" },
          { name: "item.khan_academy_bangla", url: "https://bn.khanacademy.org/" },
          { name: "item.wikipedia_bangla", url: "https://bn.wikipedia.org/" },
          { name: "item.shikho", url: "https://shikho.com/" },
          { name: "item.muktopaath", url: "https://muktopaath.gov.bd/" },
        ],
      },
      {
        name: "country.international",
        subItems: [
          { name: "item.coursera", url: "https://www.coursera.org/" },
          { name: "item.edx", url: "https://www.edx.org/" },
          { name: "item.duolingo", url: "https://www.duolingo.com/" },
          { name: "item.w3schools", url: "https://www.w3schools.com/" },
          { name: "item.freecodecamp", url: "https://www.freecodecamp.com/" },
        ],
      },
    ],
  },
  {
    name: "category.banking_finance",
    icon: Banknote,
    items: [
      { name: "item.bkash", url: "https://www.bkash.com/" },
      { name: "item.nagad", url: "https://nagad.com.bd/" },
      { name: "item.rocket", url: "https://www.dutchbanglabank.com/rocket/rocket.html" },
      { name: "item.paypal", url: "https://www.paypal.com/" },
      { name: "item.payoneer", url: "https://www.payoneer.com/" },
      { name: "item.islami_bank_bangladesh_limited", url: "https://www.islamibankbd.com/" },
      { name: "item.brac_bank", url: "https://www.bracbank.com/" },
      { name: "item.city_bank", url: "https://www.thecitybank.com/" },
      { name: "item.dutch_bangla_bank", url: "https://www.dutchbanglabank.com/" },
    ],
  },
  {
    name: "category.shopping",
    icon: ShoppingCart,
    items: [
      { name: "item.daraz", url: "https://www.daraz.com.bd/" },
      { name: "item.chaldal", url: "https://chaldal.com/" },
      { name: "item.rokomari", url: "https://www.rokomari.com/" },
      { name: "item.foodpanda", url: "https://www.foodpanda.com.bd/" },
      { name: "item.amazon", url: "https://www.amazon.com/" },
      { name: "item.aliexpress", url: "https://www.aliexpress.com/" },
      { name: "item.shwapno", url: "https://www.shwapno.com/" },
      { name: "item.ajkerdeal", url: "https://www.ajkerdeal.com/" },
    ],
  },
  {
    name: "category.social_media",
    icon: Users,
    items: [
      { name: "item.facebook", url: "https://www.facebook.com/" },
      { name: "item.twitter_x", url: "https://twitter.com/" },
      { name: "item.instagram", url: "https://www.instagram.com/" },
      { name: "item.linkedin", url: "https://www.linkedin.com/" },
      { name: "item.whatsapp_web", url: "https://web.whatsapp.com/" },
      { name: "item.telegram_web", url: "https://web.telegram.org/" },
      { name: "item.tiktok", url: "https://www.tiktok.com/" },
      { name: "item.youtube", url: "https://www.youtube.com/" },
    ],
  },
  {
    name: "category.emergency_contacts",
    icon: HeartPulse,
    internalRoute: "/emergency-contacts",
  },
  {
    name: "category.converter",
    icon: Calculator,
    internalRoute: "/converter",
  },
  {
    name: "category.games",
    icon: Gamepad,
    items: [
      { name: "category.quiz", icon: Brain, internalRoute: "/quiz" },
    ],
  },
  {
    name: "category.government_services",
    icon: Building,
    items: [
      { name: "item.jatiyo_tottho_batayon", url: "https://www.bangladesh.gov.bd/" },
      { name: "item.e_sheba", url: "https://www.esheba.gov.bd/" },
      { name: "item.jatiyo_porichoypotro", url: "https://services.nidw.gov.bd/" },
      { name: "item.passport_sheba", url: "https://www.epassport.gov.bd/" },
      { name: "item.jonmo_mrityu_nibondhon", url: "https://bris.ldgd.gov.bd/pub/?pg=application_form" },
      { name: "item.bhumi_sheba", url: "https://land.gov.bd/" },
      { name: "item.brta", url: "https://www.brta.gov.bd/" },
    ],
  },
  {
    name: "category.travel",
    icon: Plane,
    items: [
      { name: "item.bdtickets", url: "https://bdtickets.com/" },
      { name: "item.shohoz", url: "https://www.shohoz.com/" },
      { name: "item.railway_e_ticketing", url: "https://eticket.railway.gov.bd/" },
      { name: "item.gozayaan", url: "https://www.gozayaan.com/" },
      { name: "item.biman_bangladesh_airlines", url: "https://www.biman-airlines.com/" },
      { name: "item.booking_com", url: "https://www.booking.com/" },
    ],
  },
  {
    name: "category.health",
    icon: HeartPulse,
    items: [
      { name: "item.medex", url: "https://www.medex.com.bd" },
      { name: "item.arogga", url: "https://www.arogga.com/" },
      { name: "item.maya_apa", url: "https://www.maya.com.bd/" },
      { name: "item.doctorola", url: "https://www.doctorola.com/" },
      { name: "item.square_hospital", url: "https://www.squarehospital.com/" },
    ],
  },
  {
    name: "category.technology",
    icon: Laptop,
    items: [
      { name: "item.techcrunch", url: "https://techcrunch.com/" },
      { name: "item.the_verge", url: "https://www.theverge.com/" },
      { name: "item.github", url: "https://github.com/" },
      { name: "item.chatgpt", url: "https://chatgpt.com/" },
    ],
  },
  {
    name: "category.blogs_forums",
    icon: MessageCircle,
    items: [
      { name: "item.medium", url: "https://medium.com/" },
      { name: "item.quora", url: "https://www.quora.com/" },
      { name: "item.reddit", url: "https://www.reddit.com/" },
      { name: "item.dev_to", url: "https://dev.to/" },
    ],
  },
];