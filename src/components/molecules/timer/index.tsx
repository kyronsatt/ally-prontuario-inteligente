
import React from "react";
import { useTimer } from "@/hooks/use-timer";
import { cn } from "@/lib/utils";

interface TimerProps {
  duration: number;
  isPaused: boolean;
  className?: string;
}

const Timer: React.FC<TimerProps> = ({ duration, isPaused, className }) => {
  const { formattedTime } = useTimer({ duration, isPaused });

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="bg-white/20 px-16 py-4 rounded-full shadow-lg backdrop-blur-sm border border-white/30">
        <p
          className={cn(
            "font-mono text-4xl font-semibold tracking-wide text-white",
            isPaused ? "opacity-80" : ""
          )}
        >
          {formattedTime}
        </p>
      </div>
      <p className="text-white/80 text-sm mt-2">
        {isPaused ? "Gravação pausada" : "Gravando áudio"}
      </p>
    </div>
  );
};

export default Timer;
