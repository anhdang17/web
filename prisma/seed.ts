import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const products = [
  { name: 'Áo thun cotton basic trắng', category: 'AO', subcategory: 'Áo thun', gender: 'UNISEX', price: 199000, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop', featured: true },
  { name: 'Áo thun oversize đen', category: 'AO', subcategory: 'Áo thun', gender: 'UNISEX', price: 249000, image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=600&fit=crop', featured: true },
  { name: 'Áo polo nam navy', category: 'AO', subcategory: 'Áo polo', gender: 'NAM', price: 349000, image: 'https://images.unsplash.com/photo-1625910514319-1c8d6b803f03?w=600&h=600&fit=crop' },
  { name: 'Áo sơ mi oxford trắng', category: 'AO', subcategory: 'Áo sơ mi', gender: 'UNISEX', price: 399000, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2f?w=600&h=600&fit=crop', featured: true },
  { name: 'Áo sơ mi kẻ caro', category: 'AO', subcategory: 'Áo sơ mi', gender: 'UNISEX', price: 429000, image: 'https://images.unsplash.com/photo-1598033129183-a4a50ad7c8e3?w=600&h=600&fit=crop' },
  { name: 'Áo len cổ lọ be', category: 'AO', subcategory: 'Áo len', gender: 'NU', price: 459000, image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=600&fit=crop' },
  { name: 'Áo hoodie unisex xám', category: 'AO', subcategory: 'Hoodie', gender: 'UNISEX', price: 549000, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop', featured: true },
  { name: 'Áo hoodie zip đen', category: 'AO', subcategory: 'Hoodie', gender: 'UNISEX', price: 599000, image: 'https://images.unsplash.com/photo-1578587018452-b892d37f9d8a?w=600&h=600&fit=crop' },
  { name: 'Áo tank top thể thao', category: 'AO', subcategory: 'Áo tank', gender: 'UNISEX', price: 149000, image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&h=600&fit=crop' },
  { name: 'Áo graphic tee anime', category: 'AO', subcategory: 'Áo graphic', gender: 'UNISEX', price: 279000, salePrice: 229000, image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=600&fit=crop', featured: true },
  { name: 'Quần jean slim fit xanh', category: 'QUAN', subcategory: 'Quần jean', gender: 'UNISEX', price: 499000, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop', featured: true },
  { name: 'Quần jean baggy đen', category: 'QUAN', subcategory: 'Quần jean', gender: 'UNISEX', price: 529000, image: 'https://images.unsplash.com/photo-1541099646385-15a4c0c0c0c0?w=600&h=600&fit=crop' },
  { name: 'Quần kaki nam be', category: 'QUAN', subcategory: 'Quần kaki', gender: 'NAM', price: 449000, image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a0a?w=600&h=600&fit=crop' },
  { name: 'Quần jogger unisex đen', category: 'QUAN', subcategory: 'Quần jogger', gender: 'UNISEX', price: 379000, image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&h=600&fit=crop', featured: true },
  { name: 'Quần short thể thao', category: 'QUAN', subcategory: 'Quần short', gender: 'UNISEX', price: 249000, image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&h=600&fit=crop' },
  { name: 'Quần short jean', category: 'QUAN', subcategory: 'Quần short', gender: 'UNISEX', price: 299000, image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=600&fit=crop' },
  { name: 'Quần legging nữ đen', category: 'QUAN', subcategory: 'Legging', gender: 'NU', price: 199000, image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&h=600&fit=crop' },
  { name: 'Quần âu công sở', category: 'QUAN', subcategory: 'Quần âu', gender: 'NAM', price: 549000, image: 'https://images.unsplash.com/photo-1594938373683-0c7cf0d0c0c0?w=600&h=600&fit=crop' },
  { name: 'Quần cargo unisex', category: 'QUAN', subcategory: 'Quần cargo', gender: 'UNISEX', price: 479000, image: 'https://images.unsplash.com/photo-1624378439578-d8545c0c0c0c?w=600&h=600&fit=crop' },
  { name: 'Quần linen rộng', category: 'QUAN', subcategory: 'Quần linen', gender: 'UNISEX', price: 419000, image: 'https://images.unsplash.com/photo-1594938373683-0c7cf0d0c0c0?w=600&h=600&fit=crop' },
  { name: 'Váy midi chấm bi', category: 'VAY', subcategory: 'Váy midi', gender: 'NU', price: 399000, image: 'https://images.unsplash.com/photo-1595777453555-0c7cf0d0c0c0?w=600&h=600&fit=crop', featured: true },
  { name: 'Váy maxi hoa nhí', category: 'VAY', subcategory: 'Váy maxi', gender: 'NU', price: 459000, image: 'https://images.unsplash.com/photo-1572804013304-6160b0c0c0c0?w=600&h=600&fit=crop' },
  { name: 'Váy shirt dress trắng', category: 'VAY', subcategory: 'Shirt dress', gender: 'NU', price: 429000, image: 'https://images.unsplash.com/photo-1515372039744-b8f020301a04?w=600&h=600&fit=crop' },
  { name: 'Váy bodycon đen', category: 'VAY', subcategory: 'Bodycon', gender: 'NU', price: 349000, image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&h=600&fit=crop' },
  { name: 'Váy tennis xanh', category: 'VAY', subcategory: 'Váy tennis', gender: 'NU', price: 299000, image: 'https://images.unsplash.com/photo-1583496668160-0c7cf0d0c0c0?w=600&h=600&fit=crop' },
  { name: 'Áo khoác denim', category: 'AO_KHOAC', subcategory: 'Denim jacket', gender: 'UNISEX', price: 649000, image: 'https://images.unsplash.com/photo-1576995853173-0c7cf0d0c0c0?w=600&h=600&fit=crop', featured: true },
  { name: 'Áo khoác bomber', category: 'AO_KHOAC', subcategory: 'Bomber', gender: 'UNISEX', price: 699000, image: 'https://images.unsplash.com/photo-1551028711-0c7cf0d0c0c0?w=600&h=600&fit=crop' },
  { name: 'Áo khoác gió chống nước', category: 'AO_KHOAC', subcategory: 'Windbreaker', gender: 'UNISEX', price: 549000, image: 'https://images.unsplash.com/photo-1591047139829-d3aabc0c0c0c?w=600&h=600&fit=crop' },
  { name: 'Áo blazer công sở', category: 'AO_KHOAC', subcategory: 'Blazer', gender: 'UNISEX', price: 799000, image: 'https://images.unsplash.com/photo-1594938373683-0c7cf0d0c0c0?w=600&h=600&fit=crop' },
  { name: 'Áo cardigan len', category: 'AO_KHOAC', subcategory: 'Cardigan', gender: 'NU', price: 449000, image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=600&fit=crop' },
  { name: 'Giày sneaker trắng', category: 'GIAY', subcategory: 'Sneaker', gender: 'UNISEX', price: 899000, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop', featured: true },
  { name: 'Giày sneaker đen', category: 'GIAY', subcategory: 'Sneaker', gender: 'UNISEX', price: 849000, image: 'https://images.unsplash.com/photo-1606107557195-0c7cf0d0c0c0?w=600&h=600&fit=crop' },
  { name: 'Giày sandal unisex', category: 'GIAY', subcategory: 'Sandal', gender: 'UNISEX', price: 349000, image: 'https://images.unsplash.com/photo-1603487742131-0c7cf0d0c0c0?w=600&h=600&fit=crop' },
  { name: 'Dép slide basic', category: 'GIAY', subcategory: 'Dép', gender: 'UNISEX', price: 149000, image: 'https://images.unsplash.com/photo-1603487742131-0c7cf0d0c0c0?w=600&h=600&fit=crop' },
  { name: 'Boots cổ thấp', category: 'GIAY', subcategory: 'Boots', gender: 'UNISEX', price: 999000, image: 'https://images.unsplash.com/photo-1608256246200-0c7cf0d0c0c0?w=600&h=600&fit=crop' },
  { name: 'Túi tote canvas', category: 'PHU_KIEN', subcategory: 'Túi', gender: 'UNISEX', price: 199000, image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=600&fit=crop', featured: true },
  { name: 'Túi đeo chéo mini', category: 'PHU_KIEN', subcategory: 'Túi', gender: 'UNISEX', price: 349000, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128a5?w=600&h=600&fit=crop' },
  { name: 'Ba lô thời trang', category: 'PHU_KIEN', subcategory: 'Ba lô', gender: 'UNISEX', price: 449000, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop' },
  { name: 'Mũ bucket unisex', category: 'PHU_KIEN', subcategory: 'Mũ', gender: 'UNISEX', price: 179000, image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&h=600&fit=crop' },
  { name: 'Mũ lưỡi trai', category: 'PHU_KIEN', subcategory: 'Mũ', gender: 'UNISEX', price: 149000, image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&h=600&fit=crop' },
  { name: 'Khăn choàng len', category: 'PHU_KIEN', subcategory: 'Khăn', gender: 'UNISEX', price: 249000, image: 'https://images.unsplash.com/photo-1520903920505-0c7cf0d0c0c0?w=600&h=600&fit=crop' },
  { name: 'Thắt lưng da', category: 'PHU_KIEN', subcategory: 'Thắt lưng', gender: 'UNISEX', price: 299000, image: 'https://images.unsplash.com/photo-1624222247344-0c7cf0d0c0c0?w=600&h=600&fit=crop' },
  { name: 'Ví da mini', category: 'PHU_KIEN', subcategory: 'Ví', gender: 'UNISEX', price: 199000, image: 'https://images.unsplash.com/photo-1627123424574-0c7cf0d0c0c0?w=600&h=600&fit=crop' },
  { name: 'Kính mát retro', category: 'PHU_KIEN', subcategory: 'Kính', gender: 'UNISEX', price: 349000, image: 'https://images.unsplash.com/photo-1572635196237-0c7cf0d0c0c0?w=600&h=600&fit=crop' },
  { name: 'Đồng hồ minimal', category: 'PHU_KIEN', subcategory: 'Đồng hồ', gender: 'UNISEX', price: 599000, image: 'https://images.unsplash.com/photo-1523275335684-0c7cf0d0c0c0?w=600&h=600&fit=crop' },
  { name: 'Vòng cổ bạc', category: 'PHU_KIEN', subcategory: 'Trang sức', gender: 'UNISEX', price: 399000, image: 'https://images.unsplash.com/photo-1611591437281-0c7cf0d0c0c0?w=600&h=600&fit=crop' },
  { name: 'Bông tai hoop', category: 'PHU_KIEN', subcategory: 'Trang sức', gender: 'NU', price: 149000, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop' },
  { name: 'Tất cổ cao 3 đôi', category: 'PHU_KIEN', subcategory: 'Tất', gender: 'UNISEX', price: 89000, image: 'https://images.unsplash.com/photo-1586350977774-b3b0c0c0c0c0?w=600&h=600&fit=crop' },
  { name: 'Áo thun UT Peanuts', category: 'AO', subcategory: 'Áo graphic', gender: 'UNISEX', price: 299000, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop', featured: true },
  { name: 'Áo thun UT Marvel', category: 'AO', subcategory: 'Áo graphic', gender: 'UNISEX', price: 299000, image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=600&fit=crop', featured: true },
  { name: 'Áo thun UT Disney', category: 'AO', subcategory: 'Áo graphic', gender: 'UNISEX', price: 299000, image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=600&fit=crop' },
  { name: 'Set đồ thể thao', category: 'AO', subcategory: 'Set', gender: 'UNISEX', price: 699000, salePrice: 599000, image: 'https://images.unsplash.com/photo-1515886657613-9f3525b0c0c0?w=600&h=600&fit=crop' },
  { name: 'Áo len merino', category: 'AO', subcategory: 'Áo len', gender: 'UNISEX', price: 599000, image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=600&fit=crop' },
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
        image: p.image,
        images: JSON.stringify([p.image]),
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
