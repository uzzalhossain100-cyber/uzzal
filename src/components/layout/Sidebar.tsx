import React from "react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import { cn } from "@/lib/utils";
import {
  Home,
  Newspaper,
  Bot,
  Mail,
  Tv,
  Settings,
  LogOut, // Added LogOut icon for consistency
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed?: boolean;
}

const navItems = [
  {
    name: "হোম",
    icon: Home,
    href: "/",
  },
  {
    name: "খবর",
    icon: Newspaper,
    href: "/news",
  },
  {
    name: "All In One",
    icon: Bot,
    href: "/all-in-one",
  },
  {
    name: "লাইভ টিভি",
    icon: Tv,
    href: "/live-tv",
  },
  {
    name: "যোগাযোগ",
    icon: Mail,
    href: "/contact",
  },
];

export function Sidebar({ className, isCollapsed = false }: SidebarProps) {
  const { signOut } = useAuth();
  const location = useLocation(); // Get current location

  return (
    <div
      className={cn(
        "flex h-full flex-col space-y-4 border-r bg-sidebar p-4 transition-all duration-300 shadow-md", // Added shadow-md
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
          const isActive = location.pathname === item.href; // Check if the current path matches the item's href
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground", // Active link styling
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
          <LogOut className="h-5 w-5" /> {/* Changed to LogOut icon for logout button */}
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