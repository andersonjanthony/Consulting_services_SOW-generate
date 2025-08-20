import { forwardRef } from 'react';
import { ConfiguredService, ClientInfo, OrganizationSettings } from '@/types';
import { services, tools, complianceFrameworks } from '@/lib/services-data';

interface ProfessionalSOWTemplateProps {
  configuredServices: ConfiguredService[];
  clientInfo: ClientInfo;
  organizationSettings: OrganizationSettings;
  totalEffort: number;
}

export const ProfessionalSOWTemplate = forwardRef<HTMLDivElement, ProfessionalSOWTemplateProps>(
  ({ configuredServices, clientInfo, organizationSettings, totalEffort }, ref) => {
    const today = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const estimatedDuration = Math.ceil(totalEffort / 8); // 8 hours per day
    const estimatedWeeks = Math.ceil(estimatedDuration / 5); // 5 working days per week

    return (
      <div ref={ref} className="bg-white text-black p-8 font-serif max-w-4xl mx-auto">
        {/* Header */}
        <header className="border-b-4 border-primary pb-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">
                {organizationSettings.companyName}
              </h1>
              <div className="text-sm text-gray-600 space-y-1">
                <p>{organizationSettings.address}</p>
                <p>
                  <strong>Consultant:</strong> {organizationSettings.consultantName}
                </p>
                <p>
                  <strong>Email:</strong> {organizationSettings.consultantEmail}
                </p>
                {organizationSettings.consultantPhone && (
                  <p>
                    <strong>Phone:</strong> {organizationSettings.consultantPhone}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold text-xl">CS</span>
              </div>
              <p className="text-sm text-gray-500">Generated: {today}</p>
            </div>
          </div>
        </header>

        {/* Title */}
        <section className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Statement of Work
          </h2>
          <h3 className="text-2xl text-primary font-semibold">
            Salesforce Security Services Package
          </h3>
          <div className="w-32 h-1 bg-accent mx-auto mt-4"></div>
        </section>

        {/* Project Overview */}
        <section className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 border-b-2 border-gray-300 pb-2 mb-4">
            Project Overview
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="mb-2">
                <strong>Client:</strong> {clientInfo.name || '<Client Name>'}
              </p>
              <p className="mb-2">
                <strong>Primary Stakeholder:</strong> {clientInfo.stakeholder || '<Primary Stakeholder>'}
              </p>
              <p className="mb-2">
                <strong>Start Date:</strong> {clientInfo.startDate || today}
              </p>
              {clientInfo.timezone && (
                <p className="mb-2">
                  <strong>Timezone:</strong> {clientInfo.timezone}
                </p>
              )}
            </div>
            <div>
              <p className="mb-2">
                <strong>Total Effort:</strong> {Math.round(totalEffort)} hours
              </p>
              <p className="mb-2">
                <strong>Estimated Duration:</strong> {estimatedWeeks}-{estimatedWeeks + 2} weeks
              </p>
              <p className="mb-2">
                <strong>Number of Services:</strong> {configuredServices.length}
              </p>
              <p className="mb-2">
                <strong>Project Type:</strong> Security Consulting
              </p>
            </div>
          </div>
        </section>

        {/* Executive Summary */}
        <section className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 border-b-2 border-gray-300 pb-2 mb-4">
            Executive Summary
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            This Statement of Work outlines a comprehensive Salesforce security services 
            engagement designed to enhance {clientInfo.name || 'your organization'}'s 
            security posture through {configuredServices.length} specialized service{configuredServices.length !== 1 ? 's' : ''}.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Our approach combines industry-leading tools, proven methodologies, and 
            expert consulting to deliver measurable improvements in security governance, 
            risk management, and compliance readiness.
          </p>
        </section>

        {/* Service Offerings */}
        <section className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 border-b-2 border-gray-300 pb-2 mb-6">
            Service Offerings
          </h3>
          
          {configuredServices.map((configuredService, index) => {
            const service = services.find(s => s.id === configuredService.serviceId);
            if (!service) return null;

            const selectedTier = service.tiers.find(t => t.id === configuredService.tierId);
            const baseHours = configuredService.customHours ?? service.estimatedHours;
            const finalHours = Math.round(baseHours * (selectedTier?.multiplier ?? 1));
            
            const primaryTool = tools.find(t => t.id === configuredService.selectedTools[0]);
            const selectedFrameworks = complianceFrameworks.filter(f => 
              configuredService.selectedFrameworks.includes(f.id)
            );
            const selectedDeliverables = service.lineItems.filter(li => 
              configuredService.selectedLineItems.includes(li.id)
            );

            return (
              <div key={service.id} className="mb-8 pb-6 border-b border-gray-200 last:border-b-0">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {index + 1}. {service.name}
                  </h4>
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {finalHours} hours
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {service.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">Service Tier</h5>
                    <p className="text-sm text-gray-600">
                      {selectedTier?.name || 'Standard'}
                    </p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">Primary Tool</h5>
                    <p className="text-sm text-gray-600">
                      {primaryTool?.name || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">Category</h5>
                    <p className="text-sm text-gray-600">
                      {service.category}
                    </p>
                  </div>
                </div>

                {selectedFrameworks.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-semibold text-gray-800 mb-2">Compliance Frameworks</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedFrameworks.map(framework => (
                        <span 
                          key={framework.id} 
                          className="bg-secondary/10 text-secondary px-2 py-1 rounded text-xs"
                        >
                          {framework.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <h5 className="font-semibold text-gray-800 mb-2">Key Deliverables</h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {selectedDeliverables.map(deliverable => (
                      <li key={deliverable.id} className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>{deliverable.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {configuredService.customNotes && (
                  <div className="bg-gray-50 p-4 rounded">
                    <h5 className="font-semibold text-gray-800 mb-2">Additional Notes</h5>
                    <p className="text-sm text-gray-700">{configuredService.customNotes}</p>
                  </div>
                )}
              </div>
            );
          })}
        </section>

        {/* Terms & Conditions */}
        <section className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 border-b-2 border-gray-300 pb-2 mb-4">
            Terms & Assumptions
          </h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start">
              <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>All services will be delivered remotely unless otherwise specified</span>
            </div>
            <div className="flex items-start">
              <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Client will provide necessary system access and stakeholder availability</span>
            </div>
            <div className="flex items-start">
              <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Additional scope changes require written approval and may incur additional fees</span>
            </div>
            <div className="flex items-start">
              <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>All deliverables will be provided in digital format</span>
            </div>
            <div className="flex items-start">
              <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Payment terms and rates to be defined in separate contract</span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t-2 border-gray-300 pt-6 text-center">
          <p className="text-sm text-gray-500 mb-2">
            This Statement of Work was generated on {today} using the CloudStrategik Service Offerings Builder.
          </p>
          <p className="text-sm text-gray-500">
            For questions or modifications, please contact {organizationSettings.consultantName} at {organizationSettings.consultantEmail}
          </p>
        </footer>
      </div>
    );
  }
);

ProfessionalSOWTemplate.displayName = 'ProfessionalSOWTemplate';