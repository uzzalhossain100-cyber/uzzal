"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Smartphone, Download, QrCode, Sparkles, CheckCircle2, 
  ShieldCheck, Share2, MoreVertical, HelpCircle, Copy, Check, ExternalLink
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

export const AppDownloadSection: React.FC = () => {
  const { currentLanguage } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [appUrl, setAppUrl] = useState('');
  const [isIOS, setIsIOS] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAppUrl(window.location.href);
      const userAgent = window.navigator.userAgent.toLowerCase();
      setIsIOS(/iphone|ipad|ipod/.test(userAgent));
      setIsMobile(/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent));
    }

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

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
            ? "অভিনন্দন! অ্যাপটি সফলভাবে আপনার মোবাইলে ইনস্টল হয়েছে!" 
            : "Congratulations! App successfully installed on your mobile!"
        );
      }
      setDeferredPrompt(null);
    } else {
      setIsInstallModalOpen(true);
    }
  };

  const handleCopyLink = () => {
    if (appUrl) {
      navigator.clipboard.writeText(appUrl);
      setIsCopied(true);
      toast.success(currentLanguage === 'bn' ? "অ্যাপ লিংক কপি হয়েছে! এবার মোবাইলে পেস্ট করে খুলুন।" : "App link copied! Open on mobile.");
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'All In One App',
          text: currentLanguage === 'bn' ? 'অল ইন ওয়ান অ্যাপটি সরাসরি মোবাইলে ইনস্টল করুন:' : 'Install All In One App directly on your mobile:',
          url: appUrl,
        });
      } catch (err) {
        console.log('Share dismissed');
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="mt-8 w-full">
      <Card className="w-full overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 text-white shadow-2xl border-2 border-primary/40 rounded-3xl">
        <CardContent className="p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content Area */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-500/30">
                <ShieldCheck className="h-4 w-4" />
                <span>100% Free & Direct Mobile App</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight flex items-center gap-3">
                  <Smartphone className="h-8 w-8 text-emerald-400 animate-pulse shrink-0" />
                  <span>
                    {currentLanguage === 'bn' 
                      ? "মোবাইলে সরাসরি অ্যাপ ইনস্টল করুন" 
                      : "Install App Directly on Mobile"}
                  </span>
                </h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-medium">
                  {currentLanguage === 'bn'
                    ? "নিচের ইনস্টল বাটনে চাপ দিয়ে অথবা মোবাইলের ক্যামেরা দিয়ে কিউআর (QR) কোডটি স্ক্যান করে যেকোনো অ্যান্ড্রয়েড ও আইফোনে ১-ক্লিকে অ্যাপ হিসেবে যুক্ত করে নিন।"
                    : "Tap Install button or scan the QR code with your mobile camera to install directly onto your device."}
                </p>
              </div>

              {/* 3 Step Process */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="bg-white/5 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10 flex items-start gap-2.5">
                  <span className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black flex items-center justify-center shrink-0">১</span>
                  <p className="text-xs text-gray-200 font-bold">
                    {currentLanguage === 'bn' ? "ইনস্টল বাটনে চাপুন বা QR স্ক্যান করুন" : "Tap Install or scan QR Code"}
                  </p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10 flex items-start gap-2.5">
                  <span className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black flex items-center justify-center shrink-0">২</span>
                  <p className="text-xs text-gray-200 font-bold">
                    {currentLanguage === 'bn' ? "ব্রাউজারে 'Install' বাটনে চাপুন" : "Confirm 'Install' prompt"}
                  </p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10 flex items-start gap-2.5">
                  <span className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black flex items-center justify-center shrink-0">৩</span>
                  <p className="text-xs text-gray-200 font-bold">
                    {currentLanguage === 'bn' ? "হোম স্ক্রিনে আসল অ্যাপের মতো ব্যবহার করুন" : "Enjoy full-screen App"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  onClick={handleInstallClick}
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 via-teal-500 to-primary hover:from-emerald-600 hover:to-teal-600 text-white font-black shadow-xl h-13 px-6 rounded-2xl flex items-center gap-2 text-sm sm:text-base transition-transform hover:scale-105"
                >
                  <Download className="h-5 w-5 animate-bounce" />
                  <span>{currentLanguage === 'bn' ? "মোবাইলে অ্যাপ ইনস্টল করুন" : "Install App on Mobile"}</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-bold h-13 px-5 rounded-2xl text-xs sm:text-sm"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  {currentLanguage === 'bn' ? "মোবাইলে লিংক পাঠান" : "Share to Mobile"}
                </Button>

                <Button
                  variant="ghost"
                  onClick={handleCopyLink}
                  className="text-gray-300 hover:text-white hover:bg-white/10 font-bold h-13 px-4 rounded-2xl text-xs"
                >
                  {isCopied ? <Check className="h-4 w-4 mr-1 text-emerald-400" /> : <Copy className="h-4 w-4 mr-1" />}
                  <span>{isCopied ? (currentLanguage === 'bn' ? "কপি হয়েছে!" : "Copied!") : (currentLanguage === 'bn' ? "লিংক কপি করুন" : "Copy Link")}</span>
                </Button>
              </div>
            </div>

            {/* Right QR Code Area with Pure SVG Generator */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-2xl border-4 border-primary/50 flex flex-col items-center text-center space-y-3 max-w-[280px] w-full transform transition-transform hover:scale-105">
                <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-wider">
                  <QrCode className="h-4 w-4" />
                  <span>{currentLanguage === 'bn' ? "মোবাইল দিয়ে স্ক্যান করুন" : "Scan With Mobile Camera"}</span>
                </div>

                <div className="w-48 h-48 rounded-2xl overflow-hidden bg-white p-2 flex items-center justify-center border-2 border-primary/20 shadow-inner">
                  <QRCodeSVG
                    value={appUrl || 'https://all-in-one-app.com'}
                    size={176}
                    level="H"
                    includeMargin={false}
                    fgColor="#5b21b6"
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-800">
                    {currentLanguage === 'bn' ? "ক্যামেরা বা Google Lens দিয়ে স্ক্যান করুন" : "Scan with Camera / Google Lens"}
                  </p>
                  <p className="text-[10px] text-gray-500 font-semibold">
                    Android & iPhone Supported
                  </p>
                </div>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Visual Guide Dialog */}
      <Dialog open={isInstallModalOpen} onOpenChange={setIsInstallModalOpen}>
        <DialogContent className="max-w-md sm:max-w-lg p-6 bg-background rounded-3xl border-primary/30">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-black text-primary flex items-center gap-2">
              <Smartphone className="h-6 w-6 text-primary" />
              {currentLanguage === 'bn' ? "মোবাইলে ইনস্টল করার সহজ নিয়ম" : "Mobile Installation Guide"}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
              {currentLanguage === 'bn' 
                ? "খুব সহজে কোনো এরর ছাড়াই সরাসরি মোবাইলে অ্যাপ হিসেবে যুক্ত করার নিয়ম:" 
                : "Steps to install cleanly on your mobile without any errors:"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {!isIOS ? (
              <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 space-y-3">
                <span className="font-extrabold text-sm text-primary flex items-center gap-1.5">
                  <Smartphone className="h-4 w-4" />
                  {currentLanguage === 'bn' ? "অ্যান্ড্রয়েড ফোন (Google Chrome)" : "Android (Chrome Browser)"}
                </span>
                <div className="space-y-2.5 text-xs text-muted-foreground">
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-primary bg-primary/20 h-5 w-5 rounded-full flex items-center justify-center shrink-0">১</span>
                    <span>ক্রোম ব্রাউজারের উপরে ডানদিকের <strong>৩ ডট (<MoreVertical className="inline h-3.5 w-3.5 text-foreground" />)</strong> মেনুতে চাপুন।</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-primary bg-primary/20 h-5 w-5 rounded-full flex items-center justify-center shrink-0">২</span>
                    <span>মেনু থেকে <strong>"Install app"</strong> অথবা <strong>"Add to Home screen"</strong> (হোম স্ক্রিনে যোগ করুন) চাপুন।</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-primary bg-primary/20 h-5 w-5 rounded-full flex items-center justify-center shrink-0">৩</span>
                    <span><strong>"Install"</strong> বাটনে চাপলেই সরাসরি আসল অ্যাপের মতো মোবাইলে যুক্ত হয়ে যাবে!</span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 space-y-3">
                <span className="font-extrabold text-sm text-primary flex items-center gap-1.5">
                  <Smartphone className="h-4 w-4" />
                  {currentLanguage === 'bn' ? "আইফোন / আইপ্যাড (Safari)" : "iPhone / iPad (Safari)"}
                </span>
                <div className="space-y-2.5 text-xs text-muted-foreground">
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-primary bg-primary/20 h-5 w-5 rounded-full flex items-center justify-center shrink-0">১</span>
                    <span>সাফারি ব্রাউজারের নিচের <strong>Share</strong> বাটনে চাপ দিন।</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-primary bg-primary/20 h-5 w-5 rounded-full flex items-center justify-center shrink-0">২</span>
                    <span>মেনু থেকে <strong>"Add to Home Screen"</strong> চাপুন।</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-primary bg-primary/20 h-5 w-5 rounded-full flex items-center justify-center shrink-0">৩</span>
                    <span>উপরে <strong>"Add"</strong> বাটনে চাপলেই অ্যাপ হিসেবে ফোনে সেভ হয়ে যাবে।</span>
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>এটি সম্পূর্ণ নিরাপদ, দ্রুত এবং ফোনের কোনো বাড়তি র‍্যাম বা স্টোরেজ অপচয় করে না।</span>
            </div>

            <Button
              onClick={() => setIsInstallModalOpen(false)}
              className="w-full bg-primary text-primary-foreground font-bold h-11 rounded-xl"
            >
              {currentLanguage === 'bn' ? "ঠিক আছে" : "Got it"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};