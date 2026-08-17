"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, ArrowLeft, Search, Download, ExternalLink, Play, 
  CheckCircle2, ShieldCheck, Layers, Check,
  Share, MoreVertical, HelpCircle, Sparkles, ArrowDownCircle, FileDown
} from 'lucide-react';
import { popularMobileApps, MobileAppItem } from '@/data/mobileApps';
import { useTranslation } from '@/lib/translations';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const categoryTabs = [
  { id: 'all', labelKey: 'common.all' },
  { id: 'social', labelKey: 'common.social' },
  { id: 'finance', labelKey: 'common.finance' },
  { id: 'entertainment', labelKey: 'common.entertainment' },
  { id: 'shopping', labelKey: 'common.shopping' },
  { id: 'productivity', labelKey: 'common.productivity' },
  { id: 'education', labelKey: 'common.education' },
];

const MobileAppsPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, currentLanguage } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const filteredApps = useMemo(() => {
    return popularMobileApps.filter(app => {
      const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        app.name.toLowerCase().includes(q) || 
        app.nameBn.toLowerCase().includes(q) ||
        app.description.toLowerCase().includes(q) ||
        app.descriptionBn.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleOpenApp = (app: MobileAppItem) => {
    if (app.webUrl) {
      const appName = currentLanguage === 'bn' ? app.nameBn : app.name;
      const encodedUrl = encodeURIComponent(app.webUrl);
      const encodedName = encodeURIComponent(appName);
      navigate(`/view/${encodedUrl}/${encodedName}`);
    } else {
      window.open(app.playStoreUrl, '_blank');
    }
  };

  const handleDirectApkDownload = () => {
    const link = document.createElement('a');
    link.href = '/AllInOne.apk';
    link.download = "AllInOne-v1.0.0.apk";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(
      currentLanguage === 'bn' 
        ? "APK ফাইল ডাউনলোড শুরু হয়েছে! ডাউনলোড শেষে ফাইলে চাপ দিয়ে 'Install' করুন।" 
        : "APK Download started! Open the downloaded file to install."
    );
  };

  const handleDirectInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        toast.success(
          currentLanguage === 'bn' 
            ? "অভিনন্দন! অ্যাপটি আপনার মোবাইলে সফলভাবে ইনস্টল হয়েছে।" 
            : "Congratulations! App installed successfully on your mobile."
        );
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      setIsInstallModalOpen(true);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4 max-w-7xl mx-auto w-full pb-10">
      {/* Top Banner Header */}
      <Card className="w-full bg-background/90 backdrop-blur-md shadow-xl border-primary/20">
        <CardHeader className="p-4 sm:p-6 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/')}
              className="h-10 w-10 shrink-0 rounded-full border-primary/30 hover:bg-primary/10"
            >
              <ArrowLeft className="h-5 w-5 text-primary" />
            </Button>
            <div>
              <CardTitle className="text-2xl sm:text-3xl font-extrabold text-primary flex items-center gap-2">
                <Smartphone className="h-7 w-7 text-primary animate-pulse" />
                {t("common.mobile_apps_title")}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                {t("common.mobile_apps_desc")}
              </CardDescription>
            </div>
          </div>

          {/* Action Download Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <Button
              onClick={handleDirectApkDownload}
              className="flex-1 sm:flex-none bg-gradient-to-r from-emerald-500 via-teal-600 to-green-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black shadow-lg flex items-center justify-center gap-2 py-5 sm:py-2 px-5 rounded-xl text-sm transition-transform hover:scale-105"
            >
              <ArrowDownCircle className="h-5 w-5 animate-bounce" />
              <span>{currentLanguage === 'bn' ? ".APK ডাউনলোড" : "Download .APK"}</span>
            </Button>

            <Button
              onClick={handleDirectInstall}
              className="flex-1 sm:flex-none bg-primary text-white font-black shadow-lg flex items-center justify-center gap-2 py-5 sm:py-2 px-5 rounded-xl text-sm transition-transform hover:scale-105"
            >
              <Sparkles className="h-4 w-4" />
              <span>{currentLanguage === 'bn' ? "১-ক্লিকে ইনস্টল" : "1-Click Install"}</span>
            </Button>
          </div>
        </CardHeader>

        {/* Search & Category Filter */}
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("common.search_apps")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-12 text-base rounded-xl border-primary/30 focus-visible:ring-primary bg-background/80 shadow-sm"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
            {categoryTabs.map(tab => (
              <Button
                key={tab.id}
                variant={selectedCategory === tab.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(tab.id)}
                className={`whitespace-nowrap rounded-full font-bold px-4 transition-all text-xs sm:text-sm ${
                  selectedCategory === tab.id 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'bg-background hover:bg-primary/10 border-primary/20'
                }`}
              >
                {t(tab.labelKey)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 100 Apps Grid */}
      <Card className="w-full bg-background/90 backdrop-blur-md shadow-xl border-primary/20">
        <CardHeader className="p-4 pb-2 border-b flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <span className="font-extrabold text-foreground text-base sm:text-lg">
              {currentLanguage === 'bn' ? `মোট ${filteredApps.length} টি অ্যাপস উপলব্ধ` : `Total ${filteredApps.length} Apps Available`}
            </span>
          </div>
          <Badge variant="secondary" className="font-bold text-xs">
            100% Mobile Ready
          </Badge>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {filteredApps.map((app) => {
              const displayName = currentLanguage === 'bn' ? app.nameBn : app.name;
              const displayDesc = currentLanguage === 'bn' ? app.descriptionBn : app.description;

              return (
                <div
                  key={app.id}
                  className="group relative flex flex-col justify-between p-3.5 rounded-2xl bg-background/80 hover:bg-accent/40 border border-primary/15 hover:border-primary/50 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div 
                    onClick={() => handleOpenApp(app)}
                    className="cursor-pointer flex flex-col items-center text-center space-y-2.5"
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl p-1.5 bg-card/90 shadow-sm border border-primary/10 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-200">
                      <img
                        src={app.iconUrl}
                        alt={app.name}
                        className="w-full h-full object-contain rounded-xl"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>

                    <div className="w-full">
                      <h4 className="font-extrabold text-sm sm:text-base text-foreground truncate w-full group-hover:text-primary transition-colors">
                        {displayName}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-muted-foreground line-clamp-2 mt-0.5 leading-tight">
                        {displayDesc}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-1.5 mt-3 pt-2.5 border-t border-primary/10 w-full">
                    <Button
                      size="sm"
                      onClick={() => handleOpenApp(app)}
                      className="w-full h-8 text-[11px] sm:text-xs font-extrabold bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-1 flex items-center justify-center gap-1"
                    >
                      <Play className="h-3 w-3 fill-current" />
                      {t("common.open_app")}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(app.playStoreUrl, '_blank')}
                      className="w-full h-8 text-[11px] sm:text-xs font-bold border-primary/20 hover:bg-primary/10 rounded-lg px-1 flex items-center justify-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {t("common.play_store")}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Prominent APK Download Box */}
      <Card className="w-full overflow-hidden bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950 text-white shadow-2xl border-2 border-primary/40 rounded-3xl p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold border border-emerald-500/30">
              <ShieldCheck className="h-4 w-4" />
              <span>100% Free, Safe & Fast Mobile APK</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              <Smartphone className="h-7 w-7 text-emerald-400" />
              {currentLanguage === 'bn' ? "মোবাইলে সরাসরি .APK ফাইল ডাউনলোড ও ইনস্টল" : "Direct .APK File Download & Mobile Installation"}
            </h3>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              {currentLanguage === 'bn'
                ? "সরাসরি অ্যান্ড্রয়েড .APK ফাইলটি ডাউনলোড করে ইনস্টল করুন অথবা ব্রাউজার থেকে ১-ক্লিকে ইনস্টল করে নিন।"
                : "Download the direct Android .APK package or install directly with 1-click on your mobile."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-start gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-gray-200 font-medium">
                  {currentLanguage === 'bn' ? "১. .APK ডাউনলোডে চাপুন" : "1. Tap Download .APK"}
                </span>
              </div>
              <div className="flex items-start gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-gray-200 font-medium">
                  {currentLanguage === 'bn' ? "২. ফাইলে চাপ দিয়ে 'Install' দিন" : "2. Open file & tap 'Install'"}
                </span>
              </div>
              <div className="flex items-start gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-gray-200 font-medium">
                  {currentLanguage === 'bn' ? "৩. হোমস্ক্রিন থেকে ব্যবহার করুন" : "3. Open from home screen"}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-3 pt-2 lg:pt-0">
            <Button
              onClick={handleDirectApkDownload}
              size="lg"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black shadow-xl text-base sm:text-lg h-14 rounded-2xl flex items-center justify-center gap-3 transition-transform hover:scale-105"
            >
              <ArrowDownCircle className="h-6 w-6 animate-bounce" />
              <span>
                {currentLanguage === 'bn' ? "সরাসরি .APK ডাউনলোড" : "Download .APK Directly"}
              </span>
            </Button>

            <Button
              variant="outline"
              onClick={() => setIsInstallModalOpen(true)}
              className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20 font-bold text-xs h-10 rounded-xl"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              {currentLanguage === 'bn' ? "ইনস্টল করার নিয়ম দেখুন" : "View Installation Guide"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Visual Guide Dialog */}
      <Dialog open={isInstallModalOpen} onOpenChange={setIsInstallModalOpen}>
        <DialogContent className="max-w-md sm:max-w-lg p-6 bg-background rounded-3xl border-primary/30">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-black text-primary flex items-center gap-2">
              <Smartphone className="h-6 w-6 text-primary" />
              {currentLanguage === 'bn' ? "মোবাইলে ইনস্টল করার নিয়মাবলী" : "Mobile Installation Guide"}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
              {currentLanguage === 'bn' 
                ? "সরাসরি মোবাইলে অ্যাপ যুক্ত করার সহজ নিয়ম:" 
                : "Steps to install cleanly on your mobile:"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2 text-xs">
              <p className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <FileDown className="h-4 w-4" />
                {currentLanguage === 'bn' ? "১. সরাসরি .APK ফাইল ডাউনলোড ও ইনস্টল" : "1. Direct .APK File Installation"}
              </p>
              <p className="text-muted-foreground">
                সবুজ <strong>'সরাসরি .APK ডাউনলোড'</strong> বাটনে চাপ দিন। ফাইল ডাউনলোড হয়ে গেলে তাতে ক্লিক করে <strong>'Install'</strong> নির্বাচন করুন।
              </p>
            </div>

            {!isIOS ? (
              <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 space-y-2 text-xs">
                <p className="font-extrabold text-sm text-primary flex items-center gap-1.5">
                  <Smartphone className="h-4 w-4" />
                  {currentLanguage === 'bn' ? "২. ব্রাউজার থেকে সরাসরি ইনস্টল (Chrome)" : "2. Direct Browser Install (Chrome)"}
                </p>
                <p className="text-muted-foreground">
                  ক্রোম ব্রাউজারের উপরে ডানদিকের <strong>৩ ডট (<MoreVertical className="inline h-3.5 w-3.5 text-foreground" />)</strong> মেনুতে চাপুন এবং <strong>"Install app"</strong> চাপুন।
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 space-y-2 text-xs">
                <p className="font-extrabold text-sm text-primary flex items-center gap-1.5">
                  <Smartphone className="h-4 w-4" />
                  {currentLanguage === 'bn' ? "আইফোন / আইপ্যাড (Safari)" : "iPhone / iPad (Safari)"}
                </p>
                <p className="text-muted-foreground">
                  সাফারি ব্রাউজারের নিচে <strong>Share</strong> বাটনে চাপ দিয়ে <strong>"Add to Home Screen"</strong> চাপুন।
                </p>
              </div>
            )}

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

export default MobileAppsPage;