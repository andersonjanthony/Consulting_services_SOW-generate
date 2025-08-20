import { Service, Tool, ComplianceFramework, ServiceTier } from '@/types';

export const serviceTiers: ServiceTier[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Essential features and setup',
    multiplier: 0.8
  },
  {
    id: 'standard',
    name: 'Standard',
    description: 'Complete implementation with best practices',
    multiplier: 1.0
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Advanced features with custom requirements',
    multiplier: 1.5
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Tailored to specific requirements',
    multiplier: 1.0
  }
];

export const tools: Tool[] = [
  { id: 'shield', name: 'Salesforce Shield / Event Monitoring', category: 'Native' },
  { id: 'security-center', name: 'Salesforce Security Center', category: 'Native' },
  { id: 'appomni', name: 'AppOmni', category: 'SSPM' },
  { id: 'own-secure', name: 'Own Secure', category: 'SSPM' },
  { id: 'spinspm', name: 'SpinSPM (Spin.AI)', category: 'SSPM' },
  { id: 'vanta', name: 'Vanta', category: 'GRC' },
  { id: 'ownbackup', name: 'OwnBackup', category: 'Backup' },
  { id: 'gearset', name: 'Gearset Backup', category: 'Backup' },
  { id: 'autorabit', name: 'AutoRABIT Vault', category: 'Backup' },
  { id: 'odaseva', name: 'Odaseva', category: 'Backup' },
  { id: 'par-tool', name: 'Custom PAR Tool (CloudStrategik)', category: 'Custom' }
];

export const complianceFrameworks: ComplianceFramework[] = [
  { id: 'nist-800-53', name: 'NIST 800-53', description: 'Security and Privacy Controls for Federal Information Systems' },
  { id: 'nist-csf', name: 'NIST CSF', description: 'Cybersecurity Framework' },
  { id: 'iso-27001', name: 'ISO 27001', description: 'Information Security Management System' },
  { id: 'cis-controls', name: 'CIS Controls', description: 'Critical Security Controls' },
  { id: 'hipaa', name: 'HIPAA', description: 'Health Insurance Portability and Accountability Act' },
  { id: 'gdpr', name: 'GDPR', description: 'General Data Protection Regulation' },
  { id: 'soc2', name: 'SOC 2', description: 'Service Organization Control 2' },
  { id: 'pci-dss', name: 'PCI DSS', description: 'Payment Card Industry Data Security Standard' },
  { id: 'gxp-gdp', name: 'GxP/GDP', description: 'Good Manufacturing/Distribution Practice' }
];

