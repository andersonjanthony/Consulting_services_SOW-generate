import { useState } from 'react';
import { Header } from '@/components/header';
import { Sidebar } from '@/components/sidebar';
import { ServiceCatalog } from '@/components/service-catalog';
import { ServiceConfiguration } from '@/components/service-configuration';
import { SOWPreview } from '@/components/sow-preview';
import { PackageManagement } from '@/components/package-management';
import { OrganizationSettingsComponent } from '@/components/organization-settings';
import { useServiceBuilder } from '@/hooks/use-service-builder';

export default function Home() {
  const [activeTab, setActiveTab] = useState('catalog');
  const {
    configuredServices,
    filters,
    clientInfo,
    organizationSettings,
    addService,
    updateService,
    removeService,
    setFilters,
    savePackage,
    loadPackage,
    updateClientInfo,
    updateOrganizationSettings,
    filteredServices,
    totalEffort
  } = useServiceBuilder();

  const handleGenerateSOW = () => {
    setActiveTab('sow');
  };

  const configuredServiceIds = configuredServices.map(cs => cs.serviceId);

  return (
    <div className="min-h-screen bg-background">
      <Header totalEffort={totalEffort} onGenerateSOW={handleGenerateSOW} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <Sidebar 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            packageServicesCount={configuredServices.length}
            totalEffort={totalEffort}
          />
          
          <div className="flex-1">
            {activeTab === 'catalog' && (
              <ServiceCatalog
                services={filteredServices}
                filters={filters}
                onFiltersChange={setFilters}
                onAddService={addService}
                configuredServiceIds={configuredServiceIds}
              />
            )}
            
            {activeTab === 'configuration' && (
              <ServiceConfiguration
                configuredServices={configuredServices}
                onUpdateService={updateService}
                onRemoveService={removeService}
                onSaveTemplate={savePackage}
                totalEffort={totalEffort}
              />
            )}
            
            {activeTab === 'sow' && (
              <SOWPreview
                configuredServices={configuredServices}
                clientInfo={clientInfo}
                organizationSettings={organizationSettings}
                totalEffort={totalEffort}
              />
            )}
            
            {activeTab === 'packages' && (
              <PackageManagement
                clientInfo={clientInfo}
                onUpdateClientInfo={updateClientInfo}
                onLoadPackage={loadPackage}
              />
            )}
            
            {activeTab === 'settings' && (
              <OrganizationSettingsComponent
                settings={organizationSettings}
                onUpdateSettings={updateOrganizationSettings}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
