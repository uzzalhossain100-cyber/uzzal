"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Download, Smartphone, X, ShieldCheck 
} from 'lucide-react';
import { useTranslation } from '@/lib/translations';
import { toast } from 'sonner';

export const InstallAppBanner: React.FC = () => {
  const { currentLanguage } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already in standalone app mode
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Show banner on mobile devices
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    if (isMobile) {
      setShowBanner(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstantInstall = () => {
    // 1. Trigger APK file download immediately
    const link = document.createElement('a');
    link.href = '/AllInOne.apk';
    link.setAttribute('download', 'AllInOne.apk');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(
      currentLanguage === 'bn' 
        ? "অ্যাপটি ডাউনলোড হচ্ছে!" 
        : "App download started!"
    );

    // 2. Trigger native install prompt if available
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choice: any) => {
        if (choice.outcome === 'accepted') {
          toast.success(
            currentLanguage === 'bn' 
              ? "অ্যাপটি আপনার ফোনের হোম স্ক্রিনে ইনস্টল হয়েছে!" 
              : "App installed to your home screen!"
          );
          setShowBanner(false);
        }
        setDeferredPrompt(null);
      });
    }
  };

  if (isInstalled || !showBanner) {
    return null;
  }

  return (
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
              {currentLanguage === 'bn' ? "১-ক্লিকে সরাসরি ডাউনলোড ও ইনস্টল" : "1-Click Direct Download & Install"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            size="sm"
            onClick={handleInstantInstall}
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
  );
};