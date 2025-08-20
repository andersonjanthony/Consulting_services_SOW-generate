import { Clock, FileText, ShieldCheck, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  totalEffort: number;
  onGenerateSOW: () => void;
}

export function Header({ totalEffort, onGenerateSOW }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">CloudStrategik</h1>
              <p className="text-sm text-muted-foreground">Service Offerings Builder</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span data-testid="total-effort">{totalEffort} hours</span>
              <span>estimated</span>
            </div>
            
            <Button 
              onClick={onGenerateSOW}
              className="bg-primary text-white hover:bg-primary/90"
              data-testid="button-generate-sow"
            >
              <FileText className="w-4 h-4 mr-2" />
              Generate SOW
            </Button>
            
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
