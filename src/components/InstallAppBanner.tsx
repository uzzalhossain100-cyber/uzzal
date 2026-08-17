"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Download, Smartphone, X, Sparkles, MoreVertical, Share 
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
  const [isInstalled, setIsInstalled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
      return;
    }

    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    if (isMobile) {
      setShowBanner(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstantInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        toast.success(
          currentLanguage === 'bn' 
            ? "অ্যাপটি আপনার মোবাইলে সফলভাবে ইনস্টল হয়েছে!" 
            : "App installed successfully on your mobile!"
        );
        setShowBanner(false);
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      setIsModalOpen(true);
    }
  };

  if (isInstalled || !showBanner) {
    return null;
  }

  return (
    <>
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
                {currentLanguage === 'bn' ? "১-ক্লিকে সরাসরি মোবাইলে ইনস্টল" : "1-Click Direct Mobile Install"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              size="sm"
              onClick={handleInstantInstall}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs h-9 px-3.5 rounded-xl shadow-md gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" />
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md p-6 bg-background rounded-3xl border-primary/30">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-primary flex items-center gap-2">
              <Smartphone className="h-6 w-6 text-primary" />
              {currentLanguage === 'bn' ? "মোবাইলে অ্যাপ ইনস্টল করার নিয়ম" : "Install on Mobile"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {currentLanguage === 'bn' 
                ? "খুব সহজে মোবাইলের হোম স্ক্রিনে অ্যাপটি যুক্ত করুন:" 
                : "Easily add the app to your mobile home screen:"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            {!isIOS ? (
              <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20 space-y-2 text-xs text-muted-foreground">
                <p className="flex items-start gap-2">
                  <span className="font-bold text-primary">১.</span>
                  <span>ক্রোমের উপরের ডানদিকের <strong>৩ ডট (<MoreVertical className="inline h-3 w-3 text-foreground" />)</strong> চাপুন।</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-bold text-primary">২.</span>
                  <span><strong>"Install app"</strong> বা <strong>"Add to Home screen"</strong> চাপুন।</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-bold text-primary">৩.</span>
                  <span><strong>"Install"</strong> বাটনে চাপলেই সরাসরি ফোনে অ্যাপ ইনস্টল হয়ে যাবে।</span>
                </p>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20 space-y-2 text-xs text-muted-foreground">
                <p className="flex items-start gap-2">
                  <span className="font-bold text-primary">১.</span>
                  <span>সাফারি ব্রাউজারের নিচের <strong>Share</strong> বাটনে চাপুন।</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-bold text-primary">২.</span>
                  <span><strong>"Add to Home Screen"</strong> চাপুন।</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-bold text-primary">৩.</span>
                  <span>উপরে <strong>"Add"</strong> চাপলেই ফোনের হোমস্ক্রিনে অ্যাপ ইনস্টল হয়ে যাবে।</span>
                </p>
              </div>
            )}

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