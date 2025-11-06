import { Button } from "@/components/ui/button";
import { FileDown, Printer } from "lucide-react";

const PLRLicense = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Print-hidden header with action buttons */}
      <div className="print:hidden bg-card border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">PLR License Agreement</h1>
          <Button onClick={handlePrint} className="gap-2">
            <FileDown className="w-4 h-4" />
            Download as PDF
          </Button>
        </div>
      </div>

      {/* Printable content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-card rounded-lg shadow-lg p-8 print:shadow-none print:p-0">
          {/* Header - appears in print */}
          <div className="text-center mb-8 print:mb-12">
            <h1 className="text-4xl font-bold mb-2 text-primary">PLR License Agreement</h1>
            <p className="text-muted-foreground">Private Label Rights & Personal Use License</p>
            <p className="text-sm text-muted-foreground mt-2">Effective Date: {new Date().toLocaleDateString()}</p>
          </div>

          {/* Introduction */}
          <section className="mb-8 print:mb-10">
            <p className="text-foreground leading-relaxed">
              This License Agreement ("License") governs your use of the Bright Minds Academy Reseller Bundle ("Product"), 
              which includes both digital educational resources and a platform template. By purchasing this Product, you agree 
              to the terms outlined below.
            </p>
          </section>

          {/* Full Resell Rights Section */}
          <section className="mb-8 print:mb-10 print:page-break-inside-avoid">
            <h2 className="text-2xl font-bold mb-4 text-primary border-b pb-2">
              Part 1: Full PLR Rights - Educational Resources
            </h2>
            
            <div className="bg-success/10 border-l-4 border-success p-4 mb-4 print:border-l-2">
              <p className="font-semibold text-success mb-2">✓ FULL RESELL RIGHTS GRANTED</p>
              <p className="text-sm text-muted-foreground">
                All downloadable educational content from Google Drive folder
              </p>
            </div>

            <h3 className="text-xl font-semibold mb-3 mt-6">You MAY:</h3>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start">
                <span className="text-success mr-2 mt-1">✓</span>
                <span><strong>Resell</strong> all educational resources (worksheets, templates, activities) for any price</span>
              </li>
              <li className="flex items-start">
                <span className="text-success mr-2 mt-1">✓</span>
                <span><strong>Give away</strong> resources as free downloads, bonuses, or lead magnets</span>
              </li>
              <li className="flex items-start">
                <span className="text-success mr-2 mt-1">✓</span>
                <span><strong>Include in courses</strong> or membership sites you create</span>
              </li>
              <li className="flex items-start">
                <span className="text-success mr-2 mt-1">✓</span>
                <span><strong>Bundle with other products</strong> or include in product packages</span>
              </li>
              <li className="flex items-start">
                <span className="text-success mr-2 mt-1">✓</span>
                <span><strong>Edit, modify, and rebrand</strong> all educational content</span>
              </li>
              <li className="flex items-start">
                <span className="text-success mr-2 mt-1">✓</span>
                <span><strong>Sell with or without PLR rights</strong> to your customers</span>
              </li>
              <li className="flex items-start">
                <span className="text-success mr-2 mt-1">✓</span>
                <span><strong>Print physical copies</strong> and sell or distribute them</span>
              </li>
              <li className="flex items-start">
                <span className="text-success mr-2 mt-1">✓</span>
                <span><strong>Use for client projects</strong> (teachers, educators, businesses)</span>
              </li>
              <li className="flex items-start">
                <span className="text-success mr-2 mt-1">✓</span>
                <span><strong>Translate</strong> into other languages and sell</span>
              </li>
              <li className="flex items-start">
                <span className="text-success mr-2 mt-1">✓</span>
                <span><strong>Claim authorship</strong> of modified versions</span>
              </li>
            </ul>
          </section>

          {/* Personal Use License Section */}
          <section className="mb-8 print:mb-10 print:page-break-inside-avoid">
            <h2 className="text-2xl font-bold mb-4 text-primary border-b pb-2">
              Part 2: Personal Use License - Platform Template
            </h2>
            
            <div className="bg-primary/10 border-l-4 border-primary p-4 mb-4 print:border-l-2">
              <p className="font-semibold text-primary mb-2">⚡ PERSONAL USE LICENSE</p>
              <p className="text-sm text-muted-foreground">
                Lovable platform template and source code
              </p>
            </div>

            <h3 className="text-xl font-semibold mb-3 mt-6">You MAY:</h3>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start">
                <span className="text-success mr-2 mt-1">✓</span>
                <span><strong>Use the platform template</strong> to run your own educational business</span>
              </li>
              <li className="flex items-start">
                <span className="text-success mr-2 mt-1">✓</span>
                <span><strong>Customize and rebrand</strong> the platform with your own name, logo, and colors</span>
              </li>
              <li className="flex items-start">
                <span className="text-success mr-2 mt-1">✓</span>
                <span><strong>Charge users</strong> for access to your platform</span>
              </li>
              <li className="flex items-start">
                <span className="text-success mr-2 mt-1">✓</span>
                <span><strong>Modify the code</strong> to add features or customize functionality</span>
              </li>
              <li className="flex items-start">
                <span className="text-success mr-2 mt-1">✓</span>
                <span><strong>Add your own content</strong> including lessons, worksheets, and activities</span>
              </li>
              <li className="flex items-start">
                <span className="text-success mr-2 mt-1">✓</span>
                <span><strong>Deploy on your own domain</strong> with your branding</span>
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6 text-destructive">You MAY NOT:</h3>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start">
                <span className="text-destructive mr-2 mt-1">✗</span>
                <span><strong>Resell the platform template</strong> or source code to others</span>
              </li>
              <li className="flex items-start">
                <span className="text-destructive mr-2 mt-1">✗</span>
                <span><strong>Give away the Lovable project files</strong> or share the template link</span>
              </li>
              <li className="flex items-start">
                <span className="text-destructive mr-2 mt-1">✗</span>
                <span><strong>Create competing template marketplaces</strong> using this template</span>
              </li>
              <li className="flex items-start">
                <span className="text-destructive mr-2 mt-1">✗</span>
                <span><strong>Share your Lovable login credentials</strong> or project access</span>
              </li>
              <li className="flex items-start">
                <span className="text-destructive mr-2 mt-1">✗</span>
                <span><strong>Claim ownership</strong> of the original template design or code</span>
              </li>
              <li className="flex items-start">
                <span className="text-destructive mr-2 mt-1">✗</span>
                <span><strong>Remove copyright notices</strong> from the source code</span>
              </li>
              <li className="flex items-start">
                <span className="text-destructive mr-2 mt-1">✗</span>
                <span><strong>Trademark "Bright Minds Academy"</strong> or claim it as your exclusive brand</span>
              </li>
            </ul>
          </section>

          {/* Important Terms */}
          <section className="mb-8 print:mb-10 print:page-break-inside-avoid">
            <h2 className="text-2xl font-bold mb-4 text-primary border-b pb-2">
              Important Terms & Conditions
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">📌 Single-User License</h3>
                <p className="text-muted-foreground">
                  This license is for a single business entity or individual. If you want to use the template for multiple 
                  separate businesses, you need separate licenses for each.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">💰 Third-Party Costs</h3>
                <p className="text-muted-foreground">
                  While the educational resources have no ongoing costs, the Lovable platform requires:
                </p>
                <ul className="list-disc list-inside ml-4 mt-2 text-muted-foreground">
                  <li>Lovable hosting subscription (free tier available)</li>
                  <li>Optional: Custom domain registration</li>
                  <li>Optional: AI usage beyond free tier limits</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">🛟 Support Boundaries</h3>
                <p className="text-muted-foreground mb-2">
                  <strong>Template Seller Provides:</strong> Setup guidance, template documentation, access to resources
                </p>
                <p className="text-muted-foreground">
                  <strong>Lovable Provides:</strong> Platform technical support, hosting, infrastructure
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">🔄 Refund Policy</h3>
                <p className="text-muted-foreground">
                  Due to the digital nature of this product, all sales are final. No refunds will be provided after 
                  purchase and delivery of access links.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">⚖️ Liability</h3>
                <p className="text-muted-foreground">
                  This product is provided "as is" without warranty. The seller is not liable for any damages, losses, 
                  or issues arising from the use of this product, including but not limited to technical problems, 
                  lost profits, or business interruptions.
                </p>
              </div>
            </div>
          </section>

          {/* Access Resources Section */}
          <section className="mb-8 print:mb-10 bg-gradient-to-r from-primary/10 to-pink-500/10 p-6 rounded-lg border border-primary/20">
            <h2 className="text-2xl font-bold mb-4 text-primary">📦 Access Your Resources</h2>
            <div className="bg-card p-4 rounded-lg mb-4">
              <h3 className="font-semibold mb-2">Google Drive Folder - Downloadable Content</h3>
              <p className="text-sm text-muted-foreground mb-3">
                All your educational resources with full PLR rights are available in your shared Google Drive folder.
              </p>
              <a 
                href="https://drive.google.com/drive/folders/1GOEDB6ErOi4166UvQcbtcnRRl1dVOKyc?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors print:text-primary print:bg-transparent print:border print:border-primary"
              >
                <FileDown className="w-4 h-4" />
                Access Drive Folder
              </a>
            </div>
          </section>

          {/* Summary */}
          <section className="mb-8 print:mb-10 bg-muted/50 p-6 rounded-lg print:bg-gray-50">
            <h2 className="text-2xl font-bold mb-4 text-primary">Quick Summary</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-success mb-2">✓ Educational Resources (PLR)</h3>
                <p className="text-sm text-muted-foreground">
                  Full resell rights. Sell, modify, bundle, give away, use commercially without restrictions.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-2">⚡ Platform Template (Personal)</h3>
                <p className="text-sm text-muted-foreground">
                  Use for your own business. Customize and rebrand. Cannot resell the template itself.
                </p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <section className="border-t pt-6 mt-8 print:mt-10 print:pt-6">
            <p className="text-sm text-muted-foreground text-center">
              By using this product, you acknowledge that you have read, understood, and agree to be bound by these terms.
            </p>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Questions? Contact support at the email provided in your purchase confirmation.
            </p>
            <p className="text-xs text-muted-foreground text-center mt-4 print:mt-6">
              © {new Date().getFullYear()} Bright Minds Academy Reseller Bundle. All rights reserved.
            </p>
          </section>
        </div>

        {/* Print instructions */}
        <div className="mt-6 text-center text-sm text-muted-foreground print:hidden">
          <p className="flex items-center justify-center gap-2">
            <Printer className="w-4 h-4" />
            Click "Download as PDF" above, then select "Save as PDF" in the print dialog
          </p>
        </div>
      </div>

      {/* Print-specific styles */}
      <style>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          @page {
            margin: 1.5cm;
            size: A4;
          }
        }
      `}</style>
    </div>
  );
};

export default PLRLicense;