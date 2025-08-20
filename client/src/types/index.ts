export interface Service {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  estimatedHours: number;
  supportedTools: Tool[];
  complianceFrameworks: ComplianceFramework[];
  lineItems: LineItem[];
  tiers: ServiceTier[];
}

export interface LineItem {
  id: string;
  name: string;
  description: string;
  included: boolean;
}

export interface ServiceTier {
  id: string;
  name: string;
  description: string;
  multiplier: number;
}

export interface Tool {
  id: string;
  name: string;
  category: string;
}

export interface ComplianceFramework {
  id: string;
  name: string;
  description: string;
}

export interface ConfiguredService {
  serviceId: string;
  tierId: string;
  selectedTools: string[];
  selectedFrameworks: string[];
  selectedLineItems: string[];
  customHours?: number;
  customNotes?: string;
}

export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  services: ConfiguredService[];
  clientInfo: ClientInfo;
  createdAt: string;
  updatedAt: string;
}

export interface ClientInfo {
  name: string;
  stakeholder: string;
  startDate: string;
  timezone: string;
  email?: string;
  phone?: string;
}

export interface OrganizationSettings {
  companyName: string;
  consultantName: string;
  consultantEmail: string;
  consultantPhone?: string;
  address: string;
}

export type ServiceCategory = 
  | 'Backup & Recovery'
  | 'Posture Hardening'
  | 'Assessments'
  | 'GRC & Compliance'
  | 'Security Solutioning'
  | 'Monitoring & Retainer';

export interface ServiceFilters {
  search: string;
  category: ServiceCategory | 'All Categories';
  framework: string;
  tool: string;
}
