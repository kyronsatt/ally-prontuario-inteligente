
import { useToast } from "@/hooks/use-toast";

export interface UseStandardizedToastReturn {
  success: (description?: string, title?: string) => void;
  error: (description?: string, title?: string) => void;
  info: (description?: string, title?: string) => void;
  warning: (description?: string, title?: string) => void;
}

export const useStandardizedToast = (): UseStandardizedToastReturn => {
  const { toast } = useToast();

  const success = (description?: string, title = "Sucesso") => {
    toast({
      title,
      description,
      variant: "default",
    });
  };

  const error = (description?: string, title = "Erro") => {
    toast({
      title,
      description,
      variant: "destructive",
    });
  };

  const info = (description?: string, title = "Informação") => {
    toast({
      title,
      description,
      variant: "default",
    });
  };

  const warning = (description?: string, title = "Atenção") => {
    toast({
      title,
      description,
      variant: "default",
    });
  };

  return {
    success,
    error,
    info,
    warning,
  };
};

export const toast = {
  success: (description?: string, title = "Sucesso") => {
    const { toast } = useToast();
    toast({
      title,
      description,
      variant: "default",
    });
  },
  error: (description?: string, title = "Erro") => {
    const { toast } = useToast();
    toast({
      title,
      description,
      variant: "destructive",
    });
  },
  info: (description?: string, title = "Informação") => {
    const { toast } = useToast();
    toast({
      title,
      description,
      variant: "default",
    });
  },
  warning: (description?: string, title = "Atenção") => {
    const { toast } = useToast();
    toast({
      title,
      description,
      variant: "default",
    });
  },
};
