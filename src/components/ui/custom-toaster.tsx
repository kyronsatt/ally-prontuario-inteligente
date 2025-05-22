import { Toaster } from "sonner";

export function CustomToaster() {
  return (
    <Toaster
      position="bottom-right"
      duration={3000}
      visibleToasts={3}
      expand={false}
      richColors
      offset={32}
      mobileOffset={16}
    />
  );
}
