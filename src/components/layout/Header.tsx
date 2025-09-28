import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Bell, Search, LogOut, User as UserIcon, Home, MessageSquareText, MessageCircleMore, Image as ImageIcon, Sparkles, Brain, Users } from "lucide-react";
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

export function Header() {
  const { user, profile, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  const isAdmin = profile?.email === 'uzzal@admin.com';
  const isGuest = profile?.is_guest;

  const avatarSrc = isAdmin ? "/images/uzzal-hossain.jpg" : (user?.user_metadata?.avatar_url || "https://github.com/shadcn.png");
  const avatarFallback = user?.email ? user.email.charAt(0).toUpperCase() : (profile?.username ? profile.username.charAt(0).toUpperCase() : 'U');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
      setSearchQuery('');
    }
  };

  const navItems = [
    {
      name: "হোম",
      icon: Home,
      href: "/",
    },
    ...(!isGuest ? [{
      name: "সক্রিয় ইউজার",
      icon: MessageSquareText,
      href: "/active-users",
    }] : []),
    ...(isAdmin ? [{
      name: "লাইভ চ্যাট",
      icon: MessageCircleMore,
      href: "/live-chat",
    }] : []),
    {
      name: "যোগাযোগ",
      icon: Mail,
      href: "/contact",
    },
    ...(isAdmin ? [{
      name: "বিজ্ঞাপন",
      icon: ImageIcon,
      href: "/advertisements",
    }] : []),
    {
      name: "এআই",
      icon: Sparkles,
      href: "/ai",
    },
    {
      name: "কুইজ",
      icon: Brain,
      href: "/quiz",
    },
    ...(isAdmin ? [{
      name: "ইউজার ম্যানেজমেন্ট",
      icon: Users,
      href: "/user-management",
    }] : []),
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 sm:px-6 shadow-sm">
      {/* Mobile Sheet (Hamburger Menu) */}
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs p-0">
          <div className="flex h-full flex-col space-y-4 bg-sidebar/80 p-4">
            <div className="flex items-center justify-center h-16">
              <h1 className="text-2xl font-extrabold text-sidebar-primary">ড্যাশবোর্ড</h1>
            </div>
            <nav className="flex-1 space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
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
                <span className="font-bold">লগআউট</span>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Navigation */}
      <nav className="hidden sm:flex items-center gap-4 text-sm font-medium">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
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

      <form onSubmit={handleSearchSubmit} className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="গুগলে অনুসন্ধান করুন..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px] border-primary/30 focus-visible:ring-primary"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>
      <Button variant="ghost" size="icon" className="relative text-primary hover:bg-primary/10">
        <Bell className="h-5 w-5" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
          3
        </span>
        <span className="sr-only">নোটিফিকেশন</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full border-primary/30 hover:bg-primary/10"
          >
            <Avatar>
              {isGuest ? (
                <AvatarFallback>
                  <UserIcon className="h-5 w-5" />
                </AvatarFallback>
              ) : (
                <>
                  <AvatarImage src={avatarSrc} alt={user?.email || "@user"} />
                  <AvatarFallback>
                    {avatarFallback}
                  </AvatarFallback>
                </>
              )}
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="font-extrabold">
            {isGuest ? `গেস্ট: ${profile?.username}` : (user?.email || "আমার অ্যাকাউন্ট")}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {!isGuest && (
            <>
              <DropdownMenuItem>সেটিংস</DropdownMenuItem>
              <DropdownMenuItem>সাপোর্ট</DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem onClick={signOut} className="text-destructive hover:bg-destructive/10">
            <LogOut className="mr-2 h-4 w-4" />
            লগআউট
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}