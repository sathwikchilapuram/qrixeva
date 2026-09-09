import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/AppContext';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { GlobalSearchModal } from '@/components/ui/GlobalSearchModal';

export const metadata: Metadata = {
  title: 'QRVerse — Universal Dynamic QR Experience Platform',
  description:
    'Create, customize, manage, share, and track QR codes for URLs, PDFs, digital profiles, resumes, menus, ID cards, and multi-link pages.',
  keywords: [
    'QR Code Generator',
    'Dynamic QR Code',
    'Custom QR Code',
    'QR Code for PDF',
    'Digital Profile QR',
    'Resume QR',
    'Restaurant Menu QR',
    'QR Analytics',
  ],
  authors: [{ name: 'QRVerse Team' }],
  openGraph: {
    title: 'QRVerse — Universal Dynamic QR Experience Platform',
    description: 'One QR. Endless possibilities. Create, customize, share and track QR codes for almost anything.',
    url: 'https://qrverse.app',
    siteName: 'QRVerse',
    images: [
      {
        url: 'https://qrverse.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'QRVerse Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QRVerse — Universal Dynamic QR Experience Platform',
    description: 'One QR. Endless possibilities. Create, customize, share and track QR codes for almost anything.',
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen selection:bg-brand-500 selection:text-white transition-colors duration-200">
        <AppProvider>
          {children}
          <ToastContainer />
          <GlobalSearchModal />
        </AppProvider>
      </body>
    </html>
  );
}
