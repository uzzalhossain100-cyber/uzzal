export interface MobileAppItem {
  id: string;
  name: string;
  nameBn: string;
  category: 'social' | 'finance' | 'entertainment' | 'utility' | 'productivity' | 'shopping' | 'education' | 'communication';
  iconUrl: string;
  webUrl: string;
  playStoreUrl: string;
  description: string;
  descriptionBn: string;
}

export const popularMobileApps: MobileAppItem[] = [
  // --- Social Media & Communication ---
  {
    id: "facebook",
    name: "Facebook",
    nameBn: "ফেসবুক",
    category: "social",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg",
    webUrl: "https://m.facebook.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.facebook.katana",
    description: "Connect with friends and the world.",
    descriptionBn: "বন্ধু ও পরিবারের সাথে সহজে যুক্ত থাকুন।"
  },
  {
    id: "whatsapp",
    name: "WhatsApp Messenger",
    nameBn: "হোয়াটসঅ্যাপ",
    category: "communication",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
    webUrl: "https://web.whatsapp.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.whatsapp",
    description: "Simple, secure, reliable messaging and calling.",
    descriptionBn: "সহজ ও নিরাপদ মেসেজিং ও ফ্রি কলিং।"
  },
  {
    id: "messenger",
    name: "Facebook Messenger",
    nameBn: "মেসেঞ্জার",
    category: "communication",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/b/be/Facebook_Messenger_logo_2020.svg",
    webUrl: "https://www.messenger.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.facebook.orca",
    description: "Free group video chat, voice calls and messaging.",
    descriptionBn: "গ্রুপ ভিডিও চ্যাট ও ফ্রি মেসেজিং অ্যাপ।"
  },
  {
    id: "tiktok",
    name: "TikTok",
    nameBn: "টিকটক",
    category: "entertainment",
    iconUrl: "https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg",
    webUrl: "https://www.tiktok.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.zhiliaoapp.musically",
    description: "Short-form mobile video community.",
    descriptionBn: "শর্ট ভিডিও বিনোদনের সেরা মাধ্যম।"
  },
  {
    id: "instagram",
    name: "Instagram",
    nameBn: "ইনস্টাগ্রাম",
    category: "social",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg",
    webUrl: "https://www.instagram.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.instagram.android",
    description: "Share photos, videos and stories.",
    descriptionBn: "ছবি ও ভিডিও শেয়ার করার জনপ্রিয় অ্যাপ।"
  },
  {
    id: "youtube",
    name: "YouTube",
    nameBn: "ইউটিউব",
    category: "entertainment",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg",
    webUrl: "https://m.youtube.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.google.android.youtube",
    description: "Watch and share videos, music and streams.",
    descriptionBn: "ভিডিও, নাটক, গান ও লাইভ স্ট্রিম দেখুন।"
  },
  {
    id: "telegram",
    name: "Telegram",
    nameBn: "টেলিগ্রাম",
    category: "communication",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg",
    webUrl: "https://web.telegram.org",
    playStoreUrl: "https://play.google.com/store/apps/details?id=org.telegram.messenger",
    description: "Fast, powerful and secure messaging.",
    descriptionBn: "দ্রুত ও নিরাপদ ক্লাউড মেসেজিং অ্যাপ।"
  },
  {
    id: "snapchat",
    name: "Snapchat",
    nameBn: "স্ন্যাপচ্যাট",
    category: "social",
    iconUrl: "https://upload.wikimedia.org/wikipedia/en/c/c4/Snapchat_logo.svg",
    webUrl: "https://www.snapchat.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.snapchat.android",
    description: "Share snaps, filters and stories with friends.",
    descriptionBn: "ক্যামেরা ফিল্টার ও চ্যাট করার অ্যাপ।"
  },
  {
    id: "imo",
    name: "imo Video Calls & Chat",
    nameBn: "ইমো (imo)",
    category: "communication",
    iconUrl: "https://play-lh.googleusercontent.com/V_MvA4Y0_5YIuK75W-V04d2j0Fz5gXgD9V9s5G",
    webUrl: "https://imo.im",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.imo.android.imoim",
    description: "HD video and voice calls worldwide.",
    descriptionBn: "স্বল্প খরচে অডিও ও ভিডিও কল করার অ্যাপ।"
  },
  {
    id: "twitter_x",
    name: "X (Twitter)",
    nameBn: "এক্স (টুইটার)",
    category: "social",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5a/X_icon_2.svg",
    webUrl: "https://x.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.twitter.android",
    description: "Real-time news, trends and discussions.",
    descriptionBn: "বিশ্বের সমসাময়িক খবর ও আলোচনা।"
  },
  {
    id: "viber",
    name: "Rakuten Viber Messenger",
    nameBn: "ভাইবার (Viber)",
    category: "communication",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/8/89/Viber-logo.png",
    webUrl: "https://www.viber.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.viber.voip",
    description: "Free, secure calls and messages to anyone.",
    descriptionBn: "ফ্রি কল ও মেসেজিং প্ল্যাটফর্ম।"
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    nameBn: "লিঙ্কডইন",
    category: "social",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png",
    webUrl: "https://www.linkedin.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.linkedin.android",
    description: "Professional networking and job opportunities.",
    descriptionBn: "ক্যারিয়ার ও প্রফেশনাল নেটওয়ার্কিং প্ল্যাটফর্ম।"
  },
  {
    id: "pinterest",
    name: "Pinterest",
    nameBn: "পিন্টারেস্ট",
    category: "social",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png",
    webUrl: "https://www.pinterest.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.pinterest",
    description: "Discover recipes, home ideas, style inspiration.",
    descriptionBn: "নতুন আইডিয়া, ছবি ও ডিজাইনের অনুপ্রেরণা।"
  },
  {
    id: "discord",
    name: "Discord",
    nameBn: "ডিসকর্ড",
    category: "communication",
    iconUrl: "https://upload.wikimedia.org/wikipedia/en/9/98/Discord_logo.svg",
    webUrl: "https://discord.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.discord",
    description: "Voice, video and text chat communities.",
    descriptionBn: "গেমিং ও বিভিন্ন কমিউনিটি ভয়েস চ্যাট অ্যাপ।"
  },
  {
    id: "reddit",
    name: "Reddit",
    nameBn: "রেডিট",
    category: "social",
    iconUrl: "https://upload.wikimedia.org/wikipedia/en/b/bd/Reddit_Logo_Icon.svg",
    webUrl: "https://www.reddit.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.reddit.frontpage",
    description: "Dive into anything with millions of communities.",
    descriptionBn: "বিশ্বের জনপ্রিয় ফোরাম ও আলোচনার স্থান।"
  },
  {
    id: "threads",
    name: "Threads by Instagram",
    nameBn: "থ্রেডস (Threads)",
    category: "social",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Threads_%28app%29_logo.svg",
    webUrl: "https://www.threads.net",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.instagram.barcelona",
    description: "Text-based conversation app by Meta.",
    descriptionBn: "ইনস্টাগ্রামের টেক্সট শেয়ারিং অ্যাপ।"
  },

  // --- Banking & Finance (BD & Global) ---
  {
    id: "bkash",
    name: "bKash",
    nameBn: "বিকাশ",
    category: "finance",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Bkash_logo.png",
    webUrl: "https://www.bkash.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.bKash.customerapp",
    description: "Bangladesh's leading mobile financial service.",
    descriptionBn: "টাকা পাঠানো, রিচার্জ ও পেমেন্টের জনপ্রিয় মাধ্যম।"
  },
  {
    id: "nagad",
    name: "Nagad",
    nameBn: "নগদ",
    category: "finance",
    iconUrl: "https://upload.wikimedia.org/wikipedia/en/8/87/Nagad_logo.png",
    webUrl: "https://nagad.com.bd",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.konasl.nagad",
    description: "Post Office Mobile Financial Service.",
    descriptionBn: "বাংলাদেশ ডাক বিভাগের ডিজিটাল লেনদেন সেবা।"
  },
  {
    id: "rocket",
    name: "Rocket (DBBL)",
    nameBn: "রকেট",
    category: "finance",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Rocket_Dutch_Bangla_Bank.png",
    webUrl: "https://www.dutchbanglabank.com/rocket/rocket.html",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.dbbl.mbs.apps.main",
    description: "Dutch-Bangla Bank Mobile Banking.",
    descriptionBn: "ডাচ-বাংলা ব্যাংকের মোবাইল ব্যাংকিং সেবা।"
  },
  {
    id: "upay",
    name: "Upay",
    nameBn: "উপায় (Upay)",
    category: "finance",
    iconUrl: "https://play-lh.googleusercontent.com/P4zX4e7dD7FqPqQ",
    webUrl: "https://www.upaybd.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=bd.com.upay.customer",
    description: "UCB digital financial service.",
    descriptionBn: "ইউসিবির ডিজিটাল ওয়ালেট ও ক্যাশআউট।"
  },
  {
    id: "cellfin",
    name: "CellFin (IBBL)",
    nameBn: "সেলফিন (CellFin)",
    category: "finance",
    iconUrl: "https://play-lh.googleusercontent.com/9t5J",
    webUrl: "https://www.islamibankbd.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.ibbl.cellfin",
    description: "Islami Bank digital banking app.",
    descriptionBn: "ইসলামী ব্যাংকের স্মার্ট ব্যাংকিং অ্যাপ।"
  },
  {
    id: "citytouch",
    name: "Citytouch",
    nameBn: "সিটি টাচ (Citytouch)",
    category: "finance",
    iconUrl: "https://play-lh.googleusercontent.com/citytouch",
    webUrl: "https://www.thecitybank.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.thecitybank.citytouch",
    description: "City Bank digital banking.",
    descriptionBn: "সিটি ব্যাংকের সহজ অনলাইন ব্যাংকিং।"
  },
  {
    id: "astle",
    name: "Astha (BRAC Bank)",
    nameBn: "আস্থা (BRAC Bank)",
    category: "finance",
    iconUrl: "https://play-lh.googleusercontent.com/astha",
    webUrl: "https://www.bracbank.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.bracbank.astha",
    description: "BRAC Bank digital financial super app.",
    descriptionBn: "ব্র্যাক ব্যাংকের ডিজিটাল ব্যাংকিং অ্যাপ।"
  },
  {
    id: "paypal",
    name: "PayPal",
    nameBn: "পেপাল",
    category: "finance",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg",
    webUrl: "https://www.paypal.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.paypal.android.p2pmobile",
    description: "Send money, pay online securely.",
    descriptionBn: "আন্তর্জাতিক অর্থ লেনদেনের সবচেয়ে জনপ্রিয় মাধ্যম।"
  },
  {
    id: "binance",
    name: "Binance",
    nameBn: "বাইনান্স",
    category: "finance",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/5/57/Binance_Logo.png",
    webUrl: "https://www.binance.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.binance.dev",
    description: "World's leading cryptocurrency exchange.",
    descriptionBn: "বিশ্বমানের ক্রিপ্টোকারেন্সি ও ট্রেডিং অ্যাপ।"
  },

  // --- Entertainment & Streaming ---
  {
    id: "toffee",
    name: "Toffee - Live TV, Sports",
    nameBn: "টফি (Toffee)",
    category: "entertainment",
    iconUrl: "https://play-lh.googleusercontent.com/toffee",
    webUrl: "https://toffeelive.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.banglalink.toffee",
    description: "Live TV, sports and local entertainment BD.",
    descriptionBn: "লাইভ টিভি, খেলা ও বিনোদনের সেরা বাংলা অ্যাপ।"
  },
  {
    id: "chorki",
    name: "Chorki",
    nameBn: "চরকি (Chorki)",
    category: "entertainment",
    iconUrl: "https://upload.wikimedia.org/wikipedia/en/e/eb/Chorki_logo.png",
    webUrl: "https://www.chorki.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.chorki.android",
    description: "Original Bengali movies, web series and dramas.",
    descriptionBn: "বাংলা সিনেমা ও সেরা ওয়েব সিরিজের প্ল্যাটফর্ম।"
  },
  {
    id: "bongobd",
    name: "Bongo",
    nameBn: "বঙ্গ (Bongo)",
    category: "entertainment",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Bongo_Logo.svg",
    webUrl: "https://bongobd.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.multitvsolution.bongo",
    description: "Watch movies, dramas and entertainment in Bangla.",
    descriptionBn: "বাংলা মুভি, নাটক ও বিনোদনমূলক কন্টেন্ট।"
  },
  {
    id: "hoichoi",
    name: "Hoichoi",
    nameBn: "হইচই (Hoichoi)",
    category: "entertainment",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/1/10/Hoichoi_Logo.png",
    webUrl: "https://www.hoichoi.tv",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.viewlift.hoichoi",
    description: "Bengali movies, exclusive web series.",
    descriptionBn: "জনপ্রিয় বাংলা সিনেমা ও ওয়েব সিরিজের ভাণ্ডার।"
  },
  {
    id: "netflix",
    name: "Netflix",
    nameBn: "নেটফ্লিক্স",
    category: "entertainment",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    webUrl: "https://www.netflix.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.netflix.mediaclient",
    description: "Award-winning TV shows, movies and series.",
    descriptionBn: "বিশ্বমানের মুভি ও ওয়েব সিরিজ দেখার প্ল্যাটফর্ম।"
  },
  {
    id: "spotify",
    name: "Spotify: Music and Podcasts",
    nameBn: "স্পটিফাই (Spotify)",
    category: "entertainment",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
    webUrl: "https://open.spotify.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.spotify.music",
    description: "Millions of songs and podcasts on mobile.",
    descriptionBn: "লাখো গান ও পডকাস্ট শোনার সেরা অ্যাপ।"
  },
  {
    id: "primevideo",
    name: "Amazon Prime Video",
    nameBn: "প্রাইম ভিডিও",
    category: "entertainment",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png",
    webUrl: "https://www.primevideo.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.amazon.avod.thirdpartyclient",
    description: "Movies, popular shows and Amazon Originals.",
    descriptionBn: "অ্যামাজন প্রাইমের মুভি ও সিরিজ দেখার অ্যাপ।"
  },
  {
    id: "cricbuzz",
    name: "Cricbuzz - Live Cricket Scores",
    nameBn: "ক্রিকবাজ (Cricbuzz)",
    category: "entertainment",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/8/87/Cricbuzz_Logo.png",
    webUrl: "https://www.cricbuzz.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.cricbuzz.android",
    description: "Ball by ball cricket score and commentary.",
    descriptionBn: "লাইভ ক্রিকেট স্কোর ও ধারাভাষ্য।"
  },

  // --- Shopping & Food Delivery ---
  {
    id: "daraz",
    name: "Daraz Online Shopping",
    nameBn: "দারাজ (Daraz)",
    category: "shopping",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Daraz_Logo.png",
    webUrl: "https://www.daraz.com.bd",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.daraz.android",
    description: "Online shopping mall with millions of products.",
    descriptionBn: "অনলাইনে কেনাকাটার সবচেয়ে বড় প্ল্যাটফর্ম।"
  },
  {
    id: "foodpanda",
    name: "Foodpanda: Food & Grocery",
    nameBn: "ফুডপ্যান্ডা (Foodpanda)",
    category: "shopping",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/d/df/Foodpanda_logo_2023.svg",
    webUrl: "https://www.foodpanda.com.bd",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.global.foodpanda.android",
    description: "Fast food delivery and groceries at your door.",
    descriptionBn: "রেস্তোরাঁর খাবার ও গ্রোসারি দ্রুত ডেলিভারি।"
  },
  {
    id: "pathao",
    name: "Pathao",
    nameBn: "পাঠাও (Pathao)",
    category: "shopping",
    iconUrl: "https://upload.wikimedia.org/wikipedia/en/9/91/Pathao_logo.png",
    webUrl: "https://pathao.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.pathao.user",
    description: "Ride sharing, parcel & food delivery in BD.",
    descriptionBn: "রাইড শেয়ারিং, খাবার ডেলিভারি ও পার্সেল সার্ভিস।"
  },
  {
    id: "chaldal",
    name: "Chaldal: Grocery Delivery",
    nameBn: "চালডাল (Chaldal)",
    category: "shopping",
    iconUrl: "https://chaldn.com/asset/Egg.ChaldalWeb.Fabric/Egg.ChaldalWeb1/1.0.0+deploy-697/Default/images/menu_icon_logo.png",
    webUrl: "https://chaldal.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.chaldal.poached",
    description: "Order fresh groceries & essentials in 1 hour.",
    descriptionBn: "ঘরে বসে বাজার করার সবচেয়ে দ্রুততম সেবা।"
  },
  {
    id: "rokomari",
    name: "Rokomari",
    nameBn: "রকমারি (Rokomari)",
    category: "shopping",
    iconUrl: "https://www.rokomari.com/static/200/images/rokomari_logo.png",
    webUrl: "https://www.rokomari.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.rokomari",
    description: "Largest online bookstore in Bangladesh.",
    descriptionBn: "বই ও স্টেশনারি কেনার সবচেয়ে বড় মার্কেটপ্লেস।"
  },
  {
    id: "shohoz",
    name: "Shohoz - Tickets, Rides & Food",
    nameBn: "সহজ (Shohoz)",
    category: "shopping",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Shohoz-logo.png",
    webUrl: "https://www.shohoz.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.shohoz.rides",
    description: "Bus, train & launch tickets and rides.",
    descriptionBn: "বাস, ট্রেন ও লঞ্চের টিকিট কাটার নির্ভরযোগ্য অ্যাপ।"
  },
  {
    id: "uber",
    name: "Uber: Request a ride",
    nameBn: "উবার (Uber)",
    category: "utility",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png",
    webUrl: "https://m.uber.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.ubercab",
    description: "Ride hailing and car booking anywhere.",
    descriptionBn: "সহজে কার ও বাইক রাইড পাওয়ার জনপ্রিয় সেবা।"
  },
  {
    id: "aliexpress",
    name: "AliExpress",
    nameBn: "আলিএক্সপ্রেস",
    category: "shopping",
    iconUrl: "https://upload.wikimedia.org/wikipedia/en/8/80/AliExpress_logo.svg",
    webUrl: "https://www.aliexpress.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.alibaba.aliexpresshd",
    description: "Global online shopping with great deals.",
    descriptionBn: "বিশ্বব্যাপী সস্তায় পণ্য কেনার প্ল্যাটফর্ম।"
  },
  {
    id: "amazon",
    name: "Amazon Shopping",
    nameBn: "অ্যামাজন",
    category: "shopping",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg",
    webUrl: "https://www.amazon.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.amazon.mShop.android.shopping",
    description: "Online shopping for electronics, books, fashion.",
    descriptionBn: "বিশ্বের বৃহত্তম অনলাইন শপিং অ্যাপ।"
  },

  // --- Productivity & Google Tools ---
  {
    id: "google_chrome",
    name: "Google Chrome",
    nameBn: "গুগল ক্রোম",
    category: "utility",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg",
    webUrl: "https://www.google.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.android.chrome",
    description: "Fast, secure web browser for Android.",
    descriptionBn: "দ্রুত ও নিরাপদ ইন্টারনেট ব্রাউজার।"
  },
  {
    id: "gmail",
    name: "Gmail",
    nameBn: "জিমেইল",
    category: "productivity",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg",
    webUrl: "https://mail.google.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.google.android.gm",
    description: "Easy to use email service that saves you time.",
    descriptionBn: "ইমেইল আদান-প্রদানের নির্ভরযোগ্য অ্যাপ।"
  },
  {
    id: "google_maps",
    name: "Google Maps",
    nameBn: "গুগল ম্যাপস",
    category: "utility",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/a/aa/Google_Maps_icon_%282020%29.svg",
    webUrl: "https://maps.google.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.google.android.apps.maps",
    description: "GPS navigation, live traffic and places.",
    descriptionBn: "জিপিএস লোকেশন ও নেভিগেশন সুবিধা।"
  },
  {
    id: "google_drive",
    name: "Google Drive",
    nameBn: "গুগল ড্রাইভ",
    category: "productivity",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg",
    webUrl: "https://drive.google.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.google.android.apps.docs",
    description: "Cloud storage and file backup service.",
    descriptionBn: "অনলাইনে ফাইল, ছবি ও ডকুমেন্ট সংরক্ষণের ক্লাউড।"
  },
  {
    id: "google_photos",
    name: "Google Photos",
    nameBn: "গুগল ফটোস",
    category: "utility",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/6/61/Google_Photos_icon_%282020%29.svg",
    webUrl: "https://photos.google.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.google.android.apps.photos",
    description: "Back up photos and videos automatically.",
    descriptionBn: "স্বয়ংক্রিয়ভাবে ছবি ব্যাকআপ ও ফটো গ্যালারি।"
  },
  {
    id: "google_translate",
    name: "Google Translate",
    nameBn: "গুগল ট্রান্সলেট",
    category: "education",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Google_Translate_logo.svg",
    webUrl: "https://translate.google.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.google.android.apps.translate",
    description: "Translate text, voice and photos in 100+ languages.",
    descriptionBn: "যেকোনো ভাষা থেকে বাংলায় নিখুঁত অনুবাদ।"
  },
  {
    id: "google_meet",
    name: "Google Meet",
    nameBn: "গুগল মিট",
    category: "communication",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9b/Google_Meet_icon_%282020%29.svg",
    webUrl: "https://meet.google.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.google.android.apps.meetings",
    description: "Secure, high-quality video meetings.",
    descriptionBn: "উচ্চমানের অনলাইন মিটিং ও ক্লাস করার অ্যাপ।"
  },
  {
    id: "zoom",
    name: "Zoom Workplace",
    nameBn: "জুম (Zoom)",
    category: "communication",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Zoom_Communications_Logo.svg",
    webUrl: "https://zoom.us",
    playStoreUrl: "https://play.google.com/store/apps/details?id=us.zoom.videomeetings",
    description: "Enterprise video conferencing and online meetings.",
    descriptionBn: "ভিডিও কনফারেন্সিং ও গ্রুপ মিটিং অ্যাপ।"
  },
  {
    id: "canva",
    name: "Canva: Design, Photo & Video",
    nameBn: "ক্যানভা (Canva)",
    category: "productivity",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg",
    webUrl: "https://www.canva.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.canva.editor",
    description: "Graphic design, logo maker, video editing.",
    descriptionBn: "মোবাইলে পোস্টার, থাম্বনেইল ও ডিজাইন তৈরি।"
  },
  {
    id: "capcut",
    name: "CapCut - Video Editor",
    nameBn: "ক্যাপকাট (CapCut)",
    category: "productivity",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Capcut_logo.png",
    webUrl: "https://www.capcut.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.lemon.lvoverseas",
    description: "All-in-one video editor with trends and music.",
    descriptionBn: "টিকটক ও রিলস ভিডিও বানানোর সেরা এডিটর।"
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    nameBn: "চ্যাটজিপিটি (ChatGPT)",
    category: "productivity",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
    webUrl: "https://chatgpt.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.openai.chatgpt",
    description: "Get instant answers, creative inspiration from AI.",
    descriptionBn: "ওপেনএআই-এর কৃত্রিম বুদ্ধিমত্তা সহকারী।"
  },
  {
    id: "ridmik",
    name: "Ridmik Keyboard",
    nameBn: "রিদ্মিক কিবোর্ড",
    category: "utility",
    iconUrl: "https://play-lh.googleusercontent.com/ridmik",
    webUrl: "https://ridmik.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=net.ridmik.keyboard",
    description: "Most popular Bengali typing keyboard.",
    descriptionBn: "সহজে অভ্র ও জাতীয় লেআউটে বাংলা লেখার কিবোর্ড।"
  },
  {
    id: "quran_majeed",
    name: "Quran Majeed",
    nameBn: "কুরআন মাজীদ (বাংলা)",
    category: "education",
    iconUrl: "https://play-lh.googleusercontent.com/quran",
    webUrl: "https://quran.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.pakdata.QuranMajeed",
    description: "Complete Quran with Bangla translation and audio.",
    descriptionBn: "বাংলা অর্থ ও অডিও সহ পূর্ণাঙ্গ আল কুরআন।"
  },
  {
    id: "duolingo",
    name: "Duolingo: Language Lessons",
    nameBn: "ডুওলিঙ্গো (Duolingo)",
    category: "education",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/1/15/Duolingo_logo.svg",
    webUrl: "https://www.duolingo.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.duolingo",
    description: "Learn English, Spanish and other languages easily.",
    descriptionBn: "খেলায় খেলায় ইংরেজি ও অন্যান্য ভাষা শিখুন।"
  },
  {
    id: "ten_minute_school",
    name: "10 Minute School",
    nameBn: "১০ মিনিট স্কুল",
    category: "education",
    iconUrl: "https://10minuteschool.com/assets/icons/favicon.png",
    webUrl: "https://10minuteschool.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.a10ms.tenminuteschool",
    description: "Online classes, skills and exam prep BD.",
    descriptionBn: "স্কুল, কলেজ ও স্কিল ডেভেলপমেন্টের শীর্ষ প্ল্যাটফর্ম।"
  },
  {
    id: "camscanner",
    name: "CamScanner - PDF Scanner",
    nameBn: "ক্যামস্ক্যানার (CamScanner)",
    category: "utility",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ee/CamScanner_logo.png",
    webUrl: "https://www.camscanner.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.intsig.camscanner",
    description: "Scan documents to PDF, clean up and share.",
    descriptionBn: "মোবাইলের ক্যামেরা দিয়ে ডকুমেন্ট স্ক্যান ও পিডিএফ।"
  },
  {
    id: "truecaller",
    name: "Truecaller: Caller ID & Block",
    nameBn: "ট্রুকলার (Truecaller)",
    category: "utility",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/2/23/Truecaller_Logo_2020.svg",
    webUrl: "https://www.truecaller.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.truecaller",
    description: "Identify unknown callers and block spam calls.",
    descriptionBn: "অচেনা কলদাতার পরিচয় জানা ও স্প্যাম ব্লক।"
  },
  {
    id: "shareit",
    name: "SHAREit: File Transfer & Share",
    nameBn: "শেয়ারইট (SHAREit)",
    category: "utility",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Shareit_logo.png",
    webUrl: "https://www.ushareit.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.lenovo.anyshare.gps",
    description: "Fast offline file sharing without internet.",
    descriptionBn: "ইন্টারনেট ছাড়া দ্রুত ফাইল ও অ্যাপ শেয়ার।"
  },
  {
    id: "mxplayer",
    name: "MX Player - Video Player",
    nameBn: "এমএক্স প্লেয়ার",
    category: "entertainment",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/e/eb/MX_Player_Logo.png",
    webUrl: "https://www.mxplayer.in",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.mxtech.videoplayer.ad",
    description: "Powerful video player with subtitle support.",
    descriptionBn: "এইচডি ভিডিও প্লেয়ার ও অনলাইন বিনোদন।"
  },
  {
    id: "snapseed",
    name: "Snapseed Photo Editor",
    nameBn: "স্ন্যাপসিড (Snapseed)",
    category: "productivity",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/7/70/Snapseed_logo.png",
    webUrl: "https://support.google.com/snapseed",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.niksoftware.snapseed",
    description: "Professional quality photo editing from Google.",
    descriptionBn: "গুগলের প্রফেশনাল ছবি এডিটিং অ্যাপ।"
  },
  {
    id: "wps_office",
    name: "WPS Office: Docs, PDF, Sheet",
    nameBn: "ডব্লিউপিএস অফিস (WPS)",
    category: "productivity",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4e/WPS_Office_logo.svg",
    webUrl: "https://www.wps.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=cn.wps.moffice_eng",
    description: "All-in-one complete free office suite.",
    descriptionBn: "ওয়ার্ড, এক্সেল ও পাওয়ারপয়েন্ট ফাইল ওপেন ও এডিট।"
  },
  {
    id: "inshot",
    name: "InShot - Video Editor",
    nameBn: "ইনশট (InShot)",
    category: "productivity",
    iconUrl: "https://play-lh.googleusercontent.com/inshot",
    webUrl: "https://inshot.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.camerasideas.instashot",
    description: "HD video maker and photo editor with music.",
    descriptionBn: "স্ট্যাটাস ও রিলস বানানোর চমৎকার ভিডিও এডিটর।"
  },
  {
    id: "shikho",
    name: "Shikho: Learning App",
    nameBn: "শিখো (Shikho)",
    category: "education",
    iconUrl: "https://play-lh.googleusercontent.com/shikho",
    webUrl: "https://shikho.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.shikho.bd",
    description: "Animation based study app for SSC & HSC.",
    descriptionBn: "এসএসসি ও এইচএসসি শিক্ষার্থীদের অনলাইন লার্নিং।"
  },
  {
    id: "medex",
    name: "MedEx: Medicine & Health Info",
    nameBn: "মেডেক্স (MedEx)",
    category: "utility",
    iconUrl: "https://medex.com.bd/img/logo.png",
    webUrl: "https://medex.com.bd",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.medex.app",
    description: "Bangladesh medicine directory and doctor search.",
    descriptionBn: "ঔষধের ব্যবহার ও দাম জানার সেরা বাংলা অ্যাপ।"
  },
  {
    id: "arogga",
    name: "Arogga: Online Pharmacy",
    nameBn: "আরোগ্য (Arogga)",
    category: "shopping",
    iconUrl: "https://play-lh.googleusercontent.com/arogga",
    webUrl: "https://www.arogga.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.arogga.app",
    description: "Order medicine online with home delivery.",
    descriptionBn: "ঘরে বসে ডিসকাউন্টে প্রয়োজনীয় ঔষধ অর্ডার করুন।"
  },
  {
    id: "speedtest",
    name: "Speedtest by Ookla",
    nameBn: "স্পিডটেস্ট (Speedtest)",
    category: "utility",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Ookla_Speedtest_Logo.png",
    webUrl: "https://www.speedtest.net",
    playStoreUrl: "https://play.google.com/store/apps/details?id=org.zwanoo.android.speedtest",
    description: "Test your internet speed and connectivity.",
    descriptionBn: "ইন্টারনেট ও ওয়াইফাই স্পিড পরীক্ষা করুন।"
  },
  {
    id: "evernote",
    name: "Evernote: Note Organizer",
    nameBn: "এভারনোট (Evernote)",
    category: "productivity",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/4/46/Evernote_Icon_2018.svg",
    webUrl: "https://evernote.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.evernote",
    description: "Organize notes, schedules and ideas easily.",
    descriptionBn: "জরুরি নোট ও কাজের তালিকা সংরক্ষণ করুন।"
  },
  {
    id: "microsoft_office",
    name: "Microsoft 365 (Office)",
    nameBn: "মাইক্রোসফট অফিস",
    category: "productivity",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Microsoft_365_%282022%29.svg",
    webUrl: "https://www.office.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.microsoft.office.officehubrow",
    description: "Word, Excel, PowerPoint in one app.",
    descriptionBn: "অফিসিয়াল কাজ ও ডকুমেন্ট এডিটের মূল অ্যাপ।"
  },
  {
    id: "weather_app",
    name: "AccuWeather",
    nameBn: "অ্যাকিউওয়েদার",
    category: "utility",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4e/AccuWeather_Logo.svg",
    webUrl: "https://www.accuweather.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.accuweather.android",
    description: "Local weather alerts, radar and forecast.",
    descriptionBn: "বৃষ্টি ও আবহাওয়ার তাৎক্ষণিক পূর্বাভাস।"
  },
  {
    id: "vlc",
    name: "VLC for Android",
    nameBn: "ভিএলসি প্লেয়ার (VLC)",
    category: "entertainment",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/3/38/VLC_icon.png",
    webUrl: "https://www.videolan.org",
    playStoreUrl: "https://play.google.com/store/apps/details?id=org.videolan.vlc",
    description: "Free and open-source media player for all video codecs.",
    descriptionBn: "সব ফরম্যাটের ভিডিও ও অডিও দেখার ফ্রি প্লেয়ার।"
  }
];