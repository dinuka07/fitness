import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  UserPlus, 
  Activity, 
  Search, 
  Filter,
  TrendingUp,
  Shield,
  Clock,
  QrCode 
} from "lucide-react";
import { StatsCards } from "./dashboard/StatsCards";
import { MembersList } from "./dashboard/MembersList";
import { AccessLogs } from "./dashboard/AccessLogs";
import { AddMemberDialog } from "./dashboard/AddMemberDialog";

export const FitAccessDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  const navigation = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "members", label: "Members", icon: Users },
    { id: "access", label: "Access Logs", icon: Shield },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-white shadow-elevation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <QrCode className="h-6 w-6" />
              </div>
              <h1 className="text-xl font-bold">FitAccess</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Live Status</span>
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              </div>
              
              <Button 
                onClick={() => setIsAddMemberOpen(true)}
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 border-b border-border">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-smooth ${
                    activeTab === item.id
                      ? "bg-primary text-primary-foreground border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search members, access codes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Badge variant="secondary" className="text-xs">
              247 Active Members
            </Badge>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <StatsCards />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MembersList limit={5} />
              <AccessLogs limit={5} />
            </div>
          </div>
        )}

        {activeTab === "members" && <MembersList />}
        {activeTab === "access" && <AccessLogs />}
        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Analytics Coming Soon</h3>
              <p className="text-muted-foreground">
                Advanced analytics and reporting features will be available here.
              </p>
            </Card>
          </div>
        )}
      </div>

      {/* Add Member Dialog */}
      <AddMemberDialog 
        open={isAddMemberOpen} 
        onOpenChange={setIsAddMemberOpen} 
      />
    </div>
  );
};