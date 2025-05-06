
import React from "react";
import { Mic, PauseCircle } from "lucide-react";
import { RecordingStatus } from "@/context/TranscriptionContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ListeningControlsProps {
  recordingStatus: RecordingStatus;
  onTogglePause: () => void;
  onFinish: () => void;
}

const ListeningControls: React.FC<ListeningControlsProps> = ({
  recordingStatus,
  onTogglePause,
  onFinish,
}) => {
  const isPaused = recordingStatus === "PAUSED";
  
  return (
    <div className="flex space-x-4 px-8 w-full justify-between">
      <TogglePauseButton isPaused={isPaused} onClick={onTogglePause} />
      <FinishButton onClick={onFinish} />
    </div>
  );
};

interface TogglePauseButtonProps {
  isPaused: boolean;
  onClick: () => void;
}

const TogglePauseButton: React.FC<TogglePauseButtonProps> = ({ isPaused, onClick }) => (
  <Button
    onClick={onClick}
    className={cn(
      "px-6 py-6 rounded-full",
      isPaused
        ? "bg-white text-ally-blue hover:bg-white/90"
        : "bg-white/20 text-white border border-white/50 hover:bg-white/30"
    )}
    size="lg"
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

interface FinishButtonProps {
  onClick: () => void;
}

const FinishButton: React.FC<FinishButtonProps> = ({ onClick }) => (
  <Button
    onClick={onClick}
    className="bg-white text-ally-blue hover:bg-white/90 px-6 py-6 rounded-full w-full"
    size="lg"
    variant="outline"
  >
    Finalizar
  </Button>
);

export default ListeningControls;
