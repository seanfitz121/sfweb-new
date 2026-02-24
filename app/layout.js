export const metadata = {
  title: 'SFWeb – Web Design for Local Businesses',
  description: 'Premium websites built specifically for local service businesses in Ireland. Professional web design for plumbers, electricians, trades and service businesses.',
  keywords: 'web design Ireland, web design Limerick, small business web design, local business websites, trades website design',
  authors: [{ name: 'SFWeb' }],
  creator: 'SFWeb',
  metadataBase: new URL('https://sfweb.ie'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'SFWeb – Web Design for Local Businesses',
    description: 'Premium websites built specifically for local service businesses in Ireland.',
    url: 'https://sfweb.ie',
    siteName: 'SFWeb',
    locale: 'en_IE',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'SFWeb – Web Design for Local Businesses',
    description: 'Premium websites built specifically for local service businesses in Ireland.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
