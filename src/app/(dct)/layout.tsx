import type { Metadata } from "next";
import "@/app/globals.css";
import { RootLayoutContent } from "@/components/layout/root-layout";
import { Providers } from "@/components/layout/providers";

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
      <body>
        <Providers>
          <div className="w-full">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
