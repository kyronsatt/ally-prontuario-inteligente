import React from "react";
import "./style.css"; // Import the custom wave animation

interface TimerProps {
  duration: number;
  isPaused: boolean;
}

const Timer: React.FC<TimerProps> = ({ duration, isPaused }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="relative w-fit h-fit flex items-center justify-center">
      {/* Sound wave effect */}
      {!isPaused ? (
        <>
          <div className="absolute inset-0 animate-wave rounded-full border-2 border-cyan-400 opacity-60" />
          <div className="absolute inset-1 animate-wave-slower rounded-full border-2 border-cyan-300 opacity-40" />
          <div className="absolute inset-2 animate-wave-slowest rounded-full border-2 border-cyan-200 opacity-30" />
        </>
      ) : (
        <div className="absolute inset-0 rounded-full border-2 border-gray-400 opacity-30" />
      )}

      {/* Timer Circle */}
      <div className="relative z-10 w-40 h-40 border-2 border-white/70 rounded-full flex flex-col items-center justify-center shadow-inner shadow-ally-blue">
        <span className="text-white text-3xl font-bold">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
};

export default Timer;
