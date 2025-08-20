import { useState, useEffect } from 'react';
import { Upload, Edit2, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ServicePackage, ClientInfo } from '@/types';
import { LocalStorageService } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { services } from '@/lib/services-data';

interface PackageManagementProps {
  clientInfo: ClientInfo;
  onUpdateClientInfo: (clientInfo: ClientInfo) => void;
  onLoadPackage: (packageData: ServicePackage) => void;
}

export function PackageManagement({ 
  clientInfo, 
  onUpdateClientInfo, 
  onLoadPackage 
}: PackageManagementProps) {
  const [savedPackages, setSavedPackages] = useState<ServicePackage[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setSavedPackages(LocalStorageService.getPackages());
  }, []);

  const handleDeletePackage = (packageId: string) => {
    LocalStorageService.deletePackage(packageId);
    setSavedPackages(LocalStorageService.getPackages());
    toast({
      title: "Package deleted",
      description: "The package has been deleted successfully."
    });
  };

  const handleLoadPackage = (packageData: ServicePackage) => {
    onLoadPackage(packageData);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleClientInfoChange = (field: keyof ClientInfo, value: string) => {
    onUpdateClientInfo({ ...clientInfo, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Client Information */}
      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1">Client Name</Label>
              <Input
                value={clientInfo.name}
                onChange={(e) => handleClientInfoChange('name', e.target.value)}
                placeholder="Enter client name..."
                data-testid="input-client-name"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1">Primary Stakeholder</Label>
              <Input
                value={clientInfo.stakeholder}
                onChange={(e) => handleClientInfoChange('stakeholder', e.target.value)}
                placeholder="e.g., John Smith, CISO"
                data-testid="input-primary-stakeholder"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1">Start Date</Label>
              <Input
                type="date"
                value={clientInfo.startDate}
                onChange={(e) => handleClientInfoChange('startDate', e.target.value)}
                data-testid="input-start-date"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1">Timezone</Label>
              <Select 
                value={clientInfo.timezone} 
                onValueChange={(value) => handleClientInfoChange('timezone', value)}
              >
                <SelectTrigger data-testid="select-timezone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Chicago">America/Chicago (CST)</SelectItem>
                  <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                  <SelectItem value="America/Los_Angeles">America/Los_Angeles (PST)</SelectItem>
                  <SelectItem value="America/Denver">America/Denver (MST)</SelectItem>
                  <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                  <SelectItem value="Europe/Paris">Europe/Paris (CET)</SelectItem>
                  <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
                  <SelectItem value="Australia/Sydney">Australia/Sydney (AEDT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1">Email (Optional)</Label>
              <Input
                type="email"
                value={clientInfo.email || ''}
                onChange={(e) => handleClientInfoChange('email', e.target.value)}
                placeholder="client@company.com"
                data-testid="input-client-email"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1">Phone (Optional)</Label>
              <Input
                type="tel"
                value={clientInfo.phone || ''}
                onChange={(e) => handleClientInfoChange('phone', e.target.value)}
                placeholder="(555) 123-4567"
                data-testid="input-client-phone"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Saved Packages */}
      <Card>
        <CardHeader>
          <CardTitle>Saved Packages</CardTitle>
        </CardHeader>
        <CardContent>
          {savedPackages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No saved packages yet.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Configure services and save them as templates for future use.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedPackages.map(packageData => (
                <div 
                  key={packageData.id} 
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  data-testid={`package-${packageData.id}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1" data-testid={`text-package-name-${packageData.id}`}>
                        {packageData.name}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">{packageData.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-600">
                        <span>{packageData.services.length} services</span>
                        <span>
                          {packageData.services.reduce((total, service) => {
                            const serviceData = services.find(s => s.id === service.serviceId);
                            if (!serviceData) return total;
                            const baseHours = service.customHours ?? serviceData.estimatedHours;
                            const tier = serviceData.tiers.find(t => t.id === service.tierId);
                            return total + (baseHours * (tier?.multiplier ?? 1));
                          }, 0).toFixed(0)} hours
                        </span>
                        <span>Created: {formatDate(packageData.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleLoadPackage(packageData)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        data-testid={`button-load-${packageData.id}`}
                      >
                        <Upload className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                            data-testid={`button-delete-${packageData.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Package</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{packageData.name}"? 
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeletePackage(packageData.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
