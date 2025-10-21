import React, { useState, useRef, useMemo } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Menu, Bell, Search, LogOut, User as UserIcon, Home, MessageSquareText, MessageCircleMore,
  Image as ImageIcon, Sparkles, Brain, Users, Mail, LifeBuoy, Calculator, Newspaper, Tv,
  GraduationCap, BookOpen, Film, Gamepad, ShoppingCart, Banknote, Plane, HeartPulse,
  Building, MessageSquare, Settings, Utensils, Laptop, Camera, Briefcase, Globe
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
import { useLanguage } from "@/context/LanguageContext"; // Import useLanguage
import { useTranslation } from "@/lib/translations"; // Import useTranslation

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
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const { t, currentLanguage } = useTranslation(); // Initialize useTranslation
  const { switchLanguage } = useLanguage(); // Initialize useLanguage

  const isAdmin = profile?.email === 'uzzal@admin.com';
  // const isGuest = profile?.is_guest; // Removed

  const avatarSrc = isAdmin ? "/images/uzzal-hossain.jpg" : (user?.user_metadata?.avatar_url || "https://github.com/shadcn.png");
  const avatarFallback = user?.email ? user.email.charAt(0).toUpperCase() : (profile?.username ? profile.username.charAt(0).toUpperCase() : 'U');

  const filteredNavItems = useMemo(() => [
    {
      name: t("common.home"),
      icon: Home,
      href: "/",
    },
    // Removed isGuest condition
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
  ], [t, isAdmin, currentLanguage]); // Add currentLanguage to dependencies

  const allSearchableItems = useMemo(() => {
    const items: SearchableItem[] = [];
    const addedPaths = new Set<string>();

    // Add direct pages from filteredNavItems
    filteredNavItems.forEach(navItem => {
      if (!addedPaths.has(navItem.href)) {
        items.push({ name: navItem.name, path: navItem.href, type: 'page', icon: navItem.icon });
        addedPaths.add(navItem.href);
      }
    });

    // Add items from allInOneCategories
    allInOneCategories.forEach(category => {
      // Top-level category
      const categoryPath = category.internalRoute || `/?category=${encodeURIComponent(category.name)}`; // Use category.name (key)
      if (!addedPaths.has(categoryPath)) {
        items.push({ name: t(category.name), path: categoryPath, type: 'category', icon: category.icon });
        addedPaths.add(categoryPath);
      }

      category.items?.forEach(item => {
        // Sub-category (country)
        if (item.subItems) {
          const countryPath = `/?category=${encodeURIComponent(category.name)}&subCategory=${encodeURIComponent(item.name)}`; // Use item.name (key)
          if (!addedPaths.has(countryPath)) {
            items.push({ name: `${t(category.name)} / ${t(item.name)}`, path: countryPath, type: 'country' });
            addedPaths.add(countryPath);
          }
          // Items within sub-category (e.g., newspapers, TV channels)
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
        } else if (item.url) { // Direct item under a top-level category (e.g., a shopping site)
          const itemPath = `/view/${encodeURIComponent(item.url)}/${encodeURIComponent(t(item.name))}`;
          if (!addedPaths.has(itemPath)) {
            items.push({ name: `${t(category.name)} / ${t(item.name)}`, path: itemPath, type: 'item' });
            addedPaths.add(itemPath);
          }
        } else if (item.internalRoute) { // Direct internal route under a top-level category (e.g., Quiz)
          if (!addedPaths.has(item.internalRoute)) {
            items.push({ name: `${t(category.name)} / ${t(item.name)}`, path: item.internalRoute, type: 'page' });
            addedPaths.add(item.internalRoute);
          }
        }
      });
    });
    return items;
  }, [filteredNavItems, allInOneCategories, t, currentLanguage]); // Add currentLanguage to dependencies

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
      // Handle paths with search params (e.g., /?category=category.news&subCategory=country.bangladesh)
      const url = new URL(`http://dummy.com${result.path}`); // Use a dummy base URL to parse search params
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
    // Check if the related target is within the search results dropdown
    if (searchResultsRef.current && searchResultsRef.current.contains(e.relatedTarget as Node)) {
      return; // Don't hide if clicking on a search result
    }
    setTimeout(() => {
      setShowSearchResults(false);
    }, 100); // Small delay to allow click event on results to fire
  };

  const handleFocus = () => {
    if (searchQuery.length > 0 && searchResults.length > 0) {
      setShowSearchResults(true);
    }
  };

  // Start of JSX
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 sm:px-6 shadow-sm">
      {/* Mobile Sheet (Hamburger Menu) */}
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">{t("common.dashboard")}</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs p-0">
          <div className="flex h-full flex-col space-y-4 bg-sidebar/80 p-4">
            <div className="flex items-center justify-center h-16">
              <h1 className="text-2xl font-extrabold text-sidebar-primary">{t("common.dashboard")}</h1>
            </div>
            <nav className="flex-1 space-y-2">
              {filteredNavItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      isActive && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="ml-3 font-bold">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="mt-auto pt-4 border-t border-sidebar-border">
              <Button
                variant="ghost"
                className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                onClick={signOut}
              >
                <LogOut className="h-5 w-5 mr-3" />
                <span className="font-bold">{t("common.logout")}</span>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Navigation */}
      <nav className="hidden sm:flex items-center gap-4 text-sm font-medium">
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-1 px-3 py-2 rounded-md transition-colors text-muted-foreground hover:text-primary",
                isActive && "text-primary font-extrabold bg-primary/10",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Language Switcher */}
      <div className="flex items-center gap-2 ml-4">
        <Button
          variant={currentLanguage === 'bn' ? 'default' : 'outline'}
          size="sm"
          onClick={() => switchLanguage('bn')}
          className={cn(
            "font-bold",
            currentLanguage === 'bn' ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-secondary text-secondary-foreground hover:bg-secondary/90"
          )}
        >
          বাংলা ভার্সন
        </Button>
        <Button
          variant={currentLanguage === 'en' ? 'default' : 'outline'}
          size="sm"
          onClick={() => switchLanguage('en')}
          className={cn(
            "font-bold",
            currentLanguage === 'en' ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-secondary text-secondary-foreground hover:bg-secondary/90"
          )}
        >
          English Version
        </Button>
      </div>

      {/* Search Bar with Dropdown */}
      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t("common.search")}
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px] border-primary/30 focus-visible:ring-primary"
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          ref={searchInputRef}
        />
        {showSearchResults && searchResults.length > 0 && (
          <div
            ref={searchResultsRef}
            className="absolute left-0 right-0 mt-2 max-h-60 overflow-y-auto rounded-md border bg-popover shadow-lg z-50"
          >
            {searchResults.map((result, index) => (
              <div
                key={result.path}
                className="flex items-center gap-2 p-2 cursor-pointer hover:bg-accent hover:text-accent-foreground"
                onClick={() => handleResultClick(result)}
              >
                {result.icon && <result.icon className="h-4 w-4 text-muted-foreground" />}
                <span className="font-medium">{result.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button variant="ghost" size="icon" className="relative text-primary hover:bg-primary/10">
        <Bell className="h-5 w-5" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
          3
        </span>
        <span className="sr-only">{t("common.notifications")}</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full border-primary/30 hover:bg-primary/10"
          >
            <Avatar>
              {/* Removed isGuest check */}
              <>
                <AvatarImage src={avatarSrc} alt={user?.email || "@user"} />
                <AvatarFallback>
                  {avatarFallback}
                </AvatarFallback>
              </>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end"> {/* Removed key={currentLanguage} */}
          <DropdownMenuLabel className="font-extrabold">
            {user?.email || (profile?.username || t("common.my_account"))} {/* Simplified label */}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {/* Removed isGuest check */}
          <>
            <DropdownMenuItem>{t("common.settings")}</DropdownMenuItem>
            <DropdownMenuItem>{t("common.support")}</DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
          <DropdownMenuItem onClick={signOut} className="text-destructive hover:bg-destructive/10">
            <LogOut className="mr-2 h-4 w-4" />
            {t("common.logout")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}