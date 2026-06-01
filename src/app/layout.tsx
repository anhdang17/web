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
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: {
    default: 'UNISEX — Thời trang Unisex',
    template: '%s | UNISEX',
  },
  description: 'Cửa hàng thời trang & phụ kiện unisex — Áo, quần, giày dép, phụ kiện chất lượng cao.',
  keywords: ['thời trang', 'unisex', 'áo', 'quần', 'giày', 'phụ kiện', 'fashion'],
  authors: [{ name: 'UNISEX' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://unisex.vn'),
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: '/',
    siteName: 'UNISEX',
    title: 'UNISEX — Thời trang Unisex',
    description: 'Cửa hàng thời trang & phụ kiện unisex',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UNISEX — Thời trang Unisex',
    description: 'Cửa hàng thời trang & phụ kiện unisex',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
            <main>{children}</main>
            <Footer />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
