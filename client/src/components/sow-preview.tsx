import { useState, useRef } from 'react';
import { Copy, Download, FileText, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConfiguredService, ClientInfo, OrganizationSettings } from '@/types';
import { services, tools, complianceFrameworks } from '@/lib/services-data';
import { useToast } from '@/hooks/use-toast';
import { ProfessionalSOWTemplate } from './professional-sow-template';
import html2pdf from 'html2pdf.js';

interface SOWPreviewProps {
  configuredServices: ConfiguredService[];
  clientInfo: ClientInfo;
  organizationSettings: OrganizationSettings;
  totalEffort: number;
}

export function SOWPreview({ 
  configuredServices, 
  clientInfo, 
  organizationSettings, 
  totalEffort 
}: SOWPreviewProps) {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const generateSOWContent = () => {
    const today = new Date().toLocaleDateString();
    const estimatedDuration = Math.ceil(totalEffort / 8); // Assuming 8 hours per day
    const estimatedWeeks = Math.ceil(estimatedDuration / 5); // 5 working days per week

    let sowContent = `# ${organizationSettings.companyName}

**Address:** ${organizationSettings.address}  
**Consultant:** ${organizationSettings.consultantName}  
**Email:** ${organizationSettings.consultantEmail}  
${organizationSettings.consultantPhone ? `**Phone:** ${organizationSettings.consultantPhone}  ` : ''}

---

## Statement of Work
### Salesforce Security Services Package

**Client:** ${clientInfo.name || '<Client Name>'}  
**Primary Stakeholder:** ${clientInfo.stakeholder || '<Primary Stakeholder>'}  
**Start Date:** ${clientInfo.startDate || today}  
**Consultant:** ${organizationSettings.consultantName}  
**Total Effort:** ${Math.round(totalEffort)} hours  
**Estimated Duration:** ${estimatedWeeks}-${estimatedWeeks + 2} weeks  
**Generated:** ${today}  

---

## Service Offerings

`;

    configuredServices.forEach((configuredService, index) => {
      const service = services.find(s => s.id === configuredService.serviceId);
      if (!service) return;

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

      sowContent += `### ${index + 1}. ${service.name} (${finalHours} hours)

${service.description}

**Service Tier:** ${selectedTier?.name || 'Standard'}  
**Primary Tool:** ${primaryTool?.name || 'Not specified'}  
**Compliance Frameworks:** ${selectedFrameworks.map(f => f.name).join(', ') || 'Not specified'}  

**Deliverables:**
${selectedDeliverables.map(d => `- ${d.name}`).join('\n')}

${configuredService.customNotes ? `**Additional Notes:** ${configuredService.customNotes}\n` : ''}
---

`;
    });

    sowContent += `## Terms & Assumptions

- All services will be delivered remotely unless otherwise specified
- Client will provide necessary system access and stakeholder availability  
- Additional scope changes require written approval and may incur additional fees
- All deliverables will be provided in digital format
- Payment terms and rates to be defined in separate contract

---

*This Statement of Work was generated on ${today} using the CloudStrategik Service Offerings Builder.*`;

    return sowContent;
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateSOWContent());
      toast({
        title: "Copied to clipboard",
        description: "SOW content has been copied to your clipboard."
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy SOW to clipboard.",
        variant: "destructive"
      });
    }
  };

  const handleDownloadMarkdown = () => {
    const content = generateSOWContent();
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SOW-${clientInfo.name || 'Client'}-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "SOW markdown file is being downloaded."
    });
  };

  const handleExportJSON = () => {
    const data = {
      configuredServices,
      clientInfo,
      organizationSettings,
      totalEffort,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SOW-Configuration-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export complete",
      description: "Configuration has been exported as JSON."
    });
  };

  const handleExportPDF = async () => {
    if (!pdfRef.current) return;
    
    setIsExporting(true);
    toast({
      title: "Generating PDF",
      description: "Please wait while we create your professional SOW PDF..."
    });

    try {
      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `SOW-${clientInfo.name || 'Client'}-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          letterRendering: true,
          allowTaint: true
        },
        jsPDF: { 
          unit: 'in', 
          format: 'letter', 
          orientation: 'portrait',
          compressPDF: true
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      await html2pdf().set(opt).from(pdfRef.current).save();
      
      toast({
        title: "PDF exported successfully",
        description: "Your professional SOW has been downloaded as a PDF."
      });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: "Export failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (configuredServices.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No SOW to Preview</h2>
            <p className="text-muted-foreground">
              Configure at least one service to generate a Statement of Work.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Statement of Work Preview</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopyToClipboard}
              data-testid="button-copy-sow"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Text
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDownloadMarkdown}
              data-testid="button-download-markdown"
            >
              <Download className="w-4 h-4 mr-2" />
              Markdown
            </Button>
            <Button 
              size="sm" 
              onClick={handleExportPDF}
              disabled={isExporting}
              className="bg-primary text-white hover:bg-primary/90"
              data-testid="button-export-pdf"
            >
              <FileDown className="w-4 h-4 mr-2" />
              {isExporting ? 'Generating...' : 'Export PDF'}
            </Button>
            <Button 
              variant="outline"
              size="sm" 
              onClick={handleExportJSON}
              data-testid="button-export-json"
            >
              <FileText className="w-4 h-4 mr-2" />
              JSON
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview">Professional Preview</TabsTrigger>
            <TabsTrigger value="markdown">Markdown View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="mt-6">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="max-h-[800px] overflow-y-auto">
                <ProfessionalSOWTemplate
                  ref={pdfRef}
                  configuredServices={configuredServices}
                  clientInfo={clientInfo}
                  organizationSettings={organizationSettings}
                  totalEffort={totalEffort}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="markdown" className="mt-6">
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <div className="prose max-w-none text-sm">
                <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-gray-800 bg-white p-4 rounded border overflow-auto max-h-[600px]">
                  {generateSOWContent()}
                </pre>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
