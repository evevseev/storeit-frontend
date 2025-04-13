import type { Metadata } from "next";
import "./globals.css";
import { RootLayoutContent } from "@/components/root-layout";

export const metadata: Metadata = {
  title: "StoreIt",
  description: "File storage application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <RootLayoutContent>{children}</RootLayoutContent>
    </html>
  );
}
