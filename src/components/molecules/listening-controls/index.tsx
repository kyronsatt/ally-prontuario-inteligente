
import React from "react";
import { RecordingStatus } from "@/context/TranscriptionContext";
import TogglePauseButton from "./toggle-pause-button";
import FinishButton from "./finish-button";

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
    <div className="flex space-x-4 px-2 lg:px-8 w-full justify-between">
      <TogglePauseButton isPaused={isPaused} onClick={onTogglePause} />
      <FinishButton onClick={onFinish} />
    </div>
  );
};

export default ListeningControls;
