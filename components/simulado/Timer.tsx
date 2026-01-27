"use client";

import { useEffect, useState } from "react";
import { Clock, AlertCircle } from "lucide-react";

interface TimerProps {
  initialSeconds: number;
  onTimeUp?: () => void;
  onTick?: (remainingSeconds: number) => void;
}

export default function Timer({ initialSeconds, onTimeUp, onTick }: TimerProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    if (remainingSeconds <= 0) {
      onTimeUp?.();
      return;
    }

    // Ativar aviso quando restarem 5 minutos (300 segundos)
    if (remainingSeconds <= 300 && !isWarning) {
      setIsWarning(true);
    }

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        const newValue = prev - 1;
        onTick?.(newValue);
        
        if (newValue <= 0) {
          clearInterval(interval);
          onTimeUp?.();
          return 0;
        }
        
        return newValue;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingSeconds, onTimeUp, onTick, isWarning]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const getTimeColor = () => {
    if (remainingSeconds <= 60) return "text-red-600";
    if (remainingSeconds <= 300) return "text-yellow-600";
    return "text-primary-deep";
  };

  const getBgColor = () => {
    if (remainingSeconds <= 60) return "bg-red-50 border-red-200";
    if (remainingSeconds <= 300) return "bg-yellow-50 border-yellow-200";
    return "bg-primary-blue/10 border-primary-blue/20";
  };

  return (
    <div
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg border-2 ${getBgColor()} transition-colors`}
    >
      <Clock className={`w-5 h-5 ${getTimeColor()}`} />
      <div className="flex-1">
        <p className="text-xs text-neutral-600 mb-1">Tempo restante</p>
        <p className={`text-2xl font-bold ${getTimeColor()}`}>
          {formatTime(remainingSeconds)}
        </p>
      </div>
      {remainingSeconds <= 300 && (
        <div className="flex items-center space-x-2 text-yellow-600">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm font-medium">
            {remainingSeconds <= 60 ? "Tempo acabando!" : "Menos de 5 minutos"}
          </span>
        </div>
      )}
    </div>
  );
}

