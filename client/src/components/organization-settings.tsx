import { useState } from 'react';
import { Save, Download, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { OrganizationSettings } from '@/types';
import { LocalStorageService } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface OrganizationSettingsProps {
  settings: OrganizationSettings;
  onUpdateSettings: (settings: OrganizationSettings) => void;
}

export function OrganizationSettingsComponent({ 
  settings, 
  onUpdateSettings 
}: OrganizationSettingsProps) {
  const [formData, setFormData] = useState<OrganizationSettings>(settings);
  const { toast } = useToast();

  const handleSave = () => {
    onUpdateSettings(formData);
  };

  const handleExportData = () => {
    const data = LocalStorageService.exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cloudstrategik-data-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data exported",
      description: "All your data has been exported successfully."
    });
  };

  const handleClearData = () => {
    LocalStorageService.clearAllData();
    toast({
      title: "Data cleared",
      description: "All local data has been cleared. Please refresh the page."
    });
    
    // Reset to default settings after a delay to allow toast to show
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  const handleInputChange = (field: keyof OrganizationSettings, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(settings);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Organization Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Company Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1">Company Name</Label>
                <Input
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Your company name"
                  data-testid="input-company-name"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1">Consultant Name</Label>
                <Input
                  value={formData.consultantName}
                  onChange={(e) => handleInputChange('consultantName', e.target.value)}
                  placeholder="Your name"
                  data-testid="input-consultant-name"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1">Email</Label>
                <Input
                  type="email"
                  value={formData.consultantEmail}
                  onChange={(e) => handleInputChange('consultantEmail', e.target.value)}
                  placeholder="your.email@company.com"
                  data-testid="input-consultant-email"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1">Phone (Optional)</Label>
                <Input
                  type="tel"
                  value={formData.consultantPhone || ''}
                  onChange={(e) => handleInputChange('consultantPhone', e.target.value)}
                  placeholder="(555) 123-4567"
                  data-testid="input-consultant-phone"
                />
              </div>
              <div className="md:col-span-2">
                <Label className="text-sm font-medium text-gray-700 mb-1">Address</Label>
                <Input
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Your business address"
                  data-testid="input-address"
                />
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-200">
            <Button 
              onClick={handleSave} 
              disabled={!hasChanges}
              className="bg-primary text-white hover:bg-primary/90"
              data-testid="button-save-settings"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Export Data</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Download all your packages, settings, and configurations as a JSON file.
              </p>
              <Button 
                variant="outline" 
                onClick={handleExportData}
                data-testid="button-export-data"
              >
                <Download className="w-4 h-4 mr-2" />
                Export All Data
              </Button>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2 text-red-600" />
                Clear All Data
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                This will permanently delete all your saved packages, configurations, and settings. 
                This action cannot be undone.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="border-red-300 text-red-700 hover:bg-red-50"
                    data-testid="button-clear-data"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Clear All Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center text-red-600">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Clear All Data
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete:
                      <br />• All saved service packages
                      <br />• Current configuration
                      <br />• Client information
                      <br />• Organization settings
                      <br /><br />
                      <strong>This action cannot be undone.</strong> Consider exporting your data first.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleClearData}
                      className="bg-red-600 hover:bg-red-700"
                      data-testid="button-confirm-clear-data"
                    >
                      Clear All Data
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
