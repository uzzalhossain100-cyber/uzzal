"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Download, Smartphone, X, CheckCircle, ArrowRight, 
  Share, PlusSquare, MoreVertical, ShieldCheck 
} from 'lucide-react';
import { useTranslation } from '@/lib/translations';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export const InstallAppBanner: React.FC = () => {
  const { currentLanguage } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Capture install prompt for Android/Chrome
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Show banner on mobile devices anyway if not standalone
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    if (isMobile) {
      setShowBanner(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        toast.success(
          currentLanguage === 'bn' 
            ? "অ্যাপটি আপনার ফোনের হোম স্ক্রিনে সফলভাবে ইনস্টল হয়েছে!" 
            : "App successfully installed to your home screen!"
        );
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else {
      // If browser doesn't expose prompt, open easy visual step-by-step instructions
      setIsModalOpen(true);
    }
  };

  if (isInstalled || !showBanner) {
    return null;
  }

  return (
    <>
      {/* Mobile Sticky Install Prompt Floating Bar */}
      <div className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 sm:w-96 z-50 animate-in slide-in-from-bottom-5 duration-300">
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl border-2 border-primary/40 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-md">
              <Smartphone className="h-6 w-6 text-white" />
            </div>
            <div className="min-w-0">
              <h4 className="font-black text-xs sm:text-sm text-white truncate">
                {currentLanguage === 'bn' ? "অল ইন ওয়ান অ্যাপ" : "All In One App"}
              </h4>
              <p className="text-[11px] text-gray-300 truncate">
                {currentLanguage === 'bn' ? "মোবাইলে সরাসরি ইনস্টল করুন" : "Install on your mobile phone"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              size="sm"
              onClick={handleInstallClick}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs h-9 px-3.5 rounded-xl shadow-md gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{currentLanguage === 'bn' ? "ইনস্টল" : "Install"}</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowBanner(false)}
              className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Step by Step Visual Guide Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md p-6 bg-background rounded-3xl border-primary/30">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-primary flex items-center gap-2">
              <Smartphone className="h-6 w-6 text-primary" />
              {currentLanguage === 'bn' ? "মোবাইলে অ্যাপ ইনস্টল করার নিয়ম" : "How to Install on Phone"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {currentLanguage === 'bn'
                ? "কোনো ভারী APK ছাড়াই ১ ক্লিকে মোবাইল হোম স্ক্রিনে ইনস্টল করে নিন:"
                : "Install directly on your mobile home screen without any APK file:"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {!isIOS ? (
              // Android Chrome Guide
              <div className="space-y-3 p-4 rounded-2xl bg-primary/10 border border-primary/20">
                <h5 className="font-extrabold text-sm text-foreground flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded-md text-xs">Android</span>
                  <span>Google Chrome ব্রাউজার থেকে:</span>
                </h5>
                <div className="space-y-2.5 text-xs text-muted-foreground">
                  <div className="flex items-start gap-2.5 bg-background/80 p-2.5 rounded-xl border border-primary/10">
                    <span className="font-black text-primary bg-primary/20 h-5 w-5 rounded-full flex items-center justify-center shrink-0">১</span>
                    <span>ব্রাউজারের উপরের ডানদিকের <strong>৩ ডট (<MoreVertical className="inline h-3.5 w-3.5 text-foreground" />)</strong> মেনুতে চাপুন।</span>
                  </div>
                  <div className="flex items-start gap-2.5 bg-background/80 p-2.5 rounded-xl border border-primary/10">
                    <span className="font-black text-primary bg-primary/20 h-5 w-5 rounded-full flex items-center justify-center shrink-0">২</span>
                    <span><strong>"Install app"</strong> অথবা <strong>"Add to Home screen"</strong> (হোম স্ক্রিনে যুক্ত করুন) অপশনে চাপ দিন।</span>
                  </div>
                  <div className="flex items-start gap-2.5 bg-background/80 p-2.5 rounded-xl border border-primary/10">
                    <span className="font-black text-primary bg-primary/20 h-5 w-5 rounded-full flex items-center justify-center shrink-0">৩</span>
                    <span><strong>"Install"</strong> চাপলেই আপনার ফোনের অ্যাপ গ্যালারিতে আইকন চলে আসবে!</span>
                  </div>
                </div>
              </div>
            ) : (
              // iPhone / iOS Safari Guide
              <div className="space-y-3 p-4 rounded-2xl bg-primary/10 border border-primary/20">
                <h5 className="font-extrabold text-sm text-foreground flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded-md text-xs">iPhone / iPad</span>
                  <span>Safari ব্রাউজার থেকে:</span>
                </h5>
                <div className="space-y-2.5 text-xs text-muted-foreground">
                  <div className="flex items-start gap-2.5 bg-background/80 p-2.5 rounded-xl border border-primary/10">
                    <span className="font-black text-primary bg-primary/20 h-5 w-5 rounded-full flex items-center justify-center shrink-0">১</span>
                    <span>নিচের <strong>Share (<Share className="inline h-3.5 w-3.5 text-foreground" />)</strong> বাটনে চাপ দিন।</span>
                  </div>
                  <div className="flex items-start gap-2.5 bg-background/80 p-2.5 rounded-xl border border-primary/10">
                    <span className="font-black text-primary bg-primary/20 h-5 w-5 rounded-full flex items-center justify-center shrink-0">২</span>
                    <span>একটু নিচে স্ক্রোল করে <strong>"Add to Home Screen" (<PlusSquare className="inline h-3.5 w-3.5 text-foreground" />)</strong> চাপুন।</span>
                  </div>
                  <div className="flex items-start gap-2.5 bg-background/80 p-2.5 rounded-xl border border-primary/10">
                    <span className="font-black text-primary bg-primary/20 h-5 w-5 rounded-full flex items-center justify-center shrink-0">৩</span>
                    <span>উপরে <strong>"Add"</strong> চাপলেই মোবাইলে অ্যাপ চালু হবে।</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>এটি সম্পূর্ণ নিরাপদ, দ্রুত এবং ফোনের কোনো স্টোরেজ নষ্ট করে না।</span>
            </div>

            <Button
              onClick={() => setIsModalOpen(false)}
              className="w-full bg-primary text-primary-foreground font-black h-10 rounded-xl"
            >
              {currentLanguage === 'bn' ? "বুঝেছি" : "Got it"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};