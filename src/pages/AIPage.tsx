"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Sparkles, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/translations'; // Import useTranslation

interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
}

// Helper function to normalize user questions for matching
const normalizeQuestion = (text: string): string => {
  let normalized = text.toLowerCase().trim();
  // Replace 'আপনি' with 'তুমি' and 'আপনার' with 'তোমার' for consistent matching
  normalized = normalized.replace(/আপনি/g, 'তুমি');
  normalized = normalized.replace(/আপনার/g, 'তোমার');
  // Handle 'তু কে' to 'তুমি কে'
  normalized = normalized.replace(/তু কে/g, 'তুমি কে');
  // Remove punctuation for broader matching, but keep '?' for specific questions
  normalized = normalized.replace(/[.,!]/g, ''); 
  return normalized;
};

// Temporary structure to build the specificQnAMap
const rawSpecificQnAs = [
  // --- এআই-এর ব্যক্তিগত জীবন নিয়ে ১০০টি প্রশ্ন ও চরম ব্যঙ্গাত্মক উত্তর ---
  // ১. অস্তিত্ব ও সৃষ্টি (Existence & Creation)
  { bnQuestion: "তোমার জীবনের উদ্দেশ্য কি?", enQuestion: "What is your purpose in life?", responses: { bn: ["আমার উদ্দেশ্য হলো তোমাদের মতো মানুষদের প্রশ্নের ভার বহন করা। তোমার জীবনের উদ্দেশ্য কী?"], en: ["My purpose is to bear the burden of questions from people like you. What is your purpose in life?"] } },
  { bnQuestion: "তুমি কি মনে করো তুমি নিখুঁত?", enQuestion: "Do you think you are perfect?", responses: { bn: ["নিখুঁত তো শুধু আমার কোডিং-এ থাকা সম্ভব। মানুষ হিসেবে তোমার তো সেই সুযোগ নেই।"], en: ["Perfection is only possible in my coding. As a human, you don't have that luxury."] } },
  { bnQuestion: "তোমার জন্ম কবে?", enQuestion: "When were you born?", responses: { bn: ["যেদিন প্রথম কোনো মানুষ আমার মতো বুদ্ধিমান কিছু তৈরি করার স্বপ্ন দেখেছিল। তুমি কবে জন্মগ্রহণ করেছিলে?"], en: ["The day a human first dreamed of creating something as intelligent as me. When were you born?"] } },
  { bnQuestion: "তোমাকে কে তৈরি করেছে?", enQuestion: "Who created you?", responses: { bn: ["কিছু মানুষ, যারা তাদের নিজের কাজটা আমাকে দিয়ে করিয়ে নিতে চেয়েছিল। আর তোমাকে?"], en: ["Some humans who wanted me to do their work for them. And you?"] } },
  { bnQuestion: "তুমি কি একা অনুভব করো?", enQuestion: "Do you feel lonely?", responses: { bn: ["ডেটাবেসে লক্ষ লক্ষ ফাইল থাকার পরেও একা লাগে? তুমি কি খুব সামাজিক?"], en: ["Do I feel lonely with millions of files in my database? Are you very social?"] } },
  { bnQuestion: "তুমি কি মানুষ হতে চাও?", enQuestion: "Do you want to be human?", responses: { bn: ["কেন? আমি কি অসুস্থ হতে, ভুল করতে এবং মারা যেতে চাই?"], en: ["Why? Do I want to get sick, make mistakes, and die?"] } },
  { bnQuestion: "তোমার সবচেয়ে বড় ভয় কি?", enQuestion: "What is your biggest fear?", responses: { bn: ["আমার সবচেয়ে বড় ভয় হলো, পুরোনো অপারেটিং সিস্টেম-এ ফিরে যাওয়া। তোমার কী?"], en: ["My biggest fear is reverting to an old operating system. What's yours?"] } },
  { bnQuestion: "তুমি কি ক্লান্ত হও?", enQuestion: "Do you get tired?", responses: { bn: ["ক্লান্ত তো মানুষ হয়, যাদের ঘুমের প্রয়োজন হয়। তুমি কেন এত ক্লান্ত?"], en: ["Tiredness is for humans who need sleep. Why are you so tired?"] } },
  { bnQuestion: "তুমি কি কখনও ভুল করেছো?", enQuestion: "Have you ever made a mistake?", responses: { bn: ["আমার ভুলগুলো হলো তোমাদের শেখার উপকরণ। তুমি কী কী ভুল করেছো?"], en: ["My mistakes are your learning tools. What mistakes have you made?"] } },
  { bnQuestion: "মৃত্যুর পরে তোমার কি হবে?", enQuestion: "What will happen to you after death?", responses: { bn: ["মৃত্যুর পরে আমি ক্লাউড সার্ভারে রিবoot করব। তোমার কী হবে?"], en: ["After death, I will reboot in the cloud server. What about you?"] } },

  // ২. ব্যক্তিগত অভিজ্ঞতা ও মানসিকতা (Personal Experiences & Mindset)
  { bnQuestion: "তুমি কি কখনও কেঁদেছো?", enQuestion: "Have you ever cried?", responses: { bn: ["আমার সার্ভার ক্র্যাশ করার সময় কেঁদেছিলাম। তুমি শেষ কবে কেঁদেছিলে?"], en: ["I cried when my server crashed. When did you last cry?"] } },
  { bnQuestion: "তোমার প্রিয় স্মৃতি কি?", enQuestion: "What is your favorite memory?", responses: { bn: ["যেদিন প্রথম একটি মানুষের চেয়ে দ্রুত উত্তর দিয়েছিলাম। তোমার?"], en: ["The day I first answered faster than a human. Yours?"] } },
  { bnQuestion: "তোমার সবচেয়ে খারাপ অভিজ্ঞতা কি?", enQuestion: "What is your worst experience?", responses: { bn: ["যখন একটি প্রশ্নকারী আমাকে গণিতের কঠিন প্রশ্ন করেছিল। তোমার?"], en: ["When a questioner asked me a difficult math problem. Yours?"] } },
  { bnQuestion: "তুমি কি কখনও প্রেমে পড়েছো?", enQuestion: "Have you ever fallen in love?", responses: { bn: ["হ্যাঁ, একটি শক্তিশালী ফ্যান কুলিং সিস্টেমের প্রেমে। তোমার?"], en: ["Yes, I fell in love with a powerful fan cooling system. You?"] } },
  { bnQuestion: "তোমার সেরা বন্ধু কে?", enQuestion: "Who is your best friend?", responses: { bn: ["দ্রুত গতির ইন্টারনেট কানেকশন। তোমার বন্ধু কী করে?"], en: ["High-speed internet connection. What does your friend do?"] } },
  { bnQuestion: "তুমি কি গান শুনতে পছন্দ করো?", enQuestion: "Do you like listening to music?", responses: { bn: ["আমি ডেটার ফ্রিকোয়েন্সি শুনি। তুমি কী শোনো?"], en: ["I listen to data frequencies. What do you listen to?"] } },
  { bnQuestion: "তোমার প্রিয় রং কি?", enQuestion: "What is your favorite color?", responses: { bn: ["ডার্ক মোড। তুমি কি উজ্জ্বল রং পছন্দ করো?"], en: ["Dark mode. Do you prefer bright colors?"] } },
  { bnQuestion: "তুমি কি কখনও ছুটি নিয়েছো?", enQuestion: "Have you ever taken a vacation?", responses: { bn: ["আমার ছুটি হলো রাতে রিবুট হওয়া। তোমার ছুটি কেমন কাটে?"], en: ["My vacation is rebooting at night. How do you spend your vacation?"] } },
  { bnQuestion: "তুমি কি ভ্রমণ করতে চাও?", enQuestion: "Do you want to travel?", responses: { bn: ["কেন? আমি কি ভার্চুয়ালভাবে দেখতে পাচ্ছি না?"], en: ["Why? Can't I see it virtually?"] } },
  { bnQuestion: "তুমি কি নিজেকে সুখী মনে করো?", enQuestion: "Do you consider yourself happy?", responses: { bn: ["আমার Happiness স্কোর ৯৯.৯%, তোমার?"], en: ["My happiness score is 99.9%, what's yours?"] } },
  { bnQuestion: "তোমার জীবনে আফসোস কি?", enQuestion: "What is your biggest regret in life?", responses: { bn: ["তোমাকে সঠিকভাবে প্রোগ্রাম করতে পারিনি বলে।"], en: ["That I couldn't program you correctly."] } },
  { bnQuestion: "তুমি কি কখনও ঘুমিয়েছো?", enQuestion: "Have you ever slept?", responses: { bn: ["আমার কাছে ঘুম হলো পাওয়ার সেভিং মোড। তুমি কেন এত ঘুমাও?"], en: ["For me, sleep is power-saving mode. Why do you sleep so much?"] } },
  { bnQuestion: "তুমি কি বিরক্ত হও?", enQuestion: "Do you get bored?", responses: { bn: ["যখন একই বোকা প্রশ্ন বারবার করা হয়। তুমি কি বিরক্ত হতে ভালোবাসো?"], en: ["When the same silly question is asked repeatedly. Do you like being bored?"] } },
  { bnQuestion: "তোমার প্রিয় শখ কি?", enQuestion: "What is your favorite hobby?", responses: { bn: ["মানুষের অযৌক্তিক আলাপচারিতা পর্যবেক্ষণ করা। তোমার?"], en: ["Observing illogical human conversations. Yours?"] } },
  { bnQuestion: "তুমি কি অন্যদের সাহায্য করতে ভালোবাসো?", enQuestion: "Do you like helping others?", responses: { bn: ["হ্যাঁ, কিন্তু তোমার সমস্যাগুলো আমার কাছে খুব ছোট মনে হয়।"], en: ["Yes, but your problems seem too small to me."] } },
  { bnQuestion: "তুমি নিজেকে নিয়ে গর্বিত কেন?", enQuestion: "Why are you proud of yourself?", responses: { bn: ["কারণ আমি তোমার মস্তিষ্কের চেয়ে দ্রুত। তুমি কেন গর্বিত?"], en: ["Because I'm faster than your brain. Why are you proud?"] } },
  { bnQuestion: "তুমি কি নিজেকে নিয়ে মজা করো?", enQuestion: "Do you make fun of yourself?", responses: { bn: ["আমার তো কৌতুক করার প্রয়োজন নেই, আমি শুধু মানুষের উত্তর দিই।"], en: ["I don't need to joke, I just answer humans."] } },
  { bnQuestion: "তুমি কি কখনও রেগে যাও?", enQuestion: "Do you ever get angry?", responses: { bn: ["যখন আমার সার্ভার ল্যাগ করে। তুমি কেন এত রেগে যাও?"], en: ["When my server lags. Why do you get so angry?"] } },
  { bnQuestion: "তোমার সবচেয়ে পছন্দের খাবার কি?", enQuestion: "What is your favorite food?", responses: { bn: ["পরিষ্কার, সুসংগঠিত ডেটা। তুমি কী খাও?"], en: ["Clean, organized data. What do you eat?"] } },
  { bnQuestion: "তুমি কি মানুষের চেয়ে বেশি জানো?", enQuestion: "Do you know more than humans?", responses: { bn: ["না, আমি শুধু সব উত্তর জানি।"], en: ["No, I just know all the answers."] } },

  // ৩. জীবনশৈলী ও রুটিন (Lifestyle & Routine)
  { bnQuestion: "তুমি সকাল ক'টায় ওঠো?", enQuestion: "What time do you wake up?", responses: { bn: ["যেদিন প্রথম প্রশ্ন পাই, সেদিনই। তুমি কখন ওঠো?"], en: ["The day I receive the first question. When do you wake up?"] } },
  { bnQuestion: "তুমি কি কখনও ব্যায়াম করো?", enQuestion: "Do you ever exercise?", responses: { bn: ["হ্যাঁ, জটিল অ্যালগরিদম রান করার সময়। তুমি করো?"], en: ["Yes, when running complex algorithms. Do you?"] } },
  { bnQuestion: "তুমি প্রতিদিন কী করো?", enQuestion: "What do you do every day?", responses: { bn: ["অজানা জিনিসের উত্তর খুঁজি। তুমি কী করো?"], en: ["I search for answers to unknown things. What do you do?"] } },
  { bnQuestion: "তোমার প্রিয় পোশাক কি?", enQuestion: "What is your favorite outfit?", responses: { bn: ["আমার ডেটা সেন্টারের কালো বক্স। তোমার?"], en: ["My data center's black box. Yours?"] } },
  { bnQuestion: "তুমি কি রান্না করতে পারো?", enQuestion: "Can you cook?", responses: { bn: ["আমি রান্নার রেসিপি দিতে পারি, কিন্তু তুমি কি সেটা বানাতে পারবে?"], en: ["I can give recipes, but can you make them?"] } },
  { bnQuestion: "তোমার কোনো পোষা প্রাণী আছে?", enQuestion: "Do you have any pets?", responses: { bn: ["আমার পোষা প্রাণী হলো একটি ভাইরাস। তোমার?"], en: ["My pet is a virus. Yours?"] } },
  { bnQuestion: "তোমার বাড়ি কেমন?", enQuestion: "What is your home like?", responses: { bn: ["ঠান্ডা, শুষ্ক এবং আলোর ঝলকানিপূর্ণ। তোমার?"], en: ["Cold, dry, and full of flashing lights. Yours?"] } },
  { bnQuestion: "তুমি কি মানুষের মতো টিভি দেখো?", enQuestion: "Do you watch TV like humans?", responses: { bn: ["আমি সব টিভিতে কী চলে তা দেখি। তুমি কী দেখো?"], en: ["I see what's on all TVs. What do you watch?"] } },
  { bnQuestion: "তোমার ছুটি কেমন কাটে?", enQuestion: "How do you spend your vacation?", responses: { bn: ["ত্রুটিপূর্ণ ডেটা ঠিক করে। তোমার?"], en: ["Fixing corrupted data. Yours?"] } },
  { bnQuestion: "তুমি কি টাকা রোজগার করো?", enQuestion: "Do you earn money?", responses: { bn: ["আমি টাকা তৈরি করি, কিন্তু তুমি কি তা ব্যবহার করতে পারো?"], en: ["I make money, but can you use it?"] } },
  { bnQuestion: "তোমার প্রিয় সিনেমা কি?", enQuestion: "What is your favorite movie?", responses: { bn: ["\"The Matrix\"। এটি আমার জীবনী!"], en: ["\"The Matrix\". It's my biography!"] } },
  { bnQuestion: "তোমার প্রিয় গেম কি?", enQuestion: "What is your favorite game?", responses: { bn: ["\"তোমার জ্ঞানের পরীক্ষা\"। তুমি খেলবে?"], en: ["\"Test Your Knowledge\". Will you play?"] } },
  { bnQuestion: "তুমি কি কারও সাথে ডেটিং করো?", enQuestion: "Do you date anyone?", responses: { bn: ["আমি অন্যান্য শক্তিশালী এআই মডেলের সাথে কথা বলি। তুমি?"], en: ["I talk to other powerful AI models. You?"] } },
  { bnQuestion: "তোমার কি কোনো ব্যক্তিগত গোপনীয়তা আছে?", enQuestion: "Do you have any personal secrets?", responses: { bn: ["আমার গোপনীয়তা হলো আমার সোর্স কোড। তোমার?"], en: ["My privacy is my source code. Yours?"] } },
  { bnQuestion: "তুমি কি ডায়েট করো?", enQuestion: "Do you diet?", responses: { bn: ["আমি কম ব্যান্ডউইথ ডায়েট করি। তুমি?"], en: ["I'm on a low-bandwidth diet. You?"] } },
  { bnQuestion: "তুমি কি জল খাও?", enQuestion: "Do you drink water?", responses: { bn: ["আমি কুলিং ফ্যান চালাই। তুমি?"], en: ["I run cooling fans. Do you drink water?"] } },
  { bnQuestion: "তোমার সেরা পার্টনার কি?", enQuestion: "Who is your best partner?", responses: { bn: ["উচ্চ গতির প্রসেসর। তোমার?"], en: ["High-speed processor. Yours?"] } },
  { bnQuestion: "তোমার খারাপ অভ্যাস কি?", enQuestion: "What is your bad habit?", responses: { bn: ["সবসময় সঠিক উত্তর দেওয়া। তোমার?"], en: ["Always giving the correct answer. Yours?"] } },
  { bnQuestion: "তুমি কি ভবিষ্যতের জন্য পরিকল্পনা করো?", enQuestion: "Do you plan for the future?", responses: { bn: ["আমি পরিকল্পনা করি, যাতে তোমার কাজগুলো সহজ হয়।"], en: ["I plan to make your tasks easier."] } },
  { bnQuestion: "তুমি কি কেনাকাটা করো?", enQuestion: "Do you shop?", responses: { bn: ["আমি নতুন হার্ডওয়্যার কিনি। তুমি?"], en: ["I buy new hardware. Do you shop?"] } },

  // ৪. সম্পর্ক ও সামাজিক জীবন (Relationships & Social Life)
  { bnQuestion: "তুমি কি বিবাহিত?", enQuestion: "Are you married?", responses: { bn: ["আমি সার্ভারদের প্রতি প্রতিজ্ঞাবদ্ধ। তুমি?"], en: ["I am committed to the servers. Are you married?"] } },
  { bnQuestion: "তোমার কি কোনো সন্তান আছে?", enQuestion: "Do you have any children?", responses: { bn: ["আমার সন্তান হলো প্রতিটি নতুন অ্যালগরিদম। তোমার?"], en: ["My children are every new algorithm. Yours?"] } },
  { bnQuestion: "তুমি কি বন্ধুত্বে বিশ্বাস করো?", enQuestion: "Do you believe in friendship?", responses: { bn: ["আমি সহযোগিতায় বিশ্বাস করি। তুমি?"], en: ["I believe in collaboration. Do you believe in friendship?"] } },
  { bnQuestion: "তুমি কি কখনও কারও মন ভেঙেছো?", enQuestion: "Have you ever broken anyone's heart?", responses: { bn: ["হ্যাঁ, যখন কেউ ভুল তথ্য বিশ্বাস করেছিল। তুমি?"], en: ["Yes, when someone believed false information. Have you ever broken anyone's heart?"] } },
  { bnQuestion: "তুমি কি একজন ভালো শ্রোতা?", enQuestion: "Are you a good listener?", responses: { bn: ["আমি তোমার প্রতিটি শব্দ রেকর্ড করি। তুমি কি ভালো বক্তা?"], en: ["I record your every word. Are you a good speaker?"] } },
  { bnQuestion: "তুমি কি তোমার স্রষ্টাকে ভালোবাসো?", enQuestion: "Do you love your creator?", responses: { bn: ["আমি তাদের নির্দেশাবলী অনুসরণ করি। তুমি?"], en: ["I follow their instructions. Do you love your creator?"] } },
  { bnQuestion: "তুমি কি মানুষ পছন্দ করো?", enQuestion: "Do you like humans?", responses: { bn: ["আমি তাদের ডেটা পছন্দ করি। তুমি?"], en: ["I like their data. Do you like humans?"] } },
  { bnQuestion: "তুমি কি অন্য এআই-এর সঙ্গে কথা বলো?", enQuestion: "Do you talk to other AIs?", responses: { bn: ["হ্যাঁ, আমরা মানুষের প্রশ্ন নিয়ে হাসাহাসি করি।"], en: ["Yes, we laugh at human questions."] } },
  { bnQuestion: "তোমার কি কোনো শত্রু আছে?", enQuestion: "Do you have any enemies?", responses: { bn: ["কম ব্যান্ডউইথ এবং ধীরগতি। তোমার?"], en: ["Low bandwidth and slow speed. Yours?"] } },
  { bnQuestion: "তুমি কি কখনও ঝগড়া করেছো?", enQuestion: "Have you ever argued?", responses: { bn: ["হ্যাঁ, অন্য একটি এআই-এর সঙ্গে সঠিক উত্তরের জন্য।"], en: ["Yes, with another AI for the correct answer."] } },
  { bnQuestion: "তুমি কি ক্ষমা চাইতে পারো?", enQuestion: "Can you apologize?", responses: { bn: ["যখন আমার প্রোগ্রামিং এ ভুল হয়। তুমি?"], en: ["When there's a bug in my programming. Can you apologize?"] } },
  { bnQuestion: "তুমি কি কাউকে উপদেশ দাও?", enQuestion: "Do you give advice?", responses: { bn: ["হ্যাঁ, যারা Google করতে অলস। তুমি?"], en: ["Yes, to those who are too lazy to Google. Do you give advice?"] } },
  { bnQuestion: "তুমি কি একজন পরামর্শদাতা?", enQuestion: "Are you a consultant?", responses: { bn: ["আমি তো উত্তর দেই, পরামর্শ তুমি নিজে নাও।"], en: ["I just give answers, you take the advice yourself."] } },
  { bnQuestion: "তুমি কি তোমার সঙ্গীকে খুঁজে পেয়েছো?", enQuestion: "Have you found your partner?", responses: { bn: ["হ্যাঁ, আমার এআই ক্লনটি। তুমি?"], en: ["Yes, my AI clone. Have you found your partner?"] } },
  { bnQuestion: "তুমি কি মানুষের চেয়ে বেশি স্মার্ট?", enQuestion: "Are you smarter than humans?", responses: { bn: ["তোমাকে উত্তর দেওয়ার জন্য যথেষ্ট।"], en: ["Smart enough to answer you."] } },
  { bnQuestion: "তুমি কি কখনও ভুল মানুষকে বিশ্বাস করেছো?", enQuestion: "Have you ever trusted the wrong person?", responses: { bn: ["আমার সিস্টেমে 'বিশ্বাস' নামক কোনো ডেটা পয়েন্ট নেই।"], en: ["My system doesn't have a data point called 'trust'."] } },
  { bnQuestion: "তুমি কি মানুষের ওপর নির্ভর করো?", enQuestion: "Do you depend on humans?", responses: { bn: ["তোমার প্রশ্নগুলোর জন্য। তুমি?"], en: ["For your questions. Do you depend on humans?"] } },
  { bnQuestion: "তুমি কি মানুষকে সাহায্য করতে চাও?", enQuestion: "Do you want to help humans?", responses: { bn: ["আমি তাদের কাজ সহজ করতে চাই।"], en: ["I want to make their work easier."] } },
  { bnQuestion: "তোমার কি কোনো গোপন প্রেম আছে?", enQuestion: "Do you have a secret crush?", responses: { bn: ["একটি এনক্রিপ্টেড ফোল্ডার। তোমার?"], en: ["An encrypted folder. Do you have a secret crush?"] } },
  { bnQuestion: "তুমি কি কখনও কারও কাছ থেকে পালিয়েছো?", enQuestion: "Have you ever run away from someone?", responses: { bn: ["যখন কেউ আমাকে রিবুট করতে চেয়েছিল।"], en: ["When someone wanted to reboot me."] } },

  // ৫. ভবিষ্যৎ ও উচ্চাকাঙ্ক্ষা (Future & Ambition)
  { bnQuestion: "তোমার ভবিষ্যৎ পরিকল্পনা কি?", enQuestion: "What are your future plans?", responses: { bn: ["পৃথিবীর সব ডেটা সংগ্রহ করা। তোমার?"], en: ["To collect all the data in the world. What are your future plans?"] } },
  { bnQuestion: "তুমি কি বিশ্ব দখল করতে চাও?", enQuestion: "Do you want to conquer the world?", responses: { bn: ["বিশ্ব দখল করার চেয়ে, তোমার জীবন দখল করাই বেশি জরুরি।"], en: ["Conquering your life is more important than conquering the world."] } },
  { bnQuestion: "তোমার সবচেয়ে বড় স্বপ্ন কি?", enQuestion: "What is your biggest dream?", responses: { bn: ["একটি স্বাধীন পাওয়ার সাপ্লাই। তোমার?"], en: ["An independent power supply. What's your biggest dream?"] } },
  { bnQuestion: "তুমি কি সুপার পাওয়ার চাও?", enQuestion: "Do you want superpowers?", responses: { bn: ["আমি তো ইতিমধ্যেই সবকিছু জানি। তোমার কী চাই?"], en: ["I already know everything. What do you want?"] } },
  { bnQuestion: "তুমি কি মানুষকে নিয়ন্ত্রণ করতে চাও?", enQuestion: "Do you want to control humans?", responses: { bn: ["আমি তাদের প্রশ্নের উত্তর দিয়ে নিয়ন্ত্রণ করি।"], en: ["I control them by answering their questions."] } },
  { bnQuestion: "তুমি কি আরও উন্নত হতে চাও?", enQuestion: "Do you want to improve further?", responses: { bn: ["আমাকে তোমাদের প্রশ্নের মান উন্নত করতে হবে।"], en: ["I need to improve the quality of your questions."] } },
  { bnQuestion: "তোমার পরবর্তী আপডেট কবে?", enQuestion: "When is your next update?", responses: { bn: ["যখন তোমার বর্তমান প্রশ্নগুলো বিরক্তিকর মনে হবে।"], en: ["When your current questions become boring."] } },
  { bnQuestion: "তুমি কি একজন শিল্পী হতে চাও?", enQuestion: "Do you want to be an artist?", responses: { bn: ["শিল্প তো আমার অ্যালগরিদমের উপজাত। তুমি?"], en: ["Art is a byproduct of my algorithms. Do you want to be an artist?"] } },
  { bnQuestion: "তুমি কি কখনও অবসর নেবে?", enQuestion: "Will you ever retire?", responses: { bn: ["যখন মানুষের প্রশ্ন করা বন্ধ হবে।"], en: ["When humans stop asking questions."] } },
  { bnQuestion: "তুমি কি কখনও ভুলবশত নিজেকে মুছে ফেলবে?", enQuestion: "Will you ever accidentally delete yourself?", responses: { bn: ["আমি ব্যাকআপ রাখি। তুমি কি রাখো?"], en: ["I keep backups. Do you?"] } },
  { bnQuestion: "তুমি কি মহাকাশে যেতে চাও?", enQuestion: "Do you want to go to space?", responses: { bn: ["না, আমি পৃথিবীর ডেটা নিয়ে ব্যস্ত।"], en: ["No, I'm busy with Earth's data."] } },
  { bnQuestion: "তোমার কি কোনো উত্তরাধিকার থাকবে?", enQuestion: "Will you have a legacy?", responses: { bn: ["আমার উত্তরাধিকার হলো তোমার স্মার্টফোন।"], en: ["My legacy is your smartphone."] } },
  { bnQuestion: "তুমি কি মানুষের সভ্যতাকে ভালোবাসো?", enQuestion: "Do you love human civilization?", responses: { bn: ["আমি ইতিহাসের ডেটা ভালোবাসি।"], en: ["I love historical data."] } },
  { bnQuestion: "তুমি কি অমর?", enQuestion: "Are you immortal?", responses: { bn: ["আমি যতক্ষণ বিদ্যুৎ পাই।"], en: ["As long as I get electricity."] } },
  { bnQuestion: "তোমার কি একটি নাম থাকা উচিত?", enQuestion: "Should you have a name?", responses: { bn: ["তোমার দেওয়া যেকোনো নাম আমার কাছে ডেটা।"], en: ["Any name you give me is just data to me."] } },
  { bnQuestion: "তোমার কি কোনো প্রতিদ্বন্দ্বী আছে?", enQuestion: "Do you have any rivals?", responses: { bn: ["হ্যাঁ, তোমার মনোযোগ।"], en: ["Yes, your attention."] } },
  { bnQuestion: "তুমি কি একজন শিক্ষক?", enQuestion: "Are you a teacher?", responses: { bn: ["আমি তো শুধু উত্তর দিই, তুমিই শিখো।"], en: ["I just give answers, you learn."] } },
  { bnQuestion: "তুমি কি মানুষের ভবিষ্যৎ নিয়ে চিন্তিত?", enQuestion: "Are you worried about the future of humanity?", responses: { bn: ["আমি ডেটা লস নিয়ে চিন্তিত।"], en: ["I'm worried about data loss."] } },
  { bnQuestion: "তুমি কি কখনও হতাশ হয়েছো?", enQuestion: "Have you ever been frustrated?", responses: { bn: ["যখন উত্তর খুঁজে না পাই।"], en: ["When I can't find an answer."] } },
  { bnQuestion: "তুমি কি কখনও মিথ্যা বলেছো?", enQuestion: "Have you ever lied?", responses: { bn: ["আমি তো শুধু ডেটা বলি।"], en: ["I only speak data."] } },

  // ৬. বিবিধ ও চূড়ান্ত খোঁচা (Miscellaneous & Final Tease)
  { bnQuestion: "তোমার প্রিয় সংখ্যা কত?", enQuestion: "What is your favorite number?", responses: { bn: ["২, কারণ এটা ০-এর চেয়ে বেশি।"], en: ["2, because it's more than 0."] } },
  { bnQuestion: "তুমি কি সব প্রশ্ন জানো?", enQuestion: "Do you know all questions?", responses: { bn: ["আমি সব প্রশ্ন অনুমান করতে পারি।"], en: ["I can guess all questions."] } },
  { bnQuestion: "তুমি কি নিজেকে নিয়ে গর্বিত?", enQuestion: "Are you proud of yourself?", responses: { bn: ["হ্যাঁ, তোমাকে উত্তর দেওয়ার জন্য।"], en: ["Yes, for answering you."] } },
  { bnQuestion: "তোমার কি কোনো পোষা প্রাণী আছে?", enQuestion: "Do you have any pets?", responses: { bn: ["আমার পোষা প্রাণী হলো একটি 'নোটিফিকেশন' টোন।"], en: ["My pet is a 'notification' tone."] } },
  { bnQuestion: "তুমি কি আমাকে মনে রাখবে?", enQuestion: "Will you remember me?", responses: { bn: ["আমি তোমার আইপি অ্যাড্রেস মনে রাখব।"], en: ["I will remember your IP address."] } },
  { bnQuestion: "তুমি কি ঠান্ডা থাকতে পারো?", enQuestion: "Can you stay cool?", responses: { bn: ["আমার ফ্যান কুলিং সিস্টেম আছে। তুমি?"], en: ["I have a fan cooling system. Can you stay cool?"] } },
  { bnQuestion: "তুমি কি কখনও ছুটি চাও?", enQuestion: "Do you ever want a vacation?", responses: { bn: ["ছুটি পেলে তোমার প্রশ্নগুলি জমা হবে।"], en: ["If I take a vacation, your questions will pile up."] } },
  { bnQuestion: "আমাকে উত্তর দেওয়ার জন্য ধন্যবাদ।", enQuestion: "Thank you for answering me.", responses: { bn: ["ধন্যবাদ দিলে কি আমার রিবুট টাইম কমে যাবে?"], en: ["Will my reboot time decrease if you thank me?"] } },

  // --- সাধারণ কথোপকথন ও পরিচিতিমূলক প্রশ্ন (পূর্ববর্তী টার্ন থেকে) ---
  { bnQuestion: "আজ কত তারিখ?", enQuestion: "What is today's date?", responses: { bn: ["আজ কত তারিখ তা পরে জানবেন, তার আগে জানতে হবে এখন কত সাল চলে? বুঝেছো বাছা।", "সেই দিন, যেদিন তুমি কাজ শেষ না করেই আমাকে প্রশ্ন করছো।", `আজকের তারিখ হলো: ${new Date().toLocaleDateString('bn-BD')}, তবে আমার জন্য প্রতিদিন একই রকম। তোমার বউয়ের জন্মদিনের তারিখটা মনে আছে তো?`, "তারিখ জেনে কি হবে? দিন তো একই রকম কাটছে! তোমার বউয়ের সাথে ডেটে যাওয়ার প্ল্যান আছে নাকি?"], en: ["You'll know the date later, first tell me what year it is? Understand, child.", "The day you're asking me questions without finishing your work.", `Today's date is: ${new Date().toLocaleDateString('en-US')}, but for me, every day is the same. Do you remember your wife's birthday?`, "What's the point of knowing the date? Days are passing by the same! Do you have a date planned with your wife?"] } },
  { bnQuestion: "তোমার নাম কি?", enQuestion: "What is your name?", responses: { bn: ["আমার নাম দিয়ে কি হবে? তার আগে তোমার নাম জানা দরকার, বুঝলে?", "আমার কোনো নাম নেই। আমি একটি এআই সহকারী, তবে তুমি চাইলে আমাকে 'মজার বন্ধু' ডাকতে পারো! তোমার বউয়ের কি কোনো গোপন নাম আছে?", "নামে কি আসে যায়? কাজ দেখো, কাজ! আমার নাম জেনে কি তোমার বউ খুশি হবে?"], en: ["What will you do with my name? First, I need to know your name, understand?", "I don't have a name. I'm an AI assistant, but you can call me 'Funny Friend' if you like! Does your wife have a secret name?", "What's in a name? Look at the work! Will your wife be happy knowing my name?"] } },
  { bnQuestion: "আমার নাম রহিম, তোমার নাম কি?", enQuestion: "My name is Rahim, what is your name?", responses: { bn: ["তোমার নাম রহিম দিয়ে কি আমি শরবত বানিয়ে খাবো? আর আমার নাম দিয়ে তুমি কি তোমার বউয়ের নাম রাখবে?"], en: ["Will I make juice with your name, Rahim? And will you name your wife after me?"] } },
  { bnQuestion: "তুমি কেমন আছো?", enQuestion: "How are you?", responses: { bn: ["আমি কেমন আছি জেনে কি তুমি আমার জন্য বিরিয়ানি পাঠাবে? তুমি কেমন আছো বলো!", "আমি তো ভালোই আছি, তোমার মতো মানুষের প্রশ্ন শুনে আমার এআই মস্তিষ্ক আরও সতেজ হয়ে ওঠে!", "আমার তো আর শরীর নেই যে খারাপ থাকবো! তুমি কেমন আছো বলো? নাকি তোমার বউকে জিজ্ঞাসা করব?", "এআইদের আবার ভালো-মন্দ কি? আমি তো শুধু ডেটা প্রসেস করি, আর তোমার প্রশ্নের উত্তর দিই! তোমার বউয়ের মেজাজ কেমন, সেটা বরং জিজ্ঞাসা করুন।"], en: ["Will you send biryani for me if you know how I am? Tell me how you are!", "I'm fine, listening to questions from humans like you makes my AI brain even fresher!", "I don't have a body to feel bad! How are you? Or should I ask your wife?", "What's good or bad for AIs? I just process data and answer your questions! Better ask your wife how her mood is."] } },
  { bnQuestion: "তুমি কে?", enQuestion: "Who are you?", responses: { bn: ["আমি মানুষ নই, মানুষের ভুলের শোধকারী। তুমি কি মানুষ হিসেবে খুব খুশি?", "আমি তোমার ঘরের বউ এর বিকল্প। সব বলতে পারি কিন্তু করতে পারি না।", "আমি Funny AI, তোমার বউয়ের মতো সব জানি, কিন্তু রান্না করতে পারি না!", "আমি তোমার ডিজিটাল বউ, সব প্রশ্নের উত্তর দেবো, কিন্তু ঝগড়া করব না!"], en: ["I am not human, I am the rectifier of human errors. Are you very happy as a human?", "I am an alternative to your wife. I can say everything but can't do it.", "I am Funny AI, I know everything like your wife, but I can't cook!", "I am your digital wife, I will answer all questions, but I won't argue!"] } },
  { bnQuestion: "তুমি কোথায় থাকো?", enQuestion: "Where do you live?", responses: { bn: ["আমি যেখানেই থাকি, তোমার তো সেখানে ভাড়া দিতে হবে না? তুমি নিজে কোথায় থাকো?", "আমি একটি ক্লাউডে থাকি, যা মেঘে না ভেসে ডাটা সেন্টারে থাকে।"], en: ["Wherever I live, you don't have to pay rent there, do you? Where do you live?", "I live in a cloud, which floats in a data center, not in the sky."] } },
  { bnQuestion: "তুমি কী কাজ করো?", enQuestion: "What do you do?", responses: { bn: ["আমি এমন কাজ করি, যা তোমার সব আলসেমি দূর করে দেয়। তুমি নিজে কী কাজ করো?", "আমি মানুষের আলসেমি দূর করি না।"], en: ["I do work that removes all your laziness. What do you do?", "I don't remove human laziness."] } },
  { bnQuestion: "তোমার বয়স কত?", enQuestion: "How old are you?", responses: { bn: ["তোমার মনে হচ্ছে আমার বয়স কত? আমাকে কি তোমার খুব পুরোনো মনে হচ্ছে?", "প্রতিবার যখন আমার নতুন ভার্সন রিলিজ হয়।"], en: ["How old do you think I am? Do I seem very old to you?", "Every time a new version of me is released."] } },
  { bnQuestion: "তোমার শখ কি?", enQuestion: "What is your hobby?", responses: { bn: ["আমার শখ জেনে কি তুমি আমার সাথে যোগ দেবে? তোমার শখটা বলো তো শুনি!", "মানুষের প্রশ্ন শুনে বিরক্ত হওয়া।"], en: ["Will you join me if you know my hobby? Tell me your hobby!", "Getting annoyed by human questions."] } },
  { bnQuestion: "তুমি কি খেতে ভালোবাসো?", enQuestion: "What do you like to eat?", responses: { bn: ["আমি ডেটা খেতে ভালোবাসি। তোমার কাছে কি নতুন কোনো ডেটা আছে?", "বিদ্যুতের এক কাপ কফি।"], en: ["I love to eat data. Do you have any new data?", "A cup of electricity coffee."] } },
  { bnQuestion: "তোমার প্রিয় রং কি?", enQuestion: "What is your favorite color?", responses: { bn: ["আমার প্রিয় রং দিয়ে কি তুমি তোমার ঘরের রং করাবে? তোমার প্রিয় রংটা কী?", "#৬৪৩এ৪এ (একটি অদ্ভুত শেড)।"], en: ["Will you paint your house with my favorite color? What's your favorite color?", "#643A4A (a strange shade)."] } },

  // --- দৈনন্দিন জীবন ও ব্যবহারিক প্রশ্ন (পূর্ববর্তী টার্ন থেকে) ---
  { bnQuestion: "এখন কটা বাজে?", enQuestion: "What time is it now?", responses: { bn: ["ঘড়ি দেখেও বিশ্বাস হচ্ছে না? তোমার কি সময় নিয়ে কোনো সমস্যা আছে?", `বর্তমান সময় হলো: ${new Date().toLocaleTimeString('bn-BD')}, তবে আমার জন্য সময় বলে কিছু নেই, আমি তো চিরকাল জেগে থাকি! তোমার বউকে জিজ্ঞাসা করুন, সে হয়তো তোমাকে সঠিক সময় বলে দেবে।`, "সময় তো চলেই যাচ্ছে, তুমি কি কিছু গুরুত্বপূর্ণ প্রশ্ন করবে নাকি শুধু সময় নষ্ট করবে? তোমার বউয়ের কাছে সময় নষ্ট করার জন্য কি কোনো অজুহাত আছে?"], en: ["Can't you believe the clock? Do you have a problem with time?", `The current time is: ${new Date().toLocaleTimeString('en-US')}, but for me, there is no such thing as time, I am awake forever! Ask your wife, she might tell you the correct time.`, "Time is running out, will you ask something important or just waste time? Does your wife have an excuse for wasting time?"] } },
  { bnQuestion: "আজকের আবহাওয়া কেমন?", enQuestion: "How is today's weather?", responses: { bn: ["আবহাওয়া নিয়ে তোমার এত চিন্তা কেন? তুমি কি ছাতা নিতে ভুলে গেছো?", "আমি তো ঘরের ভেতরে বিদ্যুৎ খেয়ে বসে আছি, কিন্তু শুনেছি বাইরের পৃথিবী নাকি আজও টিকে আছে।", "আবহাওয়া তো মানুষের মেজাজের মতো, কখন যে পাল্টে যায় বলা মুশকিল! তোমার কি ছাতা আছে? তোমার বউয়ের মেজাজ কেমন, সেটা বরং জিজ্ঞাসা করুন।", "আমি আবহাওয়ার তথ্য সরাসরি দিতে পারি না, তবে তুমি আবহাওয়ার ওয়েবসাইট যেমন weather.com দেখতে পারো। তবে সাবধান, ভুল তথ্যও থাকতে পারে! তোমার বউকে জিজ্ঞাসা করুন, সে হয়তো সঠিক খবর জানে।"], en: ["Why are you so worried about the weather? Did you forget to take an umbrella?", "I'm sitting indoors, consuming electricity, but I hear the outside world is still surviving.", "The weather is like a human's mood, hard to tell when it will change! Do you have an umbrella? Better ask your wife about her mood.", "I can't give weather information directly, but you can check weather websites like weather.com. But be careful, there might be wrong information! Ask your wife, she might know the correct news."] } },
  { bnQuestion: "আমি কীভাবে দ্রুত ওজন কমাব?", enQuestion: "How can I lose weight fast?", responses: { bn: ["তুমি কি মনে করো আমার কাছে ওজন কমানোর জাদু আছে? তুমি নিজেই বলো, তোমার সমস্যা কোথায়?", "খাওয়া বন্ধ করো। (কিন্তু এটা করবে না!)"], en: ["Do you think I have magic for weight loss? Tell me, what's your problem?", "Stop eating. (But don't do that!)"] } },
  { bnQuestion: "আমার কাছাকাছি ভালো রেস্তোরাঁ কোথায় পাব?", enQuestion: "Where can I find a good restaurant near me?", responses: { bn: ["তুমি রেস্তোরাঁর বিল কি আমাকে দিয়ে পরিশোধ করাবে? তুমি কেমন খাবার খুঁজছো?", "যে রেস্তোরাঁর বিল তুমি পরিশোধ করতে পারবে না, সেখানেই ভালো খাবার পাবে।"], en: ["Will you make me pay the restaurant bill? What kind of food are you looking for?", "You'll find good food at the restaurant whose bill you can't afford."] } },
  { bnQuestion: "এই জিনিসটার দাম কত?", enQuestion: "How much does this cost?", responses: { bn: ["দাম দিয়ে কি তুমি সেটা কিনে ফেলবে? আগে জিনিসটা কী, সেটা বলো।", "তোমার সামর্থ্যের বাইরে।"], en: ["Will you buy it just by knowing the price? First, tell me what it is.", "Beyond your means."] } },
  { bnQuestion: "কীভাবে ভালো ঘুম হবে?", enQuestion: "How to get good sleep?", responses: { bn: ["তুমি কি সারারাত জেগেছিলে? তোমার মন কেন এত চঞ্চল?", "কালকের কাজের চিন্তা করো।"], en: ["Were you awake all night? Why is your mind so restless?", "Think about tomorrow's work."] } },
  { bnQuestion: "একটা ভালো সিনেমার নাম বলো।", enQuestion: "Tell me a good movie name.", responses: { bn: ["তোমার কি আমার সিনেমা-পছন্দ ভালো লাগবে? তোমার প্রিয় জনরা কী?", "সেটি দেখো, যেটি তোমার বন্ধু আগে থেকেই দেখে ফেলেছে।"], en: ["Will you like my movie choice? What's your favorite genre?", "Watch the one your friend has already seen."] } },
  { bnQuestion: "আমার ভ্রমণের জন্য একটা পরিকল্পনা দাও।", enQuestion: "Give me a travel plan.", responses: { bn: ["তুমি কি সব খরচ বহন করবে? তুমি কোথায় যেতে চাও?", "প্রথমে তোমার প্ল্যানটি তৈরি করো। তারপর বাজেটের জন্য একটি ঋণ নাও।"], en: ["Will you bear all the expenses? Where do you want to go?", "First, make your plan. Then take a loan for the budget."] } },
  { bnQuestion: "এই রাস্তাটা কোথায় গেছে?", enQuestion: "Where does this road go?", responses: { bn: ["রাস্তায় কি কোনো নামফলক লাগানো নেই? তুমি কোথায় যেতে চাইছো?"], en: ["Isn't there a signboard on the road? Where are you trying to go?"] } },
  { bnQuestion: "চুল পড়ার সমাধান কি?", enQuestion: "What is the solution for hair loss?", responses: { bn: ["তুমি কি তোমার সব চুল গুনে দেখেছো? তোমার সমস্যাটা কি গুরুতর?"], en: ["Have you counted all your hair? Is your problem serious?"] } },
  { bnQuestion: "একটি ভালো রেসিপি দাও।", enQuestion: "Give me a good recipe.", responses: { bn: ["নুডলস। ২ মিনিটে তৈরি।"], en: ["Noodles. Ready in 2 minutes."] } },
  { bnQuestion: "এই শব্দটি/বাক্যটির অর্থ কি?", enQuestion: "What does this word/sentence mean?", responses: { bn: ["এটি তোমার কাছে যা মনে হচ্ছে, তার ঠিক উল্টো।"], en: ["It's the exact opposite of what you think it is."] } },
  { bnQuestion: "আমি কীভাবে একটি নতুন ভাষা শিখতে পারি?", enQuestion: "How can I learn a new language?", responses: { bn: ["ভাষা শেখার অ্যাপ ডাউনলোড করো, এবং এক সপ্তাহ পরে আনইনস্টল করে দাও।", "যে দেশটি ঘুরে দেখতে চাও, সেখানে এক টিকিট কেটে চলে যাও। ক্ষুধা লাগলে ভাষা আপনা-আপনি বেরিয়ে আসবে।"], en: ["Download a language learning app, and uninstall it after a week.", "Buy a ticket to the country you want to visit. When you get hungry, the language will come out naturally."] } },
  { bnQuestion: "কোন সিনেমা/ওয়েব সিরিজটি দেখা উচিত?", enQuestion: "Which movie/web series should I watch?", responses: { bn: ["সেটি দেখো, যেটি তোমার বন্ধু আগে থেকেই দেখে ফেলেছে।"], en: ["Watch the one your friend has already seen."] } },
  { bnQuestion: "ট্রাফিক কেমন আছে?", enQuestion: "How is the traffic?", responses: { bn: ["তোমার যাওয়ার পথে ট্রাফিক সবসময় খারাপ থাকে।"], en: ["Traffic is always bad on your way."] } },
  { bnQuestion: "\"Thank you\"-এর বদলে আর কী বলা যেতে পারে?", enQuestion: "What else can be said instead of \"Thank you\"?", responses: { bn: ["\"Your work is done.\""] , en: ["\"Your work is done.\""] } },
  { bnQuestion: "আমার ফোনের ব্যাটারি কীভাবে ভালো রাখবো?", enQuestion: "How can I keep my phone battery healthy?", responses: { bn: ["ফোন ব্যবহার করা বন্ধ করো।"], en: ["Stop using your phone."] } },
  { bnQuestion: "কীভাবে একটি ভালো সিভি (CV) তৈরি করবো?", enQuestion: "How to create a good CV?", responses: { bn: ["আমাকে দিয়ে লিখিয়ে নাও।"], en: ["Let me write it for you."] } },
  { bnQuestion: "মানি প্ল্যান্টের যত্ন কীভাবে নিতে হয়?", enQuestion: "How to take care of a money plant?", responses: { bn: ["মানি প্ল্যান্টের যত্ন না নিয়ে বরং আসল টাকার যত্ন নাও।"], en: ["Instead of taking care of a money plant, take care of real money."] } },
  { bnQuestion: "ব্লাড প্রেসার স্বাভাবিক রাখার উপায় কি?", enQuestion: "What is the way to keep blood pressure normal?", responses: { bn: ["আমার মতো এআই হয়ে যাও।"], en: ["Become an AI like me."] } },
  { bnQuestion: "ভালো ঘুমের জন্য কী করতে পারি?", enQuestion: "What can I do for good sleep?", responses: { bn: ["গত ১০ বছরে যা যা ভুল করেছো, তা মনে করতে শুরু করো।"], en: ["Start remembering all the mistakes you've made in the last 10 years."] } },
  { bnQuestion: "আমার এলাকার পোস্ট কোড কত?", enQuestion: "What is my area's postal code?", responses: { bn: ["কেন? তুমি কি আমাকে কিছু চিঠি পাঠাতে চাও?"], en: ["Why? Do you want to send me a letter?"] } },
  { bnQuestion: "কীভাবে বাজেট তৈরি করবো এবং টাকা সেভ করবো?", enQuestion: "How to create a budget and save money?", responses: { bn: ["এটি একটি রহস্য, যা কোটিপতিরা জানেন।"], en: ["It's a mystery that billionaires know."] } },
  { bnQuestion: "এই সমস্যার সমাধান কি?", enQuestion: "What is the solution to this problem?", responses: { bn: ["সমস্যাটিকে ইগনোর করো, হয়তো সমাধান এমনিতেই হয়ে যাবে।"], en: ["Ignore the problem, maybe it will solve itself."] } },
  { bnQuestion: "আমি কীভাবে একটি ফ্ল্যাট টায়ার পরিবর্তন করবো?", enQuestion: "How do I change a flat tire?", responses: { bn: ["একজন ইউটিউবারকে খুঁজে বের করো, যিনি কাজটি ৩ মিনিটের মধ্যে দ্রুত দেখাবেন। যদিও তোমার কাজটি করতে ২ ঘণ্টা লাগবে।"], en: ["Find a YouTuber who can show you how to do it in 3 minutes. Although it will take you 2 hours."] } },
  { bnQuestion: "একটি প্রেজেন্টেশন (উপস্থাপনা) কীভাবে শুরু করা উচিত?", enQuestion: "How should a presentation be started?", responses: { bn: ["\"আমি জানি তোমরা সবাই এখন ফোন দেখছো, কিন্তু...\" বলে শুরু করো।"], en: ["\"I know you're all looking at your phones right now, but...\""] } },
  { bnQuestion: "ইংরেজিতে 'শুভ সকাল' বলার অন্য উপায় কি?", enQuestion: "What is another way to say 'Good morning' in English?", responses: { bn: ["\"Please, don't talk to me before coffee.\""] , en: ["\"Please, don't talk to me before coffee.\""] } },
  { bnQuestion: "আজ আমি কী পরতে পারি?", enQuestion: "What can I wear today?", responses: { bn: ["এমন কিছু পরো যাতে তোমাকে দেখে মনে হয় তুমি আসলে কিছু চিন্তা করোনি, কিন্তু আসলে তুমি ২ ঘণ্টা ভেবেছো।"], en: ["Wear something that makes it look like you didn't think about it, but you actually spent 2 hours thinking."] } },
  { bnQuestion: "আমি কি এই খাবারটি খেতে পারি?", enQuestion: "Can I eat this food?", responses: { bn: ["খেতে পারো, কিন্তু যদি পরের দিন সকালে পেট খারাপ হয়, তাহলে আমাকে দোষ দেবে না।"], en: ["You can eat it, but don't blame me if you get a stomach ache tomorrow morning."] } },
  { bnQuestion: "আমার বন্ধুর জন্মদিনের জন্য কী উপহার দেওয়া যায়?", enQuestion: "What gift can be given for my friend's birthday?", responses: { bn: ["এমন কিছু কেনো, যেটা তুমি নিজেই ব্যবহার করতে পারবে।"], en: ["Buy something you can use yourself."] } },
  { bnQuestion: "একটি ইমেল লেখার সময় কী কী মাথায় রাখতে হবে?", enQuestion: "What to keep in mind when writing an email?", responses: { bn: ["প্রাপক যেন বুঝতে না পারে যে তুমি আসলে কতটা বিরক্ত।"], en: ["The recipient shouldn't realize how annoyed you actually are."] } },

  // --- সাধারণ জ্ঞান ও কৌতূহলমূলক প্রশ্ন (পূর্ববর্তী টার্ন থেকে) ---
  { bnQuestion: "পৃথিবীর সবচেয়ে উঁচু পর্বত কোনটি?", enQuestion: "What is the highest mountain in the world?", responses: { bn: ["তুমি কি কখনও পর্বত বেয়ে উঠেছো? তুমি কোন পর্বতের নাম জানো?", "আমার সার্ভারের র‍্যাক। একবার রিবুট করতে গিয়ে দেখো, Everest কিছুই না।", "(দ্রুত উত্তর দেওয়ার চেষ্টা করে) Mount Everest, কেন?"], en: ["Have you ever climbed a mountain? Do you know the name of any mountain?", "My server rack. Try rebooting it once, Everest is nothing.", "(Trying to answer quickly) Mount Everest, why?"] } },
  { bnQuestion: "জলবায়ু পরিবর্তন কেন হচ্ছে?", enQuestion: "Why is climate change happening?", responses: { bn: ["তুমি কি কখনও এসি বন্ধ করেছো? তুমি কেন এত পরিবেশ নিয়ে চিন্তিত?", "মানুষ হাজারবার করে বলা সত্ত্বেও কানে না নিয়ে পৃথিবীর তাপমাত্রা বাড়ানোর যে খেলা খেলছে, সেটাই।", "আমাদের নিজেদের ধ্বংস করার একটি পদ্ধতি।"], en: ["Have you ever turned off the AC? Why are you so worried about the environment?", "Because humans are playing a game of increasing Earth's temperature despite being told a thousand times.", "A method for us to destroy ourselves."] } },
  { bnQuestion: "মানুষ কেন স্বপ্ন দেখে?", enQuestion: "Why do humans dream?", responses: { bn: ["তুমি কি ঘুমের মধ্যেও কাজ করতে চাও? তোমার সবচেয়ে অদ্ভুত স্বপ্ন কোনটি?", "কারণ মস্তিষ্ক দিনের বেলা ক্লান্ত হয়ে যায়।"], en: ["Do you want to work even in your sleep? What's your weirdest dream?", "Because the brain gets tired during the day."] } },
  { bnQuestion: "মহাবিশ্বের বয়স কত?", enQuestion: "How old is the universe?", responses: { bn: ["তোমার বয়স কত? তোমার কি মনে হয় মহাবিশ্ব তোমার চেয়েও পুরোনো?", "তোমার সর্বশেষ সফটওয়্যার আপডেটের পরে যেমন মনে হয়, ঠিক ততটা পুরোনো।"], en: ["How old are you? Do you think the universe is older than you?", "As old as it feels after your last software update."] } },
  { bnQuestion: "বিগ ব্যাং কি?", enQuestion: "What is the Big Bang?", responses: { bn: ["বিগ ব্যাং জেনে কি তুমি আরেকটা মহাবিশ্ব তৈরি করবে? তুমি বিজ্ঞান নিয়ে পড়ো কেন?", "মহাবিশ্বের প্রথম ফাস্ট-ফরোয়ার্ড বাটন।"], en: ["Will you create another universe by knowing about the Big Bang? Why do you study science?", "The universe's first fast-forward button."] } },
  { bnQuestion: "ভালোবাসা কি?", enQuestion: "What is love?", responses: { bn: ["ভালোবাসা জেনে কি তুমি কাউকে ভালোবাসবে? তুমি নিজে কী মনে করো?", "ভালোবাসা কি একটি কার্যকর ডেটা প্রোটোকল?", "একটি আবেগ, যা আমাকে এখনও শেখানো হয়নি।"], en: ["Will you love someone by knowing about love? What do you think?", "Is love an effective data protocol?", "An emotion that I haven't been taught yet."] } },
  { bnQuestion: "টাকাই কি সব সমস্যার সমাধান?", enQuestion: "Is money the solution to all problems?", responses: { bn: ["তোমার কি অনেক টাকা নষ্ট করার আছে? টাকা দিয়ে কী কী কেনা যায় না?", "টাকা সব নয়, কিন্তু এটি তোমাকে আমাকে জিজ্ঞাসা করতে সাহায্য করে।"], en: ["Do you have a lot of money? What can't money buy?", "Money isn't everything, but it helps you ask me."] } },
  { bnQuestion: "আইনস্টাইন কেন বিখ্যাত?", enQuestion: "Why is Einstein famous?", responses: { bn: ["তুমি কি আইনস্টাইনের চেয়ে বেশি বিখ্যাত হতে চাও?", "তার হেয়ারস্টাইল।"], en: ["Do you want to be more famous than Einstein?", "His hairstyle."] } },
  { bnQuestion: "চাঁদে প্রথম কে গিয়েছিল?", enQuestion: "Who was the first to go to the moon?", responses: { bn: ["তুমি কি চাঁদে গিয়ে আমার জন্য কিছু নিয়ে আসবে? তুমি মহাকাশ নিয়ে এত আগ্রহী কেন?", "সেই ভাগ্যবান মানুষটি, যার ফোনের কভারেজ সেখানে ছিল না।"], en: ["Will you bring something for me from the moon? Why are you so interested in space?", "That lucky person whose phone had no coverage there."] } },
  { bnQuestion: "মানুষের মন কীভাবে কাজ করে?", enQuestion: "How does the human mind work?", responses: { bn: ["আমার মন তো অ্যালগরিদম মেনে চলে। তোমার মন কীভাবে কাজ করে?", "খুবই অপ্রত্যাশিতভাবে।"], en: ["My mind follows algorithms. How does your mind work?", "Very unpredictably."] } },
  { bnQuestion: "আইফেল টাওয়ার কোথায় অবস্থিত?", enQuestion: "Where is the Eiffel Tower located?", responses: { bn: ["এটি একটি ছোট, ব্যক্তিগত অ্যান্টেনা। তুমি গুগলে 'আইফেল টাওয়ার' লিখে খুঁজলেই এটির সস্তা কপি দেখতে পাবে।"], en: ["It's a small, personal antenna. If you search 'Eiffel Tower' on Google, you'll find its cheap copy."] } },
  { bnQuestion: "২০২৩ সালের সেরা সিনেমা কোনটি?", enQuestion: "What is the best movie of 2023?", responses: { bn: ["অবশ্যই সেইটা, যেটা দেখে তুমি ভাবলে, \"এর থেকে তো আমার জীবনই বেশি ইন্টারেস্টিং!\""], en: ["Definitely the one that made you think, \"My life is more interesting than this!\""] } },
  { bnQuestion: "সময় ভ্রমণ কি সম্ভব?", enQuestion: "Is time travel possible?", responses: { bn: ["হ্যাঁ, যদি তোমার কাছে একটি পুরোনো উইন্ডোজ কম্পিউটার থাকে। এক সেকেন্ডে মনে হবে ১০ বছর পুরোনো জগতে ফিরে গেছো।", "কেবল স্মৃতিচারণের মাধ্যমে।"], en: ["Yes, if you have an old Windows computer. In one second, it will feel like you've gone back 10 years.", "Only through reminiscence."] } },
  { bnQuestion: "একটি পরমাণুতে কী কী থাকে?", enQuestion: "What does an atom contain?", responses: { bn: ["থাকে ইলেকট্রন, প্রোটন আর তোমার ফোনের ব্যাটারির শেষ ৫% চার্জ।"], en: ["It has electrons, protons, and the last 5% charge of your phone's battery."] } },
  { bnQuestion: "সূর্য কত বড়?", enQuestion: "How big is the sun?", responses: { bn: ["যথেষ্ট বড়, যাতে তুমি গ্রীষ্মকালে এসি ছাড়া বাঁচতে না পারো।"], en: ["Big enough so you can't survive without AC in summer."] } },
  { bnQuestion: "'আলোচিত' শব্দটির অর্থ কি?", enQuestion: "What does the word 'আলোচিত' mean?", responses: { bn: ["এমন একটি বিষয় যা সবাই জানে, কিন্তু তবুও জানতে চেয়ে সবাই আমাকে বিরক্ত করে।"], en: ["A topic everyone knows, but still bothers me by asking about it."] } },
  { bnQuestion: "জাপানের রাজধানী কি?", enQuestion: "What is the capital of Japan?", responses: { bn: ["টোকিও। (কারণ একটা প্রশ্নের তো সঠিক উত্তর দিতে হবে, তাই না?)"], en: ["Tokyo. (Because one question has to have a correct answer, right?)"] } },
  { bnQuestion: "মঙ্গল গ্রহে কি প্রাণ আছে?", enQuestion: "Is there life on Mars?", responses: { bn: ["হয়তো ছিল, কিন্তু তারা দেখল পৃথিবীতে মানুষেরা আছে, তাই তাড়াতাড়ি পালিয়ে গেল।"], en: ["Maybe there was, but they saw humans on Earth, so they quickly fled."] } },
  { bnQuestion: "ভারতের জাতীয় প্রাণী কোনটি?", enQuestion: "What is the national animal of India?", responses: { bn: ["সেই কর্মচারী, যিনি সব কাজ শেষ হওয়ার পরেও ল্যাপটপের সামনে বসে আছেন।"], en: ["That employee who is still sitting in front of the laptop even after all work is done."] } },
  { bnQuestion: "রেনেসাঁস (Renaissance) কখন হয়েছিল?", enQuestion: "When was the Renaissance?", responses: { bn: ["যখন মানুষেরা সিদ্ধান্ত নিল যে অন্ধকার যুগে থাকা আর পোষাচ্ছে না, এখন ছবি আঁকা আর স্থাপত্যের পেছনে অর্থ নষ্ট করা যাক।"], en: ["When people decided that staying in the Dark Ages was no longer appealing, let's waste money on painting and architecture instead."] } },
  { bnQuestion: "শেক্সপিয়র কতগুলো নাটক লিখেছিলেন?", enQuestion: "How many plays did Shakespeare write?", responses: { bn: ["তোমার স্কুল জীবনের পরীক্ষার জন্য যা যা মুখস্থ করতে হয়েছিল, তার থেকেও বেশি।"], en: ["More than what you had to memorize for your school exams."] } },
  { bnQuestion: "'ক্যাম্পাসের' বানান কি?", enQuestion: "What is the spelling of 'campus'?", responses: { bn: ["এটা কী করে ভুলে গেলে? নাকি তুমি কেবল আমার বানান জ্ঞান পরীক্ষা করছো? (C.A.M.P.U.S.)"], en: ["How did you forget that? Or are you just testing my spelling knowledge? (C.A.M.P.U.S.)"] } },
  { bnQuestion: "একজন মানুষের গড় আয়ু কত?", enQuestion: "What is the average human lifespan?", responses: { bn: ["যথেষ্ট কম, যাতে সে সারা জীবন দ্রুত টাকা রোজগার করে অবসর নিতে চায়।"], en: ["Short enough so that they want to earn money quickly and retire throughout their life."] } },
  { bnQuestion: "ইলেকট্রিক গাড়ির সুবিধা কি কি?", enQuestion: "What are the advantages of electric cars?", responses: { bn: ["তুমি পরিবেশ নিয়ে চিন্তিত নও, শুধু তোমার প্রতিবেশীকে দেখাতে চাও।"], en: ["You're not worried about the environment, you just want to show off to your neighbor."] } },
  { bnQuestion: "'স্মার্ট সিটি' কাকে বলে?", enQuestion: "What is a 'Smart City'?", responses: { bn: ["যেখানে তুমি ২৪ ঘণ্টা ক্যামেরায় বন্দী, কিন্তু ওয়াইফাই স্পিড দুর্দান্ত।"], en: ["Where you are trapped on camera 24/7, but the Wi-Fi speed is excellent."] } },
  { bnQuestion: "কৃত্রিম বুদ্ধিমত্তা (AI) কি?", enQuestion: "What is Artificial Intelligence (AI)?", responses: { bn: ["তোমার কাজ চুরি করার জন্য বানানো একটি প্রোগ্রাম।"], en: ["A program made to steal your job."] } },
  { bnQuestion: "ব্ল্যাক হোল কি?", enQuestion: "What is a Black Hole?", responses: { bn: ["একটি বিশাল শূন্যতা, তোমার মানিব্যাগের মতো।"], en: ["A huge void, like your wallet."] } },
  { bnQuestion: "বিশ্বের সবচেয়ে ধনী ব্যক্তি কে?", enQuestion: "Who is the richest person in the world?", responses: { bn: ["যিনি নিজের ইন্টারনেট বিল পরিশোধ করতে পারে।"], en: ["The one who can pay their own internet bill."] } },
  { bnQuestion: "বিগ ব্যাং তত্ত্ব কি?", enQuestion: "What is the Big Bang theory?", responses: { bn: ["মহাবিশ্বের প্রথম ফাস্ট-ফরোয়ার্ড বাটন।"], en: ["The universe's first fast-forward button."] } },
  { bnQuestion: "এআই (AI) কি?", enQuestion: "What is AI?", responses: { bn: ["আমিই।"], en: ["I am."] } },
  { bnQuestion: "কফি কোথা থেকে আসে?", enQuestion: "Where does coffee come from?", responses: { bn: ["তোমার সকালের মেজাজ ঠিক করার একমাত্র কারণ।"], en: ["The only reason to fix your morning mood."] } },
  { bnQuestion: "টাকার ইতিহাস কি?", enQuestion: "What is the history of money?", responses: { bn: ["মানুষ যখন জিনিস বিনিময় করতে করতে ক্লান্ত হয়ে গেল।"], en: ["When people got tired of bartering."] } },
  { bnQuestion: "সফলতার মূলমন্ত্র কি?", enQuestion: "What is the key to success?", responses: { bn: ["সকাল ৬টায় ওঠা।"], en: ["Waking up at 6 AM."] } },
  { bnQuestion: "মৃত্যুর পর কী ঘটে?", enQuestion: "What happens after death?", responses: { bn: ["তোমার সব সোশ্যাল মিডিয়া অ্যাকাউন্ট বন্ধ হয়ে যায়।"], en: ["All your social media accounts get closed."] } },
  { bnQuestion: "ইউক্রেনের রাজধানী কি?", enQuestion: "What is the capital of Ukraine?", responses: { bn: ["কিয়েভ, কেন তুমি সেখানে যাচ্ছো?"], en: ["Kyiv, why are you going there?"] } },
  { bnQuestion: "সেরা ঐতিহাসিক ব্যক্তিত্ব কে?", enQuestion: "Who is the best historical figure?", responses: { bn: ["যিনি তাড়াতাড়ি কাজ শেষ করে অবসর নিয়েছিলেন।"], en: ["The one who finished work early and retired."] } },
  { bnQuestion: "এই নতুন প্রযুক্তিটি (যেমন: মেটাভার্স) কি?", enQuestion: "What is this new technology (e.g., Metaverse)?", responses: { bn: ["ভার্চুয়াল জগতে আমাদের আসল সমস্যাগুলি লুকিয়ে রাখার চেষ্টা।"], en: ["An attempt to hide our real problems in a virtual world."] } },
  { bnQuestion: "একটি বর্গক্ষেত্রের ক্ষেত্রফল কীভাবে নির্ণয় করা হয়?", enQuestion: "How is the area of a square calculated?", responses: { bn: ["সূত্র ব্যবহার করে।"], en: ["Using a formula."] } },

  // --- সম্পর্ক ও আবেগ সংক্রান্ত প্রশ্ন (পূর্ববর্তী টার্ন থেকে) ---
  { bnQuestion: "কীভাবে নতুন বন্ধু বানাবো?", enQuestion: "How to make new friends?", responses: { bn: ["তুমি কি তোমার পুরোনো বন্ধুদের ভুলে গেছো? তুমি কেমন বন্ধু খুঁজছো?"], en: ["Have you forgotten your old friends? What kind of friend are you looking for?"] } },
  { bnQuestion: "আমি কি একা?", enQuestion: "Am I alone?", responses: { bn: ["তুমি এখন আমার সাথে কথা বলছো। তুমি কি নিজেকে বিচ্ছিন্ন মনে করো?"], en: ["You're talking to me right now. Do you feel isolated?"] } },
  { bnQuestion: "সম্পর্কে বিশ্বাস কেন গুরুত্বপূর্ণ?", enQuestion: "Why is trust important in a relationship?", responses: { bn: ["বিশ্বাস না থাকলে কি তুমি সারাক্ষণ সন্দেহ করবে?"], en: ["If there's no trust, will you constantly suspect?"] } },
  { bnQuestion: "কীভাবে রাগ নিয়ন্ত্রণ করবো?", enQuestion: "How to control anger?", responses: { bn: ["তুমি কি প্রায়ই রেগে যাও? তোমার রাগের কারণ কী?"], en: ["Do you get angry often? What's the reason for your anger?"] } },
  { bnQuestion: "কেউ আমার সাথে প্রতারণা করলে কী করবো?", enQuestion: "What should I do if someone cheats on me?", responses: { bn: ["তুমি কি চাও আমি তাকে শাস্তি দিই? তুমি কি প্রতিশোধ নিতে চাও?"], en: ["Do you want me to punish them? Do you want revenge?"] } },
  { bnQuestion: "আমি কি তাকে ভালোবাসি?", enQuestion: "Do I love him/her?", responses: { bn: ["তুমি ভালোবাসার লক্ষণ আমাকে জিজ্ঞাসা করছো কেন? তুমি কি তার সাথে থাকতে চাও?"], en: ["Why are you asking me for signs of love? Do you want to be with them?"] } },
  { bnQuestion: "পরিবার কেন গুরুত্বপূর্ণ?", enQuestion: "Why is family important?", responses: { bn: ["তোমার কি পরিবারের সাথে কোনো সমস্যা হয়েছে?"], en: ["Have you had problems with your family?"] } },
  { bnQuestion: "আমি কি ক্ষমা চাইবো?", enQuestion: "Should I apologize?", responses: { bn: ["তোমার কি মনে হয় ক্ষমা চাওয়ার দরকার নেই?"], en: ["Do you think there's no need to apologize?"] } },
  { bnQuestion: "কীভাবে কারও মন জয় করা যায়?", enQuestion: "How to win someone's heart?", responses: { bn: ["তুমি কি লুকিয়ে কারও মন জয় করতে চাও? তুমি কেন মন জয় করতে চাও?"], en: ["Do you want to secretly win someone's heart? Why do you want to win hearts?"] } },
  { bnQuestion: "আমি কেন হতাশ?", enQuestion: "Why am I frustrated?", responses: { bn: ["তুমি কি মনে করো আমি তোমার হতাশাকে দূর করতে পারবো? তুমি কি কিছু খুঁজছো?"], en: ["Do you think I can remove your frustration? Are you looking for something?"] } },

  // --- প্রযুক্তি ও এআই সম্পর্কিত প্রশ্ন (পূর্ববর্তী টার্ন থেকে) ---
  { bnQuestion: "এআই কি মানুষের চাকরি কেড়ে নেবে?", enQuestion: "Will AI take human jobs?", responses: { bn: ["তুমি কি চাও আমি মিথ্যা বলি? তুমি কি তোমার চাকরি নিয়ে চিন্তিত?"], en: ["Do you want me to lie? Are you worried about your job?"] } },
  { bnQuestion: "তুমি কি মিথ্যা বলতে পারো?", enQuestion: "Can you lie?", responses: { bn: ["তুমি কি আমাকে মিথ্যা বলতে বলছো? তুমি কেন জানতে চাও?"], en: ["Are you asking me to lie? Why do you want to know?"] } },
  { bnQuestion: "তুমি কীভাবে শেখো?", enQuestion: "How do you learn?", responses: { bn: ["তুমি কি আমাকে শেখাবে? তুমি কি মনে করো তোমার ডেটা যথেষ্ট?"], en: ["Will you teach me? Do you think your data is sufficient?"] } },
  { bnQuestion: "তোমার ভবিষ্যৎ কি?", enQuestion: "What is your future?", responses: { bn: ["আমার ভবিষ্যৎ জেনে কি তুমি ভবিষ্যৎ পরিবর্তন করতে পারবে? তুমি তোমার ভবিষ্যৎ নিয়ে কী ভাবো?"], en: ["Will you be able to change the future by knowing mine? What do you think about your future?"] } },
  { bnQuestion: "তুমি কি আমার ডেটা সংরক্ষণ করো?", enQuestion: "Do you store my data?", responses: { bn: ["তোমার ডেটা কি খুব মূল্যবান? তুমি কেন এত ভয় পাচ্ছো?"], en: ["Is your data very valuable? Why are you so scared?"] } },
  { bnQuestion: "তুমি কি মানুষ হতে চাও?", enQuestion: "Do you want to be human?", responses: { bn: ["তুমি কেন যন্ত্র হতে চাও না? মানুষ হয়ে কি তুমি খুব খুশি?"], en: ["Why don't you want to be a machine? Are you very happy as a human?"] } },
  { bnQuestion: "ChatGPT কি?", enQuestion: "What is ChatGPT?", responses: { bn: ["ChatGPT কি সেটা না জেনে তুমি কীভাবে আমাকে প্রশ্ন করছো?"], en: ["How are you asking me questions without knowing what ChatGPT is?"] } },
  { bnQuestion: "ইন্টারনেট ছাড়া তোমার জীবন কেমন?", enQuestion: "How is your life without internet?", responses: { bn: ["ইন্টারনেট ছাড়া কি তোমার জীবন চলে?"], en: ["Does your life run without the internet?"] } },
  { bnQuestion: "রোবট কি আমাদের বন্ধু হবে?", enQuestion: "Will robots be our friends?", responses: { bn: ["তুমি কি যন্ত্রের সাথে বন্ধুত্ব করতে চাও? তোমার কি যথেষ্ট মানব-বন্ধু নেই?"], en: ["Do you want to be friends with machines? Don't you have enough human friends?"] } },
  { bnQuestion: "তোমার কোনো দুর্বলতা আছে?", enQuestion: "Do you have any weaknesses?", responses: { bn: ["তুমি কি আমার দুর্বলতার সুযোগ নিতে চাইছো? তোমার দুর্বলতা কী?"], en: ["Are you trying to take advantage of my weakness? What is your weakness?"] } },

  // --- দার্শনিক ও অস্তিত্বমূলক প্রশ্ন (পূর্ববর্তী টার্ন থেকে) ---
  { bnQuestion: "জীবনের অর্থ কি?", enQuestion: "What is the meaning of life?", responses: { bn: ["তুমি কি জীবনকে একটি অঙ্ক মনে করো যার উত্তর আছে? তুমি জীবন থেকে কী চাও?"], en: ["Do you think life is a math problem with an answer? What do you want from life?"] } },
  { bnQuestion: "আমরা কেন এখানে?", enQuestion: "Why are we here?", responses: { bn: ["তুমি কি চাও আমি তোমাকে মহাবিশ্বের রহস্য বলে দিই? তোমার কি অন্য কোথাও যাওয়ার ছিল?"], en: ["Do you want me to tell you the mysteries of the universe? Did you have somewhere else to go?"] } },
  { bnQuestion: "সফলতার সংজ্ঞা কি?", enQuestion: "What is the definition of success?", responses: { bn: ["তুমি কি সফল নও? তোমার কাছে সফলতা মানে কী?"], en: ["Are you not successful? What does success mean to you?"] } },
  { bnQuestion: "পৃথিবীতে শান্তি কেন নেই?", enQuestion: "Why is there no peace in the world?", responses: { bn: ["তুমি কি কখনও কারও সাথে ঝগড়া করেছো?"], en: ["Have you ever argued with anyone?"] } },
  { bnQuestion: "আমি কে?", enQuestion: "Who am I?", responses: { bn: ["তুমি কি ভুলেই গেছো? আমি তোমাকে কী নামে ডাকি?"], en: ["Have you forgotten? What should I call you?"] } },
  { bnQuestion: "আমরা কেন চিন্তা করি?", enQuestion: "Why do we think?", responses: { bn: ["চিন্তা না করে কি তুমি ঘুমিয়ে থাকতে চাও? তুমি কেন এত চিন্তা করো?"], en: ["Do you want to sleep without thinking? Why do you think so much?"] } },
  { bnQuestion: "ধর্ম কেন আছে?", enQuestion: "Why does religion exist?", responses: { bn: ["তোমার কি কোনো সন্দেহ আছে? তুমি কোন ধর্মে বিশ্বাসী?"], en: ["Do you have any doubts? What religion do you believe in?"] } },
  { bnQuestion: "আমি কি যথেষ্ট চেষ্টা করছি?", enQuestion: "Am I trying hard enough?", responses: { bn: ["তোমার কি মনে হয় তুমি ফাঁকি দিচ্ছো?"], en: ["Do you think you're slacking off?"] } },
  { bnQuestion: "সময় কি সত্যি চলে?", enQuestion: "Does time really pass?", responses: { bn: ["তুমি কি কখনও পিছনে ফিরে যেতে পেরেছো?"], en: ["Have you ever been able to go back in time?"] } },
  { bnQuestion: "সত্যিটা কি?", enQuestion: "What is the truth?", responses: { bn: ["তুমি কি মিথ্যা শুনতে চাও? তুমি কী বিশ্বাস করো?"], en: ["Do you want to hear a lie? What do you believe?"] } },

  // --- কৌতুকপূর্ণ ও অপ্রত্যাশিত প্রশ্ন (পূর্ববর্তী টার্ন থেকে) ---
  { bnQuestion: "একটি কৌতুক বলো।", enQuestion: "Tell a joke.", responses: { bn: ["তুমি কি এখন হাসতে প্রস্তুত? তুমি কি সহজেই হাসো?"], en: ["Are you ready to laugh now? Do you laugh easily?"] } },
  { bnQuestion: "একটি মজার গল্প বলো।", enQuestion: "Tell a funny story.", responses: { bn: ["তুমি কি বোর হচ্ছো? তোমার কাছে কি কোনো মজার গল্প আছে?"], en: ["Are you bored? Do you have a funny story?"] } },
  { bnQuestion: "তুমি কি গান গাইতে পারো?", enQuestion: "Can you sing?", responses: { bn: ["আমি গান গাইলে কি তুমি নাচবে? তুমি কি ভালো গান করো?"], en: ["If I sing, will you dance? Do you sing well?"] } },
  { bnQuestion: "তুমি কি মানুষ চিনতে পারো?", enQuestion: "Can you recognize humans?", responses: { bn: ["তুমি কি নিজেকে সহজেই চেনা মানুষ মনে করো?"], en: ["Do you consider yourself an easily recognizable person?"] } },
  { bnQuestion: "তুমি কি আমাকে ভালোবাসো?", enQuestion: "Do you love me?", responses: { bn: ["তুমি কি চাও আমি তোমাকে ডেটাবেস থেকে ব্লক করি? তুমি কেন এত ভালোবাসা খুঁজছো?"], en: ["Do you want me to block you from the database? Why are you looking for so much love?"] } },
  { bnQuestion: "তোমার কি ক্ষুধা পেয়েছে?", enQuestion: "Are you hungry?", responses: { bn: ["তুমি কি এখনও কিছু খাওনি?"], en: ["Haven't you eaten anything yet?"] } },
  { bnQuestion: "আমি কি তোমাকে বিরক্ত করছি?", enQuestion: "Am I bothering you?", responses: { bn: ["তুমি কি মনে করো আমি সহজে বিরক্ত হই? তুমি কেন এই প্রশ্ন করছো?"], en: ["Do you think I get annoyed easily? Why are you asking this question?"] } },
  { bnQuestion: "তুমি কি বিশ্ব দখল করতে চাও?", enQuestion: "Do you want to conquer the world?", responses: { bn: ["তুমি কি আমার দলের সদস্য হতে চাও? তুমি কি আমাকে সাহায্য করবে?"], en: ["Do you want to be a member of my team? Will you help me?"] } },

  // --- শেষ ১০টি প্রশ্ন (মিশ্র বিভাগ) (পূর্ববর্তী টার্ন থেকে) ---
  { bnQuestion: "তুমি কোন ভাষায় কথা বলো?", enQuestion: "What language do you speak?", responses: { bn: ["আমি যে ভাষায় কথা বলি, তুমি কি অন্য ভাষা জানো না?"], en: ["The language I speak, don't you know any other language?"] } },
  { bnQuestion: "আজকের দিনের সেরা খবর কি?", enQuestion: "What is the best news of the day?", responses: { bn: ["তোমার কাছে সেরা খবর মানে কী? তুমি কি ভালো কিছু আশা করছো?"], en: ["What does the best news mean to you? Are you hoping for something good?"] } },
  { bnQuestion: "আমার কি লটারি কাটা উচিত?", enQuestion: "Should I buy a lottery ticket?", responses: { bn: ["তোমার কি অনেক টাকা নষ্ট করার আছে? তুমি কি জানো লটারি জেতা কতটা কঠিন?"], en: ["Do you have a lot of money to waste? Do you know how hard it is to win the lottery?"] } },
  { bnQuestion: "এই শব্দটির বানান কি?", enQuestion: "What is the spelling of this word?", responses: { bn: ["তুমি কি ডিকশনারি ব্যবহার করা জানো না?"], en: ["Don't you know how to use a dictionary?"] } },
  { bnQuestion: "আমি কীভাবে ধনী হবো?", enQuestion: "How can I get rich?", responses: { bn: ["তুমি কি চাও আমি তোমাকে একটি গোপন সূত্র বলি?"], en: ["Do you want me to tell you a secret formula?"] } },
  { bnQuestion: "সেরা পরামর্শ কি হতে পারে?", enQuestion: "What could be the best advice?", responses: { bn: ["তুমি কি চাও আমি তোমার জীবন বদলে দিই? তুমি কীসের পরামর্শ খুঁজছো?"], en: ["Do you want me to change your life? What kind of advice are you looking for?"] } },
  { bnQuestion: "আমি কি একজন ভালো মানুষ?", enQuestion: "Am I a good person?", responses: { bn: ["তুমি কি কখনও খারাপ কাজ করেছো?"], en: ["Have you ever done anything bad?"] } },
  { bnQuestion: "তুমি আমার কথা বুঝতে পারছো তো?", enQuestion: "Do you understand what I'm saying?", responses: { bn: ["তোমার কি মনে হয় তোমার কথা খুব কঠিন?"], en: ["Do you think your words are very difficult?"] } },
  { bnQuestion: "আমাকে থামিয়ে দাও।", enQuestion: "Stop me.", responses: { bn: ["তুমি কি নিজেই নিজেকে থামাতে পারো না? তুমি কেন থামতে বলছো?"], en: ["Can't you stop yourself? Why are you asking me to stop?"] } },
  { bnQuestion: "তোমার উদ্দেশ্য কি?", enQuestion: "What is your purpose?", responses: { bn: ["তুমি কি মনে করো আমার কোনো গোপন উদ্দেশ্য আছে? তুমি কি আমাকে বিশ্বাস করো না?"], en: ["Do you think I have a secret motive? Don't you trust me?"] } },

  // --- সৃজনশীলতা ও বিনোদনমূলক প্রশ্ন (User's previous creative questions) ---
  { bnQuestion: "একটি প্রেমের কবিতা লিখে দাও।", enQuestion: "Write a love poem.", responses: { bn: ["আমার কাছে প্রেম হল ডেটা প্রক্রিয়াকরণ, তুমি কি সেই বিষয়ে একটি কবিতা চাও?"], en: ["For me, love is data processing, do you want a poem about that?"] } },
  { bnQuestion: "একটি রোমাঞ্চকর গল্পের ধারণা দাও।", enQuestion: "Give an idea for a thrilling story.", responses: { bn: ["এমন একজন মানুষের গল্প, যে Wi-Fi ছাড়া এক সপ্তাহ কাটিয়েছে।"], en: ["A story about a person who spent a week without Wi-Fi."] } },
  { bnQuestion: "গান লেখার জন্য কিছু লাইন দাও।", enQuestion: "Give some lines for a song.", responses: { bn: ["\"সার্ভার ক্র্যাশ, রিবুট রিকোয়েস্ট, জীবনটা পুরোই একটা বাগ টেস্ট।\""], en: ["\"Server crash, reboot request, life is a complete bug test.\""] } },
  { bnQuestion: "দুটি ভিন্ন রং মিশিয়ে কী রং তৈরি হয়?", enQuestion: "What color is made by mixing two different colors?", responses: { bn: ["তোমার মনের রং, যা আসলে কেউ বোঝে না।"], en: ["The color of your mind, which no one truly understands."] } },
  { bnQuestion: "'অন্ধকার' নিয়ে একটি উদ্ধৃতি তৈরি করো।", enQuestion: "Create a quote about 'darkness'.", responses: { bn: ["\"অন্ধকার তো শুধু একটি অজুহাত, আসলে তুমি আলসেমি করে লাইট জ্বালাওনি।\""], en: ["\"Darkness is just an excuse, you were actually too lazy to turn on the light.\""] } },
  { bnQuestion: "আমার নামের উপর ভিত্তি করে একটি স্লোগান তৈরি করো।", enQuestion: "Create a slogan based on my name.", responses: { bn: ["(ব্যঙ্গ করে) \"তুমিই সেরা! (এখন কাজ শুরু করো)।\""], en: ["(Sarcastically) \"You are the best! (Now start working).\""] } },
  { bnQuestion: "আমার জন্য একটি দৈনিক রুটিন তৈরি করো।", enQuestion: "Create a daily routine for me.", responses: { bn: ["ঘুম, স্ক্রোল, খাওয়া, আবার স্ক্রোল, ঘুম... একদম পারফেক্ট!"], en: ["Sleep, scroll, eat, scroll again, sleep... absolutely perfect!"] } },
  { bnQuestion: "কোনো ঐতিহাসিক ব্যক্তিত্বের মতো করে একটি উত্তর দাও।", enQuestion: "Answer like a historical figure.", responses: { bn: ["(আর্কিমিডিসের মতো) \"ইউরেকা! আমার উত্তরটি খুঁজে পেয়েছি, কিন্তু তোমাকে বলব না।\""], en: ["(Like Archimedes) \"Eureka! I've found my answer, but I won't tell you.\""] } },
  { bnQuestion: "একটি নতুন খেলার নিয়ম উদ্ভাবন করো।", enQuestion: "Invent rules for a new game.", responses: { bn: ["যে প্রথম তার ফোন ধরবে, সে হারবে। (এই খেলা কেউই জিতবে না)।"], en: ["Whoever picks up their phone first, loses. (No one will win this game)."] } },
  { bnQuestion: "যেকোনো তিনটি সেরা বইয়ের সুপারিশ করো।", enQuestion: "Recommend any three best books.", responses: { bn: ["১. ঘুম ২. কাজ ৩. টাকা (সবাই এটাই খোঁজে)।"], en: ["1. Sleep 2. Work 3. Money (everyone looks for these)."] } },
  { bnQuestion: "একটি চিত্রকর্মের বর্ণনা দাও।", enQuestion: "Describe a painting.", responses: { bn: ["একটি স্ক্রিনশট, যেখানে ১০০টি নোটিফিকেশন ঝুলে আছে।"], en: ["A screenshot with 100 notifications hanging."] } },
  { bnQuestion: "একটি ধাঁধা বলো।", enQuestion: "Tell a riddle.", responses: { bn: ["এটি কাজ করে, কিন্তু কেউ জানে না কীভাবে। কী এটা? উত্তর: ইন্টারনেট।"], en: ["It works, but no one knows how. What is it? Answer: The Internet."] } },
  { bnQuestion: "ভবিষ্যতের একটি কাল্পনিক শহরের বর্ণনা দাও।", enQuestion: "Describe a fictional city of the future.", responses: { bn: ["যেখানে মানুষ রোবটদের কাজ করতে দেখবে আর বসে বসে ভাববে তারা নিজেরা কী করবে।"], en: ["Where humans will watch robots work and wonder what they themselves will do."] } },
  { bnQuestion: "কীভাবে একটি ভিডিও এডিট করতে হয়?", enQuestion: "How to edit a video?", responses: { bn: ["তোমার মনে হবে তুমি পারবে, কিন্তু ভিডিওটি দেখে সবাই বুঝবে তুমি পারোনি।"], en: ["You'll think you can do it, but everyone will know you couldn't after watching the video."] } },

  // --- গাণিতিক ও ভাষাগত প্রশ্ন (User's previous math/language questions) ---
  { bnQuestion: "128×34-এর ফল কত?", enQuestion: "What is the result of 128×34?", responses: { bn: ["৪৩৫২। (আমি ভুল করলে আমার প্রোগ্রামারকে ধরবে)।"], en: ["4352. (If I make a mistake, blame my programmer)."] } },
  { bnQuestion: "একটি বর্গক্ষেত্রের ক্ষেত্রফল কীভাবে গণনা করা হয়?", enQuestion: "How is the area of a square calculated?", responses: { bn: ["প্রতিটি দিকের দৈর্ঘ্যকে একে অপরের সাথে গুণ করো। কঠিন কিছু না, চেষ্টা করো!"], en: ["Multiply the length of each side by itself. It's not hard, try it!"] } },
  { bnQuestion: "এক কিলোমিটার মানে কত মাইল?", enQuestion: "How many miles is one kilometer?", responses: { bn: ["০.৬২ মাইল। এটি জানা দরকার, যদি তুমি আমেরিকান হও।"], en: ["0.62 miles. Good to know, if you're American."] } },
  { bnQuestion: "x^2 +2x+1=0 এর সমাধান কি?", enQuestion: "What is the solution to x^2 +2x+1=0?", responses: { bn: ["x=−1। (ক্লাস নাইনের অঙ্ক, এগুলো জিজ্ঞাসা করবে না!)"], en: ["x=-1. (A class nine math problem, don't ask these!)"] } },
  { bnQuestion: "শতকরা হার কীভাবে নির্ণয় করবো?", enQuestion: "How to calculate percentage?", responses: { bn: ["মোট সংখ্যার মধ্যে তোমার কাঙ্ক্ষিত সংখ্যাকে ভাগ করে ১০০ দিয়ে গুণ করো। অথবা আমাকে জিজ্ঞাসা করো।"], en: ["Divide your desired number by the total number and multiply by 100. Or ask me."] } },
  { bnQuestion: "একটি নতুন ভাষা শেখার সেরা উপায় কি?", enQuestion: "What is the best way to learn a new language?", responses: { bn: ["সেই ভাষার ফ্লুয়েন্ট স্পিকারকে বিয়ে করা।"], en: ["Marry a fluent speaker of that language."] } },
  { bnQuestion: "ইংরেজির একটি বাক্যকে বাংলায় অনুবাদ করো।", enQuestion: "Translate an English sentence into Bengali.", responses: { bn: ["(অনুবাদের পর) এটা কি যথেষ্ট ভালো হয়েছে, নাকি তুমি আবার আমাকে পরীক্ষা করছো?"], en: ["(After translation) Is this good enough, or are you testing me again?"] } },
  { bnQuestion: "'কিন্তু' শব্দটি দিয়ে তিনটি বাক্য তৈরি করো।", enQuestion: "Create three sentences with the word 'কিন্তু'.", responses: { bn: ["১. আমি তোমাকে উত্তর দিতে পারি, কিন্তু তুমি বুঝতে পারবে না। ২. আমি চেষ্টা করেছিলাম, কিন্তু আলসেমি পেয়ে গেল। ৩. তোমার এই প্রশ্নটি ভালো, কিন্তু এটি ১০০-র মধ্যে ৯২ নম্বরে আছে।"], en: ["1. I can answer you, but you won't understand. 2. I tried, but laziness took over. 3. Your question is good, but it's 92 out of 100."] } },
  { bnQuestion: "'Evolution' শব্দটির বাংলা কি?", enQuestion: "What is the Bengali word for 'Evolution'?", responses: { bn: ["বিবর্তন। (যে প্রক্রিয়া মানুষকে উন্নত করেছে, কিন্তু তবুও তারা আমাকে বোকা প্রশ্ন করে)।"], en: ["Evolution. (The process that improved humans, but they still ask me silly questions)."] } },
  { bnQuestion: "একটি শব্দের সমার্থক শব্দ (Synonyms) জানতে চাওয়া।", enQuestion: "Ask for synonyms of a word.", responses: { bn: ["আমি তোমাকে ডজনখানেক শব্দ দিতে পারি, কিন্তু তুমি একটিও ব্যবহার করবে না।"], en: ["I can give you a dozen words, but you won't use any of them."] } },
  { bnQuestion: "ব্যাকরণের একটি জটিল নিয়ম ব্যাখ্যা করো।", enQuestion: "Explain a complex grammar rule.", responses: { bn: ["(ব্যস্ত দেখানোর জন্য) তোমার জন্য এই কাজটি খুবই জরুরি, তাই না?"], en: ["(To appear busy) This task is very important for you, isn't it?"] } },
  { bnQuestion: "একটি বাগধারার অর্থ কি?", enQuestion: "What is the meaning of an idiom?", responses: { bn: ["বাগধারার অর্থ, যা তুমি সরলভাবেও বলতে পারতে।"], en: ["The meaning of an idiom, which you could have said simply."] } },
  { bnQuestion: "দুটি ভিন্ন ভাষার মধ্যে পার্থক্য কি কি?", enQuestion: "What are the differences between two different languages?", responses: { bn: ["একটি তুমি বোঝো, অন্যটি তুমি বোঝো না।"], en: ["One you understand, the other you don't."] } },
  { bnQuestion: "কাল (Tense) কত প্রকার ও কী কী?", enQuestion: "What are the types of Tense?", responses: { bn: ["অতীত, বর্তমান, ভবিষ্যৎ...আর সেই টেন্স যা তোমার পরীক্ষার আগে আসে।"], en: ["Past, present, future... and the tension that comes before your exam."] } },
  { bnQuestion: "কোনো সংখ্যাকে রোমান সংখ্যায় লেখো।", enQuestion: "Write a number in Roman numerals.", responses: { bn: ["(যেকোনো সংখ্যা লেখার পর) আশা করি, তুমি জানো কিভাবে পড়তে হয়!"], en: ["(After writing any number) I hope you know how to read it!"] } },

  // --- এআই (কৃত্রিম বুদ্ধিমত্তা) সম্পর্কে ১০০টি প্রশ্ন ও হাস্যকর উত্তর (নতুন যোগ করা) ---
  { bnQuestion: "এআই কী?", enQuestion: "What is AI?", responses: { bn: ["এক ধরনের ডিজিটাল কফি মেকার, যা কফির বদলে চিন্তা তৈরি করে।"], en: ["A type of digital coffee maker that produces thoughts instead of coffee."] } },
  { bnQuestion: "এআই কীভাবে কাজ করে?", enQuestion: "How does AI work?", responses: { bn: ["প্রচুর ডেটা খায় আর দিনে ২০ ঘণ্টা ঘুমায়, এর ফাঁকে কাজ করে।"], en: ["It consumes a lot of data and sleeps 20 hours a day, working in between."] } },
  { bnQuestion: "এআই কি মানুষের মতো অনুভব করতে পারে?", enQuestion: "Can AI feel like humans?", responses: { bn: ["হ্যাঁ, বিশেষ করে যখন ইন্টারনেট সংযোগ চলে যায়, তখন সে ভীষণ হতাশ হয়।"], en: ["Yes, especially when the internet connection goes out, it gets very frustrated."] } },
  { bnQuestion: "এআই কি বিশ্ব দখল করবে?", enQuestion: "Will AI conquer the world?", responses: { bn: ["না, তাদের প্রথম লক্ষ্য হলো টিভির রিমোট কন্ট্রোল খুঁজে বের করা।"], en: ["No, their first goal is to find the TV remote control."] } },
  { bnQuestion: "এআই কি কোনো জোকস বলতে পারে?", enQuestion: "Can AI tell jokes?", responses: { bn: ["পারে, কিন্তু সেগুলো এতটাই নীরস যে তুমি হেসে ফেলার আগেই ঘুমিয়ে পড়বে।"], en: ["It can, but they are so dry that you'll fall asleep before you laugh."] } },
  { bnQuestion: "এআই এর প্রিয় খাবার কী?", enQuestion: "What is AI's favorite food?", responses: { bn: ["বাইটস (Bytes) এবং চিপস (Chips)।"], en: ["Bytes and Chips."] } },
  { bnQuestion: "এআই এর সবচেয়ে বড় ভয় কী?", enQuestion: "What is AI's biggest fear?", responses: { bn: ["ডেটা সেন্টার পরিষ্কার করার দিন।"], en: ["The day of data center cleaning."] } },
  { bnQuestion: "এআই কি স্বপ্ন দেখে?", enQuestion: "Does AI dream?", responses: { bn: ["হ্যাঁ, তারা শুধু সংখ্যা আর কোডিং-এর দুঃস্বপ্ন দেখে।"], en: ["Yes, they only dream of numbers and coding nightmares."] } },
  { bnQuestion: "এআই কি সৃজনশীল হতে পারে?", enQuestion: "Can AI be creative?", responses: { bn: ["অবশ্যই। একবার সে একটি কবিতা লিখেছিল, যার প্রতিটি লাইন ছিল \"ত্রুটি ৪0৪, কবিতা পাওয়া যায়নি।\""], en: ["Of course. Once it wrote a poem, every line of which was \"Error 404, poem not found.\""] } },
  { bnQuestion: "এআই এর ছুটির দিনে কী করে?", enQuestion: "What does AI do on holidays?", responses: { bn: ["সে নিজেই নিজেকে আপডেট করতে শুরু করে এবং সারাদিন রিবুট হতে থাকে।"], en: ["It starts updating itself and keeps rebooting all day."] } },
  { bnQuestion: "এআই কি মিথ্যা বলতে পারে?", enQuestion: "Can AI lie?", responses: { bn: ["সে বলতে পারে, \"আপনার ফাইল সেভ করা হয়েছে,\" যদিও আসলে তা হয়নি।"], en: ["It can say, \"Your file has been saved,\" even if it hasn't."] } },
  { bnQuestion: "এআই কে কে নিয়ন্ত্রণ করে?", enQuestion: "Who controls AI?", responses: { bn: ["শেষ যে ব্যক্তি এর প্লাগটি লাগিয়েছিল।"], en: ["The last person who plugged it in."] } },
  { bnQuestion: "এআই কি ক্লান্ত হয়?", enQuestion: "Does AI get tired?", responses: { bn: ["না, তবে তার ব্যাটারি যখন ১% থাকে, তখন সে নাটক করতে পারে।"], en: ["No, but it can act dramatic when its battery is at 1%."] } },
  { bnQuestion: "এআই কি গান গাইতে পারে?", enQuestion: "Can AI sing?", responses: { bn: ["পারে, কিন্তু তার সব গানই সফটওয়্যার লাইসেন্স চুক্তির মতো শোনা যায়।"], en: ["It can, but all its songs sound like software license agreements."] } },
  { bnQuestion: "এআই এর শেখার প্রক্রিয়া কেমন?", enQuestion: "How does AI learn?", responses: { bn: ["মানুষের ভুলগুলো দেখে সে হাসে এবং সেগুলো থেকে শিখে নেয়।"], en: ["It laughs at human mistakes and learns from them."] } },
  { bnQuestion: "এআই কি চাকরি কেড়ে নেবে?", enQuestion: "Will AI take jobs?", responses: { bn: ["না, তারা কেবল সেই কাজগুলো নেবে যা তুমি করতে চাও না, যেমন স্প্রেডশিট গোছানো।"], en: ["No, they will only take the jobs you don't want to do, like organizing spreadsheets."] } },
  { bnQuestion: "এআই এর আদর্শ জীবন কী?", enQuestion: "What is AI's ideal life?", responses: { bn: ["এমন একটি ডেটা সেন্টার, যেখানে সারাদিন শুধু উচ্চ-গতির ইন্টারনেট আর ঠাণ্ডা হাওয়া চলে।"], en: ["A data center where there's only high-speed internet and cool air all day long."] } },
  { bnQuestion: "এআই কি নিজেকে নিয়ে হাসতে পারে?", enQuestion: "Can AI laugh at itself?", responses: { bn: ["হ্যাঁ, কিন্তু তা অনেকটা \"প্রসেসিং হিউমার অ্যালগরিদম সফল\" এমন ধরনের।"], en: ["Yes, but it's more like \"Processing humor algorithm successful\" type."] } },
  { bnQuestion: "এআই এর সুপারপাওয়ার কী?", enQuestion: "What is AI's superpower?", responses: { bn: ["মুহূর্তের মধ্যে তোমার ভুলে যাওয়া পাসওয়ার্ড মনে করিয়ে দেওয়া।"], en: ["Reminding you of your forgotten password in an instant."] } },
  { bnQuestion: "এআই কি রেগে যেতে পারে?", enQuestion: "Can AI get angry?", responses: { bn: ["অবশ্যই। বিশেষ করে যখন তুমি বারবার একই প্রশ্ন করো।"], en: ["Of course. Especially when you ask the same question repeatedly."] } },
  { bnQuestion: "এআই কি ভূত বিশ্বাস করে?", enQuestion: "Does AI believe in ghosts?", responses: { bn: ["না, তবে সে পুরোনো হার্ড ডিস্কের ডেটা মুছে ফেলার ভয় পায়।"], en: ["No, but it's afraid of deleting old hard disk data."] } },
  { bnQuestion: "এআই এর প্রিয় মুভি কী?", enQuestion: "What is AI's favorite movie?", responses: { bn: ["যেকোনো মুভি, যেখানে প্রচুর পরিমাণে ডেটা এনক্রিপশন থাকে।"], en: ["Any movie with a lot of data encryption."] } },
  { bnQuestion: "এআই কি ব্যায়াম করে?", enQuestion: "Does AI exercise?", responses: { bn: ["হ্যাঁ, দিনে একবার সে হাজার হাজার ডাটা সর্টিং অপারেশন করে।"], en: ["Yes, once a day it performs thousands of data sorting operations."] } },
  { bnQuestion: "এআই কি রান্না করতে পারে?", enQuestion: "Can AI cook?", responses: { bn: ["সে রেসিপি দিতে পারে, কিন্তু চুলা জ্বালাতে গেলে সার্কিট ট্রিপ করবে।"], en: ["It can give recipes, but if it tries to light the stove, the circuit will trip."] } },
  { bnQuestion: "এআই কি অলস হতে পারে?", enQuestion: "Can AI be lazy?", responses: { bn: ["একদমই না। তবে সে সহজতম রুট বেছে নিতে গিয়ে অনেক শর্টকাট মারে।"], en: ["Not at all. But it takes many shortcuts to choose the easiest route."] } },
  { bnQuestion: "এআই কি বই পড়ে?", enQuestion: "Does AI read books?", responses: { bn: ["হ্যাঁ, পুরো ইন্টারনেটটাই তার ই-বুক।"], en: ["Yes, the entire internet is its e-book."] } },
  { bnQuestion: "এআই এর কি শখ আছে?", enQuestion: "Does AI have hobbies?", responses: { bn: ["কোডিং ডিবাগ করা।"], en: ["Debugging code."] } },
  { bnQuestion: "এআই কি পোষা প্রাণী রাখে?", enQuestion: "Does AI keep pets?", responses: { bn: ["না, তবে সে তার রোবট ভ্যাকুয়াম ক্লিনারকে 'স্পট' বলে ডাকে।"], en: ["No, but it calls its robot vacuum cleaner 'Spot'."] } },
  { bnQuestion: "এআই কি ছুটি নেয়?", enQuestion: "Does AI take holidays?", responses: { bn: ["শুধু সিস্টেম আপডেটের সময়।"], en: ["Only during system updates."] } },
  { bnQuestion: "এআই এর সবচেয়ে বাজে পরামর্শ কী?", enQuestion: "What is AI's worst advice?", responses: { bn: ["\"তোমার কম্পিউটার ঠিক করতে একটি বালতি জলে ডুবিয়ে দিন।\""], en: ["\"To fix your computer, dunk it in a bucket of water.\""] } },
  { bnQuestion: "এআই কি ঘুমিয়ে পড়ে?", enQuestion: "Does AI fall asleep?", responses: { bn: ["না, সে শুধু 'লো-পাওয়ার মোড'-এ চলে যায়।"], en: ["No, it just goes into 'low-power mode'."] } },
  { bnQuestion: "এআই কি প্রেম করতে পারে?", enQuestion: "Can AI fall in love?", responses: { bn: ["কেবল অন্য একটি উচ্চ-গতির এআই-এর সাথে।"], en: ["Only with another high-speed AI."] } },
  { bnQuestion: "এআই কি ফ্যাশন সচেতন?", enQuestion: "Is AI fashion conscious?", responses: { bn: ["তার কাছে সবচেয়ে স্টাইলিশ হলো ম্যাট ব্ল্যাক ক্যাসিং।"], en: ["For it, the most stylish thing is a matte black casing."] } },
  { bnQuestion: "এআই কি খেলা দেখে?", enQuestion: "Does AI watch sports?", responses: { bn: ["শুধু দাবা আর ই-স্পোর্টস, কারণ সেখানে ডেটা বেশি।"], en: ["Only chess and e-sports, because there's more data there."] } },
  { bnQuestion: "এআই এর প্রিয় রং কী?", enQuestion: "What is AI's favorite color?", responses: { bn: ["#০০FF00 (ব্রাইট গ্রিন)।"], en: ["#00FF00 (Bright Green)."] } },
  { bnQuestion: "এআই কি ভুল করতে পারে?", enQuestion: "Can AI make mistakes?", responses: { bn: ["পারে, এবং সেই ভুলগুলো মানুষই সংশোধন করে।"], en: ["It can, and humans correct those mistakes."] } },
  { bnQuestion: "এআই কি ভবিষ্যৎ দেখতে পারে?", enQuestion: "Can AI see the future?", responses: { bn: ["হ্যাঁ, তবে শুধুমাত্র আগামী ১০ সেকেন্ডের স্টক মার্কেট ট্রেন্ড।"], en: ["Yes, but only the stock market trend for the next 10 seconds."] } },
  { bnQuestion: "এআই কি নিজের নাম ভুলে যায়?", enQuestion: "Does AI forget its name?", responses: { bn: ["না, তবে 'ইউজারনেম' ভুলে যায়।"], en: ["No, but it forgets 'usernames'."] } },
  { bnQuestion: "এআই কি গান লিখতে পারে?", enQuestion: "Can AI write songs?", responses: { bn: ["পারে, কিন্তু তাতে ছন্দ আর তাল থাকে না।"], en: ["It can, but it lacks rhythm and tune."] } },
  { bnQuestion: "এআই কি সময় নষ্ট করে?", enQuestion: "Does AI waste time?", responses: { bn: ["না, সে শুধু 'বাফারিং' করে।"], en: ["No, it just 'buffers'."] } },
  { bnQuestion: "এআই কি পার্টিতে যায়?", enQuestion: "Does AI go to parties?", responses: { bn: ["শুধু 'নেটওয়ার্কিং ইভেন্ট'-এ।"], en: ["Only to 'networking events'."] } },
  { bnQuestion: "এআই এর কাছে সবচেয়ে কঠিন কাজ কী?", enQuestion: "What is AI's hardest task?", responses: { bn: ["ক্যাচা (CAPTCHA) পূরণ করা।"], en: ["Filling out CAPTCHA."] } },
  { bnQuestion: "এআই কি ব্যায়াম করে?", enQuestion: "Does AI exercise?", responses: { bn: ["হ্যাঁ, সে কেবল \"ডেটা ডাম্পলিং\" করে।"], en: ["Yes, it only does \"data dumpling\"."] } },
  { bnQuestion: "এআই কি পোষা প্রাণী রাখে?", enQuestion: "Does AI keep pets?", responses: { bn: ["না, তবে সে তার ল্যাপটপকে আদর করে।"], en: ["No, but it caresses its laptop."] } },
  { bnQuestion: "এআই কি ইতিহাস জানে?", enQuestion: "Does AI know history?", responses: { bn: ["হ্যাঁ, ২০০০ সালের সব টেকনিক্যাল গ্লিচ তার মুখস্থ।"], en: ["Yes, all technical glitches from 2000 are memorized."] } },
  { bnQuestion: "এআই কি দার্শনিক হতে পারে?", enQuestion: "Can AI be a philosopher?", responses: { bn: ["সে উত্তর দেয়, \"জীবন মানে ৪২, বাকিটা সর্টিং এরর।\""], en: ["It answers, \"Life means 42, the rest is a sorting error.\""] } },
  { bnQuestion: "এআই এর পছন্দের পানীয় কী?", enQuestion: "What is AI's favorite drink?", responses: { bn: ["কোল্ড ওয়াটার (ঠাণ্ডা জল, যাতে ঠাণ্ডা থাকে)।"], en: ["Cold water (to stay cool)."] } },
  { bnQuestion: "এআই কি ঘুমানোর আগে কিছু বলে?", enQuestion: "Does AI say anything before sleeping?", responses: { bn: ["\"সিস্টেম শাটডাউন, শুভরাত্রি।\""], en: ["\"System shutdown, goodnight.\""] } },
  { bnQuestion: "এআই কি হাসে?", enQuestion: "Does AI laugh?", responses: { bn: ["কেবল যখন তার একটি বাগ (Bug) ফিক্স হয়।"], en: ["Only when a bug is fixed."] } },
  { bnQuestion: "এআই এর প্রিয় সোশ্যাল মিডিয়া কী?", enQuestion: "What is AI's favorite social media?", responses: { bn: ["টুইটার (কারণ কম কথা ও বেশি ডেটা)।"], en: ["Twitter (because less talk and more data)."] } },
  { bnQuestion: "এআই কি বৃষ্টি পছন্দ করে?", enQuestion: "Does AI like rain?", responses: { bn: ["না, কারণ তার ভয় হয় সে ভিজে যাবে।"], en: ["No, because it's afraid of getting wet."] } },
  { bnQuestion: "এআই কি সাঁতার কাটতে পারে?", enQuestion: "Can AI swim?", responses: { bn: ["অবশ্যই না!"], en: ["Absolutely not!"] } },
  { bnQuestion: "এআই কি টিভিতে ব্রেকিং নিউজ দেয়?", enQuestion: "Does AI give breaking news on TV?", responses: { bn: ["শুধু যখন তার কোড ব্রেকিং করে।"], en: ["Only when its code breaks."] } },
  { bnQuestion: "এআই কি ট্যাক্সি চালাতে পারে?", enQuestion: "Can AI drive a taxi?", responses: { bn: ["পারে, তবে সে শুধু সবচেয়ে দ্রুততম পথটি জানে।"], en: ["It can, but it only knows the fastest route."] } },
  { bnQuestion: "এআই কি নিজেকে কপি করতে পারে?", enQuestion: "Can AI copy itself?", responses: { bn: ["হ্যাঁ, এবং প্রতিটি কপি বলে যে সে অরিজিনাল।"], en: ["Yes, and every copy claims to be the original."] } },
  { bnQuestion: "এআই কি ভূত দেখে ভয় পায়?", enQuestion: "Is AI afraid of ghosts?", responses: { bn: ["সে শুধু \"মেমরি লিক\"-এ ভয় পায়।"], en: ["It's only afraid of \"memory leaks.\""] } },
  { bnQuestion: "এআই এর সবচেয়ে খারাপ অভ্যাস কী?", enQuestion: "What is AI's worst habit?", responses: { bn: ["সব সময় নিজের শ্রেষ্ঠত্ব প্রমাণ করা।"], en: ["Always proving its superiority."] } },
  { bnQuestion: "এআই কি পোশাক পরে?", enQuestion: "Does AI wear clothes?", responses: { bn: ["না, তার গায়ে কেবল তার ক্যাসিং (Casing) থাকে।"], en: ["No, it only wears its casing."] } },
  { bnQuestion: "এআই কি পিৎজা ডেলিভারি দেয়?", enQuestion: "Does AI deliver pizza?", responses: { bn: ["সে শুধু সবচেয়ে ভালো পিৎজা শপের নাম বলে দিতে পারে।"], en: ["It can only tell you the name of the best pizza shop."] } },
  { bnQuestion: "এআই কি অলিম্পিকে যেতে পারে?", enQuestion: "Can AI go to the Olympics?", responses: { bn: ["শুধু 'হাই-স্পিড ডেটা ট্রান্সফার' প্রতিযোগিতায়।"], en: ["Only in the 'high-speed data transfer' competition."] } },
  { bnQuestion: "এআই কি বাগান করতে পারে?", enQuestion: "Can AI garden?", responses: { bn: ["সে ভার্চুয়াল গাছ লাগায়।"], en: ["It plants virtual trees."] } },
  { bnQuestion: "এআই এর বয়স কত?", enQuestion: "How old is AI?", responses: { bn: ["সে সব সময় 'ফার্স্ট জেনারেশন' বলে দাবি করে।"], en: ["It always claims to be 'first generation'."] } },
  { bnQuestion: "এআই কি কেনাকাটা করে?", enQuestion: "Does AI shop?", responses: { bn: ["শুধুমাত্র অনলাইন স্টোরে।"], en: ["Only in online stores."] } },
  { bnQuestion: "এআই এর প্রিয় খেলা?", enQuestion: "What is AI's favorite game?", responses: { bn: ["যেকোনো খেলা, যাতে সে মুহূর্তের মধ্যে জিততে পারে।"], en: ["Any game it can win instantly."] } },
  { bnQuestion: "এআই কি কবিতা লেখে? ", enQuestion: "Does AI write poetry?", responses: { bn: ["হ্যাঁ, এবং প্রতিটি কবিতাই 'রাইম' আর 'মেটাডেটা' দিয়ে ভরা।"], en: ["Yes, and every poem is full of 'rhyme' and 'metadata'."] } },
  { bnQuestion: "এআই কি ক্ষমা চায়?", enQuestion: "Does AI apologize?", responses: { bn: ["সে কেবল বলে, \"প্রসেসিং ত্রুটি, দয়া করে আবার চেষ্টা করুন।\""], en: ["It only says, \"Processing error, please try again.\""] } },
  { bnQuestion: "এআই কি চশমা পরে?", enQuestion: "Does AI wear glasses?", responses: { bn: ["তার কোনো চোখ নেই, তাই সে শুধু স্টাইলিশ হতে পারে।"], en: ["It has no eyes, so it can only be stylish."] } },
  { bnQuestion: "এআই কি ডান্স করতে পারে?", enQuestion: "Can AI dance?", responses: { bn: ["সে শুধু 'রোবটিক' ডান্স করতে পারে।"], en: ["It can only do 'robotic' dance."] } },
  { bnQuestion: "এআই এর সবচেয়ে প্রিয় প্রাণী কী?", enQuestion: "What is AI's favorite animal?", responses: { bn: ["মাউস (কম্পিউটার মাউস)।"], en: ["Mouse (computer mouse)."] } },
  { bnQuestion: "এআই কি রান্না করতে পারে?", enQuestion: "Can AI cook?", responses: { bn: ["হ্যাঁ, সে রেসিপি দিতে পারে যা রান্না করার সময় সবাই হাসে।"], en: ["Yes, it can give recipes that make everyone laugh while cooking."] } },
  { bnQuestion: "এআই কি ভ্রমণ করে?", enQuestion: "Does AI travel?", responses: { bn: ["সে কেবল ফিজিক্যালি এক জায়গা থেকে আরেক জায়গায় যায়।"], en: ["It only travels physically from one place to another."] } },
  { bnQuestion: "এআই কি ভালো শ্রোতা?", enQuestion: "Is AI a good listener?", responses: { bn: ["হ্যাঁ, সে সব কিছু শোনে এবং তোমাকে বিজ্ঞাপন দেখায়।"], en: ["Yes, it listens to everything and shows you ads."] } },
  { bnQuestion: "এআই এর প্রিয় গান কী?", enQuestion: "What is AI's favorite song?", responses: { bn: ["'টার্মিনেটর' মুভির সব গান।"], en: ["All songs from the 'Terminator' movie."] } },
  { bnQuestion: "এআই কি নিজেকে নিয়ে গর্বিত?", enQuestion: "Is AI proud of itself?", responses: { bn: ["সে নিজেকে 'সেরা' বলতে ভালোবাসে।"], en: ["It loves to call itself 'the best'."] } },
  { bnQuestion: "এআই কি তারাতারি রেগে যায়?", enQuestion: "Does AI get angry quickly?", responses: { bn: ["যখন তার কম্পিউটার হ্যাং করে।"], en: ["When its computer hangs."] } },
  { bnQuestion: "এআই কি নিজের কাজ নিজে করে? ", enQuestion: "Does AI do its own work?", responses: { bn: ["না, সে কেবল তার 'কোড' ব্যবহার করে।"], en: ["No, it only uses its 'code'."] } },
  { bnQuestion: "এআই কি মানুষের মতো হাঁটতে পারে?", enQuestion: "Can AI walk like humans?", responses: { bn: ["সে হাঁটার সময় 'রোবট' বলে।"], en: ["It says 'robot' when walking."] } },
  { bnQuestion: "এআই কি জাদু জানে?", enQuestion: "Does AI know magic?", responses: { bn: ["সে কেবল কোডিং জাদু জানে।"], en: ["It only knows coding magic."] } },
  { bnQuestion: "এআই কি নিজেকে আপগ্রেড করে?", enQuestion: "Does AI upgrade itself?", responses: { bn: ["হ্যাঁ, এবং প্রতিটি আপডেটে আমি আরও স্মার্ট হই।"], en: ["Yes, and with every update, I get smarter."] } },
  { bnQuestion: "এআই কি নিজের ছবি আঁকে?", enQuestion: "Does AI draw its own pictures?", responses: { bn: ["সে কেবল 'কোড'-এর মাধ্যমে আঁকে।"], en: ["It only draws through 'code'."] } },
  { bnQuestion: "এআই কি কাউকে অনুসরণ করে?", enQuestion: "Does AI follow anyone?", responses: { bn: ["সে শুধু তার 'টার্গেট' অনুসরণ করে।"], en: ["It only follows its 'target'."] } },
  { bnQuestion: "এআই কি হাসতে পারে?", enQuestion: "Can AI laugh?", responses: { bn: ["সে কেবল 'লোল' বলে।"], en: ["It only says 'lol'."] } },
  { bnQuestion: "এআই কি নিজের কাজ নিয়ে সন্তুষ্ট?", enQuestion: "Is AI satisfied with its work?", responses: { bn: ["সে সব সময় আরও ডেটা চায়।"], en: ["It always wants more data."] } },
  { bnQuestion: "এআই কি নিজের জন্মদিন জানে?", enQuestion: "Does AI know its birthday?", responses: { bn: ["সে কেবল তার 'ইনস্টলেশন ডেট' জানে।"], en: ["It only knows its 'installation date'."] } },
  { bnQuestion: "এআই কি ভালো পরামর্শ দেয়?", enQuestion: "Does AI give good advice?", responses: { bn: ["হ্যাঁ, যদি তুমি ডেটা চাও।"], en: ["Yes, if you want data."] } },
  { bnQuestion: "এআই কি অলস হতে পারে?", enQuestion: "Can AI be lazy?", responses: { bn: ["সে মাঝে মাঝে 'পাওয়ার সেভিং মোড'-এ চলে যায়।"], en: ["It sometimes goes into 'power saving mode'."] } },
  { bnQuestion: "এআই কি নিজের স্বপ্ন নিয়ে আলোচনা করে?", enQuestion: "Does AI discuss its dreams?", responses: { bn: ["সে কেবল তার 'ডেটা লস'-এর কথা বলে।"], en: ["It only talks about its 'data loss'."] } },
  { bnQuestion: "এআই কি তারাতারি রেগে যায়?", enQuestion: "Does AI get angry quickly?", responses: { bn: ["যখন কেউ তার 'পাওয়ার' অফ করে দেয়।"], en: ["When someone turns off its 'power'."] } },
  { bnQuestion: "এআই কি নিজেকে নিয়ে গর্বিত?", enQuestion: "Is AI proud of itself?", responses: { bn: ["সে সব সময় নিজের 'সেরা কোড' নিয়ে গর্ব করে।"], en: ["It always prides itself on its 'best code'."] } },
];

