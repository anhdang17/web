import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://unisex.vn';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/account/', '/orders/', '/checkout/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
