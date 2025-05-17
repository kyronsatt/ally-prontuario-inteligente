
import { toast as sonnerToast } from "sonner";
import { useToast } from "@/hooks/use-toast";

export const useStandardizedToast = () => {
  const { toast: radixToast } = useToast();

  // Create standardized toast functions that work with both Sonner and Radix UI
  return {
    success: (description: string, title?: string) => {
      sonnerToast.success(title || "", { description });
      if (radixToast) {
        radixToast({
          title: title,
          description: description,
          variant: "default",
        });
      }
    },
    error: (description: string, title?: string) => {
      sonnerToast.error(title || "", { description });
      if (radixToast) {
        radixToast({
          title: title,
          description: description,
          variant: "destructive",
        });
      }
    },
    info: (description: string, title?: string) => {
      sonnerToast.info(title || "", { description });
      if (radixToast) {
        radixToast({
          title: title,
          description: description,
          variant: "default",
        });
      }
    },
    warning: (description: string, title?: string) => {
      sonnerToast.warning(title || "", { description });
      if (radixToast) {
        radixToast({
          title: title,
          description: description,
          variant: "default",
        });
      }
    },
    default: (description: string, title?: string) => {
      sonnerToast(title || "", { description });
      if (radixToast) {
        radixToast({
          title: title,
          description: description,
          variant: "default",
        });
      }
    }
  };
};
