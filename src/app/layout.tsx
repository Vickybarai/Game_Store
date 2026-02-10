import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GameZone - Your Ultimate Gaming Store",
  description: "Buy digital games, gaming consoles, and join exciting tournaments at GameZone. Your one-stop shop for all gaming needs.",
  keywords: ["games", "consoles", "tournaments", "gaming", "PS5", "Xbox", "Nintendo", "PC games"],
  authors: [{ name: "GameZone Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "GameZone - Ultimate Gaming Store",
    description: "Buy digital games, gaming consoles, and join exciting tournaments",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GameZone - Ultimate Gaming Store",
    description: "Buy digital games, gaming consoles, and join exciting tournaments",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1 pt-16">
            {children}
          </main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
