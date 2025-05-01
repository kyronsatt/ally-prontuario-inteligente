import React from "react";
import { Printer, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onPrint: () => void;
  onDownload: () => void;
  onShare: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onPrint,
  onDownload,
  onShare,
}) => {
  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={onPrint}>
        <Printer className="h-4 w-4 mr-1" /> Imprimir
      </Button>
      <Button variant="outline" onClick={onDownload}>
        <Download className="h-4 w-4 mr-1" /> Download
      </Button>
      <Button variant="outline" onClick={onShare}>
        <Share2 className="h-4 w-4 mr-1" /> Compartilhar
      </Button>
    </div>
  );
};

export default ActionButtons;
