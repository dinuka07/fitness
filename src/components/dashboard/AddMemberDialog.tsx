import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Phone, 
  Calendar, 
  CreditCard,
  QrCode,
  MessageSquare,
  Copy,
  Check
} from "lucide-react";

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddMemberDialog = ({ open, onOpenChange }: AddMemberDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    planType: "",
    startDate: new Date().toISOString().split('T')[0],
    customDuration: ""
  });

  const planTypes = [
    { value: "monthly", label: "Monthly Plan", duration: 30 },
    { value: "quarterly", label: "Quarterly Plan", duration: 90 },
    { value: "yearly", label: "Yearly Plan", duration: 365 },
    { value: "custom", label: "Custom Duration", duration: 0 }
  ];

  const generateAccessCode = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    let code = "GYM";
    
    for (let i = 0; i < 4; i++) {
      code += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    
    return code;
  };

  const calculateExpiryDate = (startDate: string, planType: string, customDuration?: string) => {
    const start = new Date(startDate);
    const plan = planTypes.find(p => p.value === planType);
    
    if (planType === "custom" && customDuration) {
      start.setDate(start.getDate() + parseInt(customDuration));
    } else if (plan) {
      start.setDate(start.getDate() + plan.duration);
    }
    
    return start.toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Generate unique access code
      const accessCode = generateAccessCode();
      setGeneratedCode(accessCode);

      // Calculate expiry date
      const expiryDate = calculateExpiryDate(
        formData.startDate, 
        formData.planType, 
        formData.customDuration
      );

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: "Member Added Successfully!",
        description: `${formData.fullName} has been registered with access code ${accessCode}`,
      });

      // Reset form
      setFormData({
        fullName: "",
        phone: "",
        planType: "",
        startDate: new Date().toISOString().split('T')[0],
        customDuration: ""
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add member. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Access code copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the code manually",
        variant: "destructive"
      });
    }
  };

  const handleClose = () => {
    setGeneratedCode(null);
    setCopied(false);
    onOpenChange(false);
  };

  if (generatedCode) {
    const expiryDate = calculateExpiryDate(
      formData.startDate, 
      formData.planType, 
      formData.customDuration
    );

    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              Member Added Successfully! 🎉
            </DialogTitle>
          </DialogHeader>
          
          <Card className="p-6 bg-gradient-card">
            <div className="text-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-lg">
                <QrCode className="h-12 w-12 mx-auto text-primary mb-2" />
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Access Code</p>
                  <div className="flex items-center justify-center gap-2">
                    <code className="text-2xl font-bold font-mono bg-background px-3 py-1 rounded">
                      {generatedCode}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(generatedCode)}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Member:</span>
                  <span className="font-medium">{formData.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-medium">{formData.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan:</span>
                  <Badge variant="secondary">
                    {planTypes.find(p => p.value === formData.planType)?.label}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expires:</span>
                  <span className="font-medium">{expiryDate}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => toast({
                    title: "SMS Feature",
                    description: "SMS integration will be available soon!"
                  })}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send SMS
                </Button>
                <Button onClick={handleClose} className="flex-1">
                  Done
                </Button>
              </div>
            </div>
          </Card>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Member</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="fullName"
                placeholder="Enter member's full name"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="planType">Plan Type</Label>
            <Select
              value={formData.planType}
              onValueChange={(value) => setFormData(prev => ({ ...prev, planType: value }))}
              required
            >
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Select a plan" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {planTypes.map((plan) => (
                  <SelectItem key={plan.value} value={plan.value}>
                    {plan.label}
                    {plan.duration > 0 && (
                      <span className="text-muted-foreground ml-2">
                        ({plan.duration} days)
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.planType === "custom" && (
            <div className="space-y-2">
              <Label htmlFor="customDuration">Custom Duration (Days)</Label>
              <Input
                id="customDuration"
                type="number"
                placeholder="Enter number of days"
                value={formData.customDuration}
                onChange={(e) => setFormData(prev => ({ ...prev, customDuration: e.target.value }))}
                min="1"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Adding..." : "Add Member"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};