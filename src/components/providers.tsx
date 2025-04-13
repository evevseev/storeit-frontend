import { SidebarProvider } from "@/components/ui/sidebar";
import { Provider as JotaiProvider } from "jotai";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: Readonly<ProvidersProps>) {
  return (
    <JotaiProvider>
      <SidebarProvider>{children}</SidebarProvider>
    </JotaiProvider>
  );
}
