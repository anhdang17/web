import { PrismaClient } from '@prisma/client';
import { getProductImage } from './product-images';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({ select: { id: true, name: true } });
  let updated = 0;

  for (const p of products) {
    const image = getProductImage(p.name);
    await prisma.product.update({
      where: { id: p.id },
      data: { image, images: JSON.stringify([image]) },
    });
    updated++;
  }

  console.log(`✅ Đã cập nhật ảnh cho ${updated} sản phẩm.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
