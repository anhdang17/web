import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Providers } from '@/components/providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { organizationJsonLd, websiteJsonLd } from '@/lib/structured-data';

const fontSans = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: 'UNISEX — Thời trang Unisex',
    template: '%s | UNISEX',
  },
  description: 'Cửa hàng thời trang & phụ kiện unisex — Áo, quần, giày dép, phụ kiện chất lượng cao, giá minh bạch.',
  keywords: ['thời trang', 'unisex', 'áo', 'quần', 'giày', 'phụ kiện', 'fashion'],
  authors: [{ name: 'UNISEX' }],
  creator: 'UNISEX',
  publisher: 'UNISEX',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://unisex.vn'),
  alternates: {
    canonical: '/',
    languages: { 'vi-VN': '/vi' },
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: '/',
    siteName: 'UNISEX',
    title: 'UNISEX — Thời trang Unisex',
    description: 'Cửa hàng thời trang & phụ kiện unisex — Áo, quần, giày dép, phụ kiện',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UNISEX — Thời trang Unisex',
    description: 'Cửa hàng thời trang & phụ kiện unisex',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://unisex.vn';

  return (
    <html lang="vi" className={fontSans.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationJsonLd, websiteJsonLd]),
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <Providers>
          <AuthProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
