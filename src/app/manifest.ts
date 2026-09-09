import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'QRVerse — Universal Dynamic QR Platform',
    short_name: 'QRVerse',
    description: 'Create, customize, share, and track QR codes for dynamic content, digital profiles, menus, and files.',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#6366f1',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
