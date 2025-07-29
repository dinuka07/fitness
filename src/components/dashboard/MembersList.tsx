import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  MoreHorizontal, 
  User, 
  Calendar,
  Phone,
  QrCode,
  Shield
} from "lucide-react";

interface Member {
  id: string;
  name: string;
  phone: string;
  accessCode: string;
  planType: string;
  status: "active" | "expired" | "suspended";
  expiryDate: string;
  joinDate: string;
}

interface MembersListProps {
  limit?: number;
  onViewAll?: () => void;
}

export const MembersList = ({ limit, onViewAll }: MembersListProps) => {
  const [members] = useState<Member[]>([
    {
      id: "1",
      name: "John Smith",
      phone: "+1 (555) 123-4567",
      accessCode: "GYM8124",
      planType: "Monthly",
      status: "active",
      expiryDate: "2024-03-15",
      joinDate: "2024-02-15"
    },
    {
      id: "2",
      name: "Sarah Johnson",
      phone: "+1 (555) 987-6543",
      accessCode: "GYM7851",
      planType: "Yearly",
      status: "active",
      expiryDate: "2025-01-20",
      joinDate: "2024-01-20"
    },
    {
      id: "3",
      name: "Mike Davis",
      phone: "+1 (555) 456-7890",
      accessCode: "GYM9362",
      planType: "Monthly",
      status: "expired",
      expiryDate: "2024-01-30",
      joinDate: "2023-12-30"
    },
    {
      id: "4",
      name: "Emily Wilson",
      phone: "+1 (555) 321-0987",
      accessCode: "GYM5174",
      planType: "Quarterly",
      status: "active",
      expiryDate: "2024-05-10",
      joinDate: "2024-02-10"
    },
    {
      id: "5",
      name: "David Brown",
      phone: "+1 (555) 654-3210",
      accessCode: "GYM2849",
      planType: "Monthly",
      status: "suspended",
      expiryDate: "2024-03-05",
      joinDate: "2024-02-05"
    },
    {
      id: "6",
      name: "Lisa Anderson",
      phone: "+1 (555) 789-0123",
      accessCode: "GYM6734",
      planType: "Yearly",
      status: "active",
      expiryDate: "2024-12-01",
      joinDate: "2023-12-01"
    }
  ]);

  const displayMembers = limit ? members.slice(0, limit) : members;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success text-success-foreground";
      case "expired":
        return "bg-warning text-warning-foreground";
      case "suspended":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">
          {limit ? "Recent Members" : "All Members"}
        </h3>
        {limit && (
          <Button variant="outline" size="sm" onClick={onViewAll}>
            View All
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {displayMembers.map((member) => (
          <div 
            key={member.id} 
            className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-smooth"
          >
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {getInitials(member.name)}
                </AvatarFallback>
              </Avatar>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{member.name}</h4>
                  <Badge className={`text-xs ${getStatusColor(member.status)}`}>
                    {member.status}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <QrCode className="h-3 w-3" />
                    <span className="font-mono">{member.accessCode}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    <span>{member.phone}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{member.planType} Plan</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Expires: {member.expiryDate}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs"
              >
                <Shield className="h-3 w-3 mr-1" />
                Access
              </Button>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {displayMembers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No members found</p>
          </div>
        )}
      </div>
    </Card>
  );
};