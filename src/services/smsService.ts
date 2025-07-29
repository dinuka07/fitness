interface SMSConfig {
  provider: 'twilio' | 'aws-sns' | 'firebase' | 'custom';
  apiKey?: string;
  apiSecret?: string;
  fromNumber?: string;
}

interface SMSTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
}

interface SMSMessage {
  to: string;
  message: string;
  templateId?: string;
  variables?: Record<string, string>;
}

interface SMSResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  cost?: number;
}

class SMSService {
  private config: SMSConfig;
  private templates: SMSTemplate[] = [
    {
      id: 'welcome',
      name: 'Welcome Message',
      subject: 'Welcome to FitAccess!',
      body: 'Hi {{memberName}}! Welcome to FitAccess. Your access code is {{accessCode}}. Your membership expires on {{expiryDate}}. Show this code at the entrance to access the gym. Need help? Reply HELP.',
      variables: ['memberName', 'accessCode', 'expiryDate']
    },
    {
      id: 'renewal_reminder',
      name: 'Renewal Reminder',
      subject: 'Membership Renewal Reminder',
      body: 'Hi {{memberName}}! Your FitAccess membership expires on {{expiryDate}}. Renew now to avoid interruption. Access code: {{accessCode}}. Visit our website or call us to renew.',
      variables: ['memberName', 'expiryDate', 'accessCode']
    },
    {
      id: 'access_code_reset',
      name: 'Access Code Reset',
      subject: 'New Access Code',
      body: 'Hi {{memberName}}! Your new FitAccess code is {{accessCode}}. This replaces your previous code. Use this at the gym entrance. Questions? Contact us.',
      variables: ['memberName', 'accessCode']
    },
    {
      id: 'membership_suspended',
      name: 'Membership Suspended',
      subject: 'Membership Suspended',
      body: 'Hi {{memberName}}, your FitAccess membership has been temporarily suspended. Please contact us to resolve this issue. Access code: {{accessCode}}.',
      variables: ['memberName', 'accessCode']
    },
    {
      id: 'membership_reactivated',
      name: 'Membership Reactivated',
      subject: 'Membership Reactivated',
      body: 'Hi {{memberName}}! Your FitAccess membership is now active. Welcome back! Your access code {{accessCode}} is ready to use. Membership valid until {{expiryDate}}.',
      variables: ['memberName', 'accessCode', 'expiryDate']
    }
  ];

  constructor(config: SMSConfig) {
    this.config = config;
  }

  /**
   * Send SMS using template
   */
  async sendTemplatedSMS(to: string, templateId: string, variables: Record<string, string>): Promise<SMSResponse> {
    const template = this.templates.find(t => t.id === templateId);
    if (!template) {
      return {
        success: false,
        error: `Template with ID '${templateId}' not found`
      };
    }

    // Validate required variables
    const missingVars = template.variables.filter(varName => !variables[varName]);
    if (missingVars.length > 0) {
      return {
        success: false,
        error: `Missing required variables: ${missingVars.join(', ')}`
      };
    }

    // Replace variables in template
    let message = template.body;
    Object.entries(variables).forEach(([key, value]) => {
      message = message.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });

    return this.sendSMS({ to, message, templateId, variables });
  }

