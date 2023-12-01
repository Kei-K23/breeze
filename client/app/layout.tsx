import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "@/provider/socket-provider";
import { SheetProvider } from "@/provider/sheet-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Breeze",
  description:
    "Breeze is fast and super reliable chat web-based application that can communicate with everyone and everywhere",
  keywords: [
    "typescript",
    "javascript",
    "mongodb",
    "mongoose",
    "node.js",
    "real-time chat application",
    "websocket",
    "socket",
    "next.js",
  ],
  publisher: "Kei-K",
  creator: "Kei-K",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="breeze-theme"
        >
          <SocketProvider>
            <SheetProvider>{children}</SheetProvider>
            <Toaster />
          </SocketProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
