"use client";
import { Toaster } from "@/components/ui/sonner";
import { Geist, Geist_Mono } from "next/font/google";
import { AppSidebar } from "@/components/layout/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { pageMetadataAtom } from "@/components/header/page-header";
import { Providers } from "@/components/layout/providers";
import { useAtomValue } from "jotai";
import React from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function Header() {
  const metadata = useAtomValue(pageMetadataAtom);

  return (
    <header className="flex flex-col gap-2 py-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:py-2">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {(metadata.breadcrumbs || []).map((item, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem
                  key={index}
                  className={index === 0 ? "hidden md:block" : undefined}
                >
                  {item.href ? (
                    <BreadcrumbLink href={item.href}>
                      {item.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {index < metadata.breadcrumbs!.length - 1 && (
                  <BreadcrumbSeparator
                    className={index === 0 ? "hidden md:block" : undefined}
                  />
                )}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="px-4 pt-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          {metadata.title}
        </h1>
        {metadata.actions && (
          <div className="flex items-center gap-2">
            {metadata.actions.map((action, index) => (
              <React.Fragment key={index + 1}>{action}</React.Fragment>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

// This component uses hooks that require the QueryClient
function AuthenticatedContent({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const { isLoading } = useAuth();

  const isLoginPage = /\/login/.test(pathname) || /\/dct/.test(pathname);

  if (isLoading && !isLoginPage) {
    return null; // Show nothing while authentication status is being determined
  }

  if (!isLoginPage) {
    return (
      <>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <main className="px-4 py-6">{children}</main>
        </SidebarInset>
      </>
    );
  }

  return <main className="w-full h-full">{children}</main>;
}

export function RootLayoutContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <Providers>
        <AuthenticatedContent>{children}</AuthenticatedContent>
        <Toaster />
      </Providers>
    </body>
  );
}
