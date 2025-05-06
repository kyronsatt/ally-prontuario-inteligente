import { cn } from "@/lib/utils";

export function AllyLogo({
  className,
  white = false,
}: {
  className?: string;
  white?: boolean;
}) {
  const logoBlueSrc = "/assets/logo/ally-logo-completa-blue.svg";
  const logoWhiteSrc = "/assets/logo/ally-logo-completa-white.svg";
  return (
    <img
      src={white ? logoWhiteSrc : logoBlueSrc}
      className={cn("h-10", className)}
    />
  );
}
