
import { toast as sonnerToast } from "sonner";
import { useToast } from "@/hooks/use-toast";

export const useStandardizedToast = () => {
  const { toast: radixToast } = useToast();

  const createToastFn = (
    toastFn: typeof sonnerToast.success | typeof sonnerToast.error | typeof sonnerToast.info | typeof sonnerToast.warning | typeof sonnerToast,
    radixVariant: "default" | "destructive" = "default"
  ) => {
    return (description: string, title?: string) => {
      // Use Sonner for toast notifications
      toastFn(title || "", {
        description: description,
      });

      // Fallback to Radix Toast if Sonner is not available
      if (radixToast) {
        radixToast({
          title: title,
          description: description,
          variant: radixVariant,
        });
      }
    };
  };

  // Create standardized toast functions
  return {
    default: createToastFn(sonnerToast),
    success: createToastFn(sonnerToast.success),
    error: createToastFn(sonnerToast.error),
    info: createToastFn(sonnerToast.info),
    warning: createToastFn(sonnerToast.warning),
  };
};

// Export as a convenient singleton with proper function methods
export const toast = {
  success: (description: string, title?: string) =>
    sonnerToast.success(title || "", { description }),
  error: (description: string, title?: string) =>
    sonnerToast.error(title || "", { description }),
  info: (description: string, title?: string) =>
    sonnerToast.info(title || "", { description }),
  warning: (description: string, title?: string) =>
    sonnerToast.warning(title || "", { description }),
  default: (description: string, title?: string) =>
    sonnerToast(title || "", { description }),
};
