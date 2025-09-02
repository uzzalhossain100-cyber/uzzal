import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "increase" | "decrease";
  icon?: React.ElementType;
  className?: string;
}

export function DashboardCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  className,
}: DashboardCardProps) {
  return (
    <Card className={cn("flex-1 bg-background/80 backdrop-blur-sm", className)}> {/* Added bg-background/80 backdrop-blur-sm */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-extrabold">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-extrabold">{value}</div>
        {change && (
          <p
            className={cn(
              "text-xs font-bold",
              changeType === "increase" && "text-green-500",
              changeType === "decrease" && "text-red-500",
            )}
          >
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
}