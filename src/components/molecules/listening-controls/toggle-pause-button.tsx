
import React from "react";
import { Mic, PauseCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TogglePauseButtonProps {
  isPaused: boolean;
  onClick: () => void;
}

const TogglePauseButton: React.FC<TogglePauseButtonProps> = ({
  isPaused,
  onClick,
}) => (
  <Button
    onClick={onClick}
    className={cn(
      "rounded-full w-full",
      isPaused
        ? "bg-white text-ally-blue hover:bg-white/90"
        : "bg-white/20 text-white border border-white/50 hover:bg-white/30"
    )}
    size="default"
    variant="outline"
  >
    {isPaused ? (
      <div className="flex items-center space-x-2">
        <Mic className="h-5 w-5" />
        <span>Retomar</span>
      </div>
    ) : (
      <div className="flex items-center space-x-2">
        <PauseCircle className="h-5 w-5" />
        <span>Pausar</span>
      </div>
    )}
  </Button>
);

export default TogglePauseButton;
