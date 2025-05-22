import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { twMerge } from "tailwind-merge";

interface AppHeaderProps {
  title?: string;
  description?: string;
  hideBackButton?: boolean;
  backButtonText?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  description,
  hideBackButton = false,
  backButtonText = "Voltar",
}) => {
  return (
    <div className="mb-10">
      <div
        className={twMerge(
          "flex items-center w-full mb-10",
          hideBackButton ? "justify-end" : "justify-between"
        )}
      >
        {!hideBackButton && (
          <Button
            variant="ghost"
            className="w-fit text-ally-dark/70"
            onClick={() => window.history.back()}
            aria-label="Voltar"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="hidden sm:block">{backButtonText}</span>
          </Button>
        )}
        <SidebarTrigger className="sm:hidden" />
      </div>
      <div className={hideBackButton ? "pl-0" : "pl-2"}>
        {title && (
          <h1 className="text-6xl whitespace-pre-wrap max-w-[90%] font-semibold mb-2 gradient-text">
            {title}
          </h1>
        )}
        {description && (
          <p className="text-sm lg:text-md text-ally-gray">{description}</p>
        )}
      </div>
    </div>
  );
};
