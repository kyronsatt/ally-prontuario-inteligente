import React from "react";
import { Mic, MicOff, PauseCircle } from "lucide-react";
import { Button } from "../ui/button";

interface ListeningControlsProps {
  isListening: boolean;
  isPaused: boolean;
  onTogglePause: () => void;
  onFinish: () => void;
}

const ListeningControls: React.FC<ListeningControlsProps> = ({
  isListening,
  isPaused,
  onTogglePause,
  onFinish,
}) => {
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
      >
        Finalizar
      </Button>
    </div>
  );
};

export default ListeningControls;
