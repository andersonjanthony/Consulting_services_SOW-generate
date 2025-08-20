import { useState, useEffect, useCallback } from 'react';
import { ConfiguredService, ServiceFilters, ServicePackage, ClientInfo, OrganizationSettings } from '@/types';
import { LocalStorageService } from '@/lib/storage';
import { services, tools, complianceFrameworks } from '@/lib/services-data';
import { useToast } from '@/hooks/use-toast';

export function useServiceBuilder() {
  const [configuredServices, setConfiguredServices] = useState<ConfiguredService[]>([]);
  const [filters, setFilters] = useState<ServiceFilters>({
    search: '',
    category: 'All Categories',
    framework: 'All Frameworks',
    tool: 'All Tools'
  });
  const [clientInfo, setClientInfo] = useState<ClientInfo>(LocalStorageService.getClientInfo());
  const [organizationSettings, setOrganizationSettings] = useState<OrganizationSettings>(
    LocalStorageService.getOrganizationSettings()
  );
  const { toast } = useToast();

  // Load configured services on mount
  useEffect(() => {
    setConfiguredServices(LocalStorageService.getCurrentPackage());
  }, []);

  // Save configured services whenever they change
  useEffect(() => {
    LocalStorageService.saveCurrentPackage(configuredServices);
  }, [configuredServices]);

  const addService = useCallback((serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;

    const isAlreadyConfigured = configuredServices.some(cs => cs.serviceId === serviceId);
    if (isAlreadyConfigured) {
      toast({
        title: "Service already added",
        description: "This service is already in your configuration.",
        variant: "destructive"
      });
      return;
    }

    const newConfiguredService: ConfiguredService = {
      serviceId,
      tierId: 'standard',
      selectedTools: service.supportedTools.length > 0 ? [service.supportedTools[0].id] : [],
      selectedFrameworks: service.complianceFrameworks.slice(0, 2).map(f => f.id),
      selectedLineItems: service.lineItems.filter(li => li.included).map(li => li.id),
      customNotes: ''
    };

    setConfiguredServices(prev => [...prev, newConfiguredService]);
    toast({
      title: "Service added",
      description: `${service.name} has been added to your configuration.`
    });
  }, [configuredServices, toast]);

  const updateService = useCallback((serviceId: string, updates: Partial<ConfiguredService>) => {
    setConfiguredServices(prev =>
      prev.map(cs => cs.serviceId === serviceId ? { ...cs, ...updates } : cs)
    );
  }, []);

  const removeService = useCallback((serviceId: string) => {
    setConfiguredServices(prev => prev.filter(cs => cs.serviceId !== serviceId));
    toast({
      title: "Service removed",
      description: "The service has been removed from your configuration."
    });
  }, [toast]);

  const getFilteredServices = useCallback(() => {
    return services.filter(service => {
      const matchesSearch = filters.search === '' ||
        service.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        service.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        service.supportedTools.some(tool => tool.name.toLowerCase().includes(filters.search.toLowerCase()));

      const matchesCategory = filters.category === 'All Categories' || service.category === filters.category;

      const matchesFramework = filters.framework === 'All Frameworks' ||
        service.complianceFrameworks.some(fw => fw.id === filters.framework);

      const matchesTool = filters.tool === 'All Tools' ||
        service.supportedTools.some(tool => tool.id === filters.tool);

      return matchesSearch && matchesCategory && matchesFramework && matchesTool;
    });
  }, [filters]);

  const getTotalEffort = useCallback(() => {
    return configuredServices.reduce((total, cs) => {
      const service = services.find(s => s.id === cs.serviceId);
      if (!service) return total;

      const tier = service.tiers.find(t => t.id === cs.tierId);
      const baseHours = cs.customHours ?? service.estimatedHours;
      const multiplier = tier?.multiplier ?? 1;

      return total + (baseHours * multiplier);
    }, 0);
  }, [configuredServices]);

  const savePackage = useCallback((name: string, description: string) => {
    if (configuredServices.length === 0) {
      toast({
        title: "No services configured",
        description: "Please configure at least one service before saving.",
        variant: "destructive"
      });
      return;
    }

    const packageData: ServicePackage = {
      id: crypto.randomUUID(),
      name,
      description,
      services: configuredServices,
      clientInfo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    LocalStorageService.savePackage(packageData);
    toast({
      title: "Package saved",
      description: `"${name}" has been saved successfully.`
    });
  }, [configuredServices, clientInfo, toast]);

  const loadPackage = useCallback((packageData: ServicePackage) => {
    setConfiguredServices(packageData.services);
    setClientInfo(packageData.clientInfo);
    toast({
      title: "Package loaded",
      description: `"${packageData.name}" has been loaded successfully.`
    });
  }, [toast]);

  const updateClientInfo = useCallback((newClientInfo: ClientInfo) => {
    setClientInfo(newClientInfo);
    LocalStorageService.saveClientInfo(newClientInfo);
  }, []);

  const updateOrganizationSettings = useCallback((newSettings: OrganizationSettings) => {
    setOrganizationSettings(newSettings);
    LocalStorageService.saveOrganizationSettings(newSettings);
    toast({
      title: "Settings saved",
      description: "Organization settings have been updated successfully."
    });
  }, [toast]);

  return {
    // State
    configuredServices,
    filters,
    clientInfo,
    organizationSettings,

    // Actions
    addService,
    updateService,
    removeService,
    setFilters,
    savePackage,
    loadPackage,
    updateClientInfo,
    updateOrganizationSettings,

    // Computed values
    filteredServices: getFilteredServices(),
    totalEffort: getTotalEffort(),

    // Data
    services,
    tools,
    complianceFrameworks
  };
}
