import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Mail,
  LogOut,
  Users,
  MessageSquareText,
  MessageCircleMore // Added for Live Chat
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed?: boolean;
}

export function Sidebar({ className, isCollapsed = false }: SidebarProps) {
  const { signOut, profile } = useAuth();
  const location = useLocation();

  const isAdmin = profile?.email === 'uzzal@admin.com'; // Corrected admin email check
  const isGuest = profile?.is_guest;

  // Define navItems conditionally based on user type
  const navItems = [
    {
      name: "হোম",
      icon: Home,
      href: "/",
    },
    // "সক্রিয় ইউজার" শুধুমাত্র নিবন্ধিত ইউজার এবং এডমিনদের জন্য
    ...(!isGuest ? [{
      name: "সক্রিয় ইউজার",
      icon: MessageSquareText,
      href: "/active-users",
    }] : []),
    // "লাইভ চ্যাট" শুধুমাত্র এডমিনদের জন্য
    ...(isAdmin ? [{
      name: "লাইভ চ্যাট", // New Live Chat link
      icon: MessageCircleMore,
      href: "/live-chat",
    }] : []),
    {
      name: "যোগাযোগ",
      icon: Mail,
      href: "/contact",
    },
  ];

  return (
    <div
      className={cn(
        "flex h-full flex-col space-y-4 border-r bg-sidebar p-4 transition-all duration-300 shadow-md",
        isCollapsed ? "w-16 items-center" : "w-64",
        className,
      )}
    >
      <div className="flex items-center justify-center h-16">
        <h1
          className={cn(
            "text-2xl font-bold text-sidebar-primary transition-opacity duration-300",
            isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto",
          )}
        >
          ড্যাশবোর্ড
        </h1>
        <h1
          className={cn(
            "text-2xl font-bold text-sidebar-primary transition-opacity duration-300",
            isCollapsed ? "opacity-100 w-auto" : "opacity-0 w-0",
          )}
        >
          D
        </h1>
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
                isCollapsed ? "justify-center" : "",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span
                className={cn(
                  "transition-opacity duration-300",
                  isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto",
                )}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
        {isAdmin && !isGuest && ( // Only show User Management for admin, not guests
          <Link
            to="/user-management"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              location.pathname === "/user-management" && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
              isCollapsed ? "justify-center" : "",
            )}
          >
            <Users className="h-5 w-5" />
            <span
              className={cn(
                "transition-opacity duration-300",
                isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto",
              )}
            >
              ইউজার ম্যানেজমেন্ট
            </span>
          </Link>
        )}
      </nav>
      <div className="mt-auto pt-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            isCollapsed ? "justify-center" : "",
          )}
          onClick={signOut}
        >
          <LogOut className="h-5 w-5" />
          <span
            className={cn(
              "ml-3 transition-opacity duration-300",
              isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto",
            )}
          >
            লগআউট
          </span>
        </Button>
      </div>
    </div>
  );
}