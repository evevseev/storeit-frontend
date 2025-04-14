import type { Metadata } from "next";
import "./globals.css";
import { RootLayoutContent } from "@/components/layout/root-layout";

export const metadata: Metadata = {
  title: "StoreIt",
  description: "Adress-based storage system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <RootLayoutContent>{children}</RootLayoutContent>
    </html>
  );
}
