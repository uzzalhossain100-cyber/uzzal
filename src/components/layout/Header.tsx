import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Bell, Search, LogOut, User as UserIcon } from "lucide-react";
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
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

export function Header({ onToggleSidebar, isSidebarCollapsed }: HeaderProps) {
  const { user, profile, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // Determine if the logged-in user is the mock admin
  const isAdmin = profile?.email === 'uzzal@admin.com'; // Corrected admin email check
  const isGuest = profile?.is_guest;

  const avatarSrc = isAdmin ? "/images/uzzal-hossain.jpg" : (user?.user_metadata?.avatar_url || "https://github.com/shadcn.png");
  const avatarFallback = user?.email ? user.email.charAt(0).toUpperCase() : (profile?.username ? profile.username.charAt(0).toUpperCase() : 'U');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
      setSearchQuery(''); // Clear search query after submission
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 sm:static sm:px-6 shadow-sm"> {/* Changed bg-background to bg-background/80 backdrop-blur-sm */}
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>
      <Button
        variant="ghost"
        size="icon"
        className="hidden sm:flex text-primary hover:bg-primary/10"
        onClick={onToggleSidebar}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
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