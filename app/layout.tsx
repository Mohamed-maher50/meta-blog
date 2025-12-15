import type { Metadata } from "next";
import { Geist_Mono, Work_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/layout/Footer";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import { auth } from "@/auth";
const Wark_sans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meta Blog",
  description:
    "Meta Blog is a platform where you can read and write insightful blogs on various topics. Join our community to share your thoughts and discover new ideas.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <ReactQueryProvider>
      <SessionProvider session={session}>
        <html lang="en" className="scroll-smooth " suppressHydrationWarning>
          <body
            className={`${Wark_sans.variable} ${geistMono.variable} min-h-dvh antialiased`}
          >
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
              <div className="flex flex-col">
                <Navbar />
                <main>{children}</main>
                <Footer />
              </div>
            </ThemeProvider>
            <Toaster richColors expand />
          </body>
        </html>
      </SessionProvider>
    </ReactQueryProvider>
  );
}
