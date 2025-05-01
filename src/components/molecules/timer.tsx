import React from "react";
import { Clock } from "lucide-react";

interface TimerProps {
  duration: number;
}

const Timer: React.FC<TimerProps> = ({ duration }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="bg-white/20 px-4 py-3 rounded-lg backdrop-blur-md">
      <div className="flex items-center space-x-2">
        <Clock className="h-5 w-5 text-white" />
        <span className="text-xl font-bold text-white">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
};

export default Timer;
