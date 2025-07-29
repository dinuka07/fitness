import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  TrendingUp, 
  Calendar,
  Activity,
  BarChart3,
  PieChart,
  Clock
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart as RechartsPieChart,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer
} from "recharts";

const chartConfig = {
  members: {
    label: "Members",
    color: "hsl(var(--primary))",
  },
  active: {
    label: "Active",
    color: "hsl(var(--success))",
  },
  expired: {
    label: "Expired", 
    color: "hsl(var(--warning))",
  },
  suspended: {
    label: "Suspended",
    color: "hsl(var(--destructive))",
  },
};

export const AnalyticsCharts = () => {
  const membershipTrends = [
    { month: "Jan", members: 180, active: 165, expired: 15 },
    { month: "Feb", members: 195, active: 175, expired: 20 },
    { month: "Mar", members: 220, active: 195, expired: 25 },
    { month: "Apr", members: 235, active: 210, expired: 25 },
    { month: "May", members: 247, active: 220, expired: 27 },
  ];

  const accessPatterns = [
    { hour: "6AM", count: 12 },
    { hour: "7AM", count: 28 },
    { hour: "8AM", count: 45 },
    { hour: "9AM", count: 35 },
    { hour: "10AM", count: 22 },
    { hour: "11AM", count: 18 },
    { hour: "12PM", count: 25 },
    { hour: "1PM", count: 30 },
    { hour: "2PM", count: 20 },
    { hour: "3PM", count: 15 },
    { hour: "4PM", count: 18 },
    { hour: "5PM", count: 40 },
    { hour: "6PM", count: 55 },
    { hour: "7PM", count: 48 },
    { hour: "8PM", count: 35 },
    { hour: "9PM", count: 20 },
  ];

  const planDistribution = [
    { name: "Monthly", value: 120, color: "#8884d8" },
    { name: "Quarterly", value: 85, color: "#82ca9d" },
    { name: "Yearly", value: 42, color: "#ffc658" },
  ];

  const memberRetention = [
    { month: "Jan", retention: 92 },
    { month: "Feb", retention: 89 },
    { month: "Mar", retention: 94 },
    { month: "Apr", retention: 91 },
    { month: "May", retention: 96 },
  ];

  const analyticsCards = [
    {
      title: "Monthly Growth",
      value: "+12%",
      description: "New members this month",
      icon: TrendingUp,
      color: "success"
    },
    {
      title: "Avg. Daily Access",
      value: "124",
      description: "Members accessing daily",
      icon: Activity,
      color: "primary"
    },
    {
      title: "Retention Rate",
      value: "96%",
      description: "Member retention",
      icon: Users,
      color: "info"
    },
    {
      title: "Peak Hour",
      value: "6-7 PM",
      description: "Busiest gym hours",
      icon: Clock,
      color: "warning"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="text-2xl font-bold">{card.value}</p>
                  <p className="text-xs text-muted-foreground">{card.description}</p>
                </div>
                <div className={`p-2 rounded-lg ${
                  card.color === "success" ? "bg-success/10 text-success" :
                  card.color === "primary" ? "bg-primary/10 text-primary" :
                  card.color === "info" ? "bg-info/10 text-info" :
                  "bg-warning/10 text-warning"
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Membership Trends */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Membership Trends</h3>
          </div>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <BarChart data={membershipTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="active" fill="var(--color-active)" name="Active" />
              <Bar dataKey="expired" fill="var(--color-expired)" name="Expired" />
            </BarChart>
          </ChartContainer>
        </Card>

        {/* Plan Distribution */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Plan Distribution</h3>
          </div>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <RechartsPieChart>
              <RechartsPieChart
                data={planDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {planDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </RechartsPieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
            </RechartsPieChart>
          </ChartContainer>
          <div className="mt-4 space-y-2">
            {planDistribution.map((plan, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: plan.color }}
                  />
                  <span>{plan.name}</span>
                </div>
                <Badge variant="secondary">{plan.value} members</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Access Patterns */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Daily Access Patterns</h3>
          </div>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <LineChart data={accessPatterns}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="var(--color-members)" 
                strokeWidth={2}
                name="Access Count"
              />
            </LineChart>
          </ChartContainer>
        </Card>

        {/* Member Retention */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Member Retention</h3>
          </div>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <LineChart data={memberRetention}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[80, 100]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="retention" 
                stroke="var(--color-active)" 
                strokeWidth={3}
                name="Retention %"
              />
            </LineChart>
          </ChartContainer>
        </Card>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h4 className="font-semibold mb-2">Peak Hours</h4>
          <p className="text-sm text-muted-foreground">
            Most active: 6-8 PM (avg. 52 members)
          </p>
          <p className="text-sm text-muted-foreground">
            Least active: 2-4 PM (avg. 17 members)
          </p>
        </Card>
        
        <Card className="p-4">
          <h4 className="font-semibold mb-2">Revenue Insights</h4>
          <p className="text-sm text-muted-foreground">
            Monthly plans: 48.6% of revenue
          </p>
          <p className="text-sm text-muted-foreground">
            Yearly plans: 34.2% of revenue
          </p>
        </Card>
        
        <Card className="p-4">
          <h4 className="font-semibold mb-2">Member Demographics</h4>
          <p className="text-sm text-muted-foreground">
            Average member age: 32 years
          </p>
          <p className="text-sm text-muted-foreground">
            Most common plan: Monthly (48.6%)
          </p>
        </Card>
      </div>
    </div>
  );
};