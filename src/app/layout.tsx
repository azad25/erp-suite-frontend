import { Outfit } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";

import { ClientProviders } from "./ClientProviders";

export const metadata: Metadata = {
  title: {
    template: '%s | Unibase ERP',
    default: 'Unibase ERP - Business Solution',
  },
  description: 'Comprehensive ERP solution for modern businesses - Manage sales, inventory, finance, HR, and more.',
  keywords: ['ERP', 'Enterprise Resource Planning', 'Business Management', 'Unibase'],
};

const outfit = Outfit({
  subsets: ["latin"],
  display: 'swap', // Optimize font loading
  preload: true,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical resources */}
        <link rel="preload" href="/api/config" as="fetch" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="//fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
