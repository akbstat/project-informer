import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ContextProvider } from "@/components/contexts";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { InitColorSchemeScript } from "@mui/material";
import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import ThemeLayout from "@/components/ThemeLayout";
import Chat from "@/components/Chat";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Akeso SP Monthly Meeting",
  description: "Akeso SP Monthly Meeting",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <InitColorSchemeScript attribute="data" />
        <AppRouterCacheProvider>
          <ThemeLayout>
            <ContextProvider >
              <Navbar className="grid grid-cols-18 gap-0" />
              <div className="grid grid-cols-10 gap-1">
                <Menu className="col-span-1" />
                <div className="col-span-9">
                  {children}
                </div>
              </div>
              <Chat />
            </ContextProvider>
          </ThemeLayout>

        </AppRouterCacheProvider>
      </body>
    </html >
  );
}
