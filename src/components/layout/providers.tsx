"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Provider as JotaiProvider } from "jotai";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
interface ProvidersProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient();
export function Providers({ children }: Readonly<ProvidersProps>) {
  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider>
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="top-right" />
        <SidebarProvider>{children}</SidebarProvider>
      </JotaiProvider>
    </QueryClientProvider>
  );
}
