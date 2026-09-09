import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/AppContext';
import { AuthProvider } from '@/lib/AuthContext';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { GlobalSearchModal } from '@/components/ui/GlobalSearchModal';

export const metadata: Metadata = {
  metadataBase: new URL('https://qrixeva.vercel.app'),
  title: 'Qrixeva — Create. Customize. Connect.',
  description:
    'Create, customize, manage, and share powerful dynamic QR experiences for links, files, profiles, resumes, digital IDs, businesses, events, and more.',
  keywords: [
    'QR Code Generator',
    'Dynamic QR Code',
    'Custom QR Code',
    'Qrixeva',
    'QR Code for PDF',
    'Digital Profile QR',
    'Resume QR',
    'Restaurant Menu QR',
    'QR Analytics',
  ],
  authors: [{ name: 'Qrixeva Team' }],
  openGraph: {
    title: 'Qrixeva — Create. Customize. Connect.',
    description: 'Create, customize, manage, and share powerful dynamic QR experiences for links, files, profiles, resumes, digital IDs, businesses, events, and more.',
    url: 'https://qrixeva.vercel.app',
    siteName: 'Qrixeva',
    images: [
      {
        url: 'https://qrixeva.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Qrixeva Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Qrixeva — Create. Customize. Connect.',
    description: 'Create, customize, manage, and share powerful dynamic QR experiences for links, files, profiles, resumes, digital IDs, businesses, events, and more.',
  },
  icons: {
    icon: [
      { url: '/favicon.ico?v=3', sizes: '32x32' },
      { url: '/favicon-16x16.png?v=3', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png?v=3', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.svg?v=3', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico?v=3',
    apple: '/apple-touch-icon.png?v=3',
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
        <link rel="icon" href="/favicon.ico?v=3" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png?v=3" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png?v=3" sizes="32x32" type="image/png" />
        <link rel="icon" href="/favicon.svg?v=3" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=3" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen selection:bg-brand-500 selection:text-white transition-colors duration-200">
        <AuthProvider>
          <AppProvider>
            {children}
            <ToastContainer />
            <GlobalSearchModal />
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
