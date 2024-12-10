import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

import { cn } from "@/lib/utils";
import QueryProvider from "@/providers/query-provider";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Taskup",
  description: "Seu gerenciador de tarefas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(outfit.className, 'antialiased min-h-screen')}
      >
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
