import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  DollarSign,
  Receipt,
  Users,
  Settings,
  BarChart,
  Package,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed?: boolean;
}

const navItems = [
  {
    name: "Dashboard",
    icon: Home,
    href: "/",
  },
  {
    name: "Transactions",
    icon: Receipt,
    href: "/transactions",
  },
  {
    name: "Accounts",
    icon: DollarSign,
    href: "/accounts",
  },
  {
    name: "Customers",
    icon: Users,
    href: "/customers",
  },
  {
    name: "Products",
    icon: Package,
    href: "/products",
  },
  {
    name: "Payments",
    icon: CreditCard,
    href: "/payments",
  },
  {
    name: "Reports",
    icon: BarChart,
    href: "/reports",
  },
  {
    name: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export function Sidebar({ className, isCollapsed = false }: SidebarProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-col space-y-4 border-r bg-sidebar p-4 transition-all duration-300",
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
          Accounting
        </h1>
        <h1
          className={cn(
            "text-2xl font-bold text-sidebar-primary transition-opacity duration-300",
            isCollapsed ? "opacity-100 w-auto" : "opacity-0 w-0",
          )}
        >
          A
        </h1>
      </div>
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
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
        ))}
      </nav>
      <div className="mt-auto pt-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            isCollapsed ? "justify-center" : "",
          )}
        >
          <Settings className="h-5 w-5" />
          <span
            className={cn(
              "ml-3 transition-opacity duration-300",
              isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto",
            )}
          >
            Settings
          </span>
        </Button>
      </div>
    </div>
  );
}