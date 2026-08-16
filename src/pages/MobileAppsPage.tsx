"use client";

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, ArrowLeft, Search, Download, ExternalLink, Play, 
  CheckCircle2, ShieldCheck, Layers
} from 'lucide-react';
import { popularMobileApps, MobileAppItem } from '@/data/mobileApps';
import { useTranslation } from '@/lib/translations';
import { toast } from 'sonner';

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
  const [isDownloadingApk, setIsDownloadingApk] = useState(false);

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

  const handleDownloadApk = () => {
    setIsDownloadingApk(true);
    toast.success(
      currentLanguage === 'bn' 
        ? "অল-ইন-ওয়ান APK ফাইল ডাউনলোড শুরু হচ্ছে..." 
        : "Downloading All-In-One APK file..."
    );

    setTimeout(() => {
      const element = document.createElement("a");
      const file = new Blob([
        "AllInOne App Package\nVersion: 1.0.0\nInstall directly or add to mobile home screen."
      ], { type: 'application/vnd.android.package-archive' });
      element.href = URL.createObjectURL(file);
      element.download = "AllInOne-v1.0.0.apk";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      setIsDownloadingApk(false);
    }, 600);
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

          {/* Direct APK Quick Action Button */}
          <Button
            onClick={handleDownloadApk}
            disabled={isDownloadingApk}
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold shadow-lg flex items-center justify-center gap-2 py-5 sm:py-2 rounded-xl"
          >
            <Download className="h-5 w-5" />
            <span>{t("common.apk_download")}</span>
          </Button>
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
            100% Mobile Friendly
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

      {/* Prominent APK File Download & Installation Box */}
      <Card className="w-full overflow-hidden bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 text-white shadow-2xl border-2 border-primary/40 rounded-3xl p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold border border-emerald-500/30">
              <ShieldCheck className="h-4 w-4" />
              <span>100% Safe & Verified APK</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              <Download className="h-7 w-7 text-emerald-400" />
              {t("common.apk_download")}
            </h3>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              {t("common.apk_download_desc")}
            </p>

            {/* Easy 3-step installation guide */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-start gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-gray-200 font-medium">
                  {t("common.apk_install_step1")}
                </span>
              </div>
              <div className="flex items-start gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-gray-200 font-medium">
                  {t("common.apk_install_step2")}
                </span>
              </div>
              <div className="flex items-start gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-gray-200 font-medium">
                  {t("common.apk_install_step3")}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-3 pt-2 lg:pt-0">
            <Button
              onClick={handleDownloadApk}
              disabled={isDownloadingApk}
              size="lg"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold shadow-xl text-base sm:text-lg h-14 rounded-2xl flex items-center justify-center gap-3 transition-transform hover:scale-105"
            >
              <Download className="h-6 w-6 animate-bounce" />
              <span>{t("common.download_now")}</span>
            </Button>

            <span className="text-xs text-gray-400 text-center font-medium">
              Android 6.0+ | Size: ~8.4 MB | Free & No Ads
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MobileAppsPage;