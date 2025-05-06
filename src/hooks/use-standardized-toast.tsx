import {
  toast as originalToast,
  useToast as useOriginalToast,
} from "@/hooks/use-toast";
import { Info, Check, X, AlertTriangle } from "lucide-react";
import React from "react";

type ToastType = "success" | "error" | "info" | "warning";
type ToastOptions = {
  title?: string;
  description: string;
  type?: ToastType;
  duration?: number;
};

const getToastIcon = (type: ToastType): JSX.Element => {
  switch (type) {
    case "success":
      return <Check className="h-4 w-4 text-green-600" />;
    case "error":
      return <X className="h-4 w-4 text-red-600" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-amber-600" />;
    case "info":
    default:
      return <Info className="h-4 w-4 text-blue-600" />;
  }
};

export function useStandardizedToast() {
  const originalHook = useOriginalToast();

  const showToast = React.useCallback(
    ({ title, description, type = "info", duration = 4000 }: ToastOptions) => {
      originalToast({
        title: title,
        description: description,
        duration: duration,
        variant: type === "error" ? "destructive" : "default",
        action: (
          <div className="flex items-center justify-center h-full pr-2">
            {getToastIcon(type)}
          </div>
        ),
      });
    },
    []
  );

  return {
    ...originalHook,
    toast: showToast,
    success: (description: string, title?: string) =>
      showToast({ description, title, type: "success" }),
    error: (description: string, title?: string) =>
      showToast({ description, title, type: "error" }),
    info: (description: string, title?: string) =>
      showToast({ description, title, type: "info" }),
    warning: (description: string, title?: string) =>
      showToast({ description, title, type: "warning" }),
  };
}

// Standalone toast functions
export const toast = {
  success: (description: string, title?: string) => {
    originalToast({
      title: title,
      description: description,
      variant: "default",
      action: (
        <div className="flex items-center justify-center h-full pr-2">
          {getToastIcon("success")}
        </div>
      ),
    });
  },
  error: (description: string, title?: string) => {
    originalToast({
      title: title,
      description: description,
      variant: "destructive",
      action: (
        <div className="flex items-center justify-center h-full pr-2">
          {getToastIcon("error")}
        </div>
      ),
    });
  },
  info: (description: string, title?: string) => {
    originalToast({
      title: title,
      description: description,
      variant: "default",
      action: (
        <div className="flex items-center justify-center h-full pr-2">
          {getToastIcon("info")}
        </div>
      ),
    });
  },
  warning: (description: string, title?: string) => {
    originalToast({
      title: title,
      description: description,
      variant: "default",
      action: (
        <div className="flex items-center justify-center h-full pr-2">
          {getToastIcon("warning")}
        </div>
      ),
    });
  },
};
