import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  UserCheck, 
  UserX, 
  TrendingUp, 
  Activity,
  DollarSign 
} from "lucide-react";

export const StatsCards = () => {
  const stats = [
    {
      title: "Total Members",
      value: "247",
      change: "+12 this month",
      trend: "up",
      icon: Users,
      color: "primary"
    },
    {
      title: "Active Members",
      value: "189",
      change: "76.5% of total",
      trend: "up",
      icon: UserCheck,
      color: "success"
    },
    {
      title: "Expired",
      value: "58",
      change: "23.5% of total",
      trend: "down",
      icon: UserX,
      color: "warning"
    },
    {
      title: "Today's Access",
      value: "124",
      change: "+8% from yesterday",
      trend: "up",
      icon: Activity,
      color: "info"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="p-6 hover:shadow-elevation transition-smooth">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={stat.trend === "up" ? "default" : "secondary"}
                    className={`text-xs ${
                      stat.trend === "up" 
                        ? "bg-success text-success-foreground" 
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {stat.change}
                  </Badge>
                </div>
              </div>
              
              <div className={`p-3 rounded-lg ${
                stat.color === "primary" ? "bg-primary/10 text-primary" :
                stat.color === "success" ? "bg-success/10 text-success" :
                stat.color === "warning" ? "bg-warning/10 text-warning" :
                "bg-info/10 text-info"
              }`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};