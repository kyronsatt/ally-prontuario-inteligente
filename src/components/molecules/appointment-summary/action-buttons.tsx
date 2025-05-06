import React from "react";
import { Printer, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onPrint: () => void;
  onDownload: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onPrint,
  onDownload,
}) => {
  return (
    <div className="flex gap-2">
      <Button variant="outline" disabled onClick={onPrint}>
        <Printer className="h-4 w-4 mr-1" /> Imprimir
      </Button>
      <Button variant="outline" disabled onClick={onDownload}>
        <Download className="h-4 w-4 mr-1" /> PDF
      </Button>
    </div>
  );
};

export default ActionButtons;
