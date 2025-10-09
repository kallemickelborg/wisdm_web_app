// System Imports
import type { Metadata } from "next";

// API/Database Imports
import { ThemeProvider } from "@/app/_contexts/ThemeContext";
import { WebSocketProvider } from "@/app/_lib/socket/socket";

// Component Imports
import StoreProvider from "./StoreProvider";
import AuthWrapper from "./_components/auth/AuthWrapper";
import { QueryProvider } from "@/app/_lib/query/QueryProvider";

// Stylesheet Imports
import "@/styles/globals.scss";
import "@/styles/main.scss";

// Remove force-dynamic - it's causing unnecessary server requests on every navigation
// export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Wisdm Web App",
  description: "Social media/news app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main>
          <QueryProvider>
            <StoreProvider>
              <ThemeProvider>
                <WebSocketProvider>
                  <AuthWrapper>{children}</AuthWrapper>
                </WebSocketProvider>
              </ThemeProvider>
            </StoreProvider>
          </QueryProvider>
        </main>
      </body>
    </html>
  );
}
