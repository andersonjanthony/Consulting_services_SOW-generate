import { useState } from 'react';
import { Plus, Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Service, ServiceFilters } from '@/types';
import { complianceFrameworks, tools } from '@/lib/services-data';

interface ServiceCatalogProps {
  services: Service[];
  filters: ServiceFilters;
  onFiltersChange: (filters: ServiceFilters) => void;
  onAddService: (serviceId: string) => void;
  configuredServiceIds: string[];
}

export function ServiceCatalog({
  services,
  filters,
  onFiltersChange,
  onAddService,
  configuredServiceIds
}: ServiceCatalogProps) {
  const [addingServiceId, setAddingServiceId] = useState<string | null>(null);

  const handleAddService = async (serviceId: string) => {
    setAddingServiceId(serviceId);
    onAddService(serviceId);
    
    // Reset after animation
    setTimeout(() => {
      setAddingServiceId(null);
    }, 2000);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Backup & Recovery': 'bg-blue-100 text-blue-800',
      'Assessments': 'bg-purple-100 text-purple-800',
      'Posture Hardening': 'bg-green-100 text-green-800',
      'GRC & Compliance': 'bg-yellow-100 text-yellow-800',
      'Security Solutioning': 'bg-red-100 text-red-800',
      'Monitoring & Retainer': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search services, descriptions, tools..."
                value={filters.search}
                onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {/* Category Filter */}
            <Select 
              value={filters.category} 
              onValueChange={(value) => onFiltersChange({ ...filters, category: value as any })}
            >
              <SelectTrigger className="w-auto min-w-[160px]" data-testid="select-category">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Categories">All Categories</SelectItem>
                <SelectItem value="Backup & Recovery">Backup & Recovery</SelectItem>
                <SelectItem value="Posture Hardening">Posture Hardening</SelectItem>
                <SelectItem value="Assessments">Assessments</SelectItem>
                <SelectItem value="GRC & Compliance">GRC & Compliance</SelectItem>
                <SelectItem value="Security Solutioning">Security Solutioning</SelectItem>
                <SelectItem value="Monitoring & Retainer">Monitoring & Retainer</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Framework Filter */}
            <Select 
              value={filters.framework} 
              onValueChange={(value) => onFiltersChange({ ...filters, framework: value })}
            >
              <SelectTrigger className="w-auto min-w-[160px]" data-testid="select-framework">
                <SelectValue placeholder="All Frameworks" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Frameworks">All Frameworks</SelectItem>
                {complianceFrameworks.map(framework => (
                  <SelectItem key={framework.id} value={framework.id}>
                    {framework.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Tool Filter */}
            <Select 
              value={filters.tool} 
              onValueChange={(value) => onFiltersChange({ ...filters, tool: value })}
            >
              <SelectTrigger className="w-auto min-w-[160px]" data-testid="select-tool">
                <SelectValue placeholder="All Tools" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Tools">All Tools</SelectItem>
                {tools.map(tool => (
                  <SelectItem key={tool.id} value={tool.id}>
                    {tool.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Service Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {services.map(service => {
          const isConfigured = configuredServiceIds.includes(service.id);
          const isAdding = addingServiceId === service.id;
          
          return (
            <div 
              key={service.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              data-testid={`card-service-${service.id}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getCategoryColor(service.category)}`}>
                      {service.category}
                    </span>
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                      {service.estimatedHours}h estimated
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2" data-testid={`text-service-name-${service.id}`}>
                    {service.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div>
                  <h4 className="text-xs font-medium text-gray-700 mb-1">SUPPORTED TOOLS</h4>
                  <div className="flex flex-wrap gap-1">
                    {service.supportedTools.map(tool => (
                      <span key={tool.id} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                        {tool.name}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-gray-700 mb-1">COMPLIANCE FRAMEWORKS</h4>
                  <div className="flex flex-wrap gap-1">
                    {service.complianceFrameworks.map(framework => (
                      <span key={framework.id} className="bg-secondary/10 text-secondary text-xs px-2 py-1 rounded">
                        {framework.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <Button
                onClick={() => handleAddService(service.id)}
                disabled={isConfigured || isAdding}
                className={`w-full transition-colors ${
                  isConfigured 
                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                    : isAdding
                    ? 'bg-green-600 text-white'
                    : 'bg-primary text-white hover:bg-primary/90'
                }`}
                data-testid={`button-add-service-${service.id}`}
              >
                {isConfigured ? (
                  <>
                    <span>Already Added</span>
                  </>
                ) : isAdding ? (
                  <>
                    <span>Added!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    <span>Add to Configuration</span>
                  </>
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
