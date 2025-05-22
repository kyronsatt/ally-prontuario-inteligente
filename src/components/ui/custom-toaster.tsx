import { Toaster } from "sonner";

export function CustomToaster() {
  return (
    <Toaster
      position="bottom-right"
      duration={5000}
      visibleToasts={3}
      expand
      richColors
      offset={32}
      mobileOffset={16}
    />
  );
}
