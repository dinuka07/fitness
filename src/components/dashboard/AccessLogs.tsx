import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  ShieldCheck, 
  ShieldX,
  Clock,
  User,
  QrCode
} from "lucide-react";

interface AccessLog {
  id: string;
  accessCode: string;
  memberName: string;
  timestamp: string;
  status: "granted" | "denied";
  reason?: string;
}

interface AccessLogsProps {
  limit?: number;
  onViewAll?: () => void;
}

export const AccessLogs = ({ limit, onViewAll }: AccessLogsProps) => {
  const [logs] = useState<AccessLog[]>([
    {
      id: "1",
      accessCode: "GYM8124",
      memberName: "John Smith",
      timestamp: "2024-02-15 09:15:23",
      status: "granted"
    },
    {
      id: "2",
      accessCode: "GYM7851",
      memberName: "Sarah Johnson",
      timestamp: "2024-02-15 08:45:12",
      status: "granted"
    },
    {
      id: "3",
      accessCode: "GYM9999",
      memberName: "Unknown",
      timestamp: "2024-02-15 08:30:45",
      status: "denied",
      reason: "Invalid access code"
    },
    {
      id: "4",
      accessCode: "GYM9362",
      memberName: "Mike Davis",
      timestamp: "2024-02-15 07:22:18",
      status: "denied",
      reason: "Membership expired"
    },
    {
      id: "5",
      accessCode: "GYM5174",
      memberName: "Emily Wilson",
      timestamp: "2024-02-15 06:55:33",
      status: "granted"
    },
    {
      id: "6",
      accessCode: "GYM6734",
      memberName: "Lisa Anderson",
      timestamp: "2024-02-15 06:30:17",
      status: "granted"
    },
    {
      id: "7",
      accessCode: "GYM2849",
      memberName: "David Brown",
      timestamp: "2024-02-15 06:15:42",
      status: "denied",
      reason: "Account suspended"
    }
  ]);

  const displayLogs = limit ? logs.slice(0, limit) : logs;

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
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Shield className="h-5 w-5" />
          {limit ? "Recent Access Logs" : "Access Logs"}
        </h3>
        {limit && (
          <Button variant="outline" size="sm" onClick={onViewAll}>
            View All
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {displayLogs.map((log) => {
          const StatusIcon = getStatusIcon(log.status);
          const { date, time } = formatTimestamp(log.timestamp);
          
          return (
            <div 
              key={log.id} 
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-smooth"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${
                  log.status === "granted" 
                    ? "bg-success/10 text-success" 
                    : "bg-destructive/10 text-destructive"
                }`}>
                  <StatusIcon className="h-4 w-4" />
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{log.memberName}</h4>
                    <Badge className={`text-xs ${getStatusColor(log.status)}`}>
                      {log.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <QrCode className="h-3 w-3" />
                      <span className="font-mono">{log.accessCode}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{time}</span>
                    </div>
                  </div>
                  
                  {log.reason && (
                    <p className="text-xs text-muted-foreground">
                      Reason: {log.reason}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-right text-xs text-muted-foreground">
                <p>{date}</p>
              </div>
            </div>
          );
        })}

        {displayLogs.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No access logs found</p>
          </div>
        )}
      </div>
    </Card>
  );
};