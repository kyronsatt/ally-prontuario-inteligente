
import React from "react";
import { Printer, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAnalytics } from "@/hooks/use-analytics";

interface ActionButtonsProps {
  onDownload: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onDownload }) => {
  const { trackDownload, trackButtonClick } = useAnalytics();

  const handleDownload = () => {
    trackButtonClick("pdf_download", { source: "appointment_summary" });
    trackDownload("pdf", "appointment_summary.pdf");
    onDownload();
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={handleDownload}>
        <Download className="h-4 w-4 mr-1" /> PDF
      </Button>
    </div>
  );
};

export default ActionButtons;
