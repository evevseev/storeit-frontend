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
    <html lang="ru" className="dark">
      <body className="bg-black overflow-x-hidden">
        <Providers>
          <div className="min-h-screen w-full overflow-x-hidden">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
