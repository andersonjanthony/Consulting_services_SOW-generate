import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ConfiguredService } from '@/types';
import { services, tools, complianceFrameworks, serviceTiers } from '@/lib/services-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface ServiceConfigurationProps {
  configuredServices: ConfiguredService[];
  onUpdateService: (serviceId: string, updates: Partial<ConfiguredService>) => void;
  onRemoveService: (serviceId: string) => void;
  onSaveTemplate: (name: string, description: string) => void;
  totalEffort: number;
}

export function ServiceConfiguration({
  configuredServices,
  onUpdateService,
  onRemoveService,
  onSaveTemplate,
  totalEffort
}: ServiceConfigurationProps) {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');

  const handleSaveTemplate = () => {
    if (templateName.trim()) {
      onSaveTemplate(templateName.trim(), templateDescription.trim());
      setTemplateName('');
      setTemplateDescription('');
      setSaveDialogOpen(false);
    }
  };

  if (configuredServices.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Services Configured</h2>
          <p className="text-muted-foreground mb-4">
            Add services from the catalog to start configuring your package.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Service Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {configuredServices.map(configuredService => {
            const service = services.find(s => s.id === configuredService.serviceId);
            if (!service) return null;

            const selectedTier = service.tiers.find(t => t.id === configuredService.tierId);
            const baseHours = configuredService.customHours ?? service.estimatedHours;
            const finalHours = Math.round(baseHours * (selectedTier?.multiplier ?? 1));

            return (
              <div 
                key={configuredService.serviceId} 
                className="border border-gray-200 rounded-lg p-4"
                data-testid={`config-service-${configuredService.serviceId}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">{service.name}</h3>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        data-testid={`button-remove-${configuredService.serviceId}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove Service</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove "{service.name}" from your configuration? 
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => onRemoveService(configuredService.serviceId)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {/* Service Tier */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-1">Service Tier</Label>
                    <Select
                      value={configuredService.tierId}
                      onValueChange={(value) => onUpdateService(configuredService.serviceId, { tierId: value })}
                    >
                      <SelectTrigger data-testid={`select-tier-${configuredService.serviceId}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {service.tiers.map(tier => (
                          <SelectItem key={tier.id} value={tier.id}>
                            {tier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Primary Tool */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-1">Primary Tool</Label>
                    <Select
                      value={configuredService.selectedTools[0] || ''}
                      onValueChange={(value) => onUpdateService(configuredService.serviceId, { 
                        selectedTools: [value, ...configuredService.selectedTools.slice(1)] 
                      })}
                    >
                      <SelectTrigger data-testid={`select-tool-${configuredService.serviceId}`}>
                        <SelectValue placeholder="Select tool" />
                      </SelectTrigger>
                      <SelectContent>
                        {service.supportedTools.map(tool => (
                          <SelectItem key={tool.id} value={tool.id}>
                            {tool.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Effort Override */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-1">
                      Effort (Hours) - Final: {finalHours}h
                    </Label>
                    <Input
                      type="number"
                      value={configuredService.customHours ?? service.estimatedHours}
                      onChange={(e) => {
                        const value = e.target.value === '' ? undefined : Number(e.target.value);
                        onUpdateService(configuredService.serviceId, { customHours: value });
                      }}
                      min={1}
                      data-testid={`input-hours-${configuredService.serviceId}`}
                    />
                  </div>
                </div>
                
                {/* Framework Selection */}
                <div className="mb-4">
                  <Label className="text-sm font-medium text-gray-700 mb-2">Compliance Frameworks</Label>
                  <div className="flex flex-wrap gap-2">
                    {service.complianceFrameworks.map(framework => (
                      <div key={framework.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${configuredService.serviceId}-${framework.id}`}
                          checked={configuredService.selectedFrameworks.includes(framework.id)}
                          onCheckedChange={(checked) => {
                            const updatedFrameworks = checked
                              ? [...configuredService.selectedFrameworks, framework.id]
                              : configuredService.selectedFrameworks.filter(f => f !== framework.id);
                            onUpdateService(configuredService.serviceId, { selectedFrameworks: updatedFrameworks });
                          }}
                          data-testid={`checkbox-framework-${configuredService.serviceId}-${framework.id}`}
                        />
                        <Label 
                          htmlFor={`${configuredService.serviceId}-${framework.id}`}
                          className="text-sm cursor-pointer"
                        >
                          {framework.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Line Items */}
                <div className="mb-4">
                  <Label className="text-sm font-medium text-gray-700 mb-2">Deliverables</Label>
                  <div className="space-y-2">
                    {service.lineItems.map(lineItem => (
                      <div key={lineItem.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${configuredService.serviceId}-${lineItem.id}`}
                          checked={configuredService.selectedLineItems.includes(lineItem.id)}
                          onCheckedChange={(checked) => {
                            const updatedLineItems = checked
                              ? [...configuredService.selectedLineItems, lineItem.id]
                              : configuredService.selectedLineItems.filter(li => li !== lineItem.id);
                            onUpdateService(configuredService.serviceId, { selectedLineItems: updatedLineItems });
                          }}
                          data-testid={`checkbox-deliverable-${configuredService.serviceId}-${lineItem.id}`}
                        />
                        <Label 
                          htmlFor={`${configuredService.serviceId}-${lineItem.id}`}
                          className="text-sm cursor-pointer"
                        >
                          {lineItem.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Custom Notes */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1">Custom Notes</Label>
                  <Textarea
                    value={configuredService.customNotes || ''}
                    onChange={(e) => onUpdateService(configuredService.serviceId, { customNotes: e.target.value })}
                    placeholder="Additional scope notes or customizations..."
                    rows={2}
                    data-testid={`textarea-notes-${configuredService.serviceId}`}
                  />
                </div>
              </div>
            );
          })}
          
          <div className="pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-medium text-gray-900">Package Summary</h3>
                <p className="text-sm text-muted-foreground">
                  {configuredServices.length} services configured, {Math.round(totalEffort)} hours estimated
                </p>
              </div>
              <div className="flex gap-3">
                <AlertDialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" data-testid="button-save-template">
                      Save as Template
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Save Package Template</AlertDialogTitle>
                      <AlertDialogDescription>
                        Save your current configuration as a reusable template.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="template-name">Template Name</Label>
                        <Input
                          id="template-name"
                          value={templateName}
                          onChange={(e) => setTemplateName(e.target.value)}
                          placeholder="Enter template name..."
                          data-testid="input-template-name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="template-description">Description (Optional)</Label>
                        <Textarea
                          id="template-description"
                          value={templateDescription}
                          onChange={(e) => setTemplateDescription(e.target.value)}
                          placeholder="Describe this template..."
                          rows={3}
                          data-testid="textarea-template-description"
                        />
                      </div>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleSaveTemplate}
                        disabled={!templateName.trim()}
                        data-testid="button-confirm-save-template"
                      >
                        Save Template
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
