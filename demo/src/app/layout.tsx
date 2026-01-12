import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider } from "next-themes";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next Schema Table - Live Demo",
  description:
    "A fully declarative, type-safe React table component built with TanStack Table, Zod, and Next.js",
  keywords: [
    "react",
    "nextjs",
    "table",
    "datatable",
    "tanstack-table",
    "zod",
    "typescript",
    "declarative",
    "type-safe",
  ],
  authors: [{ name: "Next Schema Table" }],
  openGraph: {
    title: "Next Schema Table - Live Demo",
    description: "A fully declarative, type-safe React table component",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NuqsAdapter>{children}</NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}
