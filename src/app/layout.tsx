import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Theme } from "@radix-ui/themes";
import { Navigation } from "@/components/navigation";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduCapture - Enhance Your Learning",
  description: "AI-powered note enhancement and learning tools for students and educators",
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
        <AuthProvider>
          <Theme
            accentColor="blue"
            grayColor="slate"
            radius="large"
            scaling="100%"
          >
            <Navigation />
            {children}
          </Theme>
        </AuthProvider>
      </body>
    </html>
  );
}
