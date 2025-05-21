
import React from "react";
import { Button } from "@/components/ui/button";

interface FinishButtonProps {
  onClick: () => void;
}

const FinishButton: React.FC<FinishButtonProps> = ({ onClick }) => (
  <Button
    onClick={onClick}
    className="bg-white text-ally-blue hover:bg-white/90 rounded-full w-full"
    size="default"
    variant="outline"
  >
    Finalizar
  </Button>
);

export default FinishButton;
