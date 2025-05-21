
import React from "react";
import { RecordingStatus } from "@/context/TranscriptionContext";
import ListeningControls from "@/components/molecules/listening-controls";

interface ListeningControlsContainerProps {
  recordingStatus: RecordingStatus;
  onTogglePause: () => void;
  onFinish: () => void;
}

const ListeningControlsContainer: React.FC<ListeningControlsContainerProps> = (props) => {
  return <ListeningControls {...props} />;
};

export default ListeningControlsContainer;
