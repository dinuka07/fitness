import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import smsService from "@/services/smsService";
import { 
  MoreHorizontal, 
  User, 
  Calendar,
  Phone,
  QrCode,
  Shield,
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle,
  XCircle
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
  email?: string;
}

export const AllMembersView = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 10;

  // Expanded member data
  const [allMembers] = useState<Member[]>([
    {
      id: "1",
      name: "John Smith",
      phone: "+1 (555) 123-4567",
      email: "john.smith@email.com",
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
      email: "sarah.j@email.com",
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
      email: "mike.davis@email.com",
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
      email: "emily.w@email.com",
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
      email: "david.brown@email.com",
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
      email: "lisa.a@email.com",
      accessCode: "GYM6734",
      planType: "Yearly",
      status: "active",
      expiryDate: "2024-12-01",
      joinDate: "2023-12-01"
    },
    // Additional members for pagination demo
    ...Array.from({ length: 20 }, (_, index) => ({
      id: `${7 + index}`,
      name: `Member ${7 + index}`,
      phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      email: `member${7 + index}@email.com`,
      accessCode: `GYM${String(Math.floor(Math.random() * 9000) + 1000)}`,
      planType: ["Monthly", "Quarterly", "Yearly"][Math.floor(Math.random() * 3)],
      status: ["active", "expired", "suspended"][Math.floor(Math.random() * 3)] as "active" | "expired" | "suspended",
      expiryDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }))
  ]);

  const filteredMembers = allMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.accessCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.phone.includes(searchQuery);
    const matchesFilter = statusFilter === "all" || member.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);
  const startIndex = (currentPage - 1) * membersPerPage;
  const displayMembers = filteredMembers.slice(startIndex, startIndex + membersPerPage);

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

  const handleStatusChange = async (memberId: string, newStatus: "active" | "suspended") => {
    // This would typically make an API call
    const member = allMembers.find(m => m.id === memberId);
    if (!member) return;

    console.log(`Changing member ${memberId} status to ${newStatus}`);
    
    // Send SMS notification
    try {
      const response = await smsService.sendMembershipStatusChange({
        name: member.name,
        phone: member.phone,
        accessCode: member.accessCode,
        status: newStatus === "suspended" ? "suspended" : "reactivated",
        expiryDate: member.expiryDate
      });

      if (response.success) {
        toast({
          title: "Status Updated",
          description: `${member.name}'s membership ${newStatus} and SMS notification sent`,
        });
      } else {
        toast({
          title: "Status Updated",
          description: `${member.name}'s membership ${newStatus} but SMS failed to send`,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Status Updated",
        description: `${member.name}'s membership ${newStatus} but SMS notification failed`,
        variant: "destructive"
      });
    }
  };

  const handleDeleteMember = (memberId: string) => {
    // This would typically show a confirmation dialog and make an API call
    console.log(`Deleting member ${memberId}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "expired":
        return <XCircle className="h-4 w-4 text-warning" />;
      case "suspended":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">All Members ({filteredMembers.length})</h2>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name, access code, or phone..."
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
              variant={statusFilter === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("active")}
            >
              Active
            </Button>
            <Button
              variant={statusFilter === "expired" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("expired")}
            >
              Expired
            </Button>
            <Button
              variant={statusFilter === "suspended" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("suspended")}
            >
              Suspended
            </Button>
          </div>
        </div>
      </Card>

      {/* Members Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium">Member</th>
                <th className="text-left p-4 font-medium">Contact</th>
                <th className="text-left p-4 font-medium">Access Code</th>
                <th className="text-left p-4 font-medium">Plan</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Expiry</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayMembers.map((member) => (
                <tr key={member.id} className="border-t hover:bg-muted/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Joined: {member.joinDate}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3" />
                        {member.phone}
                      </div>
                      {member.email && (
                        <div className="text-sm text-muted-foreground">{member.email}</div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <QrCode className="h-4 w-4 text-muted-foreground" />
                      <code className="font-mono font-medium">{member.accessCode}</code>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="secondary">{member.planType}</Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(member.status)}
                      <Badge className={`text-xs ${getStatusColor(member.status)}`}>
                        {member.status}
                      </Badge>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      {member.expiryDate}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {member.status === "suspended" ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusChange(member.id, "active")}
                          className="text-success hover:text-success"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      ) : member.status === "active" ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusChange(member.id, "suspended")}
                          className="text-warning hover:text-warning"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      ) : null}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMember(member.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + membersPerPage, filteredMembers.length)} of {filteredMembers.length} members
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

      {displayMembers.length === 0 && (
        <Card className="p-8 text-center">
          <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No members found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
        </Card>
      )}
    </div>
  );
};