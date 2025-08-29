import React from "react";
import { DollarSign, Users, CreditCard, Activity } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { SalesOverviewChart } from "@/components/dashboard/SalesOverviewChart";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const Dashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const isMobile = useIsMobile();

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  React.useEffect(() => {
    if (isMobile) {
      setIsSidebarCollapsed(true);
    } else {
      setIsSidebarCollapsed(false);
    }
  }, [isMobile]);

  return (
    <div className="flex min-h-screen w-full">
      <div className={cn("hidden sm:block", isMobile && "hidden")}>
        <Sidebar isCollapsed={isSidebarCollapsed} />
      </div>
      <div className="flex flex-col flex-1">
        <Header
          onToggleSidebar={handleToggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
        />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <DashboardCard
              title="Total Revenue"
              value="$45,231.89"
              change="+20.1% from last month"
              changeType="increase"
              icon={DollarSign}
            />
            <DashboardCard
              title="Subscriptions"
              value="+2350"
              change="+180.1% from last month"
              changeType="increase"
              icon={Users}
            />
            <DashboardCard
              title="Sales"
              value="+12,234"
              change="+19% from last month"
              changeType="increase"
              icon={CreditCard}
            />
            <DashboardCard
              title="Active Now"
              value="+573"
              change="+201 since last hour"
              changeType="increase"
              icon={Activity}
            />
          </div>
          <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
            <RecentTransactions />
            <SalesOverviewChart />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;