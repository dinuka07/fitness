import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Shield, 
  ShieldCheck, 
  ShieldX,
  Clock,
  User,
  QrCode,
  Search,
  Calendar,
  Download,
  Filter
} from "lucide-react";

interface AccessLog {
  id: string;
  accessCode: string;
  memberName: string;
  timestamp: string;
  status: "granted" | "denied";
  reason?: string;
  location?: string;
  device?: string;
}

export const AllAccessLogsView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 15;

  // Expanded access logs data
  const [allLogs] = useState<AccessLog[]>([
    {
      id: "1",
      accessCode: "GYM8124",
      memberName: "John Smith",
      timestamp: "2024-02-15 09:15:23",
      status: "granted",
      location: "Main Entrance",
      device: "Scanner 001"
    },
    {
      id: "2",
      accessCode: "GYM7851",
      memberName: "Sarah Johnson",
      timestamp: "2024-02-15 08:45:12",
      status: "granted",
      location: "Main Entrance",
      device: "Scanner 001"
    },
    {
      id: "3",
      accessCode: "GYM9999",
      memberName: "Unknown",
      timestamp: "2024-02-15 08:30:45",
      status: "denied",
      reason: "Invalid access code",
      location: "Main Entrance",
      device: "Scanner 001"
    },
    {
      id: "4",
      accessCode: "GYM9362",
      memberName: "Mike Davis",
      timestamp: "2024-02-15 07:22:18",
      status: "denied",
      reason: "Membership expired",
      location: "Side Entrance",
      device: "Scanner 002"
    },
    {
      id: "5",
      accessCode: "GYM5174",
      memberName: "Emily Wilson",
      timestamp: "2024-02-15 06:55:33",
      status: "granted",
      location: "Main Entrance",
      device: "Scanner 001"
    },
    {
      id: "6",
      accessCode: "GYM6734",
      memberName: "Lisa Anderson",
      timestamp: "2024-02-15 06:30:17",
      status: "granted",
      location: "VIP Entrance",
      device: "Scanner 003"
    },
    {
      id: "7",
      accessCode: "GYM2849",
      memberName: "David Brown",
      timestamp: "2024-02-15 06:15:42",
      status: "denied",
      reason: "Account suspended",
      location: "Main Entrance",
      device: "Scanner 001"
    },
    // Additional logs for pagination demo
    ...Array.from({ length: 50 }, (_, index) => {
      const isGranted = Math.random() > 0.2; // 80% success rate
      const date = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
      return {
        id: `${8 + index}`,
        accessCode: `GYM${String(Math.floor(Math.random() * 9000) + 1000)}`,
        memberName: isGranted ? `Member ${8 + index}` : "Unknown",
        timestamp: date.toISOString().replace('T', ' ').substring(0, 19),
        status: isGranted ? "granted" : "denied" as "granted" | "denied",
        reason: !isGranted ? ["Invalid access code", "Membership expired", "Account suspended"][Math.floor(Math.random() * 3)] : undefined,
        location: ["Main Entrance", "Side Entrance", "VIP Entrance"][Math.floor(Math.random() * 3)],
        device: `Scanner ${String(Math.floor(Math.random() * 3) + 1).padStart(3, '00')}`
      };
    })
  ]);

  const filteredLogs = allLogs.filter(log => {
    const matchesSearch = log.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.accessCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (log.location && log.location.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || log.status === statusFilter;
    
    const logDate = new Date(log.timestamp);
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    let matchesDate = true;
    if (dateFilter === "today") {
      matchesDate = logDate.toDateString() === today.toDateString();
    } else if (dateFilter === "yesterday") {
      matchesDate = logDate.toDateString() === yesterday.toDateString();
    } else if (dateFilter === "week") {
      matchesDate = logDate >= weekAgo;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const startIndex = (currentPage - 1) * logsPerPage;
  const displayLogs = filteredLogs.slice(startIndex, startIndex + logsPerPage);

  const getStatusIcon = (status: string) => {
    return status === "granted" ? ShieldCheck : ShieldX;
  };

  const getStatusColor = (status: string) => {
    return status === "granted" 
      ? "bg-success text-success-foreground" 
      : "bg-destructive text-destructive-foreground";
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      full: date.toLocaleString()
    };
  };

  const exportLogs = () => {
    // This would typically generate and download a CSV file
    console.log("Exporting logs...");
  };

  const getLocationIcon = (location: string) => {
    if (location?.includes("VIP")) return "🌟";
    if (location?.includes("Side")) return "🚪";
    return "🏢";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">All Access Logs ({filteredLogs.length})</h2>
        <Button onClick={exportLogs} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("all")}
            >
              All
            </Button>
            <Button
              variant={statusFilter === "granted" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("granted")}
            >
              Granted
            </Button>
            <Button
              variant={statusFilter === "denied" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("denied")}
            >
              Denied
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant={dateFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setDateFilter("all")}
            >
              All Time
            </Button>
            <Button
              variant={dateFilter === "today" ? "default" : "outline"}
              size="sm"
              onClick={() => setDateFilter("today")}
            >
              Today
            </Button>
            <Button
              variant={dateFilter === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setDateFilter("week")}
            >
              This Week
            </Button>
          </div>

          <div className="text-sm text-muted-foreground flex items-center">
            <Shield className="h-4 w-4 mr-1" />
            Live monitoring active
          </div>
        </div>
      </Card>

      {/* Access Logs Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium">Time</th>
                <th className="text-left p-4 font-medium">Member</th>
                <th className="text-left p-4 font-medium">Access Code</th>
                <th className="text-left p-4 font-medium">Location</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Device</th>
                <th className="text-left p-4 font-medium">Details</th>
              </tr>
            </thead>
            <tbody>
              {displayLogs.map((log) => {
                const StatusIcon = getStatusIcon(log.status);
                const { date, time, full } = formatTimestamp(log.timestamp);
                
                return (
                  <tr key={log.id} className="border-t hover:bg-muted/50">
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm font-medium">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {time}
                        </div>
                        <div className="text-xs text-muted-foreground">{date}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className={log.memberName === "Unknown" ? "text-muted-foreground italic" : "font-medium"}>
                          {log.memberName}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <QrCode className="h-4 w-4 text-muted-foreground" />
                        <code className="font-mono text-sm">{log.accessCode}</code>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <span className="text-sm">{getLocationIcon(log.location || "")}</span>
                        <span className="text-sm">{log.location}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`h-4 w-4 ${
                          log.status === "granted" ? "text-success" : "text-destructive"
                        }`} />
                        <Badge className={`text-xs ${getStatusColor(log.status)}`}>
                          {log.status}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-muted-foreground font-mono">
                        {log.device}
                      </span>
                    </td>
                    <td className="p-4">
                      {log.reason ? (
                        <span className="text-sm text-destructive">
                          {log.reason}
                        </span>
                      ) : (
                        <span className="text-sm text-success">Access granted</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + logsPerPage, filteredLogs.length)} of {filteredLogs.length} logs
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {displayLogs.length === 0 && (
        <Card className="p-8 text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No access logs found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
        </Card>
      )}

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-success" />
            <div>
              <p className="text-sm text-muted-foreground">Successful Access</p>
              <p className="text-xl font-bold">
                {filteredLogs.filter(log => log.status === "granted").length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <ShieldX className="h-5 w-5 text-destructive" />
            <div>
              <p className="text-sm text-muted-foreground">Denied Access</p>
              <p className="text-xl font-bold">
                {filteredLogs.filter(log => log.status === "denied").length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Attempts</p>
              <p className="text-xl font-bold">{filteredLogs.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-info" />
            <div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <p className="text-xl font-bold">
                {filteredLogs.length > 0 
                  ? Math.round((filteredLogs.filter(log => log.status === "granted").length / filteredLogs.length) * 100)
                  : 0
                }%
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};