import React from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FormatSelectorProps {
  viewFormat: string;
  onSelectFormat: (format: string) => void;
}

const FormatSelector: React.FC<FormatSelectorProps> = ({
  viewFormat,
  onSelectFormat,
}) => {
  return (
    <div className="flex gap-3">
      <Button
        variant={viewFormat === "soap" ? "default" : "outline"}
        onClick={() => onSelectFormat("soap")}
        className={
          viewFormat === "soap"
            ? "bg-ally-blue hover:bg-ally-blue/90"
            : "border-gray-300"
        }
      >
        <FileText className="mr-2 h-4 w-4" />
        SOAP
      </Button>
      <Button
        variant={viewFormat === "anamnese" ? "default" : "outline"}
        onClick={() => onSelectFormat("anamnese")}
        className={
          viewFormat === "anamnese"
            ? "bg-ally-blue hover:bg-ally-blue/90"
            : "border-gray-300"
        }
      >
        <FileText className="mr-2 h-4 w-4" />
        Anamnese Estruturada
      </Button>
    </div>
  );
};

export default FormatSelector;
