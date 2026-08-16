import React, { useState, useRef, useMemo } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Menu, Bell, Search, LogOut, Home, MessageSquareText, MessageCircleMore,
  Image as ImageIcon, Sparkles, Brain, Users, Mail, LifeBuoy, Calculator, Smartphone,
  LogIn
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { allInOneCategories } from '@/data/categories';
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/lib/translations";

interface SearchableItem {
  name: string;
  path: string;
  type: 'category' | 'country' | 'item' | 'page';
  icon?: React.ElementType;
}

export function Header() {
  const { user, profile, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchableItem[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const { t, currentLanguage } = useTranslation();
  const { switchLanguage } = useLanguage();

  const isAdmin = profile?.email === 'uzzal@admin.com';

  const avatarSrc = isAdmin ? "/images/uzzal-hossain.jpg" : (user?.user_metadata?.avatar_url || "https://github.com/shadcn.png");
  const avatarFallback = profile?.username ? profile.username.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'U');

  const filteredNavItems = useMemo(() => {
    const items = [
      {
        name: t("common.home"),
        icon: Home,
        href: "/",
      },
      {
        name: t("common.mobile_apps"),
        icon: Smartphone,
        href: "/mobile-apps",
      },
      {
        name: t("common.emergency_contacts"),
        icon: LifeBuoy,
        href: "/emergency-contacts",
      },
      {
        name: t("common.converter"),
        icon: Calculator,
        href: "/converter",
      },
    ];

    if (user) {
      items.push(
        {
          name: t("common.active_users"),
          icon: MessageSquareText,
          href: "/active-users",
        },
        ...(isAdmin ? [{
          name: t("common.live_chat"),
          icon: MessageCircleMore,
          href: "/live-chat",
        }] : []),
        {
          name: t("common.contact"),
          icon: Mail,
          href: "/contact",
        },
        ...(isAdmin ? [{
          name: t("common.advertisements"),
          icon: ImageIcon,
          href: "/advertisements",
        }] : []),
        {
          name: t("common.ai"),
          icon: Sparkles,
          href: "/ai",
        },
        {
          name: t("common.quiz"),
          icon: Brain,
          href: "/quiz",
        },
        ...(isAdmin ? [{
          name: t("common.user_management"),
          icon: Users,
          href: "/user-management",
        }] : []),
      );
    } else {
      items.push({
        name: t("common.login_to_view_special_pages"),
        icon: LogIn,
        href: "/login",
      });
    }
    return items;
  }, [t, isAdmin, user, currentLanguage]);

  const allSearchableItems = useMemo(() => {
    const items: SearchableItem[] = [];
    const addedPaths = new Set<string>();

    filteredNavItems.forEach(navItem => {
      if (user || navItem.href === '/' || navItem.href === '/mobile-apps' || navItem.href === '/emergency-contacts' || navItem.href === '/converter') {
        if (!addedPaths.has(navItem.href)) {
          items.push({ name: navItem.name, path: navItem.href, type: 'page', icon: navItem.icon });
          addedPaths.add(navItem.href);
        }
      }
    });

    allInOneCategories.forEach(category => {
      const categoryPath = category.internalRoute || `/?category=${encodeURIComponent(category.name)}`;
      if (!addedPaths.has(categoryPath)) {
        items.push({ name: t(category.name), path: categoryPath, type: 'category', icon: category.icon });
        addedPaths.add(categoryPath);
      }

      category.items?.forEach(item => {
        if (item.subItems) {
          const countryPath = `/?category=${encodeURIComponent(category.name)}&subCategory=${encodeURIComponent(item.name)}`;
          if (!addedPaths.has(countryPath)) {
            items.push({ name: `${t(category.name)} / ${t(item.name)}`, path: countryPath, type: 'country' });
            addedPaths.add(countryPath);
          }
          item.subItems.forEach(subItem => {
            let subItemPath = '';
            if (subItem.internalRoute) {
              subItemPath = subItem.internalRoute;
            } else if (subItem.url) {
              subItemPath = `/view/${encodeURIComponent(subItem.url)}/${encodeURIComponent(t(subItem.name))}`;
            }
            if (subItemPath && !addedPaths.has(subItemPath)) {
              items.push({ name: `${t(category.name)} / ${t(item.name)} / ${t(subItem.name)}`, path: subItemPath, type: 'item' });
              addedPaths.add(subItemPath);
            }
          });
        } else if (item.url) {
          const itemPath = `/view/${encodeURIComponent(item.url)}/${encodeURIComponent(t(item.name))}`;
          if (!addedPaths.has(itemPath)) {
            items.push({ name: `${t(category.name)} / ${t(item.name)}`, path: itemPath, type: 'item' });
            addedPaths.add(itemPath);
          }
        }
      });
    });
    return items;
  }, [filteredNavItems, allInOneCategories, t, user, currentLanguage]);

  const performSearch = (query: string) => {
    const lowerCaseQuery = query.toLowerCase();
    const filtered = allSearchableItems.filter(item =>
      item.name.toLowerCase().includes(lowerCaseQuery)
    );
    setSearchResults(filtered);
    setShowSearchResults(filtered.length > 0);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 0) {
      performSearch(query);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleResultClick = (result: SearchableItem) => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);

    if (result.path.startsWith('/?')) {
      const url = new URL(`http://dummy.com${result.path}`);
      const category = url.searchParams.get('category');
      const subCategory = url.searchParams.get('subCategory');

      const newSearchParams = new URLSearchParams();
      if (category) newSearchParams.set('category', category);
      if (subCategory) newSearchParams.set('subCategory', subCategory);

      navigate({ pathname: '/', search: newSearchParams.toString() });
    } else {
      navigate(result.path);
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (searchResultsRef.current && searchResultsRef.current.contains(e.relatedTarget as Node)) {
      return;
    }
    setTimeout(() => {
      setShowSearchResults(false);
    }, 100);
  };

  const handleFocus = () => {
    if (searchQuery.length > 0 && searchResults.length > 0) {
      setShowSearchResults(true);
    }
  };

  const midPoint = Math.ceil(filteredNavItems.length / 2);
  const firstRowItems = filteredNavItems.slice(0, midPoint);
  const secondRowItems = filteredNavItems.slice(midPoint);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-2 border-b bg-background/90 backdrop-blur-md px-3 sm:px-6 shadow-sm py-2.5">
      {/* Mobile Drawer (Hamburger Menu) */}
      <div className="flex items-center gap-2 sm:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="h-9 w-9 rounded-lg border-primary/30">
              <Menu className="h-5 w-5 text-primary" />
              <span className="sr-only">{t("common.dashboard")}</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0">
            <div className="flex h-full flex-col space-y-4 bg-sidebar/95 backdrop-blur-md p-4">
              <div className="flex items-center justify-between h-14 border-b border-sidebar-border pb-2">
                <h1 className="text-xl font-black text-sidebar-primary flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-primary" />
                  {t("app.name")}
                </h1>
              </div>

              {/* Language Switcher in Mobile Drawer */}
              <div className="grid grid-cols-2 gap-2 pb-2">
                <Button
                  variant={currentLanguage === 'bn' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => switchLanguage('bn')}
                  className="font-bold text-xs"
                >
                  বাংলা
                </Button>
                <Button
                  variant={currentLanguage === 'en' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => switchLanguage('en')}
                  className="font-bold text-xs"
                >
                  English
                </Button>
              </div>

              <nav className="flex-1 space-y-1.5 overflow-y-auto">
                {filteredNavItems.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-sidebar-foreground transition-all hover:bg-sidebar-accent",
                        isActive && "bg-primary text-primary-foreground hover:bg-primary shadow-sm",
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {user && (
                <div className="mt-auto pt-3 border-t border-sidebar-border">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:bg-destructive/10 font-bold"
                    onClick={signOut}
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    <span>{t("common.logout")}</span>
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <Link to="/" className="font-black text-lg text-primary tracking-tight truncate max-w-[130px]">
          {t("app.name")}
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden sm:flex flex-col gap-1">
        <nav className="flex items-center gap-2 lg:gap-3 text-sm font-medium">
          {firstRowItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors text-muted-foreground hover:text-primary font-bold text-xs lg:text-sm",
                  isActive && "text-primary font-black bg-primary/10",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        {secondRowItems.length > 0 && (
          <nav className="flex items-center gap-2 lg:gap-3 text-sm font-medium">
            {secondRowItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors text-muted-foreground hover:text-primary font-bold text-xs lg:text-sm",
                    isActive && "text-primary font-black bg-primary/10",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        )}
      </div>

      {/* Language Switcher on Desktop */}
      <div className="hidden md:flex items-center gap-1.5">
        <Button
          variant={currentLanguage === 'bn' ? 'default' : 'outline'}
          size="sm"
          onClick={() => switchLanguage('bn')}
          className="font-bold text-xs h-8 px-2.5 rounded-lg"
        >
          বাংলা
        </Button>
        <Button
          variant={currentLanguage === 'en' ? 'default' : 'outline'}
          size="sm"
          onClick={() => switchLanguage('en')}
          className="font-bold text-xs h-8 px-2.5 rounded-lg"
        >
          English
        </Button>
      </div>

      {/* Search Bar & Profile */}
      <div className="flex items-center gap-2 ml-auto">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("common.search")}
            className="w-[140px] sm:w-[200px] lg:w-[260px] h-9 rounded-xl bg-background pl-8 text-xs sm:text-sm border-primary/30 focus-visible:ring-primary"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            ref={searchInputRef}
          />
          {showSearchResults && searchResults.length > 0 && (
            <div
              ref={searchResultsRef}
              className="absolute right-0 top-11 w-[260px] sm:w-[320px] max-h-60 overflow-y-auto rounded-xl border bg-popover shadow-xl z-50 p-1"
            >
              {searchResults.map((result) => (
                <div
                  key={result.path}
                  className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-accent hover:text-accent-foreground text-xs sm:text-sm font-semibold"
                  onClick={() => handleResultClick(result)}
                >
                  {result.icon && <result.icon className="h-4 w-4 text-primary shrink-0" />}
                  <span className="truncate">{result.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 overflow-hidden rounded-full border-primary/30 hover:bg-primary/10 shrink-0"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={avatarSrc} alt={user?.email || "@user"} />
                <AvatarFallback className="text-xs font-bold">
                  {avatarFallback}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl w-48">
            <DropdownMenuLabel className="font-extrabold truncate">
              {profile?.username || user?.email || t("common.my_account")}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/mobile-apps')} className="font-bold">
              <Smartphone className="mr-2 h-4 w-4 text-primary" />
              {t("common.mobile_apps")}
            </DropdownMenuItem>
            {user && (
              <DropdownMenuItem onClick={signOut} className="text-destructive font-bold">
                <LogOut className="mr-2 h-4 w-4" />
                {t("common.logout")}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}