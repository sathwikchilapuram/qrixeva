import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Qrixeva — Create. Customize. Connect.',
    short_name: 'Qrixeva',
    description: 'Create, customize, share, and track QR codes for dynamic content, digital profiles, menus, and files.',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#4f46e5',
    icons: [
      {
        src: '/favicon.svg?v=3',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/icon-192.png?v=3',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png?v=3',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
