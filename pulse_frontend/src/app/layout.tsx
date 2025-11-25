import './globals.css';
import type { Metadata } from 'next';
import { ClientLayout } from '@/components/layout/ClientLayout';
import { arvo, lato } from '@/lib/fonts';

export const metadata: Metadata = {
  title: 'Pulse - AI-Powered Event Marketplace',
  description: 'Discover and book amazing events with AI-powered recommendations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${arvo.variable} ${lato.variable} font-sans antialiased`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