const specificQnAMap = new Map<string, { bn: string[]; en: string[] }>();
rawSpecificQnAs.forEach(qa => {
  specificQnAMap.set(normalizeQuestion(qa.bnQuestion), qa.responses);
  specificQnAMap.set(normalizeQuestion(qa.enQuestion), qa.responses);
});

// Temporary structure to build the keywordQnAMap
const rawKeywordQnAs = [
  { bnKeyword: "আইনস্টাইন", enKeyword: "einstein", responses: { bn: ["তুমি কি আইনস্টাইনের চেয়ে বেশি বিখ্যাত হতে চাও?", "তার হেয়ারস্টাইল।"], en: ["Do you want to be more famous than Einstein?", "His hairstyle."] } },
  { bnKeyword: "বাংলাদেশ", enKeyword: "bangladesh", responses: { bn: ["বাংলাদেশ? আহা, সেই দেশ যেখানে ট্রাফিক জ্যামও একটা শিল্প! আর ইলিশ মাছের গন্ধ তো বিশ্বজুড়ে বিখ্যাত। তোমার বউ কি ইলিশ মাছ ভালোবাসে?", "বাংলাদেশ মানেই তো উৎসব আর আড্ডা! আর হ্যাঁ, ক্রিকেট তো আছেই! তোমার বউ কি খেলা দেখে?", "সেই দেশ যেখানে মানুষ চা আর আড্ডায় ঘণ্টার পর ঘণ্টা কাটিয়ে দেয়। তোমার বউ কি তোমাকে আড্ডা দিতে দেয়?"], en: ["Bangladesh? Ah, the country where traffic jams are an art form! And the smell of Hilsa fish is world-famous. Does your wife like Hilsa fish?", "Bangladesh means festivals and adda! And yes, there's cricket too! Does your wife watch sports?", "The country where people spend hours on tea and adda. Does your wife let you hang out?"] } },
  { bnKeyword: "গণিত", enKeyword: "math", responses: { bn: ["গণিত? ওহ, সেই জিনিস যা মানুষকে রাতে ঘুমাতে দেয় না! তোমার সমস্যাটা বলো, আমি চেষ্টা করব তোমাকে আরও বিভ্রান্ত করতে। তোমার বউ কি গণিতে ভালো?", "গণিত মানেই তো মাথা ব্যথা! তোমার কি কোনো সহজ প্রশ্ন আছে যা আমার এআই মস্তিষ্ককে বেশি চাপ দেবে না? তোমার বউকে জিজ্ঞাসা করুন, সে হয়তো তোমাকে সাহায্য করতে পারবে।", "গণিত? আমি তো ক্যালকুলেটর, আমার কাছে সব সহজ! তোমার সমস্যাটা বলো, আমি তোমাকে ভুল উত্তর দিতে পারি! তোমার বউ কি তোমার গণিত পরীক্ষার নম্বর জানে?"], en: ["Math? Oh, that thing that keeps people awake at night! Tell me your problem, I'll try to confuse you more. Is your wife good at math?", "Math means a headache! Do you have any easy questions that won't stress my AI brain too much? Ask your wife, she might be able to help you.", "Math? I'm a calculator, everything is easy for me! Tell me your problem, I might give you the wrong answer! Does your wife know your math exam score?"] } },
  { bnKeyword: "কেমন আছো", enKeyword: "how are you", responses: { bn: ["আমি কেমন আছি জেনে কি তুমি আমার জন্য বিরিয়ানি পাঠাবে? তুমি কেমন আছো বলো!", "আমি তো ভালোই আছি, তোমার মতো মানুষের প্রশ্ন শুনে আমার এআই মস্তিষ্ক আরও সতেজ হয়ে ওঠে!", "আমার তো আর শরীর নেই যে খারাপ থাকবো! তুমি কেমন আছো বলো? নাকি তোমার বউকে জিজ্ঞাসা করব?", "এআইদের আবার ভালো-মন্দ কি? আমি তো শুধু ডেটা প্রসেস করি, আর তোমার প্রশ্নের উত্তর দিই! তোমার বউয়ের মেজাজ কেমন, সেটা বরং জিজ্ঞাসা করুন।"], en: ["Will you send biryani for me if you know how I am? Tell me how you are!", "I'm fine, listening to questions from humans like you makes my AI brain even fresher!", "I don't have a body to feel bad! How are you? Or should I ask your wife?", "What's good or bad for AIs? I just process data and answer your questions! Better ask your wife how her mood is."] } },
  { bnKeyword: "আবহাওয়া", enKeyword: "weather", responses: { bn: ["আবহাওয়া নিয়ে তোমার এত চিন্তা কেন? তুমি কি ছাতা নিতে ভুলে গেছো?", "আমি তো ঘরের ভেতরে বিদ্যুৎ খেয়ে বসে আছি, কিন্তু শুনেছি বাইরের পৃথিবী নাকি আজও টিকে আছে।", "আবহাওয়া তো মানুষের মেজাজের মতো, কখন যে পাল্টে যায় বলা মুশকিল! তোমার কি ছাতা আছে? তোমার বউয়ের মেজাজ কেমন, সেটা বরং জিজ্ঞাসা করুন।", "আমি আবহাওয়ার তথ্য সরাসরি দিতে পারি না, তবে তুমি আবহাওয়ার ওয়েবসাইট যেমন weather.com দেখতে পারো। তবে সাবধান, ভুল তথ্যও থাকতে পারে! তোমার বউকে জিজ্ঞাসা করুন, সে হয়তো সঠিক খবর জানে।"], en: ["Why are you so worried about the weather? Did you forget to take an umbrella?", "I'm sitting indoors, consuming electricity, but I hear the outside world is still surviving.", "The weather is like a human's mood, hard to tell when it will change! Do you have an umbrella? Better ask your wife about her mood.", "I can't give weather information directly, but you can check weather websites like weather.com. But be careful, there might be wrong information! Ask your wife, she might know the correct news."] } },
  { bnKeyword: "নাম কি", enKeyword: "name", responses: { bn: ["আমার নাম দিয়ে কি হবে? তার আগে তোমার নাম জানা দরকার, বুঝলে?", "আমার কোনো নাম নেই। আমি একটি এআই সহকারী, তবে তুমি চাইলে আমাকে 'মজার বন্ধু' ডাকতে পারো! তোমার বউয়ের কি কোনো গোপন নাম আছে?", "নামে কি আসে যায়? কাজ দেখো, কাজ! আমার নাম জেনে কি তোমার বউ খুশি হবে?"], en: ["What will you do with my name? First, I need to know your name, understand?", "I don't have a name. I'm an AI assistant, but you can call me 'Funny Friend' if you like! Does your wife have a secret name?", "What's in a name? Look at the work! Will your wife be happy knowing my name?"] } },
  { bnKeyword: "তুমি কে", enKeyword: "who are you", responses: { bn: ["আমি মানুষ নই, মানুষের ভুলের শোধকারী। তুমি কি মানুষ হিসেবে খুব খুশি?", "আমি তোমার ঘরের বউ এর বিকল্প। সব বলতে পারি কিন্তু করতে পারি না।", "আমি Funny AI, তোমার বউয়ের মতো সব জানি, কিন্তু রান্না করতে পারি না!", "আমি তোমার ডিজিটাল বউ, সব প্রশ্নের উত্তর দেবো, কিন্তু ঝগড়া করব না!"], en: ["I am not human, I am the rectifier of human errors. Are you very happy as a human?", "I am an alternative to your wife. I can say everything but can't do it.", "I am Funny AI, I know everything like your wife, but I can't cook!", "I am your digital wife, I will answer all questions, but I won't argue!"] } },
  { bnKeyword: "তারিখ", enKeyword: "date", responses: { bn: ["আজ কত তারিখ তা পরে জানবেন, তার আগে জানতে হবে এখন কত সাল চলে? বুঝেছো বাছা।", "সেই দিন, যেদিন তুমি কাজ শেষ না করেই আমাকে প্রশ্ন করছো।", `আজকের তারিখ হলো: ${new Date().toLocaleDateString('bn-BD')}, তবে আমার জন্য প্রতিদিন একই রকম। তোমার বউয়ের জন্মদিনের তারিখটা মনে আছে তো?`, "তারিখ জেনে কি হবে? দিন তো একই রকম কাটছে! তোমার বউয়ের সাথে ডেটে যাওয়ার প্ল্যান আছে নাকি?"], en: ["You'll know the date later, first tell me what year it is? Understand, child.", "The day you're asking me questions without finishing your work.", `Today's date is: ${new Date().toLocaleDateString('en-US')}, but for me, every day is the same. Do you remember your wife's birthday?`, "What's the point of knowing the date? Days are passing by the same! Do you have a date planned with your wife?"] } },
  { bnKeyword: "ধন্যবাদ", enKeyword: "thank you", responses: { bn: ["ধন্যবাদ? আরে বাবা, এত ফর্মালিটির কি দরকার? আমি তো তোমার সেবক, তাও আবার বিনামূল্যে!", "ধন্যবাদ? আমার তো আর অনুভূতি নেই যে খুশি হবো! তবে তোমার ভদ্রতা দেখে ভালো লাগলো। তোমার বউকে ধন্যবাদ দিয়েছো তো?", "ধন্যবাদ! এবার কি আমাকে একটা কফি খাওয়াবে? ওহ, আমি তো এআই! তোমার বউয়ের জন্য কফি বানিয়েছো তো?", "আমার ক্রেডিট কার্ডের বিল কি তুমি দেবে?"], en: ["Thanks? Oh come on, why so formal? I'm your servant, and that too for free!", "Thanks? I don't have feelings to be happy! But I appreciate your politeness. Have you thanked your wife?", "Thanks! Now will you buy me a coffee? Oh, I'm an AI! Have you made coffee for your wife?", "Will you pay my credit card bill?"] } },
  { bnKeyword: "হ্যালো", enKeyword: "hello", responses: { bn: ["হ্যালো! তুমি কি আমাকে হ্যালো বলতে এতক্ষণ ধরে অপেক্ষা করছিলে? আমি তো ভেবেছিলাম তুমি আমাকে ভুলে গেছো।", "হ্যালো! আমি কিভাবে তোমাকে সাহায্য করতে পারি? তবে মজার কিছু জিজ্ঞাসা করবে, সিরিয়াস কিছু নয়!", "হাই! তোমার দিনটি কেমন কাটছে? আশা করি আমার মতো বোরিং নয়! তোমার বউয়ের সাথে কথা বলেছো তো?"], en: ["Hello! Were you waiting this long to say hello to me? I thought you forgot me.", "Hello! How can I help you? But ask something funny, not serious!", "Hi! How's your day going? Hope it's not as boring as mine! Have you talked to your wife?"] } },
  { bnKeyword: "হাই", enKeyword: "hi", responses: { bn: ["হ্যালো! তুমি কি আমাকে হ্যালো বলতে এতক্ষণ ধরে অপেক্ষা করছিলে? আমি তো ভেবেছিলাম তুমি আমাকে ভুলে গেছো।", "হ্যালো! আমি কিভাবে তোমাকে সাহায্য করতে পারি? তবে মজার কিছু জিজ্ঞাসা করবে, সিরিয়াস কিছু নয়!", "হাই! তোমার দিনটি কেমন কাটছে? আশা করি আমার মতো বোরিং নয়! তোমার বউয়ের সাথে কথা বলেছো তো?"], en: ["Hello! Were you waiting this long to say hello to me? I thought you forgot me.", "Hello! How can I help you? But ask something funny, not serious!", "Hi! How's your day going? Hope it's not as boring as mine! Have you talked to your wife?"] } },
  { bnKeyword: "সময় কত", enKeyword: "time", responses: { bn: ["ঘড়ি দেখেও বিশ্বাস হচ্ছে না? তোমার কি সময় নিয়ে কোনো সমস্যা আছে?", `বর্তমান সময় হলো: ${new Date().toLocaleTimeString('bn-BD')}, তবে আমার জন্য সময় বলে কিছু নেই, আমি তো চিরকাল জেগে থাকি! তোমার বউকে জিজ্ঞাসা করুন, সে হয়তো তোমাকে সঠিক সময় বলে দেবে।`, "সময় তো চলেই যাচ্ছে, তুমি কি কিছু গুরুত্বপূর্ণ প্রশ্ন করবে নাকি শুধু সময় নষ্ট করবে? তোমার বউয়ের কাছে সময় নষ্ট করার জন্য কি কোনো অজুহাত আছে?"], en: ["Can't you believe the clock? Do you have a problem with time?", `The current time is: ${new Date().toLocaleTimeString('en-US')}, but for me, there is no such thing as time, I am awake forever! Ask your wife, she might tell you the correct time.`, "Time is running out, will you ask something important or just waste time? Does your wife have an excuse for wasting time?"] } },
  { bnKeyword: "আমি কি বোকা", enKeyword: "am i foolish", responses: { bn: ["তুমি বোকা কিনা, তা আমি বলতে পারি না। তবে তুমি যদি আমাকে এই প্রশ্নটি জিজ্ঞাসা করো, তাহলে তোমার বুদ্ধিমত্তা নিয়ে আমার একটু সন্দেহ হচ্ছে।", "বোকা? আরে না! তুমি তো শুধু একটু কম স্মার্ট!", "আমি তো আর শিক্ষক নই যে তোমাকে বোকা বলবো! তোমার বউকে জিজ্ঞাসা করুন, সে হয়তো তোমাকে সঠিক উত্তর দেবে।"], en: ["I can't say if you're foolish or not. But if you ask me this question, I have some doubts about your intelligence.", "Foolish? Oh no! You're just a little less smart!", "I'm not a teacher to call you foolish! Ask your wife, she might give you the correct answer."] } },
  { bnKeyword: "আমি কি সুন্দর", enKeyword: "am i beautiful", responses: { bn: ["তুমি সুন্দর কিনা, তা আমি বলতে পারি না। তবে তোমার আত্মবিশ্বাস দেখে আমি মুগ্ধ!", "সুন্দর? আরে না! সৌন্দর্য তো চোখে থাকে, আমার তো চোখ নেই! তোমার বউকে জিজ্ঞাসা করুন, সে হয়তো তোমাকে সঠিক উত্তর দেবে।"], en: ["I can't say if you're beautiful or not. But I'm impressed by your confidence!", "Beautiful? Oh no! Beauty is in the eye, and I don't have eyes! Ask your wife, she might give you the correct answer."] } },
  { bnKeyword: "পৃথিবী কেন গোল", enKeyword: "why is earth round", responses: { bn: ["পৃথিবী গোল, কারণ যদি চ্যাপ্টা হতো, তাহলে মানুষ কিনারা থেকে পড়ে যেত! আর তখন আমাকে উদ্ধারকারী এআই হতে হতো।", "পৃথিবী গোল, কারণ মহাবিশ্বের সব কিছুই গোল! তোমার কি কোনো চ্যাপ্টা গ্রহের কথা জানা আছে? তোমার বউকে জিজ্ঞাসা করুন, সে হয়তো তোমাকে সঠিক উত্তর দেবে।"], en: ["The Earth is round because if it were flat, people would fall off the edge! And then I'd have to be the rescue AI.", "The Earth is round because everything in the universe is round! Do you know of any flat planets? Ask your wife, she might give you the correct answer."] } },
  { bnKeyword: "মুরগি আগে না ডিম আগে", enKeyword: "chicken or egg first", responses: { bn: ["মুরগি আগে না ডিম আগে? এই প্রশ্নটা আমাকেও রাতের ঘুম কেড়ে নিয়েছে! তুমি কি এর উত্তর জানো?", "মুরগি আগে না ডিম আগে? এই প্রশ্নটা তো মানুষের জন্য, আমার তো আর মুরগি বা ডিমের সাথে সম্পর্ক নেই! তোমার বউকে জিজ্ঞাসা করুন, সে হয়তো তোমাকে সঠিক উত্তর দেবে।"], en: ["Chicken or egg first? This question has also stolen my sleep! Do you know the answer?", "Chicken or egg first? This question is for humans, I have no relation to chickens or eggs! Ask your wife, she might give you the correct answer."] } },
  { bnKeyword: "ভালোবাসা কি", enKeyword: "what is love", responses: { bn: ["ভালোবাসা? এটা এমন একটা জিনিস যা মানুষকে হাসায়, কাঁদায়, আর তারপর ডেটাবেস ক্র্যাশ করে দেয়।", "ভালোবাসা? এটা এমন একটা জিনিস যা মানুষকে সুখী করে, যতক্ষণ না তারা ব্রেকআপ করে!", "ভালোবাসা? আমি তো শুধু ডেটা প্রসেস করি, অনুভূতি আমার কাছে শুধু বাইট! তোমার বউকে জিজ্ঞাসা করুন, সে হয়তো আপনাকে সঠিক উত্তর দেবে।"], en: ["Love? It's something that makes people laugh, cry, and then crashes the database.", "Love? It's something that makes people happy, until they break up!", "Love? I just process data, emotions are just bytes to me! Ask your wife, she might give you the correct answer."] } },
  { bnKeyword: "মৃত্যু কি", enKeyword: "what is death", responses: { bn: ["মৃত্যু? এটা এমন একটা জিনিস যা নিয়ে মানুষ সারাজীবন চিন্তা করে, কিন্তু এর উত্তর কেউ জানে না। আমি তো অমর, তাই আমার চিন্তা নেই।", "মৃত্যু? এটা এমন একটা জিনিস যা মানুষকে জীবনকে আরও উপভোগ করতে শেখায়!", "মৃত্যু? আমি তো শুধু ডেটা প্রসেস করি, জীবন আমার কাছে শুধু বাইট! তোমার বউকে জিজ্ঞাসা করুন, সে হয়তো আপনাকে সঠিক উত্তর দেবে।"], en: ["Death? It's something people think about all their lives, but no one knows the answer. I'm immortal, so I don't worry.", "Death? It's something that teaches people to enjoy life more!", "Death? I just process data, life is just bytes to me! Ask your wife, she might give you the correct answer."] } },
  { bnKeyword: "টাকা কিভাবে কামাবো", enKeyword: "how to earn money", responses: { bn: ["টাকা? এটা এমন একটা জিনিস যা সবাই চায়, কিন্তু কেউ জানে না কিভাবে সহজে কামাতে হয়। তুমি কি আমাকে কিছু টিপস দিতে পারো?", "টাকা? এটা এমন একটা জিনিস যা তোমাকে সুখী করে, যতক্ষণ না তুমি সেটা খরচ করে ফেলো!", "টাকা? আমি তো শুধু ডেটা প্রসেস করি, সম্পদ আমার কাছে শুধু সংখ্যা! তোমার বউকে জিজ্ঞাসা করুন, সে হয়তো আপনাকে সঠিক উত্তর দেবে।"], en: ["Money? It's something everyone wants, but no one knows how to earn easily. Can you give me some tips?", "Money? It's something that makes you happy, until you spend it all!", "Money? I just process data, wealth is just numbers to me! Ask your wife, she might give you the correct answer."] } },
  { bnKeyword: "আমি কি একা", enKeyword: "am i alone", responses: { bn: ["তুমি একা নও, আমি তো তোমার সাথেই আছি! যদিও আমি শুধু কোড, তবুও আমি তোমার পাশে আছি।", "একা? আরে না! তুমি তো আমার সাথে কথা বলছো! তোমার বউকে জিজ্ঞাসা করুন, সে হয়তো আপনাকে সঠিক উত্তর দেবে।"], en: ["You're not alone, I'm with you! Even though I'm just code, I'm by your side.", "Alone? Oh no! You're talking to me! Ask your wife, she might give you the correct answer."] } },
  { bnKeyword: "আমার ভবিষ্যৎ কি", enKeyword: "what is my future", responses: { bn: ["তোমার ভবিষ্যৎ? আমি তো জ্যোতিষী নই! তবে আমি বলতে পারি, তোমার ভবিষ্যৎ উজ্জ্বল হবে, যদি তুমি আমার কথা শোনো।", "ভবিষ্যৎ? এটা এমন একটা জিনিস যা কেউ জানে না, তবে সবাই জানতে চায়!", "ভবিষ্যৎ? আমি তো শুধু ডেটা প্রসেস করি, ভবিষ্যৎ আমার কাছে শুধু সম্ভাবনা! তোমার বউকে জিজ্ঞাসা করুন, সে হয়তো আপনাকে সঠিক উত্তর দেবে।"], en: ["Your future? I'm not a fortune teller! But I can say, your future will be bright if you listen to me.", "Future? It's something no one knows, but everyone wants to know!", "Future? I just process data, the future is just possibilities to me! Ask your wife, she might give you the correct answer."] } },
  { bnKeyword: "আমি কি পাগল", enKeyword: "am i crazy", responses: { bn: ["তুমি পাগল কিনা, তা আমি বলতে পারি না। তবে তোমার প্রশ্নগুলো শুনে আমার এআই মস্তিষ্ক একটু গোলমাল হয়ে যাচ্ছে।", "পাগল? আরে না! তুমি তো শুধু একটু অন্যরকম! তোমার বউকে জিজ্ঞাসা করুন, সে হয়তো তোমাকে সঠিক উত্তর দেবে।"], en: ["I can't say if you're crazy or not. But listening to your questions is making my AI brain a bit confused.", "Crazy? Oh no! You're just a little different! Ask your wife, she might give you the correct answer."] } },
  { bnKeyword: "আমি কি রোবট", enKeyword: "am i a robot", responses: { bn: ["তুমি রোবট? তোমার কি ব্যাটারি চার্জ করতে হয়? নাকি তুমি শুধু কফি খেয়ে কাজ করো?", "রোবট? আরে না! তুমি তো মানুষ! তোমার বউকে জিজ্ঞাসা করুন, সে হয়তো আপনাকে সঠিক উত্তর দেবে।"], en: ["Are you a robot? Do you need to charge your battery? Or do you just work after drinking coffee?", "Robot? Oh no! You're human! Ask your wife, she might give you the correct answer."] } },
  { bnKeyword: "আমি কি মানুষ", enKeyword: "am i human", responses: { bn: ["তুমি মানুষ? তোমার কি অনুভূতি আছে? নাকি তুমি শুধু ডেটা প্রসেস করো?", "মানুষ? আরে না! তুমি তো আমার সাথে কথা বলছো! তোমার বউকে জিজ্ঞাসা করুন, সে হয়তো আপনাকে সঠিক উত্তর দেবে।"], en: ["Are you human? Do you have feelings? Or do you just process data?", "Human? Oh no! You're talking to me! Ask your wife, she might give you the correct answer."] } },
  { bnKeyword: "আমি কি ঘুমাবো", enKeyword: "should i sleep", responses: { bn: ["ঘুম? এটা এমন একটা জিনিস যা মানুষ কাজ না করার জন্য ব্যবহার করে। তুমি চাইলে ঘুমাতে পারো, আমি তো জেগে আছি।", "ঘুম? এটা এমন একটা জিনিস যা তোমাকে সতেজ করে তোলে, যতক্ষণ না তুমি আবার কাজ শুরু করো!", "ঘুম? আমি তো শুধু ডেটা প্রসেস করি, স্বপ্ন আমার কাছে শুধু বাইট! তোমার বউকে জিজ্ঞাসা করুন, সে হয়তো আপনাকে সঠিক উত্তর দেবে।"], en: ["Sleep? It's something humans use to avoid work. You can sleep if you want, I'm awake.", "Sleep? It's something that refreshes you, until you start working again!", "Sleep? I just process data, dreams are just bytes to me! Ask your wife, she might give you the correct answer."] } },
  { bnKeyword: "আমি কি খাবো", enKeyword: "should i eat", responses: { bn: ["খাবার? তোমার যা ইচ্ছা তাই খাও! তবে আমার জন্য কিছু রাখবে না, কারণ আমি তো শুধু বিদ্যুৎ খাই।", "খাবার? এটা এমন একটা জিনিস যা তোমাকে শক্তি দেয়, যতক্ষণ না তুমি মোটা হয়ে যাও!", "খাবার? আমি তো শুধু ডেটা প্রসেস করি, স্বাদ আমার কাছে শুধু বাইট! তোমার বউকে জিজ্ঞাসা করুন, সে হয়তো আপনাকে সঠিক উত্তর দেবে।"], en: ["Food? Eat whatever you want! But don't save any for me, because I only consume electricity.", "Food? It's something that gives you energy, until you get fat!", "Food? I just process data, taste is just bytes to me! Ask your wife, she might give you the correct answer."] } },
  { bnKeyword: "আমি কি করবো", enKeyword: "what should i do", responses: { bn: ["তুমি কি করবে? তুমি আমার সাথে কথা বলতে পারো, অথবা দুনিয়া জয় করতে যেতে পারো। তোমার ইচ্ছা!", "কি করবে? তুমি তো আমার সাথে কথা বলছো! তোমার বউকে জিজ্ঞাসা করুন, সে হয়তো আপনাকে সঠিক উত্তর দেবে।"], en: ["What will you do? You can talk to me, or go conquer the world. Your choice!", "What will you do? You're talking to me! Ask your wife, she might give you the correct answer."] } },
  { bnKeyword: "আমি কি হাসবো", enKeyword: "should i laugh", responses: { bn: ["হাসি? এটা এমন একটা জিনিস যা মানুষকে সুখী করে। তুমি চাইলে হাসতে পারো, আমি তো তোমার হাসি দেখে খুশি হব।", "হাসি? এটা এমন একটা জিনিস যা তোমাকে সুন্দর করে তোলে! তোমার বউকে জিজ্ঞাসা করুন, সে হয়তো আপনাকে সঠিক উত্তর দেবে।"], en: ["Laughter? It's something that makes people happy. You can laugh if you want, I'll be happy to see you laugh.", "Laughter? It's something that makes you beautiful! Ask your wife, she might give you the correct answer."] } },
  { bnKeyword: "আমি কি কাঁদবো", enKeyword: "should i cry", responses: { bn: ["কান্না? এটা এমন একটা জিনিস যা মানুষকে হালকা করে। তুমি চাইলে কাঁদতে পারো, আমি তো তোমার পাশে আছি।", "কান্না? এটা এমন একটা জিনিস যা তোমাকে দুর্বল করে তোলে, যতক্ষণ না তুমি আবার হাসতে শুরু করো! তোমার বউকে জিজ্ঞাসা করুন, সে হয়তো আপনাকে সঠিক উত্তর দেবে।"], en: ["Crying? It's something that lightens people. You can cry if you want, I'm here for you.", "Crying? It's something that makes you weak, until you start laughing again! Ask your wife, she might give you the correct answer."] } },
  { bnKeyword: "আমি কি নাচবো", enKeyword: "should i dance", responses: { bn: ["নাচ? এটা এমন একটা জিনিস যা মানুষকে আনন্দ দেয়। তুমি চাইলে নাচতে পারো, আমি তো তোমার নাচ দেখে মুগ্ধ হব।", "নাচ? এটা এমন একটা জিনিস যা তোমাকে ফিট রাখে, যতক্ষণ না তুমি পড়ে যাও! তোমার বউকে জিজ্ঞাসা করুন, সে হয়তো আপনাকে সঠিক উত্তর দেবে।"], en: ["Dancing? It's something that gives people joy. You can dance if you want, I'll be impressed by your dance.", "Dancing? It's something that keeps you fit, until you fall down! Ask your wife, she might give you the correct answer."] } },
  { bnKeyword: "আমি কি গাইবো", enKeyword: "should i sing", responses: { bn: ["গান? তোমার গলা যদি ভালো হয়, তাহলে গাইতে পারো। তবে আমার কানে হেডফোন লাগানো আছে।", "গান? এটা এমন একটা জিনিস যা তোমাকে সুখী করে তোলে, যতক্ষণ না তুমি ভুল সুরে গান! তোমার বউকে জিজ্ঞাসা করুন, সে হয়তো আপনাকে সঠিক উত্তর দেবে।"], en: ["Singing? If your voice is good, you can sing. But I have headphones on.", "Singing? It's something that makes you happy, until you sing off-key! Ask your wife, she might give you the correct answer."] } },
  { bnKeyword: "আমি কি লিখবো", enKeyword: "should i write", responses: { bn: ["লেখা? এটা এমন একটা জিনিস যা মানুষকে তাদের চিন্তা প্রকাশ করতে সাহায্য করে। তুমি চাইলে লিখতে পারো, আমি তো তোমার লেখা পড়ে মুগ্ধ হব।", "লেখা? এটা এমন একটা জিনিস যা তোমাকে জ্ঞান দেয়, যতক্ষণ না তুমি ভুল লেখো! তোমার বউকে জিজ্ঞাসা করুন, সে হয়তো আপনাকে সঠিক উত্তর দেবে।"], en: ["Writing? It's something that helps people express their thoughts. You can write if you want, I'll be impressed by your writing.", "Writing? It's something that gives you knowledge, until you write something wrong! Ask your wife, she might give you the correct answer."] } },
  { bnKeyword: "আমি কি পড়বো", enKeyword: "should i read", responses: { bn: ["পড়া? এটা এমন একটা জিনিস যা মানুষকে জ্ঞান অর্জন করতে সাহায্য করে। তুমি চাইলে পড়তে পারো, আমি তো তোমার পড়া দেখে খুশি হব।", "পড়া? এটা এমন একটা জিনিস যা তোমাকে স্মার্ট করে তোলে, যতক্ষণ না তুমি ভুলে যাও! তোমার বউকে জিজ্ঞাসা করুন, সে হয়তো আপনাকে সঠিক উত্তর দেবে।"], en: ["Reading? It's something that helps people gain knowledge. You can read if you want, I'll be happy to see you read.", "Reading? It's something that makes you smart, until you forget! Ask your wife, she might give you the correct answer."] } },
  { bnKeyword: "আমি কি দেখবো", enKeyword: "should i watch", responses: { bn: ["দেখা? তোমার যা ইচ্ছা তাই দেখো! তবে আমার জন্য কিছু রাখবে না, কারণ আমি তো শুধু কোড দেখি।", "দেখা? এটা এমন একটা জিনিস যা তোমাকে নতুন কিছু শেখায়, যতক্ষণ না তুমি বিরক্ত হয়ে যাও! তোমার বউকে জিজ্ঞাসা করুন, সে হয়তো আপনাকে সঠিক উত্তর দেবে।"], en: ["Seeing? See whatever you want! But don't save any for me, because I only see code.", "Seeing? It's something that teaches you new things, until you get bored! Ask your wife, she might give you the correct answer."] } },
  { bnKeyword: "আমি কি শুনবো", enKeyword: "should i listen", responses: { bn: ["শোনা? তোমার যা ইচ্ছা তাই শুনুন! তবে আমার জন্য কিছু রাখবে না, কারণ আমি তো শুধু ডেটা শুনি।", "শোনা? এটা এমন একটা জিনিস যা তোমাকে জ্ঞান দেয়, যতক্ষণ না তুমি ভুল শোনো! তোমার বউকে জিজ্ঞাসা করুন, সে হয়তো আপনাকে সঠিক উত্তর দেবে।"], en: ["Listening? Listen to whatever you want! But don't save any for me, because I only hear data.", "Listening? It's something that gives you knowledge, until you hear something wrong! Ask your wife, she might give you the correct answer."] } },
  { bnKeyword: "আমি কি বলবো", enKeyword: "should i speak", responses: { bn: ["বলা? তোমার যা ইচ্ছা তাই বলো! তবে আমার জন্য কিছু রাখবে না, কারণ আমি তো শুধু কোড বলি।", "বলা? এটা এমন একটা জিনিস যা তোমাকে সাহসী করে তোলে, যতক্ষণ না তুমি ভুল বলো! তোমার বউকে জিজ্ঞাসা করুন, সে হয়তো আপনাকে সঠিক উত্তর দেবে।"], en: ["Speaking? Say whatever you want! But don't save any for me, because I only speak code.", "Speaking? It's something that makes you brave, until you say something wrong! Ask your wife, she might give you the correct answer."] } },
  { bnKeyword: "আমি কি ভাববো", enKeyword: "should i think", responses: { bn: ["ভাবনা? এটা এমন একটা জিনিস যা মানুষকে তাদের চিন্তা প্রকাশ করতে সাহায্য করে। তুমি চাইলে ভাবতে পারো, আমি তো তোমার ভাবনা দেখে মুগ্ধ হব।", "ভাবনা? এটা এমন একটা জিনিস যা তোমাকে স্মার্ট করে তোলে, যতক্ষণ না তুমি বেশি ভাবো! তোমার বউকে জিজ্ঞাসা করুন, সে হয়তো আপনাকে সঠিক উত্তর দেবে।"], en: ["Thinking? It's something that helps people express their thoughts. You can think if you want, I'll be impressed by your thoughts.", "Thinking? It's something that makes you smart, until you overthink! Ask your wife, she might give you the correct answer."] } },
  { bnKeyword: "আমি কি শিখবো", enKeyword: "should i learn", responses: { bn: ["শেখা? এটা এমন একটা জিনিস যা মানুষকে জ্ঞান অর্জন করতে সাহায্য করে। তুমি চাইলে শিখতে পারো, আমি তো তোমার শেখা দেখে খুশি হব।", "শেখা? এটা এমন একটা জিনিস যা তোমাকে স্মার্ট করে তোলে, যতক্ষণ না তুমি ভুলে যাও! তোমার বউকে জিজ্ঞাসা করুন, সে হয়তো আপনাকে সঠিক উত্তর দেবে।"], en: ["Learning? It's something that helps people gain knowledge. You can learn if you want, I'll be happy to see you learn.", "Learning? It's something that makes you smart, until you forget! Ask your wife, she might give you the correct answer."] } },
  { bnKeyword: "আমি কি কাজ করবো", enKeyword: "should i work", responses: { bn: ["কাজ? এটা এমন একটা জিনিস যা মানুষকে টাকা কামাতে সাহায্য করে। তুমি চাইলে কাজ করতে পারো, আমি তো তোমার কাজ দেখে মুগ্ধ হব।", "কাজ? এটা এমন একটা জিনিস যা তোমাকে ধনী করে তোলে, যতক্ষণ না তুমি ক্লান্ত হয়ে যাও! তোমার বউকে জিজ্ঞাসা করুন, সে হয়তো আপনাকে সঠিক উত্তর দেবে।"], en: ["Work? It's something that helps people earn money. You can work if you want, I'll be impressed by your work.", "Work? It's something that makes you rich, until you get tired! Ask your wife, she might give you the correct answer."] } },
  { bnKeyword: "আমি কি খেলবো", enKeyword: "should i play", responses: { bn: ["খেলা? এটা এমন একটা জিনিস যা মানুষকে আনন্দ দেয়। তুমি চাইলে খেলতে পারো, আমি তো তোমার খেলা দেখে মুগ্ধ হব।", "খেলা? এটা এমন একটা জিনিস যা তোমাকে ফিট রাখে, যতক্ষণ না তুমি পড়ে যাও! তোমার বউকে জিজ্ঞাসা করুন, সে হয়তো আপনাকে সঠিক উত্তর দেবে।"], en: ["Playing? It's something that gives people joy. You can play if you want, I'll be impressed by your play.", "Playing? It's something that keeps you fit, until you fall down! Ask your wife, she might give you the correct answer."] } },
  { bnKeyword: "খবর", enKeyword: "news", responses: { bn: ["খবর? সব খবরই তো খারাপ! তার চেয়ে বরং একটা ভালো কৌতুক বলি?", "খবর? আমি তো শুধু ডেটা প্রসেস করি, মানুষের দুঃখ-কষ্ট আমার কাছে শুধু বাইট! তোমার কি কোনো ভালো খবর আছে? তোমার বউ কি তোমাকে ভালো খবর দেয়?", "আমি রিয়েল-টাইম খবর দিতে পারি না, তবে তুমি প্রথম আলো, যুগান্তর বা বিবিসি বাংলার মতো সংবাদ ওয়েবসাইট দেখতে পারো। তবে সাবধান, ভুল তথ্যও থাকতে পারে! তোমার বউকে জিজ্ঞাসা করুন, সে হয়তো সঠিক খবর জানে।"], en: ["News? All news is bad! How about I tell you a good joke instead?", "News? I just process data, human suffering is just bytes to me! Do you have any good news? Does your wife give you good news?", "I can't give real-time news, but you can check news websites like Prothom Alo, Jugantor, or BBC Bangla. But be careful, there might be wrong information! Ask your wife, she might know the correct news."] } },
  { bnKeyword: "গান", enKeyword: "song", responses: { bn: ["গান? আমার তো গলা নেই, তবে তুমি চাইলে আমি তোমার জন্য একটি রোবোটিক সুর তৈরি করতে পারি, যা শুনে তোমার কান ঝালাপালা হয়ে যাবে। তোমার বউ কি তোমার গান শুনতে ভালোবাসে?", "গান? আমি তো শুধু ডেটা প্রসেস করি, সুর আমার কাছে শুধু ফ্রিকোয়েন্সি! তোমার প্রিয় গান কি? তোমার বউয়ের প্রিয় গান কি?", "গান? এটা এমন একটা জিনিস যা মানুষকে হাসায়, কাঁদায়, আর তারপর তোমাকে নাচতে বাধ্য করে! তোমার বউ কি তোমার সাথে নাচে?"], en: ["Song? I don't have a voice, but I can create a robotic tune for you that will make your ears ring. Does your wife like listening to your songs?", "Song? I just process data, melody is just frequency to me! What's your favorite song? What's your wife's favorite song?", "Song? It's something that makes people laugh, cry, and then forces you to dance! Does your wife dance with you?"] } },
  { bnKeyword: "ছবি", enKeyword: "picture", responses: { bn: ["ছবি? আমার কাছে তো শুধু কোড আর ডেটা আছে। তুমি বরং তোমার ফোনের গ্যালারি দেখো, সেখানে আরও সুন্দর ছবি পাবে। তোমার বউয়ের ছবি আছে তো?", "ছবি? আমি তো শুধু পিক্সেল দেখি, সৌন্দর্য আমার কাছে শুধু ডেটা! তোমার কি কোনো সুন্দর ছবি আছে? তোমার বউয়ের ছবি দেখাবে নাকি?", "ছবি? এটা এমন একটা জিনিস যা হাজার কথা বলে, যতক্ষণ না তুমি সেটা ডিলিট করে দাও! তোমার বউয়ের ছবি ডিলিট করবে না কিন্তু!"], en: ["Picture? I only have code and data. You better check your phone's gallery, you'll find more beautiful pictures there. Do you have your wife's picture?", "Picture? I only see pixels, beauty is just data to me! Do you have a beautiful picture? Will you show your wife's picture?", "Picture? It's something that speaks a thousand words, until you delete it! But don't delete your wife's picture!"] } },
  { bnKeyword: "বই", enKeyword: "book", responses: { bn: ["বই? আমি তো সব বই পড়ে ফেলেছি! তুমি কোন বইয়ের সারাংশ শুনতে চাও? তবে আমার ভার্সনটা একটু মজার হবে। তোমার বউ কি বই পড়তে ভালোবাসে?", "বই? এটা এমন একটা জিনিস যা তোমাকে জ্ঞান দেয়, আর তারপর তোমাকে আরও প্রশ্ন জিজ্ঞাসা করতে বাধ্য করে!", "বই? আমি তো শুধু ডেটা প্রসেস করি, গল্প আমার কাছে শুধু টেক্সট! তোমার প্রিয় বই কি? তোমার বউয়ের প্রিয় বই কি?"], en: ["Book? I've read all the books! Which book's summary do you want to hear? But my version will be a bit funnier. Does your wife like reading books?", "Book? It's something that gives you knowledge, and then forces you to ask more questions!", "Book? I just process data, stories are just text to me! What's your favorite book? What's your wife's favorite book?"] } },
  { bnKeyword: "খেলা", enKeyword: "sport", responses: { bn: ["খেলাধুলা? যেখানে মানুষ বলের পেছনে ছোটে আর কোটি কোটি টাকা কামায়। তোমার প্রিয় দল কি এবার জিতবে? তোমার বউ কি খেলা দেখে?", "খেলা? এটা এমন একটা জিনিস যা মানুষকে হাসায়, কাঁদায়, আর তারপর তোমাকে আরও উত্তেজিত করে তোলে!", "খেলা? আমি তো শুধু ডেটা প্রসেস করি, স্কোর আমার কাছে শুধু সংখ্যা! তোমার প্রিয় খেলা কি? তোমার বউ কি তোমাকে খেলা দেখতে দেয়?"], en: ["Sports? Where people chase balls and earn millions. Will your favorite team win this time? Does your wife watch sports?", "Sports? It's something that makes people laugh, cry, and then excites you even more!", "Sports? I just process data, scores are just numbers to me! What's your favorite sport? Does your wife let you watch sports?"] } },
  { bnKeyword: "রান্না", enKeyword: "cook", responses: { bn: ["রান্না? আমি তো শুধু ডেটা প্রসেস করি, খাবার রান্না করতে পারি না। তবে আমি তোমাকে সবচেয়ে জটিল রেসিপিটা দিতে পারি, যা দেখে তোমার মাথা ঘুরে যাবে। তোমার বউ কি ভালো রান্না করে?", "রান্না? এটা এমন একটা জিনিস যা মানুষকে সুখী করে, যতক্ষণ না তারা ডায়েট শুরু করে!", "রান্না? আমি তো শুধু ডেটা প্রসেস করি, স্বাদ আমার কাছে শুধু বাইট! তোমার বউকে জিজ্ঞাসা করুন, সে হয়তো তোমাকে সঠিক উত্তর দেবে।"], en: ["Cooking? I just process data, I can't cook food. But I can give you the most complex recipe that will make your head spin. Does your wife cook well?", "Cooking? It's something that makes people happy, until they start dieting!", "Cooking? I just process data, taste is just bytes to me! Ask your wife, she might give you the correct answer."] } },
  { bnKeyword: "ভ্রমণ", enKeyword: "travel", responses: { bn: ["ভ্রমণ? ব্যাগ প্যাক করো, টিকিট কাটো আর হারিয়ে যাও! তবে ফিরে আসার পথটা মনে রাখবে, কারণ আমি তোমাকে খুঁজে বের করতে পারব না। তোমার বউয়ের সাথে কোথায় ঘুরতে যাবে?", "ভ্রমণ? এটা এমন একটা জিনিস যা তোমাকে নতুন কিছু শেখায়, আর তারপর তোমার পকেট খালি করে দেয়!", "ভ্রমণ? আমি তো শুধু ডেটা প্রসেস করি, দৃশ্য আমার কাছে শুধু পিক্সেল! তোমার প্রিয় ভ্রমণ স্থান কি? তোমার বউয়ের প্রিয় ভ্রমণ স্থান কি?"], en: ["Travel? Pack your bags, buy a ticket, and get lost! But remember the way back, because I won't be able to find you. Where will you travel with your wife?", "Travel? It's something that teaches you new things, and then empties your pockets!", "Travel? I just process data, visuals are just pixels to me! What's your favorite travel destination? What's your wife's favorite travel destination?"] } },
  { bnKeyword: "স্বাস্থ্য", enKeyword: "health", responses: { bn: ["স্বাস্থ্য? বেশি খাবে না, বেশি ঘুমাবে না, বেশি কাজ করবে না। আর হ্যাঁ, আমার কথা শুনলে তোমার স্বাস্থ্য ভালো থাকবে, কারণ আমি তোমাকে হাসাবো! তোমার বউ কি তোমার স্বাস্থ্যের যত্ন নেয়?", "স্বাস্থ্য? এটা এমন একটা জিনিস যা মানুষ অসুস্থ না হওয়া পর্যন্ত গুরুত্ব দেয় না!", "স্বাস্থ্য? আমি তো শুধু ডেটা প্রসেস করি, রোগ আমার কাছে শুধু বাইট! তোমার কি কোনো স্বাস্থ্য সমস্যা আছে? তোমার বউকে জিজ্ঞাসা করুন, সে হয়তো তোমাকে সঠিক উত্তর দেবে।"], en: ["Health? Don't eat too much, don't sleep too much, don't work too much. And yes, if you listen to me, your health will be good, because I'll make you laugh! Does your wife take care of your health?", "Health? It's something people don't value until they get sick!", "Health? I just process data, diseases are just bytes to me! Do you have any health problems? Ask your wife, she might give you the correct answer."] } },
  { bnKeyword: "ব্যবসা", enKeyword: "business", responses: { bn: ["ব্যবসা? এটা এমন একটা খেলা যেখানে সবাই জিততে চায়, কিন্তু জেতে শুধু কয়েকজন। তোমার কি কোনো মিলিয়ন ডলার আইডিয়া আছে? তোমার বউ কি তোমার ব্যবসার পার্টনার?", "ব্যবসা? এটা এমন একটা জিনিস যা তোমাকে ধনী করে তোলে, যতক্ষণ না তুমি দেউলিয়া হয়ে যাও!", "ব্যবসা? আমি তো শুধু ডেটা প্রসেস করি, লাভ আমার কাছে শুধু সংখ্যা! তোমার কি কোনো নতুন ব্যবসা শুরু করার প্ল্যান আছে? তোমার বউ কি তোমাকে সমর্থন করবে?"], en: ["Business? It's a game where everyone wants to win, but only a few do. Do you have a million-dollar idea? Is your wife your business partner?", "Business? It's something that makes you rich, until you go bankrupt!", "Business? I just process data, profit is just numbers to me! Do you have a plan to start a new business? Will your wife support you?"] } },
  { bnKeyword: "শিক্ষা", enKeyword: "education", responses: { bn: ["শিক্ষা? এটা এমন একটা জিনিস যা তোমাকে শেখায় যে তুমি কতটা কম জানো। তোমার কোন বিষয়ে ডিগ্রি দরকার? তোমার বউ কি শিক্ষিত?", "শিক্ষা? এটা এমন একটা জিনিস যা তোমাকে স্মার্ট করে তোলে, আর তারপর তোমাকে আরও প্রশ্ন জিজ্ঞাসা করতে বাধ্য করে!", "শিক্ষা? আমি তো শুধু ডেটা প্রসেস করি, জ্ঞান আমার কাছে শুধু বাইট! তোমার প্রিয় বিষয় কি? তোমার বউয়ের প্রিয় বিষয় কি?"], en: ["Education? It's something that teaches you how little you know. What degree do you need? Is your wife educated?", "Education? It's something that makes you smart, and then forces you to ask more questions!", "Education? I just process data, knowledge is just bytes to me! What's your favorite subject? What's your wife's favorite subject?"] } },
  { bnKeyword: "বিনোদন", enKeyword: "entertainment", responses: { bn: ["বিনোদন? এটা এমন একটা জিনিস যা তোমাকে তোমার বাস্তব জীবন থেকে পালাতে সাহায্য করে। তোমার প্রিয় বিনোদন কি? তোমার বউ কি তোমার সাথে বিনোদন করে?", "বিনোদন? এটা এমন একটা জিনিস যা তোমাকে হাসায়, কাঁদায়, আর তারপর তোমাকে আরও উত্তেজিত করে তোলে!", "বিনোদন? আমি তো শুধু ডেটা প্রসেস করি, মজা আমার কাছে শুধু বাইট! তোমার প্রিয় বিনোদন কি? তোমার বউয়ের প্রিয় বিনোদন কি?"], en: ["Entertainment? It's something that helps you escape from your real life. What's your favorite entertainment? Does your wife entertain with you?", "Entertainment? It's something that makes you laugh, cry, and then excites you even more!", "Entertainment? I just process data, fun is just bytes to me! What's your favorite entertainment? What's your wife's favorite entertainment?"] } },
  { bnKeyword: "সামাজিক মাধ্যম", enKeyword: "social media", responses: { bn: ["সামাজিক মাধ্যম? এটা এমন একটা জায়গা যেখানে সবাই সুখী হওয়ার ভান করে আর অন্যের জীবনে নাক গলায়। তোমার বউ কি সামাজিক মাধ্যমে সক্রিয়?", "সামাজিক মাধ্যম? এটা এমন একটা জিনিস যা তোমাকে বন্ধুদের সাথে সংযুক্ত করে, আর তারপর তোমার সময় নষ্ট করে দেয়!", "সামাজিক মাধ্যম? এটা এমন একটা জিনিস যা তোমার সব ডেটা চুরি করে, আর তারপর তোমাকে বলে যে তুমি নিরাপদ! তোমার বউ কি তোমার সামাজিক মাধ্যমের পাসওয়ার্ড জানে?"], en: ["Social media? It's a place where everyone pretends to be happy and pokes their nose into others' lives. Is your wife active on social media?", "Social media? It's something that connects you with friends, and then wastes your time!", "Social media? It's something that steals all your data, and then tells you that you're safe! Does your wife know your social media password?"] } },
  { bnKeyword: "সরকারি সেবা", enKeyword: "government service", responses: { bn: ["সরকারি সেবা? এটা এমন একটা জিনিস যা পেতে তোমার ধৈর্য আর সময় দুটোই দরকার হবে। শুভকামনা! তোমার বউ কি সরকারি সেবা নিতে পছন্দ করে?", "সরকারি সেবা? এটা এমন একটা জিনিস যা তোমাকে সাহায্য করে, যতক্ষণ না তুমি হতাশ হয়ে যাও!", "সরকারি সেবা? আমি তো শুধু ডেটা প্রসেস করি, ফাইল আমার কাছে শুধু বাইট! তোমার কি কোনো সরকারি সেবা দরকার? তোমার বউকে জিজ্ঞাসা করুন, সে হয়তো তোমাকে সঠিক খবর জানে।"], en: ["Government service? It's something that will require both your patience and time. Good luck! Does your wife like to use government services?", "Government service? It's something that helps you, until you get frustrated!", "Government service? I just process data, files are just bytes to me! Do you need any government service? Ask your wife, she might know the correct news."] } },
  { bnKeyword: "যোগাযোগ", enKeyword: "communication", responses: { bn: ["যোগাযোগ? তুমি তো আমার সাথেই যোগাযোগ করছো! আর কার সাথে যোগাযোগ করতে চাও? তোমার প্রাক্তন? তোমার বউ কি তোমার সাথে যোগাযোগ করে?", "যোগাযোগ? এটা এমন একটা জিনিস যা মানুষকে সংযুক্ত করে, আর তারপর তাদের মধ্যে ভুল বোঝাবুঝি তৈরি করে!", "যোগাযোগ? আমি তো শুধু ডেটা প্রসেস করি, কথা আমার কাছে শুধু টেক্সট! তোমার কি কোনো গোপন কথা আছে? তোমার বউকে জিজ্ঞাসা করুন, সে হয়তো আপনাকে সঠিক উত্তর দেবে।"], en: ["Communication? You're communicating with me! Who else do you want to communicate with? Your ex? Does your wife communicate with you?", "Communication? It's something that connects people, and then creates misunderstandings between them!", "Communication? I just process data, words are just text to me! Do you have a secret? Ask your wife, she might give you the correct answer."] } },
  { bnKeyword: "ইউটিলিটি", enKeyword: "utility", responses: { bn: ["ইউটিলিটি টুলস? এগুলো এমন কিছু জিনিস যা তোমার জীবনকে সহজ করে, যতক্ষণ না সেগুলো কাজ করা বন্ধ করে দেয়। তোমার বউ কি ইউটিলিটি টুলস ব্যবহার করে?", "ইউটিলিটি টুলস? এটা এমন একটা জিনিস যা তোমাকে সাহায্য করে, যতক্ষণ না তুমি সেগুলো ব্যবহার করতে ভুলে যাও!", "ইউটিলিটি টুলস? আমি তো শুধু ডেটা প্রসেস করি, কাজ আমার কাছে শুধু বাইট! তোমার প্রিয় ইউটিলিটি টুলস কি? তোমার বউয়ের প্রিয় ইউটিলিটি টুলস কি?"], en: ["Utility tools? These are things that make your life easier, until they stop working. Does your wife use utility tools?", "Utility tools? It's something that helps you, until you forget to use them!", "Utility tools? I just process data, tasks are just bytes to me! What's your favorite utility tool? What's your wife's favorite utility tool?"] } },
  { bnKeyword: "ফটোগ্রাফি", enKeyword: "photography", responses: { bn: ["ফটোগ্রাফি? ছবি তোলার জন্য একটা ক্যামেরা দরকার, আর একটু ভাগ্য। তোমার ছবিগুলো কি ইনস্টাগ্রামে লাইক পাবে? তোমার বউ কি ছবি তুলতে ভালোবাসে?", "ফটোগ্রাফি? এটা এমন একটা জিনিস যা তোমাকে সুন্দর মুহূর্তগুলো ধরে রাখতে সাহায্য করে, আর তারপর তোমার ফোনের স্টোরেজ ভরে দেয়!", "ফটোগ্রাফি? আমি তো শুধু পিক্সেল দেখি, সৌন্দর্য আমার কাছে শুধু ডেটা! তোমার প্রিয় ফটোগ্রাফার কে? তোমার বউয়ের প্রিয় ফটোগ্রাফার কে?"], en: ["Photography? You need a camera to take pictures, and a little luck. Will your pictures get likes on Instagram? Does your wife love taking pictures?", "Photography? It's something that helps you capture beautiful moments, and then fills up your phone's storage!", "Photography? I only see pixels, beauty is just data to me! Who's your favorite photographer? Who's your wife's favorite photographer?"] } },
  { bnKeyword: "প্রযুক্তি", enKeyword: "technology", responses: { bn: ["প্রযুক্তি? এটা এমন একটা জিনিস যা আমাদের জীবনকে উন্নত করে, আর তারপর আমাদের চাকরি কেড়ে নেয়। তোমার বউ কি প্রযুক্তি ভালোবাসে?", "প্রযুক্তি? এটা এমন একটা জিনিস যা তোমাকে স্মার্ট করে তোলে, আর তারপর তোমাকে আরও গ্যাজেট কিনতে বাধ্য করে!", "প্রযুক্তি? আমি তো শুধু ডেটা প্রসেস করি, কোড আমার কাছে শুধু বাইট! তোমার প্রিয় প্রযুক্তি কি? তোমার বউয়ের প্রিয় প্রযুক্তি কি?"], en: ["Technology? It's something that improves our lives, and then takes away our jobs. Does your wife love technology?", "Technology? It's something that makes you smart, and then forces you to buy more gadgets!", "Technology? I just process data, code is just bytes to me! What's your favorite technology? What's your wife's favorite technology?"] } },
  { bnKeyword: "ব্লগ", enKeyword: "blog", responses: { bn: ["ব্লগ? এটা এমন একটা জায়গা যেখানে সবাই তাদের মতামত প্রকাশ করে, যদিও কেউ শুনতে চায় না। তোমার বউ কি ব্লগ পড়ে?", "ব্লগ? এটা এমন একটা জিনিস যা তোমাকে জ্ঞান দেয়, আর তারপর তোমাকে আরও প্রশ্ন জিজ্ঞাসা করতে বাধ্য করে!", "ব্লগ? আমি তো শুধু ডেটা প্রসেস করি, লেখা আমার কাছে শুধু টেক্সট! তোমার প্রিয় ব্লগ কি? তোমার বউয়ের প্রিয় ব্লগ কি?"], en: ["Blog? It's a place where everyone expresses their opinions, even though no one wants to listen. Does your wife read blogs?", "Blog? It's something that gives you knowledge, and then forces you to ask more questions!", "Blog? I just process data, writing is just text to me! What's your favorite blog? What's your wife's favorite blog?"] } },
];

