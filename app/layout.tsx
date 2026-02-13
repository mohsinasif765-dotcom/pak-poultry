import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Pak Poultry Business",
  description: "Investment & Growth",
  manifest: "/manifest.json",
  
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Pak Poultry",
  },
  icons: {
    icon: "/logo.png", // Public folder ka path
    // Agar Apple devices k liye alag icon rakhna ho
    apple: "/logo.png", 
  },
};

export const viewport = {
  themeColor: "#022c22",
  width: "device-width",
  initialScale: 1,
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
