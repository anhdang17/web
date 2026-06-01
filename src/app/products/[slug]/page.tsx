import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductDetailClient from './ProductDetailClient';
import { productJsonLd, breadcrumbJsonLd } from '@/lib/structured-data';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { name: true, description: true, image: true, price: true, salePrice: true },
  });

  if (!product) return { title: 'Không tìm thấy' };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://unisex.vn';
  const price = product.salePrice ?? product.price;

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.image }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: [product.image],
    },
    alternates: { canonical: `${baseUrl}/products/${slug}` },
  };
}

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    select: { slug: true },
    take: 100,
  });
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });

  if (!product) notFound();

  const [reviews, agg] = await Promise.all([
    prisma.review.findMany({
      where: { productId: product.id },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.review.aggregate({
      where: { productId: product.id },
      _avg: { rating: true },
      _count: true,
    }),
  ]);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://unisex.vn';
  const enrichedProduct = {
    ...product,
    avgRating: agg._avg.rating ?? 0,
    reviewCount: agg._count,
  };

  const jsonLd = JSON.stringify([
    productJsonLd(enrichedProduct),
    breadcrumbJsonLd([
      { name: 'Trang chủ', url: baseUrl },
      { name: 'Sản phẩm', url: `${baseUrl}/products` },
      { name: product.name, url: `${baseUrl}/products/${slug}` },
    ]),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <ProductDetailClient product={enrichedProduct} reviews={reviews} />
    </>
  );
}
