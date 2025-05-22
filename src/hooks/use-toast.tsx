import * as React from "react";
import { toast as sonnerToast } from "sonner";

export type ToastVariant = "default" | "success" | "error" | "warning" | "info";

export interface ToastOptions {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  duration?: number;
}

function showToast(variant: ToastVariant, options: ToastOptions) {
  const { title = "", description = "", action } = options;

  sonnerToast[variant](title, {
    description,
    action,
  });
}

function useToast() {
  return {
    success: (description: string, title?: string) =>
      showToast("success", { title, description }),
    error: (description: string, title?: string) =>
      showToast("error", { title, description }),
    info: (description: string, title?: string) =>
      showToast("info", { title, description }),
    warning: (description: string, title?: string) =>
      showToast("warning", { title, description }),
    default: (description: string, title?: string) =>
      showToast("default", { title, description }),
  };
}

export { useToast };
