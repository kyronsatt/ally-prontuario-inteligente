
import { useState, useEffect } from 'react';

interface UseTimerProps {
  duration: number;
  isPaused: boolean;
}

export const useTimer = ({ duration, isPaused }: UseTimerProps) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formattedTime = formatTime(duration);
  
  return { formattedTime };
};
