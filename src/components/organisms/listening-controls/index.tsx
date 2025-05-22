import React from "react";

import ListeningControls from "@/components/molecules/listening-controls";
import { RecordingStatus } from "@/context/RecorderContext";

interface ListeningControlsContainerProps {
  recordingStatus: RecordingStatus;
  onTogglePause: () => void;
  onFinish: () => void;
}

const ListeningControlsContainer: React.FC<ListeningControlsContainerProps> = (
  props
) => {
  return <ListeningControls {...props} />;
};

export default ListeningControlsContainer;
