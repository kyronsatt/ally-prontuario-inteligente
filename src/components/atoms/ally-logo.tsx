import { cn } from "@/lib/utils";

export function AllyLogo({ className }: { className?: string }) {
  return (
    <img
      src="/assets/logo/ally-logo-completa.svg"
      className={cn("h-10", className)}
    />
  );
}
