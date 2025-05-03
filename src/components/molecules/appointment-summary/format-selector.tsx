
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
    <div className="flex">
      <Button
        variant="default"
        className="bg-ally-blue hover:bg-ally-blue/90"
        onClick={() => onSelectFormat("anamnese")}
      >
        <FileText className="mr-2 h-4 w-4" />
        Anamnese Estruturada
      </Button>
    </div>
  );
};

export default FormatSelector;
