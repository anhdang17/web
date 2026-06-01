export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'UNISEX',
  description: 'Cửa hàng thời trang & phụ kiện unisex — Áo, quần, giày dép, phụ kiện',
  url: process.env.NEXT_PUBLIC_BASE_URL || 'https://unisex.vn',
  logo: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://unisex.vn'}/favicon.svg`,
  sameAs: [],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+84-1900-xxxx',
    contactType: 'customer service',
    availableLanguage: 'Vietnamese',
  },
};

export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'UNISEX — Thời trang Unisex',
  url: process.env.NEXT_PUBLIC_BASE_URL || 'https://unisex.vn',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://unisex.vn'}/products?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

export function productJsonLd(product: {
  name: string;
  slug: string;
  description: string;
  image: string;
  price: number;
  salePrice?: number | null;
  avgRating?: number;
  reviewCount?: number;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://unisex.vn';
  const price = product.salePrice ?? product.price;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    url: `${baseUrl}/products/${product.slug}`,
    offers: {
      '@type': 'Offer',
      price: price.toFixed(0),
      priceCurrency: 'VND',
      availability: product.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'UNISEX' },
    },
    ...(product.avgRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.avgRating.toFixed(1),
        reviewCount: product.reviewCount ?? 0,
      },
    }),
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
