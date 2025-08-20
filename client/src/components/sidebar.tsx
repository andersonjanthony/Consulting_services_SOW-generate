import { Building, FileText, Package, Settings, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  packageServicesCount: number;
  totalEffort: number;
}

export function Sidebar({ activeTab, onTabChange, packageServicesCount, totalEffort }: SidebarProps) {
  const tabs = [
    { id: 'catalog', label: 'Service Catalog', icon: ShoppingCart },
    { id: 'configuration', label: 'Configuration', icon: Settings, badge: packageServicesCount },
    { id: 'sow', label: 'SOW Preview', icon: FileText },
    { id: 'packages', label: 'Package Management', icon: Package },
    { id: 'settings', label: 'Organization', icon: Building }
  ];

  return (
    <div className="lg:w-64 flex-shrink-0">
      <nav className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="space-y-1">
          {tabs.map(({ id, label, icon: Icon, badge }) => (
            <Button
              key={id}
              onClick={() => onTabChange(id)}
              variant="ghost"
              className={cn(
                "w-full justify-start space-x-3 px-3 py-2 transition-colors",
                activeTab === id
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "text-gray-700 hover:bg-gray-100"
              )}
              data-testid={`button-tab-${id}`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{label}</span>
              {badge && badge > 0 && (
                <span className="ml-auto bg-accent text-white text-xs px-2 py-0.5 rounded-full">
                  {badge}
                </span>
              )}
            </Button>
          ))}
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="font-medium text-sm text-gray-900 mb-2">Current Package</h4>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Services:</span>
                <span data-testid="text-package-services">{packageServicesCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Effort:</span>
                <span data-testid="text-total-effort">{totalEffort}h</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