  /**
   * Send raw SMS message
   */
  async sendSMS(message: SMSMessage): Promise<SMSResponse> {
    try {
      // Validate phone number format
      if (!this.isValidPhoneNumber(message.to)) {
        return {
          success: false,
          error: 'Invalid phone number format'
        };
      }

      // Simulate SMS sending based on provider
      switch (this.config.provider) {
        case 'twilio':
          return this.sendViaTwilio(message);
        case 'aws-sns':
          return this.sendViaAWSSNS(message);
        case 'firebase':
          return this.sendViaFirebase(message);
        default:
          return this.sendViaSimulation(message);
      }
    } catch (error) {
      console.error('SMS Service Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Send welcome SMS to new member
   */
  async sendWelcomeSMS(memberData: {
    name: string;
    phone: string;
    accessCode: string;
    expiryDate: string;
  }): Promise<SMSResponse> {
    return this.sendTemplatedSMS(memberData.phone, 'welcome', {
      memberName: memberData.name,
      accessCode: memberData.accessCode,
      expiryDate: memberData.expiryDate
    });
  }

  /**
   * Send renewal reminder SMS
   */
  async sendRenewalReminder(memberData: {
    name: string;
    phone: string;
    accessCode: string;
    expiryDate: string;
  }): Promise<SMSResponse> {
    return this.sendTemplatedSMS(memberData.phone, 'renewal_reminder', {
      memberName: memberData.name,
      accessCode: memberData.accessCode,
      expiryDate: memberData.expiryDate
    });
  }

  /**
   * Send access code reset SMS
   */
  async sendAccessCodeReset(memberData: {
    name: string;
    phone: string;
    accessCode: string;
  }): Promise<SMSResponse> {
    return this.sendTemplatedSMS(memberData.phone, 'access_code_reset', {
      memberName: memberData.name,
      accessCode: memberData.accessCode
    });
  }

  /**
   * Send membership status change SMS
   */
  async sendMembershipStatusChange(memberData: {
    name: string;
    phone: string;
    accessCode: string;
    status: 'suspended' | 'reactivated';
    expiryDate?: string;
  }): Promise<SMSResponse> {
    const templateId = memberData.status === 'suspended' ? 'membership_suspended' : 'membership_reactivated';
    const variables: Record<string, string> = {
      memberName: memberData.name,
      accessCode: memberData.accessCode
    };

    if (memberData.expiryDate) {
      variables.expiryDate = memberData.expiryDate;
    }

    return this.sendTemplatedSMS(memberData.phone, templateId, variables);
  }

  /**
   * Get available SMS templates
   */
  getTemplates(): SMSTemplate[] {
    return [...this.templates];
  }

  /**
   * Get SMS statistics (mock implementation)
   */
  async getSMSStatistics(): Promise<{
    sent: number;
    delivered: number;
    failed: number;
    totalCost: number;
  }> {
    // In a real implementation, this would fetch from your SMS provider's API
    return {
      sent: 1247,
      delivered: 1198,
      failed: 49,
      totalCost: 24.94
    };
  }

  // Private helper methods

  private isValidPhoneNumber(phone: string): boolean {
    // Basic phone number validation (can be enhanced)
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  private async sendViaTwilio(message: SMSMessage): Promise<SMSResponse> {
    // Simulate Twilio API call
    console.log('Sending via Twilio:', message);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Simulate 95% success rate
    if (Math.random() < 0.95) {
      return {
        success: true,
        messageId: `twilio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        cost: 0.02 // $0.02 per message
      };
    } else {
      return {
        success: false,
        error: 'Twilio API error: Message delivery failed'
      };
    }
  }

  private async sendViaAWSSNS(message: SMSMessage): Promise<SMSResponse> {
    // Simulate AWS SNS API call
    console.log('Sending via AWS SNS:', message);
    
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1500));
    
    if (Math.random() < 0.97) {
      return {
        success: true,
        messageId: `sns_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        cost: 0.015 // $0.015 per message
      };
    } else {
      return {
        success: false,
        error: 'AWS SNS error: Rate limit exceeded'
      };
    }
  }

  private async sendViaFirebase(message: SMSMessage): Promise<SMSResponse> {
    // Simulate Firebase Cloud Messaging
    console.log('Sending via Firebase:', message);
    
    await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 1800));
    
    if (Math.random() < 0.93) {
      return {
        success: true,
        messageId: `fcm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        cost: 0.01 // $0.01 per message
      };
    } else {
      return {
        success: false,
        error: 'Firebase error: Invalid registration token'
      };
    }
  }

  private async sendViaSimulation(message: SMSMessage): Promise<SMSResponse> {
    // Development/demo mode - just log and return success
    console.log('📱 SMS Simulation Mode');
    console.log('To:', message.to);
    console.log('Message:', message.message);
    console.log('Template ID:', message.templateId);
    console.log('Variables:', message.variables);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    // Always succeed in simulation mode
    return {
      success: true,
      messageId: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      cost: 0.0 // Free in simulation
    };
  }
}

// Create singleton instance with default configuration
const smsService = new SMSService({
  provider: 'custom', // Use simulation mode by default
  fromNumber: '+1 (555) 000-0000'
});

export default smsService;
export type { SMSResponse, SMSTemplate, SMSMessage, SMSConfig };