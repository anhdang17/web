# UNISEX Fashion Store

Website thương mại điện tử bán thời trang & phụ kiện unisex — Full-stack (Frontend + Backend + Database).

Giao diện lấy cảm hứng từ **Uniqlo UT**: tối giản, trắng-đen-đỏ, carousel sản phẩm ngang.

## Công nghệ

| Thành phần | Công nghệ |
|------------|-----------|
| Frontend | Next.js 14, React, Tailwind CSS |
| Backend | Next.js API Routes (REST) |
| Database | **SQLite** (Mac local) + **PostgreSQL Neon** (Vercel) — Prisma ORM |

## Database — Mac + Vercel

Project tự chọn database theo môi trường:

| Môi trường | Database | Cách hoạt động |
|------------|----------|----------------|
| **MacBook (local)** | SQLite `prisma/dev.db` | Nhanh, offline, không cần cài PostgreSQL |
| **Vercel (production)** | PostgreSQL (Neon) | Lưu trữ ổn định trên serverless |

Script `scripts/prepare-db.mjs` tự tạo `schema.prisma` phù hợp trước mỗi lệnh Prisma.

## Chức năng

### Khách hàng (USER)
- Đăng ký / đăng nhập / đăng xuất (email Gmail hoặc số điện thoại)
- Tìm kiếm & lọc sản phẩm (danh mục, giới tính, giá, sắp xếp)
- Nút danh mục: Áo, Quần, Váy, Áo khoác, Giày, Phụ kiện
- Giỏ hàng, thanh toán, nhập địa chỉ giao hàng
- Đánh giá sản phẩm (1–5 sao)
- Xem lịch sử đơn hàng, cập nhật tài khoản

### Quản trị (ADMIN)
- Thêm / xóa sản phẩm
- Quản lý trạng thái đơn hàng
- Xem danh sách khách hàng đăng ký

## Cài đặt trên MacBook Air M2

### Yêu cầu
- Node.js 18+ ([nodejs.org](https://nodejs.org))

### Các bước x 

```bash
cd "/Users/mac/Desktop/github push/web"
npm install
npm run db:setup    # SQLite + 53 sản phẩm
npm run dev
```

Mở: **http://localhost:3000**

File `.env` mặc định (đã cấu hình sẵn):

```env
DATABASE_PROVIDER=sqlite
DATABASE_URL="file:./dev.db"
```

## Tài khoản demo

| Vai trò | Đăng nhập | Mật khẩu |
|---------|-----------|----------|
| Khách hàng | `user@gmail.com` hoặc `0901234567` | `user123` |
| Admin | `admin@unisex.vn` | `admin123` |

## Deploy lên Vercel

### Bước 1 — Tạo Neon Postgres

1. [vercel.com](https://vercel.com) → Project **web** → **Storage** → **Create Database** → **Neon**
2. **Connect** database vào project

### Bước 2 — Biến môi trường (Settings → Environment Variables)

| Biến | Giá trị |
|------|---------|
| `DATABASE_PROVIDER` | `postgresql` |
| `DATABASE_URL` | Copy `POSTGRES_PRISMA_URL` từ Neon (hoặc connection string Neon) |
| `JWT_SECRET` | Chuỗi bí mật (vd: `my-jwt-secret-2024`) |
| `NEXT_PUBLIC_APP_URL` | URL production (vd: `https://web-xxx.vercel.app`) |

Chọn **Production**, **Preview**, **Development** → Save.

### Bước 3 — Deploy

```bash
git push origin main
# hoặc
npx vercel --prod
```

Build trên Vercel tự chạy `scripts/vercel-build.mjs`: tạo schema PostgreSQL → `db push` → seed (nếu DB trống) → build Next.js.

### Reset database local (Mac)

```bash
rm -f prisma/dev.db prisma/dev.db-journal
npm run db:setup
```

## Cấu trúc thư mục

```
web/
├── prisma/
│   ├── models.prisma      # Models dùng chung (SQLite + Postgres)
│   ├── schema.prisma      # Tự sinh bởi prepare-db.mjs
│   ├── seed.ts
│   └── dev.db             # SQLite — chỉ local Mac
├── scripts/
│   ├── prepare-db.mjs     # Chọn sqlite | postgresql
│   └── vercel-build.mjs   # Build script cho Vercel
└── src/lib/
    ├── prisma.ts
    └── db-config.ts
```

## API chính

- `POST /api/auth/register` — Đăng ký
- `POST /api/auth/login` — Đăng nhập
- `GET /api/products?q=&category=` — Danh sách + lọc
- `POST /api/cart` — Giỏ hàng
- `POST /api/orders` — Đặt hàng
- `POST /api/reviews` — Đánh giá

## Ghi chú

- Ảnh sản phẩm: [Pexels](https://pexels.com) (cần internet khi xem ảnh).
- Cập nhật ảnh DB: `npm run db:fix-images`
- Dữ liệu Mac (SQLite) và Vercel (Postgres) **tách biệt** — đăng ký trên web live không hiện trên local và ngược lại.
- Seed chỉ chạy khi database **chưa có sản phẩm** (an toàn khi redeploy Vercel).
