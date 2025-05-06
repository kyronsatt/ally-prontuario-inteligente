
import React from "react";
import { Printer, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ActionButtonsProps {
  onPrint: () => void;
  onDownload: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onPrint, onDownload }) => {
  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={onPrint}>
        <Printer className="h-4 w-4 mr-1" /> Imprimir
      </Button>
      <Button variant="outline" onClick={onDownload}>
        <Download className="h-4 w-4 mr-1" /> PDF
      </Button>
    </div>
  );
};

export default ActionButtons;