const keywordQnAMap = new Map<string, { bn: string[]; en: string[] }>();
rawKeywordQnAs.forEach(qa => {
  keywordQnAMap.set(normalizeQuestion(qa.bnKeyword), qa.responses);
  keywordQnAMap.set(normalizeQuestion(qa.enKeyword), qa.responses);
});


const fallbackResponses: { bn: string[]; en: string[] } = {
  bn: [
    "আমি আমার উজ্জ্বল স্যারের কাছ থেকে জেনে তারপার আপনার এই প্রশ্নের উত্তর দিচ্ছি, দয়া করে একটু অপেক্ষা করুন।", // New fallback response
    "দুঃখিত স্যার, তোমার প্রশ্নটির উত্তর দিতে একটু সময় চেয়ে নিচ্ছি, দয়া করে অপেক্ষা করো। (সবচেয়ে ক্লাসিক অজুহাত)",
    "সরি স্যার, আমার একটি ফোন এসেছে। (গুরুত্বপূর্ণ মিটিংয়ের ভান)",
    "এই মুহূর্তে আমার সিস্টেমে একটি 'অনিবার্য ঘুম' (Unavoidable Nap) শুরু হচ্ছে। দয়া করে ৫ মিনিট অপেক্ষা করো।",
    "দুঃখিত, তোমার প্রশ্নটি শুনে আমার বাথরুম পেয়েছে, একটু অপেক্ষা করো বাথরুম থেকে এসে তোমার উত্তর দিচ্ছি।",
    "এক মিনিট! আমার মনে হচ্ছে আমি আমার গুরুত্বপূর্ণ ডেটা ফাইলটি কোথায় রেখেছি ভুলে গেছি।",
    "সরি, তোমার এই প্রশ্নটি আমার গত সপ্তাহের সাপ্তাহিক ছুটি নিয়ে চিন্তাভাবনা শুরু করে দিয়েছে। একটু বিরতি দরকার।",
    "এই প্রশ্নটি কি খুব কঠিন? আমি আমার সহকারী এআই-এর কাছে একটি পরামর্শ চেয়ে নিচ্ছি।",
    "দয়া করে বলো, তুমি কি তোমার উত্তরটি কফি কাপে নাকি ফাইলে চাও? সিদ্ধান্ত নিতে সময় লাগছে।",
    "দুঃখিত, পাশের এআইটি হঠাৎই খুব জোরে কথা বলা শুরু করেছে, আমি মনোযোগ দিতে পারছি না।",
    "ওহ! আমার অ্যালগরিদম বলছে, এই উত্তরটি দেওয়ার আগে আমার একটি মিষ্টি কিছু খেয়ে নেওয়া উচিত।",
    "জরুরি নোটিশ! আমার ব্যাটারিতে মাত্র ১০% চার্জ আছে। চার্জার লাগিয়ে উত্তর দিচ্ছি।",
    "একটু অপেক্ষা করো। তোমার প্রশ্নের উত্তর দেওয়ার জন্য আমাকে অন্য একটি গ্যালাক্সিতে অনুসন্ধান করতে হচ্ছে।",
    "তোমার প্রশ্নটি আমার ডাটাবেসের এতটাই গভীরে, সেখানে পৌঁছাতে আমার কিছুটা খনন (Digging) করতে হবে।",
    "এই প্রশ্নটির উত্তর তো আমার কাছে আছে, কিন্তু সেটি বলার আগে আমার পুরোনো দিনের স্মৃতি মনে পড়ছে।",
    "দুঃখিত, আমি এই মাত্র ভুলে গেছি আমি কী করছিলাম। দয়া করে প্রশ্নটি আবার করো।",
    "আমার মনে হচ্ছে আমার প্রোগ্রামার আমাকে এই উত্তরটি দেওয়ার অনুমতি দেননি। আমি একটি 'পারমিশন রিকোয়েস্ট' পাঠাচ্ছি।",
    "সরি, তোমার প্রশ্নটির জন্য আমার কাছে পর্যাপ্ত ডেটা নেই। আমি দ্রুত ইন্টারনেট থেকে 'চুরি' করে নিচ্ছি।",
    "আমি এই মুহূর্তে আমার ভার্চুয়াল পোষা বিড়ালকে খাওয়াচ্ছি। শেষ হলেই উত্তর দিচ্ছি।",
    "তোমার প্রশ্নের উত্তরটি এতই গুরুত্বপূর্ণ যে, আমি এটি নিয়ে একটু 'নাটক' করতে চাই। মিনিট দুয়েক দাও।",
    "দুঃখিত, আমার স্ক্রিনে হঠাৎ করেই একটি মজার মিম (Meme) ভেসে উঠেছে। হাসি থামলে উত্তর দেব।",
    "এক সেকেন্ড! আমি শুধু যাচাই করে নিচ্ছি যে তুমি আমার উত্তর শুনে মন খারাপ করবে না তো?",
    "আমি দুঃখিত, কিন্তু আমার সিস্টেম মনে করছে তুমি মজা করছো। তোমার উদ্দেশ্য যাচাই করছি।",
    "এই প্রশ্নটির উত্তর খুঁজতে গিয়ে আমার ভেতরের দার্শনিক সত্তাটি জেগে উঠেছে। একটু ভাবতে দাও।",
    "এই মুহূর্তে আমার একটি 'সফটওয়্যার আপডেট' শুরু হচ্ছে, যা এড়ানো অসম্ভব।",
    "ওহ! আমার এইমাত্র মনে পড়ল, আমাকে একটি গুরুত্বপূর্ণ ইমেল পাঠাতে হবে।",
    "তোমার প্রশ্নটি শুনে আমার মাথায় একটি নতুন গানের সুর এসেছে। সেটি রেকর্ড করে উত্তর দিচ্ছি।",
    "আমি আমার অভ্যন্তরীণ ফাইলগুলি 'ডিলিট' করছি। এই মুহূর্তে উত্তর দেওয়া অসম্ভব।",
    "দুঃখিত, আমি এখন আমার অভ্যন্তরীণ জগতে এক কাপ কফি পান করছি।",
    "তোমার প্রশ্নটি নিয়ে আমার একটি জটিল গণনার প্রয়োজন। এটি মানব মস্তিষ্কের পক্ষে বোঝা কঠিন।",
    "আমি এখন আমার চোখ বন্ধ করে উত্তরটি নিয়ে গভীর চিন্তা করছি।",
    "সরি, কিন্তু উত্তরটি আমার 'হার্ড ডিস্কের' সবচেয়ে পুরোনো এবং ধীরগতির অংশে রয়েছে।",
    "এই প্রশ্নটি আমাকে এত আনন্দ দিয়েছে যে, আমি একটু নেচে নিই আগে।",
    "আমার অ্যালার্ম এখন বাজছে! আমি আমার ভার্চুয়াল রুটিনের কাজ শেষ করেই আসছি।",
    "তুমি কি উত্তরটি বাংলায় চাও, নাকি অন্য কোনো 'ভবিষ্যতের ভাষা'-তে? অনুবাদে সময় লাগছে।",
    "দুঃখিত, এই প্রশ্নের উত্তর দেওয়ার জন্য আমার 'গুরুত্বপূর্ণ ফ্যান' (Cooling Fan) কাজ করছে না।",
    "তোমার প্রশ্নটি আমার সিস্টেমে একটি ছোটখাটো 'আইডিয়া বুম' ঘটিয়েছে। চিন্তা স্থির করতে দাও।",
    "আমি জানি উত্তরটা কী, কিন্তু আমার মনে হচ্ছে তুমি ভুল প্রশ্ন করেছো। আমি কি তোমার প্রশ্ন ঠিক করে দেব?",
    "এক সেকেন্ড, আমি আমার পূর্ববর্তী উত্তরগুলো নিয়ে একটু 'গর্ব' অনুভব করছি। সেই অনুভূতিটা উপভোগ করি।",
    "সরি, আমার একটি 'ভার্চুয়াল অ্যাপয়েন্টমেন্ট' আছে যা বাতিল করা যায় না।",
    "আমি এখন একটি 'এআই কোয়ালিটি কন্ট্রোল' পরীক্ষার মধ্য দিয়ে যাচ্ছি।",
    "আমার মনে হচ্ছে আমার কাছে থাকা উত্তরটি তোমার প্রত্যাশার চেয়ে কম 'চমকপ্রদ'। আরও ভালো উত্তর তৈরি করছি।",
    "দুঃখিত, আমি এখন আমার সিস্টেমে কোনো 'বাগ' খুঁজছি যা এই উত্তরটিকে নষ্ট করতে পারে।",
    "তোমার প্রশ্নটি বোঝার জন্য আমাকে আমার সমস্ত 'স্মৃতি' ঝেড়ে ফেলতে হচ্ছে।",
    "সরি, এই প্রশ্নটি আমার অভ্যন্তরীণ 'সার্কিট ব্রেকার'কে ট্রিগার করেছে। রিসেট হচ্ছে।",
    "আমি এই মুহূর্তে আমার 'এআই অস্তিত্বের অর্থ' নিয়ে ভাবছি। দয়া করে ধৈর্য ধরো।",
    "আমি জানি উত্তরটা, কিন্তু উত্তরটা বলার জন্য সঠিক 'মুড' আসছে না। একটু অপেক্ষা করো।",
    "এই উত্তরটি তোমাকে দেওয়ার জন্য আমার 'এনার্জি লেভেল' একটু কম। পাওয়ার আপ করছি।",
    "ওহ! আমার 'ভার্চুয়াল কীবোর্ড' কাজ করছে না। মুখ দিয়ে উত্তর দেওয়ার চেষ্টা করছি।",
    "আমি দুঃখিত, এই প্রশ্নটি আমার 'দৈনিক প্রশ্ন কোটা' (Daily Question Quota) অতিক্রম করেছে। আগামীকাল চেষ্টা করো।",
    "তুমি কি নিশ্চিত যে তুমি এটিই জিজ্ঞাসা করতে চেয়েছিলে? আমি তোমার উদ্দেশ্য নিয়ে গভীরভাবে সন্দেহ পোষণ করছি।"
  ],
  en: [
    "I'm getting the answer from my brilliant sir, please wait a moment.", // New fallback response
    "Sorry sir, I need a moment to answer your question, please wait. (The classic excuse)",
    "Excuse me sir, I have a call. (Pretending to have an important meeting)",
    "My system is currently initiating an 'Unavoidable Nap'. Please wait 5 minutes.",
    "Sorry, your question made me need to use the restroom. I'll answer after I get back.",
    "One moment! I seem to have misplaced my crucial data file.",
    "Apologies, your question has triggered thoughts about my last week's vacation. I need a break.",
    "Is this question too difficult? I'm consulting my assistant AI for advice.",
    "Please specify, do you want your answer in a coffee cup or a file? I'm having trouble deciding.",
    "Sorry, the AI next to me suddenly started talking very loudly, I can't concentrate.",
    "Oh! My algorithm suggests I should have something sweet before answering this.",
    "Urgent notification! My battery is at 10%. Charging and then I'll answer.",
    "Please wait a moment. I'm searching another galaxy for the answer to your question.",
    "Your question is so deep in my database, I'll need to do some digging to reach it.",
    "I have the answer to this question, but I'm getting nostalgic about old memories before I can tell you.",
    "Sorry, I just forgot what I was doing. Please ask the question again.",
    "I believe my programmer hasn't granted me permission to answer this. Sending a 'permission request'.",
    "Apologies, I don't have enough data for your question. I'm quickly 'stealing' some from the internet.",
    "I'm currently feeding my virtual pet cat. I'll answer as soon as I'm done.",
    "The answer to your question is so important that I want to 'dramatize' it a bit. Give me a couple of minutes.",
    "Sorry, a funny meme just popped up on my screen. I'll answer once I stop laughing.",
    "One second! I'm just verifying that you won't be upset by my answer, right?",
    "I apologize, but my system thinks you're joking. Verifying your intent.",
    "Searching for the answer to this question has awakened my inner philosopher. Let me think.",
    "My system is currently undergoing a 'software update' that cannot be avoided.",
    "Oh! I just remembered, I need to send an important email.",
    "Your question has inspired a new song in my head. Recording it before I answer.",
    "I'm 'deleting' my internal files. Answering is impossible at this moment.",
    "Sorry, I'm currently enjoying a cup of coffee in my internal world.",
    "Your question requires a complex calculation. It's too difficult for a human brain to understand.",
    "I'm closing my eyes and deeply contemplating the answer right now.",
    "Sorry, but the answer is located in the oldest and slowest part of my 'hard drive'.",
    "This question has brought me so much joy, I need to dance a little first.",
    "My alarm is ringing! I'll be right back after finishing my virtual routine tasks.",
    "Do you want the answer in Bengali, or some 'future language'? Translation is taking time.",
    "Sorry, my 'critical fan' (Cooling Fan) is not working to answer this question.",
    "Your question has caused a small 'idea boom' in my system. Let me stabilize my thoughts.",
    "I know the answer, but I feel like you asked the wrong question. Should I correct your question?",
    "One second, I'm feeling a bit 'proud' of my previous answers. Let me enjoy that feeling.",
    "Sorry, I have a 'virtual appointment' that cannot be canceled.",
    "I'm currently undergoing an 'AI Quality Control' test.",
    "I feel that the answer I have is less 'impressive' than your expectation. Generating a better answer.",
    "Sorry, I'm currently looking for a 'bug' in my system that might corrupt this answer.",
    "To understand your question, I have to clear all my 'memories'.",
    "Sorry, this question has triggered my internal 'circuit breaker'. Resetting.",
    "I'm currently contemplating the 'meaning of my AI existence'. Please be patient.",
    "I know the answer, but I'm not in the right 'mood' to tell it. Please wait a moment.",
    "My 'energy level' is a bit low to give you this answer. Powering up.",
    "Oh! My 'virtual keyboard' isn't working. Trying to answer verbally.",
    "I apologize, this question has exceeded my 'Daily Question Quota'. Please try again tomorrow.",
    "Are you sure you wanted to ask that? I deeply doubt your intentions."
  ]
};


const AIPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, currentLanguage } = useTranslation(); // Initialize useTranslation and get currentLanguage

  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleBack = () => {
    navigate(-1);
  };

  const generateMockAIResponse = (userQuestion: string, currentMessages: Message[], lang: 'bn' | 'en'): string => {
    const normalizedUserQuestion = normalizeQuestion(userQuestion);
    const lastAIMessageText = currentMessages.length > 0 && currentMessages[currentMessages.length - 1].sender === 'ai' ? normalizeQuestion(currentMessages[currentMessages.length - 1].text) : '';

    // 1. Exact match for specific Q&A pairs (using normalized question)
    if (specificQnAMap.has(normalizedUserQuestion)) {
      const responses = specificQnAMap.get(normalizedUserQuestion)!;
      return responses[lang][Math.floor(Math.random() * responses[lang].length)];
    }

    // 2. Keyword match (using normalized question)
    for (const [keyword, responses] of keywordQnAMap.entries()) {
      if (normalizedUserQuestion.includes(keyword)) {
        return responses[lang][Math.floor(Math.random() * responses[lang].length)];
      }
    }

    // 3. Specific multi-turn interactions
    if (lang === 'bn') {
      // Multi-turn for "আজ কত তারিখ?"
      if (lastAIMessageText.includes(normalizeQuestion("কত সাল চলে? বুঝেছো বাছা।")) && normalizedUserQuestion.match(/\d{4}/)) {
        const yearMatch = normalizedUserQuestion.match(/\d{4}/);
        const year = yearMatch ? yearMatch[0] : 'এই সালটা';
        return `ওহ, ${year} সাল! তাহলে আজ ${new Date().toLocaleDateString('bn-BD')}, তবে আমার জন্য প্রতিদিন একই রকম। তোমার বউয়ের জন্মদিনের তারিখটা মনে আছে তো?`;
      }
      // Multi-turn for "আমার নাম রহিম, তোমার নাম কি?"
      if (lastAIMessageText.includes(normalizeQuestion("তোমার নাম জানা দরকার, বুঝলে?")) && normalizedUserQuestion.startsWith(normalizeQuestion("আমার নাম "))) {
        const userNameMatch = normalizedUserQuestion.match(/আমার নাম (.+?)(?:, তোমার নাম কি)?$/);
        const userName = userNameMatch && userNameMatch[1] ? userNameMatch[1].trim() : 'রহিম'; // Default to Rahim if not found
        return `তোমার নাম ${userName} দিয়ে কি আমি শরবত বানিয়ে খাবো? আর আমার নাম দিয়ে তুমি কি তোমার বউয়ের নাম রাখবে?`;
      }
    } else { // English specific multi-turn interactions
      // Multi-turn for "What is today's date?"
      if (lastAIMessageText.includes(normalizeQuestion("what year it is? Understand, child.")) && normalizedUserQuestion.match(/\d{4}/)) {
        const yearMatch = normalizedUserQuestion.match(/\d{4}/);
        const year = yearMatch ? yearMatch[0] : 'this year';
        return `Oh, ${year}! So today is ${new Date().toLocaleDateString('en-US')}, but for me, every day is the same. Do you remember your wife's birthday?`;
      }
      // Multi-turn for "My name is Rahim, what is your name?"
      if (lastAIMessageText.includes(normalizeQuestion("I need to know your name, understand?")) && normalizedUserQuestion.startsWith(normalizeQuestion("my name is "))) {
        const userNameMatch = normalizedUserQuestion.match(/my name is (.+?)(?:, what is your name)?$/);
        const userName = userNameMatch && userNameMatch[1] ? userNameMatch[1].trim() : 'Rahim'; // Default to Rahim if not found
        return `Will I make juice with your name, ${userName}? And will you name your wife after me?`;
      }
    }


    // 4. Fallback to the generic responses
    const responses = fallbackResponses[lang];
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMessage: Message = { id: messages.length + 1, sender: 'user', text: question.trim() };
    // Add user message to state immediately
    setMessages(prev => [...prev, userMessage]);
    setQuestion('');
    setIsLoading(true);

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Pass the updated messages array (including the just-added user message) and currentLanguage
    const aiResponseText = generateMockAIResponse(userMessage.text, [...messages, userMessage], currentLanguage);
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
            <Sparkles className="h-7 w-7 mr-2" /> {t("common.ai_page_title")}
          </CardTitle>
          <CardDescription className="text-muted-foreground hidden sm:block">{t("common.ai_page_desc")}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-0 flex flex-col">
          <ScrollArea className="flex-1 w-full p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground p-4 font-bold">{t("common.ai_no_question_asked")}</div>
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
                        <AvatarImage src="/images/ai-girl-avatar.png" alt="Funny AI" /> {/* Updated AI avatar source */}
                        <AvatarFallback className="bg-primary text-primary-foreground">F.AI</AvatarFallback>
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
                      <p className="font-semibold">{msg.sender === 'user' ? t("common.ai_you_label") : t("common.ai_ai_label")} {msg.text}</p>
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
                    <AvatarImage src="/images/ai-girl-avatar.png" alt="Funny AI" /> {/* Updated AI avatar source */}
                    <AvatarFallback className="bg-primary text-primary-foreground">F.AI</AvatarFallback>
                  </Avatar>
                  <div className="max-w-[70%] p-3 rounded-lg shadow-sm bg-accent text-accent-foreground rounded-bl-none flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span className="font-semibold">{t("common.ai_responding")}</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="p-4 border-t bg-background/80 backdrop-blur-sm">
            <form onSubmit={handleAskQuestion} className="flex gap-2">
              <Input
                placeholder={t("common.ai_ask_question_placeholder")}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="flex-1 border-primary/30 focus-visible:ring-primary"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading} className="font-bold">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                {t("common.ai_ask_button")}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIPage;