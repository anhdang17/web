import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { getProductImage } from './product-images';

const prisma = new PrismaClient();

const products = [
  { name: 'Áo thun cotton basic trắng', category: 'AO', subcategory: 'Áo thun', gender: 'UNISEX', price: 199000, featured: true },
  { name: 'Áo thun oversize đen', category: 'AO', subcategory: 'Áo thun', gender: 'UNISEX', price: 249000, featured: true },
  { name: 'Áo polo nam navy', category: 'AO', subcategory: 'Áo polo', gender: 'NAM', price: 349000 },
  { name: 'Áo sơ mi oxford trắng', category: 'AO', subcategory: 'Áo sơ mi', gender: 'UNISEX', price: 399000, featured: true },
  { name: 'Áo sơ mi kẻ caro', category: 'AO', subcategory: 'Áo sơ mi', gender: 'UNISEX', price: 429000 },
  { name: 'Áo len cổ lọ be', category: 'AO', subcategory: 'Áo len', gender: 'NU', price: 459000 },
  { name: 'Áo hoodie unisex xám', category: 'AO', subcategory: 'Hoodie', gender: 'UNISEX', price: 549000, featured: true },
  { name: 'Áo hoodie zip đen', category: 'AO', subcategory: 'Hoodie', gender: 'UNISEX', price: 599000 },
  { name: 'Áo tank top thể thao', category: 'AO', subcategory: 'Áo tank', gender: 'UNISEX', price: 149000 },
  { name: 'Áo graphic tee anime', category: 'AO', subcategory: 'Áo graphic', gender: 'UNISEX', price: 279000, salePrice: 229000, featured: true },
  { name: 'Quần jean slim fit xanh', category: 'QUAN', subcategory: 'Quần jean', gender: 'UNISEX', price: 499000, featured: true },
  { name: 'Quần jean baggy đen', category: 'QUAN', subcategory: 'Quần jean', gender: 'UNISEX', price: 529000 },
  { name: 'Quần kaki nam be', category: 'QUAN', subcategory: 'Quần kaki', gender: 'NAM', price: 449000 },
  { name: 'Quần jogger unisex đen', category: 'QUAN', subcategory: 'Quần jogger', gender: 'UNISEX', price: 379000, featured: true },
  { name: 'Quần short thể thao', category: 'QUAN', subcategory: 'Quần short', gender: 'UNISEX', price: 249000 },
  { name: 'Quần short jean', category: 'QUAN', subcategory: 'Quần short', gender: 'UNISEX', price: 299000 },
  { name: 'Quần legging nữ đen', category: 'QUAN', subcategory: 'Legging', gender: 'NU', price: 199000 },
  { name: 'Quần âu công sở', category: 'QUAN', subcategory: 'Quần âu', gender: 'NAM', price: 549000 },
  { name: 'Quần cargo unisex', category: 'QUAN', subcategory: 'Quần cargo', gender: 'UNISEX', price: 479000 },
  { name: 'Quần linen rộng', category: 'QUAN', subcategory: 'Quần linen', gender: 'UNISEX', price: 419000 },
  { name: 'Váy midi chấm bi', category: 'VAY', subcategory: 'Váy midi', gender: 'NU', price: 399000, featured: true },
  { name: 'Váy maxi hoa nhí', category: 'VAY', subcategory: 'Váy maxi', gender: 'NU', price: 459000 },
  { name: 'Váy shirt dress trắng', category: 'VAY', subcategory: 'Shirt dress', gender: 'NU', price: 429000 },
  { name: 'Váy bodycon đen', category: 'VAY', subcategory: 'Bodycon', gender: 'NU', price: 349000 },
  { name: 'Váy tennis xanh', category: 'VAY', subcategory: 'Váy tennis', gender: 'NU', price: 299000 },
  { name: 'Áo khoác denim', category: 'AO_KHOAC', subcategory: 'Denim jacket', gender: 'UNISEX', price: 649000, featured: true },
  { name: 'Áo khoác bomber', category: 'AO_KHOAC', subcategory: 'Bomber', gender: 'UNISEX', price: 699000 },
  { name: 'Áo khoác gió chống nước', category: 'AO_KHOAC', subcategory: 'Windbreaker', gender: 'UNISEX', price: 549000 },
  { name: 'Áo blazer công sở', category: 'AO_KHOAC', subcategory: 'Blazer', gender: 'UNISEX', price: 799000 },
  { name: 'Áo cardigan len', category: 'AO_KHOAC', subcategory: 'Cardigan', gender: 'NU', price: 449000 },
  { name: 'Giày sneaker trắng', category: 'GIAY', subcategory: 'Sneaker', gender: 'UNISEX', price: 899000, featured: true },
  { name: 'Giày sneaker đen', category: 'GIAY', subcategory: 'Sneaker', gender: 'UNISEX', price: 849000 },
  { name: 'Giày sandal unisex', category: 'GIAY', subcategory: 'Sandal', gender: 'UNISEX', price: 349000 },
  { name: 'Dép slide basic', category: 'GIAY', subcategory: 'Dép', gender: 'UNISEX', price: 149000 },
  { name: 'Boots cổ thấp', category: 'GIAY', subcategory: 'Boots', gender: 'UNISEX', price: 999000 },
  { name: 'Túi tote canvas', category: 'PHU_KIEN', subcategory: 'Túi', gender: 'UNISEX', price: 199000, featured: true },
  { name: 'Túi đeo chéo mini', category: 'PHU_KIEN', subcategory: 'Túi', gender: 'UNISEX', price: 349000 },
  { name: 'Ba lô thời trang', category: 'PHU_KIEN', subcategory: 'Ba lô', gender: 'UNISEX', price: 449000 },
  { name: 'Mũ bucket unisex', category: 'PHU_KIEN', subcategory: 'Mũ', gender: 'UNISEX', price: 179000 },
  { name: 'Mũ lưỡi trai', category: 'PHU_KIEN', subcategory: 'Mũ', gender: 'UNISEX', price: 149000 },
  { name: 'Khăn choàng len', category: 'PHU_KIEN', subcategory: 'Khăn', gender: 'UNISEX', price: 249000 },
  { name: 'Thắt lưng da', category: 'PHU_KIEN', subcategory: 'Thắt lưng', gender: 'UNISEX', price: 299000 },
  { name: 'Ví da mini', category: 'PHU_KIEN', subcategory: 'Ví', gender: 'UNISEX', price: 199000 },
  { name: 'Kính mát retro', category: 'PHU_KIEN', subcategory: 'Kính', gender: 'UNISEX', price: 349000 },
  { name: 'Đồng hồ minimal', category: 'PHU_KIEN', subcategory: 'Đồng hồ', gender: 'UNISEX', price: 599000 },
  { name: 'Vòng cổ bạc', category: 'PHU_KIEN', subcategory: 'Trang sức', gender: 'UNISEX', price: 399000 },
  { name: 'Bông tai hoop', category: 'PHU_KIEN', subcategory: 'Trang sức', gender: 'NU', price: 149000 },
  { name: 'Tất cổ cao 3 đôi', category: 'PHU_KIEN', subcategory: 'Tất', gender: 'UNISEX', price: 89000 },
  { name: 'Áo thun UT Peanuts', category: 'AO', subcategory: 'Áo graphic', gender: 'UNISEX', price: 299000, featured: true },
  { name: 'Áo thun UT Marvel', category: 'AO', subcategory: 'Áo graphic', gender: 'UNISEX', price: 299000, featured: true },
  { name: 'Áo thun UT Disney', category: 'AO', subcategory: 'Áo graphic', gender: 'UNISEX', price: 299000 },
  { name: 'Set đồ thể thao', category: 'AO', subcategory: 'Set', gender: 'UNISEX', price: 699000, salePrice: 599000 },
  { name: 'Áo len merino', category: 'AO', subcategory: 'Áo len', gender: 'UNISEX', price: 599000 },
];

function slugify(name: string, index: number) {
  return (
    name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + `-${index}`
  );
}

async function main() {
  const existing = await prisma.product.count();
  if (existing > 0) {
    console.log(`⏭️  Database already has ${existing} products — skip seed.`);
    console.log('   Chạy: npm run db:fix-images để cập nhật ảnh.');
    return;
  }

  console.log('🌱 Seeding database...');

  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  await prisma.user.create({
    data: {
      email: 'admin@unisex.vn',
      name: 'Quản trị viên',
      password: adminPassword,
      role: 'ADMIN',
      address: '123 Nguyễn Huệ',
      city: 'TP.HCM',
      district: 'Quận 1',
    },
  });

  await prisma.user.create({
    data: {
      email: 'user@gmail.com',
      phone: '0901234567',
      name: 'Nguyễn Văn A',
      password: userPassword,
      role: 'USER',
      address: '456 Lê Lợi',
      city: 'TP.HCM',
      district: 'Quận 3',
    },
  });

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const image = getProductImage(p.name);
    await prisma.product.create({
      data: {
        name: p.name,
        slug: slugify(p.name, i),
        description: `${p.name} - Thiết kế tối giản, chất liệu cao cấp, phù hợp phong cách unisex hiện đại. Sản phẩm thuộc danh mục ${p.subcategory || p.category}.`,
        price: p.price,
        salePrice: p.salePrice ?? null,
        category: p.category,
        subcategory: p.subcategory ?? null,
        gender: p.gender,
        image,
        images: JSON.stringify([image]),
        stock: Math.floor(Math.random() * 80) + 20,
        featured: p.featured ?? false,
      },
    });
  }

  console.log(`✅ Created ${products.length} products, admin & demo user`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