export const services: Service[] = [
  {
    id: 'backup-recovery-core',
    name: 'Backup & Recovery – Core Setup',
    description: 'Install and configure a Salesforce backup solution (data + metadata), define retention, encryption, and restore runbooks.',
    category: 'Backup & Recovery',
    estimatedHours: 32,
    supportedTools: [
      tools.find(t => t.id === 'ownbackup')!,
      tools.find(t => t.id === 'gearset')!,
      tools.find(t => t.id === 'autorabit')!,
      tools.find(t => t.id === 'odaseva')!
    ],
    complianceFrameworks: [
      complianceFrameworks.find(f => f.id === 'iso-27001')!,
      complianceFrameworks.find(f => f.id === 'soc2')!,
      complianceFrameworks.find(f => f.id === 'hipaa')!
    ],
    tiers: serviceTiers,
    lineItems: [
      { id: 'backup-install', name: 'Tool installation & auth', description: 'Install backup solution and configure authentication', included: true },
      { id: 'backup-policy', name: 'Baseline backup policy (objects, frequency, retention)', description: 'Define comprehensive backup policy', included: true },
      { id: 'backup-encryption', name: 'At-rest encryption & key mgmt guidance', description: 'Configure encryption and key management', included: false },
      { id: 'backup-restore', name: 'Restore runbook & tabletop walkthrough', description: 'Create restore procedures and conduct walkthrough', included: true },
      { id: 'backup-monitoring', name: 'Backup monitoring & alerting setup', description: 'Configure monitoring and alert systems', included: false },
      { id: 'backup-testing', name: 'Disaster recovery testing plan', description: 'Develop and document DR testing procedures', included: false }
    ]
  },
  {
    id: 'security-assessment',
    name: 'Security Assessment (Config & Access)',
    description: 'Point-in-time assessment covering identities, permissions, session/login settings, sharing, guest access, and API posture.',
    category: 'Assessments',
    estimatedHours: 48,
    supportedTools: [
      tools.find(t => t.id === 'security-center')!,
      tools.find(t => t.id === 'appomni')!,
      tools.find(t => t.id === 'own-secure')!,
      tools.find(t => t.id === 'shield')!
    ],
    complianceFrameworks: [
      complianceFrameworks.find(f => f.id === 'cis-controls')!,
      complianceFrameworks.find(f => f.id === 'nist-csf')!,
      complianceFrameworks.find(f => f.id === 'iso-27001')!
    ],
    tiers: serviceTiers,
    lineItems: [
      { id: 'assess-workshops', name: 'Workshops & discovery sessions', description: 'Conduct discovery workshops with stakeholders', included: true },
      { id: 'assess-scan', name: 'Tool-assisted scan & manual checks', description: 'Comprehensive automated and manual security assessment', included: true },
      { id: 'assess-scorecard', name: 'Risk scorecard & executive summary', description: 'Deliver risk assessment scorecard and executive summary', included: true },
      { id: 'assess-remediation', name: 'Prioritized remediation roadmap', description: 'Create detailed remediation plan with priorities', included: false },
      { id: 'assess-compliance', name: 'Compliance gap analysis', description: 'Analyze gaps against selected compliance frameworks', included: false },
      { id: 'assess-presentation', name: 'Stakeholder presentation & Q&A', description: 'Present findings to stakeholders with Q&A session', included: false }
    ]
  },
  {
    id: 'posture-hardening',
    name: 'Security Tool Implementation & Posture Hardening',
    description: 'Implement SSPM tools, baseline misconfig scan, prioritized remediation plan, and coaching to harden posture.',
    category: 'Posture Hardening',
    estimatedHours: 36,
    supportedTools: [
      tools.find(t => t.id === 'security-center')!,
      tools.find(t => t.id === 'appomni')!,
      tools.find(t => t.id === 'spinspm')!,
      tools.find(t => t.id === 'vanta')!
    ],
    complianceFrameworks: [
      complianceFrameworks.find(f => f.id === 'nist-csf')!,
      complianceFrameworks.find(f => f.id === 'cis-controls')!,
      complianceFrameworks.find(f => f.id === 'soc2')!
    ],
    tiers: serviceTiers,
    lineItems: [
      { id: 'hardening-install', name: 'Install & connect SSPM tool(s)', description: 'Install and configure selected SSPM tools', included: true },
      { id: 'hardening-baseline', name: 'Baseline scan & posture score', description: 'Conduct baseline security posture assessment', included: true },
      { id: 'hardening-backlog', name: 'Prioritized remediation backlog', description: 'Create prioritized list of security improvements', included: true },
      { id: 'hardening-coaching', name: 'Hands-on coaching & knowledge transfer', description: 'Provide coaching on security best practices', included: false },
      { id: 'hardening-policies', name: 'Security policy documentation', description: 'Document security policies and procedures', included: false },
      { id: 'hardening-automation', name: 'Automated remediation setup', description: 'Configure automated remediation where possible', included: false }
    ]
  },
  {
    id: 'grc-compliance',
    name: 'GRC & Compliance Mapping',
    description: 'Map findings to controls (NIST/ISO/CIS/HIPAA/GDPR/etc.), set up a lightweight GRC tracker and remediation workflow.',
    category: 'GRC & Compliance',
    estimatedHours: 30,
    supportedTools: [
      tools.find(t => t.id === 'security-center')!,
      tools.find(t => t.id === 'appomni')!,
      tools.find(t => t.id === 'vanta')!
    ],
    complianceFrameworks: complianceFrameworks,
    tiers: serviceTiers,
    lineItems: [
      { id: 'grc-mapping', name: 'Control framework mapping', description: 'Map security findings to compliance controls', included: true },
      { id: 'grc-tracker', name: 'GRC tracker setup', description: 'Implement lightweight GRC tracking system', included: true },
      { id: 'grc-workflow', name: 'Remediation workflow design', description: 'Design and document remediation workflows', included: true },
      { id: 'grc-reporting', name: 'Compliance reporting templates', description: 'Create templates for compliance reporting', included: false },
      { id: 'grc-training', name: 'Team training on GRC processes', description: 'Train team on GRC processes and tools', included: false },
      { id: 'grc-audit', name: 'Audit readiness assessment', description: 'Assess and prepare for compliance audits', included: false }
    ]
  },
  {
    id: 'security-solutioning',
    name: 'Security Solutioning & Custom PAR Tools',
    description: 'Build custom PAR (Privileged Access Report) tools, security dashboards, or specialized monitoring solutions.',
    category: 'Security Solutioning',
    estimatedHours: 60,
    supportedTools: [
      tools.find(t => t.id === 'par-tool')!,
      tools.find(t => t.id === 'shield')!,
      tools.find(t => t.id === 'security-center')!
    ],
    complianceFrameworks: [
      complianceFrameworks.find(f => f.id === 'nist-800-53')!,
      complianceFrameworks.find(f => f.id === 'cis-controls')!,
      complianceFrameworks.find(f => f.id === 'iso-27001')!
    ],
    tiers: serviceTiers,
    lineItems: [
      { id: 'solution-requirements', name: 'Requirements gathering & design', description: 'Gather requirements and design custom solution', included: true },
      { id: 'solution-development', name: 'Custom tool development', description: 'Develop custom security tools and solutions', included: true },
      { id: 'solution-integration', name: 'Salesforce integration & deployment', description: 'Integrate and deploy solution in Salesforce', included: true },
      { id: 'solution-testing', name: 'Testing & validation', description: 'Comprehensive testing and validation of solution', included: false },
      { id: 'solution-documentation', name: 'Documentation & user guides', description: 'Create comprehensive documentation and user guides', included: false },
      { id: 'solution-training', name: 'User training & handover', description: 'Train users and provide solution handover', included: false }
    ]
  },
  {
    id: 'backup-recovery-dr',
    name: 'Backup & Recovery – DR Testing',
    description: 'Quarterly or annual disaster recovery testing, including full restore validation and business continuity planning.',
    category: 'Backup & Recovery',
    estimatedHours: 24,
    supportedTools: [
      tools.find(t => t.id === 'ownbackup')!,
      tools.find(t => t.id === 'gearset')!,
      tools.find(t => t.id === 'autorabit')!,
      tools.find(t => t.id === 'odaseva')!
    ],
    complianceFrameworks: [
      complianceFrameworks.find(f => f.id === 'iso-27001')!,
      complianceFrameworks.find(f => f.id === 'soc2')!,
      complianceFrameworks.find(f => f.id === 'hipaa')!,
      complianceFrameworks.find(f => f.id === 'pci-dss')!
    ],
    tiers: serviceTiers,
    lineItems: [
      { id: 'dr-planning', name: 'DR test planning & scheduling', description: 'Plan and schedule disaster recovery tests', included: true },
      { id: 'dr-execution', name: 'Full restore test execution', description: 'Execute comprehensive restore testing', included: true },
      { id: 'dr-validation', name: 'Data integrity validation', description: 'Validate data integrity after restore', included: true },
      { id: 'dr-reporting', name: 'DR test report & recommendations', description: 'Provide detailed test report with recommendations', included: false },
      { id: 'dr-improvement', name: 'Recovery process improvement', description: 'Identify and implement process improvements', included: false },
      { id: 'dr-automation', name: 'Automated DR testing setup', description: 'Configure automated disaster recovery testing', included: false }
    ]
  },
  {
    id: 'monitoring-retainer',
    name: 'Ongoing Security Monitoring & Retainer',
    description: 'Monthly security posture reviews, tool maintenance, new threat monitoring, and ongoing consulting support.',
    category: 'Monitoring & Retainer',
    estimatedHours: 16,
    supportedTools: [
      tools.find(t => t.id === 'security-center')!,
      tools.find(t => t.id === 'appomni')!,
      tools.find(t => t.id === 'shield')!,
      tools.find(t => t.id === 'vanta')!
    ],
    complianceFrameworks: [
      complianceFrameworks.find(f => f.id === 'nist-csf')!,
      complianceFrameworks.find(f => f.id === 'cis-controls')!,
      complianceFrameworks.find(f => f.id === 'soc2')!
    ],
    tiers: serviceTiers,
    lineItems: [
      { id: 'monitor-review', name: 'Monthly security posture review', description: 'Conduct monthly security posture assessments', included: true },
      { id: 'monitor-maintenance', name: 'Security tool maintenance', description: 'Maintain and update security tools', included: true },
      { id: 'monitor-threats', name: 'New threat monitoring & alerts', description: 'Monitor for new threats and security alerts', included: true },
      { id: 'monitor-consulting', name: 'Ongoing consulting support', description: 'Provide ongoing security consulting support', included: false },
      { id: 'monitor-reporting', name: 'Monthly security reports', description: 'Provide monthly security status reports', included: false },
      { id: 'monitor-emergency', name: 'Emergency response support', description: 'Provide emergency security incident response', included: false }
    ]
  }
];
