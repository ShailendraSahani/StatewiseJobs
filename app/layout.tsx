import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SessionProviderWrapper from '../components/SessionProviderWrapper';
import ServiceWorkerRegister from '../components/ServiceWorkerRegister';
import Footer from '@/components/Footer';
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "statewisejobs",
  description: "Shailendra sahani",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GovtJobs",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
     <head>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProviderWrapper>
          {children}
        </SessionProviderWrapper>
        <Footer />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
