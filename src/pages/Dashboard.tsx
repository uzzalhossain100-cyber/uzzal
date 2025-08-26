import React from "react";
import { DollarSign, Users, CreditCard, Activity } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { SalesOverviewChart } from "@/components/dashboard/SalesOverviewChart";
import { useAuth } from "@/context/AuthContext"; // Import useAuth

const Dashboard = () => {
  const { user } = useAuth(); // Get user from AuthContext

  return (
    <div className="flex flex-col flex-1">
      <h1 className="text-3xl font-bold mb-6">
        স্বাগতম, {user?.email === 'Uzzal' ? 'এডমিন Uzzal' : user?.email || 'ব্যবহারকারী'}!
      </h1>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <DashboardCard
          title="মোট আয়"
          value="$45,231.89"
          change="+20.1% গত মাস থেকে"
          changeType="increase"
          icon={DollarSign}
        />
        <DashboardCard
          title="সাবস্ক্রিপশন"
          value="+2350"
          change="+180.1% গত মাস থেকে"
          changeType="increase"
          icon={Users}
        />
        <DashboardCard
          title="বিক্রয়"
          value="+12,234"
          change="+19% গত মাস থেকে"
          changeType="increase"
          icon={CreditCard}
        />
        <DashboardCard
          title="সক্রিয় এখন"
          value="+573"
          change="+201 গত ঘন্টা থেকে"
          changeType="increase"
          icon={Activity}
        />
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 mt-6">
        <RecentTransactions />
        <SalesOverviewChart />
      </div>
    </div>
  );
};

export default Dashboard;