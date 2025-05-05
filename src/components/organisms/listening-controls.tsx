import React from "react";
import { Mic, PauseCircle } from "lucide-react";

import { RecordingStatus } from "@/context/TranscriptionContext";

import { Button } from "../ui/button";

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
    <div className="flex space-x-4">
      <Button
        onClick={onTogglePause}
        className={`px-6 py-6 rounded-full ${
          isPaused
            ? "bg-white text-ally-blue hover:bg-white/90"
            : "bg-white/20 text-white border border-white/50 hover:bg-white/30"
        }`}
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

      <Button
        onClick={onFinish}
        className="bg-white text-ally-blue hover:bg-white/90 px-6 py-6 rounded-full"
        size="lg"
        variant="outline"
      >
        Finalizar
      </Button>
    </div>
  );
};

export default ListeningControls;
