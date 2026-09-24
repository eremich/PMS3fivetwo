import type { Metadata } from "next";
import Script from "next/script";
import { Geist_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import { AppDataProvider } from "@/lib/app-context";
import { AppShell } from "@/components/app-shell";
import { themeInitScript } from "@/lib/theme";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "New Malden Diagnostic Centre — Patient Management",
  description: "Staff dashboard for referrals, bookings, and results tracking.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <AppDataProvider>
          <AppShell>{children}</AppShell>
        </AppDataProvider>
      </body>
    </html>
  );
}
