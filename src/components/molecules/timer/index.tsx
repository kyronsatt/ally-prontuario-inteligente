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
          <div className="absolute inset-0 animate-wave rounded-full border-2 border-white opacity-70" />
          <div className="absolute inset-1 animate-wave-slower rounded-full border-2 border-white opacity-50" />
          <div className="absolute inset-2 animate-wave-slowest rounded-full border-2 border-white opacity-30" />
        </>
      ) : (
        <div className="absolute inset-0 rounded-full border-2 border-gray-400 opacity-30" />
      )}

      {/* Timer Circle */}
      <div className="relative z-10 w-72 h-72 border-4 outline-4 outline-offset-[5px] outline-double outline-white/50 border-white rounded-full flex flex-col items-center justify-center shadow-inner shadow-ally-blue">
        <span className="text-white text-5xl font-bold">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
};

export default Timer;
