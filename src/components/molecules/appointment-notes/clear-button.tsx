
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ClearButtonProps {
  disabled: boolean;
  onClick: () => void;
}

const ClearButton: React.FC<ClearButtonProps> = ({ disabled, onClick }) => (
  <Button
    variant="outline"
    size="sm"
    disabled={disabled}
    onClick={onClick}
    className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 w-full lg:w-fit"
  >
    <Trash2 className="h-4 w-4 mr-1" />
    Limpar
  </Button>
);

export default ClearButton;
